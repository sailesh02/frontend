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


const getHeader=(applicationNumber)=>{
return getCommonContainer({
  header: getCommonHeader({
    labelName: `Application for BPA (${getCurrentFinancialYear()})`, //later use getFinancialYearDates
    labelKey: "BPA_COMMON_APPLY_BPA_HEADER_LABEL"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-bpa",
    componentPath: "ApplicationNoContainer",
    props: {
      number: applicationNumber
    },
    visible: true
  }
})
}

const getNOCHeader=(applicationNumber)=>{
  return getCommonContainer({
    header: getCommonHeader({
      labelName: `Application for Noc`,
      labelKey: "NOC_COMMON_HEADER_LABEL"
    }),
    applicationNumber: {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-bpa",
      componentPath: "ApplicationNoContainer",
      props: {
        number: applicationNumber
      },
      visible: true
    }
  })
  }

const downloadprintMenu = (action, state, dispatch, applicationNumber, tenantId, uiCommonPayConfig, businessService) => {
  const receiptKey = get(uiCommonPayConfig, "receiptKey","consolidatedreceipt");
  let keyLabel = "BPA_PERMIT_ORDER";
  if(window.location.href.includes("BPA.NC_OC_SAN_FEE")) {
    keyLabel = "BPA_OC_PERMIT_ORDER"
  }
   let receiptDownloadObject = {
       label: { labelName: "DOWNLOAD RECEIPT", labelKey: "COMMON_DOWNLOAD_RECEIPT" },
       link: () => {
           const receiptQueryString = [
               { key: "receiptNumbers", value: applicationNumber },
               { key: "tenantId", value: tenantId }
           ]
           download(receiptQueryString, "download", receiptKey, state);

       },
       leftIcon: "receipt"
   };
   let applicationDownloadObject = {
    label: { labelName: "Permit Order Receipt", labelKey: keyLabel },
    link: () => {
      permitOrderNoDownload(action, state, dispatch, "Download");
      // generatePdf(state, dispatch, "application_download");
    },
    leftIcon: "assignment"
  };
  let applicationPrintObject = {
    label: { labelName: "Permit Order Receipt", labelKey: keyLabel },
    link: () => {
      permitOrderNoDownload(action, state, dispatch, "Print");
      // generatePdf(state, dispatch, "application_download");
    },
    leftIcon: "assignment"
  };
   let receiptPrintObject = {
       label: { labelName: "PRINT RECEIPT", labelKey: "COMMON_PRINT_RECEIPT" },
       link: () => {
           const receiptQueryString = [
               { key: "receiptNumbers", value: applicationNumber },
               { key: "tenantId", value: tenantId }
           ]
           download(receiptQueryString, "print", receiptKey, state);
       },
       leftIcon: "receipt"
   };
   let downloadMenu = [];
   let printMenu = [];
   switch (businessService) {
    case "BPA.LOW_RISK_PERMIT_FEE":
    case "BPA.NC_SAN_FEE":
    case "BPA.NC_OC_SAN_FEE": 
      downloadMenu = [receiptDownloadObject];
      printMenu = [receiptPrintObject];
    break;   
    default:
    downloadMenu = [receiptDownloadObject];    
    printMenu = [receiptPrintObject];
    break;    
  }

   return {
       uiFramework: "custom-atoms",
       componentPath: "Div",
       props: {
           className: "downloadprint-commonmenu",
           style: { textAlign: "right", display: "flex" }
       },
       children: {
           downloadMenu: {
               uiFramework: "custom-molecules",
               componentPath: "DownloadPrintButton",
               props: {
                   data: {
                       label: { labelName: "DOWNLOAD", labelKey: "TL_DOWNLOAD" },
                       leftIcon: "cloud_download",
                       rightIcon: "arrow_drop_down",
                       props: { variant: "outlined", style: { height: "60px", color: "#FE7A51",marginRight:"5px" }, className: "tl-download-button" },
                       menu: downloadMenu
                   }
               }
           },
           printMenu: {
               uiFramework: "custom-molecules",
               componentPath: "DownloadPrintButton",
               props: {
                   data: {
                       label: { labelName: "PRINT", labelKey: "TL_PRINT" },
                       leftIcon: "print",
                       rightIcon: "arrow_drop_down",
                       props: { variant: "outlined", style: { height: "60px", color: "#FE7A51" }, className: "tl-print-button" },
                       menu: printMenu
                   }
               }
           }

       },
   }

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
  if (purpose === "approve" && status === "success" && moduleName !== "Noc") {
    return {
      header:getHeader(applicationNumber),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "BPA Approved Successfully",
              labelKey: "BPA_APPROVAL_CHECKLIST_MESSAGE_HEAD"
            },
            body: {
              labelName:
                "A notification regarding BPA Approval has been sent to building owner at registered Mobile No.",
              labelKey: "BPA_APPROVAL_CHECKLIST_MESSAGE_SUB"
            },
            // tailText: {
            //   labelName: "BPA No.",
            //   labelKey: "BPA_HOME_SEARCH_RESULTS_BPA_NO_LABEL"
            // },
            // number: secondNumber
          })
        }
      },
      approvalSuccessFooter
    };
  } else if (purpose === "sendback" && status === "success") {
    return {
      header:getHeader(applicationNumber),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application sent back Successfully",
              labelKey: "BPA_SENDBACK_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName: "Application has been sent back successfully",
              labelKey: "BPA_APPLICATION_SENDBACK_SUCCESS"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "BPA_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
          })
        }
      },
      gotoHomeFooter
    };
  } else if (purpose === "application" && status === "rejected" && moduleName !== "Noc") {
    return {
      header:getHeader(applicationNumber),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "close",
            backgroundColor: "#E54D42",
            header: {
              labelName: "Application for permit order is rejected",
              labelKey: "BPA_APPROVAL_REJECTED_MESSAGE_HEAD"
            },
            body: {
              labelName:
                "A notification regarding BPA Rejection has been sent to building owner at registered Mobile No.",
              labelKey: "BPA_APPROVAL_REJE_MESSAGE_SUBHEAD"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "BPA_HOME_SEARCH_RESULTS_APP_NO_LABEL"
            },
            number: applicationNumber
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
