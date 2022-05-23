
import React, {Component} from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import classNames from "classnames";
import Button from "@material-ui/core/Button";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import groupBy from "lodash/groupBy";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import Tooltip from '@material-ui/core/Tooltip';
import { convertEpochToDate } from "../../ui-config/screens/specs/utils";

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    fontSize: 12
  }
}))(Tooltip);
const styles = {
  documentTitle: {
    color: "rgba(0, 0, 0, 0.87)",
    fontFamily: "Roboto",
    fontSize: "16px",
    fontWeight: 500,
    letterSpacing: "0.67px",
    lineHeight: "19px",
    paddingBottom: "5px"
  },
  whiteCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    paddingRight: 0,
    paddingTop: 3,
    paddingBottom: 10,
    marginRight: 16,
    marginTop: 8,
    display: "inline-flex",
  },
  fontStyle: {
    fontSize: "12px",
    fontWeight: "500",
    color: "rgba(0, 0, 0, 0.87)",
    fontFamily: "Roboto",
    width:150,
    overflow: "hidden", 
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  }
};
const fontStyle = {
  fontSize: "12px",
  fontWeight: "500",
  color: "rgba(0, 0, 0, 0.87)",
  fontFamily: "Roboto",
  width:150,
  overflow: "hidden", 
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
};

const titleStyle = {
  fontWeight: "bold",
  fontSize: "12px",
  fontFamily: "Roboto", 
};

class NocDocDetailCardBPA extends Component {
  render(){
  const { classes, docItem, docIndex, name,disabled,...rest } = this.props;

const whichApplication = process.env.REACT_APP_NAME;
  let submittedOn,
  satus = "";
  if(docItem.submissionDetails){
    if(docItem.submissionDetails.additionalDetails){
      submittedOn = docItem.submissionDetails.additionalDetails.submittedOn;
    }
    satus = docItem.submissionDetails.applicationStatus
  }
  return (
    <React.Fragment>
      <Grid container spacing={3}  className={
                this.props.backgroundGrey
                  ? classNames(classes.whiteCard, "background-grey")
                  : classes.whiteCard
              }>
        <Grid
          item={true}
          xs={12}
          className={
            this.props.backgroundGrey
              ? classNames(classes.whiteCard, "background-grey")
              : classes.whiteCard
          }
        >
          <Grid item xs={6}>
          {!docItem.documents || docItem.documents == null || docItem.documents.length == 0 ? (          
            <Typography
              variant="subtitle1"
              style={{ fontWeight: "bold", fontSize: "12px" }}
            >
            <LabelContainer
              labelKey={getTransformedLocale(docItem.documentCode)}
            />             
            </Typography> 
            ) : (
              ""
            )}           
          </Grid>
          <Grid item xs={3}>
            {!docItem.documents || docItem.documents == null || docItem.documents.length == 0 ? (
              <Typography
                variant="subtitle1"
                style={{ fontWeight: "bold", fontSize: "12px" }}
              >
                No Documents Uploaded
              </Typography>
            ) : (
              ""
            )}
          </Grid>
          <Grid item xs={3}>
            {docItem.readOnly ? (
              ""
            ) : (
             whichApplication === "Citizen"? 
              <Button
                disabled = {this.props.fromPage === "searchPreview"? false: disabled}
                color="primary"
                style={{ float: "right" }}
                onClick={() => this.props.toggleEditClick(docIndex)}
              >
                Upload Required Data
              </Button>:"" 
            )}
          </Grid>
          
        </Grid>
        {docItem.documents &&
            docItem.documents.length > 0 &&
            docItem.documents.map((doc) => {
              return(<React.Fragment 
              >
                <Grid item xs={3}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    style={titleStyle}
                  >
                    File
                  </Typography>
                  <LightTooltip title={!doc.fileName ? "" : doc.fileName} arrow>
                  <div style={fontStyle}>
                    {!doc.fileName ? "" : doc.fileName}
                  </div>
                  </LightTooltip>
                </Grid>
                <Grid item xs={2}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    style={titleStyle}
                  >
                    Uploaded By
                  </Typography>
                  <LightTooltip title={!(doc.additionalDetails && doc.additionalDetails.uploadedBy) ? "" : doc.additionalDetails.uploadedBy} arrow>
                  <div style={fontStyle}>
                    {!(doc.additionalDetails && doc.additionalDetails.uploadedBy) ? "" : doc.additionalDetails.uploadedBy}
                  </div>
                  </LightTooltip>
                </Grid>
                <Grid item xs={2}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    style={titleStyle}
                  >
                    File Type
                  </Typography>
                  
                  <div style={fontStyle}>
                    {!(doc && doc.documentType) ? "" :getTransformedLocale(doc.documentType)}
                  </div>
                </Grid>
                <Grid item xs={2}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    style={titleStyle}
                  >
                    Uploaded Date
                  </Typography>
                  
                  <div style={fontStyle}>
                    {!(doc.additionalDetails && doc.additionalDetails.uploadedTime) ? "" :convertEpochToDate(doc.additionalDetails.uploadedTime)}
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <Button
                    color="primary"
                    onClick={() => {
                      window.open(doc.link, "_blank");
                    }}
                  >
                    View File
                  </Button>
                </Grid>
              </React.Fragment>)
            })}
      </Grid>
    </React.Fragment>
  );
}
}

NocDocDetailCardBPA.propTypes = {};

export default withStyles(styles)(NocDocDetailCardBPA);
