import React from "react";
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import { httpRequest } from "../../ui-utils/api";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import store from "ui-redux/store";

const styles = {

  color: "rgba(0, 0, 0, 0.8700000047683716)",
  marginLeft: "8px",
  paddingLeft: "19px",
  paddingRight: "19px",
  textAlign: "right",
  verticalAlign: "middle",
  lineHeight: "35px",
  fontSize: "30px"
};

class TotalBillContainer extends React.Component {
  state = {
    totalAmount: 0
  };
  componentDidMount = async () => {

    let connectionNumber = getQueryArg(window.location.href, "propertyId");
    let tenantId = getQueryArg(window.location.href, "tenantId");

    let due
    let fetchBillQueryObj = []
    try {

      fetchBillQueryObj = [{ key: "tenantId", value: tenantId }, { key: "consumerCode", value: connectionNumber }, { key: "businessService", value: "PT" }]

      const billResults = await httpRequest(
        "post",
        "/billing-service/bill/v2/_fetchbill",
        "_fetchBill",
        fetchBillQueryObj
      );
      
      // billResults && billResults.Bill &&Array.isArray(billResults.Bill)&&billResults.Bill.length>0 && billResults.Bill.map(bill => {
      //     due = bill.totalAmount
      //     if(due > 0){
      //       this.setState({dueAmountmsg: "The connection has some pending dues. Still you want to proceed?"})

      //     }
      // })
      if (billResults && billResults.Bill && billResults.Bill.length > 0) {

        this.setState({ totalAmount: billResults.Bill[0].totalAmount })
        store.dispatch(prepareFinalObject("totalBillAmountForDemandPT", billResults.Bill[0].totalAmount))
      }

    } catch (error) {
      console.log(error, "Neero Error")
    }
  }

  render() {
    return <div style={styles}><LabelContainer labelKey="PT_COMMON_TOTAL_AMT" />: Rs {this.state.totalAmount} </div>;
  }
}

export default TotalBillContainer;

