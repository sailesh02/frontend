import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Card } from "material-ui/Card";
import { convertEpochToDate } from "../../ui-config/screens/specs/utils";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import { Tooltip, Icon } from "@material-ui/core";

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
    const { classes, estimate } = props;
    console.log(estimate, "Nero Estimates")
    
    const totalHeadClassName = "tl-total-amount-value " + classes.bigheader;
    

    let totalAmount = estimate && estimate.fees.netAnnualAdvancePayable;
    let sewerageCharge= estimate && estimate.fees.sewerageCharge;
    let waterCharge= estimate && estimate.fees.waterCharge;
    let rebate= estimate && estimate.fees.rebate;
    return (
        <Grid container >
            <Grid xs={12} sm={12}>
                <Typography variant="body2"
                    align="right"
                    style={{ marginTop: -20 }}
                    className="tl-total-amount-text">
                    <LabelContainer labelName="Total Amount" labelKey="WS_COMMON_TOTAL_AMT" />
                </Typography>
                <Typography className={totalHeadClassName} align="right" >Rs {totalAmount}</Typography>
            </Grid>
            <Grid xs={12} sm={7}>
                <div style={{ maxWidth: 600 }}>
                    
                    
                    <Grid container >
                        <Grid item xs={6}>
                            <Typography variant="body2" >
                                <LabelContainer labelKey="COMMON_WATER_CHARGE" />
                            </Typography>
                        </Grid>
                        
                        <Grid item xs={6}
                            align="right"
                            style={{ paddingRight: 0 }}
                            className="tl-application-table-total-value" >
                            <Typography variant="body2">
                                Rs {waterCharge}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container >
                        <Grid item xs={6}>
                            <Typography variant="body2" >
                                <LabelContainer labelKey="COMMON_SEWERAGE_CHARGE" />
                            </Typography>
                        </Grid>
                        
                        <Grid item xs={6}
                            align="right"
                            style={{ paddingRight: 0 }}
                            className="tl-application-table-total-value" >
                            <Typography variant="body2">
                                Rs {sewerageCharge}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container >
                        <Grid item xs={6}>
                            <Typography variant="body2" >
                                <LabelContainer labelKey="COMMON_REBATE" />
                            </Typography>
                        </Grid>
                        
                        <Grid item xs={6}
                            align="right"
                            style={{ paddingRight: 0 }}
                            className="tl-application-table-total-value" >
                            <Typography variant="body2">
                                Rs {rebate}
                            </Typography>
                        </Grid>
                    </Grid>
                    < Divider />
                    <Grid container >
                        <Grid item xs={6}>
                            <Typography variant="body2" >
                                <LabelContainer labelKey="WS_COMMON_TOTAL_AMT" />
                            </Typography>
                        </Grid>
                        <Grid item xs={6}
                            align="right"
                            style={{ paddingRight: 0 }}
                            className="tl-application-table-total-value" >
                            <Typography variant="body2">
                                Rs {totalAmount}
                            </Typography>
                        </Grid>
                    </Grid>
                </div>
            </Grid >
            
        </Grid >
    )
}


export default withStyles(styles)(FeesEstimateCard);