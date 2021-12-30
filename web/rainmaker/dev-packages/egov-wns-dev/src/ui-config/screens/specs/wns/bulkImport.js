// import { fetchData } from "./myConnectionDetails/myConnectionDetails";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg,getTodaysDateInYMD, getMaxDate } from "egov-ui-framework/ui-utils/commons";
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
const header = getCommonHeader(
  {
    labelKey: "WS_MYCONNECTIONS_HEADER"
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);

const screenConfig = {
  uiFramework: "material-ui",
  name: "bulkImport",
  beforeInitScreen: (action, state, dispatch) => {
    // fetchData(action, state, dispatch);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        // className: "common-div-css"
      },
      children: {
        header: header,
        applicationsCard: {
            uiFramework: "custom-containers",
            componentPath: "MultiItem",
            props: {
              scheama: getCommonGrayCard({
                header: getCommonSubHeader(
                  {
                    labelName: "Owner Information",
                    labelKey: "TL_NEW_OWNER_DETAILS_HEADER_OWNER_INFO"
                  },
                  {
                    style: {
                      marginBottom: 18
                    }
                  }
                ),
                tradeUnitCardContainer: getCommonContainer({
                  getOwnerMobNoField: getTextField({
                    label: {
                      labelName: "Mobile No.",
                      labelKey: "TL_NEW_OWNER_DETAILS_MOB_NO_LABEL"
                    },
                    props:{
                      className:"applicant-details-error"
                    },
                    placeholder: {
                      labelName: "Enter Mobile No.",
                      labelKey: "TL_NEW_OWNER_DETAILS_MOB_NO_PLACEHOLDER"
                    },
                    required: true,
                    pattern: getPattern("MobileNo"),
                    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].mobileNumber",
                    // iconObj: {
                    //   iconName: "search",
                    //   position: "end",
                    //   color: "#FE7A51",
                    //   onClickDefination: {
                    //     action: "condition",
                    //     callBack: (state, dispatch, fieldInfo) => {
                    //       getDetailsForOwner(state, dispatch, fieldInfo);
                    //     }
                    //   }
                    // },
                    // title: {
                    //   value: "Please search owner profile linked to the mobile no.",
                    //   key: "TL_MOBILE_NO_TOOLTIP_MESSAGE"
                    // },
                    // infoIcon: "info_circle"
                  }),
                  ownerName: getTextField({
                    label: {
                      labelName: "Name",
                      labelKey: "TL_NEW_OWNER_DETAILS_NAME_LABEL"
                    },
                    props:{
                      className:"applicant-details-error"
                    },
                    placeholder: {
                      labelName: "Enter Name",
                      labelKey: "TL_NEW_OWNER_DETAILS_NAME_PLACEHOLDER"
                    },
                    required: true,
                    pattern: getPattern("Name"),
                    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].name"
                  }),
                  getFatherNameField: getTextField({
                    label: {
                      labelName: "Father/Spouse Name",
                      labelKey: "TL_NEW_OWNER_DETAILS_FATHER_NAME_LABEL"
                    },
                    props:{
                      className:"applicant-details-error"
                    },
                    placeholder: {
                      labelName: "Enter Father/Spouse Name",
                      labelKey: "TL_NEW_OWNER_DETAILS_FATHER_NAME_PLACEHOLDER"
                    },
                    required: true,
                    pattern: getPattern("Name"),
                    jsonPath:
                      "Licenses[0].tradeLicenseDetail.owners[0].fatherOrHusbandName"
                  }),
                  getRelationshipRadioButton: {
                    uiFramework: "custom-containers",
                    componentPath: "RadioGroupContainer",
                    gridDefination: {
                      xs: 12,
                      sm: 12,
                      md: 6
                    },
                    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].relationship",
                    props: {
                      label: {
                        name: "Relationship",
                        key: "TL_COMMON_RELATIONSHIP_LABEL"
                      },
                      buttons: [
                        {
                          labelName: "Father",
                          labelKey: "COMMON_RELATION_FATHER",
                          value: "FATHER"
                        },
                        {
                          label: "Husband",
                          labelKey: "COMMON_RELATION_HUSBAND",
                          value: "HUSBAND"
                        }
                      ],
                      jsonPath:
                        "Licenses[0].tradeLicenseDetail.owners[0].relationship",
                      required: true
                    },
                    required: true,
                    type: "array"
                  },
                  getOwnerGenderField: {
                    uiFramework: "custom-containers",
                    componentPath: "RadioGroupContainer",
                    gridDefination: {
                      xs: 12,
                      sm: 12,
                      md: 6
                    },
                    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].gender",
                    props: {
                      label: {
                        name: "Gender",
                        key: "TL_NEW_OWNER_DETAILS_GENDER_LABEL"
                      },
                      buttons: [
                        {
                          labelName: "Male",
                          labelKey: "COMMON_GENDER_MALE",
                          value: "MALE"
                        },
                        {
                          label: "Female",
                          labelKey: "COMMON_GENDER_FEMALE",
                          value: "FEMALE"
                        },
                        {
                          label: "Others",
                          labelKey: "COMMON_GENDER_TRANSGENDER",
                          value: "OTHERS"
                        }
                      ],
                      jsonPath:
                        "Licenses[0].tradeLicenseDetail.owners[0].gender",
                      required: true
                    },
                    required: true,
                    type: "array"
                  },
                  ownerDOB: {
                    ...getDateField({
                      label: {
                        labelName: "Date of Birth",
                        labelKey: "TL_EMP_APPLICATION_DOB"
                      },
                      placeholder: {
                        labelName: "Enter Date of Birth",
                        labelKey: "TL_NEW_OWNER_DETAILS_DOB_PLACEHOLDER"
                      },
                      required: true,
                      pattern: getPattern("Date"),
                      isDOB: true,
                      maxDate: getMaxDate(14),
                      errorMessage: "TL_DOB_ERROR_MESSAGE",
                      jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].dob",
                      props: {
                        inputProps: {
                          max: getTodaysDateInYMD()
                        }
                      }
                    })
                  },
                  getOwnerEmailField: getTextField({
                    label: {
                      labelName: "Email",
                      labelKey: "TL_NEW_OWNER_DETAILS_EMAIL_LABEL"
                    },
                    props:{
                      className:"applicant-details-error"
                    },
                    placeholder: {
                      labelName: "Enter Email",
                      labelKey: "TL_NEW_OWNER_DETAILS_EMAIL_PLACEHOLDER"
                    },
                    pattern: getPattern("Email"),
                    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].emailId"
                  }),
                  ownerPAN: getTextField({
                    label: {
                      labelName: "PAN No.",
                      labelKey: "TL_NEW_OWNER_DETAILS_PAN_LABEL"
                    },
                    props:{
                      className:"applicant-details-error"
                    },
                    placeholder: {
                      labelName: "Enter Owner's PAN No.",
                      labelKey: "TL_NEW_OWNER_DETAILS_PAN_PLACEHOLDER"
                    },
                    pattern: getPattern("PAN"),
                    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].pan"
                  }),
                  ownerAddress: getTextField({
                    label: {
                      labelName: "Correspondence Address",
                      labelKey: "TL_NEW_OWNER_DETAILS_ADDR_LABEL"
                    },
                    props:{
                      className:"applicant-details-error"
                    },
                    placeholder: {
                      labelName: "Enter Correspondence Address",
                      labelKey: "TL_NEW_OWNER_DETAILS_ADDR_PLACEHOLDER"
                    },
                    required: true,
                    pattern: getPattern("Address"),
                    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].permanentAddress"
                  }),
                  OwnerSpecialCategory: getSelectField({
                    label: {
                      labelName: "Special Owner Category",
                      labelKey: "TL_NEW_OWNER_DETAILS_SPL_OWN_CAT_LABEL"
                    },
                    placeholder: {
                      labelName: "Select Special Owner Category",
                      labelKey: "TL_NEW_OWNER_DETAILS_SPL_OWN_CAT_PLACEHOLDER"
                    },
                    jsonPath: "Licenses[0].tradeLicenseDetail.owners[0].ownerType",
                    sourceJsonPath: "applyScreenMdmsData.common-masters.OwnerType",
                    localePrefix: {
                      moduleName: "common-masters",
                      masterName: "OwnerType"
                    }
                  })
                })
              }),
              items: [],
              addItemLabel: {
                labelName: "ADD OWNER",
                labelKey: "TL_NEW_OWNER_DETAILS_ADD_OWN"
              },
              headerName: "Owner Information",
              headerJsonPath:
                "children.cardContent.children.header.children.Owner Information.props.label",
              sourceJsonPath: "Licenses[0].tradeLicenseDetail.owners",
              prefixSourceJsonPath:
                "children.cardContent.children.tradeUnitCardContainer.children"
            },
          
            type: "array"
        }
      }
    }
  }
};

export default screenConfig;
