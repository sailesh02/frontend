import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getSelectField,
  getCommonContainer,
  getCommonParagraph,
  getPattern,
  getDateField,
  getLabel,
  getCommonHeader,
  getCommonGrayCard,
  getCommonSubHeader
} from "egov-ui-framework/ui-config/screens/specs/utils";

import { getTodaysDateInYMD, getQueryArg, getObjectKeys, getObjectValues } from 'egov-ui-framework/ui-utils/commons';

const getCurrentDate = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + '-' + mm + '-' + dd;
  return today;
}


export const meterReplacementDetails = getCommonCard({
  
  activationDetailsContainer: getCommonGrayCard({
    subHeader: getCommonTitle({
      labelKey: "WS_METER_REPLACEMENT_DETAIL"
    }),
    activeDetails: getCommonContainer({
      meterInstallationDate: getDateField({
        label: { labelName: "meterInstallationDate", labelKey: "WS_ADDN_DETAIL_METER_INSTALL_DATE" },
        // placeholder: {
        //   labelName: "Select From Date",
        //   labelKey: "WS_FROM_DATE_PLACEHOLDER"
        // },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: false,
        pattern: getPattern("Date"),
        errorMessage: "ERR_INVALID_DATE",
        jsonPath: "replaceMeterScreen.meterInstallationDate",
        
        props: {
          inputProps: { max: getCurrentDate()},
          disabled: process.env.REACT_APP_NAME === "Citizen" || getQueryArg(window.location.href, "mode") === "MODIFY"? true:false}
      }),
      meterID: getTextField({
        label: {
          labelKey: "WS_SERV_DETAIL_METER_ID"
        },
        placeholder: {
          labelKey: "WS_ADDN_DETAILS_METER_ID_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: false,
        pattern: /^[a-z0-9]+$/i,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "replaceMeterScreen.meterId",
        props: {disabled: process.env.REACT_APP_NAME === "Citizen" || getQueryArg(window.location.href, "mode") === "MODIFY"? true:false}
      }),
      
      initialMeterReading: getTextField({
        label: {
          labelKey: "WS_ADDN_DETAILS_INITIAL_METER_READING"
        },
        placeholder: {
          labelKey: "WS_ADDN_DETAILS_INITIAL_METER_READING_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: true,
        pattern: /^[0-9]\d{0,9}(\.\d{1,3})?%?$/,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "replaceMeterScreen.additionalDetails.initialMeterReading",
        props: {disabled: process.env.REACT_APP_NAME === "Citizen" || getQueryArg(window.location.href, "mode") === "MODIFY"? true:false}
      }),
      meterMake : getTextField({
        label: {
          labelKey: "WS_ADDN_DETAILS_METER_MAKE"
        },
        placeholder: {
          labelKey: "WS_ADDN_DETAILS_MAKE_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: true,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "replaceMeterScreen.additionalDetails.meterMake",
        props: {disabled: process.env.REACT_APP_NAME === "Citizen" || getQueryArg(window.location.href, "mode") === "MODIFY"? true:false}
      }),
      meterReadingRatio: getSelectField({
        label: {
          labelName: "Meter Ratio",
          labelKey: "WS_ADDN_DETAILS_METER_RATIO"
        },
        placeholder: {
          labelName: "Select Meter Ratio",
          labelKey: "WS_ADDN_DETAILS_METER_RATIO_PLACEHOLDER"
        },
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        required: true,
        sourceJsonPath: "applyScreenMdmsData.ws-services-masters.fileteredMeterReadingRatio",
        jsonPath: "replaceMeterScreen.additionalDetails.meterReadingRatio",
        optionValue: "code",
        optionLabel: "label",
        props: {disabled: process.env.REACT_APP_NAME === "Citizen" || getQueryArg(window.location.href, "mode") === "MODIFY"? true:false},
        gridDefination: {
          xs: 12,
          sm: 6
        }
      }),
      maxMeterDigits : getSelectField({
        label: {
          labelKey: "WS_ADDN_DETAILS_MAX_METER_DIGITS_LABEL"
        },
        placeholder: {
          labelKey: "WS_ADDN_DETAILS_MAX_METER_DIGITS_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        data: [{value: 4, label: 4},
          {value: 5, label: 5}, {value: 6, label: 6}, {value: 7, label: 7}, {value: 8, label: 8}
         ],
         optionValue:"value",
         optionLabel:"label",
        required: true,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "replaceMeterScreen.additionalDetails.maxMeterDigits",
        props: {disabled: process.env.REACT_APP_NAME === "Citizen" || getQueryArg(window.location.href, "mode") === "MODIFY"? true:false}
      }),
    },
    )
  }),
  
});