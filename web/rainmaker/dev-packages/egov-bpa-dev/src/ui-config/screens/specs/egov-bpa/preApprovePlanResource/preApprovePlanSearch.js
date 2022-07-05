import { getCommonContainer } from "egov-ui-framework/ui-config/screens/specs/utils";
import { listOfPreAprrovedPlan } from "./listOfPreApprovedPlanDetails";
import { addPreApprovedPlanDetails } from "./addBuildPlan";

// Configure Tab section by using CustomTabContainer component .
export const showPreApprovedTab = getCommonContainer({
  showSearchScreens: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-bpa",
    componentPath: "CustomTabContainer",
    props: {
      tabs: [
        {
          tabButton: {
            labelName: "List of Preapproved-plans",
            labelKey: "PREAPPROVE_LIST_OF_PRE_APPROVED_PLAN",
          },
          tabContent: { listOfPreAprrovedPlan },
        },
        {
          tabButton: {
            labelName: "Add Preaprroved-plan",
            labelKey: "PREAPPROVE_ADD_PREAPPROVE_PLAN",
          },
          tabContent: { addPreApprovedPlanDetails },
        },
      ],
      tabIndex: 0,
    },
    type: "array",
  },
});