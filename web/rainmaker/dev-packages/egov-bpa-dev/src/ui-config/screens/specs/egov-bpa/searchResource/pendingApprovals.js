import { getBreak, getCommonContainer } from "egov-ui-framework/ui-config/screens/specs/utils";
import React from "react";
import { BPAApplication } from "./bpaApplication";
import {searchDigitalSignatureResults} from "../searchResource/searchResults"
import {searchDigitalSignatureResultsForBPADoc} from "../searchResource/searchResults"


export const pendingApprovals = {
  uiFramework: "custom-atoms",
  componentPath: "Div",
  visible: false,
  children: {
    breakPending: getBreak(),
    pendingApprovals: {
      uiFramework: "custom-molecules-local",
      moduleName: "egov-bpa",
      componentPath: "Table",
      props: {
        data: [
          {
            "Application No": 1234,
            "Building Name": "Matchbox Plant",
            "Owner Name": "Satinder Singh",
            "Locality/Mohalla": "Gurudwara Mohalla",
            "Payment Date": "12/08/2018",
            "Days Elapsed": "2 Days"
          },
          {
            "Application No": 1234,
            "Building Name": "Matchbox Plant",
            "Owner Name": "Satinder Singh",
            "Locality/Mohalla": "Railway Colony",
            "Payment Date": "12/08/2018",
            "Days Elapsed": "10 Days"
          },
          {
            "Application No": 1234,
            "Building Name": "Matchbox Plant",
            "Owner Name": "Satinder Singh",
            "Locality/Mohalla": "Gurudwara Mohalla",
            "Payment Date": "12/08/2018",
            "Days Elapsed": "2 Days"
          },
          {
            "Application No": 1234,
            "Building Name": "Matchbox Plant",
            "Owner Name": "Satinder Singh",
            "Locality/Mohalla": "Assi Mohalla",
            "Payment Date": "12/08/2018",
            "Days Elapsed": "2 Days"
          }
        ],
        columns: {
          "Application No": {},
          "Building Name": {},
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
    moduleName: "egov-bpa",
    componentPath: "CustomTabContainer",
    props: {
      tabs: [
        {
          tabButton: { labelName: "SEARCH APPLICATIONS", labelKey: "BPA_SEARCH_APPLICATIONS" },
          tabContent: { BPAApplication }
        },
        {
          tabButton: { labelName: "SEARCH APPLICATIONS", labelKey: "BPA_SEARCH_PENDING_DIGITALLY_SIGNED" },
          tabContent: { searchDigitalSignatureResults }
        },
        {
          tabButton: { labelName: "DOWNLOAD BPA DOCUMENT", labelKey: "BPA_SEARCH_DOWNLOAD_BPA_DOC" },
          tabContent: { searchDigitalSignatureResultsForBPADoc }
        }
      ],
      tabIndex : 0,
      isDigitalSignature : true,
    },
    type: "array"
  }
});
