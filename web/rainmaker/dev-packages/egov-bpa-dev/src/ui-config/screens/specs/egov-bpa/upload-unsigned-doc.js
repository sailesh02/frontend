import {
  getCommonContainer,
  getCommonHeader,
  getCommonCard,
  getCommonTitle,
  getCommonParagraph,
  getBreak,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
//import { footer } from "./applyResource/footer";
//import { documentDetails } from "./applyResource/documentDetails";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "../../../../ui-utils/api";
import get from "lodash/get";
import { getTransformedLocale, getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getCommonApplyFooter } from "../utils";
//import { getAppSearchResults } from "../../../../../ui-utils/commons"
import { getAppSearchResults } from "../../../../ui-utils/commons"
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";


const callBackForNext = async (state, dispatch) => {
  

  const applicationNo = getQueryArg(window.location.href, "applicationNo");
  const tenantId = getQueryArg(window.location.href, "tenantId");

  const response = await getAppSearchResults([
    {
      key: "tenantId",
      value: tenantId
    },
    { key: "applicationNo", value: applicationNo }
  ]);
 
  console.log(response, "Nero object")
  let payload = {};
  if(response && response.BPA){
    payload = response.BPA[0];
  }
  const uploadedDocs = get(
    state.screenConfiguration.preparedFinalObject,
    "documentsUploadRedux"
  );

  let doc = {};
  doc.documentType = uploadedDocs[0].documentType;
  doc.fileStoreId = uploadedDocs[0].documents[0].fileStoreId;
  doc.fileName = uploadedDocs[0].documents[0].fileName;
  let applicationDocs =  payload.documents;
  
  let indexNo;
  let bpdDocAlreadyExist = false;
  for(let i = 0; i<applicationDocs.length; i++){
    if(applicationDocs[i].documentType === "BPD.BPL.BPL"){
      indexNo = i;
      bpdDocAlreadyExist = true;
    }
  }
  if(bpdDocAlreadyExist){
    //applicationDocs.splice(indexNo, 1)
    applicationDocs[indexNo].fileStoreId = uploadedDocs[0].documents[0].fileStoreId;
  }else{
  
  applicationDocs.push(doc);
  }
  console.log(applicationDocs, "Nero DOcuments")
  payload.documents = applicationDocs; 
  payload.additionalDetails.applicationType = "buildingPlanLayoutSignature";

  console.log(payload, "Nero final payload")

  try {
    const response = await httpRequest(
      "post",
      "/bpa-services/v1/bpa/_update",
      "",
      [],
      {["BPA"]:payload}
    );
  console.log(response, "Nero response after updated")
  if(response){
    let url = `acknowledgement?purpose=bpd_signed_upload&status=success&applicationNumber=${applicationNo}&tenantId=${tenantId}`
  dispatch(setRoute(url));
  }
  } catch (error) {
    //store.dispatch(toggleSnackbar(true, error.message, "error"));
    console.log(error, "Nero error")
  }

}

export const footer = getCommonApplyFooter({
  
  nextButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "Next Step",
        labelKey: "BPA_COMMON_BUTTON_SUBMIT"
      }),
      
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForNext
    }
  }
});
export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Apply for building permit`,
    labelKey: "BPA_UPLOAD_BPD_DOCUMENT_HEADER"
  })
});

export const documentDetails = getCommonCard({
  header: getCommonTitle(
    { labelName: "Required Documents", labelKey: "BPA_BPD_DOCUMENT_DETAILS_HEADER" },
    { style: { marginBottom: 18 } }
  ),
  subText: getCommonParagraph({
    labelName:
      "Only one file can be uploaded for one document. If multiple files need to be uploaded then please combine all files in a pdf and then upload",
    labelKey: "BPA_BPD_DOCUMENT_DETAILS_SUBTEXT"
  }),
  break: getBreak(),
  documentList: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-wns",
    componentPath: "DocumentListContainer",
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
export const formwizardFourthStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form4"
  },
  children: {
    documentDetails
  },
  visible: true
};

export const prepareDocumentsUploadData = (state, dispatch) => {
 
  let documents = get(
      state,
      `screenConfiguration.preparedFinalObject.applyScreenMdmsData.documents`,
      []
  );
  documents = documents.filter(item => {
      return item.active;
  });
  let documentsContract = [];
  let tempDoc = {};
  documents.forEach(doc => {
      let card = {};
      card["code"] = doc.documentType;
      card["title"] = doc.documentType;
      card["cards"] = [];
      tempDoc[doc.documentType] = card;
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
      tempDoc[doc.documentType].cards.push(card);
  });

  Object.keys(tempDoc).forEach(key => {
      documentsContract.push(tempDoc[key]);
  });

  dispatch(prepareFinalObject("documentsContract", documentsContract));
};

const getMdmsData = async (action, state, dispatch) => {
  
  try {
    
let documents = [
  {
    active: true,
    code: "BPD.BPL.BPL",
    description: "Permit Document",
    documentType: "BPD.BPL.BPL",
    dropdownData:[],
    hasDropdown: false,
    required: true 
  }
]

    dispatch(prepareFinalObject("applyScreenMdmsData.documents", documents));
  } catch (e) {
    console.log(e);
  }
};


const screenConfig = {
  uiFramework: "material-ui",
  name: "upload-unsigned-doc",
  beforeInitScreen: (action, state, dispatch, componentJsonpath) => {
    
    getMdmsData(action, state, dispatch).then(response => {
      prepareDocumentsUploadData(state, dispatch)
    });

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
            header: {
              gridDefination: {
                xs: 12,
                sm: 10
              },
              ...header
            }
          }
        },
        
        formwizardFourthStep,
        
        footer
      }
    },
    
  }
};

export default screenConfig;
