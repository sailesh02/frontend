import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { RevisionDocumentList } from "../../ui-molecules-local";
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

class RevisionDocumentListContainer extends Component {
  render() {
    const { uploadedDocuments, ...rest } = this.props;
    return <RevisionDocumentList uploadedDocsInRedux={uploadedDocuments} {...rest} />;
  }
}

const mapStateToProps = state => {
  let documentsList = get(state, "screenConfiguration.preparedFinalObject.documentsContractRvsn", []);
  const documents = get(state.screenConfiguration.preparedFinalObject, "applyScreen.documents", []);
  const uploadedDocuments = get(state.screenConfiguration.preparedFinalObject, "displayDocs");
  return { documentsList, uploadedDocuments, documents };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    null
  )(RevisionDocumentListContainer)
);