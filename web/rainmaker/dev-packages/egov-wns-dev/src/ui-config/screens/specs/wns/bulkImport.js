import { getCommonHeader, getBreak, getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { showSearches } from "./searchResource/searchTabs";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { searchResults } from "./searchResource/searchResults";
import { searchApplicationResults } from "./searchResource/searchApplicationResults";
import { localStorageGet, getTenantIdCommon } from "egov-ui-kit/utils/localStorageUtils";
import find from "lodash/find";
import { setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";
import { resetFieldsForConnection, resetFieldsForApplication } from '../utils';
import { handleScreenConfigurationFieldChange as handleField ,unMountScreen } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.css";
import { getRequiredDocData, showHideAdhocPopup } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils/api";
import commonConfig from "config/common.js";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { bulkImportApplication } from './searchResource/bulkImportApplication';
import { getMdmsDataForMeterStatus } from "../../../../ui-utils/commons"

const getMDMSData = (action, dispatch) => {
  const moduleDetails = [
    {
      moduleName: "ws-services-masters",
      masterDetails: [
        { name: "Documents" }
      ] 
    }
  ]
  try {
    getRequiredDocData(action, dispatch, moduleDetails)
  } catch (e) {
    console.log(e);
  }
};

const getMDMSAppType =async (dispatch) => {
  // getMDMS data for ApplicationType
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: [
         {
            moduleName: "ws-services-masters", masterDetails: [
              { name: "ApplicationType" }
            ]
          }
        ]
      }
    };
    try {
      let applicationType = [];
      let payload = null;
       payload = await httpRequest("post", "/egov-mdms-service/v1/_search", "_search", [], mdmsBody);       
        if(payload && payload.MdmsRes['ws-services-masters'] && payload.MdmsRes['ws-services-masters'].ApplicationType !== undefined){
          payload.MdmsRes['ws-services-masters'].ApplicationType.forEach(obj => applicationType.push({ code: obj.code.replace(/_/g,' '), name: obj.name, businessService:obj.businessService}));          
          applicationType.forEach(type=>getBusinessService(type.businessService,dispatch))
          dispatch(prepareFinalObject("applyScreenMdmsData.searchScreen.applicationType", applicationType));
        }
    } catch (e) { console.log(e); }
  }

const header = getCommonHeader({
  labelKey: "WS_SEARCH_CONNECTION_HEADER"
});

const getBusinessService=async(businessService, dispatch)=>{
  const queryObject = [
    { key: "tenantId", value: getTenantId() },
    { key: "businessServices", value:businessService } 
  ];
  const payload = await httpRequest(
    "post",
    "egov-workflow-v2/egov-wf/businessservice/_search",
    "_search",
    queryObject
  );
  if (payload.BusinessServices[0].businessService === "NewWS1" || payload.BusinessServices[0].businessService === "NewSW1" 
   || payload.BusinessServices[0].businessService === "SWCloseConnection" || payload.BusinessServices[0].businessService === "SWDisconnection" 
   || payload.BusinessServices[0].businessService === "WSCloseConnection" 
   || payload.BusinessServices[0].businessService === "WSDisconnection" 
   || payload.BusinessServices[0].businessService === "WSReconnection"
   || payload.BusinessServices[0].businessService === "SWReconnection"
   || payload.BusinessServices[0].businessService === "WSOwnershipChange"
   || payload.BusinessServices[0].businessService === "SWOwnershipChange") {

    const applicationStatus=commonGetAppStatus(payload);
        dispatch(prepareFinalObject("applyScreenMdmsData.searchScreen.applicationStatusNew", applicationStatus));
    
    }else{
      if (payload.BusinessServices[0].businessService === "ModifyWSConnection" || payload.BusinessServices[0].businessService === "ModifySWConnection") {
        const applicationStatus=commonGetAppStatus(payload);
          dispatch(prepareFinalObject("applyScreenMdmsData.searchScreen.applicationStatusModify", applicationStatus));
      }
    }
}

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

const commonGetAppStatus=(payload)=>{
  const { states } = payload.BusinessServices[0] || [];
  if (states && states.length > 0) {
    const status = states.map((item) => { return { code: item.applicationStatus } });
    return status.filter(item => item.code != null);
  }

}
const getData = async (action, state, dispatch) => {
  await getMdmsDataForMeterStatus(dispatch)
}

const screenConfig = {
  uiFramework: "material-ui",
  name: "bulkImport",
  beforeInitScreen: (action, state, dispatch) => {
    getData(action, state, dispatch).then(() => {
    });
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
            }
          }
        },
        // showSearches,
        breakAfterSearch: getBreak(),
        // searchResults,
        bulkImportApplication,
        searchApplicationResults
      }
    },
  }
};

export default screenConfig;

