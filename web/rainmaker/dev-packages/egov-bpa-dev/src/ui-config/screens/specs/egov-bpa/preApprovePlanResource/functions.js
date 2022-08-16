import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
export const feetToMeterConversion = (action, state, dispatch) => {
  const { componentJsonpath } = action;
  let splitVal = componentJsonpath.split(".");
  const includeWidthInFt = splitVal.includes("widthInFt");
  const includeLengthInFt = splitVal.includes("lengthInFt");
  if (includeWidthInFt) {
    let width = parseFloat(action.value) / 3.2808
    width.toFixed(2)
    dispatch(
      prepareFinalObject(
        "plotDetails.widthInMt",
        width.toFixed(2)
      )
    );
  }
  if (includeLengthInFt) {
    let length = parseFloat(action.value) / 3.2808
    length.toFixed(2)
    dispatch(
      prepareFinalObject(
        "plotDetails.lengthInMt",
        length.toFixed(2)
      )
    );
  }
  componentJsonpath.split(".").inc;
};