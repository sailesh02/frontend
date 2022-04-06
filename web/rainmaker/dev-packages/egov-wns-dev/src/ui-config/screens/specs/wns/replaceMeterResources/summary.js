import {
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer,
  getLabelWithValue,
  getLabel,
  getDivider,
  getLabelWithValueForModifiedLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { convertEpochToDateAndHandleNA, handleNA, handleLaborCharge, handleInstallementorFullPayment, handleRoadType,handleIsVolumetric, handleVolumetricWaterCharge, handleIsDailyConsumption } from '../../utils';

const getHeader = label => {
  return {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-wns",
    componentPath: "DividerWithLabel",
    props: {
      className: "hr-generic-divider-label",
      labelProps: {},
      dividerProps: {},
      label
    },
    type: "array"
  };
};

export const reviewMeterId = getLabelWithValueForModifiedLabel(
  {
    labelName: "Meter ID",
    labelKey: "WS_SERV_DETAIL_METER_ID"
  },
  { jsonPath: "replaceMeterScreen.meterId",
    callBack: handleNA },
  
);

export const reviewMeterInstallationDate = getLabelWithValueForModifiedLabel(
  {
    labelName: "Meter Installation Date",
    labelKey: "WS_ADDN_DETAIL_METER_INSTALL_DATE"
  },
  {
    jsonPath: "replaceMeterScreen.meterInstallationDate",
    callBack: convertEpochToDateAndHandleNA
  }
);

export const reviewInitialMeterReading = getLabelWithValueForModifiedLabel(
  {
    labelName: "Initial Meter Reading",
    labelKey: "WS_ADDN_DETAILS_INITIAL_METER_READING"
  },
  { jsonPath: "replaceMeterScreen.additionalDetails.initialMeterReading",
    callBack: handleNA },
  
);

export const reviewMeterMake = getLabelWithValueForModifiedLabel(
  {
    labelName: "Meter Make",
    labelKey: "WS_ADDN_DETAILS_METER_MAKE"
  },
  { jsonPath: "replaceMeterScreen.additionalDetails.meterMake",
    callBack: handleNA },
  
);

export const reviewMaxMeterDigits = getLabelWithValueForModifiedLabel(
  {
    labelName: "WS_ADDN_DETAILS_MAX_METER_DIGITS_REVIEW_LABEL",
    labelKey: "WS_ADDN_DETAILS_MAX_METER_DIGITS_REVIEW_LABEL"
  },
  { jsonPath: "replaceMeterScreen.additionalDetails.maxMeterDigits",
    callBack: handleNA },
  
);

export const reviewMeterRatio = getLabelWithValueForModifiedLabel(
  {
    labelName: "Initial Meter Reading",
    labelKey: "WS_ADDN_DETAILS_METER_RATIO"
  },
  { jsonPath: "replaceMeterScreen.additionalDetails.meterReadingRatio",
    callBack: handleNA 
  }
  
);

const activationDetailsHeader = getHeader({
  labelKey: "WS_ACTIVATION_DETAILS"
});
export const getSummaryForReview = (isEditable = true) => {
  return getCommonGrayCard({
    
    
    viewOne: activationDetailsHeader,
    viewTwo: activationDetails,
    

  })
};



const activationDetails = getCommonContainer({
  reviewMeterInstallationDate,
  reviewMeterId,
  reviewInitialMeterReading,
  reviewMeterMake,
  reviewMeterRatio,
  reviewMaxMeterDigits
});
