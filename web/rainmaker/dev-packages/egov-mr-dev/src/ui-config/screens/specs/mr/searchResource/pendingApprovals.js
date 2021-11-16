import { getBreak, getCommonContainer } from "egov-ui-framework/ui-config/screens/specs/utils";
import React from "react";
import { tradeLicenseApplication } from "./tradeLicenseApplication";
import {searchDigitalSignatureResults} from "../searchResource/searchResults"

export const pendingApprovals = {
  uiFramework: "custom-atoms",
  componentPath: "Div",
  visible: false,
  children: {
    breakPending: getBreak(),
    pendingApprovals: {
      uiFramework: "custom-molecules-local",
      moduleName: "egov-tradelicence",
      componentPath: "Table",
      props: {
        data: [
          {
            "Application No": 1234,
            "Trade Name": "Matchbox Plant",
            "Owner Name": "Satinder Singh",
            "Locality/Mohalla": "Gurudwara Mohalla",
            "Payment Date": "12/08/2018",
            "Days Elapsed": "2 Days"
          },
          {
            "Application No": 1234,
            "Trade Name": "Matchbox Plant",
            "Owner Name": "Satinder Singh",
            "Locality/Mohalla": "Railway Colony",
            "Payment Date": "12/08/2018",
            "Days Elapsed": "10 Days"
          },
          {
            "Application No": 1234,
            "Trade Name": "Matchbox Plant",
            "Owner Name": "Satinder Singh",
            "Locality/Mohalla": "Gurudwara Mohalla",
            "Payment Date": "12/08/2018",
            "Days Elapsed": "2 Days"
          },
          {
            "Application No": 1234,
            "Trade Name": "Matchbox Plant",
            "Owner Name": "Satinder Singh",
            "Locality/Mohalla": "Assi Mohalla",
            "Payment Date": "12/08/2018",
            "Days Elapsed": "2 Days"
          }
        ],
        columns: {
          "Application No": {},
          "Trade Name": {},
          "Owner Name": {},
          "Locality/Mohalla": {},
          "Payment Date": {},
          "Days Elapsed": {
            format: value => {
              let color = "";
              if (value.toLowerCase().indexOf("10") !== -1) {
                color = "green";
              } else if (value.toLowerCase().indexOf("2") !== -1) {
                color = "red";
              }
              return (
                <span
                  style={{
                    color: color,
                    fontSize: "14px",
                    fontWeight: 400
                  }}
                >
                  {value}
                </span>
              );
            }
          }
        },
        title: "Pending for your Approval (4)",
        options: {
          filterType: "dropdown",
          responsive: "stacked",
          selectableRows: false
        }
      }
    }
  }
};

export const showSearches = getCommonContainer({
  showSearchScreens: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-mr",
    componentPath: "CustomTabContainer",
    props: {
      tabs: [
        {
          tabButton: { labelName: "SEARCH APPLICATIONS", labelKey: "MR_SEARCH_APPLICATIONS" },
          tabContent: { tradeLicenseApplication }
        },
        {
          tabButton: { labelName: "MR_PENDING_DIGITALLY_SIGNED_APPLICATIONS", labelKey: "MR_PENDING_DIGITALLY_SIGNED_APPLICATIONS" },
          tabContent: { searchDigitalSignatureResults }
        }
      ],
      tabIndex : 0,
      isDigitalSignature : true,
    },
    type: "array"
  }
});
