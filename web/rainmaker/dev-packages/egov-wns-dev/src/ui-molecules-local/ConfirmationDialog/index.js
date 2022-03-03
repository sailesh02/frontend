import { Dialog, DialogContent } from "@material-ui/core";
import Label from "egov-ui-kit/utils/translationNode";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid, Typography, Button } from "@material-ui/core";
import { Container } from "egov-ui-framework/ui-atoms";
// import { getTodaysDateInYMD } from 'egov-ui-framework/ui-utils/commons';
import store from "ui-redux/store";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  LabelContainer,
  TextFieldContainer
} from "egov-ui-framework/ui-containers";
import { ifUserRoleExists } from "../../ui-config/screens/specs/utils";

// import { MuiPickersUtilsProvider,
//   KeyboardDatePicker,} from "@material-ui/pickers";
import CloseIcon from "@material-ui/icons/Close";
 const getCurrentDate = () => {
  var today = new Date();
  let tomorrow =  new Date()
  tomorrow.setDate(today.getDate() + 1)
  var dd = String(tomorrow.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + '-' + mm + '-' + dd;
  return today;
}
class ConfirmationDialog extends Component {
  state = {
    ownerName : '',
    selectedDate : new Date()
  }

  componentDidMount = () => {
  };

  handleDateChange = (e) => {
    this.setState({
      selectedDate : e.target.value
    })
    store.dispatch(prepareFinalObject('effectiveDate',e.target.value))
  }

  render() {
    let { open, closeDialogue, onClickFunction, dialogHeader,dialogButton, dueAmountMsg } = this.props
    return  (
      <Dialog
      fullScreen={false}
      open={open}
      onClose={closeDialogue}
      maxWidth={false}
    >
      <DialogContent
        children={
          <Container
            children={
              <Grid
                container="true"
                spacing={12}
                marginTop={16}
                className="action-container">
                <Grid
                  style={{
                    alignItems: "center",
                    display: "flex"
                  }}
                  item
                  sm={10}>
                  <Typography component="h2" variant="subheading">
                    <LabelContainer labelName={dialogHeader}
                    labelKey={dialogHeader} />
                  </Typography>
                </Grid>
                
                {ifUserRoleExists('WS_CEMP') &&
                <Grid item sm={12} marginTop={18}>
                <Grid style={{marginTop:'10px'}}
                spacing={12}>
                <Grid item sm={10} marginTop={18}>
                    <LabelContainer labelName={"WS_MODIFICATIONS_EFFECTIVE_FROM"}
                    labelKey={"WS_MODIFICATIONS_EFFECTIVE_FROM"} />
                </Grid>   
                <Grid item sm={10}>
                <TextFieldContainer
                    type="date"
                    defaultValue ={getCurrentDate()}
                    required={true}
                    inputProps = {{min: getCurrentDate()}}
                    onChange={this.handleDateChange}
                    jsonPath={`effectiveDate`}
                       />    
                </Grid>
                </Grid>  
                
                </Grid>}
                {dialogButton === "WS_DISCONNECT_CONNECTION" ?
                <Grid item sm={10} marginTop={24}>
                    <LabelContainer style={{color: "#FE7A51"}} labelName={"WS_MODIFICATIONS_EFFECTIVE_FROM"}
                    labelKey={dueAmountMsg} />
                </Grid> : ""
                }
                <Grid
                  item
                  sm={2}
                  style={{
                    textAlign: "right",
                    cursor: "pointer",
                    position: "absolute",
                    right: "16px",
                    top: "16px"
                  }}
                  onClick={closeDialogue}
                >
                  <CloseIcon />
                </Grid>
             
                <Grid item sm="12"
                 >
                  <Grid sm={12} style={{ textAlign: "right" }} className="bottom-button-container">
                    <Button
                      variant={"contained"}
                      color={"primary"}
                      style={{
                        minWidth: "200px",
                        marginTop:'20px',
                        height: "48px"
                      }}
                      className="bottom-button"
                      onClick={() => {
                        onClickFunction(this.state.selectedDate)}}
                      >
                      <LabelContainer
                        labelName={dialogButton}
                        labelKey=
                          {dialogButton}     
                      />
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            }
          />
        }
      />
    </Dialog>
    ) 
  }
}

const mapStateToProps = (state) => {
 
  return { state };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmationDialog);