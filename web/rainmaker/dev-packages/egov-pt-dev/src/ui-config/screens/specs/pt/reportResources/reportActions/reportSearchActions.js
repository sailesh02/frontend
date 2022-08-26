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

export const taxCollectorWiseCollectionSearch = async (
  params,
  state,
  dispatch
) => {
  try {
    const dayDiff = getDayDifference(params["startDate"], params["endDate"]);
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
        startDate: Date.parse(params["startDate"]),
        endDate: Date.parse(params["endDate"]),
      };
      let queryObject = removeEmptyParams(formattedParams);
      let payload = null;
      payload = await httpRequest(
        "post",
        "/report-services/reports/pt/taxCollectorWiseCollectionReport",
        "",
        queryObject
      );
      dispatch(
        prepareFinalObject(
          "reportTableData",
          payload["taxCollectorWiseCollectionResponse"]
        )
      );
      let tableData = payload.taxCollectorWiseCollectionResponse.map(
        (eachItem, index) => ({
          "Sl. No.": index + 1,
          "Collector Name": eachItem["collectorName"],
          "Collector Employee Id": eachItem["collectorEmployeeId"],
          "Collector Mobile Number": eachItem["mobileNumber"],
          "Ammount Collected": eachItem["ammountCollected"],
          "Payment Mode": eachItem["paymentMode"],
          "Receipt Number": eachItem["receiptNumber"],
          "Payment Date": eachItem["paymentDate"]
            ? epochToDDMMYYYYFromatter(eachItem["paymentDate"])
            : "NA",
          "Property Id": eachItem["propertyId"],
          "Old Property Id": eachItem["oldPropertyId"],
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

export const ulbWiseTaxCollectionSearch = async (params, state, dispatch) => {
  try {
    let queryObject = removeEmptyParams(params);
    let payload = null;
    payload = await httpRequest(
      "post",
      "/report-services/reports/pt/ulbWiseTaxCollectionReport",
      "",
      queryObject
    );
    dispatch(
      prepareFinalObject(
        "reportTableData",
        payload["ulbWiseTaxCollectionResponse"]
      )
    );
    let tableData = payload.ulbWiseTaxCollectionResponse.map(
      (eachItem, index) => ({
        "Sl. No.": index + 1,
        ULB: eachItem["ulb"],
        "Property Id": eachItem["propertyId"],
        "Old Property Id": eachItem["oldPropertyId"],
        Ward: eachItem["ward"],
        "Current Year Demand Amount": eachItem["currentYearDemandAmount"],
        "Total Arrear Demand Amount": eachItem["totalArrearDemandAmount"],
        "Total Collected Amount": eachItem["totalCollectedAmount"],
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

export const propertyDetailsSearch = async (params, state, dispatch) => {
  try {
    let queryObject = removeEmptyParams(params);
    let payload = null;
    payload = await httpRequest(
      "post",
      "/report-services/reports/pt/propertyDetails",
      "",
      queryObject
    );
    dispatch(
      prepareFinalObject("reportTableData", payload["propertyDetailsInfo"])
    );
    let tableData = payload.propertyDetailsInfo.map((eachItem, index) => ({
      "Sl. No.": index + 1,
      ULB: eachItem["ulbName"],
      "Ward Number": eachItem["wardNumber"],
      "Old Property Id": eachItem["oldPropertyId"],
      "Property Id": eachItem["propertyId"],
      "User Name": eachItem["name"],
      "Mobile Number": eachItem["mobileNumber"],
      "Door Number": eachItem["doorNo"],
      "Building Name": eachItem["buildingName"],
      Street: eachItem["street"],
      City: eachItem["city"],
      Pincode: eachItem["pincode"],
      Address: eachItem["address"],
    }));
    return tableData;
  } catch (error) {
    dispatch(toggleSnackbar(true, { labelKey: error.message }, "error"));
    console.log(error.message);
    return null;
  }
};

export const propertyCollectionSearch = async (params, state, dispatch) => {
  try {
    let queryObject = removeEmptyParams(params);
    let payload = null;
    payload = await httpRequest(
      "post",
      "/report-services/reports/pt/propertyWiseCollectionReport",
      "",
      queryObject
    );
    dispatch(
      prepareFinalObject(
        "reportTableData",
        payload["propertyWiseCollectionResponse"]
      )
    );
    let tableData = payload.propertyWiseCollectionResponse.map(
      (eachItem, index) => ({
        "Sl. No.": index + 1,
        "Property Id": eachItem["consumerId"],
        "Old Property Id": eachItem["oldPropertyId"],
        Ward: eachItem["ward"],
        Name: eachItem["name"],
        "Mobile Number": eachItem["mobileNumber"],
        "Due Before Payment": eachItem["dueBeforePayment"],
        "Amount Paid": eachItem["amountPaid"],
        "Current Due": eachItem["currentDue"],
        "Reciept Number": eachItem["receiptNumber"],
        "Reciept Date": eachItem["receiptDate"],
        "Payment Mode": eachItem["paymentMode"],
      })
    );
    return tableData;
  } catch (error) {
    dispatch(toggleSnackbar(true, { labelKey: error.message }, "error"));
    console.log(error.message);
    return null;
  }
};

export const propertyWiseDemandsSearch = async (params, state, dispatch) => {
  try {
    let queryObject = removeEmptyParams(params);
    let payload = null;
    payload = await httpRequest(
      "post",
      "/report-services/reports/pt/propertyWiseDemandReport",
      "",
      queryObject
    );
    dispatch(
      prepareFinalObject(
        "reportTableData",
        payload["propertyWiseDemandResponse"]
      )
    );
    let tableData = payload.propertyWiseDemandResponse.map(
      (eachItem, index) => ({
        "Sl. No.": index + 1,
        ULB: eachItem["ulb"],
        "Property Id": eachItem["propertyId"],
        "Old Property Id": eachItem["oldPropertyId"],
        Ward: eachItem["ward"],
        Name: eachItem["name"],
        "Mobile Number": eachItem["mobileNumber"],
        "Financial Year From": eachItem["taxPeriodFrom"] ? epochToDDMMYYYYFromatter(eachItem["taxPeriodFrom"]) : "NA",
        "Financial Year To": eachItem["taxPeriodTo"] ? epochToDDMMYYYYFromatter(eachItem["taxPeriodTo"]) : "NA",
        "Total Demand Amount": eachItem["taxDemandAmount"],
        "Paid Amount": eachItem["paidAmount"],
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
