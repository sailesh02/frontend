import { Dialog, DialogContent } from "@material-ui/core";
import Label from "egov-ui-kit/utils/translationNode";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid, Typography, Button } from "@material-ui/core";
import { Container } from "egov-ui-framework/ui-atoms";
import store from "ui-redux/store";
import {
  addQueryArg
} from "egov-ui-framework/ui-utils/commons";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import {
  LabelContainer,
  TextFieldContainer
} from "egov-ui-framework/ui-containers";
import {
    TextfieldWithIcon
} from "egov-ui-framework/ui-molecules"
import CloseIcon from "@material-ui/icons/Close";
import "./index.css";
import { hideSpinner,showSpinner } from "egov-ui-kit/redux/common/actions";
import TextField from "material-ui/TextField";
import { getLocale, getTenantId,getAccessToken, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import axios from 'axios';
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";

const wrapEdcrRequestBody = (requestBody, action, customRequestInfo) => {
  const authToken = getAccessToken();
  const userInfo = JSON.parse(getUserInfo());
  let uuid = userInfo.uuid;
  let userInfos = {
    "id": uuid,
    "tenantId": getTenantId()
  };

  let Ids = process.env.REACT_APP_NAME === "Citizen" && action != "search" ? userInfos : null;
  let usrInfo = (action == "search") ? null: Ids;
  let RequestInfo = {
    "apiId": "1",
    "ver": "1",
    "ts": "01-01-2017 01:01:01",
    "action": "create",
    "did": "jh",
    "key": "",
    "msgId": "gfcfc",
    "correlationId": "wefiuweiuff897",
    authToken,
    "userInfo": usrInfo
  };

  RequestInfo = { ...RequestInfo, ...customRequestInfo };
  return Object.assign(
    {},
    {
      RequestInfo
    },
    requestBody
  );
};

const edcrInstance = axios.create({
  baseURL: window.location.origin,
  headers: {
    "Content-Type": "application/json"
  }
})

const edcrHttpRequest = async (
  method = "post",
  endPoint,
  action,
  queryObject = [],
  requestBody = {},
  headers = [],
  customRequestInfo = {}
) => {
  store.dispatch(showSpinner());
  let apiError = "No Record Found";

  if (headers)
    edcrInstance.defaults = Object.assign(edcrInstance.defaults, {
      headers
    });

  endPoint = addQueryArg(endPoint, queryObject);
  var response;
  try {
    response = await edcrInstance.post(
        endPoint,
        wrapEdcrRequestBody(requestBody, action, customRequestInfo)
      );
    const responseStatus = parseInt(response.status, 10);
    store.dispatch(hideSpinner());
    if (responseStatus === 200 || responseStatus === 201) {
      return response.data;
    }
  } catch (error) {
    const { data, status } = error.response;
    if (status === 400 && data === "") {
      apiError = "INVALID_TOKEN";
    } else {
      apiError =
        (data.hasOwnProperty("Errors") &&
          data.Errors &&
          data.Errors.length &&
          data.Errors[0].message) ||
        (data.hasOwnProperty("error") &&
          data.error.fields &&
          data.error.fields.length &&
          data.error.fields[0].message) ||
        (data.hasOwnProperty("error_description") && data.error_description) ||
        apiError;
    }
    store.dispatch(hideSpinner());
  }
};

let RequestInfo = {};

let customRequestInfo = JSON.parse(getUserInfo())

const getPdfBody = async(moduleName,tenantId,applicationNumber) => {
  let queryObject = [
    { key: "tenantId", value: tenantId },
    { key: "applicationNumber", value: applicationNumber }
  ];
  switch(moduleName){
    case 'BPA':
        queryObject = [
          { key: "tenantId", value: tenantId },
          { key: "applicationNo", value: applicationNumber }
        ]
        try{
          let bpaResult = await httpRequest(
            "post",
            "/bpa-services/v1/bpa/_search",
            "",
            queryObject
          );
          let edcrNumber = bpaResult && bpaResult.BPA && bpaResult.BPA.length > 0 && bpaResult.BPA[0].edcrNumber || ''

          try {
            let edcrResponse = await edcrHttpRequest(
              "post",
              "/edcr/rest/dcr/scrutinydetails?edcrNumber=" + edcrNumber + "&tenantId=" + tenantId,
              "search", []
            );
            let edcrDetails = edcrResponse.edcrDetail[0] || {}
            let applicationDigitallySigned = bpaResult && bpaResult.BPA && bpaResult.BPA.length > 0 &&
            bpaResult.BPA[0].dscDetails && bpaResult.BPA[0].dscDetails[0].documentId ? true : false
            if(!applicationDigitallySigned){
              let BPA = bpaResult.BPA[0]
              BPA.edcrDetail = [edcrDetails]
              return {
                RequestInfo : RequestInfo,
                "Bpa": [BPA]
              }
            }else{
              return null
            }
          }catch(err){
            return
          }


        }catch(err){
          return
        }

      break
    case 'NewTL':
      try {
        let tlSearchResult = await httpRequest(
          "post",
          "/tl-services/v1/_search",
          "",
          queryObject
        );
        let applicationDigitallySigned = tlSearchResult && tlSearchResult.Licenses && tlSearchResult.Licenses.length > 0 && tlSearchResult.Licenses[0].tradeLicenseDetail &&
        tlSearchResult.Licenses[0].tradeLicenseDetail.dscDetails && tlSearchResult.Licenses[0].tradeLicenseDetail.dscDetails[0].documentId ? true : false
        if(!applicationDigitallySigned){

          let pdfOwnersNames = '';
          let pdfTradeTypes = '';
          if (tlSearchResult.Licenses[0].tradeLicenseDetail.owners && tlSearchResult.Licenses[0].tradeLicenseDetail.owners.length > 0) {
            for (let i = 0; i < tlSearchResult.Licenses[0].tradeLicenseDetail.owners.length; i++) {
              pdfOwnersNames += tlSearchResult.Licenses[0].tradeLicenseDetail.owners[i].name + ", ";
            }
            pdfOwnersNames = pdfOwnersNames.substring(0, pdfOwnersNames.length - 2);
          }

          if (tlSearchResult.Licenses[0].tradeLicenseDetail.tradeUnits && tlSearchResult.Licenses[0].tradeLicenseDetail.tradeUnits.length > 0) {
            for (let i = 0; i < tlSearchResult.Licenses[0].tradeLicenseDetail.tradeUnits.length; i++) {
              let tradeTypeLocale = '';

              tradeTypeLocale = getLocaleLabels("TradeType", `TRADELICENSE_TRADETYPE_${tlSearchResult.Licenses[0].tradeLicenseDetail.tradeUnits[i].tradeType.replace(/\./g, '_')}`);
              console.log(tradeTypeLocale, "Nero Locallll")
              pdfTradeTypes += tradeTypeLocale + ", ";
            }
            pdfTradeTypes = pdfTradeTypes.substring(0, pdfTradeTypes.length - 2);
          }

          tlSearchResult.Licenses[0].additionalDetail = { ownerNames: pdfOwnersNames, tradeTypes: pdfTradeTypes };

          return {
            RequestInfo : RequestInfo,
            "Licenses":tlSearchResult && tlSearchResult.Licenses
          }
        }else{
          return null
        }

      }catch(error){
        return
      }

    case 'MR':
        try {
          let mrSearchResult = await httpRequest(
            "post",
            "/mr-services/v1/_search",
            "",
            queryObject
          );
          let mrAplicationDigitallySigned = mrSearchResult && mrSearchResult.MarriageRegistrations && mrSearchResult.MarriageRegistrations.length > 0 &&
          mrSearchResult.MarriageRegistrations[0].dscDetails && mrSearchResult.MarriageRegistrations[0].dscDetails[0].documentId ? true : false
          if(!mrAplicationDigitallySigned){
            return {
              RequestInfo : RequestInfo,
              "MarriageRegistrations":mrSearchResult && mrSearchResult.MarriageRegistrations
            }
          }else{
            return null
          }

        }catch(error){
          return
        }
       break
    default:
      return {
        ...RequestInfo
      }
  }
}

const getKey = (data,moduleName) => {
  let applicationType = moduleName && moduleName == 'NewTL' ? data && data.Licenses && data.Licenses[0].applicationType : ''
  let pdfKey = "";
  switch(moduleName){
    case 'BPA':
      let businessService = data && data.Bpa && data.Bpa.length > 0 && data.Bpa[0].businessService
      pdfKey = "buildingpermit";
      if(businessService && businessService === 'BPA_LOW'){
        pdfKey = "buildingpermit-low"
      }else if(businessService && (businessService == "BPA_OC" || businessService == "BPA_OC1" ||
      businessService == "BPA_OC2" || businessService == "BPA_OC3" || businessService == "BPA_OC4")){
        pdfKey = "occupancy-certificate"
      }else{
        pdfKey = "buildingpermit";
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
class SignPdfContainer extends Component {
  state = {
    tokensArray : '',
    ceriticatesArray : '',
    password : '',
    selectedToken : '',
    selectedCeritificate : '',
    passwordErr:false

  }

  setPassword = (e) => {
      this.setState({
        password : e.target.value,
        passwordErr:false
      })
  }

  onChangeCertificate = (e) => {
    this.setState({
      selectedCeritificate:e.target.value
    })
  }

  getRequestInfo = () => {
    const authToken = getAccessToken();
    let RequestInfo = {
      apiId: "Rainmaker",
      ver: ".01",
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

  getCertificateList_bkup = (token) => {
    this.props.showSpinner();
    let requestInfo = this.getRequestInfo()
    RequestInfo = { ...requestInfo,"userInfo" : this.getCustomRequestInfo()};
    let body =  Object.assign(
      {},
      {
        RequestInfo,
        "tenantId":getTenantId(),
        "responseData":null,
        "tokenDisplayName":token
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
            if(response && response.data && response.data.errorCode){
              this.props.toggleSnackbarAndSetText(
                true,
                {
                  labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                  labelKey: `An error occurred processing your request, ${response.data.errorCode}, ${response.data.errorMessage}`
                },
                "error"
              );
              this.props.hideSpinner();
            }else{

            RequestInfo = { ...requestInfo,"userInfo" : this.getCustomRequestInfo()};
            let body =  Object.assign(
               {},
                {
                 RequestInfo,
                 "tenantId":getTenantId(),
                  responseData:response.data.responseData,
                  tokenDisplayName:token
                }
             );
            axios.post("/dsc-services/dsc/_getCertificate", body, { // to get R1 R2
              'Content-Type': 'application/json',
              'Accept': 'application/json'
             })
              .then(response => {

                let requiredCertificateFormat = response && response.data && response.data.certificates &&
                response.data.certificates.map (certificate => {
                  return {
                    label : certificate.commonName,
                    value : certificate.keyId
                  }
                })
                this.props.hideSpinner();
                this.setState({
                  ceriticatesArray : requiredCertificateFormat,
                })
              })
              .catch(error => {
                this.props.hideSpinner();

              });
            }

          })
          .catch(error => {
            this.props.hideSpinner();

          });
      })
      .catch(error => {
        this.props.hideSpinner();
      });
  }

  getTokenList_bkup = () => {
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
        axios.post("https://localhost.emudhra.com:26769/DSC/ListToken", body, { // to get R1 R2
          'Content-Type': 'application/json',
          'Accept': 'application/json'
         })
          .then(response => {
            if(response && response.data && response.data.errorCode){
              this.props.toggleSnackbarAndSetText(
                true,
                {
                  labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                  labelKey: `An error occurred processing your request, ${response.data.errorCode}, ${response.data.errorMessage}`
                },
                "error"
              );
              this.props.hideSpinner();
            }else{
            RequestInfo = { ...requestInfo,"userInfo" : this.getCustomRequestInfo()};
            let body =  Object.assign(
               {},
                {
                 RequestInfo,
                 "tenantId":getTenantId(),
                 "responseData":response.data.responseData
                }
             );
            axios.post("/dsc-services/dsc/_getTokens", body, { // to get tokens
              'Content-Type': 'application/json',
              'Accept': 'application/json'
             })
              .then(response => {
                let requiredTokenFormat = response && response.data && response.data.tokens && response.data.tokens.map (token => {
                  return {
                    label : token,
                    value : token
                  }
                })
                this.props.hideSpinner();
                if(requiredTokenFormat && requiredTokenFormat.length > 0){
                  this.setState({
                    tokensArray : requiredTokenFormat,
                    // selectedToken : requiredTokenFormat[0].label
                  })
                }
              })
              .catch(error => {
                console.log(error)
                this.props.hideSpinner();
              });

            }
          })
          .catch(error => {
            console.log(error)

            this.props.hideSpinner();
          });
      })
      .catch(error => {
        console.log(error)

        this.props.hideSpinner();
      });
  }

  getCertificateList = (token) => {
    this.props.showSpinner();
    let requestInfo = this.getRequestInfo()
    RequestInfo = { ...requestInfo, "userInfo": this.getCustomRequestInfo() };
    let body = Object.assign(
      {},
      {
        RequestInfo,
        "tenantId": getTenantId(),
        "responseData": null,
        "tokenDisplayName": token
      }
    );

    axios.post("/dsc-services/dsc/_getInputCertificate", body, { // to get R1 R2
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
      .then(response => {
        let body = response.data.input;

        if ((response.data && response.data.input && response.data.input.emudhraErrorCode) && (response.data && response.data.input && response.data.input.dscErrorCode)) {
          store.dispatch(toggleSnackbarAndSetText(
            true,
            {
              labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
              labelKey: `An error occurred processing your request, ${response.data.input.emudhraErrorCode}`
            },
            "error"
          ));
          this.props.hideSpinner();
        } else if ((response.data && response.data.input && response.data.input.emudhraErrorCode) && (response.data && response.data.input && !response.data.input.dscErrorCode)) {
          store.dispatch(toggleSnackbarAndSetText(
            true,
            {
              labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
              labelKey: `An error occurred processing your request, ${response.data.input.emudhraErrorCode}`
            },
            "error"
          ));
          this.props.hideSpinner();
        } else if ((response.data && response.data.input && !response.data.input.emudhraErrorCode) && (response.data && response.data.input && response.data.input.dscErrorCode)) {
          store.dispatch(toggleSnackbarAndSetText(
            true,
            {
              labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
              labelKey: `An error occurred processing your request, ${response.data.input.dscErrorCode}`
            },
            "error"
          ));
          this.props.hideSpinner();
        } else {

          axios.post("https://localhost.emudhra.com:26769/DSC/ListCertificate", body, { // to get R1 R2
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          })
            .then(response => {
              if(response && response.data && response.data.errorCode){
                this.props.toggleSnackbarAndSetText(
                  true,
                  {
                    labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                    labelKey: `An error occurred processing your request, ${response.data.errorCode}, ${response.data.errorMessage}`
                  },
                  "error"
                );
                this.props.hideSpinner();
              }else{

              RequestInfo = { ...requestInfo, "userInfo": this.getCustomRequestInfo() };
              let body = Object.assign(
                {},
                {
                  RequestInfo,
                  "tenantId": getTenantId(),
                  responseData: response.data.responseData,
                  tokenDisplayName: token
                }
              );
              axios.post("/dsc-services/dsc/_getCertificate", body, { // to get R1 R2
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              })
                .then(response => {

                  if ((response.data && response.data.emudhraErrorCode) && (response.data && response.data.dscErrorCode)) {
                    store.dispatch(toggleSnackbarAndSetText(
                      true,
                      {
                        labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                        labelKey: `An error occurred processing your request, ${response.data.emudhraErrorCode}`
                      },
                      "error"
                    ));
                    this.props.hideSpinner();
                  } else if ((response.data && response.data.emudhraErrorCode) && (response.data && !response.data.dscErrorCode)) {
                    store.dispatch(toggleSnackbarAndSetText(
                      true,
                      {
                        labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                        labelKey: `An error occurred processing your request, ${response.data.emudhraErrorCode}`
                      },
                      "error"
                    ));
                    this.props.hideSpinner();

                  } else if ((response.data && !response.data.emudhraErrorCode) && (response.data && response.data.dscErrorCode)) {
                    store.dispatch(toggleSnackbarAndSetText(
                      true,
                      {
                        labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                        labelKey: `An error occurred processing your request, ${response.data.dscErrorCode}`
                      },
                      "error"
                    ));
                    this.props.hideSpinner();

                  } else {
                    let requiredCertificateFormat = response && response.data && response.data.certificates &&
                      response.data.certificates.map(certificate => {
                        return {
                          label: certificate.commonName,
                          value: certificate.keyId
                        }
                      })
                    this.props.hideSpinner();
                    this.setState({
                      ceriticatesArray: requiredCertificateFormat,
                    })

                  }

                })
                .catch(error => {
                  this.props.hideSpinner();

                });


              }
            })
            .catch(error => {
              this.props.hideSpinner();
              if (!error.response) {
                // network error

                store.dispatch(toggleSnackbarAndSetText(
                  true,
                  {
                    labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                    labelKey: "Error in detecting Token device. Please check whether hardware device connected properly"
                  },
                  "error"
                ));
              } else {
                store.dispatch(toggleSnackbarAndSetText(
                  true,
                  {
                    labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                    labelKey: "Something went wrong with the Token device. Please check whether hardware device connected properly"
                  },
                  "error"
                ));
              }

            });
        }

      })
      .catch(error => {
        this.props.hideSpinner();
      });
  }

  getTokenList = () => {
    this.props.showSpinner();
    let requestInfo = this.getRequestInfo()
    RequestInfo = { ...requestInfo, "userInfo": this.getCustomRequestInfo() };
    let body = Object.assign(
      {},
      {
        RequestInfo,
        "tenantId": getTenantId(),
        "responseData": null
      }
    );

    axios.post("/dsc-services/dsc/_getTokenInput", body, { // to get R1 R2
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
      .then(response => {
        let body = response.data.input

        if ((response.data && response.data.input && response.data.input.emudhraErrorCode) && (response.data && response.data.input && response.data.input.dscErrorCode)) {
          store.dispatch(toggleSnackbarAndSetText(
            true,
            {
              labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
              labelKey: `An error occurred processing your request, ${response.data.input.emudhraErrorCode}`
            },
            "error"
          ));
          this.props.hideSpinner();
        } else if ((response.data && response.data.input && response.data.input.emudhraErrorCode) && (response.data && response.data.input && !response.data.input.dscErrorCode)) {
          store.dispatch(toggleSnackbarAndSetText(
            true,
            {
              labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
              labelKey: `An error occurred processing your request, ${response.data.input.emudhraErrorCode}`
            },
            "error"
          ));
          this.props.hideSpinner();
        } else if ((response.data && response.data.input && !response.data.input.emudhraErrorCode) && (response.data && response.data.input && response.data.input.dscErrorCode)) {
          store.dispatch(toggleSnackbarAndSetText(
            true,
            {
              labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
              labelKey: `An error occurred processing your request, ${response.data.input.dscErrorCode}`
            },
            "error"
          ));
          this.props.hideSpinner();
        } else {
          axios.post("https://localhost.emudhra.com:26769/DSC/ListToken", body, { // to get R1 R2
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          })
            .then(response => {

              if(response && response.data && response.data.errorCode){
                this.props.toggleSnackbarAndSetText(
                  true,
                  {
                    labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                    labelKey: `An error occurred processing your request, ${response.data.errorCode}, ${response.data.errorMessage}`
                  },
                  "error"
                );
                this.props.hideSpinner();
              }else{
              RequestInfo = { ...requestInfo, "userInfo": this.getCustomRequestInfo() };
              let body = Object.assign(
                {},
                {
                  RequestInfo,
                  "tenantId": getTenantId(),
                  "responseData": response.data.responseData
                }
              );
              axios.post("/dsc-services/dsc/_getTokens", body, { // to get tokens
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              })
                .then(response => {

                  if ((response.data && response.data.emudhraErrorCode) && (response.data && response.data.dscErrorCode)) {
                    store.dispatch(toggleSnackbarAndSetText(
                      true,
                      {
                        labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                        labelKey: `An error occurred processing your request, ${response.data.emudhraErrorCode}`
                      },
                      "error"
                    ));
                    this.props.hideSpinner();
                  } else if ((response.data && response.data.emudhraErrorCode) && (response.data && !response.data.dscErrorCode)) {
                    store.dispatch(toggleSnackbarAndSetText(
                      true,
                      {
                        labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                        labelKey: `An error occurred processing your request, ${response.data.emudhraErrorCode}`
                      },
                      "error"
                    ));
                    this.props.hideSpinner();

                  } else if ((response.data && !response.data.emudhraErrorCode) && (response.data && response.data.dscErrorCode)) {
                    store.dispatch(toggleSnackbarAndSetText(
                      true,
                      {
                        labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                        labelKey: `An error occurred processing your request, ${response.data.dscErrorCode}`
                      },
                      "error"
                    ));
                    this.props.hideSpinner();

                  } else {
                    let requiredTokenFormat = response && response.data && response.data.tokens && response.data.tokens.map(token => {
                      return {
                        label: token,
                        value: token
                      }
                    })
                    this.props.hideSpinner();
                    if (requiredTokenFormat && requiredTokenFormat.length > 0) {
                      this.setState({
                        tokensArray: requiredTokenFormat,
                        // selectedToken : requiredTokenFormat[0].label
                      })
                    }
                  }

                })
                .catch(error => {
                  console.log(error)
                  this.props.hideSpinner();
                });

              }
            })
            .catch(error => {
              console.log(error)
              if (!error.response) {
                // network error

                store.dispatch(toggleSnackbarAndSetText(
                  true,
                  {
                    labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                    labelKey: "Error in detecting Token device. Please check whether hardware device connected properly"
                  },
                  "error"
                ));
              } else {
                store.dispatch(toggleSnackbarAndSetText(
                  true,
                  {
                    labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                    labelKey: "Something went wrong with the Token device. Please check whether hardware device connected properly"
                  },
                  "error"
                ));
              }
              this.props.hideSpinner();
            });
        }

      })
      .catch(error => {
        console.log(error)

        this.props.hideSpinner();
      });
  }

  onChangeToken = (e) => {
    this.setState({
      selectedToken:e.target.value
    })
    this.getCertificateList(e.target.value)
  }

  resetForm = () => {
    this.setState({
      selectedToken : '',
      selectedCeritificate:'',
      password:''
    })
  }

  getPdfDetails_bkup = async () => {
    let token = this.state.selectedToken
    let certificate = this.state.selectedCeritificate
    let password = this.state.password
    let moduleName = this.props.moduleName
    let applicationNumber = this.props.applicationNumber
    let tenantId = this.props.tenantId
    if(this.state.selectedToken && this.state.selectedToken != " " &&
    this.state.selectedCeritificate && this.state.selectedCeritificate != " " &&
    this.state.password && this.state.password != " "){
      let data = await getPdfBody(moduleName,tenantId,applicationNumber)
      if(!data){
        this.props.closePdfSigningPopup()
        this.props.toggleSnackbarAndSetText(
          true,
          {
            labelName: "COMMON_PDF_ALREADY_SIGNED",
            labelKey: 'COMMON_PDF_ALREADY_SIGNED'
          },
          "warning"
        );
        return
      }else{
        let key = getKey(data,moduleName)
        let tenantIdCityCode = tenantId && tenantId.split(".")[0]
        try{
          this.props.showSpinner()
          let response = await axios.post(`/pdf-service/v1/_create?key=${key}&tenantId=${tenantId}`, data, {
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
                    if(responseData && responseData.data && responseData.data.errorCode){
                      this.props.toggleSnackbarAndSetText(
                        true,
                        {
                          labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                          labelKey: `An error occurred processing your request, ${responseData.data.errorCode}, ${responseData.data.errorMessage}`
                        },
                        "error"
                      );
                      this.props.hideSpinner();
                    }else if(responseData){
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
                        this.props.hideSpinner()
                        if(moduleName == 'NewTL'){
                          if(data && data.Licenses && data.Licenses.length > 0 && data.Licenses[0].tradeLicenseDetail && data.Licenses[0].tradeLicenseDetail.dscDetails && data.Licenses[0].tradeLicenseDetail.dscDetails.length > 0){
                            data.Licenses[0].tradeLicenseDetail.dscDetails[0].documentType = key
                            data.Licenses[0].tradeLicenseDetail.dscDetails[0].documentId = singedFileStoreId && singedFileStoreId.data && singedFileStoreId.data.fileStoreId
                          }
                          return data.Licenses
                        }
                        else if(moduleName == 'MR'){
                          if(data && data.MarriageRegistrations && data.MarriageRegistrations.length > 0  && data.MarriageRegistrations[0].dscDetails && data.MarriageRegistrations[0].dscDetails.length > 0){
                            data.MarriageRegistrations[0].dscDetails[0].documentType = key
                            data.MarriageRegistrations[0].dscDetails[0].documentId = singedFileStoreId && singedFileStoreId.data && singedFileStoreId.data.fileStoreId
                          }
                          return data.MarriageRegistrations
                        }else if(moduleName == 'BPA'){
                          if(data && data.Bpa && data.Bpa[0].dscDetails && data.Bpa[0].dscDetails.length > 0){
                            data.Bpa[0].dscDetails[0].documentType = key
                            data.Bpa[0].dscDetails[0].documentId = singedFileStoreId && singedFileStoreId.data && singedFileStoreId.data.fileStoreId
                          }
                          delete data.Bpa[0].edcrDetail
                          return data.Bpa && data.Bpa[0]
                        }
                       else{
                          return data
                        }

                      }else{
                        this.props.hideSpinner()
                        let errorCode = singedFileStoreId && singedFileStoreId.data && singedFileStoreId.data.responseString
                        if(errorCode == 'Authentication Failure'){
                          this.props.toggleSnackbarAndSetText(
                            true,
                            {
                              labelName: "Authentication Failure!",
                              labelKey: 'Authentication Failure'
                            },
                            "error"
                          );
                        }else{
                          this.props.toggleSnackbarAndSetText(
                            true,
                            {
                              labelName: "Issue during Digital Signature of the report (Error Code). Please contact system Administrator",
                              labelKey: `Issue during Digital Signature of the report (${errorCode}). Please contact system Administrator`
                            },
                            "error"
                          );
                        }
                      }
                        }catch(error){
                          this.props.hideSpinner();
                          this.props.toggleSnackbarAndSetText(true, error && error.message || '', "error");
                        }
                    }
                    }catch(err){
                      this.props.hideSpinner();
                }
              }
            }catch(err){
              this.props.hideSpinner();
            }
          }
        }catch(err){
          this.props.hideSpinner()
          this.props.toggleSnackbarAndSetText(true, err.message, "error");
        }
      }

    }else{
        this.props.toggleSnackbarAndSetText(
          true,
          {
            labelName: "CORE_COMMON_FILL_ALL_DETAILS",
            labelKey: "CORE_COMMON_FILL_ALL_DETAILS"
          },
          "warning"
      );
      return
    }

  }

  getPdfDetails = async () => {
    let token = this.state.selectedToken
    let certificate = this.state.selectedCeritificate
    let password = this.state.password
    let moduleName = this.props.moduleName
    let applicationNumber = this.props.applicationNumber
    let tenantId = this.props.tenantId
    if (this.state.selectedToken && this.state.selectedToken != " " &&
      this.state.selectedCeritificate && this.state.selectedCeritificate != " " &&
      this.state.password && this.state.password != " ") {
      let data = await getPdfBody(moduleName, tenantId, applicationNumber)
      if (!data) {
        this.props.closePdfSigningPopup()
        this.props.toggleSnackbarAndSetText(
          true,
          {
            labelName: "COMMON_PDF_ALREADY_SIGNED",
            labelKey: 'COMMON_PDF_ALREADY_SIGNED'
          },
          "warning"
        );
        return
      } else {
        let key = getKey(data, moduleName)
        let tenantIdCityCode = tenantId && tenantId.split(".")[0]
        try {
          this.props.showSpinner()
          let response = await axios.post(`/pdf-service/v1/_create?key=${key}&tenantId=${tenantId}`, data, {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          })

          if (response) {
            try {
              RequestInfo = { ...RequestInfo, "userInfo": customRequestInfo };
              let body = Object.assign(
                {},
                {
                  RequestInfo,
                  "tenantId": getTenantId(),
                  "responseData": null,
                  "file": response.data && response.data.filestoreIds && response.data.filestoreIds[0],
                  "fileName": key,
                  "tokenDisplayName": token,
                  "certificate": certificate,
                  "keyId": certificate,
                  "moduleName": moduleName,
                  "reportName": key,
                  "channelId": "ch4",
                  "keyStorePassPhrase": password
                }
              );

              let encryptedData = await axios.post("/dsc-services/dsc/_pdfSignInput", body, { // send file store id to get encrypted data
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              })
              if (encryptedData) {
                try {
                  let body = encryptedData.data.input

                  if ((encryptedData.data && encryptedData.data.input && encryptedData.data.input.emudhraErrorCode) && (encryptedData.data && encryptedData.data.input && encryptedData.data.input.dscErrorCode)) {
                    this.props.toggleSnackbarAndSetText(
                      true,
                      {
                        labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                        labelKey: `An error occurred processing your request, ${encryptedData.data.input.emudhraErrorCode}`
                      },
                      "error"
                    );
                    this.props.hideSpinner();
                  } else if ((encryptedData.data && encryptedData.data.input && encryptedData.data.input.emudhraErrorCode) && (encryptedData.data && encryptedData.data.input && !encryptedData.data.input.dscErrorCode)) {
                    this.props.toggleSnackbarAndSetText(
                      true,
                      {
                        labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                        labelKey: `An error occurred processing your request, ${encryptedData.data.input.emudhraErrorCode}`
                      },
                      "error"
                    );
                    this.props.hideSpinner();
                  } else if ((encryptedData.data && encryptedData.data.input && !encryptedData.data.input.emudhraErrorCode) && (encryptedData.data && encryptedData.data.input && encryptedData.data.input.dscErrorCode)) {
                    this.props.toggleSnackbarAndSetText(
                      true,
                      {
                        labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                        labelKey: `An error occurred processing your request, ${encryptedData.data.input.dscErrorCode}`
                      },
                      "error"
                    );
                    this.props.hideSpinner();

                } else{
                  let tempFilePath = encryptedData.data.input && encryptedData.data.input.tempFilePath || ''
                  let responseData = await axios.post("https://localhost.emudhra.com:26769/DSC/PKCSBulkSign", body, { // to get response Data
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                  })
                  if(responseData && responseData.data && responseData.data.errorCode){
                    this.props.toggleSnackbarAndSetText(
                      true,
                      {
                        labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                        labelKey: `An error occurred processing your request, ${responseData.data.errorCode}, ${responseData.data.errorMessage}`
                      },
                      "error"
                    );
                    this.props.hideSpinner();
                  }else if (responseData) {
                    try {
                      RequestInfo = { ...RequestInfo, "userInfo": customRequestInfo };
                      let body = Object.assign(
                        {},
                        {
                          RequestInfo,
                          "tokenDisplayName": null,
                          "keyStorePassPhrase": null,
                          "keyId": null,
                          "channelId": "ch4",
                          "file": null,
                          "moduleName": moduleName,
                          "fileName": key,
                          "tempFilePath": tempFilePath,
                          "tenantId": getTenantId(),
                          responseData: responseData.data.responseData,
                        }
                      );
                      let singedFileStoreId = await axios.post("/dsc-services/dsc/_pdfSign", body, { // to get filestoreId for pdf signing
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                      })
                      if ((singedFileStoreId.data && singedFileStoreId.data.emudhraErrorCode) && (singedFileStoreId.data && singedFileStoreId.data.dscErrorCode)) {
                        this.props.toggleSnackbarAndSetText(
                          true,
                          {
                            labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                            labelKey: `An error occurred processing your request, ${singedFileStoreId.data.emudhraErrorCode}`
                          },
                          "error"
                        );
                        this.props.hideSpinner();
                      } else if ((singedFileStoreId.data && singedFileStoreId.data.emudhraErrorCode) && (singedFileStoreId.data && !singedFileStoreId.data.dscErrorCode)) {
                        this.props.toggleSnackbarAndSetText(
                          true,
                          {
                            labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                            labelKey: `An error occurred processing your request, ${singedFileStoreId.data.emudhraErrorCode}`
                          },
                          "error"
                        );
                        this.props.hideSpinner();

                      } else if ((singedFileStoreId.data && !singedFileStoreId.data.emudhraErrorCode) && (singedFileStoreId.data && singedFileStoreId.data.dscErrorCode)) {
                        this.props.toggleSnackbarAndSetText(
                          true,
                          {
                            labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                            labelKey: `An error occurred processing your request, ${singedFileStoreId.data.dscErrorCode}`
                          },
                          "error"
                        );
                        this.props.hideSpinner();



                      } else if(singedFileStoreId && singedFileStoreId.data && singedFileStoreId.data.fileStoreId && (singedFileStoreId.data.responseString &&
                          (singedFileStoreId.data.responseString.includes('success') || singedFileStoreId.data.responseString.includes('Success')))) {
                          this.props.hideSpinner()
                          if (moduleName == 'NewTL') {
                            if (data && data.Licenses && data.Licenses.length > 0 && data.Licenses[0].tradeLicenseDetail && data.Licenses[0].tradeLicenseDetail.dscDetails && data.Licenses[0].tradeLicenseDetail.dscDetails.length > 0) {
                              data.Licenses[0].tradeLicenseDetail.dscDetails[0].documentType = key
                              data.Licenses[0].tradeLicenseDetail.dscDetails[0].documentId = singedFileStoreId && singedFileStoreId.data && singedFileStoreId.data.fileStoreId
                            }
                            return data.Licenses
                          }
                          else if (moduleName == 'MR') {
                            if (data && data.MarriageRegistrations && data.MarriageRegistrations.length > 0 && data.MarriageRegistrations[0].dscDetails && data.MarriageRegistrations[0].dscDetails.length > 0) {
                              data.MarriageRegistrations[0].dscDetails[0].documentType = key
                              data.MarriageRegistrations[0].dscDetails[0].documentId = singedFileStoreId && singedFileStoreId.data && singedFileStoreId.data.fileStoreId
                            }
                            return data.MarriageRegistrations
                          } else if (moduleName == 'BPA') {
                            if (data && data.Bpa && data.Bpa[0].dscDetails && data.Bpa[0].dscDetails.length > 0) {
                              data.Bpa[0].dscDetails[0].documentType = key
                              data.Bpa[0].dscDetails[0].documentId = singedFileStoreId && singedFileStoreId.data && singedFileStoreId.data.fileStoreId
                            }
                            delete data.Bpa[0].edcrDetail
                            return data.Bpa && data.Bpa[0]
                          }
                          else {
                            return data
                          }

                        }

                        // else {
                        //   this.props.hideSpinner()
                        //   let errorCode = singedFileStoreId && singedFileStoreId.data && singedFileStoreId.data.responseString
                        //   if (errorCode == 'Authentication Failure') {
                        //     this.props.toggleSnackbarAndSetText(
                        //       true,
                        //       {
                        //         labelName: "Authentication Failure!",
                        //         labelKey: 'Authentication Failure'
                        //       },
                        //       "error"
                        //     );
                        //   } else {
                        //     this.props.toggleSnackbarAndSetText(
                        //       true,
                        //       {
                        //         labelName: "Issue during Digital Signature of the report (Error Code). Please contact system Administrator",
                        //         labelKey: `Issue during Digital Signature of the report (${errorCode}). Please contact system Administrator`
                        //       },
                        //       "error"
                        //     );
                        //   }
                        // }
                      } catch (error) {
                        this.props.hideSpinner();
                        if (!error.response) {
                          // network error

                          this.props.toggleSnackbarAndSetText(
                            true,
                            {
                              labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                              labelKey: "Error in detecting Token device. Please check whether hardware device connected properly"
                            },
                            "error"
                          );
                        } else {
                          this.props.toggleSnackbarAndSetText(
                            true,
                            {
                              labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                              labelKey: "Something went wrong with the Token device. Please check whether hardware device connected properly"
                            },
                            "error"
                          );
                        }
                        this.props.toggleSnackbarAndSetText(true, error && error.message || '', "error");
                      }
                    }

                  }

                } catch (err) {
                    this.props.hideSpinner();
                  }
                }
            } catch (err) {
                this.props.hideSpinner();
              }
            }
        } catch (err) {
            this.props.hideSpinner()
            this.props.toggleSnackbarAndSetText(true, err.message, "error");
          }
        }

    } else {
        this.props.toggleSnackbarAndSetText(
          true,
          {
            labelName: "CORE_COMMON_FILL_ALL_DETAILS",
            labelKey: "CORE_COMMON_FILL_ALL_DETAILS"
          },
          "warning"
        );
        return
      }

    }

  // sign the PDF
  saveDetails = async() => {
    let data = await this.getPdfDetails()
    let dataPath = this.props.dataPath
    let updateUrl = this.props.updateUrl

    if(!data){
      return
    }else{
    try{
      this.props.showSpinner()
      await httpRequest("post", this.props.updateUrl, "", [], {
        [dataPath]: data
      });
      this.props.hideSpinner()
      this.props.toggleSnackbarAndSetText(
        true,
        {
          labelName: "COMMON_PDF_SIGNED_SUCCESSFULLY",
          labelKey: "COMMON_PDF_SIGNED_SUCCESSFULLY"
        },
        "success"
      );
      this.props.closePdfSigningPopup(this.props.refreshType)
    }catch(error){
      this.props.toggleSnackbarAndSetText(
        true,
        {
          labelName: error && error.message || '',
           //labelKey: error && error.message || ''
           labelKey: "An error occurred processing your request, error in update call post pdf sign"
        },
        "error"
      );
      this.props.closePdfSigningPopup()
      this.props.hideSpinner()
      }
    }

  }

  componentDidMount = () => {
      if(process.env.REACT_APP_NAME != 'Citizen'){
        this.getTokenList()
      }
  }

  render() {
    let { closePdfSigningPopup,openPdfSigningPopup,okText,resetText,title} = this.props;

    return (
      <Dialog
      fullScreen={false}
      open={openPdfSigningPopup}
      onClose={closePdfSigningPopup}
      maxWidth={false}
    >
      <DialogContent
        children={
          <Container
            children={
              <Grid
                container="true"
                spacing={12}
                marginTop={16}
                className="action-container">
                <Grid
                  style={{
                    alignItems: "center",
                    display: "flex"
                  }}
                  item
                  sm={10}>
                  <Typography component="h2" variant="subheading">
                    <LabelContainer labelName={"Digitally Sign Application"}
                    labelKey={"Digitally Sign Application"} />
                  </Typography>
                </Grid>
                <Grid
                  item
                  sm={2}
                  style={{
                    textAlign: "right",
                    cursor: "pointer",
                    position: "absolute",
                    right: "16px",
                    top: "16px"
                  }}
                  onClick={closePdfSigningPopup}
                >
                  <CloseIcon />
                </Grid>
                  <Grid
                    item
                    sm={12}
                    style={{
                      marginTop: 12
                    }}>
                      <TextFieldContainer
                        required={true}
                        select={true}
                        style={{ marginRight: "15px" }}
                        onChange={this.onChangeToken}
                        label={{
                            labelName: "Token",
                            labelKey: "CORE_COMMON_TOKEN_LABEL"
                          }}
                        placeholder={{
                            labelName: "Select Token",
                            labelKey: "CORE_COMMON_TOKEN_PLACEHOLDER"
                          }}
                        data={this.state.tokensArray}
                        optionValue="value"
                        optionLabel="label"
                        hasLocalization={false}
                        value = {this.state.selectedToken}
                      />
                  </Grid>
                  <Grid
                    item
                    sm={12}
                    style={{
                      marginTop: 12
                    }}>
                      <TextFieldContainer
                        required={true}
                        select={true}
                        onChange={this.onChangeCertificate}
                        style={{ marginRight: "15px" }}
                        label={{
                            labelName: "Certificate",
                            labelKey: "CORE_COMMON_CERTIFICATE_LABEL"
                          }}
                        placeholder={{
                            labelName: "Select Certificate",
                            labelKey: "CORE_COMMON_CERTIFICATE_PLACEHOLDER"
                          }}
                        data={this.state.ceriticatesArray}
                        optionValue="value"
                        optionLabel="label"
                        hasLocalization={false}
                        value = {this.state.selectedCeritificate}
                      />
                  </Grid>
                  <Grid item
                    sm={12}
                    style={{
                      marginTop: 12
                    }}>
                  <LabelContainer style={{
                      fontSize: '11px',
                      fontWeight: 500
                  }}
                  labelName={"CORE_COMMON_PASSWORD_LABEL"}
                    labelKey={"CORE_COMMON_PASSWORD_LABEL"} /><span>&thinsp;*</span>
                  </Grid>
                  <form style={{width:"100%"}} autocomplete="off">
                  <Grid
                    item
                    sm={12}
                    style={{
                      marginTop: 12
                    }}>
                    <TextfieldWithIcon
                        required={true}
                        type ="password"
                        style={{ marginRight: "15px" }}
                        onChange ={ this.setPassword}
                        hasLocalization={false}
                        value = {this.state.password}
                      />
                  </Grid>
                  {this.state.passwordErr && <Grid item sm={12}>
                    <span className="colorRed">Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character</span>
                  </Grid>}
                  </form>
                <Grid item sm={12}
                 style={{
                  marginTop: 8,
                  textAlign: "right"
                }}>
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    onClick={this.resetForm}
                    style={{
                      marginRight:'4px'
                    }}
                    >
                    <LabelContainer
                      labelName={resetText}
                      labelKey=
                      {resetText}
                    />
                    </Button>
                    <Button
                      variant={"contained"}
                      color={"primary"}
                      onClick={this.saveDetails}
                    >
                      <LabelContainer
                        labelName={okText}
                        labelKey=
                          {okText}
                      />
                    </Button>
                </Grid>
              </Grid>
            }

          />
        }
      />
    </Dialog>
    )
  }
}

const mapStateToProps = (state) => {
  const { form } = state;
  return { form };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showSpinner: () => dispatch(showSpinner()),
    hideSpinner : () => dispatch(hideSpinner()),
    toggleSnackbarAndSetText: (open, message, variant) => {
      dispatch(toggleSnackbarAndSetText(open, message, variant));
    }  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignPdfContainer);
