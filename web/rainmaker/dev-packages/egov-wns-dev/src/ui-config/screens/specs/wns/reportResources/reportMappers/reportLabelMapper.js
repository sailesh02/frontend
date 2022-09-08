export const REPORT_HEADER_MAPPER = {
  dateWiseEmployeeCollection: "Employee Date Wise WS Collection",
  consumerMasterReport: "W&S Consumer Master Report",
  billsummaryreport: "W&S Bill Summary Report",
  waterMonthlyDemandReport: "Water Monthly Demands Report",
  consumerPaymentHistory: "W&S Consumer Payment History Report",
  newConsumerMonthlyReport: "W&S New Consumer Monthly Report",
  consumerHistoryReport: "W&S Consumer History Report",
  consumerBillHistoryReport: "Consumer Wise Demand History",
  connectionsEligibleForDemandGeneration:
    "WS Connections Eligible For Demand Generation",
  employeeWiseWSCollection: "Employee Wise WS Collection Report",
  schedulerBasedDemandsGeneration:
    "WS Scheduler Based Demands Generation Report",
  monthWisePendingBillGeneration: "Month Wise Pending Bill Generation",
};

export const REPORT_SUB_HEADER_MAPPER = {
  dateWiseEmployeeCollection: "Modify report by date range",
  consumerMasterReport: "Modify report by date range",
  billsummaryreport: "Modify report by date range",
  waterMonthlyDemandReport: "Modify report by date range",
  consumerPaymentHistory: "Modify report by date range",
  newConsumerMonthlyReport: "Modify report by date range",
  consumerHistoryReport: "Modify report by date range",
  consumerBillHistoryReport: "Modify report by date range",
  connectionsEligibleForDemandGeneration: "Modify report by date range",
  employeeWiseWSCollection: "Modify report by date range",
  schedulerBasedDemandsGeneration: "Modify report by date range",
  monthWisePendingBillGeneration: "Modify report by date range",
};

export const REPORT_TABLE_TITLE_MAPPER = {
  dateWiseEmployeeCollection: "Employee Date Wise WS Collection Report",
  consumerMasterReport: "Consumer Master Report",
  billsummaryreport: "W&S Bill Summary Report",
  waterMonthlyDemandReport: "Water Monthly Demands Report",
  consumerPaymentHistory: "Consumer Payment History Report",
  newConsumerMonthlyReport: "New Consumer Monthly Report",
  consumerHistoryReport: "Consumer History Report",
  consumerBillHistoryReport: "W&S Consumer Wise Demand History",
  connectionsEligibleForDemandGeneration:
    "WS Connections Eligible For Demand Generation",
  employeeWiseWSCollection: "Employee Wise WS Collection",
  schedulerBasedDemandsGeneration: "WS Scheduler Based Demands Generation",
  monthWisePendingBillGeneration: "Month Wise Pending Bill Generation",
};

export const REPORT_DROPDOWN_OPTIONS = {
  dateWiseEmployeeCollection: {
    paymentMode: [
      {
        code: "CASH",
        name: "Cash",
      },
      {
        code: "OFFLINE_NEFT",
        name: "NEFT",
      },
      {
        code: "CHEQUE",
        name: "CHEQUE",
      },
      {
        code: "CARD",
        name: "mPOS/Card",
      },
      {
        code: "OFFLINE_RTGS",
        name: "RTGS",
      },
      {
        code: "POSTAL_ORDER",
        name: "Postal Order",
      },
      {
        code: "ONLINE",
        name: "Online",
      },
    ],
  },
  consumerMasterReport: {
    connectionType: [
      {
        code: "Metered",
        name: "Metered",
      },
      {
        code: "Non Metered",
        name: "Non Metered",
      },
    ],
  },
  waterMonthlyDemandReport: {
    connectionType: [
      {
        code: "Metered",
        name: "Metered",
      },
      {
        code: "Non Metered",
        name: "Non Metered",
      },
    ],
  },
};
