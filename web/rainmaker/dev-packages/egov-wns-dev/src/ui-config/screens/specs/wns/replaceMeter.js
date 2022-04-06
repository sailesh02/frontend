import commonConfig from "config/common.js";
import { getPattern, getCommonCard, getCommonGrayCard, getCommonSubHeader, getCommonContainer, getCommonHeader, getCommonParagraph, getCommonTitle, getStepperObject, getTextField, getSelectField, getDateField } from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, unMountScreen } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import set from "lodash/set";
import { httpRequest } from "../../../../ui-utils";
import { getBoundaryData, updatePFOforSearchResults, handleApplicationNumberDisplayForMeterReplaceScreen } from "../../../../ui-utils/commons";
import { getAllDataFromBillingSlab, getCurrentFinancialYear, pageResetAndChange, updateMdmsDropDownsForBillingSlab } from "../utils";

import { footer } from "./replaceMeterResources/footer";
import { getSummaryForReview } from "./replaceMeterResources/summary";
import { meterReplacementDetails } from "./replaceMeterResources/additionalDetails"







export const stepsData = [
  { labelName: "Trade Details", labelKey: "WS_METER_DETAIL" },
  
  { labelName: "Summary", labelKey: "WS_COMMON_SUMMARY" }
];
export const stepper = getStepperObject(
  { props: { activeStep: 0 } },
  stepsData
);

export const getHeaderLabel = () => {
  return "WS_METER_REPLACEMENT";
}

export const header = getCommonContainer({
  headerDiv: getCommonContainer({
    header: getCommonHeader({
      labelKey: getHeaderLabel()
    })
  }),

  applicationNumberWater: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-wns",
    componentPath: "ApplicationNoContainer",
    props: { number: "", mode: false },
    visible: false
  }

});

export const getMdmsData = async (action, state, dispatch) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        { moduleName:"tenant","masterDetails":[{"name":"tenants"},{"name":"citymodule"}]},
        { moduleName: "common-masters", masterDetails: [{ name: "OwnerType" }, { name: "OwnerShipCategory" }] },
       // { moduleName: "tenant", masterDetails: [{ name: "tenants" }] },
        { moduleName: "sw-services-calculation", masterDetails: [{ name: "Documents" }, { name: "RoadType" },{ name: "PipeSize" },{name : "PipeDiameter"}] },
        { moduleName: "ws-services-calculation", masterDetails: [{ name: "PipeSize" }, { name: "Installment" }] },
        {
          moduleName: "ws-services-masters", masterDetails: [
            
            { name: "waterSource" },
            { name: "connectionType" },
            { name: "PropertySearch" },
            { name: "MeterReadingRatio"}
          ]
        }
      ]
    }
  };
  try {
    let payload = null;
    payload = await httpRequest("post", "/egov-mdms-service/v1/_search", "_search", [], mdmsBody);
    if (payload.MdmsRes['ws-services-calculation'].PipeSize !== undefined && payload.MdmsRes['ws-services-calculation'].PipeSize.length > 0) {
      let pipeSize = [];
      payload.MdmsRes['sw-services-calculation'].PipeSize.forEach(obj => pipeSize.push({ code: obj.size, name: obj.id, isActive: obj.isActive }));
      payload.MdmsRes['sw-services-calculation'].pipeSize = pipeSize;
      let waterSource = [], GROUND = [], SURFACE = [], BULKSUPPLY = [];
      payload.MdmsRes['ws-services-masters'].waterSource.forEach(obj => {
        waterSource.push({
          code: obj.code.split(".")[0],
          name: obj.name,
          isActive: obj.active
        });
        if (obj.code.split(".")[0] === "GROUND") {
          GROUND.push({
            code: obj.code.split(".")[1],
            name: obj.name,
            isActive: obj.active
          });
        } else if (obj.code.split(".")[0] === "SURFACE") {
          SURFACE.push({
            code: obj.code.split(".")[1],
            name: obj.name,
            isActive: obj.active
          });
        } else if (obj.code.split(".")[0] === "BULKSUPPLY") {
          BULKSUPPLY.push({
            code: obj.code.split(".")[1],
            name: obj.name,
            isActive: obj.active
          })
        }
      })
    
      let isActiveMeterRatio = payload.MdmsRes && payload.MdmsRes["ws-services-masters"] &&
       payload.MdmsRes["ws-services-masters"]["MeterReadingRatio"] &&
       payload.MdmsRes["ws-services-masters"]["MeterReadingRatio"].filter( ratio => {
        return ratio.active
      }) || []

      let fileteredMeterReadingRatio = isActiveMeterRatio && isActiveMeterRatio.map(ratio => {
        return {
          code :ratio.code,
          label : ratio.label
        }
      }) || []

      let isActiveDiameter = payload.MdmsRes && payload.MdmsRes["sw-services-calculation"] && 
       payload.MdmsRes["sw-services-calculation"]["PipeDiameter"].filter( ratio => {
        return ratio.isActive
      }) || []
      let fileteredDiameter = isActiveDiameter && isActiveDiameter.map(ratio => {
        return {
          code :ratio.size,
          label : ratio.size
        }
      }) || []

      payload.MdmsRes["sw-services-calculation"].fileteredDiameter = fileteredDiameter
      payload.MdmsRes["ws-services-masters"].fileteredMeterReadingRatio = fileteredMeterReadingRatio
      let filtered = waterSource.reduce((filtered, item) => {
        if (!filtered.some(filteredItem => JSON.stringify(filteredItem.code) == JSON.stringify(item.code)))
          filtered.push(item)
        return filtered
      }, [])
      payload.MdmsRes['ws-services-masters'].waterSource = filtered;
      payload.MdmsRes['ws-services-masters'].GROUND = GROUND;
      payload.MdmsRes['ws-services-masters'].SURFACE = SURFACE;
      payload.MdmsRes['ws-services-masters'].BULKSUPPLY = BULKSUPPLY;
    }

    let wnstenants =
    payload &&
    payload.MdmsRes &&
    payload.MdmsRes.tenant.citymodule.find(item => {
      if (item.code === "WNS") return true;
    });
    // payload.MdmsRes['tenants'] = payload.MdmsRes.tenant.tenants
    //related to ownershipcategory
    let OwnerShipCategory = get(
      payload,
      "MdmsRes.common-masters.OwnerShipCategory"
    )

    

    let institutions = []
    OwnerShipCategory = OwnerShipCategory.map(category => {
      if (category.code.includes("INDIVIDUAL")) {
        return category.code;
      }
      else {
        let code = category.code.split(".");
        institutions.push({ code: code[1], parent: code[0], active: true });
        return code[0];
      }
    });
    OwnerShipCategory = OwnerShipCategory.filter((v, i, a) => a.indexOf(v) === i)
    OwnerShipCategory = OwnerShipCategory.map(val => { return { code: val, active: true } });
    

    let tenants = get(
      payload,
      "MdmsRes.common-masters.tenant.tenants"
    )
    payload.MdmsRes['common-masters'].Institutions = institutions;
    payload.MdmsRes['common-masters'].OwnerShipCategory = OwnerShipCategory;
    
    payload.MdmsRes['common-masters'].tenants = tenants;

    payload.MdmsRes.tenant.citymodule = wnstenants.tenants;

    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
  } catch (e) { console.log(e); }
};


export const getConnectionDetails = async(action, state, dispatch) => {
  const tenantId = getQueryArg(window.location.href, "tenantId");
  const connectionNumber = getQueryArg(window.location.href, "connectionNumber");
  try {
    let queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "connectionNumber", value: connectionNumber },
      { key: "searchType",value:"CONNECTION"}
    ];
    const response = await httpRequest(
      "post",
      "/ws-services/wc/_search",
      "_search",
      queryObject
  );
  console.log(response, "Nero res")
  if (response.WaterConnection && response.WaterConnection.length > 0) {
      
      dispatch(prepareFinalObject("WaterConnection", response.WaterConnection[0]))
  }
  } catch (error) {
    console.log(error, "Error")
  }
}
export const getData = async (action, state, dispatch) => {
  const applicationNo = getQueryArg(window.location.href, "applicationNumber");
  const tenantId = getQueryArg(window.location.href, "tenantId");

  await getMdmsData(action, state, dispatch);

  if (applicationNo) {
    
    await updatePFOforSearchResults(action, state, dispatch, applicationNo, tenantId);
    handleApplicationNumberDisplayForMeterReplaceScreen(dispatch, applicationNo)

  }else{
    await getConnectionDetails(action, state, dispatch);
  }
};

export const formwizardFirstStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form1"
  },
  children: {
    meterReplacementDetails
  }
};


const summaryForReview = getSummaryForReview();
export const summaryDataForReview = getCommonCard({
  header: getCommonTitle({
    labelName: "Please review your Application and Submit",
    labelKey: "Please review your Application and Submit"
  }),
  
 summaryForReview,
  
});

export const formwizardSecondStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form2"
  },
  children: {
    summaryDataForReview
  },
  visible: false
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "replaceMeter",
  // hasBeforeInitAsync:true,
  beforeInitScreen: (action, state, dispatch) => {
    dispatch(prepareFinalObject("replaceMeterScreen", {}));
    const tenantId = getTenantId();
    
    getData(action, state, dispatch).then(responseAction => {
      const queryObj = [{ key: "tenantId", value: tenantId }];

    });

    return action;
  },

  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 10
              },
              ...header
            }
          }
        },
        stepper,
        formwizardFirstStep,
        formwizardSecondStep,
        footer
      }
    },

  }
};

export default screenConfig;
