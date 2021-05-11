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
import { UploadMultipleFiles } from "egov-ui-framework/ui-molecules";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.css";
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
import { get } from "lodash";

const styles = theme => ({
  root: {
    marginTop: 24,
    width: "100%"
  }
});

const fieldConfig = {
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
  },
  assessmentFee: {
    label: {
      labelName: "Assessment Fee",
      labelKey: "WF_ASSESSMENT_FEE"
    },
    placeholder: {
      labelName: "Enter Assessment Fee",
      labelKey: "WF_ASSESSMENT_FEE_PLACEHOLDER"
    }
  }
};

let pt_assessment_payment_config = [
  {
    label: {
      labelName: "Assessment Fee",
      labelKey: "PT_ASSESSMENT_FEE"
    },
    placeholder: {
      labelName: "Enter Assessment Fee",
      labelKey: "PT_ASSESSMENT_FEE_PLACEHOLDER"
    },
    path: "assessmentAmount",
    errorMessage: "PT_ERR_ASSESSMENT_CHARGES",
    showError: false,
    required: true
  },
  {
    label: {
      labelName: "Usage Exemption Amount",
      labelKey: "PT_USAGE_EXEMPTION_AMOUNT"
    },
    placeholder: {
      labelName: "Enter Usage Exemption Amount",
      labelKey: "PT_USAGE_EXEMPTION_AMOUNT_PLACEHOLDER"
    },
    path: "usageExemptionAmount",
    errorMessage: "PT_ERR_USAGE_EXEMPTION_AMOUNT",
    showError: false,
    required: true
  },
  {
    label: {
      labelName: "Owner Exemption Amount",
      labelKey: "PT_OWNER_EXEMPTION_AMOUNT"
    },
    placeholder: {
      labelName: "Enter Owner Exemption Amount",
      labelKey: "PT_OWNER_EXEMPTION_AMOUNT_PLACEHOLDER"
    },
    path: "ownerExemptionAmount",
    errorMessage: "PT_ERR_OWNER_EXEMPTION_AMOUNT",
    showError: false,
    required: true
  },
  {
    label: {
      labelName: "Fire Cess Amount",
      labelKey: "PT_FIRE_CESS_AMOUNT"
    },
    placeholder: {
      labelName: "Enter Fire Cess Amount",
      labelKey: "PT_FIRE_CESS_AMOUNT_PLACEHOLDER"
    },
    path: "fireCessAmount",
    errorMessage: "PT_ERR_FIRE_CESS_AMOUNT",
    showError: false,
    required: true
  },
  {
    label: {
      labelName: "Cancer Cess Amount",
      labelKey: "PT_CANCER_CESS_AMOUNT"
    },
    placeholder: {
      labelName: "Enter Cancer Cess Amount",
      labelKey: "PT_CANCER_CESS_AMOUNT_PLACEHOLDER"
    },
    path: "cancerCessAmount",
    errorMessage: "PT_ERR_CANCER_CESS_AMOUNT",
    showError: false,
    required: true
  },
  {
    label: {
      labelName: "Adhoc Penalty Amount",
      labelKey: "PT_ADHOC_PENALTY_AMOUNT"
    },
    placeholder: {
      labelName: "Enter Adhoc Penalty Amount",
      labelKey: "PT_ADHOC_PENALTY_AMOUNT_PLACEHOLDER"
    },
    path: "adhocPenaltyAmount",
    errorMessage: "PT_ERR_ADHOC_PENALTY_AMOUNT",
    showError: false,
    required: true
  },
  {
    label: {
      labelName: "Adhoc Rebate Amount",
      labelKey: "PT_ADHOC_REBATE_AMOUNT"
    },
    placeholder: {
      labelName: "Enter Adhoc Rebate Amount",
      labelKey: "PT_ADHOC_REBATE_AMOUNT_PLACEHOLDER"
    },
    path: "adhocRebateAmount",
    errorMessage: "PT_ERR_ADHOC_REBATE_AMOUNT",
    showError: false,
    required: true
  }
]

class ActionDialog extends React.Component {
  state = {
    employeeList: [],
    roles: "",
    paymentErr: false
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

  assementForward = (buttonLabel, isDocRequired) => {
    let {dataPath, state} = this.props;
    const data = get(state.screenConfiguration.preparedFinalObject, dataPath)
    pt_assessment_payment_config = pt_assessment_payment_config.map((payment) => ({
      ...payment,
      isError: payment.required
        ? !data[payment.path]
        : !!data[payment.path]
        ? isNaN(data[payment.path])
        : false,
    }));
    const isError = pt_assessment_payment_config.some(payment => !!payment.isError)
    if(isError) {
      this.setState({
        paymentErr: true
      })
      return
    }
    this.props.onButtonClick(buttonLabel, isDocRequired)
  }

  render() {
        
    let {
      open,
      onClose,
      dropDownData,
      handleFieldChange,
      onButtonClick,
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
    let fullscreen = false;
    const showAssignee = process.env.REACT_APP_NAME === "Citizen" ? false : true;
    if (window.innerWidth <= 768) {
      fullscreen = true;
    }
    if (dataPath === "FireNOCs") {
      dataPath = `${dataPath}[0].fireNOCDetails.additionalDetail`
    } else if(dataPath === "Assessment") {
      dataPath = dataPath
    }
     else if (dataPath === "Property" || dataPath === "BPA" || dataPath === "Noc") {
      dataPath = `${dataPath}.workflow`;
    } else {
      dataPath = `${dataPath}[0]`;
    }
    let assigneePath= '';
    /* The path for Assignee in Property and Assessment has latest workflow contract and it is Array of user object  */
    if (dataPath.includes("Property")){
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

    const rolearray =
        getUserInfo() &&
        JSON.parse(getUserInfo()).roles.filter(item => {
          if (item.code == "PT_APPROVER")
            return true;
        });
    
    const rolecheck = rolearray.length > 0 ? true : false;
    const assessmentCheck = dataPath === "Assessment" && !!rolecheck && buttonLabel === "APPROVE"
    return (
      <Dialog
        fullScreen={fullscreen}
        open={open}
        onClose={onClose}
        maxWidth={false}
        style={{zIndex:2000}}
      >
        <DialogContent
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
                  {showEmployeeList && showAssignee && !assessmentCheck &&  (
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
                  {!!assessmentCheck && pt_assessment_payment_config.map(payment => (
                    <Grid payment sm="12">
                    <TextFieldContainer
                    InputLabelProps={{ shrink: true }}
                    label= {payment.label}
                    onChange={e =>{
                      handleFieldChange(`${dataPath}.${payment.path}`, e.target.value)
                      pt_assessment_payment_config[ind].isError = false
                    }}
                    required = {true}
                    jsonPath={`${dataPath}.${payment.path}`}
                    placeholder={payment.placeholder}
                    inputProps={{ maxLength: 120 }}
                    /> 
                    {!!payment.isError && (<span style={{color: "red"}}>{getLocaleLabels(payment.errorMessage, payment.errorMessage)}</span>)}
                    </Grid>
                  ))}
                  {/* { !!assessmentCheck && (<Grid sm="12">
                    <TextFieldContainer
                    InputLabelProps={{ shrink: true }}
                    label= {fieldConfig.assessmentFee.label}
                    onChange={e =>
                      {
                        handleFieldChange(`${dataPath}.assessmentAmount`, e.target.value)
                        // eb_payment_config[ind].isError = false
                      }
                    }
                    required = {true}
                    jsonPath={`${dataPath}.assessmentAmount`}
                    placeholder={fieldConfig.assessmentFee.placeholder}
                    inputProps={{ maxLength: 120 }}
                    /> 
                    {!!payment.isError && (<span style={{color: "red"}}>{getLocaleLabels(payment.errorMessage, payment.errorMessage)}</span>)}
                    </Grid>)} */}
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
                        <LabelContainer
                          labelName="Supporting Documents"
                          labelKey="WF_APPROVAL_UPLOAD_HEAD"
                        />
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
                      <LabelContainer
                        labelName="Only .jpg and .pdf files. 5MB max file size."
                        labelKey="WF_APPROVAL_UPLOAD_SUBHEAD"
                      />
                    </div>
                    <UploadMultipleFiles
                      maxFiles={4}
                      inputProps={{
                        accept: "image/*, .pdf, .png, .jpeg"
                      }}
                      buttonLabel={{ labelName: "UPLOAD FILES",labelKey : "TL_UPLOAD_FILES_BUTTON" }}
                      jsonPath={wfDocumentsPath}
                      maxFileSize={5000}
                    />
                    <Grid sm={12} style={{ textAlign: "right" }} className="bottom-button-container">
                      <Button
                        variant={"contained"}
                        color={"primary"}
                        style={{
                          minWidth: "200px",
                          height: "48px"
                        }}
                        className="bottom-button"
                        onClick={!!assessmentCheck ? () => this.assementForward(buttonLabel, isDocRequired) : () =>
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
