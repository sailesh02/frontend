import {
  convertEpochToDate, getCommonCard,
  getCommonContainer,
  getCommonHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getFileUrl, getFileUrlFromAPI,

  getQueryArg,
  getTransformedLocale,
  setBusinessServiceDataToLocalStorage
} from "egov-ui-framework/ui-utils/commons";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import { getLocale, getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import jp from "jsonpath";
import get from "lodash/get";
import set from "lodash/set";
import { edcrHttpRequest, httpRequest } from "../../../../ui-utils/api";
import { getAppSearchResults, getNocSearchResults, prepareNOCUploadData, nocapplicationUpdateBPA, getStakeHolderRoles } from "../../../../ui-utils/commons";
import "../egov-bpa/applyResource/index.css";
import "../egov-bpa/applyResource/index.scss";
import { permitConditions } from "../egov-bpa/summaryResource/permitConditions";
import { permitListSummary } from "../egov-bpa/summaryResource/permitListSummary";
import {
  downloadFeeReceipt,
  edcrDetailsToBpaDetails,
  generateBillForBPA,
  permitOrderNoDownload,
  requiredDocumentsData,
  revocationPdfDownload,
  setProposedBuildingData,
  prepareNocFinalCards,
  compare,
  generateBillForSanctionFee,
  setInstallmentInfo,
  openBpdDownloadDialog
} from "../utils/index";
import { spclArchitectsPicker, approvalAuthority } from "./searchResource/spclArchitects";
// import { loadPdfGenerationDataForBpa } from "../utils/receiptTransformerForBpa";
import { citizenFooter, updateBpaApplication, updateBpaApplicationAfterApproved, generateShowCauseNotice, getScnHistory, viewPaymentDetails, viewPaymentDetail } from "./searchResource/citizenFooter";
import { applicantSummary, institutionSummary } from "./summaryResource/applicantSummary";
import { basicSummary } from "./summaryResource/basicSummary";
import { declarationSummary } from "./summaryResource/declarationSummary";
import { estimateSummary } from "./summaryResource/estimateSummary";
import { sanctionFeeSummary } from "./summaryResource/sanctionFeeSummary";
import { fieldinspectionSummary } from "./summaryResource/fieldinspectionSummary";
import { fieldSummary } from "./summaryResource/fieldSummary";
import { reviewPdfSignDetails } from './summaryResource/review-pdfSign.js'
import { previewSummary } from "./summaryResource/previewSummary";
import { scrutinySummary ,commentsContainer, commentsContainerMultiLine, getEdcrHistory, scrutinySummaryForHistory} from "./summaryResource/scrutinySummary";
import { nocDetailsSearchBPA} from "./noc";
import store from "ui-redux/store";
import commonConfig from "config/common.js";
import { getPaymentSearchAPI } from "egov-ui-kit/utils/commons";
import { additionalDocsInformation } from "./applyResource/documentDetails";
import { sanctionFeeAdjustmentDetails } from "./applyResource/sanctionFeeAdjustmentDetails";

const closePdfSigningPopup = (refreshType) => {
  store.dispatch(
    handleField(
      "search-preview",
      "components.div.children.pdfSigningPopup.props",
      "openPdfSigningPopup",
      false
    )
  )

  if(refreshType == "preview"){
    // store.dispatch(handleField(
    //   'search-preview',
    //   'components.div.children.body.children.cardContent.children.reviewPdfSignDetails.children.cardContent.children.headerDiv.children.editSection',
    //   'visible',
    //   false
    // ))
    store.dispatch(prepareFinalObject("BPA.dscDetails[0].documentId",'Yes'))
  }
}

const downloadRevocationLetter = () => {
  window.scrollTo(0, document.body.scrollHeight);
}

export const ifUserRoleExists = role => {
  let userInfo = JSON.parse(getUserInfo());
  const roles = get(userInfo, "roles");
  const roleCodes = roles ? roles.map(role => role.code) : [];
  if (roleCodes.indexOf(role) > -1) {
    return true;
  } else return false;
};
const isEditButtonVisible = () => {
  let users = JSON.parse(getUserInfo());
  const roleCodes =
  users && users.roles
    && users.roles.map((role) => {
      return role.code;
    })
  const isRoleExist = roleCodes.includes("BPA_ARC_APPROVER") || roleCodes.includes("BPA2_APPROVER") || roleCodes.includes("BPA3_APPROVER") ||
  roleCodes.includes("BPA4_APPROVER") || roleCodes.includes("BPA5_APPROVER")
  return isRoleExist
}

const isAcreditedPerson = () => {
  let users = JSON.parse(getUserInfo());
  const roleCodes =
  users && users.roles
    && users.roles.map((role) => {
      return role.code;
    })
  const isRoleExist = roleCodes.includes("BPA_ARC_APPROVER")
  return isRoleExist
}
const titlebar = {
  uiFramework: "custom-atoms",
  componentPath: "Div",
  children: {
    leftContainerH: getCommonContainer({
      header: getCommonHeader({
        labelName: "Application details",
        labelKey: "BPA_TASK_DETAILS_HEADER"
      }),
      applicationNumber: {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-bpa",
        componentPath: "ApplicationNoContainer",
        props: {
          number: "NA"
        }
      }
    }),
    rightContainerH: getCommonContainer({
      footNote: {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-bpa",
        componentPath: "NoteAtom",
        props: {
          number: "NA"
        },
        visible: false
      }
    })
  }
}

const titlebar2 = {
  uiFramework: "custom-atoms",
  componentPath: "Div",
  // visible: false,
  props: {
    style: { textAlign: "right", display: "flex" }
  },
  children: {
    permitNumber: {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-bpa",
      componentPath: "PermitNumber",
      gridDefination: {},
      props: {
        number: "NA"
      },
    },
    rightContainer: getCommonContainer({
      downloadMenu: {
        uiFramework: "custom-molecules",
        componentPath: "DownloadPrintButton",
        props: {
          data: {
            label: { labelName: "DOWNLOAD", labelKey: "BPA_DOWNLOAD" },
            leftIcon: "cloud_download",
            rightIcon: "arrow_drop_down",
            props: { variant: "outlined", style: { height: "60px", color: "#FE7A51", marginRight: 10 }, className: "tl-download-button" },
            menu: []
          }
        }
      },
      printMenu: {
        uiFramework: "custom-molecules",
        componentPath: "DownloadPrintButton",
        props: {
          data: {
            label: { labelName: "PRINT", labelKey: "BPA_PRINT" },
            leftIcon: "print",
            rightIcon: "arrow_drop_down",
            props: { variant: "outlined", style: { height: "60px", color: "#FE7A51" }, className: "tl-download-button" },
            menu: []
          }
        }
      }
    })
  }
}

const prepareDocumentsView = async (state, dispatch) => {
  let documentsPreview = [];

  // Get all documents from response
  let BPA = get(
    state,
    "screenConfiguration.preparedFinalObject.BPA",
    {}
  );
  let applicantDocuments = jp.query(
    BPA,
    "$.documents.*"
  );

  let otherDocuments = jp.query(
    BPA,
    "$.additionalDetail.documents.*"
  );
  let allDocuments = [
    ...applicantDocuments,
    ...otherDocuments
  ];

  allDocuments.forEach(doc => {

    documentsPreview.push({
      title: getTransformedLocale(doc.documentType),
      //title: doc.documentType,
      fileStoreId: doc.fileStore,
      linkText: "View"
    });
  });
  let fileStoreIds = jp.query(documentsPreview, "$.*.fileStoreId");
  let fileUrls =
    fileStoreIds.length > 0 ? await getFileUrlFromAPI(fileStoreIds) : {};
  documentsPreview = documentsPreview.map((doc, index) => {
    doc["link"] =
      (fileUrls &&
        fileUrls[doc.fileStoreId] &&
        getFileUrl(fileUrls[doc.fileStoreId])) ||
      "";
    doc["name"] =
      (fileUrls[doc.fileStoreId] &&
        decodeURIComponent(
          getFileUrl(fileUrls[doc.fileStoreId])
            .split("?")[0]
            .split("/")
            .pop()
            .slice(13)
        )) ||
      `Document - ${index + 1}`;
    return doc;

  });
  let documentDetailsPreview = [], nocDocumentsPreview = [];
  documentsPreview.forEach(doc => {
    if (doc && doc.title) {
      let type = doc.title.split("_")[0];
      if (type === "NOC") {
        nocDocumentsPreview.push(doc);
      } else {
        documentDetailsPreview.push(doc)
      }
    }
  })
  dispatch(prepareFinalObject("documentDetailsPreview", documentDetailsPreview));
  dispatch(prepareFinalObject("nocDocumentsPreview", nocDocumentsPreview));
};

// const prepareDocumentsUploadRedux = (state, dispatch) => {
//   dispatch(prepareFinalObject("documentsUploadRedux", documentsUploadRedux));
// };

const spclArchitechActions = (action, state, dispatch) => {
  let downloadMenu = [];
  let sendToArchObject = {
    label: { labelName: "SEND TO CITIZEN", labelKey: "BPA_SEND_BACK_TO_CITIZEN_BUTTON", },
    link: () => {
      updateBpaApplication(state, dispatch, "SEND_BACK_TO_CITIZEN");
    },
  };
  let ApproveObject = {
    label: { labelName: "Approve", labelKey: "BPA_APPROVE_BUTTON" },
    link: () => {
      updateBpaApplication(state, dispatch, "APPROVE");
    },
  };
  let RejectObject = {
    label: { labelName: "Reject", labelKey: "REJECT" },
    link: () => {
      updateBpaApplication(state, dispatch, "REJECT");
    },
  };
  downloadMenu = [sendToArchObject, ApproveObject,RejectObject];
  dispatch(
    handleField(
      "search-preview",
      "components.div.children.citizenFooter.children.sendToArch.children.buttons.children.downloadMenu",
      "props.data.menu",
      downloadMenu
    )
  );
}

const sendToArchDownloadMenu = (action, state, dispatch) => {
  let downloadMenu = [];
  let sendToArchObject = {
    label: { labelName: "SEND TO ARCHITECT", labelKey: "BPA_SEND_TO_ARCHITECT_BUTTON", },
    link: () => {
      updateBpaApplication(state, dispatch, "SEND_TO_ARCHITECT");
    },
  };
  let ApproveObject = {
    label: { labelName: "Approve", labelKey: "BPA_APPROVE_BUTTON" },
    link: () => {
      updateBpaApplication(state, dispatch, "APPROVE");
    },
  };
  downloadMenu = [sendToArchObject, ApproveObject];
  dispatch(
    handleField(
      "search-preview",
      "components.div.children.citizenFooter.children.sendToArch.children.buttons.children.downloadMenu",
      "props.data.menu",
      downloadMenu
    )
  );
}

const buttonAfterApprovedMenu = (action, state, dispatch) => {
  let downloadMenu = [];
  let sendToArchObject = {
    label: { labelName: "BPA_INTIMATE_CONSTRUCT_START_BUTTON", labelKey: "BPA_INTIMATE_CONSTRUCT_START_BUTTON", },
    link: () => {
      updateBpaApplication(state, dispatch, "INTIMATE_CONSTRUCT_START");
    },
  };

  let viewPaymentInfo = {
    label: { labelName: "BPA_CITIZEN_VIEW_PAYMENT", labelKey: "BPA_CITIZEN_VIEW_PAYMENT", },
    link: () => {
      viewPaymentDetail(state, dispatch);
    },
  };

  downloadMenu = [sendToArchObject, viewPaymentInfo];
  dispatch(
    handleField(
      "search-preview",
      "components.div.children.citizenFooter.children.buttonAfterApproved.children.buttons.children.downloadMenu",
      "props.data.menu",
      downloadMenu
    )
  );
}

const setDownloadMenu = async (action, state, dispatch, applicationNumber, tenantId) => {
  /** MenuButton data based on status */
  let status = get(
    state,
    "screenConfiguration.preparedFinalObject.BPA.status"
  );

  let BPAData = get(state.screenConfiguration.preparedFinalObject,"BPA")
  // let applicationDigitallySigned = BPAData &&
  // BPAData.dscDetails && BPAData.dscDetails[0].documentId ? true :  BPAData &&
  // !BPAData.dscDetails ? true : false
  let bpdSigned = false; 
  if(BPAData && BPAData.additionalDetails && BPAData.additionalDetails.buildingPlanLayoutIsSigned) bpdSigned = true;
  let applicationDigitallySigned = BPAData && BPAData.dscDetails && BPAData.dscDetails[0].documentId ? true : false
  let riskType = get(
    state,
    "screenConfiguration.preparedFinalObject.BPA.riskType"
  );

  const service = get(
    state,
    "screenConfiguration.preparedFinalObject.BPA.businessService"
  );
  let downloadMenu = [];
  let printMenu = [];
  let appFeeDownloadObject = {
    label: { labelName: "Payment Receipt", labelKey: "BPA_APP_FEE_RECEIPT" },
    link: () => {
      downloadFeeReceipt(state, dispatch, status, "BPA.NC_APP_FEE", "Download");
    },
    leftIcon: "book"
  };
  let appFeePrintObject = {
    label: { labelName: "Payment Receipt", labelKey: "BPA_APP_FEE_RECEIPT" },
    link: () => {
      downloadFeeReceipt(state, dispatch, status, "BPA.NC_APP_FEE", "Print");
    },
    leftIcon: "book"
  };
  let sanFeeDownloadObject = {
    label: { labelName: "Sanction Fee Receipt", labelKey: "BPA_SAN_FEE_RECEIPT" },
    link: () => {
      downloadFeeReceipt(state, dispatch, status, "BPA.NC_SAN_FEE", "Download");
    },
    leftIcon: "receipt"
  };
  let sanFeePrintObject = {
    label: { labelName: "Sanction Fee Receipt", labelKey: "BPA_SAN_FEE_RECEIPT" },
    link: () => {
      downloadFeeReceipt(state, dispatch, status, "BPA.NC_SAN_FEE", "Print");
    },
    leftIcon: "receipt"
  };
  let permitOrderDownloadObject = {
    label: { labelName: "Permit Order Receipt", labelKey: "BPA_PERMIT_ORDER" },
    link: () => {
      permitOrderNoDownload(action, state, dispatch, "Download");
    },
    leftIcon: "assignment"
  };
  let permitOrderPrintObject = {
    label: { labelName: "Permit Order Receipt", labelKey: "BPA_PERMIT_ORDER" },
    link: () => {
      permitOrderNoDownload(action, state, dispatch, "Print");
    },
    leftIcon: "assignment"
  };
  let lowAppFeeDownloadObject = {
    label: { labelName: "Fee Receipt", labelKey: "BPA_FEE_RECEIPT" },
    link: () => {
      downloadFeeReceipt(state, dispatch, status, "BPA.LOW_RISK_PERMIT_FEE", "Download");
    },
    leftIcon: "book"
  };
  let lowAppFeePrintObject = {
    label: { labelName: "Fee Receipt", labelKey: "BPA_FEE_RECEIPT" },
    link: () => {
      downloadFeeReceipt(state, dispatch, status, "BPA.LOW_RISK_PERMIT_FEE", "Print");
    },
    leftIcon: "book"
  };
  let revocationPdfDownlaodObject = {
    label: { labelName: "Revocation Letter", labelKey: "BPA_REVOCATION_PDF_LABEL" },
    link: () => {
      downloadRevocationLetter(action, state, dispatch, "Download");
    },
    leftIcon: "assignment"
  };
  let revocationPdfPrintObject = {
    label: { labelName: "Revocation Letter", labelKey: "BPA_REVOCATION_PDF_LABEL" },
    link: () => {
      downloadRevocationLetter(action, state, dispatch, "Print");
    },
    leftIcon: "assignment"
  };


  

  let signedBPDDownloadObject = {
    label: { labelName: "Permit Order Receipt", labelKey: "BPD_BPL_BPL" },
    link: () => {
      openBpdDownloadDialog(action, state, dispatch, "Download", "BPA_BPD_SIGNED");
    },
    leftIcon: "assignment"
  };
  // let signedBPDPrintObject = {
  //   label: { labelName: "Permit Order Receipt", labelKey: "BPA_BPD_SIGNED" },
  //   link: () => {
  //     BpdDownload(action, state, dispatch, "Print", "BPA_BPD_SIGNED");
  //   },
  //   leftIcon: "assignment"
  // };

  let queryObject = [
    {
      key: "tenantId",
      value: tenantId
    },
    {
      key: "consumerCodes",
      value: applicationNumber
    }
  ];
  
  let paymentPayload = {}; 
  paymentPayload.Payments = [];
  // if(riskType === "LOW") {
  //   let feetype = "BPA.LOW_RISK_PERMIT_FEE"
  //   if(service === "BPA5"){
  //     feetype = "BPA.NC_SAN_FEE";
  //   }
  //   let lowAppPaymentPayload = await httpRequest(
  //     "post",
  //     getPaymentSearchAPI(feetype),
  //     "",
  //     queryObject
  //   );
  //   if(lowAppPaymentPayload && lowAppPaymentPayload.Payments && lowAppPaymentPayload.Payments.length > 0) paymentPayload.Payments.push(lowAppPaymentPayload.Payments[0]);
  // } else {
  //   let businessServicesList = ["BPA.NC_APP_FEE", "BPA.NC_SAN_FEE" ];
  //   for(let fee = 0; fee < businessServicesList.length; fee++ ) {
  //     let lowAppPaymentPayload = await httpRequest(
  //       "post",
  //       getPaymentSearchAPI(businessServicesList[fee]),
  //       "",
  //       queryObject
  //     );
  //     if(lowAppPaymentPayload && lowAppPaymentPayload.Payments) paymentPayload.Payments.push(lowAppPaymentPayload.Payments[0]);
  //   }
  // }

  let businessServicesList = ["BPA.NC_APP_FEE", "BPA.NC_SAN_FEE" ];
    
      let paymentsResponse = await httpRequest(
        "post",
        getPaymentSearchAPI("-1"),
        "",
        queryObject
      );
      let paymentsCount = paymentsResponse && paymentsResponse.Payments.length;


    if(paymentsCount > 0){
      for(let i=0; i<paymentsResponse.Payments.length;i++){
        if(paymentsResponse && paymentsResponse.Payments[i].paymentDetails[0].businessService === "BPA.NC_APP_FEE"){
          downloadMenu.push(appFeeDownloadObject);
          printMenu.push(appFeePrintObject);
        }
        if(paymentsResponse && paymentsResponse.Payments[i].paymentDetails[0].businessService === "BPA.NC_SAN_FEE"){
         // if(paymentsResponse && paymentsResponse.Payments.length > 1){

            sanFeeDownloadObject.label.labelKey = `Sanction Fee Receipt - ${convertEpochToDate(paymentsResponse.Payments[i].transactionDate)}`
            sanFeePrintObject.label.labelKey = `Sanction Fee Receipt - ${convertEpochToDate(paymentsResponse.Payments[i].transactionDate)}`
          downloadMenu.push(
            {
              label: { labelName: "Sanction Fee Receipt", labelKey: `Sanction Fee Receipt - ${convertEpochToDate(paymentsResponse.Payments[i].transactionDate)}` },
              link: () => {
                downloadFeeReceipt(state, dispatch, status, "BPA.NC_SAN_FEE", "Download", paymentsResponse.Payments[i].transactionNumber);
              },
              leftIcon: "receipt"
            }
          )

          printMenu.push(
            {
              label: { labelName: "Sanction Fee Receipt", labelKey: `Sanction Fee Receipt - ${convertEpochToDate(paymentsResponse.Payments[i].transactionDate)}` },
              link: () => {
                downloadFeeReceipt(state, dispatch, status, "BPA.NC_SAN_FEE", "Print", paymentsResponse.Payments[i].transactionNumber);
              },
              leftIcon: "receipt"
            }
          )
          
         // }
         // downloadMenu.push(sanFeeDownloadObject);
         // printMenu.push(sanFeePrintObject);
        } 

      }
    }
    

    switch (status) {
      case "DOC_VERIFICATION_INPROGRESS":
      case "FIELDINSPECTION_INPROGRESS":
      case "NOC_VERIFICATION_INPROGRESS":
      case "APPROVAL_INPROGRESS":
      case "PENDING_SANC_FEE_PAYMENT":
      case "REJECTED":
      case "CITIZEN_ACTION_PENDING_AT_DOC_VERIF":
      case "APP_L1_VERIFICATION_INPROGRESS":
      case "APP_L2_VERIFICATION_INPROGRESS":
      case "APP_L3_VERIFICATION_INPROGRESS":  
        downloadMenu = downloadMenu
        printMenu = printMenu
        break;
      case "APPROVED":
        if(applicationDigitallySigned){
          downloadMenu.push(permitOrderDownloadObject);
          printMenu.push(permitOrderPrintObject);
        }
        if(bpdSigned){
          downloadMenu.push(signedBPDDownloadObject);
          
        }

        
        break;
      case "PERMIT_REVOKED":
        downloadMenu.push(revocationPdfDownlaodObject);
        printMenu.push(revocationPdfPrintObject);
        break;
      default:
        downloadMenu = [];
        printMenu = [];
        break;
    }
  //}
  dispatch(
    handleField(
      "search-preview",
      "components.div.children.headerDiv.children.header2.children.titlebar2.children.rightContainer.children.downloadMenu",
      "props.data.menu",
      downloadMenu
    )
  );
  dispatch(
    handleField(
      "search-preview",
      "components.div.children.headerDiv.children.header2.children.titlebar2.children.rightContainer.children.printMenu",
      "props.data.menu",
      printMenu
    )
  );
  /** END */
};

const stakeholerRoles = getStakeHolderRoles();

const closeEdcrHistoryPopup = (refreshType) => {
  store.dispatch(
    handleField(
      "search-preview",
      "components.div.children.edcrHistory.props",
      "openPdfSigningPopup",
      false
    )
  )
    }
const getRequiredMdmsDetails = async (state, dispatch) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "common-masters",
          masterDetails: [
            {
              name: "DocumentType"
            }
          ]
        },
        {
          moduleName: "BPA",
          masterDetails: [
            {
              name: "DocTypeMapping"
            },
            {
              name: "CheckList"
            },
            {
              name: "RiskTypeComputation"
            },
            {
              name: "NocTypeMapping"
            }
          ]
        },
        {
          moduleName: "NOC",
          masterDetails: [
            {
              name: "DocumentTypeMapping"
            },
          ]
        },

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
  dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));

  // let payloadarchList = await httpRequest(
  //   "post",
  //   "/user/_restrictedSearch",
  //   "_modify",
  //   [],
  //   {
  //   "roleCodes": ["BPA_ARC_APPROVER"],
  //   "userType": "CITIZEN",
  //   "tenantId": "od"
  //   }
  // );
  // console.log(payloadarchList, "Nero payloadarchList")
  // let preparingObj = [];
  // payloadarchList && payloadarchList.user && payloadarchList.user.length > 0 && payloadarchList.user.forEach((userInfo)=>{ preparingObj.push({code: userInfo.name, uuid: userInfo.uuid})})
  // dispatch(prepareFinalObject("specialArchitectList", preparingObj));
}

const setSearchResponse = async (
  state,
  dispatch,
  applicationNumber,
  tenantId,
  action
) => {
  await getRequiredMdmsDetails(state, dispatch);
  const response = await getAppSearchResults([
    {
      key: "tenantId",
      value: tenantId,
    },
    { key: "applicationNo", value: applicationNumber },
  ]);
  const payload = await getNocSearchResults(
    [
      {
        key: "tenantId",
        value: tenantId,
      },
      { key: "sourceRefId", value: applicationNumber },
    ],
    state
  );

  dispatch(prepareFinalObject("Noc", payload.Noc));
  payload.Noc.sort(compare);
  // await prepareNOCUploadData(state, dispatch);
  // prepareNocFinalCards(state, dispatch);

  let type = getQueryArg(window.location.href, "type", "");

  const isUserEmployee = get(state.auth.userInfo, "type");

  if (!type || isUserEmployee === "EMPLOYEE") {
    let businessService = get(response, "BPA[0].businessService");
    const queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "businessServices", value: businessService },
    ];
    setBusinessServiceDataToLocalStorage(queryObject, dispatch);
  }

  const edcrNumber = get(response, "BPA[0].edcrNumber");
  const status = get(response, "BPA[0].status");
  dispatch(prepareFinalObject("BPA", response.BPA[0]));
  if (get(response, "BPA[0].status") == "CITIZEN_APPROVAL_INPROCESS") {
    // TODO if required to show for architect before apply,
    //this condition should extend to OR with status INPROGRESS
    let businessService = "BPA.NC_APP_FEE";
    if (get(response, "BPA[0].businessService") == "BPA_LOW") {
      //businessService = "BPA.LOW_RISK_PERMIT_FEE"
      businessService = "BPA.NC_APP_FEE";
    }
    generateBillForBPA(dispatch, applicationNumber, tenantId, businessService);
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.citizenFooter.children.sendToArch",
        "visible",
        true
      )
    );
  }

  if (
    get(response, "BPA[0].status") == "APPROVED" &&
    ifUserRoleExists("CITIZEN")
  ) {
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.citizenFooter.children.buttonAfterApproved",
        "visible",
        true
      )
    );
  }

  
  if (
    get(response, "BPA[0].status") == "SHOW_CAUSE_ISSUED" &&
    ifUserRoleExists("CITIZEN") 
    //&&
    //(ifUserRoleExists("BPA_ARC_APPROVER") || ifUserRoleExists("BPA_ARCHITECT") || ifUserRoleExists("CITIZEN"))
  ) {
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.citizenFooter.children.scnReplyButton",
        "visible",
        true
      )
    );
  }
  if (get(response, "BPA[0].businessService") === "BPA5") {
    let additionalDetails = get(response, "BPA[0].additionalDetails", null);
    if (
      additionalDetails &&
      additionalDetails.assignes &&
      additionalDetails.assignes[0].uuid
    ) {
      let payloadarchList = await httpRequest(
        "post",
        "/user/_search",
        "_search",
        [],
        {
          uuid: [additionalDetails.assignes[0].uuid],
        }
      );

      let approvalAuthorityDetail = {
        approvalAuthority: "Accredited Person",
        approvalPersonName:
          payloadarchList &&
          payloadarchList.user &&
          payloadarchList.user[0].name,
      };
      dispatch(
        prepareFinalObject("approvalAuthorityDetail", approvalAuthorityDetail)
      );
    }
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.body.children.cardContent.children.approvalAuthority",
        "visible",
        true
      )
    );
  }
  let proposedAppStatus = ["PENDING_FORWARD"];
  let businesIds = ["BPA5"];
  if (
    !proposedAppStatus.includes(get(response, "BPA[0].status")) &&
    !businesIds.includes(get(response, "BPA[0].businessService"))
  ) {
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.spclArchList.visible",
      false
    );
  } else if (
    !proposedAppStatus.includes(get(response, "BPA[0].status")) &&
    businesIds.includes(get(response, "BPA[0].businessService"))
  ) {
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.spclArchList.visible",
      false
    );
  } else {
    let payloadarchList = await httpRequest(
      "post",
      "/user/_restrictedSearch",
      "_modify",
      [],
      {
        roleCodes: ["BPA_ARC_APPROVER"],
        userType: "CITIZEN",
        tenantId: "od",
      }
    );
    console.log(payloadarchList, "Nero payloadarchList");
    let preparingObj = [];
    payloadarchList &&
      payloadarchList.user &&
      payloadarchList.user.length > 0 &&
      payloadarchList.user.forEach((userInfo) => {
        preparingObj.push({
          code: userInfo.name,
          uuid: userInfo.uuid,
          name: userInfo.name,
        });
      });
    //dispatch(prepareFinalObject("specialArchitectList", preparingObj));
    // set code name
    let assignee = get(response, "BPA[0].additionalDetails.assignes[0]");
    preparingObj.forEach((item, index) => {
      if (assignee.selected) {
        if (item["uuid"] === assignee.uuid) {
          dispatch(prepareFinalObject("specialArchitectList", preparingObj));
          dispatch(prepareFinalObject("BPA.workflow.assignes", [item.uuid]));
          dispatch(
            handleField(
              "search-preview",
              "components.div.children.body.children.cardContent.children.spclArchList.children.cardContent.children.spclArchitectsPicker.children.spclArchsDropdown.props",
              "value",
              item.code
            )
          );
        }
      }
    });
  }

  if (
    (get(response, "BPA[0].status") == "APPROVAL_INPROGRESS" ||
      get(response, "BPA[0].status") == "PENDING_SANC_FEE_PAYMENT") &&
    get(response, "BPA[0].businessService") == "BPA5"
  ) {
    let questions = [
      {
        active: true,
        fieldType: "YES/NO/NA",
        question: "PLAN_AS_PER_THE_SITE",
      },
    ];
    let docs = [
      { code: "FI.FIR", required: false },
      { code: "FI.SINS", required: false },
      { code: "FI.SISS", required: false },
      { code: "FI.SIES", required: false },
      { code: "FI.SIWS", required: false },
    ];
    dispatch(
      prepareFinalObject(
        `docsForSpclArchForInspectionReport.questions`,
        questions
      )
    );
    dispatch(
      prepareFinalObject(`docsForSpclArchForInspectionReport.docTypes`, docs)
    );
  }

  if (
    process.env.REACT_APP_NAME === "Citizen" &&
    get(response, "BPA[0].status") == "APPROVAL_INPROGRESS" &&
    get(response, "BPA[0].businessService") == "BPA5" &&
    ifUserRoleExists("BPA_ARC_APPROVER")
  ) {
    set(
      action,
      "screenConfig.components.div.children.citizenFooter.children.sendToArch.visible",
      true
    );
    //spclArchitechActions(action,state,dispatch)
    //buttonAfterApprovedMenu(action, state, dispatch);
  }

  if (
    process.env.REACT_APP_NAME === "Employee" &&
    get(response, "BPA[0].status") === "APPROVED" &&
    get(response, "BPA[0].businessService") == "BPA5"
  ) {
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.generateShowCauseNotice.children.generateShowCauseNotice.visible",
      true
    );
  }
  let appStatuses = [
    "SHOW_CAUSE_REPLY_VERIFICATION_PENDING",
    "SHOW_CAUSE_ISSUED",
    "PERMIT_REVOKED",
  ];
  if (
    (process.env.REACT_APP_NAME === "Employee" ||
      process.env.REACT_APP_NAME === "Citizen") &&
    appStatuses.includes(get(response, "BPA[0].status")) &&
    get(response, "BPA[0].businessService") == "BPA5"
  ) {
    // set(
    //   action,
    //   "screenConfig.components.div.children.body.children.cardContent.children.generateShowCauseNotice.children.generateShowCauseNotice.visible",
    //   true
    // );
    // set(
    //   action,
    //   "screenConfig.components.div.children.body.children.cardContent.children.generateShowCauseNotice.children.generateRevokeNotice.visible",
    //   true
    // );
    let noticeHistory = await httpRequest(
      "post",
      "/bpa-services/v1/notice/_search",
      "_search",
      [
        {
          key: "tenantid",
          value: tenantId,
        },
        { key: "businessid", value: applicationNumber },
      ],
      {}
    );
    if (
      noticeHistory &&
      noticeHistory.Notice &&
      noticeHistory.Notice.length > 0
    ) {
      dispatch(prepareFinalObject("SCNHistory", noticeHistory.Notice));
    } else {
      set(
        action,
        "screenConfig.components.div.children.body.children.cardContent.children.scnHistory.visible",
        false
      );
    }
  } else {
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.scnHistory.visible",
      false
    );
  }

  let appStatus = get(response, "BPA[0].status", "");
  let edcrHistory = get(response, "BPA[0].reWorkHistory", "");
  if (edcrHistory) {
    dispatch(prepareFinalObject(`edcrHistory`, edcrHistory.edcrHistory));
  } else {
    dispatch(prepareFinalObject(`edcrHistory`, []));
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.body.children.cardContent.children.scrutinySummary.children.cardContent.children.header.children.edcrHistoryButton",
        "visible",
        false
      )
    );
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.body.children.cardContent.children.edcrHistory",
        "visible",
        false
      )
    );
  }
  if (
    process.env.REACT_APP_NAME == "Citizen" &&
    appStatus === "PENDING_ARCHITECT_ACTION_FOR_REWORK"
  ) {
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.body.children.cardContent.children.scrutinySummary.children.cardContent.children.header.children.scrutinyResubmitButton",
        "visible",
        true
      )
    );

    set(
      action,
      "screenConfig.components.div.children.citizenFooter.children.forwardAfterReworkButton.visible",
      true
    );
  }

  set(
    action,
    "screenConfig.components.div.children.body.children.cardContent.children.estimateSummary.visible",
    appStatus &&
      (appStatus == "CITIZEN_APPROVAL_INPROCESS" ||
        appStatus == "APP_L1_VERIFICATION_INPROGRESS" ||
        appStatus == "APP_L2_VERIFICATION_INPROGRESS" ||
        appStatus == "APP_L3_VERIFICATION_INPROGRESS" ||
        appStatus == "APPROVAL_INPROGRESS")
  );

  set(
    action,
    "screenConfig.components.div.children.body.children.cardContent.children.sanctionFeeSummary.visible",
    appStatus &&
      (appStatus == "APP_L1_VERIFICATION_INPROGRESS" ||
        appStatus == "APP_L2_VERIFICATION_INPROGRESS" ||
        appStatus == "APP_L3_VERIFICATION_INPROGRESS" ||
        appStatus == "APPROVAL_INPROGRESS")
  );

  set(
    action,
    "screenConfig.components.div.children.body.children.cardContent.children.sanctionFeeAdjustFormCard.visible",
    process.env.REACT_APP_NAME === "Employee" &&
      appStatus &&
      (appStatus == "APP_L1_VERIFICATION_INPROGRESS" ||
        appStatus == "APP_L2_VERIFICATION_INPROGRESS" ||
        appStatus == "APP_L3_VERIFICATION_INPROGRESS" ||
        appStatus == "APPROVAL_INPROGRESS")
  );

  const otherConditionData =
    response.BPA[0].additionalDetails &&
    response.BPA[0].additionalDetails.otherConditionsForPermitCertificate;
  let BpaData =
    !type || isUserEmployee === "EMPLOYEE"
      ? get(response, "BPA[0].businessService")
      : "";
  console.log(BpaData, "BpaData");
  const validitionStatusForRole =
    appStatus &&
    (appStatus == "APPROVAL_INPROGRESS" ||
      appStatus == "APP_L1_VERIFICATION_INPROGRESS" ||
      appStatus == "APP_L2_VERIFICATION_INPROGRESS" ||
      (appStatus == "APP_L3_VERIFICATION_INPROGRESS" &&
        ifUserRoleExists("BPA1_APPROVER")) ||
      ifUserRoleExists("BPA2_APPROVER") ||
      ifUserRoleExists("BPA3_APPROVER") ||
      ifUserRoleExists("BPA4_APPROVER") ||
      ifUserRoleExists("BPA5_APPROVER") ||
      ifUserRoleExists("BPA2_APP_L1_VERIFIER") ||
      ifUserRoleExists("BPA3_APP_L1_VERIFIER") ||
      ifUserRoleExists("BPA4_APP_L1_VERIFIER") ||
      ifUserRoleExists("BPA4_APP_L2_VERIFIER") ||
      ifUserRoleExists("BPA4_APP_L3_VERIFIER")) &&
    process.env.REACT_APP_NAME != "Citizen" &&
    (BpaData == "BPA1" ||
      BpaData == "BPA2" ||
      BpaData == "BPA3" ||
      BpaData === "BPA4");
  console.log(validitionStatusForRole, "validitionStatusForRole");
  const citizenOtherConditionValidationRole =
    appStatus &&
    appStatus == "APPROVAL_INPROGRESS" && ifUserRoleExists("BPA_ARC_APPROVER") && get(response, "BPA[0].businessService") === "BPA5" &&
    process.env.REACT_APP_NAME == "Citizen";
  if (validitionStatusForRole == true) {
    if (otherConditionData && otherConditionData.length > 0) {
      set(
        action,
        "screenConfig.components.div.children.body.children.cardContent.children.commentsContainer.visible",
        true
      );

      set(
        action,
        "screenConfig.components.div.children.body.children.cardContent.children.otherConditionsForPermitCertificate.visible",
        false
      );
    } else {
      set(
        action,
        "screenConfig.components.div.children.body.children.cardContent.children.commentsContainer.visible",
        false
      );

      set(
        action,
        "screenConfig.components.div.children.body.children.cardContent.children.otherConditionsForPermitCertificate.visible",
        true
      );
    }
  } else {
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.commentsContainer.visible",
      false
    );

    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.otherConditionsForPermitCertificate.visible",
      false
    );
  }
  if(citizenOtherConditionValidationRole) {
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.otherConditionsForPermitCertificate.visible",
      true
    );
  }
  let edcrRes = await edcrHttpRequest(
    "post",
    "/edcr/rest/dcr/scrutinydetails?edcrNumber=" +
      edcrNumber +
      "&tenantId=" +
      tenantId,
    "search",
    []
  );

  dispatch(prepareFinalObject(`scrutinyDetails`, edcrRes.edcrDetail[0]));

  /*********Call Sanction Fee Api and save it in State********/
  if (
    appStatus &&
    (appStatus == "APP_L1_VERIFICATION_INPROGRESS" ||
      appStatus == "APP_L2_VERIFICATION_INPROGRESS" ||
      appStatus == "APP_L3_VERIFICATION_INPROGRESS" ||
      appStatus == "APPROVAL_INPROGRESS")
  ) {
    generateBillForSanctionFee(
      response,
      edcrRes && edcrRes.edcrDetail[0],
      dispatch,
      applicationNumber,
      tenantId,
      "applyScreenMdmsData.sanctionFeeCardData"
    );
    generateBillForSanctionFee(
      response,
      edcrRes && edcrRes.edcrDetail[0],
      dispatch,
      applicationNumber,
      tenantId,
      "applyScreenMdmsData.estimateCardData"
    );
  }
  // dispatch(prepareFinalObject("BPA.additionalDetails.sanctionFeeCardEnabled", false));
  /*******************/

  let additionalDocTypes = [
    "DocTypes1",
    "DocTypes1",
    "DocTypes2",
    "DocTypes3",
    "DocTypes4",
    "DocTypes5",
    "DocTypes6",
    "DocTypes7",
  ];

  let scrutinyAdditionalInfo =
    edcrRes.edcrDetail[0].planDetail.planInformation.additionalDocuments;
  let addtionalDocTypesCheckboxesValues = {};
  if (additionalDocTypes && additionalDocTypes.length > 0) {
    for (let i = 0; i < additionalDocTypes.length; i++) {
      if (scrutinyAdditionalInfo.includes(additionalDocTypes[i])) {
        addtionalDocTypesCheckboxesValues[additionalDocTypes[i]] = true;
      } else {
        addtionalDocTypesCheckboxesValues[additionalDocTypes[i]] = false;
      }
    }
  }
  dispatch(
    prepareFinalObject(
      "addtionalDocTypesCheckboxesValues",
      addtionalDocTypesCheckboxesValues
    )
  );

  await edcrDetailsToBpaDetails(state, dispatch);
  let isCitizen = process.env.REACT_APP_NAME === "Citizen" ? true : false;

  if (status && status == "INPROGRESS") {
    let userInfo = JSON.parse(getUserInfo()),
      roles = get(userInfo, "roles"),
      isArchitect = false;
    if (roles && roles.length > 0) {
      roles.forEach((role) => {
        if (stakeholerRoles.includes(role.code)) {
          isArchitect = true;
        }
      });
    }
    if (isArchitect && isCitizen) {
      dispatch(
        handleField(
          "search-preview",
          "components.div.children.body.children.cardContent.children.declarationSummary.children.headers",
          "visible",
          true
        )
      );
      dispatch(
        handleField(
          "search-preview",
          "components.div.children.body.children.cardContent.children.declarationSummary.children.header.children.body.children.firstStakeholder",
          "visible",
          true
        )
      );
    }
  }

  if (status && status === "CITIZEN_APPROVAL_INPROCESS" && isCitizen) {
    let userInfo = JSON.parse(getUserInfo()),
      roles = get(userInfo, "roles"),
      owners = get(response.BPA["0"].landInfo, "owners"),
      isTrue = false,
      isOwner = true;
    if (roles && roles.length > 0) {
      roles.forEach((role) => {
        if (stakeholerRoles.includes(role.code)) {
          isTrue = true;
        }
      });
    }

    if (isTrue && owners && owners.length > 0) {
      owners.forEach((owner) => {
        if (owner.mobileNumber === userInfo.mobileNumber) {
          //owner.uuid === userInfo.uuid
          if (owner.roles && owner.roles.length > 0) {
            owner.roles.forEach((owrRole) => {
              if (stakeholerRoles.includes(owrRole.code)) {
                isOwner = false;
              }
            });
          }
        }
      });
    }
    if (isTrue && isOwner) {
      dispatch(
        handleField(
          "search-preview",
          "components.div.children.citizenFooter",
          "visible",
          false
        )
      );
    } else {
      dispatch(
        handleField(
          "search-preview",
          "components.div.children.body.children.cardContent.children.declarationSummary.children.headers",
          "visible",
          true
        )
      );
      dispatch(
        handleField(
          "search-preview",
          "components.div.children.body.children.cardContent.children.declarationSummary.children.header.children.body.children.citizen",
          "visible",
          true
        )
      );
    }
  }

  let BPAData = get(response, "BPA");
  let isOldApplication =
    BPAData && BPAData.length > 0 && BPAData[0] && !BPAData[0].dscDetails
      ? true
      : false;

  dispatch(
    handleField(
      "search-preview",
      "components.div.children.body.children.cardContent.children.reviewPdfSignDetails",
      "visible",
      status == "APPROVED" && !isOldApplication ? true : false
    )
  );

  let applicationDigitallySigned =
    BPAData &&
    BPAData.length > 0 &&
    BPAData[0] &&
    BPAData[0].dscDetails &&
    BPAData[0].dscDetails[0].documentId
      ? true
      : false;

  // if(!isOldApplication){
  //   dispatch(handleField(
  //     'search-preview',
  //     'components.div.children.body.children.cardContent.children.reviewPdfSignDetails.children.cardContent.children.headerDiv.children.editSection',
  //     'visible',
  //     (status == 'APPROVED' && (ifUserRoleExists('BPA1_APPROVER') ||
  //     ifUserRoleExists('BPA2_APPROVER') || ifUserRoleExists('BPA3_APPROVER') ||
  //     ifUserRoleExists('BPA4_APPROVER')) && process.env.REACT_APP_NAME != 'Citizen' &&
  //     !applicationDigitallySigned) ? true : false
  //   ))
  // }

  if (response && response.BPA["0"] && response.BPA["0"].documents) {
    dispatch(prepareFinalObject("documentsTemp", response.BPA["0"].documents));
  }

  if (response && get(response, "BPA[0].approvalNo")) {
    if (get(response, "BPA[0].status") === "PERMIT_REVOKED") {
      dispatch(
        handleField(
          "search-preview",
          "components.div.children.headerDiv.children.header2.children.titlebar2.children.permitNumber",
          "props.number",
          "REVOKED"
        )
      );
    } else {
      dispatch(
        handleField(
          "search-preview",
          "components.div.children.headerDiv.children.header2.children.titlebar2.children.permitNumber",
          "props.number",
          get(response, "BPA[0].approvalNo")
        )
      );
    }
  } else {
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.headerDiv.children.header2.children.titlebar2.children.permitNumber",
        "visible",
        false
      )
    );
  }

  dispatch(
    handleField(
      "search-preview",
      "components.div.children.headerDiv.children.header.children.leftContainerH.children.applicationNumber",
      "props.number",
      applicationNumber
    )
  );

  getNocList(state, dispatch, true);

  // Set Institution/Applicant info card visibility
  if (
    get(response, "BPA.landInfo.ownershipCategory", "").startsWith(
      "INSTITUTION"
    )
  ) {
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.body.children.cardContent.children.applicantSummary",
        "visible",
        false
      )
    );
  }

  setProposedBuildingData(state, dispatch);

  if (get(response, "BPA[0].additionalDetails.validityDate")) {
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.headerDiv.children.header.children.rightContainerH.children.footNote",
        "props.number",
        convertEpochToDate(
          get(response, "BPA[0].additionalDetails.validityDate")
        )
      )
    );

    dispatch(
      handleField(
        "search-preview",
        "components.div.children.headerDiv.children.header.children.rightContainerH.children.footNote.visible",
        true
      )
    );
  }

  dispatch(prepareFinalObject("documentDetailsPreview", {}));
  requiredDocumentsData(state, dispatch, action);
  await setDownloadMenu(action, state, dispatch, applicationNumber, tenantId);
  sendToArchDownloadMenu(action, state, dispatch);
  const bService = getQueryArg(window.location.href, "bservice");
  if (bService === "BPA5" && isAcreditedPerson()) {
    spclArchitechActions(action, state, dispatch);
  }
  buttonAfterApprovedMenu(action, state, dispatch);
  dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));
  if (
    edcrRes.edcrDetail[0].planDetail.planInformation.additionalDocuments &&
    edcrRes.edcrDetail[0].planDetail.planInformation.additionalDocuments
      .length < 1
  ) {
    set(
      action.screenConfig,
      "components.div.children.body.children.cardContent.children.additionalDocsInformation.visible",
      false
    );
  }
  if (
    edcrRes.edcrDetail[0].planDetail.planInformation.additionalDocuments &&
    edcrRes.edcrDetail[0].planDetail.planInformation.additionalDocuments
      .length > 0
  ) {
    let scrutinyAdditionalInfo = [];
    scrutinyAdditionalInfo =
      edcrRes.edcrDetail[0].planDetail.planInformation.additionalDocuments &&
      edcrRes.edcrDetail[0].planDetail.planInformation.additionalDocuments;
    let additionDocCheckboxes = get(
      action.screenConfig,
      "components.div.children.body.children.cardContent.children.additionalDocsInformation.children.cardContent.children.applicantCard.children",
      []
    );

    let additionalCheckboxArray = Object.keys(additionDocCheckboxes);
    if (additionalCheckboxArray && additionalCheckboxArray.length > 0) {
      for (let i = 0; i < additionalCheckboxArray.length; i++) {
        if (!scrutinyAdditionalInfo.includes(additionalCheckboxArray[i])) {
          set(
            action.screenConfig,
            `components.div.children.body.children.cardContent.children.additionalDocsInformation.children.cardContent.children.applicantCard.children.${additionalCheckboxArray[i]}.visible`,
            false
          );
        }
      }
    }
  }
  //only architech can add noc
  if (ifUserRoleExists("BPA_ARCHITECT")) {
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.body.children.cardContent.children.nocDetailsApply.children.cardContent.children.headerDiv.children.header.children.addNocButton",
        "visible",
        true
      )
    );
  }

  if (
    response &&
    response.BPA["0"] &&
    (response.BPA["0"].landInfo.ownershipCategory.includes(
      "INSTITUTIONALGOVERNMENT"
    ) ||
      response.BPA["0"].landInfo.ownershipCategory.includes(
        "INSTITUTIONALPRIVATE"
      ))
  ) {
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.body.children.cardContent.children.applicantSummary",
        "visible",
        false
      )
    );
  } else {
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.body.children.cardContent.children.institutionSummary",
        "visible",
        false
      )
    );
  }
  if (process.env.REACT_APP_NAME === "Citizen") {
    let thirdPartyDataExists = false;
    if (payload && payload.Noc.length > 0) {
      payload &&
        payload.Noc.forEach((item) => {
          if (!("thirdPartyNOC" in item.additionalDetails)) {
            thirdPartyDataExists = true;
            return;
          }
        });
    }

    if (thirdPartyDataExists) {
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Please upload required data for NOCs",
            labelKey: "Please upload required data for NOCs",
          },
          "warning"
        )
      );
    }
    if (
      response &&
      response.BPA["0"] &&
      response.BPA["0"].status === "PERMIT_REVOKED" &&
      response.BPA["0"].businessService === "BPA5"
    ) {
      dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Permit letter revocation information",
            labelKey: "BPA_PERMIT_LETTER_REVOKATION_INFO",
          },
          "warning"
        )
      );
    }

    let isDemandGeneratedAndNotPaid = get(state.screenConfiguration.preparedFinalObject, "isDemandGeneratedAndNotPaid");
    if(isDemandGeneratedAndNotPaid){
      dispatch(
        toggleSnackbar(
          true,
          { labelName: "Your previous payment is pending please pay the same from Take Actions button.", labelKey: "BPA_PREVIOUS_PENDING_PAYMENT" },
          "warning"
        )
      );
    }

  }
};

export const getNocList = async (state,dispatch,filter) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          "moduleName": "NOC",
          "masterDetails": [
              {
                  "name": "NocType"
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

let nocTypes = payload && payload.MdmsRes && payload.MdmsRes.NOC && payload.MdmsRes.NOC.NocType &&
payload.MdmsRes.NOC.NocType.length > 0 && payload.MdmsRes.NOC.NocType

let activatedNocs = nocTypes && nocTypes.length > 0 && nocTypes.filter( noc => {
  if(noc.isActive){
    return noc
  }
}) || []

activatedNocs = activatedNocs && activatedNocs.length > 0 && activatedNocs.map( noc => {
  return noc.code
}) || []

dispatch(prepareFinalObject("nocTypes", nocTypes));
// to check already created NOC's
if(filter){
  const Noc = get(state.screenConfiguration.preparedFinalObject, "Noc", []);
  let generatedNoc = Noc.map( noc => {
      return noc.nocType
  })
  
  let nocList = []
  if(nocTypes && nocTypes.length > 0){
    nocList = nocTypes.filter ( noc => {
          if(!generatedNoc.includes(noc.code) && noc.isActive){
            return noc
          }
      })
    }
  
  nocList = nocList && nocList.length > 0 && nocList.map ( noc => {
    return {
      label : noc.code,
      value : noc.code
    }
  })

  dispatch(handleField(
    "search-preview",
    "components.div.children.triggerNocContainer.props",
    "nocList",
    nocList
  ))
  dispatch(prepareFinalObject("newNocList", nocList));
}
}

export const beforeSubmitHook = async () => {
  let state = store.getState();
  let bpaDetails = get(state, "screenConfiguration.preparedFinalObject.BPA", {});
  let isNocTrue = get(state, "screenConfiguration.preparedFinalObject.BPA.isNocTrue", false);
  if (!isNocTrue) {
    const Noc = get(state, "screenConfiguration.preparedFinalObject.Noc", []);
    let nocDocuments = get(state, "screenConfiguration.preparedFinalObject.nocFinalCardsforPreview", []);
    if (Noc.length > 0) {
      let count = 0;
      for (let data = 0; data < Noc.length; data++) {
        let documents = get(nocDocuments[data], "documents", null);
        set(Noc[data], "documents", documents);
        let response = await httpRequest(
          "post",
          "/noc-services/v1/noc/_update",
          "",
          [],
          { Noc: Noc[data] }
        );
        if (get(response, "ResponseInfo.status") == "successful") {
          count++;
          if (Noc.length == count) {
            store.dispatch(prepareFinalObject("BPA.isNocTrue", true));
            return bpaDetails;
          }
        }
      }
    } else {
      return bpaDetails;
    } 
  } else {
    return bpaDetails;
  }
}

const screenConfig = {
  uiFramework: "material-ui",
  name: "search-preview",
  beforeInitScreen: (action, state, dispatch) => {
    let type = getQueryArg(
      window.location.href,
      "type", ""
    );
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const isUserEmployee = get(
      state.auth.userInfo,
      "type"
    )
    if (isUserEmployee != "EMPLOYEE") {
      const bService = getQueryArg(
        window.location.href,
        "bservice"
      );
      let businessServicesValue = bService;
      // if (type) {
      //   if (type === "LOW") {
      //     businessServicesValue = "BPA_LOW";
      //   }
      const queryObject = [
        { key: "tenantId", value: tenantId },
        { key: "businessServices", value: businessServicesValue }
      ];

      setBusinessServiceDataToLocalStorage(queryObject, dispatch);
     if(businessServicesValue != "BPA5"){
    
      set(
        action,
        "screenConfig.components.div.children.body.children.cardContent.children.spclArchList.visible",
        false
      );  
     }

    setInstallmentInfo(state, dispatch, action);
    
    



    }
    //}

    setSearchResponse(state, dispatch, applicationNumber, tenantId, action);
    // prepareDocumentsUploadData(state,dispatch);


    // Hide edit buttons

    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.nocSummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.applicantSummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.previewSummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.basicSummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.scrutinySummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.plotAndBoundaryInfoSummary.children.cardContent.children.header.children.editSection.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.nocSummary.children.cardContent.children.uploadedNocDocumentDetailsCard.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.fieldSummary.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.fieldinspectionSummary.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.permitConditions.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.permitListSummary.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.declarationSummary.children.headers.visible",
      false
    );
    set(
      action,
      "components.div.children.body.children.cardContent.children.nocDetailsApply.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.body.children.cardContent.children.approvalAuthority.visible",
      false
    );
    dispatch(prepareFinalObject("nocDocumentsDetailsRedux", {}));
   
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css bpa-searchpview"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 6,
                md: 6
              },
              ...titlebar
            },
            header2: {
              uiFramework: "custom-atoms",
              componentPath: "Container",
              props: {
                color: "primary",
                style: { justifyContent: "flex-end" }
              },
              gridDefination: {
                xs: 12,
                sm: 6,
                md: 6,
                align: "right"
              },
              children: {
                titlebar2
              }
            }
          }
        },

        taskStatus: {
          uiFramework: "custom-containers-local",
          componentPath: "WorkFlowContainer",
          moduleName: "egov-workflow",
          visible: true,
          props: {
            dataPath: "BPA",
            moduleName: "BPA",
            updateUrl: "/bpa-services/v1/bpa/_update",
            beforeSubmitHook: beforeSubmitHook
          }
        },
        sendToArchPickerDialog: {
          componentPath: "Dialog",
          props: {
            open: false,
            maxWidth: "md"
          },
          children: {
            dialogContent: {
              componentPath: "DialogContent",
              props: {
                classes: {
                  root: "city-picker-dialog-style"
                }
              },
              children: {
                popup: getCommonContainer({
                  header: getCommonHeader({
                    labelName: "Forward Application",
                    labelKey: "BPA_FORWARD_APPLICATION_HEADER"
                  }),
                  cityPicker: getCommonContainer({
                    cityDropdown: {
                      uiFramework: "custom-molecules-local",
                      moduleName: "egov-bpa",
                      componentPath: "ActionDialog",
                      required: true,
                      gridDefination: {
                        xs: 12,
                        sm: 12
                      },
                      props: {}
                    },
                  })
                })
              }
            }
          }
        },
        body: getCommonCard({
          approvalAuthority: approvalAuthority,
          estimateSummary: estimateSummary,
          sanctionFeeSummary: sanctionFeeSummary,
          sanctionFeeAdjustFormCard: {
            uiFramework: "custom-atoms",
            componentPath: "Form",
            props: {
              id: "sanction_fee_adjust_card_form"
            },
            children: {
              apint: getCommonCard({ sanctionFeeAdjustmentDetails })
  
            },
            visible: true
          },
          otherConditionsForPermitCertificate: commentsContainerMultiLine,
          commentsContainer : commentsContainer,
          reviewPdfSignDetails : reviewPdfSignDetails,
          fieldSummary: fieldSummary,
          fieldinspectionSummary: fieldinspectionSummary,
          basicSummary: basicSummary,
          scrutinySummary: scrutinySummary,
          applicantSummary: applicantSummary,
          institutionSummary: institutionSummary,
          additionalDocsInformation: additionalDocsInformation,
          previewSummary: previewSummary,
          nocDetailsApply: nocDetailsSearchBPA,
          spclArchList: spclArchitectsPicker,
          declarationSummary: declarationSummary,
          permitConditions: permitConditions,
          permitListSummary: permitListSummary,
         // generateShowCauseNotice: generateShowCauseNotice
         scnHistory: getScnHistory,
        edcrHistory: getEdcrHistory,
          
        }),
        triggerNocContainer :{
          uiFramework: "custom-containers-local",
          componentPath: "TriggerNOCContainer",
          moduleName: "egov-bpa",
          visible: true,
          props: {
            open:false,
            nocType:''
          }
        },
        pdfSigningPopup : {
          uiFramework: 'custom-containers-local',
          componentPath: 'SignPdfContainer',
          moduleName: "egov-workflow",
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
         },
        popupForScrutinyDetail: {
          componentPath: "Dialog",
          isClose: true,
          props: {
            open: false,
            maxWidth: "md"
          },
          children: {
            dialogContent: {
              componentPath: "DialogContent",
              props: {
                classes: {
                  root: "city-picker-dialog-style"
                }
              },
              children: {
                popup: getCommonContainer({
                  header: getCommonHeader({
                    labelName: "Scrutiny Header",
                    labelKey: "BPA_SCRUTINY_HISTORY_HEADER"
                  }),
                  closePop: getCommonContainer({
                    closeCompInfo: {
                      uiFramework: "custom-molecules-local",
                      moduleName: "egov-bpa",
                      componentPath: "CloseDialog",
                      required: true,
                      gridDefination: {
                        xs: 12,
                        sm: 12
                      },
                      props: {
                        screen: "search-preview",
                        jsonpath: "components.div.children.popupForScrutinyDetail"
                      }
                    },
                  }),
                  scrutinySummaryForHistory: scrutinySummaryForHistory,

                })
              }
            }
          }
        },
        downloadBPDPickerDialog: {
          componentPath: "Dialog",
          props: {
            open: false,
            maxWidth: "md"
          },
          children: {
            dialogContent: {
              componentPath: "DialogContent",
              props: {
                classes: {
                  root: "city-picker-dialog-style"
                }
              },
              children: {
                popup: getCommonContainer({
                  header: getCommonHeader({
                    labelName: "Forward Application",
                    labelKey: "BPD_BPL_BPL"
                  }),
                  cityPicker: getCommonContainer({
                    cityDropdown: {
                      uiFramework: "custom-molecules-local",
                      moduleName: "egov-bpa",
                      componentPath: "DownloadDocuments",
                      required: true,
                      gridDefination: {
                        xs: 12,
                        sm: 12
                      },
                      props: {}
                    },
                  })
                })
              }
            }
          }
        },
        citizenFooter: process.env.REACT_APP_NAME === "Citizen" ? citizenFooter : {},
      //  viewPaymentDetails: process.env.REACT_APP_NAME === "Citizen" ? viewPaymentDetails : {},
        
      }
    },
    commentsPopup :{
      uiFramework: "custom-containers-local",
      componentPath: "TextAreaContainerForBpa",
      moduleName: "egov-bpa",
      visible: true,
      props: {
        open:false
      }
    },
  }
};

export default screenConfig;
