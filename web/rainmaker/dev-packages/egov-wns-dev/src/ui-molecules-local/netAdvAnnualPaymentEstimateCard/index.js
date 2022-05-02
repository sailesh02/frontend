import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Card } from "material-ui/Card";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import { Tooltip, Icon } from "@material-ui/core";
import { connect } from "react-redux";
import get from "lodash/get";

const styles = {
    card: {
        backgroundColor: "rgb(242, 242, 242)",
        boxShadow: "none",
        borderRadius: 0
    },
    whiteCard: {
        padding: 18,
        marginTop: 2,
        // boxShadow: "none",
        borderRadius: 0,
        backgroundColor: "#ffffff"
    },
    whiteCardText: {
        padding: 8,
        color: "rgba(0, 0, 0, 0.6000000238418579)",
        fontFamily: "Roboto",
        fontSize: 14,
        fontWeight: 400,
        letterSpacing: 0.65
    },
    toolTipIcon: {
        color: "rgba(0, 0, 0, 0.3799999952316284)",
        paddingLeft: 5,
        paddingTop: 1
    },
    bigheader: {
        color: "rgba(0, 0, 0, 0.8700000047683716)",
        fontFamily: "Roboto",
        fontSize: "34px",
        fontWeight: 500,
        letterSpacing: "1.42px",
        lineHeight: "41px"
    },
    taxStyles: {
        color: "rgba(0, 0, 0, 0.87)",
        fontSize: 16,
        fontWeight: 400,
        lineHeight: "19px",
        letterSpacing: 0.67,
        fontFamily: "Roboto",
        marginBottom: 16
    }
};

function FeesEstimateCard(props) {
    const { netPayble } = props;
    console.log(netPayble, "Nero Estimates")
    
    // const totalHeadClassName = "tl-total-amount-value ";
    

    // let totalAmount = estimate && estimate.fees.netAnnualAdvancePayable;
    // let sewerageCharge= estimate && estimate.fees.sewerageCharge;
    // let waterCharge= estimate && estimate.fees.waterCharge;
    // let rebate= estimate && estimate.fees.rebate;
    return (
        <Grid container style={{ marginTop: "20px" }}>
            
            <Grid xs={12} sm={12}>
                <div>
                    
                    
                    <Grid container >
                        <Grid item xs={3}>
                            <Typography variant="body2" >
                                <LabelContainer labelKey="WS_CURRENT_DUE_AMOUNT" />
                            </Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <Typography variant="body2" >
                                <LabelContainer labelKey="+" />
                            </Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography variant="body2" >
                                <LabelContainer labelKey="WS_ADV_ANNUAL_EST" />
                            </Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <Typography variant="body2" >
                                <LabelContainer labelKey="=" />
                            </Typography>
                        </Grid>                        
                        <Grid item xs={4}
                            align="right"
                            style={{ paddingRight: 0 }} >
                            <Typography variant="body2" style={{fontSize: "34px"}}>
                                Rs {netPayble}
                            </Typography>
                        </Grid>
                    </Grid>
                   
                </div>
            </Grid >
            
        </Grid >
    )
}


//export default withStyles(styles)(FeesEstimateCard);
const mapStateToProps = (state, ownprops) => {
    console.log(state, "Nero  sssfdfs")
    const { screenConfiguration } = state;
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

  return {netPayble: currentDueBill+advAnnualEstimatePayment}
}
export default connect(
    mapStateToProps,
    null
  )(FeesEstimateCard);