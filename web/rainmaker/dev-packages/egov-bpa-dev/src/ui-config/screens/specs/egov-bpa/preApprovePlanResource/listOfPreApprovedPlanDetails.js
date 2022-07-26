import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import React from "react";
import { getFileUrlFromAPI } from "egov-ui-framework/ui-utils/commons";

// Document ddownload once you click on document link available in table row
const onDownloadClick = async (rowData, fileStoreId) => {
  const fileUrls = await getFileUrlFromAPI(fileStoreId);
  window.location = fileUrls[fileStoreId];
};

// Iterate document array and show the number of documents to download in row .
const colData = (colArrayData, tableMeta) => {
  const documentType = ["Drawing", "File", "Image"];
  if (colArrayData != null && colArrayData.length > 0) {
    return colArrayData.map((item, index) => {
      if (item.hasOwnProperty("id") && item.hasOwnProperty("fileStoreId")) {
        const { id, fileStoreId } = item;
        return (
          <a
            href="javascript:void(0)"
            onClick={() => onDownloadClick(tableMeta.rowData, fileStoreId)}
          >
            <span style={{ wordSpacing: "5px" }}>
              {documentType[index]}
              {"    "}
            </span>
          </a>
        );
      }
    });
  } else {
    return "";
  }
};

// Configure pre approved plan MUI table.
// Using Switch from material ui to show toogle button
export const listOfPreAprrovedPlan = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: true,
  props: {
    columns: [
      {
        labelName: "Edit Toogle Button",
        labelKey: "PREAPPROVE_EDIT_TOOGLE_BUTTON",
        options: {
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                    checked={value}
                    value={value ? "Yes" : "No"}
                  />
                }
                onChange={(event) => {
                  updateValue(event.target.value === "Yes" ? false : true);
                }}
              />
            );
          },
        },
      },
      { labelName: "Building Plan No.", labelKey: "PREAPPROVE_BUILDING_PLAN" },
      {
        labelName: "Plot size.",
        labelKey: "PREAPPROVE_PLOT_SIZE",
      },
      { labelName: "Abutting road", labelKey: "PREAPPROVE_ABUTTING_ROAD" },
      { labelName: "Plot area", labelKey: "PREAPPROVE_PLOT_AREA" },
      { labelName: "Build-up area", labelKey: "PREAPPROVE_BUILD_UP_AREA" },
      // { labelName: "No. of floors", labelKey: "PREAPPROVE_FLOORS" },
      // { labelName: "Front setback", labelKey: "PREAPPROVE_FRONT_SETBACK" },
      // { labelName: "Rear setback", labelKey: "PREAPPROVE_REAR_SETBACK" },
      // { labelName: "Side setback", labelKey: "PREAPPROVE_SIDE_SETBACK" },
      {
        labelName: "BPA_COMMON_TABLE_COL_ACTION_LABEL",
        labelKey: "BPA_COMMON_TABLE_COL_ACTION_LABEL",
        options: {
          filter: false,
          customBodyRender: (value, tableMeta) => colData(value, tableMeta),
        },
      },
    ],
    title: {
      labelName: "List of Preapproved-plans",
      labelKey: "PREAPPROVE_LIST_OF_PRE_APPROVED_PLAN",
    },
    rows: "",
    options: {
      viewColumns: false,
      print: false,
      filter: false,
      download: false,
      responsive: "scroll",
      selectableRows: false,
      hover: false,
      rowsPerPageOptions: [10, 15, 20],
    },
    customSortColumn: {},
  },
};