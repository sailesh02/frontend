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

class EditMobileNumberDialog extends Component {
  state = {
    ownerName : ''
  }

  updateMobileNumber = async() => {
    let userInfo = JSON.parse(getUserInfo());
    let Property = this.props.payload
    const owners = Property.owner.map( owner => {
        if(owner.ownerName == this.state.ownerName){
            owner.mobileNumber = userInfo.mobileNumber ? userInfo.mobileNumber : null
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
        { key: "propertyIds", value: decodeURIComponent(this.props.match.params.propertyId) },
        { key: "tenantId", value: this.props.match.params.tenantId },
      ]);
      this.props.toggleSnackbarAndSetText(
        true,
        { labelName: "Property linked successfully", labelKey: "PT_LINKED_SUCCESS_MSG" },
        "success"
      );
    }
    } catch (error) {
      this.props.toggleSnackbarAndSetText(
        true,
        { labelName: error, labelKey: error },
        "error"
      );
    }
  }

  handleSelectedOwner = () => {
      this.setState({
        ownerName : event.target.value
      })
  }

  componentDidMount = () => {
  };

  render() {
    let { open, closeDialogue, owners, history, payload } = this.props;
    return owners ? (
      <Dialog
        open={open}
        children={[
          <div key={1}>
            <div className="dialogue-question">
              <Label label="PT_SELECT_USER" fontSize="20px" color="black" />
            </div>
            <div className="year-range-botton-cont">
            <FormControl>
                <Select style={{marginLeft: `10px`,
                    height: `32px`,
                    borderRadius: '0px',
                    marginTop: '2%',border:'none',color: '#4CAF50',textAlign: 'center'}} name='ownerName' value= {this.state.ownerName} placeholder="Select Owner"
                    onChange = {this.handleSelectedOwner} >
                    {owners && owners.map( owner => {
                        return <MenuItem key={owner.name} value={owner.name}>{owner.name}</MenuItem>
                    })}
                </Select>  
            </FormControl>
            </div>
            <div className='year-dialogue-button'>
              <Button
                label={<Label label="PT_CANCEL" buttonLabel={true} color="black" />}
                onClick={() => { closeDialogue() }}
                labelColor="#fe7a51"
                buttonStyle={{ border: "1px solid rgb(255, 255, 255)" }}></Button>
              <Button
                label={<Label label="PT_OK" buttonLabel={true} color="black" />}
                labelColor="#fe7a51"
                buttonStyle={{ border: "1px solid rgb(255, 255, 255)" }} onClick={this.updateMobileNumber}></Button>
            </div>
          </div>,
        ]}
        bodyStyle={{ backgroundColor: "#ffffff" }}
        isClose={false}
        onRequestClose={closeDialogue}
        contentClassName="year-dialog-content"
        className="year-dialog"
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
