import { getCommonCard, getCommonContainer, getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
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
import { registrationSummary } from '../pt-mutation/summaryResource/registrationSummary';
import { getCommonGrayCard, getCommonSubHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { transferorSummaryDetails } from "../pt-mutation/searchPreviewResource/transferorSummary";

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
      businessService: "PT.ASSESSMENT",
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


    property.ownershipCategoryInit = previousActiveProperty.ownershipCategory;
    property.ownersInit = previousActiveProperty.owners.filter(owner => owner.status == "ACTIVE"); 
  }


  // auditResponse
  dispatch(prepareFinalObject("Assessment", assessment));
  dispatch(prepareFinalObject("Property", property));
  dispatch(prepareFinalObject("documentsUploadRedux", property.documents));
  prepareDocumentsView(state, dispatch);

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
      "screenConfig.components.div.children.body.children.cardContent.children.registrationSummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.documentsSummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
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
          pdfHeader: {
            uiFramework: "custom-atoms-local",
            moduleName: "egov-pt",
            componentPath: "pdfHeader"
          },
          propertySummary: propertySummary,
          ownerSummary: ownerSummary,
          registrationSummary: registrationSummary,
          documentsSummary: documentsSummary
        })
      }
    }
  }
};

export default screenConfig;
