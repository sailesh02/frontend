import { getCommonHeader, getCommonCard, getCommonGrayCard, getCommonContainer, getCommonSubHeader, convertEpochToDate, getLabel, getLabelWithValue } from "egov-ui-framework/ui-config/screens/specs/utils";
// import get from "lodash/get";
import { getSearchResults, getSearchResultsForSewerage, fetchBill, getDescriptionFromMDMS, getConsumptionDetails, billingPeriodMDMS, getExpiryDate, serviceConst, getDemandsOfConnection } from "../../../../ui-utils/commons";
import set from "lodash/set";
import get from "lodash/get";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  createEstimateData,
  getFeesEstimateCard,
  showHideAdhocPopup
} from "../utils";

import { adhocPopupViewBill } from "./applyResource/adhocPopupViewBill";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";


let consumerCode = getQueryArg(window.location.href, "connectionNumber");
const tenantId = getQueryArg(window.location.href, "tenantId")
const service = getQueryArg(window.location.href, "service")





const beforeInitFn = async (action, state, dispatch, consumerCode, tenantId, bService) => {
  if (consumerCode) {
    let queryObject = [{ key: "businessService", value: bService }, { key: "tenantId", value: tenantId }, { key: "consumerCode", value: consumerCode }]
    let demandsResult = await getDemandsOfConnection(queryObject, dispatch)

    dispatch(prepareFinalObject("Demands", demandsResult))
    dispatch(prepareFinalObject('taxRoundOffAmount', 0))
    console.log(demandsResult)
  }
};

const billHeader = () => {
  return getCommonHeader({ labelKey: "WS_COMMON_DEMAND_DETAIL_HEADER" })
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


const screenConfig = {
  uiFramework: "material-ui",
  name: "viewDemand",
  beforeInitScreen: (action, state, dispatch) => {
    let consumerCode = getQueryArg(window.location.href, "connectionNumber");
    let tenantId = getQueryArg(window.location.href, "tenantId");
    let bService = getQueryArg(window.location.href, "businessService");
    // To set the application no. at the  top
    set(
      action.screenConfig,
      "components.div.children.headerDiv.children.header1.children.consumerCode.props.number",
      consumerCode
    );
    // set(action,"screenConfig.components.adhocDialog.children.popup",adhocPopupViewBill);
    beforeInitFn(action, state, dispatch, consumerCode, tenantId, bService);
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
        
        totalAmount:{
          uiFramework: "custom-atoms-local",
          moduleName: "egov-wns",
          componentPath: "TotalBill",
          props:{
            label: "WS_COMMON_TOTAL_AMT"
          }
        },
        
        viewTwo: {
          uiFramework: "custom-molecules-local",
          moduleName: "egov-wns",
          componentPath: "DemandAdjustMent"
      }
        
      }
    }
  }
};

export default screenConfig;