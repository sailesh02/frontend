import {
  getBreak,
  getCommonCard,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonTitle,
  getSelectField,
  getTextField,
  getDateField,
  getPattern,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "../../../../../ui-utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get"
import commonConfig from "config/common.js";
import set from "lodash/set"
import {getEdcrDetails} from "../../edcrscrutiny/functions"



const openSignSCNPopup = (state, dispatch) => {
  dispatch(
    handleField(
      "generateShowCauseNotice",
      "components.div.children.pdfSigningPopup.props",
      "openPdfSigningPopup",
      true
    )
  )
}

const openPermitRevokePopup = (state, dispatch) => {
  dispatch(
    handleField(
      "generatePermitRevokeNotice",
      "components.div.children.pdfSigningPopup.props",
      "openPdfSigningPopup",
      true
    )
  )
}


const downloadGeneratedSCN = async(state, dispatch) => {

  let tenantId = getQueryArg(
    window.location.href,
    "tenantId", ""
  );
  let fileStoreId = get(
    state,
    "screenConfiguration.preparedFinalObject.generatedScnPdfFileStoreId",
    {}
  );
  
   
    let pdfDownload = await httpRequest(
      "get",
      `filestore/v1/files/url?tenantId=${tenantId}&fileStoreIds=${fileStoreId}`, []
    );
  
    window.open(pdfDownload[fileStoreId]);

}
const generatePdf = async (state, dispatch) => {
  let bpaDetails = get(
    state,
    "screenConfiguration.preparedFinalObject.BPAForSCN",
    {}
  );
  let edcrDetail = await getEdcrDetails(bpaDetails.edcrNumber, bpaDetails.tenantId);
  let mdmsData = get(
    state,
    "screenConfiguration.preparedFinalObject.mdmsData.common-masters",
    {}
  );
  let idName = mdmsData.IdFormat[0].idname;
  let idFormat = mdmsData.IdFormat[0].format;
  let tenantId = getQueryArg(
    window.location.href,
    "tenantId", ""
  );
  let purpose = getQueryArg(
    window.location.href,
    "PURPOSE", ""
  );
  console.log(bpaDetails, "Nero bpa")

  let pdfKey = "bpa-show-cause-notice";
  if(purpose === "GENREVOKE"){
    pdfKey = "bpa-revocation-notice"
  }

  let idGenRes = await httpRequest(
    "post",
    `egov-idgen/id/_generate`,
    "_generate",
    [],
    {
      idRequests: [
        {
          "idName": idName,
          "tenantId": tenantId,
          "format": idFormat,
          "count": 1
        }
      ]
    }
  ).then( async(apiRes)=>{
    console.log(apiRes, "Nero IdGen")

    if(apiRes && apiRes.idResponses){
      set(bpaDetails, "scnLetterNo", apiRes.idResponses[0].id)
      set(bpaDetails, "edcrDetail", edcrDetail.planDetail.planInformation)
    }
    let res = await httpRequest(
      "post",
      `pdf-service/v1/_create?key=${pdfKey}&tenantId=${tenantId}`,
      "",
      [],
      { Bpa: [bpaDetails] }
    );
    console.log(res, "Nero Res PDF")
    if(res && res.filestoreIds && res.filestoreIds.length > 0){
      dispatch(prepareFinalObject("generatedScnPdfFileStoreId", res.filestoreIds[0]));

      dispatch(
        handleField(
          "generateShowCauseNotice",
          "components.div.children.getGenerateShowCuaseNoticeForm.children.cardContent.children.signSCNButton",
          "visible",
          true
        )
      )
      dispatch(
        handleField(
          "generateShowCauseNotice",
          "components.div.children.getGenerateShowCuaseNoticeForm.children.cardContent.children.downloadScn",
          "visible",
          true
        )
      )
    }

    

  })

}

const generatePdfForPermitRevoke = async (state, dispatch) => {
  let bpaDetails = get(
    state,
    "screenConfiguration.preparedFinalObject.BPAForSCN",
    {}
  );
  let lastSCNDetail = get(
    state,
    "screenConfiguration.preparedFinalObject.lastSCNDetail",
    {}
  );

  let edcrDetail = await getEdcrDetails(bpaDetails.edcrNumber, bpaDetails.tenantId);
  
  let mdmsData = get(
    state,
    "screenConfiguration.preparedFinalObject.mdmsData.common-masters",
    {}
  );
  let idName = mdmsData.IdFormat[0].idname;
  let idFormat = mdmsData.IdFormat[0].format;
  let tenantId = getQueryArg(
    window.location.href,
    "tenantId", ""
  );
  let purpose = getQueryArg(
    window.location.href,
    "PURPOSE", ""
  );
  console.log(bpaDetails, "Nero bpa")

  let pdfKey = "bpa-show-cause-notice";
  if(purpose === "GENREVOKE"){
    pdfKey = "bpa-revocation-notice"
  }

  let idGenRes = await httpRequest(
    "post",
    `egov-idgen/id/_generate`,
    "_generate",
    [],
    {
      idRequests: [
        {
          "idName": idName,
          "tenantId": tenantId,
          "format": idFormat,
          "count": 1
        }
      ]
    }
  ).then( async(apiRes)=>{
    console.log(apiRes, "Nero IdGen")

    if(apiRes && apiRes.idResponses){
      set(bpaDetails, "scnLetterNo", apiRes.idResponses[0].id)
      set(bpaDetails, "lastSCNDetail.LetterNo", lastSCNDetail.LetterNo)
      set(bpaDetails, "lastSCNDetail.createdTime", lastSCNDetail.auditDetails.createdTime)
      set(bpaDetails, "edcrDetail", edcrDetail.planDetail.planInformation)
      
    }
    let res = await httpRequest(
      "post",
      `pdf-service/v1/_create?key=${pdfKey}&tenantId=${tenantId}`,
      "",
      [],
      { Bpa: [bpaDetails] }
    );
    console.log(res, "Nero Res PDF")
    if(res && res.filestoreIds && res.filestoreIds.length > 0){
      dispatch(prepareFinalObject("generatedScnPdfFileStoreId", res.filestoreIds[0]));

      dispatch(
        handleField(
          "generatePermitRevokeNotice",
          "components.div.children.getPermitRevokeNoticeForm.children.cardContent.children.signSCNButton",
          "visible",
          true
        )
      )
      dispatch(
        handleField(
          "generatePermitRevokeNotice",
          "components.div.children.getPermitRevokeNoticeForm.children.cardContent.children.downloadScn",
          "visible",
          true
        )
      )
    }

    

  })

}

export const getGenerateShowCuaseNoticeForm = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Owner Details",
      labelKey: "BPA_GENERATE_SHOW_CAUSE_NOTICE"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),

  scNoticeComments: getTextField({
    label: {
      labelName: "Comments",
      labelKey: "BPA_SCN_COMMENTS"
    },
    multiline: true,
    rows: "15",
    placeholder: {
      labelName: "Enter Comments",
      labelKey: "BPA_SCN_COMMENTS_PLACEHOLDER"
    },
    required: true,
    // pattern: getPattern("Address"),
    errorMessage: "Invalid Address",
    jsonPath:
      "BPAForSCN.scnComments",
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 12
    }
  }),
  generateSCNButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "GENERATE",
        labelKey: "BPA_GENERATE_SCN_BUTTON"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: generatePdf
    }
  },
  downloadScn: {
    componentPath: "Button",
    visible: false,
    props: {
      variant: "contained",
      color: "primary",
      style: {
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "DOWNLOAD",
        labelKey: "BPA_DOWNLOAD_SCN_BUTTON"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: downloadGeneratedSCN
    }
  },
  signSCNButton: {
    componentPath: "Button",
    visible: false,
    props: {
      variant: "contained",
      color: "primary",
      style: {
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "GENERATE",
        labelKey: "BPA_SIGN_AND_FORWARD_BUTTON"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: openSignSCNPopup
    }
  }

})

export const getPermitRevokeNoticeForm = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Owner Details",
      labelKey: "BPA_GENERATE_REVOKE_NOTICE"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),

  scNoticeComments: getTextField({
    label: {
      labelName: "Comments",
      labelKey: "BPA_SCN_COMMENTS"
    },
    multiline: true,
    rows: "15",
    placeholder: {
      labelName: "Enter Comments",
      labelKey: "BPA_SCN_COMMENTS_PLACEHOLDER"
    },
    required: true,
    // pattern: getPattern("Address"),
    errorMessage: "Invalid Address",
    jsonPath:
      "BPAForSCN.scnComments",
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 12
    }
  }),
  generateSCNButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "GENERATE",
        labelKey: "BPA_GENERATE_REVOKE_BUTTON"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: generatePdfForPermitRevoke
    }
  },
  downloadScn: {
    componentPath: "Button",
    visible: false,
    props: {
      variant: "contained",
      color: "primary",
      style: {
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "DOWNLOAD",
        labelKey: "BPA_DOWNLOAD_SCN_BUTTON"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: downloadGeneratedSCN
    }
  },
  signSCNButton: {
    componentPath: "Button",
    visible: false,
    props: {
      variant: "contained",
      color: "primary",
      style: {
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "GENERATE",
        labelKey: "BPA_SIGN_AND_FORWARD_BUTTON"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: openPermitRevokePopup
    }
  }

})

export const setMdmsData = async (action, state, dispatch) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "common-masters",
          masterDetails: [
            {
              name: "IdFormat",
              filter: "[?(@.idname=='egov.idgen.bpa.scn')]",
            }
          ]
        }

      ]
    }
  };
  let payload = await httpRequest(
    "post",
    "/egov-mdms-service/v1/_search",
    "_search",
    [],
    mdmsBody
  );
  console.log(payload, "Nero Payload")
  dispatch(prepareFinalObject("mdmsData", payload.MdmsRes));
}

export const setMdmsDataForRVK = async (action, state, dispatch) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "common-masters",
          masterDetails: [
            {
              name: "IdFormat",
              filter: "[?(@.idname=='egov.idgen.bpa.rvk')]",
            }
          ]
        }

      ]
    }
  };
  let payload = await httpRequest(
    "post",
    "/egov-mdms-service/v1/_search",
    "_search",
    [],
    mdmsBody
  );
  console.log(payload, "Nero Payload")
  dispatch(prepareFinalObject("mdmsData", payload.MdmsRes));
}

