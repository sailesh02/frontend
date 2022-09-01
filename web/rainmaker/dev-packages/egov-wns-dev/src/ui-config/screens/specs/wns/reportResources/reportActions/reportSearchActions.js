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

const removeEmptyParams = (paramsObj) => {
  let paramsList = [];
  Object.keys(paramsObj).forEach((key) => {
    if (paramsObj[key]) {
      paramsList.push({
        key: key,
        value: paramsObj[key],
      });
    }
  });
  return paramsList;
};

const getDayDifference = (toDate, fromDate) => {
  const startDate = new Date(toDate);
  const endDate = new Date(fromDate);
  const monthDiff =
    endDate.getMonth() -
    startDate.getMonth() +
    12 * (endDate.getFullYear() - startDate.getFullYear());
  const dayDiff = monthDiff * 30 + endDate.getDate() - startDate.getDate();
  return dayDiff;
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
    let queryObject = removeEmptyParams(formattedParams);
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
    let queryObject = removeEmptyParams(formattedParams);
    let payload = null;
    payload = await httpRequest(
      "post",
      "/report-services/reports/ws/consumerMaster",
      "",
      queryObject
    );
    dispatch(
      prepareFinalObject("reportTableData", payload["ComsumerMasterWSReports"])
    );
    let tableData = payload.ComsumerMasterWSReports.map((eachItem, index) => ({
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
    }));
    return tableData;
  } catch (error) {
    dispatch(toggleSnackbar(true, { labelKey: error.message }, "error"));
    console.log(error.message);
    return null;
  }
};

export const billSummaryReportSearch = async (params, state, dispatch) => {
  try {
    let formattedParams = {
      ...params,
      monthYear: Date.parse(params["monthYear"]),
    };
    let queryObject = removeEmptyParams(formattedParams);
    let payload = null;
    payload = await httpRequest(
      "post",
      "report-services/reports/ws/billSummary", // search
      "",
      queryObject
    );
    dispatch(
      prepareFinalObject("reportTableData", payload["billSummaryResponses"])
    );
    let tableData = payload.billSummaryResponses.map((eachItem, index) => ({
      "Sl. No.": index + 1,
      ULB: eachItem["ULB"],
      Date: eachItem["Month-Year"],
      Count: eachItem["Count"],
    }));
    return tableData;
  } catch (error) {
    dispatch(toggleSnackbar(true, { labelKey: error.message }, "error"));
    console.log(error.message);
    return null;
  }
};

export const waterbillDemandReportSearch = async (params, state, dispatch) => {
  try {
    const dayDiff = getDayDifference(params["fromDate"], params["toDate"]);
    if (dayDiff < 0) {
      dispatch(
        toggleSnackbar(
          true,
          { labelKey: "From Date should be less than To Date." },
          "warning"
        )
      );
      return null;
    } else if (dayDiff > 31) {
      dispatch(
        toggleSnackbar(
          true,
          { labelKey: "Date difference should be less than a month." },
          "warning"
        )
      );
      return null;
    } else {
      const formattedParams = {
        ...params,
        fromDate: Date.parse(params["fromDate"]),
        toDate: Date.parse(params["toDate"]),
      };
      let queryObject = removeEmptyParams(formattedParams);
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
          Ward: eachItem["ward"],
          "Connection No": eachItem["connectionNo"],
          "Old Connection No": eachItem["oldConnectionNo"],
          "Connection Type": eachItem["connectionType"],
          "Connection Holder Name": eachItem["connectionHolderName"],
          "Collection Amount": eachItem["collectionAmount"],
          "Contact No": eachItem["contactNo"],
          Address: eachItem["address"],
          "Demand Period From": eachItem["demandPeriodFrom"],
          "Demand Period To": eachItem["demandPriodTo"],
          "Current Demand": eachItem["currentDemandAmount"],
          "Collection Amount": eachItem["collectionAmount"],
          "Rebate Amount": eachItem["rebateAmount"],
          Penalty: eachItem["penaltyAmount"],
          Advance: eachItem["advanceAmount"],
          Arrear: eachItem["arrearAmt"],
          "Total Due": eachItem["totalDueAmount"],
          "Amount Payable after Rebate":
            eachItem["amountPayableAfterRebateAmount"],
          "Amount Payable with Penalty":
            eachItem["amountPayableWithPenaltyAmount"],
        })
      );
      return tableData;
    }
  } catch (error) {
    dispatch(toggleSnackbar(true, { labelKey: error.message }, "error"));
    console.log(error.message);
    return null;
  }
};

export const consumerPaymentHistorySearch = async (params, state, dispatch) => {
  try {
    let queryObject = removeEmptyParams(params);
    let payload = null;
    payload = await httpRequest(
      "post",
      "/report-services/reports/ws/consumerPaymentHistory",
      "",
      queryObject
    );
    dispatch(
      prepareFinalObject(
        "reportTableData",
        payload["consumerPaymentHistoryResponse"]
      )
    );
    let tableData = payload.consumerPaymentHistoryResponse.map(
      (eachItem, index) => ({
        "Sl. No.": index + 1,
        ULB: eachItem["ulb"],
        "Employee Id": eachItem["employeeId"],
        "Employee Name": eachItem["employeeName"],
        "Ward Number": eachItem["wardNo"],
        Head: eachItem["head"],
        "Date Of Payment": eachItem["dateOfTransaction"]
          ? epochToDDMMYYYYFromatter(eachItem["dateOfTransaction"])
          : "NA",
        "Transaction Id": eachItem["transactionId"],
        "Payment Mode": eachItem["paymentMode"],
        "Paid Amount": eachItem["paidAmount"],
        "Month And Year": eachItem["MonthYear"],
        "Consumer Number": eachItem["consumerNo"],
        "Consumer Name": eachItem["consumerName"],
        "Consumer Address": eachItem["consumerAddress"],
      })
    );
    return tableData;
  } catch (error) {
    dispatch(toggleSnackbar(true, { labelKey: error.message }, "error"));
    console.log(error.message);
    return null;
  }
};

export const newConsumerMonthlyReportSearch = async (
  params,
  state,
  dispatch
) => {
  try {
    const formattedParams = {
      ...params,
      monthYear: Date.parse(params["monthYear"]),
    };
    let queryObject = removeEmptyParams(formattedParams);
    let payload = null;
    payload = await httpRequest(
      "post",
      "/report-services/reports/ws/waterNewConsumerMonthlyReport",
      "",
      queryObject
    );
    dispatch(
      prepareFinalObject(
        "reportTableData",
        payload["waterNewConsumerMonthlyResponses"]
      )
    );
    let tableData = payload.waterNewConsumerMonthlyResponses.map(
      (eachItem, index) => ({
        "Sl. No.": index + 1,
        ULB: eachItem["ulb"],
        "Ward Number": eachItem["ward"],
        "Connection Number": eachItem["connectionNo"],
        "Application Number": eachItem["applicationNo"],
        "Execution Date": eachItem["executionDate"],
        "Sanction Date": eachItem["sanctionDate"],
        "Connection Type": eachItem["connectionType"],
        "Connection Facility": eachItem["connectionFacility"],
        "Connection Category": eachItem["connectionCategory"],
        "Connection Purpose": eachItem["connectionPurpose"],
        "Mobile Number": eachItem["mobile"],
        "Consumer Name": eachItem["userName"],
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
export const consumerHistoryReportSearch = async (params, state, dispatch) => {
  try {
    const dayDiff = getDayDifference(params["fromDate"], params["toDate"]);
    if (dayDiff < 0) {
      dispatch(
        toggleSnackbar(
          true,
          { labelKey: "From Date should be less than To Date." },
          "warning"
        )
      );
      return null;
    } else {
      const formattedParams = {
        ...params,
        fromDate: Date.parse(params["fromDate"]),
        toDate: Date.parse(params["toDate"]),
      };
      let queryObject = removeEmptyParams(formattedParams);
      let payload = null;
      payload = await httpRequest(
        "post",
        "/report-services/reports/ws/wsConsumerHistoryReport",
        "",
        queryObject
      );
      dispatch(
        prepareFinalObject(
          "reportTableData",
          payload["wsConsumerHistoryReport"]
        )
      );
      let tableData = payload.wsConsumerHistoryReport.map(
        (eachItem, index) => ({
          "Sl. No.": index + 1,
          ULB: eachItem["ulb"],
          "Ward Number": eachItem["ward"],
          "Consumer Number": eachItem["consumerNo"],
          "Old Connection Number": eachItem["oldConnectionNo"],
          Month: eachItem["month"],
          "Connection Type": eachItem["connectionType"],
          "Current Demand": eachItem["currentDemand"],
          "Collection Amount": eachItem["collectionAmt"],
          Penalty: eachItem["penalty"],
          Advance: eachItem["advance"],
          Arrear: eachItem["arrear"],
          "Total Due": eachItem["totalDue"],
          "Payment Date": eachItem["paymentDate"],
          "Payment Mode": eachItem["paymentMode"],
          "Receipt Number": eachItem["receiptNo"],
        })
      );
      return tableData;
    }
  } catch (error) {
    dispatch(toggleSnackbar(true, { labelKey: error.message }, "error"));
    console.log(error.message);
    return null;
  }
};
export const consumerBillHistoryReportSearch = async (
  params,
  state,
  dispatch
) => {
  try {
    let queryObject = removeEmptyParams(params);
    let payload = null;
    payload = await httpRequest(
      "post",
      "/report-services/reports/ws/consumerBillHistoryReport",
      "",
      queryObject
    );
    dispatch(
      prepareFinalObject(
        "reportTableData",
        payload["consumerBillHistoryReport"]
      )
    );
    let tableData = payload.consumerBillHistoryResponse.map(
      (eachItem, index) => ({
        "Sl. No.": index + 1,
        ULB: eachItem["ulb"],
        "Consumer Code": eachItem["consumerCode"],
        "Period From": eachItem["periodFrom"],
        "Period To": eachItem["periodTo"],
        "Payment Completed": eachItem["paymentCompleted"],
        "Tax Amount": eachItem["taxAmount"],
        "Collected Amount": eachItem["collectedAmount"],
        "Due Amount": eachItem["dueAmount"],
      })
    );
    return tableData;
  } catch (error) {
    dispatch(toggleSnackbar(true, { labelKey: error.message }, "error"));
    console.log(error.message);
    return null;
  }
};

export const connectionsEligibleForDemandGenerationSearch = async (
  params,
  state,
  dispatch
) => {
  try {
    let queryObject = removeEmptyParams(params);
    let payload = null;
    payload = await httpRequest(
      "post",
      "/report-services/reports/ws/wsConnectionsEligibleForDemandGeneration",
      "",
      queryObject
    );
    dispatch(
      prepareFinalObject(
        "reportTableData",
        payload["wsConnectionsEligibleForDemandGeneration"]
      )
    );
    let tableData = payload.wsConnectionsEligibleForDemandGeneration.map(
      (eachItem, index) => ({
        "Sl. No.": index + 1,
        ULB: eachItem["tenantid"],
        Ward: eachItem["ward"],
        "No of Connections": eachItem["numberofconnections"],
      })
    );
    return tableData;
  } catch (error) {
    dispatch(toggleSnackbar(true, { labelKey: error.message }, "error"));
    console.log(error.message);
    return null;
  }
};
export const employeeWiseWSCollectionSearch = async (
  params,
  state,
  dispatch
) => {
  try {
    const dayDiff = getDayDifference(params["fromDate"], params["toDate"]);
    if (dayDiff < 0) {
      dispatch(
        toggleSnackbar(
          true,
          { labelKey: "From Date should be less than To Date." },
          "warning"
        )
      );
      return null;
    } else if (dayDiff > 31) {
      dispatch(
        toggleSnackbar(
          true,
          { labelKey: "Date difference should be less than a month." },
          "warning"
        )
      );
      return null;
    } else {
      const formattedParams = {
        ...params,
        fromDate: Date.parse(params["fromDate"]),
        toDate: Date.parse(params["toDate"]),
      };
      let queryObject = removeEmptyParams(formattedParams);
      let payload = null;
      payload = await httpRequest(
        "post",
        "/report-services/reports/ws/employeeWiseWSCollection",
        "",
        queryObject
      );
      dispatch(
        prepareFinalObject(
          "reportTableData",
          payload["employeeWiseWSCollectionResponse"]
        )
      );
      let tableData = payload.employeeWiseWSCollectionResponse.map(
        (eachItem, index) => ({
          "Sl. No.": index + 1,
          ULB: eachItem["ulb"],
          "Ward Number": eachItem["ward"],
          "Employee User Id": eachItem["employeeId"],
          "Employee User Name": eachItem["employeeName"],
          Head: eachItem["head"],
          "Payment Date": eachItem["paymentDate"]
            ? epochToDDMMYYYYFromatter(eachItem["paymentDate"])
            : "NA",
          "Payment Mode": eachItem["paymentMode"],
          "Receipt No": eachItem["receiptNo"],
          Amount: eachItem["amount"],
          "Consumer Number": eachItem["consumerCode"],
          "Old Consumer Number": eachItem["oldConsumerNo"],
        })
      );
      return tableData;
    }
  } catch (error) {
    dispatch(toggleSnackbar(true, { labelKey: error.message }, "error"));
    console.log(error.message);
    return null;
  }
};

export const schedulerBasedDemandsGenerationSearch = async (
  params,
  state,
  dispatch
) => {
  try {
    const formattedParams = {
      ...params,
      monthYear: Date.parse(params["monthYear"]),
    };
    let queryObject = removeEmptyParams(formattedParams);
    let payload = null;
    payload = await httpRequest(
      "post",
      "/report-services/reports/ws/wsSchedulerBasedDemandsGeneration",
      "",
      queryObject
    );
    dispatch(
      prepareFinalObject(
        "reportTableData",
        payload["wsSchedulerBasedDemandsGenerationReponse"]
      )
    );
    let tableData = payload.wsSchedulerBasedDemandsGenerationReponse.map(
      (eachItem, index) => ({
        "Sl. No.": index + 1,
        ULB: eachItem["ulb"],
        "Ward Number": eachItem["ward"],
        "Connection Number": eachItem["consumerCode"],
        "Old Connection Number": eachItem["oldConnectionNo"],
        "Connection Type": eachItem["connectionType"],
        "Demand Generation Date":  eachItem["demandGenerationDate"]
        ? epochToDDMMYYYYFromatter(eachItem["demandGenerationDate"])
        : "NA",
        "Tax Period From": eachItem["taxPeriodFrom"]
        ? epochToDDMMYYYYFromatter(eachItem["taxPeriodFrom"])
        : "NA",
        "Tax Period To": eachItem["taxPeriodto"] 
        ? epochToDDMMYYYYFromatter(eachItem["taxPeriodto"])
        : "NA"
      })
    );
    return tableData;
  } catch (error) {
    dispatch(toggleSnackbar(true, { labelKey: error.message }, "error"));
    console.log(error.message);
    return null;
  }
};
