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
export const groomAddressDetails = getCommonCard(
  {
    header: getCommonTitle(
      {
        labelName: "Trade Location Details",
        //labelKey: "TL_NEW_TRADE_DETAILS_HEADER_TRADE_LOC_DETAILS"
        labelKey: "Address Details of Groom"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    groomAddressDetailsConatiner: getCommonContainer({
      groomAddressLine1: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "groom Address Line 1"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "groom Address Line 1"
        },
        pattern: getPattern("Address"),
        jsonPath: "Licenses[0].tradeLicenseDetail.address.groomAddressLine1",
        required: true,
      }),
      groomAddressLine2: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "groom Address Line 2"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "groom Address Line 1"
        },
        pattern: getPattern("Address"),
        jsonPath: "Licenses[0].tradeLicenseDetail.address.groomAddressLine2",

      }),
      groomAddressLine3: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "groom Address Line 3"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "groom Address Line 3"
        },
        pattern: getPattern("Address"),
        jsonPath: "Licenses[0].tradeLicenseDetail.address.groomAddressLine3",

      }),
      groomCountry: {
        ...getSelectField({
          label: {
            labelName: "City",
            //labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL"
            labelKey: "Country"
          },

          optionLabel: "name",
          placeholder: { labelName: "Select Country", labelKey: "Country" },
          sourceJsonPath: "applyScreenMdmsData.TradeLicense.mrCountry",
          jsonPath: "Licenses[0].tradeLicenseDetail.address.groomMrCountry",
          required: true,

        }),
      },
      groomState: {
        ...getSelectField({
          label: {
            labelName: "City",
            //labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL"
            labelKey: "State"
          },

          optionLabel: "name",
          placeholder: { labelName: "Select Country", labelKey: "State" },
          sourceJsonPath: "applyScreenMdmsData.TradeLicense.mrState",
          jsonPath: "Licenses[0].tradeLicenseDetail.address.groomMrState",
          required: true,

        }),
      },
      groomDistrict: {
        ...getSelectField({
          label: {
            labelName: "City",
            //labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL"
            labelKey: "District"
          },

          optionLabel: "name",
          placeholder: { labelName: "Select Country", labelKey: "District" },
          sourceJsonPath: "applyScreenMdmsData.TradeLicense.mrDistrict",
          jsonPath: "Licenses[0].tradeLicenseDetail.address.groomMrDistrict",
          required: true,

        }),
      },
      groomAddressPin: getTextField({
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
        jsonPath: "Licenses[0].tradeLicenseDetail.address.groomAddressPin",

      }),
      groomDob: {
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
          jsonPath: "Licenses[0].groomDob",

          props: {

            inputProps: {

              min: getCurrentDate()

            }
          }
        }),

      },
      groomAge: getTextField({
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
        jsonPath: "Licenses[0].groomAge",

      }),
    })
  }
)

export const groomGuardianDetails = getCommonCard(
  {
    header: getCommonTitle(
      {
        labelName: "Trade Location Details",
        //labelKey: "TL_NEW_TRADE_DETAILS_HEADER_TRADE_LOC_DETAILS"
        labelKey: "groom Guardian Details"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    groomGuardianDetailsConatiner: getCommonContainer({
      rltnWithgroom: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "Relation with groom"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "Relation with groom"
        },
        required: true,
        //pattern: getPattern("Address"),
        jsonPath: "Licenses[0].rltnWithgroom",

      }),
      groomGuardianName: getTextField({
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
        jsonPath: "Licenses[0].groomGrdnName",

      }),
      groomGrdnAddressLine1: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "groom Guardian Address Line 1"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "groom Guardian Address Line 1"
        },
        pattern: getPattern("Address"),
        jsonPath: "Licenses[0].tradeLicenseDetail.address.groomGrdnAddressLine1",
        required: true,
      }),
      groomGrdnAddressLine2: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "groom Guardian Address Line 2"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "groom Guardian Address Line 1"
        },
        pattern: getPattern("Address"),
        jsonPath: "Licenses[0].tradeLicenseDetail.address.groomGrdnAddressLine2",

      }),
      groomGrdnAddressLine3: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "groom Guardian Address Line 3"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "groom Guardian Address Line 3"
        },
        pattern: getPattern("Address"),
        jsonPath: "Licenses[0].tradeLicenseDetail.address.groomGrdnAddressLine3",

      }),
      groomGrdnCountry: {
        ...getSelectField({
          label: {
            labelName: "City",
            //labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL"
            labelKey: "Country"
          },

          optionLabel: "name",
          placeholder: { labelName: "Select Country", labelKey: "Country" },
          sourceJsonPath: "applyScreenMdmsData.TradeLicense.mrCountry",
          jsonPath: "Licenses[0].tradeLicenseDetail.address.groomGrdnCountry",
          required: true,

        }),
      },
      groomGrdnState: {
        ...getSelectField({
          label: {
            labelName: "City",
            //labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL"
            labelKey: "State"
          },

          optionLabel: "name",
          placeholder: { labelName: "Select Country", labelKey: "State" },
          sourceJsonPath: "applyScreenMdmsData.TradeLicense.mrState",
          jsonPath: "Licenses[0].tradeLicenseDetail.address.groomGrdnState",
          required: true,

        }),
      },
      groomGrdnDistrict: {
        ...getSelectField({
          label: {
            labelName: "City",
            //labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL"
            labelKey: "District"
          },

          optionLabel: "name",
          placeholder: { labelName: "Select Country", labelKey: "District" },
          sourceJsonPath: "applyScreenMdmsData.TradeLicense.mrDistrict",
          jsonPath: "Licenses[0].tradeLicenseDetail.address.groomGrdnDistrict",
          required: true,

        }),
      },
      groomGrdnAddressPin: getTextField({
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
        jsonPath: "Licenses[0].tradeLicenseDetail.address.groomGrdnAddressPin",

      }),

      groomGrdnContact: getTextField({
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
        jsonPath: "Licenses[0].groomGrdnContact",

      }),
      groomGrdnEmail: getTextField({
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
        jsonPath: "Licenses[0].groomGrdnEmail",

      }),
    })
  }
)


export const groomAddress = {
  groomAddressDetails,
  groomGuardianDetails
};
