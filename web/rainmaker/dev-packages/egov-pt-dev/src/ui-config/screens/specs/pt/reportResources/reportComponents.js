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
  REPORT_TABLE_TITLE_MAPPER,
} from "./reportConstants";
import { taxCollectorWiseCollectionForm } from "./reportForms/taxCollectorWiseCollectionForm";
import { ulbWiseTaxCollectionForm } from "./reportForms/ulbWiseTaxCollectionForm";
import { propertyDetailsForm } from "./reportForms/propertyDetailsForm";
import { propertyWiseCollectionForm } from "./reportForms/propertyWiseCollectionForm"
import { propertyWiseDemandsForm } from "./reportForms/propertyWiseDemandsForm";

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
    case "taxCollectorWiseCollection":
      reportForm = taxCollectorWiseCollectionForm;
      break;
    case "ulbWiseTaxCollection":
      reportForm = ulbWiseTaxCollectionForm;
      break;
    case "propertyDetails":
      reportForm = propertyDetailsForm;
      break;
    case "propertyWiseCollection":
      reportForm = propertyWiseCollectionForm;
      break;
    case "propertyWiseDemands":
      reportForm = propertyWiseDemandsForm;
      break;
    default:
      break;
  }
  return reportForm;
};

export const getTableColumns = () => {
  let title = getQueryArg(window.location.href, "title");
  return REPORT_COLUMNS_MAPPER[title];
};

export const getTableTitle = () => {
  let title = getQueryArg(window.location.href, "title");
  return REPORT_TABLE_TITLE_MAPPER[title];
};
