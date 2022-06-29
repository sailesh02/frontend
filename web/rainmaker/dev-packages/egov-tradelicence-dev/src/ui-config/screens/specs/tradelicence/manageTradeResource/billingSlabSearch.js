import {
  getCommonContainer,
  getCommonCard,
  getCommonTitle,
  getLabel,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
  toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { httpRequest } from "../../../../../ui-utils";

const getBillingSlabData = async (tenantId, dispatch) => {
  try {
    let queryObject = [
      {
        key: "tenantId",
        value: tenantId,
      },
    ];
    let payload = null;
    payload = await httpRequest(
      "post",
      "/tl-calculator/billingslab/_search", // search billingslab
      "",
      queryObject
    );
    let data = payload.billingSlab.map((eachItem) => ({
      TradeCode: eachItem["tradeType"],
      LicenseType: eachItem["licenseType"],
      ApplicationType: eachItem["applicationType"],
      "UOM-Units": eachItem["uom"] || "NA",
      "UOM-From": eachItem["fromUom"] || "NA",
      "UOM-To": eachItem["toUom"] || "NA",
      LicenseFee: eachItem["rate"],
      City: eachItem["tenantId"],
      Type: eachItem["type"],
    }));
    dispatch(
      handleField(
        "managetrade",
        "components.div.children.searchResults",
        "props.data",
        data
      )
    );
    dispatch(
      handleField(
        "managetrade",
        "components.div.children.searchResults",
        "props.rows",
        data.length
      )
    );
    dispatch(
      handleField(
        "managetrade",
        "components.div.children.searchResults",
        "visible",
        true
      )
    );
    dispatch(prepareFinalObject("tableData", data));
    dispatch(prepareFinalObject("billingSlab", payload.billingSlab));
    return payload;
  } catch (error) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
    console.log(error);
  }
};
const searchApiCall = async (state, dispatch) => {
  dispatch(
    handleField(
      "managetrade",
      "components.div.children.searchResults",
      "visible",
      false
    )
  );
  // let tenantId = getTenantId();
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "manageTrade",
    {}
  );
  if (!searchScreenObject.city) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please select the city to start search",
          labelKey: "Please select the city to start search",
        },
        "warning"
      )
    );
  } else {
    try {
      getBillingSlabData(searchScreenObject.city, dispatch);
    } catch (error) {
      console.log(error);
    }
  }
};
const onRowClick = (row) => {
  window.location.href =
    `traderateadd?tenantId=${row[0]}&tradeType=${row[1]}&licenseType=${row[2]}&applicationType=${row[3]}`
};

const addNewBillingSlab = (state, dispatch) => {
  let tenant = get(
    state.screenConfiguration.preparedFinalObject,
    "manageTrade",
    {}
  );
  if(tenant.city) {
    window.location.href = `traderateadd?new=true&tenantId=${tenant.city}`
  } else {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Please select the city to continue.",
          labelKey: "TL_SLCT_CITY_ERROR_MSG",
        },
        "warning"
      )
    );
  }
};

const dropdown = {
  uiFramework: "custom-containers",
  componentPath: "AutosuggestContainer",
  jsonPath: "manageTrade.city",
  required: true,
  props: {
    style: {
      width: "100%",
      cursor: "pointer",
    },
    label: {
      labelName: "City",
      labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL",
    },
    localePrefix: {
      moduleName: "TENANT",
      masterName: "TENANTS",
    },
    placeholder: {
      labelName: "Select City",
      labelKey: "TL_SELECT_CITY",
    },
    sourceJsonPath: "applyScreenMdmsData.tenant.tenants",
    labelsFromLocalisation: true,
    suggestions: [],
    fullwidth: true,
    required: true,
    isClearable: true,
    inputLabelProps: {
      shrink: true,
    },
    // className: "tradelicense-mohalla-apply"
  },
  gridDefination: {
    xs: 12,
    sm: 6,
  },
};

export const billSlabSearchForm = getCommonCard({
  subHeader: getCommonTitle({
    labelName: "Search Billing Slab",
    labelKey: "TL_BILLING_SLAB_SEARCH_HRD",
  }),
  cityNameContainer: getCommonContainer({
    tradeLocCity: dropdown,
  }),
  button: getCommonContainer({
    buttonContainer: getCommonContainer({
      addButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 12,
        },
        props: {
          variant: "outlined",
          style: {
            color: "#FE7A51",
            borderColor: "#FE7A51",
            width: "220px",
            height: "48px",
            margin: "8px",
            float: "right",
          },
        },
        children: {
          buttonLabel: getLabel({
            labelName: "Add New",
            labelKey: "TL_ADD_NEW_BS_BTN",
          }),
        },
        onClickDefination: {
          action: "condition",
          callBack: addNewBillingSlab,
        },
      },
      // searchButton: {
      //   componentPath: "Button",
      //   gridDefination: {
      //     xs: 12,
      //     sm: 6,
      //   },
      //   props: {
      //     variant: "contained",
      //     style: {
      //       color: "white",
      //       margin: "8px",
      //       backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
      //       borderRadius: "2px",
      //       width: "220px",
      //       height: "48px",
      //     },
      //   },
      //   children: {
      //     buttonLabel: getLabel({
      //       labelName: "Search",
      //       labelKey: "Search",
      //     }),
      //   },
      //   onClickDefination: {
      //     action: "condition",
      //     callBack: searchApiCall,
      //   },
      // },
    }),
  }),
});

export const searchResults = {
  uiFramework: "custom-molecules",
  // moduleName: "egov-tradelicence",
  componentPath: "Table",
  visible: false,
  props: {
    columns: [
      {
        name: "City",
        labelKey: "City",
        options: {
          display: false,
        },
      },
      {
        name: "TradeCode",
        labelKey: "TradeCode",
      },
      {
        name: "LicenseType",
        labelKey: "LicenseType",
      },
      {
        name: "ApplicationType",
        labelKey: "ApplicationType",
      },
      {
        name: "UOM-Units",
        labelKey: "UOM-Units",
      },
      {
        name: "UOM-From",
        labelKey: "UOM-From",
      },
      {
        name: "UOM-To",
        labelKey: "UOM-To",
      },
      {
        name: "LicenseFee",
        labelKey: "LicenseFee",
      },
      {
        name: "Type",
        labelKey: "Type",
        options: {
          display: false,
        },
      },
    ],
    title: {
      labelKey: "Search Results for Billing Slabs",
      labelName: "Search Results for Billing Slabs",
    },
    rows: "",
    options: {
      filter: false,
      download: false,
      responsive: "stacked",
      selectableRows: false,
      hover: true,
      viewColumns: false,
      rowsPerPageOptions: [10, 20, 50, 100],
      onRowClick: (row, index) => {
        onRowClick(row);
      },
    },
    // customSortColumn: {
    //   column: "Application Date",
    //   sortingFn: (data, i, sortDateOrder) => {
    //     const epochDates = data.reduce((acc, curr) => {
    //       acc.push([...curr, getEpochForDate(curr[4], "dayend")]);
    //       return acc;
    //     }, []);
    //     const order = sortDateOrder === "asc" ? true : false;
    //     const finalData = sortByEpoch(epochDates, !order).map(item => {
    //       item.pop();
    //       return item;
    //     });
    //     return { data: finalData, currentOrder: !order ? "asc" : "desc" };
    //   }
    // }
  },
};
