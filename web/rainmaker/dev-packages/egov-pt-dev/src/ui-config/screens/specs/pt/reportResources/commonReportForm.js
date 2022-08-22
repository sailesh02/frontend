import {
  getCommonCard,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getReportSubHeader, getFormItems, getTableColumns, getTableTitle } from "./reportComponents";
import { getSearchAction } from "./reportActions/commonReportActions";
import { sortByEpoch, getEpochForDate } from "../../utils"

export const commonReportForm = getCommonCard({
  subHeader: getReportSubHeader(),
  reportForm: {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-wns",
    componentPath: "WnsReports",
    props: {
      formItems: getFormItems(),
      searchAction: getSearchAction,
    },
  },
});

export const commonReportTable = {
  uiFramework: "custom-molecules-local",
  moduleName: "egov-wns",
  componentPath: "WnsReportTable",
  visible: false,
  props: {
    columns: getTableColumns(),
    title: {
      labelName: getTableTitle(),
    },
    rows: "",
    options: {
      filter: false,
      download: false,
      // customToolbar: excelDownloadButton,
      responsive: "scroll",
      selectableRows: false,
      hover: false,
      viewColumns: false,
      rowsPerPageOptions: [10, 20, 50, 100],
    },
    customSortColumn: {
      column: "Application Date",
      sortingFn: (data, i, sortDateOrder) => {
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
      },
    },
  },
};

