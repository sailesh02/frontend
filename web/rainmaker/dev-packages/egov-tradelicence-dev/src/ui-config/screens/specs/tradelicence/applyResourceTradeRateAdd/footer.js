import { download } from "egov-common/ui-utils/commons";
import { dispatchMultipleFieldChangeAction, getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { prepareFinalObject, toggleSnackbar, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { generateTLAcknowledgement } from "egov-ui-kit/utils/pdfUtils/generateTLAcknowledgement";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import get from "lodash/get";
import set from "lodash/set";
import some from "lodash/some";
import { addUpdateBillSlab, checkValidOwners, getNextFinancialYearForRenewal } from "../../../../../ui-utils/commons";
import { createEstimateData, downloadCertificateForm, getButtonVisibility, getCommonApplyFooter, getDocList, setMultiOwnerForApply, setValidToFromVisibilityForApply, validateFields, downloadProvisionalCertificateForm } from "../../utils";


const moveToSuccess = (dispatch) => {
  // const applicationNo = get(LicenseData, "applicationNumber");
  // const tenantId = get(LicenseData, "tenantId");
  // const financialYear = get(LicenseData, "financialYear");
  const purpose = "addbillingslab";
  const status = "success";
  dispatch(
    setRoute(
      `/tradelicence/acknowledgement?purpose=${purpose}&status=${status}`
    )
  );
};


export const callBackForNext = async (state, dispatch) => {
  var isFormValid = true;
  let queryObject = JSON.parse(
    JSON.stringify(
      get(state.screenConfiguration.preparedFinalObject, "billingSlab", [])
    )
  );
  
const isCityDetailValid = validateFields(
  "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children",
  state,
  dispatch,
  "traderateadd"
);
console.log(isCityDetailValid, "Nero City valied")
  // const isTradeLocationValid = validateFields(
  //   "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeUnitCard.props.items[0].item0.children.cardContent.children.tradeUnitCardContainer.children",
  //   state,
  //   dispatch,
  //   "traderateadd"
  // );
  //  "[0].item0.children.cardContent.children.tradeUnitCardContainer"
  let tradeUnitJsonPath =
    "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeUnitCard.props.items";
  let tradeUnits = get(
    state.screenConfiguration.screenConfig.traderateadd,
    tradeUnitJsonPath,
    []
  );
  let isTradeUnitValid = true;
  //"components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeUnitCard.props.items[0].item0.children.cardContent.children.tradeUnitCardContainer"
console.log(tradeUnits, "Nero trade Units")
  for (var j = 0; j < tradeUnits.length; j++) {
    if (

      !validateFields(
        `${tradeUnitJsonPath}[${j}].item${j}.children.cardContent.children.tradeUnitCardContainer.children`,
        state,
        dispatch,
        "traderateadd"
      )
    )
      isTradeUnitValid = false;
  }

  if (!isTradeUnitValid || !isCityDetailValid) {
    isFormValid = false;
  }

  console.log(queryObject, "Nero query boss")
  if (isFormValid) {
    isFormValid = await addUpdateBillSlab(state, dispatch);
    if (isFormValid) {
      moveToSuccess(dispatch);
    }
  }else{
    let errorMessage = {
      labelName:
        "Please fill all mandatory fields and upload the documents !",
      labelKey: "ERR_FILL_TRADE_MANDATORY_FIELDS"
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
  

};

export const changeStep = (
  state,
  dispatch,
  mode = "next",
  defaultActiveStep = -1
) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["apply"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  if (defaultActiveStep === -1) {
    if (activeStep === 2 && mode === "next") {
      const isDocsUploaded = get(
        state.screenConfiguration.preparedFinalObject,
        "LicensesTemp[0].reviewDocData",
        null
      );
      activeStep = isDocsUploaded ? 3 : 2;
    } else {
      activeStep = mode === "next" ? activeStep + 1 : activeStep - 1;
    }
  } else {
    activeStep = defaultActiveStep;
  }

  const isPreviousButtonVisible = activeStep > 0 ? true : false;
  const isNextButtonVisible = activeStep < 3 ? true : false;
  const isPayButtonVisible = activeStep === 3 ? true : false;
  const actionDefination = [
    {
      path: "components.div.children.stepper.props",
      property: "activeStep",
      value: activeStep
    },
    {
      path: "components.div.children.footer.children.previousButton",
      property: "visible",
      value: isPreviousButtonVisible
    },
    {
      path: "components.div.children.footer.children.nextButton",
      property: "visible",
      value: isNextButtonVisible
    },
    {
      path: "components.div.children.footer.children.payButton",
      property: "visible",
      value: isPayButtonVisible
    }
  ];
  dispatchMultipleFieldChangeAction("apply", actionDefination, dispatch);
  renderSteps(activeStep, dispatch);
};

export const renderSteps = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
    case 2:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardThirdStep"
        ),
        dispatch
      );
      break;
    default:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardFourthStep"
        ),
        dispatch
      );
  }
};

export const getActionDefinationForStepper = path => {
  const actionDefination = [
    {
      path: "components.div.children.formwizardFirstStep",
      property: "visible",
      value: true
    },
    {
      path: "components.div.children.formwizardSecondStep",
      property: "visible",
      value: false
    },
    {
      path: "components.div.children.formwizardThirdStep",
      property: "visible",
      value: false
    },
    {
      path: "components.div.children.formwizardFourthStep",
      property: "visible",
      value: false
    }
  ];
  for (var i = 0; i < actionDefination.length; i++) {
    actionDefination[i] = {
      ...actionDefination[i],
      value: false
    };
    if (path === actionDefination[i].path) {
      actionDefination[i] = {
        ...actionDefination[i],
        value: true
      };
    }
  }
  return actionDefination;
};

export const callBackForPrevious = (state, dispatch) => {
  changeStep(state, dispatch, "previous");
};

export const footer = getCommonApplyFooter({

  nextButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "180px",
        height: "48px",
        marginRight: "45px",
        borderRadius: "inherit"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Submit",
        labelKey: "TL_COMMON_BUTTON_SUBMIT"
      }),
      submitButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForNext
    },
  },

});




export const footerReview = (
  action,
  state,
  dispatch,
  status,
  applicationNumber,
  tenantId,
  financialYear
) => {
  /** MenuButton data based on status */
  let licenseNumber = get(state.screenConfiguration.preparedFinalObject.Licenses[0], "licenseNumber")
  const responseLength = get(
    state.screenConfiguration.preparedFinalObject,
    `licenseCount`,
    1
  );

  return getCommonApplyFooter({
    container: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      children: {
        rightdiv: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          props: {

            style: {
              float: "right",
              display: "flex"
            }
          },
          children: {

            resubmitButton: {
              componentPath: "Button",
              props: {
                variant: "contained",
                color: "primary",
                style: {
                  minWidth: "180px",
                  height: "48px",
                  marginRight: "45px"
                }
              },
              children: {
                nextButtonLabel: getLabel({
                  labelName: "RESUBMIT",
                  labelKey: "TL_RESUBMIT"
                })
              },
              onClickDefination: {
                action: "condition",
                callBack: openPopup
              },
              visible: getButtonVisibility(status, "RESUBMIT"),
              roleDefination: {
                rolePath: "user-info.roles",
                roles: ["TL_CEMP", "CITIZEN"]
              }
            },
            editButton: {
              componentPath: "Button",
              props: {
                variant: "outlined",
                color: "primary",
                style: {
                  minWidth: "180px",
                  height: "48px",
                  marginRight: "16px",
                  borderRadius: "inherit"
                }
              },
              children: {
                previousButtonIcon: {
                  uiFramework: "custom-atoms",
                  componentPath: "Icon",
                  props: {
                    iconName: "keyboard_arrow_left"
                  }
                },
                previousButtonLabel: getLabel({
                  labelName: "Edit for Renewal",
                  labelKey: "TL_RENEWAL_BUTTON_EDIT"
                })
              },
              onClickDefination: {
                action: "condition",
                callBack: () => {
                  dispatch(
                    setRoute(
                      // `/tradelicence/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNo}&FY=${financialYear}&tenantId=${tenantId}`
                      `/tradelicense-citizen/apply?applicationNumber=${applicationNumber}&licenseNumber=${licenseNumber}&tenantId=${tenantId}&action=EDITRENEWAL`
                    )
                  );
                },

              },
              visible: (getButtonVisibility(status, "APPROVED") || getButtonVisibility(status, "EXPIRED")) && (responseLength === 1),
            },
            submitButton: {
              componentPath: "Button",
              props: {
                variant: "contained",
                color: "primary",
                style: {
                  minWidth: "180px",
                  height: "48px",
                  marginRight: "45px",
                  borderRadius: "inherit"
                }
              },
              children: {
                nextButtonLabel: getLabel({
                  labelName: "Submit for Renewal",
                  labelKey: "TL_RENEWAL_BUTTON_SUBMIT"
                }),
                nextButtonIcon: {
                  uiFramework: "custom-atoms",
                  componentPath: "Icon",
                  props: {
                    iconName: "keyboard_arrow_right"
                  }
                }
              },
              onClickDefination: {
                action: "condition",
                callBack: () => {
                  renewTradelicence(financialYear, state, dispatch);
                },

              },
              visible: (getButtonVisibility(status, "APPROVED") || getButtonVisibility(status, "EXPIRED")) && (responseLength === 1),
            },
            makePayment: {
              componentPath: "Button",
              props: {
                variant: "contained",
                color: "primary",
                style: {
                  minWidth: "180px",
                  height: "48px",
                  marginRight: "45px",
                  borderRadius: "inherit"
                }
              },
              children: {
                submitButtonLabel: getLabel({
                  labelName: "MAKE PAYMENT",
                  labelKey: "TL_COMMON_BUTTON_CITIZEN_MAKE_PAYMENT"
                })
              },
              onClickDefination: {
                action: "condition",
                callBack: () => {
                  dispatch(
                    setRoute(
                      `/egov-common/pay?consumerCode=${applicationNumber}&tenantId=${tenantId}&businessService=TL`
                    )
                  );
                },

              },
              visible: process.env.REACT_APP_NAME === "Citizen" && getButtonVisibility(status, "PENDINGPAYMENT") ? true : false
            }
          },
          gridDefination: {
            xs: 12,
            sm: 12
          }
        },
      }
    }
  });
};
export const footerReviewTop = (
  action,
  state,
  dispatch,
  status,
  applicationNumber,
  tenantId,
  financialYear
) => {

  /** MenuButton data based on status */
  let downloadMenu = [];
  let printMenu = [];
  let licenseNumber = get(state.screenConfiguration.preparedFinalObject.Licenses[0], "licenseNumber")
  const uiCommonConfig = get(state.screenConfiguration.preparedFinalObject, "uiCommonConfig");
  const receiptKey = get(uiCommonConfig, "receiptKey");
  const responseLength = get(
    state.screenConfiguration.preparedFinalObject,
    `licenseCount`,
    1
  );
  // let renewalMenu=[];
  let tlCertificateDownloadObject = {
    label: { labelName: "TL Certificate", labelKey: "TL_CERTIFICATE" },
    link: () => {
      const { Licenses } = state.screenConfiguration.preparedFinalObject;
      downloadCertificateForm(Licenses);
    },
    leftIcon: "book"
  };
  let tlCertificatePrintObject = {
    label: { labelName: "TL Certificate", labelKey: "TL_CERTIFICATE" },
    link: () => {
      const { Licenses } = state.screenConfiguration.preparedFinalObject;
      downloadCertificateForm(Licenses, 'print');
    },
    leftIcon: "book"
  };

  let tlPLDownloadObject = {
    label: { labelName: "TL Certificate", labelKey: "TL_PL_CERTIFICATE" },
    link: () => {
      const { Licenses } = state.screenConfiguration.preparedFinalObject;
      downloadProvisionalCertificateForm(Licenses);
    },
    leftIcon: "book"
  };
  let tlPLPrintObject = {
    label: { labelName: "TL Certificate", labelKey: "TL_PL_CERTIFICATE" },
    link: () => {
      const { Licenses } = state.screenConfiguration.preparedFinalObject;
      downloadProvisionalCertificateForm(Licenses, 'print');
    },
    leftIcon: "book"
  };


  let receiptDownloadObject = {
    label: { labelName: "Receipt", labelKey: "TL_RECEIPT" },
    link: () => {


      const receiptQueryString = [
        { key: "consumerCodes", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "applicationNumber") },
        { key: "tenantId", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "tenantId") },
        { key: "businessService", value: 'TL' }
      ]
      download(receiptQueryString, "download", receiptKey, state);
      // generateReceipt(state, dispatch, "receipt_download");
    },
    leftIcon: "receipt"
  };
  let receiptPrintObject = {
    label: { labelName: "Receipt", labelKey: "TL_RECEIPT" },
    link: () => {
      const receiptQueryString = [
        { key: "consumerCodes", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "applicationNumber") },
        { key: "tenantId", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "tenantId") },
        { key: "businessService", value: 'TL' }
      ]
      download(receiptQueryString, "print", receiptKey, state);
      // generateReceipt(state, dispatch, "receipt_print");
    },
    leftIcon: "receipt"
  };
  let applicationDownloadObject = {
    label: { labelName: "Application", labelKey: "TL_APPLICATION" },
    link: () => {
      const { Licenses, LicensesTemp } = state.screenConfiguration.preparedFinalObject;
      const documents = LicensesTemp[0].reviewDocData;
      set(Licenses[0], "additionalDetails.documents", documents)
      generateTLAcknowledgement(state.screenConfiguration.preparedFinalObject, `tl-acknowledgement-${Licenses[0].applicationNumber}`);
    },
    leftIcon: "assignment"
  };
  let applicationPrintObject = {
    label: { labelName: "Application", labelKey: "TL_APPLICATION" },
    link: () => {
      const { Licenses, LicensesTemp } = state.screenConfiguration.preparedFinalObject;
      const documents = LicensesTemp[0].reviewDocData;
      set(Licenses[0], "additionalDetails.documents", documents)
      generateTLAcknowledgement(state.screenConfiguration.preparedFinalObject, 'print');

    },
    leftIcon: "assignment"
  };

  // switch (status) {
  //   case "APPROVED":
  //     downloadMenu = [
  //       tlCertificateDownloadObject,
  //       receiptDownloadObject,
  //       applicationDownloadObject
  //     ];
  //     printMenu = [
  //       tlCertificatePrintObject,
  //       receiptPrintObject,
  //       applicationPrintObject
  //     ];
  //     break;
  //   case "APPLIED":
  //   case "CITIZENACTIONREQUIRED":
  //   case "FIELDINSPECTION":
  //   case "PENDINGAPPROVAL":
  //   case "PENDINGPAYMENT":
  //     downloadMenu = [applicationDownloadObject];
  //     printMenu = [applicationPrintObject];
  //     break;
  //   case "pending_approval":
  //     downloadMenu = [receiptDownloadObject, applicationDownloadObject];
  //     printMenu = [receiptPrintObject, applicationPrintObject];
  //     break;
  //   case "CANCELLED":
  //     downloadMenu = [applicationDownloadObject];
  //     printMenu = [applicationPrintObject];
  //     break;
  //   case "REJECTED":
  //     downloadMenu = [applicationDownloadObject];
  //     printMenu = [applicationPrintObject];
  //     break;
  //   default:
  //     break;
  // }
  switch (status) {
    case "APPROVED":
      downloadMenu = [
        tlCertificateDownloadObject,
        receiptDownloadObject,
        applicationDownloadObject
      ];
      printMenu = [
        tlCertificatePrintObject,
        receiptPrintObject,
        applicationPrintObject
      ];
      break;
    case "PENDINGAPPROVAL":
    case "FIELDINSPECTION":
    case "DOCVERIFICATION":
      downloadMenu = [
        tlPLDownloadObject,
        receiptDownloadObject,
        applicationDownloadObject
      ];
      printMenu = [
        tlPLPrintObject,
        receiptPrintObject,
        applicationPrintObject
      ];
      break;
    case "APPLIED":
    case "PENDINGPAYMENT":
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
    case "CANCELLED":
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
    case "REJECTED":
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
    default:
      break;
  }
  /** END */

  return {
    rightdiv: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        style: { textAlign: "right", display: "flex" }
      },
      children: {
        downloadMenu: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-tradelicence",
          componentPath: "MenuButton",
          props: {
            data: {
              label: { labelName: "DOWNLOAD", labelKey: "TL_DOWNLOAD" },
              leftIcon: "cloud_download",
              rightIcon: "arrow_drop_down",
              props: { variant: "outlined", style: { height: "60px", color: "#FE7A51", marginRight: "5px" }, className: "tl-download-button" },
              menu: downloadMenu
            }
          }
        },
        printMenu: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-tradelicence",
          componentPath: "MenuButton",
          props: {
            data: {
              label: { labelName: "PRINT", labelKey: "TL_PRINT" },
              leftIcon: "print",
              rightIcon: "arrow_drop_down",
              props: { variant: "outlined", style: { height: "60px", color: "#FE7A51" }, className: "tl-print-button" },
              menu: printMenu
            }
          }
        }

      },
      // gridDefination: {
      //   xs: 12,
      //   sm: 6
      // }
    }
  }

};

export const openPopup = (state, dispatch) => {
  dispatch(
    prepareFinalObject("ResubmitAction", true)
  );
}

export const downloadPrintContainer = (
  action,
  state,
  dispatch,
  status,
  applicationNumber,
  tenantId
) => {

  /** MenuButton data based on status */
  const uiCommonConfig = get(state.screenConfiguration.preparedFinalObject, "uiCommonConfig");
  const receiptKey = get(uiCommonConfig, "receiptKey");
  let downloadMenu = [];
  let printMenu = [];
  let tlCertificateDownloadObject = {
    label: { labelName: "TL Certificate", labelKey: "TL_CERTIFICATE" },
    link: () => {
      const { Licenses } = state.screenConfiguration.preparedFinalObject;
      downloadCertificateForm(Licenses);
    },
    leftIcon: "book"
  };
  let tlCertificatePrintObject = {
    label: { labelName: "TL Certificate", labelKey: "TL_CERTIFICATE" },
    link: () => {
      const { Licenses } = state.screenConfiguration.preparedFinalObject;
      downloadCertificateForm(Licenses, 'print');
    },
    leftIcon: "book"
  };


  let tlPLDownloadObject = {
    label: { labelName: "TL Certificate", labelKey: "TL_PL_CERTIFICATE" },
    link: () => {
      const { Licenses } = state.screenConfiguration.preparedFinalObject;
      downloadProvisionalCertificateForm(Licenses);
    },
    leftIcon: "book"
  };
  let tlPLPrintObject = {
    label: { labelName: "TL Certificate", labelKey: "TL_PL_CERTIFICATE" },
    link: () => {
      const { Licenses } = state.screenConfiguration.preparedFinalObject;
      downloadProvisionalCertificateForm(Licenses, 'print');
    },
    leftIcon: "book"
  };


  let receiptDownloadObject = {
    label: { labelName: "Receipt", labelKey: "TL_RECEIPT" },
    link: () => {
      const receiptQueryString = [
        { key: "consumerCodes", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "applicationNumber") },
        { key: "tenantId", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "tenantId") },
        { key: "businessService", value: 'TL' }
      ]
      download(receiptQueryString, "download", receiptKey);
    },
    leftIcon: "receipt"
  };
  let receiptPrintObject = {
    label: { labelName: "Receipt", labelKey: "TL_RECEIPT" },
    link: () => {
      const receiptQueryString = [
        { key: "consumerCodes", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "applicationNumber") },
        { key: "tenantId", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "tenantId") },
        { key: "businessService", value: 'TL' }
      ]
      download(receiptQueryString, "print", receiptKey);
    },
    leftIcon: "receipt"
  };
  let applicationDownloadObject = {
    label: { labelName: "Application", labelKey: "TL_APPLICATION" },
    link: () => {
      const { Licenses, LicensesTemp } = state.screenConfiguration.preparedFinalObject;
      const documents = LicensesTemp[0].reviewDocData;
      set(Licenses[0], "additionalDetails.documents", documents)
      // downloadAcknowledgementForm(Licenses);
      generateTLAcknowledgement(state.screenConfiguration.preparedFinalObject, `tl-acknowledgement-${Licenses[0].applicationNumber}`);
    },
    leftIcon: "assignment"
  };
  let applicationPrintObject = {
    label: { labelName: "Application", labelKey: "TL_APPLICATION" },
    link: () => {
      const { Licenses, LicensesTemp } = state.screenConfiguration.preparedFinalObject;
      const documents = LicensesTemp[0].reviewDocData;
      set(Licenses[0], "additionalDetails.documents", documents)
      // downloadAcknowledgementForm(Licenses,'print');
      generateTLAcknowledgement(state.screenConfiguration.preparedFinalObject, 'print');
    },
    leftIcon: "assignment"
  };
  // switch (status) {
  //   case "APPROVED":
  //     downloadMenu = [
  //       tlCertificateDownloadObject,
  //       receiptDownloadObject,
  //       applicationDownloadObject
  //     ];
  //     printMenu = [
  //       tlCertificatePrintObject,
  //       receiptPrintObject,
  //       applicationPrintObject
  //     ];
  //     break;
  //   case "APPLIED":
  //   case "CITIZENACTIONREQUIRED":
  //   case "FIELDINSPECTION":
  //   case "PENDINGAPPROVAL":
  //   case "PENDINGPAYMENT":
  //     downloadMenu = [applicationDownloadObject];
  //     printMenu = [applicationPrintObject];
  //     break;
  //   case "CANCELLED":
  //     downloadMenu = [applicationDownloadObject];
  //     printMenu = [applicationPrintObject];
  //     break;
  //   case "REJECTED":
  //     downloadMenu = [applicationDownloadObject];
  //     printMenu = [applicationPrintObject];
  //     break;
  //   default:
  //     break;
  // }
  switch (status) {
    case "APPROVED":
      downloadMenu = [
        tlCertificateDownloadObject,
        receiptDownloadObject,
        applicationDownloadObject
      ];
      printMenu = [
        tlCertificatePrintObject,
        receiptPrintObject,
        applicationPrintObject
      ];
      break;
    case "PENDINGAPPROVAL":
    case "FIELDINSPECTION":
    case "DOCVERIFICATION":
      downloadMenu = [
        tlPLDownloadObject,
        receiptDownloadObject,
        applicationDownloadObject
      ];
      printMenu = [
        tlPLPrintObject,
        receiptPrintObject,
        applicationPrintObject
      ];
      break;
    case "APPLIED":
    case "PENDINGPAYMENT":
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
    case "CANCELLED":
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
    case "REJECTED":
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
    default:
      break;
  }
  /** END */

  return {
    rightdiv: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        style: { textAlign: "right", display: "flex" }
      },
      children: {
        downloadMenu: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-tradelicence",
          componentPath: "MenuButton",
          props: {
            data: {
              label: { labelName: "DOWNLOAD", labelKey: "TL_DOWNLOAD" },
              leftIcon: "cloud_download",
              rightIcon: "arrow_drop_down",
              props: { variant: "outlined", style: { height: "60px", color: "#FE7A51" }, className: "tl-download-button" },
              menu: downloadMenu
            }
          }
        },
        printMenu: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-tradelicence",
          componentPath: "MenuButton",
          props: {
            data: {
              label: { labelName: "PRINT", labelKey: "TL_PRINT" },
              leftIcon: "print",
              rightIcon: "arrow_drop_down",
              props: { variant: "outlined", style: { height: "60px", color: "#FE7A51" }, className: "tl-print-button" },
              menu: printMenu
            }
          }
        }

      },
      // gridDefination: {
      //   xs: 12,
      //   sm: 6
      // }
    }
  }
};
