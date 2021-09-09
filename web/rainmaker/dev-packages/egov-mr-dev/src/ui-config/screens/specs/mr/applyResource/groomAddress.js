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
      groomAddress: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "Address"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "groom Address Line 1"
        },
        pattern: getPattern("Address"),
        jsonPath: "MarriageRegistrations[0].coupleDetails[1].coupleAddress.addressLine1",
        required: true,
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
          sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.mrCountry",
          jsonPath: "MarriageRegistrations[0].coupleDetails[1].coupleAddress.country",
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
          sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.mrState",
          jsonPath: "MarriageRegistrations[0].coupleDetails[1].coupleAddress.state",
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
          sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.mrDistrict",
          jsonPath: "MarriageRegistrations[0].coupleDetails[1].coupleAddress.district",
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
        jsonPath: "MarriageRegistrations[0].coupleDetails[1].coupleAddress.pinCode",

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
          jsonPath: "MarriageRegistrations[0].coupleDetails[1].dateOfBirth",

          props: {

            inputProps: {

              max: getCurrentDate()

            }
          }
        }),

      }
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
        jsonPath: "MarriageRegistrations[0].coupleDetails[1].guardianDetails.relationship",

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
        jsonPath: "MarriageRegistrations[0].coupleDetails[1].guardianDetails.name",

      }),
      groomGrdnAddressLine1: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "Address"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "Address"
        },
        pattern: getPattern("Address"),
        jsonPath: "MarriageRegistrations[0].coupleDetails[1].guardianDetails.addressline1",
        required: true,
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
          sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.mrCountry",
          jsonPath: "MarriageRegistrations[0].coupleDetails[1].guardianDetails.country",
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
          sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.mrState",
          jsonPath: "MarriageRegistrations[0].coupleDetails[1].guardianDetails.state",
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
          sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.mrDistrict",
          jsonPath: "MarriageRegistrations[0].coupleDetails[1].guardianDetails.district",
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
        jsonPath: "MarriageRegistrations[0].coupleDetails[1].guardianDetails.pinCode",

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
        jsonPath: "MarriageRegistrations[0].coupleDetails[1].guardianDetails.contact",

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
        jsonPath: "MarriageRegistrations[0].coupleDetails[1].guardianDetails.emailAddress",

      }),
    })
  }
)


export const groomAddress = {
  groomAddressDetails,
  groomGuardianDetails
};
