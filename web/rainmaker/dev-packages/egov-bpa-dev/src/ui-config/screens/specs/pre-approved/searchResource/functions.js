import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { getBpaSearchResults } from "../../../../../ui-utils/commons";
import { getWorkFlowDataForBPA } from "../../bpastakeholder/searchResource/functions";
import { getDocList, getTextToLocalMapping } from "../../utils";
import { convertDateToEpoch, convertEpochToDate } from "../../utils/index";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { showSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {httpRequest} from '../../../../../ui-utils/api'
import { hideSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import store from "ui-redux/store";

export const searchApiCall = async (state, dispatch) => {
  showHideTable(false, dispatch);
  showHideDigitalSingedApplicationsTable(false);
  showHideDigitalSingedApplicationsTable (false, "2")
  let tenantId = getTenantId();
  let queryObject = [
    {
      key: "tenantId",
      value: tenantId
    }
  ];
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen",
    {}
  );
  // const isSearchBoxFirstRowValid = validateFields(
  //   "components.div.children.BPAApplication.children.cardContent.children.appBPAHomeSearchResultsContainer.children",
  //   state,
  //   dispatch,
  //   "search"
  // );

  // if (!(isSearchBoxFirstRowValid)) {
  //   dispatch(
  //     toggleSnackbar(
  //       true,
  //       {
  //         labelName: "Please fill valid fields to search",
  //         labelKey: "ERR_FIRENOC_FILL_VALID_FIELDS"
  //       },
  //       "error"
  //     )
  //   );
  // } else
  if (
    Object.keys(searchScreenObject).length == 0 ||
    Object.values(searchScreenObject).every(x => x === "")
  ) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please fill at least one field to start search",
          labelKey: "BPA_SEARCH_SELECT_AT_LEAST_ONE_TOAST_MESSAGE"
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
    //  showHideProgress(true, dispatch);
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
        }
        else {
          queryObject.push({ key: key, value: searchScreenObject[key].trim() });
        }
      }
    }
    try {
      const response = await getBpaSearchResults(queryObject);
      const businessIdToOwnerMappingForBPA = await getWorkFlowDataForBPA(get(response, "BPA"));
      // const response = searchSampleResponse();

      let data = response.BPA.map(item => ({
        ["BPA_COMMON_TABLE_COL_APP_NO"]: item.applicationNo || "-",
        ["BPA_COMMON_TABLE_COL_OWN_NAME_LABEL"]: item.landInfo && item.landInfo.owners && item.landInfo.owners.map(function (items) {
          return items.isPrimaryOwner ? items.name : "";
        }),
        ["BPA_COMMON_TABLE_COL_APP_DATE_LABEL"]: convertEpochToDate(parseInt(get(item, "auditDetails.createdTime"))) || "-",
        ["BPA_COMMON_TABLE_COL_STATUS_LABEL"]: getTextToLocalMapping("WF_BPA_" + get(businessIdToOwnerMappingForBPA[item.applicationNo], "state", null)),
        ["TENANT_ID"]: item.tenantId,
        ["SERVICE_TYPE"]: get(item, "businessService", null),
        ["BPA_COMMON_TABLE_COL_APP_STATUS_LABEL"]: item.status || ""
      }));

      // if (data && data.length > 0) {
      //   data.map(items => {
      //     if (items && items["Application Date"]) {
      //       const date = items["Application Date"].split("/");
      //       items["Application Date"] = `${date[1]}/${date[0]}/${date[2]}`
      //     }
      //   });
      // }

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
          response.BPA.length
        )
      );
      //showHideProgress(false, dispatch);
      showHideTable(true, dispatch);
    } catch (error) {
      console.log(error);
    }
  }
};
const getApprovedBy = (userInfo, uuid) => {
  if(userInfo.uuid === uuid){
    return  "Sign Pdf"
  }else{
    return ""
  }
}
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
      "/bpa-services/v1/bpa/_searchdscdetails",
      "",
      queryObject
    );

    let data = []
    data = response && response.dscDetails && response.dscDetails.length > 0 &&
    response.dscDetails.map(item => ({
      ['BPA_COMMON_TABLE_COL_APP_NO']:
        item.applicationNo || "-",
      ['TENANT_ID']: item.tenantId || "-",
      ['BPA_COMMON_TABLE_COL_ACTION_LABEL'] : getApprovedBy(userInfo, item.approvedBy),
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

export const getDownloadDocLink = (item) => {
  let filteredDoc = item && item.documents.filter( item => item.documentType === "BPD.BPL.BPL") 
if(filteredDoc && filteredDoc.length > 0){
  return "Download Document";
}else{
  return "";
}
  
}

export const getUploadDocLink = (item) => {

  let filteredDoc = item && item.documents.filter( item => item.documentType === "BPD.BPL.BPL") 
if(filteredDoc && filteredDoc.length > 0 && "buildingPlanLayoutIsSigned" in item.additionalDetails){
  return "";
}else if(filteredDoc && filteredDoc.length > 0){
  return "Upload Signed Document";
}
//return "Upload Signed Document";
}

export const getPendingDigitallySignedApplicationsForBPADoc = async () => {
  showHideTable(false);
  showHideDigitalSingedApplicationsTable (false, "2")
  store.dispatch(showSpinner())
  const userInfo = JSON.parse(getUserInfo());
  const uuid = userInfo && userInfo.uuid

  let queryObject = [
    {
      key: "tenantId",
      value: getTenantId()
    },
    { key: "status", value: "APPROVED" }
  ];

  try {
    const response = await httpRequest(
      "post",
      "/bpa-services/v1/bpa/_search",
      "",
      queryObject
    );
       let data = []   
    data = response && response.BPA && response.BPA.length > 0 &&
    response.BPA.map(item => ({
      ['BPA_COMMON_TABLE_COL_APP_NO']:
        item.applicationNo || "-",
      ['TENANT_ID']: item.tenantId || "-",
      ['BPA_TABLE_COL_BPL_DOC_DOWNLOAD_ACTION_LABEL'] : getDownloadDocLink(item),
      ['BPA_TABLE_COL_BPL_DOC_UPLOAD_ACTION_LABEL'] : getUploadDocLink(item)
    })) || [];

    store.dispatch(
      handleField(
        "search",
        "components.div.children.showSearches.children.showSearchScreens.props.tabs[2].tabContent.searchDigitalSignatureResultsForBPADoc",
        "props.data",
        data
      )
    );
    store.dispatch(
      handleField(
        "search",
        "components.div.children.showSearches.children.showSearchScreens.props.tabs[2].tabContent.searchDigitalSignatureResultsForBPADoc",
        "props.rows",
        response.BPA && response.BPA.length || 0
      )
    );
    showHideDigitalSingedApplicationsTable(true, "2");
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
    showHideDigitalSingedApplicationsTable(true, "2");
    store.dispatch(
      handleField(
        "search",
        "components.div.children.showSearches.children.showSearchScreens.props.tabs[2].tabContent.searchDigitalSignatureResultsForBPADoc",
        "props.data",
        []
      )
    );store.dispatch(
      handleField(
        "search",
        "components.div.children.showSearches.children.showSearchScreens.props.tabs[2].tabContent.searchDigitalSignatureResultsForBPADoc",
        "props.data",
        []
      )
    );
    store.dispatch(hideSpinner())
  }
}

const showHideTable = (booleanHideOrShow, dispatch) => {
  store.dispatch(
    handleField(
      "search",
      "components.div.children.searchResults",
      "visible",
      booleanHideOrShow
    )
  );
};

const showHideDigitalSingedApplicationsTable = (value, tabIndex="1") => {

  if(tabIndex !== "1"){
    store.dispatch(
      handleField(
        "search",
        `components.div.children.showSearches.children.showSearchScreens.props.tabs[${tabIndex}].tabContent.searchDigitalSignatureResultsForBPADoc`,
        "visible",
        value
      )
    );
  }else{
    store.dispatch(
      handleField(
        "search",
        "components.div.children.showSearches.children.showSearchScreens.props.tabs[1].tabContent.searchDigitalSignatureResults",
        "visible",
        value
      )
    );
  }
  


  
}

export const setResidentialList = (state, dispatch) => {
  let residentialList = get(
    state.screenConfiguration.preparedFinalObject,
    `BPAs[0].BPADetails.blockwiseusagedetails.residential`,
    []
  );
  let furnishedRolesList = residentialList.map(item => {
    return " " + item.label;
  });
  dispatch(
    prepareFinalObject(
      "bpa.summary.residential",
      furnishedRolesList.join()
    )
  );
};
