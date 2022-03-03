import { getPastPaymentsForWater, getConnectionPastPayments } from "../../../../ui-utils/commons";
import { getCommonHeader, getCommonContainer } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

const header = getCommonHeader(
  {
    labelKey: "WS_COMMON_PAST_PAYMENTS"
  },
  {
    classes: {
      root: "common-header-cont"
    },
    style: {"marginTop": "30px", "marginLeft": "12px"}
  }
);

const screenConfig = {
  uiFramework: "material-ui",
  name: "connection-past-payments",
  beforeInitScreen: (action, state, dispatch) => {
    getConnectionPastPayments(dispatch);

    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
        header: header,

        applicationsCard: {
          uiFramework: "custom-molecules-local",
          moduleName: "egov-wns",
          componentPath: "PastPaymentsDetails"
        }
      }
    }
  }
};
export default screenConfig;