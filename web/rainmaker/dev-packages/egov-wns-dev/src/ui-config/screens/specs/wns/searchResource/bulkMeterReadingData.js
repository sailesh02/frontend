import React from "react";
import { sortByEpoch, getEpochForDate } from "../../utils";
import './index.css';
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import store from "ui-redux/store";
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";

const deleteTableData = (value) => {
  let consumerNumber = value && value.rowData && value.rowData.length > 0 && value.rowData[0] || ""
  let state = store.getState()
  let meterReadingBulk = state && state.screenConfiguration && state.screenConfiguration.preparedFinalObject && 
  state.screenConfiguration.preparedFinalObject.meterReadingBulk || []
  let removedConsumerNumber = meterReadingBulk && meterReadingBulk.length > 0 && 
  meterReadingBulk.filter( data => {
    return data.connectionNo != consumerNumber
  }) || []
 
  let data = removedConsumerNumber.map(item => ({
    ["WS_COMMON_TABLE_COL_CONSUMER_NO_LABEL"]: item.connectionNo,
    ["WS_CONSUMPTION_DETAILS_BILLING_PERIOD_LABEL"]: item.billingPeriod,
    ["WS_SELECT_METER_STATUS_LABEL"]: item.meterStatus,
    ["WS_CONSUMPTION_DETAILS_LAST_READING_DATE_LABEL"]: item.lastReadingDate,
    ["WS_CONSUMPTION_DETAILS_LAST_READING_LABEL"]: item.lastReading,
    ["WS_CONSUMPTION_DETAILS_CURRENT_READING_LABEL"]: item.currentReading,
    ["WS_CONSUMPTION_DETAILS_CONSUMPTION_LABEL"]: item.consumption,
    ["WS_CONSUMPTION_DETAILS_CURRENT_READING_DATE_LABEL"]: item.currentReadingDate
  }));
  store.dispatch(handleField("bulkImport", "components.div.children.bulkMeterReadingData", "props.data", data));
  store.dispatch(handleField("bulkImport", "components.div.children.bulkMeterReadingData", "props.rows",
  removedConsumerNumber.length
  ));
  store.dispatch(prepareFinalObject('meterReadingBulk',removedConsumerNumber))
  store.dispatch(prepareFinalObject('meterReading',[]))
}

const editTableData = (value,data) => {

}

export const bulkMeterReadingData = {
  uiFramework: "custom-molecules",
  moduleName: "egov-wns",
  componentPath: "Table",
  visible: true,
  props: {
    columns: [
      {
        name: "Consumer No",
        labelKey: "WS_COMMON_TABLE_COL_CONSUMER_NO_LABEL", 
        options: {
          filter: false,
        }
      },
      {
        name: "Billing Period",
        labelKey: "WS_CONSUMPTION_DETAILS_BILLING_PERIOD_LABEL", 
        options: {
          filter: false,
        }
      },
      {
        name: "Meter Status",
        labelKey: "WS_SELECT_METER_STATUS_LABEL",
        options: {
          display:true,
          filter: false,
          customBodyRender: value => (
            <span style={{ color: '#000000' }}>
              {value}
            </span>
          )
        }
      },
      {name : "Last Reading Date",labelKey: "WS_CONSUMPTION_DETAILS_LAST_READING_DATE_LABEL" },
      {name : "Last Reading",labelKey: "WS_CONSUMPTION_DETAILS_LAST_READING_LABEL" },
      {name : "Current Reading",labelKey: "WS_CONSUMPTION_DETAILS_CURRENT_READING_LABEL" },
      {
        name: "Consumption",
        labelKey: "WS_CONSUMPTION_DETAILS_CONSUMPTION_LABEL",
        options: {
          display: true
        }
      },
      {
        name: "Current Reading Date",
        labelKey: "WS_CONSUMPTION_DETAILS_CURRENT_READING_DATE_LABEL", 
        options: {
          display: true
        }
      },
      {
        name: "Action",
        labelKey: "PT_COMMON_TABLE_COL_ACTION_LABEL",
        options: {
        filter: false,
            customBodyRender: (value, data) => {
                return (
                  <div>
                    <div className="linkStyle" onClick={() => 
                        editTableData(data)}>
                        <a style={{ color: '#fe7a51'}}>{'Edit'}
                        </a>
                    </div>
                    <div className="linkStyle" onClick={() => 
                        deleteTableData(data)}>
                        <a style={{ color: '#fe7a51' }}>{'Delete'}
                        </a>
                    </div>
                  </div>
                )
                    
            }
        }
      }
    ],
    title: {labelKey:"WS_HOME_SEARCH_APPLICATION_RESULTS_TABLE_HEADING", labelName:"Search Results for Water & Sewerage Application"},
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
