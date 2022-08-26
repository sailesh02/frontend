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
    key: "consumerCode",
    type: "text",
    placeholderLabelKey: "Select Consumer Number",
    gridSm: 4,
    jsonPath: "reportForm.consumerCode",
    required: true,
    labelKey: "Consumer Number",
  },
]