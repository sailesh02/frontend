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
import {
  isWorkflowExists, checkifInWorkflow
} from "../../ui-utils/commons";
import { httpRequest } from "../../ui-utils/api";
import { getSearchResultsSW, getSearchResults, getWaterSource } from "../../ui-utils/commons"
import set from "lodash/set";
import { convertDateToEpoch } from "../../ui-config/screens/specs/utils";
import ConfirmationDialog from "../ConfirmationDialog";
import { toggleSpinner,hideSpinner } from "../../../../../packages/lib/egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { ifUserRoleExists } from "../../ui-config/screens/specs/utils";

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

const getTodaysDateInYMD = () => {
  let date = new Date();
  let month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  date = `${date.getFullYear()}-${month}-${day}`;
  return date;
};

class Footer extends React.Component {
  state = {
    open: false,
    openDialog:false,
    dialogHeader:'',
    dialogButton:'',
  };

 closeDialogue = () => {
    this.setState({
      openDialog:false
    })
  }

  onClickFunction = async(date) => {
    const {
      connectionNumber,
      tenantId,
      toggleSnackbar,
      applicationNo,
      applicationNos,
    } = this.props;

    if(ifUserRoleExists('WS_CEMP')){
      if(!date){
        toggleSnackbar(
          true,
          {
            labelName: "Please select date",
            labelKey: "Please select date",
          },
          "error"
        );
        return
      }
      
      let today = new Date()
      if(date === getTodaysDateInYMD()){ 
         // do nothing  
      }
      else if(new Date(date).getTime() < today.getTime()) {
        toggleSnackbar(
          true,
          {
            labelName: "The Date must be greater than or Equal to today's date",
            labelKey: "The Date must be greater than or Equal to today's date",
          },
          "error"
        );
        return;
      }
    }
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
  
           // to disconnect the connection
            let payloadSewerage,payloadWater
            let queryObject = [
               { key: "tenantId", value: tenantId },
               { key: "applicationNumber", value: applicationNo }
             ];
            if (applicationNo.includes("SW")) {
              try{
                store.dispatch(toggleSpinner())
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
              payloadSewerageCreate.applicationType = this.state.dialogButton == "WS_DISCONNECT_CONNECTION" ? "DISCONNECT_SEWERAGE_CONNECTION" : "CLOSE_SEWERAGE_CONNECTION",
              payloadSewerageCreate = findAndReplace(payloadSewerageCreate, "NA", null);
              payloadSewerageCreate.property = null;
              payloadSewerageCreate.noOfFlats = payloadSewerageCreate.payloadSewerageCreate && payloadSewerageCreate.noOfFlats != "" ? queryObject.noOfFlats : 0
              let response = await httpRequest("post", "/sw-services/swc/_create", "", [], { SewerageConnection: payloadSewerageCreate });
              store.dispatch(hideSpinner())
              let applNo = response && response.SewerageConnections && response.SewerageConnections[0].applicationNo

              response.SewerageConnections[0].sewerage = true;
              response.SewerageConnections[0].service = "Sewerage";
              response.SewerageConnections[0].locality = response.SewerageConnections[0].additionalDetails.locality
              if(ifUserRoleExists('WS_CEMP')){
                response.SewerageConnections[0].dateEffectiveFrom = date
              }
              let payloadSewerageUpdate = parserFunction(response.SewerageConnections[0]);
              set(payloadSewerageUpdate, "processInstance.action", "SUBMIT_APPLICATION");
              set(payloadSewerageUpdate, "connectionType", "Non Metered");
              payloadSewerageUpdate.applicationType = this.state.dialogButton == "WS_DISCONNECT_CONNECTION" ? "DISCONNECT_SEWERAGE_CONNECTION" : "CLOSE_SEWERAGE_CONNECTION"
              if (typeof payloadSewerageUpdate.additionalDetails !== 'object') {
                payloadSewerageUpdate.additionalDetails = {};
              }
              set(payloadSewerageUpdate, "tenantId", tenantId);
              payloadSewerageUpdate.additionalDetails.locality = payloadSewerageUpdate.locality;
              payloadSewerageUpdate = findAndReplace(payloadSewerageUpdate, "NA", null);
              payloadSewerageUpdate.property = null
              payloadSewerageUpdate.noOfFlats = payloadSewerageUpdate.noOfFlats && payloadSewerageUpdate.noOfFlats != "" ? payloadSewerageUpdate.noOfFlats : 0
              store.dispatch(toggleSpinner())
              setTimeout(async()=>{
                let updateWaterResponse = await httpRequest("post", "/sw-services/swc/_update", "", [], { SewerageConnection: payloadSewerageUpdate });
                this.closeDialogue()
                let purpose = this.state.dialogButton == "WS_DISCONNECT_CONNECTION" ? "disconnect" : "closeConnection";
                let status = "success";
                store.dispatch(
                  setRoute(
                    `/wns/acknowledgement?purpose=${purpose}&status=${status}&applicationNumberWater=${applNo || applicationNo}&applicationNumberSewerage=${applNo || applicationNo}&tenantId=${tenantId}`
                  )
                );
                store.dispatch(hideSpinner())  
              },5000)
              }
              catch(err){
                store.dispatch(hideSpinner())
                toggleSnackbar(
                  true,
                  {
                    labelName: err.message,
                    labelKey: err.message,
                  },
                  "error"
                );
              } 
            }else{
              try{
                store.dispatch(toggleSpinner())
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
                payload.applicationType = this.state.dialogButton == "WS_DISCONNECT_CONNECTION" ? "DISCONNECT_WATER_CONNECTION" : "CLOSE_WATER_CONNECTION"
                set(payload, "waterSource", getWaterSource(payload.waterSource, payload.waterSubSource));
                payload.pipeSize = 0
                payload.noOfFlats = payload.noOfFlats && payload.noOfFlats != "" ? payload.noOfFlats : 0
                let response = await httpRequest("post", "/ws-services/wc/_create", "", [], { WaterConnection: payload });
                store.dispatch(hideSpinner())
                let appNo = response && response.WaterConnection && response.WaterConnection[0].applicationNo
                response.WaterConnection[0].water = true;
                let waterSource = response.WaterConnection[0].waterSource.split(".");
                response.WaterConnection[0].waterSource = waterSource[0];
                response.WaterConnection[0].service = "Water";
                response.WaterConnection[0].waterSubSource = waterSource[1];
                response.WaterConnection[0].applicationType = this.state.dialogButton == "WS_DISCONNECT_CONNECTION" ? "DISCONNECT_WATER_CONNECTION" : "CLOSE_WATER_CONNECTION"
                response.WaterConnection[0].locality = response.WaterConnection[0].additionalDetails.locality
                if(ifUserRoleExists('WS_CEMP')){
                  response.WaterConnection[0].dateEffectiveFrom = date
                }
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
                store.dispatch(toggleSpinner())
                setTimeout(async()=>{
                  let updateResponse = await httpRequest("post", "/ws-services/wc/_update", "", [], { WaterConnection: waterUpdatePayload });
                  this.closeDialogue()
                  let purpose = this.state.dialogButton == "WS_DISCONNECT_CONNECTION" ? "disconnect" : "closeConnection";
                  let status = "success";
                  store.dispatch(
                    setRoute(
                      `/wns/acknowledgement?purpose=${purpose}&status=${status}&applicationNumberWater=${appNo || applicationNo}&applicationNumberSewerage=${appNo || applicationNo}&tenantId=${tenantId}`
                    )
                  );
                  store.dispatch(hideSpinner())
                },5000)
              }
              catch(err){
                store.dispatch(hideSpinner())
                toggleSnackbar(
                  true,
                  {
                    labelName: err.message,
                    labelKey: err.message,
                  },
                  "error"
                );
              }
                
                 
            }
  
  }

  render() {
    let downloadMenu = [];
    const {
      connectionNumber,
      tenantId,
      toggleSnackbar,
      applicationNo,
      applicationNos,
      businessService,
      applicationStatus,
      bill,
      isAmendmentInWorkflow
    } = this.props;

    const editButton = {
      label: "Edit",
      labelKey: "WS_MODIFY_CONNECTION_BUTTON",
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
        store.dispatch(
          setRoute(
            `/wns/apply?applicationNumber=${applicationNo}&connectionNumber=${connectionNumber}&tenantId=${tenantId}&action=edit&mode=MODIFY`
          )
        );
      },
    };
    const BillAmendment = {
      label: "Edit",
      labelKey: "WS_BILL_AMENDMENT_BUTTON",
      link: async () => {
        // checking for the due amount

        showHideAdhocPopup(
          this.props.state,
          store.dispatch,
          "connection-details"
        );
        // let due = getQueryArg(window.location.href, "due");
        // let errLabel = (applicationNo && applicationNo.includes("WS"))?"WS_DUE_AMOUNT_SHOULD_BE_ZERO":"SW_DUE_AMOUNT_SHOULD_BE_ZERO";
        // if(due && (parseInt(due) > 0)){
        //   toggleSnackbar(
        //     true,
        //     {
        //       labelName: "Due Amount should be zero!",
        //       labelKey: errLabel
        //     },
        //     "error"
        //   );

        //   return false;
        // }

        // check for the WF Exists
        const queryObj = [
          { key: "businessIds", value: applicationNos },
          { key: "tenantId", value: tenantId },
        ];

        // let isApplicationApproved = await isWorkflowExists(queryObj);
        // if(!isApplicationApproved){
        //   toggleSnackbar(
        //     true,
        //     {
        //       labelName: "WorkFlow already Initiated",
        //       labelKey: "WS_WORKFLOW_ALREADY_INITIATED"
        //     },
        //     "error"
        //   );
        //   return false;
        // }
        // store.dispatch(setRoute(`/wns/apply?applicationNumber=${applicationNo}&connectionNumber=${connectionNumber}&tenantId=${tenantId}&action=edit&mode=MODIFY`));
      },
    };
    //temporary disconnect connection functionality
    const disconnectButton = {
      label: "Disconnect",
      labelKey: "WS_DISCONNECT_CONNECTION",
      link: async () => {
        this.setState({
          openDialog:true,
          dialogButton:"WS_DISCONNECT_CONNECTION",
          dialogHeader:"Are you sure you want to disconnect ?"
        })  
      },
    };
    // close connection functionality
    const closeConnection = {
      label: "Close Connection",
      labelKey: "WS_CLOSE_CONNECTION",
      link: async () => {
        this.setState({
          openDialog:true,
          dialogButton:"WS_CLOSE_CONNECTION",
          dialogHeader:"Are you sure you want to close your connection ?"
        })  
      },
    }
    //if(applicationType === "MODIFY"){

    //to check button visibility based on application status
    if(process.env.REACT_APP_NAME == "Citizen"){
      switch(applicationStatus){
        case 'CONNECTION_ACTIVATED':
          downloadMenu.push(disconnectButton)
          downloadMenu.push(closeConnection)
          break;
        case 'CONNECTION_DISCONNECTED':
          downloadMenu.push(closeConnection)
          break;
        case 'CONNECTION_CLOSED':
          downloadMenu = [] 
        default:
          downloadMenu = []  
      }
    }
    if(ifUserRoleExists('WS_CEMP')){
      switch(applicationStatus){
        case 'CONNECTION_ACTIVATED':
          downloadMenu.push(disconnectButton)
          downloadMenu.push(closeConnection)
          downloadMenu.push(editButton)
          break;
        case 'CONNECTION_DISCONNECTED':
          downloadMenu.push(closeConnection)
          break;
        case 'CONNECTION_CLOSED':
          downloadMenu = [] 
        default:
          downloadMenu = []  
      }
    } 
    // downloadMenu && process.env.REACT_APP_NAME !== "Citizen" && (applicationStatus != 'CONNECTION_DISCONNECTED' && applicationStatus != 'CONNECTION_CLOSED') && downloadMenu.push(editButton);
    // downloadMenu && (process.env.REACT_APP_NAME == "Citizen" || ifUserRoleExists('WS_CEMP')) && (applicationStatus != 'CONNECTION_DISCONNECTED' || applicationStatus !='CONNECTION_CLOSED') && downloadMenu.push(disconnectButton);
    // downloadMenu && (process.env.REACT_APP_NAME == "Citizen" || ifUserRoleExists('WS_CEMP')) && applicationStatus != 'CONNECTION_CLOSED' && downloadMenu.push(closeConnection);

    if (
      (businessService && businessService.includes("ws-services-calculation") ||
      businessService && businessService.includes("sw-services-calculation")) && process.env.REACT_APP_NAME !== "Citizen"
    ) {
      if (bill.Demands && bill.Demands.length > 0 &&isAmendmentInWorkflow) {
        downloadMenu && downloadMenu.push(BillAmendment);
      }
    }

    //}
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
        {this.state.openDialog && <ConfirmationDialog open={this.state.openDialog} closeDialogue = {this.closeDialogue} 
        dialogHeader={this.state.dialogHeader} onClickFunction={this.onClickFunction} dialogButton={this.state.dialogButton}></ConfirmationDialog>}
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

      const connectionNumber =
      connectionObj && connectionObj.length > 0
        ? connectionObj[0].connectionNo
        : ""; 

  const applicationStatus = connectionObj && connectionObj.length > 0
  ? connectionObj[0].applicationStatus
  : "";      
  const businessService = connectDetailsData && 
  connectDetailsData.BillingService && connectDetailsData.BillingService.BusinessService && connectDetailsData.BillingService.BusinessService.map(
    (item) => {
      return item.businessService;
    }
  );
  return { state, applicationNo, applicationNos, applicationStatus,businessService, bill , isAmendmentInWorkflow, connectionNumber};
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleSnackbar: (open, message, variant) =>
      dispatch(toggleSnackbar(open, message, variant)),
    setRoute: (route) => dispatch(setRoute(route)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
