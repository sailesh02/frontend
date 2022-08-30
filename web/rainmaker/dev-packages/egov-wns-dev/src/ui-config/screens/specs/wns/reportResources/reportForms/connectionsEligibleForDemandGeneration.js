export const connectionsEligibleForDemandGenerationForm = [
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
    }
]