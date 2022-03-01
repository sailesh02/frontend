import { getCommonHeader, getBreak, getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { volumetricSearch } from "./VolumetricReSource/volumeticSearch";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { volumetricSearchResult } from "./VolumetricReSource/volumetricSearchResult";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import "./index.css";
import { httpRequest } from "../../../../ui-utils/api";
import commonConfig from "config/common.js";


const header = getCommonHeader({
  labelKey: "WS_VOLUMETRIC_SEARCH_CONNECTION_HEADER"
});
export const getMdmsTenantsDataVolumetric = async (dispatch) => {
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
      dispatch(prepareFinalObject("volumnetricScreenMdmsData.tenant", payload.MdmsRes.tenant));

  } catch (e) {
      console.log(e);
  }
};



const screenConfig ={
  uiFramework: "material-ui",
  name: "volumetricCharges",
  beforeInitScreen: (action, state, dispatch) => {
    getMdmsTenantsDataVolumetric(dispatch);

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
        volumetricSearch,
        breakAfterSearch: getBreak(),
        volumetricSearchResult
      }
    },
  }




}

export default screenConfig;