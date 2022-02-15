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
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { httpRequest } from "egov-ui-kit/utils/api";
import { propertySearchApiCall } from './functions';
import { handlePropertySubUsageType, handleNA, resetFieldsForApplication } from '../../utils';
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {getTranslatedLabel} from "egov-ui-kit/utils/commons"
import { serviceConst } from "../../../../../ui-utils/commons";

let isMode = getQueryArg(window.location.href, "mode");

isMode = (isMode) ? isMode.toUpperCase() : "";
let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
let connectionNumber = getQueryArg(window.location.href, "connectionNumber");
let tenantId = getQueryArg(window.location.href, "tenantId");
let tenantForLocality = tenantId && tenantId.toUpperCase()
let action = getQueryArg(window.location.href, "action");
let modeaction = getQueryArg(window.location.href, "modeaction");

let mode = getQueryArg(window.location.href, "mode");

export const meteredPermanent = [{code: "DOMESTIC"},{code: "INDUSTRIAL"},{code: "COMMERCIAL"},{code:"INSTITUTIONAL"},{code:"BPL"},{code:"ASSOCIATION"}]
export const meteredTemporary = [{code:"WSFCB"},{code: "DOMESTIC"}]
export const nonMeteredPermanent = [{code:"DOMESTIC"},{code:"BPL"},
{code:"SPMA"},{code:"ASSOCIATION"}]
export const nonMeteredTemporory = [{code:"WSFCB"},{code:"BPL"},{code:"ROADSIDEEATERS"},{code:"SPMA"}]

export const temporary = [{code: "DOMESTIC"}, {code:"WSFCB"},{code:"BPL"},{code:"ROADSIDEEATERS"},{code:"SPMA"}]
export const permanent = [{code: "DOMESTIC"},{code: "INSTITUTIONAL"},{code: "INDUSTRIAL"},{code: "COMMERCIAL"},
, {code:"BPL"},{code:"ASSOCIATION"}, {code:"SPMA"} ]
export const seweragepermanent = [{code: "DOMESTIC"},{code: "INSTITUTIONAL"},{code: "INDUSTRIAL"},{code: "COMMERCIAL"},
, {code:"BPL"}]
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
  labelKey: "WS_COMMON_PROP_DETAIL_NOT_MANDATORY",
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
  // clickHereLink: {
  //   uiFramework: "custom-atoms-local",
  //   moduleName: "egov-wns",
  //   componentPath: "AddLinkForProperty",
  //   props: { url: modifyLink, isMode },
  //   gridDefination: { xs: 12, sm: 4, md: 4 }
  // }
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
  city: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-wns",
      componentPath: "AutosuggestContainer",
      props: {
        className: "autocomplete-dropdown",
        suggestions: [],
        label: {
          labelName: "City",
          labelKey: "CORE_COMMON_CITY"
        },
        placeholder: {
          labelName: "Select City",
          labelKey: "PT_COMMONS_SELECT_PLACEHOLDER"
        },
        data: [],
        localePrefix: {
          moduleName: "TENANT",
          masterName: "TENANTS"
        },
        jsonPath: "applyScreen.tenantId",
        sourceJsonPath: "applyScreenMdmsData.tenant.citymodule",
        labelsFromLocalisation: true,
        required: true,
        disabled:false,
        isClearable: true,
        inputLabelProps: {
          shrink: true
        }
      },
      data: [],
      required: true,
      jsonPath: "applyScreen.tenantId",
      sourceJsonPath: "applyScreenMdmsData.tenant.citymodule",
      gridDefination: {
        xs: 12,
        sm: 6
      },
      afterFieldChange:async (action, state, dispatch) => {
        if(action.value){
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.PropertyDetailsNoId.children.cardContent.children.propertyDetailsNoId.children.holderDetails.children.mohalla.props.localePrefix",
              "moduleName",
              action.value.toUpperCase()
            )
          );

          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewConnDetails.children.cardContent.children.viewOne.props.scheama.children.cardContent.children.getPropertyDetailsContainer.children.mohalla.children.value1.children.key.props.localePrefix",
              "moduleName",
              action.value.toUpperCase()
            )
          );
          
          const dataFetchConfig = {
            url: "egov-location/location/v11/boundarys/_search?hierarchyTypeCode=REVENUE&boundaryType=Locality",
            action: "",
            queryParams: [{
              key: "tenantId",
              value: action.value
            }],
            requestBody: {},
            isDependent: true,
            hierarchyType: "REVENUE"
          }
          let url = dataFetchConfig.url
          let fieldKey = "mohalla"
          try {
            if (url) {
              let localizationLabels = {};
              if (state && state.app) localizationLabels = (state.app && state.app.localizationLabels) || {};
              const payloadSpec = await httpRequest(url, dataFetchConfig.action, dataFetchConfig.queryParams || [], dataFetchConfig.requestBody);
              const dropdownData = true
                ? // ? jp.query(payloadSpec, dataFetchConfig.dataPath)
                payloadSpec.TenantBoundary[0].boundary
                : dataFetchConfig.dataPath.reduce((dropdownData, path) => {
                  dropdownData = [...dropdownData, ...get(payloadSpec, path)];
                  return dropdownData;
                }, []);
                const ddData =
                dropdownData &&
                dropdownData.length > 0 &&
                dropdownData.reduce((ddData, item) => {
                  let option = {};
                  if (fieldKey === "mohalla" && item.code) {
                    const mohallaCode = `${dataFetchConfig.queryParams[0].value.toUpperCase().replace(/[.]/g, "_")}_${dataFetchConfig.hierarchyType}_${item.code
                      .toUpperCase()
                      .replace(/[._:-\s\/]/g, "_")}`;
                    option = {
                      // label: getTranslatedLabel(mohallaCode, localizationLabels),
                      // value: getTranslatedLabel(mohallaCode, localizationLabels),
                      code: item.code,
                    };

                  } else {
                    option = {
                      label: item.name,
                      value: item.code,
                    };
                  }
                  // item.area && (option.area = item.area);
                  ddData.push(option);
                  return ddData;
                }, []);
              // dispatch(setFieldProperty(formKey, fieldKey, "dropDownData", ddData));
                dispatch(prepareFinalObject("applyScreenMdmsData.mohalla", ddData));
            }
          }
          catch (error) {
            const { message } = error;
            console.log(error);
            if (fieldKey === "mohalla") {
              dispatch(
                toggleSnackbarAndSetText(
                  true,
                  { labelName: "There is no admin boundary data available for this tenant", labelKey: "ERR_NO_ADMIN_BOUNDARY_FOR_TENANT" },
                  "error"
                )
              );
            } else {
              dispatch(toggleSnackbarAndSetText(true, { labelName: message, labelKey: message }, "error"));
            }
            return;
          }

          if(action.value){
            let mdmsBody = {
              MdmsCriteria: {
                tenantId: action.value,
                moduleDetails: [
                  {
                    "moduleName": "Ward",
                    "masterDetails": [
                      {
                        "name": "Ward"
                      }
                    ]
                  }
                ]
              }
            };
            const response = await httpRequest("/egov-mdms-service/v1/_search", "_search", [], mdmsBody);
            const wardData =
            response && response.MdmsRes['Ward']['Ward'] && response.MdmsRes['Ward']['Ward'].map(ward => {
              return {
                ...ward,
                name:ward.code,
                value:ward.code,
                label:ward.code,
                code:ward.code
              }
            })
            dispatch(prepareFinalObject("applyScreenMdmsData.ward",wardData))
          }
        }
      }
    },

  // city: getSelectField({
  //   label: {
  //     labelName: "City",
  //     labelKey: "CORE_COMMON_CITY"
  //   },
  //   placeholder: {
  //     labelName: "Select City",
  //     labelKey: "PT_COMMONS_SELECT_PLACEHOLDER"
  //   },
  //   data: [],
  //   jsonPath: "applyScreen.tenantId",
  //   sourceJsonPath: "applyScreenMdmsData.tenant.tenants",
  //   localePrefix: { moduleName: "tenant", masterName: "tenants" },
  //   gridDefination: {
  //     xs: 12,
  //     sm: 6
  //   },
  //   afterFieldChange:async (action, state, dispatch) => {
  //     if(action.value){
  //       const dataFetchConfig = {
  //         url: "egov-location/location/v11/boundarys/_search?hierarchyTypeCode=REVENUE&boundaryType=Locality",
  //         action: "",
  //         queryParams: [{
  //           key: "tenantId",
  //           value: action.value
  //         }],
  //         requestBody: {},
  //         isDependent: true,
  //         hierarchyType: "REVENUE"
  //       }
  //       let url = dataFetchConfig.url
  //       let fieldKey = "mohalla"
  //       try {
  //         if (url) {
  //           let localizationLabels = {};
  //           if (state && state.app) localizationLabels = (state.app && state.app.localizationLabels) || {};
  //           const payloadSpec = await httpRequest(url, dataFetchConfig.action, dataFetchConfig.queryParams || [], dataFetchConfig.requestBody);
  //           const dropdownData = true
  //             ? // ? jp.query(payloadSpec, dataFetchConfig.dataPath)
  //             payloadSpec.TenantBoundary[0].boundary
  //             : dataFetchConfig.dataPath.reduce((dropdownData, path) => {
  //               dropdownData = [...dropdownData, ...get(payloadSpec, path)];
  //               return dropdownData;
  //             }, []);
  //             const ddData =
  //             dropdownData &&
  //             dropdownData.length > 0 &&
  //             dropdownData.reduce((ddData, item) => {
  //               let option = {};
  //               if (fieldKey === "mohalla" && item.code) {
  //                 option = {
  //                   label: item.name,
  //                   code: item.name,
  //                   // label: getTranslatedLabel(mohallaCode, localizationLabels),
  //                   value: item.name,
  //                 };
  //               } else {
  //                 option = {
  //                   label: item.name,
  //                   value: item.code,
  //                 };
  //               }
  //               item.area && (option.area = item.area);
  //               ddData.push(option);
  //               return ddData;
  //             }, []);
  //           // dispatch(setFieldProperty(formKey, fieldKey, "dropDownData", ddData));
  //             dispatch(prepareFinalObject("applyScreenMdmsData.mohalla", ddData));
  //         }
  //       }
  //       catch (error) {
  //         const { message } = error;
  //         console.log(error);
  //         if (fieldKey === "mohalla") {
  //           dispatch(
  //             toggleSnackbarAndSetText(
  //               true,
  //               { labelName: "There is no admin boundary data available for this tenant", labelKey: "ERR_NO_ADMIN_BOUNDARY_FOR_TENANT" },
  //               "error"
  //             )
  //           );
  //         } else {
  //           dispatch(toggleSnackbarAndSetText(true, { labelName: message, labelKey: message }, "error"));
  //         }
  //         return;
  //       }
  //     }
  //   }
  // }),
  mohalla: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-wns",
    componentPath: "AutosuggestContainer",
    props: {
      className: "autocomplete-dropdown",
      suggestions: [],
      label: {
        labelName: "Mohalla",
        labelKey: "PT_PROPERTY_DETAILS_MOHALLA"
      },
      placeholder: {
        labelName: "Locality",
        labelKey: "PT_PROPERTY_DETAILS_PLACEHOLDER"
      },
      data: [],
      // optionValue: "code",
      // optionLabel: "label",
      localePrefix: {
        moduleName: tenantForLocality,
        masterName: "REVENUE"
      },
      jsonPath: "applyScreen.locality",
      sourceJsonPath: "applyScreenMdmsData.mohalla",
      labelsFromLocalisation: true,
      required: true,
      disabled:false,
      isClearable: true,
      inputLabelProps: {
        shrink: true
      }
    },
    data: [],
    required: true,
    jsonPath: "applyScreen.locality",
    sourceJsonPath: "applyScreenMdmsData.mohalla",
    gridDefination: {
      xs: 12,
      sm: 6
    }
  },
  // mohalla: getSelectField({
  //   label: {
  //     labelName: "Mohalla",
  //     labelKey: "PT_PROPERTY_DETAILS_MOHALLA"
  //   },
  //   placeholder: {
  //     labelName: "Locality",
  //     labelKey: "PT_PROPERTY_DETAILS_PLACEHOLDER"
  //   },
  //   data: [],
  //   optionValue: "code",
  //   optionLabel: "label",
  //   jsonPath: "applyScreen.locality",
  //   sourceJsonPath: "applyScreenMdmsData.mohalla",
  //   gridDefination: {
  //     xs: 12,
  //     sm: 6
  //   }

  // }),
  ward: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-wns",
    componentPath: "AutosuggestContainer",
    props: {
      className: "autocomplete-dropdown",
      suggestions: [],
      label: {
        labelName: "Ward",
        labelKey: "WS_WARD_LABEL"
      },
      placeholder: {
        labelName: "Select Ward",
        labelKey: "WS_WARD_PLACEHOLDER"
      },
      data: [],
      optionValue: "code",
      optionLabel: "label",
      jsonPath: "applyScreen.ward",
      sourceJsonPath: "applyScreenMdmsData.ward",
      labelsFromLocalisation: true,
      required: true,
      disabled:false,
      isClearable: true,
      inputLabelProps: {
        shrink: true
      }
    },
    data: [],
    required: true,
    jsonPath: "applyScreen.ward",
    sourceJsonPath: "applyScreenMdmsData.mohalla",
    gridDefination: {
      xs: 12,
      sm: 6
    }
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
        const water = get(state.screenConfiguration.preparedFinalObject,"applyScreen.water",false)
        const sewerage = get(state.screenConfiguration.preparedFinalObject,"applyScreen.sewerage",false)

        if(water || (water && sewerage)){
          switch(action.value){
            case 'TEMPORARY':
              if(meteredNonMetered == "Metered"){
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
                if(meteredNonMetered == "Metered"){
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
        }else{
          switch(action.value){
            case 'TEMPORARY':
                dispatch(
                  handleField(
                    "apply",
                    "components.div.children.formwizardFirstStep.children.PropertyDetailsNoId.children.cardContent.children.propertyDetailsNoId.children.holderDetails.children.usageCategory.props",
                    "data",
                    temporary
                  )
                );

              break;
            case 'PERMANENT' :
                  dispatch(
                    handleField(
                      "apply",
                      "components.div.children.formwizardFirstStep.children.PropertyDetailsNoId.children.cardContent.children.propertyDetailsNoId.children.holderDetails.children.usageCategory.props",
                      "data",
                      permanent
                    )
                  );
              break;
            default:
                dispatch(
                  handleField(
                    "apply",
                    "components.div.children.formwizardFirstStep.children.PropertyDetailsNoId.children.cardContent.children.propertyDetailsNoId.children.holderDetails.children.usageCategory.props",
                    "data",
                    temporary
                  )
                );
              break;
          }
        }

          if(!water && sewerage){
            dispatch(
              handleField(
                "apply",
                "components.div.children.formwizardFirstStep.children.PropertyDetailsNoId.children.cardContent.children.propertyDetailsNoId.children.holderDetails.children.usageCategory.props",
                "data",
                seweragepermanent
              )
            );
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
    jsonPath: "applyScreen.connectionType",
    visible: true,
    localePrefix: {
      moduleName: "WS",
      masterName: "PROPTYPE"
    },
    data: [{ code: "Metered",name:'Metered' }, { code: "Non Metered",name:'Non Metered' }],
    afterFieldChange: (action, state, dispatch) => {
      const edit = getQueryArg(window.location.href, "action");
      const applicationNumber = getQueryArg(window.location.href, "action");
      let connectionFacility = get(state.screenConfiguration.preparedFinalObject, "applyScreen.connectionFacility") || 
      get(state.screenConfiguration.preparedFinalObject, "WaterConnection[0].connectionFacility")
      // only while creating application from employee side
      if(process.env.REACT_APP_NAME != "Citizen" && !applicationNumber){
        dispatch(
          handleField(
            "apply",
            `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.activeDetails.children.isInstallmentApplicable`,
            "visible",
            false
          )
        );
        if(action && action.value == 'Non Metered'){
          dispatch(
            handleField(
              "apply",
              `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterID`,
              "visible",
              false
            )
          );
          dispatch(
            handleField(
              "apply",
              `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterInstallationDate`,
              "visible",
              false
            )
          );
          dispatch(
            handleField(
              "apply",
              `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.initialMeterReading`,
              "visible",
              false
            )
          );
          dispatch(
            handleField(
              "apply",
              `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterMake`,
              "visible",
              false
            )
          );
          dispatch(
            handleField(
              "apply",
              `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterReadingRatio`,
              "visible",
              false
            )
          );
        }else{
          dispatch(
            handleField(
              "apply",
              `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterID`,
              "visible",
              true
            )
          );
          dispatch(
            handleField(
              "apply",
              `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterInstallationDate`,
              "visible",
              true
            )
          );
          dispatch(
            handleField(
              "apply",
              `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.initialMeterReading`,
              "visible",
              true
            )
          );
          dispatch(
            handleField(
              "apply",
              `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterMake`,
              "visible",
              true
            )
          );
          dispatch(
            handleField(
              "apply",
              `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterReadingRatio`,
              "visible",
              true
            )
          );
        }
      }
      if(action){
        if(action.value == 'Metered' && edit == 'edit'){
          dispatch(
            handleField(
              "apply",
              `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.activeDetails.children.isLabourFeeApplicable`,
              "visible",
              true
            )
          );
          dispatch(
            handleField(
              "apply",
              `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.activeDetails.children.isInstallmentApplicable`,
              "visible",
              true
            )
          );
          dispatch(
            handleField(
              "apply",
              `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterMake`,
              "visible",
              true
            )
          );
          dispatch(
            handleField(
              "apply",
              `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterReadingRatio`,
              "visible",
              true
            )
          );
        }
        let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
        if(action.value == 'Non Metered' && edit == 'edit'){
          dispatch(
            handleField(
              "apply",
              `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterMake`,
              "visible",
              false
            )
          );
          dispatch(
            handleField(
              "apply",
              `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterReadingRatio`,
              "visible",
              false
            )
          );
        }

        if(action.value == 'Non Metered' && applicationNumber && (applicationNumber.includes('SW') || 
        connectionFacility == serviceConst.SEWERAGE)){
          dispatch(
            handleField(
              "apply",
              `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.activeDetails.children.isLabourFeeApplicable`,
              "visible",
              false
            )
          );
          dispatch(
            handleField(
              "apply",
              `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.activeDetails.children.isInstallmentApplicable`,
              "visible",
              false
            )
          );
        }
        const connectionCategory = get(state.screenConfiguration.preparedFinalObject, "applyScreen.connectionCategory", "")
        const water = get(state.screenConfiguration.preparedFinalObject,"applyScreen.water",false)
        if(water){
          switch(action.value){
            case 'Metered':
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
            case 'Non Metered' :
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
        if(action.value == 'DOMESTIC' || action.value == 'COMMERCIAL'){
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.PropertyDetailsNoId.children.cardContent.children.propertyDetailsNoId.children.holderDetails.children.apartment",
              "visible",
              true
            )
          );
          dispatch(
            handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.PropertyDetailsNoId.children.cardContent.children.propertyDetailsNoId.children.holderDetails.children.noOfFlats",
            "visible",
            true
          ));
        }else{
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.PropertyDetailsNoId.children.cardContent.children.propertyDetailsNoId.children.holderDetails.children.apartment",
              "visible",
              false
            )
          );
          dispatch(
            handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.PropertyDetailsNoId.children.cardContent.children.propertyDetailsNoId.children.holderDetails.children.noOfFlats",
            "visible",
            false
          ));
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
    value:0,
    visible:false,
    jsonPath: "applyScreen.noOfFlats",
    gridDefination: {
      xs: 12,
      sm: 6
    },
  }),
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
      disabled:false,
      jsonPath: "applyScreen.apartment",
      required: false,
      isChecked: true,
      isApartment:true
    },
    type: "array",
    jsonPath: "applyScreen.apartment",
  }


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


