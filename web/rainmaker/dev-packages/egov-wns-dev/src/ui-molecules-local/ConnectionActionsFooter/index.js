import { Container, Item } from "egov-ui-framework/ui-atoms";
import MenuButton from "egov-ui-framework/ui-molecules/MenuButton";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import React from "react";
import { connect } from "react-redux";
import store from "ui-redux/store";
import { showHideAdhocPopup } from "../../ui-config/screens/specs/utils";
import { getSearchResultsForSewerage, getSearchResults, getWaterSource } from "../../ui-utils/commons"
import {
  isWorkflowExists
} from "../../ui-utils/commons";
import { httpRequest } from "../../ui-utils/api";

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
      bill,
      isAmendmentInWorkflow
    } = this.props;

    const disconnectButton = {
      label: "Disconnect",
      labelKey: "WS_DISCONNECT_CONNECTION",
      link: async () => {
        // checking for the due amount
        let due = getQueryArg(window.location.href, "due");
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
         let payloadSewerage,payloadWater
         let queryObject = [
            { key: "tenantId", value: tenantId },
            { key: "applicationNumber", value: applicationNo }
          ];
         if (applicationNo.includes("SW")) {
            try { payloadSewerage = await getSearchResultsForSewerage(queryObject, dispatch) } catch (error) { console.error(error); }
            payloadSewerage.SewerageConnections[0].water = false;
            payloadSewerage.SewerageConnections[0].sewerage = true;
            payloadSewerage.SewerageConnections[0].service = "Sewerage";
            let sewerageConnections = payloadSewerage ? payloadSewerage.SewerageConnections : []
            delete sewerageConnections[0].id; sewerageConnections[0].documents = [];
            let payload = parserFunction(sewerageConnections[0]);
            if (typeof payload.additionalDetails !== 'object') {
                payload.additionalDetails = {};
            }
            set(payload, "processInstance.action", "INITIATE")
            set(payload, "waterSource", getWaterSource(payload.waterSource, payload.waterSubSource));
            payload.pipeSize = 0
            payload.noOfFlats = payload.noOfFlats && payload.noOfFlats != "" ? payload.noOfFlats : 0
            await httpRequest("post", "/ws-services/wc/_create", "", [], { WaterConnection: payload });


         }else{
            payloadWater = await getSearchResults(queryObject)
            payloadWater.WaterConnection[0].water = true;
            payloadWater.WaterConnection[0].sewerage = false;
            payloadWater.WaterConnection[0].service = "Water";
            let waterConnections = payloadWater ? payloadWater.WaterConnection : []
            delete waterConnections[0].id; waterConnections[0].documents = [];
            let payload = parserFunction(sewerageConnections[0]);
            if (typeof payload.additionalDetails !== 'object') {
                payload.additionalDetails = {};
            }
            set(payload, "processInstance.action", "INITIATE")
            payload.applicationType = "DISCONNECT_WATER_CONNECTION",
            set(payload, "waterSource", getWaterSource(payload.waterSource, payload.waterSubSource));
            payload.pipeSize = 0
            payload.noOfFlats = payload.noOfFlats && payload.noOfFlats != "" ? payload.noOfFlats : 0
            let response = await httpRequest("post", "/ws-services/wc/_create", "", [], { WaterConnection: payload });
            response.WaterConnection[0].water = true;
            let waterSource = response.WaterConnection[0].waterSource.split(".");
            response.WaterConnection[0].waterSource = waterSource[0];
            response.WaterConnection[0].service = "Water";
            response.WaterConnection[0].waterSubSource = waterSource[1];
            response.WaterConnection[0].applicationType = "DISCONNECT_WATER_CONNECTION"
            let waterUpdatePayload = parserFunction(response.WaterConnection[0]);
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
  let bill = get(
    state.screenConfiguration.preparedFinalObject,
    "BILL_FOR_WNS",
    ""
  );
  let isAmendmentInWorkflow = get(
    state.screenConfiguration.preparedFinalObject,
    "isAmendmentInWorkflow",
    true
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
  const businessService = connectDetailsData && 
  connectDetailsData.BillingService && connectDetailsData.BillingService.BusinessService && connectDetailsData.BillingService.BusinessService.map(
    (item) => {
      return item.businessService;
    }
  );
  return { state, applicationNo, applicationNos, businessService, bill , isAmendmentInWorkflow};
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleSnackbar: (open, message, variant) =>
      dispatch(toggleSnackbar(open, message, variant)),
    setRoute: (route) => dispatch(setRoute(route)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
