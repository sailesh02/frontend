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

const getCurrentDate = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + '-' + mm + '-' + dd;
  return today;
}
export const brideDetails = getCommonCard(
  {
    header: getCommonTitle(
      {
        labelName: "Trade Location Details",
        labelKey: "MR_BRIDE_HEADER"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),

    brideDetailsConatiner: getCommonContainer({


      brideFName: getTextField({
        label: {
          labelName: "Door/House No.",
          labelKey: "MR_NAME_LABEL"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "MR_NAME_PLACEHOLDER"
        },
        pattern: getPattern("DoorHouseNo"),
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.firstName",
        required: true,
      }),

      // brideMName: getTextField({
      //   label: {
      //     labelName: "Door/House No.",
      //     //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
      //     labelKey: "Middle Name"
      //   },
      //   props:{
      //     className:"applicant-details-error"
      //   },
      //   placeholder: {
      //     labelName: "Enter Door/House No.",
      //    // labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_PLACEHOLDER"
      //    labelKey: "Middle Name"
      //   },
      //   pattern: getPattern("DoorHouseNo"),
      //   jsonPath: "MarriageRegistrations[0].coupleDetails[0].middleName",
      //   //required: true,
      // }),

      // brideLName: getTextField({
      //   label: {
      //     labelName: "Door/House No.",
      //     //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
      //     labelKey: "Last Name"
      //   },
      //   props:{
      //     className:"applicant-details-error"
      //   },
      //   placeholder: {
      //     labelName: "Enter Door/House No.",
      //    // labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_PLACEHOLDER"
      //    labelKey: "Last Name"
      //   },
      //   pattern: getPattern("DoorHouseNo"),
      //   jsonPath: "MarriageRegistrations[0].coupleDetails[0].lastName",

      // }),

      brideDob: {
        ...getDateField({
          label: { labelName: "To Date",
          labelKey: "MR_DOB_LABEL"

        },
          placeholder: {
            labelName: "Trade License From Date",
            labelKey: "MR_DOB_PLACEHOLDER"
          },

          required: true,

          pattern: getPattern("Date"),
          jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.dateOfBirth",

          props: {

            inputProps: {

              max: getCurrentDate()

            }
          }
        }),

      },
      brideContact: getTextField({
        label: {
          labelName: "Door/House No.",
          labelKey: "MR_CONTACT_LABEL"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "MR_CONTACT_PLACEHOLDER"
        },
        pattern: getPattern("MobileNo"),
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.address.contact",
        required: true,
      }),
      brideEmail: getTextField({
        label: {
          labelName: "Door/House No.",
          labelKey: "MR_EMAIL_LABEL"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "MR_EMAIL_PLACEHOLDER"
        },
        pattern: getPattern("Email"),
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.address.emailAddress",
        required: true,
      }),

      brideFatherFName: getTextField({
        label: {
          labelName: "Door/House No.",
          labelKey: "MR_FATHERNAME_LABEL"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "MR_FATHERNAME_PLACEHOLDER"
        },
        pattern: getPattern("DoorHouseNo"),
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.fatherName",
        required: true,
      }),

      // brideFatherMName: getTextField({
      //   label: {
      //     labelName: "Door/House No.",
      //     //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
      //     labelKey: "Father's Middle Name"
      //   },
      //   props:{
      //     className:"applicant-details-error"
      //   },
      //   placeholder: {
      //     labelName: "Enter Door/House No.",
      //    // labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_PLACEHOLDER"
      //    labelKey: "Father's Middle Name"
      //   },
      //   pattern: getPattern("DoorHouseNo"),
      //   jsonPath: "Licenses[0].tradeLicenseDetail.address.brideFatherMName",

      // }),

      // brideFatherLName: getTextField({
      //   label: {
      //     labelName: "Door/House No.",
      //     //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
      //     labelKey: "Father's Last Name"
      //   },
      //   props:{
      //     className:"applicant-details-error"
      //   },
      //   placeholder: {
      //     labelName: "Enter Door/House No.",
      //    // labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_PLACEHOLDER"
      //    labelKey: "Father's Last Name"
      //   },
      //   pattern: getPattern("DoorHouseNo"),
      //   jsonPath: "Licenses[0].tradeLicenseDetail.address.brideFatherLName",

      // }),

      brideMotherFName: getTextField({
        label: {
          labelName: "Door/House No.",
          labelKey: "MR_MOTHERNAME_LABEL"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "MR_MOTHERNAME_PLACEHOLDER"
        },
        pattern: getPattern("DoorHouseNo"),
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.motherName",
        required: true,
      }),

      // brideMotherMName: getTextField({
      //   label: {
      //     labelName: "Door/House No.",
      //     //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
      //     labelKey: "Mother's Middle Name"
      //   },
      //   props:{
      //     className:"applicant-details-error"
      //   },
      //   placeholder: {
      //     labelName: "Enter Door/House No.",
      //    // labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_PLACEHOLDER"
      //    labelKey: "Mother's Middle Name"
      //   },
      //   pattern: getPattern("DoorHouseNo"),
      //   jsonPath: "Licenses[0].tradeLicenseDetail.address.brideMotherMName",

      // }),

      // brideMotherLName: getTextField({
      //   label: {
      //     labelName: "Door/House No.",
      //     //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
      //     labelKey: "Mother's Last Name"
      //   },
      //   props:{
      //     className:"applicant-details-error"
      //   },
      //   placeholder: {
      //     labelName: "Enter Door/House No.",
      //    // labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_PLACEHOLDER"
      //    labelKey: "Mother's Last Name"
      //   },
      //   pattern: getPattern("DoorHouseNo"),
      //   jsonPath: "MarriageRegistrations[0].coupleDetails[0].motherName",

      // }),
      brideAddressLine1: getTextField({
        label: {
          labelName: "Door/House No.",
          labelKey: "MR_ADDRESS_LABEL"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "MR_ADDRESS_PLACEHOLDER"
        },
        pattern: getPattern("Address"),
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.address.addressLine1",
        required: true,
      }),
      brideDistrict: getTextField({
        label: {
          labelName: "Door/House No.",
          labelKey: "MR_DISTRICT_LABEL"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "MR_DISTRICT_PLACEHOLDER"
        },
        pattern: getPattern("Address"),
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.address.district",
        required: true,
      }),
      brideState: getTextField({
        label: {
          labelName: "Door/House No.",
          labelKey: "MR_STATE_LABEL"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "MR_STATE_PLACEHOLDER"
        },
        pattern: getPattern("Address"),
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.address.state",
        required: true,
      }),
      // brideDistrict: {
      //   ...getSelectField({
      //     label: {
      //       labelName: "City",
      //       labelKey: "MR_DISTRICT_LABEL"
      //     },

      //     optionLabel: "name",
      //     placeholder: { labelName: "Select Country", labelKey: "MR_DISTRICT_PLACEHOLDER" },
      //     sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.mrDistrict",
      //     jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.address.district",
      //     required: true,

      //   }),
      // },
      // brideState: {
      //   ...getSelectField({
      //     label: {
      //       labelName: "City",
      //       labelKey: "MR_STATE_LABEL"
      //     },

      //     optionLabel: "name",
      //     placeholder: { labelName: "Select Country", labelKey: "MR_STATE_PLACEHOLDER" },
      //     sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.mrState",
      //     jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.address.state",
      //     required: true,

      //   }),
      // },
      brideCountry: {
        ...getSelectField({
          label: {
            labelName: "City",
            labelKey: "MR_COUNTRY_LABEL"
          },

          optionLabel: "name",
          placeholder: { labelName: "Select Country", labelKey: "MR_COUNTRY_PLACEHOLDER" },
          sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.mrCountry",
          jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.address.country",
          required: true,

        }),
      },
      brideAddressPin: getTextField({
        label: {
          labelName: "Door/House No.",
          labelKey: "MR_PINCODE_LABEL"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "MR_PINCODE_PLACEHOLDER"
        },
        required: true,
        //pattern: getPattern("Address"),
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.address.pinCode",

      }),
      isBrideDisabled: {
        ...getSelectField({
          label: {
            labelName: "City",
            labelKey: "MR_ISDIVYANG_LABEL"
          },

          optionLabel: "name",
          placeholder: { labelName: "Select Country", labelKey: "MR_ISDIVYANG_PLACEHOLDER" },
          sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.yesNoBox",
          jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.isDivyang",

        }),
      },

    },
    {
      style:getQueryArg(window.location.href, "action") === "CORRECTION"? {"pointer-events":"none"}:{}
    }
    ),

  },
  {
    style:getQueryArg(window.location.href, "action") === "CORRECTION"? {"cursor":"not-allowed",overflow:"visible"}:{overflow: "visible"}

  }
);
