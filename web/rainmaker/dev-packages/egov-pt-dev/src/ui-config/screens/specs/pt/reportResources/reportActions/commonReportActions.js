import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { REPORT_DROPDOWN_OPTIONS } from "../reportConstants";
import {
  taxCollectorWiseCollectionSearch,
  ulbWiseTaxCollectionSearch,
  propertyDetailsSearch,
  propertyCollectionSearch,
  propertyWiseDemandsSearch
} from "./reportSearchActions";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "../../../../../../ui-utils";
import commonConfig from "config/common.js";

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

export const setDropdownOpts = (action, state, dispatch) => {
  let title = getQueryArg(window.location.href, "title");
  const keys = REPORT_DROPDOWN_OPTIONS[title]
    ? Object.keys(REPORT_DROPDOWN_OPTIONS[title])
    : [];
  keys.forEach((eachKey) => {
    dispatch(
      prepareFinalObject(
        `reportDropdownOpts.${eachKey}`,
        REPORT_DROPDOWN_OPTIONS[title][eachKey]
      )
    );
  });
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

const onSuccessSearch = (tableData, dispatch) => {
  dispatch(
    handleField(
      "report",
      "components.div.children.commonReportTable",
      "props.data",
      tableData
    )
  );
  dispatch(
    handleField(
      "report",
      "components.div.children.commonReportTable",
      "props.rows",
      tableData.length
    )
  );
  dispatch(
    handleField(
      "report",
      "components.div.children.commonReportTable",
      "visible",
      true
    )
  );
  dispatch(prepareFinalObject("tableData", tableData));
};

// Add Search Actions
const getTableData = async (params, state, dispatch) => {
  dispatch(prepareFinalObject("reportLoader", true));
  let tableData = null;
  let title = getQueryArg(window.location.href, "title");
  switch (title) {
    case "taxCollectorWiseCollection":
      tableData = await taxCollectorWiseCollectionSearch(params, state, dispatch);
      break;
    case "ulbWiseTaxCollection":
      tableData = await ulbWiseTaxCollectionSearch(params, state, dispatch);
      break;
    case "propertyDetails":
      tableData = await propertyDetailsSearch(params, state, dispatch);
      break;
    case "propertyWiseCollection":
      tableData = await propertyCollectionSearch(params, state, dispatch);
      break;
    case "propertyWiseDemands":
      tableData = await propertyWiseDemandsSearch(params, state, dispatch);
      break;

    default:
      break;
  }
  tableData && onSuccessSearch(tableData, dispatch);
  dispatch(prepareFinalObject("reportLoader", false));
};

export const getSearchAction = (params, state, dispatch) => {
  dispatch(
    handleField(
      "report",
      "components.div.children.commonReportTable",
      "visible",
      false
    )
  );
  try {
    getTableData(params, state, dispatch);
  } catch (error) {
    console.log(error);
  }
};
