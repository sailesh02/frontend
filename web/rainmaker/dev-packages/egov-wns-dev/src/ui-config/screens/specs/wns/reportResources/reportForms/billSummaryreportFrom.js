export const billSummaryReportForm = [
  {
    key: "tenantId",
    type: "select",
    placeholderLabelKey: "Select ULB Name",
    gridSm: 4,
    className: "applicant-details-error autocomplete-dropdown",
    jsonPath: "reportForm.tenantId",
    sourceJsonPath: "applyScreenMdmsData.tenant.tenants",
    required: false,
    labelKey: "ULB Name",
    localePrefix: {
      moduleName: "TENANT",
      masterName: "TENANTS",
    },
  },
  {
    key: "monthYear",
    type: "date",
    jsonPath: "reportForm.monthYear",
    labelKey: "Month/Year",
    placeholderLabelKey: "Select Month Year",
    gridSm: 4,
    required: true,
  },
]