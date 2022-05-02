import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getCommonApplyFooter } from "../../utils";
import { downloadBill } from "../../../../../ui-utils/commons";

import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import store from "ui-redux/store";
import get from "lodash/get";
import { httpRequest } from "../../../../../ui-utils/api";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
//const connectionNo = getQueryArg(window.location.href, "connectionNumber");
//const tenantId = getQueryArg(window.location.href, "tenantId");
//const businessService = connectionNo.includes("WS") ? "WS" : "SW";

const gotoDownloadReceiptPage = (mode, state, dispatch) => {
  
  const url = `demand-adjust-search?purpose=PRINT_RECEIPT`
    store.dispatch(setRoute(url));
}
const cancelAdvAnnualPayment = (mode, state, dispatch) => {
  let tenantId = getQueryArg(window.location.href, "tenantId");

  let connectionNumber = getQueryArg(window.location.href, "connectionNumber");
  let service = getQueryArg(window.location.href, "service");
  let connectionType = getQueryArg(window.location.href, "connectionType");
  let connectionFacility = getQueryArg(window.location.href, "connectionFacility");
  const url = `viewBill?connectionNumber=${connectionNumber}&tenantId=${tenantId}&service=${service}&connectionType=${connectionType}&connectionFacility=${connectionFacility}`
    store.dispatch(setRoute(url));
}

const payForAdvAnnualPayment = async(state, dispatch) => {
  
  const { screenConfiguration } = state;

  const isAlreadyOpted = get(
    screenConfiguration.preparedFinalObject,
    "advAnnualPaymentData",
    0
  );
  if("alreadyOpted" in isAlreadyOpted){

store.dispatch(toggleSnackbar(true, { labelName: "You already opted the Advanced Annual Payment Facility", labelCode: "You already opted the Advanced Annual Payment Facility" }, "success"));
  }else{
    console.log("Nero Okay")
  const currentDueBill = get(
    screenConfiguration.preparedFinalObject,
    "totalBillAmountForDemand",
    0
  );
  const advAnnualEstimatePayment = get(
    screenConfiguration.preparedFinalObject,
    "advAnnualPaymentData.netAnnualAdvancePayable",
    0
  );

  const finalReceiptData = get(
    screenConfiguration.preparedFinalObject,
    "TempBillData",
    []
  );

  const connectionNo = getQueryArg(window.location.href, "connectionNumber");
  const tenantId = getQueryArg(window.location.href, "tenantId");
  
 let netPayble = currentDueBill + advAnnualEstimatePayment;
  if(netPayble > 0){
      
      let ReceiptBodyNew = {
        Payment: { paymentDetails: [] }
      };

      try {
        const totalAmount = Number(finalReceiptData.Bill[0].totalAmount);

        ReceiptBodyNew.Payment["tenantId"] = finalReceiptData.Bill[0].tenantId;
        ReceiptBodyNew.Payment["totalDue"] = totalAmount;
        ReceiptBodyNew.Payment["totalAmountPaid"] = netPayble;
        ReceiptBodyNew.Payment["payerName"] = finalReceiptData.Bill[0].paidBy ? finalReceiptData.Bill[0].paidBy : (finalReceiptData.Bill[0].payerName || finalReceiptData.Bill[0].payer);
        ReceiptBodyNew.Payment["paidBy"] = finalReceiptData.Bill[0].payerName;
        ReceiptBodyNew.Payment["paymentMode"] = "Cash";
        ReceiptBodyNew.Payment["mobileNumber"] = finalReceiptData.Bill[0].mobileNumber;
        

        ReceiptBodyNew.Payment.paymentDetails.push({
          
          businessService: finalReceiptData.Bill[0].businessService,
          billId: finalReceiptData.Bill[0].id,
          totalDue: totalAmount,
          totalAmountPaid: netPayble
        });

        

        let response = await httpRequest(
          "post",
          "collection-services/payments/_create",
          "_create",
          [],
          ReceiptBodyNew,
          [],
          {}
        );
        let receiptNumber = get(
          response,
          "Payments[0].paymentDetails[0].receiptNumber",
          null
        );


        /******************************************************************/
        if(response){
          //   let applyAdvAnnualPayment = {"annualAdvance": {
          //     "tenantId": tenantId,
          //     "connectionNo": connectionNo
          // }}

          // try {
          //   let response = await httpRequest(
          //     "post",
          //     "ws-calculator/waterCalculator/annualAdvance/_apply",
          //     "_apply",
          //     [],
          //     applyAdvAnnualPayment,
          //     [],
          //     {}
          //   );
          //   console.log(response, "Nero response")
          //   if(response && response.annualAdvance){
          //     console.log("Nero In Res")
          //    const url = `egov-common/acknowledgement?status=success&consumerCode=${connectionNumber}&tenantId=${tenantId}&receiptNumber=${receiptNumber}&businessService=WS&purpose=pay#!`
          //   //  const url = `viewBill?connectionNumber=${connectionNumber}&tenantId=${tenantId}&service=${service}&connectionType=${connectionType}&connectionFacility=${connectionFacility}`
          //   store.dispatch(setRoute(url));
          //   }  
          // } catch (error) {
          //   const url = `/wns/acknowledgement?purpose=advAnnualPayment&status=failure`;
          //   store.dispatch(setRoute(url));
          // }
          

          const url = `confirmAdvAnnualPayment?consumerCode=${connectionNo}&tenantId=${tenantId}`
          
          store.dispatch(setRoute(url));


        }

  
        
      } catch (error) {
        
      }

  }else{
    
    try {
      let applyAdvAnnualPayment = {"annualAdvance": {
        "tenantId": tenantId,
        "connectionNo": connectionNo
    }}

    let response = await httpRequest(
      "post",
      "ws-calculator/waterCalculator/annualAdvance/_apply",
      "_apply",
      [],
      applyAdvAnnualPayment,
      [],
      {}
    );
    
    if(response){
      const url = `/wns/acknowledgement?purpose=advAnnualPayment&status=success`;
      store.dispatch(setRoute(url));
    }
      
    } catch (error) {
      const url = `/wns/acknowledgement?purpose=advAnnualPayment&status=failure`;
    store.dispatch(setRoute(url));
    }

  }
  }
}


export const viewBillFooter = getCommonApplyFooter("BOTTOM", {
  downloadButton: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      }
    },
    children: {
      downloadButton: getLabel({
        labelKey: "WS_COMMON_CANCEL_BILL"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        cancelAdvAnnualPayment(state, dispatch);
      }
    },
  },
  payButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      }
    },
    children: {
      payButtonLabel: getLabel({
        labelKey: "WS_COMMON_APPLY"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        payForAdvAnnualPayment(state, dispatch);
      }
    },
  }
});


const applyForAdvAnnualPayment = async(state, dispatch) => {
  
  

  const connectionNo = getQueryArg(window.location.href, "consumerCode");
  const tenantId = getQueryArg(window.location.href, "tenantId");
  let applyAdvAnnualPayment = {"annualAdvance": {
    "tenantId": tenantId,
    "connectionNo": connectionNo
  }}

  try {
    let response = await httpRequest(
      "post",
      "ws-calculator/waterCalculator/annualAdvance/_apply",
      "_apply",
      [],
      applyAdvAnnualPayment,
      [],
      {}
    );
    console.log(response, "Nero response")
    if(response && response.annualAdvance){
      console.log("Nero In Res")
    const url = `/wns/acknowledgement?purpose=advAnnualPayment&status=success`
    
    store.dispatch(setRoute(url));
    }  
  } catch (error) {
    const url = `/wns/acknowledgement?purpose=advAnnualPayment&status=failure`;
    store.dispatch(setRoute(url));
  }
}


export const confirmBillFooter = getCommonApplyFooter("BOTTOM", {
  
  payButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      }
    },
    children: {
      payButtonLabel: getLabel({
        labelKey: "WS_COMMON_CONFIRM"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        applyForAdvAnnualPayment(state, dispatch);
      }
    },
  }
});

