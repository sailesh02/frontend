import React, { Component } from "react";
import { BpaFeesEstimateCard } from "../../ui-molecules-local";
import { connect } from "react-redux";
import get from "lodash/get";

class BpaEstimateCardContainer extends Component {
  render() {
    return <BpaFeesEstimateCard estimate={this.props.estimate} />;
  }
}

const mapStateToProps = (state, ownProps) => {
  const { screenConfiguration } = state;
  const fees = get(screenConfiguration, "preparedFinalObject.applyScreenMdmsData.estimateCardData", []);
  const applicationStatus = get(screenConfiguration, "preparedFinalObject.BPA.status", '');
  const estimate = {
    header: { labelName: "Fee Estimate", labelKey: "BPA_SUMMARY_FEE_EST" },
    fees,
    applicationStatus
  };
  return { estimate };
};

export default connect(
  mapStateToProps,
  null
)(BpaEstimateCardContainer);
