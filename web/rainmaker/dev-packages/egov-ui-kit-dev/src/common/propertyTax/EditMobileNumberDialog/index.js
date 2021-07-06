import { Button, Dialog } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import React, { Component } from "react";
import { connect } from "react-redux";
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
    ownerName : 'ttttrr'
  }

  updateMobileNumber = async() => {
    let userInfo = JSON.parse(getUserInfo());
    let Property = this.props.payload
    const owners = Property.owners.map( owner => {
      if(owner.name == this.state.ownerName){
        owner.mobileNumber = userInfo.mobileNumber ? userInfo.mobileNumber : null
        return owner
      }else{
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
    console.log("owners",owners)
    const ownersName = owners && owners.map( owner => {
      return owner.name
    })
    return owners ? (
      <Dialog
        open={open}
        children={[
          <div key={1}>
            <div className="dialogue-question">
              <Label label="PT_SELECT_USER" fontSize="20px" color="black" />
            </div>
            <div className="mobile-range-botton-cont">
            {/* <FormControl style={{width:'100%'}}>
                <SelectField name='ownerName' value= {this.state.ownerName} placeholder="Select Owner"
                    onChange = {this.handleSelectedOwner} >
                    {owners && owners.map(owner => {
                      <MenuItem key={owner.name} value={owner.name} primaryText={owner.name}></MenuItem>
                    })}
                </SelectField> 
            </FormControl> */}
            <FormControl style={{width:'100%'}}>
        <Select
          value={this.state.ownerName}
          onChange={this.handleSelectedOwner}
        >
          {this.prepareFilterDropdown(ownersName)}
        </Select>
        </FormControl>
            {/* <MobileNumberHOC
                handleSelectedOwner={this.handleSelectedOwner}
                selectedName={this.state.ownerName}
              /> */}
            </div>
            <div className='mobile-dialogue-button'>
              <Button
                label={<Label label="PT_CANCEL" buttonLabel={true} color="black" />}
                onClick={() => { closeDialogue() }}
                labelColor="#fe7a51"
                buttonStyle={{ border: "1px solid rgb(255, 255, 255)" }}></Button>
              <Button
                label={<Label label="PT_LINK" buttonLabel={true} color="black" />}
                labelColor="#fe7a51"
                buttonStyle={{ border: "1px solid rgb(255, 255, 255)" }} onClick={this.updateMobileNumber}></Button>
            </div>
          </div>,
        ]}
        bodyStyle={{ backgroundColor: "#ffffff" }}
        isClose={false}
        onRequestClose={closeDialogue}
        contentClassName="year-dialog-content"
        className="mobile-dialog"
      />
    ) : null;
  }
}

const mapStateToProps = (state) => {
  const { common, form } = state;
  const { generalMDMSDataById } = common;
  const FinancialYear = generalMDMSDataById && generalMDMSDataById.FinancialYear;
  const getYearList = FinancialYear && Object.keys(FinancialYear);
  return { getYearList, form };
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
