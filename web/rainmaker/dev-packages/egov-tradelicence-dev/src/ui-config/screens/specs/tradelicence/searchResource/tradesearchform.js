import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getSelectField,
  getCommonContainer,
  getCommonParagraph,
  getPattern,
  getDateField,
  getLabel,
  getCommonGrayCard,
  getCommonSubHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { searchApiCallForTradeSearch } from "./functions";
import {
  prepareFinalObject as pFO,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getIconStyle,
  objectToDropdown,
  getFinancialYearDates,
  getNextMonthDateInYMD,
  setFilteredTradeTypes,
  getUniqueItemsFromArray,
  fillOldLicenseData,
  getTradeTypeDropdownData,
  updateMdmsDropDowns,
  updateStructureTypes,
  convertDateToEpoch
} from "../../utils";

const tradeTypeChange = (reqObj) => {
  try {
    let { dispatch, index } = reqObj;
    dispatch(pFO(`Licenses[0].tradeLicenseDetail.tradeUnits[${index}].tradeType`, ''));
  } catch (e) {
    console.log(e);
  }
}

const tradeSubTypeChange = (reqObj) => {
  //This function is just backup of TradeUOM as select Box. And user will choose applicable option from drop box
  try {
    let { moduleName, rootBlockSub, keyValue, value, state, dispatch, index } = reqObj;
    let keyValueRow = keyValue.replace(`.${value}`, ``);




    dispatch(pFO(`searchScreen.tradeType`, value));


  } catch (e) {
    console.log(e);
  }
}
const tradeUnitCard = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  //moduleName: "egov-tradelicence",

  props: {
    hasAddItem: false,
    scheama: getCommonGrayCard({

      tradeUnitCardContainer: getCommonContainer(
        {
          dynamicMdms: {
            uiFramework: "custom-containers",
            componentPath: "DynamicMdmsContainer",
            props: {
              dropdownFields: [
                
                {
                  key: 'tradeType',
                  fieldType: "autosuggest",
                  className: "applicant-details-error autocomplete-dropdown",
                  callBack: tradeTypeChange,
                  isRequired: false,
                  requiredValue: true,
                  isDisabled: false,
                  

                },
                {
                  key: 'tradeSubType',
                  callBack: tradeSubTypeChange,
                  className: "applicant-details-error autocomplete-dropdown",
                  fieldType: "autosuggest",
                  isRequired: false,
                  requiredValue: true,
                  isDisabled: false,
                  gridDefination: {
                    xs: 12,
                    sm: 4
                  },
                }
              ],
              moduleName: "TradeLicense",
              masterName: "TradeType",
              rootBlockSub: 'tradeUnits',
              filter: "[?(@.type=='TL')]",
              screenName: "tradeSearchPage"
              //callBackEdit: updateMdmsDropDowns,
              //isDependency : "DynamicMdms.common-masters.structureTypes.selectedValues[0].structureSubType"
            }
          },

        },
        {
          style: {
            overflow: "visible" 
          }
        }
      )
    }),
    items: [],

    // headerName: "TradeUnits",
    // headerJsonPath:
    //   "children.cardContent.children.header.children.head.children.Accessories.props.label",
    // sourceJsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits",
    // prefixSourceJsonPath:
    //   "children.cardContent.children.tradeUnitCardContainer.children",
    // onMultiItemAdd: (state, muliItemContent) => {
    //   return setFieldsOnAddItem(state, muliItemContent);
    // }
  },
  type: "array"
};

export const tradeSearchForm = getCommonGrayCard({
  subHeader: getCommonTitle({
    labelName: "Search Trade License Application",
    labelKey: "TL_HOME_SEARCH_RESULTS_HEADING"
  }),
  subParagraph: getCommonParagraph({
    labelName: "Provide at least one parameter to search for an application",
    labelKey: "TL_HOME_SEARCH_RESULTS_DESC"
  }),
  appTradeAndMobNumContainer: getCommonContainer({
    tradeLocCity: {
      ...getSelectField({
        label: {
          labelName: "City",
          labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL"
        },
        localePrefix: {
          moduleName: "TENANT",
          masterName: "TENANTS"
        },
        optionLabel: "name",
        placeholder: { labelName: "Select City", labelKey: "TL_SELECT_CITY" },
        sourceJsonPath: "applyScreenMdmsData.searchScreen.tenants",
        jsonPath: "searchScreen.tenantId",
        gridDefination: {
          xs: 12,
          sm: 4
        },
        required: true,
        style: {paddingLeft: "24px !important"},
        props: {
          required: true,
          style: {paddingLeft: "24px !important"},
        }
      }),

    },

    applicationType: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-tradelicence",
      componentPath: "AutosuggestContainer",
      jsonPath:
        "searchScreen.applicationType",
      sourceJsonPath: "applyScreenMdmsData.searchScreen.applicationType",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      props: {
        className: "applicant-details-error autocomplete-dropdown",
        labelsFromLocalisation: true,
        suggestions: [],
        jsonPath:
          "searchScreen.applicationType",
        sourceJsonPath: "applyScreenMdmsData.searchScreen.applicationType",
        label: {
          labelName: "Application Type",
          labelKey: "TL_APPLICATION_TYPE_LABEL"
        },
        placeholder: {
          labelName: "Select Application Type",
          labelKey: "TL_APPLICATION_TYPE_PLACEHOLDER"
        },
        localePrefix: {
          moduleName: "TradeLicense",
          masterName: "ApplicationType"
        },
        fullwidth: true,
        required: false,
        isClearable: true,
        inputLabelProps: {
          shrink: true
        }
      }
    },
    

  }),
  
  tradeUnitCard,
  applicationTypeAndToFromDateContainer: getCommonContainer({
    
    tlType: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-tradelicence",
      componentPath: "AutosuggestContainer",
      jsonPath:
        "searchScreen.licenseType",
      sourceJsonPath: "applyScreenMdmsData.searchScreen.tlType",
      gridDefination: {
        xs: 12,
        sm: 4
      },
      props: {
        className: "applicant-details-error autocomplete-dropdown",
        labelsFromLocalisation: true,
        suggestions: [],
        jsonPath:
          "searchScreen.licenseType",
        sourceJsonPath: "applyScreenMdmsData.searchScreen.tlType",
        label: {
          labelName: "Application Type",
          labelKey: "TL_LICENSE_TYPE_LABEL"
        },
        placeholder: {
          labelName: "Select Application Type",
          labelKey: "TL_LICENSE_TYPE_PLACEHOLDER"
        },
        localePrefix: {
          moduleName: "TradeLicense",
          masterName: "LicenseType"
        },
        fullwidth: true,
        required: false,
        isClearable: true,
        inputLabelProps: {
          shrink: true
        }
      }
    },


  }),


  button: getCommonContainer({
    // firstCont: {

    buttonContainer: getCommonContainer({
      firstCont: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 12,
          sm: 4
        }
      },
      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 4
        },
        props: {
          variant: "contained",
          style: {
            color: "white",

            backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
            borderRadius: "2px",
            width: "80%",
            height: "48px"
          }
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Search",
            labelKey: "TL_HOME_SEARCH_RESULTS_BUTTON_SEARCH"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: searchApiCallForTradeSearch
        }
      },
      lastCont: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 12,
          sm: 4
        }
      }
    })
  }),
},
  {
    style: {
      overflow: "visible"
    },
  });
