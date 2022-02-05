import {
    getCommonHeader,
    getCommonContainer,
    getBreak
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import get from "lodash/get";
  import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
  import set from "lodash/set";
  import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { bulkMeterReadingDataAfterSubmit } from "./searchResource/bulkMeterReadingData";
  import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import {convertEpochToDate} from '../utils/index'

  const getCommonApplyFooter = children => {
    return {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "apply-wizard-footer"
      },
      children
    };
  };

  const paymentSuccessFooter = (
      state,
      dispatch
    ) => {
      const redirectionURL =  "/inbox"; 
      const bulkReadingURL = "/wns/bulkImport" 
      return getCommonApplyFooter({
        goToBulkMeter: {
          componentPath: "Button",
          props: {
            variant: "outlined",
            color: "primary",
            style: {
              height: "48px",
              marginRight: "16px"
            }
          },
          children: {
            resetButtonLabel: getLabel({
              labelName: "WS_GO_TO_BULK_METER",
              labelKey: "WS_GO_TO_BULK_METER"
            })
          },
          onClickDefination: {
            action: "page_change",
            path: bulkReadingURL
          },
          visible: true
        },
        goToHome: {
          componentPath: "Button",
          props: {
            variant: "contained",
            color: "primary",
            style: {
              height: "48px",
              marginRight: "45px"
            }
          },
          children: {
            saveAllLabel: getLabel({
              labelName: "WS_COMMON_BUTTON_HOME",
              labelKey: "WS_COMMON_BUTTON_HOME"
            }),
          },
          onClickDefination: {
            action: "page_change",
            path: redirectionURL
          }
        }
    
      }); 
  };
    
  const getAcknowledgementCard = (
    state,
    dispatch,
  ) => {
    let success = get(state, "screenConfiguration.preparedFinalObject.success") || 0;
    let totalCount = get(state, "screenConfiguration.preparedFinalObject.totalCount") || 0;
    let Message = `You have Sucessfully Inserted ${success}/${totalCount} Meter Readings!` 
      return {
        header: getCommonContainer({
          header: getCommonHeader({
            labelName: `WS_BULK_METER_READING_IMPORT`,
            labelKey: "WS_BULK_METER_READING_IMPORT",
          })
        }),
        applicationSuccessCard: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          children: {
            card: acknowledgementCard({
              icon: "done",
              backgroundColor: "#39CB74",
              header: {
                labelName:
                  Message,
                labelKey: Message
              },
              body: {
              },
              tailText: {
              
              },
              number: ''
            })
          }
        },
        breakAfterSearch: getBreak(),
        bulkMeterReadingDataAfterSubmit,
        paymentSuccessFooter: paymentSuccessFooter(
          state,
          dispatch
        )
      };
   
  };
  
  const setBulkMeterData = (state,dispatch) => {
    setTimeout( () => {
      let acknowledgementData = get(state, "screenConfiguration.preparedFinalObject.acknowledgementData") || [];
      if(acknowledgementData && acknowledgementData.length > 0){
        let data = acknowledgementData.map(item => ({
          ["WS_COMMON_TABLE_COL_CONSUMER_NO_LABEL"]: item.connectionNo,
          ["WS_CONSUMPTION_DETAILS_BILLING_PERIOD_LABEL"]: item.billingPeriod,
          ["WS_SELECT_METER_STATUS_LABEL"]: item.meterStatus,
          ["WS_CONSUMPTION_DETAILS_LAST_READING_DATE_LABEL"]: item.lastReadingDate ? convertEpochToDate(item.lastReadingDate) : '',
          ["WS_CONSUMPTION_DETAILS_LAST_READING_LABEL"]: item.lastReading,
          ["WS_CONSUMPTION_DETAILS_CURRENT_READING_LABEL"]: item.currentReading,
          ["WS_CONSUMPTION_DETAILS_CONSUMPTION_LABEL"]: item.consumption,
          ["WS_CONSUMPTION_DETAILS_CURRENT_READING_DATE_LABEL"]: item.currentReadingDate ? convertEpochToDate(item.currentReadingDate) : '',
          ["WS_CONSUMPTION_DETAILS_METER_READING_STATUS_LABEL"]:item.status
        }));
        dispatch(handleField("meterReadingAcknowledgment", "components.div.children.bulkMeterReadingDataAfterSubmit", "props.data", data));
        dispatch(handleField("meterReadingAcknowledgment", "components.div.children.bulkMeterReadingDataAfterSubmit", "props.rows",
        acknowledgementData.length
        )); 
      }
    }, 5000)
  
  }
  const screenConfig = {
    uiFramework: "material-ui",
    name: "meterReadingAcknowledgment",
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
          className: "common-div-css"
        },
      }
    },
    beforeInitScreen: (action, state, dispatch) => {
      const cardOne = getAcknowledgementCard(state, dispatch);
      set(action, "screenConfig.components.div.children", cardOne);
      setBulkMeterData(state,dispatch)  
      return action;
    }
  };
  
  export default screenConfig;
  