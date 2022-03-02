import { getCommonHeader, getBreak, getLabel, getSelectField } from "egov-ui-framework/ui-config/screens/specs/utils";
import { wnsApplication } from './demandAdjustSearchResource/employeeApplication';
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { searchResults } from "./demandAdjustSearchResource/searchResults";
import { resetFieldsForConnection, resetFieldsForApplication } from '../utils';
import { handleScreenConfigurationFieldChange as handleField ,unMountScreen } from "egov-ui-framework/ui-redux/screen-configuration/actions";
//import "./index.css";
import { httpRequest } from "../../../../ui-utils/api";
import commonConfig from "config/common.js";


const header = getCommonHeader({
  labelKey: "WS_SEARCH_CONNECTION_HEADER"
});



export const getMdmsTenantsData = async (dispatch) => {
  let mdmsBody = {
      MdmsCriteria: {
          tenantId: commonConfig.tenantId,
          moduleDetails: [
              {
                  moduleName: "tenant",
                  masterDetails: [
                      {
                          name: "tenants"
                      },
                      { 
                        name: "citymodule" 
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
      payload.MdmsRes.tenant.tenants = payload.MdmsRes.tenant.citymodule[11].tenants;
      dispatch(prepareFinalObject("applyScreenMdmsData.tenant", payload.MdmsRes.tenant));

  } catch (e) {
      console.log(e);
  }
};

const employeeSearchResults = {
  uiFramework: "material-ui",
  name: "demand-adjust-search",
  beforeInitScreen: (action, state, dispatch) => {
    
    dispatch(prepareFinalObject('searchConnection',{}))
    dispatch(prepareFinalObject('searchScreen',{}))
    dispatch(unMountScreen("apply"));
    dispatch(unMountScreen("search-preview"));
   // getMDMSData(action, dispatch);
    resetFieldsForConnection(state, dispatch);
    resetFieldsForApplication(state, dispatch);
    //getMDMSAppType(dispatch);
    getMdmsTenantsData(dispatch);
   // dispatch(prepareFinalObject("searchConnection.tenantId", getTenantIdCommon()));
    //dispatch(prepareFinalObject("currentTab", "SEARCH_CONNECTION"));
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
                sm: 12
              },
              ...header
            },
            
            
          }
        },
        wnsApplication,
        breakAfterSearch: getBreak(),
        searchResults
        
      }
    }
  }
};

export default employeeSearchResults;
