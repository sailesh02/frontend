import commonConfig from "config/common.js";
import { getCommonHeader, getBreak } from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
  unMountScreen,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { httpRequest } from "../../../../ui-utils";
import { getAllDataFromBillingSlab } from "../utils";
import { billSlabSearchForm } from "./manageTradeResource/billingSlabSearch";
import { searchResults } from "./manageTradeResource/billingSlabSearch";

const getMdmsData = async (action, state, dispatch) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "TradeLicense",
          masterDetails: [{ name: "ApplicationType" }],
        },
        {
          moduleName: "common-masters",
          masterDetails: [{ name: "UOM" }],
        },
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants",
            },
          ],
        },
      ],
    },
  };

  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    const localities = get(
      state.screenConfiguration,
      "preparedFinalObject.applyScreenMdmsData.tenant.localities",
      []
    );
    if (localities && localities.length > 0) {
      payload.MdmsRes.tenant.localities = localities;
    }
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};

export const getData = async (action, state, dispatch) => {
  await getMdmsData(action, state, dispatch);
  await getAllDataFromBillingSlab(getTenantId(), dispatch);
};

const header = getCommonHeader({
  labelName: "Manage Trade License",
  labelKey: "TL_MANAGE_TRADE_RATE_HDR",
});

const screenConfig = {
  uiFramework: "material-ui",
  name: "managetrade",

  beforeInitScreen: (action, state, dispatch) => {
    dispatch(unMountScreen("search"));
    dispatch(unMountScreen("tradesearch"));
    dispatch(unMountScreen("search-preview"));
    const cityName = getTenantId();
    dispatch(
      handleField(
        "managetrade",
        `components.div.children.billSlabSearchForm.children.cardContent.children.cityNameContainer.children.tradeLocCity`,
        "props.value",
        cityName
      )
    );
    const manageTrade = {
      city: cityName,
      licenseType: "PERMANENT",
      applicationType: "NEW",
      tradeType: ""
    }
    dispatch(prepareFinalObject("manageTrade", manageTrade));
    getData(action, state, dispatch);

    return action;
  },

  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "search",
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 6,
              },
              ...header,
            },
          },
        },
        billSlabSearchForm,
        breakAfterSearch: getBreak(),
        searchResults,
      },
    },
  },
};

export default screenConfig;
