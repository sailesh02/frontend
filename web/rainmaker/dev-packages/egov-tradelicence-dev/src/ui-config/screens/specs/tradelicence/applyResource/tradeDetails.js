import {
  getCommonCard,
  getCommonGrayCard,
  getCommonTitle,
  getCommonSubHeader,
  getTextField,
  getDateField,
  getSelectField,
  getCommonContainer,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
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
import {
  prepareFinalObject as pFO,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg, getTodaysDateInYMD } from "egov-ui-framework/ui-utils/commons";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import filter from "lodash/filter";
import "./index.css";

const getCurrentDate = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + '-' + mm + '-' + dd;
  return today;
}
const tradeCategoryChange = (reqObj) => {
  try {
    let { dispatch, index } = reqObj;
    dispatch(pFO(`Licenses[0].tradeLicenseDetail.tradeUnits[${index}].tradeType`, ''));
  } catch (e) {
    console.log(e);
  }
}

const tradeTypeChange = (reqObj) => {
  try {
    let { dispatch, index } = reqObj;
    dispatch(pFO(`Licenses[0].tradeLicenseDetail.tradeUnits[${index}].tradeType`, ''));
  } catch (e) {
    console.log(e);
  }
}

const setTempTLUOMValue = (reqObj) => {
  let { moduleName, rootBlockSub, keyValue, value, state, dispatch, index } = reqObj;
  let queryObject = JSON.parse(
    JSON.stringify(
      get(state.screenConfiguration.preparedFinalObject, "Licenses", [])
    )
  );
  let validTo = get(queryObject[0], "validTo");
  let tlType = get(queryObject[0], "licenseType");

  let tlcommencementDate = get(queryObject[0], "commencementDate");
  tlcommencementDate = convertDateToEpoch(
    tlcommencementDate,
    "daystart"
  );
  validTo = convertDateToEpoch(
    validTo,
    "dayend"
  );

  if (validTo && tlcommencementDate) {

    //var date1 = new Date(tlcommencementDate);
    var date2 = new Date(validTo);
    // To calculate the time difference of two dates

    var Difference_In_Time = date2.getTime() - new Date(tlcommencementDate).getTime();

    // To calculate the no. of days between two dates
    var Difference_In_Days = Math.ceil((((Difference_In_Time / 1000) / 60) / 60) / 24);



    dispatch(
      handleField(
        "apply",
        `components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeUnitCard.props.items[${index}].item${index}.children.cardContent.children.tradeUnitCardContainer.children.tradeUOMValue`,
        "props.value",
        Difference_In_Days
      )
    );


  }
}


const tradeSubTypeChange = (reqObj) => {
  try {
    let { moduleName, rootBlockSub, keyValue, value, state, dispatch, index } = reqObj;
    let keyValueRow = keyValue.replace(`.${value}`, ``);
    let tradeSubTypes = get(
      state.screenConfiguration.preparedFinalObject,
      `DynamicMdms.${moduleName}.${rootBlockSub}.${rootBlockSub}${keyValueRow}`,
      []
    );

    let queryObject = JSON.parse(
      JSON.stringify(
        get(state.screenConfiguration.preparedFinalObject, "Licenses", [])
      )
    );

    let tlType = get(queryObject[0], "licenseType");
    let currentObject = filter(tradeSubTypes, {
      code: value
    });


    if (currentObject[0] && currentObject[0].uom !== null && tlType && tlType === "PERMANENT") {


      dispatch(
        handleField(
          "apply",
          `components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeUnitCard.props.items[${index}].item${index}.children.cardContent.children.tradeUnitCardContainer.children.tradeUOM`,
          "props.value",
          currentObject[0].uom
        )
      );

      dispatch(
        handleField(
          "apply",
          `components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeUnitCard.props.items[${index}].item${index}.children.cardContent.children.tradeUnitCardContainer.children.tradeUOMValue`,
          "props.required",
          true
        )
      );
      dispatch(
        handleField(
          "apply",
          `components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeUnitCard.props.items[${index}].item${index}.children.cardContent.children.tradeUnitCardContainer.children.tradeUOMValue`,
          "props.disabled",
          false
        )
      );
    } else if (currentObject[0] && currentObject[0].uom !== null && tlType && tlType === "TEMPORARY") {

      dispatch(
        handleField(
          "apply",
          `components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeUnitCard.props.items[${index}].item${index}.children.cardContent.children.tradeUnitCardContainer.children.tradeUOM`,
          "props.value",
          currentObject[0].uom
        )
      );

      dispatch(
        handleField(
          "apply",
          `components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeUnitCard.props.items[${index}].item${index}.children.cardContent.children.tradeUnitCardContainer.children.tradeUOMValue`,
          "props.required",
          true
        )
      );
      dispatch(
        handleField(
          "apply",
          `components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeUnitCard.props.items[${index}].item${index}.children.cardContent.children.tradeUnitCardContainer.children.tradeUOMValue`,
          "props.disabled",
          true
        )
      );

      setTempTLUOMValue(reqObj);


    } else {

      dispatch(
        handleField(
          "apply",
          `components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeUnitCard.props.items[${index}].item${index}.children.cardContent.children.tradeUnitCardContainer.children.tradeUOMValue`,
          "props.required",
          false
        )
      );

      dispatch(
        handleField(
          "apply",
          `components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeUnitCard.props.items[${index}].item${index}.children.cardContent.children.tradeUnitCardContainer.children.tradeUOMValue`,
          "props.disabled",
          true
        )
      );

      dispatch(
        handleField(
          "apply",
          `components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeUnitCard.props.items[${index}].item${index}.children.cardContent.children.tradeUnitCardContainer.children.tradeUOM`,
          "props.value",
          ""
        )
      );
      dispatch(
        handleField(
          "apply",
          `components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeUnitCard.props.items[${index}].item${index}.children.cardContent.children.tradeUnitCardContainer.children.tradeUOMValue`,
          "props.value",
          ""
        )
      );

      dispatch(
        pFO(
          `Licenses[0].tradeLicenseDetail.tradeUnits[${index}].uom`,
          null
        )
      );
      dispatch(
        pFO(
          `Licenses[0].tradeLicenseDetail.tradeUnits[${index}].uomValue`,
          null
        )
      );
      dispatch(
        handleField(
          "apply",
          `components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeUnitCard.props.items[${index}].item${index}.children.cardContent.children.tradeUnitCardContainer.children.tradeUOMValue`,
          "props.error",
          false
        )
      );
    }
    dispatch(pFO(`Licenses[0].tradeLicenseDetail.tradeUnits[${index}].tradeType`, value));

    //dispatch(pFO(`Licenses[0].tradeLicenseDetail.tradeUnits[${index}].tempUom`, currentObject[0].tempUom));
  } catch (e) {
    console.log(e);
  }
}
const structureSubTypeChange = (reqObj) => {
  try {
    let { keyValue, value, dispatch } = reqObj;
    let keyValueRow = keyValue.replace(`.${value}`, ``);
    dispatch(pFO("Licenses[0].tradeLicenseDetail.structureType", value));
    dispatch(pFO("LicensesTemp[0].tradeLicenseDetail.structureType", keyValueRow));
  } catch (e) {
    console.log(e);
  }
}

const tradeUnitCard = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  //moduleName: "egov-tradelicence",

  props: {
    hasAddItem: true,
    scheama: getCommonGrayCard({
      header: getCommonSubHeader(
        {
          labelName: "Trade Unit  ",
          labelKey: "TL_NEW_TRADE_DETAILS_TRADE_UNIT_HEADER"
        },
        {
          style: {
            marginBottom: 18
          }
        }
      ),
      tradeUnitCardContainer: getCommonContainer(
        {
          dynamicMdms: {
            uiFramework: "custom-containers",
            componentPath: "DynamicMdmsContainer",
            props: {
              dropdownFields: [
                // {
                //   key : 'tradeCategory',
                //   fieldType : "autosuggest",
                //   className:"applicant-details-error autocomplete-dropdown",
                //   callBack: tradeCategoryChange,
                //   isRequired : false,
                //   requiredValue : true
                // },
                {
                  key: 'tradeType',
                  fieldType: "autosuggest",
                  className: "applicant-details-error autocomplete-dropdown",
                  callBack: tradeTypeChange,
                  isRequired: false,
                  requiredValue: true,
                  isDisabled: false

                },
                {
                  key: 'tradeSubType',
                  callBack: tradeSubTypeChange,
                  className: "applicant-details-error autocomplete-dropdown",
                  fieldType: "autosuggest",
                  isRequired: false,
                  requiredValue: true,
                  isDisabled: false
                }
              ],
              moduleName: "TradeLicense",
              masterName: "TradeType",
              rootBlockSub: 'tradeUnits',
              filter: "[?(@.type=='TL')]",
              callBackEdit: updateMdmsDropDowns,
              //isDependency : "DynamicMdms.common-masters.structureTypes.selectedValues[0].structureSubType"
            }
          },
          tradeUOM: getTextField({
            label: {
              labelName: "UOM (Unit of Measurement)",
              labelKey: "TL_NEW_TRADE_DETAILS_UOM_LABEL"
            },
            placeholder: {
              labelName: "UOM",
              labelKey: "TL_NEW_TRADE_DETAILS_UOM_UOM_PLACEHOLDER"
            },
            // required: true,
            props: {
              disabled: true
            },
            jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].uom",
            gridDefination: {
              xs: 12,
              sm: 6
            }
          }),

          // tradeUOM: {
          //   ...getSelectField({
          //     label: {
          //       labelName: "UOM (Unit of Measurement)",
          //       labelKey: "TL_NEW_TRADE_DETAILS_UOM_LABEL"
          //     },
          //     placeholder: {
          //       labelName: "Select applicable UOM",
          //       labelKey: "TL_NEW_TRADE_DETAILS_UOM_UOM_PLACEHOLDER"
          //     },
          //     required: false,
          //     jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].uom",
          //     props: {
          //       // disabled: true,
          //       value: "PERMANENT",
          //       className: "tl-trade-type"
          //     },
          //     sourceJsonPath: "applyScreenMdmsData.TradeLicense.UOMDropBoxValues"
          //   })
          // },
          tradeUOMValue: getTextField({
            label: {
              labelName: "UOM Value",
              labelKey: "TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL"
            },
            placeholder: {
              labelName: "Enter UOM Value",
              labelKey: "TL_NEW_TRADE_DETAILS_UOM_VALUE_PLACEHOLDER"
            },
            required: true,
            props: {
              disabled: true,
              setDataInField: true,
              jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].uomValue"
            },
            pattern: getPattern("UOMValue"),
            jsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits[0].uomValue",
            gridDefination: {
              xs: 12,
              sm: 6
            }
          })
        },
        {
          style: {
            overflow: "visible"
          }
        }
      )
    }),
    items: [],
    addItemLabel: {
      labelName: "ADD TRADE UNITS",
      labelKey: "TL_ADD_TRADE_UNITS"
    },
    headerName: "TradeUnits",
    headerJsonPath:
      "children.cardContent.children.header.children.head.children.Accessories.props.label",
    sourceJsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits",
    prefixSourceJsonPath:
      "children.cardContent.children.tradeUnitCardContainer.children",
    onMultiItemAdd: (state, muliItemContent) => {
      return setFieldsOnAddItem(state, muliItemContent);
    }
  },
  type: "array"
};

const accessoriesCard = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    scheama: getCommonGrayCard({
      header: {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        children: {
          head: getCommonSubHeader(
            {
              labelName: "Accessories",
              labelKey: "TL_NEW_TRADE_DETAILS_HEADER_ACC"
            },
            {
              style: {
                marginBottom: 18
              }
            }
          ),
          ico: {
            uiFramework: "custom-molecules-local",
            moduleName: "egov-tradelicence",
            componentPath: "Tooltip",
            props: {
              val: {
                value: "Accessories Information",
                key: "TL_ACCESSORIES_TOOLTIP_MESSAGE"
              },
              style: getIconStyle("headerIcon")
            }
          }
        }
      },
      accessoriesCardContainer: getCommonContainer({
        accessoriesName: {
          uiFramework: "custom-containers-local",
          moduleName: "egov-tradelicence",
          componentPath: "AutosuggestContainer",
          props: {
            className: "accesories-name-dropdown",
            label: {
              labelName: "Accessories",
              labelKey: "TL_NEW_TRADE_DETAILS_ACC_LABEL"
            },
            placeholder: {
              labelName: "Select Accessories",
              labelKey: "TL_NEW_TRADE_DETAILS_ACC_PLACEHOLDER"
            },
            localePrefix: {
              moduleName: "TRADELICENSE",
              masterName: "ACCESSORIESCATEGORY"
            },
            labelsFromLocalisation: true,
            required: false,
            isClearable: true,
            inputLabelProps: {
              shrink: true
            },
            jsonPath:
              "Licenses[0].tradeLicenseDetail.accessories[0].accessoryCategory",
            sourceJsonPath:
              "applyScreenMdmsData.TradeLicense.AccessoriesCategory",
          },
          jsonPath:
            "Licenses[0].tradeLicenseDetail.accessories[0].accessoryCategory",
          sourceJsonPath:
            "applyScreenMdmsData.TradeLicense.AccessoriesCategory",
          gridDefination: {
            xs: 12,
            sm: 4
          },
          beforeFieldChange: (action, state, dispatch) => {
            try {
              let accessories = get(
                state.screenConfiguration.preparedFinalObject,
                `applyScreenMdmsData.TradeLicense.AccessoriesCategory`,
                []
              );
              let currentObject = filter(accessories, {
                code: action.value
              });
              const currentUOMField = get(
                state.screenConfiguration.screenConfig.apply,
                action.componentJsonpath,
                []
              );
              var jsonArr = currentUOMField.jsonPath.split(".");
              jsonArr.pop();

              let currentUOMValueFieldPath = action.componentJsonpath.split(
                "."
              );
              currentUOMValueFieldPath.pop();
              currentUOMValueFieldPath = currentUOMValueFieldPath.join(".");
              if (currentObject[0].uom) {
                dispatch(
                  handleField(
                    "apply",
                    `${currentUOMValueFieldPath}.accessoriesUOM`,
                    "props.value",
                    currentObject[0].uom
                  )
                );
                dispatch(
                  handleField(
                    "apply",
                    `${currentUOMValueFieldPath}.accessoriesUOMValue`,
                    "props.disabled",
                    false
                  )
                );
                dispatch(
                  handleField(
                    "apply",
                    `${currentUOMValueFieldPath}.accessoriesUOMValue`,
                    "required",
                    true
                  )
                );
              } else {
                dispatch(
                  handleField(
                    "apply",
                    `${currentUOMValueFieldPath}.accessoriesUOMValue`,
                    "required",
                    false
                  )
                );
                dispatch(
                  handleField(
                    "apply",
                    `${currentUOMValueFieldPath}.accessoriesUOM`,
                    "props.value",
                    ""
                  )
                );
                dispatch(
                  handleField(
                    "apply",
                    `${currentUOMValueFieldPath}.accessoriesUOMValue`,
                    "props.value",
                    ""
                  )
                );
                dispatch(
                  handleField(
                    "apply",
                    `${currentUOMValueFieldPath}.accessoriesUOMValue`,
                    "props.disabled",
                    true
                  )
                );
                dispatch(pFO(`${jsonArr.join(".")}.uom`, null));
                dispatch(pFO(`${jsonArr.join(".")}.uomValue`, null));
              }
              if (action.value) {
                dispatch(
                  handleField(
                    "apply",
                    `${currentUOMValueFieldPath}.accessoriesCount`,
                    "props.disabled",
                    false
                  )
                );
              } else {
                dispatch(
                  handleField(
                    "apply",
                    `${currentUOMValueFieldPath}.accessoriesCount`,
                    "props.disabled",
                    true
                  )
                );
              }
            } catch (e) {
              console.log(e);
            }
          }
        },
        accessoriesUOM: getTextField({
          label: {
            labelName: "UOM (Unit of Measurement)",
            labelKey: "TL_NEW_TRADE_DETAILS_UOM_LABEL"
          },
          placeholder: {
            labelName: "UOM",
            labelKey: "TL_NEW_TRADE_DETAILS_UOM_UOM_PLACEHOLDER"
          },
          // required: true,
          props: {
            disabled: true
          },
          jsonPath: "Licenses[0].tradeLicenseDetail.accessories[0].uom",
          gridDefination: {
            xs: 12,
            sm: 4
          }
        }),
        accessoriesUOMValue: {
          ...getTextField({
            label: {
              labelName: "UOM Value",
              labelKey: "TL_NEW_TRADE_DETAILS_UOM_VALUE_LABEL"
            },
            placeholder: {
              labelName: "Enter UOM Value",
              labelKey: "TL_NEW_TRADE_DETAILS_UOM_VALUE_PLACEHOLDER"
            },
            pattern: getPattern("UOMValue"),
            props: {
              className: "applicant-details-error",
              disabled: true,
              jsonPath: "Licenses[0].tradeLicenseDetail.accessories[0].uomValue"
            },
            required: true,
            jsonPath: "Licenses[0].tradeLicenseDetail.accessories[0].uomValue",
            gridDefination: {
              xs: 12,
              sm: 4
            }
          })
        },
        accessoriesCount: {
          ...getTextField({
            label: {
              labelName: "Accessory Count",
              labelKey: "TL_NEW_TRADE_ACCESSORY_COUNT"
            },
            placeholder: {
              labelName: "Enter accessory count",
              labelKey: "TL_NEW_TRADE_ACCESSORY_COUNT_PLACEHOLDER"
            },
            pattern: getPattern("NoOfEmp"),
            props: {
              className: "applicant-details-error",
              setDataInField: true,
              jsonPath: "Licenses[0].tradeLicenseDetail.accessories[0].count",
              disabled: true
            },
            required: true,
            defaultValue: 1,
            jsonPath: "Licenses[0].tradeLicenseDetail.accessories[0].count",
            gridDefination: {
              xs: 12,
              sm: 4
            }
          })
        }
      })
    }),
    onMultiItemAdd: (state, muliItemContent) => {
      return setFieldsOnAddItem(state, muliItemContent);
    },
    items: [],
    addItemLabel: {
      labelName: "ADD ACCESSORIES",
      labelKey: "TL_NEW_TRADE_DETAILS_BUTTON_NEW_ACC"
    },
    headerName: "Accessory",
    headerJsonPath:
      "children.cardContent.children.header.children.head.children.Accessories.props.label",
    sourceJsonPath: "Licenses[0].tradeLicenseDetail.accessories",
    prefixSourceJsonPath:
      "children.cardContent.children.accessoriesCardContainer.children"
  },
  type: "array"
};

export const tradeDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Trade Details",
      labelKey: "TL_NEW_TRADE_DETAILS_PROV_DET_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  tradeDetailsConatiner: getCommonContainer({
    // financialYear: {
    //   uiFramework: "custom-containers-local",
    //     moduleName: "egov-tradelicence",
    //     componentPath: "AutosuggestContainer",
    //     jsonPath: "Licenses[0].financialYear",
    //     sourceJsonPath: "applyScreenMdmsData.egf-master.FinancialYear",
    //      props:{
    //       className: "autocomplete-dropdown",
    //       suggestions: [],
    //       disabled:getQueryArg(window.location.href, "action") === "EDITRENEWAL"? true:false,
    //       label: {
    //         labelName: "Financial Year",
    //         labelKey: "TL_FINANCIAL_YEAR_LABEL"
    //       },
    //       placeholder: {
    //         labelName: "Select Financial Year",
    //         labelKey: "TL_FINANCIAL_YEAR_PLACEHOLDER"
    //       },
    //       required: true,
    //       isClearable: true,
    //       jsonPath: "Licenses[0].financialYear",
    //       sourceJsonPath: "applyScreenMdmsData.egf-master.FinancialYear",
    //       inputLabelProps: {
    //         shrink: true
    //       }
    //     },
    //     gridDefination: {
    //       xs: 12,
    //       sm: 6
    //     },
    //     required: true
    // },
    // oldLicenseNo: getTextField({
    //   label: {
    //     labelName: "Old License No",
    //     labelKey: "TL_OLD_LICENSE_NO"
    //   },
    //   placeholder: {
    //     labelName: "Enter Old License No",
    //     labelKey: "TL_OLD_LICENSE_NO_PLACEHOLDER"
    //   },
    //   gridDefination: {
    //     xs: 12,
    //     sm: 6
    //   },
    //   props:{
    //     disabled:getQueryArg(window.location.href, "action") === "EDITRENEWAL"? true:false
    //   },
    //   iconObj: {
    //     iconName: "search",
    //     position: "end",
    //     color: "#FE7A51",
    //     onClickDefination: {
    //       action: "condition",
    //       callBack: (state, dispatch) => {
    //         fillOldLicenseData(state, dispatch);
    //       }
    //     }
    //   },
    //   title: {
    //     value: "Fill the form by searching your old approved trade license",
    //     key: "TL_OLD_TL_NO"
    //   },
    //   infoIcon: "info_circle",
    //   jsonPath: "Licenses[0].oldLicenseNumber"
    // }),
    // dummyDiv: {
    //   uiFramework: "custom-atoms",
    //   componentPath: "Div",
    //   gridDefination: {
    //     xs: 12,
    //     sm: 6
    //   },
    //   visible: true,
    //   props: {
    //     disabled: true
    //   }
    // },
    tradeLicenseType: {
      ...getSelectField({
        label: {
          labelName: "License Type",
          labelKey: "TL_NEW_TRADE_DETAILS_LIC_TYPE_LABEL"
        },
        placeholder: {
          labelName: "Select License Type",
          labelKey: "TL_NEW_TRADE_DETAILS_LIC_TYPE_PLACEHOLDER"
        },
        required: true,
        jsonPath: "Licenses[0].licenseType",
        localePrefix: {
          moduleName: "TRADELICENSE",
          masterName: "LICENSETYPE"
        },
        visible: false,
        props: {
          disabled: true,
          //value: "PERMANENT",
          className: "tl-trade-type"
        },
        sourceJsonPath: "applyScreenMdmsData.TradeLicense.licenseType"
      }),
      beforeFieldChange: (action, state, dispatch) => {
        if (action.value === "TEMPORARY") {
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeToDate",
              "visible",
              true
            )
          );
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLicensePeriod",
              "visible",
              false
            )
          );
          dispatch(pFO("Licenses[0].tradeLicensePeriod", null));
          dispatch(pFO("Licenses[0].validTo", null));

        } else {
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeToDate",
              "visible",
              false
            )
          );
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLicensePeriod",
              "visible",
              true
            )
          );
          dispatch(pFO("Licenses[0].tradeLicensePeriod", null));
          dispatch(pFO("Licenses[0].validTo", null));

        }
      }
    },
    tradeName: getTextField({
      label: {
        labelName: "Name of Trade",
        labelKey: "TL_NEW_TRADE_DETAILS_TRADE_NAME_LABEL"
      },
      props: {
        className: "applicant-details-error",
       // disabled: getQueryArg(window.location.href, "action") === "EDITRENEWAL" ? true : false,
      },
      placeholder: {
        labelName: "Example Diljit Da Dhaba",
        labelKey: "TL_NEW_TRADE_DETAILS_TRADE_NAME_PLACEHOLDER"
      },
      required: true,
      pattern: getPattern("TradeName"),
      jsonPath: "Licenses[0].tradeName"
    }),
    oldLicenseNo: getTextField({
      label: {
        labelName: "Old License No",
        labelKey: "TL_OLD_LICENSE_NO"
      },
      props: {
        className: "applicant-details-error",
        disabled: getQueryArg(window.location.href, "action") === "EDITRENEWAL" ? true : false,
      },
      placeholder: {
        labelName: "Enter Old License No",
        labelKey: "TL_OLD_LICENSE_NO_PLACEHOLDER"
      },
      visible: false,
      required: true,
      //visible: getQueryArg(window.location.href, "legacyLicenseRenewal") === "true" ? true : false,
      jsonPath: "Licenses[0].oldLicenseNumber"
    }),
    // tradeFromDate: {
    //   ...getDateField({
    //     label: {
    //       labelName: "From Date",
    //       labelKey: "TL_COMMON_FROM_DATE_LABEL"
    //     },
    //     placeholder: {
    //       labelName: "Trade License From Date",
    //       labelName: "TL_TRADE_LICENCE_FROM_DATE"
    //     },
    //     required: true,
    //     pattern: getPattern("Date"),
    //     jsonPath: "Licenses[0].validFrom",
    //     props: {
    //       disabled:getQueryArg(window.location.href, "action") === "EDITRENEWAL"? true:false,
    //       className:"applicant-details-error",
    //       inputProps: {
    //         min: getTodaysDateInYMD(),
    //         max: getFinancialYearDates("yyyy-mm-dd").endDate
    //       }
    //     }
    //   }),
    //   visible: false
    // },
    tradeCommencementDate: {
      ...getDateField({
        label: {
          labelName: "Trade Commencement Date",
          labelKey: "TL_NEW_TRADE_DETAILS_TRADE_COMM_DATE_LABEL"
        },
        props: {
          className: "applicant-details-error",
          disabled: getQueryArg(window.location.href, "action") === "EDITRENEWAL" ? true : false,
          inputProps: {
            //min: "2021-05-21",
            min: getCurrentDate()

          }
        },
        placeholder: {
          labelName: "Enter Trade Commencement Date",
          labelKey: "TL_NEW_TRADE_DETAILS_TRADE_COMM_DATE_PLACEHOLDER"
        },
        required: true,
        pattern: getPattern("Date"),
        jsonPath: "Licenses[0].commencementDate",

      }),
      beforeFieldChange: (action, state, dispatch) => {
        if (action.value) {


          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeToDate",
              "props.inputProps.min",
              action.value
            )
          );
          dispatch(
            handleField(
              "apply",
              "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeToDate",
              "props.disabled",
              false
            )
          );


          let queryObject = JSON.parse(
            JSON.stringify(
              get(state.screenConfiguration.preparedFinalObject, "Licenses", [])
            )
          );
          let applyForTL = get(queryObject[0], "licenseType", null);
          if(applyForTL === "TEMPORARY"){
          let tlcommencementDate = action.value;


          let validTo = get(queryObject[0], "validTo", null);
          tlcommencementDate = convertDateToEpoch(
            tlcommencementDate,
            "daystart"
          );
          validTo = convertDateToEpoch(
            validTo,
            "dayend"
          );
          if (validTo && tlcommencementDate) {

            //var date1 = new Date(tlcommencementDate);
            var date2 = new Date(validTo);
            // To calculate the time difference of two dates

            var Difference_In_Time = date2.getTime() - new Date(tlcommencementDate).getTime();

            // To calculate the no. of days between two dates
            var Difference_In_Days = Math.ceil((((Difference_In_Time / 1000) / 60) / 60) / 24);

            let selectedTrades = get(
              state.screenConfiguration.screenConfig.apply,
              "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeUnitCard.props.items",
              null
            )

            if (selectedTrades && selectedTrades.length > 0) {
              for (let i = 0; i < selectedTrades.length; i++) {
                dispatch(
                  handleField(
                    "apply",
                    `components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeUnitCard.props.items[${i}].item${i}.children.cardContent.children.tradeUnitCardContainer.children.tradeUOMValue`,
                    "props.value",
                    Difference_In_Days
                  )
                );
              }
            }
          }
        }

        }
      },
    },
    tradeLicensePeriod: {
      ...getSelectField({
        label: {
          labelName: "License Period",
          labelKey: "TL_NEW_TRADE_DETAILS_PERIOD_LABEL"
        },
        placeholder: {
          labelName: "Select License Period",
          labelKey: "TL_NEW_TRADE_DETAILS_PERIOD_PLACEHOLDER"
        },
        required: true,
        jsonPath: "Licenses[0].TlPeriod",
        // localePrefix: {
        //   moduleName: "TRADELICENSE",
        //   masterName: "LICENSETYPE"
        // },
        props: {
          // disabled: true,
          //value: "PERMANENT",
          className: "tl-trade-type"
        },
        sourceJsonPath: "applyScreenMdmsData.TradeLicense.TlPeriod"
      }),
      visible: false,
    },
    tradeToDate: {
      ...getDateField({
        label: { labelName: "To Date", labelKey: "TL_NEW_TRADE_DETAILS_TRADE_END_DATE_LABEL" },
        placeholder: {
          labelName: "Trade License From Date",
          labelKey: "TL_TRADE_LICENCE_TO_DATE"
        },
        visible: false,
        required: true,

        pattern: getPattern("Date"),
        jsonPath: "Licenses[0].validTo",
        // props: {
        //   disabled: getQueryArg(window.location.href, "action") === "EDITRENEWAL" ? true : false,
        //   inputProps: {
        //     min: getNextMonthDateInYMD(),
        //     max: getFinancialYearDates("yyyy-mm-dd").endDate
        //   }
        // }
        props: {
          disabled: true,
          inputProps: {

            min: getCurrentDate()

          }
        }
      }),
      beforeFieldChange: (action, state, dispatch) => {
        if (action.value) {

          let queryObject = JSON.parse(
            JSON.stringify(
              get(state.screenConfiguration.preparedFinalObject, "Licenses", [])
            )
          );
          let validTo = action.value;
          let tlType = get(queryObject[0], "licenseType");

          let tlcommencementDate = get(queryObject[0], "commencementDate");
          tlcommencementDate = convertDateToEpoch(
            tlcommencementDate,
            "daystart"
          );
          validTo = convertDateToEpoch(
            validTo,
            "dayend"
          );
          if (validTo && tlcommencementDate) {

            //var date1 = new Date(tlcommencementDate);
            var date2 = new Date(validTo);
            // To calculate the time difference of two dates

            var Difference_In_Time = date2.getTime() - new Date(tlcommencementDate).getTime();

            // To calculate the no. of days between two dates
            var Difference_In_Days = Math.ceil((((Difference_In_Time / 1000) / 60) / 60) / 24);

            let selectedTrades = get(
              state.screenConfiguration.screenConfig.apply,
              "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeUnitCard.props.items",
              null
            )

            if (selectedTrades && selectedTrades.length > 0) {
              for (let i = 0; i < selectedTrades.length; i++) {
                dispatch(
                  handleField(
                    "apply",
                    `components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeUnitCard.props.items[${i}].item${i}.children.cardContent.children.tradeUnitCardContainer.children.tradeUOMValue`,
                    "props.value",
                    Difference_In_Days
                  )
                );
              }
            }
          }
        }
      },
      visible: false
    },
    // tradeToDate: {
    //   ...getDateField({
    //     label: { labelName: "To Date", labelKey: "TL_COMMON_TO_DATE_LABEL" },
    //     placeholder: {
    //       labelName: "Trade License From Date",
    //       labelKey: "TL_TRADE_LICENCE_TO_DATE"
    //     },
    //     required: true,
    //     pattern: getPattern("Date"),
    //     jsonPath: "Licenses[0].validTo",
    //     props: {
    //       disabled:getQueryArg(window.location.href, "action") === "EDITRENEWAL"? true:false,
    //       inputProps: {
    //         min: getNextMonthDateInYMD(),
    //         max: getFinancialYearDates("yyyy-mm-dd").endDate
    //       }
    //     }
    //   }),
    //   visible: false
    // },
    // dynamicMdmsStructureType : {
    //   uiFramework: "custom-containers",
    //   componentPath: "DynamicMdmsContainer",
    //   props: {
    //     dropdownFields: [
    //       {
    //         key : 'structureType',
    //         isDisabled:getQueryArg(window.location.href, "action") === "EDITRENEWAL"? true:false,
    //         fieldType : "autosuggest",
    //         className:"applicant-details-error autocomplete-dropdown",
    //         isRequired : false,
    //         requiredValue : true
    //       },
    //       {
    //         key : 'structureSubType',
    //         callBack : structureSubTypeChange,
    //         fieldType : "autosuggest",
    //         className:"applicant-details-error autocomplete-dropdown",
    //         isRequired : false,
    //         requiredValue : true
    //       }
    //     ],
    //     moduleName: "common-masters",
    //     masterName: "StructureType",
    //     rootBlockSub : 'structureTypes',
    //     callBackEdit: updateStructureTypes
    //   }
    // },

    tradeGSTNo: getTextField({
      label: {
        labelName: "Trade GST No.",
        labelKey: "TL_NEW_TRADE_DETAILS_TRADE_GST_NO_LABEL"
      },
      props: {
        className: "applicant-details-error",
        disabled: getQueryArg(window.location.href, "action") === "EDITRENEWAL" ? true : false,
      },
      placeholder: {
        labelName: "Enter Trade GST No.",
        labelKey: "TL_NEW_TRADE_DETAILS_TRADE_GST_NO_PLACEHOLDER"
      },
      pattern: getPattern("GSTNo"),
      jsonPath: "Licenses[0].tradeLicenseDetail.additionalDetail.gstNo"
    }),
    // tradeOperationalArea: getTextField({
    //   label: {
    //     labelName: "Operatonal Area (Sq Ft)",
    //     labelKey: "TL_NEW_TRADE_DETAILS_OPR_AREA_LABEL"
    //   },
    //   props: {
    //     className: "applicant-details-error",
    //     disabled: getQueryArg(window.location.href, "action") === "EDITRENEWAL" ? true : false,
    //   },
    //   placeholder: {
    //     labelName: "Enter Operatonal Area in Sq Ft",
    //     labelKey: "TL_NEW_TRADE_DETAILS_OPR_AREA_PLACEHOLDER"
    //   },
    //   pattern: getPattern("OperationalArea"),
    //   jsonPath: "Licenses[0].tradeLicenseDetail.operationalArea"
    // }),
    // tradeNoOfEmployee: getTextField({
    //   label: {
    //     labelName: "No. Of Employee",
    //     labelKey: "TL_NEW_TRADE_DETAILS_NO_EMPLOYEES_LABEL"
    //   },
    //   props: {
    //     className: "applicant-details-error",
    //     disabled: getQueryArg(window.location.href, "action") === "EDITRENEWAL" ? true : false,
    //   },
    //   placeholder: {
    //     labelName: "Enter No. Of Employee",
    //     labelKey: "TL_NEW_TRADE_DETAILS_NO_EMPLOYEES_PLACEHOLDER"
    //   },
    //   pattern: getPattern("NoOfEmp"),
    //   jsonPath: "Licenses[0].tradeLicenseDetail.noOfEmployees"
    // })

    tradePurpose: getTextField({
      label: {
        labelName: "Trade Purpose",
        labelKey: "TL_NEW_TRADE_PURPOSE_LABEL"
      },
      props: {
        className: "applicant-details-error",
        disabled: getQueryArg(window.location.href, "action") === "EDITRENEWAL" ? true : false,
      },
      placeholder: {
        labelName: "Trade Purpose",
        labelKey: "TL_NEW_TRADE_PURPOSE_PLACEHOLDER"
      },
      //pattern: getPattern("NoOfEmp"),
      jsonPath: "Licenses[0].tradeLicenseDetail.additionalDetail.licensePurpose"
    })
  },
    { style: getQueryArg(window.location.href, "action") === "EDITRENEWAL" ? { "cursor": "not-allowed" } : {} },
  ),
  tradeUnitCard,
  //accessoriesCard
});

const setFieldsOnAddItem = (state, multiItemContent) => {

  const preparedFinalObject = JSON.parse(
    JSON.stringify(state.screenConfiguration.preparedFinalObject)
  );
  for (var variable in multiItemContent) {
    const value = get(
      preparedFinalObject,
      multiItemContent[variable].props.jsonPath
    );
    if (multiItemContent[variable].props.setDataInField && value) {
      if (
        multiItemContent[variable].props.jsonPath.split(".")[0] ===
        "LicensesTemp" &&
        multiItemContent[variable].props.jsonPath.split(".").pop() ===
        "tradeType"
      ) {
        const tradeTypeData = get(
          preparedFinalObject,
          `applyScreenMdmsData.TradeLicense.TradeType`,
          []
        );
        const tradeTypeDropdownData =
          tradeTypeData &&
          tradeTypeData.TradeType &&
          Object.keys(tradeTypeData.TradeType).map(item => {
            return { code: item, active: true };
          });
        multiItemContent[variable].props.data = tradeTypeDropdownData;
        const data = tradeTypeData[value];
        if (data) {
          multiItemContent["tradeType"].props.data = this.objectToDropdown(
            data
          );
        }
      } else if (
        multiItemContent[variable].props.jsonPath.split(".").pop() ===
        "tradeType"
      ) {
        const data = get(
          preparedFinalObject,
          `applyScreenMdmsData.TradeLicense.TradeType.${value.split(".")[0]}.${value.split(".")[1]
          }`
        );
        if (data) {
          multiItemContent[variable].props.data = data;
        }
      } else if (
        multiItemContent[variable].props.jsonPath.split(".").pop() ===
        "uomValue" &&
        value > 0
      ) {
        multiItemContent[variable].props.disabled = false;
        multiItemContent[variable].props.required = true;
      }
    }
    if (
      multiItemContent[variable].props.setDataInField &&
      multiItemContent[variable].props.disabled
    ) {
      if (
        multiItemContent[variable].props.jsonPath.split(".").pop() ===
        "uomValue"
      ) {
        const disabledValue = get(
          state.screenConfiguration.screenConfig["apply"],
          `${multiItemContent[variable].componentJsonpath}.props.disabled`,
          true
        );
        multiItemContent[variable].props.disabled = disabledValue;
      }
    }
  }
  return multiItemContent;
};
