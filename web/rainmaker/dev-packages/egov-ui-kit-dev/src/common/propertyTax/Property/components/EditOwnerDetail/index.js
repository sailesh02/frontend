import React, { Component } from "react";
import { Dialog, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import TextField from "@material-ui/core/TextField";
import {  fetchProperties } from "egov-ui-kit/redux/properties/actions";
import {
    LabelContainer,
    TextFieldContainer
  } from "egov-ui-framework/ui-containers";
import { connect } from "react-redux";
import { Grid, Typography,  } from "@material-ui/core";
import { Container } from "egov-ui-framework/ui-atoms";
import store from "ui-redux/store";
import { httpRequest } from "egov-ui-kit/utils/api";
import { convertEpochToDate } from "egov-ui-framework/ui-config/screens/specs/utils";
import { toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
const bodyStyle = {
  backgroundColor: "#FFFFFF",
  border: "0.5px solid rgba(0, 0, 0, 0)",
  boxShadow: "0 24px 24px 0 rgba(0, 0, 0, 0.3), 0 0 24px 0 rgba(0, 0, 0, 0.22)",
  height: "625px",
};
const labelStyle = {
    letterSpacing: 1.2,
    fontWeight: "500",
    lineHeight: "40px",
    marginTop:"10px"
  };
  const buttonStyle = {
    lineHeight: "35px",
    height: "100%",
    backgroundColor: "rgb(254, 122, 81)",
    boxShadow: "none",
    border: "none",
    borderRadius: "2px",
    outline: "none",
    alignItems: "right",
  };
const contentStyle = {
  width: "100%",
  maxWidth: "fit-content",
};
class EditOwnerDetailDialog extends Component {
    state = {
      ownerName : this.props.ownerDetail&& this.props.ownerDetail[0][0].value?this.props.ownerDetail[0][0].value:'',
      ownerMobileNumber:this.props.ownerDetail&& this.props.ownerDetail[0][4].value?this.props.ownerDetail[0][4].value:'',
    ownerNameError : '',
    ownerMobileNumberError :'',
    
    }

    
    handleChangeName = (e)=>{
        this.setState({[e.target.name] : e.target.value} , ()=>{
            this.checkError()
        })
    }

  
    checkError= ()=>{
        let error = true
        if(this.state.ownerName != ""&&this.state.ownerName != undefined && this.state.ownerName != null){
            error = true
            this.setState({ownerNameError: ""})
        }
        else {
            error = false
            this.setState({ownerNameError: "Owner name should not empty."})
        }
        if(this.state.ownerMobileNumber != ""&&this.state.ownerMobileNumber != undefined && this.state.ownerMobileNumber != null){
            if(this.state.ownerMobileNumber.length == 10 ){
                error = true
                this.setState({ownerMobileNumberError: ""})
            }
            else {
            error = false
            this.setState({ownerMobileNumberError: "Mobile number should be 10 digits."})
            }
            
        }else {
            error= false
            this.setState({ownerMobileNumberError: "Mobile number is invalid."})
        }

        return error
    }
    UpdateDetails = async(e)=>{
        e.preventDefault();
      const {fetchProperties} =this.props
        let  err =  this.checkError()
    if(err == true){
        const queryObject = [
          { key: "propertyIds", value: this.props.consumerCode },
          { key: "tenantId", value: this.props.tenantId },
        
        ];
    
        try {
          const payload = await httpRequest(
            "property-services/property/_search",
            "_search",
            queryObject
          );
          if (payload && payload.Properties.length > 0) {
      
              let payloadQuery = payload.Properties[0]
              payloadQuery.creationReason="UPDATE"
              payloadQuery.owners[this.props.indexDataDetail].name = this.state.ownerName
              payloadQuery.owners[this.props.indexDataDetail].mobileNumber = this.state.ownerMobileNumber
      
              try{
              let updatePropertyResponse= await httpRequest(
                      "/property-services/property/_update", 
                      "", 
                      [], 
                      { Property: payloadQuery });
                  if(updatePropertyResponse.Properties.length>0){
                      this.props.closeDialogue(false)
                      
                      fetchProperties([
                        { key: "propertyIds", value: this.props.consumerCode },
                        { key: "tenantId", value: this.props.tenantId },
                      ]);
                  }
                  return updatePropertyResponse;
              } catch(err){
                 store.dispatch(toggleSnackbar(true, { labelName: err.message }, "error"));
                  console.log(err)
              }
           
          
          }
        } catch (e) {
          store.dispatch(toggleSnackbar(true, { labelName: e.message }, "error"));
          console.log(e);
        }
}

    }
render() {
      let { open, closeDialogue, ownerDetail } = this.props;
  return (
    <Dialog
      open={open}
      children={[
        <div style={{ margin: 16 }}>
          <Label label="Owner Details" fontSize="20px" labelClassName="owner-history" />
          <br />
          
             <Grid container spacing={3}>
              
                    <Grid item xs={6}  style={{
                                marginTop: 4
                              }}>
                   <Label label="PT_OWNER_NAME" fontSize="20px" labelClassName="owner-history" />
                   <TextField
                        variant="outlined"
                        name="ownerName"
                        value={this.state.ownerName}
                      style={{width:"90%"}}
                      //   className={classes.textField}
                        onChange={(event) =>
                          this.handleChangeName(event)
                        }
                  
                      />
                      <div style={{color:"red"}}>{this.state.ownerNameError}</div>
                            </Grid>
          
                            <Grid item xs={6}  style={{
                                marginTop: 4
                              }}>
                   <Label label="Mobile No." fontSize="20px" labelClassName="owner-history" />
                   <TextField
                        variant="outlined"
                        name="ownerMobileNumber"
                        value={this.state.ownerMobileNumber}
                      style={{width:"100%"}}
                      //   className={classes.textField}
                        onChange={(event) =>
                          this.handleChangeName(event)
                        }
                  
                      />
                 <div style={{color:"red"}}>{this.state.ownerMobileNumberError}</div>
                            </Grid>
                            
                          <Grid item xs= {12} >
                            <Button
                  className="update-ownerDetail"
                  style={{float: "right"}}
                  label={
                    <Label buttonLabel={true} label="Update" color="#FFFFFF" fontSize="16px" height="40px" labelStyle={labelStyle} />
                  }
                  buttonStyle={buttonStyle}
                  onClick={(e) => {
                    this.UpdateDetails(e);
                  }}
                ></Button>
                      </Grid>
                    </Grid>
        </div>
      ]}
      bodyStyle={bodyStyle}
      isClose={true}
      handleClose={closeDialogue}
      onRequestClose={closeDialogue}
      contentStyle={contentStyle}
      autoScrollBodyContent={true}
      contentClassName="view-history-dialog"
    />
  );
};
}


const mapDispatchToProps = (dispatch) => {
  return {
    fetchProperties: (queryObjectProperty) => store.dispatch(fetchProperties(queryObjectProperty)),
   
  };
};

export default connect( mapDispatchToProps)(EditOwnerDetailDialog);

