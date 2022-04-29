import { getCommonTitle, getCommonHeader, getCommonCard, getCommonGrayCard, getCommonContainer, getCommonSubHeader, convertEpochToDate, getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
// import get from "lodash/get";
import { getAdvAnnualPaymentEstimate, fetchBill} from "../../../../ui-utils/commons";
import set from "lodash/set";
import get from "lodash/get";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getAdvAnnualPaymentEstimateCard, getNetAdvAnnualPaymentEstimateCard
} from "../utils";
//import { getcurrentDueBill } from "./advAnnualPaymentResources/billDetails";
// import { getOwner } from "./viewBillResource/ownerDetails";
// import { getService } from "./viewBillResource/serviceDetails";
import { viewBillFooter } from "./advAnnualPaymentResources/viewBillFooter";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
let consumerCode = getQueryArg(window.location.href, "connectionNumber");
const billHeader = () => {
  return getCommonHeader({ labelKey: "WS_COMMON_WATER_BILL_HEADER" })

}

let headerrow = getCommonContainer({
  header: billHeader(),
  consumerCode: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-wns",
    componentPath: "ConsumerNoContainer",
    props: { number: consumerCode }
  }
});



const searchResults = async (action, state, dispatch, consumerCode) => {
  let tenantId = getQueryArg(window.location.href, "tenantId")
  let queryObjectForFetchBill = [{ key: "tenantId", value: tenantId }, { key: "consumerCode", value: consumerCode }, { key: "businessService", value: "WS" }];
  let data = await fetchBill(queryObjectForFetchBill, dispatch);
  console.log(data, "Nero Fetch Bill")
  if (data && data.Bill && data.Bill.length > 0) {
    dispatch(prepareFinalObject('currentDueBill', data.Bill[0].totalAmount))
    dispatch(prepareFinalObject('TempBillData', data))
  }

  let estimateData = await getAdvAnnualPaymentEstimate(state, dispatch, tenantId, consumerCode);




}

//const currentDueBill = getcurrentDueBill();
const estimate = getCommonGrayCard({
  header: getCommonSubHeader({ labelKey: "WS_ADV_ANNUAL_PAYMENT_DETAILS_HEADER" }),
  estimateSection: getAdvAnnualPaymentEstimateCard({ sourceJsonPath: "advAnnualPaymentData" }),
  
});
const netAnnualPayment = getCommonGrayCard({
  header: getCommonSubHeader({ labelKey: "WS_ADV_ANNUAL_PAYMENT_PAYBLE_DETAILS_HEADER" }),
  netPaybleSection: getNetAdvAnnualPaymentEstimateCard(),
  
});
export const viewBill = getCommonCard({ estimate, netAnnualPayment });
const beforeInitFn = async (action, state, dispatch, consumerCode) => {
  if (consumerCode) {
    await searchResults(action, state, dispatch, consumerCode);
  }
};
const screenConfig = {
  uiFramework: "material-ui",
  name: "advAnnualPayment",
  beforeInitScreen: (action, state, dispatch) => {
    consumerCode = getQueryArg(window.location.href, "connectionNumber");
    // To set the application no. at the  top
    set(
      action.screenConfig,
      "components.div.children.headerDiv.children.header1.children.consumerCode.props.number",
      consumerCode
    );
    // set(action,"screenConfig.components.adhocDialog.children.popup",adhocPopupViewBill);
    beforeInitFn(action, state, dispatch, consumerCode);
    return action;
  },

  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: { className: "common-div-css search-preview" },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: { header1: { gridDefination: { xs: 12, sm: 8 }, ...headerrow } }
        },
        totalAmount: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-wns",
          componentPath: "TotalBill",
          props: {
            label: "WS_CURRENT_DUE_AMOUNT"
          }
        },
        viewBill,
        advAnnualPaymentAlreadyAppliedCard: getCommonCard({
          cardMsg: getCommonTitle({
              labelName: "Annual advance already applied on this connection for this financial year",
              labelKey: "WS_ADV_ANNUAL_PAYMENT_ALREADY_APPLIED_MSG",
              style: {"color": "green"}
          })
      }),
        viewBillFooter
      }
    }
  }
};

export default screenConfig;