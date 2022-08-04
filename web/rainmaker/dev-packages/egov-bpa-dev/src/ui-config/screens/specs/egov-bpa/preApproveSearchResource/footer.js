import {
  getCommonContainer,
  getSelectField,
  getLabel,
  getCommonTitle,
  getCommonCard,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { ifUserRoleExists } from "../../utils";


const getCommonApplyFooter = (children) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer",
    },
    children,
  };
};
export const getRedirectionURL = () => {
  const redirectionURL = ifUserRoleExists("CITIZEN")
    ? "/bpastakeholder-citizen/home"
    : "/egov-bpa/preapprovedplan";
  return redirectionURL;
};
export const gotoHomeFooter = getCommonApplyFooter({
  gotoHome: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        // minWidth: "200px",
        height: "48px",
        marginRight: "16px",
      },
    },
    children: {
      //downloadReceiptButtonLabel: getLabel
      goToHomeButtonLabel: getLabel({
        labelName: "Back to Pre-approved",
        labelKey: "PREAPPROVE_BACK_TO_PREAPPROVE",
      }),
    },
    // Check this onClickDefinition later again
    onClickDefination: {
      action: "page_change",
      path: `${getRedirectionURL()}`,
    },
  },
});
