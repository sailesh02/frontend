import React from "react";
import { connect } from "react-redux";
import { Grid, Typography, Button } from "@material-ui/core";
import { Container } from "egov-ui-framework/ui-atoms";
import {
  LabelContainer,
  TextFieldContainer
} from "egov-ui-framework/ui-containers";
import { Dialog, DialogContent } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core/styles";
import { UploadMultipleFiles,TextfieldWithIcon } from "egov-ui-framework/ui-molecules";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.css";
import store from "ui-redux/store";
import get from "lodash/get";
import { prepareFinalObject } from "../../../../../packages/lib/egov-ui-framework/ui-redux/screen-configuration/actions";

const styles = theme => ({
  root: {
    marginTop: 24,
    width: "100%"
  }
});

const fieldConfig = {
  token: {
    label: {
      labelName: "Token",
      labelKey: "CORE_COMMON_TOKEN_LABEL"
    },
    placeholder: {
      labelName: "Select Token",
      labelKey: "CORE_COMMON_SELECT_TOKEN_LABEL"
    }
  },
  certificate: {
    label: {
      labelName: "Certificate",
      labelKey: "CORE_COMMON_CERTIFICATE_LABEL"
    },
    placeholder: {
      labelName: "Select Certificate",
      labelKey: "CORE_COMMON_SELECT_CERTIFICATE_LABEL"
    }
  },
  password: {
    label: {
      labelName: "Password",
      labelKey: "CORE_COMMON_PASSWORD_LABEL"
    },
    placeholder: {
      labelName: "Select assignee Name",
      labelKey: "CORE_COMMON_PASSWORD_LABEL"
    }
  },
  approverName: {
    label: {
      labelName: "Assignee Name",
      labelKey: "WF_ASSIGNEE_NAME_LABEL"
    },
    placeholder: {
      labelName: "Select assignee Name",
      labelKey: "WF_ASSIGNEE_NAME_PLACEHOLDER"
    }
  },
  comments: {
    label: {
      labelName: "Comments",
      labelKey: "WF_COMMON_COMMENTS"
    },
    placeholder: {
      labelName: "Enter Comments",
      labelKey: "WF_ADD_HOC_CHARGES_POPUP_COMMENT_LABEL"
    }
  }
};

class ActionDialog extends React.Component {
  state = {
    employeeList: [],
    roles: ""
  };

  // onEmployeeClick = e => {
  //   const { handleFieldChange, toggleSnackbar } = this.props;
  //   const selectedValue = e.target.value;
  //   const currentUser = JSON.parse(getUserInfo()).uuid;
  //   if (selectedValue === currentUser) {
  //     toggleSnackbar(
  //       true,
  //       "Please mark to different Employee !",
  //       "error"
  //     );
  //   } else {
  //     handleFieldChange("Licenses[0].assignee", e.target.value);
  //   }
  // };

  getButtonLabelName = label => {
    switch (label) {
      case "FORWARD":
        return "Verify and Forward";
      case "MARK":
        return "Mark";
      case "REJECT":
        return "Reject";
      case "CANCEL":
      case "APPROVE":
        return "APPROVE";
      case "PAY":
        return "Pay";
      case "SENDBACK":
        return "Send Back";
      default:
        return label;
    }
  };

  render() {

    let {
      open,
      onClose,
      dropDownData,
      handleFieldChange,
      onButtonClick,
      getCertificateList,
      tokensArray,
      certicatesArray,
      dialogData,
      dataPath
    } = this.props;
    const {
      buttonLabel,
      showEmployeeList,
      dialogHeader,
      moduleName,
      isDocRequired
    } = dialogData;
    const { getButtonLabelName } = this;

    // to handle pdf signing/Digital certificate
    let isCertificateDetailsVisible = false
    let tokenPath = ''
    let certificatePath = ''
    let passwordPath = ''
    if(dialogHeader && dialogHeader.labelKey === "WF_APPROVE_APPLICATION" && (dataPath === 'BPA' || dataPath === "Licenses") && (moduleName == "BPA1" ||
    moduleName == 'BPA2' || moduleName === 'BPA3' || moduleName === 'BPA4' || moduleName === "NewTL" )){
      const state = store.getState()
      let applicationStatus = dataPath == 'BPA' ? get(state && state.screenConfiguration && state.screenConfiguration.preparedFinalObject && 
      state.screenConfiguration.preparedFinalObject, `${dataPath}.status`, "") : dataPath == 'Licenses' ? 
      get(state && state.screenConfiguration && state.screenConfiguration.preparedFinalObject && 
        state.screenConfiguration.preparedFinalObject, `Licenses[0].status`, "") : ''
      isCertificateDetailsVisible = dialogHeader && dialogHeader.labelKey === "WF_APPROVE_APPLICATION" && (dataPath == "BPA" || dataPath == 'Licenses')
      && (applicationStatus == "APPROVAL_PENDING" || applicationStatus == "APPROVAL_INPROGRESS" || applicationStatus == "PENDINGAPPROVAL") ? true : false
      tokenPath = `DsInfo.token`
      passwordPath = `DsInfo.password`
      certificatePath = `DsInfo.certificate`
    }
    
    let fullscreen = false;
    const showAssignee = process.env.REACT_APP_NAME === "Citizen" ? false : true;
    if (window.innerWidth <= 768) {
      fullscreen = true;
    }
    if (dataPath === "FireNOCs") {
      dataPath = `${dataPath}[0].fireNOCDetails.additionalDetail`
    } else if (dataPath === "Assessment"||dataPath === "Property" || dataPath === "BPA" || dataPath === "Noc") {
      dataPath = `${dataPath}.workflow`;
    } else {
      dataPath = `${dataPath}[0]`;
    }
    let assigneePath= '';
    /* The path for Assignee in Property and Assessment has latest workflow contract and it is Array of user object  */
    if (dataPath.includes("Assessment")||dataPath.includes("Property")){
      assigneePath=`${dataPath}.assignes[0].uuid`;
    }else{
      assigneePath=`${dataPath}.assignee[0]`;
    }

    let wfDocumentsPath;
    if(dataPath === "BPA.workflow") {
      wfDocumentsPath = `${dataPath}.varificationDocuments`
    } else if (dataPath === "Noc.workflow") {
      wfDocumentsPath = `${dataPath}.documents`
    } else {
      wfDocumentsPath = `${dataPath}.wfDocuments`
    }

    return (
      <Dialog
        fullScreen={fullscreen}
        open={open}
        onClose={onClose}
        maxWidth={false}
        style={{zIndex:2000}}
      >
        <DialogContent
          style={isCertificateDetailsVisible ? {height:'370px'} : {}}
          children={
            <Container
              children={
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
                      <LabelContainer {...dialogHeader} />
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
                  {showEmployeeList && showAssignee && (
                    <Grid
                      item
                      sm="12"
                      style={{
                        marginTop: 16
                      }}
                    >
                      <TextFieldContainer
                        select={true}
                        style={{ marginRight: "15px" }}
                        label={fieldConfig.approverName.label}
                        placeholder={fieldConfig.approverName.placeholder}
                        data={dropDownData}
                        optionValue="value"
                        optionLabel="label"
                        hasLocalization={false}
                        //onChange={e => this.onEmployeeClick(e)}
                        onChange={e =>
                          handleFieldChange(
                            assigneePath,
                            e.target.value
                          )
                        }
                        jsonPath={assigneePath}
                      />
                    </Grid>
                  )}
                  <Grid item sm="12">
                    <TextFieldContainer
                      InputLabelProps={{ shrink: true }}
                      label={fieldConfig.comments.label}
                      onChange={e =>
                        handleFieldChange(`${dataPath}.comment`, e.target.value)
                      }
                      jsonPath={`${dataPath}.comment`}
                      placeholder={fieldConfig.comments.placeholder}
                    />
                  </Grid>
                  <Grid item sm="12">
                    <Typography
                      component="h3"
                      variant="subheading"
                      style={{
                        color: "rgba(0, 0, 0, 0.8700000047683716)",
                        fontFamily: "Roboto",
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "20px",
                        marginBottom: "8px"
                      }}
                    >
                      <div className="rainmaker-displayInline">
                      {moduleName != "MR" ?
                        <LabelContainer
                          labelName="Supporting Documents"
                          labelKey="WF_APPROVAL_UPLOAD_HEAD"
                        />: ''}
                        {isDocRequired && (
                          <span style={{ marginLeft: 5, color: "red" }}>*</span>
                        )}
                      </div>
                    </Typography>
                    <div
                      style={{
                        color: "rgba(0, 0, 0, 0.60)",
                        fontFamily: "Roboto",
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "20px"
                      }}
                    >
                      {moduleName != "MR" ?
                      <LabelContainer
                        labelName="Only .jpg and .pdf files. 5MB max file size."
                        labelKey="WF_APPROVAL_UPLOAD_SUBHEAD"
                      />: ""}
                    </div>
                    {moduleName != "MR" ?
                    <UploadMultipleFiles
                      maxFiles={4}
                      inputProps={{
                        accept: "image/*, .pdf, .png, .jpeg"
                      }}
                      buttonLabel={{ labelName: "UPLOAD FILES",labelKey : "TL_UPLOAD_FILES_BUTTON" }}
                      jsonPath={wfDocumentsPath}
                      maxFileSize={5000}
                    />:""}
                     {isCertificateDetailsVisible && 
                      <React.Fragment>
                    <Grid
                      item
                      sm="12">
                      <TextFieldContainer
                        select={true}
                        required={true}
                        style={{ marginRight: "15px" }}
                        label={fieldConfig.token.label}
                        placeholder={fieldConfig.token.placeholder}
                        data={tokensArray}
                        optionValue="value"
                        optionLabel="label"
                        hasLocalization={false}
                        onChange={e =>{
                          handleFieldChange(
                            tokenPath,
                            e.target.value
                          )
                          getCertificateList(e)
                        }}
                        jsonPath={tokenPath}
                      />
                    </Grid>
                    <Grid
                      item
                      sm="12">
                      <TextFieldContainer
                        required={true}
                        select={true}
                        style={{ marginRight: "15px" }}
                        label={fieldConfig.certificate.label}
                        placeholder={fieldConfig.certificate.placeholder}
                        data={certicatesArray}
                        optionValue="value"
                        optionLabel="label"
                        hasLocalization={false}
                        onChange={e =>{
                          handleFieldChange(
                            certificatePath,
                            e.target.value
                          )
                        }}
                        jsonPath={certificatePath}
                      />
                    </Grid>

                     <Grid item
                    sm={12}>
                  <LabelContainer style={{
                      fontSize: '12px',
                      fontWeight: 500
                  }}
                  labelName={"CORE_COMMON_PASSWORD_LABEL"}
                    labelKey={"CORE_COMMON_PASSWORD_LABEL"} /><span style={{color:'#e54d42'}}>*</span>
                  </Grid>
                  <form style={{width:"100%"}} autocomplete="off">
                  <Grid
                    item
                    sm={12}>
                    <TextfieldWithIcon
                        type ="password"
                        style={{ marginRight: "15px" }}
                        onChange={e =>{
                          handleFieldChange(
                            passwordPath,
                            e.target.value
                          )
                        }}
                        jsonPath={passwordPath}
                        hasLocalization={false}
                      />
                  </Grid>
                  </form>
                      </React.Fragment>
                    }
                    <Grid sm={12} style={{ textAlign: "right" }} className="bottom-button-container">
                      <Button
                        variant={"contained"}
                        color={"primary"}
                        style={{
                          minWidth: "200px",
                          height: "48px"
                        }}
                        className="bottom-button"
                        onClick={() =>
                          onButtonClick(buttonLabel, isDocRequired)
                        }
                      >
                        <LabelContainer
                          labelName={getButtonLabelName(buttonLabel)}
                          labelKey={
                            moduleName
                              ? `WF_${moduleName.toUpperCase()}_${buttonLabel}`
                              : ""
                          }
                        />
                      </Button>
                    </Grid>
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
export default withStyles(styles)(ActionDialog);
