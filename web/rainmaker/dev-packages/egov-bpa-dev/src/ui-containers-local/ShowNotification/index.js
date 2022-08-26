import { Dialog, DialogContent } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid, Typography, Button } from "@material-ui/core";
import { Container } from "egov-ui-framework/ui-atoms";
import store from "ui-redux/store";
import { prepareFinalObject,toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  LabelContainer,TextFieldContainer
} from "egov-ui-framework/ui-containers";
import CloseIcon from "@material-ui/icons/Close";
import {
    handleScreenConfigurationFieldChange as handleField
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {DocumentListContainerNOC} from '..'
import { getFinancialYearDates, getLoggedinUserRole } from "../../ui-config/screens/specs/utils/index.js";
import {
  getTransformedLocale,
  getQueryArg
} from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from "../../ui-utils/api";
import {fireBuildingTypeDropDownApi,getFiredistrictsDropDownApi,getFireStationsDropDownApi, createNoc, updateNoc, validateThirdPartyDetails, getNocSearchResults, getAdditionalDetails,prepareNOCUploadData, validateFireNocDetails } from "../../ui-utils/commons"
import get from "lodash/get";
import {fieldConfig,numberPattern,stringPattern, fireFileConfig} from "../../ui-molecules-local/NocDetailCardBPA"
import { withStyles } from "@material-ui/core/styles";
import commonConfig from "config/common.js";
import {convertDateToEpoch,prepareNocFinalCards} from "../../ui-config/screens/specs/utils/index"
import { CheckboxContainer } from "..";
const styles = {
    documentTitle: {
      color: "rgba(0, 0, 0, 0.87)",
      fontFamily: "Roboto",
      fontSize: "16px",
      fontWeight: 500,
      letterSpacing: "0.67px",
      lineHeight: "19px",
      marginBottom: 25,
      width: "100%",
      backgroundColor: "#FFFFFF",
      marginTop: 16,
      paddingTop: 16,
      paddingLeft: 16,    
      paddingBottom: 10,
    },
    whiteCard: {
      // maxWidth: 250,
      width: "100%",
      backgroundColor: "#FFFFFF",
      // paddingLeft: 8,
      paddingRight: 0,
      paddingTop: 3,
      paddingBottom: 10,
      marginRight: 16,
      marginTop: 8,
      marginBottom:16,
      // marginBottom:4,
      display: "inline-flex",
    },
    fontStyle: {
      fontSize: "12px",
      fontWeight: "500",
      color: "rgba(0, 0, 0, 0.87)",
      fontFamily: "Roboto",
      // width:150,
      // overflow: "hidden", 
      // whiteSpace: "nowrap",
      // textOverflow: "ellipsis",
      // marginLeft:"7px",
    },
    labelStyle: {
      position: "relative",
      fontFamily: "Roboto",
      fontSize: 14,
      letterSpacing: 0.6,
      padding: "5px 0px",
      display: "inline-block"
    },  
    underlineStyle: {
      position: "absolute",
      bottom: -1,
      borderBottom: "2px solid #FE7A51",
      width: "100%"
    },
    dividerStyle : {
      borderBottom: "1px solid rgba(5, 5, 5, 0.12)",
      width: "100%"
    },
    documentContainer: {
     backgroundColor: "#FFFFFF",
      padding: "16px",
      marginTop: "10px",
      marginBottom: "16px"
    },
    nocTitle: {
      color: "rgba(0, 0, 0, 0.87)",
    },
    spanStyle : {
      paddingLeft: "2px"
    }
  }

class ShowNotification extends Component {
  closeDialog = () => {
    store.dispatch(handleField(
      "apply",
      "components.div.children.showNotification.props",
      "open",
      false
    ))
    store.dispatch(handleField(
      "search-preview",
      "components.div.children.showNotification.props",
      "open",
      false
    ))
    
  }
  render() {
    let { open } = this.props;
    return (
      <Dialog
        fullScreen={false}
        open={open}
        onClose={this.closeDialog}
        maxWidth={false}
      >
        <DialogContent
          children={
            <Container
              children={
                <Grid
                  container="true"
                  style={{
                    height: this.props.height ? this.props.height : "270px",
                  }}
                  spacing={12}
                  marginTop={16}
                  className="action-container"
                >
                  <Grid
                    style={{
                      alignItems: "center",
                      display: "flex",
                    }}
                    item
                    sm={10}
                  >
                    <Typography component="h2" variant="subheading">
                      <LabelContainer labelName={"Please foreward application to Architect to fill the NOC details for final approval"} labelKey={"Please foreward application to Architect to fill the NOC details for final approval"} />
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
                  onClick={this.closeDialog}
                >
                  <CloseIcon />
                </Grid>
                </Grid>
                
              }
            />
          }
        />
      </Dialog>
    );
  }
}

const mapStateToProps = (state) => {
  const { form, screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  return { form, preparedFinalObject };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(ShowNotification)
);
