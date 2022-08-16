export const consumerPaymentHistoryForm = [
  {
    key: "tenantId",
    type: "select",
    placeholderLabelKey: "Select ULB Name",
    gridSm: 4,
    jsonPath: "reportForm.tenantId",
    sourceJsonPath: "applyScreenMdmsData.tenant.tenants",
    required: true,
    labelKey: "ULB Name",
    localePrefix: {
      moduleName: "TENANT",
      masterName: "TENANTS",
    },
  },
  {
    key: "consumerNumber",
    type: "text",
    placeholderLabelKey: "Select Consumer Number",
    gridSm: 4,
    jsonPath: "reportForm.consumerNumber",
    required: true,
    labelKey: "Consumer Number",
  },
]