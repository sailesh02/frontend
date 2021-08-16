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
import {DocumentListContainer} from '../'

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
  
class NewNocContainer extends Component {
  state = {
    comments : ''
  }

  saveDetails = () => {
    store. store.dispatch(handleField(
        "search-preview",
        "components.div.children.newNoc.props",
        "open",
        true
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
        "components.div.children.newNoc.props",
        "open",
        true
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
                    <LabelContainer labelName="NOC Details"
                    labelKey="BPA_DOCUMENT_DETAILS_HEADER" />
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
                    sm="12"
                    style={{
                      marginTop: 16,
                      fontSize:13
                    }}>
                  <LabelContainer
                    labelName="BPA_SELECT_NOC_TYPE"
                    labelKey="BPA_SELECT_NOC_TYPE"
                  />
                  </Grid> */}
                  <Grid
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
                  textAlign: "right"
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
)(NewNocContainer);
