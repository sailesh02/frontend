import {
    getCommonCard,
    getCommonTitle,
    getTextField,
    getSelectField,
    getCommonContainer,
    getCommonParagraph,
    getPattern,
    getLabel,
    getDateField
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { updateTableRow } from "./bulkImportFunctions";
  import { resetFieldsBulkImport, getTodaysDateInYMD } from '../../utils';
  import { getMeterReadingDataBulkImport } from "../../../../../ui-utils/commons"
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { prepareFinalObject, toggleSpinner, showSpinner, hideSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getMdmsDataForMeterStatus,APPLICATIONSTATE, getMdmsDataForAutopopulatedBulk } from "../../../../../ui-utils/commons"
  import { getSearchResults, getMdmsDataForAutopopulated, isWorkflowExists } from "../../../../../ui-utils/commons"
  import get from "lodash/get";
  import set from "lodash/set";
  import { convertEpochToDate } from "../../utils";
  import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { sortpayloadDataObj } from '../connection-details'

  const getApplicationNo = (connectionsObj) => {
    let appNos = "";
    if(connectionsObj.length > 1){
      for(var i=0; i< connectionsObj.length; i++){
        appNos += connectionsObj[i].applicationNo +",";
      }
      appNos = appNos.slice(0,-1);
    }else{
      appNos = connectionsObj[0].applicationNo;
    }
    return appNos;
  }

  const setAutopopulatedvalues = async (state, dispatch,cardIndex) => {
    let billingFrequency = get(state, "screenConfiguration.preparedFinalObject.billingCycle");
    let consumptionDetails = {};
    let date = new Date();
    let status = get(state, "screenConfiguration.preparedFinalObject.meterMdmsData.['ws-services-calculation'].MeterStatus[0].code");
    let checkBillingPeriod = await get(state, `screenConfiguration.preparedFinalObject.consumptionDetails`);
    try {
        let lastReadingDate = convertEpochToDate(checkBillingPeriod[0].currentReadingDate);
        let lastDF = new Date();
        let endDate = ("0" + lastDF.getDate()).slice(-2) + '/' + ("0" + (lastDF.getMonth() + 1)).slice(-2) + '/' + lastDF.getFullYear()
        consumptionDetails['billingPeriod'] = lastReadingDate + " - " + endDate
        consumptionDetails['lastReading'] = checkBillingPeriod[0].currentReading
        consumptionDetails['consumption'] = ''
        consumptionDetails['lastReadingDate'] = lastReadingDate
    }catch (e) { 
        console.log(e);         
        dispatch(
            toggleSnackbar(
                true,
                {
                    labelName: "Failed to parse meter reading data.",
                    labelKey: "ERR_FAILED_TO_PARSE_METER_READING_DATA"
                },
                "warning"
            )
        );
        return;
    }

    let billingPeriod = consumptionDetails.billingPeriod
    let lastReading = consumptionDetails.lastReading
    let lastReadingDate = consumptionDetails.lastReadingDate
    let consumption = consumptionDetails.consumption

    dispatch(prepareFinalObject(`meterReading[${cardIndex}].billingPeriod`,billingPeriod ))
    dispatch(prepareFinalObject(`meterReading[${cardIndex}].lastReading`,lastReading ))
    dispatch(prepareFinalObject(`meterReading[${cardIndex}].lastReadingDate`,lastReadingDate ))
    dispatch(prepareFinalObject(`meterReading[${cardIndex}].consumption`,consumption ))
    dispatch(prepareFinalObject(`meterReading[${cardIndex}].meterStatus`,status ))
    dispatch(prepareFinalObject(`autoPopulatedValues`, consumptionDetails));

    dispatch(
      handleField(
        "bulkImport",
        "components.div.children.bulkImportApplication.children.cardContent.children.bulkImportContainer.children.billingPeriod",
        "props.value",
        billingPeriod
      )
    );
    dispatch(
      handleField(
        "bulkImport",
        "components.div.children.bulkImportApplication.children.cardContent.children.bulkImportContainer.children.consumption",
        "props.value",
        consumption
      )
    );
  
    dispatch(
      handleField(
        "bulkImport",
        "components.div.children.bulkImportApplication.children.cardContent.children.bulkImportContainer.children.lastReading",
        "props.value",
        lastReading
      )
    );
    dispatch(
      handleField(
        "bulkImport",
        "components.div.children.bulkImportApplication.children.cardContent.children.bulkImportContainer.children.lastReadingDate",
        "props.value",
        lastReadingDate
      )
    );
    dispatch(
      handleField(
        "bulkImport",
        "components.div.children.bulkImportApplication.children.cardContent.children.bulkImportContainer.children.meterStatus",
        "props.value",
        status
      )
    );

}

  const addMeterReading = async(state,dispatch,tenantId,connectionNo) => {
    dispatch(showSpinner());
    let queryObject = [{ key: "tenantId", value: tenantId }, { key: "connectionNumber", value: connectionNo },{ key: "searchType",value:"CONNECTION"}];
    let payloadData = await getSearchResults(queryObject);
    if (payloadData !== null && payloadData !== undefined && payloadData.WaterConnection.length > 0) {
        payloadData.WaterConnection = sortpayloadDataObj(payloadData.WaterConnection);
        let applicationNos = getApplicationNo(payloadData.WaterConnection);
        const queryObj = [
            { key: "businessIds", value: applicationNos },
            { key: "tenantId", value: tenantId }
        ];        

        // let isApplicationApproved = await isWorkflowExists(queryObj);
        // let isApplicationApproved = payloadData.WaterConnection[0].applicationStatus === APPLICATIONSTATE.CONNECTIONACTIVATED &&
        // payloadData.WaterConnection[0].status === APPLICATIONSTATE.STATUS ? true : false

        let arraySize = payloadData.WaterConnection.length;
        let isApplicationApproved;
        if(arraySize === 1){
            isApplicationApproved = payloadData.WaterConnection[0].applicationStatus === APPLICATIONSTATE.CONNECTIONACTIVATED &&
                payloadData.WaterConnection[0].status === APPLICATIONSTATE.STATUS ? true : false
        }else if(arraySize > 1){
            isApplicationApproved = payloadData.WaterConnection[0].applicationStatus === APPLICATIONSTATE.APPROVED &&
                payloadData.WaterConnection[0].status === APPLICATIONSTATE.STATUS ? true : false
        }

        if(payloadData.WaterConnection && (payloadData.WaterConnection[0].applicationStatus == "CONNECTION_DISCONNECTED" 
        || payloadData.WaterConnection[0].applicationStatus == "CONNECTION_CLOSED")){
            dispatch(hideSpinner());
            dispatch(
                toggleSnackbar(
                    true,
                    {
                        labelName: "Meter Reading cannot be added as the connection is either disconnected or closed",
                        labelKey: "Meter Reading cannot be added as the connection is either disconnected or closed"
                    },
                    "error"
                )
            );
            return;
        }
        else if(!isApplicationApproved){
            dispatch(hideSpinner());
            dispatch(
                toggleSnackbar(
                    true,
                    {
                        labelName: "WorkFlow already Initiated",
                        labelKey: "WS_WORKFLOW_ALREADY_INITIATED"
                    },
                    "error"
                )
            );
            return;
        } else {
            await getMdmsDataForAutopopulatedBulk(dispatch,connectionNo)
            await setAutopopulatedvalues(state, dispatch,0)
        }

    }  
    dispatch(hideSpinner());
  }

  const getMeterReadingDetails = async (state, dispatch) => {
    try {
      const connectionNo = get(
        state.screenConfiguration.preparedFinalObject,
        `meterReading[0].connectionNo`,
        ""
      );

      let queryObj = [
        {
            key: "tenantId",
            value: `${localStorage.getItem('tenant-id')}`
        },
        {
            key: "connectionNos",
            value: connectionNo
        },
        { key: "offset", value: "0" }
    ];

      await getMeterReadingDataBulkImport(dispatch,queryObj)
      dispatch(showSpinner());
      await addMeterReading(state,dispatch,localStorage.getItem('tenant-id'),connectionNo)
    } catch (e) {
      dispatch(
        toggleSnackbar(
          true,
          { labelName: e.message, labelKey: e.message },
          "info"
        )
      );
    }
  };
  
  export const bulkImportApplication = getCommonCard({
    bulkImportContainer: getCommonContainer({
      consumerNumber: getTextField({
        label: {
          labelName: "Consumer No.",
          labelKey: "WS_CONSUMER_NUMBER"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Consumer No.",
          labelKey: "WS_CONSUMER_NUMBER"
        },
        gridDefination: {
          xs: 12,
          sm: 3
        },
        // required: true,
        jsonPath: "meterReading[0].connectionNo",
        iconObj: {
          iconName: "search",
          position: "end",
          color: "#FE7A51",
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch, fieldInfo) => {
              getMeterReadingDetails(state, dispatch, fieldInfo);
            }
          }
        },
        title: {
          value: "WS_CONSUMER_SEARCH_TOOLTIP",
          key: "WS_CONSUMER_SEARCH_TOOLTIP"
        },
        infoIcon: "info_circle"
      }),
      billingPeriod: getTextField({
        label: {
          labelName: "WS_BILLING_PERIOD",
          labelKey: "WS_BILLING_PERIOD"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "WS_BILLING_PERIOD",
          labelKey: "WS_BILLING_PERIOD_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 3
        },
        // required: true,
        disabled:true,
        jsonPath: "meterReading[0].billingPeriod"
      }),
      meterStatus:
      {
          ...getSelectField({
              label : {
                labelKey: "WS_SELECT_METER_STATUS"
              },
              placeholder: {
                  labelKey: "WS_SELECT_METER_STATUS_PLACEHOLDER"
              },
              labelPrefix: {
                  moduleName: "ws-services-calculation",
                  masterName: "MeterStatus"
              },
              sourceJsonPath: "meterMdmsData['ws-services-calculation'].MeterStatus",
              jsonPath: "meterReading[0].meterStatus",
              gridDefination: {
                  xs: 6,
                  sm: 3
              },
              // required: true,              
              errorMessage: "ERR_INVALID_BILLING_PERIOD",
          }),
          // afterFieldChange: async (action, state, dispatch) => {
          //     let status = get(state, "screenConfiguration.preparedFinalObject.metereading.meterStatus");
          //     if (status !== 'Working') {
          //         dispatch(
          //             handleField(
          //                 "meter-reading",
          //                 "components.div.children.meterReadingEditable.children.card.children.cardContent.children.fourthContainer.children.currentReading.props",
          //                 "disabled",
          //                 true
          //             )
          //         );
          //         dispatch(
          //             handleField(
          //                 "meter-reading",
          //                 "components.div.children.meterReadingEditable.children.card.children.cardContent.children.fifthContainer.children.currentReadingDate.props",
          //                 "disabled",
          //                 true
          //             )
          //         );
          //         dispatch(
          //             handleField(
          //                 "meter-reading",
          //                 "components.div.children.meterReadingEditable.children.card.children.cardContent.children.sixthContainer.children.secCont",
          //                 "visible",
          //                 false
          //             )
          //         );
          //         dispatch(
          //             handleField(
          //                 "meter-reading",
          //                 "components.div.children.meterReadingEditable.children.card.children.cardContent.children.sixthContainer.children.thirdCont",
          //                 "visible",
          //                 true
          //             )
          //         );
          //         dispatch(
          //             handleField(
          //                 "meter-reading",
          //                 "components.div.children.meterReadingEditable.children.card.children.cardContent.children.sixthContainer.children.thirdCont",
          //                 "visible",
          //                 true
          //             )
          //         );
          //         dispatch(
          //             handleField(
          //                 "meter-reading",
          //                 "components.div.children.meterReadingEditable.children.card.children.cardContent.children.fifthContainer.children.currentReadingDate.props",
          //                 "value",
          //                 ""
          //             )
          //         );
          //         dispatch(
          //             handleField(
          //                 "meter-reading",
          //                 "components.div.children.meterReadingEditable.children.card.children.cardContent.children.fourthContainer.children.currentReading.props",
          //                 "value",
          //                 ""
          //             )
          //         );
          //         dispatch(
          //             handleField(
          //                 "meter-reading",
          //                 "components.div.children.meterReadingEditable.children.card.children.cardContent.children.sixthContainer.children.secCont.children.billingPeriod.props",
          //                 "labelName",
          //                 ""
          //             )
          //         );
          //         dispatch(
          //             handleField(
          //                 "meter-reading",
          //                 "components.div.children.meterReadingEditable.children.card.children.cardContent.children.sixthContainer.children.thirdCont.props",
          //                 "value",
          //                 ""
          //             )
          //         );
          //     } else {
          //         dispatch(
          //             handleField(
          //                 "meter-reading",
          //                 "components.div.children.meterReadingEditable.children.card.children.cardContent.children.fourthContainer.children.currentReading.props",
          //                 "disabled",
          //                 false
          //             )
          //         );
          //         dispatch(
          //             handleField(
          //                 "meter-reading",
          //                 "components.div.children.meterReadingEditable.children.card.children.cardContent.children.fifthContainer.children.currentReadingDate.props",
          //                 "disabled",
          //                 false
          //             )
          //         );
          //         dispatch(
          //             handleField(
          //                 "meter-reading",
          //                 "components.div.children.meterReadingEditable.children.card.children.cardContent.children.sixthContainer.children.secCont",
          //                 "visible",
          //                 true
          //             )
          //         );
          //         dispatch(
          //             handleField(
          //                 "meter-reading",
          //                 "components.div.children.meterReadingEditable.children.card.children.cardContent.children.sixthContainer.children.thirdCont",
          //                 "visible",
          //                 false
          //             )
          //         );
          //         let todayDate = new Date()
          //         dispatch(
          //             handleField(
          //                 "meter-reading",
          //                 "components.div.children.meterReadingEditable.children.card.children.cardContent.children.fifthContainer.children.currentReadingDate.props",
          //                 "value",
          //                 todayDate
          //             )
          //         );
          //         dispatch(
          //             handleField(
          //                 "meter-reading",
          //                 "components.div.children.meterReadingEditable.children.card.children.cardContent.children.fourthContainer.children.currentReading.props",
          //                 "value",
          //                 ""
          //             )
          //         );
          //         dispatch(
          //             handleField(
          //                 "meter-reading",
          //                 "components.div.children.meterReadingEditable.children.card.children.cardContent.children.sixthContainer.children.thirdCont.props",
          //                 "value",
          //                 ""
          //             )
          //         );
          //         dispatch(
          //             handleField(
          //                 "meter-reading",
          //                 "components.div.children.meterReadingEditable.children.card.children.cardContent.children.sixthContainer.children.secCont.children.billingPeriod.props",
          //                 "labelName",
          //                 ""
          //             )
          //         );
          //     }
  
          // }
      },
      lastReadingDate: {
        ...getTextField({
          label: {
            labelName: "WS_LAST_READING_DATE",
            labelKey: "WS_LAST_READING_DATE"
          },
          placeholder: {
            labelName: "WS_LAST_READING_DATE",
            labelKey: "WS_LAST_READING_DATE_PLACEHOLDER"
          },
          gridDefination: {
            xs: 12,
            sm: 3
          },
          disabled:true,
          // required: true,
          jsonPath: "meterReading[0].lastReadingDate",
        })
      },
      lastReading: getTextField({
        disabled:true,
        label: {
          labelName: "WS_LAST_READING",
          labelKey: "WS_LAST_READING"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "WS_LAST_READING",
          labelKey: "WS_LAST_READING_DATE_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 3
        },
        // required: true,
        jsonPath: "meterReading[0].lastReading"
      }),
      currentReading: getTextField({
        label: {
          labelName: "WS_CURRENT_READING",
          labelKey: "WS_CURRENT_READING"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "WS_CURRENT_READING",
          labelKey: "WS_CURRENT_READING_PLACEHOLDER"
        },
        gridDefination: {
          xs: 12,
          sm: 3
        },
        // required: true,
        jsonPath: "meterReading[0].currentReading",
        afterFieldChange: async (action, state, dispatch) => {
            let lastReading = get(state, `screenConfiguration.preparedFinalObject.autoPopulatedValues.lastReading`);
            let currentReading = Number(get(state, `screenConfiguration.preparedFinalObject.meterReading[0].currentReading`));
            let consumption;
            if (lastReading === 0) {
                consumption = currentReading
            } else {
                consumption = (currentReading - lastReading).toFixed(2);
            }
            if (currentReading == '' || consumption < 0) {
                consumption = ''
            }
           dispatch(prepareFinalObject(`meterReading[0].consumption`, consumption))
           dispatch(
            handleField(
              "bulkImport",
              "components.div.children.bulkImportApplication.children.cardContent.children.bulkImportContainer.children.consumption",
              "props.value",
              consumption
            )
          );
        }
      }),
      consumption: getTextField({
        disabled:true,
        label: {
          labelName: "WS_CONSUMPTION",
          labelKey: "WS_CONSUMPTION"
        },
        props:{
          className:"applicant-details-error"
        },
        gridDefination: {
          xs: 12,
          sm: 3
        },
        // required: true,
        placeholder: {
          labelName: "WS_CONSUMPTION",
          labelKey: "WS_CONSUMPTION"
        },
        jsonPath: "meterReading[0].consumption"
      }),
      currentReadingDate: {
        ...getDateField({
          label: {
            labelName: "WS_CURRENT_READING_DATE",
            labelKey: "WS_CURRENT_READING_DATE"
          },
          placeholder: {
            labelName: "WS_CURRENT_READING_DATE",
            labelKey: "WS_CURRENT_READING_DATE_PLACEHOLDER"
          },
          // required: true,
          isDOB: true,
          gridDefination: {
            xs: 12,
            sm: 3
          },
          jsonPath: "meterReading[0].currentReadingDate",
          props: {
            inputProps: {
              max: getTodaysDateInYMD()
            }
          }
        })
      }
    }),
  
    button: getCommonContainer({
      buttonContainer: getCommonContainer({
        resetButton: {
          componentPath: "Button",
          gridDefination: {
            xs: 12,
            sm: 6
            // align: "center"
          },
          props: {
            variant: "outlined",
            style: {
              color: "rgba(0, 0, 0, 0.6000000238418579)",
              borderColor: "rgba(0, 0, 0, 0.6000000238418579)",
              width: "220px",
              height: "48px",
              margin: "8px",
              float: "right"
            }
          },
          children: {
            buttonLabel: getLabel({
              labelKey: "WS_SEARCH_CONNECTION_RESET_BUTTON"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: resetFieldsBulkImport
          }
        },
        searchButton: {
          componentPath: "Button",
          gridDefination: {
            xs: 12,
            sm: 6,
            // align: "center"
          },
          props: {
            variant: "contained",
            style: {
              color: "white",
              margin: "8px",
              backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
              borderRadius: "2px",
              width: "220px",
              height: "48px"
            }
          },
          children: {
            buttonLabel: getLabel({
              labelKey: "WS_ADD_READING_BUTTON"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: updateTableRow
          }
        },
      })
    })
  });