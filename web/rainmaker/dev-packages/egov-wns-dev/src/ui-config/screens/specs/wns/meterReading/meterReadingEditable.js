import {
    getCommonCard,
    getTextField,
    getSelectField,
    getCommonContainer,
    getPattern,
    getDateField,
    getLabel,
    convertDateToEpoch
} from "egov-ui-framework/ui-config/screens/specs/utils";
import get from "lodash/get";
import set from "lodash/set";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { validateFields } from "../../utils";
import { toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";

import { createMeterReading,UpdateMeterReading } from "../../../../../ui-utils/commons"
import {
    getQueryArg
} from "egov-ui-framework/ui-utils/commons";

const saveData = async (state, dispatch) => {
    let data = get(state, "screenConfiguration.preparedFinalObject.metereading");
    if (data === undefined || data === null || data === []) {
        dispatch(
            toggleSnackbar(
                true,
                {
                    labelName: "Please fill valid fields to start search",
                    labelKey: "ERR_FILL_VALID_FIELDS"
                },
                "warning"
            )
        );
        return;
    }

    data.billingPeriod = get(state, "screenConfiguration.preparedFinalObject.autoPopulatedValues.billingPeriod");
    
    // Validation for Billing Period
    if(data.billingPeriod !== undefined){
        if(!data.currentReadingDate){
            data.currentReadingDate = new Date().getTime()
        }
        var selectedDate = new Date(new Date(data.currentReadingDate).toDateString());
        let fromDate = new Date(data.billingPeriod.split(' - ')[0].replace(/(\d{2})\/(\d{2})\/(\d{4})/,"$2/$1/$3"));
        let toDate = new Date(new Date().toDateString());
        //console.log("*****************************");
        //console.log( "CurrentReadingDate -> " + selectedDate+ ", FromDate -> " + fromDate + ", ToDate-> " + toDate);
        if(!(selectedDate > fromDate && selectedDate <= toDate))
        {
            dispatch(
                toggleSnackbar(
                    true,
                    {
                        labelName: "Reading date should not be less than from date and not be greater than to date",
                        labelKey: "ERR_CURRENT_READING_DATE_SHOULD_NOT_BE_LESS_THAN_FROM_DATE_AND_NOT_GREATER_THAN_TO_DATE"
                    },
                    "warning"
                )
            );
            return;
        }
        let endDate = ("0" + selectedDate.getDate()).slice(-2) + '/' + ("0" + (selectedDate.getMonth() + 1)).slice(-2) + '/' + selectedDate.getFullYear()
        data.billingPeriod = data.billingPeriod.split(' - ')[0] + " - " + endDate  
    }

    if (!data.meterStatus) {
        data.meterStatus = get(state, "screenConfiguration.preparedFinalObject.meterMdmsData.['ws-services-calculation'].MeterStatus[0].code");
    }
    data.connectionNo = getQueryArg(window.location.href, "connectionNos")
    data.lastReading = get(state, "screenConfiguration.preparedFinalObject.autoPopulatedValues.lastReading");
    data.billingPeriod = get(state, "screenConfiguration.preparedFinalObject.autoPopulatedValues.billingPeriod");

    // Validation for Billing Period
    if(data.billingPeriod !== undefined){
        if(!data.currentReadingDate){
            data.currentReadingDate = new Date().getTime()
        }
        var selectedDate = new Date(new Date(data.currentReadingDate).toDateString());
        let fromDate = new Date(data.billingPeriod.split(' - ')[0].replace(/(\d{2})\/(\d{2})\/(\d{4})/,"$2/$1/$3"));
        let toDate = new Date(new Date().toDateString());
        //console.log("*****************************");
        //console.log( "CurrentReadingDate -> " + selectedDate+ ", FromDate -> " + fromDate + ", ToDate-> " + toDate);
        if(!(selectedDate > fromDate && selectedDate <= toDate))
        {
            dispatch(
                toggleSnackbar(
                    true,
                    {
                        labelName: "Reading date should not be less than from date and not be greater than to date",
                        labelKey: "ERR_CURRENT_READING_DATE_SHOULD_NOT_BE_LESS_THAN_FROM_DATE_AND_NOT_GREATER_THAN_TO_DATE"
                    },
                    "warning"
                )
            );
            return;
        }
        let endDate = ("0" + selectedDate.getDate()).slice(-2) + '/' + ("0" + (selectedDate.getMonth() + 1)).slice(-2) + '/' + selectedDate.getFullYear()
        data.billingPeriod = data.billingPeriod.split(' - ')[0] + " - " + endDate  
    }



    let lastReadingDate = get(state, "screenConfiguration.preparedFinalObject.consumptionDetails[0].lastReadingDate")
    // console.log(lastReadingDate, "lastReadingDate")
    if (lastReadingDate !== undefined && lastReadingDate !== null && lastReadingDate !== '') {
        data.lastReadingDate = get(state, "screenConfiguration.preparedFinalObject.consumptionDetails[0].currentReadingDate");
    } else {
        data.lastReadingDate = new Date().setMonth(new Date().getMonth() - 1);
    }
    if (data.meterStatus === 'Working') {
        const isCurrentMeterValid = validateFields(
            "components.div.children.meterReadingEditable.children.card.children.cardContent.children.fourthContainer.children",
            state,
            dispatch,
            "meter-reading"
        );
        const isDateValid = validateFields(
            "components.div.children.meterReadingEditable.children.card.children.cardContent.children.fifthContainer.children",
            state,
            dispatch,
            "meter-reading"
        );
        if (data.currentReading === undefined || data.currentReading === null || data.currentReading === '') {
            return;
        }
        if (data.currentReading < data.lastReading) {
            dispatch(
                toggleSnackbar(
                    true,
                    {
                        labelName: "",
                        labelKey: "WS_CONSUMPTION_DETAILS_ERRO_MSG"
                    },
                    "warning"
                )
            );
            return;
        }
    } else {
        const consumption = validateFields(
            "components.div.children.meterReadingEditable.children.card.children.cardContent.children.sixthContainer.children",
            state,
            dispatch,
            "meter-reading"
        );
        // console.log(data.consumption, consumption)
        if (data.consumption === undefined || data.currentReading === null || data.consumption === '') {
            return;
        }
        let previousreading = get(state, "screenConfiguration.preparedFinalObject.autoPopulatedValues.lastReading");
        data.currentReading = parseFloat(data.consumption) + previousreading;
        data.currentReadingDate = new Date().getTime()
    }
    set(data,
        "currentReadingDate",
        convertDateToEpoch(data.currentReadingDate, "dayend")
    );
    data.currentReading = parseFloat(data.currentReading)
    if (data.consumption) {
        delete data.consumption
    }
    // console.log(data)
    data.tenantId = getQueryArg(window.location.href, "tenantId")
    console.log(data,"data")
    createMeterReading(dispatch, data)

}
const UpdateCurrentReading = async (state, dispatch)=>{
console.log("updated")

let data = get(state, "screenConfiguration.preparedFinalObject.metereading");
// let editVisiable =   get(state.screenConfiguration, "screenConfig.meter-reading.components.div.children.meterReadingEditable.children.card.children.cardContent.children.button.children.buttonContainer.children.editButton.visible");
// if(editVisiable == true){

// }
// "id": "35cc1cd5-3f9c-4a66-83b8-484e776ec695",
// "tenantId": "od.cuttack",
// "connectionNo": "WS/CTC/029627",
// "billingPeriod": "16/12/2021 - 19/01/2022",
// "meterStatus": "Working",
// "lastReading": 201,
// "lastReadingDate": "1639679399000",
// "currentReading": 251,
// "currentReadingDate": "1642616999000",
// "consumption": 50
// data.tenantId = getQueryArg(window.location.href, "tenantId")
// data.connectionNo = getQueryArg(window.location.href, "connectionNos")
// // data['currentReadingDate'] = data
// data["id"] = Alldata[0].id
// data["billingPeriod"] = Alldata[0].billingPeriod
data["lastReadingDate"] = convertDateToEpoch(data.lastReadingDate)
// data["meterStatus"] =Alldata[0].meterStatus
// data["lastReading"] = Alldata[0].lastReading
// data["currentReadingDate"] = convertDateToEpoch(Alldata[0].currentReadingDate)
// data["consumption"] = ""

// console.log( convertDateToEpoch(data.lastReadingDate), "uuuuuuuuuuuuuuuuuuuuuuuuuuuuuu")
UpdateMeterReading(dispatch, data)


}

const cancleData = async (state, dispatch)=>{
    dispatch(
        handleField(
            "meter-reading",
            "components.div.children.meterReadingEditable",
            "visible",
            false
        )
    )
    dispatch(
        handleField(
            "meter-reading",
            "components.div.children.meterReadingEditable.children.card.children.cardContent.children.button.children.buttonContainer.children.searchButton",
            "visible",
            true
          )
    )
    
    dispatch(
        handleField(
            "meter-reading",
            "components.div.children.meterReadingEditable.children.card.children.cardContent.children.button.children.buttonContainer.children.editButton",
            "visible",
            false
          )
    )
    dispatch(
        handleField(
            "meter-reading",
            "components.div.children.meterReadingEditable.children.card.children.cardContent.children.button.children.buttonContainer.children.cancleButton",
            "visible",
            false
          )
    )
}

console.log('meterReadingEditable  is coming')

export const meterReadingEditable =
{
    
    uiFramework: "custom-atoms",
    moduleName: "egov-wns",
    componentPath: "Div",
    visible: false,
    props: {
        style: {
            margin: '7px'
        }
    },
    children: {
        card: getCommonCard({
            firstContainer: getCommonContainer({
                firstCont: {
                    uiFramework: "custom-atoms",
                    componentPath: "Div",
                    gridDefination: {
                        xs: 6,
                        sm: 3
                    },
                    props: {
                        style: {
                            fontSize: 14,
                            color: "rgba(0, 0, 0, 0.60)",
                            marginTop: '20px'

                        }
                    },
                    children: {
                        billingPeriod: getLabel({
                            labelKey: "WS_CONSUMPTION_DETAILS_BILLING_PERIOD_LABEL"
                        })
                    },
                },
                billingCont: {
                    uiFramework: "custom-atoms",
                    componentPath: "Div",
                    gridDefination: {
                        xs: 6,
                        sm: 3
                    },
                    props: {
                        style: {
                            fontSize: 14,
                            color: "rgba(0, 0, 0)",
                            marginTop: '20px'
                        }
                    },
                    children: {
                        billingPeriod: getLabel({
                            labelName: ""
                        })
                    },
                },
                lastCont: {
                    uiFramework: "custom-atoms",
                    componentPath: "Div",
                    gridDefination: {
                        xs: 6,
                        sm: 7
                    }
                }

            }),
            secondContainer: getCommonContainer({
                firstCont: {
                    uiFramework: "custom-atoms",
                    componentPath: "Div",
                    gridDefination: {
                        xs: 6,
                        sm: 3
                    },
                    props: {
                        style: {
                            fontSize: 14,
                            color: "rgba(0, 0, 0, 0.60)",
                            marginTop: '20px'
                        }
                    },
                    children: {
                        billingPeriod: getLabel({
                            labelKey: "WS_CONSUMPTION_DETAILS_METER_STATUS_LABEL"
                        })
                    },
                },
                secCont: {
                    uiFramework: "custom-atoms",
                    componentPath: "Div",
                    gridDefination: {
                        xs: 6,
                        sm: 3
                    },
                    props: {
                        style: {
                            fontSize: 14,
                            color: "rgba(0, 0, 0)",
                            marginTop: '20px'
                        }
                    },
                    children: {
                        billingPeriod: getLabel({
                            labelName: ""
                        })
                    },
                },
                status:
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
                        jsonPath: "metereading.meterStatus",
                        gridDefination: {
                            xs: 6,
                            sm: 3
                        },
                        required: false,
                        errorMessage: "ERR_INVALID_BILLING_PERIOD",
                    }),
                    afterFieldChange: async (action, state, dispatch) => {
                        let status = get(state, "screenConfiguration.preparedFinalObject.metereading.meterStatus");
                        if (status !== 'Working') {
                            dispatch(
                                handleField(
                                    "meter-reading",
                                    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.fourthContainer.children.currentReading.props",
                                    "disabled",
                                    true
                                )
                            );
                            dispatch(
                                handleField(
                                    "meter-reading",
                                    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.fifthContainer.children.currentReadingDate.props",
                                    "disabled",
                                    true
                                )
                            );
                            dispatch(
                                handleField(
                                    "meter-reading",
                                    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.sixthContainer.children.secCont",
                                    "visible",
                                    false
                                )
                            );
                            dispatch(
                                handleField(
                                    "meter-reading",
                                    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.sixthContainer.children.thirdCont",
                                    "visible",
                                    true
                                )
                            );
                            dispatch(
                                handleField(
                                    "meter-reading",
                                    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.sixthContainer.children.thirdCont",
                                    "visible",
                                    true
                                )
                            );
                            dispatch(
                                handleField(
                                    "meter-reading",
                                    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.fifthContainer.children.currentReadingDate.props",
                                    "value",
                                    ""
                                )
                            );
                            dispatch(
                                handleField(
                                    "meter-reading",
                                    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.fourthContainer.children.currentReading.props",
                                    "value",
                                    ""
                                )
                            );
                            dispatch(
                                handleField(
                                    "meter-reading",
                                    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.sixthContainer.children.secCont.children.billingPeriod.props",
                                    "labelName",
                                    ""
                                )
                            );
                            dispatch(
                                handleField(
                                    "meter-reading",
                                    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.sixthContainer.children.thirdCont.props",
                                    "value",
                                    ""
                                )
                            );
                        } else {
                            dispatch(
                                handleField(
                                    "meter-reading",
                                    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.fourthContainer.children.currentReading.props",
                                    "disabled",
                                    false
                                )
                            );
                            dispatch(
                                handleField(
                                    "meter-reading",
                                    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.fifthContainer.children.currentReadingDate.props",
                                    "disabled",
                                    false
                                )
                            );
                            dispatch(
                                handleField(
                                    "meter-reading",
                                    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.sixthContainer.children.secCont",
                                    "visible",
                                    true
                                )
                            );
                            dispatch(
                                handleField(
                                    "meter-reading",
                                    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.sixthContainer.children.thirdCont",
                                    "visible",
                                    false
                                )
                            );
                            let todayDate = new Date()
                            dispatch(
                                handleField(
                                    "meter-reading",
                                    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.fifthContainer.children.currentReadingDate.props",
                                    "value",
                                    todayDate
                                )
                            );
                            dispatch(
                                handleField(
                                    "meter-reading",
                                    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.fourthContainer.children.currentReading.props",
                                    "value",
                                    ""
                                )
                            );
                            dispatch(
                                handleField(
                                    "meter-reading",
                                    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.sixthContainer.children.thirdCont.props",
                                    "value",
                                    ""
                                )
                            );
                            dispatch(
                                handleField(
                                    "meter-reading",
                                    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.sixthContainer.children.secCont.children.billingPeriod.props",
                                    "labelName",
                                    ""
                                )
                            );
                        }

                    }
                },


                lastCont: {
                    uiFramework: "custom-atoms",
                    componentPath: "Div",
                    gridDefination: {
                        xs: 6,
                        sm: 7
                    }
                }

            }),
            thirdContainer: getCommonContainer({
                firstCont: {
                    uiFramework: "custom-atoms",
                    componentPath: "Div",
                    gridDefination: {
                        xs: 6,
                        sm: 3
                    },
                    props: {
                        style: {
                            fontSize: 14,
                            color: "rgba(0, 0, 0, 0.60)",
                            marginTop: '20px'
                        }
                    },
                    children: {
                        billingPeriod: getLabel({
                            labelKey: "WS_CONSUMPTION_DETAILS_LAST_READING_LABEL"
                        })
                    },
                },
                secCont: {
                    uiFramework: "custom-atoms",
                    componentPath: "Div",
                    gridDefination: {
                        xs: 6,
                        sm: 3
                    },
                    props: {
                        style: {
                            fontSize: 14,
                            color: "rgba(0, 0, 0)",
                            marginTop: '20px'
                        }
                    },
                    children: {
                        billingPeriod: getLabel({
                            labelName: ""
                        })
                    },
                },
                lastCont: {
                    uiFramework: "custom-atoms",
                    componentPath: "Div",
                    gridDefination: {
                        xs: 6,
                        sm: 7
                    }
                }

            }),
            lastReadingContainer: getCommonContainer({
                firstCont: {
                    uiFramework: "custom-atoms",
                    componentPath: "Div",
                    gridDefination: {
                        xs: 6,
                        sm: 3
                    },
                    props: {
                        style: {
                            fontSize: 14,
                            color: "rgba(0, 0, 0, 0.60)",
                            marginTop: '20px'
                        }
                    },
                    children: {
                        billingPeriod: getLabel({
                            labelKey: "WS_CONSUMPTION_DETAILS_LAST_READING_DATE_LABEL"
                        })
                    },
                },
                secCont: {
                    uiFramework: "custom-atoms",
                    componentPath: "Div",
                    gridDefination: {
                        xs: 6,
                        sm: 3
                    },
                    props: {
                        style: {
                            fontSize: 14,
                            color: "rgba(0, 0, 0)",
                            marginTop: '20px'
                        }
                    },
                    children: {
                        billingPeriod: getLabel({
                            labelName: ""
                        })
                    },
                },
                lastCont: {
                    uiFramework: "custom-atoms",
                    componentPath: "Div",
                    gridDefination: {
                        xs: 6,
                        sm: 7
                    }
                }

            }),
            fourthContainer: getCommonContainer({
                firstCont: {
                    uiFramework: "custom-atoms",
                    componentPath: "Div",
                    gridDefination: {
                        xs: 6,
                        sm: 3
                    },
                    props: {
                        style: {
                            fontSize: 14,
                            color: "rgba(0, 0, 0, 0.60)",
                            marginTop: '20px'
                        }
                    },
                    children: {
                        billingPeriod: getLabel({
                            labelKey: "WS_CONSUMPTION_DETAILS_CURRENT_READING_LABEL"
                        })
                    },
                },
                currentReading:
                {
                    ...getTextField({
                        placeholder: {
                            labelKey: "WS_CONSUMPTION_DETAILS_CURRENT_READING_PLACEHOLDER"
                        },
                        gridDefination: {
                            xs: 6,
                            sm: 3
                        },
                        required: true,
                        pattern: /^[1-9]\d*(\.\d+)?$/i,
                        // errorMessage: "ERR_INVALID_CONSUMER_NO",
                        jsonPath: "metereading.currentReading"
                    }),
                    afterFieldChange: async (action, state, dispatch) => {
                        let lastReading = get(state, "screenConfiguration.preparedFinalObject.autoPopulatedValues.lastReading");
                        let currentReading = get(state, "screenConfiguration.preparedFinalObject.metereading.currentReading");
                        let meterReadingRatio = get(state, "screenConfiguration.preparedFinalObject.DataForMeterReading[0].additionalDetails.meterReadingRatio");
                        
                        let multipier = meterReadingRatio.split(":")[1];
                        
                        let consumption;
                        if (lastReading === 0) {
                            consumption = currentReading
                            consumption = consumption*multipier;
                        } else {
                            consumption = (currentReading - lastReading).toFixed(2);
                            consumption = consumption*multipier;
                        }
                        if (currentReading == '' || consumption < 0) {
                            consumption = ''
                        }
                        dispatch(
                            handleField(
                                "meter-reading",
                                "components.div.children.meterReadingEditable.children.card.children.cardContent.children.sixthContainer.children.secCont.children.billingPeriod.props",
                                "labelName",
                                consumption
                            )
                        );
                    }
                },
                lastCont: {
                    uiFramework: "custom-atoms",
                    componentPath: "Div",
                    gridDefination: {
                        xs: 6,
                        sm: 7
                    }
                }

            }),
            fifthContainer: getCommonContainer({
                firstCont: {
                    uiFramework: "custom-atoms",
                    componentPath: "Div",
                    gridDefination: {
                        xs: 6,
                        sm: 3
                    },
                    props: {
                        style: {
                            fontSize: 14,
                            color: "rgba(0, 0, 0, 0.60)",
                            marginTop: '20px'
                        }
                    },
                    children: {
                        billingPeriod: getLabel({
                            labelKey: "WS_CONSUMPTION_DETAILS_CURRENT_READING_DATE_LABEL"
                        })
                    },
                },
                currentReadingDate: {
                    ...getDateField({
                        placeholder: {
                            labelKey: "WS_CONSUMPTION_DETAILS_CURRENT_READING_DATE_LABEL"
                        },
                        gridDefination: {
                            xs: 6,
                            sm: 3
                        },
                        required: true,
                        pattern: getPattern("Date"),
                        // errorMessage: "ERR_INVALID_CONSUMER_NO",
                        jsonPath: "metereading.currentReadingDate",
                        afterFieldChange: async (action, state, dispatch) => {
                            let billingPeriod = get(state, "screenConfiguration.preparedFinalObject.autoPopulatedValues.billingPeriod");

                            // let billingPeriod = get(state, `screenConfiguration.preparedFinalObject.autoPopulatedValues.billingPeriod`);
                             let selectedCurrentReadingDate = action.value;
                
                                if(typeof selectedCurrentReadingDate == "string"){
                                    const[selectedCurrentReadyingYear, selectedCurrentReadingMonth, selectedCurrentReadingDay] = selectedCurrentReadingDate.split("-");
                                    selectedCurrentReadingDate = `${selectedCurrentReadingDay}/${selectedCurrentReadingMonth}/${selectedCurrentReadyingYear}`;
                                    let updatedBillingPeriod = billingPeriod.split("-")[0]+"- "+selectedCurrentReadingDate;
                                
                                    dispatch(
                                        handleField(
                                            "meter-reading",
                                            "components.div.children.meterReadingEditable.children.card.children.cardContent.children.firstContainer.children.billingCont.children.billingPeriod.props",
                                            "labelName",
                                            updatedBillingPeriod
                                        )
                                    );   
                
                              }
                            
                            
                            
                      }
                })
            },
                lastCont: {
                    uiFramework: "custom-atoms",
                    componentPath: "Div",
                    gridDefination: {
                        xs: 6,
                        sm: 7
                    }
                }

            }),
            sixthContainer: getCommonContainer({
                firstCont: {
                    uiFramework: "custom-atoms",
                    componentPath: "Div",
                    gridDefination: {
                        xs: 6,
                        sm: 3
                    },
                    props: {
                        style: {
                            fontSize: 14,
                            color: "rgba(0, 0, 0, 0.60)",
                            marginTop: '20px'
                        }
                    },
                    children: {
                        billingPeriod: getLabel({
                            labelKey: "WS_CONSUMPTION_DETAILS_CONSUMPTION_LABEL"
                        })
                    },
                },
                secCont:
                {
                    uiFramework: "custom-atoms",
                    componentPath: "Div",
                    visible: true,
                    gridDefination: {
                        xs: 6,
                        sm: 3
                    },
                    props: {
                        style: {
                            fontSize: 14,
                            color: "rgba(0, 0, 0)",
                            marginTop: '20px'
                        }
                    },
                    children: {
                        billingPeriod: getLabel({
                            labelName: ""
                        })
                    },
                },
                thirdCont:
                    getTextField({
                        placeholder: {
                            labelKey: "WS_CONSUMPTION_DETAILS_CONSUMPTION_READING_PLACEHOLDER"
                        },
                        gridDefination: {
                            xs: 6,
                            sm: 3
                        },
                        visible: false,
                        required: true,
                        pattern: /^[1-9]\d*(\.\d+)?$/i,
                        // errorMessage: "ERR_INVALID_CONSUMER_NO",
                        jsonPath: "metereading.consumption"
                    }),
                lastCont: {
                    uiFramework: "custom-atoms",
                    componentPath: "Div",
                    gridDefination: {
                        xs: 6,
                        sm: 7
                    }
                }

            }),

            button: getCommonContainer({

                buttonContainer: getCommonContainer({
                    firstCont: {
                        uiFramework: "custom-atoms",
                        componentPath: "Div",
                        gridDefination: {
                            xs: 2,
                            sm: 2
                        }
                    },
                  
                    searchButton: {
                        componentPath: "Button",
                        gridDefination: {
                            xs: 3,
                            sm: 2,
                            align: "center"
                        },
                        props: {
                            variant: "outlined",
                            style: {
                                color: "#FE7A51",
                                borderColor: "#FE7A51",
                                width: "150px",
                                height: "40px",
                                margin: "15px 0px",
                                float: "left"
                            }
                        },
                        visible:false,
                        children: {
                            buttonLabel: getLabel({
                                labelKey: "WS_COMMON_BUTTON_SAVE"
                            })
                        },
                        onClickDefination: {
                            action: "condition",
                            callBack: saveData
                        }
                    },

             
                    editButton: {
                        componentPath: "Button",
                        gridDefination: {
                            xs: 3,
                            sm: 2,
                            align: "center"
                        },
                        props: {
                            variant: "outlined",
                            style: {
                                color: "#FE7A51",
                                borderColor: "#FE7A51",
                                width: "150px",
                                height: "40px",
                                margin: "15px 0px",
                                float: "left"
                            }
                        },
                        visible:false,
                        children: {
                            buttonLabel: getLabel({
                                labelKey: "",
                                labelName:'Update'
                            })
                        },
                        onClickDefination: {
                            action: "condition",
                            callBack: UpdateCurrentReading
                        }
                    },
                    cancleButton: {
                        componentPath: "Button",
                        gridDefination: {
                            xs: 3,
                            sm: 2,
                            align: "center"
                        },
                        props: {
                            variant: "outlined",
                            style: {
                                color: "#FE7A51",
                                borderColor: "#FE7A51",
                                width: "150px",
                                height: "40px",
                                margin: "15px 0px",
                                float: "left"
                            }
                        },
                        children: {
                            buttonLabel: getLabel({
                                labelKey: "",
                                labelName:"Cancle"

                            })
                        },
                        onClickDefination: {
                            action: "condition",
                            callBack: cancleData
                        }
                    },
                    lastCont: {
                        uiFramework: "custom-atoms",
                        componentPath: "Div",
                        gridDefination: {
                            xs: 7,
                            sm: 8
                        }
                    }
                })
            })
        })
    }

}



