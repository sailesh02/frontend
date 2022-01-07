import {
  getLabel,
  convertDateToEpoch
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar, showSpinner, hideSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantIdCommon } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import { httpRequest } from "../../../../../ui-utils";
import { getCommonApplyFooter, resetFieldsBulkImport, resetTableData } from "../../utils";
import "./index.css";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";

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
  if(window.confirm(getLocaleLabels('WS_BULK_SAVE_CONFIRMATION','WS_BULK_SAVE_CONFIRMATION'))){
    let apiPayload = meterReadingBulk && meterReadingBulk.map ((data,index) => {
      return {
          ...data,
          tenantId : getTenantIdCommon(),
          lastReadingDate : getDateFormat (data.lastReadingDate,'last'),
          currentReadingDate : getDateFormat(data.currentReadingDate,'current'),
      }
  })

  try{
      dispatch(showSpinner())
      let response = await httpRequest("post", "/ws-calculator/meterConnection/bulk/_create", "", [], {meterReadings:apiPayload});
      dispatch(hideSpinner())
      if(response){
        callBackForReset(state,dispatch)
        let acknowledgementData = response.meterReadings
        let success = acknowledgementData && acknowledgementData.length > 0 && acknowledgementData.filter( (data) => {
          return data.status == 'SUCCESS' || data.status == 'Success' || data.status == 'success'
        }) || []
        dispatch(prepareFinalObject('acknowledgementData',acknowledgementData))
        dispatch(prepareFinalObject('success',success.length))
        dispatch(prepareFinalObject('totalCount',acknowledgementData.length))
        dispatch(
          setRoute(
            `/wns/meterReadingAcknowledgment`
          )
        );
      }

  }catch(err){
    dispatch(hideSpinner())
      dispatch(
          toggleSnackbar(
            true,
            {
              labelName: err.message,
              labelKey:  err.message
            },
            "error"
          )
        ); 
  }
}
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