export const consumerBillHistoryReportForm = [
  {
    key: "tenantId",
    type: "select",
    placeholderLabelKey: "Select ULB Name",
    gridSm: 4,
    className: "applicant-details-error autocomplete-dropdown",
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
    key: "oldConnectionNo",
    type: "text",
    placeholderLabelKey: "Enter Old Connection Number",
    gridSm: 4,
    jsonPath: "reportForm.oldConnectionNo",
    required: true,
    labelKey: "Old Connection Number",
  },
  {
    key: "monthYear",
    type: "date",
    jsonPath: "reportForm.monthYear",
    labelKey: "Month/Year",
    placeholderLabelKey: "Select Month Year",
    gridSm: 4,
  },

]