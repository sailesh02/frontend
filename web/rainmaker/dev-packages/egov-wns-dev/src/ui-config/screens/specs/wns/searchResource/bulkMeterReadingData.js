import React from "react";
import { sortByEpoch, getEpochForDate } from "../../utils";
import './index.css';
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import store from "ui-redux/store";
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";

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
        //   customBodyRender: (value, data) => {
        //     if (data.rowData[0] !== "NA" && data.rowData[0] !== null) {
        //       return (
        //         <div className="linkStyle" onClick={() => getConnectionDetails(data)}>
        //           <a>{value}</a>
        //         </div>
        //       )
        //     } else {
        //       return (
        //         <p>{value}</p>
        //       )
        //     }
        //   }
        }
      },
      {
        name: "Billing Period",
        labelKey: "WS_BILLING_PERIOD", 
        options: {
          filter: false,
        }
      },
      {
        name: "Meter Status",
        labelKey: "WS_SELECT_METER_STATUS",
        options: {
          filter: false,
          customBodyRender: value => (
            <span style={{ color: '#000000' }}>
              {value}
            </span>
          )
        }
      },
      {name : "Last Reading Data",labelKey: "WS_LAST_READING_DATE" },
      {name : "Last Reading",labelKey: "WS_LAST_READING" },
      {name : "Current Reading",labelKey: "WS_CURRENT_READING" },
      {
        name: "Consumption",
        labelKey: "WS_CONSUMPTION",
        options: {
          display: false
        }
      },
      {
        name: "Current Reading Date",
        labelKey: "WS_CURRENT_READING_DATE", 
        options: {
          display: false
        }
      },
      {
        name: "Action",
        labelKey: "PT_COMMON_TABLE_COL_ACTION_LABEL",
        options: {
            filter: false,
            customBodyRender: (value, data) => {
                return (
                  <div style={{ color: '#fe7a51', textTransform: 'uppercase' }}>
                    <LabelContainer onClick ={ () => {
                        alert('CLicked Edit')
                    }}
                      labelKey="WS_EDIT"
                      style={{
                        color: "#fe7a51",
                        fontSize: 14,
                        marginRight:'2px'
                      }}
                      
                    />
                      <LabelContainer onClick ={ () => {
                        alert('CLicked Delete')
                    }}
                      labelKey="WS_DELETE"
                      style={{
                        color: "#fe7a51",
                        fontSize: 14,
                      }}
                      
                    />
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

const getApplicationDetails = data => {
  //application types for close,disconnect,reconnect and ownership change applications
  const applicationTypes = ['SEWERAGE RECONNECTION','DISCONNECT SEWERAGE CONNECTION','CLOSE SEWERAGE CONNECTION',
  'DISCONNECT WATER CONNECTION','WATER RECONNECTION','CLOSE WATER CONNECTION','CONNECTION OWNERSHIP CHANGE']
  let connectionNo = `${data.rowData[0]}`;
  if(connectionNo && connectionNo !== 'NA' && (data.rowData[2].includes('MODIFY') || data.rowData[2].includes('MODIFY WATER CONNECTION') || data.rowData[2].includes('MODIFY SEWERAGE CONNECTION'))) {
    store.dispatch(
      setRoute(`search-preview?applicationNumber=${data.rowData[1]}&tenantId=${data.rowData[6]}&history=true&service=${data.rowData[7]}&mode=MODIFY`)
    )
  }else if(data && applicationTypes.includes(data.rowData[2])) {
    store.dispatch(
      setRoute(`search-preview?applicationNumber=${data.rowData[1]}&tenantId=${data.rowData[6]}&history=true&service=${data.rowData[7]}&disconnectOrClose=true`)
    )
  }
  else {
    store.dispatch(
      setRoute(`search-preview?applicationNumber=${data.rowData[1]}&tenantId=${data.rowData[6]}&history=true&service=${data.rowData[7]}`)
    )
  }
}

const getConnectionDetails = data => {
  store.dispatch(
    setRoute(`connection-details?connectionNumber=${data.rowData[0]}&tenantId=${data.rowData[6]}&service=${data.rowData[7]}&connectionType=${data.rowData[8]}`)
  )
}