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

export const taxCollectorWiseCollectionSearch = async (
  params,
  state,
  dispatch
) => {
  try {
    const formattedParams = {
      ...params,
      startDate: Date.parse(params["startDate"]),
      endDate: Date.parse(params["endDate"]),
    };
    let queryObject = Object.keys(formattedParams).map((key) => ({
      key: key,
      value: formattedParams[key],
    }));
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
        "Payment Date": eachItem["paymentDate"] ? epochToDDMMYYYYFromatter(eachItem["paymentDate"]) : "NA",
        "Property Id": eachItem["propertyId"],
        "Old Property Id": eachItem["oldPropertyId"],
      })
    );
    return tableData;
  } catch (error) {
    dispatch(toggleSnackbar(true, { labelKey: error.message }, "error"));
    console.log(error.message);
    return null;
  }
};

export const ulbWiseTaxCollectionSearch = async (
  params,
  state,
  dispatch
) => {
  try {
    let queryObject = Object.keys(params).map((key) => ({
      key: key,
      value: params[key],
    }));
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
        "ULB": eachItem["ulb"],
        "Property Id": eachItem["propertyId"],
        "Old Property Id": eachItem["oldPropertyId"],
        "Ward": eachItem["ward"],
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

export const propertyDetailsSearch = async (
  params,
  state,
  dispatch
) => {
  try {
    let queryObject = Object.keys(params).map((key) => ({
      key: key,
      value: params[key],
    }));
    let payload = null;
    payload = await httpRequest(
      "post",
      "/report-services/reports/pt/propertyDetails",
      "",
      queryObject
    );
    dispatch(
      prepareFinalObject(
        "reportTableData",
        payload["propertyDetailsInfo"]
      )
    );
    let tableData = payload.propertyDetailsInfo.map(
      (eachItem, index) => ({
        "Sl. No.": index + 1,
        "ULB": eachItem["ulbName"],
        "Ward Number": eachItem["wardNumber"],
        "Old Property Id": eachItem["oldPropertyId"],
        "Property Id": eachItem["propertyId"],
        "User Id": eachItem["userId"],
        "User Name": eachItem["name"],
        "Mobile Number": eachItem["mobileNumber"],
        "Door Number": eachItem["doorNo"],
        "Building Name": eachItem["buildingName"],
        "Street": eachItem["street"],
        "City": eachItem["city"],
        "Pincode": eachItem["pincode"],
        "Address": eachItem["address"],
      })
    );
    return tableData;
  } catch (error) {
    dispatch(toggleSnackbar(true, { labelKey: error.message }, "error"));
    console.log(error.message);
    return null;
  }
};