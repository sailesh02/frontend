// // import { fetchData } from "./myConnectionDetails/myConnectionDetails";
// import { getQueryArg,getTodaysDateInYMD, getMaxDate } from "egov-ui-framework/ui-utils/commons";
// import { handleScreenConfigurationFieldChange as handleField, initScreen, prepareFinalObject, toggleSnackbar, showSpinner,hideSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
// import get from "lodash/get";
// import { getMeterReadingDataBulkImport } from "../../../../ui-utils/commons"
// import { getMdmsDataForMeterStatus,APPLICATIONSTATE } from "../../../../ui-utils/commons"
// import { sortpayloadDataObj } from './connection-details'
// import { convertEpochToDate } from "../utils";
// import { searchApplicationResults } from "./searchResource/searchApplicationResults";
// import { searchResults } from "./searchResource/searchResults";
// import { getCommonHeader, getBreak, getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
// import { wnsApplication } from './searchResource/';

// import {
//     getCommonCard,
//     getCommonGrayCard,
//     getCommonTitle,
//     getCommonSubHeader,
//     getTextField,
//     getSelectField,
//     getCommonContainer,
//     getDateField,
//     getPattern
//   } from "egov-ui-framework/ui-config/screens/specs/utils";
//   import { getSearchResults, getMdmsDataForAutopopulatedBulk, isWorkflowExists } from "../../../../ui-utils/commons"

//   const getApplicationNo = (connectionsObj) => {
//     let appNos = "";
//     if(connectionsObj.length > 1){
//       for(var i=0; i< connectionsObj.length; i++){
//         appNos += connectionsObj[i].applicationNo +",";
//       }
//       appNos = appNos.slice(0,-1);
//     }else{
//       appNos = connectionsObj[0].applicationNo;
//     }
//     return appNos;
//   }

//   const setAutopopulatedvalues = async (state, dispatch,cardIndex) => {
//     let billingFrequency = get(state, "screenConfiguration.preparedFinalObject.billingCycle");
//     let consumptionDetails = {};
//     let date = new Date();
//     let status = get(state, "screenConfiguration.preparedFinalObject.meterMdmsData.['ws-services-calculation'].MeterStatus[0].code");
//     let checkBillingPeriod = await get(state, `screenConfiguration.preparedFinalObject.consumptionDetails[${cardIndex}]`);
//     try {
//         let lastReadingDate = convertEpochToDate(checkBillingPeriod[0].currentReadingDate);
//         let lastDF = new Date();
//         let endDate = ("0" + lastDF.getDate()).slice(-2) + '/' + ("0" + (lastDF.getMonth() + 1)).slice(-2) + '/' + lastDF.getFullYear()
//         consumptionDetails['billingPeriod'] = lastReadingDate + " - " + endDate
//         consumptionDetails['lastReading'] = checkBillingPeriod[0].currentReading
//         consumptionDetails['consumption'] = ''
//         consumptionDetails['lastReadingDate'] = lastReadingDate
//     }catch (e) { 
//         console.log(e);         
//         dispatch(
//             toggleSnackbar(
//                 true,
//                 {
//                     labelName: "Failed to parse meter reading data.",
//                     labelKey: "ERR_FAILED_TO_PARSE_METER_READING_DATA"
//                 },
//                 "warning"
//             )
//         );
//         return;
//     }

//     let billingPeriod = consumptionDetails.billingPeriod
//     let lastReading = consumptionDetails.lastReading
//     let lastReadingDate = consumptionDetails.lastReadingDate
//     let consumption = consumptionDetails.consumption

//     dispatch(prepareFinalObject(`meterReading[${cardIndex}].billingPeriod`,billingPeriod ))
//     dispatch(prepareFinalObject(`meterReading[${cardIndex}].lastReading`,lastReading ))
//     dispatch(prepareFinalObject(`meterReading[${cardIndex}].lastReadingDate`,lastReadingDate ))
//     dispatch(prepareFinalObject(`meterReading[${cardIndex}].consumption`,consumption ))
//     dispatch(prepareFinalObject(`meterReading[${cardIndex}].meterStatus`,status ))

//     // dispatch(
//     //     handleField(
//     //         "meter-reading",
//     //         "components.div.children.meterReadingEditable.children.card.children.cardContent.children.firstContainer.children.billingCont.children.billingPeriod.props",
//     //         "labelName",
//     //         consumptionDetails.billingPeriod
//     //     )
//     // );
//     // dispatch(
//     //     handleField(
//     //         "meter-reading",
//     //         "components.div.children.meterReadingEditable.children.card.children.cardContent.children.thirdContainer.children.secCont.children.billingPeriod.props",
//     //         "labelName",
//     //         consumptionDetails.lastReading
//     //     )
//     // );
//     // dispatch(
//     //     handleField(
//     //         "meter-reading",
//     //         "components.div.children.meterReadingEditable.children.card.children.cardContent.children.lastReadingContainer.children.secCont.children.billingPeriod.props",
//     //         "labelName",
//     //         consumptionDetails.lastReadingDate
//     //     )
//     // );
//     // dispatch(
//     //     handleField(
//     //         "meter-reading",
//     //         "components.div.children.meterReadingEditable.children.card.children.cardContent.children.sixthContainer.children.secCont.children.billingPeriod.props",
//     //         "labelName",
//     //         consumptionDetails.consumption
//     //     )
//     // );
//     // dispatch(
//     //     handleField(
//     //         "meter-reading",
//     //         "components.div.children.meterReadingEditable.children.card.children.cardContent.children.secondContainer.children.status.props",
//     //         "value",
//     //         status
//     //     )
//     // );
//     // let todayDate = new Date()
//     // dispatch(
//     //     handleField(
//     //         "meter-reading",
//     //         "components.div.children.meterReadingEditable.children.card.children.cardContent.children.fifthContainer.children.currentReadingDate.props",
//     //         "value",
//     //         todayDate
//     //     )
//     // );
//     dispatch(prepareFinalObject(`autoPopulatedValues[${cardIndex}]`, consumptionDetails));

// }

//   const addMeterReading = async(state,dispatch,cardIndex,tenantId,connectionNo) => {
//     dispatch(showSpinner());
//     let queryObject = [{ key: "tenantId", value: tenantId }, { key: "connectionNumber", value: connectionNo },{ key: "searchType",value:"CONNECTION"}];
//     let payloadData = await getSearchResults(queryObject);
//     if (payloadData !== null && payloadData !== undefined && payloadData.WaterConnection.length > 0) {
//         payloadData.WaterConnection = sortpayloadDataObj(payloadData.WaterConnection);
//         let applicationNos = getApplicationNo(payloadData.WaterConnection);
//         const queryObj = [
//             { key: "businessIds", value: applicationNos },
//             { key: "tenantId", value: tenantId }
//         ];        
        
//         // let isApplicationApproved = await isWorkflowExists(queryObj);
//         // let isApplicationApproved = payloadData.WaterConnection[0].applicationStatus === APPLICATIONSTATE.CONNECTIONACTIVATED &&
//         // payloadData.WaterConnection[0].status === APPLICATIONSTATE.STATUS ? true : false

//         let arraySize = payloadData.WaterConnection.length;
//         let isApplicationApproved;
//         if(arraySize === 1){
//             isApplicationApproved = payloadData.WaterConnection[0].applicationStatus === APPLICATIONSTATE.CONNECTIONACTIVATED &&
//                 payloadData.WaterConnection[0].status === APPLICATIONSTATE.STATUS ? true : false
//         }else if(arraySize > 1){
//             isApplicationApproved = payloadData.WaterConnection[0].applicationStatus === APPLICATIONSTATE.APPROVED &&
//                 payloadData.WaterConnection[0].status === APPLICATIONSTATE.STATUS ? true : false
//         }

//         if(payloadData.WaterConnection && (payloadData.WaterConnection[0].applicationStatus == "CONNECTION_DISCONNECTED" 
//         || payloadData.WaterConnection[0].applicationStatus == "CONNECTION_CLOSED")){
//             dispatch(hideSpinner());
//             dispatch(
//                 toggleSnackbar(
//                     true,
//                     {
//                         labelName: "Meter Reading cannot be added as the connection is either disconnected or closed",
//                         labelKey: "Meter Reading cannot be added as the connection is either disconnected or closed"
//                     },
//                     "error"
//                 )
//             );
//             return;
//         }
//         else if(!isApplicationApproved){
//             dispatch(hideSpinner());
//             dispatch(
//                 toggleSnackbar(
//                     true,
//                     {
//                         labelName: "WorkFlow already Initiated",
//                         labelKey: "WS_WORKFLOW_ALREADY_INITIATED"
//                     },
//                     "error"
//                 )
//             );
//             return;
//         } else {
//             await getMdmsDataForAutopopulatedBulk(dispatch,cardIndex)
//             await setAutopopulatedvalues(state, dispatch,cardIndex)
//         }

//     }  
//     dispatch(hideSpinner());
//   }
//   const getMeterReadingDetails = async (state, dispatch, fieldInfo) => {
//     try {
//       const cardIndex = fieldInfo && fieldInfo.index ? fieldInfo.index : "0";
//       const connectionNo = get(
//         state.screenConfiguration.preparedFinalObject,
//         `meterReading[${cardIndex}].connectionNo`,
//         ""
//       );

//       let queryObj = [
//         {
//             key: "tenantId",
//             value: `${localStorage.getItem('tenant-id')}`
//         },
//         {
//             key: "connectionNos",
//             value: connectionNo
//         },
//         { key: "offset", value: "0" }
//     ];

//       await getMeterReadingDataBulkImport(dispatch,queryObj,cardIndex)
//       dispatch(showSpinner());
//       await addMeterReading(state,dispatch,cardIndex,localStorage.getItem('tenant-id'),connectionNo)
//     } catch (e) {
//       dispatch(
//         toggleSnackbar(
//           true,
//           { labelName: e.message, labelKey: e.message },
//           "info"
//         )
//       );
//     }
//   };

// const header = getCommonHeader(
//   {
//     labelKey: "WS_BULK_METER_READING_INFO"
//   },
//   {
//     classes: {
//       root: "common-header-cont"
//     }
//   }
// );

// const getData = async (action, state, dispatch) => {
//   await getMdmsDataForMeterStatus(dispatch)
// }

// const screenConfig = {
//   uiFramework: "material-ui",
//   name: "bulkImport",
//   beforeInitScreen: (action, state, dispatch) => {
//     getData(action, state, dispatch).then(() => {
//     });
//     return action;
//   },
//   components: {
//     div: {
//       uiFramework: "custom-atoms",
//       componentPath: "Div",
//       props: {
//         // className: "common-div-css"
//       },
//       components: {
//         div: {
//           uiFramework: "custom-atoms",
//           componentPath: "Form",
//           props: {
//             className: "common-div-css",
//             id: "search"
//           },
//           children: {
//             headerDiv: {
//               uiFramework: "custom-atoms",
//               componentPath: "Container",
    
//               children: {
//                 header: {
//                   gridDefination: {
//                     xs: 12,
//                     sm: 6
//                   },
//                   ...header
//                 },
                
//               }
//             },
//             // showSearches,
//             breakAfterSearch: getBreak(),
//             wnsApplication,
//             searchApplicationResults
//           }
//         }
//       }
//     }
//   }
// };

// export default screenConfig;

import { getCommonHeader, getBreak, getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { showSearches } from "./searchResource/searchTabs";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { searchResults } from "./searchResource/searchResults";
import { searchApplicationResults } from "./searchResource/searchApplicationResults";
import { localStorageGet, getTenantIdCommon } from "egov-ui-kit/utils/localStorageUtils";
import find from "lodash/find";
import { setBusinessServiceDataToLocalStorage } from "egov-ui-framework/ui-utils/commons";
import { resetFieldsForConnection, resetFieldsForApplication } from '../utils';
import { handleScreenConfigurationFieldChange as handleField ,unMountScreen } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.css";
import { getRequiredDocData, showHideAdhocPopup } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../../ui-utils/api";
import commonConfig from "config/common.js";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { wnsApplication } from './searchResource/employeeApplication';

const getMDMSData = (action, dispatch) => {
  const moduleDetails = [
    {
      moduleName: "ws-services-masters",
      masterDetails: [
        { name: "Documents" }
      ] 
    }
  ]
  try {
    getRequiredDocData(action, dispatch, moduleDetails)
  } catch (e) {
    console.log(e);
  }
};

const getMDMSAppType =async (dispatch) => {
  // getMDMS data for ApplicationType
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: [
         {
            moduleName: "ws-services-masters", masterDetails: [
              { name: "ApplicationType" }
            ]
          }
        ]
      }
    };
    try {
      let applicationType = [];
      let payload = null;
       payload = await httpRequest("post", "/egov-mdms-service/v1/_search", "_search", [], mdmsBody);       
        if(payload && payload.MdmsRes['ws-services-masters'] && payload.MdmsRes['ws-services-masters'].ApplicationType !== undefined){
          payload.MdmsRes['ws-services-masters'].ApplicationType.forEach(obj => applicationType.push({ code: obj.code.replace(/_/g,' '), name: obj.name, businessService:obj.businessService}));          
          applicationType.forEach(type=>getBusinessService(type.businessService,dispatch))
          dispatch(prepareFinalObject("applyScreenMdmsData.searchScreen.applicationType", applicationType));
        }
    } catch (e) { console.log(e); }
  }

const header = getCommonHeader({
  labelKey: "WS_SEARCH_CONNECTION_HEADER"
});

const getBusinessService=async(businessService, dispatch)=>{
  const queryObject = [
    { key: "tenantId", value: getTenantId() },
    { key: "businessServices", value:businessService } 
  ];
  const payload = await httpRequest(
    "post",
    "egov-workflow-v2/egov-wf/businessservice/_search",
    "_search",
    queryObject
  );
  if (payload.BusinessServices[0].businessService === "NewWS1" || payload.BusinessServices[0].businessService === "NewSW1" 
   || payload.BusinessServices[0].businessService === "SWCloseConnection" || payload.BusinessServices[0].businessService === "SWDisconnection" 
   || payload.BusinessServices[0].businessService === "WSCloseConnection" 
   || payload.BusinessServices[0].businessService === "WSDisconnection" 
   || payload.BusinessServices[0].businessService === "WSReconnection"
   || payload.BusinessServices[0].businessService === "SWReconnection"
   || payload.BusinessServices[0].businessService === "WSOwnershipChange"
   || payload.BusinessServices[0].businessService === "SWOwnershipChange") {

    const applicationStatus=commonGetAppStatus(payload);
        dispatch(prepareFinalObject("applyScreenMdmsData.searchScreen.applicationStatusNew", applicationStatus));
    
    }else{
      if (payload.BusinessServices[0].businessService === "ModifyWSConnection" || payload.BusinessServices[0].businessService === "ModifySWConnection") {
        const applicationStatus=commonGetAppStatus(payload);
          dispatch(prepareFinalObject("applyScreenMdmsData.searchScreen.applicationStatusModify", applicationStatus));
      }
    }
}

export const getMdmsTenantsData = async (dispatch) => {
  let mdmsBody = {
      MdmsCriteria: {
          tenantId: commonConfig.tenantId,
          moduleDetails: [
              {
                  moduleName: "tenant",
                  masterDetails: [
                      {
                          name: "tenants"
                      },
                      { 
                        name: "citymodule" 
                      }
                  ]
              },
          ]
      }
  };
  try {
      let payload = null;
      payload = await httpRequest(
          "post",
          "/egov-mdms-service/v1/_search",
          "_search",
          [],
          mdmsBody
      );
      payload.MdmsRes.tenant.tenants = payload.MdmsRes.tenant.citymodule[11].tenants;
      dispatch(prepareFinalObject("applyScreenMdmsData.tenant", payload.MdmsRes.tenant));

  } catch (e) {
      console.log(e);
  }
};

const commonGetAppStatus=(payload)=>{
  const { states } = payload.BusinessServices[0] || [];
  if (states && states.length > 0) {
    const status = states.map((item) => { return { code: item.applicationStatus } });
    return status.filter(item => item.code != null);
  }

}
const employeeSearchResults = {
  uiFramework: "material-ui",
  name: "bulkImport",
  beforeInitScreen: (action, state, dispatch) => {
    // dispatch(handleField("apply",
    // "components",
    // "div", {}));
    // dispatch(handleField("search-preview",
    // "components",
    // "div", {}));
    dispatch(prepareFinalObject('searchConnection',{}))
    dispatch(prepareFinalObject('searchScreen',{}))
    dispatch(unMountScreen("apply"));
    dispatch(unMountScreen("search-preview"));
    getMDMSData(action, dispatch);
    resetFieldsForConnection(state, dispatch);
    resetFieldsForApplication(state, dispatch);
    getMDMSAppType(dispatch);
    getMdmsTenantsData(dispatch);
    dispatch(prepareFinalObject("searchConnection.tenantId", getTenantIdCommon()));
    dispatch(prepareFinalObject("currentTab", "SEARCH_CONNECTION"));
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "search"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",

          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 6
              },
              ...header
            }
          }
        },
        // showSearches,
        breakAfterSearch: getBreak(),
        // searchResults,
        wnsApplication,
        searchApplicationResults
      }
    },
    adhocDialog: {
      uiFramework: "custom-containers",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: false,
        screenKey: "search"
      },
      children: {
        popup: {}
      }
    }
  }
};

export default employeeSearchResults;

