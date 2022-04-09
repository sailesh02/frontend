import { LabelContainer } from "egov-ui-framework/ui-containers";
import { handleScreenConfigurationFieldChange as handleField, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { disableField, enableField } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import React from "react";
import { getSearchResults, getDemandSearchResult } from "../../../../../ui-utils/commons";
// import { validateFields } from "../utils/index";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";

export const applicationSearch = async (state, dispatch) => {
  searchApiCall(state, dispatch)
}
export const resetFields = (state, dispatch) => {
  dispatch(
    handleField(
      "demand-adjust-search",
      "components.div.children.PTApplication.children.cardContent.children.ptApplicationContainer.children.ulbCity",
      "props.value",
      ""
    )
  );

  dispatch(
    handleField(
      "demand-adjust-search",
      "components.div.children.PTApplication.children.cardContent.children.ptApplicationContainer.children.propertyTaxUniqueId",
      "props.value",
      ""
    )
  );
  dispatch(
    handleField(
      "demand-adjust-search",
      "components.div.children.PTApplication.children.cardContent.children.ptApplicationContainer.children.existingPropertyId",
      "props.value",
      ""
    )
  );
  dispatch(prepareFinalObject(
    "ptDemandsSearchScreen.tenantId",
    ''
  ))
  dispatch(prepareFinalObject(
    "ptDemandsSearchScreen.ids",
    ""
  ))
}


const getAddress = (item) => {
  let doorNo = item.address.doorNo != null ? (item.address.doorNo + ",") : '';
  let buildingName = item.address.buildingName != null ? (item.address.buildingName + ",") : '';
  let street = item.address.street != null ? (item.address.street + ",") : '';
  let mohalla = item.address.locality.name ? (item.address.locality.name + ",") : '';
  let city = item.address.city != null ? (item.address.city) : '';
  return (doorNo + buildingName + street + mohalla + city);
}

const searchApiCall = async (state, dispatch) => {
  showHideTable(false, dispatch);


  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "ptDemandsSearchScreen",
    {}
  );
  console.log(searchScreenObject, "searchScreenObject")
  if ((!searchScreenObject.tenantId)) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill valid fields to search",
          labelKey: "ERR_PT_FILL_VALID_FIELDS"
        },
        "error"
      )
    );
    return;

  }

  let query = { "tenantId": searchScreenObject.tenantId };
  if (process.env.REACT_APP_NAME == "Citizen") {
    query = {}
  }

  let formValid = false;
  if (searchScreenObject.ids != '') {
    formValid = true;
  }

  if (!formValid) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill valid fields to search",
          labelKey: "ERR_PT_FILL_VALID_FIELDS"
        },
        "error"
      )
    );
    return;
  }

  if (
    Object.keys(searchScreenObject).length == 0 || Object.keys(searchScreenObject).length == 1 ||
    (Object.values(searchScreenObject).every(x => x === ""))
  ) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill at least one field along with city",
          labelKey: "PT_SEARCH_SELECT_AT_LEAST_ONE_TOAST_MESSAGE_OTHER_THAN_CITY"
        },
        "error"
      )
    );
    return;
  }

  else {

    // removeValidation(state, dispatch, index);
    for (var key in searchScreenObject) {
      if (
        searchScreenObject.hasOwnProperty(key) &&
        searchScreenObject[key].trim() !== ""
      ) {
        if (key === "tenantId") {

        }
        else if (key === "ids") {
          query["propertyIds"] = searchScreenObject[key].trim();
        }
        else {
          query[key] = searchScreenObject[key].trim();
        }
      }
    }
    let queryObject = [];
    Object.keys(query).map(key => {
      queryObject.push({
        key: key, value: query[key]
      })
    })
    try {
      disableField('demand-adjust-search', "components.div.children.PTApplication.children.cardContent.children.button.children.buttonContainer.children.searchButton", dispatch);
      //   disableField('demand-adjust-search', "components.div.children.propertySearchTabs.children.cardContent.children.tabSection.props.tabs[1].tabContent.searchApplicationDetails.children.cardContent.children.button.children.buttonContainer.children.searchButton", dispatch);
      const response = await getSearchResults(queryObject);
      // console.log(response,"responseresponse")
      // const response = searchSampleResponse();

      let propertyData = response.Properties.map(item => ({
        ["PT_COMMON_TABLE_COL_PT_ID"]:
          item.propertyId || "-",
        ["PT_COMMON_TABLE_COL_OWNER_NAME"]: item.owners[0].name || "-",
        ["PT_GUARDIAN_NAME"]:
          item.owners[0].fatherOrHusbandName || "-",
        ["PT_COMMON_COL_EXISTING_PROP_ID"]:
          item.oldPropertyId || "-",
        ["PT_COMMON_COL_ADDRESS"]:
          getAddress(item) || "-",
        ["TENANT_ID"]: item.tenantId,
        ["PT_COMMON_TABLE_COL_STATUS_LABEL"]: item.status || "-",
        ["businessService"]: item.businessService
      }));


      enableField('demand-adjust-search', "components.div.children.PTApplication.children.cardContent.children.button.children.buttonContainer.children.searchButton", dispatch);

      dispatch(
        handleField(
          "demand-adjust-search",
          "components.div.children.searchResults",
          "props.data",
          propertyData
        )
      );
      dispatch(
        handleField(
          "demand-adjust-search",
          "components.div.children.searchResults",
          "props.rows",
          response.Properties.length
        )
      );


      showHideTable(true, dispatch);
    } catch (error) {

      enableField('demand-adjust-search', "components.div.children.PTApplication.children.cardContent.children.button.children.buttonContainer.children.searchButton", dispatch);

      dispatch(
        toggleSnackbar(
          true,
          { labelName: error.message, labelKey: error.message },
          "error"
        )
      );
      console.log(error);
    }
  }
};
const showHideTable = (booleanHideOrShow, dispatch) => {

  dispatch(
    handleField(
      "demand-adjust-search",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );



};