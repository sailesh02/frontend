import { LabelContainer } from "egov-ui-framework/ui-containers";
import { getLocaleLabels, getStatusKey } from "egov-ui-framework/ui-utils/commons";
import { routeTo } from "egov-ui-kit/utils/PTCommon/FormWizardUtils/formActionUtils";
import React from "react";
import { getEpochForDate, sortByEpoch } from "../../utils";
import store from "ui-redux/store";
import {
  handleScreenConfigurationFieldChange as handleField,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";

export const searchResults = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
      {
        labelName: "Application No",
        labelKey: "MR_COMMON_TABLE_COL_APP_NO",
        options: {
          filter: false,
          customBodyRender: (value, tableMeta) => (
            <a href="javascript:void(0)" onClick={() => onRowClick(tableMeta.rowData)}>{value}</a>
          )
        }
      },
      {
        labelName: "Reg No",
        labelKey: "MR_COMMON_TABLE_COL_REG_NO"
      },
      {
        labelName: "Groom Name",
        labelKey: "MR_COMMON_TABLE_COL_GROOM_NAME"
      },
      {
        labelName: "Bride Name",
        labelKey: "MR_COMMON_TABLE_COL_BRIDE_NAME"
      },

      {
        labelName: "Application Date",
        labelKey: "MR_COMMON_TABLE_COL_APP_DATE"
      },

      {
        labelName: "Application Type",
        labelKey: "MR_COMMON_TABLE_COL_APP_TYPE",
        options: {
          filter: false,
          customBodyRender: value => (
            <span>
              {getLocaleLabels(value, value)}
            </span>
          )
        }
      },
      {
        labelName: "Status",
        labelKey: "MR_COMMON_TABLE_COL_STATUS",
        options: {
          filter: false,
          customBodyRender: value => (
            <LabelContainer
              style={
                value.includes("APPROVED") ? { color: "green" } : { color: "red" }
              }
              labelKey={getStatusKey(value).labelKey}
              labelName={getStatusKey(value).labelName}
            />
          )
        }
      },
      {
        labelName: "Tenant Id",
        labelKey: "TENANT_ID",
        options: {
          display: false
        }
      },
      {
        labelName: "Status",
        labelKey: "MR_COMMON_TABLE_COL_STATUS",
        options: {
          display: false
        }
      },

    ],
    title: {
      labelName: "Search Results for Trade License Applications",
      labelKey: "MR_HOME_SEARCH_RESULTS_TABLE_HEADING"
    },
    rows: "",
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20]
    },
    customSortColumn: {
      column: "Application Date",
      sortingFn: (data, i, sortDateOrder) => {
        const epochDates = data.reduce((acc, curr) => {
          acc.push([...curr, getEpochForDate(curr[4], "dayend")]);
          return acc;
        }, []);
        const order = sortDateOrder === "asc" ? true : false;
        const finalData = sortByEpoch(epochDates, !order).map(item => {
          item.pop();
          return item;
        });
        return { data: finalData, currentOrder: !order ? "asc" : "desc" };
      }
    }
  }
};

export const searchDigitalSignatureResults = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
      {
        labelName: "Application No",
        labelKey: "TL_COMMON_TABLE_COL_APP_NO",
        options: {
          filter: false,
        }
      },
      {
        labelName: "Tenant Id",
        labelKey: "TENANT_ID",
      },
      {
        labelName: "PT_COMMON_TABLE_COL_ACTION_LABEL",
        labelKey: "PT_COMMON_TABLE_COL_ACTION_LABEL",
	      options: {
          filter: false,
          customBodyRender: (value, tableMeta) => (
            <a href="javascript:void(0)" onClick={() => onPdfSignClick(tableMeta.rowData)}><span style={{ color: '#fe7a51' }}>
            {value}
          </span></a>
          )
        }
      },
    ],
    title: {
      labelName: "Search Results for Trade License Applications",
      labelKey: "MR_HOME_SEARCH_RESULTS_DIGITAL_SIGNATURE"
    },
    rows: "",
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20]
    },
    customSortColumn: {
      column: "Application Date",
      sortingFn: (data, i, sortDateOrder) => {
        const epochDates = data.reduce((acc, curr) => {
          acc.push([...curr, getEpochForDate(curr[4], "dayend")]);
          return acc;
        }, []);
        const order = sortDateOrder === "asc" ? true : false;
        const finalData = sortByEpoch(epochDates, !order).map(item => {
          item.pop();
          return item;
        });
        return { data: finalData, currentOrder: !order ? "asc" : "desc" };
      }
    }
  }
}


const onRowClick = rowData => {

  switch (rowData[6]) {
    case "INITIATED":
      if(rowData[5]=="MR_TYPE_CORRECTION"){
        routeTo(`apply?applicationNumber=${rowData[0]}&mrNumber=${rowData[1]}&action=CORRECTION&tenantId=${
          rowData[7]
          }`);
      }else{
        routeTo(`apply?applicationNumber=${rowData[0]}&tenantId=${
          rowData[7]
          }`);
      }
      break;
    default:
      routeTo(`search-preview?applicationNumber=${
        rowData[0]
        }&tenantId=${rowData[7]}`);
      break;
  }
};

const onPdfSignClick = rowData => {
  let applicationNumber = rowData && rowData[0]
  let tenantId = rowData && rowData[1]

  store.dispatch(
    handleField(
      "search",
      "components.pdfSigningPopup.props",
      "openPdfSigningPopup",
      true
    )
  )
  store.dispatch(
    handleField(
      "search",
      "components.pdfSigningPopup.props",
      "applicationNumber",
      applicationNumber
    )
  )
  store.dispatch(
    handleField(
      "search",
      "components.pdfSigningPopup.props",
      "tenantId",
      tenantId
    )
  )
}
