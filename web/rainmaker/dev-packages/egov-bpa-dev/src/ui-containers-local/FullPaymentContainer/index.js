import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import { connect } from "react-redux";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
//import "./index.css";
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import get from "lodash/get";
import Label from "egov-ui-kit/components/Label"
import { Grid, Typography, Button } from "@material-ui/core";
import InstallmentDetail from "../../ui-molecules-local/InstallmentDetail";
import store from "ui-redux/store";
import { getInstallmentsDetails } from "../../ui-config/screens/specs/egov-bpa/view-installments"

const styles = {
  root: {
    color: "#FE7A51",
    "&$checked": {
      color: "#FE7A51"
    }
  },
  checked: {}
};

class FullPaymentContainer extends React.Component {
  state = {
    checked: false
  };

  // componentDidMount = async () => {
  //   await getInstallmentsDetails();
  // }
  onCheck = (e) => {
    let state = store.getState();

    // var selectedInstallmentId;
    // if (e.target.checked) {

    //   selectedInstallmentId = item[0].installmentno;
    // }
    // var removedInstallmentNo;
    // if (!e.target.checked) {
    //   removedInstallmentNo = item[0].installmentno;

    // }
    // let selectedInstallments = get(state, "screenConfiguration.preparedFinalObject.selectedInstallments");
    // if (e.target.checked) {
    //   selectedInstallments.push(selectedInstallmentId);
    // } else {
    //   const index = selectedInstallments.indexOf(removedInstallmentNo);
    //   if (index > -1) {
    //     selectedInstallments.splice(index, 1);

    //   }
    // }
    // selectedInstallments.sort(function (a, b) { return a - b });
    store.dispatch(prepareFinalObject("selectedInstallments", [-1]))
  }

  getTotalAmount = (items) => {
    let totalAmount = 0;
    items && items.forEach(element => {
      totalAmount = totalAmount + element.taxAmount;
    });
    return totalAmount;
  }
  isInstallmentPaid = (items) => {
    
    let isInstallmentPaid = false;
    if (items && items[0].isPaymentCompletedInDemand) isInstallmentPaid = true
    return isInstallmentPaid;
  }
  isPaymentPending = (items) => {
    
    let isPaymentPeding = false;
    if (items && !items[0].isPaymentCompletedInDemand && items[0].demandId) isPaymentPeding = true
    return isPaymentPeding;
  }
  
  render() {
    const { fullPaymentInfo, classes } = this.props;
    console.log(fullPaymentInfo, "Nero in checkk")
    let index = 0;
      return (
        <Grid
          container="true"
          style={{ marginBottom: "10px" }}
        >
          <Grid item sm={1} md={1} >
            {(() => {
              if (this.isInstallmentPaid(fullPaymentInfo)) {
                return <Checkbox
                  key={index}
                  id={index}
                  value={index + 1}
                  classes={{
                    root: classes.root,
                    //checked: classes.checked
                  }}
                  disabled={this.isInstallmentPaid(fullPaymentInfo)}
                  checked
                  onChange={(e) => {
                    this.onCheck(e, fullPaymentInfo);
                  }}
                />
              }else if(this.isPaymentPending(fullPaymentInfo)){
                return <Checkbox
                  key={index}
                  id={index}
                  value={index + 1}
                  classes={{
                    root: classes.root,
                    checked: classes.checked
                  }}
                  checked
                  onChange={(e) => {
                    this.onCheck(e);
                  }}
                />
              } else {
                return <Checkbox
                  key={index}
                  id={index}
                  value={index + 1}
                  classes={{
                    root: classes.root,
                    checked: classes.checked
                  }}

                  onChange={(e) => {
                    this.onCheck(e);
                  }}
                />
              }
            })()}

          </Grid>
          <Grid item sm={6} md={6} style={{ marginTop: "10px" }}>
            <Grid style={{ fontWeight: "bold", fontSize: "14px" }}>Pay at Once</Grid>
            <InstallmentDetail installments={fullPaymentInfo} ></InstallmentDetail>
            <Grid container="true" style={{ marginTop: "5px" }}>
              <Grid style={{ fontWeight: "bold", fontSize: "14px" }} sm={5} md={5}>Total Amount</Grid>:<Grid style={{ fontWeight: "bold", fontSize: "14px", textAlign: "right" }} sm={2} md={2}>Rs. {this.getTotalAmount(fullPaymentInfo)}</Grid>
            </Grid>
          </Grid>
          {(() => {
            if (this.isInstallmentPaid(fullPaymentInfo)) {
              return <Grid item sm={3} md={3} style={{ marginTop: "40px", color: "#2dd82d", fontWeight: "bold" }}>PAID</Grid>
            } else {
              return <Grid item sm={3} md={3} style={{ marginTop: "40px", color: "red", fontWeight: "bold" }}>NOT PAID</Grid>
            }
          })()}

        </Grid>
      );
    
  }
}

const mapStateToProps = (state, ownprops) => {
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration
  let fullPaymentInfo = preparedFinalObject && preparedFinalObject.fullPaymentInfo;
  // let installments = Object.entries(installmentsInfo.installments);
  return { fullPaymentInfo };
};

const mapDispatchToProps = dispatch => {
  return {
    approveCheck: (jsonPath, value) => {
      dispatch(prepareFinalObject(jsonPath, value));
    }
  };
};



export default withStyles(styles)(
  connect(
    mapStateToProps,
    null
  )(FullPaymentContainer)
);
