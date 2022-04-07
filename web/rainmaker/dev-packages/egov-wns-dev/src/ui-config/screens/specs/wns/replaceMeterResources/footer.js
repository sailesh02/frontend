import { dispatchMultipleFieldChangeAction, getLabel, getLabelWithValue, getCommonGrayCard, getCommonContainer, getCommonCard, getCommonTitle, getCommonSubHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { prepareFinalObject, toggleSnackbar, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";

import get from "lodash/get";

import { applyReplaceMeter } from "../../../../../ui-utils/commons";
import { getCommonApplyFooter, validateFields, checkValueForNA } from "../../utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

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

const moveToSuccess = (dispatch, state) => {

  const purpose = "applymeterreplace";
  const status = "success";
  let wc = get(state, "screenConfiguration.preparedFinalObject.WaterConnection");
  let appNo = wc && wc.applicationNo;
  let tenantId = wc && wc.tenantId;
  let applicationType = wc && wc.applicationType;
  dispatch(
    setRoute(
      `/wns/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${appNo}&tenandId=${tenantId}&applicationType=${applicationType}`
    )
  );
};


export const callBackForNext = async (state, dispatch) => {

  let activeStep = get(
    state.screenConfiguration.screenConfig["replaceMeter"],
    "components.div.children.stepper.props.activeStep",
    0
  );

  console.log(activeStep, "Nero active step")
  var isFormValid = true;
  var apiError = false;
  let checkFieldsRequired = true;
  let wcObject = JSON.parse(
    JSON.stringify(
      get(state.screenConfiguration.preparedFinalObject, "WaterConnection", {})
    )
  );

  if (activeStep === 0) {


    checkFieldsRequired = validateFields(
      "components.div.children.formwizardFirstStep.children.meterReplacementDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children",
      state,
      dispatch,
      "replaceMeter"
    )

    console.log(checkFieldsRequired, "Nero requireee")
    if (!checkFieldsRequired) {
      isFormValid = false;
    }
    if (isFormValid && wcObject.applicationStatus == "CONNECTION_ACTIVATED") {
      isFormValid = await applyReplaceMeter(state, dispatch, "INITIATE");
      if(!isFormValid){
        apiError = true;
      }
    }
    //console.log(queryObject, "Nero query boss")
  }

  if (activeStep !== 2) {
    if (isFormValid) {
      changeStep(state, dispatch);
      if (activeStep == 1) {
        isFormValid = await applyReplaceMeter(state, dispatch, "SUBMIT_APPLICATION");
        if (isFormValid) {
          moveToSuccess(dispatch, state);
        }
        if(!isFormValid){
          apiError = true;
        }
      }
    } else if(apiError){

    }else {
      let errorMessage = {
        labelName:
          "Please fill all mandatory fields and upload the documents !",
        labelKey: "WS_FILL_REQUIRED_FIELDS"
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
    state.screenConfiguration.screenConfig["replaceMeter"],
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
  dispatchMultipleFieldChangeAction("replaceMeter", actionDefination, dispatch);
  renderSteps(activeStep, dispatch);
};

export const renderSteps = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "replaceMeter",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;

    default:
      dispatchMultipleFieldChangeAction(
        "replaceMeter",
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


export const footer = getCommonApplyFooter("BOTTOM", {
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
        labelKey: "WS_COMMON_BUTTON_PREV_STEP"
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
        labelKey: "WS_COMMON_BUTTON_NXT_STEP"
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
        labelKey: "WS_COMMON_BUTTON_SUBMIT"
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






