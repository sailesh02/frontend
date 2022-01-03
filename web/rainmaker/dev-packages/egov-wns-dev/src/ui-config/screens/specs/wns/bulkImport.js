// import { fetchData } from "./myConnectionDetails/myConnectionDetails";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg,getTodaysDateInYMD, getMaxDate } from "egov-ui-framework/ui-utils/commons";
import { handleScreenConfigurationFieldChange as handleField, initScreen, prepareFinalObject, toggleSnackbar, showSpinner,hideSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { getMeterReadingDataBulkImport } from "../../../../ui-utils/commons"
import { getMdmsDataForMeterStatus,APPLICATIONSTATE } from "../../../../ui-utils/commons"
import { sortpayloadDataObj } from './connection-details'
import { convertEpochToDate } from "../utils";

import {
    getCommonCard,
    getCommonGrayCard,
    getCommonTitle,
    getCommonSubHeader,
    getTextField,
    getSelectField,
    getCommonContainer,
    getDateField,
    getPattern
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { getSearchResults, getMdmsDataForAutopopulatedBulk, isWorkflowExists } from "../../../../ui-utils/commons"

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
    let checkBillingPeriod = await get(state, `screenConfiguration.preparedFinalObject.consumptionDetails[${cardIndex}]`);
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

    // dispatch(
    //     handleField(
    //         "meter-reading",
    //         "components.div.children.meterReadingEditable.children.card.children.cardContent.children.firstContainer.children.billingCont.children.billingPeriod.props",
    //         "labelName",
    //         consumptionDetails.billingPeriod
    //     )
    // );
    // dispatch(
    //     handleField(
    //         "meter-reading",
    //         "components.div.children.meterReadingEditable.children.card.children.cardContent.children.thirdContainer.children.secCont.children.billingPeriod.props",
    //         "labelName",
    //         consumptionDetails.lastReading
    //     )
    // );
    // dispatch(
    //     handleField(
    //         "meter-reading",
    //         "components.div.children.meterReadingEditable.children.card.children.cardContent.children.lastReadingContainer.children.secCont.children.billingPeriod.props",
    //         "labelName",
    //         consumptionDetails.lastReadingDate
    //     )
    // );
    // dispatch(
    //     handleField(
    //         "meter-reading",
    //         "components.div.children.meterReadingEditable.children.card.children.cardContent.children.sixthContainer.children.secCont.children.billingPeriod.props",
    //         "labelName",
    //         consumptionDetails.consumption
    //     )
    // );
    // dispatch(
    //     handleField(
    //         "meter-reading",
    //         "components.div.children.meterReadingEditable.children.card.children.cardContent.children.secondContainer.children.status.props",
    //         "value",
    //         status
    //     )
    // );
    // let todayDate = new Date()
    // dispatch(
    //     handleField(
    //         "meter-reading",
    //         "components.div.children.meterReadingEditable.children.card.children.cardContent.children.fifthContainer.children.currentReadingDate.props",
    //         "value",
    //         todayDate
    //     )
    // );
    dispatch(prepareFinalObject(`autoPopulatedValues[${cardIndex}]`, consumptionDetails));

}

  const addMeterReading = async(state,dispatch,cardIndex,tenantId,connectionNo) => {
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
            await getMdmsDataForAutopopulatedBulk(dispatch,cardIndex)
            await setAutopopulatedvalues(state, dispatch,cardIndex)
        }

    }  
    dispatch(hideSpinner());
  }
  const getMeterReadingDetails = async (state, dispatch, fieldInfo) => {
    try {
      const cardIndex = fieldInfo && fieldInfo.index ? fieldInfo.index : "0";
      const connectionNo = get(
        state.screenConfiguration.preparedFinalObject,
        `meterReading[${cardIndex}].connectionNo`,
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

      await getMeterReadingDataBulkImport(dispatch,queryObj,cardIndex)
      dispatch(showSpinner());
      await addMeterReading(state,dispatch,cardIndex,localStorage.getItem('tenant-id'),connectionNo)
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

const header = getCommonHeader(
  {
    labelKey: "WS_MYCONNECTIONS_HEADER"
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);

const getData = async (action, state, dispatch) => {
  await getMdmsDataForMeterStatus(dispatch)
}

const screenConfig = {
  uiFramework: "material-ui",
  name: "bulkImport",
  beforeInitScreen: (action, state, dispatch) => {
    getData(action, state, dispatch).then(() => {
    });
    return action;
  },
  // components: {
  //   div: {
  //     uiFramework: "custom-atoms",
  //     componentPath: "Div",
  //     props: {
  //       // className: "common-div-css"
  //     },
  //     children: {
  //       header: header,
  //       applicationsCard: {
  //         uiFramework: "custom-molecules-local",
  //         moduleName: "egov-wns",
  //         componentPath: "BulkImport"
  //       }
  //     }
  //   }
  // }
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        // className: "common-div-css"
      },
      children: {
        header: header,
        applicationsCard: {
            uiFramework: "custom-containers",
            componentPath: "MultiItem",
            props: {
              scheama: getCommonGrayCard({
                header: getCommonSubHeader(
                  {
                    labelName: "WS_BULK_METER_READING_INFO",
                    labelKey: "WS_BULK_METER_READING_INFO"
                  },
                  {
                    style: {
                      marginBottom: 18
                    }
                  }
                ),
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
                    required: true,
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
                    required: true,
                    disabled:true,
                    jsonPath: "meterReading[0].billingPeriod"
                  }),
                  meterStatus:
                  {
                      ...getSelectField({
                          placeholder: {
                              labelKey: "WS_SELECT_METER_STATUS_PLACEHOLDER"
                          },
                          labelPrefix: {
                              moduleName: "ws-services-calculation",
                              masterName: "MeterStatus"
                          },
                          props: {
                              value: "",
                          },
                          sourceJsonPath: "meterMdmsData['ws-services-calculation'].MeterStatus",
                          jsonPath: "meterReading[0].meterStatus",
                          gridDefination: {
                              xs: 6,
                              sm: 3
                          },
                          required: false,
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
                      required: true,
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
                    required: true,
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
                    required: true,
                    jsonPath: "meterReading[0].currentReading"
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
                      required: true,
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
                  },
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
                    placeholder: {
                      labelName: "WS_CONSUMPTION",
                      labelKey: "WS_CONSUMPTION"
                    },
                    jsonPath: "meterReading[0].consumption"
                  })
                })
              }),
              items: [],
              addItemLabel: {
                labelName: "ADD READING",
                labelKey: "WS_ADD_NEW_READING"
              },
              headerName: "Owner Information",
              headerJsonPath:
                "children.cardContent.children.header.children.Owner Information.props.label",
              sourceJsonPath: "meterReading",
              prefixSourceJsonPath:
                "children.cardContent.children.bulkImportContainer.children"
            },
          
            type: "array"
        }
      }
    }
  }
};

export default screenConfig;
