import {
  getBreak,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabel,
  getLabelWithValue
} from "egov-ui-framework/ui-config/screens/specs/utils";


export const sanctionFeeSummary = getCommonGrayCard({
  estimateCard: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-bpa",
    componentPath: "BpaSanctionFeeCardContainer",
    props: {
      estimate: {
        header: { labelName: "Fee Estimate", labelKey: "BPA_SANCTION_FEE_SUMMARY" },
        fees: [{ name: "ASD", value: 123 }],
        extra: [
          { textLeft: "Last Date for Rebate (20% of TL)" },
          {
            textLeft: "Penalty (10% of TL) applicable from"
          },
          { textLeft: "Additional Penalty (20% of TL) applicable from" }
        ]
      }
    }
  }
});
