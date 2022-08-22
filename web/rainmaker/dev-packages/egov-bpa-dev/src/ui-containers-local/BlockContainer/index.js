import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { getFileUrlFromAPI } from "egov-ui-framework/ui-utils/commons";
import MUIDataTable from "mui-datatables";
import { generatePreapproveBill } from "../../ui-config/screens/specs/utils";
import { Dialog, DialogContent } from "@material-ui/core";
import {
  getLocaleLabels,
} from "egov-ui-framework/ui-utils/commons";

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
    isOpen: false,
    image: "",
  };
  handleShowDialog = () => {
    this.setState({ isOpen: !this.state.isOpen });
    console.log("cliked");
  };
  // Document ddownload once you click on document link available in table row
  onDownloadClick = async (fileStoreId) => {
    const fileUrls = await getFileUrlFromAPI(fileStoreId);
    window.location = fileUrls[fileStoreId].split(",")[0];
  };
  setValue = (item) => {
    const { data,localizationLabels } = this.props;
    const list = data.map((listData, index) => {
      listData.selected = false;
      if (listData.drawingNo === item.drawingNo) {
        if (!item.selected) {
          listData.selected = true;
          this.setState({ image: item.documents[2].fileUrl });
          this.props.setImagePreview("imagePreview",!this.state.isOpen)
          
        }
      }
      return listData;
    });
    generatePreapproveBill().then((res) => {
      let sancfee = [];
      let appfee = []
      res.sancFee.Calculations[0].taxHeadEstimates.forEach((item, index) => {
        
        item.taxHeadCode = getLocaleLabels(
          item.taxHeadCode,
          item.taxHeadCode,
          localizationLabels
        );
        sancfee.push(item);
      });
      res.appFee.Calculations[0].taxHeadEstimates.forEach((item, index) => {
        item.taxHeadCode = getLocaleLabels(
          item.taxHeadCode,
          item.taxHeadCode,
          localizationLabels
        );
        appfee.push(item);
      });
      list.sancfee = sancfee;
      list.appfee = appfee;
      item.sancfee = sancfee;
      item.appfee = appfee;
      this.setState({ item: item, selected: true });
      this.handleShowDialog();
      this.props.updateList("preapprovePlanList", list);
      this.props.selectedPlot("Scrutiny[1].preApprove.selectedPlot", item);
    });
  };
  render() {
    const { data,localizationLabels } = this.props;
    const noPlotsAvailableLabel = getLocaleLabels(
      "PREAPPROVE_NO_PLOTS",
      "No Plots available with these search details",
      localizationLabels
    );
    const noPlotsLabel = getLocaleLabels(
      "PREAPPROVE_PLOTS_NOT_AVAILABLE",
      "Plots not Available",
      localizationLabels
    );
    const drawingNumber = getLocaleLabels(
      "BPA_DRAWING_NO_LABEL",
      "Drawing Number",
      localizationLabels
    );
    const feeDetails = getLocaleLabels(
      "PREAPPROVE_FEE_DETAILS",
      "Fee Details",
      localizationLabels
    );
    const documentLabel = getLocaleLabels(
      "PREAPPROVE_DOCUMENT_LABEL",
      "Documents(Please download the documents to preview drawing details)",
      localizationLabels
    );
    const sancFee = getLocaleLabels(
      "PREAPPROVE_SANC_FEE_LABEL",
      "Sanction Fee Details",
      localizationLabels
    );
    const appFee = getLocaleLabels(
      "PREAPPROVE_APP_FEE_LABEL",
      "Application Fee Details",
      localizationLabels
    );
    return (
      <div>
        {data ? (
          <div>
            {data.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
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
                {this.state.isOpen && (
                  <Dialog
                    fullScreen={true}
                    open={open}
                    onClose={this.handleShowDialog}
                    maxWidth={false}
                  >
                    <DialogContent
                      children={
                        <img
                          style={{
                            width: "100%",
                          }}
                          src={this.state.image}
                          onClick={this.handleShowDialog}
                          alt="no image"
                        />
                      }
                    />
                  </Dialog>
                )}
              </div>
            ) : (
              <div>
                <h3>{noPlotsAvailableLabel}</h3>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h3>{noPlotsLabel}</h3>
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
                fontSize: "14px",
              }}
            >
              <div>
                <h3>{drawingNumber}</h3>
                <h5>{this.state.item.drawingNo}</h5>
              </div>
              <div>
                <h3>{feeDetails}</h3>
                <Fragment>
                  {this.state.item.sancfee && (
                    <Fragment>
                      <h4>{sancFee}</h4>
                      {this.state.item.sancfee.map((item, index) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                          }}
                        >
                          <h5>{item.taxHeadCode}:</h5>
                          {"    "}
                          <h5>{item.estimateAmount}</h5>
                        </div>
                      ))}
                    </Fragment>
                  )}
                  {this.state.item.appfee && (
                    <Fragment>
                      <h4>{appFee}</h4>
                      {this.state.item.appfee.map((item, index) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                          }}
                        >
                          <h5>{item.taxHeadCode}:</h5>
                          {"    "}
                          <h5>{item.estimateAmount}</h5>
                        </div>
                      ))}
                    </Fragment>
                  )}
                </Fragment>
              </div>
            </div>
            <div>
              <h4>{documentLabel}</h4>
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
                          {`Documet-${index} : ${item.additionalDetails.title}`}
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
    setImagePreview: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value)),
  };
};

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(BlockContainer)
);
