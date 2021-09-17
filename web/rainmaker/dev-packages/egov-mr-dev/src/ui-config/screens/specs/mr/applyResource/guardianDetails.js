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
import { getQueryArg, getTodaysDateInYMD, getMaxDate } from "egov-ui-framework/ui-utils/commons";
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
export const groomGuardianDetails = getCommonCard(
    {
        header: getCommonTitle(
            {
                labelName: "Trade Location Details",
                labelKey: "MR_GROOM_GUARDIAN_HEADER"

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
                    labelKey: "MR_GROOMGUARDIAN_RELATION_LABEL"
                },
                props: {
                    className: "applicant-details-error"
                },
                placeholder: {
                    labelName: "Enter Door/House No.",
                    labelKey: "MR_GROOMGUARDIAN_RELATION_PLACEHOLDER"
                },
                required: true,
                //pattern: getPattern("Address"),
                jsonPath: "MarriageRegistrations[0].coupleDetails[1].guardianDetails.relationship",

            }),
            groomGuardianName: getTextField({
                label: {
                    labelName: "Door/House No.",
                    labelKey: "MR_NAME_LABEL"
                },
                props: {
                    className: "applicant-details-error"
                },
                placeholder: {
                    labelName: "Enter Door/House No.",
                    labelKey: "MR_NAME_PLACEHOLDER"
                },
                required: true,
                //pattern: getPattern("Address"),
                jsonPath: "MarriageRegistrations[0].coupleDetails[1].guardianDetails.name",

            }),
            groomGrdnAddressLine1: getTextField({
                label: {
                    labelName: "Door/House No.",
                    labelKey: "MR_ADDRESS_LABEL"
                },
                props: {
                    className: "applicant-details-error"
                },
                placeholder: {
                    labelName: "Enter Door/House No.",
                    labelKey: "MR_ADDRESS_PLACEHOLDER"
                },
                pattern: getPattern("Address"),
                jsonPath: "MarriageRegistrations[0].coupleDetails[1].guardianDetails.addressLine1",
                required: true,
            }),
            groomGrdnDistrict: {
                ...getSelectField({
                    label: {
                        labelName: "City",
                        labelKey: "MR_DISTRICT_LABEL"
                    },

                    optionLabel: "name",
                    placeholder: { labelName: "Select Country", labelKey: "MR_DISTRICT_PLACEHOLDER" },
                    sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.mrDistrict",
                    jsonPath: "MarriageRegistrations[0].coupleDetails[1].guardianDetails.district",
                    required: true,

                }),
            },

            groomGrdnState: {
                ...getSelectField({
                    label: {
                        labelName: "City",
                        labelKey: "MR_STATE_LABEL"
                    },

                    optionLabel: "name",
                    placeholder: { labelName: "Select Country", labelKey: "MR_STATE_PLACEHOLDER" },
                    sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.mrState",
                    jsonPath: "MarriageRegistrations[0].coupleDetails[1].guardianDetails.state",
                    required: true,

                }),
            },

            groomGrdnCountry: {
                ...getSelectField({
                    label: {
                        labelName: "City",
                        labelKey: "MR_COUNTRY_LABEL"
                    },

                    optionLabel: "name",
                    placeholder: { labelName: "Select Country", labelKey: "MR_COUNTRY_PLACEHOLDER" },
                    sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.mrCountry",
                    jsonPath: "MarriageRegistrations[0].coupleDetails[1].guardianDetails.country",
                    required: true,

                }),
            },
            groomGrdnAddressPin: getTextField({
                label: {
                    labelName: "Door/House No.",
                    labelKey: "MR_PINCODE_LABEL"
                },
                props: {
                    className: "applicant-details-error"
                },
                placeholder: {
                    labelName: "Enter Door/House No.",
                    labelKey: "MR_PINCODE_PLACEHOLDER"
                },
                required: true,
                //pattern: getPattern("Address"),
                jsonPath: "MarriageRegistrations[0].coupleDetails[1].guardianDetails.pinCode",

            }),

            groomGrdnContact: getTextField({
                label: {
                    labelName: "Door/House No.",
                    labelKey: "MR_CONTACT_LABEL"
                },
                props: {
                    className: "applicant-details-error"
                },
                placeholder: {
                    labelName: "Enter Door/House No.",
                    labelKey: "MR_CONTACT_PLACEHOLDER"
                },
                required: true,
                //pattern: getPattern("Address"),
                jsonPath: "MarriageRegistrations[0].coupleDetails[1].guardianDetails.contact",

            }),
            groomGrdnEmail: getTextField({
                label: {
                    labelName: "Door/House No.",
                    labelKey: "MR_EMAIL_LABEL"
                },
                props: {
                    className: "applicant-details-error"
                },
                placeholder: {
                    labelName: "Enter Door/House No.",
                    labelKey: "MR_EMAIL_PLACEHOLDER"
                },
                required: true,
                //pattern: getPattern("Address"),
                jsonPath: "MarriageRegistrations[0].coupleDetails[1].guardianDetails.emailAddress",

            }),
        })
    }
)

export const brideGuardianDetails = getCommonCard(
    {
        header: getCommonTitle(
            {
                labelName: "Trade Location Details",
                labelKey: "MR_BRIDE_GUARDIAN_HEADER"
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
                    labelKey: "MR_BRIDEGUARDIAN_RELATION_LABEL"
                },
                props: {
                    className: "applicant-details-error"
                },
                placeholder: {
                    labelName: "Enter Door/House No.",
                    labelKey: "MR_BRIDEGUARDIAN_RELATION_PLACEHOLDER"
                },
                required: true,
                //pattern: getPattern("Address"),
                jsonPath: "MarriageRegistrations[0].coupleDetails[0].guardianDetails.relationship",

            }),
            brideGuardianName: getTextField({
                label: {
                    labelName: "Door/House No.",
                    labelKey: "MR_NAME_LABEL"
                },
                props: {
                    className: "applicant-details-error"
                },
                placeholder: {
                    labelName: "Enter Door/House No.",
                    labelKey: "MR_NAME_PLACEHOLDER"
                },
                required: true,
                //pattern: getPattern("Address"),
                jsonPath: "MarriageRegistrations[0].coupleDetails[0].guardianDetails.name",

            }),
            brideGrdnAddressLine1: getTextField({
                label: {
                    labelName: "Door/House No.",
                    labelKey: "MR_ADDRESS_LABEL"
                },
                props: {
                    className: "applicant-details-error"
                },
                placeholder: {
                    labelName: "Enter Door/House No.",
                    labelKey: "MR_ADDRESS_PLACEHOLDER"
                },
                pattern: getPattern("Address"),
                jsonPath: "MarriageRegistrations[0].coupleDetails[0].guardianDetails.addressLine1",
                required: true,
            }),

            brideGrdnDistrict: {
                ...getSelectField({
                    label: {
                        labelName: "City",
                        labelKey: "MR_DISTRICT_LABEL"
                    },

                    optionLabel: "name",
                    placeholder: { labelName: "Select Country", labelKey: "MR_DISTRICT_PLACEHOLDER" },
                    sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.mrDistrict",
                    jsonPath: "MarriageRegistrations[0].coupleDetails[0].guardianDetails.district",
                    required: true,

                }),
            },
            brideGrdnState: {
                ...getSelectField({
                    label: {
                        labelName: "City",
                        labelKey: "MR_STATE_LABEL"
                    },

                    optionLabel: "name",
                    placeholder: { labelName: "Select Country", labelKey: "MR_STATE_PLACEHOLDER" },
                    sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.mrState",
                    jsonPath: "MarriageRegistrations[0].coupleDetails[0].guardianDetails.state",
                    required: true,

                }),
            },


            brideGrdnCountry: {
                ...getSelectField({
                    label: {
                        labelName: "City",
                        labelKey: "MR_COUNTRY_LABEL"
                    },

                    optionLabel: "name",
                    placeholder: { labelName: "Select Country", labelKey: "MR_COUNTRY_PLACEHOLDER" },
                    sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.mrCountry",
                    jsonPath: "MarriageRegistrations[0].coupleDetails[0].guardianDetails.country",
                    required: true,

                }),
            },
            brideGrdnAddressPin: getTextField({
                label: {
                    labelName: "Door/House No.",
                    labelKey: "MR_PINCODE_LABEL"
                },
                props: {
                    className: "applicant-details-error"
                },
                placeholder: {
                    labelName: "Enter Door/House No.",
                    labelKey: "MR_PINCODE_PLACEHOLDER"
                },
                required: true,
                //pattern: getPattern("Address"),
                jsonPath: "MarriageRegistrations[0].coupleDetails[0].guardianDetails.pinCode",

            }),

            brideGrdnContact: getTextField({
                label: {
                    labelName: "Door/House No.",
                    labelKey: "MR_CONTACT_LABEL"
                },
                props: {
                    className: "applicant-details-error"
                },
                placeholder: {
                    labelName: "Enter Door/House No.",
                    labelKey: "MR_CONTACT_PLACEHOLDER"
                },
                required: true,
                //pattern: getPattern("Address"),
                jsonPath: "MarriageRegistrations[0].coupleDetails[0].guardianDetails.contact",

            }),
            brideGrdnEmail: getTextField({
                label: {
                    labelName: "Door/House No.",
                    labelKey: "MR_EMAIL_LABEL"
                },
                props: {
                    className: "applicant-details-error"
                },
                placeholder: {
                    labelName: "Enter Door/House No.",
                    labelKey: "MR_EMAIL_PLACEHOLDER"
                },
                required: true,
                //pattern: getPattern("Address"),
                jsonPath: "MarriageRegistrations[0].coupleDetails[0].guardianDetails.emailAddress",

            }),
        })
    }
)





export const guardianDetails = {


    brideGuardianDetails,
    groomGuardianDetails
};
