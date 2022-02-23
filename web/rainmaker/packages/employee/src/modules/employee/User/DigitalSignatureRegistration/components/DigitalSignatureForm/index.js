import React from "react";
import { Card, ToolTipUi, Icon } from "components";
import Button from '@material-ui/core/Button';
import Field from "egov-ui-kit/utils/field";
import "./index.css";
import { toggleSnackbarAndSetText, setRoute } from "egov-ui-kit/redux/app/actions";
import { hideSpinner,showSpinner } from "egov-ui-kit/redux/common/actions";
import { getLocale, getTenantId,getAccessToken, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import axios from 'axios';
import store from "ui-redux/store";

let RequestInfo = {};

const getSuccessMsg = (responseString) => {
  let responseCode = responseString && responseString.split('^') && responseString.split('^')[0] || ''
  switch(responseCode){
    case 'success':
      store.dispatch(setRoute("/hrms/acknowledgement?purpose=digitalSignatureRegistration&status=success"))
      return {
        labelKey:'DIGITAL_SIGNATURE_REGISTRATION_SUCCESS_MSG',
        labelName:'Digital Signature registration successfully completed.',
        type: "success"
      }
    case 'exception':
      return {
        labelKey:'DIGITAL_SIGNATURE_REGISTRATION_EXCEPTION_MSG',
        labelName:'Issue in Digital Signature registration, please contact System Administrator.',
        type: "warning"
      }
    case 'e7002' :
      return {
        labelKey:'DIGITAL_SIGNATURE_REGISTRATION_CODE_E7002_MSG',
        labelName:'Digital Signature for the user is already registered.',
        type: "warning"
      }
    case 'e7003':
      return {
        labelKey:'DIGITAL_SIGNATURE_REGISTRATION_CODE_E7003_MSG',
        labelName:'Selected Digital Signature Certificate is already registered with another user.',
        type: "warning"
      }
    case 'e7004':
      return {
        labelKey:'DIGITAL_SIGNATURE_REGISTRATION_CODE_E7004_MSG',
        labelName:'Issue in Digital Signature registration (e7004), please contact System Administrator.',
        type: "error"
      }
    case 'e70011':
      return {
        labelKey:'DIGITAL_SIGNATURE_REGISTRATION_CODE_E70011_MSG',
        labelName:'Issue in Digital Signature registration (e70011), please contact System Administrator.',
        type: "error"
      }
    case 'e70012':
      return {
        labelKey:'DIGITAL_SIGNATURE_REGISTRATION_CODE_E70012_MSG',
        labelName:'Issue in Digital Signature registration (e70012), please contact System Administrator.',
        type: "error"
      }
    case 'e7007':
      return {
        labelKey:'DIGITAL_SIGNATURE_REGISTRATION_CODE_E7007_MSG',
        labelName:'Digital Signature registration failed as selected Certificate is expired.',
        type: "warning"
      }
    case 'e7008':
      return {
        labelKey:'DIGITAL_SIGNATURE_REGISTRATION_CODE_E7008_MSG',
        labelName:'Issue in Digital Signature registration (e7008), please contact System Administrator.',
        type: "error"
      }
    case 'e70010':
      return {
        labelKey:'DIGITAL_SIGNATURE_REGISTRATION_CODE_E70010_MSG',
        labelName:'Issue in Digital Signature registration (e70010), please contact System Administrator.',
        type: "error"
      }
    case 'e7009':
      return {
        labelKey:'DIGITAL_SIGNATURE_REGISTRATION_CODE_E7009_MSG',
        labelName:'Issue in Digital Signature registration (e7009), please contact System Administrator.',
        type: "error"
      }
    case 'e7001':
      return {
        labelKey:'DIGITAL_SIGNATURE_REGISTRATION_CODE_E7001_MSG',
        labelName:'Issue in Digital Signature registration (e7001), please contact System Administrator.',
        type: "error"
      }
    case 'e7025':
      return {
        labelKey:'DIGITAL_SIGNATURE_REGISTRATION_CODE_E7025_MSG',
        labelName:'Issue in Digital Signature registration (e7025), please contact System Administrator.',
        type: "error"
      }
    default :
      return {
        labelKey:'ERR_DIGITAL_SIGNATURE_FAILURE_MSG',
        labelName:'ERR_DIGITAL_SIGNATURE_FAILURE_MSG',
        type: "error"
      }

  }

}

const getRequestInfo = () => {
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

const getCustomRequestInfo = () => {
  return JSON.parse(getUserInfo())
}

const register = (token, certificate, password) => {
  if (token && token != " " &&
    certificate && certificate != " " &&
    password && password != " ") {
    store.dispatch(showSpinner());
    let requestInfo = getRequestInfo()
    RequestInfo = { ...requestInfo, "userInfo": getCustomRequestInfo() };
    let body = Object.assign(
      {},
      {
        RequestInfo,
        "tenantId": getTenantId(),
        "tokenDisplayName": token,
        "keyStorePassPhrase": password,
        "keyId": certificate,
        "channelId": "ch4",
        responseData: null
      }
    );

    axios.post("/dsc-services/dsc/_dataSignInput", body, {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
      .then(response => {
        store.dispatch(showSpinner())
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
          axios.post("https://localhost.emudhra.com:26769/DSC/PKCSSign", body, {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          })
            .then(response => {
              store.dispatch(showSpinner())
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

              let requestInfo = getRequestInfo()
              RequestInfo = { ...requestInfo, "userInfo": getCustomRequestInfo() };
              let body = Object.assign(
                {},
                {
                  RequestInfo,
                  "tenantId": getTenantId(),
                  "tokenDisplayName": token,
                  "keyStorePassPhrase": password,
                  "keyId": certificate,
                  "channelId": "ch4",
                  "responseData": response.data.responseData
                }
              );
              axios.post("/dsc-services/dsc/_dataSign", body, { // to get R1 R2
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              })
                .then(response => {

                  store.dispatch(hideSpinner())
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
                    let succesMsg = getSuccessMsg(response.data.responseString)
                    store.dispatch(toggleSnackbarAndSetText(
                      true,
                      {
                        labelName: succesMsg.labelName,
                        labelKey: succesMsg.labelKey
                      },
                      succesMsg.type
                    ));

                  }
                  store.dispatch(hideSpinner())
                })
                .catch(error => {
                  store.dispatch(toggleSnackbarAndSetText(
                    true,
                    {
                      labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                      labelKey: "CORE_COMMON_SIGNATURE_FAILURE_MSG"
                    },
                    "error"
                  ));
                  store.dispatch(hideSpinner())
                });
              }
            })
            .catch(error => {

              if (!error.response) {
                // network error

                store.dispatch(toggleSnackbarAndSetText(
                  true,
                  {
                    labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                    labelKey: "Errors in detecting Token device. Please check whether hardware device connected properly"
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
              store.dispatch(hideSpinner())
            });

        }

      })
      .catch(error => {
        store.dispatch(hideSpinner())
      });
  } else {
    store.dispatch(toggleSnackbarAndSetText(
      true,
      {
        labelName: "CORE_COMMON_FILL_ALL_DETAILS",
        labelKey: "CORE_COMMON_FILL_ALL_DETAILS"
      },
      "warning"
    ));
    return
  }
}

const DigitalSignatureForm = ({ form, handleFieldChange, cardTitle, formKey, containerStyle, handleRemoveItem, disabled, className, formName }) => {
  const fields = form.fields || {};
  const submit = form.submit;
  return (
    // <Card
    //   style={containerStyle}
    //   textChildren={
      <div className="employee-change-password">
          {Object.keys(fields).map((fieldKey, index) => {
            return (
             fieldKey === "submit" ? (
                <div className="responsive-action-button-cont">
               <Button className="change-password-label-style" variant ='contained'
               onClick = {
                 (e) => register(fields.token.value,fields.certificate.value,fields.digitalSignaturePassword.value)
               } primary={true} style={{width: '20%',color :"rgb(255, 255, 255",backgroundColor: "rgb(254, 122, 81)",lineHeight:'32px'}}>REGISTER
               </Button>
              </div>
              ) :
              (
                <div
                  // style={
                  //   backgroundColor = "transparent",
                  //   fields[fieldKey].hideField
                  //     ? {}
                  //     : fields[fieldKey].toolTip
                  //     ? { display: "flex", alignItems: "center", height: 80 }
                  //     : { height: 80 }
                  // }
                  className="emp-change-passwd-field"
                >
                  <Field
                    className="fieldStyle"
                    fieldKey={fieldKey}
                    field={fields[fieldKey]}
                    handleFieldChange={handleFieldChange}
                    disabled={disabled}
                    // className={className}
                  />
                  {fields[fieldKey].toolTip && !fields[fieldKey].hideField && (
                    <ToolTipUi id={"form-wizard-tooltip"} title={fields[fieldKey].toolTipMessage} />
                  )}
                </div>
              )
              // </div>
            );
          })}
        </div>
      // }
    //   className={className}
    // />
  );
};
export default DigitalSignatureForm;
