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
          labelKey: "Name"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
         // labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_PLACEHOLDER"
         labelKey: "Name"
        },
        pattern: getPattern("DoorHouseNo"),
        jsonPath: "MarriageRegistrations[0].coupleDetails[1].firstName",
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

      },
      groomContact: getTextField({
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
        pattern: getPattern("MobileNo"),
        jsonPath: "MarriageRegistrations[0].coupleDetails[1].coupleAddress.contact",
        required: true,
      }),
      groomEmail: getTextField({
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
        pattern: getPattern("Email"),
        jsonPath: "MarriageRegistrations[0].coupleDetails[1].coupleAddress.emailAddress",
        required: true,
      }),

      groomFatherFName: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "Father's Name"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
         // labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_PLACEHOLDER"
         labelKey: "Father's Name"
        },
        pattern: getPattern("DoorHouseNo"),
        jsonPath: "MarriageRegistrations[0].coupleDetails[1].fatherName",
        required: true,
      }),



      groomMotherFName: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "Mother's Name"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
         // labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_PLACEHOLDER"
         labelKey: "Mother's Name"
        },
        pattern: getPattern("DoorHouseNo"),
        jsonPath: "MarriageRegistrations[0].coupleDetails[1].motherName",
        required: true,
      }),


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
          labelKey: "Address"
        },
        pattern: getPattern("Address"),
        jsonPath: "MarriageRegistrations[0].coupleDetails[1].coupleAddress.addressLine1",
        required: true,
      }),

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

      isGroomDisabled: {
        ...getSelectField({
          label: {
            labelName: "City",
            //labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL"
            labelKey: "Is Groom Divyang?"
          },

          optionLabel: "name",
          placeholder: { labelName: "Select Country", labelKey: "Is Groom Divyang?" },
          sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.yesNoBox",
          jsonPath: "MarriageRegistrations[0].coupleDetails[1].isDivyang"
        }),
      },

    },
    {
      style:getQueryArg(window.location.href, "action") === "EDITRENEWAL"? {"pointer-events":"none"}:{}
    }
    ),

  }
);
