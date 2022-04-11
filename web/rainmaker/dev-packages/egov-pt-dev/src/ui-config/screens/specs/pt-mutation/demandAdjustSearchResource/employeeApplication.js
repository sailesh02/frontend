import {
    getCommonCard,
    getCommonTitle,
    getTextField,
    getSelectField,
    getCommonContainer,
    getCommonParagraph,
    getPattern,
    getLabel
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { applicationSearch, resetFields } from "./functions.js";
 
  
  export const PTApplication = getCommonCard({
    subHeader: getCommonTitle({
      labelKey: "SEARCH_PROPERTY"
    }),
    subParagraph: getCommonParagraph({
      labelKey: "PT_HOME_SEARCH_RESULTS_DESC"
    }),
    ptApplicationContainer: getCommonContainer({
        ulbCity: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-pt",
            componentPath: "AutosuggestContainer",
            props: {
              className: "autocomplete-dropdown",
              suggestions: [],
              label: {
                labelName: "ULB",
                labelKey: "PT_ULB_CITY"
              },
              placeholder: {
                labelName: "Select ULB",
                labelKey: "PT_ULB_CITY_PLACEHOLDER"
              },
              localePrefix: {
                moduleName: "TENANT",
                masterName: "TENANTS"
              },
              jsonPath: "ptDemandsSearchScreen.tenantId",
              sourceJsonPath: "searchScreenMdmsData.tenant.tenants",
              labelsFromLocalisation: true,
              required: true,
              isClearable: true,
              disabled: process.env.REACT_APP_NAME === "Citizen" ? false : true,
              inputLabelProps: {
                shrink: true
              }
            },
            required: true,
            jsonPath: "ptDemandsSearchScreen.tenantId",
            sourceJsonPath: "searchScreenMdmsData.tenant.tenants",
            gridDefination: {
              xs: 12,
              sm: 4
            }
          },
      
      
          propertyTaxUniqueId: getTextField({
            label: {
              labelName: "Property Tax Unique Id",
              labelKey: "PT_PROPERTY_UNIQUE_ID"
            },
            placeholder: {
              labelName: "Enter Property Tax Unique Id",
              labelKey: "PT_PROPERTY_UNIQUE_ID_PLACEHOLDER"
            },
            gridDefination: {
              xs: 12,
              sm: 4,
      
            },
            required: false,
            pattern: /^[a-zA-Z0-9-]*$/i,
            errorMessage: "ERR_INVALID_PROPERTY_ID",
            jsonPath: "ptDemandsSearchScreen.ids"
          }),
          existingPropertyId: getTextField({
            label: {
              labelName: "Existing Property ID",
              labelKey: "PT_EXISTING_PROPERTY_ID"
            },
            placeholder: {
              labelName: "Enter Existing Property ID",
              labelKey: "PT_EXISTING_PROPERTY_ID_PLACEHOLDER"
            },
            gridDefination: {
              xs: 12,
              sm: 4,
      
            },
            required: false,
            pattern:/^[a-zA-Z0-9-\/]*$/i,
            errorMessage: "ERR_INVALID_PROPERTY_ID",
            jsonPath: "ptDemandsSearchScreen.oldpropertyids"
          })
    
      
    }),
  
    button: getCommonContainer({
        buttonContainer: getCommonContainer({
          resetButton: {
            componentPath: "Button",
            gridDefination: {
              xs: 12,
              sm: 6
              // align: "center"
            },
            props: {
              variant: "outlined",
              style: {
                color: "black",
                borderColor: "black",
                width: "220px",
                height: "48px",
                margin: "8px",
                float: "right"
              }
            },
            children: {
              buttonLabel: getLabel({
                labelName: "Reset",
                labelKey: "PT_HOME_RESET_BUTTON"
              })
            },
            onClickDefination: {
              action: "condition",
              callBack: resetFields
            }
          },
          searchButton: {
            componentPath: "Button",
            gridDefination: {
              xs: 12,
              sm: 6
              // align: "center"
            },
            props: {
              variant: "contained",
              style: {
                color: "white",
                margin: "8px",
                backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
                borderRadius: "2px",
                width: "220px",
                height: "48px"
              }
            },
            children: {
              buttonLabel: getLabel({
                labelName: "Search",
                labelKey: "PT_HOME_SEARCH_RESULTS_BUTTON_SEARCH"
              })
            },
            onClickDefination: {
              action: "condition",
              callBack: applicationSearch
            }
          }
        })
      })
  });