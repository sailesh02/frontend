import { getCommonCard, getCommonContainer, getCommonHeader, getCommonGrayCard, getCommonSubHeader, getLabelWithValue } from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, unMountScreen } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg, setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";
import { loadUlbLogo } from "egov-ui-kit/utils/pdfUtils/generatePDF";
import { generatePTMAcknowledgement } from "egov-ui-kit/utils/pdfUtils/generatePTMAcknowledgement";
import { getCommonTenant } from "egov-ui-kit/utils/PTCommon/FormWizardUtils/formUtils";
import get from "lodash/get";
import set from "lodash/set";
import { httpRequest } from "../../../../ui-utils";
import { getAssessmentSearchResults, getSearchResults } from "../../../../ui-utils/commons";
import { downloadCertificateForm, downloadReceitForm, getpayments, prepareDocumentsView, searchBill, showHideMutationDetailsCard } from "../utils/index";
import { loadPdfGenerationData } from "../utils/receiptTransformer";
import { documentsSummary } from "../pt-mutation/summaryResource/documentsSummary";
import { propertySummary } from "../pt-mutation/summaryResource/propertySummary";
import { transferorSummaryDetails } from "../pt-mutation/searchPreviewResource/transferorSummary";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";

const demandDetails = value => {
  return value == null || value == undefined || value == '' ? '0' : value;
};

const pendingFrom = value => {
  return value == null || value == undefined || value == '' ? 'NA' : value;
}

const demandSummary = getCommonGrayCard({
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
          labelName: "Additional Details",
          labelKey: "PT_ASSESSMENT_ADDITIONAL_DETAILS"
        })
      }
    }
  },
  body: getCommonContainer({
    holdingTax: getLabelWithValue(
      {
        labelName: "Holding Tax",
        labelKey: "PT_HOLDING_TAX"
      },
      {
        jsonPath: "Assessment.additionalDetails.holdingTax",
        callBack : demandDetails
      }
    ),
    lightTax: getLabelWithValue(
      {
        labelName: "Light Tax",
        labelKey: "PT_LIGHT_TAX"
      },
      {
        jsonPath: "Assessment.additionalDetails.lightTax",
        callBack : demandDetails
      }
    ),
    waterTax: getLabelWithValue(
      {
        labelName: "Water Tax",
        labelKey: "PT_WATER_TAX"
      },
      {
        jsonPath: "Assessment.additionalDetails.waterTax",
        callBack : demandDetails
      }
    ),
    drainageTax: getLabelWithValue(
      {
        labelName: "Drainage Tax",
        labelKey: "PT_DRAINAGE_TAX"
      },
      {
        jsonPath: "Assessment.additionalDetails.drainageTax",
        callBack : demandDetails
      }
    ),
    latrineTax: getLabelWithValue(
      {
        labelName: "Latrine Tax",
        labelKey: "PT_LATRINE_TAX"
      },
      {
        jsonPath: "Assessment.additionalDetails.latrineTax",
        callBack : demandDetails
      }
    ),
    parkingTax: getLabelWithValue(
      {
        labelName: "Parking Tax",
        labelKey: "PT_PARKING_TAX"
      },
      {
        jsonPath: "Assessment.additionalDetails.parkingTax",
        callBack : demandDetails
      }
    ),
    solidWasteUserCharges: getLabelWithValue(
      {
        labelName: "Solid Waste User Charges",
        labelKey: "PT_SOLID_WASTER_USER_CHARGES"
      },
      {
        jsonPath: "Assessment.additionalDetails.solidWasteUserCharges",
        callBack : demandDetails
      }
    ),
    ownershipExemption: getLabelWithValue(
      {
        labelName: "Ownership Exemption",
        labelKey: "PT_OWNERSHIP_EXEMPTION"
      },
      {
        jsonPath: "Assessment.additionalDetails.ownershipExemption",
        callBack : demandDetails
      }
    ),
    usageExemption: getLabelWithValue(
      {
        labelName: "Usage Exemption",
        labelKey: "PT_USAGE_EXEMPTION"
      },
      {
        jsonPath: "Assessment.additionalDetails.usageExemption",
        callBack : demandDetails
      }
    ),
    interest: getLabelWithValue(
      {
        labelName: "Interest",
        labelKey: "PT_INTEREST"
      },
      {
        jsonPath: "Assessment.additionalDetails.interest",
        callBack : demandDetails
      }
    ),
    penalty: getLabelWithValue(
      {
        labelName: "Penalty",
        labelKey: "PT_PENALTY"
      },
      {
        jsonPath: "Assessment.additionalDetails.penalty",
        callBack : demandDetails
      }
    ),
    serviceTax: getLabelWithValue(
      {
        labelName: "Service Tax",
        labelKey: "PT_PROPERTY_SERVICETAX"
      },
      {
        jsonPath: "Assessment.additionalDetails.serviceTax",
        callBack : demandDetails
      }
    ),
    otherDues: getLabelWithValue(
      {
        labelName: "Other Dues",
        labelKey: "PT_PROPERTY_OTHERDUES"
      },
      {
        jsonPath: "Assessment.additionalDetails.otherDues",
        callBack : demandDetails
      }
    ),
    pendingFrom: getLabelWithValue(
      {
        labelName: "Pending From",
        labelKey: "PT_PROPERTY_PENDINGFROM"
      },
      {
        jsonPath: "Assessment.additionalDetails.pendingFrom",
        callBack : pendingFrom
      }
    ),
  })
})


const ownerSummary = getCommonGrayCard({
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
          labelName: "Owner Details",
          labelKey: "PT_ASSESSMENT_OWNER_DETAILS"
        })
      }
    }
  },
  cardOne: {
    uiFramework: "custom-containers",
    componentPath: "MultiItem",
    props: {
      className: "owner-summary",
      scheama: getCommonGrayCard({
        ownerContainer: getCommonContainer(transferorSummaryDetails)
      }),
      items: [],
      hasAddItem: false,
      isReviewPage: true,
      sourceJsonPath: "Property.owners",
      prefixSourceJsonPath:
        "children.cardContent.children.ownerContainer.children",
      afterPrefixJsonPath: "children.value.children.key"
    },
    type: "array"
  }
});


const titlebar = getCommonContainer({
  header: getCommonHeader({
    labelName: "Application Details",
    labelKey: "PT_MUTATION_APPLICATION_DETAILS"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-pt",
    componentPath: "ApplicationNoContainer",
    props: {
      number: getQueryArg(window.location.href, "applicationNumber"),
      label: {
        labelValue: "Application No.",
        labelKey: "PT_MUTATION_APPLICATION_NO"
      }
    }
  }
});


const setDownloadMenu = (state, dispatch, tenantId, applicationNumber) => {
  /** MenuButton data based on status */
  let status = get(
    state,
    "screenConfiguration.preparedFinalObject.Property.status"
  );
  let downloadMenu = [];
  let printMenu = [];
  let certificateDownloadObject = {
    label: { labelName: "PT Certificate", labelKey: "MT_CERTIFICATE" },
    link: () => {
      downloadCertificateForm(get(state, "screenConfiguration.preparedFinalObject.Properties"), "ptmutationcertificate", tenantId, applicationNumber);
    },
    leftIcon: "book"
  };
  let certificatePrintObject = {
    label: { labelName: "PT Certificate", labelKey: "MT_CERTIFICATE" },
    link: () => {
      downloadCertificateForm(get(state, "screenConfiguration.preparedFinalObject.Properties"), "ptmutationcertificate", tenantId, applicationNumber, 'print');
    },
    leftIcon: "book"
  };
  let receiptDownloadObject = {
    label: { labelName: "Receipt", labelKey: "MT_RECEIPT" },
    link: () => {
      downloadReceitForm(get(state, "screenConfiguration.preparedFinalObject.Payments"), "consolidatedreceipt", tenantId, applicationNumber);
    },
    leftIcon: "receipt"
  };
  let receiptPrintObject = {
    label: { labelName: "Receipt", labelKey: "MT_RECEIPT" },
    link: () => {
      downloadReceitForm(get(state, "screenConfiguration.preparedFinalObject.Payments"), "consolidatedreceipt", tenantId, applicationNumber, 'print');
    },
    leftIcon: "receipt"
  };
  let applicationDownloadObject = {
    label: { labelName: "Application", labelKey: "MT_APPLICATION" },
    link: () => {
      generatePTMAcknowledgement(get(
        state,
        "screenConfiguration.preparedFinalObject", {}), `mutation-acknowledgement-${applicationNumber}.pdf`);
      // generatePdfFromDiv("download", applicationNumber, "#material-ui-cardContent")
    },
    leftIcon: "assignment"
  };
  let applicationPrintObject = {
    label: { labelName: "Application", labelKey: "MT_APPLICATION" },
    link: () => {
      generatePTMAcknowledgement(get(
        state,
        "screenConfiguration.preparedFinalObject", {}), 'print');
      // generatePdfFromDiv("print", applicationNumber, "#material-ui-cardContent")
    },
    leftIcon: "assignment"
  };
  switch (status) {
    case "ACTIVE":
      downloadMenu = [
        certificateDownloadObject,
        receiptDownloadObject,
        applicationDownloadObject
      ];
      printMenu = [
        certificatePrintObject,
        receiptPrintObject,
        applicationPrintObject
      ];
      break;
    case "INWORKFLOW":
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
    default:
      break;
  }
  dispatch(
    handleField(
      "search-preview",
      "components.div.children.headerDiv.children.helpSection.children.rightdiv.children.downloadMenu",
      "props.data.menu",
      downloadMenu
    )
  );
  dispatch(
    handleField(
      "search-preview",
      "components.div.children.headerDiv.children.helpSection.children.rightdiv.children.printMenu",
      "props.data.menu",
      printMenu
    )
  );
  /** END */
};

const setSearchResponse = async (
  state,
  dispatch,
  applicationNumber,
  tenantId
) => {
  const response = await getAssessmentSearchResults([
    {
      key: "tenantId",
      value: tenantId
    },
    { key: "assessmentNumbers", value: applicationNumber }
  ]);
  const assessments = get(response, "Assessments", [])
  const propertyId = get(response, "Assessments[0].propertyId", []);

  const auditResponse = await getSearchResults([
    {
      key: "tenantId",
      value: tenantId
    },
    { key: "propertyIds", value: propertyId }, {
      key: "audit",
      value: true
    }
  ]);
  let property = (auditResponse && auditResponse.Properties && auditResponse.Properties.length > 0 && auditResponse.Properties[0]) || {}
  let assessment = (assessments && assessments.length > 0 && assessments[0]) || {};

  if (!assessment.workflow) {
    let workflow = {
      tenantId: getQueryArg(window.location.href, "tenantId"),
      businessService: "ASMT",
      businessId: getQueryArg(window.location.href, "applicationNumber"),
      action: "",
      moduleName: "PT",
    };
    assessment.workflow = workflow;
  }
  // Set Institution/Applicant info card visibility

  if (auditResponse && Array.isArray(get(auditResponse, "Properties", [])) && get(auditResponse, "Properties", []).length > 0) {
    const propertiesAudit = get(auditResponse, "Properties", []);
    const propertyIndex=property.status ==  'ACTIVE' ? 1:0;
    const previousActiveProperty = propertiesAudit.filter(property => property.status == 'ACTIVE').sort((x, y) => y.auditDetails.lastModifiedTime - x.auditDetails.lastModifiedTime)[propertyIndex];


    property.ownershipCategoryInit = previousActiveProperty && previousActiveProperty.ownershipCategory;
    property.ownersInit = previousActiveProperty && previousActiveProperty.owners.filter(owner => owner.status == "ACTIVE"); 
  }


  // auditResponse
  const mode = getQueryArg(window.location.href, "mode");
  dispatch(prepareFinalObject("Assessment", assessment));
 
  if(mode == "editDemandDetails"){
    const {screenConfiguration} = state
    const {preparedFinalObject} = screenConfiguration
    const {Properties} = preparedFinalObject
    dispatch(prepareFinalObject("Assessment.additionalDetails", Properties && Properties[0] && Properties[0].additionalDetails));
  }
  dispatch(prepareFinalObject("Property", property));
  dispatch(prepareFinalObject("documentsUploadRedux", property.documents));
  prepareDocumentsView(state, dispatch);
  if(assessment.additionalDetails){
    dispatch(prepareFinalObject("Properties[0].additionalDetails", assessment.additionalDetails));
  }
  await loadPdfGenerationData(applicationNumber, tenantId);
//   setDownloadMenu(state, dispatch, tenantId, applicationNumber);
};
const setData = async (state, dispatch, applicationNumber, tenantId) => {
  const response = await getSearchResults([
    {
      key: "tenantId",
      value: tenantId
    },
    { key: "acknowledgementIds", value: applicationNumber }
  ]);

  dispatch(prepareFinalObject("Properties", get(response, "Properties", [])));
  let queryObj = [
    {
      key: "tenantId",
      value: tenantId
    },
    {
      key: "consumerCodes",
      value: applicationNumber
    },
    {
      key: "businessService",
      value: 'PT.MUTATION'
    }
  ];
  const responsePayments = await getpayments(queryObj)
  dispatch(prepareFinalObject("Payments", get(responsePayments, "Payments", [])));
}

const getPropertyConfigurationMDMSData = async (action, state, dispatch) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: getCommonTenant(),
      moduleDetails: [
        {
          moduleName: "PropertyTax",
          masterDetails: [{ name: "PropertyConfiguration" }]
        }
      ]
    }
  };
  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    let propertyConfiguation = get(payload, "MdmsRes.PropertyTax.PropertyConfiguration");
    dispatch(prepareFinalObject("PropertyConfiguration", propertyConfiguation));
    showHideMutationDetailsCard(action, state, dispatch);
  } catch (e) {
    console.log(e);
  }
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "search-preview",
  beforeInitScreen: (action, state, dispatch) => {
    // dispatch(unMountScreen("propertySearch"));
    // dispatch(unMountScreen("apply"));
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const tenantId = getQueryArg(window.location.href, "tenantId");
    dispatch(prepareFinalObject("Property", {}));
    setSearchResponse(state, dispatch, applicationNumber, tenantId);
    loadUlbLogo(tenantId);
    const queryObject = [
      { key: "tenantId", value: tenantId },
    ];
   setBusinessServiceDataToLocalStorage(queryObject, dispatch);
    // Hide edit buttons
    // setData(state, dispatch, applicationNumber, tenantId);
    let userInfo = JSON.parse(getUserInfo());
    const roleCodes =
        userInfo && userInfo.roles
          ? userInfo.roles.map((role) => {
            return role.code;
          })
          : [];
    const isVisibleDemandDetails = true
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.propertySummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.ownerSummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.documentsSummary.children.cardContent.children.header.children.editSection.visible",
      false
    );

    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.demandSummary.visible",
      !!isVisibleDemandDetails
    )


    // const printCont = downloadPrintContainer(
    //   action,
    //   state,
    //   dispatch,
    //   status,
    //   applicationNumber,
    //   tenantId
    // );

    // set(
    //   action,
    //   "screenConfig.components.div.children.headerDiv.children.helpSection.children",
    //   printCont
    // );
    getPropertyConfigurationMDMSData(action, state, dispatch);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header1: {
              gridDefination: {
                xs: 12,
                sm: 8
              },
              ...titlebar
            },
            helpSection: {
              uiFramework: "custom-atoms",
              componentPath: "Container",
              props: {
                color: "primary",
                style: { justifyContent: "flex-end" }
              },
              gridDefination: {
                xs: 12,
                sm: 4,
                align: "right"
              }
            }
          }
        },
        taskStatus: {
          uiFramework: "custom-containers-local",
          componentPath: "WorkFlowContainer",
          moduleName: "egov-workflow",
          props: {
            dataPath: "Assessment",
            moduleName: "PT.ASSESSMENT",
            updateUrl: "/property-services/assessment/_update"
          }
        },
        body: getCommonCard({
          propertySummary: propertySummary,
          demandSummary: demandSummary,
          ownerSummary: ownerSummary,
          documentsSummary: documentsSummary
        })
      }
    }
  }
};

export default screenConfig;
