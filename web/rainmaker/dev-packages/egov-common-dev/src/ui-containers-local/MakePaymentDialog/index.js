import React from "react";
import { Label } from "egov-ui-framework/ui-atoms";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import { withStyles } from "@material-ui/core/styles";
import get from "lodash/get";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import Divider from "@material-ui/core/Divider";
import Icon from "@material-ui/core/Icon";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";

const styles = theme => ({
  root: {
    marginBottom: 8
  },
  container: {
    paddingBottom: 10
  }
});

const closebuttonStyle = {
  width: "25px",
  height: "25px",
  color: "#767676"
};

const closeIcon = "close";

const getMultiItem = (billingslabData, classes, style) => {
  return billingslabData.map((item, index) => {
    return (
      <Grid sm={12} className={classes.container} container={true}>
        <Grid sm={10}>
          <LabelContainer
            labelKey={`TL_${item.category}`}
            style={{
              color: "rgba(0, 0, 0, 0.6000000238418579)",
              fontSize: "14px",
              fontWeigt: 400,
              lineSpacing: "17px"
            }}
          />
        </Grid>
        <Grid sm={2}>
          <Label
            label={`Rs ${item.rate}`}
            style={{
              color: "rgba(0, 0, 0, 0.8700000047683716)",
              fontSize: "14px",
              fontWeigt: 400,
              lineSpacing: "17px"
            }}
          />
        </Grid>
      </Grid>
    );
  });
};

class MakePaymentDialog extends React.Component {
  state = {
    style: {
      color: "rgba(0, 0, 0, 0.8700000047683716)",
      fontSize: "20px",
      fontWeigt: 500,
      lineSpacing: "28px",
      marginTop: 25
    }
  };

  getGridItem = (total, classes, style) => {
    return (
      <Grid sm={12} className={classes.container} container={true}>
        <Grid sm={10}>
          <LabelContainer
            labelName={"Total"}
            labelKey={"PT_FORM4_TOTAL"}
            style={
              style
                ? style
                : {
                    color: "rgba(0, 0, 0, 0.8700000047683716)",
                    fontSize: "14px",
                    fontWeigt: 400,
                    lineSpacing: "17px"
                  }
            }
          />
        </Grid>
        <Grid sm={2}>
          <Label
            label={`Rs ${total}`}
            style={
              style
                ? style
                : {
                    color: "rgba(0, 0, 0, 0.8700000047683716)",
                    fontSize: "14px",
                    fontWeigt: 400,
                    lineSpacing: "17px"
                  }
            }
          />
        </Grid>
      </Grid>
    );
  };

  handleClose = () => {
    const { screenKey } = this.props;
    this.props.handleField(
      screenKey,
      `components.breakUpDialog`,
      "props.open",
      false
    );
  };

  render() {
    const actions = [
      <Button
        id="logout-no-button"
        className="logout-no-button"
        label={<Label buttonLabel={true} label={"Cancel"} color="#FE7A51" />}
        backgroundColor={"#fff"}
       
        style={{ boxShadow: "none" }}
      />,
      <Button
        id="logout-yes-button"
        className="logout-yes-button"
        label={<Label buttonLabel={true} label={"Ok"} color="#FE7A51" />}
        backgroundColor={"#fff"}
       
        style={{ boxShadow: "none" }}
      />,
    ];
    const {
      open,
      tradeUnitData,
      accessoriesUnitData,
      tradeTotal,
      accessoriesTotal,
      classes
    } = this.props;
    const { style } = this.state;
    const { getGridItem, handleClose } = this;
    const totalBill = tradeTotal + accessoriesTotal;
    return (
      <Dialog
        open={open}
        title={
          <Label
            label={"OkayTIle"}
            bold={true}
            color="rgba(0, 0, 0, 0.8700000047683716)"
            fontSize="20px"
            labelStyle={{ padding: "16px 0px 0px 24px" }}
          />
        }
        children={[
          <Label buttonLabel={true} label={"USER_SESSION_EXPIRED"} color="#FE7A51" labelStyle={{ paddingLeft: "12px" }} />
        ]}
        onClose={handleClose}
        fullWidth={true}
        actions={actions}
        
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { screenConfiguration } = state;
  const { screenKey } = ownProps;
  const { screenConfig, preparedFinalObject } = screenConfiguration;
  const accessoriesUnitData = get(
    preparedFinalObject,
    "LicensesTemp[0].billingSlabData.accessoriesUnitData"
  );
  const tradeUnitData = get(
    preparedFinalObject,
    "LicensesTemp[0].billingSlabData.tradeUnitData"
  );
  const tradeTotal = get(
    preparedFinalObject,
    "LicensesTemp[0].billingSlabData.tradeTotal"
  );
  const accessoriesTotal = get(
    preparedFinalObject,
    "LicensesTemp[0].billingSlabData.accessoriesTotal"
  );

  const open = get(
    screenConfig,
    `${screenKey}.components.paymentRedirectDialog.props.open`
  );
console.log(screenConfig, "Nero ScreenCofogg")
  return {
    open,
    tradeUnitData,
    accessoriesUnitData,
    tradeTotal,
    accessoriesTotal,
    screenKey,
    screenConfig
  };
};

const mapDispatchToProps = dispatch => {
  return { handleField: (a, b, c, d) => dispatch(handleField(a, b, c, d)) };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MakePaymentDialog)
);
