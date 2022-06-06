import React, { Component } from "react";
import { BpaSanctionFeesCard } from "../../ui-molecules-local";
import { connect } from "react-redux";
import get from "lodash/get";

class BpaSanctionFeeCardContainer extends Component {
  render() {
    return <BpaSanctionFeesCard estimate={this.props.estimate} />;
  }
}

const mapStateToProps = (state, ownProps) => {
  const { screenConfiguration } = state;
  const fees = get(screenConfiguration, "preparedFinalObject.applyScreenMdmsData.sanctionFeeCardData", []);
  const estimate = {
    header: { labelName: "Fee Estimate", labelKey: "BPA_SANCTION_FEE_SUMMARY" },
    fees
  };
  return { estimate };
};

export default connect(
  mapStateToProps,
  null
)(BpaSanctionFeeCardContainer);
