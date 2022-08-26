export const REPORT_HEADER_MAPPER = {
  taxCollectorWiseCollection: "Tax Collector Wise Collection Report",
  ulbWiseTaxCollection: "ULB Wise Tax Collection Report",
  propertyDetails: "ULB Wise Property Details Report",
  propertyWiseCollection: "Property Wise Collection Report",
  propertyWiseDemands: "Property Wise Demands Report",
};

export const REPORT_SUB_HEADER_MAPPER = {
  taxCollectorWiseCollection: "Modify report by date range",
  ulbWiseTaxCollection: "Modify report by date range",
  propertyDetails: "Modify report by date range",
  propertyWiseCollection: "Modify report by date range",
  propertyWiseDemands: "Modify report by date range",
};

export const REPORT_DROPDOWN_OPTIONS = {};

export const REPORT_TABLE_TITLE_MAPPER = {
  taxCollectorWiseCollection: "Tax Collector Wise Collection Report",
  ulbWiseTaxCollection: "ULB Wise Tax Collection Report",
  propertyDetails: "Property Details Report",
  propertyWiseCollection: "Property Wise Collection Report",
  propertyWiseDemands: "Property Wise Demands Report",
};

export const REPORT_COLUMNS_MAPPER = {
  taxCollectorWiseCollection: [
    {
      labelKey: "Sl. No.",
    },
    {
      labelKey: "Collector Name",
    },
    {
      labelKey: "Collector Employee Id",
    },
    {
      labelKey: "Collector Mobile Number",
    },
    {
      labelKey: "Ammount Collected",
    },
    {
      labelKey: "Payment Mode",
    },
    {
      labelKey: "Receipt Number",
    },
    {
      labelKey: "Payment Date",
    },
    {
      labelKey: "Property Id",
    },
    {
      labelKey: "Old Property Id",
    },
  ],
  ulbWiseTaxCollection: [
    {
      labelKey: "Sl. No.",
    },
    {
      labelKey: "ULB",
    },
    {
      labelKey: "Property Id",
    },
    {
      labelKey: "Old Property Id",
    },
    {
      labelKey: "Ward",
    },
    {
      labelKey: "Current Year Demand Amount",
    },
    {
      labelKey: "Total Arrear Demand Amount",
    },
    {
      labelKey: "Total Collected Amount",
    },
    {
      labelKey: "Due Amount",
    },
  ],
  propertyDetails: [
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
      labelKey: "Old Property Id",
    },
    {
      labelKey: "Property Id",
    },
    {
      labelKey: "User Name",
    },
    {
      labelKey: "Mobile Number",
    },
    {
      labelKey: "Door Number",
    },
    {
      labelKey: "Building Name",
    },
    {
      labelKey: "Street",
    },
    {
      labelKey: "City",
    },
    {
      labelKey: "Pincode",
    },
    {
      labelKey: "Address",
    },
  ],
  propertyWiseCollection: [
    {
      labelKey: "Sl. No.",
    },
    {
      labelKey: "Property Id",
    },
    {
      labelKey: "Old Property Id",
    },
    {
      labelKey: "Ward",
    },
    {
      labelKey: "Name",
    },
    {
      labelKey: "Mobile Number",
    },
    {
      labelKey: "Due Before Payment",
    },
    {
      labelKey: "Amount Paid",
    },
    {
      labelKey: "Current Due",
    },
    {
      labelKey: "Reciept Number",
    },
    {
      labelKey: "Reciept Date",
    },
    {
      labelKey: "Payment Mode",
    },
  ],
  propertyWiseDemands: [
    {
      labelKey: "Sl. No.",
    },
    {
      labelKey: "ULB",
    },
    {
      labelKey: "Property Id",
    },
    {
      labelKey: "Old Property Id",
    },
    {
      labelKey: "Ward",
    },
    {
      labelKey: "Name",
    },
    {
      labelKey: "Mobile Number",
    },
    {
      labelKey: "Financial Year From",
    },
    {
      labelKey: "Financial Year To",
    },
    {
      labelKey: "Total Demand Amount",
    },
    {
      labelKey: "Paid Amount",
    },
    {
      labelKey: "Due Amount",
    },
  ],
};
