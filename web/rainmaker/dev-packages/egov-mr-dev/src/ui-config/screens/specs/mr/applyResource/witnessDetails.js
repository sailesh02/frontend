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


export const brideWitnessDetails = getCommonCard(
  {
    header: getCommonTitle(
      {
        labelName: "Trade Location Details",
        labelKey: "MR_BRIDE_WITNESS_HEADER"
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
          labelKey: "MR_NAME_LABEL"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "MR_NAME_PLACEHOLDER"
        },
        pattern: getPattern("Address"),
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.witness.firstName",
        required: true,
      }),

      witness1Address: getTextField({
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
        pattern: getPattern("mrAddress"),
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.witness.address",
        required: true,
        //disabled:getQueryArg(window.location.href, "action") === "CORRECTION"? true:false,

      }),

      witness1District: getTextField({
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
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.witness.district",
        required: true,
        //disabled:getQueryArg(window.location.href, "action") === "CORRECTION"? true:false,
      }),
      witness1State: getTextField({
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
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.witness.state",
        required: true,
        //disabled:getQueryArg(window.location.href, "action") === "CORRECTION"? true:false,
      }),

      // witness1District: {
      //   ...getSelectField({
      //     label: {
      //       labelName: "City",
      //       labelKey: "MR_DISTRICT_LABEL"
      //     },

      //     optionLabel: "name",
      //     placeholder: { labelName: "Select Country", labelKey: "MR_DISTRICT_PLACEHOLDER" },
      //     sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.mrDistrict",
      //     jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.witness.district",
      //     required: true,

      //   }),
      // },
      // witness1State: {
      //   ...getSelectField({
      //     label: {
      //       labelName: "City",
      //       labelKey: "MR_STATE_LABEL"
      //     },

      //     optionLabel: "name",
      //     placeholder: { labelName: "Select Country", labelKey: "MR_STATE_PLACEHOLDER" },
      //     sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.mrState",
      //     jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.witness.state",
      //     required: true,

      //   }),
      // },

      witness1Country: {
        ...getSelectField({
          label: {
            labelName: "City",
            labelKey: "MR_COUNTRY_LABEL"
          },

          optionLabel: "name",
          placeholder: { labelName: "Select Country", labelKey: "MR_COUNTRY_PLACEHOLDER" },
          sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.mrCountry",
          jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.witness.country",
          required: true,
          //disabled:getQueryArg(window.location.href, "action") === "CORRECTION"? true:false,
        }),
      },
      witness1AddressPin: getTextField({
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
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.witness.pinCode",
       // disabled:getQueryArg(window.location.href, "action") === "CORRECTION"? true:false,
      }),
      witness1Contact: getTextField({
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
        required: true,
        pattern: getPattern("MobileNo"),
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.witness.contact",
       // disabled:getQueryArg(window.location.href, "action") === "CORRECTION"? true:false,
      }),
    })
  }
)

export const groomWitnessDetails = getCommonCard(
  {
    header: getCommonTitle(
      {
        labelName: "Trade Location Details",
        labelKey: "MR_GROOM_WITNESS_HEADER"
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
          labelKey: "MR_NAME_LABEL"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "MR_NAME_PLACEHOLDER"
        },
        pattern: getPattern("Address"),
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.witness.firstName",
        required: true,

      }),

      witness2Address: getTextField({
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
        pattern: getPattern("mrAddress"),
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.witness.address",
        required: true,
       // disabled:getQueryArg(window.location.href, "action") === "CORRECTION"? true:false,
      }),

      witness2District: getTextField({
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
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.witness.district",
        required: true,
       // disabled:getQueryArg(window.location.href, "action") === "CORRECTION"? true:false,
      }),
      witness2State: getTextField({
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
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.witness.state",
        required: true,
       // disabled:getQueryArg(window.location.href, "action") === "CORRECTION"? true:false,
      }),


      // witness2District: {
      //   ...getSelectField({
      //     label: {
      //       labelName: "City",
      //       labelKey: "MR_DISTRICT_LABEL"
      //     },

      //     optionLabel: "name",
      //     placeholder: { labelName: "Select Country", labelKey: "MR_DISTRICT_LABEL" },
      //     sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.mrDistrict",
      //     jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.witness.district",
      //     required: true,

      //   }),
      // },

      // witness2State: {
      //   ...getSelectField({
      //     label: {
      //       labelName: "City",
      //       labelKey: "MR_STATE_LABEL"
      //     },

      //     optionLabel: "name",
      //     placeholder: { labelName: "Select Country", labelKey: "MR_STATE_PLACEHOLDER" },
      //     sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.mrState",
      //     jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.witness.state",
      //     required: true,

      //   }),
      // },
      witness2Country: {
        ...getSelectField({
          label: {
            labelName: "City",
            labelKey: "MR_COUNTRY_LABEL"
          },

          optionLabel: "name",
          placeholder: { labelName: "Select Country", labelKey: "MR_COUNTRY_PLACEHOLDER" },
          sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.mrCountry",
          jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.witness.country",
          required: true,
          //disabled:getQueryArg(window.location.href, "action") === "CORRECTION"? true:false,
        }),
      },
      witness2AddressPin: getTextField({
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
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.witness.pinCode",
       // disabled:getQueryArg(window.location.href, "action") === "CORRECTION"? true:false,
      }),
      witness2Contact: getTextField({
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
        required: true,
        pattern: getPattern("MobileNo"),
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.witness.contact",
       // disabled:getQueryArg(window.location.href, "action") === "CORRECTION"? true:false,
      }),
    }
    )
  }
)


export const witnessDetails = {

  brideWitnessDetails,
  groomWitnessDetails
};