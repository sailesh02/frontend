export const documentList = {
  uiFramework: "custom-containers-local",
  moduleName: "egov-mr",
  componentPath: "DocumentListContainer",
  props: {
    buttonLabel: {
      labelName: "UPLOAD FILE",
      labelKey: "MR_BUTTON_UPLOAD_FILE"
    },
    inputProps : [
      {
        type : "BRIDEIDPROOF",
        description: {
          labelName: "Only .jpg and .pdf files. 6MB max file size.",
          labelKey: "TL_UPLOAD_RESTRICTIONS"
        },
        formatProps :{
          accept : "image/*, .pdf, .png, .jpeg",
        },
        maxFileSize: 5000
      },
      {
        type : "BRIDEFATHERIDPROOF",
        description: {
          labelName: "Only .jpg and .pdf files. 6MB max file size.",
          labelKey: "TL_UPLOAD_RESTRICTIONS"
        },
        formatProps :{
          accept : "image/*, .pdf, .png, .jpeg",
        },
        maxFileSize: 5000
      },
      {
        type : "BRIDEMOTHERIDPROOF",
        description: {
          labelName: "Only .png and .jpeg 6MB max file size.",
          labelKey: "TL_UPLOAD_IMAGE_RESTRICTIONS"
        },
        formatProps :{
          accept: "image/*, .pdf, .png, .jpeg",
        },
        maxFileSize: 3000
      },
      {
        type : "BRIDEGUARDIANIDPROOF",
        description: {
          labelName: "Only .jpg and .pdf files. 6MB max file size.",
          labelKey: "TL_UPLOAD_RESTRICTIONS"
        },
        formatProps :{
          accept : "image/*, .pdf, .png, .jpeg",
        },
        maxFileSize: 5000
      },
      {
        type : "BRIDEWITNESSIDPROOF",
        description: {
          labelName: "Only .jpg and .pdf files. 6MB max file size.",
          labelKey: "TL_UPLOAD_RESTRICTIONS"
        },
        formatProps :{
          accept : "image/*, .pdf, .png, .jpeg",
        },
        maxFileSize: 5000
      },
      {
        type : "BRIDEINVITATIONCARD",
        description: {
          labelName: "Only .jpg and .pdf files. 6MB max file size.",
          labelKey: "TL_UPLOAD_RESTRICTIONS"
        },
        formatProps :{
          accept : "image/*, .pdf, .png, .jpeg",
        },
        maxFileSize: 5000
      },
      {
        type : "BRIDERESIDENTIALPROOF",
        description: {
          labelName: "Only .jpg and .pdf files. 6MB max file size.",
          labelKey: "TL_UPLOAD_RESTRICTIONS"
        },
        formatProps :{
          accept : "image/*, .pdf, .png, .jpeg",
        },
        maxFileSize: 5000
      },
      {
        type : "BRIDEDIVYANGPROOF",
        description: {
          labelName: "Only .jpg and .pdf files. 6MB max file size.",
          labelKey: "TL_UPLOAD_RESTRICTIONS"
        },
        formatProps :{
          accept : "image/*, .pdf, .png, .jpeg",
        },
        maxFileSize: 5000
      },
      {
        type : "GROOMIDPROOF",
        description: {
          labelName: "Only .jpg and .pdf files. 6MB max file size.",
          labelKey: "TL_UPLOAD_RESTRICTIONS"
        },
        formatProps :{
          accept : "image/*, .pdf, .png, .jpeg",
        },
        maxFileSize: 5000
      },
      {
        type : "GROOMFATHERIDPROOF",
        description: {
          labelName: "Only .jpg and .pdf files. 6MB max file size.",
          labelKey: "TL_UPLOAD_RESTRICTIONS"
        },
        formatProps :{
          accept : "image/*, .pdf, .png, .jpeg",
        },
        maxFileSize: 5000
      },
      {
        type : "GROOMMOTHERIDPROOF",
        description: {
          labelName: "Only .jpg and .pdf files. 6MB max file size.",
          labelKey: "TL_UPLOAD_RESTRICTIONS"
        },
        formatProps :{
          accept : "image/*, .pdf, .png, .jpeg",
        },
        maxFileSize: 5000
      },
      {
        type : "GROOMGUARDIANIDPROOF",
        description: {
          labelName: "Only .jpg and .pdf files. 6MB max file size.",
          labelKey: "TL_UPLOAD_RESTRICTIONS"
        },
        formatProps :{
          accept : "image/*, .pdf, .png, .jpeg",
        },
        maxFileSize: 5000
      },
      {
        type : "GROOMWITNESSIDPROOF",
        description: {
          labelName: "Only .jpg and .pdf files. 6MB max file size.",
          labelKey: "TL_UPLOAD_RESTRICTIONS"
        },
        formatProps :{
          accept : "image/*, .pdf, .png, .jpeg",
        },
        maxFileSize: 5000
      },
      {
        type : "GROOMINVITATIONCARD",
        description: {
          labelName: "Only .jpg and .pdf files. 6MB max file size.",
          labelKey: "TL_UPLOAD_RESTRICTIONS"
        },
        formatProps :{
          accept : "image/*, .pdf, .png, .jpeg",
        },
        maxFileSize: 5000
      },
      {
        type : "GROOMRESIDENTIALPROOF",
        description: {
          labelName: "Only .jpg and .pdf files. 6MB max file size.",
          labelKey: "TL_UPLOAD_RESTRICTIONS"
        },
        formatProps :{
          accept : "image/*, .pdf, .png, .jpeg",
        },
        maxFileSize: 5000
      },
      {
        type : "GROOMDIVYANGPROOF",
        description: {
          labelName: "Only .jpg and .pdf files. 6MB max file size.",
          labelKey: "TL_UPLOAD_RESTRICTIONS"
        },
        formatProps :{
          accept : "image/*, .pdf, .png, .jpeg",
        },
        maxFileSize: 5000
      },
      {
        type : "JOINTPHOTO",
        description: {
          labelName: "Only .jpg and .pdf files. 6MB max file size.",
          labelKey: "TL_UPLOAD_RESTRICTIONS"
        },
        formatProps :{
          accept : "image/*, .png, .jpeg",
        },
        maxFileSize: 5000
      },
      {
        type : "JOINTAFFIDAVIT",
        description: {
          labelName: "Only .jpg and .pdf files. 6MB max file size.",
          labelKey: "TL_UPLOAD_RESTRICTIONS"
        },
        formatProps :{
          accept : "image/*, .pdf, .png, .jpeg",
        },
        maxFileSize: 5000
      }
    ],
    documentTypePrefix: "MR_",
  }
};
