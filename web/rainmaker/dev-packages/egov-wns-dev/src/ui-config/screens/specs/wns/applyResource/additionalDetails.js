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
//   import { searchApiCall } from "./functions";
import commonConfig from "config/common.js";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getHeaderSideText } from "../../utils";
import get from 'lodash/get';
import { httpRequest } from '../../../../../ui-utils/index';
import set from 'lodash/set';
import { getTodaysDateInYMD, getQueryArg, getObjectKeys, getObjectValues } from 'egov-ui-framework/ui-utils/commons';
import { isModifyMode } from "../../../../../ui-utils/commons";
let isMode = isModifyMode();
const getCurrentDate = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + '-' + mm + '-' + dd;
  return today;
}
const getPlumberRadioButton = {
  uiFramework: "custom-containers-local",
  moduleName: "egov-wns",
  componentPath: "RadioGroupContainer",
  gridDefination: { xs: 12, sm: 12 },
  jsonPath: "applyScreen.additionalDetails.detailsProvidedBy",
  props: {
    label: { key: "WS_ADDN_DETAILS_PLUMBER_PROVIDED_BY" },
    buttons: [
      { labelKey: "WS_PLUMBER_ULB", value: "ULB" },
      { labelKey: "WS_PLUMBER_SELF", value: "Self" },
    ],
    required: false
  },
  type: "array"
};
export const triggerUpdateByKey = (state, keyIndex, value, dispatch) => {
  if(dispatch == "set"){
    set(state, `screenConfiguration.preparedFinalObject.DynamicMdms.ws-services-masters.waterSource.selectedValues[${keyIndex}]`, value);
  } else {
    dispatch(prepareFinalObject( `DynamicMdms.ws-services-masters.waterSource.${keyIndex}`, value ));
  }
}
export const updateWaterSource = async ( state, dispatch ) => {  
  const waterSource = get( state, "screenConfiguration.preparedFinalObject.WaterConnection[0].waterSource", null);
  const waterSubSource = get( state, "screenConfiguration.preparedFinalObject.WaterConnection[0].waterSubSource", null);
  let modValue = waterSource + "." + waterSubSource;
  let i = 0;
  let formObj = {
    waterSourceType: waterSource, waterSubSource: modValue
  }
  triggerUpdateByKey(state, i, formObj, 'set');

  triggerUpdateByKey(state, `waterSubSourceTransformed.allDropdown[${i}]`, getObjectValues(get( state, `screenConfiguration.preparedFinalObject.DynamicMdms.ws-services-masters.waterSource.waterSourceTransformed.${waterSource}`, [])) , dispatch);

  triggerUpdateByKey(state, `selectedValues[${i}]`, formObj , dispatch);
} 
const waterSourceTypeChange = (reqObj) => {
  try {
      let { dispatch, value, state } = reqObj;
      dispatch(prepareFinalObject("WaterConnection[0].waterSource", value));
      dispatch(prepareFinalObject("WaterConnection[0].waterSubSource", ''));
      let formObj = {
        waterSourceType: value, waterSubSource: ''
      }
      triggerUpdateByKey(state, `selectedValues[0]`, formObj , dispatch);
  } catch (e) {
    console.log(e);
  }
}
const waterSubSourceChange = (reqObj) => {
  try {
      let { dispatch, value } = reqObj;
      let rowValue = value.split(".");
      dispatch(prepareFinalObject("WaterConnection[0].waterSubSource", rowValue[1]));
  } catch (e) {
    console.log(e);
  }
}
export const commonRoadCuttingChargeInformation = () => {
  return getCommonGrayCard({
    roadDetails: getCommonContainer({
      roadType: getSelectField({
        label: {
          labelName: "Road Type",
          labelKey: "WS_ADDN_DETAIL_ROAD_TYPE"
        },
        placeholder: {
          labelKey: "WS_ADDN_DETAILS_ROAD_TYPE_PLACEHOLDER"
        },
        localePrefix: {
          moduleName: "WS",
          masterName: "ROADTYPE"
        },
        required: false,
        sourceJsonPath: "applyScreenMdmsData.sw-services-calculation.RoadType",
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: false,
        errorMessage: "ERR_INVALID_BILLING_PERIOD",
        jsonPath: "applyScreen.roadCuttingInfo[0].roadType",
        props: {
          jsonPath: "applyScreen.roadCuttingInfo[0].roadType"
        }
      }),
      enterArea: getTextField({
        label: {
          labelKey: "WS_ADDN_DETAILS_AREA_LABEL"
        },
        placeholder: {
          labelKey: "WS_ADDN_DETAILS_AREA_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: false,
        pattern: getPattern("Amount"),
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "applyScreen.roadCuttingInfo[0].roadCuttingArea"
      })
    })
  })
}

export const additionDetails = getCommonCard({
  header: getCommonHeader({
    labelKey: "WS_COMMON_ADDN_DETAILS_HEADER"
  }),
  connectiondetailscontainer: getCommonGrayCard({
    subHeader: getCommonTitle({
      labelKey: "WS_COMMON_CONNECTION_DETAILS"
    }),

    connectionDetails: getCommonContainer({
      connectionType: {
        ...getSelectField({
          label: { labelKey: "WS_SERV_DETAIL_CONN_TYPE" },
          placeholder: { labelKey: "WS_ADDN_DETAILS_CONN_TYPE_PLACEHOLDER" },
          required: false,
          sourceJsonPath: "applyScreenMdmsData.ws-services-masters.connectionType",
          gridDefination: { xs: 12, sm: 6 },
          errorMessage: "ERR_INVALID_BILLING_PERIOD",
          jsonPath: "applyScreen.connectionType"
        }),
        afterFieldChange: async (action, state, dispatch) => {
          if(process.env.REACT_APP_NAME !== "Citizen") {
            let connType = await get(state, "screenConfiguration.preparedFinalObject.applyScreen.connectionType");
            console.log('connType');
            console.log(connType);
            if (connType === undefined || connType === "Non Metered" || connType === "Bulk-supply" || connType !== "Metered") {
              showHideFeilds(dispatch, false);
            }
            else {
              showHideFeilds(dispatch, true);
            }
          }
        }
      },

      numberOfTaps: getTextField({
        label: { labelKey: "WS_SERV_DETAIL_NO_OF_TAPS" },
        placeholder: { labelKey: "WS_SERV_DETAIL_NO_OF_TAPS_PLACEHOLDER" },
        gridDefination: { xs: 12, sm: 6 },
        jsonPath: "applyScreen.noOfTaps",
        pattern: /^[0-9]*$/i,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      }),
      
      dynamicMdmsWaterSource : {
        uiFramework: "custom-containers",
        componentPath: "DynamicMdmsContainer",
        props: {
          dropdownFields: [
            {
              key : 'waterSourceType',
              callBack: waterSourceTypeChange 
            },
            {
              key : 'waterSubSource',
              callBack: waterSubSourceChange 
            }
          ],
          moduleName: "ws-services-masters",
          masterName: "waterSource",
          rootBlockSub : 'waterSource',
          callBackEdit: updateWaterSource
        }
      },
      pipeSize: getSelectField({
        label: { labelKey: "WS_SERV_DETAIL_PIPE_SIZE" },
        placeholder: { labelKey: "WS_SERV_DETAIL_PIPE_SIZE_PLACEHOLDER" },
        gridDefination: { xs: 12, sm: 6 },
        sourceJsonPath: "applyScreenMdmsData.sw-services-calculation.pipeSize",
        jsonPath: "applyScreen.pipeSize",
        pattern: /^[0-9]*$/i,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG"
      }),

      noOfWaterClosets: getTextField({
        label: { labelKey: "WS_ADDN_DETAILS_NO_OF_WATER_CLOSETS" },
        placeholder: { labelKey: "WS_ADDN_DETAILS_NO_OF_WATER_CLOSETS_PLACEHOLDER" },
        gridDefination: { xs: 12, sm: 6 },
        jsonPath: "applyScreen.noOfWaterClosets",
        pattern: /^[0-9]*$/i,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG"
      }),
      noOfToilets: getTextField({
        label: { labelKey: "WS_ADDN_DETAILS_NO_OF_TOILETS" },
        placeholder: { labelKey: "WS_ADDN_DETAILS_NO_OF_TOILETS_PLACEHOLDER" },
        gridDefination: { xs: 12, sm: 6 },
        jsonPath: "applyScreen.noOfToilets",
        pattern: /^[0-9]*$/i,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG"
      })
    }),
  }),
    plumberDetailsContainer: getCommonGrayCard({
      subHeader: getCommonTitle({
        labelKey: "WS_COMMON_PLUMBER_DETAILS"
      }),
      plumberDetails: getCommonContainer({
        getPlumberRadioButton,
        plumberLicenceNo: getTextField({
          label: {
            labelKey: "WS_ADDN_DETAILS_PLUMBER_LICENCE_NO_LABEL"
          },
          placeholder: {
            labelKey: "WS_ADDN_DETAILS_PLUMBER_LICENCE_NO_PLACEHOLDER"
          },
          gridDefination: {
            xs: 12,
            sm: 6
          },
          required: false,
          pattern: /^[0-9]*$/i,
          errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
          jsonPath: "applyScreen.plumberInfo[0].licenseNo"
        }),
        plumberName: getTextField({
          label: {
            labelKey: "WS_ADDN_DETAILS_PLUMBER_NAME_LABEL"
          },
          placeholder: {
            labelKey: "WS_ADDN_DETAILS_PLUMBER_NAME_PLACEHOLDER"
          },
          gridDefination: {
            xs: 12,
            sm: 6
          },
          required: false,
          pattern: getPattern("Name"),
          errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
          jsonPath: "applyScreen.plumberInfo[0].name"
        }),
        plumberMobNo: getTextField({
          label: {
            labelKey: "WS_ADDN_DETAILS_PLUMBER_MOB_NO_LABEL"
          },
          placeholder: {
            labelKey: "WS_ADDN_DETAILS_PLUMBER_MOB_NO_LABEL_PLACEHOLDER"
          },
          gridDefination: { xs: 12, sm: 6 },
          iconObj: { label: "+91 |", position: "start" },
          required: false,
          pattern: getPattern("MobileNo"),
          errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
          jsonPath: "applyScreen.plumberInfo[0].mobileNumber"
        }),
      })
    }),
  // roadCuttingChargeContainer: getCommonCard({
  //   header: getCommonSubHeader(
  //     {
  //       labelName: "Road Cutting Charge",
  //       labelKey: "WS_ROAD_CUTTING_CHARGE_DETAILS"
  //     },
  //     {
  //       style: {
  //         marginBottom: 18
  //       }
  //     }
  //   ),
  //   applicantTypeContainer: getCommonContainer({
  //     roadCuttingChargeInfoCard : {
  //       uiFramework: "custom-atoms",
  //       componentPath: "Div",
  //       props: {
  //         style: {
  //           // display: "none"
  //           // width: 
  //         }
  //       },
  //       children: {
  //         multipleApplicantInfo: {
  //           uiFramework: "custom-containers",
  //           componentPath: "MultiItem",
  //           props: {
  //             scheama: commonRoadCuttingChargeInformation(),
  //             items: [],
  //             addItemLabel: {
  //               labelName: "Add Road Type",
  //               labelKey: "WS_ADD_ROAD_TYPE_LABEL"
  //             },
  //             isReviewPage: false,
  //             sourceJsonPath: "applyScreen.roadCuttingInfo",
  //             prefixSourceJsonPath: "children.cardContent.children.roadDetails.children"
  //           },
  //           type: "array"
  //         }
  //       }
  //     },
  //   }),
  // }),
  activationDetailsContainer: getCommonGrayCard({
    subHeader: getCommonTitle({
      labelKey: "WS_ACTIVATION_DETAILS"
    }),
    activeDetails: getCommonContainer({
      connectionExecutionDate: getDateField({
        label: { labelName: "connectionExecutionDate", labelKey: "WS_SERV_DETAIL_CONN_EXECUTION_DATE" },
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
        jsonPath: "applyScreen.connectionExecutionDate",
        props: {disabled: process.env.REACT_APP_NAME === "Citizen"}
      }),
      diameter: getSelectField({
        label: { labelKey: "WS_CONN_DETAIL_DIAMETER" },
        sourceJsonPath: "applyScreenMdmsData.sw-services-calculation.fileteredDiameter",
        optionValue: "code",
        optionLabel: "label",
        placeholder: { labelKey: "WS_CONN_DETAIL_DIAMETER_PLACEHOLDER" },
        required: true,
        props: {disabled: process.env.REACT_APP_NAME === "Citizen"},
        gridDefination: { xs: 12, sm: 6 },
        jsonPath: "applyScreen.additionalDetails.diameter"
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
        jsonPath: "applyScreen.meterId",
        props: {disabled: process.env.REACT_APP_NAME === "Citizen"}
      }),
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
        jsonPath: "applyScreen.meterInstallationDate",
        props: {disabled: process.env.REACT_APP_NAME === "Citizen"}
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
        required: false,
        pattern: /^[0-9]\d{0,9}(\.\d{1,3})?%?$/,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "applyScreen.additionalDetails.initialMeterReading",
        props: {disabled: process.env.REACT_APP_NAME === "Citizen"}
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
        jsonPath: "applyScreen.additionalDetails.meterMake",
        props: {disabled: process.env.REACT_APP_NAME === "Citizen"}
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
        jsonPath: "applyScreen.additionalDetails.meterReadingRatio",
        optionValue: "code",
        optionLabel: "label",
        props: {disabled: process.env.REACT_APP_NAME === "Citizen"},
        gridDefination: {
          xs: 12,
          sm: 6
        }
      }),
    }, 
    {
      style:getQueryArg(window.location.href, "mode") === "MODIFY"? {"pointer-events":"none", "cursor":"not-allowed",overflow:"visible"}:{overflow: "visible"}
    
    }
    )
  }),
  volumetricDetails : getCommonGrayCard({
    subHeader: getCommonTitle({
      labelKey: "WS_VOLUMETRIC_DETAILS"
    }),
    activeDetails: getCommonContainer({
      isVolumetricConnection: getSelectField({
        label: { labelKey: "WS_IS_VOLUMETRIC_CONNECTION"},
        data: [{code:'Y',label:'Yes'},{code:'N',label:'No'}],
        optionValue: "code",
        optionLabel: "label",
        placeholder: { labelKey: "WS_IS_VOLUMETRIC_CONNECTION_PLACEHOLDER" },
        required: true,
        props: {disabled: process.env.REACT_APP_NAME === "Citizen"},
        gridDefination: { xs: 6, sm: 6 },
        jsonPath: "applyScreen.additionalDetails.isVolumetricConnection",
        afterFieldChange: async (action, state, dispatch) => {
          let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
          if(process.env.REACT_APP_NAME != 'Citizen' && !applicationNumber){
            dispatch(
              handleField(
              "apply",
              "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourTeen.children.reviewLaborCharge",
              "visible",
              true
            ));
            dispatch(
              handleField(
              "apply",
              "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourTeen",
              "visible",
              true
            ));
            dispatch(
              handleField(
              "apply",
              "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourTeen.children.reviewInstallment",
              "visible",
              true
            ));
          }
          if(process.env.REACT_APP_NAME !== "Citizen") {
            let mStep = isModifyMode() ? 'formwizardSecondStep' : 'formwizardThirdStep';
            let connectionType = get(state, "screenConfiguration.preparedFinalObject.applyScreen.connectionType");
            let oldConnectioNumber = get(state, "screenConfiguration.preparedFinalObject.applyScreen.oldConnectionNo");
            if (connectionType === undefined || connectionType != "Metered") {
              if(action && action.value && action.value === 'Y'){
                dispatch(
                  handleField(
                    "apply",
                    `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.volumetricDetails.children.cardContent.children.activeDetails.children.volumetricWaterCharge`,
                    "visible",
                    oldConnectioNumber && oldConnectioNumber!= 'NA' ? true : false
                  )
                );

                dispatch(
                  handleField(
                    "apply",
                    `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.volumetricDetails.children.cardContent.children.activeDetails.children.dailyConsumption`,
                    "visible",
                    oldConnectioNumber && oldConnectioNumber!= 'NA' || isModifyMode() ? false : true 
                  )
                );
                dispatch(
                  handleField(
                    "apply",
                    `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.volumetricDetails.children.cardContent.children.activeDetails.children.consumptionInKL`,
                    "visible",
                    oldConnectioNumber && oldConnectioNumber!= 'NA' ? false : true  
                  )
                );

              }else{
                dispatch(
                  handleField(
                    "apply",
                    `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.volumetricDetails.children.cardContent.children.activeDetails.children.volumetricWaterCharge`,
                    "visible",
                    false
                  )
                );

                dispatch(
                  handleField(
                    "apply",
                    `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.volumetricDetails.children.cardContent.children.activeDetails.children.dailyConsumption`,
                    "visible",
                    false 
                  )
                );
                dispatch(
                  handleField(
                    "apply",
                    `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.volumetricDetails.children.cardContent.children.activeDetails.children.consumptionInKL`,
                    "visible",
                    false 
                  )
                );

                dispatch(prepareFinalObject(
                  "applyScreen.additionalDetails.volumetricWaterCharge",""
                ))
                dispatch(prepareFinalObject(
                  "applyScreen.additionalDetails.isDailyConsumption",""
                ))
                dispatch(prepareFinalObject(
                  "applyScreen.additionalDetails.volumetricConsumtion",""
                ))
              }
            }
            else {
              dispatch(
                handleField(
                  "apply",
                  `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.activeDetails.children.isInstallmentApplicable`,
                  "visible",
                  false
                )
              );
              dispatch(
                handleField(
                  "apply",
                  `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.volumetricDetails`,
                  "visible",
                  false
                )
              );
              dispatch(
                handleField(
                  "apply",
                  `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.volumetricDetails`,
                  "visible",
                  false
                )
              );
            }
          }
        }
      }),
      volumetricWaterCharge: getTextField({
        label: {
          labelKey: "WS_VOLUMETRIC_CHARGE"
        },
        placeholder: {
          labelKey: "WS_VOLUMETRIC_CHARGE_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: true,
        pattern: /^[0-9]\d*(?:\.\d+)?$/,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "applyScreen.additionalDetails.volumetricWaterCharge",
        props: {disabled: process.env.REACT_APP_NAME === "Citizen"}
      }),
      dailyConsumption : {
        uiFramework: "custom-containers",
        componentPath: "RadioGroupContainer",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        jsonPath: "applyScreen.additionalDetails.isDailyConsumption",
        props: {
          label: {
            name: "Relationship",
            key: "WS_IS_DAILY_OR_MONTHLY_COMSUMPTION"

          },
        buttons: [
          {
            labelName: "WS_IS_DAILY_CONSUMPTION",
            labelKey: "WS_IS_DAILY_CONSUMPTION",
            value: "Y"
          },
          {
            label: "WS_IS_MONTHLY_CONSUMPTION",
            labelKey: "WS_IS_MONTHLY_CONSUMPTION",
            value: "N"
          }
        ],
        jsonPath: "applyScreen.additionalDetails.isDailyConsumption",
        required: true
        },
        required: true,
        type: "array"
      },
      consumptionInKL : getTextField({
        label: {
          labelKey: "WS_VOLUMETRIC_CONSUMPTION_IN_KL"
        },
        placeholder: {
          labelKey: "WS_VOLUMETRIC_CONSUMPTION_IN_KL_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: true,
        pattern: /^[0-9]\d*(?:\.\d+)?$/,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "applyScreen.additionalDetails.volumetricConsumtion",
        props: {disabled: process.env.REACT_APP_NAME === "Citizen"}
      })
    })
  }),
  paymentDetailsContainer : getCommonGrayCard({
    subHeader: getCommonTitle({
      labelKey: "WS_PAYMENT_DETAILS"
    }),
    activeDetails: getCommonContainer({
      isLabourFeeApplicable: getSelectField({
        label: { labelKey: "WS_LABOUR_FEE" },
        data: [{code:'Y',label:'Yes'},{code:'N',label:'No'}],
        optionValue: "code",
        optionLabel: "label",
        placeholder: { labelKey: "WS_LABOUR_FEE_PLACEHOLDER" },
        required: true,
        props: {disabled: process.env.REACT_APP_NAME === "Citizen"},
        gridDefination: { xs: 6, sm: 6 },
        jsonPath: "applyScreen.additionalDetails.isLabourFeeApplicable",
        afterFieldChange: async (action, state, dispatch) => {
          let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
          if(process.env.REACT_APP_NAME != 'Citizen' && !applicationNumber){
            dispatch(
              handleField(
              "apply",
              "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourTeen.children.reviewLaborCharge",
              "visible",
              true
            ));
            dispatch(
              handleField(
              "apply",
              "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourTeen",
              "visible",
              true
            ));
            dispatch(
              handleField(
              "apply",
              "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourTeen.children.reviewInstallment",
              "visible",
              true
            ));
          }
          if(process.env.REACT_APP_NAME !== "Citizen") {
            let connectionType = get(state, "screenConfiguration.preparedFinalObject.applyScreen.connectionType");
            if (connectionType === undefined || connectionType == "Non Metered" || connectionType == "Metered") {
              if(action && action.value && action.value === 'Y'){
                dispatch(
                  handleField(
                    "apply",
                    `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.activeDetails.children.isInstallmentApplicable`,
                    "visible",
                    true
                  )
                );
                dispatch(prepareFinalObject(
                  "applyScreen.additionalDetails.isInstallmentApplicable","N"
                ))
              }else{
                dispatch(
                  handleField(
                    "apply",
                    `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.activeDetails.children.isInstallmentApplicable`,
                    "visible",
                    false
                  )
                );
                dispatch(prepareFinalObject(
                  "applyScreen.additionalDetails.isInstallmentApplicable","N"
                ))
              }
            }
            else {
              dispatch(
                handleField(
                  "apply",
                  `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.activeDetails.children.isInstallmentApplicable`,
                  "visible",
                  false
                )
              );
            }
          }
        }
      }),
      isInstallmentApplicable: {
        uiFramework: "custom-containers",
        componentPath: "RadioGroupContainer",
        gridDefination: {
          xs: 6,
          sm: 6
        },
        jsonPath: "applyScreen.additionalDetails.isInstallmentApplicable",
        props: {
          value:'N',
          label: { name: "WS_FULL_PAYMENT_OR_INSTALLMENT", key: "WS_FULL_PAYMENT_OR_INSTALLMENT" },
          className: "applicant-details-error",
          buttons: [
            {
              disabled:true,
              labelName: "Male",
              labelKey: "WS_FULL_PAYMENT",
              value: "N"
            },
            {
              disabled:true,
              labelName: "FEMALE",
              labelKey: "WS_INSTALLMENT",
              value: "Y"
            }
          ],
          jsonPath: "applyScreen.additionalDetails.isInstallmentApplicable",
          required: true,
          errorMessage: "Required",
        },
        required: true,
        type: "array"
      }
    })
  }),

  modificationsEffectiveFrom : getCommonGrayCard({
    subHeader: getCommonTitle({
      labelKey: "WS_MODIFICATIONS_EFFECTIVE_FROM"
    }),
    modificationEffectiveDate: getCommonContainer({
      connectionExecutionDate: getDateField({
        label: { labelName: "Modifications Effective Date", labelKey: "MODIFICATIONS_EFFECTIVE_DATE" },
        gridDefination: {
          xs: 12,
          sm: 6
        },
        required: true,
        pattern: getPattern("Date"),
        errorMessage: "ERR_INVALID_DATE",
        jsonPath: "applyScreen.dateEffectiveFrom",
        props: {
          disabled: process.env.REACT_APP_NAME === "Citizen",
          inputProps: {
            //min: getTodaysDateInYMD()
            min: getCurrentDate()
          }
        }
      }),
      
    })
  })
});

const showHideFeilds = (dispatch, value) => {
  let mStep = (isModifyMode()) ? 'formwizardSecondStep' : 'formwizardThirdStep'; 
  dispatch(
    handleField(
      "apply",
      `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.activeDetails.children.isLabourFeeApplicable`,
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.activeDetails.children.isInstallmentApplicable`,
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.initialMeterReading`,
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterMake`,
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterReadingRatio`,
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterInstallationDate`,
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterID`,
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.activeDetails.children.isLabourFeeApplicable`,
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.activeDetails.children.isInstallmentApplicable`,
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.initialMeterReading`,
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterMake`,
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterReadingRatio`,
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterInstallationDate`,
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterID`,
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewInitialMeterReading",
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterMake",
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourTeen.children.reviewInstallment",
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourTeen.children.reviewLaborCharge",
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterRatio",
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterInstallationDate",
      "visible",
      value
    )
  );
  dispatch(
    handleField(
      "apply",
      "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterId",
      "visible",
      value
    )
  );
}