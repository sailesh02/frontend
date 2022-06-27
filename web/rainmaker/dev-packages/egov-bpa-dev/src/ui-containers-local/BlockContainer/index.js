import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { getFileUrlFromAPI } from "egov-ui-framework/ui-utils/commons";

const styles = {
  root: {
    color: "black",
  },
  preApprove_blockpDetails: {
    height: 20,
    width: 40,
    backgroundColor: "orange",
  },
};
class BlockContainer extends Component {
  state = {
    item: null,
    selected: false,
  };
  // Document ddownload once you click on document link available in table row
  onDownloadClick = async (fileStoreId) => {
    const fileUrls = await getFileUrlFromAPI(fileStoreId);
    window.location = fileUrls[fileStoreId];
  };
  setValue = (item) => {
    this.setState({ item: item });
    this.props.selectedPlot("Scrutiny[1].preApprove.selectedPlot", item);
  };
  render() {
    const { data } = this.props;
    return (
      <div>
        {data ? (
          <div>
            {data.preapprovedPlan.length > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                {data.preapprovedPlan.map((item, index) => (
                  <div
                    key={index}
                    className="preApprove_blockpDetails"
                    value={item}
                    onClick={() => this.setValue(item)}
                    style={{
                      width: "300px",
                      height: "50px",
                      backgroundColor: "orange",
                    }}
                  ></div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <h3>Blocks Not Avlbl</h3>
          </div>
        )}

        {this.state.item && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "5",
              marginTop: "30px",
              fontSize: "14px",
            }}
          >
            {this.state.item.documents.map((item, index) => (
              <a
                key={index}
                style={{ padding: "10px" }}
                onClick={()=>this.onDownloadClick(item.fileStoreId)}
              >{`Documet ${index}`}</a>
            ))}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownprops) => {
  let data = "";
  const { localizationLabels } = state.app;
  const { jsonPath, callBack } = ownprops;
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  if (jsonPath) {
    data = get(preparedFinalObject, jsonPath);
  }
  return { data, localizationLabels };
};

const mapDispatchToProps = (dispatch) => {
  return {
    selectedPlot: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value)),
  };
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(BlockContainer)
);
