import { Container, Item } from "egov-ui-framework/ui-atoms";
import MenuButton from "egov-ui-framework/ui-molecules/MenuButton";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import React from "react";
import { connect } from "react-redux";
import store from "ui-redux/store";
import { showHideAdhocPopup } from "../../ui-config/screens/specs/utils";
import { getSearchResultsSW, getSearchResults, getWaterSource } from "../../ui-utils/commons"
import {
  isWorkflowExists
} from "../../ui-utils/commons";
import { httpRequest } from "../../ui-utils/api";
import { convertDateToEpoch } from "../../ui-config/screens/specs/utils";
import get from "lodash/get";
import set from "lodash/set";


// import { getRequiredDocData, showHideAdhocPopup } from "egov-billamend/ui-config/screens/specs/utils"

const parserFunction = (data) => {
    let queryObject = JSON.parse(JSON.stringify(data));
    let parsedObject = {
        roadCuttingArea: parseInt(queryObject.roadCuttingArea),
        meterInstallationDate: convertDateToEpoch(queryObject.meterInstallationDate),
        connectionExecutionDate: convertDateToEpoch(queryObject.connectionExecutionDate),
        dateEffectiveFrom: convertDateToEpoch(queryObject.dateEffectiveFrom),
        proposedWaterClosets: parseInt(queryObject.proposedWaterClosets),
        proposedToilets: parseInt(queryObject.proposedToilets),
        noOfTaps: parseInt(queryObject.noOfTaps),
        noOfWaterClosets: parseInt(queryObject.noOfWaterClosets),
        noOfToilets: parseInt(queryObject.noOfToilets),
        proposedTaps: parseInt(queryObject.proposedTaps),
        propertyId: (queryObject.property) ? queryObject.property.id : null,
        additionalDetails: {
            initialMeterReading: (
                queryObject.additionalDetails !== undefined &&
                queryObject.additionalDetails.initialMeterReading !== undefined
            ) ? parseFloat(queryObject.additionalDetails.initialMeterReading) : null,
            detailsProvidedBy: (
                queryObject.additionalDetails !== undefined &&
                queryObject.additionalDetails.detailsProvidedBy !== undefined &&
                queryObject.additionalDetails.detailsProvidedBy !== null
            ) ? queryObject.additionalDetails.detailsProvidedBy : "",
        }
    }
    queryObject = { ...queryObject, ...parsedObject }
    return queryObject;
}

const findAndReplace = (obj, oldValue, newValue) => {
  Object.keys(obj).forEach(key => {
      if ((obj[key] instanceof Object) || (obj[key] instanceof Array)) findAndReplace(obj[key], oldValue, newValue)
      obj[key] = obj[key] === oldValue ? newValue : obj[key]
  })
  return obj
}

const fetchBill = async(queryObject) => {
  try {
    const response = await httpRequest(
        "post",
        "/billing-service/bill/v2/_fetchbill",
        "_fetchBill",
        queryObject
    );
    return findAndReplace(response, null, "NA");
} catch (error) {
    console.log(error)
}
}
class Footer extends React.Component {
  state = {
    open: false,
  };
  render() {
    let downloadMenu = [];
    const {  
      connectionNumber,
      tenantId,
      toggleSnackbar,
      applicationNo,
      applicationNos,
      businessService,
    } = this.props;

    const disconnectButton = {
      label: "Disconnect",
      labelKey: "WS_DISCONNECT_CONNECTION",
      link: async () => {
        // checking for the due amount
        let fetchBillQueryObj = []
        let due
        if(applicationNo.includes('SW')){
          fetchBillQueryObj = [{ key: "tenantId", value: tenantId }, { key: "consumerCode", value: connectionNumber }, { key: "businessService", value: "SW" }]
        }else{
          fetchBillQueryObj = [{ key: "tenantId", value: tenantId }, { key: "consumerCode", value: connectionNumber }, { key: "businessService", value: "WS" }]
        }
        let billResults = await fetchBill(fetchBillQueryObj)
        billResults && billResults.Bill &&Array.isArray(billResults.Bill)&&billResults.Bill.length>0 && billResults.Bill.map(bill => {
            due = bill.totalAmount
        })
        console.log("dueeeeeeee",due,billResults)
        let errLabel =
          applicationNo && applicationNo.includes("WS")
            ? "WS_DUE_AMOUNT_SHOULD_BE_ZERO"
            : "SW_DUE_AMOUNT_SHOULD_BE_ZERO";
        if (due && parseInt(due) > 0) {
          toggleSnackbar(
            true,
            {
              labelName: "Due Amount should be zero!",
              labelKey: errLabel,
            },
            "error"
          );

          return false;
        }

        // check for the WF Exists
        const queryObj = [
          { key: "businessIds", value: applicationNos },
          { key: "tenantId", value: tenantId },
        ];

        let isApplicationApproved = await isWorkflowExists(queryObj);
        if (!isApplicationApproved) {
          toggleSnackbar(
            true,
            {
              labelName: "WorkFlow already Initiated",
              labelKey: "WS_WORKFLOW_ALREADY_INITIATED",
            },
            "error"
          );
          return false;
        }
    
         // to disconnect the connection
         if (window.confirm("Are you sure you want to link your mobile number?")) {
          let payloadSewerage,payloadWater
          let queryObject = [
             { key: "tenantId", value: tenantId },
             { key: "applicationNumber", value: applicationNo }
           ];
          if (applicationNo.includes("SW")) {
            debugger
             payloadSewerage = await getSearchResultsSW(queryObject)
             payloadSewerage.SewerageConnections[0].water = false;
             payloadSewerage.SewerageConnections[0].sewerage = true;
             payloadSewerage.SewerageConnections[0].service = "Sewerage";
             let sewerageConnections = payloadSewerage ? payloadSewerage.SewerageConnections : []
             delete sewerageConnections[0].id; sewerageConnections[0].documents = [];
             sewerageConnections[0].locality = sewerageConnections[0].additionalDetails.locality
 
             let payloadSewerageCreate = parserFunction(sewerageConnections[0]);
 
             if (typeof payloadSewerageCreate.additionalDetails !== 'object') {
               payloadSewerageCreate.additionalDetails = {};
           }
           payloadSewerageCreate.additionalDetails.locality = payloadSewerageCreate.locality
           set(payloadSewerageCreate, "processInstance.action", "INITIATE");
           set(payloadSewerageCreate, "connectionType", "Non Metered");
           set(payloadSewerageCreate, "tenantId", tenantId);
           
           payloadSewerageCreate = findAndReplace(payloadSewerageCreate, "NA", null);
           payloadSewerageCreate.property = null;
           payloadSewerageCreate.noOfFlats = payloadSewerageCreate.payloadSewerageCreate && payloadSewerageCreate.noOfFlats != "" ? queryObject.noOfFlats : 0
           let response = await httpRequest("post", "/sw-services/swc/_createe", "", [], { SewerageConnection: payloadSewerageCreate });
           response.SewerageConnections[0].sewerage = true;
           response.SewerageConnections[0].service = "Sewerage";
           response.SewerageConnections[0].locality = response.SewerageConnections[0].additionalDetails.locality
           let payloadSewerageUpdate = parserFunction(response.SewerageConnections[0]);
           set(payloadSewerageUpdate, "processInstance.action", "SUBMIT_APPLICATION");
           set(payloadSewerageUpdate, "connectionType", "Non Metered");
           payloadSewerageUpdate.applicationType = "DISCONNECT_WATER_CONNECTION"
 
           if (typeof payloadSewerageUpdate.additionalDetails !== 'object') {
             payloadSewerageUpdate.additionalDetails = {};
           }
           set(payloadSewerageUpdate, "tenantId", tenantId);
           payloadSewerageUpdate.additionalDetails.locality = payloadSewerageUpdate.locality;
           payloadSewerageUpdate = findAndReplace(payloadSewerageUpdate, "NA", null);
           payloadSewerageUpdate.property = null
           payloadSewerageUpdate.noOfFlats = payloadSewerageUpdate.noOfFlats && payloadSewerageUpdate.noOfFlats != "" ? payloadSewerageUpdate.noOfFlats : 0
           await httpRequest("post", "/sw-services/swc/_updatee", "", [], { SewerageConnection: payloadSewerageUpdate });
           dispatch(
             setRoute(
               `/wns/acknowledgement?purpose=${purpose}&status=${status}&applicationNumberWater=${applicationNo}&applicationNumberSewerage=${applicationNo}&tenantId=${tenantId}`
             )
           );
          }else{
             payloadWater = await getSearchResults(queryObject)
             payloadWater.WaterConnection[0].water = true;
             payloadWater.WaterConnection[0].sewerage = false;
             payloadWater.WaterConnection[0].service = "Water";
             payloadWater.WaterConnection[0].locality = payloadWater.WaterConnection[0].additionalDetails.locality
             let waterConnections = payloadWater ? payloadWater.WaterConnection : []
             delete waterConnections[0].id; waterConnections[0].documents = [];
             let payload = parserFunction(waterConnections[0]);
             if (typeof payload.additionalDetails !== 'object') {
                 payload.additionalDetails = {};
             }
             set(payload, "tenantId", tenantId);
             payload.additionalDetails.locality = payload.locality;
             payload = findAndReplace(payload, "NA", null);
             set(payload, "processInstance.action", "INITIATE")
             payload.applicationType = "DISCONNECT_WATER_CONNECTION",
             set(payload, "waterSource", getWaterSource(payload.waterSource, payload.waterSubSource));
             payload.pipeSize = 0
             payload.noOfFlats = payload.noOfFlats && payload.noOfFlats != "" ? payload.noOfFlats : 0
             let response = await httpRequest("post", "/ws-services/wc/_createe", "", [], { WaterConnection: payload });
             response.WaterConnection[0].water = true;
             let waterSource = response.WaterConnection[0].waterSource.split(".");
             response.WaterConnection[0].waterSource = waterSource[0];
             response.WaterConnection[0].service = "Water";
             response.WaterConnection[0].waterSubSource = waterSource[1];
             response.WaterConnection[0].applicationType = "DISCONNECT_WATER_CONNECTION"
             response.WaterConnection[0].locality = response.WaterConnection[0].additionalDetails.locality
 
             let waterUpdatePayload = parserFunction(response.WaterConnection[0]);
             set(waterUpdatePayload, "processInstance.action", "SUBMIT_APPLICATION");
             set(waterUpdatePayload, "waterSource", getWaterSource(waterUpdatePayload.waterSource, waterUpdatePayload.waterSubSource));
             if (typeof waterUpdatePayload.additionalDetails !== 'object') {
               waterUpdatePayload.additionalDetails = {};
             }
             set(waterUpdatePayload, "tenantId", tenantId);
             waterUpdatePayload.additionalDetails.locality = waterUpdatePayload.locality;
             waterUpdatePayload.pipeSize = 0
             waterUpdatePayload = findAndReplace(waterUpdatePayload, "NA", null);
             waterUpdatePayload.noOfFlats = waterUpdatePayload.noOfFlats && waterUpdatePayload.noOfFlats != "" ? waterUpdatePayload.noOfFlats : 0
             await httpRequest("post", "/ws-services/wc/_updatee", "", [], { WaterConnection: waterUpdatePayload });
             let purpose = "disconnect";
             let status = "success";
             dispatch(
               setRoute(
                 `/wns/acknowledgement?purpose=${purpose}&status=${status}&applicationNumberWater=${applicationNo}&applicationNumberSewerage=${applicationNo}&tenantId=${tenantId}`
               )
             );
          }
         }
        
      },
    };
   
    downloadMenu && process.env.REACT_APP_NAME == "Citizen" && downloadMenu.push(disconnectButton);
    const buttonItems = {
      label: { labelName: "Take Action", labelKey: "WF_TAKE_ACTION" },
      rightIcon: "arrow_drop_down",
      props: {
        variant: "outlined",
        style: {
          marginRight: 15,
          backgroundColor: "#FE7A51",
          color: "#fff",
          border: "none",
          height: "60px",
          width: "200px",
        },
      },
      menu: downloadMenu,
    };

    return ( 
      <div className="wf-wizard-footer" id="custom-atoms-footer">
        <Container>
          <Item xs={12} sm={12} className="wf-footer-container">
            {downloadMenu && downloadMenu.length > 0 && <MenuButton data={buttonItems} />}
          </Item>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  let connectionObj = get(
    state.screenConfiguration.preparedFinalObject,
    "WaterConnection",
    []
  );
  /* For WorkFlow check */
  let applicationNos = get(
    state.screenConfiguration.preparedFinalObject,
    "applicationNos",
    []
  );
  
  let connectDetailsData = get(
    state.screenConfiguration.preparedFinalObject,
    "connectDetailsData"
  );

  if (connectionObj.length === 0) {
    connectionObj = get(
      state.screenConfiguration.preparedFinalObject,
      "SewerageConnection",
      []
    );
  }
  const applicationNo =
    connectionObj && connectionObj.length > 0
      ? connectionObj[0].applicationNo
      : "";

  const connectionNumber =
  connectionObj && connectionObj.length > 0
    ? connectionObj[0].connectionNo
    : "";  

  const businessService = connectDetailsData && 
  connectDetailsData.BillingService && connectDetailsData.BillingService.BusinessService && connectDetailsData.BillingService.BusinessService.map(
    (item) => {
      return item.businessService;
    }
  );
  return { state, applicationNo, applicationNos, businessService, connectionNumber };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleSnackbar: (open, message, variant) =>
      dispatch(toggleSnackbar(open, message, variant)),
    setRoute: (route) => dispatch(setRoute(route)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
