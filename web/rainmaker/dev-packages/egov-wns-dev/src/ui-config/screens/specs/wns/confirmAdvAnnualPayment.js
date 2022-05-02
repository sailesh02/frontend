import { getCommonTitle, getCommonHeader, getCommonCard, getCommonGrayCard, getCommonContainer, getCommonSubHeader, convertEpochToDate, getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { confirmBillFooter } from "./advAnnualPaymentResources/viewBillFooter";

const billHeader = () => {
  return getCommonHeader({ labelKey: "WS_ADV_ANNUAL_PAYMENT_CONFIRM_MSG" })

}

let headerrow = getCommonContainer({
  header: billHeader(),
  
});



const screenConfig = {
  uiFramework: "material-ui",
  name: "confirmAdvAnnualPayment",
  beforeInitScreen: (action, state, dispatch) => {
    
    return action;
  },

  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: { className: "common-div-css search-preview" },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: { header1: { gridDefination: { xs: 12, sm: 8 }, ...headerrow } }
        },
        
        advAnnualPaymentAlreadyAppliedCard: getCommonCard({
          cardMsg: getCommonTitle({
              labelName: "Payment collected successfully. Please confirm to apply Advance Annual Payment. Without confirmation, the payment will be treated as advance bill payment witout opting Advance Annual Payment facility",
              labelKey: "WS_ADV_ANNUAL_PAYMENT_CONFIRM_MSG_DETAIL",
              style: {"color": "green"}
          })
      }),
      confirmBillFooter
      }
    }
  }
};

export default screenConfig;