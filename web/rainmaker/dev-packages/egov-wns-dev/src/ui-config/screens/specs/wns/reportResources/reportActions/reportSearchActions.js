import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "../../../../../../ui-utils";

const epochToDDMMYYYYFromatter = (epochDate) => {
  let date = new Date(Math.round(Number(epochDate)));
  let day = ("0" + date.getDate()).slice(-2);
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let formatDate = day + "-" + month + "-" + date.getFullYear();
  return formatDate;
};

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
      "/report-services/reports/ws/employeeDateWiseWSCollection",
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
        "Sl. No.": index + 1,
        ULB: eachItem["ulb"],
        "Employee Id": eachItem["employeeId"],
        "Employee Name": eachItem["employeeName"],
        "Business Service": eachItem["businessService"],
        Head: eachItem["head"],
        "Transaction Date": eachItem["transactionDate"]
          ? epochToDDMMYYYYFromatter(eachItem["transactionDate"])
          : "NA",
        "Payment Mode": eachItem["paymentMode"],
        "Consumer Code": eachItem["consumerCode"],
        "Receipt No": eachItem["receiptNo"],
        "Collected Amount": eachItem["collectedAmount"],
      })
    );
    return tableData;
  } catch (error) {
    dispatch(toggleSnackbar(true, { labelKey: error.message }, "error"));
    console.log(error.message);
    return null;
  }
};

export const consumerMasterReportSearch = async (params, state, dispatch) => {
  try {
    const formattedParams = {
      ...params,
      ward: params["ward"] ? params["ward"] : "NIL",
    };
    let queryObject = Object.keys(formattedParams).map((key) => ({
      key: key,
      value: formattedParams[key],
    }));
    let payload = null;
    payload = await httpRequest(
      "post",
      "/report-services/reports/ws/consumerMaster",
      "",
      queryObject
    );
    dispatch(
      prepareFinalObject(
        "reportTableData",
        payload["ComsumerMasterWSReports"]
      )
    );
    let tableData = payload.ComsumerMasterWSReports.map(
      (eachItem, index) => ({
        "Sl. No.": index + 1,
        ULB: eachItem["ulb"],
        "Ward Number": eachItem["wardNo"],
        "Connection Number": eachItem["connectionNo"],
        "Old Connection Number": eachItem["oldConnectionNo"],
        "Connection Type": eachItem["connectionType"],
        "Connection Category": eachItem["connectionCategory"],
        "Usage Category": eachItem["usageCategory"],
        "Connection Facility": eachItem["connectionFacility"],
        "User Id": eachItem["userId"],
        "Consumer Name": eachItem["userName"],
        "Mobile Number": eachItem["userMobile"],
        "Consumer Address": eachItem["userAddress"],
      })
    );
    return tableData;
  } catch (error) {
    dispatch(toggleSnackbar(true, { labelKey: error.message }, "error"));
    console.log(error.message);
    return null;
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
