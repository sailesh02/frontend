import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {
  taxCollectorWiseCollectionSearch,
  ulbWiseTaxCollectionSearch,
  propertyDetailsSearch,
  propertyCollectionSearch,
  propertyWiseDemandsSearch,
} from "../reportActions/reportSearchActions";

export const getTableData = async (params, state, dispatch) => {
  let tableData = null;
  let title = getQueryArg(window.location.href, "title");
  switch (title) {
    case "taxCollectorWiseCollection":
      tableData = await taxCollectorWiseCollectionSearch(
        params,
        state,
        dispatch
      );
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
  return tableData;
};
