import {
    getCommonCard,
    getCommonContainer,
    getCommonTitle,
    getTextField,
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  

// Configuration of building abstract section
export const buildingAbstract = getCommonCard({
    header: getCommonTitle(
      {
        labelName: "Building Abstract",
        labelKey: "PREAPPROVE_BUILDING_ABSTRACT",
      },
      {
        style: {
          marginBottom: 18,
        },
      }
    ),
    buildingAbstractContainer: getCommonContainer({
      totalBuildUpArea: getTextField({
        label: {
          labelName: "Total build up Area(in sqmt.)",
          labelKey: "PREAPPROVE_TOTAL_BUILD_UP_AREA",
        },
        props: {
          disabled:false,
        },
        pattern: "^(?=.)([+-]?([0-9]*)(.([0-9]+))?)$",
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "buildingAbstract.totalBuildUpArea",
        required: true,
        gridDefination: {
          xs: 12,
          sm: 6,
          md: 6,
        },
      }),
      totalFloorArea: getTextField({
        label: {
          labelName: "Total Floor Area(in sqmt.)",
          labelKey: "PREAPPROVE_TOTAL_FLOOR_AREA",
        },
        props: {
          disabled:false,
        },
        pattern: "^(?=.)([+-]?([0-9]*)(.([0-9]+))?)$",
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "buildingAbstract.totalFloorArea",
        required: true,
        gridDefination: {
          xs: 12,
          sm: 6,
          md: 6,
        },
      }),
      totalFar: getTextField({
        label: {
          labelName: "Total FAR",
          labelKey: "PREAPPROVE_FAR",
        },
        props: {
          disabled:false,
        },
        pattern: "^(?=.)([+-]?([0-9]*)(.([0-9]+))?)$",
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "buildingAbstract.totalFar",
        required: true,
        gridDefination: {
          xs: 12,
          sm: 6,
          md: 6,
        },
      }),
      totalCarpetArea: getTextField({
        label: {
          labelName: "Total carpet Area(in sqmt.)",
          labelKey: "PREAPPROVE_TOTAL_CARPET_AREA",
        },
        pattern: "^(?=.)([+-]?([0-9]*)(.([0-9]+))?)$",
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "buildingAbstract.totalCarpetArea",
        required: false,
        props: {
          disabled:false,
        },
        gridDefination: {
          xs: 12,
          sm: 6,
          md: 6,
        },
      }),
      totalFloorNo: getTextField({
        label: {
          labelName: "Total No. of Floors",
          labelKey: "PREAPPROVE_TOTAL_FLOORS",
        },
        props: {
          disabled:false,
        },
        
        jsonPath: "buildingAbstract.totalFloorNo",
        required: false,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        gridDefination: {
          xs: 12,
          sm: 6,
          md: 6,
        },
      }),
    }),
  });