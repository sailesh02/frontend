import React from 'react';
import { connect } from "react-redux";
import Select from 'react-select';
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { withStyles } from "@material-ui/core/styles";
import store from "ui-redux/store";


class MultiAutoSuggest extends React.Component {
  state = {
    selectedOption: null,
  };
  handleChange = (selectedOption) => {
    const { jsonPath } = this.props;

    this.setState({ selectedOption }, () =>
      store.dispatch(prepareFinalObject(jsonPath, this.state.selectedOption))
    );
  };
  render() {
    const { selectedOption } = this.state;
    const { transformedTenants, label, required } = this.props
    if(label == "City"){
      transformedTenants.unshift({ value: "ALL", label: "ALL" })
    }
    console.log(this.props, "Nero this.props")
    return (
      <div style={{ marginRight: "20px", marginBottom: "20px", paddingRight: "128px"}}>
        <span style={{ marginBottom: "10px" }}>{label} {required ? <span style={{color: "red"}}>*</span>:""}</span>
        <Select
          required={true}
          isMulti={true}
          value={selectedOption}
          onChange={this.handleChange}
          options={transformedTenants}

        />
      </div>
    );
  }
}


const mapStateToProps = (state) => {

  const { preparedFinalObject } = state.screenConfiguration;
  const { applyScreenMdmsData } = preparedFinalObject
  let tenants = applyScreenMdmsData && applyScreenMdmsData.tenant && applyScreenMdmsData.tenant.tenants

  let transformedTenants = [];
  if (tenants && tenants.length > 0) {
    for (let i = 0; i < tenants.length; i++) {
      transformedTenants.push({ value: tenants[i].code, label: tenants[i].code.split(".")[1].toUpperCase() })
    }
  }

  return { transformedTenants };
};

const mapDispatchToProps = dispatch => {
  return {
    prepareFinalObject: (path, value) =>
      dispatch(prepareFinalObject(path, value))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MultiAutoSuggest);
