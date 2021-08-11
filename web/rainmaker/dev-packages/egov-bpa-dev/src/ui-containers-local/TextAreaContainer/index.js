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

const fieldConfig = {
  comments: {
      label: {
        labelName: "Approval/Rejection Note",
        labelKey: "BPA_APPROVAL_REJECTION_NOTE_HEADER"
      },
      placeholder: {
        labelName: "Approval/Rejection Note Placeholder",
        labelKey: "BPA_APPROVAL_REJECTION_NOTE_PLACEHOLDER"
      }
    }
  };
  
class TextAreaDialog extends Component {
  state = {
    comments : ''
  }

  saveDetails = () => {
    // to split message based on enter key pressed
    let getArray = this.state.comments.split('\n')
    let sentences = getArray && getArray.length > 0 && getArray.map( ele => {
      return {
        "Approval/Rejection Note" : ele
      }
    })

    if(sentences && sentences.length > 1){
      store.dispatch(
        handleField(
          "search-preview",
          "components.div.children.body.children.cardContent.children.commentsContainer",
          "visible",
          false
        )
      );
      store.dispatch(
        handleField(
          "search-preview",
          "components.div.children.body.children.cardContent.children.commentsContainerMultiLine",
          "visible",
          true
        )
      );
  
    }else{
      store.dispatch(
        handleField(
          "search-preview",
          "components.div.children.body.children.cardContent.children.commentsContainer",
          "visible",
          true
        )
      );
      store.dispatch(
        handleField(
          "search-preview",
          "components.div.children.body.children.cardContent.children.commentsContainerMultiLine",
          "visible",
          false
        )
      );
    }
    store.dispatch(prepareFinalObject("approverNoteArray", sentences));
    store.dispatch(prepareFinalObject("BPA.additionalDetails.approverNote", this.state.comments));
    store.dispatch(
      handleField("search-preview", "components.commentsPopup", "props.open", false)
   );
  }

  resetMessage = () => {
    this.setState({
      comments:""
    })
  }

  componentDidMount = () => {
  };

  closeDialog = () => {
    store.dispatch(
      handleField("search-preview", "components.commentsPopup", "props.open", false)
   );
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
                    <LabelContainer labelName="Approval/Rejection Note"
                    labelKey="BPA_APPROVAL_REJECTION_NOTE_HEADER" />
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
                <Grid
                    item
                    sm="12"
                    style={{
                      marginTop: 16,
                      fontSize:13
                    }}>
                  <LabelContainer
                    labelName="BPA_APPROVAL_REJECTION_NOTE"
                    labelKey="BPA_APPROVAL_REJECTION_NOTE"
                  />
                  </Grid>
                  <Grid
                    item
                    sm={12}
                    style={{
                      marginTop: 12
                    }}>
                      <TextFieldContainer
                        value= {this.state.comments}
                        rows =  "4"
                        multiline = {true}
                        placeholder = {{
                          labelName: "Approval/Rejection Note Placeholder",
                          labelKey: "BPA_APPROVAL_REJECTION_NOTE_PLACEHOLDER"
                        }}
                        onChange = {this.setComments}
                        title = { {
                          value: "",
                          key: "BPA_APPROVER_NOTE_LIMIT"
                        }}
                        infoIcon = "info_circle"
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
                      labelName={"BPA_RESET_BUTTON"}
                      labelKey=
                      {"BPA_RESET_BUTTON"}     
                    />
                    </Button>
                    <Button
                      variant={"contained"}
                      color={"primary"}
                      onClick={this.saveDetails}
                    >
                      <LabelContainer
                        labelName={"BPA_DONE_BUTTON"}
                        labelKey=
                          {"BPA_DONE_BUTTON"}     
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
)(TextAreaDialog);
