export const ulbWiseTaxCollectionForm = [
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
    key: "wardNo",
    type: "text",
    jsonPath: "reportForm.wardNo",
    labelKey: "Tax Ward",
    placeholderLabelKey: "Select Tax Ward",
    gridSm: 4,
    required: false,
  }
]