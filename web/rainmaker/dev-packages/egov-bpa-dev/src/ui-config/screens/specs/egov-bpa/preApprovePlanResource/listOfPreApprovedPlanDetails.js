import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { httpRequest } from "../../../../../ui-utils/api";
import React from "react";
import get from "lodash/get";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { printPdf } from "egov-ui-kit/utils/commons";

import { getFileUrlFromAPI } from "egov-ui-framework/ui-utils/commons";
import store from "ui-redux/store";

// Document ddownload once you click on document link available in table row

const onDownloadClick = async (rowData, fileStoreId) => {
  const fileUrls = await getFileUrlFromAPI(fileStoreId);
  window.location = fileUrls[fileStoreId].split(",")[0];
  //printPdf(fileUrls[fileStoreId].split(",")[0]);
  
  
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
              {item.additionalDetails.title}
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

const handleStatusUpdate = async(e,updateValue,status,drawingNo) => {
  let state = store.getState();
  let PA = get(
    state.screenConfiguration.preparedFinalObject,
    "PA",
    {}
  );
  let selectedPreapprovedPlan = PA.preapprovedPlan.filter(item=>item.drawingNo === drawingNo)
  if(e.target.value === "No") {
    selectedPreapprovedPlan[0].active = true

  }else {
    selectedPreapprovedPlan[0].active = false
  }
  try{
    let queryObj = {
      "preapprovedPlan":selectedPreapprovedPlan[0]
    }
    const response = await httpRequest(
      "post",
      "/bpa-services/v1/preapprovedplan/_update",
      "_search",
      [],
      queryObj
    );
    if(response){
      console.log(".PA...",PA)
      store.dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "Pre-Approved plan updated Successfully",
            labelKey: "PREAPPROVE_UPDATE_SUCCESS",
          },
          "success"
        )
      );
    }
  }catch(err){
    store.dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "PA_UPDATE_FAIL",
          labelKey: err,
        },
        "error"
      )
    );
  }
  
  
}

const onApplicationRowClick = (value,tableData) => {
  const environment = process.env.NODE_ENV === "production" ? "citizen" : "";
  const origin = process.env.NODE_ENV === "production" ? window.location.origin + "/" : window.location.origin;
  store.dispatch(
    setRoute(
      `/egov-bpa/preapprove-search-preview?drawingNo=${value}`
    )
  );
  //window.location.assign(`${origin}${environment}/egov-bpa/preapprove-search-preview?drawingNo=${value}`);
}

// Configure pre approved plan MUI table.
// Using Switch from material ui to show toogle button
export const listOfPreAprrovedPlan = {
  uiFramework: "custom-molecules",
  componentPath: "Table",
  visible: true,
  props: {
    columns: [
      {
        labelName: "Status",
        labelKey: "PREAPPROVE_EDIT_TOOGLE_BUTTON",
        options: {
          filter: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                    checked={value.active}
                    value={value.active ? "Yes" : "No"}
                  />
                }
                onChange={(event) => {
                  handleStatusUpdate(
                    event,
                    updateValue,
                    tableMeta.rowData[0].active,
                    tableMeta.rowData[0].drawingNo
                  );
                  updateValue(event.target.value === "Yes" ? false : true);
                }}
              />
            );
          },
        },
      },
      {
        labelName: "Building Plan No.",
        labelKey: "PREAPPROVE_BUILDING_PLAN",
        options: {
          filter: false,
          customBodyRender: (value, tableMeta) => (
            <a href="javascript:void(0)" onClick={() => onApplicationRowClick(tableMeta.rowData[1])}>{value}</a>
        )
        },
      },
      {
        labelName: "Tenat Id",
        labelKey: "PREAPPROVE_TENANT_ID",
        options: {
          display: false
        }
      },
      { labelName: "Length(in ft.)", labelKey: "PREAPPROVE_LENGTH" },
      { labelName: "Width(in ft)", labelKey: "PREAPPROVE_WIDTH" },
      {
        labelName: "Abutting road",
        labelKey: "PREAPPROVE_ABUTTING_ROAD_COLUMN",
      },
      { labelName: "Plot area", labelKey: "PREAPPROVE_PLOT_AREA_COLUMN" },
      { labelName: "Build-up area", labelKey: "PREAPPROVE_BUILD_UP_AREA" },
      { labelName: "No. of floors", labelKey: "PREAPPROVE_FLOORS" },      
      { labelName: "Total FAR", labelKey: "PREAPPROVE_FAR" },
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
      // onRowClick: (row, index) => {
      //   onApplicationRowClick(row);
      // },
    },
    customSortColumn: {},
  },
};