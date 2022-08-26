export const taxCollectorWiseCollectionForm = [
  {
    key: "ulbName",
    type: "select",
    placeholderLabelKey: "Select ULB Name",
    gridSm: 4,
    jsonPath: "reportForm.ulbName",
    sourceJsonPath: "applyScreenMdmsData.tenant.tenants",
    required: true,
    labelKey: "ULB Name",
    localePrefix: {
      moduleName: "TENANT",
      masterName: "TENANTS",
    },
  },
  {
    key: "startDate",
    type: "date",
    jsonPath: "reportForm.startDate",
    labelKey: "End Date",
    placeholderLabelKey: "Select Start Date",
    gridSm: 4,
    required: true,
  },
  {
    key: "endDate",
    type: "date",
    jsonPath: "reportForm.endDate",
    labelKey: "End Date",
    placeholderLabelKey: "Select End Date",
    gridSm: 4,
    required: true,
  }
]