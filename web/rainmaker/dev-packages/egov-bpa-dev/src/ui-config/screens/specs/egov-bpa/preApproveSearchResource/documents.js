import {
  getCommonContainer,
  getSelectField,
  getLabel,
  getCommonTitle,
  getCommonCard,
} from "egov-ui-framework/ui-config/screens/specs/utils";
// Configuration of upload document section

export const uploadDocuments = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Upload Documents",
      labelKey: "PREAPPROVE_DOCUMENT_LIST",
    },
    {
      style: {
        marginBottom: 18,
      },
    }
  ),
  buildingPlanScrutinyDetailsContainer: getCommonContainer({
    preapproveDxf: {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-bpa",
      componentPath: "downloadFile",
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 3,
      },
      props: {
        label: {
          labelName: "Uploaded Diagram",
          labelKey: "BPA_BASIC_DETAILS_UPLOADED_DIAGRAM",
        },
        linkDetail: {
          labelName: "Preapprove plan File",
          labelKey: "PREAPPROVE_BUILDING_PLAN_FILE",
        },
        jsonPath: "drawingDetails.documents[0].additionalDetails.fileUrl",
      },
      type: "array",
    },
    preapprovePdf: {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-bpa",
      componentPath: "downloadFile",
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 3,
      },
      props: {
        label: {
          labelName: "Preapproved plan PDF file",
          labelKey: "PREAPPROVE_PDF_FILE",
        },
        linkDetail: {
          labelName: "Preapprove building File",
          labelKey: "PREAPPROVE_BUILDING_PLAN_PDF",
        },
        jsonPath: "drawingDetails.documents[1].additionalDetails.fileUrl",
      },
      type: "array",
    },
    preApproveImage: {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-bpa",
      componentPath: "downloadFile",
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 3,
      },
      props: {
        label: {
          labelName: "Preapprove Image File",
          labelKey: "BPA_BASIC_DETAILS_SCRUTINY_REPORT",
        },
        linkDetail: {
          labelName: "Preapprove building Image",
          labelKey: "PREAPPROVE_BUILDING_PLAN_IMAGE",
        },
        jsonPath: "drawingDetails.documents[2s].additionalDetails.fileUrl",
      },
      type: "array",
    },
  }),
});
