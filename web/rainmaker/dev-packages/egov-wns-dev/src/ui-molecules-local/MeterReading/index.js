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
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import get from "lodash/get";
import store from "ui-redux/store";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import set from "lodash/set";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { meterReadingEditable } from "../../ui-config/screens/specs/wns/meterReading/meterReadingEditable";
import { convertEpochToDate } from "../../ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getSearchResults, getMdmsDataForAutopopulated, isWorkflowExists } from "../../ui-utils/commons"
import { getMdmsDataForMeterStatus,APPLICATIONSTATE } from "../../ui-utils/commons"
import { getMaxMeterDigits } from '../../ui-config/screens/specs/wns/searchResource/bulkImportApplication'

const styles = {
  card: {
    marginLeft: 8,
    marginRight: 8,
    borderRadius: "inherit"
  },
  editStyle:{
    color:'white',
    float:'right',
    backgroundColor:"#DB6844",
    
  }
};
class MeterReading extends React.Component {
  editMeterData =async(data)=>{
    // console.log(data, "comingggg........................")
    
    let state = store.getState()
    // console.log(state,"sataetee")
    store.dispatch(
      handleField(
          "meter-reading",
          "components.div.children.meterReadingEditable",
          "visible",
          true
      )
  );
  store.dispatch(
    handleField(
        "meter-reading",
        "components.div.children.meterReadingEditable.children.card.children.cardContent.children.button.children.buttonContainer.children.searchButton",
        "visible",
        false
      )
)

store.dispatch(
    handleField(
        "meter-reading",
        "components.div.children.meterReadingEditable.children.card.children.cardContent.children.button.children.buttonContainer.children.editButton",
        "visible",
        true
      )
)
store.dispatch(
    handleField(
        "meter-reading",
        "components.div.children.meterReadingEditable.children.card.children.cardContent.children.button.children.buttonContainer.children.cancleButton",
        "visible",
        true
      )
)

  try {
      // let lastReadingDate = convertEpochToDate(checkBillingPeriod[0].lastReadingDate);
      // let lastDF = new Date();
      // let endDate = ("0" + lastDF.getDate()).slice(-2) + '/' + ("0" + (lastDF.getMonth() + 1)).slice(-2) + '/' + lastDF.getFullYear()
      // data['billingPeriod'] = lastReadingDate + " - " + endDate
      // data['lastReading'] = checkBillingPeriod[0].currentReading
      data['consumption'] = ''
      // data['lastReadingDate'] = lastReadingDate
  }catch (e) { 
      console.log(e);         
      dispatch(
          toggleSnackbar(
              true,
              {
                  labelName: "Failed to parse meter reading data.",
                  labelKey: "ERR_FAILED_TO_PARSE_METER_READING_DATA"
              },
              "warning"
          )
      );
      return;
  }

    store.dispatch(
      handleField(
          "meter-reading",
          "components.div.children.meterReadingEditable.children.card.children.cardContent.children.firstContainer.children.billingCont.children.billingPeriod.props",
          "labelName",
          data.billingPeriod
      )
  );
  store.dispatch(
      handleField(
          "meter-reading",
          "components.div.children.meterReadingEditable.children.card.children.cardContent.children.thirdContainer.children.secCont.children.billingPeriod.props",
          "labelName",
          data.lastReading
      )
  );
  store.dispatch(
      handleField(
          "meter-reading",
          "components.div.children.meterReadingEditable.children.card.children.cardContent.children.lastReadingContainer.children.secCont.children.billingPeriod.props",
          "labelName",
          convertEpochToDate(data.lastReadingDate)
      )
  );
  store.dispatch(
      handleField(
          "meter-reading",
          "components.div.children.meterReadingEditable.children.card.children.cardContent.children.sixthContainer.children.secCont.children.billingPeriod.props",
          "labelName",
          data.consumption
      )
  );
 store.dispatch(
    handleField(
        "meter-reading",
        "components.div.children.meterReadingEditable.children.card.children.cardContent.children.secondContainer.children.status",
        "visible",
         false
    )
);

store.dispatch(
  handleField(
    "meter-reading",
    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.secondContainer.children.status.props",
    "value",
    data.meterStatus
  )
);


store.dispatch(
  handleField(
    "meter-reading",
    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.secondContainer.children.secCont.children.billingPeriod.props",
    "labelName",
    data.meterStatus
  )
)

store.dispatch(
  handleField(
    "meter-reading",
    "components.div.children.meterReadingEditable.children.card.children.cardContent.children.secondContainer.children.secCont",
    "visible",
    true
  )
)
  // let todayDate = new Date()
  store.dispatch(
      handleField(
          "meter-reading",
          "components.div.children.meterReadingEditable.children.card.children.cardContent.children.fifthContainer.children.currentReadingDate.props",
          "value",
          Number(data.currentReadingDate)
      )
  );
  store.dispatch(
    handleField(
        "meter-reading",
        "components.div.children.meterReadingEditable.children.card.children.cardContent.children.fifthContainer.children.secCont.children.billingPeriod.props",
        "labelName",
        convertEpochToDate(data.currentReadingDate)
    )
);
 
store.dispatch(
  handleField(
      "meter-reading",
      "components.div.children.meterReadingEditable.children.card.children.cardContent.children.fifthContainer.children.secCont",
      "visible",
      true
  )
);
  store.dispatch(
    handleField(
        "meter-reading",
        "components.div.children.meterReadingEditable.children.card.children.cardContent.children.fifthContainer.children.currentReadingDate",
        "visible",
        false
    )
);
store.dispatch(
  handleField(
      "meter-reading",
      "components.div.children.meterReadingEditable.children.card.children.cardContent.children.button.children.buttonContainer.children.cancleSaveButton",
      "visible",
      false
    )
)

store.dispatch(
  handleField(
      "meter-reading",
      "components.div.children.meterReadingEditable.children.card.children.cardContent.children.fourthContainer.children.currentReading.props",
      "value",
      data.currentReading
  )
);
  store.dispatch(prepareFinalObject("autoPopulatedValues", data));
  store.dispatch(prepareFinalObject("metereading", data));
  }
  render() {
    const { consumptionDetails, onActionClick, classes, DataForMeterReading } = this.props;
    let state = store.getState()
  let editVisiable =   get(state.screenConfiguration, "screenConfig.meter-reading.components.div.children.meterReadingEditable.children.card.children.cardContent.children.button.children.buttonContainer.children.editButton.visible");
  // console.log(editVisiable,"editVisiable")
  // if (consumptionDetails.length > 0) {
    //   var lastReadingDate = convertEpochToDate(consumptionDetails[0].lastReadingDate)
    //   var currentReadingDate = convertEpochToDate(consumptionDetails[0].currentReadingDate)
    // }
    let unitMultiplier = 1;
    let maxMeterDigits;
    if (DataForMeterReading.length > 0) {
      unitMultiplier = DataForMeterReading[0].additionalDetails.meterReadingRatio.split(":")[1];
      maxMeterDigits = DataForMeterReading[0].additionalDetails.maxMeterDigits;
    }
    return (
      <div>
       {editVisiable == true ?"" : consumptionDetails && consumptionDetails.length > 0 ? (
          consumptionDetails.map((item,index) => {
            
            let calculatedConsumption = 0;
            if(item && item.meterStatus === "Working"){
            calculatedConsumption = (item.currentReading - item.lastReading)*unitMultiplier;
            }else if(item && item.meterStatus === "Reset"){
              calculatedConsumption = "12"
              let maxDigits =  getMaxMeterDigits(maxMeterDigits);
              let calculateReadingDiff = maxDigits - parseInt(item.lastReading);
              calculatedConsumption = calculateReadingDiff + parseInt(item.currentReading)  
              calculatedConsumption = calculatedConsumption*unitMultiplier;
            }else{
              calculatedConsumption = item.consumption;
            }
            return (
              <Card className={classes.card}>
                <CardContent>
                  {consumptionDetails.length > 1&& index == 0? <div className="linkStyle" onClick={() => 
                        this.editMeterData(consumptionDetails[0])}>
                        <a style={{ color: '#fe7a51', float:"right"}}>{'Edit'}
                        </a>
                    </div>:""}
                  <div>
                    <Grid container style={{ marginBottom: 12 }}>
                      <Grid item md={4} xs={6}>
                        <LabelContainer
                          labelKey="WS_CONSUMPTION_DETAILS_BILLING_PERIOD_LABEL"
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                        />
                      </Grid>
                      <Grid item md={8} xs={6}>
                        <Label
                          labelName={item.billingPeriod}
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container style={{ marginBottom: 12 }}>
                      <Grid item md={4} xs={6}>
                        <LabelContainer
                          labelKey="WS_CONSUMPTION_DETAILS_METER_STATUS_LABEL"
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                        />
                      </Grid>
                      <Grid item md={8} xs={6}>
                        <Label
                          labelName={item.meterStatus}
                          fontSize={14}
                          style={{ fontSize: 14 }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container style={{ marginBottom: 12 }}>
                      <Grid item md={4} xs={6}>
                        <LabelContainer
                          labelKey="WS_CONSUMPTION_DETAILS_LAST_READING_LABEL"
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                        />
                      </Grid>
                      <Grid item md={8} xs={6}>
                        <Label
                          labelName={item.lastReading}
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container style={{ marginBottom: 12 }}>
                      <Grid item md={4} xs={6}>
                        <LabelContainer
                          labelKey="WS_CONSUMPTION_DETAILS_LAST_READING_DATE_LABEL"
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                        />
                      </Grid>
                      <Grid item md={8} xs={6}>
                        <Label
                          labelName={`${convertEpochToDate(item.lastReadingDate)}`}
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container style={{ marginBottom: 12 }}>
                      <Grid item md={4} xs={6}>
                        <LabelContainer
                          labelKey="WS_CONSUMPTION_DETAILS_CURRENT_READING_LABEL"
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                        />
                      </Grid>
                      <Grid item md={8} xs={6}>
                        <Label
                          labelName={item.currentReading}
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container style={{ marginBottom: 12 }}>
                      <Grid item md={4} xs={6}>
                        <LabelContainer
                          labelKey="WS_CONSUMPTION_DETAILS_CURRENT_READING_DATE_LABEL"
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                        />
                      </Grid>
                      <Grid item md={8} xs={6}>
                        <Label
                          labelName={`${convertEpochToDate(item.currentReadingDate)}`}
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container style={{ marginBottom: 12 }}>
                      <Grid item md={4} xs={6}>
                        <LabelContainer
                          labelKey="WS_CONSUMPTION_DETAILS_CONSUMPTION_LABEL"
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
                        />
                      </Grid>
                      <Grid item md={8} xs={6}>
                        <Label
                          labelName={calculatedConsumption}
                          fontSize={14}
                          style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.87" }}
                        />
                      </Grid>
                    </Grid>
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
  const consumptionDetails = get(
    state.screenConfiguration.preparedFinalObject,
    "consumptionDetails",
    []
  );
  const DataForMeterReading = get(
    state.screenConfiguration.preparedFinalObject,
    "DataForMeterReading",
    []
  );
  
  const screenConfig = get(state.screenConfiguration, "screenConfig");
  return { screenConfig, consumptionDetails, DataForMeterReading };
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