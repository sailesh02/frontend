import React from "react";
import Chip from "@material-ui/core/Chip";
import TextFieldContainer from "egov-ui-framework/ui-containers/TextFieldContainer";
import LabelContainer from "egov-ui-framework/ui-containers/LabelContainer";
import Grid from "@material-ui/core/Grid";
import { Button } from "egov-ui-framework/ui-atoms";
import store from "ui-redux/store";
import { connect } from "react-redux";
import { prepareFinalObject, showSpinner, hideSpinner, toggleSnackbar, toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";

class ChipsInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chipValues: [],
      consumerNo: ''
    }
  }

  handleDelete = (chipToDelete) => () => {

    let filteredChips = this.state.chipValues.filter((chip) => chip.label !== chipToDelete.label);
    this.setState({ chipValues: filteredChips },
      (() => {

        store.dispatch(prepareFinalObject('BulkBillCriteria.connectionNos', this.state.chipValues))
      })

    );
  };

  handleChange = (e) => {

    this.setState({ consumerNo: e.target.value })
  }

  onAddButtonCLick = () => {



    let checkDuplicates = this.state.chipValues;
    let isDuplicate = checkDuplicates && checkDuplicates.filter((item) => item.label == this.state.consumerNo);

    if (this.state && this.state.consumerNo !== undefined && this.state.consumerNo !== "" && this.state.consumerNo.match(/^[a-zA-Z0-9/-]*$/) && isDuplicate && isDuplicate.length < 1) {

      let chips = this.state.chipValues;
      chips.push({ label: this.state.consumerNo })

      this.setState({ chipValues: chips }, (() => {
        this.setState({ consumerNo: "" })
        store.dispatch(prepareFinalObject('BulkBillCriteria.connectionNos', this.state.chipValues))
      }))

    } else if (isDuplicate && isDuplicate.length > 0) {
      store.dispatch(toggleSnackbar(
        true,
        {
          labelName: "Duplicate consumer numbers are not allowed",
          labelKey: "WS_BILL_GENERATE_DUPLICATE_CONSUMER_NO",
        },
        "error"
      ));
    } else {
      store.dispatch(toggleSnackbar(
        true,
        {
          labelName: "Please enter valid consumer number",
          labelKey: "WS_BILL_GENERATE_NOT_VALID_CONSUMER_NO",
        },
        "error"
      ));
    }

  }

  render() {
    const { chipValues } = this.state;

    const { label, required } = this.props;

    return (
      <Grid container md={12} xs={12} sm={12}>
        <Grid container md={12} xs={12} sm={12} style={{ marginBottom: 12 }}>
          <Grid item md={3} xs={6}>
            <LabelContainer
              labelKey={label.labelKey}
              fontSize={14}
              style={{ fontSize: 14, color: "rgba(0, 0, 0, 0.60" }}
            />
            {required ? <span style={{ color: "red" }}> *</span> : ""}
          </Grid>
        </Grid>
        <Grid container md={12} xs={12} sm={12} style={{ marginBottom: 12 }}>
          <Grid item md={4} xs={4}>
            <TextFieldContainer
              value={this.state.consumerNo}
              onChange={this.handleChange}
            // jsonPath={`taxRoundOffAmount`}
            />
            
          </Grid>
          <Grid item md={4} xs={4}>
            <Button
              style={{
                height: 36,
                lineHeight: "auto",
                minWidth: "inherit",
                marginLeft: "20px"
              }}
              className="assessment-button"
              variant="contained"
              color="primary"
              onClick={this.onAddButtonCLick}
            >
              <LabelContainer
                labelName={`ADD`}
                labelKey=
                {`ADD`}
              />
            </Button>
          </Grid>
        </Grid>
        <Grid container md={12} xs={12} sm={12}>
          <Grid item md={12} xs={12}>
            {chipValues && chipValues.length > 0 && chipValues.map((item) => {
              return <span style={{ marginRight: "10px", marginBottom: "10px", marginTop: "10px" }}><Chip

                label={item.label}
                onDelete={this.handleDelete(item)}
              /></span>
            })
            }
          </Grid>
        </Grid>
      </Grid>
    )
  }


}

const mapDispatchToProps = dispatch => {
  return {


    toggleSnackbar: (open, message, variant) => dispatch(toggleSnackbar(open, message, variant))

  };
};

export default connect(
  null,
  mapDispatchToProps
)(ChipsInput)