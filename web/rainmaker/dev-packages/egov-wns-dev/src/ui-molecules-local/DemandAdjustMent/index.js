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
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import set from "lodash/set";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";

import { convertEpochToDate } from "../../ui-config/screens/specs/utils";

import { updateDemand } from "../../ui-utils/commons"
//import { getMdmsDataForMeterStatus, APPLICATIONSTATE } from "../../ui-utils/commons"
import { Button } from "egov-ui-framework/ui-atoms";
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
class MeterReading extends React.Component {

  state = {

    isEditVisible: false
  }

  handleChange = (e) => {
    console.log("Neeraj", e.target.value)
    this.setState({
      selectedDate: e.target.value
    })
    store.dispatch(prepareFinalObject('taxRoundOffAmount', e.target.value))
  }
  create_UUID = () => {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }
  onUpdateButtonCLick = async (e) => {
    // console.log(e.target, buttonLable, "Nero Event")
    let state = store.getState();
    let { screenConfiguration } = state;
    console.log(screenConfiguration, "Nero 3")
    let { preparedFinalObject } = screenConfiguration;
    console.log(preparedFinalObject, "Nero 2")
    let enteredTaxHeadAmount = preparedFinalObject && preparedFinalObject.taxRoundOffAmount
    let demands = preparedFinalObject && preparedFinalObject.Demands;
    console.log(demands, "Nero 1")
    let editableDemandDetail = demands && demands[0].demandDetails;
    let uuid = await this.create_UUID();
    console.log(uuid, "Uid neero")
    let newTaxHead = {
      id: uuid,
      //demandId: "cc306b8a-e257-46f9-b29e-fdcbea1fdc17",
      taxHeadMasterCode: "WS_ARREAR_ADJUSTMENT",
      taxAmount: parseInt(enteredTaxHeadAmount),
      collectionAmount: 0.00,
      additionalDetails: null,
      // auditDetails: {
      //   "createdBy": "2743bf22-0102-5121-bpa2-79e5d0ce0002",
      //   "lastModifiedBy": "2743bf22-0102-5121-bpa2-79e5d0ce0002",
      //   "createdTime": 1645625600573,
      //   "lastModifiedTime": 1645625600573
      // },
    }
    editableDemandDetail.push(newTaxHead);
    console.log(editableDemandDetail)
    demands[0].demandDetails = editableDemandDetail;

    await updateDemand(demands);
    console.log(state, "Nero State")
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
    const { Demands, onActionClick, classes, } = this.props;
    console.log(Demands, "Nero Demand")
    
    let editVisiable = false;
    
    return (
      <div>
        {editVisiable == true ? "" : Demands && Demands.length > 0 ? (
          Demands.map((item, index) => {
            return (
              <Card className={classes.card}>
                <CardContent>
                  {Demands.length > 0 && index == 0 && !this.state.isEditVisible ?

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
                          cursor: "pointer"
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
                          labelName={item.payer.name}
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
                        <Grid item md={8} xs={6}>
                          <TextFieldContainer

                            onChange={this.handleChange}
                            jsonPath={`taxRoundOffAmount`}
                          />
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
  // const DataForMeterReading = get(
  //   state.screenConfiguration.preparedFinalObject,
  //   "DataForMeterReading",
  //   []
  // );

  const screenConfig = get(state.screenConfiguration, "screenConfig");
  return { screenConfig, Demands };
};
const mapDispatchToProps = dispatch => {
  return {
    setRoute: path => dispatch(setRoute(path))
    // handleField: (screenKey, jsonPath, fieldKey, value) =>
    //   dispatch(handleField(screenKey, jsonPath, fieldKey, value))
  };
};
export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps
)(MeterReading)
);