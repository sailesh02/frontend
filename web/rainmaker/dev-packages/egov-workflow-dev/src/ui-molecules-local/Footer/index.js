import { Container, Item } from "egov-ui-framework/ui-atoms";
import MenuButton from "egov-ui-framework/ui-molecules/MenuButton";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { hideSpinner, showSpinner } from "egov-ui-kit/redux/common/actions";
import { getTenantId, getUserInfo,getAccessToken,getLocale } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import set from "lodash/set";
import React from "react";
import { connect } from "react-redux";
import { ActionDialog } from "../";
import {
  getNextFinancialYearForRenewal
} from "../../ui-utils/commons";
import { getDownloadItems } from "./downloadItems";
import "./index.css";
import { prepareFinalObject } from "../../../../../packages/lib/egov-ui-framework/ui-redux/screen-configuration/actions";
import axios from 'axios';
import store from "ui-redux/store";

let RequestInfo = {};
let customRequestInfo = JSON.parse(getUserInfo())

// pdf signing @final approval step in BPA and OC
// to form pdf body w.r.t modules and report type
  const getPdfBody = (moduleName,preparedFinalObject) => {
    switch(moduleName){  
      case 'BPA':
        const {BPA,scrutinyDetails} = preparedFinalObject
        let BPAWithScrutiny = {
          ...BPA,
          edcrDetails:scrutinyDetails
        }
        return {
          RequestInfo : RequestInfo,
          "Bpa":[BPAWithScrutiny]
        }
      case 'NewTL':
        const {Licenses} = preparedFinalObject  
        return {
          RequestInfo : RequestInfo,
          "Licenses":Licenses
        }
      case 'MR':
          const {MarriageRegistrations} = preparedFinalObject  
        return {
          RequestInfo : RequestInfo,
          "MarriageRegistrations":MarriageRegistrations
        }
      default:
        return {
          ...RequestInfo
        }  
    }
  }

  // to get pdf key for calling pdf service
  const getKey = (moduleName,data) => {
    let applicationType = moduleName && moduleName == 'NewTL' ? data[0].applicationType : ''
    let pdfKey = "";
    switch(moduleName){
      case 'BPA':
          pdfKey = "buildingpermit";
        if (!window.location.href.includes("oc-bpa")) {
          if (data && data.businessService === "BPA_LOW") {
            pdfKey = "buildingpermit-low"
          }
        } else if (window.location.href.includes("oc-bpa")) {
          pdfKey = "occupancy-certificate"
        }
        if (window.location.href.includes("oc-bpa") || window.location.href.includes("BPA.NC_OC_SAN_FEE")) {
          pdfKey = "occupancy-certificate"
        }
      break; 
      case 'NewTL':
        pdfKey = applicationType && applicationType == "RENEWAL" ? "tlrenewalcertificate" : "tlcertificate"
        break;
      case 'MR':
       pdfKey = 'mrcertificate'  
       break;
      default:
        return pdfKey 
    }
    return pdfKey
  }

  // to fetch tenantId from the data
  const getTenantIdForPdf = (moduleName,data) => {
    switch(moduleName){
      case 'BPA':
        return data.tenantId 
      case 'NewTL':
        return data[0].tenantId 
      case 'MR':
        return data[0].tenantId   
    }
  }

  //actual function
  export const getPdfDetails = async (data,preparedFinalObject,moduleName) => {
    debugger
    let {DsInfo} = preparedFinalObject
    let {token,certificate,password} = DsInfo
    let body = getPdfBody(moduleName,preparedFinalObject)
    let key = getKey(moduleName,data) 
    let tenantId = getTenantIdForPdf(moduleName,data) || getTenantId()
    store.dispatch(showSpinner())
    try{
      let response = await axios.post(`/pdf-service/v1/_create?key=${key}&tenantId=${tenantId}`, body, {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       })
      
       if(response){
        try{
          RequestInfo = { ...RequestInfo,"userInfo" :customRequestInfo};
          let body =  Object.assign(
            {},
            {
              RequestInfo,
              "tenantId":getTenantId(),
              "responseData":null,
              "file":response.data && response.data.filestoreIds && response.data.filestoreIds[0],
              "fileName":key,
              "tokenDisplayName":token,
              "certificate" : certificate,
              "keyId":certificate,
              "moduleName":moduleName,
              "reportName":key,
              "channelId":"ch4",
              "keyStorePassPhrase": password
            } 
          );

          let encryptedData = await axios.post("/dsc-services/dsc/_pdfSignInput", body, { // send file store id to get encrypted data
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          })
          if(encryptedData){
              try{
                let body = encryptedData.data.input
                let tempFilePath = encryptedData.data.input && encryptedData.data.input.tempFilePath || ''
                let responseData = await axios.post("https://localhost.emudhra.com:26769/DSC/PKCSBulkSign", body, { // to get response Data
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                })
                if(responseData){
                try{
                  RequestInfo = { ...RequestInfo,"userInfo" :customRequestInfo};
                  let body =  Object.assign(
                    {},
                      {
                      RequestInfo,
                      "tokenDisplayName":null,
                      "keyStorePassPhrase":null,
                      "keyId":null,
                      "channelId":"ch4",
                      "file":null,
                      "moduleName":moduleName,
                      "fileName":key,
                      "tempFilePath":tempFilePath,
                      "tenantId":getTenantId(),
                        responseData:responseData.data.responseData,
                      }
                  );
                  let singedFileStoreId = await axios.post("/dsc-services/dsc/_pdfSign", body, { // to get filestoreId for pdf signing
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                  })

                  if(singedFileStoreId && singedFileStoreId.data && singedFileStoreId.data.fileStoreId && (singedFileStoreId.data.responseString && 
                  (singedFileStoreId.data.responseString.includes('success') || singedFileStoreId.data.responseString.includes('Success')))){
                    if(moduleName == 'BPA'){
                      if(data && data.additionalDetails && data.additionalDetails.signedPdfDetails){
                        data && data.additionalDetails && data.additionalDetails.signedPdfDetails.push({
                          "additionalDetails": {"uploadedBy": "Employee"},
                          "documentType": key,
                          "fileName": key,
                          "fileStore": singedFileStoreId && singedFileStoreId.data && singedFileStoreId.data.fileStoreId,
                          "fileStoreId":singedFileStoreId && singedFileStoreId.data && singedFileStoreId.data.fileStoreId
                        })
                      }else if(!data.additionalDetails){
                        data.additionalDetails = {}
                        data.additionalDetails["signedPdfDetails"] = [{
                          "additionalDetails": {"uploadedBy": "Employee"},
                          "documentType": key,
                          "fileName": key,
                          "fileStore": singedFileStoreId && singedFileStoreId.data && singedFileStoreId.data.fileStoreId,
                          "fileStoreId":singedFileStoreId && singedFileStoreId.data && singedFileStoreId.data.fileStoreId
                        }]
                      }else{
                        data.additionalDetails["signedPdfDetails"] = [{
                          "additionalDetails": {"uploadedBy": "Employee"},
                          "documentType": key,
                          "fileName": key,
                          "fileStore": singedFileStoreId && singedFileStoreId.data && singedFileStoreId.data.fileStoreId,
                          "fileStoreId":singedFileStoreId && singedFileStoreId.data && singedFileStoreId.data.fileStoreId
                        }]
                      }
                      return data
                    }else if(moduleName == 'NewTL'){
                      if(data && data.length > 0 && data[0].tradeLicenseDetail && data[0].tradeLicenseDetail.additionalDetail && data[0].tradeLicenseDetail.additionalDetail.signedPdfDetails){
                        data[0].tradeLicenseDetail.additionalDetail.signedPdfDetails.push({
                          "additionalDetails": {"uploadedBy": "Employee"},
                          "documentType": key,
                          "fileName": key,
                          "fileStore": singedFileStoreId && singedFileStoreId.data && singedFileStoreId.data.fileStoreId,
                          "fileStoreId":singedFileStoreId && singedFileStoreId.data && singedFileStoreId.data.fileStoreId
                        })
                      }else if(data && data[0] && !data[0].tradeLicenseDetail.additionalDetail){
                        data[0].tradeLicenseDetail.additionalDetail = {}
                        data[0].tradeLicenseDetail.additionalDetail["signedPdfDetails"] = [{
                          "additionalDetails": {"uploadedBy": "Employee"},
                          "documentType": key,
                          "fileName": key,
                          "fileStore": singedFileStoreId && singedFileStoreId.data && singedFileStoreId.data.fileStoreId,
                          "fileStoreId":singedFileStoreId && singedFileStoreId.data && singedFileStoreId.data.fileStoreId
                        }]
                      }else{
                        data[0].tradeLicenseDetail.additionalDetail["signedPdfDetails"] = [{
                          "additionalDetails": {"uploadedBy": "Employee"},
                          "documentType": key,
                          "fileName": key,
                          "fileStore": singedFileStoreId && singedFileStoreId.data && singedFileStoreId.data.fileStoreId,
                          "fileStoreId":singedFileStoreId && singedFileStoreId.data && singedFileStoreId.data.fileStoreId
                        }]
                      }
                      return data
                    }
                    else if(moduleName == 'MR'){
                      if(data && data.length > 0 && data[0].marriagePlace && data[0].marriagePlace.additionalDetail && data[0].marriagePlace.additionalDetail.signedPdfDetails){
                        data[0].marriagePlace.additionalDetail.signedPdfDetails.push({
                          "additionalDetails": {"uploadedBy": "Employee"},
                          "documentType": key,
                          "fileName": key,
                          "fileStore": singedFileStoreId && singedFileStoreId.data && singedFileStoreId.data.fileStoreId,
                          "fileStoreId":singedFileStoreId && singedFileStoreId.data && singedFileStoreId.data.fileStoreId
                        })
                      }else if(data && data[0] && !data[0].marriagePlace.additionalDetail){
                         data[0].marriagePlace.additionalDetail = {}
                         data[0].marriagePlace.additionalDetail["signedPdfDetails"] = [{
                          "additionalDetails": {"uploadedBy": "Employee"},
                          "documentType": key,
                          "fileName": key,
                          "fileStore": singedFileStoreId && singedFileStoreId.data && singedFileStoreId.data.fileStoreId,
                          "fileStoreId":singedFileStoreId && singedFileStoreId.data && singedFileStoreId.data.fileStoreId
                        }]
                      }else{
                        data[0].marriagePlace.additionalDetail["signedPdfDetails"] = [{
                          "additionalDetails": {"uploadedBy": "Employee"},
                          "documentType": key,
                          "fileName": key,
                          "fileStore": singedFileStoreId && singedFileStoreId.data && singedFileStoreId.data.fileStoreId,
                          "fileStoreId":singedFileStoreId && singedFileStoreId.data && singedFileStoreId.data.fileStoreId
                        }] 
                      }
                      return data
                    }else{
                      return data
                    }
                    store.dispatch(hideSpinner());
                    
                  }else{
                    store.dispatch(hideSpinner());
                    let errorCode = singedFileStoreId && singedFileStoreId.data && singedFileStoreId.data.responseString 
                    if(errorCode == 'Authentication Failure'){
                      store.dispatch(toggleSnackbarAndSetText(
                        true,
                        {
                          labelName: "Authentication Failure!",
                          labelKey: 'Authentication Failure'
                        },
                        "error"
                      ));
                    }else{
                      store.dispatch(toggleSnackbarAndSetText(
                        true,
                        {
                          labelName: "Issue during Digital Signature of the report (Error Code). Please contact system Administrator",
                          labelKey: `Issue during Digital Signature of the report (${errorCode}). Please contact system Administrator`
                        },
                        "error"
                      ));
                    }
                  }
                    }catch(error){
                      store.dispatch(hideSpinner());
                      store.dispatch(toggleSnackbar(true, error && error.message || '', "error"));
                    }
                }
                }catch(err){ 
                  store.dispatch(hideSpinner()); 
            }
          }
        }catch(err){
          store.dispatch(hideSpinner());
        }
      }
    }catch(err){
      store.dispatch(hideSpinner());
      store.dispatch(toggleSnackbar(true, err.message, "error"));
    }  
  }
  
class Footer extends React.Component {
  state = {
    open: false,
    data: {},
    employeeList: [],
    tokensArray:[],
    certicatesArray :[]
    //responseLength: 0
  };

  getDownloadData = () => {
    const { dataPath, state } = this.props;
    const data = get(
      state,
      `screenConfiguration.preparedFinalObject.${dataPath}`
    );
    const { status, applicationNumber } = (data && data[0]) || "";
    return {
      label: "Download",
      leftIcon: "cloud_download",
      rightIcon: "arrow_drop_down",
      props: { variant: "outlined", style: { marginLeft: 10 } },
      menu: getDownloadItems(status, applicationNumber, state).downloadMenu
      // menu: ["One ", "Two", "Three"]
    };
  };

  getPrintData = () => {
    const { dataPath, state } = this.props;
    const data = get(
      state,
      `screenConfiguration.preparedFinalObject.${dataPath}`
    );
    const { status, applicationNumber } = (data && data[0]) || "";
    return {
      label: "Print",
      leftIcon: "print",
      rightIcon: "arrow_drop_down",
      props: { variant: "outlined", style: { marginLeft: 10 } },
      // menu: ["One ", "Two", "Three"]
      menu: getDownloadItems(status, applicationNumber, state).printMenu
    };
  };

  getRequestInfo = () => {
    const authToken = getAccessToken();
    let RequestInfo = {
      apiId: "Rainmaker",
      ver: ".01",
      // ts: getDateInEpoch(),
      action: "_search",
      did: "1",
      key: "",
      msgId: `20170310130900|${getLocale()}`,
      requesterId: "",
      authToken
    };
    return RequestInfo
  }

  getCustomRequestInfo = () => {
    return JSON.parse(getUserInfo())
  }

  // actual API's
  getTokenList = () => {
    this.props.showSpinner();
    let requestInfo = this.getRequestInfo()
    RequestInfo = { ...requestInfo,"userInfo" : this.getCustomRequestInfo()};     
    let body =  Object.assign(
      {},
      {
        RequestInfo,
        "tenantId":getTenantId(),
        "responseData":null
      }
    );

    axios.post("/dsc-services/dsc/_getTokenInput", body, { // to get R1 R2
      'Content-Type': 'application/json',
      'Accept': 'application/json'
     })
      .then(response => { 
        let body = response.data.input
        axios.post("https://localhost.emudhra.com:26769/DSC/ListToken", body, { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
         })
          .then(response => {
            RequestInfo = { ...requestInfo,"userInfo" : this.getCustomRequestInfo()};              
            let body =  Object.assign(
               {},
                {
                 RequestInfo,
                 "tenantId":getTenantId(),
                 "responseData":response.data.responseData
                }
             );
            axios.post("/dsc-services/dsc/_getTokens", body, { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
             })
              .then(response => {
                let requiredTokenFormat = response && response.data && response.data.tokens.map (token => {
                  return {
                    label : token,
                    value : token
                  }
                }) 

                this.setState({
                  tokensArray : requiredTokenFormat,
                })
                this.props.hideSpinner();
                // this.getCertificateList({target:{value:requiredTokenFormat[0].label}}) 
              })
              .catch(error => { 
                this.props.hideSpinner();
              });
          })
          .catch(error => {
            this.props.hideSpinner();
          });
      })
      .catch(error => {
        this.props.hideSpinner();
      });
  }

  getCertificateList = (token) => {
    this.props.showSpinner();
    let requestInfo = this.getRequestInfo()
    RequestInfo = { ...requestInfo,"userInfo" : this.getCustomRequestInfo()}; 
    let body =  Object.assign(
      {},
      {
        RequestInfo,
        "tenantId":getTenantId(),
        "responseData":null,
        "tokenDisplayName":token.target.value
      }
    );

    axios.post("/dsc-services/dsc/_getInputCertificate", body, { // to get R1 R2
      'Content-Type': 'application/json',
      'Accept': 'application/json'
     })
      .then(response => {
        let body = response.data.input
        axios.post("https://localhost.emudhra.com:26769/DSC/ListCertificate", body, { // to get R1 R2
          'Content-Type': 'application/json',
          'Accept': 'application/json'
         })
          .then(response => {
            RequestInfo = { ...requestInfo,"userInfo" : this.getCustomRequestInfo()};              
            let body =  Object.assign(
               {},
                {
                 RequestInfo,
                 "tenantId":getTenantId(),
                  responseData:response.data.responseData,
                  tokenDisplayName:token.target.name
                }
             );
            axios.post("/dsc-services/dsc/_getCertificate", body, { // to get R1 R2
              'Content-Type': 'application/json',
              'Accept': 'application/json'
             })
              .then(response => {
                let requiredCertificateFormat = response && response.data && response.data.certificates && response.data.certificates.map (certificate => {
                  return {
                    label : certificate.commonName,
                    value : certificate.keyId
                  }
                }) 
                this.setState({
                  certicatesArray : requiredCertificateFormat,
                })
                this.props.hideSpinner();
              })
              .catch(error => { 
                this.props.hideSpinner();
              });
          })
          .catch(error => {
            this.props.hideSpinner();
          });
      })
      .catch(error => {
        this.props.hideSpinner();
      });
  }

  openActionDialog = async item => {
    const { handleFieldChange, setRoute, dataPath } = this.props;
    let employeeList = [];
    if(item.moduleName == "MR")item.showEmployeeList = false;
    if (item.buttonLabel === "ACTIVATE_CONNECTION") {
      if (item.moduleName === "NewWS1" || item.moduleName === "NewSW1" || item.moduleName === "SWCloseConnection" ||
      item.moduleName === "SWDisconnection" || item.moduleName === "WSCloseConnection" || item.moduleName === "WSDisconnection" ||
      item.moduleName === "WSReconnection" || item.moduleName === "SWReconnection" || item.moduleName === "SWOwnershipChange" || item.moduleName === "WSOwnershipChange"
    ) {
        item.showEmployeeList = false;
      }
    }
    if (dataPath === "BPA") {
      handleFieldChange(`${dataPath}.comment`, "");
      handleFieldChange(`${dataPath}.wfDocuments`, []);
      handleFieldChange(`${dataPath}.assignees`, "");
    } else  if (dataPath === "FireNOCs") {
      handleFieldChange(`${dataPath}[0].fireNOCDetails.additionalDetail.comment`, "");
      handleFieldChange(`${dataPath}[0].fireNOCDetails.additionalDetail.assignee`, []);
      handleFieldChange(`${dataPath}[0].fireNOCDetails.additionalDetail.wfDocuments`, []);
    } else  if (dataPath === "Property") {
      handleFieldChange(`${dataPath}.workflow.comment`, "");
      handleFieldChange(`${dataPath}.workflow.assignes`, []);
      handleFieldChange(`${dataPath}.workflow.wfDocuments`, []);
    } else {
      handleFieldChange(`${dataPath}[0].comment`, "");
      handleFieldChange(`${dataPath}[0].wfDocuments`, []);
      handleFieldChange(`${dataPath}[0].assignee`, []);
    }

    if (item.isLast) {
      let url =
        process.env.NODE_ENV === "development"
          ? item.buttonUrl
          : item.buttonUrl;

      /* Quick fix for edit mutation application */
      if (url.includes('pt-mutation/apply') && process.env.REACT_APP_NAME === "Citizen") {
        url = url + '&mode=MODIFY';
        window.location.href = url.replace("/pt-mutation/", '');
        return;
      }

      setRoute(url);
      return;
    }
    if (item.showEmployeeList) {
      const tenantId = getTenantId();
      const queryObj = [
        {
          key: "roles",
          value: item.roles
        },
        {
          key: "tenantId",
          value: tenantId
        },{
          key: "isActive",
          value: true
        }

      ];
      const payload = await httpRequest(
        "post",
        "/egov-hrms/employees/_search",
        "",
        queryObj
      );
      employeeList =
        payload &&
        payload.Employees.map((item, index) => {
          const name = get(item, "user.name");
          return {
            value: item.uuid,
            label: name
          };
        });
    }

    if((item.moduleName === "BPA_OC1" || item.moduleName === "BPA_OC2" || item.moduleName === "BPA_OC3"
    || item.moduleName === "BPA_OC4" || item.moduleName === "BPA1" || item.moduleName === "BPA2" ||
    item.moduleName === "BPA3" || item.moduleName === "BPA4" || item.moduleName == 'NewTL' || item.moduleName == "MR") && item.buttonLabel === "APPROVE"){
      this.getTokenList()
      store.dispatch(prepareFinalObject("isCertificateDetailsVisible",true))
    }
    this.setState({ open: true, data: item, employeeList });
  };

  onClose = () => {
    this.setState({
      open: false
    });
  };

  renewTradelicence = async (financialYear, tenantId) => {
    const { setRoute, state, toggleSnackbar } = this.props;
    const licences = get(
      state.screenConfiguration.preparedFinalObject,
      `Licenses`
    );
    this.props.showSpinner();
    // const nextFinancialYear = await getNextFinancialYearForRenewal(
    //   financialYear
    // );

    const validTo = get(
      state.screenConfiguration.preparedFinalObject,
      `Licenses[0].validTo`
    );

    const tlType = get(
      state.screenConfiguration.preparedFinalObject,
      `Licenses[0].licenseType`
    );

    const TlPeriod = get(
      state.screenConfiguration.preparedFinalObject,
      `Licenses[0].tradeLicenseDetail.additionalDetail.licensePeriod`
    );

    const validFrom = 1000 * 60 * 60 * 24 + validTo;
    let reNewDurationInMiliSeconds = 0;
    if(tlType && tlType === "TEMPORARY"){
       reNewDurationInMiliSeconds =  1000 * 60 * 60 * 24 * Number(TlPeriod);
       set(licences[0], "validTo", validFrom+reNewDurationInMiliSeconds);
    }else{
       //reNewDurationInMiliSeconds =  1000 * 60 * 60 * 24 * Number(TlPeriod) * 365;

       var dt = new Date(validFrom);
       let dt1 = new Date(dt.setFullYear(dt.getFullYear() + Number(TlPeriod)));


       // set(queryObject[0], "validTo", tlcommencementDate + selectedYearInMiliSeconds);
       set(licences[0], "validTo", dt1.getTime());

    }

    const wfCode = "DIRECTRENEWAL";
    set(licences[0], "action", "INITIATE");
    set(licences[0], "workflowCode", wfCode);
    set(licences[0], "applicationType", "RENEWAL");
    set(licences[0], "validFrom", validFrom);

   // set(licences[0], "financialYear", nextFinancialYear);

    try {
      const response = await httpRequest(
        "post",
        "/tl-services/v1/_update",
        "",
        [],
        {
          Licenses: licences
        }
      );
      const renewedapplicationNo = get(response, `Licenses[0].applicationNumber`);
      const licenseNumber = get(response, `Licenses[0].licenseNumber`);
      this.props.hideSpinner();
      // setRoute(
      //   `/tradelicence/acknowledgement?purpose=DIRECTRENEWAL&status=success&applicationNumber=${renewedapplicationNo}&licenseNumber=${licenseNumber}&FY=${nextFinancialYear}&tenantId=${tenantId}&action=${wfCode}`
      // );
      setRoute(
        `/tradelicence/acknowledgement?purpose=DIRECTRENEWAL&status=success&applicationNumber=${renewedapplicationNo}&licenseNumber=${licenseNumber}&tenantId=${tenantId}&action=${wfCode}`
      );
    } catch (exception) {
      this.props.hideSpinner();
      console.log(exception);
      toggleSnackbar(
        true,
        {
          labelName: "Please fill all the mandatory fields!",
          labelKey: exception && exception.message || exception
        },
        "error"
      );

    }

  };
  render() {
    const {
      contractData,
      handleFieldChange,
      onDialogButtonClick,
      dataPath,
      moduleName,
      state,
      dispatch
    } = this.props;
    const { open, data, employeeList,tokensArray,certicatesArray } = this.state;
    const { isDocRequired } = data;
    const appName = process.env.REACT_APP_NAME;
    const downloadMenu =
      contractData &&
      contractData.map(item => {
        const { buttonLabel, moduleName } = item;
        return {
          labelName: { buttonLabel },
          labelKey: `WF_${appName.toUpperCase()}_${moduleName.toUpperCase()}_${buttonLabel}`,
          link: () => {
            (moduleName === "NewTL" || moduleName === "EDITRENEWAL") && buttonLabel === "APPLY" ? onDialogButtonClick(buttonLabel, isDocRequired) :
              this.openActionDialog(item);
          }
        };
      });

    if (moduleName === "NewTL") {
      const status = get(
        state.screenConfiguration.preparedFinalObject,
        `Licenses[0].status`
      );
      const applicationType = get(
        state.screenConfiguration.preparedFinalObject,
        `Licenses[0].applicationType`
      );
      const applicationNumber = get(
        state.screenConfiguration.preparedFinalObject,
        `Licenses[0].applicationNumber`
      );
      const tenantId = get(
        state.screenConfiguration.preparedFinalObject,
        `Licenses[0].tenantId`
      );
      const financialYear = get(
        state.screenConfiguration.preparedFinalObject,
        `Licenses[0].financialYear`
      );
      const licenseNumber = get(
        state.screenConfiguration.preparedFinalObject,
        `Licenses[0].licenseNumber`
      );
      const responseLength = get(
        state.screenConfiguration.preparedFinalObject,
        `licenseCount`,
        1
      );

      const rolearray =
        getUserInfo() &&
        JSON.parse(getUserInfo()).roles.filter(item => {
          if (
            (item.code == "TL_CEMP" && item.tenantId === tenantId) ||
            item.code == "CITIZEN"
          )
            return true;
        });
      const rolecheck = rolearray.length > 0 ? true : false;
      const validTo = get(
        state.screenConfiguration.preparedFinalObject,
        `Licenses[0].validTo`
      );
      const currentDate = Date.now();
      const duration = validTo - currentDate;
      const renewalPeriod = get(
        state.screenConfiguration.preparedFinalObject,
        `renewalPeriod`
      );

      if (rolecheck && (status === "APPROVED" || status === "EXPIRED") &&
        duration <= renewalPeriod) {
        const editButton = {
          label: "Edit",
          labelKey: "WF_TL_RENEWAL_EDIT_BUTTON",
          link: () => {
            const baseURL =
              process.env.REACT_APP_NAME === "Citizen"
                ? "/tradelicense-citizen/apply"
                : "/tradelicence/apply";
            this.props.setRoute(
              `${baseURL}?applicationNumber=${applicationNumber}&licenseNumber=${licenseNumber}&tenantId=${tenantId}&action=EDITRENEWAL`
            );
          }
        };

        const submitButton = {
          label: "Submit",
          labelKey: "WF_TL_RENEWAL_SUBMIT_BUTTON",
          link: () => {
            this.renewTradelicence(financialYear, tenantId);
          }
        };
        if (responseLength > 1) {
          if (applicationType !== "NEW") {
            downloadMenu && downloadMenu.push(editButton);
           // downloadMenu && downloadMenu.push(submitButton);
          }

        }
        else if (responseLength === 1) {

          downloadMenu && downloadMenu.push(editButton);
         // downloadMenu && downloadMenu.push(submitButton);
        }




      }
    }

    if (moduleName === "MR") {
      const status = get(
        state.screenConfiguration.preparedFinalObject,
        `MarriageRegistrations[0].status`
      );
      const applicationType = get(
        state.screenConfiguration.preparedFinalObject,
        `MarriageRegistrations[0].applicationType`
      );
      const applicationNumber = get(
        state.screenConfiguration.preparedFinalObject,
        `MarriageRegistrations[0].applicationNumber`
      );
      const tenantId = get(
        state.screenConfiguration.preparedFinalObject,
        `MarriageRegistrations[0].tenantId`
      );
      // const financialYear = get(
      //   state.screenConfiguration.preparedFinalObject,
      //   `Licenses[0].financialYear`
      // );
      const licenseNumber = get(
        state.screenConfiguration.preparedFinalObject,
        `MarriageRegistrations[0].mrNumber`
      );
      const responseLength = get(
        state.screenConfiguration.preparedFinalObject,
        `licenseCount`,
        1
      );

      // const rolearray =
      //   getUserInfo() &&
      //   JSON.parse(getUserInfo()).roles.filter(item => {
      //     if (
      //       (item.code == "TL_CEMP" && item.tenantId === tenantId) ||
      //       item.code == "CITIZEN"
      //     )
      //       return true;
      //   });
      // const rolecheck = rolearray.length > 0 ? true : false;
      // const validTo = get(
      //   state.screenConfiguration.preparedFinalObject,
      //   `Licenses[0].validTo`
      // );
      // const currentDate = Date.now();
      // const duration = validTo - currentDate;
      // const renewalPeriod = get(
      //   state.screenConfiguration.preparedFinalObject,
      //   `renewalPeriod`
      // );

      if (status === "APPROVED") {
        const editButton = {
          label: "Edit",
          labelKey: "WF_MR_CORRECTION_SUBMIT_BUTTON",
          link: () => {
            const baseURL =
              process.env.REACT_APP_NAME === "Citizen"
                ? "/mr-citizen/apply"
                : "/mr/apply";
            this.props.setRoute(
              `${baseURL}?applicationNumber=${applicationNumber}&licenseNumber=${licenseNumber}&tenantId=${tenantId}&action=CORRECTION`
            );
          }
        };


        if (responseLength > 1) {
          if (applicationType !== "NEW") {
            downloadMenu && downloadMenu.push(editButton);

          }

        }
        else if (responseLength === 1) {

          downloadMenu && downloadMenu.push(editButton);

        }




      }
    }

    const buttonItems = {
      label: { labelName: "Take Action", labelKey: "WF_TAKE_ACTION" },
      rightIcon: "arrow_drop_down",
      props: {
        variant: "outlined",
        style: {
          marginRight: 15,
          backgroundColor: "#FE7A51",
          color: "#fff",
          border: "none",
          height: "60px",
          width: "200px"
        }
      },
      menu: downloadMenu
    };
    return (
      <div className="wf-wizard-footer" id="custom-atoms-footer">
        {!isEmpty(downloadMenu) && (
          <Container>
            <Item xs={12} sm={12} className="wf-footer-container">
              <MenuButton data={buttonItems} />
            </Item>
          </Container>
        )}
        <ActionDialog
          open={open}
          onClose={this.onClose}
          dialogData={data}
          tokensArray={tokensArray}
          certicatesArray={certicatesArray}
          getCertificateList={this.getCertificateList}
          dropDownData={employeeList}
          handleFieldChange={handleFieldChange}
          onButtonClick={onDialogButtonClick}
          dataPath={dataPath}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { state };
};

const mapDispatchToProps = dispatch => {
  return {
    setRoute: url => dispatch(setRoute(url)),
    toggleSnackbar: (open, message, variant) =>
      dispatch(toggleSnackbar(open, message, variant)),
    showSpinner: () =>
      dispatch(showSpinner()),
    hideSpinner: () =>
      dispatch(hideSpinner()),
    toggleSnackbarAndSetText: (open, message, variant) => {
        dispatch(toggleSnackbarAndSetText(open, message, variant));
      }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
