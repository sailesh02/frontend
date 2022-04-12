import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getSelectField,
  getCommonContainer,
  getPattern,
  getDateField,
  getTimeField,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  dispatchMultipleFieldChangeAction
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { httpRequest } from "../../../../../ui-utils/api";

import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";

import { toggleSnackbar, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";

export const callBackSubmitHandle = async (state, dispatch) => {
console.log(state, "Nero State")

const feeAmount = get(
  state.screenConfiguration.preparedFinalObject,
  "BPA.additionalDetails.sanctionFeeAdjustmentAmount"
);

const feeAmountAdjustReason = get(
  state.screenConfiguration.preparedFinalObject,
  "BPA.additionalDetails.modificationReasonSanctionFeeAdjustmentAmount"
);


if(feeAmount !== "" && feeAmount !== undefined && feeAmountAdjustReason !== "" && feeAmountAdjustReason !== undefined){
  try {
    const bpaObj = get(
      state.screenConfiguration.preparedFinalObject,
      "BPA"
    );
    delete bpaObj.edcrDetail;
console.log(bpaObj, "Nero Bpa")
    updateRes = await httpRequest(
      "post",
      "bpa-services/v1/bpa/_update?",
      "",
      [],
      {
        BPA: bpaObj
      }
    );
    console.log(updateRes, "Nero udpatesss")
    if(updateRes && updateRes.BPA && updateRes.BPA.length > 0){
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "ERR_FILL_NMA_NOC_DETAILS",
            labelKey: "Sanction Fee adjusted successfully",
          },
          "success"
        )
      )
    }
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "ERR_FILL_NMA_NOC_DETAILS",
          labelKey: error.message,
        },
        "error"
      )
    )
  }
  
}else{
  dispatch(
    toggleSnackbar(
      true,
      {
        labelName: "ERR_FILL_NMA_NOC_DETAILS",
        labelKey: "Please fill all the mandatory fields",
      },
      "warning"
    )
  )
}


}
export const enableCard = (state, dispatch) => {

  const actionDefination1 = [
    // {
    //   path: "components.div.children.body.children.cardContent.children.sanctionFeeAdjustFormCard.children.apint.children.cardContent.children.sanctionFeeAdjustmentDetails.children.cardContent.children.sanctionFeeAdjustmentDetailCard.children.submitButton.props",
    //   property: "disabled",
    //   value: false
    // },
    {
      path: "components.div.children.body.children.cardContent.children.sanctionFeeAdjustFormCard.children.apint.children.cardContent.children.sanctionFeeAdjustmentDetails.children.cardContent.children.sanctionFeeAdjustmentDetailCard.children.sanctionFeeAdjustmentAmount.props",
      property: "disabled",
      value: false
    },
    {
      path: "components.div.children.body.children.cardContent.children.sanctionFeeAdjustFormCard.children.apint.children.cardContent.children.sanctionFeeAdjustmentDetails.children.cardContent.children.sanctionFeeAdjustmentDetailCard.children.modificationReasonSanctionFeeAdjustmentAmount.props",
      property: "disabled",
      value: false
    }

  ];
 // let sanctionFeeCardEnabled =  get(state, "sanctionFeeCardEnabled", false);
  dispatch(prepareFinalObject("BPA.additionalDetails.sanctionFeeCardEnabled", true));

  dispatchMultipleFieldChangeAction("search-preview", actionDefination1, dispatch);
}

export const sanctionFeeAdjustmentDetails = getCommonGrayCard(
  {
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
            labelKey: "BPA_SANCTION_FEE_ADJUSTMENT_AMOUNT_DETAIL_HEADER"
          })
        },
        editSection: {
          componentPath: "Button",
          props: {
            color: "primary"
          },
          //visible: getQueryArg(window.location.href, "status") === "PENDINGAPPROVAL"? true:false,
          visible: true,
          gridDefination: {
            xs: 12,
            sm: 2,
            align: "right"
          },
          children: {
            editIcon: {
              uiFramework: "custom-atoms",
              componentPath: "Icon",
              props: {
                iconName: "edit"
              }
            },
            buttonLabel: getLabel({
              labelName: "Edit",
              labelKey: "BPA_SANCTION_FEE_UPDATE_LABEL"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => {
              enableCard(state, dispatch, "", 0);
            }
          }
        }
      }
    },
    sanctionFeeAdjustmentDetailCard: getCommonContainer({


      sanctionFeeAdjustmentAmount: getTextField({
        gridDefination: {
          xs: 12,
          sm: 4
        },
        disabled: true,
        label: {
          labelName: "Door/House No.",
          labelKey: "BPA_SANC_FEE_ADJUST_AMOUNT_LABEL"
        },
        props: {
          className: "applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "BPA_SANC_FEE_ADJUST_AMOUNT_PLACEHOLDER"
        },
        required: true,
        jsonPath: "BPA.additionalDetails.sanctionFeeAdjustmentAmount",

      }),
      modificationReasonSanctionFeeAdjustmentAmount: getTextField({
        gridDefination: {
          xs: 12,
          sm: 4
        },
        disabled: true,
        required: true,
        label: {
          labelName: "Door/House No.",
          labelKey: "BPA_SANC_FEE_ADJUST_AMOUNT_CHANGE_REASON_LABEL"
        },
        props: {
          className: "applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "BPA_SANC_FEE_ADJUST_AMOUNT_CHANGE_REASON_PLACEHOLDER"
        },

        jsonPath: "BPA.additionalDetails.modificationReasonSanctionFeeAdjustmentAmount",

      }),
    })
  }
);
