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
import CloseIcon from "@material-ui/icons/Close";
import "./index.css";
import {
    handleScreenConfigurationFieldChange as handleField
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {DocumentListContainer} from '..'
import { getLoggedinUserRole } from "../../ui-config/screens/specs/utils/index.js";

const fieldConfig = {
    nocType: {
        label: {
          labelName: "NOC Type",
          labelKey: "BPA_NOC_TYPE_LABEL"
        },
        placeholder: {
          labelName: "Select NOC Type",
          labelKey: "BPA_NOC_TYPE_PLACEHOLDER"
        }
      }
  };
  
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
            doc.fileStoreId = docs.fileStoreId;
            doc.fileStore = docs.fileStoreId;
            doc.fileName = docs.fileName;
            doc.fileUrl = docs.fileUrl;
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

      let diffDocs = [];
      // documentsFormat && documentsFormat.length > 0 && documentsFormat.forEach(nocDocs => {
      //   if (nocDocs) {
      //     diffDocs.push(nocDocs);
      //   }
      // });

      // if (uploadingDocuments && uploadingDocuments.length > 0) {
      //   uploadingDocuments.forEach(tDoc => {
      //     diffDocs.push(tDoc);
      //   })
      // };
      store.dispatch(prepareFinalObject("payloadDocumentFormat",uploadingDocuments));

      // if (documentsFormat && documentsFormat.length > 0) {
      //   documentsFormat = diffDocs;
      //   prepareFinalObject("payloadDocumentFormat",documentsFormat);
      // }
    }
  }

  saveDetails = () => {
    this.prepareDocumentsForPayload("")
    store.dispatch(handleField(
        "search-preview",
        "components.div.children.triggerNocContainer.props",
        "open",
        false
      ))
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
  }

  setComments = (e) => {
    let stringArray = e.target.value.split(' ')
    if(stringArray.length <= 201){
      this.setState({
        comments:e.target.value
      })
    }else{
      store.dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "ERR_FILL_TWOHUNDRED_WORDS",
            labelKey: "ERR_FILL_TWOHUNDRED_WORDS"
          },
          "warning"
        )
      );
    }
  }

  render() {
    let { open } = this.props;
    console.log(open,"jkljkjkjkdjkldjfkldjfkdjkldkjdjkdfjfjdkfcjfkj")
    const dropDownData = [
    {
        value: "Noc Type",
        label: "Noc Type"
    }]

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
                  height:'400px'
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
                    <LabelContainer labelName={this.props.nocType}
                    labelKey={this.props.nocType} />
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
                  {/* <Grid
                    item
                    sm={12}
                    style={{
                      marginTop: 12
                    }}>
                  <TextFieldContainer
                        select={true}
                        style={{ marginRight: "15px" }}
                        label={fieldConfig.nocType.label}
                        placeholder={fieldConfig.nocType.placeholder}
                        data={dropDownData}
                        optionValue="value"
                        optionLabel="label"
                        hasLocalization={false}
                        //onChange={e => this.onEmployeeClick(e)}
                        onChange={e =>
                          store.dispatch(prepareFinalObject(
                            "mynocType",
                            e.target.value
                          ))
                        }
                        jsonPath={'mynocType'}
                      />
                  </Grid> */}
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
                      onClick={this.saveDetails}
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
