import React from "react";
import { sortByEpoch, getEpochForDate } from "../../utils";
import { Link } from "react-router-dom"
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import { getDomainLink } from "../../../../../ui-utils/commons";
import "./index.css";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import store from "ui-redux/store";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../../ui-utils/api";

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
      { name: "Consumer No",  labelKey: "WS_COMMON_TABLE_COL_CONSUMER_NO_LABEL" },
      { name : "Owner Name",  labelKey: "WS_COMMON_TABLE_COL_OWN_NAME_LABEL" },
      { name : "Status", labelKey: "WS_COMMON_TABLE_COL_STATUS_LABEL" },
      { name: "Due", labelKey: "WS_COMMON_TABLE_COL_DUE_LABEL" },
      { name: "Address", labelKey: "WS_COMMON_TABLE_COL_ADDRESS"},
      { name: "Due Date", labelKey: "WS_COMMON_TABLE_COL_DUE_DATE_LABEL"},
      {
        name: "Action",
        labelKey: "PT_COMMON_TABLE_COL_ACTION_LABEL",
	      options: {
          filter: false,
          customBodyRender: (value, data) => {
            if (data.rowData[4] !== undefined && typeof data.rowData[4] === 'number') {
              return (
                <div className="linkStyle" onClick={() => getViewBillDetails(data)} style={{ color: '#fe7a51', textTransform: 'uppercase' }}>
                  <LabelContainer
                    labelKey="CS_COMMON_PAY"
                    style={{
                      color: "#fe7a51",
                      fontSize: 14,
                    }}
                  />
                </div>
              )
            } 
            else {
              return ("NA")
            }
          }
        }
      },
      {
        name: "Link Mobile",
        labelKey: "WS_COMMON_LINK_MOBILE_NO_LABEL",
        options: {
          filter: false,
          customBodyRender: (value, data) => {
            return (
              <div className="linkStyle" onClick={() => linkMobile(data,data.rowData[0],data.rowData[1])} style={{ color: '#fe7a51', textTransform: 'uppercase' }}>
                <LabelContainer
                  labelKey="WS_COMMON_LINK_MOBILE"
                  style={{
                    color: "#fe7a51",
                    fontSize: 14,
                  }}
                />
              </div>
            )
          }
        }
      },
      {
        name: "Tenant Id",
        labelKey: "WS_COMMON_TABLE_COL_TENANTID_LABEL",
        options: {
          display: false
        }
      },
      {
        name: "Connection Type",
        labelKey: "WS_COMMON_TABLE_COL_CONNECTIONTYPE_LABEL",
        options: {
          display: false
        }
      }
    ],
    title: {
      labelKey:"WS_HOME_SEARCH_RESULTS_TABLE_HEADING", 
      labelName:"Search Results for Water & Sewerage Connections"
    },
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


const getViewBillDetails = data => {  
  store.dispatch(
    setRoute(`/wns/viewBill?connectionNumber=${data.rowData[1]}&tenantId=${data.rowData[8]}&service=${data.rowData[0]}&connectionType=${data.rowData[9]}`)
  )
}

const linkMobile = (data,serviceType,connectionNumber) => {
  const state = store.getState();
  let userInfo = JSON.parse(getUserInfo());
  if(serviceType == "WATER"){
    const {connections} = state.screenConfiguration.preparedFinalObject || []
    let payload = WaterConnection
    if(payload && payload[0].connectionHolders && payload[0].connectionHolders[0].mobileNumber){
      toggleSnackbarAndSetText(
        true,
        { labelName: "Mobile Number is already linked", labelKey: "MOBILE_ALREADY_LINKED_ERROR_MSG" },
        "error"
      );    
    }else{
      payload = [{...WaterConnection[0],connectionHolders:[{
        ...WaterConnection[0].connectionHolders[0],mobileNumber:userInfo.mobileNumber ? userInfo.mobileNumber : ''
      }]}]
      const waterConnectionResponse = await httpRequest("post", "/ws-services/wc/_update", "", [], { WaterConnection: payload });
      if(waterConnectionResponse){
      toggleSnackbarAndSetText(
          true,
          { labelName: "Mobile Number linked successfully", labelKey: "MOBILE_LINKED_SUCCESS_MSG" },
          "success"
        );
      }
    }
  }else{
    const {Sewe} = state.screenConfiguration.preparedFinalObject || []
    let payload = WaterConnection
    if(payload && payload[0].connectionHolders && payload[0].connectionHolders[0].mobileNumber){
      toggleSnackbarAndSetText(
        true,
        { labelName: "Mobile Number is already linked", labelKey: "MOBILE_ALREADY_LINKED_ERROR_MSG" },
        "error"
      );    
    }else{
      payload = [{...WaterConnection[0],connectionHolders:[{
        ...WaterConnection[0].connectionHolders[0],mobileNumber:userInfo.mobileNumber ? userInfo.mobileNumber : ''
      }]}]
      const waterConnectionResponse = await httpRequest("post", "/ws-services/wc/_update", "", [], { WaterConnection: payload });
      if(waterConnectionResponse){
      toggleSnackbarAndSetText(
          true,
          { labelName: "Mobile Number linked successfully", labelKey: "MOBILE_LINKED_SUCCESS_MSG" },
          "success"
        );
      }
    }
  }
}
