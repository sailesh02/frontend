export const REPORT_HEADER_MAPPER = {
  dateWiseEmployeeCollection: "Employee Date Wise WS Collection",
  billsummaryreport: "W&S Bill Summary Report"
};

export const REPORT_SUB_HEADER_MAPPER = {
  dateWiseEmployeeCollection: "Modify report by date range",
  billsummaryreport: "Modify report by date range"
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
      labelKey: "Count"
    }
  ]
};
