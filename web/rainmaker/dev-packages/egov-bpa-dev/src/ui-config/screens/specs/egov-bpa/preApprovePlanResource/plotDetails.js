import {
    getCommonCard,
    getCommonContainer,
    getCommonTitle,
    getTextField,
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { feetToMeterConversion } from "./functions";
  import get from "lodash/get";
4
// Configuration of plot details section
export const plotDetails = getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Plot Details",
        labelKey: "PREAPPROVE_PLOT_DETAILS",
      },
      {
        style: {
          marginBottom: 18,
        },
      }
    ),
    plotDetailsContainer: getCommonContainer({
      widthInFt: getTextField({
        label: {
          labelName: "Width of plot(in ft.)",
          labelKey: "PREAPPROVE_PLOT_WITH_IN_FT",
        },
        pattern: "^(?=.)([+-]?([0-9]*)(.([0-9]+))?)$",
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        required: true,
        jsonPath: "plotDetails.widthInFt",
        gridDefination: {
          xs: 12,
          sm: 6,
          md: 6,
        },
        afterFieldChange: (action, state, dispatch) => {
          const widthInFt = get(
            state.screenConfiguration.plotDetails,
            "widthInFt"
          );
          feetToMeterConversion(action, state, dispatch);
        },
      }),
      widthInMt: getTextField({
        label: {
          labelName: "Width of plot(in m.)",
          labelKey: "PREAPPROVE_PLOT_WITH_IN_METER",
        },
        pattern: "^(?=.)([+-]?([0-9]*)(.([0-9]+))?)$",
        props: {
          disabled: true,
          className: "tl-trade-type",
        },
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "plotDetails.widthInMt",
        gridDefination: {
          xs: 12,
          sm: 6,
          md: 6,
        },
      }),
      lengthInFt: getTextField({
        label: {
          labelName: "Length of plot(in ft.)",
          labelKey: "PREAPPROVE_PLOT_LENGTH_IN_FT",
        },
        pattern: "^(?=.)([+-]?([0-9]*)(.([0-9]+))?)$",
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        required: true,
        jsonPath: "plotDetails.lengthInFt",
        gridDefination: {
          xs: 12,
          sm: 6,
          md: 6,
        },
        afterFieldChange: (action, state, dispatch) => {
          const widthInFt = get(
            state.screenConfiguration.plotDetails,
            "lengthInFt"
          );
          feetToMeterConversion(action, state, dispatch);
        },
      }),
      lengthInMt: getTextField({
        label: {
          labelName: "Length of plot(in m.)",
          labelKey: "PREAPPROVE_PLOT_LENGTH_IN_METER",
        },
        pattern: "^(?=.)([+-]?([0-9]*)(.([0-9]+))?)$",
        props: {
          disabled: true,
          className: "tl-trade-type",
        },
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "plotDetails.lengthInMt",
        gridDefination: {
          xs: 12,
          sm: 6,
          md: 6,
        },
      }),
      plotAreaInSqrMt: getTextField({
        label: {
          labelName: "Plot area(in sqmt.)",
          labelKey: "PREAPPROVE_PLOT_AREA",
        },
        pattern: "^(?=.)([+-]?([0-9]*)(.([0-9]+))?)$",
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "plotDetails.plotAreaInSqrMt",
        required: true,
        gridDefination: {
          xs: 12,
          sm: 6,
          md: 6,
        },
      }),
      abuttingRoadWidthInMt: getTextField({
        label: {
          labelName: "Abutting road width(in m.)",
          labelKey: "PREAPPROVE_ABUTTING_ROAD",
        },
        pattern: "^(?=.)([+-]?([0-9]*)(.([0-9]+))?)$",
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "plotDetails.abuttingRoadWidthInMt",
        required: true,
        gridDefination: {
          xs: 12,
          sm: 6,
          md: 6,
        },
      }),
      preApprovedCode: getTextField({
        label: {
          labelName: "Preapproved Code",
          labelKey: "PREAPPROVE_CODE",
        },
        pattern: "^(?=.)([+-]?([0-9]*)(.([0-9]+))?)$",
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "plotDetails.preApprovedCode",
        required: true,
        gridDefination: {
          xs: 12,
          sm: 6,
          md: 6,
        },
      }),
    }),
  });