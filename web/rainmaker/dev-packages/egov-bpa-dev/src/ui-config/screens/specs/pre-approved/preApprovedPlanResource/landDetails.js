import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getDateField,
  getSelectField,
  getCommonContainer,
  getPattern,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getTodaysDateInYMD, getScrutinyDetails } from "../../utils";
import { getDrawingDetails } from "./getDrawingDetails";
import "./index.css";

export const landDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Land Details",
      labelKey: "PREAPPROVE_LAND_DETAILS_TITLE",
    },
    {
      style: {
        marginBottom: 18,
      },
    }
  ),
  landDetailsContainer: getCommonContainer({
    governementBody: getSelectField({
      label: {
        labelName: "Name of Lessor / Government Body",
        labelKey: "PREAPPROVE_GOVERNMENT_BODY",
      },
      placeholder: {
        labelName: "Select Government Body",
        labelKey: "PREAPPROVE_SELECT_GOVERNMENT_BODY",
      },
      jsonPath: "BPA.additionalDetails.landDetails.governementBody",
      sourceJsonPath: "PA.governementBody",
      required: true,
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6,
      },
    }),
    governmentScheme: getTextField({
      label: {
        labelName: "Name of Government Scheme",
        labelKey: "PREAPPROVE_GOVERNMENT_SCHEME",
      },
      placeholder: {
        labelName: "Enter Government Scheme",
        labelKey: "PREAPPROVE_GOVERNMENT_SCHEME_DETAILS_PLACEHOLDER",
      },
      required: true,
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "BPA.additionalDetails.landDetails.governmentScheme",
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6,
      },
    }),
    schemePlotNumber: getTextField({
      label: {
        labelName: "Scheme plot Number",
        labelKey: "PREAPPROVE_SCHEME_PLOT",
      },
      required: false,
      jsonPath: "BPA.additionalDetails.landDetails.schemePlotNumber",
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6,
      },
      props: {
        className: "tl-trade-type",
      },
    }),
    revenuePlotNumber: getTextField({
      label: {
        labelName: "Revenue plot Number",
        labelKey: "PREAPPROVE_REVENUE_PLOT",
      },
      required: false,
      jsonPath: "BPA.additionalDetails.landDetails.revenuePlotNumber",
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6,
      },
      props: {
        className: "tl-trade-type",
      },
    }),
    revenueVillage: getTextField({
      label: {
        labelName: "Revenue village / Mauza",
        labelKey: "PREAPPROVE_REVENUE_VILLAGE",
      },
      required: false,
      jsonPath: "BPA.additionalDetails.landDetails.revenueVillage",
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6,
      },
      props: {
        className: "tl-trade-type",
      },
    }),
    kisam: getTextField({
      label: {
        labelName: "Kisam",
        labelKey: "PREAPPROVE_KISAM",
      },
      required: false,
      jsonPath: "BPA.additionalDetails.landDetails.kisam",
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6,
      },
      props: {
        className: "tl-trade-type",
      },
    }),
    widthInMt: getTextField({
      label: {
        labelName: "Width of plot(in m.)",
        labelKey: "PREAPPROVE_PLOT_WITH_IN_METER",
      },
      pattern: "^(?=.)([+-]?([0-9]*)(.([0-9]+))?)$",
      props: {
        className: "tl-trade-type",
      },
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "BPA.additionalDetails.landDetails.width",
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
        className: "tl-trade-type",
      },
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "BPA.additionalDetails.landDetails.length",
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
      jsonPath: "BPA.additionalDetails.landDetails.abuttingRoadWidth",
      required: true,
      gridDefination: {
        xs: 12,
        sm: 6,
        md: 6,
      },
    }),

    //   Private Layout sections start
    layoutApprovalDate: getDateField({
      label: {
        labelName: "Date of Layout Approval",
        labelKey: "PREAPPROVE_DATE_LABEL",
      },
      placeholder: {
        labelName: "Select to Date",
        labelKey: "PREAPPROVE_DATE_PLACEHOLDER",
      },
      visible: false,
      required: true,
      jsonPath: "BPA.additionalDetails.landDetails.layoutApprovalDate",
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6,
      },
      pattern: getPattern("Date"),
      errorMessage: "ERR_INVALID_DATE",
    }),
    layoutPlotNumber: getTextField({
      label: {
        labelName: "Layout plot Number",
        labelKey: "PREAPPROVE_LAYOUT_PLOT",
      },
      required: false,
      visible: false,
      jsonPath: "BPA.additionalDetails.landDetails.layoutPlotNumber",
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6,
      },
      props: {
        className: "tl-trade-type",
      },
    }),
    roadDetails: getSelectField({
      label: {
        labelName:
          "Whether Roads/open spaces/ Drain have been gifted to ULB/Government Body",
        labelKey: "PREAPPROVE_ROAD_DETAILS",
      },
      placeholder: {
        labelName: "Select road details",
        labelKey: "PREAPPROVE_ROAD_DETAILS_PLACEHOLDER",
      },
      localePrefix: {
        moduleName: "PREAPPROVE",
        masterName: "PREAPPROVE_TYPE"
      },
      jsonPath: "BPA.additionalDetails.landDetails.roadDetails",
      sourceJsonPath: "PA.confirmation",
      required: true,
      visible: false,
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6,
      },
    }),
  }),
});
