import { getCommonCard } from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  customSortFunction,
  getSearchAction,
} from "./reportActions/commonReportActions";
import { getCommonTitle } from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  REPORT_HEADER_MAPPER,
  REPORT_SUB_HEADER_MAPPER,
  REPORT_DROPDOWN_OPTIONS,
} from "./reportMappers/reportLabelMapper";
import { REPORT_COLUMNS_MAPPER } from "./reportMappers/reportColumnMapper";
import { REPORT_FORM_ITEMS_MAPPER } from "./reportMappers/reportFormItemMapper";

export const commonReportForm = getCommonCard({
  subHeader: getCommonTitle({ labelKey: "" }, { style: { marginBottom: 18 } }),
  reportForm: {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-wns",
    componentPath: "WnsReports",
    props: {
      reportHeaders: REPORT_HEADER_MAPPER,
      reportSubHeaders: REPORT_SUB_HEADER_MAPPER,
      dropdownOptions: REPORT_DROPDOWN_OPTIONS,
      formItems: REPORT_FORM_ITEMS_MAPPER,
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
    tableColumnList: REPORT_COLUMNS_MAPPER,
    columns: [],
    title: {
      labelName: "",
    },
    rows: "",
    options: {
      filter: false,
      download: false,
      responsive: "scroll",
      selectableRows: false,
      hover: false,
      viewColumns: false,
      rowsPerPageOptions: [10, 20, 50, 100],
    },
    customSortColumn: {
      column: "Sl. No.",
      sortingFn: customSortFunction,
    },
  },
};

// *** Steps to create a new report screen ***

// 1. Map form labels the Header, Sub Header, Table Title and Dropdown options
//    in "./reportMappers/reportLabelMapper" file.
// 2. Create a new report form file in "./reportForms/<newFile>"
//    which contains the form structure array.
// 3. Add the form structure array to the "./reportMapper/reportFormItemMapper".
// 4. Write an search action function in the "./reportActions/reportSearchActions".
// 5. Map in the search action function in the "./reportMapper/reportSearchActionMapper".
// 6. Add the columns structure to the "./reportMapper/reportColumnMapper".
