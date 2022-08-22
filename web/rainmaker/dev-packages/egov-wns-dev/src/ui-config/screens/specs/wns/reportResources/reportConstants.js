export const REPORT_HEADER_MAPPER = {
  dateWiseEmployeeCollection: "Employee Date Wise WS Collection",
  consumerMasterReport: "W&S Consumer Master Report",
  billsummaryreport: "W&S Bill Summary Report",
  waterMonthlyDemandReport: "Water Monthly Demands Report",
  consumerPaymentHistory: "W&S Consumer Payment History Report",
  newConsumerMonthlyReport: "W&S New Consumer Monthly Report",
  consumerHistoryReport: "W&S Consumer History Report",
  consumerBillHistoryReport: "Consumer Wise Demand History",
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

export const REPORT_TABLE_TITLE_MAPPER = {
  dateWiseEmployeeCollection: "Employee Date Wise WS Collection Report",
  consumerMasterReport: "Consumer Master Report",
  billsummaryreport: "W&S Bill Summary Report",
  waterMonthlyDemandReport: "Water Monthly Demands Report",
  consumerPaymentHistory: "Consumer Payment History Report",
  newConsumerMonthlyReport: "New Consumer Monthly Report",
  consumerHistoryReport: "Consumer History Report",
  consumerBillHistoryReport: "W&S Consumer Wise Demand History",
};

export const REPORT_COLUMNS_MAPPER = {
  dateWiseEmployeeCollection: [
    {
      labelKey: "Sl. No.",
    },
    {
      labelKey: "ULB",
    },
    {
      labelKey: "Employee Id",
    },
    {
      labelKey: "Employee Name",
    },
    {
      labelKey: "Business Service",
    },
    {
      labelKey: "Head",
    },
    {
      labelKey: "Transaction Date",
    },
    {
      labelKey: "Payment Mode",
    },
    {
      labelKey: "Consumer Code",
    },
    {
      labelKey: "Receipt No",
    },
    {
      labelKey: "Collected Amount",
    },
  ],
  consumerMasterReport: [
    {
      labelKey: "Sl. No.",
    },
    {
      labelKey: "ULB",
    },
    {
      labelKey: "Ward Number",
    },
    {
      labelKey: "Consumer Name",
    },
    {
      labelKey: "Consumer Address",
    },
    {
      labelKey: "Mobile Number",
    },
    {
      labelKey: "Connection Number",
    },
    {
      labelKey: "Old Connection Number",
    },
    {
      labelKey: "Connection Type",
    },
    {
      labelKey: "Connection Category",
    },
    {
      labelKey: "Usage Category",
    },
    {
      labelKey: "Connection Facility",
    },
  ],
  billsummaryreport: [
    {
      labelKey: "Sl. No.",
    },
    {
      labelKey: "ULB",
    },
    {
      labelKey: "Date",
    },
    {
      labelKey: "Count",
    },
  ],
  waterMonthlyDemandReport: [
    {
      labelKey: "Sl. No.",
    },
    {
      labelKey: "ULB",
    },
    {
      labelKey: "Ward",
    },
    {
      labelKey: "Connection No",
    },
    {
      labelKey: "Old Connection No",
    },
    {
      labelKey: "Connection Type",
    },
    {
      labelKey: "Connection Holder Name",
    },
    {
      labelKey: "Contact No",
    },
    {
      labelKey: "Address",
    },
    {
      labelKey: "Demand Period From",
    },
    {
      labelKey: "Demand Period To",
    },
    {
      labelKey: "Current Demand",
    },
    {
      labelKey: "Collection Amount",
    },
    {
      labelKey: "Rebate Amount",
    },
    {
      labelKey: "Penalty",
    },
    {
      labelKey: "Advance",
    },
    {
      labelKey: "Arrear",
    },
    {
      labelKey: "Total Due",
    },
    {
      labelKey: "Amount Payable after Rebate",
    },
    {
      labelKey: "Amount Payable with Penalty",
    },
  ],
  consumerPaymentHistory: [
    {
      labelKey: "Sl. No.",
    },
    {
      labelKey: "ULB",
    },
    {
      labelKey: "Employee Id",
    },
    {
      labelKey: "Employee Name",
    },
    {
      labelKey: "Consumer Number",
    },
    {
      labelKey: "Consumer Name",
    },
    {
      labelKey: "Consumer Address",
    },
    {
      labelKey: "Ward Number",
    },
    {
      labelKey: "Head",
    },
    {
      labelKey: "Month And Year",
    },
    {
      labelKey: "Transaction Id",
    },
    {
      labelKey: "Date Of Payment",
    },
    {
      labelKey: "Payment Mode",
    },
    {
      labelKey: "Paid Amount",
    },
  ],
  newConsumerMonthlyReport: [
    {
      labelKey: "Sl. No.",
    },
    {
      labelKey: "ULB",
    },
    {
      labelKey: "Ward Number",
    },
    {
      labelKey: "Connection Number",
    },
    {
      labelKey: "Application Number",
    },
    {
      labelKey: "Execution Date",
    },
    {
      labelKey: "Sanction Date",
    },
    {
      labelKey: "Connection Type",
    },
    {
      labelKey: "Connection Facility",
    },
    {
      labelKey: "Connection Category",
    },
    {
      labelKey: "Connection Purpose",
    },
    {
      labelKey: "Mobile Number",
    },
    {
      labelKey: "Consumer Name",
    },
    {
      labelKey: "Consumer Address",
    },
  ],
  consumerHistoryReport: [
    {
      labelKey: "Sl. No.",
    },
    {
      labelKey: "ULB",
    },
    {
      labelKey: "Ward Number",
    },
    {
      labelKey: "Consumer Number",
    },
    {
      labelKey: "Old Connection Number",
    },
    {
      labelKey: "Month",
    },
    {
      labelKey: "Connection Type",
    },
    {
      labelKey: "Current Demand",
    },
    {
      labelKey: "Collection Amount",
    },
    {
      labelKey: "Penalty",
    },
    {
      labelKey: "Advance",
    },
    {
      labelKey: "Arrear",
    },
    {
      labelKey: "ULTotal DueB",
    },
    {
      labelKey: "Payment Date",
    },
    {
      labelKey: "Payment Mode",
    },
    {
      labelKey: "Receipt Number",
    },
  ],
  consumerBillHistoryReport: [
    {
      labelKey: "Sl. No.",
    },
    {
      labelKey: "ULB",
    },
    {
      labelKey: "Consumer Code",
    },
    {
      labelKey: "Period From",
    },
    {
      labelKey: "Period To",
    },
    {
      labelKey: "Payment Completed",
    },
    {
      labelKey: "Tax Amount",
    },
    {
      labelKey: "Collected Amount",
    },
    {
      labelKey: "Due Amount",
    },
  ],
};
