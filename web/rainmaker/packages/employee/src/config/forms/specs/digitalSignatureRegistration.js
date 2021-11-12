import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { hideSpinner,showSpinner } from "egov-ui-kit/redux/common/actions";
import { getLocale, getTenantId,getAccessToken, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import axios from 'axios';
import { setFieldProperty } from "egov-ui-kit/redux/form/actions";
import store from "ui-redux/store";

let RequestInfo = {}

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

const getCertificateList = (token) => {
  store.dispatch(showSpinner());
  let requestInfo = getRequestInfo()
  RequestInfo = { ...requestInfo,"userInfo" : getCustomRequestInfo()}; 
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
          RequestInfo = { ...requestInfo,"userInfo" : getCustomRequestInfo()};              
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
                  value : certificate.keyId,
                  name: certificate.commonName,
                  value: certificate.keyId
                }
              }) || []
              store.dispatch(hideSpinner());
              store.dispatch(setFieldProperty("digitalSignatureRegistration", "certificate", "dropDownData", requiredCertificateFormat));
              return requiredCertificateFormat
            })
            .catch(error => {
              store.dispatch(hideSpinner());
            });
        })
        .catch(error => {
          store.dispatch(hideSpinner());
        });
    })
    .catch(error => {
      store.dispatch(hideSpinner());
    });
}

const formConfig = {
    name: "digitalSignatureRegistration",
    fields: {
      token: {
        id: "employee-token",
        jsonPath: "employee.token",
        required: true,
        floatingLabelText: "CORE_COMMON_TOKEN_LABEL",
        hintText: "CORE_COMMON_TOKEN_PLACEHOLDER",
        type: "singleValueList",
        updateDependentFields: async({ formKey, field, dispatch }) => {
          if (field.value && field.value.length > 0) {
            if(field && field.value){
              getCertificateList(field.value)
            }
          }
        },
      },
      certificate: {
        id: "employee-certificate",
        jsonPath: "employee.certificate",
        required: true,
        floatingLabelText: "CORE_COMMON_CERTIFICATE_LABEL",
        hintText: "CORE_COMMON_CERTIFICATE_PLACEHOLDER",
        type: "singleValueList",
        updateDependentFields: ({ formKey, field, dispatch }) => {
          if (field.value && field.value.length > 0) {
            // dispatch(setFieldProperty(formKey, field, "value", field.value));
          }
        },
        gridDefination: {
          xs: 12,
          sm: 12
        },
        dropDownData : [
        ]
      },
      digitalSignaturePassword: {
        id: "digitalSignaturePassword",
        jsonPath: "digitalSignaturePassword",
        required: true,
        type: "password",
        floatingLabelText: "CORE_COMMON_PASSWORD_LABEL",
        errorMessage: "CORE_COMMON_PASSWORD_INVALIDMSG",
        hintText: "CORE_COMMON_PASSWORD_PLACEHOLDER",
        value: "",
      },
      submit: {
        label: "CORE_COMMON_REGISTER",
        id: "employee-digital-signature-submit-action",
      },
    }
  };
  
  export default formConfig;
  