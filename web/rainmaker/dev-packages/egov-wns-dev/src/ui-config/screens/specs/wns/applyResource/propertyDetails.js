import {
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer,
  getLabelWithValue,
  getTextField,
  getPattern,
  getSelectField,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";

import { propertySearchApiCall } from './functions';
import { handlePropertySubUsageType, handleNA, resetFieldsForApplication } from '../../utils';
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

let isMode = getQueryArg(window.location.href, "mode");
isMode = (isMode) ? isMode.toUpperCase() : "";
let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
let connectionNumber = getQueryArg(window.location.href, "connectionNumber");
let tenantId = getQueryArg(window.location.href, "tenantId");
let action = getQueryArg(window.location.href, "action");
let modeaction = getQueryArg(window.location.href, "modeaction");

let mode = getQueryArg(window.location.href, "mode");


const meteredPermanent = [{code: "Domestic"},{code: "Industrial"},{code: "Commercial"},{code:"Institutional"}]
const meteredTemporary = [{code:"Temporary Water Supply For Contractors."}]
const nonMeteredPermanent = [{code:"Domestic"},{code:"For every additional taps"},{code:"BPL Category"},{code:"ROAD SIDE EATERS"},
{code:"Stand Post/Mucipalty/Association"}]
const nonMeteredTemporory = [{code:"Domestic"}]

let modifyLink;
if(isMode==="MODIFY"){
  modifyLink=`/wns/apply?`;
  modifyLink = applicationNumber ? modifyLink + `applicationNumber=${applicationNumber}` : modifyLink;
  modifyLink = connectionNumber ? modifyLink + `&connectionNumber=${connectionNumber}` : modifyLink;
  modifyLink = action ? modifyLink + `&action=${action}` : modifyLink;
  modifyLink = modeaction ? modifyLink + `&modeaction=${modeaction}` : modifyLink;
  modifyLink = mode ? modifyLink + `&mode=${mode}` : modifyLink;

}else{
  modifyLink="/wns/apply"
}

const resetScreen =()=>{
   isMode = getQueryArg(window.location.href, "mode");
isMode = (isMode) ? isMode.toUpperCase() : "";
 applicationNumber = getQueryArg(window.location.href, "applicationNumber");
 connectionNumber = getQueryArg(window.location.href, "connectionNumber");
 tenantId = getQueryArg(window.location.href, "tenantId");
 action = getQueryArg(window.location.href, "action");

if(isMode==="MODIFY"){
  modifyLink=`/wns/apply?`;
  modifyLink = applicationNumber ? modifyLink + `applicationNumber=${applicationNumber}` : modifyLink;
  modifyLink = connectionNumber ? modifyLink + `&connectionNumber=${connectionNumber}` : modifyLink;
  modifyLink = action ? modifyLink + `&action=${action}` : modifyLink;
  modifyLink = modeaction ? modifyLink + `&modeaction=${modeaction}` : modifyLink;
  modifyLink = mode ? modifyLink + `&mode=${mode}` : modifyLink;
}else{
  modifyLink="/wns/apply"
}
}
export const propertyHeader = getCommonSubHeader({
  lKey:resetScreen(),
  labelKey: "WS_COMMON_PROP_DETAIL",
  labelName: "Property Details"
})

export const NoIdHeader = getCommonSubHeader({
  labelKey: "WS_COMMON_PROP_DETAIL",
  labelName: "Property Details"
})

export const propertyID = getCommonContainer({
  propertyID: getTextField({
    label: { labelKey: "WS_PROPERTY_ID_LABEL" },
    placeholder: { labelKey: "WS_PROPERTY_ID_PLACEHOLDER" },
    gridDefination: { xs: 12, sm: 5, md: 5 },
    // required: true,
    props: {
      style: {
        width: "100%"
      }
    },
    sourceJsonPath: "applyScreen.property.propertyId",
    title: {
      value: "Fill the form by searching your old approved trade license",
      // key: "TL_OLD_TL_NO"
    },
    pattern: /^[a-zA-Z0-9-]*$/i,
    errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
    jsonPath: "searchScreen.propertyIds",
  }),
  wnsPtySearchButton: {
    componentPath: "Button",
    gridDefination: { xs: 12, sm: 1, md: 1 },
    props: {
      variant: "contained",
      style: {
        color: "white",
        marginTop: "19px",
        marginBottom: "10px",
        marginLeft: "10px",
        marginRight: "10px",
        backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
        borderRadius: "2px",
        width: "95%",
        height: "32px"
      }
    },
    children: {
      buttonLabel: getLabel({
        labelKey: "WS_SEARCH_CONNECTION_SEARCH_BUTTON"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: propertySearchApiCall
    },
  },
  clickHereLink: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-wns",
    componentPath: "AddLinkForProperty",
    props: { url: modifyLink, isMode },
    gridDefination: { xs: 12, sm: 4, md: 4 }
  }
})

const propertyDetails = getCommonContainer({
  propertyType: getLabelWithValue(
    {
      labelKey: "WS_PROPERTY_TYPE_LABEL"
    },
    {
      jsonPath:
        "applyScreen.property.propertyType",
      callBack: handleNA,
      localePrefix: {
        moduleName: "WS",
        masterName: "PROPTYPE"
      }

    }
  ),
  propertyUsageType: getLabelWithValue(
    {
      labelKey: "WS_PROPERTY_USAGE_TYPE_LABEL"
    },
    {
      jsonPath: "applyScreen.property.usageCategory",
      callBack: handleNA,
      localePrefix: {
        moduleName: "WS",
        masterName: "PROPUSGTYPE"
      }
    }
  ),
  propertySubUsageType: getLabelWithValue(
    {
      labelKey: "WS_PROPERTY_SUB_USAGE_TYPE_LABEL",
      labelName: "Property Sub Usage Type"
    },
    {
      jsonPath: "applyScreen.property.units[0].usageCategory",
      callBack: handlePropertySubUsageType,
      localePrefix: {
        moduleName: "WS",
        masterName: "PROPSUBUSGTYPE"
      }
    }
  ),
  plotSize: getLabelWithValue(
    {
      labelKey: "WS_PROP_DETAIL_PLOT_SIZE_LABEL"
    },
    {
      jsonPath: "applyScreen.property.landArea",
      callBack: handleNA

    }
  ),
  numberOfFloors: getLabelWithValue(
    {
      labelKey: "WS_PROPERTY_NO_OF_FLOOR_LABEL",
      labelName: "Number Of Floors"
    },
    {
      jsonPath: "applyScreen.property.noOfFloors",
      callBack: handleNA
    }
  ),
  rainwaterHarvestingFacility: getLabelWithValue(
    {
      labelKey: "WS_SERV_DETAIL_CONN_RAIN_WATER_HARVESTING_FAC",
      labelName: "Rainwater Harvesting Facility"
    },
    {
      jsonPath: "applyScreen.property.additionalDetails.isRainwaterHarvesting",
      callBack: handleNA
    }
  )
})

const propertyDetailsNoId = getCommonContainer({
  apartment: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-wns",
    componentPath: "CheckboxContainerConnHolder",
    gridDefination: { xs: 12, sm: 12, md: 12 },
    visible:false,
    props: {
      label: {
        name: "Apartment",
        key: "WS_COMMON_APARTMENT",
      },
      jsonPath: "applyScreen.apartment",
      required: false,
      isChecked: false,
      isApartment:true
    },
    type: "array",
    jsonPath: "applyScreen.apartment",
  },
  connectionCategory: getSelectField({
    label: {
      labelName: "Connection Category",
      labelKey: "WS_PROPERTY_CONNECTION_CATEGORY_LABEL"
    },
    placeholder: {
      labelName: "Select Connection Category",
      labelKey: "WS_PROPERTY_CONNECTION_CATEGORY_PLACEHOLDER"
    },
    // required: true,
    jsonPath: "applyScreen.connectionCategory",
    value:'TEMPORARY',
    data: [{ code: "TEMPORARY" }, { code: "PERMANENT" }],
    localePrefix: {
      moduleName: "WS",
      masterName: "PROPTYPE"
    },
    //sourceJsonPath: "applyScreenMdmsData.common-masters.OwnerType",
    gridDefination: {
      xs: 12,
      sm: 6
    },
    afterFieldChange: (action, state, dispatch) => {
      if(action){
        const meteredNonMetered = get(state.screenConfiguration.preparedFinalObject, "applyScreen.connectionType", "")
        switch(action.value){
          case 'TEMPORARY':
            if(meteredNonMetered == "METERED"){
              dispatch(
                handleField(
                  "apply",
                  "components.div.children.formwizardFirstStep.children.PropertyDetailsNoId.children.cardContent.children.propertyDetailsNoId.children.holderDetails.children.usageCategory.props",
                  "data",
                  meteredTemporary
                )
              );
            }else{
              dispatch(
                handleField(
                  "apply",
                  "components.div.children.formwizardFirstStep.children.PropertyDetailsNoId.children.cardContent.children.propertyDetailsNoId.children.holderDetails.children.usageCategory.props",
                  "data",
                  nonMeteredTemporory
                )
              );
            }
            break;
          case 'PERMANENT' :
              if(meteredNonMetered == "METERED"){
                dispatch(
                  handleField(
                    "apply",
                    "components.div.children.formwizardFirstStep.children.PropertyDetailsNoId.children.cardContent.children.propertyDetailsNoId.children.holderDetails.children.usageCategory.props",
                    "data",
                    meteredPermanent
                  )
                );
              }else{
                dispatch(
                  handleField(
                    "apply",
                    "components.div.children.formwizardFirstStep.children.PropertyDetailsNoId.children.cardContent.children.propertyDetailsNoId.children.holderDetails.children.usageCategory.props",
                    "data",
                    nonMeteredPermanent
                  )
                );
              }
            break;
          default:
              dispatch(
                handleField(
                  "apply",
                  "components.div.children.formwizardFirstStep.children.PropertyDetailsNoId.children.cardContent.children.propertyDetailsNoId.children.holderDetails.children.usageCategory.props",
                  "data",
                  nonMeteredTemporory
                )
              );
            break;  
        }
      }
  }
  }),
  connectionType: getSelectField({
    label: {
      labelName: "Connection Type",
      labelKey: "WS_PROPERTY_CONNECTION_TYPE_LABEL"
    },
    placeholder: {
      labelName: "Select Connection Type",
      labelKey: "WS_PROPERTY_CONNECTION_TYPE_LABEL"
    },
    value:{ code: "METERED" },
    jsonPath: "applyScreen.connectionType",
    // required: true,
    localePrefix: {
      moduleName: "WS",
      masterName: "PROPTYPE"
    },
    data: [{ code: "METERED" }, { code: "NON METERED" }],
    afterFieldChange: (action, state, dispatch) => {
      if(action){
        const connectionCategory = get(state.screenConfiguration.preparedFinalObject, "applyScreen.connectionCategory", "")
        switch(action.value){
          case 'METERED':
            if(connectionCategory == "TEMPORARY"){
              dispatch(
                handleField(
                  "apply",
                  "components.div.children.formwizardFirstStep.children.PropertyDetailsNoId.children.cardContent.children.propertyDetailsNoId.children.holderDetails.children.usageCategory.props",
                  "data",
                  meteredTemporary
                )
              );
            }else{
              dispatch(
                handleField(
                  "apply",
                  "components.div.children.formwizardFirstStep.children.PropertyDetailsNoId.children.cardContent.children.propertyDetailsNoId.children.holderDetails.children.usageCategory.props",
                  "data",
                  meteredPermanent
                )
              );
            }
            break;
          case 'NON METERED' :
              if(connectionCategory == "TEMPORARY"){
                dispatch(
                  handleField(
                    "apply",
                    "components.div.children.formwizardFirstStep.children.PropertyDetailsNoId.children.cardContent.children.propertyDetailsNoId.children.holderDetails.children.usageCategory.props",
                    "data",
                    nonMeteredTemporory
                  )
                );
              }else{
                dispatch(
                  handleField(
                    "apply",
                    "components.div.children.formwizardFirstStep.children.PropertyDetailsNoId.children.cardContent.children.propertyDetailsNoId.children.holderDetails.children.usageCategory.props",
                    "data",
                    nonMeteredPermanent
                  )
                );
              }
            break;
          default:
              dispatch(
                handleField(
                  "apply",
                  "components.div.children.formwizardFirstStep.children.PropertyDetailsNoId.children.cardContent.children.propertyDetailsNoId.children.holderDetails.children.usageCategory.props",
                  "data",
                  nonMeteredTemporory
                )
              );
            break;  
        }
      }
  },
    gridDefination: {
      xs: 12,
      sm: 6
    }
  }),
  usageCategory: getSelectField({
    label: {
      labelName: "Usage Category",
      labelKey: "WS_SELECT_USAGE_TYPE_LABEL"
    },
    placeholder: {
      labelName: "Select Usage Category",
      labelKey: "WS_SELECT_USAGE_TYPE_PLACEHOLDER"
    },
    data: [],
    jsonPath: "applyScreen.usageCategory",
    // required: true,
    localePrefix: {
      moduleName: "WS",
      masterName: "PROPTYPE"
    },
    afterFieldChange: (action, state, dispatch) => {
      if(action.value){
        if(action.value == 'Domestic'){
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.PropertyDetailsNoId.children.cardContent.children.propertyDetailsNoId.children.holderDetails.children.apartment",
              "visible",
              true
            )
          );
        }else{
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.PropertyDetailsNoId.children.cardContent.children.propertyDetailsNoId.children.holderDetails.children.apartment",
              "visible",
              false
            )
          );
        } 
      }
  },
    gridDefination: {
      xs: 12,
      sm: 6
    }
  }),

  noOfFlats: getTextField({
    label: {
      labelName: "No of Flats",
      labelKey: "WS_PROPERTY_NO_OF_FLATS_LABEL"
    },
    placeholder: {
      labelName: "Enter No of Flats.",
      labelKey: "WS_PROPERTY_NO_OF_FLATS_PLACEHOLDER"
    },
    visible:false,
    jsonPath: "applyScreen.noOfFlats",
    gridDefination: {
      xs: 12,
      sm: 6
    },
  }),

});

export const getPropertyDetailsNoId = (isEditable = true) => {
  return getCommonContainer({
    headerDiv: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      props: {
        style: { marginBottom: "10px" }
      },
      children: {
        header: {
          gridDefination: {
            xs: 12,
            sm: 10
          }
        },
      }
    },
    holderDetails: propertyDetailsNoId
  });
};

export const getPropertyIDDetails = (isEditable = true) => {
  return getCommonContainer({
    headerDiv: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      props: {
        style: { marginBottom: "10px" }
      },
      children: {
        header: {
          gridDefination: {
            xs: 12,
            sm: 10
          }
        }
      }
    },
    viewTwo: propertyDetails
  });
};


