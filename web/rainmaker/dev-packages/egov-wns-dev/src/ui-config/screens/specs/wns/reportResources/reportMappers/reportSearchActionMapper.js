import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import {
  billSummaryReportSearch,
  employeeDateWiseWSCollectionSearch,
  consumerMasterReportSearch,
  waterbillDemandReportSearch,
  consumerPaymentHistorySearch,
  newConsumerMonthlyReportSearch,
  consumerHistoryReportSearch,
  consumerBillHistoryReportSearch,
  connectionsEligibleForDemandGenerationSearch,
  employeeWiseWSCollectionSearch,
  schedulerBasedDemandsGenerationSearch,
  monthWisePendingBillGenerationSearch,
} from "../reportActions/reportSearchActions";

export const getTableData = async (params, state, dispatch) => {
  let tableData = null;
  let title = getQueryArg(window.location.href, "title");
  switch (title) {
    case "dateWiseEmployeeCollection":
      tableData = await employeeDateWiseWSCollectionSearch(
        params,
        state,
        dispatch
      );
      break;
    case "billsummaryreport":
      tableData = await billSummaryReportSearch(params, state, dispatch);
      break;
    case "consumerMasterReport":
      tableData = await consumerMasterReportSearch(params, state, dispatch);
      break;
    case "billsummaryreport":
      tableData = await billSummaryReportSearch(params, state, dispatch);
      break;
    case "waterMonthlyDemandReport":
      tableData = await waterbillDemandReportSearch(params, state, dispatch);
      break;
    case "consumerPaymentHistory":
      tableData = await consumerPaymentHistorySearch(params, state, dispatch);
      break;
    case "newConsumerMonthlyReport":
      tableData = await newConsumerMonthlyReportSearch(params, state, dispatch);
      break;
    case "consumerHistoryReport":
      tableData = await consumerHistoryReportSearch(params, state, dispatch);
      break;
    case "consumerBillHistoryReport":
      tableData = await consumerBillHistoryReportSearch(
        params,
        state,
        dispatch
      );
      break;
    case "connectionsEligibleForDemandGeneration":
      tableData = await connectionsEligibleForDemandGenerationSearch(
        params,
        state,
        dispatch
      );
      break;
    case "employeeWiseWSCollection":
      tableData = await employeeWiseWSCollectionSearch(params, state, dispatch);
      break;
    case "schedulerBasedDemandsGeneration":
      tableData = await schedulerBasedDemandsGenerationSearch(
        params,
        state,
        dispatch
      );
      break;
    case "monthWisePendingBillGeneration":
      tableData = await monthWisePendingBillGenerationSearch(
        params,
        state,
        dispatch
      );
      break;
    default:
      break;
  }
  return tableData; 
};
