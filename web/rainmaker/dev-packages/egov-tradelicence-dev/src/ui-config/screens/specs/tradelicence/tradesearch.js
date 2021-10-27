import {
  getBreak, getCommonHeader,
  getLabel,getSelectField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject, unMountScreen, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg, getRequiredDocData, showHideAdhocPopup } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import set from "lodash/set";
import { httpRequest } from "../../../../ui-utils";
import "./index.css";
import { pendingApprovals } from "./searchResource/pendingApprovals";
// import { progressStatus } from "./searchResource/progressStatus";
import { tradeSearchResults } from "./searchResource/searchResults";
import { tradeSearchForm } from "./searchResource/tradesearchform";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";


export const showHideCityPickerPopup = (state, dispatch, screenKey) => {
  let toggle = get(
    state.screenConfiguration.screenConfig[screenKey],
    "components.cityPickerDialog.props.open",
    false
  );
  dispatch(
    handleField(screenKey, "components.cityPickerDialog", "props.open", !toggle)
  );
};
const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false : true;
const tenant = getTenantId();
const getMdmsData = async (dispatch) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: getTenantId(),
      moduleDetails: [
        {
          moduleName: "TradeLicense",
          masterDetails: [
            { name: "ApplicationType" }
          ]
        },
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants"
            }
          ]
        },
      ]
    }
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
    let types = [];
    if (payload && payload.MdmsRes) {
      types = get(payload.MdmsRes, "TradeLicense.ApplicationType").map((item, index) => {
        return {
          code: item.code.split(".")[1]
        }
      });
    }

    dispatch(
      prepareFinalObject(
        "applyScreenMdmsData.searchScreen.applicationType",
        types
      )
    );
    let tenants = [];
    if (payload && payload.MdmsRes) {
      tenants = get(payload.MdmsRes, "tenant.tenants");
    }
    dispatch(
      prepareFinalObject(
        "applyScreenMdmsData.searchScreen.tenants",
        tenants
      )
    );


    let EmpApplyAppsFor = [{code: "PERMANENT", active: true},{code: "TEMPORARY", active: true}]
    dispatch(
      prepareFinalObject(
        "applyScreenMdmsData.searchScreen.tlType",
        EmpApplyAppsFor
      )
    );
  } catch (e) {
    console.log(e);
  }
}

const header = getCommonHeader({
  labelName: "Trade License",
  labelKey: "TL_COMMON_TL"
});
const tradeLicenseSearchAndResult = {
  uiFramework: "material-ui",
  name: "tradesearch",
  beforeInitScreen: (action, state, dispatch) => {
    dispatch(prepareFinalObject("searchScreen", {}))
    

    dispatch(unMountScreen("apply"));
    dispatch(unMountScreen("search-preview"));
    getMdmsData(dispatch);
    // const moduleDetails = [
    //   {
    //     moduleName: 'TradeLicense',
    //     masterDetails: [{ name: 'Documents' }]
    //   }
    // ];
    // getRequiredDocData(action, dispatch, moduleDetails, true);
  
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "tradesearch"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",

          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 6
              },
              ...header
            },
            newApplicationButton: {
              componentPath: "Button",
              gridDefination: {
                xs: 12,
                sm: 6,
                align: "right"
              },
              visible: enableButton,
              props: {
                variant: "contained",
                color: "primary",
                style: {
                  color: "white",
                  borderRadius: "2px",
                  width: "250px",
                  height: "48px"
                }
              },
              children: {
                plusIconInsideButton: {
                  uiFramework: "custom-atoms",
                  componentPath: "Icon",
                  props: {
                    iconName: "add",
                    style: {
                      fontSize: "24px"
                    }
                  }
                },
                buttonLabel: getLabel({
                  labelName: "NEW APPLICATION",
                  labelKey: "TL_HOME_TRADE_SEARCH_RESULTS_NEW_TRADE_RATE"
                })
              },
              onClickDefination: {
                action: "condition",
                callBack: (state, dispatch) => {
                  dispatch(
                    setRoute(
                      `/tradelicence/traderateadd`
                    )
                  );
                 // showHideCityPickerPopup(state, dispatch, 'tradesearch');
                 // dispatch(prepareFinalObject("MarriageRegistrations", []));
                  //dispatch(prepareFinalObject("LicensesTemp", []));
                }
              },
              roleDefination: {
                rolePath: "user-info.roles",
                roles: ["TL_CEMP"]
              }
            }
          }
        },
       // pendingApprovals,
        tradeSearchForm,
        breakAfterSearch: getBreak(),
        tradeSearchResults
      }
    },
    
    adhocDialog: {
      uiFramework: 'custom-containers',
      componentPath: 'DialogContainer',
      props: {
        open: getQueryArg(window.location.href, "action") === 'showRequiredDocuments' ? true : false,
        maxWidth: false,
        screenKey: 'tradesearch',
        reRouteURL: '/tradelicence/tradesearch'
      },
      children: {
        popup: {}
      }
    }
  }
};

export default tradeLicenseSearchAndResult;
