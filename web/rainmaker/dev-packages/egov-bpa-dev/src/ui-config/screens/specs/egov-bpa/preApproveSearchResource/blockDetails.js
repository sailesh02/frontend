import {
  getCommonCard,
  getCommonContainer,
  getCommonTitle,
  getBreak,
  getLabel,
  getTextField,
  getLabelWithValue,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import store from "ui-redux/store";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";

// Open building details pop up to add new floor information in block occupacy section
const openAddBuildinfDetailsPopUp = async (state, dispatch, action) => {
  const blockDetails = {};
  dispatch(prepareFinalObject("blockDetail", blockDetails));
  let mystring = action.componentJsonpath;
  const regexp = /\[(.*?)\]/g;
  let objValue = [...mystring.matchAll(regexp)];
  if (objValue) {
    var submatch = objValue[1][1];
    dispatch(prepareFinalObject("edcr.currentIndex", submatch));
  }
  store.dispatch(
    handleField(
      "preapprovedplan",
      "components.popupForScrutinyDetail.props",
      "open",
      true
    )
  );
};
// Configuration of block occupacy section
export const proposedBuildingDetails = getCommonCard({
  headertitle: getCommonTitle(
    {
      labelName: "Block wise occupancy /sub occupancy and usage details",
      labelKey:
        "BPA_APPLICATION_BLOCK_WISE_OCCUPANCY_SUB_OCCUPANCY_USAGE_TITLE",
    },
    {
      style: {
        marginBottom: 10,
      },
    }
  ),
  buildingheaderDetails: getCommonContainer({
    header: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      props: {
        style: {
          fontSize: "18px",
          paddingLeft: "10px",
          paddingTop: "14px",
        },
      },
      children: {
        proposedLabel: getLabel({
          labelName: "Proposed Building Details",
          labelKey: "BPA_APPLICATION_PROPOSED_BUILDING_LABEL",
        }),
      },
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6,
      },
    },
    occupancyType: getLabelWithValue(
      {
        labelName: "Occupancy Type",
        labelKey: "BPA_OCCUPANCY_TYPE",
      },
      {
        jsonPath: "residentialOccupacy.description",
      }
    ),
    dummyDiv2: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6,
      },
      visible: true,
      props: {
        disabled: true,
      },
    },
    subOccupancyType: getLabelWithValue(
      {
        labelName: "Sub Occupancy Type",
        labelKey: "BPA_SUB_OCCUP_TYPE_LABEL",
      },
      {
        jsonPath: "drawingDetails.drawingDetail.subOccupancy.label",
      }
    ),
  }),
  proposedContainer: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    visible: true,
    props: {
      className: "mymuicontainer",
    },
    children: {
      component: {
        uiFramework: "custom-containers",
        componentPath: "MultiItem",
        props: {
          hasAddItem: false,
          scheama: getCommonContainer({
            buildingDetailsContainer: getCommonContainer({
              header: getLabel("Block", "", {
                jsonPath: "edcr.blockDetail[0].titleData",
                style: {
                  width: "50%",
                  marginTop: "5px",
                },
              }),
              buildingHeight: getTextField({
                label: {
                  labelName: "Building Height",
                  labelKey: "PREAPPROVE_BUILDING_HEIGHT",
                },
                pattern: "^[0-9]*$",
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                disabled: true,
                jsonPath: "edcr.blockDetail[0].height.buildingHeight",
                gridDefination: {
                  xs: 12,
                  sm: 6,
                  md: 6,
                },
              }),
              actualBuildingHeight: getTextField({
                label: {
                  labelName: "Actual Building Height",
                  labelKey: "PREAPPROVE_ACTUAL_BUILDING_HEIGHT",
                },
                pattern: "^[0-9]*$",
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                disabled: true,
                jsonPath: "edcr.blockDetail[0].height.actualBuildingHeight",
                gridDefination: {
                  xs: 12,
                  sm: 6,
                  md: 6,
                },
              }),
              frontSetback: getTextField({
                label: {
                  labelName: "Front setback",
                  labelKey: "PREAPPROVE_FRONT_SETBACK",
                },
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                disabled: true,
                jsonPath: "edcr.blockDetail[0].blockSetBack.frontSetback",
                gridDefination: {
                  xs: 12,
                  sm: 6,
                  md: 6,
                },
              }),
              rearSetback: getTextField({
                label: {
                  labelName: "Rear setback",
                  labelKey: "PREAPPROVE_REAR_SETBACK",
                },
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                disabled: true,
                jsonPath: "edcr.blockDetail[0].blockSetBack.rearSetback",
                gridDefination: {
                  xs: 12,
                  sm: 6,
                  md: 6,
                },
              }),
              rightSetback: getTextField({
                label: {
                  labelName: "Right setback",
                  labelKey: "PREAPPROVE_RIGHT_SETBACK",
                },
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                disabled: true,
                jsonPath: "edcr.blockDetail[0].blockSetBack.rightSetback",
                gridDefination: {
                  xs: 12,
                  sm: 6,
                  md: 6,
                },
              }),
              leftSetback: getTextField({
                label: {
                  labelName: "Left setback",
                  labelKey: "PREAPPROVE_LEFT_SETBACK",
                },
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                disabled: true,
                jsonPath: "edcr.blockDetail[0].blockSetBack.rightSetback",
                gridDefination: {
                  xs: 12,
                  sm: 6,
                  md: 6,
                },
              }),
              proposedBuildingDetailsContainer: {
                uiFramework: "custom-molecules-local",
                moduleName: "egov-bpa",
                componentPath: "Table",
                gridDefination: {
                  xs: 12,
                  sm: 12,
                  md: 12,
                },
                props: {
                  className: "mymuitable",
                  jsonPath: "edcr.blockDetail[0].blocks",
                  style: { marginBottom: 20 },
                  gridDefination: {
                    xs: 12,
                    sm: 12,
                    md: 12,
                  },
                  columns: {
                    "Floor Description": {},
                    Level: {},
                    "Buildup Area": {},
                    "Floor Area": {},
                    "Carpet Area": {},
                    "Floor Height": {},
                  },
                  title: "",
                  options: {
                    filterType: "dropdown",
                    responsive: "responsive",
                    selectableRows: false,
                    pagination: false,
                    selectableRowsHeader: false,
                    sortFilterList: false,
                    sort: false,
                    filter: false,
                    search: false,
                    print: false,
                    download: false,
                    viewColumns: false,
                    rowHover: true,
                  },
                },
              },
            }),
          }),
          items: [],
          isReviewPage: true,
          prefixSourceJsonPath: "children.buildingDetailsContainer.children",
          sourceJsonPath: "edcr.blockDetail",
        },
        type: "array",
      },
      breakP: getBreak(),
      breakq: getBreak(),
    },
  },
});
