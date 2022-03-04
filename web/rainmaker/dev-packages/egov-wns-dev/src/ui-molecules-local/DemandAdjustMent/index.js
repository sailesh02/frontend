import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Label from "../../ui-containers-local/LabelContainer";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import { Link } from "react-router-dom";
// import get from "lodash/get";
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import TextFieldContainer from "egov-ui-framework/ui-containers/TextFieldContainer";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import store from "ui-redux/store";
import { prepareFinalObject, showSpinner, hideSpinner, toggleSnackbar, toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { convertEpochToDate } from "../../ui-config/screens/specs/utils";
import { updateDemand } from "../../ui-utils/commons"
import { Button } from "egov-ui-framework/ui-atoms";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

const styles = {
  card: {
    marginLeft: 8,
    marginRight: 8,
    borderRadius: "inherit"
  },
  editStyle: {
    color: 'white',
    float: 'right',
    backgroundColor: "#DB6844",

  }
};

export const sumTaxHeads = (demandDetails) => {
 // console.log(demandDetails, "Nero demandDetails")
  let holder = {}
  let demandDetailsArray = [];
  
  demandDetails.forEach(function(d) {
      if (holder.hasOwnProperty(d.taxHeadMasterCode)) {
        holder[d.taxHeadMasterCode] = holder[d.taxHeadMasterCode] + d.taxAmount;
      } else {
        holder[d.taxHeadMasterCode] = d.taxAmount;
      }
    });

    for (var prop in holder) {
      demandDetailsArray.push({ taxHeadMasterCode: prop, taxAmount: holder[prop] });
    }

    return demandDetailsArray;
}

class MeterReading extends React.Component {

  state = {

    isEditVisible: false,
    IntegerErrMsg: 'Please Enter Valid Number',
    taxRoundOfAmountErr: false
  }

  handleChange = (e) => {

    this.setState({
      selectedDate: e.target.value,
      taxRoundOfAmountErr: !e.target.value.match(/^-?\d*\.?\d{0,6}$/) ? true : false
    })


    store.dispatch(prepareFinalObject('taxRoundOffAmount', e.target.value))

  }

  onUpdateButtonCLick = async (e) => {

    let consumerCode = getQueryArg(window.location.href, "connectionNumber");
    const tenantId = getQueryArg(window.location.href, "tenantId")

    // console.log(e.target, buttonLable, "Nero Event")
    let state = store.getState();
    let { screenConfiguration } = state;

    let { preparedFinalObject } = screenConfiguration;

    let enteredTaxHeadAmount = preparedFinalObject && preparedFinalObject.taxRoundOffAmount

    if (enteredTaxHeadAmount == '' || enteredTaxHeadAmount == null) {
      this.setState({
        selectedDate: e.target.value,
        taxRoundOfAmountErr: true,
        IntegerErrMsg: "Please enter value"
      })

      return false;
    }
    store.dispatch(showSpinner())
    let demands = preparedFinalObject && preparedFinalObject.Demands;

    let editableDemandDetail = demands && demands[0].demandDetails;
    let newTaxHead = {
      taxHeadMasterCode: "WS_ARREAR_ADJUSTMENT",
      taxAmount: parseInt(enteredTaxHeadAmount),
      collectionAmount: 0.00,
      additionalDetails: null,
    }
    editableDemandDetail.push(newTaxHead);
    console.log(editableDemandDetail)
    demands[0].demandDetails = editableDemandDetail;
    try {
      let updatedRes = await updateDemand(demands);

      if (updatedRes && updatedRes.Demands && updatedRes.Demands.length > 0) {

        const route = `/wns/acknowledgement?purpose=update&status=success&connectionNumber=${consumerCode}&tenantId=${tenantId}`;
        store.dispatch(
          setRoute(route)
        )
        store.dispatch(hideSpinner())
      }

    } catch (error) {
      console.log(error, "Nero Error")
      store.dispatch(toggleSnackbar(
        true,
        {
          labelName: "Please select date",
          labelKey: error.message,
        },
        "error"
      ));
      store.dispatch(hideSpinner())
    }

  }
  onCancelButtonCLick = (e) => {
    //console.log(e.target, buttonLable, "Nero Event")
    this.setState({ isEditVisible: false })
    store.dispatch(prepareFinalObject('taxRoundOffAmount', 0))
  }
  editLastDemandData = async (data) => {
    this.setState({ isEditVisible: true })

  }
  render() {
    const { Demands, onActionClick, classes, totalBillAmount} = this.props;
    let editVisiable = false;
    //console.log(Demands, totalBillAmount, "Nero Demands totalBillAmount")
    let {isEditVisible} = this.state;
    if(totalBillAmount < 1){
      isEditVisible = true
    }
this.state.isEditVisible
    return (
      <div>
        {editVisiable == true ? "" : Demands && Demands.length > 0 ? (
          Demands.map((item, index) => {
            return (
              <Card className={classes.card}>
                <CardContent>
                  {Demands.length > 0 && index == 0 && !isEditVisible ?

                    <div className="linkStyle" onClick={() =>
                      this.editLastDemandData(Demands[0])}>
                      <a
                        style={{
                          height: 36,
                          lineHeight: "auto",
                          minWidth: "inherit",
                          marginLeft: "20px",
                          float: "right",
                          color: "#fe7a51",
                          cursor: "pointer",
                          fontWeight: "bold"
                        }}>{'ADJUST'}
                      </a>
                    </div>
                    //   <Button
                    //   style={{
                    //     height: 36,
                    //     lineHeight: "auto",
                    //     minWidth: "inherit",
                    //     marginLeft: "20px",
                    //     float: "right"
                    //   }}
                    //   className="assessment-button"
                    //   variant="contained"
                    //   color="primary"
                    //   onClick={this.editLastDemandData(Demands[0])}
                    // >
                    //   <LabelContainer
                    //     labelName={`ADJUST`}
                    //     labelKey=
                    //     {`ADJUST`}
                    //   />
                    // </Button>

                    : ""}
                  <div>
                    <Grid container style={{ marginBottom: 12 }}>
                      <Grid item md={4} xs={6}>
                        <LabelContainer
                          labelKey="WS_DEMAND_PAYER_NAME_LABEL"
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                        />
                      </Grid>
                      <Grid item md={8} xs={6}>
                        <Label
                          labelName={item.payername}
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container style={{ marginBottom: 12 }}>
                      <Grid item md={4} xs={6}>
                        <LabelContainer
                          labelKey="WS_DEMAND_PERIOD_LABEL"
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                        />
                      </Grid>
                      <Grid item md={8} xs={6}>
                        <Label
                          labelName={`${convertEpochToDate(item.taxPeriodFrom)} - ${convertEpochToDate(item.taxPeriodTo)}`}
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                        />
                      </Grid>
                    </Grid>

                    {item && item.demandDetails && item.demandDetails.length > 0 ?
                      (
                        item.demandDetails.map((taxHeadItem) => {
                          return (
                            <Grid container style={{ marginBottom: 12 }}>
                              <Grid item md={4} xs={6}>
                                <LabelContainer
                                  labelKey={taxHeadItem.taxHeadMasterCode}
                                  fontSize={14}
                                  style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                                />
                              </Grid>
                              <Grid item md={8} xs={6}>
                                <Label
                                  labelName={taxHeadItem.taxAmount}
                                  fontSize={14}
                                  style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                                />
                              </Grid>
                            </Grid>
                          )
                        })
                      )
                      : ""}
                    {Demands.length > 0 && index == 0 && this.state.isEditVisible ?
                      <Grid container style={{ marginBottom: 12 }}>
                        <Grid item md={4} xs={6}>
                          <LabelContainer
                            labelKey={`WS_ARREAR_ADJUSTMENT`}
                            fontSize={14}
                            style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                          />
                        </Grid>
                        <Grid item md={3} xs={3}>
                          <TextFieldContainer
                            pattern={/^[1-9]\d*(\.\d+)?$/i}
                            onChange={this.handleChange}
                            jsonPath={`taxRoundOffAmount`}
                          />{this.state.taxRoundOfAmountErr && <span class="MuiFormLabel-asterisk">{this.state.IntegerErrMsg}</span>}
                        </Grid>
                      </Grid> : ""}
                    {Demands.length > 0 && index == 0 && this.state.isEditVisible ?
                      <Grid container style={{ marginBottom: 12 }}>
                        <Grid item md={4} xs={6}>

                        </Grid>
                        <Grid item md={8} xs={6}>
                          <Button
                            style={{
                              height: 36,
                              lineHeight: "auto",
                              minWidth: "inherit"
                            }}
                            className="assessment-button"
                            variant="contained"
                            color="primary"
                            onClick={this.onUpdateButtonCLick}
                            disabled={this.state.taxRoundOfAmountErr ? true : false}
                          >
                            <LabelContainer
                              labelName={`UPDATE`}
                              labelKey=
                              {`UPDATE`}
                            />
                          </Button>
                          <Button
                            style={{
                              height: 36,
                              lineHeight: "auto",
                              minWidth: "inherit",
                              marginLeft: "20px"
                            }}
                            className="assessment-button"
                            variant="contained"
                            color="primary"
                            onClick={this.onCancelButtonCLick}
                          >
                            <LabelContainer
                              labelName={`CANCEL`}
                              labelKey=
                              {`CANCEL`}
                            />
                          </Button>
                        </Grid>
                      </Grid> : ""}


                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div style={{
            display: "flex",
            width: "100%",
            height: '50vh',
            alignItems: 'center',
            justifyContent: "center",
            textAlign: "center"
          }}>
            <LabelContainer
              labelKey={"No results Found!"}
            />
            {/* <Button
                style={{
                  height: 36,
                  lineHeight: "auto",
                  minWidth: "inherit"
                }}
                className="assessment-button"
                variant="contained"
                color="primary"
                onClick={this.onButtonCLick}
              >
                <Label labelKey="NEW TRADE LICENSE" />
              </Button> */}
          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = state => {
  const Demands = get(
    state.screenConfiguration.preparedFinalObject,
    "Demands",
    []
  );

  const totalBillAmount = get(
    state.screenConfiguration.preparedFinalObject,
    "totalBillAmountForDemand",
    0
  );
  const screenConfig = get(state.screenConfiguration, "screenConfig");


  let newArray = [];
  for (let i = 0; i < Demands.length; i++) {
    newArray.push({ payername: Demands[i].payer.name, taxPeriodTo: Demands[i].taxPeriodTo, taxPeriodFrom: Demands[i].taxPeriodFrom, demandDetails: sumTaxHeads(Demands[i].demandDetails) })
  }
//console.log(newArray, "Nero Array")
  return { screenConfig, Demands: newArray, totalBillAmount };
};
const mapDispatchToProps = dispatch => {
  return {
    setRoute: path => dispatch(setRoute(path)),

    toggleSnackbar: (open, message, variant) => dispatch(toggleSnackbar(open, message, variant))

  };
};
export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps
)(MeterReading)
);