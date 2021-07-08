import { Dialog, DialogContent } from "@material-ui/core";
import Label from "egov-ui-kit/utils/translationNode";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid, Typography, Button } from "@material-ui/core";
import { Container } from "egov-ui-framework/ui-atoms";
import store from "ui-redux/store";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  LabelContainer,
  TextFieldContainer
} from "egov-ui-framework/ui-containers";
import CloseIcon from "@material-ui/icons/Close";

import "./index.css";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "../../../utils/api";
import { fetchProperties } from "egov-ui-kit/redux/properties/actions";
import MenuItem from '@material-ui/core/MenuItem';
import SelectField from "material-ui/SelectField";
import formHoc from "egov-ui-kit/hocs/form";
import InputLabel from '@material-ui/core/InputLabel';
class EditMobileNumberDialog extends Component {
  state = {
    ownerName : ''
  }

  updateMobileNumber = async() => {
    let userInfo = JSON.parse(getUserInfo());
    let Property = this.props.payload

    let owners = Property.owners.map( owner => {
      if(owner.name == this.state.ownerName){
        owner.mobileNumber = userInfo.mobileNumber ? userInfo.mobileNumber : null
        return owner
       }else{
        return owner
      }
    })

    owners = owners.filter( owner => {
      if(owner.name == this.state.ownerName){
        return owner
      }
    })

    Property = {...Property, creationReason: "LINK", owners: owners}
    try {
      const propertyResponse = await httpRequest(
        `property-services/property/_update`,
        `_update`,
        [],
        {
            Property
        },
        [],
        {},
        true
    );
    if(propertyResponse) {
      fetchProperties([
        { key: "propertyIds", value: decodeURIComponent(this.props.propertyId) },
        { key: "tenantId", value: this.props.tenantId },
      ]);
      this.props.toggleSnackbarAndSetText(
        true,
        { labelName: "Property linked successfully", labelKey: "PT_LINKED_SUCCESS_MSG" },
        "success"
      );
      this.props.closeDialogue()
    }
    } catch (error) {
      this.props.toggleSnackbarAndSetText(
        true,
        { labelName: error, labelKey: error },
        "error"
      );
    }
  }

  handleSelectedOwner = (event,value) => {
      this.setState({
        ownerName : event.target.value
      })
    store.dispatch(prepareFinalObject("ownername",event.target.value))
  }

  prepareFilterDropdown(data) {
    return (
        data.map((item, index) => {
          return (<MenuItem key={index} value={item}>{item}</MenuItem>)  
        })
    )
}

  componentDidMount = () => {
  };

  render() {
    let { open, closeDialogue, owners, history, payload } = this.props;
    const dropDownData = owners && owners.map( owner => {
      return {
        "value":owner.name,
        "label":owner.name
      }
    })
   
    return owners ? (
      <Dialog
      fullScreen={false}
      open={open}
      onClose={closeDialogue}
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
                    <LabelContainer labelName="Link Property"
                    labelKey="PT_LINK" />
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
                  onClick={closeDialogue}
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
                    labelName="Select Owner"
                    labelKey="PT_LINK_OWNER_NAME"
                  />
                  </Grid>
                  <Grid
                    item
                    sm="12"
                    style={{
                      marginTop: 4
                    }}>
                    <TextFieldContainer
                      select={true}
                      style={{ marginRight: "15px" }}
                      label={"Select Owner"}
                      placeholder={{
                        labelName: "Please Select Owner",
                        labelKey: "Please Select Owner"
                      }}
                      data={dropDownData}
                      optionValue="value"
                      optionLabel="label"
                      hasLocalization={false}
                      onChange={this.handleSelectedOwner}
                      jsonPath="ownername"
                    />
                  </Grid>
                <Grid item sm="12">
                  <Grid sm={12} style={{ textAlign: "right" }} className="bottom-button-container">
                    <Button
                      variant={"contained"}
                      color={"primary"}
                      style={{
                        minWidth: "200px",
                        height: "48px"
                      }}
                      className="bottom-button"
                      onClick={this.updateMobileNumber
                      }
                    >
                      <LabelContainer
                        labelName={"PT_LINK_BUTTON"}
                        labelKey=
                          {"PT_LINK_BUTTON"}     
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
    ) : null;
  }
}

const mapStateToProps = (state) => {
  const { form } = state;
  return { form };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchProperties: (queryObjectProperty) => dispatch(fetchProperties(queryObjectProperty)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditMobileNumberDialog);
