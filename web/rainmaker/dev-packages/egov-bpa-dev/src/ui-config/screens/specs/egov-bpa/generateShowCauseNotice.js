import { getCommonContainer, getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, toggleSpinner,hideSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import set from "lodash/set";
import {getGenerateShowCuaseNoticeForm, setMdmsData } from "./generateShowCauseNoticeResource/generateNotce"
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import store from "ui-redux/store";
import { getAppSearchResults } from "../../../../ui-utils/commons"


const closePdfSigningPopup = (refreshType) => {
  store.dispatch(
    handleField(
      "generateShowCauseNotice",
      "components.div.children.pdfSigningPopup.props",
      "openPdfSigningPopup",
      false
    )
  )
    }
const header = getCommonHeader(
  {
    labelName: "My Applications",
    labelKey: "BPA_GENERATE_SHOW_CAUSE_NOTICE"
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);
const getApplicationDetails = async (action, state, dispatch) => {

  let applicationNumber = getQueryArg(
    window.location.href,
    "applicationNumber", ""
  );
  let tenantId = getQueryArg(
    window.location.href,
    "tenantId", ""
  );
  const response = await getAppSearchResults([
    {
      key: "tenantId",
      value: tenantId
    },
    { key: "applicationNo", value: applicationNumber }
  ]);
if(response && response.BPA && response.BPA.length > 0) dispatch(prepareFinalObject("BPAForSCN", response.BPA[0]))
  
//console.log(response, "Nero Res")
}

const screenConfig = {
  uiFramework: "material-ui",
  name: "generateShowCauseNotice",
  beforeInitScreen: (action, state, dispatch) => {
   getApplicationDetails(action, state, dispatch);
   setMdmsData(action, state, dispatch);
   // dispatch(prepareFinalObject("showCuaseNoticeInfo", {}))
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
        header: header,
        getGenerateShowCuaseNoticeForm: getGenerateShowCuaseNoticeForm,
        pdfSigningPopup : {
          uiFramework: 'custom-containers-local',
          componentPath: 'SignRandomPdfContainer',
          moduleName: "egov-bpa",
          props: {
            openPdfSigningPopup: false,
            closePdfSigningPopup : closePdfSigningPopup,
            maxWidth: false,
            moduleName : 'BPA',
            okText :"BPA_SIGN_PDF",
            resetText : "BPA_RESET_PDF",
            dataPath : 'BPA',
            updateUrl : '/bpa-services/v1/bpa/_updatedscdetails?',
            refreshType : 'preview'
          },
          children: {
            popup: {}
          }
        }
      }
    }
  }
};


export default screenConfig;
