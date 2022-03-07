import { getRequiredDocData } from "egov-billamend/ui-config/screens/specs/utils";

import {
  convertEpochToDate,
  getCommonCard,
  getCommonContainer,
  getCommonHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import set from "lodash/set";
import get from "lodash/get";
import { getBillAmdSearchResult } from "egov-billamend/ui-utils/commons";
import { httpRequest } from "../../../../ui-utils/api";
import {
  getDescriptionFromMDMS,
  getSearchResults,
  getSearchResultsForSewerage,
  serviceConst
} from "../../../../ui-utils/commons";
import { getDemand, ifUserRoleExists, getTranslatedLabel} from "../utils";
import { connectionDetailsDownload } from "./connectionDetailsResource/connectionDetailsDownload";
// import { connectionDetailsFooter } from "./connectionDetailsResource/connectionDetailsFooter";
import {
  connHolderDetailsSameAsOwnerSummary,
  connHolderDetailsSummary,
  getOwnerDetails
} from "./VolumetricReSource/owner-deatils";
import { getPropertyDetails } from "./VolumetricReSource/propertyDetails";
import { getServiceDetails } from "./VolumetricReSource/service-details";
import { getvolumetricDetail } from "./VolumetricReSource/volumetric-details";
const tenantId = getQueryArg(window.location.href, "tenantId");
let connectionNumber = getQueryArg(window.location.href, "connectionNumber");
const service = getQueryArg(window.location.href, "service");
let applicationStatus = '';
const getApplicationNumber = (dispatch, connectionsObj) => {
  let appNos = "";
  if (connectionsObj.length > 1) {
    for (var i = 0; i < connectionsObj.length; i++) {
      appNos += connectionsObj[i].applicationNo + ",";
    }
    appNos = appNos.slice(0, -1);
  } else {
    appNos = connectionsObj[0].applicationNo;
  }
  dispatch(prepareFinalObject("applicationNos", appNos));
};
const showHideConnectionHolder = (dispatch, connectionHolders) => {
  if (connectionHolders != "NA" && connectionHolders.length > 0) {
    dispatch(
      handleField(
        "connection-details",
        "components.div.children.connectionDetails.children.cardContent.children.connectionHolders",
        "visible",
        true
      )
    );
    dispatch(
      handleField(
        "connection-details",
        "components.div.children.connectionDetails.children.cardContent.children.connectionHoldersSameAsOwner",
        "visible",
        false
      )
    );
  } else {
    dispatch(
      handleField(
        "connection-details",
        "components.div.children.connectionDetails.children.cardContent.children.connectionHolders",
        "visible",
        false
      )
    );
    dispatch(
      handleField(
        "connection-details",
        "components.div.children.connectionDetails.children.cardContent.children.connectionHoldersSameAsOwner",
        "visible",
        true
      )
    );
  }
};
export const sortpayloadDataObj = (connectionObj) => {
  return connectionObj.sort((a, b) =>
    a.additionalDetails.appCreatedDate < b.additionalDetails.appCreatedDate
      ? 1
      : -1
  );
};

const getActiveConnectionObj = (connectionsObj) => {
  // let getActiveConnectionObj = "";
  // for (var i = 0; i < connectionsObj.length; i++) {
  //   if (
  //     (connectionsObj[i] &&
  //       connectionsObj[i].applicationStatus === "CONNECTION_ACTIVATED") ||
  //     connectionsObj[i].applicationStatus === "APPROVED" || connectionsObj[i].applicationStatus === "CONNECTION_CLOSED"
  //     || connectionsObj[i].applicationStatus === "CONNECTION_DISCONNECTED" 
  //   ) {
  //     getActiveConnectionObj = connectionsObj[i];
  //     break;
  //   }
  // }
  return connectionsObj[0];
};

const searchResults = async (action, state, dispatch, connectionNumber) => {
  /**
   * This methods holds the api calls and the responses of fetch bill and search connection for both water and sewerage service
   */

  let service = getQueryArg(window.location.href,"service")  
  let tenantId = getQueryArg(window.location.href,"tenantId")  

  let queryObject = [
    { key: "tenantId", value: tenantId },
    { key: "connectionNumber", value: connectionNumber },
    { key: "searchType",value:"CONNECTION"}
  ];
  if (service === serviceConst.SEWERAGE) {
    let payloadData = await getSearchResultsForSewerage(
      queryObject,
      dispatch,
      false
    );

    if (
      payloadData !== null &&
      payloadData !== undefined &&
      payloadData.SewerageConnections.length > 0
    ) {

      payloadData.SewerageConnections = sortpayloadDataObj(
        payloadData.SewerageConnections
      );

      let sewerageConnection = getActiveConnectionObj(
        payloadData.SewerageConnections
      );
      let propTenantId = sewerageConnection.tenantId.split(".")[0];
      sewerageConnection.service = service;

      if (sewerageConnection.property && sewerageConnection.property.propertyType !== undefined) {
        const propertyTpe =
          "[?(@.code  == " +
          JSON.stringify(sewerageConnection.property.propertyType) +
          ")]";
        let propertyTypeParams = {
          MdmsCriteria: {
            tenantId: propTenantId,
            moduleDetails: [
              {
                moduleName: "PropertyTax",
                masterDetails: [
                  { name: "PropertyType", filter: `${propertyTpe}` },
                ],
              },
            ],
          },
        };
        const mdmsPropertyType = await getDescriptionFromMDMS(
          propertyTypeParams,
          dispatch
        );
        if (
          mdmsPropertyType !== undefined &&
          mdmsPropertyType !== null &&
          mdmsPropertyType.MdmsRes.PropertyTax.PropertyType[0].name !==
          undefined &&
          mdmsPropertyType.MdmsRes.PropertyTax.PropertyType[0].name !== null
        ) {
          sewerageConnection.property.propertyTypeData =
            mdmsPropertyType.MdmsRes.PropertyTax.PropertyType[0].name; //propertyType from Mdms
        } else {
          sewerageConnection.property.propertyTypeData = "NA";
        }
      }

      if (sewerageConnection.noOfToilets === undefined) {
        sewerageConnection.noOfToilets = "NA";
      }
      if (sewerageConnection.noOfToilets === 0) {
        sewerageConnection.noOfToilets = "0";
      }
      if (sewerageConnection.pipeSize === 0) {
        sewerageConnection.pipeSize = "0";
      }
      sewerageConnection.connectionExecutionDate = convertEpochToDate(
        sewerageConnection.connectionExecutionDate
      );
      // const lat = sewerageConnection.property.address.locality.latitude
      //   ? sewerageConnection.property.address.locality.latitude
      //   : "NA";
      // const long = sewerageConnection.property.address.locality.longitude
      //   ? sewerageConnection.property.address.locality.longitude
      //   : "NA";
      // sewerageConnection.property.address.locality.locationOnMap = `${lat} ${long}`;

      /*if (sewerageConnection.property.usageCategory !== undefined) {
        const propertyUsageType = "[?(@.code  == " + JSON.stringify(sewerageConnection.property.usageCategory) + ")]"
        let propertyUsageTypeParams = { MdmsCriteria: { tenantId: "od", moduleDetails: [{ moduleName: "PropertyTax", masterDetails: [{ name: "UsageCategoryMajor", filter: `${propertyUsageType}` }] }] } }
        const mdmsPropertyUsageType = await getDescriptionFromMDMS(propertyUsageTypeParams, dispatch)
        if (mdmsPropertyUsageType !== undefined && mdmsPropertyUsageType !== null && mdmsPropertyUsageType.MdmsRes.PropertyTax.PropertyType !== undefined && mdmsPropertyUsageType.MdmsRes.PropertyTax.PropertyType[0].name !== null) {
          sewerageConnection.property.propertyUsageType = mdmsPropertyUsageType.MdmsRes.PropertyTax.UsageCategoryMajor[0].name;//propertyUsageType from Mdms
        } else {
          sewerageConnection.property.propertyTypeData = "NA"
        }
      }*/
      showHideConnectionHolder(dispatch, sewerageConnection.connectionHolders);
      const queryObjForBill = [
        {
          key: "tenantId",
          value: tenantId,
        },
        {
          key: "consumerCode",
          value: connectionNumber,
        },
        {
          key: "businessService",
          value: "SW",
        },
      ];
      const bill = await getDemand(queryObjForBill, dispatch);
      let billAMDSearch = await getBillAmdSearchResult(queryObjForBill, dispatch);
      let amendments=get(billAMDSearch, "Amendments", []);
      amendments=amendments&&Array.isArray(amendments)&&amendments.filter(amendment=>amendment.status==='INWORKFLOW');
      dispatch(prepareFinalObject("BILL_FOR_WNS", bill));
      dispatch(prepareFinalObject("isAmendmentInWorkflow", amendments&&Array.isArray(amendments)&&amendments.length==0?true:false));
      dispatch(prepareFinalObject("WaterConnection[0]", sewerageConnection));
      dispatch(prepareFinalObject("VolumetricData", sewerageConnection))
      if(sewerageConnection && sewerageConnection && sewerageConnection.noOfFlats && parseInt(sewerageConnection.noOfFlats) > 0){
        dispatch(prepareFinalObject("WaterConnection[0].apartment", 'Yes'))
      }else{
        dispatch(prepareFinalObject("WaterConnection[0].apartment", 'No'))
      }
      let localizationLabels = {}
      if (state && state.app) localizationLabels = (state.app && state.app.localizationLabels) || {};
      dispatch(prepareFinalObject("WaterConnection[0].locality",sewerageConnection.additionalDetails.locality))
      getApplicationNumber(dispatch, payloadData.SewerageConnections);
    }
  } else if (service === serviceConst.WATER) {
    let payloadData = await getSearchResults(queryObject, true);
    if (
      payloadData !== null &&
      payloadData !== undefined &&
      payloadData.WaterConnection.length > 0
    ) {
      payloadData.WaterConnection = sortpayloadDataObj(
        payloadData.WaterConnection
      );
      let waterConnection = getActiveConnectionObj(payloadData.WaterConnection);
      waterConnection.service = service;
      let propTenantId = waterConnection.tenantId.split(".")[0];
      if (waterConnection.connectionExecutionDate !== undefined) {
        waterConnection.connectionExecutionDate = convertEpochToDate(
          waterConnection.connectionExecutionDate
        );
      } else {
        waterConnection.connectionExecutionDate = "NA";
      }
      if (waterConnection.noOfTaps === undefined) {
        waterConnection.noOfTaps = "NA";
      }
      if (waterConnection.noOfTaps === 0) {
        waterConnection.noOfTaps = "0";
      }
      // if (waterConnection.pipeSize === 0) {
      //   waterConnection.pipeSize = "0";
      // }
      if (waterConnection.property && waterConnection.property.propertyType !== undefined) {
        const propertyTpe =
          "[?(@.code  == " +
          JSON.stringify(waterConnection.property.propertyType) +
          ")]";
        let propertyTypeParams = {
          MdmsCriteria: {
            tenantId: propTenantId,
            moduleDetails: [
              {
                moduleName: "PropertyTax",
                masterDetails: [
                  { name: "PropertyType", filter: `${propertyTpe}` },
                ],
              },
            ],
          },
        };
        const mdmsPropertyType = await getDescriptionFromMDMS(
          propertyTypeParams,
          dispatch
        );
        waterConnection.property.propertyTypeData =
          mdmsPropertyType.MdmsRes.PropertyTax.PropertyType[0].name !==
            undefined
            ? mdmsPropertyType.MdmsRes.PropertyTax.PropertyType[0].name
            : "NA"; //propertyType from Mdms
      }
  
      const queryObjForBill = [
        {
          key: "tenantId",
          value: tenantId,
        },
        {
          key: "consumerCode",
          value: connectionNumber,
        },
        {
          key: "businessService",
          value: "WS",
        },
      ];
      const bill = await getDemand(queryObjForBill, dispatch);
      let billAMDSearch = await getBillAmdSearchResult(queryObjForBill, dispatch);
      let amendments=get(billAMDSearch, "Amendments", []);
      amendments=amendments&&Array.isArray(amendments)&&amendments.filter(amendment=>amendment.status==='INWORKFLOW');
      dispatch(prepareFinalObject("BILL_FOR_WNS", bill));
      dispatch(prepareFinalObject("isAmendmentInWorkflow", amendments&&Array.isArray(amendments)&&amendments.length==0?true:false));
      showHideConnectionHolder(dispatch, waterConnection.connectionHolders);     
      dispatch(prepareFinalObject("WaterConnection[0]", waterConnection));
      if(waterConnection && waterConnection && waterConnection.noOfFlats && parseInt(waterConnection.noOfFlats) > 0){
        dispatch(prepareFinalObject("WaterConnection[0].apartment", 'Yes'))
      }else{
        dispatch(prepareFinalObject("WaterConnection[0].apartment", 'No'))
      }
      let localizationLabels = {}
      if (state && state.app) localizationLabels = (state.app && state.app.localizationLabels) || {};
      dispatch(prepareFinalObject("WaterConnection[0].locality",waterConnection.additionalDetails.locality))
      getApplicationNumber(dispatch, payloadData.WaterConnection);
    }
  }

  let connectionObj = get(
    state.screenConfiguration.preparedFinalObject,
    "WaterConnection",
    []
  );

  const applicationStatus = connectionObj && connectionObj.length > 0
  ? connectionObj[0].applicationStatus
  : "";

  if(applicationStatus == "CONNECTION_ACTIVATED"){
    dispatch(handleField(
      "connection-details",
      "components.div.children.connectionDetails.children.cardContent.children.connectionHolders.children.cardContent.children.headerDiv.children.header.children.searchButton",
      "visible",
      true
    ))
  }  
};

const beforeInitFn = async (action, state, dispatch, connectionNumber,service) => {
  //Search details for given application Number
  if (connectionNumber) {
    await searchResults(action, state, dispatch, connectionNumber);
  }
  if(service == 'WATER'){
    dispatch(
      handleField(
        "connection-details",
        "components.div.children.connectionDetails.children.cardContent.children.serviceDetails.children.cardContent.children.viewOne.children.connectionType",
        "visible",
        true
      )
    );
    dispatch(
      handleField(
        "connection-details",
        "components.div.children.connectionDetails.children.cardContent.children.propertyDetails.children.cardContent.children.viewTwo.children.connectionType",
        "visible",
        true
      )
    );
  }else{
    dispatch(
      handleField(
        "connection-details",
        "components.div.children.connectionDetails.children.cardContent.children.propertyDetails.children.cardContent.children.viewTwo.children.connectionType",
        "visible",
        false
      )
    );
    dispatch(
      handleField(
        "connection-details",
        "components.div.children.connectionDetails.children.cardContent.children.serviceDetails.children.cardContent.children.viewOne.children.connectionType",
        "visible",
        false
      )
    );
  }
};

const headerrow = getCommonContainer({
  header: getCommonHeader({ labelKey: "WS_SEARCH_CONNECTIONS_DETAILS_HEADER" }),
  connectionNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-wns",
    componentPath: "ConsumerNoContainer",
    props: {
      number: getQueryArg(window.location.href, "connectionNumber"),
    },
  },
});

const serviceDetails = getServiceDetails();

const propertyDetails = getPropertyDetails(false);

const ownerDetails = getOwnerDetails(false);

const connectionHolders = connHolderDetailsSummary();
const volumetricDetail = getvolumetricDetail()
const connectionHoldersSameAsOwner = connHolderDetailsSameAsOwnerSummary();
// let getConnectionDetailsFooterAction = (ifUserRoleExists('WS_CEMP') || ifUserRoleExists('CITIZEN')) ? connectionDetailsFooter : {};
// let getDisconnectFooter = {}
// console.log(getConnectionDetailsFooterAction)


export const connectionDetails = getCommonCard({
  serviceDetails,
  propertyDetails,
  // ownerDetails,
  connectionHolders,
  volumetricDetail
  // connectionHoldersSameAsOwner,
});
const getMDMSData = async (action, state, dispatch) => {
  const tenantId = getTenantId();
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: tenantId,
      moduleDetails: [
        {
          moduleName: "BillingService",
          masterDetails: [
            {
              name: "BusinessService",
            },
          ],
        },
        {
          moduleName: "BillAmendment",
          masterDetails: [{ name: "documentObj" }],
        },
        {
          moduleName: "common-masters",
          masterDetails: [
            {
              name: "uiCommonPay",
            },
          ],
        },
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants",
            },
          ],
        },
      ],
    },
  };
  try {
    getRequiredDocData(action, dispatch, [
      {
        moduleName: "BillAmendment",
        masterDetails: [{ name: "documentObj" }],
      },
    ]);
    const payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    payload.MdmsRes.BillingService.BusinessService = payload.MdmsRes.BillingService.BusinessService.filter(service => service.isBillAmendmentEnabled)
    dispatch(prepareFinalObject("volumetricconnectDetailsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};
const getDataForBillAmendment = async (action, state, dispatch) => {
  await getMDMSData(action, state, dispatch);
};
const screenConfig = {
  uiFramework: "material-ui",
  name: "volumetric-connection-details",
  beforeInitScreen: (action, state, dispatch) => {
    let connectionNo = getQueryArg(window.location.href, "connectionNumber"); 
    let service = getQueryArg(window.location.href,"service")  
    getDataForBillAmendment(action, state, dispatch);
    console.log(service,"service", connectionNo)
    beforeInitFn(action, state, dispatch, connectionNo,service);
    set(
      action,
      "screenConfig.components.div.children.headerDiv.children.header1.children.connectionNumber.props.number",
      connectionNo
    );
    const connectionType = getQueryArg(window.location.href, "connectionType")
    const oldConnectionNo =!!state.screenConfiguration.preparedFinalObject&&state.screenConfiguration.preparedFinalObject.oldConnectionNumber
    if(connectionType === "Non Metered"&&!!oldConnectionNo &&oldConnectionNo !== null&&!!oldConnectionNo&&oldConnectionNo!= undefined&&oldConnectionNo != "" && oldConnectionNo != "NA"){
      set(
        action,
        "screenConfig.components.div.children.connectionDetails.children.cardContent.children.volumetricDetail.visible",
        true
      )
    }
    else{
      set(
        action,
        "screenConfig.components.div.children.connectionDetails.children.cardContent.children.volumetricDetail.visible",
        false
      )
    }    
    if(connectionType === "Metered"&&oldConnectionNo ==null&& oldConnectionNo== undefined && oldConnectionNo==""&&oldConnectionNo == "NA"){
      set(
        action,
        "screenConfig.components.div.children.connectionDetails.children.cardContent.children.volumetricDetail.visible",
        false
      )
    } 
    return action;
  },

  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css search-preview",
        id: "connection-details",
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header1: {
              gridDefination: {
                xs: 12,
                sm: 7,
              },
              ...headerrow,
            },
         
          },
        },
        connectionDetails,
        // getConnectionDetailsFooterAction,
        // getDisconnectFooter
      },
    },
    // adhocDialog: {
    //   uiFramework: "custom-containers",
    //   componentPath: "DialogContainer",
    //   props: {
    //     open: false,
    //     maxWidth: false,
    //     screenKey: "connection-details",
    //   },
    //   children: {
    //     popup: {},
    //   },
    // },
  },
};

export default screenConfig;
