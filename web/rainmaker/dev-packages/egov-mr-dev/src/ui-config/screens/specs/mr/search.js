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
import { pendingApprovals, showSearches } from "./searchResource/pendingApprovals";
// import { progressStatus } from "./searchResource/progressStatus";
import { searchResults } from "./searchResource/searchResults";
import { getPendingDigitallySignedApplications } from "./searchResource/functions"

const closePdfSigningPopup = (refreshType) => {
  store.dispatch(
    handleField(
      "search",
      "components.pdfSigningPopup.props",
      "openPdfSigningPopup",
      false
    )
  )
  if(refreshType == 'Table'){
    getPendingDigitallySignedApplications()
  }
}

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
          moduleName: "MarriageRegistration",
          masterDetails: [
            { name: "ApplicationType" }
          ]
        }
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
      types = get(payload.MdmsRes, "MarriageRegistration.ApplicationType").map((item, index) => {
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


    let EmpApplyAppsFor = [{code: "TL_HOME_SEARCH_RESULTS_NEW_APP_BUTTON", active: true},{code: "TL_HOME_SEARCH_RESULTS_NEW_TEMP_APP_BUTTON", active: true}, {code: "TL_HOME_SEARCH_RESULTS_LEGACY_TL_RENEW_APP_BUTTON", active: true}]
    dispatch(
      prepareFinalObject(
        "applyScreenMdmsData.searchScreen.EmpApplyAppsFor",
        EmpApplyAppsFor
      )
    );
  } catch (e) {
    console.log(e);
  }
}

const header = getCommonHeader({
  labelName: "Trade License",
  labelKey: "ACTION_TEST_MARRIAGE_REGISTRATION"
});
const tradeLicenseSearchAndResult = {
  uiFramework: "material-ui",
  name: "search",
  beforeInitScreen: (action, state, dispatch) => {
    dispatch(prepareFinalObject("searchScreen", {}))
    //dispatch(prepareFinalObject("EmpApplyAppsFor", []))
    //screenConfiguration.screenConfig.search.components.div.children.headerDiv.children.tradeLicenseType.props

    dispatch(unMountScreen("apply"));
    dispatch(unMountScreen("search-preview"));
    getMdmsData(dispatch);
    const moduleDetails = [
      {
        moduleName: 'MarriageRegistration',
        masterDetails: [{ name: 'Documents' }]
      }
    ];
    getRequiredDocData(action, dispatch, moduleDetails, true);

    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "search"
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
                  labelKey: "MR_HOME_SEARCH_RESULTS_NEW_APP_BUTTON"
                })
              },
              onClickDefination: {
                action: "condition",
                callBack: (state, dispatch) => {

                  showHideAdhocPopup(state, dispatch, 'search');
                  dispatch(prepareFinalObject("MarriageRegistrations", []));
                  dispatch(prepareFinalObject("LicensesTemp", []));
                }
              },
              // roleDefination: {
              //   rolePath: "user-info.roles",
              //   path: "mr/search"
              // }
            }

          }
        },
        pendingApprovals,
        showSearches,
        // tradeLicenseApplication,
        breakAfterSearch: getBreak(),
        searchResults,
      }
    },
    adhocDialog: {
      uiFramework: 'custom-containers',
      componentPath: 'DialogContainer',
      props: {
        open: getQueryArg(window.location.href, "action") === 'showRequiredDocuments' ? true : false,
        maxWidth: false,
        screenKey: 'search',
        reRouteURL: '/mr/search'
      },
      children: {
        popup: {}
      }
    },
    pdfSigningPopup : {
      uiFramework: 'custom-containers-local',
      componentPath: 'SignPdfContainer',
      moduleName: "egov-workflow",
      props: {
        openPdfSigningPopup: false,
        closePdfSigningPopup : closePdfSigningPopup,
        maxWidth: false,
        moduleName : 'MR',
        okText :"MR_SIGN_PDF",
        resetText : "MR_RESET_PDF",
        dataPath : 'Licenses',
        updateUrl : '/mr-services/v1/_updatedscdetails?',
        refreshType : 'Table'
      },
      children: {
        popup: {}
      }
    }
  }
};

export default tradeLicenseSearchAndResult;
