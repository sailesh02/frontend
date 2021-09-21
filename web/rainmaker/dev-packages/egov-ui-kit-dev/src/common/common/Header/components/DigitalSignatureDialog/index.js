import { Dialog, DialogContent } from "@material-ui/core";
import Label from "egov-ui-kit/utils/translationNode";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid, Typography, Button } from "@material-ui/core";
import { Container } from "egov-ui-framework/ui-atoms";
import store from "egov-ui-framework/ui-redux/store";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import {
  LabelContainer,
  TextFieldContainer
} from "egov-ui-framework/ui-containers";
import {
    TextfieldWithIcon
} from "egov-ui-framework/ui-molecules"
import CloseIcon from "@material-ui/icons/Close";
import "./index.css";
import { hideSpinner,showSpinner } from "egov-ui-kit/redux/common/actions";
import TextField from "material-ui/TextField";
import { getLocale, getTenantId,getAccessToken, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import axios from 'axios';

const passwordPattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
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
    selectedCeritificate : '',
    passwordErr:false

  }

  setPassword = (e) => {
    if(e.target.value.match(passwordPattern)){
      this.setState({
        password : e.target.value,
        passwordErr:false
      })
    }else{
      this.setState({
        password : e.target.value,
        passwordErr:true
      })
    }
  }

  onChangeCertificate = (e) => {
    this.setState({
      selectedCeritificate:e.target.value
    })
  }

  getCertificateList = (token) => {
    this.props.showSpinner();
    RequestInfo = { ...RequestInfo,"userInfo" :customRequestInfo};
    let body =  Object.assign(
      {},
      {
        RequestInfo,
        "tenantId":getTenantId(),
        "responseData":null,
        "tokenDisplayName":token
      }
    );
    
    axios.post("/dsc-services/dsc/_getInputCertificate", body, { // to get R1 R2
      'Content-Type': 'application/json',
      'Accept': 'application/json'
     })
      .then(response => {
        let body = response.data.input
        axios.post("https://localhost.emudhra.com:26769/DSC/ListCertificate", body, { // to get R1 R2
          'Content-Type': 'application/json',
          'Accept': 'application/json'
         })
          .then(response => {
             RequestInfo = { ...RequestInfo,"userInfo" :customRequestInfo};
             let body =  Object.assign(
               {},
                {
                 RequestInfo,
                 "tenantId":getTenantId(),
                  responseData:response.data.responseData,
                  tokenDisplayName:token
                }
             );
            axios.post("/dsc-services/dsc/_getCertificate", body, { // to get R1 R2
              'Content-Type': 'application/json',
              'Accept': 'application/json'
             })
              .then(response => {
              
                let requiredCertificateFormat = response && response.data && response.data.certificates &&
                response.certificates.map (certificate => {
                  return {
                    label : certificate.commonName,
                    value : certificate.keyId
                  }
                }) 
                this.props.hideSpinner();
                this.setState({
                  ceriticatesArray : requiredCertificateFormat,
                })
              })
              .catch(error => {
                this.props.hideSpinner();

              });
          })
          .catch(error => {
            this.props.hideSpinner();

          });
      })
      .catch(error => {
        this.props.hideSpinner();
      });
  }

  getTokenList = () => {
    this.props.showSpinner();
    RequestInfo = { ...RequestInfo,"userInfo" :customRequestInfo};
    let body =  Object.assign(
      {},
      {
        RequestInfo,
        "tenantId":getTenantId(),
        "responseData":null
      }
    );
    
    axios.post("/dsc-services/dsc/_getTokenInput", body, { // to get R1 R2
      'Content-Type': 'application/json',
      'Accept': 'application/json'
     })
      .then(response => {
        let body = response.data.input
        axios.post("https://localhost.emudhra.com:26769/DSC/ListToken", body, { // to get R1 R2
          'Content-Type': 'application/json',
          'Accept': 'application/json'
         })
          .then(response => {
             RequestInfo = { ...RequestInfo,"userInfo" :customRequestInfo};
             let body =  Object.assign(
               {},
                {
                 RequestInfo,
                 "tenantId":getTenantId(),
                 "responseData":response.data.responseData
                }
             );
            axios.post("/dsc-services/dsc/_getTokens", body, { // to get tokens
              'Content-Type': 'application/json',
              'Accept': 'application/json'
             })
              .then(response => { 
                let requiredTokenFormat = response && response.data && response.data.tokens && response.tokens.map (token => {
                  return {
                    label : token,
                    value : token
                  }
                }) 
                this.props.hideSpinner();

                if(requiredTokenFormat && requiredTokenFormat.length > 0){
                  this.setState({
                    tokensArray : requiredTokenFormat,
                    selectedToken : requiredTokenFormat[0].label
                  })
                }
              })
              .catch(error => { 
                this.props.hideSpinner();
              });
          })
          .catch(error => { 
            this.props.hideSpinner();
          });
      })
      .catch(error => {
        this.props.hideSpinner();
      });
  }

  onChangeToken = (e) => {
    this.setState({
      selectedToken:e.target.value
    })
    this.getCertificateList(e.target.value)
  }

  // generate digital signature
  saveDetails = () => {
    if(this.state.selectedToken && this.state.selectedToken != " " && 
    this.state.selectedCeritificate && this.state.selectedCeritificate != " " &&
    this.state.password && this.state.password != " " && this.state.password.match(passwordPattern)){
      this.props.showSpinner();
      RequestInfo = { ...RequestInfo,"userInfo" :customRequestInfo};
      let body =  Object.assign(
        {},
        {
          RequestInfo,
          "tenantId":getTenantId(),
          "tokenDisplayName":this.state.selectedToken,
          "keyStorePassPhrase":this.state.password,
          "keyId":this.state.selectedCeritificate,
          "channelId":"ch1",
          responseData:null
        }
      );
      
      axios.post("/dsc-services/dsc/_dataSignInput", body, { // to get R1 R2
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       })
        .then(response => {
          this.props.showSpinner();
          let body = response.data.input
          axios.post("https://localhost.emudhra.com:26769/DSC/PKCS7Sign", body, { // to get R1 R2
            'Content-Type': 'application/json',
            'Accept': 'application/json'
           })
            .then(response => {
              this.props.showSpinner();
               RequestInfo = { ...RequestInfo,"userInfo" :customRequestInfo};
               let body =  Object.assign(
                 {},
                  {
                   RequestInfo,
                   "tenantId":getTenantId(),
                   "tokenDisplayName":this.state.selectedToken,
                   "keyStorePassPhrase":this.state.password,
                   "keyId":this.state.selectedCeritificate,
                   "channelId":"ch1",
                   "responseData":response.data.responseData
                  }
               );
              axios.post("/dsc-services/dsc/_dataSign", body, { // to get R1 R2
                'Content-Type': 'application/json',
                'Accept': 'application/json'
               })
                .then(response => {
                  this.props.hideSpinner();
                    if(response && response.data && response.data.result && response.data.result == "Success"){
                      this.props.toggleSnackbarAndSetText(
                          true,
                          {
                            labelName: "CORE_COMMON_SIGNATURE_SUCCESS_MSG",
                            labelKey: "CORE_COMMON_SIGNATURE_SUCCESS_MSG"
                          },
                          "success"
                      );
                      this.props.closeDigitalSignatureDialog()
                    }else{
                      this.props.toggleSnackbarAndSetText(
                        true,
                        {
                          labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                          labelKey: "CORE_COMMON_SIGNATURE_FAILURE_MSG"
                        },
                        "error"
                    );
                    }
                    this.props.showSpinner();
                })
                .catch(error => {
                  this.props.toggleSnackbarAndSetText(
                    true,
                    {
                      labelName: "CORE_COMMON_SIGNATURE_FAILURE_MSG",
                      labelKey: "CORE_COMMON_SIGNATURE_FAILURE_MSG"
                    },
                    "error"
                );
                  this.props.hideSpinner();
                  });
            })
            .catch(error => {
              this.props.hideSpinner();
            });
        })
        .catch(error => {
          this.props.hideSpinner();
        });
    }else{
      this.props.toggleSnackbarAndSetText(
        true,
        {
          labelName: "CORE_COMMON_FILL_ALL_DETAILS",
          labelKey: "CORE_COMMON_FILL_ALL_DETAILS"
        },
        "warning"
    );
    return
    }
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
                        required={true}
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
                        required={true}
                        select={true}
                        onChange={this.onChangeCertificate}
                        style={{ marginRight: "15px" }}
                        label={{
                            labelName: "Certificate",
                            labelKey: "CORE_COMMON_CERTIFICATE_LABEL"
                          }}
                        placeholder={{
                            labelName: "Select Certificate",
                            labelKey: "CORE_COMMON_SELECT_CERTIFICATE_LABEL"
                          }}
                        data={this.state.ceriticatesArray}
                        optionValue="value"
                        optionLabel="label"
                        hasLocalization={false}
                        value = {this.state.selectedCeritificate}
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
                    labelKey={"CORE_COMMON_PASSWORD_LABEL"} /><span>&thinsp;*</span>
                  </Grid>
                  <form style={{width:"100%"}} autocomplete="off">
                  <Grid
                    item
                    sm={12}
                    style={{
                      marginTop: 12
                    }}>
                    <TextfieldWithIcon
                        required={true}
                        type ="password"
                        style={{ marginRight: "15px" }}
                        onChange ={ this.setPassword}
                        hasLocalization={false}
                        value = {this.state.password}
                      />
                  </Grid>
                  {this.state.passwordErr && <Grid item sm={12}>
                    <span className="colorRed">Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character</span>
                  </Grid>}
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
                      onClick={this.saveDetails}
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
    showSpinner: () => dispatch(showSpinner()),
    hideSpinner : () => dispatch(hideSpinner()),
    toggleSnackbarAndSetText: (open, message, variant) => {
      dispatch(toggleSnackbarAndSetText(open, message, variant));
    }  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DigitalSignatureDialog);
