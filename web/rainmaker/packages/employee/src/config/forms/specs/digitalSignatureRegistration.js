const formConfig = {
    name: "digitalSignatureRegistration",
    fields: {
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
      token: {
        id: "employee-token",
        jsonPath: "employee.token",
        required: true,
        floatingLabelText: "CORE_COMMON_TOKEN_LABEL",
        hintText: "CORE_COMMON_TOKEN_PLACEHOLDER",
      },
      certificate: {
        id: "employee-certificate",
        jsonPath: "employee.certificate",
        required: true,
        floatingLabelText: "CORE_COMMON_CERTIFICATE_LABEL",
        hintText: "CORE_COMMON_CERTIFICATE_PLACEHOLDER",
      },
    },
    submit: {
      type: "submit",
      label: "CORE_COMMON_REGISTER",
      id: "employee-digital-signature-submit-action",
    },
    saveUrl: "/update/hjdhfjf",
    redirectionRoute: "/hrms/acknowledgement?purpose=signatureRegistered&status=success",
    action: "_update",
  };
  
  export default formConfig;
  