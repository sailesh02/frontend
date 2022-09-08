import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "../../../../../../ui-utils";
import { sortByEpoch, getEpochForDate } from "../../../utils";
import commonConfig from "config/common.js";
import { getTableData } from "../reportMappers/reportSearchActionMapper";
import { REPORT_COLUMNS_MAPPER } from "../reportMappers/reportColumnMapper";
import { REPORT_TABLE_TITLE_MAPPER } from "../reportMappers/reportLabelMapper";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

export const getCurrentDate = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + "-" + mm + "-" + dd;
  return today;
};
export const dateToEpochStartDay = (date) => {
  let start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);
  return Date.parse(start);
};
export const dateToEpochEndDay = (date) => {
  let end = new Date(date);
  end.setUTCHours(23, 59, 59, 999);
  return Date.parse(end);
};

export const customSortFunction = (data, i, sortDateOrder) => {
  const epochDates = data.reduce((acc, curr) => {
    acc.push([...curr, getEpochForDate(curr[4], "dayend")]);
    return acc;
  }, []);
  const order = sortDateOrder === "asc" ? true : false;
  const finalData = sortByEpoch(epochDates, !order).map((item) => {
    item.pop();
    return item;
  });
  return { data: finalData, currentOrder: !order ? "asc" : "desc" };
};

// Add MDMS Data
export const getMdmsData = async (action, state, dispatch) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants",
            },
          ],
        },
      ],
    },
  };
  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};

const setCommonReportTable = (key, value, dispatch) => {
  dispatch(
    handleField(
      "report",
      "components.div.children.commonReportTable",
      key,
      value
    )
  );
};

const onSuccessSearch = (tableData, dispatch) => {
  const currTitle = getQueryArg(window.location.href, "title");
  setCommonReportTable(
    "props.title",
    { labelName: REPORT_TABLE_TITLE_MAPPER[currTitle] },
    dispatch
  );
  setCommonReportTable(
    "props.columns",
    REPORT_COLUMNS_MAPPER[currTitle],
    dispatch
  );
  setCommonReportTable("props.data", tableData, dispatch);
  setCommonReportTable("props.rows", tableData.length, dispatch);
  setCommonReportTable("visible", true, dispatch);
  dispatch(prepareFinalObject("tableData", tableData));
};

export const getSearchAction = async (params, state, dispatch) => {
  setCommonReportTable("visible", false, dispatch);
  dispatch(prepareFinalObject("reportLoader", true));
  try {
    const tableData = await getTableData(params, state, dispatch);
    tableData && onSuccessSearch(tableData, dispatch);
    dispatch(prepareFinalObject("reportLoader", false));
  } catch (error) {
    console.log(error);
    dispatch(prepareFinalObject("reportLoader", false));
  }
};
