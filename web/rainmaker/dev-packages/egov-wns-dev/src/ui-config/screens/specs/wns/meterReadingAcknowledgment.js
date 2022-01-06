import {
    getCommonHeader,
    getCommonContainer,
    getBreak
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import acknowledgementCard from "./acknowledgementResource/acknowledgementUtils";
  import set from "lodash/set";
  import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { bulkMeterReadingData } from "./searchResource/bulkMeterReadingData";

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
    dispatch,
    status,
    applicationNumber
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
            // minWidth: "200px",
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
            // minWidth: "200px",
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
    //  gotoHome: {
    //   componentPath: "Button",
    //   gridDefination: {
    //     xs: 12,
    //     sm: 9,
    //     align: "right"
    //   },
    //   props: {
    //     variant: "contained",
    //     color: "primary",
    //     style: {
    //       minWidth: "15%",
    //       height: "48px",
    //       marginRight: "16px"
    //     }
    //   },
    //   children: {
    //     downloadReceiptButtonLabel: getLabel({
    //       labelName: "HOME",
    //       labelKey: "WS_COMMON_BUTTON_HOME"
    //     })
    //   },
    //   onClickDefination: {
    //     action: "page_change",
    //     path: redirectionURL
    //   }
    // },
   
    });
  
};
  
  const getAcknowledgementCard = (
    state,
    dispatch,
  ) => {
    let success = 10
    let count = 20
    let Message = `You have Sucessfully Inserted ${success}/${count} Meter Readings!` 
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
        bulkMeterReadingData,
        paymentSuccessFooter: paymentSuccessFooter(
          state,
          dispatch,
          "APPROVED",
          'sssssssss'
        )
      };
   
  };
  
  const screenConfig = {
    uiFramework: "material-ui",
    name: "meterReadingAcknowledgment",
    components: {
      div: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        props: {
          className: "common-div-css"
        }
      }
    },
    beforeInitScreen: (action, state, dispatch) => {
      const cardOne = getAcknowledgementCard(state, dispatch);
      set(action, "screenConfig.components.div.children", cardOne);  
      return action;
    }
  };
  
  export default screenConfig;
  