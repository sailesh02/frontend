import {
  getCommonCard,
  getCommonContainer, getCommonGrayCard, getCommonHeader,
  getCommonSubHeader, getCommonTitle,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, unMountScreen } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg, setBusinessServiceDataToLocalStorage, setDocuments } from "egov-ui-framework/ui-utils/commons";
import { loadUlbLogo } from "egov-ui-kit/utils/pdfUtils/generatePDF";
import get from "lodash/get";
import set from "lodash/set";
import { findAndReplace, getDescriptionFromMDMS, getSearchResults, getSearchResultsForSewerage, getWaterSource, getWorkFlowData, isModifyMode, isDisconnectOrClose, serviceConst, swEstimateCalculation, waterEstimateCalculation, applicableApplicationType } from "../../../../ui-utils/commons";
import {
  convertDateToEpoch, createEstimateData,
  getDialogButton, getFeesEstimateOverviewCard,
  getTransformedStatus, showHideAdhocPopup,getTextToLocalMapping, getTranslatedLabel
} from "../utils";
import { downloadPrintContainer } from "../wns/acknowledgement";
import { adhocPopup } from "./applyResource/adhocPopup";
import { getReviewDocuments } from "./applyResource/review-documents";
import { getReviewOwner } from "./applyResource/review-owner";
import { getReviewConnectionDetails } from "./applyResource/review-trade";
import { snackbarWarningMessage } from "./applyResource/reviewConnectionDetails";
import { reviewModificationsEffective } from "./applyResource/reviewModificationsEffective";
import {connectionDetailsWater,connectionDetailsSewerage} from './applyResource/task-connectiondetails'
import { httpRequest } from "../../../../ui-utils"
import commonConfig from "config/common.js";

const tenantId = getQueryArg(window.location.href, "tenantId");
let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
let service = getQueryArg(window.location.href, "service");
let serviceModuleName = (service === serviceConst.WATER) ? "NewWS1" : "NewSW1";
let serviceUrl = serviceModuleName === "NewWS1" ? "/ws-services/wc/_update" : "/ws-services/wc/_update";
let redirectQueryString = `applicationNumber=${applicationNumber}&tenantId=${tenantId}`;
let editredirect = `apply?${redirectQueryString}&action=edit`; 
let headerLabel = "WS_TASK_DETAILS"
let applicationType = getQueryArg(window.location.href, "applicationType");

const resetData = () => {
  
  applicationNumber = getQueryArg(window.location.href, "applicationNumber");
  service = getQueryArg(window.location.href, "service");
  serviceModuleName = service === serviceConst.WATER ? "NewWS1" : "NewSW1";
  serviceUrl = serviceModuleName === "NewWS1" ? "/ws-services/wc/_update" : "/sw-services/swc/_update";
  redirectQueryString = `applicationNumber=${applicationNumber}&tenantId=${tenantId}`;
  editredirect = `apply?${redirectQueryString}&action=edit`;
  if(applicationType === "METER_REPLACEMENT"){
    editredirect = `replaceMeter?${redirectQueryString}&action=edit`;
  }
  if (isModifyMode()) {
    redirectQueryString += '&mode=MODIFY';
    editredirect += '&mode=MODIFY&modeaction=edit';
    if (service === serviceConst.WATER) {
      headerLabel = "WS_MODIFY_TASK_DETAILS"
    } else {
      headerLabel = "SW_MODIFY_TASK_DETAILS"
    }
  }
  if(isDisconnectOrClose()){
    editredirect += '&mode=ownershipTransfer&modeaction=edit'
  }

}



const headerrow = getCommonContainer({
  header: getCommonHeader({
    labelKey: headerLabel
  }),
  application: getCommonContainer({
    applicationNumber: {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-wns",
      componentPath: "ApplicationNoContainer",
      props: {
        number: getQueryArg(window.location.href, "applicationNumber")
      }
    }
  }),
  connection: getCommonContainer({
    connectionNumber: {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-wns",
      componentPath: "ConsumerNoContainer",
      props: {
        number: ""
      }
    }

  })
});

const getMdmsDataForInstallment = async(dispatch) => {

  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        
        { moduleName: "ws-services-calculation", masterDetails: [{ name: "Installment" }] },
        
      ]
    }
  };
  try {
    let payload = null;
    payload = await httpRequest("post", "/egov-mdms-service/v1/_search", "_search", [], mdmsBody);
    
    let scrutinyFeeInstallments = payload.MdmsRes && payload.MdmsRes['ws-services-calculation'].Installment && payload.MdmsRes['ws-services-calculation'].Installment.filter( item => item.feeType == "WS_SCRUTINY_FEE")
    let labourFeeInstallments = payload.MdmsRes && payload.MdmsRes['ws-services-calculation'].Installment && payload.MdmsRes['ws-services-calculation'].Installment.filter( item => item.feeType == "WS_LABOUR_FEE")
  
      payload.MdmsRes['ws-services-calculation'].ScrutinyFeeInstallmentsInfo = scrutinyFeeInstallments;
      payload.MdmsRes['ws-services-calculation'].LabourFeeInstallmentsInfo = labourFeeInstallments;
      dispatch(prepareFinalObject("applyScreenMdmsDataForInstallment", payload.MdmsRes));
  } catch (error) {
   console.log(error, "Error") 
  }
}
const beforeInitFn = async (action, state, dispatch, applicationNumber) => {
  if(isDisconnectOrClose() || process.env.REACT_APP_NAME === "Citizen"){
    set(
      action.screenConfig,
      "components.div.children.taskDetails.children.cardContent.children.estimate.visible",
      false
    ); 
  }
  // dispatch(handleField("apply",
  // "components",
  // "div", {}));
  // dispatch(handleField("search",
  // "components",
  // "div", {}));
  dispatch(unMountScreen("apply"));
  dispatch(unMountScreen("search"));
  dispatch(prepareFinalObject("WaterConnection",[]));
  dispatch(prepareFinalObject("SewerageConnection",[]));
  dispatch(prepareFinalObject("WaterConnectionOld",[]));
  dispatch(prepareFinalObject("SewerageConnectionOld",[]));
  const queryObj = [
    { key: "businessIds", value: applicationNumber },
    { key: "history", value: true },
    { key: "tenantId", value: tenantId }
  ];
  if (getQueryArg(window.location.href, "service", null) != null) {
    resetData();
  }
  let r = await getMdmsDataForInstallment(dispatch);
  let Response = await getWorkFlowData(queryObj);
  let processInstanceAppStatus = Response && Response.ProcessInstances && Response.ProcessInstances.length > 0 && Response.ProcessInstances[0].state.applicationStatus;
  //Search details for given application Number
  if (applicationNumber) {

    // hiding the Additional details for citizen. ,,
    if (process.env.REACT_APP_NAME === "Citizen" && processInstanceAppStatus && (processInstanceAppStatus === 'INITIATED' || processInstanceAppStatus === "PENDING_FOR_CITIZEN_ACTION" || processInstanceAppStatus === 'PENDING_FOR_DOCUMENT_VERIFICATION')) {
      set(
        action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.props.style",
        { display: "none" }
      );
    }

    if(service === serviceConst.WATER){
      dispatch(
        handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewOne.props.scheama.children.cardContent.children.getPropertyDetailsContainer.children.connectionType",
          "visible",
          true
        )
      );
    }else{
      dispatch(
        handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewOne.props.scheama.children.cardContent.children.getPropertyDetailsContainer.children.connectionType",
          "visible",
          false
        )
      );
    }
    if (!getQueryArg(window.location.href, "edited")) {
      (await searchResults(action, state, dispatch, applicationNumber, processInstanceAppStatus));
    } else {
      let tenantId = getQueryArg(window.location.href, "tenantId")
      let applyScreenObject = get(state.screenConfiguration.preparedFinalObject, "applyScreen");
      let connectionFacility = applyScreenObject && 
      applyScreenObject.connectionFacility
      let connectionType = applyScreenObject && 
      applyScreenObject.connectionType
      // applyScreenObject.applicationNo.includes("WS") ? applyScreenObject.service = serviceConst.WATER : applyScreenObject.service = serviceConst.SEWERAGE;
      connectionFacility == serviceConst.WATER ? applyScreenObject.service = serviceConst.WATER : applyScreenObject.service = serviceConst.SEWERAGE;
      let parsedObject = parserFunction(findAndReplace(applyScreenObject, "NA", null));
      if((
        connectionFacility == serviceConst.WATER
      )){
        set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixVS.visible", false);
        set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixWS.visible", true);
        set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixBoth.visible", false);
      }else if(connectionFacility == serviceConst.WATERSEWERAGE){
        set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixVS.visible", false);
        set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixWS.visible", false);
        set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixBoth.visible", true);
      }else{
        set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixVS.visible", true);
        set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixWS.visible", false);
        set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixBoth.visible", false);
      }
      if(parsedObject && parsedObject.noOfFlats && parseInt(parsedObject.noOfFlats) && parseInt(parsedObject.noOfFlats) > 0){
        dispatch(prepareFinalObject("WaterConnection[0].apartment", 'Yes'));
      }else{
        dispatch(prepareFinalObject("WaterConnection[0].apartment", 'No')); 
      }
      if((
        connectionFacility == serviceConst.WATER
      ) || (connectionFacility == serviceConst.WATERSEWERAGE) && connectionType == "Metered"){
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewThirdTeen",
          "visible",
          true
        ));
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourTeen",
          "visible",
          true
        ));
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewThirdTeen",
          "visible",
          true
        ));
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourTeen",
          "visible",
          true
        ));
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFifteen",
          "visible",
          false
        ));
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixteen",
          "visible",
          false
        ));
      }else{
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFifteen",
          "visible",
          false
        ));
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixteen",
          "visible",
          false
        ));
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewThirdTeen",
          "visible",
          false
        ));
        // dispatch(handleField(
        //   "search-preview",
        //   "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourTeen",
        //   "visible",
        //   false
        // ));
      }

      if((
        connectionFacility == serviceConst.WATER
      ) || (connectionFacility == serviceConst.WATERSEWERAGE) 
      && connectionType == "Non Metered"){
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFifteen",
          "visible",
          true
        ));
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixteen",
          "visible",
          true
        ));
      }else{
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFifteen",
          "visible",
          false
        ));
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixteen",
          "visible",
          false
        ));
      }
      
      dispatch(prepareFinalObject("WaterConnection[0]", parsedObject));
      dispatch(prepareFinalObject("WaterConnection[0].additionalDetails.locality", applyScreenObject.locality));
      dispatch(prepareFinalObject("WaterConnection[0].additionalDetails.ward", applyScreenObject.ward ?  applyScreenObject.ward : ''));
      if (applyScreenObject.service = serviceConst.SEWERAGE)
      dispatch(prepareFinalObject("SewerageConnection[0]", parsedObject));
      dispatch(prepareFinalObject("SewerageConnection[0].additionalDetails.locality", applyScreenObject.locality));
      dispatch(prepareFinalObject("SewerageConnection[0].additionalDetails.ward", applyScreenObject.ward ?  applyScreenObject.ward : ''));
      if(parsedObject && parsedObject.noOfFlats && parseInt(parsedObject.noOfFlats) && parseInt(parsedObject.noOfFlats) > 0){
        dispatch(prepareFinalObject("SewerageConnection[0].apartment", 'Yes'));
      }else{
        dispatch(prepareFinalObject("SewerageConnection[0].apartment", 'No')); 
      }
      
      if((
        connectionFacility == serviceConst.WATER
      ) || (connectionFacility == serviceConst.WATERSEWERAGE)){
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewThirdTeen",
          "visible",
          true
        ));
        
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFifteen",
          "visible",
          connectionType == 'Non Metered' ? true : false
        ));
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixteen",
          "visible",
          connectionType == 'Non Metered' ? true : false
        ));
      }else{
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFifteen",
          "visible",
          false
        ));
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixteen",
          "visible",
          false
        ));
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewThirdTeen",
          "visible",
          false
        ));
      }
      let estimate;
      if (processInstanceAppStatus === "CONNECTION_ACTIVATED") {
        let connectionNumber = parsedObject.connectionNo;
        set(action.screenConfig, "components.div.children.headerDiv.children.header1.children.connection.children.connectionNumber.props.number", connectionNumber);
      } else {
        set(action.screenConfig, "components.div.children.headerDiv.children.header1.children.connection.children.connectionNumber.visible", false);
      }
      if (processInstanceAppStatus === "PENDING_FOR_FIELD_INSPECTION") {
        let queryObjectForEst = [{
          applicationNo: applicationNumber,
          tenantId: tenantId,
          waterConnection: parsedObject
        }]
        if ((
          connectionFacility == serviceConst.WATER
        ) || (connectionFacility == serviceConst.WATERSEWERAGE) || (connectionFacility == serviceConst.SEWERAGE)) {
          estimate = await waterEstimateCalculation(queryObjectForEst, dispatch);
          let viewBillTooltip = [];
          if (estimate !== null && estimate !== undefined) {
            if (estimate.Calculation.length > 0) {
              await processBills(estimate, viewBillTooltip, dispatch);
              // viewBreakUp 
              estimate.Calculation[0].billSlabData = _.groupBy(estimate.Calculation[0].taxHeadEstimates, 'category')
              estimate.Calculation[0].appStatus = processInstanceAppStatus;
              dispatch(prepareFinalObject("dataCalculation", estimate.Calculation[0]));
            }
          }
        } else {
          let queryObjectForEst = [{
            applicationNo: applicationNumber,
            tenantId: tenantId,
            sewerageConnection: parsedObject
          }]
          estimate = await swEstimateCalculation(queryObjectForEst, dispatch);
          let viewBillTooltip = []
          if (estimate !== null && estimate !== undefined) {
            if (estimate.Calculation.length > 0) {
              await processBills(estimate, viewBillTooltip, dispatch);
              // viewBreakUp 
              estimate.Calculation[0].billSlabData = _.groupBy(estimate.Calculation[0].taxHeadEstimates, 'category')
              estimate.Calculation[0].appStatus = processInstanceAppStatus;
              dispatch(prepareFinalObject("dataCalculation", estimate.Calculation[0]));
            }
          }
        }
        if (estimate !== null && estimate !== undefined) {
          createEstimateData(estimate.Calculation[0].taxHeadEstimates, "taxHeadEstimates", dispatch, {}, {});
        }
      }
    }
    let connectionType = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].connectionType");
    let connectionFacility = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].connectionFacility");
    if (connectionType === "Metered" &&  
      (connectionFacility == serviceConst.WATER)) {
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourTeen.children.reviewLaborCharge.visible",
        true
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourTeen.children.reviewInstallment.visible",
        true
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterId.visible",
        true
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterInstallationDate.visible",
        true
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewInitialMeterReading.visible",
        true
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterMake.visible",
        true
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourTeen.children.reviewInstallment.visible",
        true
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourTeen.children.reviewLaborCharge.visible",
        true
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewDiameter.visible",
        false
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterRatio.visible",
        true
      );
    } else if(connectionType === "Metered" && connectionFacility == serviceConst.WATERSEWERAGE){
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourTeen.children.reviewLaborCharge.visible",
        true
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourTeen.children.reviewInstallment.visible",
        true
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterId.visible",
        true
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterInstallationDate.visible",
        true
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewInitialMeterReading.visible",
        true
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterMake.visible",
        true
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourTeen.children.reviewInstallment.visible",
        true
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourTeen.children.reviewLaborCharge.visible",
        true
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewDiameter.visible",
        true
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterRatio.visible",
        true
      );
    }else {
      if(connectionFacility == serviceConst.WATER){

        set(
          action.screenConfig,
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewDiameter.visible",
          false
        );
        set(
          action.screenConfig,
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterId.visible",
          true
        );
        set(
          action.screenConfig,
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterInstallationDate.visible",
          true
        );
        set(
          action.screenConfig,
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewInitialMeterReading.visible",
          true
        );
        set(
          action.screenConfig,
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterMake.visible",
          true
        );
        set(
          action.screenConfig,
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourTeen.children.reviewLaborCharge.visible",
          true
        );
        set(
          action.screenConfig,
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourTeen.children.reviewInstallment.visible",
          true
        );
        set(
          action.screenConfig,
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterRatio.visible",
          true
        );

        // dispatch(handleField(
        //   "search-preview",
        //   "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewThirdTeen",
        //   "visible",
        //   false
        //   ))
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFifteen",
          "visible",
          true
          ))
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixteen",
          "visible",
          true
          ))
      }else if((connectionFacility == serviceConst.WATERSEWERAGE)){
        set(
          action.screenConfig,
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewDiameter.visible",
          true
        );
        set(
          action.screenConfig,
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterId.visible",
          true
        );
        set(
          action.screenConfig,
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterInstallationDate.visible",
          true
        );
        set(
          action.screenConfig,
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewInitialMeterReading.visible",
          true
        );
        set(
          action.screenConfig,
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterMake.visible",
          true
        );
        set(
          action.screenConfig,
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourTeen.children.reviewLaborCharge.visible",
          true
        );
        set(
          action.screenConfig,
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourTeen.children.reviewInstallment.visible",
          true
        );
        set(
          action.screenConfig,
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterRatio.visible",
          true
        );
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewThirdTeen",
          "visible",
          false
          ))
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFifteen",
          "visible",
          true
          ))
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixteen",
          "visible",
          true
          ))
          // dispatch(handleField(
          //   "search-preview",
          //   "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourTeen",
          //   "visible",
          //   false
          //   ))
      }else{
        set(
          action.screenConfig,
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterId.visible",
          false
        );
        set(
          action.screenConfig,
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterInstallationDate.visible",
          false
        );
        set(
          action.screenConfig,
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewInitialMeterReading.visible",
          false
        );
        set(
          action.screenConfig,
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterMake.visible",
          false
        );
        set(
          action.screenConfig,
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourTeen.children.reviewInstallment.visible",
          false
        );
        set(
          action.screenConfig,
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourTeen.children.reviewLaborCharge.visible",
          false
        );
        set(
          action.screenConfig,
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterRatio.visible",
          false
        );
        set(
          action.screenConfig,
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewDiameter.visible",
          true
        );
      }
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterId.visible",
        false
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterInstallationDate.visible",
        false
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewInitialMeterReading.visible",
        false
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterMake.visible",
        false
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourTeen.children.reviewInstallment.visible",
        false
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourTeen.children.reviewLaborCharge.visible",
        false
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterRatio.visible",
        false
      );
    }

    if (isModifyMode() || applicableApplicationType() || isDisconnectOrClose()) {
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.estimate.visible",
        false
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSeven.visible",
        false
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewEight.visible",
        false
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewNine.visible",
        false
      );
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTen.visible",
        false
      );

      dispatch(handleField(
            "search-preview",
            "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourTeen",
            "visible",
            false
            ))
      dispatch(handleField(
        "search-preview",
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewThirdTeen",
        "visible",
        false
        ))      
    } else {
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewModificationsDetails.visible",
        false
      );
    }

    const status = getTransformedStatus(
      get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].applicationStatus")
    );
    if (process.env.REACT_APP_NAME !== "Citizen" && (processInstanceAppStatus !== 'PENDING_FOR_PAYMENT' && processInstanceAppStatus !== "PENDING_FOR_CONNECTION_ACTIVATION" && processInstanceAppStatus !== 'CONNECTION_ACTIVATED')) {

      dispatch(
        handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.estimate.children.cardContent.children.addPenaltyRebateButton",
          "visible",
          true
        )
      );
    }
    const printCont = downloadPrintContainer(
      action,
      state,
      dispatch,
      processInstanceAppStatus,
      applicationNumber,
      tenantId
    );
    set(
      action,
      "screenConfig.components.div.children.headerDiv.children.helpSection.children",
      printCont
    );

    let data = get(state, "screenConfiguration.preparedFinalObject");

    const obj = setStatusBasedValue(status);

    // Get approval details based on status and set it in screenconfig

    if (
      status === "APPROVED" ||
      status === "REJECTED" ||
      status === "CANCELLED"
    ) {
      set(
        action,
        "screenConfig.components.div.children.taskDetails.children.cardContent.children.approvalDetails.visible",
        true
      );

      if (get(data, "WaterConnection[0].documents")) {
        await setDocuments(
          data,
          "WaterConnection[0].documents",
          "LicensesTemp[0].verifyDocData",
          dispatch, 'NewWS1'
        );
      } else {
        dispatch(
          handleField(
            "search-preview",
            "components.div.children.taskDetails.children.cardContent.children.approvalDetails.children.cardContent.children.viewTow.children.lbl",
            "visible",
            false
          )
        );
      }
    } else {
      set(
        action,
        "screenConfig.components.div.children.taskDetails.children.cardContent.children.approvalDetails.visible",
        false
      );
    }

    if (status === "cancelled")
      set(
        action,
        "screenConfig.components.div.children.headerDiv.children.helpSection.children.cancelledLabel.visible",
        true
      );

    setActionItems(action, obj);
    if (get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].additionalDetails.locality", null) === null) {
      dispatch(prepareFinalObject("WaterConnection[0].additionalDetails.locality", get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].additionalDetails.locality")));
    }
  }

  let applicationType = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].applicationType");
  console.log(applicationType, "Nero Application")
  if(getQueryArg(window.location.href, "applicationType") === "METER_REPLACEMENT" || applicationType === "METER_REPLACEMENT"){
      dispatch(
        handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.estimate",
          "visible",
          false
        )
      );
    }
  
};

let titleText = "";

const setStatusBasedValue = status => {
  switch (status) {
    case "approved":
      return {
        titleText: "Review the Trade License",
        titleKey: "WS_REVIEW_TRADE_LICENSE",
        titleVisibility: true,
        roleDefination: {
          rolePath: "user-info.roles",
          roles: ["WS_APPROVER"]
        }
      };
    case "pending_payment":
      return {
        titleText: "Review the Application and Proceed",
        titleKey: "WS_REVIEW_APPLICATION_AND_PROCEED",
        titleVisibility: true,
        roleDefination: {
          rolePath: "user-info.roles",
          roles: ["WS_CEMP"]
        }
      };
    case "pending_approval":
      return {
        titleText: "Review the Application and Proceed",
        titleKey: "WS_REVIEW_APPLICATION_AND_PROCEED",
        titleVisibility: true,
        roleDefination: {
          rolePath: "user-info.roles",
          roles: ["WS_APPROVER"]
        }
      };
    case "cancelled":
      return {
        titleText: "",
        titleVisibility: false,
        roleDefination: {}
      };
    case "rejected":
      return {
        titleText: "",
        titleVisibility: false,
        roleDefination: {}
      };

    default:
      return {
        titleText: "",
        titleVisibility: false,
        roleDefination: {}
      };
  }
};

const estimate = getCommonGrayCard({
  header: getCommonSubHeader({ labelKey: "WS_TASK_DETAILS_FEE_ESTIMATE" }),
  estimateSection: getFeesEstimateOverviewCard({
    sourceJsonPath: "dataCalculation",
    // isCardrequired: true
  }),
  buttonView: getDialogButton(
    "VIEW BREAKUP",
    "WS_PAYMENT_VIEW_BREAKUP",
    "search-preview"
  ),
  // addPenaltyRebateButton: {
  //   componentPath: "Button",
  //   props: {
  //     color: "primary",
  //     style: {}
  //   },
  //   children: {
  //     previousButtonLabel: getLabel({
  //       labelKey: "WS_PAYMENT_ADD_REBATE_PENALTY"
  //     })
  //   },
  //   onClickDefination: {
  //     action: "condition",
  //     callBack: (state, dispatch) => {
  //       showHideAdhocPopup(state, dispatch, "search-preview");
  //     }
  //   },
  //   visible: false
  // },
});

export const reviewConnectionDetails = getReviewConnectionDetails(false);

export const reviewOwnerDetails = getReviewOwner(false);

export const reviewModificationsDetails = reviewModificationsEffective(process.env.REACT_APP_NAME !== "Citizen");

export const reviewDocumentDetails = getReviewDocuments(false);

// let approvalDetails = getApprovalDetails(status);
let title = getCommonTitle({ labelName: titleText });

const setActionItems = (action, object) => {
  set(
    action,
    "screenConfig.components.div.children.taskDetails.children.cardContent.children.title",
    getCommonTitle({
      labelName: get(object, "titleText"),
      labelKey: get(object, "titleKey")
    })
  );
  set(
    action,
    "screenConfig.components.div.children.taskDetails.children.cardContent.children.title.visible",
    get(object, "titleVisibility")
  );
  set(
    action,
    "screenConfig.components.div.children.taskDetails.children.cardContent.children.title.roleDefination",
    get(object, "roleDefination")
  );
};

export const taskDetails = getCommonCard({
  title,
  estimate,
  reviewConnectionDetails,
  reviewDocumentDetails,
  reviewOwnerDetails,
  reviewModificationsDetails
});

export const summaryScreen = getCommonCard({
  reviewConnectionDetails,
  reviewModificationsDetails,
  reviewDocumentDetails,
  // reviewOwnerDetails
})

const screenConfig = {
  uiFramework: "material-ui",
  name: "search-preview",
  beforeInitScreen: (action, state, dispatch) => {
    const status = getQueryArg(window.location.href, "status");
    const tenantId = getQueryArg(window.location.href, "tenantId");
    let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    const queryObject = [
      { key: "tenantId", value: tenantId },
    ];

    setBusinessServiceDataToLocalStorage(queryObject, dispatch);
    //To set the application no. at the  top
    set(action.screenConfig, "components.div.children.headerDiv.children.header1.children.application.children.applicationNumber.props.number", applicationNumber);
    // if (status !== "pending_payment") {
    //   set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.viewBreakupButton.visible", false);
    // }
    if (isModifyMode()) {
      serviceModuleName = service === serviceConst.WATER ? "ModifyWSConnection" : "ModifySWConnection";
    }

    set(action, "screenConfig.components.adhocDialog.children.popup", adhocPopup);
    loadUlbLogo(tenantId);
    beforeInitFn(action, state, dispatch, applicationNumber);
    set(
      action,
      "screenConfig.components.div.children.headerDiv.children.header1.children.application.children.applicationNumber.props.number",
      applicationNumber
    );
    // set(action, 'screenConfig.components.div.children.taskStatus.props.dataPath', (service === serviceConst.WATER) ? "WaterConnection" : "SewerageConnection");
    set(action, 'screenConfig.components.div.children.taskStatus.props.moduleName', serviceModuleName);
    set(action, 'screenConfig.components.div.children.taskStatus.props.updateUrl', serviceUrl);
    set(action, 'screenConfig.components.div.children.taskStatus.props.bserviceTemp', (service === serviceConst.WATER) ? "WS.ONE_TIME_FEE" : "SW.ONE_TIME_FEE");
    set(action, 'screenConfig.components.div.children.taskStatus.props.redirectQueryString', redirectQueryString);
    set(action, 'screenConfig.components.div.children.taskStatus.props.editredirect', editredirect);
    return action;
  },

  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css search-preview"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header1: {
              gridDefination: {
                xs: 12,
                sm: 8
              },
              ...headerrow
            },
            helpSection: {
              uiFramework: "custom-atoms",
              componentPath: "Container",
              props: {
                color: "primary",
                style: { justifyContent: "flex-end" } //, dsplay: "block"
              },
              gridDefination: {
                xs: 12,
                sm: 4,
                align: "right"
              },
            }
          }
        },
        taskStatus: {
          uiFramework: "custom-containers-local",
          componentPath: "WorkFlowContainer",
          moduleName: "egov-workflow",
          // visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
          props: {
            dataPath: (service === serviceConst.WATER) ? "WaterConnection" : "WaterConnection",
            moduleName: serviceModuleName,
            updateUrl: serviceUrl,
            baseUrlTemp: 'wns',
            bserviceTemp: (service === serviceConst.WATER) ? "WS.ONE_TIME_FEE" : "SW.ONE_TIME_FEE",
            redirectQueryString: redirectQueryString,
            editredirect: editredirect,
            beforeSubmitHook: (data) => {
              data = data[0];
              set(data, 'propertyId', get(data, 'property.id', null));
              data.assignees = [];
              if (data.assignee) {
                data.assignee.forEach(assigne => {
                  data.assignees.push({
                    uuid: assigne
                  })
                })
              }
              data.processInstance = {
                documents: data.wfDocuments,
                assignes: data.assignees,
                comment: data.comment,
                action: data.action
              }
              data.waterSource = getWaterSource(data.waterSource, data.waterSubSource);
              return data;
            }
          }
        },
        // snackbarWarningMessage,
        taskDetails,
      }
    },
    breakUpDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-wns",
      componentPath: "ViewBreakupContainer",
      props: {
        open: false,
        maxWidth: "md",
        screenKey: "search-preview",
      }
    },
    adhocDialog: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-wns",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: "sm",
        screenKey: "search-preview"
      },
      children: {
        popup: {}
      }
    },
  }
};

//----------------- search code (feb17)---------------------- //
const searchResults = async (action, state, dispatch, applicationNumber, processInstanceAppStatus) => {
  let queryObjForSearch = [{ key: "tenantId", value: tenantId }, { key: "applicationNumber", value: applicationNumber }]
  let viewBillTooltip = [], estimate, payload = [];
  
  if (service === serviceConst.WATER || applicationNumber.includes('WS')) {
    set(
      action.screenConfig,
      "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewDiameter.visible",
      false
    );
    payload = [];
    payload = await getSearchResults(queryObjForSearch);
    
    let installmentInfo = get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsDataForInstallment.ws-services-calculation");
    
    let usageCategoryForInstallment = payload && payload.WaterConnection.length > 0 && payload.WaterConnection[0].usageCategory;
    let feeForConnectionType = payload && payload.WaterConnection.length > 0 && payload.WaterConnection[0].connectionType;
    let applicationStatus = payload && payload.WaterConnection.length > 0 && payload.WaterConnection[0].applicationStatus;
    let selectedLabourInstallment = installmentInfo && installmentInfo.LabourFeeInstallmentsInfo.filter(item => item.usageCategory === usageCategoryForInstallment)
    //let usageCategoryForInstallment = payload && payload.WaterConnection.length > 0 && payload.WaterConnection[0].usageCategory;
    let selectedScrutinyInstallment = installmentInfo && installmentInfo.ScrutinyFeeInstallmentsInfo.filter(item => item.usageCategory === usageCategoryForInstallment)
    // dispatch(prepareFinalObject(
    //   "WaterConnection[0].additionalDetails.scrutinyFeeTotalAmount", selectedScrutinyFee && selectedScrutinyFee[0].totalAmount
    // ))
    if(feeForConnectionType === "Non Metered" && applicationStatus != "INITIATED" && applicationStatus != "PENDING_FOR_DOCUMENT_VERIFICATION"){
      if(usageCategoryForInstallment === "DOMESTIC"){
      set(payload, 'WaterConnection[0].additionalDetails.scrutinyFeeTotalAmount', selectedScrutinyInstallment && selectedScrutinyInstallment[0].totalAmount);
      set(payload, 'WaterConnection[0].additionalDetails.totalAmount', selectedLabourInstallment && selectedLabourInstallment[0].totalAmount);
      }
      if(usageCategoryForInstallment === "BPL" || usageCategoryForInstallment === "ROADSIDEEATERS"){
        
        set(payload, 'WaterConnection[0].additionalDetails.totalAmount', selectedLabourInstallment && selectedLabourInstallment[0].totalAmount);
        }

    }
    let connectionFacility = payload && payload.WaterConnection && payload && 
    payload.WaterConnection.length > 0 && payload.WaterConnection[0].connectionFacility
    let connectionType = payload && payload.WaterConnection && payload && 
    payload.WaterConnection.length > 0 && payload.WaterConnection[0].connectionType
    if(connectionFacility == serviceConst.WATER){
      set(
        action.screenConfig,
        "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewDiameter.visible",
        false
      );
    }
    
    set(payload, 'WaterConnection[0].service', service);
    const convPayload = findAndReplace(payload, "NA", null)
    let queryObjectForEst = [{
      applicationNo: applicationNumber,
      tenantId: tenantId,
      waterConnection: convPayload.WaterConnection[0]
    }]
    // set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewFour.props.items[0].item0.children.cardContent.children.serviceCardContainer", getCommonContainer(connectionDetailsWater));

    // set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewFour.props.items[0].item0.children.cardContent.children.serviceCardContainerForSW.visible", false);
    // set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewFour.props.items[0].item0.children.cardContent.children.serviceCardContainerForWater.visible", true);
    if(connectionFacility && connectionFacility == serviceConst.WATER){
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixVS.visible", false);
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixWS.visible", true);
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixBoth.visible", false);
    }else if(connectionFacility == serviceConst.WATERSEWERAGE){
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixVS.visible", false);
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixWS.visible", false);
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixBoth.visible", true);
    }else{
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixVS.visible", true);
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixWS.visible", false);
      set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixBoth.visible", false);
    }
    if (payload !== undefined && payload !== null) {
      dispatch(prepareFinalObject("WaterConnection[0]", payload.WaterConnection[0]));
      if(payload && payload.WaterConnection[0].noOfFlats && parseInt(payload.WaterConnection[0].noOfFlats) && parseInt(payload.WaterConnection[0].noOfFlats) > 0){
        dispatch(prepareFinalObject("WaterConnection[0].apartment", 'Yes'));
      }else{
        dispatch(prepareFinalObject("WaterConnection[0].apartment", 'No')); 
      }
      if((connectionFacility == serviceConst.WATER || connectionFacility == serviceConst.WATERSEWERAGE)){
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewThirdTeen",
          "visible",
          true
        ));
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFifteen",
          "visible",
          connectionType == 'Non Metered' ? true :false
        ));
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixteen",
          "visible",
          connectionType == 'Non Metered' ? true :false
        ));
      }else{
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFifteen",
          "visible",
          connectionType == 'Non Metered' ? true :false
        ));
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixteen",
          "visible",
          connectionType == 'Non Metered' ? true :false
        ));
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewThirdTeen",
          "visible",
          false
        ));
      }
      let localizationLabels = {}
      if (state && state.app) localizationLabels = (state.app && state.app.localizationLabels) || {};
      let locality = `${tenantId.toUpperCase().replace(/[.]/g, "_")}_REVENUE_${payload.WaterConnection[0].additionalDetails.locality
        .toUpperCase()
        .replace(/[._:-\s\/]/g, "_")}`;
      dispatch(prepareFinalObject("WaterConnection[0].locality",payload.WaterConnection[0].additionalDetails.locality))
      if (get(payload, "WaterConnection[0].property.status", "") !== "ACTIVE") {
        set(action.screenConfig, "components.div.children.snackbarWarningMessage.children.clickHereLink.props.propertyId", get(payload, "WaterConnection[0].property.propertyId", ""));
        set(action.screenConfig, "components.div.children.snackbarWarningMessage.children.clickHereLink.visible", true);
      }
      if (!payload.WaterConnection[0].connectionHolders || payload.WaterConnection[0].connectionHolders === 'NA') {
        set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewFive.visible", false);
        set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewSix.visible", true);
      } else {
        set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewSix.visible", false);
        set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewFive.visible", true);
      }
    }
    if (processInstanceAppStatus === "CONNECTION_ACTIVATED") {
      let connectionNumber = payload.WaterConnection[0].connectionNo;
      set(action.screenConfig, "components.div.children.headerDiv.children.header1.children.connection.children.connectionNumber.props.number", connectionNumber);
    } else {
      set(action.screenConfig, "components.div.children.headerDiv.children.header1.children.connection.children.connectionNumber.visible", false);
    }

    // to set documents 
    if (payload.WaterConnection[0].documents !== null && payload.WaterConnection[0].documents !== "NA") {
      await setDocuments(
        state.screenConfiguration.preparedFinalObject,
        "WaterConnection[0].documents",
        "DocumentsData",
        dispatch,
        "WS"
      );
    }
    estimate = await waterEstimateCalculation(queryObjectForEst, dispatch);
    if (estimate !== null && estimate !== undefined) {
      if (estimate.Calculation.length > 0) {
        await processBills(estimate, viewBillTooltip, dispatch);

        // viewBreakUp 
        estimate.Calculation[0].billSlabData = _.groupBy(estimate.Calculation[0].taxHeadEstimates, 'category')
        estimate.Calculation[0].appStatus = processInstanceAppStatus;
        dispatch(prepareFinalObject("dataCalculation", estimate.Calculation[0]));
      }
    }

    if (isModifyMode()) {
      let connectionNo = payload.WaterConnection[0].connectionNo;
      let queryObjForSearchApplications = [{ key: "tenantId", value: tenantId }, { key: "connectionNumber", value: connectionNo }, { key: "isConnectionSearch", value: true }]
      let oldApplicationPayload = await getSearchResults(queryObjForSearchApplications);
      oldApplicationPayload.WaterConnection = oldApplicationPayload.WaterConnection.sort((row1,row2)=>row2.auditDetails.createdTime - row1.auditDetails.createdTime);
      if(oldApplicationPayload.WaterConnection.length>1){
        oldApplicationPayload.WaterConnection.shift();
      }
      const waterSource=oldApplicationPayload.WaterConnection[0].waterSource||'';
      oldApplicationPayload.WaterConnection[0].waterSource=waterSource.includes("null") ? "NA" : waterSource.split(".")[0];
      oldApplicationPayload.WaterConnection[0].waterSubSource=waterSource.includes("null") ? "NA" : waterSource.split(".")[1];
      if (oldApplicationPayload.WaterConnection.length > 0) {
        dispatch(prepareFinalObject("WaterConnectionOld", oldApplicationPayload.WaterConnection))
      dispatch(prepareFinalObject("WaterConnectionOld[0].locality",oldApplicationPayload.WaterConnection[0].additionalDetails.locality))
      }
      if(oldApplicationPayload && oldApplicationPayload.WaterConnection[0].noOfFlats && parseInt(oldApplicationPayload.WaterConnection[0].noOfFlats) && parseInt(oldApplicationPayload.WaterConnection[0].noOfFlats) > 0){
        dispatch(prepareFinalObject("WaterConnectionOld[0].apartment", 'Yes'));
      }else{
        dispatch(prepareFinalObject("WaterConnectionOld[0].apartment", 'No')); 
      }
      let connectionFacility = oldApplicationPayload && oldApplicationPayload.WaterConnection && oldApplicationPayload && 
      oldApplicationPayload.WaterConnection.length > 0 && oldApplicationPayload.WaterConnection[0].connectionFacility
      let connectionType = oldApplicationPayload && oldApplicationPayload.WaterConnection && oldApplicationPayload && 
      oldApplicationPayload.WaterConnection.length > 0 && oldApplicationPayload.WaterConnection[0].connectionType
      if((connectionFacility == 
        serviceConst.WATER) || (connectionFacility == serviceConst.WATERSEWERAGE)){
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewThirdTeen",
          "visible",
          true
        ));
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFifteen",
          "visible",
          connectionType == 'Non Metered' ? true :false
        ));
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixteen",
          "visible",
          connectionType == 'Non Metered' ? true :false
        ));
      }else{
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFifteen",
          "visible",
          true
        ));
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixteen",
          "visible",
          true
        ));
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewThirdTeen",
          "visible",
          false
        ));
      }
    }





  } 
  else if (service === serviceConst.SEWERAGE) {
    payload = [];
    payload = await getSearchResultsForSewerage(queryObjForSearch, dispatch);
    payload.SewerageConnections[0].service = service;
    // set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewFour.props.items[0].item0.children.cardContent.children.serviceCardContainer", getCommonContainer(connectionDetailsSewerage));
    // set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewFour.props.items[0].item0.children.cardContent.children.serviceCardContainerForWater.visible", false);
    set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixVS.visible", true);
    set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixWS.visible", false); 
    if (payload !== undefined && payload !== null) {
      dispatch(prepareFinalObject("SewerageConnection[0]", payload.SewerageConnections[0]));
      let localizationLabels = {}
      if (state && state.app) localizationLabels = (state.app && state.app.localizationLabels) || {};
      let locality = `${tenantId.toUpperCase().replace(/[.]/g, "_")}_REVENUE_${payload.SewerageConnections[0].additionalDetails.locality
        .toUpperCase()
        .replace(/[._:-\s\/]/g, "_")}`;
      dispatch(prepareFinalObject("SewerageConnection[0].locality",payload.SewerageConnections[0].additionalDetails.locality))
      dispatch(prepareFinalObject("WaterConnection[0]", payload.SewerageConnections[0]));
      if(payload && payload.SewerageConnections && payload.SewerageConnections[0].noOfFlats && parseInt(payload.SewerageConnections[0].noOfFlats) && parseInt(payload.SewerageConnections[0].noOfFlats) > 0){
        dispatch(prepareFinalObject("SewerageConnections[0].apartment", 'Yes'));
        dispatch(prepareFinalObject("WaterConnection[0].apartment", 'Yes'));
      }else{
        dispatch(prepareFinalObject("SewerageConnections[0].apartment", 'No'));
        dispatch(prepareFinalObject("WaterConnection[0].apartment", 'No')); 
      }
      if(applicationNumber && applicationNumber.includes('WS')){
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewThirdTeen",
          "visible",
          true
        ));
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFifteen",
          "visible",
          true
        ));
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixteen",
          "visible",
          true
        ));
      }else{
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFifteen",
          "visible",
          true
        ));
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSixteen",
          "visible",
          true
        ));
        dispatch(handleField(
          "search-preview",
          "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewThirdTeen",
          "visible",
          false
        ));
      }
      dispatch(prepareFinalObject("WaterConnection[0].locality",payload.SewerageConnections[0].additionalDetails.locality))
      if (!payload.SewerageConnections[0].connectionHolders || payload.SewerageConnections[0].connectionHolders === 'NA') {
        set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewFive.visible", false);
        set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewSix.visible", true);
      } else {
        set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewSix.visible", false);
        set(action.screenConfig, "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewFive.visible", true);
      }
      if (isModifyMode()) {
        let connectionNo = payload.SewerageConnections[0].connectionNo;
        let queryObjForSearchApplications = [{ key: "tenantId", value: tenantId }, { key: "connectionNumber", value: connectionNo }, { key: "isConnectionSearch", value: true }]
        let oldApplicationPayload = await getSearchResultsForSewerage(queryObjForSearchApplications,dispatch);
        oldApplicationPayload.SewerageConnections = oldApplicationPayload.SewerageConnections.filter(row => {
          return row.applicationType !== "MODIFY_SEWERAGE_CONNECTION"
        })
        if (oldApplicationPayload.SewerageConnections.length > 0) {
          dispatch(prepareFinalObject("SewerageConnectionOld[0]", oldApplicationPayload.SewerageConnections[0]))
          dispatch(prepareFinalObject("WaterConnectionOld[0]",oldApplicationPayload.SewerageConnections[0]));
          dispatch(prepareFinalObject("WaterConnectionOld[0].locality",oldApplicationPayload.SewerageConnections && 
          oldApplicationPayload.SewerageConnections[0] && oldApplicationPayload.SewerageConnections[0].additionalDetails && 
          oldApplicationPayload.SewerageConnections[0].additionalDetails.locality))
          dispatch(prepareFinalObject("SewerageConnectionOld[0].locality",oldApplicationPayload.SewerageConnections && 
          oldApplicationPayload.SewerageConnections[0] && oldApplicationPayload.SewerageConnections[0].additionalDetails && 
          oldApplicationPayload.SewerageConnections[0].additionalDetails.locality))
        }
        if(oldApplicationPayload && oldApplicationPayload.SewerageConnections && oldApplicationPayload.SewerageConnections[0].noOfFlats && parseInt(oldApplicationPayload.SewerageConnections[0].noOfFlats) && parseInt(oldApplicationPayload.SewerageConnections[0].noOfFlats) > 0){
          dispatch(prepareFinalObject("SewerageConnectionOld[0].apartment", 'Yes'));
          dispatch(prepareFinalObject("WaterConnectionOld[0].apartment", 'Yes'));
        }else{
          dispatch(prepareFinalObject("SewerageConnectionOld[0].apartment", 'No'));
          dispatch(prepareFinalObject("WaterConnectionOld[0].apartment", 'No'));
        }
        if(applicationNumber && applicationNumber.includes('WS')){
          dispatch(handleField(
            "search-preview",
            "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewThirdTeen",
            "visible",
            true
          ));
        }else{
          dispatch(handleField(
            "search-preview",
            "components.div.children.taskDetails.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewThirdTeen",
            "visible",
            false
          ));
        }
      }
    }
    //connection number display
    if (processInstanceAppStatus === "CONNECTION_ACTIVATED") {
      let connectionNumber = payload.SewerageConnections[0].connectionNo;
      set(action.screenConfig, "components.div.children.headerDiv.children.header1.children.connection.children.connectionNumber.props.number", connectionNumber);
    } else {
      set(action.screenConfig, "components.div.children.headerDiv.children.header1.children.connection.children.connectionNumber.visible", false);
    }

    // to set documents 
    if (payload.SewerageConnections[0].documents !== null && payload.SewerageConnections[0].documents !== "NA") {
      await setDocuments(
        state.screenConfiguration.preparedFinalObject,
        "WaterConnection[0].documents",
        "DocumentsData",
        dispatch,
        "WS"
      );
    }

    const convPayload = findAndReplace(payload, "NA", null)
    let queryObjectForEst = [{
      applicationNo: applicationNumber,
      tenantId: tenantId,
      sewerageConnection: convPayload.SewerageConnections[0]
    }]
    estimate = await swEstimateCalculation(queryObjectForEst, dispatch);
    let viewBillTooltip = []
    if (estimate !== null && estimate !== undefined) {
      if (estimate.Calculation !== undefined && estimate.Calculation.length > 0) {
        await processBills(estimate, viewBillTooltip, dispatch);
        // viewBreakUp 
        estimate.Calculation[0].billSlabData = _.groupBy(estimate.Calculation[0].taxHeadEstimates, 'category')
        estimate.Calculation[0].appStatus = processInstanceAppStatus;
        dispatch(prepareFinalObject("dataCalculation", estimate.Calculation[0]));
      }
    }
  }
  if (estimate !== null && estimate !== undefined) {
    createEstimateData(estimate.Calculation[0].taxHeadEstimates, "taxHeadEstimates", dispatch, {}, {});
  }
};

const parserFunction = (obj) => {
  let parsedObject = {
    roadCuttingArea: parseInt(obj.roadCuttingArea),
    meterInstallationDate: convertDateToEpoch(obj.meterInstallationDate),
    connectionExecutionDate: convertDateToEpoch(obj.connectionExecutionDate),
    proposedWaterClosets: parseInt(obj.proposedWaterClosets),
    proposedToilets: parseInt(obj.proposedToilets),
    roadCuttingArea: parseInt(obj.roadCuttingArea),
    noOfFlats: parseInt(obj.noOfFlats) > 0 ? parseInt(obj.noOfFlats) : 0,
    additionalDetails: {
      initialMeterReading: (
        obj.additionalDetails !== undefined &&
        obj.additionalDetails.initialMeterReading !== undefined
      ) ? parseFloat(obj.additionalDetails.initialMeterReading) : null,
      detailsProvidedBy: (
        obj.additionalDetails !== undefined &&
        obj.additionalDetails.detailsProvidedBy !== undefined &&
        obj.additionalDetails.detailsProvidedBy !== null
      ) ? obj.additionalDetails.detailsProvidedBy : "",
      meterMake:(
        obj.additionalDetails !== undefined &&
        obj.additionalDetails.meterMake !== undefined
      ) ? (obj.additionalDetails.meterMake) : "",
      maxMeterDigits:(
        obj.additionalDetails !== undefined &&
        obj.additionalDetails.maxMeterDigits !== undefined
      ) ? (obj.additionalDetails.maxMeterDigits) : "",
      meterReadingRatio: (
        obj.additionalDetails !== undefined &&
        obj.additionalDetails.meterReadingRatio !== undefined
      ) ? (obj.additionalDetails.meterReadingRatio) : "",
      diameter: (
        obj.additionalDetails !== undefined &&
        obj.additionalDetails.diameter !== undefined
      ) ? (obj.additionalDetails.diameter) : "",
      // isLabourFeeApplicable: (
      //   obj.additionalDetails !== undefined &&
      //   obj.additionalDetails.isLabourFeeApplicable !== undefined
      // ) ? (obj.additionalDetails.isLabourFeeApplicable) : "",
      // isInstallmentApplicable: (
      //   obj.additionalDetails !== undefined &&
      //   obj.additionalDetails.isInstallmentApplicable !== undefined
      // ) ? (obj.additionalDetails.isInstallmentApplicable) : "",
      isVolumetricConnection: (
        obj.additionalDetails !== undefined &&
        obj.additionalDetails.isVolumetricConnection !== undefined
      ) ? (obj.additionalDetails.isVolumetricConnection) : "",
      volumetricWaterCharge: (
        obj.additionalDetails !== undefined &&
        obj.additionalDetails.volumetricWaterCharge !== undefined
      ) ? (obj.additionalDetails.volumetricWaterCharge) : "",
      isDailyConsumption: (
        obj.additionalDetails !== undefined &&
        obj.additionalDetails.isDailyConsumption !== undefined
      ) ? (obj.additionalDetails.isDailyConsumption) : "",
      volumetricConsumtion: (
        obj.additionalDetails !== undefined &&
        obj.additionalDetails.volumetricConsumtion !== undefined
      ) ? (obj.additionalDetails.volumetricConsumtion) : "",

      isLabourFeeApplicable: (
        obj.additionalDetails !== undefined &&
        obj.additionalDetails.isLabourFeeApplicable !== undefined
      ) ? (obj.additionalDetails.isLabourFeeApplicable) : "",
      isInstallmentApplicable: (
        obj.additionalDetails !== undefined &&
        obj.additionalDetails.isInstallmentApplicable !== undefined
      ) ? (obj.additionalDetails.isInstallmentApplicable) : "",


      noOfLabourFeeInstallments: (
        obj.additionalDetails !== undefined &&
        obj.additionalDetails.noOfLabourFeeInstallments !== undefined
      ) ? (obj.additionalDetails.noOfLabourFeeInstallments) : "",
      labourFeeInstallmentAmount: (
        obj.additionalDetails !== undefined &&
        obj.additionalDetails.labourFeeInstallmentAmount !== undefined
      ) ? (obj.additionalDetails.labourFeeInstallmentAmount) : "",
      totalAmount: (
        obj.additionalDetails !== undefined &&
        obj.additionalDetails.totalAmount !== undefined
      ) ? (obj.additionalDetails.totalAmount) : "",


      isInstallmentApplicableForScrutinyFee: (
        obj.additionalDetails !== undefined &&
        obj.additionalDetails.isInstallmentApplicableForScrutinyFee !== undefined
      ) ? (obj.additionalDetails.isInstallmentApplicableForScrutinyFee) : "",

      noOfScrutinyFeeInstallments: (
        obj.additionalDetails !== undefined &&
        obj.additionalDetails.noOfScrutinyFeeInstallments !== undefined
      ) ? (obj.additionalDetails.noOfScrutinyFeeInstallments) : "",

      scrutinyFeeInstallmentAmount: (
        obj.additionalDetails !== undefined &&
        obj.additionalDetails.scrutinyFeeInstallmentAmount !== undefined
      ) ? (obj.additionalDetails.scrutinyFeeInstallmentAmount) : "",

      scrutinyFeeTotalAmount: (
        obj.additionalDetails !== undefined &&
        obj.additionalDetails.scrutinyFeeTotalAmount !== undefined
      ) ? (obj.additionalDetails.scrutinyFeeTotalAmount) : "",

      
      
    },
    dateEffectiveFrom: convertDateToEpoch(obj.dateEffectiveFrom),
    noOfTaps: parseInt(obj.noOfTaps),
    proposedTaps: parseInt(obj.proposedTaps),
    plumberInfo: (obj.plumberInfo === null || obj.plumberInfo === "NA") ? [] : obj.plumberInfo
  }
  obj = { ...obj, ...parsedObject }
  return obj;
}

const processBills = async (data, viewBillTooltip, dispatch) => {
  let des, obj, groupBillDetails = [];
  let appNumber = data.Calculation[0].applicationNo;
  data.Calculation[0].taxHeadEstimates.forEach(async element => {
    let cessKey = element.taxHeadCode
    let body;
    if (service === serviceConst.WATER || appNumber.includes("WS")) {
      body = { "MdmsCriteria": { "tenantId": tenantId, "moduleDetails": [{ "moduleName": "ws-services-calculation", "masterDetails": [{ "name": cessKey }] }] } }
    } else {
      body = { "MdmsCriteria": { "tenantId": tenantId, "moduleDetails": [{ "moduleName": "sw-services-calculation", "masterDetails": [{ "name": cessKey }] }] } }
    }
    let res = await getDescriptionFromMDMS(body, dispatch)
    if (res !== null && res !== undefined && res.MdmsRes !== undefined && res.MdmsRes !== null) {
      if (service === serviceConst.WATER || appNumber.includes("WS")) { des = res.MdmsRes["ws-services-calculation"]; }
      else { des = res.MdmsRes["sw-services-calculation"]; }
      if (des !== null && des !== undefined && des[cessKey] !== undefined && des[cessKey][0] !== undefined && des[cessKey][0] !== null) {
        groupBillDetails.push({ key: cessKey, value: des[cessKey][0].description, amount: element.estimateAmount, order: element.order })
      } else {
        groupBillDetails.push({ key: cessKey, value: 'Please put some description in mdms for this Key', amount: element.estimateAmount, category: element.category })
      }
    }
  })
  obj = { bill: groupBillDetails }
  viewBillTooltip.push(obj);
  const dataArray = [{ total: data.Calculation[0].totalAmount }]
  const finalArray = [{ description: viewBillTooltip, data: dataArray }]
  dispatch(prepareFinalObject("viewBillToolipData", finalArray));
}


export default screenConfig;
