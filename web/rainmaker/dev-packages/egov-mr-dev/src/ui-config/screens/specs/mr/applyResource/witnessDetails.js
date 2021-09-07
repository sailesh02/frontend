import {
  getCommonCard,
  getCommonGrayCard,
  getCommonTitle,
  getCommonSubHeader,
  getTextField,
  getSelectField,
  getCommonContainer,
  getDateField,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg,getTodaysDateInYMD, getMaxDate } from "egov-ui-framework/ui-utils/commons";
import {
  getDetailsForOwner,
  updateOwnerShipEdit
} from "../../utils";
import { prepareFinalObject as pFO } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.css";


export const witness1Details = getCommonCard(
  {
    header: getCommonTitle(
      {
        labelName: "Trade Location Details",
        //labelKey: "TL_NEW_TRADE_DETAILS_HEADER_TRADE_LOC_DETAILS"
        labelKey: "Witness One Details"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    witness1DetailsConatiner: getCommonContainer({
      witness1Fname: getTextField({
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
          labelKey: "First Name"
        },
        pattern: getPattern("Address"),
        jsonPath: "Licenses[0].witness1FName",
        required: true,
      }),
      witness1MName: getTextField({
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
          labelKey: "Middle Name"
        },
        pattern: getPattern("Address"),
        jsonPath: "Licenses[0].witness1MName",

      }),
      witness1LName: getTextField({
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
          labelKey: "Last Name"
        },
        pattern: getPattern("Address"),
        jsonPath: "Licenses[0].witness1LName",

      }),
      witness1Address: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "Witness Address"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "Witness Address"
        },
        pattern: getPattern("Address"),
        jsonPath: "Licenses[0].witness1Address",

      }),
      witness1Country: {
        ...getSelectField({
          label: {
            labelName: "City",
            //labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL"
            labelKey: "Country"
          },

          optionLabel: "name",
          placeholder: { labelName: "Select Country", labelKey: "Country" },
          sourceJsonPath: "applyScreenMdmsData.TradeLicense.mrCountry",
          jsonPath: "Licenses[0].witness1Country",
          required: true,

        }),
      },
      witness1State: {
        ...getSelectField({
          label: {
            labelName: "City",
            //labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL"
            labelKey: "State"
          },

          optionLabel: "name",
          placeholder: { labelName: "Select Country", labelKey: "State" },
          sourceJsonPath: "applyScreenMdmsData.TradeLicense.mrState",
          jsonPath: "Licenses[0].witness1State",
          required: true,

        }),
      },
      witness1District: {
        ...getSelectField({
          label: {
            labelName: "City",
            //labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL"
            labelKey: "District"
          },

          optionLabel: "name",
          placeholder: { labelName: "Select Country", labelKey: "District" },
          sourceJsonPath: "applyScreenMdmsData.TradeLicense.mrDistrict",
          jsonPath: "Licenses[0].witness1District",
          required: true,

        }),
      },
      witness1AddressPin: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "PIN"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "PIN"
        },
        required: true,
        //pattern: getPattern("Address"),
        jsonPath: "Licenses[0].witness1AddressPin",

      }),
      witness1Contact: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "Contact"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "Contact"
        },
        required: true,
        //pattern: getPattern("Address"),
        jsonPath: "Licenses[0].witness1Contact",

      }),
    })
  }
)

export const witness2Details = getCommonCard(
  {
    header: getCommonTitle(
      {
        labelName: "Trade Location Details",
        //labelKey: "TL_NEW_TRADE_DETAILS_HEADER_TRADE_LOC_DETAILS"
        labelKey: "Witness Two Details"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    witness2DetailsConatiner: getCommonContainer({
      witness2Fname: getTextField({
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
          labelKey: "First Name"
        },
        pattern: getPattern("Address"),
        jsonPath: "Licenses[0].witness2FName",
        required: true,
      }),
      witness2MName: getTextField({
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
          labelKey: "Middle Name"
        },
        pattern: getPattern("Address"),
        jsonPath: "Licenses[0].witness2MName",

      }),
      witness2LName: getTextField({
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
          labelKey: "Last Name"
        },
        pattern: getPattern("Address"),
        jsonPath: "Licenses[0].witness2LName",

      }),
      witness2Address: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "Witness Address"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "Witness Address"
        },
        pattern: getPattern("Address"),
        jsonPath: "Licenses[0].witness2Address",

      }),
      witness2Country: {
        ...getSelectField({
          label: {
            labelName: "City",
            //labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL"
            labelKey: "Country"
          },

          optionLabel: "name",
          placeholder: { labelName: "Select Country", labelKey: "Country" },
          sourceJsonPath: "applyScreenMdmsData.TradeLicense.mrCountry",
          jsonPath: "Licenses[0].witness2Country",
          required: true,

        }),
      },
      witness2State: {
        ...getSelectField({
          label: {
            labelName: "City",
            //labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL"
            labelKey: "State"
          },

          optionLabel: "name",
          placeholder: { labelName: "Select Country", labelKey: "State" },
          sourceJsonPath: "applyScreenMdmsData.TradeLicense.mrState",
          jsonPath: "Licenses[0].witness2State",
          required: true,

        }),
      },
      witness2District: {
        ...getSelectField({
          label: {
            labelName: "City",
            //labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL"
            labelKey: "District"
          },

          optionLabel: "name",
          placeholder: { labelName: "Select Country", labelKey: "District" },
          sourceJsonPath: "applyScreenMdmsData.TradeLicense.mrDistrict",
          jsonPath: "Licenses[0].witness2District",
          required: true,

        }),
      },
      witness2AddressPin: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "PIN"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "PIN"
        },
        required: true,
        //pattern: getPattern("Address"),
        jsonPath: "Licenses[0].witness2AddressPin",

      }),
      witness2Contact: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "Contact"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "Contact"
        },
        required: true,
        //pattern: getPattern("Address"),
        jsonPath: "Licenses[0].witness2Contact",

      }),
    })
  }
)


export const witnessDetails = {

  witness1Details,
  witness2Details
};