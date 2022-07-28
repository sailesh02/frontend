import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
  toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "../../../../../ui-utils";
import get from "lodash/get";

export const getCurrentDate = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + "-" + mm + "-" + dd;
  return today;
};

const dateToEpochStartDay = (date) => {
  let start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);
  return Date.parse(start);
};
const dateToEpochEndDay = (date) => {
  let end = new Date(date);
  end.setUTCHours(23, 59, 59, 999);
  return Date.parse(end);
};

const getIncentiveReport = async (paramDetails, dispatch) => {
  try {
    let queryObject = [
      {
        key: "module",
        value: paramDetails.module === "PropertyTax" ? "PT" : "WS",
      },
      {
        key: "tenantId",
        value: paramDetails.tenantId,
      },
      {
        key: "fromDate",
        value: dateToEpochStartDay(paramDetails.fromDate),
      },
      {
        key: "toDate",
        value: dateToEpochEndDay(paramDetails.toDate),
      },
    ];
    let payload = null;
    payload = await httpRequest(
      "post",
      "/report-services/reports/incentive", // search incentive report
      "",
      queryObject
    );
    const incentiveReport = payload.IncentiveInfo.Incentives;
    if (incentiveReport.length !== 0) {
      let data = payload.IncentiveInfo.Incentives.map((eachItem, index) => {
        return paramDetails.module === "PropertyTax"
          ? {
              "Sr. No.": index + 1,
              "Name of Jal Saathi": eachItem["employeeName"],
              "Jal Saathi Employee ID": eachItem["employeeId"],
              "Total Number of Transactions": eachItem["totalNoOfTransaction"],
              "Collection towards Arrears- Property Tax":
                eachItem["collectionTowardsArrear"],
              "Collection towards Current Demand- Property Tax":
                eachItem["collectionTowardsCurrent"],
              "Total Property Tax Collection": eachItem["totalCollection"],
              "Total Incentive on Arrear Collection":
                eachItem["totalIncentiveOnArrear"],
              "Total Incentive on Current Collection":
                eachItem["totalIncentiveOnCurrent"],
              "Total Incentive": eachItem["totalIncentive"],
            }
          : {
              "Sr. No.": index + 1,
              "Name of Jal Saathi": eachItem["employeeName"],
              "Jal Saathi Employee ID": eachItem["employeeId"],
              "Total Number of Transactions": eachItem["totalNoOfTransaction"],
              "Collection towards Arrears- Water Charges":
                eachItem["collectionTowardsArrear"],
              "Collection towards Current Demand- Water Charges":
                eachItem["collectionTowardsCurrent"],
              "Total Water Charges Collection":
                eachItem["totalCollection"],
              "Incentive on Total Water Charges Collection":
                eachItem["totalIncentive"],
            };
      });
      paramDetails.module === "PropertyTax"
          ? dispatch(
            handleField(
              "jalsathiIncentive",
              "components.div.children.searchResults",
              "props.columns",
              [
                {
                  name: "Sr. No.",
                  labelKey: "Sr. No.",
                },
                {
                  name: "Name of Jal Saathi",
                  labelKey: "Name of Jal Saathi",
                },
                {
                  name: "Jal Saathi Employee ID",
                  labelKey: "Jal Saathi Employee ID",
                },
                {
                  name: "Total Number of Transactions",
                  labelKey: "Total Number of Transactions",
                },
                {
                  name: "Collection towards Arrears- Property Tax",
                  labelKey: "Collection towards Arrears- Property Tax",
                },
                {
                  name: "Collection towards Current Demand- Property Tax",
                  labelKey: "Collection towards Current Demand- Property Tax",
                },
                {
                  name: "Total Property Tax Collection",
                  labelKey: "Total Property Tax Collection",
                },
                {
                  name: "Total Incentive on Arrear Collection",
                  labelKey: "Total Incentive on Arrear Collection",
                },
                {
                  name: "Total Incentive on Current Collection",
                  labelKey: "Total Incentive on Current Collection",
                },
                {
                  name: "Total Incentive",
                  labelKey: "Total Incentive",
                },
              ]
            )
          ) : dispatch(
            handleField(
              "jalsathiIncentive",
              "components.div.children.searchResults",
              "props.columns",
                [
                  {
                    name: "Sr. No.",
                    labelKey: "Sr. No.",
                  },
                  {
                    name: "Name of Jal Saathi",
                    labelKey: "Name of Jal Saathi",
                  },
                  {
                    name: "Jal Saathi Employee ID",
                    labelKey: "Jal Saathi Employee ID",
                  },
                  {
                    name: "Total Number of Transactions",
                    labelKey: "Total Number of Transactions",
                  },
                  {
                    name: "Collection towards Arrears- Water Charges",
                    labelKey: "Collection towards Arrears- Water Charges",
                  },
                  {
                    name: "Collection towards Current Demand- Water Charges",
                    labelKey: "Collection towards Current Demand- Water Charges",
                  },
                  {
                    name: "Total Water Charges Collection",
                    labelKey: "Total Water Charges Collection",
                  },
                  {
                    name: "Incentive on Total Water Charges Collection",
                    labelKey: "Incentive on Total Water Charges Collection",
                  },
                ]
            )
          );
      dispatch(
        handleField(
          "jalsathiIncentive",
          "components.div.children.searchResults",
          "props.data",
          data
        )
      );
      dispatch(
        handleField(
          "jalsathiIncentive",
          "components.div.children.searchResults",
          "props.rows",
          data.length
        )
      );
      dispatch(
        handleField(
          "jalsathiIncentive",
          "components.div.children.searchResults",
          "visible",
          true
        )
      );
      dispatch(prepareFinalObject("tableData", data));
      dispatch(
        prepareFinalObject("incentiveReport", payload.IncentiveInfo.Incentives)
      );
    } else {
      dispatch(
        toggleSnackbar(
          true,
          { labelName: "No records found.", labelCode: "No records found." },
          "warning"
        )
      );
    }
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

export const incentiveSearchApiCall = async (state, dispatch) => {
  dispatch(
    handleField(
      "jalsathiIncentive",
      "components.div.children.searchResults",
      "visible",
      false
    )
  );
  let searchScreenObject = get(
    state.screenConfiguration.preparedFinalObject,
    "reportForm",
    {}
  );
  const isValid =
    searchScreenObject.tenantId &&
    searchScreenObject.module &&
    searchScreenObject.fromDate &&
    searchScreenObject.toDate;
  if (!isValid) {
    let errorMessage = {
      labelName: "Please fill all mandatory fields and then search",
      labelKey: "Please fill all mandatory fields and then search",
    };
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  } else {
    try {
      getIncentiveReport(searchScreenObject, dispatch);
    } catch (error) {
      console.log(error);
    }
  }
};

class Workbook {
  constructor() {
    if (!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
  }
}

const s2ab = (s) => {
  const buf = new ArrayBuffer(s.length);

  const view = new Uint8Array(buf);

  for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;

  return buf;
};

const download = (url, name) => {
  var a = window.document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click(); // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
  document.body.removeChild(a);
};

export const excelDownloadAction = (data, name, needseprate) => {
  let sname = name.length > 30 ? name.substring(0, 28) + "..." : name;
  import("xlsx").then((XLSX) => {
    const wb = new Workbook();
    let ws = null;
    if (!needseprate) {
      ws = XLSX.utils.json_to_sheet(data);
      wb.SheetNames.push(sname || "");
      wb.Sheets[sname || ""] = ws;
    } else {
      for (var i = 0; i < Object.keys(data).length; i++) {
        ws = XLSX.utils.json_to_sheet(data[Object.keys(data)[i]]);
        wb.SheetNames.push(Object.keys(data)[i]);
        wb.Sheets[Object.keys(data)[i]] = ws;
      }
    }

    const wbout = XLSX.write(wb, {
      bookType: "xlsx",
      bookSST: true,
      type: "binary",
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], {
        type: "application/octet-stream",
      })
    );

    download(url, `${sname}.xlsx`);
  });
};
