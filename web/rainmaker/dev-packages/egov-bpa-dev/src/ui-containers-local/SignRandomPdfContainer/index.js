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
import { getLocaleLabels, getQueryArg } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";

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

class SignRandomPdfContainer extends Component {
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
              labelKey: `An error occurred processing your request. If this problem persists, please contact eMudhra Support, Error Detail - ${response.data.input.emudhraErrorCode}`
            },
            "error"
          ));
          this.props.hideSpinner();
        } else if ((response.data && response.data.input && response.data.input.emudhraErrorCode) && (response.data && response.data.input && !response.data.input.dscErrorCode)) {
          store.dispatch(toggleSnackbarAndSetText(
            true,
            {
              labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
              labelKey: `An error occurred processing your request. If this problem persists, please contact eMudhra Support, Error Detail - ${response.data.input.emudhraErrorCode}`
            },
            "error"
          ));
          this.props.hideSpinner();
        } else if ((response.data && response.data.input && !response.data.input.emudhraErrorCode) && (response.data && response.data.input && response.data.input.dscErrorCode)) {
          store.dispatch(toggleSnackbarAndSetText(
            true,
            {
              labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
              labelKey: `An error occurred processing your request. If this problem persists, please contact Sujog Support, Error Detail - ${response.data.input.dscErrorCode}`
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
                    labelKey: `An error occurred processing your request. If this problem persists, please contact eMudhra Support, Error Detail - ${response.data.errorCode}, ${response.data.errorMessage}`
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
                        labelKey: `An error occurred processing your request. If this problem persists, please contact eMudhra Support, Error Detail - ${response.data.emudhraErrorCode}`
                      },
                      "error"
                    ));
                    this.props.hideSpinner();
                  } else if ((response.data && response.data.emudhraErrorCode) && (response.data && !response.data.dscErrorCode)) {
                    store.dispatch(toggleSnackbarAndSetText(
                      true,
                      {
                        labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                        labelKey: `An error occurred processing your request. If this problem persists, please contact eMudhra Support, Error Detail - ${response.data.emudhraErrorCode}`
                      },
                      "error"
                    ));
                    this.props.hideSpinner();

                  } else if ((response.data && !response.data.emudhraErrorCode) && (response.data && response.data.dscErrorCode)) {
                    store.dispatch(toggleSnackbarAndSetText(
                      true,
                      {
                        labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                        labelKey: `An error occurred processing your request. If this problem persists, please contact Sujog Support, Error Detail - ${response.data.dscErrorCode}`
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
              labelKey: `An error occurred processing your request. If this problem persists, please contact eMudhra Support, Error Detail - ${response.data.input.emudhraErrorCode}`
            },
            "error"
          ));
          this.props.hideSpinner();
        } else if ((response.data && response.data.input && response.data.input.emudhraErrorCode) && (response.data && response.data.input && !response.data.input.dscErrorCode)) {
          store.dispatch(toggleSnackbarAndSetText(
            true,
            {
              labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
              labelKey: `An error occurred processing your request. If this problem persists, please contact eMudhra Support, Error Detail - ${response.data.input.emudhraErrorCode}`
            },
            "error"
          ));
          this.props.hideSpinner();
        } else if ((response.data && response.data.input && !response.data.input.emudhraErrorCode) && (response.data && response.data.input && response.data.input.dscErrorCode)) {
          store.dispatch(toggleSnackbarAndSetText(
            true,
            {
              labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
              labelKey: `An error occurred processing your request. If this problem persists, please contact Sujog Support, Error Detail - ${response.data.input.dscErrorCode}`
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
                    labelKey: `An error occurred processing your request. If this problem persists, please contact eMudhra Support, Error Detail - ${response.data.errorCode}, ${response.data.errorMessage}`
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
                        labelKey: `An error occurred processing your request. If this problem persists, please contact eMudhra Support, Error Detail - ${response.data.emudhraErrorCode}`
                      },
                      "error"
                    ));
                    this.props.hideSpinner();
                  } else if ((response.data && response.data.emudhraErrorCode) && (response.data && !response.data.dscErrorCode)) {
                    store.dispatch(toggleSnackbarAndSetText(
                      true,
                      {
                        labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                        labelKey: `An error occurred processing your request. If this problem persists, please contact eMudhra Support, Error Detail - ${response.data.emudhraErrorCode}`
                      },
                      "error"
                    ));
                    this.props.hideSpinner();

                  } else if ((response.data && !response.data.emudhraErrorCode) && (response.data && response.data.dscErrorCode)) {
                    store.dispatch(toggleSnackbarAndSetText(
                      true,
                      {
                        labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                        labelKey: `An error occurred processing your request. If this problem persists, please contact Sujog Support, Error Detail - ${response.data.dscErrorCode}`
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
              // if (!error.response) {
              //   // network error

              //   store.dispatch(toggleSnackbarAndSetText(
              //     true,
              //     {
              //       labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
              //       labelKey: "Error in detecting Token device. Please check whether hardware device connected properly"
              //     },
              //     "error"
              //   ));
              // } else {
              //   store.dispatch(toggleSnackbarAndSetText(
              //     true,
              //     {
              //       labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
              //       labelKey: "Something went wrong with the Token device. Please check whether hardware device connected properly"
              //     },
              //     "error"
              //   ));
              // }
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

  getPdfDetails = async () => {
    console.log("Nero I am here")
    let token = this.state.selectedToken
    let certificate = this.state.selectedCeritificate
    let password = this.state.password
    let moduleName = this.props.moduleName
    let applicationNumber = this.props.applicationNumber
    let tenantId = this.props.tenantId
    if (this.state.selectedToken && this.state.selectedToken != " " &&
      this.state.selectedCeritificate && this.state.selectedCeritificate != " " &&
      this.state.password && this.state.password != " ") {
     // let data = await getPdfBody(moduleName, tenantId, applicationNumber)
      
        //Todo
        // 1. Get File store id from State and send to DSC service
        
        //try {
          this.props.showSpinner()
          



         // if (response) {
            try {
              let state = store.getState();
              console.log(state, "Nero State for PDF")
              let fileStoreId = get(
                state,
                "screenConfiguration.preparedFinalObject.generatedScnPdfFileStoreId",
                {}
              );
              RequestInfo = { ...RequestInfo, "userInfo": customRequestInfo };
              let body;
              let key = "bpa-show-cause-notice"
              if(getQueryArg(
                window.location.href,
                "PURPOSE", ""
              ) === "GENREVOKE"){
                key = "bpa-revocation-notice";
              }
             // let fileStoreId = "cbd810a7-55ce-4083-a409-f27b9fb49817";
              


                body = Object.assign(
                  {},
                  {
                    RequestInfo,
                    "tenantId": getTenantId(),
                    "responseData": null,
                    "file": fileStoreId,
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
              
               console.log(body, "Nero Body Final PDF")

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
                        labelKey: `An error occurred processing your request. If this problem persists, please contact eMudhra Support, Error Detail - ${encryptedData.data.input.emudhraErrorCode}`
                      },
                      "error"
                    );
                    this.props.hideSpinner();
                  } else if ((encryptedData.data && encryptedData.data.input && encryptedData.data.input.emudhraErrorCode) && (encryptedData.data && encryptedData.data.input && !encryptedData.data.input.dscErrorCode)) {
                    this.props.toggleSnackbarAndSetText(
                      true,
                      {
                        labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                        labelKey: `An error occurred processing your request. If this problem persists, please contact eMudhra Support, Error Detail - ${encryptedData.data.input.emudhraErrorCode}`
                      },
                      "error"
                    );
                    this.props.hideSpinner();
                  } else if ((encryptedData.data && encryptedData.data.input && !encryptedData.data.input.emudhraErrorCode) && (encryptedData.data && encryptedData.data.input && encryptedData.data.input.dscErrorCode)) {
                    this.props.toggleSnackbarAndSetText(
                      true,
                      {
                        labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                        labelKey: `An error occurred processing your request. If this problem persists, please contact Sujog Support, Error Detail - ${encryptedData.data.input.dscErrorCode}`
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
                        labelKey: `An error occurred processing your request. If this problem persists, please contact eMudhra Support, Error Detail - ${responseData.data.errorCode}, ${responseData.data.errorMessage}`
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
                      console.log(singedFileStoreId, "Nero AFter api call res")
                      if ((singedFileStoreId.data && singedFileStoreId.data.emudhraErrorCode) && (singedFileStoreId.data && singedFileStoreId.data.dscErrorCode)) {
                        this.props.toggleSnackbarAndSetText(
                          true,
                          {
                            labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                            labelKey: `An error occurred processing your request. If this problem persists, please contact eMudhra Support, Error Detail - ${singedFileStoreId.data.emudhraErrorCode}`
                          },
                          "error"
                        );
                        this.props.hideSpinner();
                      } else if ((singedFileStoreId.data && singedFileStoreId.data.emudhraErrorCode) && (singedFileStoreId.data && !singedFileStoreId.data.dscErrorCode)) {
                        this.props.toggleSnackbarAndSetText(
                          true,
                          {
                            labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                            labelKey: `An error occurred processing your request. If this problem persists, please contact eMudhra Support, Error Detail - ${singedFileStoreId.data.emudhraErrorCode}`
                          },
                          "error"
                        );
                        this.props.hideSpinner();

                      } else if ((singedFileStoreId.data && !singedFileStoreId.data.emudhraErrorCode) && (singedFileStoreId.data && singedFileStoreId.data.dscErrorCode)) {
                        this.props.toggleSnackbarAndSetText(
                          true,
                          {
                            labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                            labelKey: `An error occurred processing your request. If this problem persists, please contact Sujog Support, Error Detail - ${singedFileStoreId.data.dscErrorCode}`
                          },
                          "error"
                        );
                        this.props.hideSpinner();



                      } else if(singedFileStoreId && singedFileStoreId.data && singedFileStoreId.data.fileStoreId && (singedFileStoreId.data.responseString &&
                          (singedFileStoreId.data.responseString.includes('success') || singedFileStoreId.data.responseString.includes('Success')))) {
                          this.props.hideSpinner()
                          console.log(singedFileStoreId, "Nero Signed")
                            // if (data && data.Licenses && data.Licenses.length > 0 && data.Licenses[0].tradeLicenseDetail && data.Licenses[0].tradeLicenseDetail.dscDetails && data.Licenses[0].tradeLicenseDetail.dscDetails.length > 0) {
                            //   data.Licenses[0].tradeLicenseDetail.dscDetails[0].documentType = key
                            //   data.Licenses[0].tradeLicenseDetail.dscDetails[0].documentId = singedFileStoreId && singedFileStoreId.data && singedFileStoreId.data.fileStoreId
                            return singedFileStoreId && singedFileStoreId.data && singedFileStoreId.data.fileStoreId;

                        }

                      } catch (error) {
                        console.log("Nero Error")
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
                  console.log(err, "Nero In Catch 3")
                    this.props.hideSpinner();
                  }
                }
            } catch (err) {
              console.log(err, "Nero In Catch 2")
                this.props.hideSpinner();
              }
            
        // } catch (err) {
        //   console.log("Nero In first Catch");
        //     this.props.hideSpinner()
        //     this.props.toggleSnackbarAndSetText(true, err.message, "error");
        //   }
        

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
    let reduxState = store.getState();
    let bpaObject = get(
      reduxState,
      "screenConfiguration.preparedFinalObject.BPAForSCN",
      {}
    );
    let bpaAppNo = bpaObject && bpaObject.applicationNo;
    let letterNo = bpaObject && bpaObject.scnLetterNo;
    let singedFileStoreId = await this.getPdfDetails();
   // let singedFileStoreId = "3935c89d-026b-4a8c-aeda-6b3383094f51"
   
    console.log(singedFileStoreId, "Nero Signed in Calling")
    let tenantId = getQueryArg(
      window.location.href,
      "tenantId", ""
    );

    let letterType = "SCN";
    let action = "SHOW_CAUSE";
    let urlString = "purpose=show_cause_issued&status=success";
    
    if(getQueryArg(
      window.location.href,
      "PURPOSE", ""
    ) === "GENREVOKE"){
      letterType = "RVK";
      action = "REVOKE";
      urlString = "purpose=permit_revoked&status=success";
    }

let randomTime = new Date();


    if(!singedFileStoreId){
      return
    }else{
    try{
      let noticeData = {
        "businessid":bpaAppNo,
        "LetterNo":letterNo,
        "filestoreid": singedFileStoreId,
        "letterType":letterType,
        "tenantid" :tenantId,
      }
      this.props.showSpinner()
      await httpRequest("post", "/bpa-services/v1/notice/_create", "_create", [], {
        Notice: noticeData
      }).then(async(res)=> {
        let payload = bpaObject;
        console.log(payload, "nero Payload")
        payload.workflow = {action: action};
        let varificationDocs = [
          {
            fileName: `${action}_${randomTime.getTime()}.pdf`,
            fileStoreId: singedFileStoreId,
            fileStore: singedFileStoreId,
            documentType: `Document - 1`
          }
        ];

        payload.workflow.varificationDocuments = varificationDocs;
        payload.riskType = "LOW";
        let response = await httpRequest(
          "post",
          "bpa-services/v1/bpa/_update",
          "",
          [],
          { BPA: payload}
        );

      })
      this.props.closePdfSigningPopup()
      this.props.hideSpinner()
      store.dispatch(setRoute(`acknowledgement?${urlString}&applicationNumber=${bpaAppNo}&tenantId=${tenantId}`));
     
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
    // this.props.closePdfSigningPopup();
    // this.props.hideSpinner();

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
    setRoute: route => dispatch(setRoute(route)),
    toggleSnackbarAndSetText: (open, message, variant) => {
      dispatch(toggleSnackbarAndSetText(open, message, variant));
    }  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignRandomPdfContainer);
