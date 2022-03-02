import React from "react";
import { sortByEpoch, getEpochForDate } from "../../utils";
import './index.css'

export const searchResults = {
  uiFramework: "custom-molecules",
  moduleName: "egov-wns",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
      {
        name: "Service",
        labelKey: "WS_COMMON_TABLE_COL_SERVICE_LABEL", 
        options: {
          filter: false,
          customBodyRender: value => (
            <span style={{ color: '#000000' }}>
              {value}
            </span>
          )
        }
      },
      {
        name: "Consumer No",
        labelKey: "WS_COMMON_TABLE_COL_CONSUMER_NO_LABEL", 
        options: {
          filter: false,
          customBodyRender: (value, data) => (
            <div className="linkStyle" onClick={() => getViewDemandDetails(data)}>
              <a>{value}</a>
            </div>
          )
        }
      },
      {
        name: "tenantId",
        labelKey: "WS_COMMON_TABLE_COL_TENANTID_LABEL",
        options: {
          display: false
        }
      },
      {name : "Owner Name",labelKey: "WS_COMMON_TABLE_COL_OWN_NAME_LABEL" },
      {name : "Address",labelKey: "WS_COMMON_TABLE_COL_ADDRESS" },
      {
        name: "applicationStatus",
        labelKey: "WS_COMMON_TABLE_COL_APPLICATION_CURRENT_STATE"
      }
    ],
    title: {labelKey:"WS_HOME_SEARCH_RESULTS_TABLE_HEADING", labelName:"Search Results for Water & Sewerage Connections"},
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

const getViewDemandDetails = data => {
  
  window.location.href = `viewDemand?connectionNumber=${data.rowData[1]}&tenantId=${data.rowData[2]}&businessService=WS`;
  // store.dispatch(
  //   setRoute( `viewBill?connectionNumber=${data.rowData[1]}&tenantId=${data.rowData[8]}&service=${data.rowData[0]}&connectionType=${data.rowData[9]}&connectionFacility=${data.rowData[11]}`)
  // )
}