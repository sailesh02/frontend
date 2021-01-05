import {
  getBreak,
  getCommonCard,
  getCommonParagraph,
  getCommonTitle,
  getCommonSubHeader,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";

export const documentDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Required Documents",
      labelKey: "BPA_DOCUMENT_DETAILS_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  subText: getCommonParagraph({
    labelName:
      "Only one file can be uploaded for one document. If multiple files need to be uploaded then please combine all files in a pdf and then upload",
    labelKey: "BPA_DOCUMENT_DETAILS_SUBTEXT"
  }),
  break: getBreak(),
  documentList: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-bpa",
    componentPath: "BpaDocumentListContainer",
    props: {
      documents: [
        {
          name: "Identity Proof ",
          required: true,
          jsonPath: "bpa.documents.identityProof",
          selector: {
            inputLabel: "Select Document",
            menuItems: [
              { value: "AADHAAR", label: "Aadhaar Card" },
              { value: "VOTERID", label: "Voter ID Card" },
              { value: "DRIVING", label: "Driving License" }
            ]
          }
        },
        {
          name: "Address Proof ",
          required: true,
          jsonPath: "bpa.documents.addressProof",
          selector: {
            inputLabel: "Select Document",
            menuItems: [
              { value: "ELECTRICITYBILL", label: "Electricity Bill" },
              { value: "DL", label: "Driving License" },
              { value: "VOTERID", label: "Voter ID Card" }
            ]
          }
        }
      ],
      buttonLabel: {
        labelName: "UPLOAD FILE",
        labelKey: "BPA_DOC_DET_BTN_UPLOAD_FILE"
      },
      // description: "Only .jpg and .pdf files. 6MB max file size.",
      inputProps: {
        accept: "image/*, .pdf, .png, .jpeg",
        multiple: false
      },
      maxFileSize: 5000
    },
    type: "array"
  }
});

/*
export const additionalDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Required Documents",
      labelKey: "BPA_DOCUMENT_DETAILS_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  subText: getCommonParagraph({
    labelName:
      "Only one file can be uploaded for one document. If multiple files need to be uploaded then please combine all files in a pdf and then upload",
    labelKey: "BPA_DOCUMENT_DETAILS_SUBTEXT"
  }),
  break: getBreak(),
  additionalDocumentList: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-bpa",
    componentPath: "BpaAdditionalDocumentListContainer",
    props: {

      buttonLabel: {
        labelName: "UPLOAD FILE",
        labelKey: "BPA_DOC_DET_BTN_UPLOAD_FILE"
      },
      description: "Only .jpg and .pdf files. 6MB max file size.",
      inputProps: {
        accept: "image/*, .pdf, .png, .jpeg",
        multiple: false
      },
      maxFileSize: 5000
    },
    type: "array"
  }
});*/

export const additionalDocsInformation =
getCommonCard({
    header: getCommonSubHeader(
      {
        labelName: "Additional Details",
        labelKey: "BPA_ADDITIONAL_DOC_DETAILS"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),
    applicantCard: getCommonContainer({
      DocTypes1: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-bpa",
        componentPath: "BpaCheckboxContainer",
        jsonPath: "addtionalDocTypesCheckboxesValues.DocTypes1",

        props: {
          label: {
            labelName: "Doc Type 1",
            labelKey: "BPA_ADDL_DOC_TYPE_1"
          },
          jsonPath: "addtionalDocTypesCheckboxesValues.DocTypes1",
          disabled: true,
        },
        type: "array"
      },
      DocTypes2: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-bpa",
        componentPath: "BpaCheckboxContainer",
        jsonPath: "addtionalDocTypesCheckboxesValues.DocTypes2",

        props: {
          label: {
            labelName: "Property has Loan?",
            labelKey: "BPA_ADDL_DOC_TYPE_2"
          },
          jsonPath: "addtionalDocTypesCheckboxesValues.DocTypes2",
          disabled: true,
        },
        type: "array"
      },
      DocTypes3: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-bpa",
        componentPath: "BpaCheckboxContainer",
        jsonPath: "addtionalDocTypesCheckboxesValues.DocTypes3",

        props: {
          label: {
            labelName: "Property has Loan?",
            labelKey: "BPA_ADDL_DOC_TYPE_3"
          },
          jsonPath: "addtionalDocTypesCheckboxesValues.DocTypes3",
          disabled: true,
        },
        type: "array"
      },
      DocTypes4: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-bpa",
        componentPath: "BpaCheckboxContainer",
        jsonPath: "addtionalDocTypesCheckboxesValues.DocTypes4",

        props: {
          label: {
            labelName: "Property has Loan?",
            labelKey: "BPA_ADDL_DOC_TYPE_4"
          },
          jsonPath: "addtionalDocTypesCheckboxesValues.DocTypes4",
          disabled: true,
        },
        type: "array"
      },
      DocTypes5: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-bpa",
        componentPath: "BpaCheckboxContainer",
        jsonPath: "addtionalDocTypesCheckboxesValues.DocTypes5",

        props: {
          label: {
            labelName: "Property has Loan?",
            labelKey: "BPA_ADDL_DOC_TYPE_5"
          },
          jsonPath: "addtionalDocTypesCheckboxesValues.DocTypes5",
          disabled: true,
        },
        type: "array"
      },
      DocTypes6: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-bpa",
        componentPath: "BpaCheckboxContainer",
        jsonPath: "addtionalDocTypesCheckboxesValues.DocTypes6",

        props: {
          label: {
            labelName: "Property has Loan?",
            labelKey: "BPA_ADDL_DOC_TYPE_6"
          },
          jsonPath: "addtionalDocTypesCheckboxesValues.DocTypes6",
          disabled: true,
        },
        type: "array"
      },
      DocTypes7: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-bpa",
        componentPath: "BpaCheckboxContainer",
        jsonPath: "addtionalDocTypesCheckboxesValues.DocTypes7",

        props: {
          label: {
            labelName: "Property has Loan?",
            labelKey: "BPA_ADDL_DOC_TYPE_7"
          },
          jsonPath: "addtionalDocTypesCheckboxesValues.DocTypes7",
          disabled: true,
        },
        type: "array"
      }
    })
  })
