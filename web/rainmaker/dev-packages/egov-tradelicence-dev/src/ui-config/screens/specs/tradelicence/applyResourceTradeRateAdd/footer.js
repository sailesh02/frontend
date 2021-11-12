import { download } from "egov-common/ui-utils/commons";
import { dispatchMultipleFieldChangeAction, getLabel, getLabelWithValue, getCommonGrayCard, getCommonContainer, getCommonCard, getCommonTitle, getCommonSubHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
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
import { createEstimateData, downloadCertificateForm, getButtonVisibility, getCommonApplyFooter, getDocList, setMultiOwnerForApply, setValidToFromVisibilityForApply, validateFields, downloadProvisionalCertificateForm, checkValueForNA } from "../../utils";


export const billingSlabReviewDetails = {
  reviewCity: getLabelWithValue(
    {
      labelName: "Application Type",
      labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL"
    },
    {
      jsonPath:
        "billingSlab[0].tenantId",
      // localePrefix: {
      //   moduleName: "TradeLicense",
      //   masterName: "ApplicationType"
      // },
    }
  ),

  reviewApplicationType: getLabelWithValue(
    {
      labelName: "Application Type",
      labelKey: "TL_APPLICATION_TYPE"
    },
    {
      jsonPath:
        "billingSlab[0].applicationType",
      localePrefix: {
        moduleName: "TradeLicense",
        masterName: "ApplicationType"
      },
    }
  ),
  reviewLicenceType: getLabelWithValue(
    {
      labelName: "Licence Type",
      labelKey: "TL_COMMON_TABLE_COL_LICENSE_TYPE"
    },
    {
      jsonPath: "billingSlab[0].licenseType",
      localePrefix: {
        moduleName: "TRADELICENSE",
        masterName: "LICENSETYPE"
      },
    }
  ),
  reviewTradeType: getLabelWithValue(
    {
      labelName: "Trade Type",
      labelKey: "TL_NEW_TRADE_DETAILS_TRADE_TYPE_LABEL"
    },
    {
      jsonPath: "billingSlab[0].tradeType",
      localePrefix: {
        moduleName: "TRADELICENSE",
        masterName: "TRADETYPE"
      },
      callBack: value => {
        return value ? value.split(".")[0] : "NA";
      }
    }
  ),
  reviewTradeSubtype: getLabelWithValue(
    {
      labelName: "Trade Sub-Type",
      labelKey: "TL_NEW_TRADE_DETAILS_TRADE_SUBTYPE_LABEL"
    },
    {
      jsonPath: "billingSlab[0].tradeType",
      localePrefix: {
        moduleName: "TRADELICENSE",
        masterName: "TRADETYPE"
      },
      callBack: checkValueForNA
    }
  ),

  reviewTradeUOM: getLabelWithValue(
    {
      labelName: "UOM (Unit of Measurement)",
      labelKey: "TL_NEW_TRADE_DETAILS_UOM_LABEL"
    },
    { jsonPath: "billingSlab[0].uom", callBack: checkValueForNA }
  ),
  reviewRateType: getLabelWithValue(
    {
      labelName: "UOM (Unit of Measurement)",
      labelKey: "Rate Type"
    },
    { jsonPath: "billingSlab[0].type", callBack: checkValueForNA }
  ),
  reviewFromUom: getLabelWithValue(
    {
      labelName: "UOM (Unit of Measurement)",
      labelKey: "Rate Type"
    },
    { jsonPath: "billingSlab[0].fromUom", callBack: checkValueForNA }
  ),
  reviewToUom: getLabelWithValue(
    {
      labelName: "UOM (Unit of Measurement)",
      labelKey: "Rate Type"
    },
    { jsonPath: "billingSlab[0].toUom", callBack: checkValueForNA }
  ),
  reviewTradeRate: getLabelWithValue(
    {
      labelName: "UOM Value",
      labelKey: "TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL"
    },
    { jsonPath: "billingSlab[0].rate", callBack: checkValueForNA }
  )

}


export const getBillingSlabReviewDetails = (isEditable = true) => {
  return getCommonGrayCard({
    headerDiv: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      props: {
        style: { marginBottom: "10px" }
      },
      children: {
        header: {
          gridDefination: {
            xs: 12,
            sm: 10
          },
          ...getCommonSubHeader({
            labelName: "Trade Details",
            labelKey: "Billing Slab Summary"
          })
        },

      }
    },
    viewOne: getCommonContainer(billingSlabReviewDetails),

  });
};

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

  let activeStep = get(
    state.screenConfiguration.screenConfig["traderateadd"],
    "components.div.children.stepper.props.activeStep",
    0
  );

  console.log(activeStep, "Nero active step")
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
  if (activeStep !== 2) {
    if (isFormValid) {
      changeStep(state, dispatch);
      if (activeStep == 1) {
        isFormValid = await addUpdateBillSlab(state, dispatch);
        if (isFormValid) {
          moveToSuccess(dispatch);
        }
      }
    } else {
      let errorMessage = {
        labelName:
          "Please fill all mandatory fields and upload the documents !",
        labelKey: "ERR_FILL_TRADE_MANDATORY_FIELDS"
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }

  }
};

export const changeStep = (
  state,
  dispatch,
  mode = "next",
  defaultActiveStep = -1
) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["traderateadd"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  if (defaultActiveStep === -1) {
    if (activeStep === 1 && mode === "next") {

      //activeStep = isDocsUploaded ? 1 : 0;
    } else {
      activeStep = mode === "next" ? activeStep + 1 : activeStep - 1;
    }
  } else {
    activeStep = defaultActiveStep;
  }

  const isPreviousButtonVisible = activeStep > 0 ? true : false;
  const isNextButtonVisible = activeStep < 1 ? true : false;
  const isPayButtonVisible = activeStep === 1 ? true : false;
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
  dispatchMultipleFieldChangeAction("traderateadd", actionDefination, dispatch);
  renderSteps(activeStep, dispatch);
};

export const renderSteps = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "traderateadd",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;

    default:
      dispatchMultipleFieldChangeAction(
        "traderateadd",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
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
  previousButton: {
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
        labelName: "Previous Step",
        labelKey: "TL_COMMON_BUTTON_PREV_STEP"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForPrevious
    },
    visible: false
  },
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
        labelKey: "TL_COMMON_BUTTON_NEXT"
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
  payButton: {
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
    visible: false
  }

});






