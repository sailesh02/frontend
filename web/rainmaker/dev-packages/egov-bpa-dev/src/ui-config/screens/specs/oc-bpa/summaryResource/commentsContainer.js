import {
    getCommonGrayCard,
    getCommonSubHeader,
    getCommonContainer,
    getLabel
  } from "egov-ui-framework/ui-config/screens/specs/utils";

const onClick = async (state, dispatch) => {
    let applicationNo = state.screenConfiguration.preparedFinalObject.WaterConnection[0].applicationNo
    let connectionNumber = getQueryArg(window.location.href, "connectionNumber");
    const service = getQueryArg(window.location.href, "service");
    const tenantId = getQueryArg(window.location.href, "tenantId");
   
      let due
      let fetchBillQueryObj = []
      if(applicationNo.includes('SW')){
        fetchBillQueryObj = [{ key: "tenantId", value: tenantId }, { key: "consumerCode", value: connectionNumber }, { key: "businessService", value: "SW" }]
      }else{
        fetchBillQueryObj = [{ key: "tenantId", value: tenantId }, { key: "consumerCode", value: connectionNumber }, { key: "businessService", value: "WS" }]
      }
      let billResults = await fetchBill(fetchBillQueryObj)
      billResults && billResults.Bill &&Array.isArray(billResults.Bill)&&billResults.Bill.length>0 && billResults.Bill.map(bill => {
        due = bill.totalAmount
      })
      let errLabel =
        applicationNo && applicationNo.includes("WS")
          ? "WS_PENDING_FEES_ERROR"
          : "WS_PENDING_FEES_ERROR";
      if (due && parseInt(due) > 0) {
        dispatch(toggleSnackbarAndSetText(
          true,
          {
            labelName: "Due Amount should be zero!",
            labelKey: errLabel,
          },
          "error"
        ));
        return false;
      }  
  
    set(
      "apply",
      "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.visible",
      false
    );
  
    dispatch(
      setRoute(
        `/wns/apply?applicationNumber=${applicationNo}&connectionNumber=${connectionNumber}&tenantId=${tenantId}&action=edit&mode=ownershipTransfer`
      )
    );
}  

export const commentsContainer = () => {
    return getCommonGrayCard({
      headerDiv: {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        props: {
          style: { marginBottom: "10px" }
        },
        children: {
          header: {
            gridDefination: {
              xs: 12,
              sm: 12
            },
            ...getCommonContainer({
              header:getCommonSubHeader({
                labelKey: "Label",
                labelName: "Label",
                gridDefination: {
                  xs: 2,
                  sm: 2,
                  align: "left"
                },
              }),
                commentsButton: {
                  componentPath: "Button",
                  gridDefination: {
                    xs: 12,
                    sm: 12,
                    align: "right"
                  },
                  visible:true,
                  props: {
                    variant: "contained",
                    style: {
                      color: "white",
                      margin: "8px",
                      backgroundColor: "rgb(254, 122, 81)",
                      borderRadius: "2px",
                      width: "220px",
                      height: "48px",
                      marginTop:'-27px'
                    },
                    
                  },
                  children: {
                    buttonLabel: getLabel({
                      labelKey: "Comments"
                    })
                  },
                  onClickDefination: {
                    action: "condition",
                    callBack: onClick
                  }
                },
              }),
              visible:true
          }
        }
      }
    });
}