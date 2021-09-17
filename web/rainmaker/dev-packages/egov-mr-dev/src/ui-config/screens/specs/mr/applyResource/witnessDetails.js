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
        jsonPath: "MarriageRegistrations[0].witness[0].firstName",
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
        pattern: getPattern("Address"),
        jsonPath: "MarriageRegistrations[0].witness[0].address",

      }),
      witness1District: {
        ...getSelectField({
          label: {
            labelName: "City",
            labelKey: "MR_DISTRICT_LABEL"
          },

          optionLabel: "name",
          placeholder: { labelName: "Select Country", labelKey: "MR_DISTRICT_PLACEHOLDER" },
          sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.mrDistrict",
          jsonPath: "MarriageRegistrations[0].witness[0].district",
          required: true,

        }),
      },
      witness1State: {
        ...getSelectField({
          label: {
            labelName: "City",
            labelKey: "MR_STATE_LABEL"
          },

          optionLabel: "name",
          placeholder: { labelName: "Select Country", labelKey: "MR_STATE_PLACEHOLDER" },
          sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.mrState",
          jsonPath: "MarriageRegistrations[0].witness[0].state",
          required: true,

        }),
      },

      witness1Country: {
        ...getSelectField({
          label: {
            labelName: "City",
            labelKey: "MR_COUNTRY_LABEL"
          },

          optionLabel: "name",
          placeholder: { labelName: "Select Country", labelKey: "MR_COUNTRY_PLACEHOLDER" },
          sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.mrCountry",
          jsonPath: "MarriageRegistrations[0].witness[0].country",
          required: true,

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
        jsonPath: "MarriageRegistrations[0].witness[0].pinCode",

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
        //pattern: getPattern("Address"),
        jsonPath: "MarriageRegistrations[0].witness[0].contact",

      }),
    })
  }
)

export const witness2Details = getCommonCard(
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
        jsonPath: "MarriageRegistrations[0].witness[1].firstName",
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
        pattern: getPattern("Address"),
        jsonPath: "MarriageRegistrations[0].witness[1].address",

      }),
      witness2District: {
        ...getSelectField({
          label: {
            labelName: "City",
            labelKey: "MR_DISTRICT_LABEL"
          },

          optionLabel: "name",
          placeholder: { labelName: "Select Country", labelKey: "MR_DISTRICT_LABEL" },
          sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.mrDistrict",
          jsonPath: "MarriageRegistrations[0].witness[1].district",
          required: true,

        }),
      },

      witness2State: {
        ...getSelectField({
          label: {
            labelName: "City",
            labelKey: "MR_STATE_LABEL"
          },

          optionLabel: "name",
          placeholder: { labelName: "Select Country", labelKey: "MR_STATE_PLACEHOLDER" },
          sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.mrState",
          jsonPath: "MarriageRegistrations[0].witness[1].state",
          required: true,

        }),
      },
      witness2Country: {
        ...getSelectField({
          label: {
            labelName: "City",
            labelKey: "MR_COUNTRY_LABEL"
          },

          optionLabel: "name",
          placeholder: { labelName: "Select Country", labelKey: "MR_COUNTRY_PLACEHOLDER" },
          sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.mrCountry",
          jsonPath: "MarriageRegistrations[0].witness[1].country",
          required: true,

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
        jsonPath: "MarriageRegistrations[0].witness[1].pinCode",

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
        //pattern: getPattern("Address"),
        jsonPath: "MarriageRegistrations[0].witness[1].contact",

      }),
    })
  }
)


export const witnessDetails = {

  witness1Details,
  witness2Details
};