export const REPORT_HEADER_MAPPER = {
  dateWiseEmployeeCollection: "Employee Date Wise WS Collection",
  consumerMasterReport: "W&S Consumer Master Report",
  billsummaryreport: "W&S Bill Summary Report",
  waterMonthlyDemandReport: "Water Monthly Demands Report"
};

export const REPORT_SUB_HEADER_MAPPER = {
  dateWiseEmployeeCollection: "Modify report by date range",
  consumerMasterReport: "Modify report by date range",
  billsummaryreport: "Modify report by date range",
  waterMonthlyDemandReport: "Modify report by date range"
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
        code: "metered",
        name: "Metered",
      },
      {
        code: "nonMetered",
        name: "Non Metered",
      },
    ],
  },
};

export const REPORT_TABLE_TITLE_MAPPER = {
  dateWiseEmployeeCollection: "Employee Date Wise WS Collection Report",
  consumerMasterReport: "Consumer Master Report",
  billsummaryreport: "W&S Bill Summary Report",
  waterMonthlyDemandReport: "Water Monthly Demands Report"
}


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
    labelKey: "Count"
    }
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
      
    ]
};
