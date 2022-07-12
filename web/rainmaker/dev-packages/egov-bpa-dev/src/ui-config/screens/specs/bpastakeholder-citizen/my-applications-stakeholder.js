import { getCommonContainer, getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, toggleSpinner,hideSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import set from "lodash/set";
import { getBpaSearchResults, getSearchResults, getBpaAppsAssignedToMe, getAppSearchResults } from "../../../../ui-utils/commons";
import { getWorkFlowData, getWorkFlowDataForBPA } from "../bpastakeholder/searchResource/functions";
import {
  getBpaTextToLocalMapping, getEpochForDate,

  getTextToLocalMapping, sortByEpoch
} from "../utils";
import {showSearches, tabsForArchOnly, tabsForSpclArchOnly} from "./citizenSearchResource/citizenFunctions"
import {ifUserRoleExists} from "../../specs/utils"


const data = {
  "ApprovedBy": [
    {
      "applicationNo": "BP-CTC-2022-07-08-002048",
      "tenantId": "od.cuttack",
      "applicationstatus": "SHOW_CAUSE_REPLY_VERIFICATION_PENDING",
      "workflowstate": "PENDING_DEPT_VERIFICATION"
    },
    {
      "applicationNo": "BP-CTC-2022-07-08-002039",
      "tenantId": "od.cuttack",
      "applicationstatus": "SHOW_CAUSE_ISSUED",
      "workflowstate": "PENDING_SHOW_CAUSE_REPLY"
    },
    {
      "applicationNo": "BP-CTC-2022-07-08-002030",
      "tenantId": "od.cuttack",
      "applicationstatus": "PENDING_SANC_FEE_PAYMENT",
      "workflowstate": "PENDING_SANC_FEE_PAYMENT"
    },
    {
      "applicationNo": "BP-CTC-2022-07-08-002025",
      "tenantId": "od.cuttack",
      "applicationstatus": "SHOW_CAUSE_ISSUED",
      "workflowstate": "PENDING_SHOW_CAUSE_REPLY"
    },
    {
      "applicationNo": "BP-CTC-2022-07-07-002021",
      "tenantId": "od.cuttack",
      "applicationstatus": "PERMIT_REVOKED",
      "workflowstate": "REVOKED"
    },
    {
      "applicationNo": "BP-CTC-2022-06-27-001855",
      "tenantId": "od.cuttack",
      "applicationstatus": "SHOW_CAUSE_REPLY_VERIFICATION_PENDING",
      "workflowstate": "PENDING_DEPT_VERIFICATION"
    },
  ]
}



const header = getCommonHeader(
  {
    labelName: "My Applications",
    labelKey: "BPA_MY_APPLICATIONS"
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);

export const getWfBusinessData = async (action, state, dispatch, businessService) => {
  const tenantId = getTenantId();
  const BSqueryObject = [
    { key: "tenantId", value: tenantId },
    { key: "businessServices", value: businessService }
  ];
  const payload = await httpRequest(
    "post",
    "egov-workflow-v2/egov-wf/businessservice/_search",
    "_search",
    BSqueryObject
  );
  if (
    payload &&
    payload.BusinessServices &&
    payload.BusinessServices.length > 0
  ) {
    dispatch(prepareFinalObject(businessService, get(payload, "BusinessServices[0]")))
  }
}

const getAllBusinessServicesDataForStatus = async (action, state, dispatch) => {
  let businessServices = ["BPA", "BPA_OC", "BPA1", "BPA2", "BPA3", "BPA4", "BPA5", "ARCHITECT"];
  businessServices.forEach(service => {
    getWfBusinessData(action, state, dispatch, service)
  })
}

const showHideTabs = (action, state, dispatch) => {
  set(
    action,
    "screenConfig.components.div.children.showSearches.children.showSearchScreens.props.tabs.visible",
    false
  );
console.log("Nero I am here")
  // dispatch(
  //   handleField(
  //     "my-applications-stakeholder",
  //     "components.div.children.showSearches.children.showSearchScreens",
  //     "props.visible",
  //     false
  //   ))
}

const screenConfig = {
  uiFramework: "material-ui",
  name: "my-applications-stakeholder",
  beforeInitScreen: (action, state, dispatch) => {
   // setTimeout(function(){
     if(ifUserRoleExists("BPA_ARCHITECT") && ifUserRoleExists("BPA_ARC_APPROVER")){
      fetchData(action, state, dispatch);
      fetchApplicationAssignedToMe(action, state, dispatch);
      setTimeout(()=>{
        fetchApprovedApplicationList(action, state, dispatch)
       },1000)
     }else if(ifUserRoleExists("BPA_ARCHITECT") || ifUserRoleExists("BPA_TECHNICALPERSON")){
      fetchData(action, state, dispatch);
     }else if(ifUserRoleExists("BPA_ARC_APPROVER")){
      fetchApplicationAssignedToMe(action, state, dispatch);
      setTimeout(()=>{
        fetchApprovedApplicationList(action, state, dispatch)
       },1000)
     }
     
     
     // showHideTabs(action, state, dispatch);
   //}, 2000);
    
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
        header: header,
        showSearches: (ifUserRoleExists("BPA_ARCHITECT") && ifUserRoleExists("BPA_ARC_APPROVER")) ? showSearches: (ifUserRoleExists("BPA_ARCHITECT") || ifUserRoleExists("BPA_TECHNICALPERSON"))? tabsForArchOnly: tabsForSpclArchOnly,
        
      }
    }
  }
};

export const fetchData = async (
  action,
  state,
  dispatch
) => {

  let searchConvertedArray = [];
  let sortConvertedArray = [];
  const bpaResponse = await getBpaSearchResults();
 // const response = await getSearchResults();
  

  if (bpaResponse && bpaResponse.BPA && bpaResponse.BPA.length > 0) {
    dispatch(toggleSpinner());
    const businessIdToOwnerMappingForBPA = await getWorkFlowDataForBPA(bpaResponse.BPA);
    bpaResponse.BPA.forEach(element => {
      let status = getTextToLocalMapping("WF_BPA_" + get(businessIdToOwnerMappingForBPA[element.applicationNo], "state", null));
      let service = getTextToLocalMapping("BPA_APPLICATIONTYPE_" + get(element, "applicationType"));
      service += " - " + getTextToLocalMapping("BPA_SERVICETYPE_" + get(element, "serviceType"));
      let modifiedTime = element.auditDetails.lastModifiedTime;
      let primaryowner = "-";
      let businessService = get(element, "businessService", null);
      let type;
      if (businessService == "BPA_LOW") {
        type = "LOW"
      } else if ((businessService == "BPA") || (businessService == "BPA_OC" ||  businessService === 'BPA_OC1' || businessService === 'BPA_OC2' || businessService === 'BPA_OC3' || businessService === 'BPA_OC4')) {
        type = "HIGH"
      } else {
        type = "HIGH"
      }
      let owners = get(element, "landInfo.owners", [])
      owners.map(item => {
        if (item.isPrimaryOwner) {
          primaryowner = item.name;
        }
      });
      // let owners = get(element, "landInfo", [])
      // owners.map(item => {
      //   if (item.isPrimaryOwner) {
      //     primaryowner = item.name;
      //   }
      // });
      let bService = get(element, "businessService");
      let appType = getBpaTextToLocalMapping("WF_BPA_BUILDING_PLAN_SCRUTINY");
      let serType = getBpaTextToLocalMapping(`WF_BPA_NEW_CONSTRUCTION`);
      if (bService === "BPA_OC" || bService === 'BPA_OC1' || bService === 'BPA_OC2' || bService === 'BPA_OC3' || bService === 'BPA_OC4') {
        appType = getBpaTextToLocalMapping("WF_BPA_BUILDING_OC_PLAN_SCRUTINY");
      }
      searchConvertedArray.push({
        ["BPA_COMMON_TABLE_COL_APP_NO"]: element.applicationNo || "-",
        ["BPA_COMMON_TABLE_COL_STATUS_LABEL"]: status || "-",
        ["BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL"]: appType,
        ["BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL"]: serType,
        ["BPA_COMMON_SLA"]: get(businessIdToOwnerMappingForBPA[element.applicationNo], "sla", null) || "-",
        ["BPA_COL_ASSIGNEDTO"]: get(businessIdToOwnerMappingForBPA[element.applicationNo], "assignee", null) || "-",
        ["BPA_COMMON_TABLE_COL_APP_STATUS_LABEL"]: element.status,
        applicationType: getBpaTextToLocalMapping("BPA_APPLY_SERVICE"),
        modifiedTime: modifiedTime,
        sortNumber: 1,
        serviceType: businessService,
        tenantId: get(element, "tenantId", null),
        type: type,
        ["BPA_OWNER_NAME_LABEL"] : primaryowner
      })
    });
  }



  sortConvertedArray = [].slice.call(searchConvertedArray).sort(function (a, b) {
    return new Date(b.modifiedTime) - new Date(a.modifiedTime) || a.sortNumber - b.sortNumber;
  });

  
  dispatch(
    handleField(
      "my-applications-stakeholder",
      "components.div.children.showSearches.children.showSearchScreens.props.tabs[0].tabContent.myApplicationsTableConfig",
      "props.data",
      sortConvertedArray
    ));
   
  dispatch(
    handleField(
      "my-applications-stakeholder",
      "components.div.children.showSearches.children.showSearchScreens.props.tabs[0].tabContent.myApplicationsTableConfig",
      "props.rows",
      sortConvertedArray.length
    )
  );
  dispatch(hideSpinner());
};

export const fetchApplicationAssignedToMe = async (
  action,
  state,
  dispatch
) => {

  let searchConvertedArray = [];
  let sortConvertedArray = [];
  const bpaResponse = await getBpaAppsAssignedToMe();
  
 let serType = getBpaTextToLocalMapping(`WF_BPA_NEW_CONSTRUCTION`);
  if (bpaResponse && bpaResponse.ProcessInstances && bpaResponse.ProcessInstances.length > 0) {
    dispatch(toggleSpinner());
    
    let arrayLength = bpaResponse.ProcessInstances.length;
    for(let i=0; i<arrayLength;i++){
      let primaryowner = "-";
  let response = await getAppSearchResults([
        {
          key: "tenantId",
          value: bpaResponse.ProcessInstances[i].tenantId
        },
        { key: "applicationNo", value: bpaResponse.ProcessInstances[i].businessId }
      ]);
      
      let owners = get(response.BPA[0], "landInfo.owners", [])
      owners.map(item => {
        if (item.isPrimaryOwner) {
          primaryowner = item.name;
        }
      });


      let status = getTextToLocalMapping("WF_BPA_" + bpaResponse.ProcessInstances[i].state.applicationStatus, "state", null);
        searchConvertedArray.push({
        ["BPA_COMMON_TABLE_COL_APP_NO"]: bpaResponse.ProcessInstances[i].businessId || "-",
        ["BPA_COMMON_TABLE_COL_STATUS_LABEL"]: status || "-",
        tenantId: bpaResponse.ProcessInstances[i].tenantId,
        ["BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL"]: serType,
        ["BPA_OWNER_NAME_LABEL"] : primaryowner
      })
    }
  }


  
  dispatch(
    handleField(
      "my-applications-stakeholder",
      "components.div.children.showSearches.children.showSearchScreens.props.tabs[1].tabContent.applicationAssignedToMe",
      "props.data",
      searchConvertedArray
    ));
  dispatch(hideSpinner());
  dispatch(
    handleField(
      "my-applications-stakeholder",
      "components.div.children.showSearches.children.showSearchScreens.props.tabs[1].tabContent.applicationAssignedToMe",
      "props.rows",
      searchConvertedArray.length
    )
  );
};


export const fetchApprovedApplicationList = async (action,state,dispatch) => {
  let approvedList = [];
  data.ApprovedBy.forEach((item,index)=> {
    approvedList.push({
      ["BPA_COMMON_TABLE_COL_APP_NO"]: item.applicationNo,
      ["BPA_COMMON_TABLE_COL_LINK"]: item,
      ["BPA_COMMON_TABLE_COL_TENANT"]: item.tenantId || ''
    })
  })

  dispatch(
    handleField(
      "my-applications-stakeholder",
      "components.div.children.showSearches.children.showSearchScreens.props.tabs[2].tabContent.listOfApprovedApplication",
      "props.data",
      approvedList
    ));
  dispatch(hideSpinner());
  dispatch(
    handleField(
      "my-applications-stakeholder",
      "components.div.children.showSearches.children.showSearchScreens.props.tabs[2].tabContent.listOfApprovedApplication",
      "props.rows",
      approvedList.length
    )
  );
}

export const onRowClick = rowData => {
  const environment = process.env.NODE_ENV === "production" ? "citizen" : "";
  const origin = process.env.NODE_ENV === "production" ? window.location.origin + "/" : window.location.origin;
  if (rowData[7] === "BPAREG") {
    switch (rowData[4]) {
      case "INITIATED":
        window.location.assign(`${origin}${environment}/bpastakeholder/apply?applicationNumber=${rowData[0]}&tenantId=${rowData[6]}`)
        break;
      default:
        window.location.assign(`${origin}${environment}/bpastakeholder/search-preview?applicationNumber=${rowData[0]}&tenantId=${rowData[6]}`)
    }
  } else if ((rowData[7] === "BPA") || (rowData[7] === "BPA1") || (rowData[7] === "BPA2") || (rowData[7] === "BPA3") || (rowData[7] === "BPA4") || (rowData[7] === "BPA5") || rowData[7] == "BPA_LOW") {
    switch (rowData[9]) {
      case "INITIATED":
        window.location.assign(`${origin}${environment}/egov-bpa/apply?applicationNumber=${rowData[0]}&tenantId=${rowData[6]}`);
        break;
      default:
        window.location.assign(`${origin}${environment}/egov-bpa/search-preview?applicationNumber=${rowData[0]}&tenantId=${rowData[6]}&type=${rowData[8]}&bservice=${rowData[7]}`);
    }
  } else if ((rowData[7] === "BPA_OC1") || (rowData[7] === "BPA_OC2") || (rowData[7] === "BPA_OC3") || (rowData[7] === "BPA_OC4") || (rowData[7] == "BPA_OC")) {
    switch (rowData[9]) {
      case "INITIATED":
        window.location.assign(`${origin}${environment}/oc-bpa/apply?applicationNumber=${rowData[0]}&tenantId=${rowData[6]}`);
        break;
      default:
        window.location.assign(`${origin}${environment}/oc-bpa/search-preview?applicationNumber=${rowData[0]}&tenantId=${rowData[6]}&type=${rowData[8]}&bservice=${rowData[7]}`);
    }
  }
  else {
    switch (rowData[9]) {
      case "INITIATED":
        window.location.assign(`${origin}${environment}/oc-bpa/apply?applicationNumber=${rowData[0]}&tenantId=${rowData[6]}`);
        break;
      default:
        window.location.assign(`${origin}${environment}/oc-bpa/search-preview?applicationNumber=${rowData[0]}&tenantId=${rowData[6]}`);
    }
  }
};


export const onApplicationRowClick = rowData => {
  const environment = process.env.NODE_ENV === "production" ? "citizen" : "";
  const origin = process.env.NODE_ENV === "production" ? window.location.origin + "/" : window.location.origin;

  window.location.assign(`${origin}${environment}/egov-bpa/search-preview?applicationNumber=${rowData[0]}&tenantId=${rowData[2]}&type=LOW&bservice=BPA5`);
};
export default screenConfig;
