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
export const groomDetails = getCommonCard(
  {
    header: getCommonTitle(
      {
        labelName: "Trade Location Details",
        labelKey: "MR_GROOM_HEADER"
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
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.firstName",
        required: true,
      }),

      // groomMName: getTextField({
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
      //   jsonPath: "MarriageRegistrations[0].coupleDetails[1].middleName",
      //   //required: true,
      // }),

      // groomLName: getTextField({
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
      //   jsonPath: "MarriageRegistrations[0].coupleDetails[1].lastName",

      // }),
      groomDob: {
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
          jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.dateOfBirth",
          disabled:getQueryArg(window.location.href, "action") === "CORRECTION"? true:false,
          props: {

            inputProps: {

              max: getCurrentDate()

            }
          }
        }),

      },
      groomContact: getTextField({
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
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.address.contact",
        required: true,
        disabled:getQueryArg(window.location.href, "action") === "CORRECTION"? true:false,
      }),
      groomEmail: getTextField({
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
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.address.emailAddress",
        required: true,
        disabled:getQueryArg(window.location.href, "action") === "CORRECTION"? true:false,
      }),

      groomFatherFName: getTextField({
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
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.fatherName",
        required: true,
        disabled:getQueryArg(window.location.href, "action") === "CORRECTION"? true:false,
      }),



      groomMotherFName: getTextField({
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
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.motherName",
        required: true,
        disabled:getQueryArg(window.location.href, "action") === "CORRECTION"? true:false,
      }),


      groomAddress: getTextField({
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
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.address.addressLine1",
        required: true,
      }),

      // groomDistrict: {
      //   ...getSelectField({
      //     label: {
      //       labelName: "City",
      //       labelKey: "MR_DISTRICT_LABEL"
      //     },

      //     optionLabel: "name",
      //     placeholder: { labelName: "Select Country", labelKey: "MR_DISTRICT_PLACEHOLDER" },
      //     sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.mrDistrict",
      //     jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.address.district",
      //     required: true,

      //   }),
      // },
      // groomState: {
      //   ...getSelectField({
      //     label: {
      //       labelName: "City",
      //       labelKey: "MR_STATE_LABEL"
      //     },

      //     optionLabel: "name",
      //     placeholder: { labelName: "Select Country", labelKey: "MR_STATE_PLACEHOLDER" },
      //     sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.mrState",
      //     jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.address.state",
      //     required: true,

      //   }),
      // },

      groomDistrict: getTextField({
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
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.address.district",
        required: true,
        disabled:getQueryArg(window.location.href, "action") === "CORRECTION"? true:false,
      }),
      groomState: getTextField({
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
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.address.state",
        required: true,
        disabled:getQueryArg(window.location.href, "action") === "CORRECTION"? true:false,
      }),

      groomCountry: {
        ...getSelectField({
          label: {
            labelName: "City",
            labelKey: "MR_COUNTRY_LABEL"
          },

          optionLabel: "name",
          placeholder: { labelName: "Select Country", labelKey: "MR_COUNTRY_PLACEHOLDER" },
          sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.mrCountry",
          jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.address.country",
          required: true,
          disabled:getQueryArg(window.location.href, "action") === "CORRECTION"? true:false,
        }),
      },

      groomAddressPin: getTextField({
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
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.address.pinCode",
        disabled:getQueryArg(window.location.href, "action") === "CORRECTION"? true:false,

      }),

      isGroomDisabled: {
        ...getSelectField({
          label: {
            labelName: "City",
            labelKey: "MR_ISDIVYANG_LABEL"
          },

          optionLabel: "name",
          placeholder: { labelName: "Select Country", labelKey: "MR_ISDIVYANG_PLACEHOLDER" },
          sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.yesNoBox",
          jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.isDivyang",
          disabled:getQueryArg(window.location.href, "action") === "CORRECTION"? true:false,
          required: true,
        }),
      },

    },

    ),

  }
);
