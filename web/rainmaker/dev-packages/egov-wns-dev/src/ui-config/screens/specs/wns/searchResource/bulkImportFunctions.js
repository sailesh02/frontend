import { handleScreenConfigurationFieldChange as handleField, toggleSnackbar, showSpinner, hideSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantIdCommon } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import store from "ui-redux/store";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { resetFieldsBulkImport } from '../../utils/index'

export const updateTableRow = async (state, dispatch) => {
    store.dispatch(showSpinner())
    await renderBulkImportTable(state, dispatch);
    store.dispatch(hideSpinner())

}

export const editTableRow = async (state,dispatch) => {
  store.dispatch(showSpinner())
    await renderBulkImportTable(state, dispatch,'edited');
    store.dispatch(hideSpinner())

}

const renderBulkImportTable = async (state, dispatch,edited) => {
  let queryObject = [{ key: "tenantId", value: getTenantIdCommon() }];
  queryObject.push({ key: "isConnectionSearch", value: true });
  let meterReading = get(state.screenConfiguration.preparedFinalObject, "meterReading", {});
  let isFormValid = meterReading && meterReading.length > 0 && meterReading[0].connectionNo && meterReading[0].billingPeriod && 
  meterReading[0].consumption && meterReading[0].consumption != " " && meterReading[0].lastReading && meterReading[0].lastReadingDate &&
  meterReading[0].meterStatus && meterReading[0].currentReading && meterReading[0].currentReadingDate ? true : false

  if(isFormValid){
    let finalArray = get(state.screenConfiguration.preparedFinalObject, "meterReadingBulk", []);
    finalArray.push(meterReading[0])
    showBulkImportTableData(state, dispatch, finalArray,edited)
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

const showBulkImportTableData = (state, dispatch, bulkData,edited) => {
  let data = bulkData.map(item => ({
    ["WS_COMMON_TABLE_COL_CONSUMER_NO_LABEL"]: item.connectionNo,
    ["WS_CONSUMPTION_DETAILS_BILLING_PERIOD_LABEL"]: item.billingPeriod,
    ["WS_SELECT_METER_STATUS_LABEL"]: item.meterStatus,
    ["WS_CONSUMPTION_DETAILS_LAST_READING_DATE_LABEL"]: item.lastReadingDate,
    ["WS_CONSUMPTION_DETAILS_LAST_READING_LABEL"]: item.lastReading,
    ["WS_CONSUMPTION_DETAILS_CURRENT_READING_LABEL"]: item.currentReading,
    ["WS_CONSUMPTION_DETAILS_CONSUMPTION_LABEL"]: item.consumption,
    ["WS_CONSUMPTION_DETAILS_CURRENT_READING_DATE_LABEL"]: item.currentReadingDate
  }));
  dispatch(handleField("bulkImport", "components.div.children.bulkMeterReadingData", "props.data", data));
  dispatch(handleField("bulkImport", "components.div.children.bulkMeterReadingData", "props.rows",
  bulkData.length
  ));
  dispatch(prepareFinalObject('meterReadingBulk',bulkData))
  dispatch(prepareFinalObject('meterReading',[]))
  resetFieldsBulkImport(state,dispatch)
  if(edited){
    store.dispatch(handleField(
      "bulkImport",
      "components.div.children.bulkImportApplication.children.cardContent.children.bulkImportContainer.children.consumerNumber",
      "props.disabled",
      false
    ))
    dispatch(handleField(
      "bulkImport",
      "components.div.children.bulkImportApplication.children.cardContent.children.button.children.buttonContainer.children.editButton",
      "visible",
      false
    ))
    dispatch(handleField(
      "bulkImport",
      "components.div.children.bulkImportApplication.children.cardContent.children.button.children.buttonContainer.children.resetButton",
      "visible",
      true
    ))
    dispatch(handleField(
      "bulkImport",
      "components.div.children.bulkImportApplication.children.cardContent.children.button.children.buttonContainer.children.updateButton",
      "visible",
      true
    ))
  }
}
