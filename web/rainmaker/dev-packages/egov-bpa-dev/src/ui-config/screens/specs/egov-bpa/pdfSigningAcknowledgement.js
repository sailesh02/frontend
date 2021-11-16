import {
    getCommonHeader,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import {
    signedSuccessFooter,
  } from "./acknowledgementResource/footers";
  import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import set from "lodash/set";
  import get from "lodash/get";
  import { permitOrderNoDownload } from "../utils";
  import { download, getAppSearchResults } from "../../../../ui-utils/commons";
  import {
    prepareFinalObject
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  
  const digitalSignatureHeader = getCommonContainer({
    header: getCommonHeader({
      labelName: `BPA_PDF_SIGNING`, //later use getFinancialYearDates
      labelKey: "BPA_PDF_SIGNING"
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
  
  const downloadprintMenu = (action, state, dispatch, applicationNumber, tenantId, uiCommonPayConfig, businessService,signed) => {
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
      if(signed){
        downloadMenu = [receiptDownloadObject, applicationDownloadObject];
        printMenu = [receiptPrintObject, applicationPrintObject];
      }else{
        downloadMenu = [receiptDownloadObject];
        printMenu = [receiptPrintObject];
      }    
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
    let acknowlegmentPurpose = getQueryArg(window.location.href, "purpose")
    if(acknowlegmentPurpose == 'signed' && status == "success"){
      {
        return {
          digitalSignatureHeader,
          headerdownloadprint: downloadprintMenu(action, state, dispatch, secondNumber, tenant, uiCommonPayConfig, businessService,true),      
          applicationSuccessCard: {
            uiFramework: "custom-atoms",
            componentPath: "Div",
            children: {
              card: acknowledgementCard({
                icon: "done",
                backgroundColor: "#39CB74",
                header: {
                  labelName: "You have successfully signed the certificate!",
                  labelKey: "BPA_SIGN_CHECKLIST_MESSAGE_HEAD"
                },
                body: {
                },
              })
            }
          },
          signedSuccessFooter: signedSuccessFooter(action, state, dispatch, secondNumber, tenant, uiCommonPayConfig, businessService)
        };
      }
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
    name: "pdfSigningAcknowledgement",
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
  