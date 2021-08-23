// import React from "react";
// import { Dialog, Button } from "components";
// import Label from "egov-ui-kit/utils/translationNode";
// import "./index.css";
// import { Grid, Typography } from "@material-ui/core";
// import { Container } from "egov-ui-framework/ui-atoms";
// import store from "ui-redux/store";
// import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
// import {
//   LabelContainer,
//   TextFieldContainer
// } from "egov-ui-framework/ui-containers";
// const styles = {
//   logoutContentStyle: { textAlign: "center", padding: "24px 20px" },
// };

// const DigitalSignatureDialog = ({ logout, closeDigitalSignatureDialog, openDigitalSignaturePopup, okText, resetText, title, body }) => {
//   const actions = [
//     <Button
//       id="logout-no-button"
//       className="logout-no-button"
//       label={<Label buttonLabel={true} label={resetText} color="#FE7A51" />}
//       backgroundColor={"#fff"}
//       onClick={closeDigitalSignatureDialog}
//       style={{ boxShadow: "none" }}
//     />,
//     <Button
//       id="logout-yes-button"
//       className="logout-yes-button"
//       label={<Label buttonLabel={true} label={okText} color="#FE7A51" />}
//       backgroundColor={"#fff"}
//       onClick={logout}
//       style={{ boxShadow: "none" }}
//     />,
//   ];
//   return (
//     <Dialog
//     style={{
//         marginTop:'30px'
//     }}
//       open={openDigitalSignaturePopup}
//       title={
//         <Label
//           label={title}
//           bold={true}
//           color="rgba(0, 0, 0, 0.8700000047683716)"
//           fontSize="20px"
//           labelStyle={{ padding: "16px 0px 0px 24px" }}
//         />
//       }

//     children={[
//         <Container
//         style={{
//             marginleft:'16px',
//             marginTop:'10px'
//          }}
//           children={
//             <Grid
//               container="true"
//               spacing={12}
//               className="action-container"
//               >
//             <Grid
//                     item
//                     sm={12}
//                   >
//                   <TextFieldContainer
//                         select={true}
//                         style={{ marginRight: "15px" }}
//                         label={{
//                             labelName: "Token",
//                             labelKey: "CORE_COMMON_TOKEN_LABEL"
//                           }}
//                         placeholder={{
//                             labelName: "Select Token",
//                             labelKey: "CORE_COMMON_SELECT_TOKEN_LABEL"
//                           }}
//                         data={[]}
//                         optionValue="value"
//                         optionLabel="label"
//                         hasLocalization={false}
//                         value = {"ksjk"}
//                         //onChange={e => this.onEmployeeClick(e)}
//                         // onChange={this.onNocChange}
//                         // jsonPath={'mynocType'}
//                       />
//                   </Grid>
//                   <Grid
//                     item
//                     sm={12}
//                   >
//                   <TextFieldContainer
//                         select={true}
//                         style={{ marginRight: "15px" }}
//                         label={{
//                             labelName: "Token",
//                             labelKey: "CORE_COMMON_TOKEN_LABEL"
//                           }}
//                         placeholder={{
//                             labelName: "Select Token",
//                             labelKey: "CORE_COMMON_SELECT_TOKEN_LABEL"
//                           }}
//                         data={[]}
//                         optionValue="value"
//                         optionLabel="label"
//                         hasLocalization={false}
//                         value = {"ksjk"}
//                         //onChange={e => this.onEmployeeClick(e)}
//                         // onChange={this.onNocChange}
//                         // jsonPath={'mynocType'}
//                       />
//                   </Grid>
//                   <Grid
//                     item
//                     sm={12}
//                   >
//                   <TextFieldContainer
//                         style={{ marginRight: "15px" }}
//                         label={{
//                             labelName: "Token",
//                             labelKey: "CORE_COMMON_TOKEN_LABEL"
//                           }}
//                         placeholder={{
//                             labelName: "Select Token",
//                             labelKey: "CORE_COMMON_SELECT_TOKEN_LABEL"
//                           }}
                       
//                         hasLocalization={false}
//                         value = {"ksjk"}
//                         //onChange={e => this.onEmployeeClick(e)}
//                         // onChange={this.onNocChange}
//                         // jsonPath={'mynocType'}
//                       />
//                   </Grid>
//             </Grid>
//           }
//         />]
//       }
//       handleClose={closeDigitalSignatureDialog}
//       actions={actions}
//       contentClassName={"logout-popup"}
//       contentStyle={{ width: "90%" }}
//       isClose={true}
//     />
//   );
// };

// export default DigitalSignatureDialog;

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
  
class DigitalSignatureDialog extends Component {
  state = {
    comments : ''
  }

  render() {
    let { closeDigitalSignatureDialog,openDigitalSignaturePopup,okText,resetText } = this.props;
   
    return (
      <Dialog
      fullScreen={false}
      open={openDigitalSignaturePopup}
      onClose={closeDigitalSignatureDialog}
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
                  onClick={closeDigitalSignatureDialog}
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
                    labelName="BPA_APPROVAL_REJECTION_NOTE"
                    labelKey="BPA_APPROVAL_REJECTION_NOTE"
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
                        label={{
                            labelName: "Token",
                            labelKey: "CORE_COMMON_TOKEN_LABEL"
                          }}
                        placeholder={{
                            labelName: "Select Token",
                            labelKey: "CORE_COMMON_SELECT_TOKEN_LABEL"
                          }}
                        data={[]}
                        optionValue="value"
                        optionLabel="label"
                        hasLocalization={false}
                        value = {"ksjk"}
                        //onChange={e => this.onEmployeeClick(e)}
                        // onChange={this.onNocChange}
                        // jsonPath={'mynocType'}
                      />
                  </Grid>
                  <Grid
                    item
                    sm={12}
                    style={{
                      marginTop: 12
                    }}>
                      <TextFieldContainer
                        select={true}
                        style={{ marginRight: "15px" }}
                        label={{
                            labelName: "Token",
                            labelKey: "CORE_COMMON_CERTIFICATE_LABEL"
                          }}
                        placeholder={{
                            labelName: "Select Token",
                            labelKey: "CORE_COMMON_SELECT_CERTIFICATE_LABEL"
                          }}
                        data={[]}
                        optionValue="value"
                        optionLabel="label"
                        hasLocalization={false}
                        value = {"ksjk"}
                        //onChange={e => this.onEmployeeClick(e)}
                        // onChange={this.onNocChange}
                        // jsonPath={'mynocType'}
                      />
                  </Grid>
                  <Grid
                    item
                    sm={12}
                    style={{
                      marginTop: 12
                    }}>
                      <TextFieldContainer
                        style={{ marginRight: "15px" }}
                        label={{
                            labelName: "Token",
                            labelKey: "CORE_COMMON_TOKEN_LABEL"
                          }}
                        placeholder={{
                            labelName: "Select Token",
                            labelKey: "CORE_COMMON_SELECT_TOKEN_LABEL"
                          }}
                       
                        hasLocalization={false}
                        value = {"ksjk"}
                        //onChange={e => this.onEmployeeClick(e)}
                        // onChange={this.onNocChange}
                        // jsonPath={'mynocType'}
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
                      labelName={resetText}
                      labelKey=
                      {resetText}     
                    />
                    </Button>
                    <Button
                      variant={"contained"}
                      color={"primary"}
                    //   onClick={this.saveDetails}
                    >
                      <LabelContainer
                        labelName={okText}
                        labelKey=
                          {okText}     
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
)(DigitalSignatureDialog);
