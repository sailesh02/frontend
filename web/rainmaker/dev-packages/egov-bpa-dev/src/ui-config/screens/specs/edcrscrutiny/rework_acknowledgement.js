import {
  getCommonHeader,
  getCommonContainer,
  getCommonCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { ReworkActionFooterForRework } from "./acknowledgementResource/gotoHomeFooter";
import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import set from "lodash/set";
import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import axios from "axios";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResultsfromEDCRWithApplcationNo, setEdcrData, getEdcrDetails } from "./functions";
import { downloadPrintContainerForRework } from "./acknowledgementResource/acknowledgementUtils";
import { scrutinySummaryForHistory } from "../egov-bpa/summaryResource/scrutinySummary"
import {httpRequest}  from "../../../../ui-utils/api"
import {getAppSearchResults} from "../../../../ui-utils/commons"
import commonConfig from "config/common.js";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import store from "ui-redux/store";
import { getOcEdcrDetails } from "../utils";

var applicationNumber = getQueryArg(
  window.location.href,
  "edcrNumber", ""
);

export const callBackForReworkActions = async (state, dispatch, action) => {
  let payload = get(state, "screenConfiguration.preparedFinalObject.BPA");
  var tenantId = getQueryArg(
    window.location.href,
    "tenantId", ""
  ); 
  var bpaApp = getQueryArg(
    window.location.href,
    "bpaApp", ""
  ); 

  var type = getQueryArg(
    window.location.href,
    "type", ""
  );
  
  var bservice = getQueryArg(
    window.location.href,
    "bservice", ""
  );

  var oldEdcr = getQueryArg(
    window.location.href,
    "oldEdcr", ""
  );
  var edcrNumber = getQueryArg(
    window.location.href,
    "edcrNumber", ""
  );
  let applicantName = getQueryArg(window.location.href, "applicantName");
    let serviceType = getQueryArg(window.location.href, "serviceType");  

console.log(action, "Nero Action")
if(action && action === "GO_TO_HOME"){
  dispatch(
    setRoute("/")
  );
}else if(action && action === "GOTO_BPA_APP"){
  let bpaAppUrl = `/citizen/egov-bpa/search-preview?applicationNumber=${bpaApp}&tenantId=${tenantId}&type=${type}&bservice=${bservice}`;
  var win = window.open(bpaAppUrl, '_blank');
  if(win){
    win.focus();
  }
}else if(action && action === "GOTO_RESCRUTINY"){

let rescrutinyUrl = `/edcrscrutiny/apply?purpose=REWORK&tenantId=${tenantId}&applicantName=${applicantName}&serviceType=${serviceType}&bpaApp=${bpaApp}&oldEdcr=${oldEdcr}&type=${type}&bservice=${bservice}`; 
dispatch(
    setRoute(rescrutinyUrl)
  );
}else if(action && action === "FORWARD"){

  let currentEdcrInfo = get(state, "screenConfiguration.preparedFinalObject.scrutinyDetailsForHistory");
  let OldEdcrDetail = await getEdcrDetails(oldEdcr, tenantId);
  //TODOs: Need to compare with BPA Business service not with Edcr Detail
  let currentEdcrBService = get(currentEdcrInfo, "planDetail.planInformation.businessService")
  let oldEdcrBService = get(OldEdcrDetail, "planDetail.planInformation.businessService")
  console.log(currentEdcrBService, oldEdcrBService, "Nero Bservice")
  
  let bServiceMatched = false;
  if(currentEdcrBService.includes("|")){
      if(currentEdcrBService.includes(oldEdcrBService)){
          bServiceMatched = true;
      }
  }else{
      if(oldEdcrBService.includes(currentEdcrBService)){
          bServiceMatched = true;
      } 
  }

  if(!bServiceMatched){
      let errorMessage = {
          labelName: "Please confirm the declaration!",
         // labelKey: `New Scrutiny business service(${currentEdcrBService}) can not be different from previous scrutiny business service(${oldEdcrBService}). Please resubmit correct scrutiny.`
          labelKey: "BPA_REWORK_MISMATCHED_BSERVICE"
        };
        dispatch(toggleSnackbar(true, errorMessage, "error"));
        return false
  }
  

  let currentEdcrRiskType = get(currentEdcrInfo, "planDetail.planInformation.riskType")
  let payload = get(state, "screenConfiguration.preparedFinalObject.BPA");
  payload.workflow = {action: "FORWARD_TO_APPROVER"}
  set(payload, "edcrNumber", edcrNumber);
 // set(payload, "additionalDetails", {applicationType: "edcrNoUpdation"});
  let reworkHistoryExist = payload && payload.reWorkHistory;
  let edcrHistoryItem = {};
  let dateObj = new Date();
  
  if(reworkHistoryExist){
    edcrHistoryItem.edcrnumber = oldEdcr;
    edcrHistoryItem.createdtime = dateObj.getTime()
    reworkHistoryExist.edcrHistory.push(edcrHistoryItem);
  }else{
    edcrHistoryItem = {edcrHistory: [{edcrnumber: oldEdcr, createdtime: dateObj.getTime()}]}
    reworkHistoryExist = edcrHistoryItem;
  }
  set(payload, "reWorkHistory", reworkHistoryExist);
  set(payload, "riskType", currentEdcrRiskType);


  try {
    let response = await httpRequest(
      "post",
      "bpa-services/v1/bpa/_update",
      "",
      [],
      { BPA: payload }
    );  
    if(response){
      let url = `/egov-bpa/acknowledgement?purpose=FORWARD&status=success&applicationNumber=${payload.applicationNo}&tenantId=${payload.tenantId}`
      dispatch(setRoute(url));
    }
  } catch (error) {
    console.log(error, "Error")
  }

}

}

const populateActionDropDown = (action, state, dispatch) => {
  let downloadMenu = [];
  let gotoHome = {
    label: { labelName: "GO TO HOME", labelKey: "BPA_HOME_BUTTON", },
    link: () => {
      callBackForReworkActions(state, dispatch, "GO_TO_HOME");
    },
  };

  let status = getQueryArg(
    window.location.href,
    "status", ""
  );
  let purpose = getQueryArg(
    window.location.href,
    "purpose", ""
  );
  
  let forwardObject = {
    label: { labelName: "FORWARD", labelKey: "BPA_SUBMIT_BUTTON" },
    link: () => {
      callBackForReworkActions(state, dispatch, "FORWARD");
    },
  };
  
  let goToBpaApp = {
    label: { labelName: "Go TO BPA APPLICATION", labelKey: "BPA_GOTO_BPA_APP_BUTTON" },
    link: () => {
      callBackForReworkActions(state, dispatch, "GOTO_BPA_APP");
    },
  };
  let goForRescrutiny = {
    label: { labelName: "Go TO RESCRUTINY", labelKey: "BPA_GOTO_RESCRUTINY_BUTTON" },
    link: () => {
      callBackForReworkActions(state, dispatch, "GOTO_RESCRUTINY");
    },
  };

  if(purpose === "apply" && status === "success"){
    downloadMenu = [gotoHome, forwardObject, goToBpaApp, goForRescrutiny];
  }else{
    downloadMenu = [gotoHome, goToBpaApp, goForRescrutiny];
  }
  
  dispatch(
    handleField(
      "rework_acknowledgement",
      "components.div.children.ReworkActionFooterForRework.children.reworkActions.children.buttons.children.downloadMenu",
      "props.data.menu",
      downloadMenu
    )
  );
}
// const getDownloadContainer = () => {
//   let state = store.getState();
//   let scrutinyObj = get(state, "screenConfiguration.preparedFinalObject.scrutinyDetailsForHistory")
//   downloadPrintContainer(scrutinyObj && scrutinyObj.planReport);
// }

const headerrow = {
  uiFramework: "custom-atoms",
  componentPath: "Div",
  props: {
    style: { display: "flex", alignItems: "flex-start" }
  },
  children: {
    header1: getCommonContainer(
      {
        header: getCommonHeader({
          labelName: "New Building Plan Scrutiny",
          labelKey: "EDCR_ACKNOWLEDGEMENT_COMMON_CARD"
        }),
        applicationNumber: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-tradelicence",
          componentPath: "ApplicationNoContainer",
          props: {
            number: applicationNumber
          }
        }
      },
      {
        style: { display: "flex" }
      }
    ),
    buttons: downloadPrintContainerForRework()
  }
};

const getRequiredMdmsDetails = async (state, dispatch) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        
        {
          moduleName: "BPA",
          masterDetails: [
            {
              name: "DocTypeMapping"
            },
            {
              name: "CheckList"
            },
            {
              name: "RiskTypeComputation"
            },
            {
              name: "NocTypeMapping"
            }
          ]
        },
        

      ]
    }
  };
  let payload = await httpRequest(
    "post",
    "/egov-mdms-service/v1/_search",
    "_search",
    [],
    mdmsBody
  );
  dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
}

const setSuccessCards = (action, state, dispatch) => {
  let status = getQueryArg(
    window.location.href,
    "status", ""
  );
  let purpose = getQueryArg(
    window.location.href,
    "purpose", ""
  );
  if(purpose === "apply" && status === "success"){

    set(
      action,
      "screenConfig.components.div.children.applicationRejectedCard.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.applicationAbortedCard.visible",
      false
    );
    setEdcrData(action, state, dispatch)
  }else if (purpose === "apply" && status === "rejected"){
    

    set(
      action,
      "screenConfig.components.div.children.applicationSuccessCard.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.applicationAbortedCard.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.scrutinySummaryForHistory.visible",
      false
    );
    
  }else if (purpose === "apply" && status === "aborted"){
    

    set(
      action,
      "screenConfig.components.div.children.applicationSuccessCard.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.applicationRejectedCard.visible",
      false
    );

    set(
      action,
      "screenConfig.components.div.children.scrutinySummaryForHistory.visible",
      false
    );

    
  }
}
const setEdcrAndBPAData = async(action, state, dispatch)=>{
  let tenantId = getQueryArg(
    window.location.href,
    "tenantId", ""
  );
  let applicationNumber = getQueryArg(
    window.location.href,
    "bpaApp", ""
  );
  await getRequiredMdmsDetails(state, dispatch);
  const response = await getAppSearchResults([
    {
      key: "tenantId",
      value: tenantId
    },
    { key: "applicationNo", value: applicationNumber }
  ]);
  dispatch(prepareFinalObject("BPA", response.BPA[0]));
  
  populateActionDropDown(action, state, dispatch);
}
const screenConfig = {
  uiFramework: "material-ui",
  name: "rework_acknowledgement",
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      },
      children: {
        headerrow: headerrow,
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Building plan eDCR scrutiny is Accepted",
              labelKey: "EDCR_ACKNOWLEDGEMENT_SUCCESS_MESSAGE"
            },
            body: {
              labelName:
                "This plan can now be used for creating permit application",
              labelKey: "EDCR_ACKNOWLEDGEMENT_SUCCESS_COMMENT"
            },
            tailText: {
              labelName: "Building Plan Scrutiny Number",
              labelKey: "EDCR_NUMBER_LABEL"
            },
           
          })
        }
      },

      applicationRejectedCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "close",
            backgroundColor: "#E54D42",
            header: {
              labelName: "Building plan eDCR is Not Accepted",
              labelKey: "EDCR_REJECTION_MESSAGE"
            },
            body: {
              labelName: "Please make corrections in the diagram and try again",
              labelKey: "EDCR_REJECTION_COMMENT"
            }
          })
        }
      },

      applicationAbortedCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "close",
            backgroundColor: "#E54D42",
            header: {
              labelName: "Building plan eDCR is Aborted",
              labelKey: "EDCR_ABORTED_MESSAGE"
            },
            body: {
              labelName: "The uploaded plan is not drawn as per the standard's , please check the layers and colour coding standards and try again",
              labelKey: "EDCR_ABORTED_COMMENT"
            }
          })
        }
      },
      
      
        scrutinySummaryForHistory: scrutinySummaryForHistory,
        ReworkActionFooterForRework:ReworkActionFooterForRework
      }
    }
  },
  beforeInitScreen: (action, state, dispatch) => {
    const purpose = getQueryArg(window.location.href, "purpose");
    const status = getQueryArg(window.location.href, "status");
    const scrutinyType = getQueryArg(window.location.href, "scrutinyType");
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const tenant = getQueryArg(window.location.href, "tenantId");
    setEdcrAndBPAData(action, state, dispatch);
   let response =  getSearchResultsfromEDCRWithApplcationNo(applicationNumber, tenant, dispatch)
   console.log(response, "Nero Resonse")
    setSuccessCards(action, state, dispatch);   
    return action;
  }
};

export default screenConfig;
