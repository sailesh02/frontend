import { Dialog, DialogContent } from "@material-ui/core";
import Label from "egov-ui-kit/utils/translationNode";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid, Typography, Button } from "@material-ui/core";
import { Container } from "egov-ui-framework/ui-atoms";
import store from "ui-redux/store";
import { prepareFinalObject,toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  LabelContainer,
  TextFieldContainer
} from "egov-ui-framework/ui-containers";
import {
    TextfieldWithIcon
} from "egov-ui-framework/ui-molecules"
import CloseIcon from "@material-ui/icons/Close";
import "./index.css";
import {
    handleScreenConfigurationFieldChange as handleField
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import TextField from "material-ui/TextField";

class DigitalSignatureDialog extends Component {
  state = {
    comments : '',
    password : '',
  }

  setPassword = (e) => {
      this.setState({
        password : e.target.value
      })
  }

  render() {
    let { closeDigitalSignatureDialog,openDigitalSignaturePopup,okText,resetText,title} = this.props;
   
    return (
      <Dialog
      fullScreen={false}
      open={openDigitalSignaturePopup}
      onClose={closeDigitalSignatureDialog}
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
                    <LabelContainer labelName={title}
                    labelKey={title} />
                  </Typography>
                </Grid>
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
                  onClick={closeDigitalSignatureDialog}
                >
                  <CloseIcon />
                </Grid>
                  <Grid
                    item
                    sm={12}
                    style={{
                      marginTop: 12
                    }}>
                      <TextFieldContainer
                        select={true}
                        style={{ marginRight: "15px" }}
                        label={{
                            labelName: "Token",
                            labelKey: "CORE_COMMON_TOKEN_LABEL"
                          }}
                        placeholder={{
                            labelName: "Select Token",
                            labelKey: "CORE_COMMON_SELECT_TOKEN_LABEL"
                          }}
                        data={[]}
                        optionValue="value"
                        optionLabel="label"
                        hasLocalization={false}
                        value = {"ksjk"}
                      />
                  </Grid>
                  <Grid
                    item
                    sm={12}
                    style={{
                      marginTop: 12
                    }}>
                      <TextFieldContainer
                        select={true}
                        style={{ marginRight: "15px" }}
                        label={{
                            labelName: "Token",
                            labelKey: "CORE_COMMON_CERTIFICATE_LABEL"
                          }}
                        placeholder={{
                            labelName: "Select Token",
                            labelKey: "CORE_COMMON_SELECT_CERTIFICATE_LABEL"
                          }}
                        data={[]}
                        optionValue="value"
                        optionLabel="label"
                        hasLocalization={false}
                        value = {"ksjk"}
                      />
                  </Grid>
                  <Grid item
                    sm={12}
                    style={{
                      marginTop: 12
                    }}>
                  <LabelContainer style={{
                      fontSize: '12px',
                      fontWeight: 500
                  }}
                  labelName={"CORE_COMMON_PASSWORD_LABEL"}
                    labelKey={"CORE_COMMON_PASSWORD_LABEL"} />
                  </Grid>
                  <Grid
                    item
                    sm={12}
                    style={{
                      marginTop: 12
                    }}>
                      <TextfieldWithIcon
                        type ="password"
                        autoComplete='off'
                        style={{ marginRight: "15px" }}
                        // label="CORE_COMMON_PASSWORD_LABEL"
                        // placeholder="CORE_COMMON_ENTER_PASSWORD_LABEL"
                        pattern = "^([a-zA-Z0-9!])+$"
                        onChange ={ this.setPassword}
                        hasLocalization={false}
                        value = {this.state.password}
                      />
                  </Grid>
                <Grid item sm={12}
                 style={{
                  marginTop: 8,
                  textAlign: "right"
                }}>
                  <Button
                    variant={"contained"}
                    color={"primary"}
                    onClick={this.resetMessage}
                    style={{
                      marginRight:'4px'
                    }}
                    >
                    <LabelContainer
                      labelName={resetText}
                      labelKey=
                      {resetText}     
                    />
                    </Button>
                    <Button
                      variant={"contained"}
                      color={"primary"}
                    //   onClick={this.saveDetails}
                    >
                      <LabelContainer
                        labelName={okText}
                        labelKey=
                          {okText}     
                      />
                    </Button>
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
  const { form } = state;
  return { form };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DigitalSignatureDialog);
