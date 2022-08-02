// Configuration of upload document section
export const uploadDocuments = {
    uiFramework: "custom-containers-local",
    moduleName: "egov-bpa",
    componentPath: "PreApproveDocumentListContainer",
    props: {
      buttonLabel: {
        labelName: "UPLOAD FILE",
        labelKey: "PREAPPROVE_PLAN_UPLOAD_FILE",
      },
      inputProps: {
        accept: "image/*, .pdf, .png, .jpeg, .dxf",
        formatProps: {
          accept: "image/*, .pdf, .png, .jpeg, .dxf",
        },
        multiple: false,
        maxFileSize: 5000,
      },
      maxFileSize: 5000,
    },
    type: "array",
  
  };