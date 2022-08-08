import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {
  getCommonContainer,
  getCommonHeader,
  getCommonTitle,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  REPORT_HEADER_MAPPER,
  REPORT_SUB_HEADER_MAPPER,
  REPORT_COLUMNS_MAPPER,
} from "./reportConstants";
import {dateWiseEmployeeCollectionForm} from "./reportForms/dateWiseEmployeeCollectionForm";


export const getReportHeader = () => {
  let title = getQueryArg(window.location.href, "title");
  const header = getCommonContainer({
    header: getCommonHeader({
      labelKey: REPORT_HEADER_MAPPER[title] ? REPORT_HEADER_MAPPER[title] : "",
    }),
  });
  return {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    children: {
      header: {
        gridDefination: {
          xs: 12,
          sm: 10,
        },
        ...header,
      },
    },
  };
};

export const getReportSubHeader = () => {
  let title = getQueryArg(window.location.href, "title");
  return getCommonTitle(
    {
      labelKey: REPORT_SUB_HEADER_MAPPER[title]
        ? REPORT_SUB_HEADER_MAPPER[title]
        : "",
    },
    {
      style: {
        marginBottom: 18,
      },
    }
  );
};

// import and add form element array
export const getFormItems = () => {
  let title = getQueryArg(window.location.href, "title");
  let reportForm = [];
  switch (title) {
    case "dateWiseEmployeeCollection":
      reportForm = dateWiseEmployeeCollectionForm;
      break;

    default:
      break;
  }
  return reportForm;
}

export const getTableColumns = () => {
  let title = getQueryArg(window.location.href, "title");
  return REPORT_COLUMNS_MAPPER[title];
};