import get from "lodash/get";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getSearchResults } from "../../../../..//ui-utils/commons";
import {
  convertEpochToDate,
  convertDateToEpoch,
  getTextToLocalMapping
} from "../../utils/index";
import {
 enableFieldAndHideSpinner,disableFieldAndShowSpinner
} from "egov-ui-framework/ui-utils/commons";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { validateFields } from "../../utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
//import { LabelContainer } from "egov-ui-framework/ui-containers";
import store from "ui-redux/store";
import { showSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {httpRequest} from '../../../../../ui-utils/api'
import { hideSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";

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
    disableFieldAndShowSpinner('search',"components.div.children.tradeLicenseApplication.children.cardContent.children.button.children.buttonContainer.children.searchButton",dispatch);
    const response = await getSearchResults(queryObject);


    try {

      let data = response.MarriageRegistrations.map(item => ({
        ['MR_COMMON_TABLE_COL_APP_NO']:
          item.applicationNumber || "-",
        ['MR_COMMON_TABLE_COL_REG_NO']: item.mrNumber || "-",
        ['MR_COMMON_TABLE_COL_GROOM_NAME']: item.coupleDetails[0].bride.firstName || "-",
        ['MR_COMMON_TABLE_COL_BRIDE_NAME']: item.coupleDetails[0].groom.firstName || "-",
        ['MR_COMMON_TABLE_COL_APP_DATE']:
          convertEpochToDate(item.applicationDate) || "-",

          ['MR_COMMON_TABLE_COL_APP_TYPE']:
          `MR_TYPE_${item.applicationType}`  || "NEW",
        ['MR_COMMON_TABLE_COL_STATUS']: item.status || "-",
        ["TENANT_ID"]: item.tenantId,
        ["MR_COMMON_TABLE_COL_STATUS"]: item.status || "-"
      }));
      enableFieldAndHideSpinner('search',"components.div.children.tradeLicenseApplication.children.cardContent.children.button.children.buttonContainer.children.searchButton",dispatch);
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
          response.MarriageRegistrations.length
        )
      );
      showHideTable(true, dispatch);
    } catch (error) {
      dispatch(toggleSnackbar(true, error.message, "error"));
      console.log(error);
    }
  }
};

const showHideTable = (booleanHideOrShow) => {
  store.dispatch(
    handleField(
      "search",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};

export const getPendingDigitallySignedApplications = async () => {
  showHideTable(false);
  showHideDigitalSingedApplicationsTable (false)
  store.dispatch(showSpinner())
  const userInfo = JSON.parse(getUserInfo());
  const uuid = userInfo && userInfo.uuid

  let queryObject = [
    {
      key: "tenantId",
      value: getTenantId()
    },
    { key: "employeeUuid", value: uuid }
  ];

  try {
    const response = await httpRequest(
      "post",
      "/mr-services/v1/_searchdscdetails",
      "",
      queryObject
    );

    let data = []
    data = response && response.dscDetails && response.dscDetails.length > 0 &&
    response.dscDetails.map(item => ({
      ['TL_COMMON_TABLE_COL_APP_NO']:
        item.applicationNumber || "-",
      ['TENANT_ID']: item.tenantId || "-",
      ['PT_COMMON_TABLE_COL_ACTION_LABEL'] : "Sign Pdf"
    })) || [];

    store.dispatch(
      handleField(
        "search",
        "components.div.children.showSearches.children.showSearchScreens.props.tabs[1].tabContent.searchDigitalSignatureResults",
        "props.data",
        data
      )
    );
    store.dispatch(
      handleField(
        "search",
        "components.div.children.showSearches.children.showSearchScreens.props.tabs[1].tabContent.searchDigitalSignatureResults",
        "props.rows",
        response.dscDetails && response.dscDetails.length || 0
      )
    );
    showHideDigitalSingedApplicationsTable(true);
    store.dispatch(hideSpinner())
    return response;

  }catch(err){
    store.dispatch(
      toggleSnackbar(
        true,
        {
          labelName: err && err.message || "",
          labelKey: err && err.message || ""
        },
        "error"
      )
    );
    showHideDigitalSingedApplicationsTable(true);
    store.dispatch(
      handleField(
        "search",
        "components.div.children.showSearches.children.showSearchScreens.props.tabs[1].tabContent.searchDigitalSignatureResults",
        "props.data",
        []
      )
    );store.dispatch(
      handleField(
        "search",
        "components.div.children.showSearches.children.showSearchScreens.props.tabs[1].tabContent.searchDigitalSignatureResults",
        "props.data",
        []
      )
    );
    store.dispatch(hideSpinner())
  }
}

const showHideDigitalSingedApplicationsTable = (value) => {
  store.dispatch(
    handleField(
      "search",
      "components.div.children.showSearches.children.showSearchScreens.props.tabs[1].tabContent.searchDigitalSignatureResults",
      "visible",
      value
    )
  );
  
}
