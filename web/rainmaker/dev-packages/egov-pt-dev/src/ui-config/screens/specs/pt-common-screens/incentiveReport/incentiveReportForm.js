import React from "react";
import store from "ui-redux/store";
import get from "lodash/get";
import {
  getCommonContainer,
  getCommonTitle,
  getCommonCard,
  getSelectField,
  getDateField,
  getPattern,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { incentiveSearchApiCall, getCurrentDate, excelDownloadAction } from "./incentiveActions";

const cityDropdown = {
  uiFramework: "custom-containers",
  componentPath: "AutosuggestContainer",
  jsonPath: "reportForm.tenantId",
  required: true,
  props: {
    style: {
      width: "100%",
      cursor: "pointer",
    },
    label: {
      labelName: "City",
      labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL",
    },
    localePrefix: {
      moduleName: "TENANT",
      masterName: "TENANTS",
    },
    placeholder: {
      labelName: "Select City",
      labelKey: "TL_SELECT_CITY",
    },
    sourceJsonPath: "applyScreenMdmsData.tenant.tenants",
    labelsFromLocalisation: true,
    suggestions: [],
    fullwidth: true,
    required: true,
    isClearable: true,
    inputLabelProps: {
      shrink: true,
    },
  },
  // afterFieldChange: (action, state, dispatch) => {
  //   dispatch(
  //     handleField(
  //       "incentiveReport",
  //       `components.div.children.billSlabSearchForm.children.cardContent.children.cityNameContainer.children.dynamicMdms`,
  //       "props.screenTenantId",
  //       action.value
  //     )
  //   );
  // },
  gridDefination: {
    xs: 12,
    sm: 6,
  },
};

export const reportSearchForm = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Search Form",
      labelKey: "Search Form",
    },
    {
      style: {
        marginBottom: 18,
      },
    }
  ),
  cityNameContainer: getCommonContainer({
    module: {
      ...getSelectField({
        label: {
          labelName: "Module",
          labelKey: "Module",
        },
        placeholder: {
          labelName: "Select Module",
          labelKey: "Select Module",
        },
        required: true,
        jsonPath: "reportForm.module",
        visible: true,
        // props: {
        //   className: "tl-trade-type",
        // },
        data: [{ code: "PropertyTax" }, { code: "WaterTax" }],
      }),
    },
    city: cityDropdown,
    fromDate: {
      ...getDateField({
        label: {
          labelName: "From Date",
          labelKey: "From Date"
        },
        placeholder: {
          labelName: "Select From Date",
          labelKey: "Select From Date"
        },
        required: true,
        pattern: getPattern("Date"),
        jsonPath: "reportForm.fromDate",
        disabled: false,
        props: {
          inputProps: {
            max: getCurrentDate()
          }
        }
      }),
    },
    toDate: {
      ...getDateField({
        label: {
          labelName: "To Date",
          labelKey: "To Date"
        },
        placeholder: {
          labelName: "Select To Date",
          labelKey: "Select To Date"
        },
        required: true,
        pattern: getPattern("Date"),
        jsonPath: "reportForm.toDate",
        disabled: false,
        props: {
          inputProps: {
            max: getCurrentDate()
          }
        }
      }),
    },
  }),
  buttonContainer: getCommonContainer({
    firstCont: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      gridDefination: {
        xs: 12,
        sm: 3
      }
    },
    searchButton: {
      componentPath: "Button",
      gridDefination: {
        xs: 12,
        sm: 6,
      },
      props: {
        variant: "contained",
        style: {
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
          borderRadius: "2px",
          width: "80%",
          height: "48px",
        },
      },
      children: {
        buttonLabel: getLabel({
          labelName: "Search",
          labelKey: "Search",
        }),
      },
      onClickDefination: {
        action: "condition",
        callBack: incentiveSearchApiCall,
      },
    },
    lastCont: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      gridDefination: {
        xs: 12,
        sm: 3
      }
    }
  }),
});

const downloadAsExcel = () => {
  const state = store.getState()
  const tableData = get(
    state.screenConfiguration.preparedFinalObject,
    "tableData",
    []
  );
  excelDownloadAction(tableData, "Sujog Jal Saathi Incentive Report")
}
const excelDownloadButton = () => { 
  return <button onClick={() => downloadAsExcel()}>Export to Excel</button>
}

export const searchResults = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
      {
        name: "Employee Name",
        labelKey: "Employee Name",
      },
      {
        name: "Employee Id",
        labelKey: "Employee Id",
      },
      {
        name: "Total No Of Transaction",
        labelKey: "Total No Of Transaction",
      },
      {
        name: "Collection Towards Arrear",
        labelKey: "Collection Towards Arrear",
      },
      {
        name: "Collection Towards Current",
        labelKey: "Collection Towards Current",
      },
      {
        name: "Total Collection",
        labelKey: "Total Collection",
      },
      {
        name: "Total Incentive On Arrear",
        labelKey: "Total Incentive On Arrear",
      },
      {
        name: "Total Incentive On Current",
        labelKey: "Total Incentive On Current",
      },
      {
        name: "Total Incentive",
        labelKey: "Total Incentive",
      },
    ],
    title: {
      labelKey: "Search Results for Incentive Report",
      labelName: "Search Results for Incentive Report",
    },
    rows: "",
    options: {
      filter: false,
      download: false,
      customToolbar: excelDownloadButton,
      responsive: "scroll",
      selectableRows: false,
      hover: false,
      viewColumns: false,
      rowsPerPageOptions: [10, 20, 50, 100],
    },
  },
};