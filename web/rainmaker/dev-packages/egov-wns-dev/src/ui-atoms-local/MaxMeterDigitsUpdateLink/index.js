import { LabelContainer } from "egov-ui-framework/ui-containers";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { routeTo } from "egov-ui-kit/utils/PTCommon/FormWizardUtils/formActionUtils";
import get from "lodash/get";
import React from "react";
import ConfirmationDialog from "../ConfirmationDialog";
import { connect } from "react-redux";
import store from "ui-redux/store";
import { httpRequest } from "../../ui-utils/api";
import { toggleSpinner,hideSpinner, showSpinner, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";

const styles = {
 // color: "rgba(0, 0, 0, 0.87)",
  lineHeight: "35px",
  fontSize: "16px"
};

const clickHereStyles = {
  cursor: "pointer",
  textDecoration: "none",
  color: "#FE7A51"
}
class MaxMeterDigitsUpdateLink extends React.Component {
  state = {
    open: false,
    openDialog: false,
    dialogHeader: 'Update Information',
    dialogButton: 'Update'
  };

  closeDialogue = () => {
    this.setState({
      openDialog: false
    })
    //  store.dispatch(prepareFinalObject('effectiveDate',getCurrentDate()))
  }
  onClickFunction = async (maxMeterDigits) => {
    console.log(maxMeterDigits, "Nero Max Meter Digtis")
    let waterUpdatePayload;
    if(maxMeterDigits !== undefined && maxMeterDigits !== ""){
    let tenantId = getQueryArg(window.location.href,"tenantId")
    let connectionNumber = getQueryArg(window.location.href,"connectionNumber")
    try {
      let queryObject = [
        { key: "tenantId", value: tenantId },
        { key: "connectionNumber", value: connectionNumber },
        { key: "searchType",value:"CONNECTION"}
      ];
      const response = await httpRequest(
        "post",
        "/ws-services/wc/_search",
        "_search",
        queryObject
    );
    console.log(response, "Nero res")
    if (response.WaterConnection && response.WaterConnection.length > 0) {
        // store.dispatch(hideSpinner())
        // return response;
        waterUpdatePayload = response.WaterConnection[0]
    }
    } catch (error) {
      console.log(error, "Error")
    }
    let payload = waterUpdatePayload;
    payload.applicationType = "UPDATE_MAX_METER_DIGITS"
    payload.additionalDetails.maxMeterDigits = maxMeterDigits;
    console.log(waterUpdatePayload, "Nero water");
    // return false;
    store.dispatch(toggleSpinner())
    setTimeout(async () => {
      try {
        let updateConnection = await httpRequest("post", "/ws-services/wc/_update", "", [], { WaterConnection: payload });
        this.closeDialogue()
        //let purpose = this.state.dialogButton == "WS_DISCONNECT_CONNECTION" ? "disconnect" : this.state.dialogButton == "WS_RECONNECTION" ? "reconnection" : "closeConnection";
        let status = "success";
        console.log("Nero Hello")
        window.location.href = `/wns/acknowledgement?purpose=update&status=${status}&tenantId=${tenantId}`
        // store.dispatch(
        //   setRoute(
        //     `/wns/acknowledgement?purpose=update&status=${status}&tenantId=${tenantId}`
        //   )
        // );
        store.dispatch(hideSpinner())

      } catch (err) {
       
        store.dispatch(hideSpinner())
        store.dispatch(toggleSnackbar(
          true,
          {
            labelName: "API Error",
            labelKey: err.message,
          },
          "error"
        ));
      }
    }, 2000)
  }else{
    store.dispatch(toggleSnackbar(
      true,
      {
        labelName: "Please select date",
        labelKey: "Please select max meter digits",
      },
      "error"
    ));
  }

  }



  render() {
    const {maxMeterDigitsAvailable} = this.props;
    return (
      <div style={styles} className={"property-buttons"}>
        { maxMeterDigitsAvailable == "NO" ?  
        <a href="javascript:void(0)" onClick={() => this.setState({
          openDialog: true
        })} >
          <LabelContainer
            style={clickHereStyles}
            labelKey="WS_UPDATE_MAX_METER_DIGITS" />
        </a>
        : "" }
        {this.state.openDialog && <ConfirmationDialog open={this.state.openDialog} closeDialogue={this.closeDialogue}
          dialogHeader={this.state.dialogHeader} onClickFunction={this.onClickFunction} dialogButton={this.state.dialogButton}></ConfirmationDialog>}
         
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleSnackbar: (open, message, variant) =>
      dispatch(toggleSnackbar(open, message, variant)),
    setRoute: (route) => dispatch(setRoute(route)),
  };
};

const mapStateToProps = (state) => {
  let connectionObj = get(
    state.screenConfiguration.preparedFinalObject,
    "WaterConnection",
    []
  );

  let maxMeterDigitsAvailable = "NO";
  const additionalDetails =
    connectionObj && connectionObj.length > 0
      ? connectionObj[0].additionalDetails
      : "";

   if(additionalDetails && additionalDetails.hasOwnProperty("maxMeterDigits") && additionalDetails.maxMeterDigits !== undefined && additionalDetails.maxMeterDigits != "" && additionalDetails.maxMeterDigits > 0){
    maxMeterDigitsAvailable = "YES";
   }
   return {maxMeterDigitsAvailable}
}

export default connect(mapStateToProps, mapDispatchToProps)(MaxMeterDigitsUpdateLink);
