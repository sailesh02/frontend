import { handleScreenConfigurationFieldChange as handleField, toggleSnackbar, showSpinner, hideSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getUserInfo, getTenantIdCommon } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { fetchBill, findAndReplace, getSearchResults, getSearchResultsForSewerage, getWorkFlowData, serviceConst, getDemandsOfConnection } from "../../../../../ui-utils/commons";
import { validateFields } from "../../utils";
import { convertDateToEpoch, convertEpochToDate, resetFieldsForApplication, getTextToLocalMapping } from "../../utils/index";
import { httpRequest } from "../../../../../ui-utils";
import store from "ui-redux/store";

export const searchApiCall = async (state, dispatch) => {

  store.dispatch(showSpinner())
  await renderSearchConnectionTable(state, dispatch);

  store.dispatch(hideSpinner())
}
const renderSearchConnectionTable = async (state, dispatch) => {
  let queryObject = [];
  queryObject.push({ key: "searchType", value: "CONNECTION" });
  let searchScreenObject = get(state.screenConfiguration.preparedFinalObject, "searchConnection", {});
  Object.keys(searchScreenObject).forEach((key) => (searchScreenObject[key] == "") && delete searchScreenObject[key]);
  if (
    Object.values(searchScreenObject).length <= 1
  ) {
    dispatch(toggleSnackbar(true, { labelName: "Please provide the city and any one other field information to search for property.", labelKey: "ERR_PT_COMMON_FILL_MANDATORY_FIELDS" }, "warning"));
  } else {
    for (var key in searchScreenObject) {
      queryObject.push({ key: key, value: searchScreenObject[key].trim() });
    }
    let demandsResult;
    let finalArray = [];
    demandsResult = await getSearchResults(queryObject, dispatch)
    console.log(demandsResult, "Nero connection details")
    if (demandsResult && demandsResult.WaterConnection && demandsResult.WaterConnection.length > 0) {
      for (let i = 0; i < demandsResult.WaterConnection.length; i++) {
        let element = demandsResult.WaterConnection[i];

        finalArray.push({
          service: element.connectionFacility,
          connectionNo: element.connectionNo,
          tenantId: element.tenantId,
          ownerName: element.connectionHolders[0].name,
          address: element.connectionHolders[0].correspondenceAddress,
          status: element.applicationStatus
        })

      }
      showConnectionResults(finalArray, dispatch)

    } else {
      showConnectionResults(finalArray, dispatch)
      console.log("No result Found")
    }
  }
}

const showHideConnectionTable = (booleanHideOrShow, dispatch) => {
  dispatch(handleField("demand-adjust-search", "components.div.children.searchResults", "visible", booleanHideOrShow));
};



const showConnectionResults = (connections, dispatch) => {

  let data = connections.map((item, index) => {

    return {
      ["WS_COMMON_TABLE_COL_SERVICE_LABEL"]: item.service,
      ["WS_COMMON_TABLE_COL_CONSUMER_NO_LABEL"]: item.connectionNo,

      ["WS_COMMON_TABLE_COL_TENANTID_LABEL"]: item.tenantId,

      ["WS_COMMON_TABLE_COL_OWN_NAME_LABEL"]: item.ownerName,
      ["WS_COMMON_TABLE_COL_ADDRESS"]: item.address,
      ["WS_COMMON_TABLE_COL_APPLICATION_CURRENT_STATE"]: item.status ? getTextToLocalMapping(item.status) : 'NA'

    }
  }
  );

  dispatch(handleField("demand-adjust-search", "components.div.children.searchResults", "props.data", data));
  dispatch(handleField("demand-adjust-search", "components.div.children.searchResults", "props.rows",
    connections.length
  ));
  showHideConnectionTable(true, dispatch);
}

export const resetFieldsForConnection = (state, dispatch) => {
  dispatch(
    handleField(
      "demand-adjust-search",
      "components.div.children.wnsApplication.children.cardContent.children.wnsApplicationContainer.children.consumerid",
      "props.value",
      ""
    )
  );
  

 
}




