import { getLabel, getCommonGrayCard, getCommonSubHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { ifUserRoleExists } from "../../utils";

import get from "lodash/get";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { createUpdateBpaApplication, submitBpaApplicationNOC } from "../../../../../ui-utils/commons";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "../../../../../ui-utils/api"
import {
  convertEpochToDate, getCommonCard,
  getCommonContainer,
  getCommonHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {getSiteInfo} from "../../utils"

let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
let tenant = getQueryArg(window.location.href, "tenantId");

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


export const gotoGenerateShowCausePage = async (state, dispatch, button) => {
  let appNo = get(state.screenConfiguration.preparedFinalObject, "BPA.applicationNo");
  let tenantId = get(state.screenConfiguration.preparedFinalObject, "BPA.tenantId");
  const url = `/egov-bpa/generateShowCauseNotice?applicationNumber=${appNo}&tenantId=${tenantId}&PURPOSE=${button}`
  dispatch(setRoute(url));
}

export const viewPaymentDetail = (state, dispatch) => {
  let appNo = get(state.screenConfiguration.preparedFinalObject, "BPA.applicationNo");
  let tenantId = get(state.screenConfiguration.preparedFinalObject, "BPA.tenantId");

  let status = get(state.screenConfiguration.preparedFinalObject, "BPA.status");
  let riskType = get(state.screenConfiguration.preparedFinalObject, "BPA.riskType");
  let isDemandGeneratedAndNotPaid = get(state.screenConfiguration.preparedFinalObject, "isDemandGeneratedAndNotPaid");
  let billbService
  if (riskType === "LOW") {
    //billbService = "BPA.LOW_RISK_PERMIT_FEE"
    billbService = ((status == "PENDING_APPL_FEE") ? "BPA.NC_APP_FEE" : "BPA.NC_SAN_FEE");
  } else {
    billbService = ((status == "PENDING_APPL_FEE") ? "BPA.NC_APP_FEE" : "BPA.NC_SAN_FEE");
  }

  let url;
  let siteInfo = getSiteInfo();
  console.log(getSiteInfo(), "Nero Hello")
  if(siteInfo === "citizen"){
    if(isDemandGeneratedAndNotPaid){
      url = `/citizen/egov-common/pay?consumerCode=${applicationNumber}&tenantId=${tenant}&businessService=${billbService}`;
    }else{
      url = `/citizen/pre-approved/view-installments?applicationNumber=${appNo}&tenantId=${tenantId}`
    }
    
  }else{
    if(isDemandGeneratedAndNotPaid){
      url = `/egov-common/pay?consumerCode=${applicationNumber}&tenantId=${tenant}&businessService=${billbService}`;
    }else{
    url = `/pre-approved/view-installments?applicationNumber=${appNo}&tenantId=${tenantId}`
    }
  }
  
  //dispatch(setRoute(url));
  window.location.href = url;
}
export const bpaMakePayment = async (state, dispatch) => {
  let status = get(state.screenConfiguration.preparedFinalObject, "BPA.status");
  let riskType = get(state.screenConfiguration.preparedFinalObject, "BPA.riskType");
  let billbService
  if (riskType === "LOW") {
    //billbService = "BPA.LOW_RISK_PERMIT_FEE"
    billbService = ((status == "PENDING_APPL_FEE") ? "BPA.NC_APP_FEE" : "BPA.NC_SAN_FEE");
  } else {
    billbService = ((status == "PENDING_APPL_FEE") ? "BPA.NC_APP_FEE" : "BPA.NC_SAN_FEE");
  }
  const makePaymentUrl = process.env.REACT_APP_SELF_RUNNING === "true"
    ? `/egov-ui-framework/egov-bpa/citizen-pay?applicationNumber=${applicationNumber}&tenantId=${tenant}&businessService=${billbService}`
    : `/egov-common/pay?consumerCode=${applicationNumber}&tenantId=${tenant}&businessService=${billbService}`;
  dispatch(setRoute(makePaymentUrl));
}

export const openPopupToReplyScn = async (state, dispatch, action) => {

  let toggle = get(
    state.screenConfiguration.screenConfig["search-preview"],
    "components.div.children.sendToArchPickerDialog.props.open",
    false
  );
  let bpaAction = "REPLY";
  dispatch(
    handleField("search-preview", "components.div.children.sendToArchPickerDialog.children.dialogContent.children.popup.children.header.children.key", "props.labelKey", "BPA_SCN_REPLY_HEADER")
  );

  dispatch(
    handleField("search-preview", "components.div.children.sendToArchPickerDialog", "props.open", !toggle)
  );
  dispatch(
    handleField("search-preview", "components.div.children.sendToArchPickerDialog.children.dialogContent.children.popup.children.cityPicker.children.cityDropdown", "props.applicationAction", bpaAction)
  );
}
export const updateBpaApplication = async (state, dispatch, action) => {
  let bpaStatus = get(state, "screenConfiguration.preparedFinalObject.BPA.status");
  let isDeclared = get(state, "screenConfiguration.preparedFinalObject.BPA.isDeclared");
  let bpaPreparedObj = get(state, "screenConfiguration.preparedFinalObject.BPA");
  let isSpclArchSelected = bpaPreparedObj.workflow;
  if(ifUserRoleExists("BPA_ARCHITECT") && bservice === "BPA5" && bpaStatus === "PENDING_FORWARD"){
    if (
      bpaPreparedObj.additionalDetails &&
      bpaPreparedObj.additionalDetails.assignes &&
      bpaPreparedObj.additionalDetails.assignes.length > 0
    ) {
      let assigneInfo = {
        assignes: [bpaPreparedObj.additionalDetails.assignes[0].uuid],
      };
  
      bpaPreparedObj.workflow = assigneInfo;
    }
  }
  
  let bservice = getQueryArg(window.location.href, "bservice");
  if (bservice === "BPA5" && bpaStatus === "PENDING_FORWARD" && !isSpclArchSelected) {

    dispatch(
      toggleSnackbar(
        true,
        { labelName: "Please select type of Document!", labelKey: "BPA_BPA5_SELECT_SPCL_ARCH_ERROR" },
        "error"
      )
    );
    return false;
  }
  let bpaAction, isArchitect = false, isCitizen = false, isCitizenBack = false;
  if (action && action === "SEND_TO_ARCHITECT") {
    bpaAction = "SEND_TO_ARCHITECT",
      isArchitect = true;
  }
  if (action && action === "APPROVE") {
    bpaAction = "APPROVE",
      isCitizen = true;
  }
  if (action && action === "SEND_BACK_TO_CITIZEN") {
    bpaAction = "SEND_BACK_TO_CITIZEN",
      isArchitect = true;
  }
  if (action && action === "REJECT") {
    bpaAction = "REJECT",
      isCitizen = true;
  }
  let bpaStatusAction = bpaStatus && bpaStatus.includes("CITIZEN_ACTION_PENDING")
  if (bpaStatusAction) {
    bpaAction = "FORWARD",
      isCitizenBack = true;
  }

  if (action && action === "INTIMATE_CONSTRUCT_START") {
    bpaAction = action,
      isCitizen = true;
    isDeclared = true;
  }

  let toggle = get(
    state.screenConfiguration.screenConfig["search-preview"],
    "components.div.children.sendToArchPickerDialog.props.open",
    false
  );

  if (bservice && bservice === "BPA5") {
    let bpaStatusAction = bpaStatus && bpaStatus.includes("PENDING_FORWARD")
    if (bpaStatusAction) {
      bpaAction = "FORWARD",
        isCitizenBack = true;
    }


    dispatch(
      handleField("search-preview", "components.div.children.sendToArchPickerDialog", "props.open", !toggle)
    );
    dispatch(
      handleField("search-preview", "components.div.children.sendToArchPickerDialog.children.dialogContent.children.popup.children.cityPicker.children.cityDropdown", "props.applicationAction", bpaAction)
    );

  } else {
    if ((isDeclared && isCitizen) || (isArchitect) || (isCitizenBack)) {
      dispatch(
        handleField("search-preview", "components.div.children.sendToArchPickerDialog", "props.open", !toggle)
      );
      dispatch(
        handleField("search-preview", "components.div.children.sendToArchPickerDialog.children.dialogContent.children.popup.children.cityPicker.children.cityDropdown", "props.applicationAction", bpaAction)
      );
    } else {
      let errorMessage = {
        labelName: "Please confirm the declaration!",
        labelKey: "BPA_DECLARATION_COMMON_LABEL"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }
  }


};

export const updateBpaApplicationAfterApproved = async (state, dispatch, action) => {
  let bpaAction = action;
  let toggle = get(
    state.screenConfiguration.screenConfig["search-preview"],
    "components.div.children.sendToArchPickerDialog.props.open",
    false
  );
  dispatch(
    handleField("search-preview", "components.div.children.sendToArchPickerDialog", "props.open", !toggle)
  );
  dispatch(
    handleField("search-preview", "components.div.children.sendToArchPickerDialog.children.dialogContent.children.popup.children.cityPicker.children.cityDropdown", "props.applicationAction", bpaAction)
  );

};
export const sendToArchContainer = () => {
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
            label: { labelName: "Take Action", labelKey: "WF_TAKE_ACTION" },
            rightIcon: "arrow_drop_down",
            props: { variant: "contained", style: { height: "60px", color: "#fff", backgroundColor: "#FE7A51", } },
            menu: {}
          }
        }
      },
    },
  }
};
export const buttonAfterApproved = () => {
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
            label: { labelName: "Take Action", labelKey: "WF_TAKE_ACTION" },
            rightIcon: "arrow_drop_down",
            props: { variant: "contained", style: { height: "60px", color: "#fff", backgroundColor: "#FE7A51", } },
            menu: {}
          }
        }
      },
    },
  }
};

export const updateAndApproveSpclArchBpaApplication = async (state, dispatch, action) => {

  let payload = get(state, "screenConfiguration.preparedFinalObject.BPA");
  payload.workflow = { action: "APPROVE" }
  try {
    let response = await httpRequest(
      "post",
      "bpa-services/v1/bpa/_update",
      "",
      [],
      { BPA: payload }
    );
    if (response) {
      let url = `/egov-bpa/acknowledgement?purpose=approved_by_accredited&status=success&applicationNumber=${payload.applicationNo}&tenantId=${payload.tenantId}`
      dispatch(setRoute(url));
    }
  } catch (error) {
    console.log(error, "Error")
  }

}
//Send to application Preview page 
export const previewAndForwardApplication = async (state, dispatch, action) => {

  let payload = get(state, "screenConfiguration.preparedFinalObject.BPA");
  payload.workflow = { action: "FORWARD_TO_APPROVER" }
  try {
    let response = await httpRequest(
      "post",
      "bpa-services/v1/bpa/_update",
      "",
      [],
      { BPA: payload }
    );
    if (response) {
      let url = `/egov-bpa/acknowledgement?purpose=FORWARD&status=success&applicationNumber=${payload.applicationNo}&tenantId=${payload.tenantId}`
      dispatch(setRoute(url));
    }
  } catch (error) {
    console.log(error, "Error")
  }

}

const bpaMakeInstallmentPayment = async (state, dispatch, action) => {
  //console.log(state, "Nero State");
  let selectedInstallments = get(state, "screenConfiguration.preparedFinalObject.selectedInstallments");
  let notPaidInstallments = get(state, "screenConfiguration.preparedFinalObject.notPaidInstallments");
  console.log(selectedInstallments, applicationNumber, "Nero Selected Installments")

  /********Validations*********/

  if(selectedInstallments && selectedInstallments.length < 1){

    let errorMessage = {
      labelName: "Please confirm the declaration!",
      labelKey: "BPA_INSTALLMENT_NOT_SELECTED_ERR"
    };
    dispatch(toggleSnackbar(true, errorMessage, "error"));
    return false;

  }

  // let isSelectedInstallmentsFromInitial = true;
  // let totalSelectedInstallments = selectedInstallments && selectedInstallments.length;
  // for (let i = 0; i < totalSelectedInstallments; i++) {
  //   if (!selectedInstallments.includes(notPaidInstallments[i])) {
  //     isSelectedInstallmentsFromInitial = false;
  //     break;
  //   }
  // }
  // if (!isSelectedInstallmentsFromInitial) {
  //   let errorMessage = {
  //     labelName: "Please confirm the declaration!",
  //     labelKey: "BPA_SELECT_INSTALLMENT_SEQUENCE_ERR"
  //   };
  //   dispatch(toggleSnackbar(true, errorMessage, "error"));
  //   return false;
  // }
  
console.log(selectedInstallments, "Nero Final Installments for API")

try {
  let response = await httpRequest(
    "post",
    "bpa-services/v1/bpa/_generateDemandFromInstallments",
    "",
    [],
    { InstallmentSearchCriteria: {
      "consumerCode": applicationNumber,
      "installmentNos":selectedInstallments
  } }
  );
  if (response) {
    let url = `/egov-common/pay?consumerCode=${applicationNumber}&tenantId=${tenant}&businessService=BPA.NC_SAN_FEE`
    dispatch(setRoute(url));
  }
} catch (error) {
  console.log(error, "Error")
  let errorMessage = {
    labelName: "Please confirm the declaration!",
    labelKey: error.message
  };
  dispatch(toggleSnackbar(true, errorMessage, "error"));
}
}
export const citizenFooter = getCommonApplyFooter({
  makePayment: {
    componentPath: "Button",
    visible:false,
    props: {
      variant: "contained",
      color: "primary",
      style: {
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "MAKE PAYMENT",
        labelKey: "BPA_CITIZEN_MAKE_PAYMENT"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: bpaMakePayment
    },
    // roleDefination: {
    //   rolePath: "user-info.roles",
    //   action: "PAY"
    // }
  },
  viewPaymentDetail: {
    componentPath: "Button",
    visible: false,
    props: {
      variant: "contained",
      color: "primary",
      style: {
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "MAKE PAYMENT",
        labelKey: "BPA_CITIZEN_VIEW_PAYMENT"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: viewPaymentDetail
    },
    // roleDefination: {
    //   rolePath: "user-info.roles",
    //   action: "PAY"
    // }
  },
  sendToArch: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      color: "primary",
      style: { justifyContent: "flex-end" }
    },
    children: {
      buttons: sendToArchContainer()
    },
    visible: false
  },
  buttonAfterApproved: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      color: "primary",
      style: { justifyContent: "flex-end" }
    },
    children: {
      buttons: buttonAfterApproved()
    },
    visible: false
  },
  submitButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Submit",
        labelKey: "BPA_COMMON_BUTTON_SUBMIT"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: submitBpaApplicationNOC
    },
    roleDefination: {
      rolePath: "user-info.roles",
      action: "APPLY"
    }
  },
  forwardButton: {
    componentPath: "Button",
    visible: false,
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Forward",
        labelKey: "BPA_FORWARD_BUTTON"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: updateBpaApplication
    },
    // roleDefination: {
    //   rolePath: "user-info.roles",
    //   action: "FORWARD"
    // }
  },
  spclArchApproveButton: {
    componentPath: "Button",
    visible: false,
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Approve",
        labelKey: "BPA_APPROVE_BUTTON"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: updateAndApproveSpclArchBpaApplication
    },
    roleDefination: {
      rolePath: "user-info.roles",
      action: "APPROVE"
    }
  },
  scnReplyButton: {
    componentPath: "Button",
    visible: false,
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Reply",
        labelKey: "BPA_SCN_REPLY_BUTTON"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: openPopupToReplyScn
    },

  }
  // forwardAfterReworkButton: {
  //   componentPath: "Button",
  //   visible: false,
  //   props: {
  //     variant: "contained",
  //     color: "primary",
  //     style: {
  //       minWidth: "200px",
  //       height: "48px",
  //       marginRight: "45px"
  //     }
  //   },
  //   children: {
  //     submitButtonLabel: getLabel({
  //       labelName: "Approve",
  //       labelKey: "BPA_REWORK_FORWARD_BUTTON"
  //     })
  //   },
  //   onClickDefination: {
  //     action: "condition",
  //     callBack: previewAndForwardApplication
  //   },
  //   roleDefination: {
  //     rolePath: "user-info.roles",
  //     action : "FORWARD_TO_APPROVER"
  //   }
  // }
});

export const generateShowCauseNotice = getCommonContainer({
  generateShowCauseNotice: {
    componentPath: "Button",
    visible: false,
    props: {
      variant: "contained",
      color: "primary",
      style: {
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "MAKE PAYMENT",
        labelKey: "BPA_GENERATE_SHOW_CAUSE_NOTICE"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        gotoGenerateShowCausePage(state, dispatch, "GENSCN")
      }
    }
  },

  generateRevokeNotice: {
    componentPath: "Button",
    visible: false,
    props: {
      variant: "contained",
      color: "primary",
      style: {
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "MAKE PAYMENT",
        labelKey: "BPA_GENERATE_REVOKE_NOTICE"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        gotoGenerateShowCausePage(state, dispatch, "GENREVOKE")
      }
    }
  },


});

export const getScnHistory = getCommonGrayCard({

  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" }
    },
    children: {
      header: {
        gridDefination: {
          xs: 8
        },
        ...getCommonSubHeader({
          labelName: "BPA_SCN_HISTORY_HEADER",
          labelKey: "BPA_SCN_HISTORY_HEADER"
        })
      }
    }
  },
  edcrShortSummary: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-bpa",
    componentPath: "ScnHistory",


  }
}
);


export const viewPaymentDetails = getCommonApplyFooter({
  viewPaymentDetail: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "MAKE PAYMENT",
        labelKey: "BPA_CITIZEN_MAKE_PAYMENT"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: bpaMakeInstallmentPayment
    },
    // roleDefination: {
    //   rolePath: "user-info.roles",
    //   action: "PAY"
    // }
  }
})