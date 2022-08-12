export const billSummaryReportForm = [
  {
    key: "tenantId",
    type: "select",
    placeholderLabelKey: "Select ULB Name",
    gridSm: 4,
    className: "applicant-details-error autocomplete-dropdown",
    jsonPath: "reportForm.tenantId",
    sourceJsonPath: "applyScreenMdmsData.tenant.tenants",
    //required: true,
    labelKey: "ULB Name",
    localePrefix: {
      moduleName: "TENANT",
      masterName: "TENANTS",
    },
    // onChange: onChangeTest,
  },
  {
    key: "monthYear",
    type: "date",
    jsonPath: "reportForm.monthYear",
    labelKey: "Month/Year",
    placeholderLabelKey: "Select Month Year",
    // localePrefix,
    gridSm: 4,
    isRequired: true,
    // isDisabled: false,
  },
]