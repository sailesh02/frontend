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
      monthYear: Date.parse(params["monthYear"]),
    };
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
    dispatch(toggleSnackbar(true, { labelKey: error.message }, "error"));
    console.log(error.message);
    return null
  }
};

export const waterbillDemandReportSearch = async (params, state, dispatch) => {
  try {
    const formattedParams = {
      ...params,
      fromDate: Date.parse(params["fromDate"]),
      toDate: Date.parse(params["toDate"]),
      ward: params["ward"] ? params["ward"] : "NIL",
    };
    let queryObject = Object.keys(formattedParams).map((key) => ({
      key: key,
      value: formattedParams[key],
    }));
    let payload = null;
    payload = await httpRequest(
      "post",
      "/report-services/reports/ws/waterMonthlyDemandReport",
      "",
      queryObject
    );
    dispatch(
      prepareFinalObject(
        "reportTableData",
        payload["waterBillDemandWSReports"]
      )
    );
    let tableData = payload.waterMonthlyDemandResponse.map(
      (eachItem, index) => ({
        "Sl. No.": index + 1,
        ULB: eachItem["ulb"],
        "Ward": eachItem["ward"],
        "Connection No": eachItem["connectionNo"],
        "Old Connection No": eachItem["oldConnectionNo"],
        "Connection Type": eachItem["connectionType"],
        "Connection Holder Name": eachItem["connectionHolderName"],
        "Collection Amount": eachItem["collectionAmount"],
        "Contact No": eachItem["contactNo"],
        "Address": eachItem["address"],
        "Demand Period From": eachItem["demandPeriodFrom"] ? epochToDDMMYYYYFromatter(eachItem["demandPeriodFrom"]) : "NA",
        "Demand Period To": eachItem["demandPriodTo"] ? epochToDDMMYYYYFromatter(eachItem["demandPriodTo"]) : "NA",
        "Current Demand": eachItem["currentDemandAmount"],
        "Collection Amount": eachItem["collectionAmount"],
        "Rebate Amount": eachItem["rebateAmount"],
        "Penalty": eachItem["penaltyAmount"],
        "Advance": eachItem["advanceAmount"],
        "Arrear": eachItem["arrearAmt"],
        "Total Due": eachItem["totalDueAmount"],
        "Amount Payable after Rebate": eachItem["amountPayableAfterRebateAmount"],
        "Amount Payable with Penalty": eachItem["amountPayableWithPenaltyAmount"]
      })
    );
    return tableData;
  } catch (error) {
    dispatch(toggleSnackbar(true, { labelKey: error.message }, "error"));
    console.log(error.message);
    return null;
  }
};