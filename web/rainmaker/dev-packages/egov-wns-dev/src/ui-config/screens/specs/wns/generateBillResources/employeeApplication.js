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

import { handleScreenConfigurationFieldChange as handleField, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import store from "ui-redux/store";
import get from "lodash/get";


export const showConfirmationBox = () => {
  let screenKey = "generate-bill";
  let state = store.getState();
  let toggle = get(
    state.screenConfiguration.screenConfig[screenKey],
    "components.adhocDialog.props.open",
    false
  );

  let billTriggerFor = get(
    state.screenConfiguration.preparedFinalObject,
    "billTriggerFor",
    ""
  );
  let selectedBillTriggerData = get(
    state.screenConfiguration.preparedFinalObject,
    "BulkBillCriteria",
    ""
  );

  let selectedTenantIds = get(
    selectedBillTriggerData,
    "tenantIds",
    []
  );

  let demandMonth = get(
    selectedBillTriggerData,
    "demandMonth",
    ""
  );

  let demandYear = get(
    selectedBillTriggerData,
    "demandYear",
    ""
  );

  let currentDateObj = new Date();
  let currentMonth = currentDateObj.getMonth()+1;
  let currentYear = currentDateObj.getFullYear();
  console.log(currentMonth, currentYear, "Current nero")
  console.log(selectedTenantIds, demandMonth, demandYear, "Nero Validation")
  if (billTriggerFor === "WS_BILL_TRIGGER_WITH_ULB_BUTTON") {
    if(demandMonth && demandMonth !== undefined && demandMonth !== "" &&
    demandYear && demandYear !== undefined && demandYear !== "" &&
    demandMonth > currentMonth && demandYear == currentYear){
      store.dispatch(
        toggleSnackbar(
          true, {
          labelKey: "WS_BILL_GENERATE_MONTH_YEAR_NOT_GREATER_CURRENT_MONTH_YEAR",
          labelName: "Selected Month/Year can not be greater than current Month/Year"
        },
          "warning"
        )
      )
    }else if(demandMonth && demandMonth !== undefined && demandMonth !== "" &&
    demandYear && demandYear !== undefined && demandYear !== "" && demandYear > currentYear){
      store.dispatch(
        toggleSnackbar(
          true, {
          labelKey: "WS_BILL_GENERATE_MONTH_YEAR_NOT_GREATER_CURRENT_MONTH_YEAR",
          labelName: "Selected Month/Year can not be greater than current Month/Year"
        },
          "warning"
        )
      )
    }else if (selectedTenantIds && selectedTenantIds.length > 0 &&
      demandMonth && demandMonth !== undefined && demandMonth !== "" &&
      demandYear && demandYear !== undefined && demandYear !== ""
    ) {
      store.dispatch(
        handleField(screenKey, "components.adhocDialog", "props.open", !toggle)
      );
    } else {
      store.dispatch(
        toggleSnackbar(
          true, {
          labelKey: "WS_FILL_REQUIRED_FIELDS",
          labelName: "Please fill Required details"
        },
          "warning"
        )
      )
    }
  } else {
    let connectionNos = get(
      selectedBillTriggerData,
      "connectionNos",
      []
    );
     

    if(demandMonth && demandMonth !== undefined && demandMonth !== "" &&
    demandYear && demandYear !== undefined && demandYear !== "" &&
    demandMonth > currentMonth && demandYear == currentYear){
      store.dispatch(
        toggleSnackbar(
          true, {
          labelKey: "WS_BILL_GENERATE_MONTH_YEAR_NOT_GREATER_CURRENT_MONTH_YEAR",
          labelName: "Selected Month/Year can not be greater than current Month/Year"
        },
          "warning"
        )
      )
    }else if(demandMonth && demandMonth !== undefined && demandMonth !== "" &&
    demandYear && demandYear !== undefined && demandYear !== "" && demandYear > currentYear){
      store.dispatch(
        toggleSnackbar(
          true, {
          labelKey: "WS_BILL_GENERATE_MONTH_YEAR_NOT_GREATER_CURRENT_MONTH_YEAR",
          labelName: "Selected Month/Year can not be greater than current Month/Year"
        },
          "warning"
        )
      )
    }else if (selectedTenantIds && selectedTenantIds !== undefined && selectedTenantIds !== "" &&
      demandMonth && demandMonth !== undefined && demandMonth !== "" &&
      demandYear && demandYear !== undefined && demandYear !== "" && 
      connectionNos && connectionNos.length > 0
    ) {
      store.dispatch(
        handleField(screenKey, "components.adhocDialog", "props.open", !toggle)
      );
    } else {
      store.dispatch(
        toggleSnackbar(
          true, {
          labelKey: "WS_FILL_REQUIRED_FIELDS",
          labelName: "Please fill Required details"
        },
          "warning"
        )
      )
    }
  }

};


const getBillYears = () => {
  let billYears = [];
  for (let i = 2021; i < 2050; i++) {
    billYears.push({ value: i })
  }
  return billYears;
}


export const wnsApplication = getCommonCard({
  subHeader: getCommonTitle({
    labelKey: "WS_BILL_TRIGGER_SUB_HEADER"
  }),
  subParagraph: getCommonParagraph({
    labelKey: "WS_BILL_TRIGGER_DESC"
  }),
  wnsApplicationContainer: getCommonContainer({

    tenantIds: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-wns",
      componentPath: "MultiAutoSuggestContainer",
      props: {
        className: "autocomplete-dropdown",
        suggestions: [],
        label: {
          labelName: "City",
          labelKey: "WS_PROP_DETAIL_CITY"
        },
       
        jsonPath: "BulkBillCriteria.tenantIds",
        labelsFromLocalisation: true,
        required: true,
        


      },
      jsonPath: "BulkBillCriteria.tenantIds",
      data: [],
      required: true,
      gridDefination: {
        xs: 12,
        sm: 6
      }
    },

    skipTenantIds: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-wns",
      componentPath: "MultiAutoSuggestContainer",
      props: {
        className: "autocomplete-dropdown",
         suggestions: [],
        label: {
          labelName: "City",
          labelKey: "WS_PROP_DETAIL_SKIP_CITY"
        },
        
        jsonPath: "BulkBillCriteria.skipTenantIds",
        labelsFromLocalisation: true,
        
      },
      jsonPath: "BulkBillCriteria.skipTenantIds",
      data: [],
      
      gridDefination: {
        xs: 12,
        sm: 6
      }
    },

    demandMonth: getSelectField({
      label: { labelKey: "WS_BILL_DEMAND_MONTH_LABEL" },
      data: [{ value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: 5 },
      { value: 6 },
      { value: 7 },
      { value: 8 },
      { value: 9 },
      { value: 10 },
      { value: 11 },
      { value: 12 }
      ],
      optionValue: "value",
      optionLabel: "value",
      placeholder: { labelKey: "WS_BILL_DEMAND_MONTH_PLACEHOLDER" },
      required: true,
      props: { disabled: process.env.REACT_APP_NAME === "Citizen" },
      jsonPath: "BulkBillCriteria.demandMonth",

    }),

    demandYear: getSelectField({
      label: { labelKey: "WS_BILL_DEMAND_YEAR_LABEL" },
      data: getBillYears(),
      optionValue: "value",
      optionLabel: "value",
      placeholder: { labelKey: "WS_BILL_DEMAND_YEAR_PLACEHOLDER" },
      required: true,
      props: { disabled: process.env.REACT_APP_NAME === "Citizen" },
      jsonPath: "BulkBillCriteria.demandYear",

    }),

    specialRebateMonths: getSelectField({
      label: { labelKey: "WS_BILL_SPECIAL_REBATE_MONTH_LABEL" },

      data: [{ value: "Yes" },
      { value: "No" }
      ],
      optionValue: "value",
      optionLabel: "value",
      placeholder: { labelKey: "WS_BILL_SPECIAL_REBATE_MONTH_PLACEHOLDER" },
      //required: true,
      props: { disabled: process.env.REACT_APP_NAME === "Citizen", value: "No" },
      jsonPath: "BulkBillCriteria.specialRebateMonths",

    }),


  }),

  button: getCommonContainer({
    buttonContainer: getCommonContainer({
      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 12,
          align: "right"
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
            labelKey: "WS_BILL_TRIGGER_BUTTON"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: showConfirmationBox
        }
      },
    })
  })
});


export const generateBillWithConnections = getCommonCard({
  subHeader: getCommonTitle({
    labelKey: "WS_BILL_TRIGGER_SUB_HEADER"
  }),
  subParagraph: getCommonParagraph({
    labelKey: "WS_BILL_TRIGGER_DESC"
  }),
  wnsApplicationContainer: getCommonContainer({

    tenantIds: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-pt",
      componentPath: "AutosuggestContainer",
      props: {
        className: "autocomplete-dropdown",
        suggestions: [],
        label: {
          labelName: "City",
          labelKey: "WS_PROP_DETAIL_CITY"
        },
        placeholder: {
          labelName: "Select City",
          labelKey: "WS_PROP_DETAIL_CITY_PLACEHOLDER"
        },
        data: [],
        localePrefix: {
          moduleName: "TENANT",
          masterName: "TENANTS"
        },
        jsonPath: "BulkBillCriteria.tenantIds",
        sourceJsonPath: "applyScreenMdmsData.tenant.tenants",
        labelsFromLocalisation: true,
        required: true,
        isClearable: true,
        inputLabelProps: {
          shrink: true
        }
      },
      data: [],
      required: true,
      jsonPath: "BulkBillCriteria.tenantIds",
      sourceJsonPath: "applyScreenMdmsData.tenant.tenants",
      gridDefination: {
        xs: 12,
        sm: 6
      }
    },

    demandMonth: getSelectField({
      label: { labelKey: "WS_BILL_DEMAND_MONTH_LABEL" },
      data: [{ value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: 5 },
      { value: 6 },
      { value: 7 },
      { value: 8 },
      { value: 9 },
      { value: 10 },
      { value: 11 },
      { value: 12 }
      ],
      optionValue: "value",
      optionLabel: "value",
      placeholder: { labelKey: "WS_BILL_DEMAND_MONTH_PLACEHOLDER" },
      required: true,
      props: { disabled: process.env.REACT_APP_NAME === "Citizen" },
      jsonPath: "BulkBillCriteria.demandMonth",

    }),

    demandYear: getSelectField({
      label: { labelKey: "WS_BILL_DEMAND_YEAR_LABEL" },
      data: getBillYears(),
      optionValue: "value",
      optionLabel: "value",
      placeholder: { labelKey: "WS_BILL_DEMAND_YEAR_PLACEHOLDER" },
      required: true,
      props: { disabled: process.env.REACT_APP_NAME === "Citizen" },
      jsonPath: "BulkBillCriteria.demandYear",

    }),

    specialRebateMonths: getSelectField({
      label: { labelKey: "WS_BILL_SPECIAL_REBATE_MONTH_LABEL" },

      data: [{ value: "Yes" },
      { value: "No" }
      ],
      optionValue: "value",
      optionLabel: "value",
      placeholder: { labelKey: "WS_BILL_SPECIAL_REBATE_MONTH_PLACEHOLDER" },
      //required: true,
      props: { disabled: process.env.REACT_APP_NAME === "Citizen", value: "No" },
      jsonPath: "BulkBillCriteria.specialRebateMonths",

    }),

    chipsInput: {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-wns",
    componentPath: "ChipsInput",
    props: {
      label: {
        labelName: "WS_MYCONNECTIONS_CONSUMER_NO",
        labelKey: "WS_MYCONNECTIONS_CONSUMER_NO"
      },
      required: true
    }
  }

  }),

  button: getCommonContainer({
    buttonContainer: getCommonContainer({
      
      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 12,
          align: "right"
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
            labelKey: "WS_BILL_TRIGGER_BUTTON"
          })
        },
        onClickDefination: {
          action: "condition",
          callBack: showConfirmationBox
        }
      },
    })
  })
});