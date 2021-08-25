import { Dialog, DialogContent } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid, Typography, Button } from "@material-ui/core";
import { Container } from "egov-ui-framework/ui-atoms";
import store from "ui-redux/store";
import { prepareFinalObject,toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  LabelContainer
} from "egov-ui-framework/ui-containers";
import CloseIcon from "@material-ui/icons/Close";
import "./index.css";
import {
    handleScreenConfigurationFieldChange as handleField
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {DocumentListContainer} from '..'
import { getLoggedinUserRole } from "../../ui-config/screens/specs/utils/index.js";
import {
  getTransformedLocale,
} from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from "../../ui-utils/api";
import { createNoc, getNocSearchResults, getAdditionalDetails,prepareNOCUploadDataAfterCreation } from "../../ui-utils/commons"
import get from "lodash/get";

class TriggerNOCContainer extends Component {
  state = {
    comments : ''
  }

  prepareDocumentsForPayload = async (wfState) => {
    const {preparedFinalObject} = this.props
    const {nocDocumentsDetailsRedux} = preparedFinalObject
    let appDocumentList = nocDocumentsDetailsRedux
    let documnts = [];
    if (appDocumentList) {
      Object.keys(appDocumentList).forEach(function (key) {
        if (appDocumentList && appDocumentList[key]) {
          documnts.push(appDocumentList[key]);
        }
      });
    }

    // prepareFinalObject("nocDocumentsDetailsRedux", {});
    let requiredDocuments = [], uploadingDocuments = [];
    if (documnts && documnts.length > 0) {
      documnts.forEach(documents => {
        if (documents && documents.documents) {
          documents.documents.map(docs => {
            let doc = {};
            doc.documentType = documents.documentCode;
            doc.title = documents.documentCode;
            doc.fileStoreId = docs.fileStoreId;
            doc.fileName = docs.fileName;
            doc.fileUrl = docs.fileUrl;
            doc.link = docs.fileUrl;
            doc.name = docs.fileName;
            doc.isClickable = true;
            doc.additionalDetails = {
              uploadedBy: getLoggedinUserRole(wfState),
              uploadedTime: new Date().getTime()
            }
            if (doc.id) {
              doc.id = docs.id;
            }
            uploadingDocuments.push(doc);
          })
        }
      });
      store.dispatch(prepareFinalObject("payloadDocumentFormat",uploadingDocuments));
    }
  }

  createNoc = async (nocType) => {
    let additionalDetails = getAdditionalDetails(nocType,this.props.preparedFinalObject)
    let { payloadDocumentFormat } = this.props.preparedFinalObject
    let {BPA} = this.props.preparedFinalObject
    let payload = {
      tenantId : BPA.tenantId,
      nocNo : null,
      applicationType : BPA.applicationType,
      nocType : nocType,
      accountId : BPA.accountId,
      sourceRefId : BPA.applicationNo,
      source: "BPA",
      applicationStatus : BPA.status,
      landId : null,
      status : null,
      documents : payloadDocumentFormat,
      workflow : null,
      auditDetails : BPA.auditDetails,
      additionalDetails : additionalDetails
    }
      let response = await createNoc(payload);
      if(response){
        store.dispatch(
          toggleSnackbar(
            true,
            {
              labelName: "BPA_NOC_CREATED_SUCCESS_MSG",
              labelKey: "BPA_NOC_CREATED_SUCCESS_MSG",
            },
            "success"
          )
        )

        await getNocSearchResults([
          {
            key: "tenantId",
            value: BPA.tenantId
          },
          { key: "sourceRefId", value: BPA.applicationNo }
        ],"",true);

        store.dispatch(handleField(
          "search-preview",
          "components.div.children.triggerNocContainer.props",
          "open",
          false
        ))

        store.dispatch(handleField(
          "apply",
          "components.div.children.triggerNocContainer.props",
          "open",
          false
      ))

      }   
      prepareNOCUploadDataAfterCreation()
  };

  saveDetails = (nocType) => {
    this.prepareDocumentsForPayload("")
    this.createNoc(nocType)  
  }

  resetMessage = () => {
    this.setState({
      comments:""
    })
  }

  componentDidMount = () => {
  };

  closeDialog = () => {
    store.dispatch(handleField(
        "search-preview",
        "components.div.children.triggerNocContainer.props",
        "open",
        false
      ))

    store.dispatch(handleField(
        "apply",
        "components.div.children.triggerNocContainer.props",
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
                  height:'250px'
                }}
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
                    <LabelContainer labelName={getTransformedLocale(this.props.nocType)}
                    labelKey={`Apply For ${getTransformedLocale(this.props.nocType)}`} />
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
                  <Grid item sm={12}>
                  <Typography component="h2">
                    <LabelContainer labelName="Required Documents"
                    labelKey="BPA_DOCUMENT_DETAILS_HEADER" />
                  </Typography>
                  </Grid>
                  <Grid item sm={12}>
                      <DocumentListContainer
                        buttonLabel = {{
                          labelName: "UPLOAD FILE",
                          labelKey: "BPA_BUTTON_UPLOAD FILE"
                        }}
                        description = {{
                          labelName: "Only .jpg and .pdf files. 6MB max file size.",
                          labelKey: "BPA_UPLOAD_FILE_RESTRICTIONS"
                        }}
                        inputProps = {{
                          accept: "image/*, .pdf, .png, .jpeg"
                        }}
                        documentTypePrefix = "BPA_"
                        maxFileSize = {5000}>
                      </DocumentListContainer>
                  </Grid>
                <Grid item sm={12}
                 style={{
                  marginTop: 8,
                  textAlign: "right",
                  marginBottom:10
                }}>
                  {/* <Button
                    variant={"contained"}
                    color={"primary"}
                    onClick={this.resetMessage}
                    style={{
                      marginRight:'4px'
                    }}
                    >
                    <LabelContainer
                      labelName={"BPA_RESET_BUTTON"}
                      labelKey=
                      {"BPA_RESET_BUTTON"}     
                    />
                    </Button> */}
                    <Button
                      variant={"contained"}
                      color={"primary"}
                      onClick={() => this.saveDetails(this.props.nocType)}
                    >
                      <LabelContainer
                        labelName={"BPA_ADD_BUTTON"}
                        labelKey=
                          {"BPA_ADD_BUTTON"}     
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
  const { form,screenConfiguration } = state;
  const {preparedFinalObject} = screenConfiguration
  return { form,preparedFinalObject };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TriggerNOCContainer);
