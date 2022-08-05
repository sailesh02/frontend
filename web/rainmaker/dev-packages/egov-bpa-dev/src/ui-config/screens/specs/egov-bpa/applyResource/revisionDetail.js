import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getDateField,
  getSelectField,
  getCommonContainer,
  getPattern,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue,
  convertEpochToDate,
  getBreak,
  getCommonParagraph,
  dispatchMultipleFieldChangeAction
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getTodaysDateInYMD, getPermitDetails, checkValueForNA, getSiteInfo } from "../../utils";
import "./index.css";
import get from "lodash/get";
import { getTransformedLocale, getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {getAppSearchResults} from "../../../../../ui-utils/commons"
import store from "ui-redux/store";
export const getRevisionDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Basic Details",
      labelKey: "BPA_REVISION_OLD_PERMIT_DETAILS_TITLE"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  basicDetailsContainer: getCommonContainer({
    permitNumber: getTextField({
      label: {
        labelName: "Building plan scrutiny number",
        labelKey: "BPA_REVISION_PERMIT_NO_LABEL"
      },
      placeholder: {
        labelName: "Enter Scrutiny Number",
        labelKey: "BPA_REVISION_PERMIT_NO_PLACEHOLDER"
      },
      required: true,
      title: {
        value: "Please search scrutiny details linked to the scrutiny number",
        key: "BPA_PERMIT_NO_SEARCH_TITLE"
      },
      infoIcon: "info_circle",
      // pattern: "^[a-zA-Z0-9]*$",
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "revision.refPermitNo",
      iconObj: {
        iconName: "search",
        position: "end",
        color: "#FE7A51",
        onClickDefination: {
          action: "condition",
          callBack: async (state, dispatch, fieldInfo) => {
            
            let RevisionInfo = get(state.screenConfiguration.preparedFinalObject, "revision");
            let searchedPermitNo = RevisionInfo.refPermitNo;
            let tenantId = getQueryArg(window.location.href, "tenantId")

            let response = await getPermitDetails(searchedPermitNo, tenantId);
            if (response) {
              if (response && response === "NOPERMIT") {
                let revision = {}
                dispatch(handleField("apply", 'components.div.children.formwizardFirstStep.children.searchPermitInfoFoundMsg', "visible", true));
                dispatch(handleField("apply", 'components.div.children.formwizardFirstStep.children.applicantSummary', "visible", false));
                dispatch(handleField("apply", 'components.div.children.formwizardFirstStep.children.revisionDocumentUploadCard', "visible", false));
                dispatch(handleField("apply", "components.div.children.formwizardFirstStep.children.searchPermitInfoFoundMsg.children.cardContent.children.permitNoRecordFound.children.key.props", "labelKey", "BPA_REVISION_NO_RECORD_FOUND_HEADER"));
                dispatch(handleField("apply", 'components.div.children.formwizardFirstStep.children.revisionDocumentUploadCard', "visible", true));
                dispatch(handleField("apply", 'components.div.children.formwizardFirstStep.children.revisionInfoFormCard', "visible", true));
                revision.isSujogExistingApplication = false;
                revision.refPermitNo = searchedPermitNo;
                revision.tenantId = tenantId;

                revision.refApplicationDetails = {
                  PLOT_AREA: "0",
                  BASE_FAR: "0",
                  EWS_AREA: "0",
                  BMV_ACRE: "0",
                  PERMISSABLE_FAR: "0",
                  PROJECT_VALUE_FOR_EIDP: "0",
                  PROVIDED_FAR: "0",
                  TDR_FAR_RELAXATION: "0",
                  TOTAL_BUILTUP_AREA_EDCR: "0",
                  TOTAL_FLOOR_AREA: "0",
                  TOTAL_NO_OF_DWELLING_UNITS: "0",
                  numberOfTemporaryStructures: "0"
                };
                revision.permitExpired = "NOT_IN_SUJOG"
                const defaultValues = [

                  {
                    path: "components.div.children.formwizardFirstStep.children.revisionInfoFormCard.children.cardContent.children.basicDetailsContainer.children.revBaseFar",
                    property: "props.value",
                    value: "0"
                  },
                  {
                    path: "components.div.children.formwizardFirstStep.children.revisionInfoFormCard.children.cardContent.children.basicDetailsContainer.children.revBmvAcre",
                    property: "props.value",
                    value: "0"
                  },
                  {
                    path: "components.div.children.formwizardFirstStep.children.revisionInfoFormCard.children.cardContent.children.basicDetailsContainer.children.revEwsArea",
                    property: "props.value",
                    value: "0"
                  },
                  {
                    path: "components.div.children.formwizardFirstStep.children.revisionInfoFormCard.children.cardContent.children.basicDetailsContainer.children.revPVFE",
                    property: "props.value",
                    value: "0"
                  },
                  {
                    path: "components.div.children.formwizardFirstStep.children.revisionInfoFormCard.children.cardContent.children.basicDetailsContainer.children.revPermFar",
                    property: "props.value",
                    value: "0"
                  },
                  {
                    path: "components.div.children.formwizardFirstStep.children.revisionInfoFormCard.children.cardContent.children.basicDetailsContainer.children.revPlotArea",
                    property: "props.value",
                    value: "0"
                  },
                  {
                    path: "components.div.children.formwizardFirstStep.children.revisionInfoFormCard.children.cardContent.children.basicDetailsContainer.children.revProvidedFar",
                    property: "props.value",
                    value: "0"
                  },
                  {
                    path: "components.div.children.formwizardFirstStep.children.revisionInfoFormCard.children.cardContent.children.basicDetailsContainer.children.revTdrFarRel",
                    property: "props.value",
                    value: "0"
                  },
                  {
                    path: "components.div.children.formwizardFirstStep.children.revisionInfoFormCard.children.cardContent.children.basicDetailsContainer.children.revTotalBuiltUpPlotArea",
                    property: "props.value",
                    value: "0"
                  },
                  {
                    path: "components.div.children.formwizardFirstStep.children.revisionInfoFormCard.children.cardContent.children.basicDetailsContainer.children.revTotalNoDwellingUnits",
                    property: "props.value",
                    value: "0"
                  },
                  {
                    path: "components.div.children.formwizardFirstStep.children.revisionInfoFormCard.children.cardContent.children.basicDetailsContainer.children.revTotalPlotArea",
                    property: "props.value",
                    value: "0"
                  },
                  {
                    path: "components.div.children.formwizardFirstStep.children.revisionInfoFormCard.children.cardContent.children.basicDetailsContainer.children.revTotalNoDwellingUnits",
                    property: "props.value",
                    value: "0"
                  }
                  
                  
        
                ];
                dispatchMultipleFieldChangeAction("apply", defaultValues, dispatch);
                dispatch(prepareFinalObject("revision", revision));
              } else {
                let revision = {}
                let expiryDate = response && response.approvalDate;
                let expiryDateObj = new Date(expiryDate);
                let approvalDate = new Date(expiryDateObj.getFullYear(), expiryDateObj.getMonth(), expiryDateObj.getDate())
                let todayDateObj = new Date();
                todayDateObj.setHours(0, 0, 0, 0);
                var Difference_In_Time = todayDateObj.getTime() - approvalDate.getTime();
                var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
                dispatch(handleField("apply", 'components.div.children.formwizardFirstStep.children.searchPermitInfoFoundMsg', "visible", true));
               
                if (Difference_In_Days > (365 * 3)) {
                  dispatch(handleField("apply", "components.div.children.formwizardFirstStep.children.searchPermitInfoFoundMsg.children.cardContent.children.permitNoRecordFound.children.key.props", "labelKey", "BPA_REVISION_PERMIT_EXPIRED_HEADER"));
                  dispatch(handleField("apply", 'components.div.children.formwizardFirstStep.children.applicantSummary', "visible", false));
                  dispatch(handleField("apply", 'components.div.children.formwizardFirstStep.children.revisionDocumentUploadCard', "visible", false));
                  dispatch(handleField("apply", 'components.div.children.formwizardFirstStep.children.revisionInfoFormCard', "visible", false));
                  revision.permitExpired = "YES"
                  revision.refPermitNo = searchedPermitNo;
                  dispatch(prepareFinalObject("revision", revision));
                } else {
                  dispatch(handleField("apply", "components.div.children.formwizardFirstStep.children.searchPermitInfoFoundMsg.children.cardContent.children.permitNoRecordFound.children.key.props", "labelKey", "BPA_REVISION_RECORD_FOUND_HEADER"));
                  dispatch(prepareFinalObject("PermitInfo", response))
                  dispatch(handleField("apply", 'components.div.children.formwizardFirstStep.children.applicantSummary', "visible", true));
                  dispatch(handleField("apply", 'components.div.children.formwizardFirstStep.children.revisionDocumentUploadCard', "visible", false));
                  dispatch(handleField("apply", 'components.div.children.formwizardFirstStep.children.revisionInfoFormCard', "visible", false));
                  
                  revision.tenantId = response && response.tenantId;
                  revision.isSujogExistingApplication = true;
                  revision.bpaApplicationId = response && response.id;
                  revision.refBpaApplicationNo = response && response.applicationNo;
                  revision.refPermitNo = searchedPermitNo;
                  revision.refPermitDate = response && response.approvalDate;
                  revision.refPermitExpiryDate = 3;
                  revision.permitExpired = "NO"
                  dispatch(prepareFinalObject("revision", revision));
                }

              }

            }
          }
        }
      },
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      }
    }),

  })
});


export const applicantSummary = getCommonGrayCard({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" }
    },
    children: {
      header: {
        gridDefination: {
          xs: 8
        },
        ...getCommonSubHeader({
          labelName: "Owner Information",
          labelKey: "BPA_OWNER_INFO_TITLE"
        })
      }
    }
  },
  cardOne: {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "applicant-summary",
      scheama: getCommonContainer({
        // applicantContainer: getCommonContainer({
        mobileNo: getLabelWithValue(
          {
            labelName: "Mobile No.",
            labelKey: "BPA_APPLICANT_MOBILE_NO_LABEL"
          },
          {
            jsonPath:
              "PermitInfo.landInfo.owners[0].mobileNumber",
            callBack: checkValueForNA
          }
        ),
        applicantName: getLabelWithValue(
          {
            labelName: "Name",
            labelKey: "BPA_OWNER_NAME_LABEL"
          },
          {
            jsonPath: "PermitInfo.landInfo.owners[0].name",
            callBack: checkValueForNA
          }
        ),
        applicantGender: getLabelWithValue(
          {
            labelName: "Gender",
            labelKey: "BPA_GENDER_LABEL"
          },
          {
            jsonPath: "PermitInfo.landInfo.owners[0].gender",
            callBack: checkValueForNA
          }
        ),
        applicantFatherHusbandName: getLabelWithValue(
          {
            labelName: "Guardian Name",
            labelKey: "BPA_APPLICANT_GUARDIAN_NAME_LABEL"
          },
          {
            jsonPath:
              "PermitInfo.landInfo.owners[0].fatherOrHusbandName",
            callBack: checkValueForNA
          }
        ),
        applicantRelation: getLabelWithValue(
          {
            labelName: "Relationship",
            labelKey: "BPA_APPLICANT_RELATIONSHIP_LABEL"
          },
          {
            jsonPath:
              "PermitInfo.landInfo.owners[0].relationship",
            callBack: checkValueForNA
          }
        ),
        applicantDob: getLabelWithValue(
          {
            labelName: "Date of Birth",
            labelKey: "BPA_APPLICANT_DOB_LABEL"
          },
          {
            jsonPath: "PermitInfo.landInfo.owners[0].dob",
            callBack: value => {
              return convertEpochToDate(value) || checkValueForNA;
            }
          }
        ),
        applicantEmail: getLabelWithValue(
          {
            labelName: "Email",
            labelKey: "BPA_APPLICANT_EMAIL_LABEL"
          },
          {
            jsonPath: "PermitInfo.landInfo.owners[0].emailId",
            callBack: checkValueForNA
          }
        ),
        applicantPan: getLabelWithValue(
          {
            labelName: "PAN No.",
            labelKey: "BPA_APPLICANT_PAN_LABEL"
          },
          {
            jsonPath: "PermitInfo.landInfo.owners[0].pan",
            callBack: checkValueForNA
          }
        ),
        applicantAddress: getLabelWithValue(
          {
            labelName: "Correspondence Address",
            labelKey: "BPA_APPLICANT_CORRESPONDENCE_ADDRESS_LABEL"
          },
          {
            jsonPath:
              "PermitInfo.landInfo.owners[0].correspondenceAddress",
            callBack: checkValueForNA
          }
        ),
        break: getBreak()
        // })
      }),
      items: [],
      hasAddItem: false,
      isReviewPage: true,
      sourceJsonPath: "PermitInfo.landInfo.owners",
      prefixSourceJsonPath:
        "children",
      afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  }
});

export const searchPermitInfoFoundMsg = getCommonCard({

  permitNoRecordFound: getCommonTitle({
    labelName: "Consumer belongs to special category, so payble amount is zero. Please click Proceed button to process the application",
    labelKey: "No record found for given permit number, you can still create application",
    style: { "color": "#FE7A51" }
  })
})

export const revisionDocumentUploadCard = getCommonCard({
  header: getCommonTitle(
    { labelName: "Required Documents", labelKey: "BPA_REVISION_DOCUMENT_DETAILS_HEADER" },
    { style: { marginBottom: 18 } }
  ),
  subText: getCommonParagraph({
    labelName:
      "Only one file can be uploaded for the document. If multiple files need to be uploaded then please combine all files in a pdf and then upload",
    labelKey: "BPA_BPL_DOCUMENT_DETAILS_SUBTEXT"
  }),
  break: getBreak(),
  documentList: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-bpa",
    componentPath: "RevisionDocumentListContainer",
    props: {
      buttonLabel: {
        labelName: "UPLOAD FILE",
        labelKey: "BPA_DOCUMENT_BUTTON_UPLOAD_FILE"
      },
      // description: "Only .jpg and .pdf files. 6MB max file size.",
      inputProps: {
        accept: "image/*, .pdf, .png, .jpeg"
      },
      maxFileSize: 5000
    },
    type: "array"
  }
});
const getCurrentDate = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + '-' + mm + '-' + dd;
  return today;
}
export const prepareRevisionDocumentsUploadData = (state, dispatch) => {

  // let documents = get(
  //     state,
  //     `screenConfiguration.preparedFinalObject.applyScreenMdmsData.documents`,
  //     []
  // );
  let documents = [{
    "code": "APPL.REVISION_OLDPERMITLETTER",
    "active": true,
    required: true
  },
  {
    "code": "APPL.REVISION_OLDBUILDINGPLANLAYOUT",
    "active": true,
    required: true
  },
  {
    "code": "APPL.REVISION_OTHERDOCUMENT",
    "active": true,
    required: false
  }
  ]
  documents = documents.filter(item => {
    return item.active;
  });
  let documentsContract = [];
  let tempDoc = {};
  documents.forEach(doc => {
    let card = {};
    card["code"] = doc.code;
    card["title"] = doc.code;
    card["cards"] = [];
    tempDoc[doc.code] = card;
  });

  documents.forEach(doc => {
    // Handle the case for multiple muildings
    let card = {};
    card["name"] = doc.code;
    card["code"] = doc.code;
    card["required"] = doc.required ? true : false;
    if (doc.hasDropdown && doc.dropdownData) {
      let dropdown = {};
      dropdown.label = "WS_SELECT_DOC_DD_LABEL";
      dropdown.required = true;
      dropdown.menu = doc.dropdownData.filter(item => {
        return item.active;
      });
      dropdown.menu = dropdown.menu.map(item => {
        return { code: item.code, label: getTransformedLocale(item.code) };
      });
      card["dropdown"] = dropdown;
    }
    tempDoc[doc.code].cards.push(card);
  });

  Object.keys(tempDoc).forEach(key => {
    documentsContract.push(tempDoc[key]);
  });

  dispatch(prepareFinalObject("documentsContractRvsn", documentsContract));
};

export const revisionInfoFormCard = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Basic Details",
      labelKey: "BPA_REVISION_OLD_PERMIT_DETAILS_TITLE"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  basicDetailsContainer: getCommonContainer({ 
    permitIssueDate: getDateField({
      label: {
        labelName: "Occupancy",
        labelKey: "BPA_REVISION_PERMIT_ISSUE_DATE_LABEL"
      },
      placeholder: {
        labelName: "Risk Type",
        labelKey: "BPA_REVISION_PERMIT_ISSUE_DATE_LABEL"
      },
      required: true,
      jsonPath: 'revision.refPermitDate',
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      props: {
        
        className : "tl-trade-type",
        inputProps: {
      max: getCurrentDate()
        }
      }
    }),
    
    permitExpirePeriod: getTextField({
      label: {
        labelName: "Risk Type",
        labelKey: "BPA_REVISION_PERMIT_EXPIRY_PERIOD_LABEL"
      },
      placeholder: {
        labelName: "Risk Type",
        labelKey: "BPA_REVISION_PERMIT_EXPIRY_PERIOD_LABEL"
      },
      jsonPath: "revision.refPermitExpiryDate",
      required: true,
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      props: {
        
        className : "tl-trade-type"
      }
    }),
    revisionOccupanceType: getSelectField({
      label: {
        labelName: "Risk Type",
        labelKey: "BPA_OCCUPANCY_TYPE"
      },
      placeholder: {
        labelName: "Risk Type",
        labelKey: "BPA_OCCUPANCY_TYPE"
      },
      optionValue: "code",
      optionLabel: "name",
      jsonPath: "revision.refApplicationDetails.OCCUPANCY_TYPE",
      sourceJsonPath: "applyScreenMdmsData.BPA.OccupancyType",
     // data: [{value: true, code: "YES"}, {value: false, code: "NO"}],
      required: true,
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      props: {
        
        className : "tl-trade-type"
      },
      afterFieldChange: (action, state, dispatch) => {
        let subOccupancyType = get(
      state,
      `screenConfiguration.preparedFinalObject.applyScreenMdmsData.BPA.SubOccupancyType`,
      []
  );
  let filteredSubOcps = subOccupancyType && subOccupancyType.filter((item) => item.occupancyType===action.value)
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.revisionInfoFormCard.children.cardContent.children.basicDetailsContainer.children.revisionSubOccupanceType.props",
            "data",
            filteredSubOcps
          )
        )
    }
    }),
    revisionSubOccupanceType: getSelectField({
      label: {
        labelName: "Risk Type",
        labelKey: "BPA_SUB_OCCUPANCY_TYPE"
      },
      placeholder: {
        labelName: "Risk Type",
        labelKey: "BPA_SUB_OCCUPANCY_TYPE"
      },
      optionValue: "code",
      optionLabel: "name",
      jsonPath: "revision.refApplicationDetails.SUB_OCCUPANCY_TYPE",
     // data: [{}],
      sourceJsonPath: "applyScreenMdmsData.BPA.SubOccupancyType",
      required: true,
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      props: {
        
        className : "tl-trade-type"
      }
    }),
    revPlotArea: getTextField({
      label: {
        labelName: "Risk Type",
        labelKey: "BPA_REVISION_PLOT_AREA_LABEL"
      },
      placeholder: {
        labelName: "Risk Type",
        labelKey: "BPA_REVISION_PLOT_AREA_LABEL"
      },
      jsonPath: "revision.refApplicationDetails.PLOT_AREA",
      required: true,
      pattern: getPattern("fractionalNumber"),
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      props: {
        
        className : "tl-trade-type"
      }
    }),
    revTotalPlotArea: getTextField({
      label: {
        labelName: "Risk Type",
        labelKey: "BPA_REVISION_TOTAL_FLOOR_AREA_LABEL"
      },
      placeholder: {
        labelName: "Risk Type",
        labelKey: "BPA_REVISION_TOTAL_FLOOR_AREA_LABEL"
      },
      jsonPath: "revision.refApplicationDetails.TOTAL_FLOOR_AREA",
      required: true,
      pattern: getPattern("fractionalNumber"),
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      props: {
        
        className : "tl-trade-type"
      }
    }),
    revTotalBuiltUpPlotArea: getTextField({
      label: {
        labelName: "Risk Type",
        labelKey: "BPA_REVISION_TOTAL_BUILTUP_AREA_EDCR_LABEL"
      },
      placeholder: {
        labelName: "Risk Type",
        labelKey: "BPA_REVISION_TOTAL_BUILTUP_AREA_EDCR_LABEL"
      },
      pattern: getPattern("fractionalNumber"),
      jsonPath: "revision.refApplicationDetails.TOTAL_BUILTUP_AREA_EDCR",
      required: true,
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      props: {
        
        className : "tl-trade-type"
      }
    }),
    revEwsArea: getTextField({
      label: {
        labelName: "Risk Type",
        labelKey: "BPA_REVISION_EWS_AREA_LABEL"
      },
      placeholder: {
        labelName: "Risk Type",
        labelKey: "BPA_REVISION_EWS_AREA_LABEL"
      },
      jsonPath: "revision.refApplicationDetails.EWS_AREA",
      required: true,
      pattern: getPattern("fractionalNumber"),
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      props: {
        
        className : "tl-trade-type"
      }
    }),
    revBmvAcre: getTextField({
      label: {
        labelName: "Risk Type",
        labelKey: "BPA_REVISION_BMV_ACRE_LABEL"
      },
      placeholder: {
        labelName: "Risk Type",
        labelKey: "BPA_REVISION_BMV_ACRE_LABEL"
      },
      pattern: getPattern("fractionalNumber"),
      jsonPath: "revision.refApplicationDetails.BMV_ACRE",
      required: true,
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      props: {
        
        className : "tl-trade-type"
      }
    }),
    revBaseFar: getTextField({
      label: {
        labelName: "Risk Type",
        labelKey: "BPA_REVISION_BASE_FAR_LABEL"
      },
      placeholder: {
        labelName: "Risk Type",
        labelKey: "BPA_REVISION_BASE_FAR_LABEL"
      },
      pattern: getPattern("fractionalNumber"),
      jsonPath: "revision.refApplicationDetails.BASE_FAR",
      required: true,
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      props: {
        
        className : "tl-trade-type"
      }
    }),
    revProvidedFar: getTextField({
      label: {
        labelName: "Risk Type",
        labelKey: "BPA_REVISION_PROVIDED_FAR_LABEL"
      },
      placeholder: {
        labelName: "Risk Type",
        labelKey: "BPA_REVISION_PROVIDED_FAR_LABEL"
      },
      pattern: getPattern("fractionalNumber"),
      jsonPath: "revision.refApplicationDetails.PROVIDED_FAR",
      required: true,
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      props: {
        
        className : "tl-trade-type"
      }
    }),
    revPermFar: getTextField({
      label: {
        labelName: "Risk Type",
        labelKey: "BPA_REVISION_PERMISSABLE_FAR_LABEL"
      },
      placeholder: {
        labelName: "Risk Type",
        labelKey: "BPA_REVISION_PERMISSABLE_FAR_LABEL"
      },
      pattern: getPattern("fractionalNumber"),
      jsonPath: "revision.refApplicationDetails.PERMISSABLE_FAR",
      required: true,
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      props: {
        
        className : "tl-trade-type"
      }
    }),
    revTdrFarRel: getTextField({
      label: {
        labelName: "Risk Type",
        labelKey: "BPA_REVISION_TDR_FAR_RELAXATION_LABEL"
      },
      placeholder: {
        labelName: "Risk Type",
        labelKey: "BPA_REVISION_TDR_FAR_RELAXATION_LABEL"
      },
      pattern: getPattern("fractionalNumber"),
      jsonPath: "revision.refApplicationDetails.TDR_FAR_RELAXATION",
      required: true,
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      props: {
        
        className : "tl-trade-type"
      }
    }),
    revTotalNoDwellingUnits: getTextField({
      label: {
        labelName: "Risk Type",
        labelKey: "BPA_REVISION_TOTAL_NO_OF_DWELLING_UNITS_LABEL"
      },
      placeholder: {
        labelName: "Risk Type",
        labelKey: "BPA_REVISION_TOTAL_NO_OF_DWELLING_UNITS_LABEL"
      },
      pattern: getPattern("fractionalNumber"),
      jsonPath: "revision.refApplicationDetails.TOTAL_NO_OF_DWELLING_UNITS",
      required: true,
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      props: {
        
        className : "tl-trade-type"
      }
    }),
    revPVFE: getTextField({
      label: {
        labelName: "Risk Type",
        labelKey: "BPA_REVISION_PROJECT_VALUE_FOR_EIDP_LABEL"
      },
      placeholder: {
        labelName: "Risk Type",
        labelKey: "BPA_REVISION_PROJECT_VALUE_FOR_EIDP_LABEL"
      },
      pattern: getPattern("fractionalNumber"),
      jsonPath: "revision.refApplicationDetails.PROJECT_VALUE_FOR_EIDP",
      required: true,
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      props: {
        
        className : "tl-trade-type"
      }
    }),
    revNumberOfTemporaryStructures: getTextField({
      label: {
        labelName: "Risk Type",
        labelKey: "BPA_REVISION_NO_OF_TEMP_STRUCT_LABEL"
      },
      placeholder: {
        labelName: "Risk Type",
        labelKey: "BPA_REVISION_NO_OF_TEMP_STRUCT_LABEL"
      },
      jsonPath: "revision.refApplicationDetails.numberOfTemporaryStructures",
      required: true,
      pattern: getPattern("fractionalNumber"),
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      props: {
        
        className : "tl-trade-type"
      }
    }),
    revisionShelterFee: getSelectField({
      label: {
        labelName: "Risk Type",
        labelKey: "BPA_SHELTER_FEE"
      },
      placeholder: {
        labelName: "Risk Type",
        labelKey: "BPA_SHELTER_FEE"
      },
      jsonPath: "revision.refApplicationDetails.SHELTER_FEE",
      data: [{value: true, code: "YES"}, {value: false, code: "NO"}],
      required: true,
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      props: {
        
        className : "tl-trade-type"
      }
    }),

    revisionSecurityDeposit: getSelectField({
      label: {
        labelName: "Risk Type",
        labelKey: "BPA_SECURITY_DEPOSIT"
      },
      placeholder: {
        labelName: "Risk Type",
        labelKey: "BPA_SECURITY_DEPOSIT"
      },
      jsonPath: "revision.refApplicationDetails.SECURITY_DEPOSIT",
      data: [{value: true, code: "YES"}, {value: false, code: "NO"}],
      required: true,
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      props: {
        
        className : "tl-trade-type"
      }
    }),

    revIsRetentionFeeApplicable: getSelectField({
      label: {
        labelName: "Risk Type",
        labelKey: "BPA_RENTAL_FEE_APPLICABLE"
      },
      placeholder: {
        labelName: "Risk Type",
        labelKey: "BPA_RENTAL_FEE_APPLICABLE"
      },
      jsonPath: "revision.refApplicationDetails.isRetentionFeeApplicable",
      data: [{value: true, code: "YES"}, {value: false, code: "NO"}],
      required: true,
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      props: {
        
        className : "tl-trade-type"
      }
    }),

    revRiskType: getSelectField({
      label: {
        labelName: "Risk Type",
        labelKey: "BPA_RISK_TYPE"
      },
      placeholder: {
        labelName: "Risk Type",
        labelKey: "BPA_RISK_TYPE"
      },
      jsonPath: "revision.refApplicationDetails.RISK_TYPE",
      data: [{value: true, code: "LOW"}, {value: false, code: "HIGH"}],
      required: true,
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      props: {
        
        className : "tl-trade-type"
      }
    }),
    
  })
  
});

const isSystemGeneratedPermit = (value) => {
  if(value){
    return "YES";
  }else{
    return "NO";
  }
}

const gotoOldApplication = async (state, dispatch) => {
  let RevisionInfo = get(state.screenConfiguration.preparedFinalObject, "revision");
  let tenantId = getQueryArg(window.location.href, "tenantId")
  const response = await getAppSearchResults([
    {
      key: "tenantId",
      value: tenantId,
    },
    { key: "applicationNo", value: RevisionInfo && RevisionInfo.refBpaApplicationNo },
  ]);

  if (response && response.BPA) {
    let bService = response.BPA[0].businessService;
    let type = '';
    if (bService === "BPA_LOW" || bService === "BPA5") {
      type = "LOW"
    } else {
      type = "HIGH"
    }
    let url = '';
    if (process.env.REACT_APP_NAME === "Citizen") {

      let siteInfo = getSiteInfo();
      if (siteInfo === "citizen") {
        window.open(`/citizen/egov-bpa/search-preview?applicationNumber=${RevisionInfo.refBpaApplicationNo}&tenantId=${tenantId}&type=${type}&bservice=${bService}`, "_blank");
      } else {
        window.open(`/egov-bpa/search-preview?applicationNumber=${RevisionInfo.refBpaApplicationNo}&tenantId=${tenantId}&type=${type}&bservice=${bService}`, "_blank");
      }

    } else {
      
      let siteInfo = getSiteInfo();
      if (siteInfo === "employee") {
        window.open(`/employee/egov-bpa/apply?applicationNumber=${RevisionInfo.refBpaApplicationNo}&tenantId=${tenantId}`, "_blank");
      } else {
        window.open(`/egov-bpa/apply?applicationNumber=${RevisionInfo.refBpaApplicationNo}&tenantId=${tenantId}`, "_blank")
      }
    }

  }
}

const getOccupancyType = (value) =>{
  const state = store.getState();
  console.log(value, state, "Nero State Nero")
  let occupanyTypes = get(state.screenConfiguration.preparedFinalObject, "applyScreenMdmsData.BPA.OccupancyType");
  let ot = occupanyTypes && occupanyTypes.filter( item => item.code === value);
  return ot[0].name;
 // get(state, applyScreenMdmsData
}
const getSubOccupancyType = (value) =>{
  const state = store.getState();
  console.log(value, state, "Nero State Nero")
  let suboccupanyTypes = get(state.screenConfiguration.preparedFinalObject, "applyScreenMdmsData.BPA.SubOccupancyType");
  let ot = suboccupanyTypes && suboccupanyTypes.filter( item => item.code === value);
  return ot[0].name;
 // get(state, applyScreenMdmsData
}

export const notSujogPermitRevisionSummary = getCommonGrayCard({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" }
    },
    children: {
      header: {
        gridDefination: {
          xs: 12,
          md:12,
          sm:12
        },
        ...getCommonSubHeader({
          labelName: "Owner Information",
          labelKey: "BPA_OLD_APPLICATION_TITLE_HEADER"
        })
      },
      
      oldPermitNo: getLabelWithValue(
        {
          labelName: "Mobile No.",
          labelKey: "BPA_REVISION_PERMIT_NO_LABEL"
        },
        {
          jsonPath:
            "revision.refPermitNo",
            callBack: checkValueForNA
        }
      ),
      permitIssueDate: getLabelWithValue(
        {
          labelName: "Mobile No.",
          labelKey: "BPA_REVISION_PERMIT_ISSUE_DATE_LABEL "
        },
        {
          jsonPath:
            "revision.refPermitDate",
            callBack: value => {
              return convertEpochToDate(value) || checkValueForNA;
            }
        }
      ),
      systemGeneratedPermit: getLabelWithValue(
        {
          labelName: "Mobile No.",
          labelKey: "BPA_SYSTEM_GENERATED_PERMIT_LABEL"
        },
        {
          jsonPath:
            "revision.isSujogExistingApplication",
            callBack: value => {
              return isSystemGeneratedPermit(value) || checkValueForNA;
            }
        }
      ),
      occupancyType: getLabelWithValue(
        {
          labelName: "Mobile No.",
          labelKey: "BPA_OCCUPANCY_TYPE"
        },
        {
          jsonPath:
            "revision.refApplicationDetails.OCCUPANCY_TYPE",
            callBack: (value) => {
              return getOccupancyType(value) || checkValueForNA;
            }
        }
      ),
      subOccupancyType: getLabelWithValue(
        {
          labelName: "Mobile No.",
          labelKey: "BPA_SUB_OCCUPANCY_TYPE"
        },
        {
          jsonPath:
            "revision.refApplicationDetails.SUB_OCCUPANCY_TYPE",
            callBack: value => {
              return getSubOccupancyType(value) || checkValueForNA;
            }
        }
      ),
      plotArea: getLabelWithValue(
        {
          labelName: "Mobile No.",
          labelKey: "BPA_REVISION_PLOT_AREA_LABEL"
        },
        {
          jsonPath:
            "revision.refApplicationDetails.PLOT_AREA",
            callBack: checkValueForNA
        }
      ),
      totalPlotArea: getLabelWithValue(
        {
          labelName: "Mobile No.",
          labelKey: "BPA_REVISION_TOTAL_FLOOR_AREA_LABEL"
        },
        {
          jsonPath:
            "revision.refApplicationDetails.TOTAL_FLOOR_AREA",
            callBack: checkValueForNA
        }
      ),
      buildUpArea: getLabelWithValue(
        {
          labelName: "Mobile No.",
          labelKey: "BPA_REVISION_TOTAL_BUILTUP_AREA_EDCR_LABEL"
        },
        {
          jsonPath:
            "revision.refApplicationDetails.TOTAL_BUILTUP_AREA_EDCR",
            callBack: checkValueForNA
        }
      ),
      ewsArea: getLabelWithValue(
        {
          labelName: "Mobile No.",
          labelKey: "BPA_REVISION_EWS_AREA_LABEL"
        },
        {
          jsonPath:
            "revision.refApplicationDetails.EWS_AREA",
            callBack: checkValueForNA
        }
      ),
      revBmvAcre: getLabelWithValue(
        {
          labelName: "Mobile No.",
          labelKey: "BPA_REVISION_BMV_ACRE_LABEL"
        },
        {
          jsonPath:
            "revision.refApplicationDetails.BMV_ACRE",
            callBack: checkValueForNA
        }
      ),
      revBaseFar: getLabelWithValue(
        {
          labelName: "Mobile No.",
          labelKey: "BPA_REVISION_BASE_FAR_LABEL"
        },
        {
          jsonPath:
            "revision.refApplicationDetails.BASE_FAR",
            callBack: checkValueForNA
        }
      ),

      revProvidedFar: getLabelWithValue(
        {
          labelName: "Mobile No.",
          labelKey: "BPA_REVISION_PROVIDED_FAR_LABEL"
        },
        {
          jsonPath:
            "revision.refApplicationDetails.PROVIDED_FAR",
            callBack: checkValueForNA
        }
      ),
      revPermFar: getLabelWithValue(
        {
          labelName: "Mobile No.",
          labelKey: "BPA_REVISION_PERMISSABLE_FAR_LABEL"
        },
        {
          jsonPath:
            "revision.refApplicationDetails.PERMISSABLE_FAR",
            callBack: checkValueForNA
        }
      ),
      revTdrFarRel: getLabelWithValue(
        {
          labelName: "Mobile No.",
          labelKey: "BPA_REVISION_TDR_FAR_RELAXATION_LABEL"
        },
        {
          jsonPath:
            "revision.refApplicationDetails.TDR_FAR_RELAXATION",
            callBack: checkValueForNA
        }
      ),
      revTotalNoDwellingUnits: getLabelWithValue(
        {
          labelName: "Mobile No.",
          labelKey: "BPA_REVISION_TOTAL_NO_OF_DWELLING_UNITS_LABEL"
        },
        {
          jsonPath:
            "revision.refApplicationDetails.TOTAL_NO_OF_DWELLING_UNITS",
            callBack: checkValueForNA
        }
      ),
      revPVFE: getLabelWithValue(
        {
          labelName: "Mobile No.",
          labelKey: "BPA_REVISION_PROJECT_VALUE_FOR_EIDP_LABEL"
        },
        {
          jsonPath:
            "revision.refApplicationDetails.PROJECT_VALUE_FOR_EIDP",
            callBack: checkValueForNA
        }
      ),
      revNumberOfTemporaryStructures: getLabelWithValue(
        {
          labelName: "Mobile No.",
          labelKey: "BPA_REVISION_NO_OF_TEMP_STRUCT_LABEL"
        },
        {
          jsonPath:
            "revision.refApplicationDetails.numberOfTemporaryStructures",
            callBack: checkValueForNA
        }
      ),
      revisionShelterFee: getLabelWithValue(
        {
          labelName: "Mobile No.",
          labelKey: "BPA_SHELTER_FEE"
        },
        {
          jsonPath:
            "revision.refApplicationDetails.SHELTER_FEE",
            callBack: value => {
              return isSystemGeneratedPermit(value) || checkValueForNA;
            }
        }
      ),
      revisionSecurityDeposit: getLabelWithValue(
        {
          labelName: "Mobile No.",
          labelKey: "BPA_SECURITY_DEPOSIT"
        },
        {
          jsonPath:
            "revision.refApplicationDetails.SECURITY_DEPOSIT",
            callBack: value => {
              return isSystemGeneratedPermit(value) || checkValueForNA;
            }
        }
      ),
      revIsRetentionFeeApplicable: getLabelWithValue(
        {
          labelName: "Mobile No.",
          labelKey: "BPA_RENTAL_FEE_APPLICABLE"
        },
        {
          jsonPath:
            "revision.refApplicationDetails.isRetentionFeeApplicable",
            callBack: value => {
              return isSystemGeneratedPermit(value) || checkValueForNA;
            }
        }
      ),
      revRiskType: getLabelWithValue(
        {
          labelName: "Mobile No.",
          labelKey: "BPA_RISK_TYPE"
        },
        {
          jsonPath:
            "revision.refApplicationDetails.RISK_TYPE",
            callBack: checkValueForNA
        }
      ),
    }
  }
})


export const revisionSummary = getCommonGrayCard({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" }
    },
    children: {
      header: {
        gridDefination: {
          xs: 6,
          md:6,
          sm:12
        },
        ...getCommonSubHeader({
          labelName: "Owner Information",
          labelKey: "BPA_OLD_APPLICATION_TITLE_HEADER"
        })
      },
      gotoOldApplication: {
        componentPath: "Button",
        props: {
            color: "primary",
            style: {
                marginTop: "-10px",
                marginRight: "-18px"
            }
        },
        gridDefination: {
            xs: 6,
            align: "right"
        },
        children: {
            
            buttonLabel: getLabel({
                labelName: "Edit",
                labelKey: "BPA_GOTO_OLD_APPLICATION"
            })
        },
        onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => {
                gotoOldApplication(state, dispatch);
            }
        }
    },
      oldAppNo: getLabelWithValue(
        {
          labelName: "Mobile No.",
          labelKey: "BPA_OLD_APPLICATION_NO_LABEL"
        },
        {
          jsonPath:
            "revision.refBpaApplicationNo",
            callBack: checkValueForNA
        }
      ),
      oldPermitNo: getLabelWithValue(
        {
          labelName: "Mobile No.",
          labelKey: "BPA_REVISION_PERMIT_NO_LABEL"
        },
        {
          jsonPath:
            "revision.refPermitNo",
            callBack: checkValueForNA
        }
      ),
      permitIssueDate: getLabelWithValue(
        {
          labelName: "Mobile No.",
          labelKey: "BPA_REVISION_PERMIT_ISSUE_DATE_LABEL "
        },
        {
          jsonPath:
            "revision.refPermitDate",
            callBack: value => {
              return convertEpochToDate(value) || checkValueForNA;
            }
        }
      ),
      systemGeneratedPermit: getLabelWithValue(
        {
          labelName: "Mobile No.",
          labelKey: "BPA_SYSTEM_GENERATED_PERMIT_LABEL"
        },
        {
          jsonPath:
            "revision.isSujogExistingApplication",
            callBack: value => {
              return isSystemGeneratedPermit(value) || checkValueForNA;
            }
        }
      ),

    }
  }
})


export const revisionDocsSummary = getCommonGrayCard({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" }
    },
    children: {
      header: {
        gridDefination: {
          xs: 8
        },
        ...getCommonSubHeader({
          labelName: "Documents",
          labelKey: "BPA_REVISION_DOCUMENTS_DETAILS_HEADER"
        })
      },
      
    }
  },
  documentDetailsCard: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-bpa",
    componentPath: "RevisionDocsPreviewContainer",
    props: {
      sourceJsonPath: "RvsndocumentDetailsPreview",
      className: "noc-review-documents",
      buttonLabel: {
        labelName: "UPLOAD FILE",
        labelKey: "NOC_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE"
      },
      inputProps: {
        accept: "image/*, .pdf, .png, .jpeg",
        multiple: false
      },
      maxFileSize: 5000
    }
  }
});