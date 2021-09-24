import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getSelectField,
  getCommonContainer,
  getPattern,
  getDateField,
  getTimeField,
  getCommonGrayCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { httpRequest } from "../../../../../ui-utils/api";

import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { showHideMapPopup, getDetailsFromProperty } from "../../utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import "./index.css";


export const appointmentDetails = getCommonGrayCard(
  {
    appointmentDetailCard: getCommonContainer({
    header: getCommonTitle(
      {
        labelName: "Trade Location Details",
        labelKey: "MR_APPOINTMENT_HEADER"
      },
      {
        style: {
          marginBottom: 18,
          width: "100%",
        }
      }
    ),

    appointmentdate: getDateField({
      label: {
        labelName: "MR_APPOINTMENT_DATE_LABEL",
        labelKey: "MR_APPOINTMENT_DATE_LABEL"
      },
      props: {
        className: "mr-mrg-apnt",

      },
      jsonPath: "MarriageRegistrations[0].appointmentDate",
      required : true,
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      }
    }),
    appointmenttime: getTimeField({
      label: {
        labelName: "MR_APPOINTMENT_TIME_LABEL",
        labelKey: "MR_APPOINTMENT_TIME_LABEL"
      },
      props: {
        className: "mr-mrg-apnt",

        defaultValue: "00:00",
        style: { marginBottom: 10, paddingRight: 80 },
      },
      jsonPath: "MarriageRegistrations[0].appointmentTime",
      required : true,
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
        labelKey: "MR_DESCRIPTION_LABEL"
      },
      props:{
        className:"applicant-details-error"
      },
      placeholder: {
        labelName: "Enter Door/House No.",
        labelKey: "MR_DESCRIPTION_PLACEHOLDER"
      },

      jsonPath: "MarriageRegistrations[0].appointmentDesc",

    }),

  })
  }
);
