import { dateWiseEmployeeCollectionForm } from "../reportForms/dateWiseEmployeeCollectionForm";
import { billSummaryReportForm } from "../reportForms/billSummaryreportFrom";
import { consumerMasterReportForm } from "../reportForms/consumerMasterReportForm";
import { waterMonthlyDemandReportForm } from "../reportForms/waterMonthlyDemandReportForm";
import { consumerPaymentHistoryForm } from "../reportForms/consumerPaymentHistoryForm";
import { newConsumerMonthlyReportForm } from "../reportForms/newConsumerMonthlyReportForm";
import { consumerHistoryReportForm } from "../reportForms/consumerHistoryReportForm";
import { consumerBillHistoryReportForm } from "../reportForms/consumerBillHistoryReportForm";
import { connectionsEligibleForDemandGenerationForm } from "../reportForms/connectionsEligibleForDemandGeneration";
import { employeeWiseWSCollectionFrom } from "../reportForms/employeeWiseWSCollectionFrom";
import { schedulerBasedDemandsGenerationForm } from "../reportForms/schedulerBasedDemandsGenerationForm";
import { monthWisePendingBillGenerationForm } from "../reportForms/monthWisePendingBillGenerationForm";

// import and add form items array
export const REPORT_FORM_ITEMS_MAPPER = {
  dateWiseEmployeeCollection: dateWiseEmployeeCollectionForm,
  consumerMasterReport: consumerMasterReportForm,
  billsummaryreport: billSummaryReportForm,
  waterMonthlyDemandReport: waterMonthlyDemandReportForm,
  consumerPaymentHistory: consumerPaymentHistoryForm,
  newConsumerMonthlyReport: newConsumerMonthlyReportForm,
  consumerHistoryReport: consumerHistoryReportForm,
  consumerBillHistoryReport: consumerBillHistoryReportForm,
  connectionsEligibleForDemandGeneration:
    connectionsEligibleForDemandGenerationForm,
  employeeWiseWSCollection: employeeWiseWSCollectionFrom,
  schedulerBasedDemandsGeneration: schedulerBasedDemandsGenerationForm,
  monthWisePendingBillGeneration: monthWisePendingBillGenerationForm,
};
