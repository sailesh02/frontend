import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from '@material-ui/core/FormGroup';
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import "./index.css";
import { toggleWater, toggleSewerage , toggleConnectionTypeDetails } from './toggleFeilds';
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

const styles = {
  root: {
    color: "#FE7A51",
    "&$checked": {
      color: "#FE7A51"
    }
  },
  formControl: {
    marginTop: 0,
    paddingBottom: 0
  },
  group: {
    display: "inline-block",
    margin: 0
  },
  checked: {},
  radioRoot: {
    marginBottom: 12
  },
  formLabel: {
    fontSize: 12,
    fontWeight: 400,
    letterSpacing: 0.56
  }
};

class CheckboxLabels extends React.Component {
  state = { checkedSewerage: false, checkedWater: false, interChange: false }

  componentWillMount() {
    const { preparedFinalObject } = this.props;
    let checkedWater = (preparedFinalObject && preparedFinalObject.applyScreen.water) ? preparedFinalObject.applyScreen.water : false;
    let checkedSewerage = (preparedFinalObject && preparedFinalObject.applyScreen.sewerage) ? preparedFinalObject.applyScreen.sewerage : false;
    this.setState({ checkedSewerage: checkedSewerage, checkedWater: checkedWater },()=>{})
  }

  handleWater = name => event => {
    const { jsonPathWater, approveCheck, onFieldChange } = this.props;
    this.setState({ [name]: event.target.checked, interChange: true }, () => {
      if (this.state.checkedWater) {
        toggleConnectionTypeDetails(onFieldChange, true)
        toggleWater(onFieldChange, true);
        if (this.state.checkedSewerage) {
          // toggleConnectionTypeDetails(onFieldChange, true)
          toggleSewerage(onFieldChange, true); }
        else { toggleSewerage(onFieldChange, false);
          toggleConnectionTypeDetails(onFieldChange, true)
        }
      } else { toggleWater(onFieldChange, false);
        toggleConnectionTypeDetails(onFieldChange, false)
      }
      approveCheck(jsonPathWater, this.state.checkedWater);
    });
  };

  handleSewerage = name => event => {
    const { jsonPathSewerage, approveCheck, onFieldChange } = this.props;
    this.setState({ [name]: event.target.checked, interChange: true }, () => {
      if (this.state.checkedSewerage) {
        toggleConnectionTypeDetails(onFieldChange, false)
        toggleSewerage(onFieldChange, true);
        if (this.state.checkedWater) { 
          toggleConnectionTypeDetails(onFieldChange, true)
          toggleWater(onFieldChange, true); }
        else{ 
          toggleWater(onFieldChange, false); 
        }
      } else { 
        toggleConnectionTypeDetails(onFieldChange, true)
        toggleSewerage(onFieldChange, false); 
      }
      approveCheck(jsonPathSewerage, this.state.checkedSewerage);
    });
  }

  render() {
    const { classes, required, preparedFinalObject,disabled} = this.props;
    let checkedWater, checkedSewerage;
    if (this.state.interChange) {
      checkedWater = this.state.checkedWater;
      checkedSewerage = this.state.checkedSewerage;
    } else {
      checkedWater = (preparedFinalObject && preparedFinalObject.applyScreen.water) ? preparedFinalObject.applyScreen.water : false;
      checkedSewerage = (preparedFinalObject && preparedFinalObject.applyScreen.sewerage) ? preparedFinalObject.applyScreen.sewerage : false;
    }

    return (
      <div className={classes.root}>
        <FormControl component="fieldset" className={classes.formControl} required={required}>
          <FormLabel className={classes.formLabel}>
            <LabelContainer className={classes.formLabel} labelKey="WS_APPLY_FOR" />
          </FormLabel>
          <FormGroup row>
            <FormControlLabel
              classes={{ label: "checkbox-button-label" }}
              control={
                <Checkbox
                  disabled = {disabled}
                  checked={checkedWater}
                  onChange={this.handleWater("checkedWater")}
                  classes={{ root: classes.radioRoot, checked: classes.checked }}
                  color="primary"
                />}
              label={<LabelContainer labelKey="WS_APPLY_WATER" />}
            />
            <FormControlLabel
              classes={{ label: "checkbox-button-label" }}
              control={
                <Checkbox
                  disabled = {disabled}
                  checked={checkedSewerage}
                  onChange={this.handleSewerage("checkedSewerage")}
                  classes={{ root: classes.radioRoot, checked: classes.checked }}
                  color="primary"
                />}
              label={<LabelContainer labelKey="WS_APPLY_SEWERAGE" />}
            />
          </FormGroup>
        </FormControl>
      </div>
    )
  }
}

const mapStateToProps = (state, ownprops) => {
  const { screenConfiguration } = state;
  const { jsonPathWater, jsonPathSewerage,disabled } = ownprops;
  const { preparedFinalObject } = screenConfiguration;
  return { preparedFinalObject, jsonPathWater, jsonPathSewerage };
};

const mapDispatchToProps = dispatch => {
  return { approveCheck: (jsonPath, value) => { dispatch(prepareFinalObject(jsonPath, value)); } };
};

CheckboxLabels.propTypes = { classes: PropTypes.object.isRequired };

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(CheckboxLabels));
