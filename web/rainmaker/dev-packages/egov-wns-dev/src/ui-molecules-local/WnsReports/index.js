import React, { Component } from "react";
// import { Card, Button } from "components";
import RenderScreen from "egov-ui-framework/ui-molecules/RenderScreen";
import { connect } from "react-redux";
import {
  getDateField,
  getTextField,
  getPattern,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import "./index.css";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import LoadingIndicator from "egov-ui-framework/ui-molecules/LoadingIndicator";

class WnsReports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: props.active,
      formItems: props.formItems,
    };
  }

  isFormValid = (reportFormObj, formItems) => {
    const allReqFilds = formItems.filter((eachItem) => eachItem.required);
    let isValid = true;
    allReqFilds.forEach((eachItem) => {
      if (!reportFormObj[eachItem.key]) {
        isValid = false;
      }
    });
    return isValid;
  };

  handleSearch = async () => {
    let { formItems } = this.state;
    let { searchAction, state, dispatch } = this.props;
    let reportFormObj = get(
      state.screenConfiguration.preparedFinalObject,
      "reportForm",
      {}
    );
    if (!this.isFormValid(reportFormObj, formItems)) {
      let errorMessage = {
        labelName: "Please fill all mandatory fields and then search.",
        labelKey: "Please fill all mandatory fields and then search.",
      };
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    } else {
      try {
        searchAction(reportFormObj, state, dispatch);
      } catch (error) {
        console.log(error);
      }
    }
  };

  getFormElement = (entry) => {
    let {
      type,
      jsonPath,
      sourceJsonPath,
      labelKey,
      placeholderLabelKey,
      localePrefix,
      gridSm,
      className,
      required = false,
      disabled = false,
      ...rest
    } = entry;
    switch (type) {
      case "select":
        return {
          uiFramework: "custom-containers-local",
          moduleName: "egov-wns",
          componentPath: "AutosuggestContainer",

          jsonPath: jsonPath,
          componentJsonpath: jsonPath,
          helperText: required ? "Required" : "",
          gridDefination: {
            xs: 12,
            sm: gridSm ? gridSm : 4,
          },
          props: {
            className: `rt-wns-auto-dd ${className ? className : ""}`,
            sourceJsonPath: sourceJsonPath,
            label: {
              labelKey: labelKey,
            },
            placeholder: {
              labelKey: placeholderLabelKey,
            },
            localePrefix: localePrefix,
            required: required,
            disabled: disabled,
            style: {
              width: "100%",
              cursor: "pointer",
            },
            setDataInField: true,
            labelsFromLocalisation: true,
            fullwidth: true,
            isClearable: true,
            inputLabelProps: {
              shrink: true,
            },
            resetField: this.state.resetField,
            ...rest,
          },
        };
      case "date":
        return {
          ...getDateField({
            label: {
              labelKey: labelKey,
            },
            placeholder: {
              labelKey: placeholderLabelKey,
            },
            localePrefix: localePrefix,
            jsonPath: jsonPath,
            componentJsonpath: jsonPath,
            pattern: getPattern("Date"),
            // errorMessage,
            // requiredMessage,
            required: required,
            disabled: disabled,
            gridDefination: {
              xs: 12,
              sm: gridSm ? gridSm : 4,
            },
            // props: {
            //   inputProps: {
            //     max: getCurrentDate(),
            //   },
            // },
            ...rest,
          }),
        };
      case "text":
        return {
          ...getTextField({
            label: {
              labelKey: labelKey,
            },
            placeholder: {
              labelKey: placeholderLabelKey,
            },
            localePrefix: localePrefix,
            jsonPath: jsonPath,
            componentJsonpath: jsonPath,
            // errorMessage,
            // requiredMessage,
            required: required,
            disabled: disabled,
            gridDefination: {
              xs: 12,
              sm: gridSm ? gridSm : 4,
            },
            ...rest,
          }),
        };
      default:
        return {};
    }
  };

  getCardItems = () => {
    let { formItems } = this.state;
    let allObj = {};
    formItems &&
      formItems.forEach((entry, i) => {
        let { key } = entry;
        allObj[key] = this.getFormElement(entry);
      });
    return allObj;
  };

  onFieldChange = (screenKey, componentJsonpath, property, value) => {
    let { dispatch } = this.props;
    let { resetField, formItems } = this.state;
    dispatch(prepareFinalObject(componentJsonpath, value));

    let newFormItems = [...formItems];
    formItems.forEach((eachItem, index) => {
      if (eachItem.jsonPath === componentJsonpath) {
        eachItem.onChange && eachItem.onChange();
      }
      if (resetField) {
        let newItem = { ...eachItem };
        if (["text"].includes(eachItem.type)) {
          delete newItem["props"]["value"];
        }
        newFormItems.splice(index, 1, newItem);
      }
    });
    this.setState({
      formItems: newFormItems,
      resetField: false,
    });
  };

  clearFields = () => {
    let { dispatch } = this.props;
    dispatch(prepareFinalObject("reportForm", {}));
    let { formItems } = this.state;
    const newFormItems = formItems.map((eachItem) => {
      let newItem = { ...eachItem };
      if (["text"].includes(eachItem.type)) {
        newItem["props"] = { value: "", ...newItem["props"] };
      }
      return newItem;
    });
    this.setState({
      formItems: newFormItems,
      resetField: true,
    });
  };
  getLoader = () => {
    let { preparedFinalObject } = this.props.state.screenConfiguration;
    const loader = preparedFinalObject.reportLoader;
    return loader ? <LoadingIndicator /> : null;
  }
  render() {
    return (
      <React.Fragment>
        {this.getLoader()}
        <Grid container spacing={2}>
          <RenderScreen
            components={this.getCardItems()}
            onFieldChange={this.onFieldChange}
          />
        </Grid>
        <Grid container spacing={2} className="rt-form-btn-cntr">
          <Button
            variant="contained"
            onClick={this.handleSearch}
            size="large"
            style={{
              color: "white",
              backgroundColor: "#fe7a51",
              borderRadius: "2px",
            }}>
            Search
          </Button>
          <Button
            variant="outlined"
            onClick={this.clearFields}
            size="large"
            style={{
              color: "#767676",
              backgroundColor: "#ffffff",
              borderRadius: "2px",
            }}
          >
            Reset
          </Button>
        </Grid>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return { state };
};

// const mapDispatchToProps = (dispatch) => {
//   return {};
// };

export default connect(mapStateToProps, null)(WnsReports);
