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
            relationshipWithGuardian: {
                ...getSelectField({
                    label: {
                        labelName: "Relationship with Guardian",
                        labelKey: "MR_GROOMGUARDIAN_RELATION_LABEL"
                    },
                    placeholder: {
                        labelName: "Select Relationship with Guardian",
                        labelKey: "MR_GROOMGUARDIAN_RELATION_PLACEHOLDER"
                    },
                    required: true,
                    jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.guardianDetails.relationship",
                    // data: [{ code: "FATHER" }, { code: "HUSBAND" },{code : 'MOTHER'},{code : "BROTHER"},{code : "SISTER"},
                    // {code : "GRANDFATHER"},{code : "GRANDMOTHER"},{code : "FATHERINLAW"},{code : "MOTHERINLAW"}],
                    data: [{ code: "FATHER" }, { code: "MOTHER" }, { code: 'OTHERS' }],

                    //sourceJsonPath: "applyScreenMdmsData.common-masters.OwnerType",
                    // gridDefination: {
                    //     xs: 12,
                    //     sm: 6
                    // }
                }),
                afterFieldChange: (action, state, dispatch) => {
                    
                    if (action.value == "OTHERS") {
                        dispatch(
                            handleField(
                                "apply",
                                "components.div.children.formwizardSecondStep.children.groomGuardianDetails.children.cardContent.children.groomGuardianDetailsConatiner.children.otherRltnWithgroom",
                                "visible",
                                true
                            )
                        );
                    } else {
                        dispatch(
                            handleField(
                                "apply",
                                "components.div.children.formwizardSecondStep.children.groomGuardianDetails.children.cardContent.children.groomGuardianDetailsConatiner.children.otherRltnWithgroom",
                                "visible",
                                false
                            )
                        );
                    }
                    //"components.div.children.formwizardSecondStep.children.groomGuardianDetails.children.cardContent.children.groomGuardianDetailsConatiner.children.rltnWithgroom"
                }
            },
            otherRltnWithgroom: getTextField({
                label: {
                    labelName: "Door/House No.",
                    labelKey: "MR_GROOMGUARDIAN_RELATION_DESC_LABEL"
                },
                props: {
                    className: "applicant-details-error"
                },
                placeholder: {
                    labelName: "Enter Door/House No.",
                    labelKey: "MR_GROOMGUARDIAN_RELATION_DESC_PLACEHOLDER"
                },
                required: true,
                visible: false,
                //pattern: getPattern("Address"),
                jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.guardianDetails.relationshipDesc",

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
                jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.guardianDetails.name",

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
                pattern: getPattern("mrAddress"),
                jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.guardianDetails.addressLine1",
                required: true,
            }),

            groomGrdnDistrict: getTextField({
                label: {
                    labelName: "Door/House No.",
                    labelKey: "MR_DISTRICT_LABEL"
                },
                props: {
                    className: "applicant-details-error"
                },
                placeholder: {
                    labelName: "Enter Door/House No.",
                    labelKey: "MR_DISTRICT_PLACEHOLDER"
                },
                pattern: getPattern("Address"),
                jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.guardianDetails.district",
                required: true,
            }),
            groomGrdnState: getTextField({
                label: {
                    labelName: "Door/House No.",
                    labelKey: "MR_STATE_LABEL"
                },
                props: {
                    className: "applicant-details-error"
                },
                placeholder: {
                    labelName: "Enter Door/House No.",
                    labelKey: "MR_STATE_PLACEHOLDER"
                },
                pattern: getPattern("Address"),
                jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.guardianDetails.state",
                required: true,
            }),


            // groomGrdnDistrict: {
            //     ...getSelectField({
            //         label: {
            //             labelName: "City",
            //             labelKey: "MR_DISTRICT_LABEL"
            //         },

            //         optionLabel: "name",
            //         placeholder: { labelName: "Select Country", labelKey: "MR_DISTRICT_PLACEHOLDER" },
            //         sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.mrDistrict",
            //         jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.guardianDetails.district",
            //         required: true,

            //     }),
            // },

            // groomGrdnState: {
            //     ...getSelectField({
            //         label: {
            //             labelName: "City",
            //             labelKey: "MR_STATE_LABEL"
            //         },

            //         optionLabel: "name",
            //         placeholder: { labelName: "Select Country", labelKey: "MR_STATE_PLACEHOLDER" },
            //         sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.mrState",
            //         jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.guardianDetails.state",
            //         required: true,

            //     }),
            // },

            groomGrdnCountry: {
                ...getSelectField({
                    label: {
                        labelName: "City",
                        labelKey: "MR_COUNTRY_LABEL"
                    },

                    optionLabel: "name",
                    placeholder: { labelName: "Select Country", labelKey: "MR_COUNTRY_PLACEHOLDER" },
                    sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.mrCountry",
                    jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.guardianDetails.country",
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
                jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.guardianDetails.pinCode",

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
                pattern: getPattern("MobileNo"),
                jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.guardianDetails.contact",

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
                pattern: getPattern("Email"),
                jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.guardianDetails.emailAddress",

            }),
        },
            {
                style: getQueryArg(window.location.href, "action") === "CORRECTION" ? { "pointer-events": "none" } : {}
            }
        )
    },
    {
        style: getQueryArg(window.location.href, "action") === "CORRECTION" ? { "cursor": "not-allowed", overflow: "visible" } : { overflow: "visible" }

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
            relationshipWithGuardian: {
                ...getSelectField({
                    label: {
                        labelName: "Relationship with Guardian",
                        labelKey: "MR_BRIDEGUARDIAN_RELATION_LABEL"
                    },
                    placeholder: {
                        labelName: "Select Relationship with Guardian",
                        labelKey: "MR_BRIDEGUARDIAN_RELATION_PLACEHOLDER"
                    },
                    required: true,
                    jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.guardianDetails.relationship",
                    // data: [{ code: "FATHER" }, { code: "HUSBAND" },{code : 'MOTHER'},{code : "BROTHER"},{code : "SISTER"},
                    // {code : "GRANDFATHER"},{code : "GRANDMOTHER"},{code : "FATHERINLAW"},{code : "MOTHERINLAW"}],
                    data: [{ code: "FATHER" }, { code: "MOTHER" }, { code: 'OTHERS' }],

                    //sourceJsonPath: "applyScreenMdmsData.common-masters.OwnerType",
                    // gridDefination: {
                    //     xs: 12,
                    //     sm: 6
                    // }
                }),
                afterFieldChange: (action, state, dispatch) => {
                    
                    if (action.value == "OTHERS") {
                        dispatch(
                            handleField(
                                "apply",
                                "components.div.children.formwizardSecondStep.children.brideGuardianDetails.children.cardContent.children.brideGuardianDetailsConatiner.children.otherRltnWithBride",
                                "visible",
                                true
                            )
                        );
                    } else {
                        dispatch(
                            handleField(
                                "apply",
                                "components.div.children.formwizardSecondStep.children.brideGuardianDetails.children.cardContent.children.brideGuardianDetailsConatiner.children.otherRltnWithBride",
                                "visible",
                                false
                            )
                        );
                    }
                    //"components.div.children.formwizardSecondStep.children.groomGuardianDetails.children.cardContent.children.groomGuardianDetailsConatiner.children.rltnWithgroom"
                }
            },
            otherRltnWithBride: getTextField({
                label: {
                    labelName: "Door/House No.",
                    labelKey: "MR_BRIDEGUARDIAN_RELATION_DESC_LABEL"
                },
                props: {
                    className: "applicant-details-error"
                },
                placeholder: {
                    labelName: "Enter Door/House No.",
                    labelKey: "MR_BRIDEGUARDIAN_RELATION_DESC_PLACEHOLDER"
                },
                required: true,
                visible: false,
                //pattern: getPattern("Address"),
                jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.guardianDetails.relationshipDesc",

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
                jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.guardianDetails.name",

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
                pattern: getPattern("mrAddress"),
                jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.guardianDetails.addressLine1",
                required: true,
            }),

            brideGrdnDistrict: getTextField({
                label: {
                    labelName: "Door/House No.",
                    labelKey: "MR_DISTRICT_LABEL"
                },
                props: {
                    className: "applicant-details-error"
                },
                placeholder: {
                    labelName: "Enter Door/House No.",
                    labelKey: "MR_DISTRICT_PLACEHOLDER"
                },
                pattern: getPattern("Address"),
                jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.guardianDetails.district",
                required: true,
            }),
            brideGrdnState: getTextField({
                label: {
                    labelName: "Door/House No.",
                    labelKey: "MR_STATE_LABEL"
                },
                props: {
                    className: "applicant-details-error"
                },
                placeholder: {
                    labelName: "Enter Door/House No.",
                    labelKey: "MR_STATE_PLACEHOLDER"
                },
                pattern: getPattern("Address"),
                jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.guardianDetails.state",
                required: true,
            }),

            // brideGrdnDistrict: {
            //     ...getSelectField({
            //         label: {
            //             labelName: "City",
            //             labelKey: "MR_DISTRICT_LABEL"
            //         },

            //         optionLabel: "name",
            //         placeholder: { labelName: "Select Country", labelKey: "MR_DISTRICT_PLACEHOLDER" },
            //         sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.mrDistrict",
            //         jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.guardianDetails.district",
            //         required: true,

            //     }),
            // },
            // brideGrdnState: {
            //     ...getSelectField({
            //         label: {
            //             labelName: "City",
            //             labelKey: "MR_STATE_LABEL"
            //         },

            //         optionLabel: "name",
            //         placeholder: { labelName: "Select Country", labelKey: "MR_STATE_PLACEHOLDER" },
            //         sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.mrState",
            //         jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.guardianDetails.state",
            //         required: true,

            //     }),
            // },


            brideGrdnCountry: {
                ...getSelectField({
                    label: {
                        labelName: "City",
                        labelKey: "MR_COUNTRY_LABEL"
                    },

                    optionLabel: "name",
                    placeholder: { labelName: "Select Country", labelKey: "MR_COUNTRY_PLACEHOLDER" },
                    sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.mrCountry",
                    jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.guardianDetails.country",
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
                jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.guardianDetails.pinCode",

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
                pattern: getPattern("MobileNo"),
                jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.guardianDetails.contact",

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
                pattern: getPattern("Email"),
                jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.guardianDetails.emailAddress",

            }),
        },
            {
                style: getQueryArg(window.location.href, "action") === "CORRECTION" ? { "pointer-events": "none" } : {}
            }
        )
    },
    {
        style: getQueryArg(window.location.href, "action") === "CORRECTION" ? { "cursor": "not-allowed", overflow: "visible" } : { overflow: "visible" }

    }
)





export const guardianDetails = {


    brideGuardianDetails,
    groomGuardianDetails
};
