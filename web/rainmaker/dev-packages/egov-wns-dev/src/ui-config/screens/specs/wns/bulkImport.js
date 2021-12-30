// import { fetchData } from "./myConnectionDetails/myConnectionDetails";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg,getTodaysDateInYMD, getMaxDate } from "egov-ui-framework/ui-utils/commons";
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

const screenConfig = {
  uiFramework: "material-ui",
  name: "bulkImport",
  beforeInitScreen: (action, state, dispatch) => {
    // fetchData(action, state, dispatch);
    return action;
  },
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
                    jsonPath: "meterReadings[0].connectionNo",
                    iconObj: {
                      iconName: "search",
                      position: "end",
                      color: "#FE7A51",
                      onClickDefination: {
                        action: "condition",
                        callBack: (state, dispatch, fieldInfo) => {
                          // getDetailsForOwner(state, dispatch, fieldInfo);
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
                    jsonPath: "meterReadings[0].billingPeriod"
                  }),
                  meterStatus: getSelectField({
                    label: {
                      labelName: "WS_METER_STATUS",
                      labelKey: "WS_METER_STATUS"
                    },
                    placeholder: {
                      labelName: "WS_METER_STATUS_PLACEHOLDER",
                      labelKey: "WS_METER_STATUS_PLACEHOLDER"
                    },
                    required: true,
                    visible: true,
                    jsonPath: "meterReadings[0].meterStatus",
                    gridDefination: {
                      xs: 12,
                      sm: 3
                    },
                    data: [
                      {
                        code: "working"
                      },
                      {
                        code: "working"
                      }
                    ]
                  }),
                  lastReadingDate: {
                    ...getDateField({
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
                      jsonPath: "meterReadings[0].lastReadingDate",
                      // props: {
                      //   inputProps: {
                      //     max: getTodaysDateInYMD()
                      //   }
                      // }
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
                    jsonPath: "meterReadings[0].lastReading"
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
                    jsonPath: "meterReadings[0].currentReading"
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
                      jsonPath: "meterReadings[0].currentReadingDate",
                      // props: {
                      //   inputProps: {
                      //     max: getTodaysDateInYMD()
                      //   }
                      // }
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
                    jsonPath: "meterReadings[0].consumption"
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
