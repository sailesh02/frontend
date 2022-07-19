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
    width: "300px",
    height: "50px",
    backgroundColor: "#FF851B",
  },
  selected_preApprove_blockpDetails: {
    width: "300px",
    height: "50px",
    backgroundColor: "#FF851B",
    border: "5px solid #AAAAAA",
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
    this.setState({ item: item, selected: true });
    const { data } = this.props;
    const list = data.map((listData, index) => {
      listData.selected = false;
      if (listData.drawingNo === item.drawingNo) {
        if (!item.selected) {
          listData.selected = true;
        }
      }
      return listData;
    });
    this.props.updateList("preapprovePlanList", list);
    this.props.selectedPlot("Scrutiny[1].preApprove.selectedPlot", item);
  };
  render() {
    const { data } = this.props;
    return (
      <div>
        {data ? (
          <div>
            {data.length > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                  marginBottom: "20px"
                }}
              >
                {data.map((item, index) => (
                  <div
                    key={index}
                    className="preApprove_blockpDetails"
                    value={item}
                    onClick={() => this.setValue(item)}
                    style={
                      item.selected
                        ? styles.selected_preApprove_blockpDetails
                        : styles.preApprove_blockpDetails
                    }
                  ></div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <h3>Plots not Available</h3>
          </div>
        )}

        {this.state.item && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              flexDirection: "column",
              gap: "5",
              marginTop: "30px",
              fontSize: "14px",
            }}
          >
            <div>
              <h3>Drawing Number</h3>
              <h5>{this.state.item.drawingNo}</h5>
            </div>
            <div>
              <h4>Documents(Please download the documents to preview drawing details)</h4>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  gap: "5",
                  fontSize: "14px",
                }}
              >
                {this.state.item.documents.map((item, index) => (
                  <a
                    key={index}
                    style={{ paddingRight: "10px" }}
                    onClick={() => this.onDownloadClick(item.fileStoreId)}
                  >{`Documet ${index}`}</a>
                ))}
              </div>
            </div>
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
    updateList: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value)),
  };
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(BlockContainer)
);
