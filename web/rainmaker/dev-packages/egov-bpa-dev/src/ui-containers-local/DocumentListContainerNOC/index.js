import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { DocumentListNOC } from "../../ui-molecules-local";
import { connect } from "react-redux";
import get from "lodash/get";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    padding: "8px 38px"
  },
  input: {
    display: "none !important"
  }
});

class DocumentListContainerNOC extends Component {
  render() {
    const { ...rest } = this.props;
    return <DocumentListNOC {...rest} />;
  }
}

const mapStateToProps = state => {
  let documentsList = get(
    state,
    "screenConfiguration.preparedFinalObject.documentsContractNOC",
    []
  );
  return { documentsList };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    null
  )(DocumentListContainerNOC)
);
