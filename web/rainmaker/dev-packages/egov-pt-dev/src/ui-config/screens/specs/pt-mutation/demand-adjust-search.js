import { getCommonHeader, getBreak, getLabel, getSelectField } from "egov-ui-framework/ui-config/screens/specs/utils";
import { PTApplication } from './demandAdjustSearchResource/employeeApplication';
import { searchResults } from "./demandAdjustSearchResource/searchResults.js";
import { prepareFinalObject ,unMountScreen} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { getQueryArg, getRequiredDocData,showHideAdhocPopup } from "egov-ui-framework/ui-utils/commons";
const header = getCommonHeader({
  labelKey: "PT_SEARCH_CONNECTION_HEADER"
});


const hasButton = getQueryArg(window.location.href, "hasButton");
let enableButton = true;
enableButton = hasButton && hasButton === "false" ? false : true;
const tenant = getTenantId();

const getMDMSData = async (action, dispatch) => {
    const moduleDetails= [
         {
            moduleName: "PropertyTax", 
            masterDetails: [
              { name: "Documents" }
             ] 
           },
         {
           moduleName: "tenant",
           masterDetails: [
             {
               name: "tenants"
             }, { name: "citymodule" }
           ]
         } 
       ]
    
   try {
     getRequiredDocData(action, dispatch, moduleDetails).then((payload)=>{
       if (process.env.REACT_APP_NAME != "Citizen") {
         dispatch(
           prepareFinalObject(
             "ptSearchScreen.tenantId",
             tenant
           )
         );
       }
       let tenants=get(payload,'payload.MdmsRes.tenant.tenants',[]).sort((t1,t2)=>t1.code.localeCompare(t2.code))
       const updatedData = tenants && tenants.map( tenant => {
         return {
           ...tenant,
           code: tenant.code && tenant.code.trim()}
         })
            
       dispatch(prepareFinalObject("searchScreenMdmsData.tenant.tenants", updatedData));
     })
  
 
 

   } catch (e) {
     console.log(e);
   }
 };
const employeeSearchResults = {
  uiFramework: "material-ui",
  name: "demand-adjust-search",
  beforeInitScreen: (action, state, dispatch) => {
    // resetFields(state, dispatch);
    dispatch(unMountScreen("search-preview"));
    getMDMSData(action, dispatch);
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
        PTApplication,
        breakAfterSearch: getBreak(),
        searchResults
        
      }
    }
  }
};

export default employeeSearchResults;
