import React, { Component } from "react";
import { connect } from "react-redux";
import formHoc from "egov-ui-kit/hocs/form";
import { Screen } from "modules/common";
import DigitalSignatureForm from "./components/DigitalSignatureForm";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
// import GenericForm from "egov-ui-kit/common/GenericForm";

const DigitalSignatureFormHOC = formHoc({ formKey: "digitalSignatureRegistration" })(DigitalSignatureForm);

class DigitalSignatureRegistration extends Component {
  render() {
    const { toggleSnackbarAndSetText } = this.props;
    return (
      <Screen className="employee-change-passwd-screen">
        <DigitalSignatureFormHOC toggleSnackbarAndSetText={toggleSnackbarAndSetText} />
      </Screen>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleSnackbarAndSetText: (open, message, error) => dispatch(toggleSnackbarAndSetText(open, message, error)),
  };
};

export default connect(
  null,
  mapDispatchToProps
)(DigitalSignatureRegistration);
