import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { getFileUrlFromAPI } from "egov-ui-framework/ui-utils/commons";
import MUIDataTable from "mui-datatables";
import { generatePreapproveBill } from "../../ui-config/screens/specs/utils";

const styles = {
  root: {
    color: "black",
  },
  preApprove_blockpDetails: {
    width: "150px",
    height: "150px",
  },
  selected_preApprove_blockpDetails: {
    width: "150px",
    height: "150px",
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
    window.location = fileUrls[fileStoreId].split(",")[0];
  };
  setValue = (item) => {
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
    generatePreapproveBill().then((res) => {
      let totalFee =
        parseFloat(
          res.sancFee.Calculations[0].taxHeadEstimates.reduce(
            (sum, current) => sum + current.estimateAmount,
            0
          )
        ) +
        parseFloat(
          res.appFee.Calculations[0].taxHeadEstimates.reduce(
            (sum, current) => sum + current.estimateAmount,
            0
          )
        );
      list.totalFee = totalFee;
      item.totalFee = totalFee;
      this.setState({ item: item, selected: true });
      this.props.updateList("preapprovePlanList", list);
      this.props.selectedPlot("Scrutiny[1].preApprove.selectedPlot", item);
    });
  };
  render() {
    const { data } = this.props;
    return (
      <div>
        {data ? (
          <div>
            {data.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                {data.map((item, index) => (
                  <img
                    src={item.documents[2].fileUrl}
                    key={index}
                    className="preApprove_blockpDetails"
                    value={item}
                    onClick={() => this.setValue(item)}
                    style={
                      item.selected
                        ? styles.selected_preApprove_blockpDetails
                        : styles.preApprove_blockpDetails
                    }
                  />
                ))}
              </div>
            ) : (
              <div>
                <h3>No Plots available with these search details</h3>
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
            <div
              style={{
                display: "flex",
                gap: "15",
                fontSize: "14px",
              }}
            >
              <div>
                <h3>Drawing Number</h3>
                <h5>{this.state.item.drawingNo}</h5>
              </div>
              <div
                style={{
                  marginLeft: "50px",
                }}
              >
                <h3>Total Fee</h3>
                <h5>{this.state.item.totalFee}</h5>
              </div>
            </div>
            <div>
              <h4>
                Documents(Please download the documents to preview drawing
                details)
              </h4>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  gap: "5",
                  fontSize: "14px",
                  marginBottom: "20px",
                }}
              >
                {this.state.item.documents.map((item, index) => (
                  <Fragment>
                    {item.additionalDetails.title !=
                      "PREAPPROVE_BUILDING_PLAN_FILE" && (
                      <a
                        key={index}
                        style={{
                          padding: "10px",
                          border: "2px solid",
                          color: "#FF851B",
                          fontWeight: "500",
                          background: "transparent",
                          background: "lightgoldenrodyellow",
                        }}
                      >
                        <span
                          onClick={() => this.onDownloadClick(item.fileStoreId)}
                        >
                          {`Documet-${index + 1} : ${
                            item.additionalDetails.title
                          }`}
                        </span>
                      </a>
                    )}
                  </Fragment>
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
