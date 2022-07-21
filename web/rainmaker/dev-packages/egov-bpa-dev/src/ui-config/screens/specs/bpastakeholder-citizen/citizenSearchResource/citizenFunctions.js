import commonConfig from "config/common.js";
import React from 'react';
import axios from 'axios';
import store from "ui-redux/store";
import {
  toggleSnackbar,
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import { getUserInfo,getAccessToken,getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { httpRequest } from "../../../../../ui-utils";
import { getBpaSearchResults, getSearchResults } from "../../../../../ui-utils/commons";
import { getWorkFlowData, getWorkFlowDataForBPA } from "../../bpastakeholder/searchResource/functions";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { getAppSearchResults } from "../../../../../ui-utils/commons"

import {getBpaTextToLocalMapping, getEpochForDate,getTextToLocalMapping, getUniqueItemsFromArray, sortByEpoch} from "../../utils";
import { getBreak, getCommonContainer } from "egov-ui-framework/ui-config/screens/specs/utils";
import {onRowClick} from "../my-applications-stakeholder"
import {onApplicationRowClick} from "../my-applications-stakeholder"
import { getFileUrlFromAPI, getFileUrl } from "egov-ui-framework/ui-utils/commons";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";

export const getMdmsData = async () => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "tenant",
          masterDetails: [{ name: "citymodule" }]
        },
        {
          moduleName: "BPA",
          masterDetails: [{ name: "ServiceType" }]
        }
      ]
    }
  };
  try {
    let payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    return payload;
  } catch (e) {
    console.log(e);
  }
};
export const fetchData = async (
  action,
  state,
  dispatch,
  fromMyApplicationPage = false,
  fromStakeHolderPage = false
) => {
  let userInfo = JSON.parse(getUserInfo());
  let mobileNumber = get(userInfo, "mobileNumber");
  const queryObj = [
    {
      key: "requestor",
      value: mobileNumber
    }
  ];
  const response = await getSearchResults();
  const bpaResponse = await getBpaSearchResults(queryObj);
  const mdmsRes = await getMdmsData(dispatch);
  let tenants =
    mdmsRes &&
    mdmsRes.MdmsRes &&
    mdmsRes.MdmsRes.tenant.citymodule.find(item => {
      if (item.code === "BPAAPPLY") return true;
    });
  dispatch(
    prepareFinalObject(
      "applyScreenMdmsData", mdmsRes.MdmsRes
    )
  );
  dispatch(
    prepareFinalObject(
      "applyScreenMdmsData.common-masters.citiesByModule.TL",
      tenants
    )
  );
  try {
    if (window.location.href.includes("bpastakeholder-citizen/home")) {
      let myApplicationsCount = 0;
      if (response && response.Licenses) {
        myApplicationsCount += response.Licenses.length
      }
      if (bpaResponse && bpaResponse.BPA) {
        myApplicationsCount += bpaResponse.BPA.length
      }
      dispatch(
        handleField(
          "my-applications",
          "components.div.children.header.children.key",
          "props.dynamicArray",
          myApplicationsCount ? [myApplicationsCount] : [0]
        )
      );
    } else {
      var searchConvertedArray = [];
      var sortConvertedArray = [];
      if (response && response.Licenses && response.Licenses.length > 0) {
        const businessIdToOwnerMapping = await getWorkFlowData(response.Licenses);

        response.Licenses.forEach(element => {
          let service = getTextToLocalMapping(
            "MODULE_" + get(element, "businessService")
          );
          let status = getTextToLocalMapping("WF_ARCHITECT_" + get(element, "status"));
          let modifiedTime = element.auditDetails.lastModifiedTime;
          let licensetypeFull =
            element.tradeLicenseDetail.tradeUnits[0].tradeType;
          if (licensetypeFull.split(".").length > 1) {
            service +=
              " - " +
              getTextToLocalMapping(
                `TRADELICENSE_TRADETYPE_${getTransformedLocale(
                  licensetypeFull.split(".")[0]
                )}`
              );
          }
          if (!fromStakeHolderPage) {
            searchConvertedArray.push({
              applicationNumber: get(element, "applicationNumber", null),
              ownername: get(element, "tradeLicenseDetail.owners[0].name", null),
              businessService: service,
              serviceType: "BPAREG",
              assignedTo: get(
                businessIdToOwnerMapping[element.applicationNumber],
                "assignee",
                null
              ),
              status,
              sla: get(
                businessIdToOwnerMapping[element.applicationNumber],
                "sla",
                null
              ),
              tenantId: get(element, "tenantId", null),
              modifiedTime: modifiedTime,
              sortNumber: 0,
              rawService: get(element, "businessService")
            });
          }
        });
      }

      if (bpaResponse && bpaResponse.BPA && bpaResponse.BPA.length > 0) {
        const businessIdToOwnerMappingForBPA = await getWorkFlowDataForBPA(bpaResponse.BPA);
        bpaResponse.BPA.forEach(element => {
          let status = getTextToLocalMapping("WF_BPA_" + get(businessIdToOwnerMappingForBPA[element.applicationNo], "state", null));
          let applicationStatus = get(element, "status");
          let bService = get(element, "businessService");
          let appType = "BUILDING_PLAN_SCRUTINY";
          let serType = "NEW_CONSTRUCTION";
          let type;
          if (bService === "BPA_OC" || bService === 'BPA_OC1' || bService === 'BPA_OC2' || bService === 'BPA_OC3' || bService === 'BPA_OC4') {
            appType = "BUILDING_OC_PLAN_SCRUTINY"
          }
          if (bService === "BPA_LOW") {
            type = "LOW"
          } else {
            type = "HIGH"
          }
          let service = getTextToLocalMapping(
            "BPA_APPLICATIONTYPE_" + appType
          );
          service += " - " + getTextToLocalMapping(
            "BPA_SERVICETYPE_" + serType
          );
          let modifiedTime = element.auditDetails.lastModifiedTime;
          let primaryowner = "-";
          let owners = get(element, "landInfo.owners", [])
          owners.map(item => {
            if (item.isPrimaryOwner) {
              primaryowner = item.name;
            }
          });
          if (!fromStakeHolderPage) {
            searchConvertedArray.push({
              applicationNumber: get(element, "applicationNo", null),
              ownername: primaryowner,
              businessService: service,
              assignedTo: get(
                businessIdToOwnerMappingForBPA[element.applicationNo],
                "assignee",
                null
              ),
              status,
              sla: get(
                businessIdToOwnerMappingForBPA[element.applicationNo],
                "sla",
                null
              ),
              tenantId: get(element, "tenantId", null),
              modifiedTime: modifiedTime,
              sortNumber: 1,
              type: type,
              serviceType: get(element, "businessService", null),
              appStatus: applicationStatus
            })
          }
        });
      }

      sortConvertedArray = [].slice.call(searchConvertedArray).sort(function (a, b) {
        return new Date(b.modifiedTime) - new Date(a.modifiedTime) || a.sortNumber - b.sortNumber;
      });

      dispatch(prepareFinalObject("searchResults", sortConvertedArray));
      storeData(sortConvertedArray, dispatch, fromMyApplicationPage, fromStakeHolderPage);
    }
  } catch (error) {
    console.log(error);
  }
};

const storeData = (data, dispatch, fromMyApplicationPage, fromStakeHolderPage) => {
  dispatch(
    prepareFinalObject("myApplicationsCount", data.length)
  );
  const myApplicationsCount = data.length;

  if (fromStakeHolderPage) {
    dispatch(
      handleField(
        "my-applications-stakeholder",
        "components.div.children.applicationsCard",
        "props.data",
        data
      ));
    dispatch(
      handleField(
        "my-applications-stakeholder",
        "components.div.children.header.children.key",
        "props.dynamicArray",
        myApplicationsCount ? [myApplicationsCount] : [0]
      )
    );
  } else if (fromMyApplicationPage) {

    dispatch(
      handleField(
        "my-applications",
        "components.div.children.header.children.key",
        "props.dynamicArray",
        myApplicationsCount ? [myApplicationsCount] : [0]
      )
    );
  }
}


export const myApplicationsTableConfig =  {
  
  uiFramework: "custom-molecules",
  name: "my-applications-stakeholder",
  componentPath: "Table",
  props: {
    columns: [
      {
        name: "Application No", labelKey: "BPA_COMMON_TABLE_COL_APP_NO"
      },
      {
        name: "Application Type", labelKey: "BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL"
      },
      {
        name: "Service type", labelKey: "BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL"
      },
      {
        name: "Assigned To", labelKey: "BPA_COL_ASSIGNEDTO"
      },
      {
        name: "SLA(Days Remaining)", labelKey: "BPA_COMMON_SLA"
      },
      {
        name: "Status", labelKey: "BPA_COMMON_TABLE_COL_STATUS_LABEL"
      },
      {
        name: "tenantId",
        labelKey: "tenantId",
        options: {
          display: false
        }
      },
      {
        name: "serviceType",
        labelKey: "serviceType",
        options: {
          display: false
        }
      },
      {
        name: "type",
        labelKey: "type",
        options: {
          display: false
        }
      },
      {
        name: "appStatus", labelKey: "BPA_COMMON_TABLE_COL_APP_STATUS_LABEL",
        options: {
          display: false
        }
      },
      {
        name: "owner", labelKey: "BPA_OWNER_NAME_LABEL"
        
      },
    ],
    title: {
      labelName: "Search Results for BPA Applications",
      labelKey: "BPA_SEARCH_RESULTS_FOR_APP"
    },
    rows: "",
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      viewColumns: false,
      onRowClick: (row, index) => {
        onRowClick(row);
      },
      serverSide: false
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


}

export const applicationAssignedToMe =  {
  
  uiFramework: "custom-molecules",
  name: "my-applications-stakeholder",
  componentPath: "Table",
  //visible: false,
  props: {
    columns: [
      {
        name: "Application No", labelKey: "BPA_COMMON_TABLE_COL_APP_NO"
      },
      {
        name: "Status", labelKey: "BPA_COMMON_TABLE_COL_STATUS_LABEL"
      },
      {
        name: "tenantId",
        labelKey: "tenantId",
        options: {
          display: false
        }
      },
      {
        name: "serviceType", labelKey: "BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL"
      },
      {
        name: "OwnerName", labelKey: "BPA_OWNER_NAME_LABEL"
      }
    ],
    title: {
      labelName: "Search Results for BPA Applications",
      labelKey: "BPA_SEARCH_RESULTS_FOR_APP"
    },
    rows: "",
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      viewColumns: false,
      onRowClick: (row, index) => {
        onApplicationRowClick(row);
      },
      serverSide: false
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


}

// get PDF body
export const getPdfBody = async (applicationNo, tenantId) => {
  const userInfo = JSON.parse(getUserInfo());
  const authToken = getAccessToken();
  let RequestInfo = {
    "apiId": "Rainmaker",
    "ver": ".01",
    "action": "_search",
    "did": "1",
    "key": "",
    "msgId": "20170310130900|en_IN",
    "requesterId": "",
    authToken,
    "userInfo": userInfo
  };
  let queryObject = [
    { key: "tenantId", value: tenantId },
    { key: "applicationNo", value: applicationNo },
  ];
  try {
    let bpaResult = await httpRequest(
      "post",
      "/bpa-services/v1/bpa/_search",
      "",
      queryObject
    );
    let edcrNumber =
      (bpaResult &&
        bpaResult.BPA &&
        bpaResult.BPA.length > 0 &&
        bpaResult.BPA[0].edcrNumber) ||
      "";

    try {
      let BPA = bpaResult.BPA[0];
      //BPA.businessService = "BPA1" //Need to remove this line once BPA5 is added from Backend side.
      return {
        RequestInfo: RequestInfo,
        Bpa: [BPA],
      };
    } catch (err) {
      return;
    }
  } catch (err) {
    return;
  }
};



export const onDownloadClick = async (tData) => {
  let data = await getPdfBody(tData.dscDetails.applicationNo,tData.dscDetails.tenantId)
  let response = await axios.post(`/edcr/rest/dcr/generatePermitOrder?key=buildingpermit&tenantId=${tData.dscDetails.tenantId}`, data, {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  })
  if (
    response &&
    response.data.filestoreIds &&
    response.data.filestoreIds.length > 0
  ) {
    const fileUrls = await getFileUrlFromAPI(response.data.filestoreIds[0],tData.dscDetails.tenantId);
    window.location = fileUrls[response.data.filestoreIds[0]];  
  }
}

const onUploadClick = (tData) => {
  let applicationNumber = tData && tData.dscDetails.applicationNo;
  let tenantId = tData && tData.dscDetails.tenantId;
  let url = `upload-unsigned-doc?applicationNo=${applicationNumber}&tenantId=${tenantId}`
  store.dispatch(setRoute(url));
}
const setUpload = (tData) => {
  let documentId =
  tData &&
  tData.dscDetails.documentId;
  if(tData.workflowstate === "APPROVED" && documentId === null){
    return (
        <a
          href="javascript:void(0)"
          onClick={() => {
            onUploadClick(tData);
          }}
        >
          <span style={{color: '#fe7a51'}}>{"Upload Document"}</span>
        </a>
    )
  } else {
    return (
      ""
    )
  }
}

const setDownload = (tData) => {
  if(tData.workflowstate === "APPROVED"){
    return (
      <a
      href="javascript:void(0)"
      onClick={() => {
        onDownloadClick(tData);
      }}
    >
      <span style={{color: '#fe7a51'}}>{"Download Document"}</span>
    </a>
    )
  } else {
    return (
      ""
    )
  }
}

const onDownloadClickBuildingLayout = async (tData) => {
  let applicationNumber = tData && tData.dscDetails.applicationNo;
  let tenantId = tData && tData.dscDetails.tenantId;

  const response = await getAppSearchResults([
    {
      key: "tenantId",
      value: tenantId,
    },
    { key: "applicationNo", value: applicationNumber },
  ]);
  console.log(response, "Nero single App");
  let filteredDoc =
    response &&
    response.BPA &&
    response.BPA.length > 0 &&
    response.BPA[0].documents.filter(
      (item) => item.documentType === "BPD.BPL.BPL"
    );
  if (filteredDoc && filteredDoc.length > 0) {
    const fileUrls = await getFileUrlFromAPI(
      filteredDoc && filteredDoc[0].fileStoreId
    );
    window.location = fileUrls[filteredDoc[0].fileStoreId];
  } else {
    store.dispatch(
      toggleSnackbar(
        true,
        {
          labelName:
            "Sorry, BPD document was not uploaded, Please upload first",
          labelKey: "BPA_BPD_DOC_WAS_NOT_UPLOADED",
        },
        "warning"
      )
    );
  }
};

const setUploadBuildingLayout = (tData) => {
  let filteredDoc = tData && tData.documents.filter( item => item.documentType === "BPD.BPL.BPL") 
  if (filteredDoc && filteredDoc.length > 0) {
    return (
      <a
        href="javascript:void(0)"
        onClick={() => {
          onUploadClick(tData);
        }}
      >
        <span style={{ color: "#fe7a51" }}>{"Upload Document"}</span>
      </a>
    );
  } else if (
    filteredDoc &&
    filteredDoc.length > 0 &&
    tData.buildingAdditionalDetails &&
    tData.buildingAdditionalDetails.hasOwnProperty("buildingPlanLayoutIsSigned")
  ) {
    return (
      ""
    );
  } else {
    return (
      ""
    )
  }
}
const setDownloadBuildingLayout = (tData) => {
  let filteredDoc = tData && tData.documents.filter( item => item.documentType === "BPD.BPL.BPL") 
  if(filteredDoc && filteredDoc.length > 0){
    return (
      <a
      href="javascript:void(0)"
      onClick={() => {
        onDownloadClickBuildingLayout(tData);
      }}
    >
      <span style={{color: '#fe7a51'}}>{"Download Document"}</span>
    </a>
    )
  } else {
    return (
      ""
    )
  }
}

// Show all approved application details
export const listOfApprovedApplication = {
  uiFramework: "custom-molecules",
  name: "my-applications-stakeholder",
  componentPath: "Table",
  //visible: false,
  props: {
    columns: [
      {
        name: "Application No",
        labelKey: "BPA_COMMON_TABLE_COL_APP_NO",
      },
      {
        name: "Download Document",
        labelKey: "BPA_COMMON_TABLE_COL_LINK",
        options: {
          customBodyRender: (value, tableMeta) => setDownload(value, tableMeta),
        },
      },
      {
        name: "Upload Document",
        labelKey: "BPA_COMMON_TABLE_COL_UPLOAD",
        options: {
          customBodyRender: (value, tableMeta) => setUpload(value, tableMeta),
        },
      },
      {
        name: "tenantId",
        labelKey: "BPA_COMMON_TABLE_COL_TENANT",
        options: {
          display: false,
        },
      },
    ],
    title: {
      labelName: "Search Results for BPA Applications",
      labelKey: "BPA_SEARCH_RESULTS_FOR_APP",
    },
    rows: "",
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      viewColumns: false,
      serverSide: false,
    },
    customSortColumn: {
      column: "Application Date",
      sortingFn: (data, i, sortDateOrder) => {
        const epochDates = data.reduce((acc, curr) => {
          acc.push([...curr, getEpochForDate(curr[4], "dayend")]);
          return acc;
        }, []);
        const order = sortDateOrder === "asc" ? true : false;
        const finalData = sortByEpoch(epochDates, !order).map((item) => {
          item.pop();
          return item;
        });
        return { data: finalData, currentOrder: !order ? "asc" : "desc" };
      },
    },
  },
};

export const listOfBuildingPlanLayout = {
  uiFramework: "custom-molecules",
  name: "my-applications-stakeholder",
  componentPath: "Table",
  //visible: false,
  props: {
    columns: [
      {
        name: "Application No",
        labelKey: "BPA_COMMON_TABLE_COL_APP_NO",
      },
      {
        name: "Download Document",
        labelKey: "BPA_COMMON_TABLE_COL_LINK",
        options: {
          customBodyRender: (value, tableMeta) => setDownloadBuildingLayout(value, tableMeta),
        },
      },
      {
        name: "Upload Document",
        labelKey: "BPA_COMMON_TABLE_COL_UPLOAD",
        options: {
          customBodyRender: (value, tableMeta) => setUploadBuildingLayout(value, tableMeta),
        },
      },
      {
        name: "tenantId",
        labelKey: "BPA_COMMON_TABLE_COL_TENANT",
        options: {
          display: false,
        },
      },
    ],
    title: {
      labelName: "Search Results for BPA Applications",
      labelKey: "BPA_SEARCH_RESULTS_FOR_APP",
    },
    rows: "",
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      viewColumns: false,
      serverSide: false,
    },
    customSortColumn: {
      column: "Application Date",
      sortingFn: (data, i, sortDateOrder) => {
        const epochDates = data.reduce((acc, curr) => {
          acc.push([...curr, getEpochForDate(curr[4], "dayend")]);
          return acc;
        }, []);
        const order = sortDateOrder === "asc" ? true : false;
        const finalData = sortByEpoch(epochDates, !order).map((item) => {
          item.pop();
          return item;
        });
        return { data: finalData, currentOrder: !order ? "asc" : "desc" };
      },
    },
  },
};


export const showSearches = getCommonContainer({
  showSearchScreens: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-bpa",
    componentPath: "CustomTabContainer",
    props: {
      tabs: [
        {
          tabButton: { labelName: "SEARCH APPLICATIONS", labelKey: "BPA_MY_APPLICATIONS" },
          tabContent: { myApplicationsTableConfig }
        },
        {
          tabButton: { labelName: "DOWNLOAD BPA DOCUMENT", labelKey: "BPA_APPLICATIONS_ASSIGNED_TO_ME" },
          tabContent: { applicationAssignedToMe }
        },
        {
          tabButton: { labelName: "LIST OF APPROVED APPLICATION", labelKey: "BPA_APPLICATIONS_APPROVED" },
          tabContent: { listOfApprovedApplication }
        },
        {
          tabButton: { labelName: "LIST OF BUILDING PLAN LAYOUT", labelKey: "BPA_APPLICATIONS_BUILDING_PLAN_LAYOUT" },
          tabContent: { listOfBuildingPlanLayout }
        }
      ],
      tabIndex : 0
     // isDigitalSignature : true,
    },
    type: "array"
  }
});

export const tabsForArchOnly = getCommonContainer({
  showSearchScreens: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-bpa",
    componentPath: "CustomTabContainer",
    props: {
      tabs: [
        {
          tabButton: { labelName: "SEARCH APPLICATIONS", labelKey: "BPA_MY_APPLICATIONS" },
          tabContent: { myApplicationsTableConfig }
        }
      ],
      tabIndex : 0
     // isDigitalSignature : true,
    },
    type: "array"
  }
});

export const tabsForSpclArchOnly = getCommonContainer({
  showSearchScreens: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-bpa",
    componentPath: "CustomTabContainer",
    props: {
      tabs: [
        
        {
          tabButton: { labelName: "DOWNLOAD BPA DOCUMENT", labelKey: "BPA_APPLICATIONS_ASSIGNED_TO_ME" },
          tabContent: { applicationAssignedToMe }
        }
      ],
      tabIndex : 0
     // isDigitalSignature : true,
    },
    type: "array"
  }
});

