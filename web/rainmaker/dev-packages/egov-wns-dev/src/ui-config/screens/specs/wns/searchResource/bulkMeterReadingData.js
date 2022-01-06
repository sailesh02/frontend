import React from "react";
import { sortByEpoch, getEpochForDate } from "../../utils";
import './index.css';
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import store from "ui-redux/store";
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getLocaleLabels, getStatusKey } from "egov-ui-framework/ui-utils/commons";

const deleteTableData = (value) => {
  if(window.confirm(getLocaleLabels('WS_BULK_DELETE_CONFIRMATION','WS_BULK_DELETE_CONFIRMATION'))){
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
  
}

const editTableData = (value,data) => {
  let consumerNumber = value && value.rowData && value.rowData.length > 0 && value.rowData[0] || ""
  let state = store.getState()
  let meterReadingBulk = state && state.screenConfiguration && state.screenConfiguration.preparedFinalObject && 
  state.screenConfiguration.preparedFinalObject.meterReadingBulk || []
  let removedConsumerNumber = meterReadingBulk && meterReadingBulk.length > 0 && 
  meterReadingBulk.filter( data => {
    return data.connectionNo != consumerNumber
  }) || []

  let requiredConsumerNumber = meterReadingBulk && meterReadingBulk.length > 0 && 
  meterReadingBulk.filter( data => {
    return data.connectionNo == consumerNumber
  }) || []

  store.dispatch(prepareFinalObject('meterReading',requiredConsumerNumber))
  store.dispatch(prepareFinalObject('meterReadingBulk',removedConsumerNumber))
  if(requiredConsumerNumber && requiredConsumerNumber.length > 0){
    store.dispatch(
      handleField(
        "bulkImport",
        "components.div.children.bulkImportApplication.children.cardContent.children.bulkImportContainer.children.consumption",
        "props.value",
        requiredConsumerNumber[0].consumption
      )
    );

    store.dispatch(
      handleField(
        "bulkImport",
        "components.div.children.bulkImportApplication.children.cardContent.children.bulkImportContainer.children.consumerNumber",
        "props.value",
        requiredConsumerNumber[0].connectionNo
      )
    );
    store.dispatch(
      handleField(
        "bulkImport",
        "components.div.children.bulkImportApplication.children.cardContent.children.bulkImportContainer.children.billingPeriod",
        "props.value",
        requiredConsumerNumber[0].billingPeriod
      )
    );
  
    store.dispatch(
      handleField(
        "bulkImport",
        "components.div.children.bulkImportApplication.children.cardContent.children.bulkImportContainer.children.lastReading",
        "props.value",
        requiredConsumerNumber[0].lastReading
      )
    );
    store.dispatch(
      handleField(
        "bulkImport",
        "components.div.children.bulkImportApplication.children.cardContent.children.bulkImportContainer.children.lastReadingDate",
        "props.value",
        requiredConsumerNumber[0].lastReadingDate
      )
    );
    store.dispatch(
      handleField(
        "bulkImport",
        "components.div.children.bulkImportApplication.children.cardContent.children.bulkImportContainer.children.currentReading",
        "props.value",
        requiredConsumerNumber[0].currentReading
      )
    );
    store.dispatch(
      handleField(
        "bulkImport",
        "components.div.children.bulkImportApplication.children.cardContent.children.bulkImportContainer.children.currentReadingDate",
        "props.value",
        requiredConsumerNumber[0].currentReadingDate
      )
    );
    store.dispatch(
      handleField(
        "bulkImport",
        "components.div.children.bulkImportApplication.children.cardContent.children.bulkImportContainer.children.meterStatus",
        "props.value",
        requiredConsumerNumber[0].meterStatus
      )
    );
  }

  store.dispatch(handleField(
    "bulkImport",
    "components.div.children.bulkImportApplication.children.cardContent.children.bulkImportContainer.children.consumerNumber",
    "props.disabled",
    true
  ))
  store.dispatch(handleField(
    "bulkImport",
    "components.div.children.bulkImportApplication.children.cardContent.children.button.children.buttonContainer.children.editButton",
    "visible",
    true
  ))
  store.dispatch(handleField(
    "bulkImport",
    "components.div.children.bulkImportApplication.children.cardContent.children.button.children.buttonContainer.children.resetButton",
    "visible",
    false
  ))
  store.dispatch(handleField(
    "bulkImport",
    "components.div.children.bulkImportApplication.children.cardContent.children.button.children.buttonContainer.children.updateButton",
    "visible",
    false
  ))
}

export const bulkMeterReadingData = {
  uiFramework: "custom-molecules",
  // moduleName: "egov-wns",
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
    title: {labelKey:"WS_PER_CONNECTION_METER_READING_RESULTS", labelName:"Connection wise Meter Reading Details"},
    options: {
      filter: false,
      download: true,
      // responsive: "stacked",
      responsive: "scroll",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20],
      downloadOptions:{
        fileName:'bulk meter data'
      },
      onDownload: (row, index) => {
        debugger
      },
    },
    rows:0,
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

export const bulkMeterReadingDataAfterSubmit = {
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
        labelName: "Meter Reading Status",
        labelKey: "WS_CONSUMPTION_DETAILS_METER_READING_STATUS_LABEL",
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
      }
     
    ],
    title: {labelKey:"WS_PER_CONNECTION_METER_READING_SUMMARY", labelName:"Connection wise Meter Reading Summary"},
    options: {
      filter: false,
      download: false,
      // responsive: "stacked",
      responsive: "scroll",
      selectableRows: false,
      hover: true,
      rowsPerPageOptions: [10, 15, 20]
    },
    rows:0,
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
