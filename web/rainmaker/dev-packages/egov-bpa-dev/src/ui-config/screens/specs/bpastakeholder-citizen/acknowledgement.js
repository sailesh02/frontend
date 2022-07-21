import {
  getCommonHeader,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  applicationSuccessFooter,
  paymentSuccessFooter,
  gotoHomeFooter,
  approvalSuccessFooter,
  paymentFailureFooter,
  previewAndSubmit
} from "./acknowledgementResource/footers";
import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import set from "lodash/set";
import get from "lodash/get";
import { getCurrentFinancialYear, permitOrderNoDownload } from "../utils";
import { download, getAppSearchResults } from "../../../../ui-utils/commons";
import {
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Payment Information (${getCurrentFinancialYear()})`, //later use getFinancialYearDates
    labelKey: "COMMON_PAY_SCREEN_HEADER"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-bpa",
    componentPath: "ApplicationNoContainer",
    props: {
      number: getQueryArg(window.location.href, "consumerCode")
    },
    visible: true
  }
});

const headerForBpaSignedDocUpload = getCommonContainer({
  header: getCommonHeader({
    labelKey: "BPA_BPL_SIGNED_DOC_UPLOAD_HEADER",
  }),
});

export const getCustomHeader = (state,
  dispatch,
  applicationNumber,
  tenant,
  purpose
  ) => { 
    const headerRow = purpose == 'bpd_signed_upload' ? headerForBpaSignedDocUpload : "";
    return getCommonContainer({
            header: {...headerRow},
            applicationNumber: {
              uiFramework: "custom-atoms-local",
              moduleName: "egov-bpa",
              componentPath: "ApplicationNoContainer",
              props: {
                number: getQueryArg(window.location.href, "applicationNumber")
              },
              visible: true
            }
          });
}

const getAcknowledgementCard = (
  action,
  state,
  dispatch,
  purpose,
  status,
  applicationNumber,
  secondNumber,
  tenant,
  businessService,
  moduleName
) => {
  const uiCommonPayConfig = get(state.screenConfiguration.preparedFinalObject, "commonPayInfo");  
  if (purpose === "bpd_signed_upload" && status === "success") {
    return {
      header: getCustomHeader(state,
        dispatch,
        applicationNumber,
        tenant,
        purpose),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Building plan document submitted Successfully",
              labelKey: "BPA_BPL_SIGNED_DOC_UPLOAD_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName: "Building plan document submitted Successfully",
              labelKey: "BPA_BPL_SIGNED_DOC_UPLOAD_SUCCESS"
            }
          })
        }
      },
      gotoHomeFooter
    };
  }
};

const getBpaDetails = async ( action, state, dispatch, applicationNumber, tenantId ) => {
  const response = await getAppSearchResults([
    {
      key: "tenantId",
      value: tenantId
    },
    { key: "applicationNo", value: applicationNumber }
  ]);
  dispatch(prepareFinalObject("BPA", response.BPA[0]));  
}
const screenConfig = {
  uiFramework: "material-ui",
  name: "acknowledgement",
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      }
    }
  },
  beforeInitScreen: (action, state, dispatch) => {
    const purpose = getQueryArg(window.location.href, "purpose");
    const status = getQueryArg(window.location.href, "status");
    const applicationNumber = getQueryArg(window.location.href,"consumerCode") || getQueryArg(window.location.href,"applicationNumber");
    const tenant = getQueryArg(window.location.href, "tenantId");
    const secondNumber = getQueryArg(window.location.href, "receiptNumber");
    const businessService = getQueryArg(window.location.href, "businessService");
    const moduleName = getQueryArg(window.location.href, "moduleName");
    if(purpose && purpose === "pay") {
      getBpaDetails(action, state, dispatch, applicationNumber, tenant);
    }
    const data = getAcknowledgementCard(
      action,
      state,
      dispatch,
      purpose,
      status,
      applicationNumber,
      secondNumber,
      tenant,
      businessService,
      moduleName
    );
    set(action, "screenConfig.components.div.children", data);
    return action;
  }
};

export default screenConfig;
