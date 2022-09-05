
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { getTenantId, getUserInfo,getAccessToken } from "egov-ui-kit/utils/localStorageUtils";
import { toggleSnackbar,hideSpinner, showSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get"
import store from "redux/store";
import axios from 'axios';
import { getFileUrlFromAPI, getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import { downloadPdf, openPdf, printPdf } from "egov-ui-kit/utils/commons";

export const getNextFinancialYearForRenewal = async (currentFinancialYear) => {

  let payload = null;
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: getTenantId(),
      moduleDetails: [
        {
          moduleName: "egf-master",
          masterDetails: [{ name: "FinancialYear", filter: `[?(@.module == "TL")]` }]
        }
      ]
    }
  };

  try {

    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );

    const financialYears = get(payload.MdmsRes, "egf-master.FinancialYear");
    const currrentFYending = financialYears.filter(item => item.code === currentFinancialYear)[0]
      .endingDate;
    return financialYears.filter(item => item.startingDate === currrentFYending)[0].code;
  } catch (e) {
    console.log(e.message)
  }
}

export const getSearchResults = async (tenantId, licenseNumber) => {
  let queryObject = [
    {
      key: "tenantId",
      value: tenantId
    },
    { key: "offset", value: "0" },
    { key: "licenseNumbers", value: licenseNumber }
  ];
  try {
    const response = await httpRequest(
      "post",
      "/tl-services/v1/_search",
      "",
      queryObject
    );
    return response;
  } catch (error) {
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

const downloadReceiptFromFilestoreID = (fileStoreId, mode, tenantId,showConfirmation=false) => {
  getFileUrlFromAPI(fileStoreId, tenantId).then(async (fileRes) => {
    if (fileRes && !fileRes[fileStoreId]) {
      console.error('ERROR IN DOWNLOADING RECEIPT');
      return;
    }
    if (mode === 'download') {
      if(localStorage.getItem('pay-channel')&&localStorage.getItem('pay-redirectNumber')){
        setTimeout(()=>{
          const weblink = "https://api.whatsapp.com/send?phone=" + localStorage.getItem('pay-redirectNumber') + "&text=" + ``;
          window.location.href = weblink
        },1500)
      }
      downloadPdf(fileRes[fileStoreId]);
      if(showConfirmation){
        if(localStorage.getItem('receipt-channel')=='whatsapp'&&localStorage.getItem('receipt-redirectNumber')!=''){
          setTimeout(() => {
            const weblink = "https://api.whatsapp.com/send?phone=" + localStorage.getItem('receipt-redirectNumber') + "&text=" + ``;
            window.location.href = weblink
          }, 1500)
        }
        store.dispatch(toggleSnackbar(true, { labelName: "Success in Receipt Generation", labelKey: "SUCCESS_IN_GENERATION_RECEIPT" }
      , "success"));
      }
    } else if (mode === 'open') {
      if(localStorage.getItem('pay-channel')&&localStorage.getItem('pay-redirectNumber')){
        setTimeout(()=>{
          const weblink = "https://api.whatsapp.com/send?phone=" + localStorage.getItem('pay-redirectNumber') + "&text=" + ``;
          window.location.href = weblink
        },1500)
      }
      openPdf(fileRes[fileStoreId], '_blank')
      if(showConfirmation){
        if(localStorage.getItem('receipt-channel')=='whatsapp'&&localStorage.getItem('receipt-redirectNumber')!=''){
          setTimeout(() => {
            const weblink = "https://api.whatsapp.com/send?phone=" + localStorage.getItem('receipt-redirectNumber') + "&text=" + ``;
            window.location.href = weblink
          }, 1500)
        }
        store.dispatch(toggleSnackbar(true, { labelName: "Success in Receipt Generation", labelKey: "SUCCESS_IN_GENERATION_RECEIPT" }
      , "success"));
      }
    }
    else {
      printPdf(fileRes[fileStoreId]);
    }
  });
}

const getSearchResultsForPdf = async (queryObject, modulePdfIdentifier) => {
  try {
    let apiName = "mr-services";
    if (modulePdfIdentifier === "Licenses") {
      apiName = "tl-services"
    }
    const response = await httpRequest(
      "post",
      `/${apiName}/v1/_search`,
      "",
      queryObject
    );
    return response;
  } catch (error) {
    console.log(error);
    return {};
  }
};
const getFileStore = (fileKey, documents) => {
  let fileStoreId;
  let requiredDocument = documents && documents.length > 0 && documents.filter(doc => {
    return doc.documentType == fileKey
  })
  fileStoreId = requiredDocument && requiredDocument.length > 0 && requiredDocument[0].documentId || null
  return fileStoreId
}
// get PDF body
export const getPdfBody = async (applicationNo, tenantId) => {
  const userInfo = JSON.parse(getUserInfo());
  const authToken = getAccessToken();
  let RequestInfo = {
    "apiId": "Rainmaker",
    "ver": ".01",
    "action": "_search",
    "did": "1",
    "key": "",
    "msgId": "20170310130900|en_IN",
    "requesterId": "",
    authToken,
    "userInfo": userInfo
  };
  let queryObject = [
    { key: "tenantId", value: tenantId },
    { key: "applicationNo", value: applicationNo },
  ];
  try {
    let bpaResult = await httpRequest(
      "post",
      "/bpa-services/v1/bpa/_search",
      "",
      queryObject
    );
    let edcrNumber =
      (bpaResult &&
        bpaResult.BPA &&
        bpaResult.BPA.length > 0 &&
        bpaResult.BPA[0].edcrNumber) ||
      "";

    try {
      let BPA = bpaResult.BPA[0];
      //BPA.businessService = "BPA1" //Need to remove this line once BPA5 is added from Backend side.
      return {
        RequestInfo: RequestInfo,
        Bpa: [BPA],
      };
    } catch (err) {
      return;
    }
  } catch (err) {
    return;
  }
};
export const showPDFPreview = async (pdfPreviewData, pdfKey, modulePdfIdentifier, mode = 'download') => {
  let tenantId = get(pdfPreviewData[0], "tenantId") || get(pdfPreviewData, "tenantId");
  let applicationNumber = get(pdfPreviewData[0], "applicationNumber") || get(pdfPreviewData, "applicationNo");
  // const applicationType = pdfPreviewData && pdfPreviewData.length > 0 ? get(pdfPreviewData[0], "applicationType") : "NEW";
  const queryStr = [
    { key: "key", value: pdfKey },
    { key: "tenantId", value: tenantId ? tenantId.split(".")[0] : commonConfig.tenantId }
  ]
  const DOWNLOADRECEIPT = {
    GET: {
      URL: "/pdf-service/v1/_create",
      ACTION: "_get",
    },
  };
  let queryObject = [
    { key: "tenantId", value: tenantId },
    {
      key: "applicationNumber",
      value: applicationNumber
    }
  ];
  let data = await getPdfBody(applicationNumber,tenantId)
  let oldFileStoreId = null;
  if(modulePdfIdentifier === "MarriageRegistrations" || modulePdfIdentifier === "Licenses"){
    const LicensesPayload = await getSearchResultsForPdf(queryObject, modulePdfIdentifier);

    const updatedLicenses = get(LicensesPayload, modulePdfIdentifier);
    oldFileStoreId = get(updatedLicenses[0], "fileStoreId") || getFileStore(pdfKey, LicensesPayload && LicensesPayload.modulePdfIdentifier && LicensesPayload.modulePdfIdentifier.length > 0 &&
      LicensesPayload.modulePdfIdentifier[0].dscDetails || [])
  }
  
  if (oldFileStoreId) {
    downloadReceiptFromFilestoreID(oldFileStoreId, "open", tenantId)
  }
  else {
    try {
      if (modulePdfIdentifier === "MarriageRegistrations") {
        let MarriageRegistrations = '';
        MarriageRegistrations = pdfPreviewData;
        httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, { MarriageRegistrations }, { 'Accept': 'application/json' }, { responseType: 'arraybuffer' })
        .then(res => {
          res.filestoreIds[0]
          if (res && res.filestoreIds && res.filestoreIds.length > 0) {
            res.filestoreIds.map(fileStoreId => {
              downloadReceiptFromFilestoreID(fileStoreId, "open")
            })
          } else {
            console.log("Error In Acknowledgement form Download");
          }
        });

      }else if(modulePdfIdentifier === "BPA") {
        store.dispatch(showSpinner());
        let Bpa = "";
        Bpa = [pdfPreviewData];
        let res = await axios.post(
          `/edcr/rest/dcr/generatePermitOrder?key=buildingpermit&tenantId=${tenantId}`,
          data,
          {
            "Content-Type": "application/json",
            Accept: "application/json",
          }
        );
        if (res.data) {
          store.dispatch(hideSpinner());
          res.data.filestoreIds[0]
          if (res.data.filestoreIds && res.data.filestoreIds.length > 0) {
            res.data.filestoreIds.map((fileStoreId) => {
              downloadReceiptFromFilestoreID(fileStoreId, "open",tenantId);
            });
          } else {
            store.dispatch(hideSpinner());
            console.log("Error In Acknowledgement form Download");
          }
        }
      }
      else {
        let Licenses = '';
        Licenses = pdfPreviewData;
        httpRequest("post", DOWNLOADRECEIPT.GET.URL, DOWNLOADRECEIPT.GET.ACTION, queryStr, { Licenses }, { 'Accept': 'application/json' }, { responseType: 'arraybuffer' })
          .then(res => {
            res.filestoreIds[0]
            if (res && res.filestoreIds && res.filestoreIds.length > 0) {
              res.filestoreIds.map(fileStoreId => {
                downloadReceiptFromFilestoreID(fileStoreId, "open")
              })
            } else {
              console.log("Error In Acknowledgement form Download");
            }
          });

      }


    } catch (exception) {
      alert('Some Error Occured while downloading Acknowledgement form!');
    }
  }
}