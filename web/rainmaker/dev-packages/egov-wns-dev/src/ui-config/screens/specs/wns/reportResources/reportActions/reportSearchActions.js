import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "../../../../../../ui-utils";

export const employeeDateWiseWSCollectionSearch = async (
  params,
  state,
  dispatch
) => {
  try {
    const formattedParams = {
      ...params,
      collectionDate: Date.parse(params["collectionDate"]),
    };
    let queryObject = Object.keys(formattedParams).map((key) => ({
      key: key,
      value: formattedParams[key],
    }));
    let payload = null;
    payload = await httpRequest(
      "post",
      "/report-services/reports/ws/employeeDateWiseWSCollection", // search
      "",
      queryObject
    );
    dispatch(
      prepareFinalObject(
        "reportTableData",
        payload["employeeDateWiseWSCollectionResponse"]
      )
    );
    let tableData = payload.employeeDateWiseWSCollectionResponse.map(
      (eachItem, index) => ({
        "Sl. No.": index,
        ULB: eachItem["ulb"],
        "Employee Id": eachItem["employeeId"],
        "Employee Name": eachItem["employeeName"],
        "Business Service": eachItem["businessService"],
        Head: eachItem["head"],
        "Transaction Date": eachItem["transactionDate"],
        "Payment Mode": eachItem["paymentMode"],
        "Consumer Code": eachItem["consumerCode"],
        "Receipt No": eachItem["receiptNo"],
        "Collected Amount": eachItem["collectedAmount"],
      })
    );
    return tableData;
  } catch (error) {
    dispatch(toggleSnackbar(true, error.message, "error"));
    console.log(error.message);
    return [];
  }
};

export const billSummaryReportSearch = async (
  params,
  state,
  dispatch
) => {
  try {
    const formattedParams = {
      ...params,
      collectionDate: Date.parse(params["collectionDate"]),
    };
    formattedParams["monthYear"] = formattedParams["collectionDate"]
    delete formattedParams["collectionDate"]
    let queryObject = Object.keys(formattedParams).map((key) => ({
      key: key,
      value: formattedParams[key],
    }));
    let payload = null;
    payload = await httpRequest(
      "post",
      "report-services/reports/ws/billSummary", // search
      "",
      queryObject
    );
    dispatch(
      prepareFinalObject(
        "reportTableData",
        payload["billSummaryResponses"]
      )
    );
    let tableData = payload.billSummaryResponses.map(
      (eachItem, index) => ({
        "Sl. No.": index + 1,
        ULB: eachItem["ULB"],
        "Date": eachItem["Month-Year"],
        "Count": eachItem["Count"]
      })
    );
    return tableData;
  } catch (error) {
    dispatch(toggleSnackbar(true, error.message, "error"));
    console.log(error.message);
    return [];
  }
};
