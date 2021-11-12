import React, { Component } from "react";
import { connect } from "react-redux";
import formHoc from "egov-ui-kit/hocs/form";
import { Screen } from "modules/common";
import DigitalSignatureForm from "./components/DigitalSignatureForm";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { hideSpinner,showSpinner } from "egov-ui-kit/redux/common/actions";
import { getLocale, getTenantId,getAccessToken, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import axios from 'axios';
import { setFieldProperty } from "egov-ui-kit/redux/form/actions";
import store from "ui-redux/store";

let RequestInfo = {};

const DigitalSignatureFormHOC = formHoc({ formKey: "digitalSignatureRegistration" })(DigitalSignatureForm);

class DigitalSignatureRegistration extends Component {

  state = {
    tokensArray : '',
    ceriticatesArray : '',
    password : '',
    selectedToken : '',
    selectedCeritificate : '',
    passwordErr:false
  }

  getRequestInfo = () => {
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
    return RequestInfo
  }

  getCustomRequestInfo = () => {
    return JSON.parse(getUserInfo())
  }

  getTokenList = () => {
    this.props.showSpinner();
    let requestInfo = this.getRequestInfo()
    RequestInfo = { ...requestInfo,"userInfo" : this.getCustomRequestInfo()};    
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
            RequestInfo = { ...requestInfo,"userInfo" : this.getCustomRequestInfo()};                 
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
                let requiredTokenFormat = response && response.data && response.data.tokens && response.data.tokens.map (token => {
                  return {
                    label : token,
                    value : token,
                    name: token,
                    value: token
                  }
                }) 
                this.props.hideSpinner();
                if(requiredTokenFormat && requiredTokenFormat.length > 0){
                  store.dispatch(setFieldProperty("digitalSignatureRegistration", "token", "dropDownData", requiredTokenFormat));
                }
              })
              .catch(error => { 
                console.log(error)
                this.props.hideSpinner();
              });
          })
          .catch(error => { 
            console.log(error)

            this.props.hideSpinner();
          });
      })
      .catch(error => {
        console.log(error)

        this.props.hideSpinner();
      });
  }

  componentDidMount = () => {
    this.getTokenList()
  }

  render() {
    const { toggleSnackbarAndSetText } = this.props;
    return (
      <Screen className="employee-change-passwd-screen">
        <DigitalSignatureFormHOC toggleSnackbarAndSetText={toggleSnackbarAndSetText} />
      </Screen>
    );
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
  mapDispatchToProps,
)(DigitalSignatureRegistration);
