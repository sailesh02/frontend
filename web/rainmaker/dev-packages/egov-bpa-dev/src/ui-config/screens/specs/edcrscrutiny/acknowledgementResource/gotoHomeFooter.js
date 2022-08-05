import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { ifUserRoleExists } from "../../utils";
import { getLocaleLabels, getQueryArg, getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import store from "ui-redux/store";
import { getAppSearchResults } from "../../../../../ui-utils/commons"
import set from "lodash/set"
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { httpRequest, edcrHttpRequest } from "../../../../../ui-utils/api"
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {getBpaTextToLocalMapping } from "../../utils"

const getCommonApplyFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer"
    },
    children
  };
};

const getRedirectionURL = () => {
  /* Mseva 2.0 changes */
  const redirectionURL = ifUserRoleExists("CITIZEN")
    ? // ? "/tradelicense-citizen/home"
      "/"
    : "/inbox";
  return redirectionURL;
};

const getRedirectionOCURL = () => {
  let state = store.getState();
  let tenantId = getQueryArg(window.location.href, "tenantId");
  let edcrNumber = get( state.screenConfiguration.preparedFinalObject, "edcrDetail[0].edcrNumber", "");
  if(!edcrNumber) {
    edcrNumber = getQueryArg(window.location.href, "edcrNumber");
  }
  let url = `/oc-bpa/apply?tenantId=${tenantId}&edcrNumber=${edcrNumber}`;
  return url;
};

const getRedirectionBPAURL = () => {
  let state = store.getState();
  let tenantId = getQueryArg(window.location.href, "tenantId");
  let edcrNumber = get( state.screenConfiguration.preparedFinalObject, "edcrDetail[0].edcrNumber", "");
  if(!edcrNumber) {
    edcrNumber = getQueryArg(window.location.href, "edcrNumber");
  }
  let url = `/egov-bpa/apply?tenantId=${tenantId}&edcrNumber=${edcrNumber}`;
  return url;
};

const updateBpaAppWithNewScrutiny = async (state, dispatch) =>{
  let edcrNumber = getQueryArg(window.location.href, "edcrNumber");
  let bpaApp = getQueryArg(window.location.href, "bpaApp");
  let oldEdcr = getQueryArg(window.location.href, "oldEdcr");
  
  let tenandId = getQueryArg(window.location.href, "tenantId");
  let type = getQueryArg(window.location.href, "type");
    let bservice = getQueryArg(window.location.href, "bservice");
  const response = await getAppSearchResults([
    {
      key: "tenantId",
      value: tenandId
    },
    { key: "applicationNo", value: bpaApp }
  ]).then(async(res)=>{
    try {
      let payload = res && res.BPA[0];
    set(payload, "edcrNumber", edcrNumber);
    set(payload, "additionalDetails", {applicationType: "edcrNoUpdation"});
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
    
   
      let response = await httpRequest(
        "post",
        "bpa-services/v1/bpa/_update",
        "",
        [],
        { BPA: payload }
      );  
      if(response){
        let url = `/egov-bpa/acknowledgement?purpose=rework_on_bpa&status=success&applicationNumber=${payload.applicationNo}&tenantId=${payload.tenantId}&type=${type}&bservice=${bservice}`
        dispatch(setRoute(url));
      }
    } catch (error) {
      console.log(error, "Error")
    }

  })
}

export const reworkActionsContainer = () => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      style: { textAlign: "right", display: "flex" }
    },
    children: {
      downloadMenu: {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-bpa",
        componentPath: "MenuButton",
        props: {
          data: {
            label: {labelName : "Take Action" , labelKey :"WF_TAKE_ACTION"},
            rightIcon: "arrow_drop_down",
            props: { variant: "contained", style: { height: "60px", color : "#fff", backgroundColor: "#FE7A51", } },
            menu: {}
          }
        }
      },
    },
  }
};

export const ReworkActionFooterForRework = getCommonApplyFooter({
  
  reworkActions: {
    uiFramework: "custom-atoms",
              componentPath: "Container",
              props: {
                color: "primary",
                style: { justifyContent: "flex-end" }
              },
              children: {
                buttons : reworkActionsContainer()
              },
              visible: true
  }
});
export const gotoHomeFooter = getCommonApplyFooter({
  gotoHome: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      }
    },
    children: {
      downloadReceiptButtonLabel: getLabel({
        labelName: "GO TO HOME",
        labelKey: "BPA_HOME_BUTTON"
      })
    },
    onClickDefination: {
      action: "page_change",
       path: getRedirectionURL()
    }
  },
  ocCreateApp: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      },
      // disabled: true
    },
    children: {
      downloadReceiptButtonLabel: getLabel({
        labelName: "CREATE OCUPANCY CERTIFICATE APPLICATION",
        labelKey: "EDCR_OC_CREATE_APP_BUTTON"
      })
    },
    onClickDefination: {
      action: "page_change",
       path: getRedirectionOCURL()
    },
    visible : false
  },
  bpaCreateApp: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      },
    },
    children: {
      downloadReceiptButtonLabel: getLabel({
        labelName: "CREATE BUILDING PLAN APPLICATION",
        labelKey: "EDCR_CREATE_APP_BUTTON"
      })
    },
    onClickDefination: {
      action: "page_change",
       path: getRedirectionBPAURL()
    },
    visible : false
  },
  createRevisionApp: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      },
    },
    children: {
      downloadReceiptButtonLabel: getLabel({
        labelName: "SUBMIT",
        labelKey: "EDCR_CREATE_APP_BUTTON"
      })
    },
    visible : false,
  //   onClickDefination: {
  //     action: "condition",
  //     callBack: (state, dispatch) => {
  //       getRedirectionBPAURL();
  //     }
  // },
  onClickDefination: {
    action: "page_change",
     path: getRedirectionBPAURL()
  },
    visible : false
  }
});
