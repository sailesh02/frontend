import {
    dispatchMultipleFieldChangeAction,
    getLabel,
    getCommonContainer,
    convertDateToEpoch
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getQueryArg, validateFields } from "egov-ui-framework/ui-utils/commons";
  import { getTenantIdCommon } from "egov-ui-kit/utils/localStorageUtils";
  import get from "lodash/get";
  import set from 'lodash/set';
  import { httpRequest } from "../../../../../ui-utils";
  import { getCommonApplyFooter, resetFieldsBulkImport, resetTableData } from "../../utils";
  import "./index.css";
  import commonConfig from "config/common.js";

  const callBackForReset = (state, dispatch) => {
    resetFieldsBulkImport(state,dispatch)
    resetTableData(state,dispatch)
  };

  const getDateFormat = (date,type) => {
      if(type == 'current'){
          return convertDateToEpoch(date, "dayend")
      }else if(type == 'last'){
        let dates = date.split('/')
        let formattedDate = ''
        if(dates.length > 2){
            formattedDate = `${dates[2]}-${dates[1]}-${dates[0]}`
            return convertDateToEpoch(formattedDate, "dayend")
        }else{
            return date
        } 
      }else{
          return date
      }
      
  }

  const callBackForSaveAll = async (state, dispatch) => {
    let meterReadingBulk = get(state, "screenConfiguration.preparedFinalObject.meterReadingBulk") || [];
    if(meterReadingBulk && meterReadingBulk.length == 0){
        dispatch(
            toggleSnackbar(
              true,
              {
                labelName: "Please Enter Atleast One Reading to Proceed",
                labelKey: "WS_METER_READING_DETAILS_ERROR"
              },
              "warning"
            )
          );
          return 
    }
    let apiPayload = meterReadingBulk && meterReadingBulk.map ((data,index) => {
        return {
            ...data,
            tenantId : getTenantIdCommon(),
            lastReadingDate : getDateFormat (data.lastReadingDate,'last'),
            currentReadingDate : getDateFormat(data.currentReadingDate,'current'),
        }
    })

    try{
        let response = await httpRequest("post", "/ws-calculator/meterConnection/bulk/_createe", "", [], {meterReadings:apiPayload});
        if(response){
            dispatch(
                toggleSnackbar(
                  true,
                  {
                    labelName: "WS_METER_READING_INSERT_SUCEES",
                    labelKey: "WS_METER_READING_INSERT_SUCEES"
                  },
                  "success"
                )
              ); 
            callBackForReset(state,dispatch)

        }
    }catch(err){
        dispatch(
            toggleSnackbar(
              true,
              {
                labelName: err.Message,
                labelKey:  err.Message
              },
              "error"
            )
          ); 
    }
    
    console.log("apiPayloadapiPayloadapiPayloadapiPayloadapiPayloadapiPayloadapiPayload",apiPayload)

}
  
  export const bulkImportFooter = getCommonApplyFooter("BOTTOM", {
    resetButton: {
      componentPath: "Button",
      props: {
        variant: "outlined",
        color: "primary",
        style: {
          // minWidth: "200px",
          height: "48px",
          marginRight: "16px"
        }
      },
      children: {
        resetButtonLabel: getLabel({
          labelName: "Reset All",
          labelKey: "WS_RESET_ALL"
        })
      },
      onClickDefination: {
        action: "condition",
        callBack: callBackForReset
      },
      visible: true
    },
    saveAllButton: {
      componentPath: "Button",
      props: {
        variant: "contained",
        color: "primary",
        style: {
          // minWidth: "200px",
          height: "48px",
          marginRight: "45px"
        }
      },
      children: {
        saveAllLabel: getLabel({
          labelName: "Save All",
          labelKey: "WS_SAVE_ALL"
        }),
      },
      onClickDefination: {
        action: "condition",
        callBack: callBackForSaveAll
      }
    }
  });