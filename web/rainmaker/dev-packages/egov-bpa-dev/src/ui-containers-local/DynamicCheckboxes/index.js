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
import VisibilityIcon from '@material-ui/icons/Visibility';
import { httpRequest } from "egov-ui-framework/ui-utils/api";

const styles = {
  root: {
    color: "#FE7A51",
    "&$checked": {
      color: "#FE7A51"
    }
  },
  checked: {}
};

class DynamicCheckboxes extends React.Component {
  state = {
    checked: false
  };

  onCheck = (e, item) => {
    let state = store.getState();

    var selectedInstallmentId;
    if (e.target.checked) {

      selectedInstallmentId = item[0].installmentNo;
    }
    var removedInstallmentNo;
    if (!e.target.checked) {
      removedInstallmentNo = item[0].installmentNo;

    }
    let selectedInstallments = get(state, "screenConfiguration.preparedFinalObject.selectedInstallments");
    if (e.target.checked) {
      selectedInstallments.push(selectedInstallmentId);
    } else {
      const index = selectedInstallments.indexOf(removedInstallmentNo);
      if (index > -1) {
        selectedInstallments.splice(index, 1);

      }
    }
    selectedInstallments.sort(function (a, b) { return a - b });
    store.dispatch(prepareFinalObject("selectedInstallments", selectedInstallments))
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

  isDocumentUploaded = (items) => {
    let isDocumentUploaded = false;
    if (items && items[0].additionalDetails && items[0].additionalDetails.varificationDocuments[0].fileStoreId) isDocumentUploaded = true
    return isDocumentUploaded;
  }

  downloadDoc = async(items) =>{
    console.log(items[0], "Nero Items")
    let tenantId = items && items[0].tenantId;
    let fileStoreId = items && items[0].additionalDetails && items[0].additionalDetails.varificationDocuments[0].fileStoreId
    let pdfDownload = await httpRequest(
      "get",
      `filestore/v1/files/url?tenantId=${tenantId}&fileStoreIds=${fileStoreId}`, []
    );
  
    window.open(pdfDownload[fileStoreId]);
    
  }
  
  render() {
    const { installmentsInfo, classes } = this.props;
console.log(installmentsInfo, "Nero in checkk")
    return  installmentsInfo.map((option, index) => {
      return (
        <Grid
          container="true"
          style={{ marginBottom: "10px" }}
        >
          <Grid item sm={1} md={1} >
            {(() => {
              if (this.isInstallmentPaid(option)) {
                return <Checkbox
                  key={index}
                  id={index}
                  value={index + 1}
                  classes={{
                    root: classes.root,
                    //checked: classes.checked
                  }}
                  disabled={this.isInstallmentPaid(option)}
                  checked
                  onChange={(e) => {
                    this.onCheck(e, option);
                  }}
                />
              } else if(this.isPaymentPending(option)){
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
                    this.onCheck(e, option);
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
                    this.onCheck(e, option);
                  }}
                />
              }
            })()}

          </Grid>
          <Grid item sm={6} md={6} style={{ marginTop: "10px" }}>
            <Grid style={{ fontWeight: "bold", fontSize: "14px" }}>INSTALLMENT {index + 1}</Grid>
            <InstallmentDetail installments={option} ></InstallmentDetail>
            <Grid container="true" style={{ marginTop: "5px" }}>
              <Grid style={{ fontWeight: "bold", fontSize: "14px" }} sm={5} md={5}>Total Amount</Grid>:<Grid style={{ fontWeight: "bold", fontSize: "14px", textAlign: "right" }} sm={2} md={2}>Rs. {this.getTotalAmount(option)}</Grid>
            </Grid>
          </Grid>
          {(() => {
            if (this.isDocumentUploaded(option)) {
              return <Grid sm={1} md={1}  style={{ marginTop: "34px"}} >
              <Button title="Download Document"
              color = "primary"
              onClick={()=>{
                this.downloadDoc(option)
              }}
              style={{
                paddingBottom: "0px",
                paddingTop: "0px"
              }}
              >
                
                <VisibilityIcon />
              
              </Button>
              </Grid>
            } else {
              return <Grid sm={1} md={1}  style={{ marginTop: "34px"}} ></Grid>
            }
          })()}
          {(() => {
            if (this.isInstallmentPaid(option)) {
              return <Grid item sm={2} md={2} style={{ marginTop: "40px", color: "#2dd82d", fontWeight: "bold" }}>PAID</Grid>
            } else {
              return <Grid item sm={2} md={2} style={{ marginTop: "40px", color: "red", fontWeight: "bold" }}>NOT PAID</Grid>
            }
          })()}

        </Grid>
      );
    });
  }
}

const mapStateToProps = (state, ownprops) => {
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration
  let installmentsInfo = preparedFinalObject && preparedFinalObject.installmentsInfo && preparedFinalObject.installmentsInfo.installments || [];
  // let installments = Object.entries(installmentsInfo.installments);
  return { installmentsInfo };
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
  )(DynamicCheckboxes)
);
