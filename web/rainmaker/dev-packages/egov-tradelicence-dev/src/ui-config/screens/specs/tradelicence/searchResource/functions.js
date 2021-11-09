import get from "lodash/get";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults, getSearchResultsForTradeSearch } from "../../../../..//ui-utils/commons";
import {
  convertEpochToDate,
  convertDateToEpoch,
  getTextToLocalMapping
} from "../../utils/index";
import {
  enableFieldAndHideSpinner, disableFieldAndShowSpinner
} from "egov-ui-framework/ui-utils/commons";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { validateFields } from "../../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
//import { LabelContainer } from "egov-ui-framework/ui-containers";

export const searchApiCall = async (state, dispatch) => {
  showHideTable(false, dispatch);
  let queryObject = [
    {
      key: "tenantId",
      value: getTenantId()
    },
    { key: "offset", value: "0" }
  ];
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen",
    {}
  );
  const isSearchBoxFirstRowValid = validateFields(
    "components.div.children.tradeLicenseApplication.children.cardContent.children.appTradeAndMobNumContainer.children",
    state,
    dispatch,
    "search"
  );

  const isSearchBoxSecondRowValid = validateFields(
    "components.div.children.tradeLicenseApplication.children.cardContent.children.appStatusAndToFromDateContainer.children",
    state,
    dispatch,
    "search"
  );

  if (!(isSearchBoxFirstRowValid && isSearchBoxSecondRowValid)) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill valid fields to start search",
          labelKey: "ERR_FILL_VALID_FIELDS"
        },
        "warning"
      )
    );
  } else if (
    Object.keys(searchScreenObject).length == 0 ||
    Object.values(searchScreenObject).every(x => x === "")
  ) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill at least one field to start search",
          labelKey: "ERR_FILL_ONE_FIELDS"
        },
        "warning"
      )
    );
  } else if (
    (searchScreenObject["fromDate"] === undefined ||
      searchScreenObject["fromDate"].length === 0) &&
    searchScreenObject["toDate"] !== undefined &&
    searchScreenObject["toDate"].length !== 0
  ) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: "Please fill From Date", labelKey: "ERR_FILL_FROM_DATE" },
        "warning"
      )
    );
  } else {
    for (var key in searchScreenObject) {
      if (
        searchScreenObject.hasOwnProperty(key) &&
        searchScreenObject[key].trim() !== ""
      ) {
        if (key === "fromDate") {
          queryObject.push({
            key: key,
            value: convertDateToEpoch(searchScreenObject[key], "daystart")
          });
        } else if (key === "toDate") {
          queryObject.push({
            key: key,
            value: convertDateToEpoch(searchScreenObject[key], "dayend")
          });
        } else {
          queryObject.push({ key: key, value: searchScreenObject[key].trim().toUpperCase() });
        }
      }
    }
    disableFieldAndShowSpinner('search', "components.div.children.tradeLicenseApplication.children.cardContent.children.button.children.buttonContainer.children.searchButton", dispatch);
    const response = await getSearchResults(queryObject);


    try {

      let data = response.Licenses.map(item => ({
        ['TL_COMMON_TABLE_COL_APP_NO']:
          item.applicationNumber || "-",
        ['TL_COMMON_TABLE_COL_LIC_NO']: item.licenseNumber || "-",
        ['TL_COMMON_TABLE_COL_TRD_NAME']: item.tradeName || "-",
        ['TL_COMMON_TABLE_COL_OWN_NAME']:
          item.tradeLicenseDetail.owners[0].name || "-",
        ['TL_COMMON_TABLE_COL_APP_DATE']:
          convertEpochToDate(item.applicationDate) || "-",
        ['TL_COMMON_TABLE_COL_FIN_YEAR']:
          item.financialYear || "-",
        ['TL_COMMON_TABLE_COL_APP_TYPE']:
          `TL_TYPE_${item.applicationType}` || "NEW",
        ['TL_COMMON_TABLE_COL_STATUS']: item.status || "-",
        ["TENANT_ID"]: item.tenantId,
        ["TL_COMMON_TABLE_COL_STATUS"]: item.status || "-"
      }));
      enableFieldAndHideSpinner('search', "components.div.children.tradeLicenseApplication.children.cardContent.children.button.children.buttonContainer.children.searchButton", dispatch);
      dispatch(
        handleField(
          "search",
          "components.div.children.searchResults",
          "props.data",
          data
        )
      );
      dispatch(
        handleField(
          "search",
          "components.div.children.searchResults",
          "props.rows",
          response.Licenses.length
        )
      );
      showHideTable(true, dispatch);
    } catch (error) {
      dispatch(toggleSnackbar(true, error.message, "error"));
      console.log(error);
    }
  }
};
const showHideTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "search",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};

const showHideTradeSearchTable = (booleanHideOrShow, dispatch) => {
  dispatch(
    handleField(
      "tradesearch",
      "components.div.children.tradeSearchResults",
      "visible",
      booleanHideOrShow
    )
  );
};


export const searchApiCallForTradeSearch = async (state, dispatch) => {
  showHideTradeSearchTable(false, dispatch);
  let queryObject = [];
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen",
    {}
  );
  const isSearchBoxFirstRowValid = validateFields(
    "components.div.children.tradeSearchForm.children.cardContent.children.appTradeAndMobNumContainer.children",
    state,
    dispatch,
    "search"
  );

  const isSearchBoxSecondRowValid = validateFields(
    "components.div.children.tradeLicenseApplication.children.cardContent.children.appStatusAndToFromDateContainer.children",
    state,
    dispatch,
    "search"
  );

  if (!(isSearchBoxFirstRowValid)) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill valid fields to start search",
          labelKey: "ERR_FILL_VALID_FIELDS"
        },
        "warning"
      )
    );
  } else if (
    Object.keys(searchScreenObject).length == 0 ||
    Object.values(searchScreenObject).every(x => x === "")
  ) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill at least one field to start search",
          labelKey: "ERR_FILL_ONE_FIELDS"
        },
        "warning"
      )
    );
  } else {
    for (var key in searchScreenObject) {
      if (
        searchScreenObject.hasOwnProperty(key) &&
        searchScreenObject[key].trim() !== ""
      ) {

        queryObject.push({ key: key, value: key == "tenantId" ? searchScreenObject[key].trim().toLowerCase() : searchScreenObject[key].trim().toUpperCase() });

      }
    }
    disableFieldAndShowSpinner('tradesearch', "components.div.children.tradeSearchForm.children.cardContent.children.button.children.buttonContainer.children.searchButton", dispatch);
    console.log(queryObject, "Nero Query Object")
    const response = await getSearchResultsForTradeSearch(queryObject);


    try {
      console.log(response, "Nero Responsess")
      let data = response && response.billingSlab && response.billingSlab.map(item => ({
        
        ['TL_COMMON_TABLE_COL_ACTION']:
          "Edit",
          ['TL_COMMON_TABLE_COL_RECORD_ID']:
          item.id || "-",  
        ['TL_COMMON_TABLE_COL_TENANT_ID']:
          item.tenantId || "-",
        ['TL_COMMON_TABLE_COL_LICENSE_TYPE']:
          item.licenseType || "-",
        ['TL_COMMON_TABLE_COL_TRADE']:
          item.tradeType || "-",
        ['TL_COMMON_TABLE_COL_UOM']:
          item.uom || "-",
        ['TL_COMMON_TABLE_COL_FROM_UOM']:
          item.fromUom || "-",
        ['TL_COMMON_TABLE_COL_TO_UOM']:
          item.toUom || "-",
        ['TL_COMMON_TABLE_COL_RATE']:
          item.rate || "-",
        ['TL_COMMON_TABLE_COL_RATE_TYPE']:
          item.type || "-",
        ['TL_COMMON_TABLE_COL_APPLICATION_TYPE']:
          item.applicationType || "-",

      }));
      enableFieldAndHideSpinner('tradesearch', "components.div.children.tradeSearchForm.children.cardContent.children.button.children.buttonContainer.children.searchButton", dispatch);
      dispatch(
        handleField(
          "tradesearch",
          "components.div.children.tradeSearchResults",
          "props.data",
          data
        )
      );
      dispatch(
        handleField(
          "tradesearch",
          "components.div.children.tradeSearchResults",
          "props.rows",
          response.billingSlab.length
        )
      );
      showHideTradeSearchTable(true, dispatch);
    } catch (error) {
      console.log(error, "Nero Error")
      dispatch(toggleSnackbar(true, error.message, "error"));
      console.log(error);
    }
  }
};