export const newConsumerMonthlyReportForm = [
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
    key: "ward",
    type: "text",
    placeholderLabelKey: "Select Ward",
    gridSm: 4,
    jsonPath: "reportForm.ward",
    required: false,
    labelKey: "Ward (Eg NIL,01,02,..)",
  },
  {
    key: "monthYear",
    type: "date",
    placeholderLabelKey: "Select Month/Year",
    gridSm: 4,
    jsonPath: "reportForm.monthYear",
    required: true,
    labelKey: "Month/Year",
  },
]