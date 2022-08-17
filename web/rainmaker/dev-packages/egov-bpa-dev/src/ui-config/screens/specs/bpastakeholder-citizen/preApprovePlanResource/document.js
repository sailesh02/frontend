import {
    getCommonContainer,
    getSelectField,
    getLabel,
    getCommonTitle,
    getCommonCard,
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  // Configuration of upload document section


  export const downloadDocuments = getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Downlaod Documents",
        labelKey: "PREAPPROVE_DOWNLOAD_LIST",
      },
      {
        style: {
          marginBottom: 18,
        },
      }
    ),
    buildingPlanScrutinyDetailsContainer: getCommonContainer({
      pdf1: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-bpa",
        componentPath: "PdfContainer",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 12,
        },
        props: {
          label: {
            labelName: "UNDERTAKING AND INTIMATION OF COMMENCEMENT FORM-VI(A)",
            labelKey: "PREAPPROVE_UNDERTAKING_SHEET_FORM-VI_A",
          },
          linkDetail: {
            labelName: "Preapprove plan Chart Sheet",
            labelKey: "PREAPPROVE_UNDERTAKING_SHEET_FORM-VI_A_FILE",
          },
          jsonPath: "formViA.pdf",
        },
        type: "array",
      },
      pdf2: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-bpa",
        componentPath: "PdfContainer",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 12,
        },
        props: {
          label: {
            labelName: "UNDERTAKING AND INTIMATION OF COMMENCEMENT FORM-VI(B)",
            labelKey: "PREAPPROVE_UNDERTAKING_SHEET_FORM-VI_B",
          },
          linkDetail: {
            labelName: "Preapprove plan Chart Sheet",
            labelKey: "PREAPPROVE_UNDERTAKING_SHEET_FORM-VI_A_FILE",
          },
          jsonPath: "formViB.pdf",
        },
        type: "array",
      },
      pdf3: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-bpa",
        componentPath: "PdfContainer",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 12,
        },
        props: {
          label: {
            labelName: "Building Standard",
            labelKey: "PREAPPROVE_Building Standard",
          },
          linkDetail: {
            labelName: "Preapprove Building Standard",
            labelKey: "PREAPPROVE_BUILDING_PLAN_STANDARD",
          },
          jsonPath: "standardBuilding.pdf",
        },
        type: "array",
      },
    }),
  });
  