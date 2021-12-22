import {
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer,
  getLabelWithValue,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { serviceConst } from "../../../../../ui-utils/commons";
import { getUserInfo, getTenantIdCommon } from "egov-ui-kit/utils/localStorageUtils";
import { handleService } from "../../utils";



export const renderService = () => {
const tenantId = getTenantIdCommon()
const connectionNumber = getQueryArg(window.location.href, "connectionNumber");
const service = getQueryArg(window.location.href, "service")
const connectionFacility = getQueryArg(window.location.href, "connectionFacility")
const connectionType = getQueryArg(window.location.href, "connectionType")
  if (connectionFacility === serviceConst.WATER) {
    if (connectionType === "Metered") {
      // var roles = JSON.parse(getUserInfo()).roles;
      // let btnFlag = false;
      // for(var i=0; i<roles.length; i++){
      //   if(roles[i].code === "SW-CEMP" || roles[i].code === "WS-CEMP"){
      //     btnFlag = true;
      //     break;
      //   }
      // }
      return getCommonContainer({
        serviceType: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_SERV_LABEL" }, { jsonPath: "WaterConnection[0].connectionFacility" }),
        connectionCategory: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_CONN_CATEGORY" }, { jsonPath: "WaterConnection[0].connectionCategory" }),
        connectionType: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_CONN_TYPE" }, { jsonPath: "WaterConnection[0].connectionType" }),
        meterID: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_METER_ID" }, { jsonPath: "WaterConnection[0].meterId" }),
        // pipeSize: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_PIPE_SIZE" }, { jsonPath: "WaterConnection[0].pipeSize" }),
        connectionExecutionDate: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_CONN_EXECUTION_DATE" }, { jsonPath: "WaterConnection[0].connectionExecutionDate" }),
        // rainwaterHarvestingFacility: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_CONN_RAIN_WATER_HARVESTING_FAC" }, { jsonPath: "WaterConnection[0].property.additionalDetails.isRainwaterHarvesting" }),
        waterSource: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_WATER_SOURCE" }, { jsonPath: "WaterConnection[0].waterSource" }),
        waterSubSource: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_WATER_SUB_SOURCE" }, { jsonPath: "WaterConnection[0].waterSubSource" }),
        meterMake: getLabelWithValue({ labelKey: "WS_ADDN_DETAILS_METER_MAKE" }, { jsonPath: "WaterConnection[0].additionalDetails.meterMake" }),
        meterReadingRatio: getLabelWithValue({ labelKey: "WS_ADDN_DETAILS_METER_RATIO" }, { jsonPath: "WaterConnection[0].additionalDetails.meterReadingRatio" }),
        editSection: {
          componentPath: "Button",
          props: { color: "primary", style: { margin: "-16px" } },
          visible: true,
          gridDefination: { xs: 12, sm: 12, align: "left" },
          children: { buttonLabel: getLabel({ labelKey: "WS_CONNECTION_DETAILS_VIEW_CONSUMPTION_LABEL" }) },
          onClickDefination: {
            action: "page_change",
            path: `meter-reading?connectionNos=${connectionNumber}&tenantId=${tenantId}`
          }
        },
      })
    } else {
      return getCommonContainer({
        serviceType: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_SERV_LABEL" }, { jsonPath: "WaterConnection[0].connectionFacility" }),
        connectionCategory: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_CONN_CATEGORY" }, { jsonPath: "WaterConnection[0].connectionCategory" }),
        connectionType: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_CONN_TYPE" }, { jsonPath: "WaterConnection[0].connectionType" }),
        // pipeSize: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_PIPE_SIZE" }, { jsonPath: "WaterConnection[0].pipeSize" }),
        connectionExecutionDate: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_CONN_EXECUTION_DATE" }, { jsonPath: "WaterConnection[0].connectionExecutionDate" }),
        // rainwaterHarvestingFacility: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_CONN_RAIN_WATER_HARVESTING_FAC" }, { jsonPath: "WaterConnection[0].property.additionalDetails.isRainwaterHarvesting" }),
        waterSource: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_WATER_SOURCE" }, { jsonPath: "WaterConnection[0].waterSource" }),
        waterSubSource: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_WATER_SUB_SOURCE" }, { jsonPath: "WaterConnection[0].waterSubSource" }),
        numberOfTaps: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_NO_OF_TAPS" }, { jsonPath: "WaterConnection[0].noOfTaps" })
      })
    }
  } else if(connectionFacility === serviceConst.WATERSEWERAGE){
    if (connectionType === "Metered") {
      return getCommonContainer({
        serviceType: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_SERV_LABEL" }, { jsonPath: "WaterConnection[0].connectionFacility",callBack: handleService }),
        connectionCategory: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_CONN_CATEGORY" }, { jsonPath: "WaterConnection[0].connectionCategory" }),
        connectionType: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_CONN_TYPE" }, { jsonPath: "WaterConnection[0].connectionType" }),
        meterID: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_METER_ID" }, { jsonPath: "WaterConnection[0].meterId" }),
        connectionExecutionDate: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_CONN_EXECUTION_DATE" }, { jsonPath: "WaterConnection[0].connectionExecutionDate" }),
        waterSource: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_WATER_SOURCE" }, { jsonPath: "WaterConnection[0].waterSource" }),
        waterSubSource: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_WATER_SUB_SOURCE" }, { jsonPath: "WaterConnection[0].waterSubSource" }),
        meterMake: getLabelWithValue({ labelKey: "WS_ADDN_DETAILS_METER_MAKE" }, { jsonPath: "WaterConnection[0].additionalDetails.meterMake" }),
        meterReadingRatio: getLabelWithValue({ labelKey: "WS_ADDN_DETAILS_METER_RATIO" }, { jsonPath: "WaterConnection[0].additionalDetails.meterReadingRatio" }),
        pipeSize: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_PIPE_SIZE" }, { jsonPath: "WaterConnection[0].pipeSize" }),
        diameter: getLabelWithValue({ labelKey: "WS_CONN_DETAIL_DIAMETER" }, { jsonPath: "WaterConnection[0].additionalDetails.diameter" }),
        numberOfToilets: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_NO_OF_TOILETS" }, { jsonPath: "WaterConnection[0].noOfToilets" }),
        editSection: {
          componentPath: "Button",
          props: { color: "primary", style: { margin: "-16px" } },
          visible: true,
          gridDefination: { xs: 12, sm: 12, align: "left" },
          children: { buttonLabel: getLabel({ labelKey: "WS_CONNECTION_DETAILS_VIEW_CONSUMPTION_LABEL" }) },
          onClickDefination: {
            action: "page_change",
            path: `meter-reading?connectionNos=${connectionNumber}&tenantId=${tenantId}`
          }
        },
      })
    } else {
      return getCommonContainer({
        serviceType: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_SERV_LABEL" }, { jsonPath: "WaterConnection[0].connectionFacility" }),
        connectionCategory: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_CONN_CATEGORY" }, { jsonPath: "WaterConnection[0].connectionCategory" }),
        connectionType: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_CONN_TYPE" }, { jsonPath: "WaterConnection[0].connectionType" }),
        connectionExecutionDate: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_CONN_EXECUTION_DATE" }, { jsonPath: "WaterConnection[0].connectionExecutionDate" }),
        waterSource: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_WATER_SOURCE" }, { jsonPath: "WaterConnection[0].waterSource" }),
        waterSubSource: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_WATER_SUB_SOURCE" }, { jsonPath: "WaterConnection[0].waterSubSource" }),
        numberOfTaps: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_NO_OF_TAPS" }, { jsonPath: "WaterConnection[0].noOfTaps" }),
        pipeSize: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_PIPE_SIZE" }, { jsonPath: "WaterConnection[0].pipeSize" }),
        diameter: getLabelWithValue({ labelKey: "WS_CONN_DETAIL_DIAMETER" }, { jsonPath: "WaterConnection[0].additionalDetails.diameter" }),
        numberOfToilets: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_NO_OF_TOILETS" }, { jsonPath: "WaterConnection[0].noOfToilets" })
      })
    }

  }else if (connectionFacility === serviceConst.SEWERAGE) {
    return getCommonContainer({
      serviceType: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_SERV_LABEL" }, { jsonPath: "WaterConnection[0].connectionFacility" }),
      connectionExecutionDate: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_CONN_EXECUTION_DATE" }, { jsonPath: "WaterConnection[0].connectionExecutionDate" }),
      pipeSize: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_PIPE_SIZE" }, { jsonPath: "WaterConnection[0].pipeSize" }),
      diameter: getLabelWithValue({ labelKey: "WS_CONN_DETAIL_DIAMETER" }, { jsonPath: "WaterConnection[0].additionalDetails.diameter" }),
      numberOfToilets: getLabelWithValue({ labelKey: "WS_SERV_DETAIL_NO_OF_TOILETS" }, { jsonPath: "WaterConnection[0].noOfToilets" })
    })
  }
}

export const getServiceDetails = () => {

  return getCommonGrayCard({
    headerDiv: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      props: {
        style: { marginBottom: "10px" }
      },
      children: {
        header: {
          gridDefination: {
            xs: 12,
            sm: 10
          },
          ...getCommonSubHeader({
            labelKey: "WS_COMMON_SERV_DETAIL"
          })
        }
      }
    },
    viewOne: renderService()
  });
};


