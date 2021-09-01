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
import { getLocale, getTenantId,getAccessToken, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import axios from 'axios';
import { toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {getTokenList} from './functions'
const authToken = getAccessToken();
let RequestInfo = {
  apiId: "Rainmaker",
  ver: ".01",
  // ts: getDateInEpoch(),
  action: "_search",
  did: "1",
  key: "",
  msgId: `20170310130900|${getLocale()}`,
  requesterId: "",
  authToken
};
let customRequestInfo = JSON.parse(getUserInfo())
class DigitalSignatureDialog extends Component {
  state = {
    tokensArray : '',
    ceriticatesArray : '',
    password : '',
    selectedToken : '',
    selectedCeritificate : ''

  }

  setPassword = (e) => {
      this.setState({
        password : e.target.value
      })
  }

  onChangeToken = (e) => {

  }

  oncChangeCertificate = (e) => {

  }

  register = () => {
    
  }

  getTokenList = () => {
    let tokenList = []
    store.dispatch(toggleSpinner());
    RequestInfo = { ...RequestInfo,"userInfo" :customRequestInfo};
    let body =  Object.assign(
      {},
      {
        RequestInfo,
        "tenantId":getTenantId(),
        "responseData":null, responseData:null
      }
    );
    
    axios.post("/DSC/getR1R2", body, { // to get R1 R2
      'Content-Type': 'application/json',
      'Accept': 'application/json'
     })
      .then(response => {
        // response.data.input
      })
      .catch(error => {
        let response = {
          "ResponseInfo":null,
          "input":{
          "encryptedRequest":"XXXX",
              "encryptionKeyId":"YYYYY"
          }
        } 
        let body = response.input
        axios.post("/.emudhra.com:26769/DSC/ListToken", body, { // to get R1 R2
          'Content-Type': 'application/json',
          'Accept': 'application/json'
         })
          .then(response => {
            // response.responseData
          })
          .catch(error => {
            let response = {
              "responseData": "QuyKW0m6EdBEuTltdWrj2rA5O77bukrGcxlpp4atnn0KoadBXlTZXoEpHp3Q3Qxne1pcmXUSBedS3Ocj3/5Nqjtj6Q1QuqQxo1yMtoOmeGjlilICxaqs9ldgRu8rlbuXrzeip6VMqMCEM+f21+tKf3c4UKWd6/gYOg8rG+37HAVDRAjz21HECLLP2lq3bThBTIPog74D8Lvs4MHXE7D28kd2znHny2v/r3lGnmLxmzYlMiBUlYPnPQa8WSyOROpfXNDnD0/fgiIUuNA82mXC7F7x4VHf+GYj94aldkeSE7MKSqDPRsSp3/4gJ4Y8bHNa",
              "status": 1,
              "errorMessage": null,
              "version": "3.1.0.0",
              "errorCode": null
             }

             RequestInfo = { ...RequestInfo,"userInfo" :customRequestInfo};
             let body =  Object.assign(
               {},
               {
                 RequestInfo,
                 "tenantId":getTenantId(),
                 "responseData":null, responseData:response.responseData
               }
             
             );
            axios.post("/dsc-services/dsc/_getTokens", body, { // to get R1 R2
              'Content-Type': 'application/json',
              'Accept': 'application/json'
             })
              .then(response => {
                // response.responseData
              })
              .catch(error => { //will return tokens
                let response = {
                  "ResponseInfo":null,
                  "tokens":[
                  "Token 1",
                      "Token 2"
                  ]
                  } 
                let requiredTokenFormat = response.tokens.map (token => {
                  return {
                    label : token,
                    value : token
                  }
                }) 
                tokenList = requiredTokenFormat
                this.setState({
                  tokensArray : requiredTokenFormat,
                  selectedToken : requiredTokenFormat[0].label
                })
                store.dispatch(toggleSpinner());  
              });
          });
      });
      return tokenList
  
  }

  componentDidMount = () => {
     this.getTokenList()
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
                        onChange={this.onChangeToken}
                        label={{
                            labelName: "Token",
                            labelKey: "CORE_COMMON_TOKEN_LABEL"
                          }}
                        placeholder={{
                            labelName: "Select Token",
                            labelKey: "CORE_COMMON_SELECT_TOKEN_LABEL"
                          }}
                        data={this.state.tokensArray}
                        optionValue="value"
                        optionLabel="label"
                        hasLocalization={false}
                        value = {this.state.selectedToken}
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
                      fontSize: '11px',
                      fontWeight: 500
                  }}
                  labelName={"CORE_COMMON_PASSWORD_LABEL"}
                    labelKey={"CORE_COMMON_PASSWORD_LABEL"} />
                  </Grid>
                  <form style={{width:"100%"}} autocomplete="off">
                  <Grid
                    item
                    sm={12}
                    style={{
                      marginTop: 12
                    }}>
                    <TextfieldWithIcon
                        type ="password"
                        style={{ marginRight: "15px" }}
                        pattern = "^([a-zA-Z0-9!])+$"
                        onChange ={ this.setPassword}
                        hasLocalization={false}
                        value = {this.state.password}
                      />
                  </Grid>
                  </form>
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
