import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getSelectField,
  getCommonContainer,
  getPattern,
  getDateField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { httpRequest } from "../../../../../ui-utils/api";
import { getMapLocator } from "../../utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { showHideMapPopup, getDetailsFromProperty } from "../../utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import "./index.css";

export const groomDetails = getCommonCard(
  {
    header: getCommonTitle(
      {
        labelName: "Trade Location Details",
        //labelKey: "TL_NEW_TRADE_DETAILS_HEADER_TRADE_LOC_DETAILS"
        labelKey: "Groom Details"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),

    groomDetailsConatiner: getCommonContainer({


      groomFName: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "First Name"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
         // labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_PLACEHOLDER"
         labelKey: "First Name"
        },
        pattern: getPattern("DoorHouseNo"),
        jsonPath: "Licenses[0].tradeLicenseDetail.address.groomFName",
        required: true,
      }),

      groomMName: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "Middle Name"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
         // labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_PLACEHOLDER"
         labelKey: "Middle Name"
        },
        pattern: getPattern("DoorHouseNo"),
        jsonPath: "Licenses[0].tradeLicenseDetail.address.groomMName",
        //required: true,
      }),

      groomLName: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "Last Name"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
         // labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_PLACEHOLDER"
         labelKey: "Last Name"
        },
        pattern: getPattern("DoorHouseNo"),
        jsonPath: "Licenses[0].tradeLicenseDetail.address.groomLName",

      }),

      groomFatherFName: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "Father's First Name"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
         // labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_PLACEHOLDER"
         labelKey: "Father's First Name"
        },
        pattern: getPattern("DoorHouseNo"),
        jsonPath: "Licenses[0].tradeLicenseDetail.address.groomFatherFName",
        required: true,
      }),

      groomFatherMName: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "Father's Middle Name"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
         // labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_PLACEHOLDER"
         labelKey: "Father's Middle Name"
        },
        pattern: getPattern("DoorHouseNo"),
        jsonPath: "Licenses[0].tradeLicenseDetail.address.groomFatherMName",

      }),

      groomFatherLName: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "Father's Last Name"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
         // labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_PLACEHOLDER"
         labelKey: "Father's Last Name"
        },
        pattern: getPattern("DoorHouseNo"),
        jsonPath: "Licenses[0].tradeLicenseDetail.address.groomFatherLName",

      }),

      groomMotherFName: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "Mother's First Name"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
         // labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_PLACEHOLDER"
         labelKey: "Mother's First Name"
        },
        pattern: getPattern("DoorHouseNo"),
        jsonPath: "Licenses[0].tradeLicenseDetail.address.groomMotherFName",
        required: true,
      }),

      groomMotherMName: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "Mother's Middle Name"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
         // labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_PLACEHOLDER"
         labelKey: "Mother's Middle Name"
        },
        pattern: getPattern("DoorHouseNo"),
        jsonPath: "Licenses[0].tradeLicenseDetail.address.groomMotherMName",

      }),

      groomMotherLName: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "Mother's Last Name"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
         // labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_PLACEHOLDER"
         labelKey: "Mother's Last Name"
        },
        pattern: getPattern("DoorHouseNo"),
        jsonPath: "Licenses[0].tradeLicenseDetail.address.groomMotherLName",

      }),

      isGroomDisabled: {
        ...getSelectField({
          label: {
            labelName: "City",
            //labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL"
            labelKey: "Is Groom Divyang?"
          },

          optionLabel: "name",
          placeholder: { labelName: "Select Country", labelKey: "Is Groom Divyang?" },
          sourceJsonPath: "applyScreenMdmsData.TradeLicense.yesNoBox",
          jsonPath: "Licenses[0].isGroomDivyang",

          defaultValue: "No"
        }),
      },

    },
    {
      style:getQueryArg(window.location.href, "action") === "EDITRENEWAL"? {"pointer-events":"none"}:{}
    }
    ),

  }
);
