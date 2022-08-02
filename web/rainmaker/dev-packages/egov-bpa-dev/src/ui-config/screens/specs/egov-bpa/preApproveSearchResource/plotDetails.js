import {
    getCommonCard,
    getCommonContainer,
    getCommonTitle,
    getTextField,
  } from "egov-ui-framework/ui-config/screens/specs/utils";
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
        jsonPath: "drawingDetails.plotWidth",
        gridDefination: {
          xs: 12,
          sm: 6,
          md: 6,
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
        jsonPath: "drawingDetails.plotLength",
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
        props: {
          disabled: true,
          className: "tl-trade-type",
        },
        pattern: "^(?=.)([+-]?([0-9]*)(.([0-9]+))?)$",
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "drawingDetails.drawingDetail.plotArea",
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
        props: {
          disabled: true,
          className: "tl-trade-type",
        },
        pattern: "^(?=.)([+-]?([0-9]*)(.([0-9]+))?)$",
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "drawingDetails.roadWidth",
        required: true,
        gridDefination: {
          xs: 12,
          sm: 6,
          md: 6,
        },
      }),
    }),
  });