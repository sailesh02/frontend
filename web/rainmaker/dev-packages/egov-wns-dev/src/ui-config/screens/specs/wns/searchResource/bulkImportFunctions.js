import { handleScreenConfigurationFieldChange as handleField, toggleSnackbar, showSpinner, hideSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getUserInfo, getTenantIdCommon } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { fetchBill, findAndReplace, getSearchResults, getSearchResultsForSewerage, getWorkFlowData, serviceConst } from "../../../../../ui-utils/commons";
import { validateFields } from "../../utils";
import { convertDateToEpoch, convertEpochToDate, resetFieldsForApplication, resetFieldsForConnection, getTextToLocalMapping } from "../../utils/index";
import { httpRequest } from "../../../../../ui-utils";
import store from "ui-redux/store";

export const updateTableRow = async (state, dispatch) => {
    store.dispatch(showSpinner())
    await renderSearchApplicationTable(state, dispatch);
    store.dispatch(hideSpinner())
 
}

const renderSearchApplicationTable = async (state, dispatch) => {
  let queryObject = [{ key: "tenantId", value: getTenantIdCommon() }];
  queryObject.push({ key: "isConnectionSearch", value: true });
  let meterReading = get(state.screenConfiguration.preparedFinalObject, "meterReading", {});
  let isFormValid = meterReading && meterReading.length > 0 && meterReading[0].connectionNo && meterReading[0].billingPeriod && 
  meterReading[0].consumption && meterReading[0].consumption != " " && meterReading[0].lastReading && meterReading[0].lastReadingDate &&
  meterReading[0].meterStatus && meterReading[0].currentReading && meterReading[0].currentReadingDate ? true : false
  
  if(isFormValid){
    let finalArray = []
    finalArray.push(meterReading[0])
    showApplicationResults(finalArray, dispatch)
  }else{
    dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "WS_METER_READING_DETAILS_ERROR",
            labelKey: "WS_METER_READING_DETAILS_ERROR"
          },
          "warning"
        )
      );  
  }
}

const showHideApplicationTable = (booleanHideOrShow, dispatch) => {
  dispatch(handleField("search", "components.div.children.searchApplicationResults", "visible", booleanHideOrShow));
};

const showApplicationResults = (connections, dispatch) => {
  let data = connections.map(item => ({
    ["WS_COMMON_TABLE_COL_CONSUMER_NO_LABEL"]: item.connectionNo,
    ["WS_BILLING_PERIOD"]: item.billingPeriod,
    ["WS_SELECT_METER_STATUS"]: item.meterStatus,
    ["WS_LAST_READING_DATE"]: item.lastReadingDate,
    ["WS_LAST_READING"]: item.lastReading,
    ["WS_CURRENT_READING"]: item.currentReading,
    ["WS_CONSUMPTION"]: item.consumption,
    ["WS_CURRENT_READING_DATE"]: item.currentReadingDate
  }));
  dispatch(handleField("bulkImport", "components.div.children.bulkMeterReadingData", "props.data", data));
  dispatch(handleField("bulkImport", "components.div.children.bulkMeterReadingData", "props.rows",
    connections.length
  ));
  showHideApplicationTable(true, dispatch);
}

