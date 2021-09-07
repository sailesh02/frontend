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

const getCurrentDate = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + '-' + mm + '-' + dd;
  return today;
}
export const brideAddressDetails = getCommonCard(
  {
    header: getCommonTitle(
      {
        labelName: "Trade Location Details",
        //labelKey: "TL_NEW_TRADE_DETAILS_HEADER_TRADE_LOC_DETAILS"
        labelKey: "Address Details of Bride"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    brideAddressDetailsConatiner: getCommonContainer({
      brideAddressLine1: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "Bride Address Line 1"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "Bride Address Line 1"
        },
        pattern: getPattern("Address"),
        jsonPath: "Licenses[0].tradeLicenseDetail.address.brideAddressLine1",
        required: true,
      }),
      brideAddressLine2: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "Bride Address Line 2"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "Bride Address Line 1"
        },
        pattern: getPattern("Address"),
        jsonPath: "Licenses[0].tradeLicenseDetail.address.brideAddressLine2",

      }),
      brideAddressLine3: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "Bride Address Line 3"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "Bride Address Line 3"
        },
        pattern: getPattern("Address"),
        jsonPath: "Licenses[0].tradeLicenseDetail.address.brideAddressLine3",

      }),
      brideCountry: {
        ...getSelectField({
          label: {
            labelName: "City",
            //labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL"
            labelKey: "Country"
          },

          optionLabel: "name",
          placeholder: { labelName: "Select Country", labelKey: "Country" },
          sourceJsonPath: "applyScreenMdmsData.TradeLicense.mrCountry",
          jsonPath: "Licenses[0].tradeLicenseDetail.address.brideMrCountry",
          required: true,

        }),
      },
      brideState: {
        ...getSelectField({
          label: {
            labelName: "City",
            //labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL"
            labelKey: "State"
          },

          optionLabel: "name",
          placeholder: { labelName: "Select Country", labelKey: "State" },
          sourceJsonPath: "applyScreenMdmsData.TradeLicense.mrState",
          jsonPath: "Licenses[0].tradeLicenseDetail.address.brideMrState",
          required: true,

        }),
      },
      brideDistrict: {
        ...getSelectField({
          label: {
            labelName: "City",
            //labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL"
            labelKey: "District"
          },

          optionLabel: "name",
          placeholder: { labelName: "Select Country", labelKey: "District" },
          sourceJsonPath: "applyScreenMdmsData.TradeLicense.mrDistrict",
          jsonPath: "Licenses[0].tradeLicenseDetail.address.brideMrDistrict",
          required: true,

        }),
      },
      brideAddressPin: getTextField({
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
        jsonPath: "Licenses[0].tradeLicenseDetail.address.brideAddressPin",

      }),
      brideDob: {
        ...getDateField({
          label: { labelName: "To Date",
          labelKey: "DOB"
          //labelKey: "TL_NEW_TRADE_DETAILS_TRADE_END_DATE_LABEL"

        },
          placeholder: {
            labelName: "Trade License From Date",
            //labelKey: "TL_TRADE_LICENCE_TO_DATE"
            labelKey: "DOB"
          },

          required: true,

          pattern: getPattern("Date"),
          jsonPath: "Licenses[0].brideDob",

          props: {

            inputProps: {

              min: getCurrentDate()

            }
          }
        }),

      },
      brideAge: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "Age"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "Age"
        },
        required: true,
        //pattern: getPattern("Address"),
        jsonPath: "Licenses[0].brideAge",

      }),
    })
  }
)

export const brideGuardianDetails = getCommonCard(
  {
    header: getCommonTitle(
      {
        labelName: "Trade Location Details",
        //labelKey: "TL_NEW_TRADE_DETAILS_HEADER_TRADE_LOC_DETAILS"
        labelKey: "Bride Guardian Details"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    brideGuardianDetailsConatiner: getCommonContainer({
      rltnWithBride: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "Relation with Bride"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "Relation with Bride"
        },
        required: true,
        //pattern: getPattern("Address"),
        jsonPath: "Licenses[0].rltnWithBride",

      }),
      brideGuardianName: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "Guardian Name"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "Guardian Name"
        },
        required: true,
        //pattern: getPattern("Address"),
        jsonPath: "Licenses[0].brideGrdnName",

      }),
      brideGrdnAddressLine1: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "Bride Guardian Address Line 1"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "Bride Guardian Address Line 1"
        },
        pattern: getPattern("Address"),
        jsonPath: "Licenses[0].tradeLicenseDetail.address.brideGrdnAddressLine1",
        required: true,
      }),
      brideGrdnAddressLine2: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "Bride Guardian Address Line 2"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "Bride Guardian Address Line 1"
        },
        pattern: getPattern("Address"),
        jsonPath: "Licenses[0].tradeLicenseDetail.address.brideGrdnAddressLine2",

      }),
      brideGrdnAddressLine3: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "Bride Guardian Address Line 3"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "Bride Guardian Address Line 3"
        },
        pattern: getPattern("Address"),
        jsonPath: "Licenses[0].tradeLicenseDetail.address.brideGrdnAddressLine3",

      }),
      brideGrdnCountry: {
        ...getSelectField({
          label: {
            labelName: "City",
            //labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL"
            labelKey: "Country"
          },

          optionLabel: "name",
          placeholder: { labelName: "Select Country", labelKey: "Country" },
          sourceJsonPath: "applyScreenMdmsData.TradeLicense.mrCountry",
          jsonPath: "Licenses[0].tradeLicenseDetail.address.brideGrdnCountry",
          required: true,

        }),
      },
      brideGrdnState: {
        ...getSelectField({
          label: {
            labelName: "City",
            //labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL"
            labelKey: "State"
          },

          optionLabel: "name",
          placeholder: { labelName: "Select Country", labelKey: "State" },
          sourceJsonPath: "applyScreenMdmsData.TradeLicense.mrState",
          jsonPath: "Licenses[0].tradeLicenseDetail.address.brideGrdnState",
          required: true,

        }),
      },
      brideGrdnDistrict: {
        ...getSelectField({
          label: {
            labelName: "City",
            //labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL"
            labelKey: "District"
          },

          optionLabel: "name",
          placeholder: { labelName: "Select Country", labelKey: "District" },
          sourceJsonPath: "applyScreenMdmsData.TradeLicense.mrDistrict",
          jsonPath: "Licenses[0].tradeLicenseDetail.address.brideGrdnDistrict",
          required: true,

        }),
      },
      brideGrdnAddressPin: getTextField({
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
        jsonPath: "Licenses[0].tradeLicenseDetail.address.brideGrdnAddressPin",

      }),

      brideGrdnContact: getTextField({
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
        jsonPath: "Licenses[0].brideGrdnContact",

      }),
      brideGrdnEmail: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "Email"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "Email"
        },
        required: true,
        //pattern: getPattern("Address"),
        jsonPath: "Licenses[0].brideGrdnEmail",

      }),
    })
  }
)





export const brideAddress = {

  brideAddressDetails,
  brideGuardianDetails
};
