const formConfig = {
    name: "digitalSignatureRegistration",
    fields: {
      token: {
        id: "employee-token",
        jsonPath: "employee.token",
        required: true,
        floatingLabelText: "CORE_COMMON_TOKEN_LABEL",
        hintText: "CORE_COMMON_TOKEN_PLACEHOLDER",
        type: "AutocompleteDropdown",
        updateDependentFields: ({ formKey, field, dispatch }) => {
          if (field.value && field.value.length > 0) {
            // dispatch(setFieldProperty(formKey, field, "value", field.value));
          }
        },
      },
      certificate: {
        id: "employee-certificate",
        jsonPath: "employee.certificate",
        required: true,
        floatingLabelText: "CORE_COMMON_CERTIFICATE_LABEL",
        hintText: "CORE_COMMON_CERTIFICATE_PLACEHOLDER",
        type: "AutocompleteDropdown",
        updateDependentFields: ({ formKey, field, dispatch }) => {
          if (field.value && field.value.length > 0) {
            // dispatch(setFieldProperty(formKey, field, "value", field.value));
          }
        },
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
        type: "submit",
        label: "CORE_COMMON_REGISTER",
        id: "employee-digital-signature-submit-action",
      },
    },
    submit: {
      fieldKey : 'submit',
      type: "submit",
      label: "CORE_COMMON_REGISTER",
      id: "employee-digital-signature-submit-action",
    },
    saveUrl: "/update/hjdhfjf",
    redirectionRoute: "/hrms/acknowledgement?purpose=signatureRegistered&status=success",
    action: "_update",
  };
  
  export default formConfig;
  