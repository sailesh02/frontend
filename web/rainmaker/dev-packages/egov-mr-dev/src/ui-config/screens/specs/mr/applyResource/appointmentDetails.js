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
import { showHideMapPopup, getDetailsFromProperty } from "../../utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

import "./index.css";

export const enableCard = (state, dispatch) => {

  const actionDefination1 = [
    {
      path: "components.div.children.appointmentDetailsFormCard.children.apint.children.cardContent.children.appointmentDetails.children.cardContent.children.appointmentDetailCard.children.appointmentDesc.props",
      property: "disabled",
      value: false
    },
    {
      path: "components.div.children.appointmentDetailsFormCard.children.apint.children.cardContent.children.appointmentDetails.children.cardContent.children.appointmentDetailCard.children.appointmentdate.props",
      property: "disabled",
      value: false
    },
    {
      path: "components.div.children.appointmentDetailsFormCard.children.apint.children.cardContent.children.appointmentDetails.children.cardContent.children.appointmentDetailCard.children.appointmenttime.props",
      property: "disabled",
      value: false
    }

  ];

  dispatchMultipleFieldChangeAction("search-preview", actionDefination1, dispatch);
}

export const appointmentDetails = getCommonGrayCard(
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
            labelKey: "MR_APPOINTMENT_DETAIL_HEADER"
          })
        },
        editSection: {
          componentPath: "Button",
          props: {
            color: "primary"
          },
          //visible: getQueryArg(window.location.href, "status") === "PENDINGAPPROVAL"? true:false,
          visible: false,
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
              labelKey: "MR_RESCHEDULE"
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
    appointmentDetailCard: getCommonContainer({


      appointmentdate: getDateField({
        label: {
          labelName: "MR_APPOINTMENT_DATE_LABEL",
          labelKey: "MR_APNT_START_TIME_LABEL"
        },
        placeholder: {
          labelName: "MR_APNT_START_TIME_PLACEHOLDER",
          labelKey: "MR_APNT_START_TIME_PLACEHOLDER"
        },
        props: {
          className: "mr-mrg-apnt",

        },
        jsonPath: "MarriageRegistrations[0].appointmentDate",

        required: true,
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        }
      }),
      appointmenttime: getTimeField({
        label: {
          labelName: "MR_APNT_END_TIME_LABEL",
          labelKey: "MR_APNT_END_TIME_LABEL"
        },
        placeholder: {
          labelName: "MR_APNT_END_TIME_PLACEHOLDER",
          labelKey: "MR_APNT_END_TIME_PLACEHOLDER"
        },
        props: {
          className: "mr-mrg-apnt",

          defaultValue: "00:00",
          style: { marginBottom: 10, paddingRight: 80 },
        },
        jsonPath: "MarriageRegistrations[0].appointmentTime",

        required: true,
        defaultValue: "00:00",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        }
      }),
      appointmentDesc: getTextField({
        label: {
          labelName: "Door/House No.",
          labelKey: "MR_APNT_DESCRIPTION_LABEL"
        },
        props: {
          className: "applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "MR_APNT_DESCRIPTION_LABEL_PLACEHOLDER"
        },

        jsonPath: "MarriageRegistrations[0].appointmentDesc",

      }),

    })
  }
);
