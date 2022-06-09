import React from "react";
import { connect } from "react-redux";
import { Grid, Typography, Button } from "@material-ui/core";
import {
  LabelContainer,
  TextFieldContainer
} from "egov-ui-framework/ui-containers";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core/styles";
import { UploadMultipleFiles } from "egov-ui-framework/ui-molecules";
import {
  prepareFinalObject,
  toggleSnackbar,
  handleScreenConfigurationFieldChange as handleField
 } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import get from "lodash/get";
import set from "lodash/set";

import store from "ui-redux/store";

const styles = theme => ({
  root: {
    marginTop: 24,
    width: "100%"
  }
});

class CloseDialog extends React.Component {
  state = {
    employeeList: [],
    roles: "",

  };

  render() {

    let {
      onClose,
      handleFieldChange,
      updateTheApplication,
      applicationAction,
      error,
      errorMessage
    } = this.props;
    let fullscreen = false;
    if (window.innerWidth <= 768) {
      fullscreen = true;
    }

    onClose = () => {
      const {screen, jsonpath} = this.props;
      
      store.dispatch(
        handleField(screen, jsonpath, "props.open", false)
      );
    }

    

    return (
      <div>
        <Grid
          container="true"
          spacing={12}
          marginTop={16}
          className="action-container"
        >
          <Grid
            style={{
              alignItems: "center",
              display: "flex"
            }}
            item
            sm={10}
          >
            <Typography component="h2" variant="subheading">
              {/* <LabelContainer {...dialogHeader} /> */}
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
            onClick={onClose}
          >
            <CloseIcon />
          </Grid>
          
          
        </Grid>
      </div>
    );
  }
}



export default withStyles(styles)(
  connect(
    null,
    null
  )(CloseDialog)
);

