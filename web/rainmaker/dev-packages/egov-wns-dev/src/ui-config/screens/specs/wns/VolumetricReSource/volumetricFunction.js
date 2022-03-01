import { handleScreenConfigurationFieldChange as handleField, toggleSnackbar, showSpinner, hideSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getUserInfo, getTenantIdCommon } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { fetchBill, findAndReplace, getSearchResults, getSearchResultsForSewerage, getWorkFlowData, serviceConst } from "../../../../../ui-utils/commons";
import { validateFields } from "../../utils";
import { convertDateToEpoch, convertEpochToDate, resetFieldsForApplication, resetFieldsForConnection, getTextToLocalMapping } from "../../utils/index";
import { httpRequest } from "../../../../../ui-utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import store from "ui-redux/store";
import { getVolumetricSearchResults } from "../../../../../ui-utils/commons";

export const searchApiCallVolumetric = async (state, dispatch) => {
    // console.log("searchApiCallVolumetric")
    // debugger
    store.dispatch(showSpinner())
    showHidevolumetricConnectionTable(false, dispatch);
    // await renderSearchConnectionTable(state, dispatch)
    await searchResultsVolu(state,dispatch);
    store.dispatch(hideSpinner())
}

const searchResultsVolu = async (state, dispatch) => {
  store.dispatch(showSpinner())
    // console.log("searchApiCallVolumetricsearchApiCallVolumetric")
    // debugger
    // let connectionno = get(state.screenConfiguration,"components.div.children.volumetricSearch.children.cardContent.children.wnsvolumetricCharge.children.consumerid.props.value");
    
    // console.log(connectionno,"connectionno")
    let data = store.getState()
    // console.log(data.screenConfiguration.preparedFinalObject.volumetric,"ssssssssssssssssssssssssssssssssssssss")
    let volData = data.screenConfiguration.preparedFinalObject.volumetric
    let connectionno = volData.connectionNumber
    let tenantId = volData.tenantId
    let queryObject = [
        { key: "tenantId", value: tenantId },
        { key: "connectionNumber", value: connectionno },
        { key: "searchType",value:"CONNECTION"}
      ];
      let payloadData = await getVolumetricSearchResults(
        queryObject,
        false
      );  
  
  if (payloadData !== null && payloadData !== undefined &&payloadData.WaterConnection.length > 0) {
    store.dispatch(prepareFinalObject("VolumetricData", payloadData.WaterConnection))
    let waterMeteredDemandExipryDate = 0;
    let waterNonMeteredDemandExipryDate = 0;
    let sewerageNonMeteredDemandExpiryDate = 0;
    let payloadbillingPeriod="";
    let finalArray = [];
    try {
      // Get the MDMS data for billingPeriod
      let mdmsBody = {
        MdmsCriteria: {
          tenantId: getTenantIdCommon(),
          moduleDetails: [
            { moduleName: "ws-services-masters", masterDetails: [{ name: "billingPeriod" }]},
            { moduleName: "sw-services-calculation", masterDetails: [{ name: "billingPeriod" }]}
          ]
        }
      }
      //Read metered & non-metered demand expiry date and assign value.
      payloadbillingPeriod = await httpRequest("post", "/egov-mdms-service/v1/_search", "_search", [], mdmsBody);        
      // console.log(payloadbillingPeriod);
    } catch (err) { console.log(err) }


    let element = payloadData.WaterConnection[0];
    // console.log(element,"element")
    if (element.connectionNo !== "NA" && element.connectionNo !== null) {
      let queryObjectForWaterFetchBill;
      if (element.connectionFacility === serviceConst.WATER) {
        queryObjectForWaterFetchBill = [{ key: "tenantId", value: getTenantIdCommon() }, { key: "consumerCode", value: element.connectionNo }, { key: "businessService", value: "WS" }];
      } else {
        queryObjectForWaterFetchBill = [{ key: "tenantId", value: getTenantIdCommon() }, { key: "consumerCode", value: element.connectionNo }, { key: "businessService", value: "SW" }];
      }

      if (element.connectionFacility === serviceConst.WATER && 
          payloadbillingPeriod && 
          payloadbillingPeriod.MdmsRes['ws-services-masters'] && 
          payloadbillingPeriod.MdmsRes['ws-services-masters'].billingPeriod !== undefined && 
          payloadbillingPeriod.MdmsRes['ws-services-masters'].billingPeriod  !== null) {
          payloadbillingPeriod.MdmsRes['ws-services-masters'].billingPeriod.forEach(obj => {
            if(obj.connectionType === 'Metered') {
              waterMeteredDemandExipryDate = obj.demandExpiryDate;
            } else if (obj.connectionType === 'Non Metered') {
              waterNonMeteredDemandExipryDate = obj.demandExpiryDate;
            }
          }); 
      }
      if (element.connectionFacility === serviceConst.SEWERAGE && 
          payloadbillingPeriod && 
          payloadbillingPeriod.MdmsRes['sw-services-calculation'] && 
          payloadbillingPeriod.MdmsRes['sw-services-calculation'].billingPeriod !== undefined && 
          payloadbillingPeriod.MdmsRes['sw-services-calculation'].billingPeriod  !== null) {
          payloadbillingPeriod.MdmsRes['sw-services-calculation'].billingPeriod.forEach(obj => {
          if (obj.connectionType === 'Non Metered') {
            sewerageNonMeteredDemandExpiryDate = obj.demandExpiryDate;
          }
        }); 
      }

      let billResults = await fetchBill(queryObjectForWaterFetchBill, dispatch)
      billResults && billResults.Bill &&Array.isArray(billResults.Bill)&&billResults.Bill.length>0? billResults.Bill.map(bill => {
        let updatedDueDate = 0;
        if(element.connectionFacility === serviceConst.WATER) {
          updatedDueDate = (element.connectionType === 'Metered' ?
          (bill.billDetails[0].toPeriod+waterMeteredDemandExipryDate) :
          (bill.billDetails[0].toPeriod+waterNonMeteredDemandExipryDate));
        } else if (element.connectionFacility === serviceConst.SEWERAGE) {
          updatedDueDate = bill.billDetails[0].toPeriod + sewerageNonMeteredDemandExpiryDate;
        }
        finalArray.push({
          due: bill.totalAmount,
          dueDate: updatedDueDate,
          service: "WATER",
          connectionNo: element.connectionNo,
          name: (element.connectionHolders) ? element.connectionHolders[0].name:'',
          status: element.status,
          address:element.connectionHolders ? element.connectionHolders[0].correspondenceAddress : '',
          // address: handleAddress(element),
          connectionType: element.connectionType,
          tenantId:element.tenantId,
          applicationStatus:element.applicationStatus,
          connectionFacility:element.connectionFacility
        })
      }) : 
      finalArray.push({
        due: 'NA',
        dueDate: 'NA',
        service: "WATER",
        connectionNo: element.connectionNo,
        name: (element.connectionHolders) ? element.connectionHolders[0].name:'',
        status: element.status,
        address:element.connectionHolders ? element.connectionHolders[0].correspondenceAddress : '',
        connectionType: element.connectionType,
        tenantId:element.tenantId,
        applicationStatus:element.applicationStatus,
        connectionFacility:element.connectionFacility
      })
     
    }

    // console.log(finalArray,"finalArray")
    showConnectionResults(finalArray, dispatch)
  } }


  const showConnectionResults = (connections, dispatch) => {
    store.dispatch(hideSpinner())
    // console.log(connections,"connectionsconnections")
    let data = connections.map(item => ({
      ["WS_COMMON_TABLE_COL_SERVICE_LABEL"]: item.service,
      ["WS_COMMON_TABLE_COL_CONSUMER_NO_LABEL"]: item.connectionNo,
      ["WS_COMMON_TABLE_COL_OWN_NAME_LABEL"]: item.name,
      ["WS_COMMON_TABLE_COL_STATUS_LABEL"]: item.status,
      ["WS_COMMON_TABLE_COL_DUE_LABEL"]: item.due,
      ["WS_COMMON_TABLE_COL_ADDRESS"]: item.address,
      ["WS_COMMON_TABLE_COL_DUE_DATE_LABEL"]: (item.dueDate !== undefined && item.dueDate !== "NA") ? convertEpochToDate(item.dueDate) : item.dueDate,
      ["WS_COMMON_TABLE_COL_TENANTID_LABEL"]: item.tenantId,
      ["WS_COMMON_TABLE_COL_CONNECTIONTYPE_LABEL"]: item.connectionType,
      ["WS_COMMON_TABLE_COL_APPLICATION_CURRENT_STATE"]: item.applicationStatus ? getTextToLocalMapping(item.applicationStatus) : 'NA',
      ["WS_COMMON_CONNECTION_FACILITY_LABEL"]: item.connectionFacility ? item.connectionFacility : 'WATER'
      
    }));
    dispatch(handleField("volumetricCharges", "components.div.children.volumetricSearchResult", "props.data", data));
    dispatch(handleField("volumetricCharges", "components.div.children.volumetricSearchResult", "props.rows",
      connections.length
    ));
    showHidevolumetricConnectionTable(true, dispatch);
  }

  const showHidevolumetricConnectionTable = (booleanHideOrShow, dispatch) => {
    dispatch(handleField("volumetricCharges", "components.div.children.volumetricSearchResult", "visible", booleanHideOrShow));
  };