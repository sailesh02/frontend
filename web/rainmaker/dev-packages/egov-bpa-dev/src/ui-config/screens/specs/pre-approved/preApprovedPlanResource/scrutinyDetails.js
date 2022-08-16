import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getCommonContainer,
  getPattern,
  getCommonGrayCard,
  getCommonSubHeader,
  getLabelWithValue,
  getBreak,
  getLabel,
  getSelectField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import "./index.css";
import { setPreApprovedProposedBuildingData } from "../../utils/index.js";

export const buildingPlanScrutinyDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Pre Approve plan Application Details",
      labelKey: "PREAPPROVE_DETAILS_TITLE"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  buildingPlanScrutinyDetailsContainer: getCommonContainer({
    buildingplanscrutinyapplicationnumber: getLabelWithValue(
      {
        labelName: "Drawing Number",
        labelKey: "BPA_DRAWING_NO_LABEL"
      },
      {
        jsonPath: "scrutinyDetails.edcrNumber"
      }
    ),

  })
});

export const proposedBuildingDetails = getCommonCard({
  headertitle: getCommonTitle(
    {
      labelName: "Block wise occupancy /sub occupancy and usage details",
      labelKey: "BPA_APPLICATION_BLOCK_WISE_OCCUPANCY_SUB_OCCUPANCY_USAGE_TITLE"
    },
    {
      style: {
        marginBottom: 10
      }
    }
  ),
  buildingheaderDetails : getCommonContainer({
    header: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      props: {
          style: {
            fontSize: "18px",
            paddingLeft: "10px",
            paddingTop: "14px"
          }
        },
      children: {
        proposedLabel: getLabel({
          labelName: "Proposed Building Details",
          labelKey: "BPA_APPLICATION_PROPOSED_BUILDING_LABEL"
        })
      },
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
    },
    occupancyType: {
      ...getSelectField({
        label: {
          labelName: "Occupancy Type",
          labelKey: "BPA_OCCUPANCY_TYPE"
        },
        placeholder: {
          labelName: "Select Occupancy Type",
          labelKey: "BPA_OCCUPANCY_TYPE_PLACEHOLDER"
        },
        localePrefix: {
          moduleName: "BPA",
          masterName: "OCCUPANCYTYPE"
        },
        jsonPath: "BPA.occupancyType",
        sourceJsonPath: "applyScreenMdmsData.BPA.OccupancyType",
        required: true,
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6
        },
        props: {
          disabled: true,
          className: "tl-trade-type"
        }
      }),
      beforeFieldChange: (action, state, dispatch) => {
        let path = action.componentJsonpath.replace(
          /.occupancyType/,
          //".proposedContainer.children.component.props.scheama.children.cardContent.children.children.subOccupancyType"
          ".subOccupancyType"
        );
        let occupancyType = get(
          state,
          "screenConfiguration.preparedFinalObject.applyScreenMdmsData.BPA.SubOccupancyType",
          []
        );
        let subOccupancyType = occupancyType.filter(item => {
          return item.active && (item.occupancyType).toUpperCase() === (action.value).toUpperCase();
        });
        dispatch(handleField("preApprovedPlanApply", path, "props.data", subOccupancyType));
        // dispatch(prepareFinalObject("BPA.additionalDetails.isCharitableTrustBuilding", false));
      }
    },
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
        jsonPath: "PA.subOccupancy",
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
        moduleName: "preapprove-table",
        props: {
          hasAddItem: false,
          scheama: getCommonContainer({
            applicantContainer: getCommonContainer({

              header: getLabel(
                "Block",
                "",
                {
                  jsonPath: "edcr.blockDetail[0].titleData",
                  style: {
                    width: "50%",
                    marginTop: "5px"
                  }
                }
              ),
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
                    "Level": {},
                    "Buildup Area": {},
                    "Floor Area": {},
                    "Carpet Area": {},
                    "Floor Height": {},
                  },
                  title: "",
                  options: {
                    filterType: "dropdown",
                    responsive: "stacked",
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
                    rowHover: false
                  }
                }
              },
            }),
          }),
          items: [],
          isReviewPage: true,
          prefixSourceJsonPath: "children.applicantContainer.children",
          sourceJsonPath: "edcr.blockDetail",
        },
        type: "array"
      },
      breakP: getBreak(),
      breakq: getBreak()
    }
  }
});

export const demolitiondetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Demolition Details",
      labelKey: "BPA_APP_DETAILS_DEMOLITION_DETAILS_LABEL"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  demolitionDetailsContainer: getCommonContainer({
    demolitionArea: {
      ...getTextField({
        label: {
          labelName: "Demolition Area",
          labelKey: "BPA_APPLICATION_DEMOLITION_AREA_LABEL"
        },
        jsonPath: "scrutinyDetails.planDetail.planInformation.demolitionArea",
        props: {
          disabled: 'true',
          className : "tl-trade-type"
        }
      })
    }
  })
});

export const abstractProposedBuildingDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Proposed Building Abstract",
      labelKey: "BPA_PROPOSED_BUILDING_ABSTRACT_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  proposedContainer: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    visible: true,
    children: {
      breakPending: getBreak(),
      totalBuildUpAreaDetailsContainer: getCommonContainer({
        totalBuildupArea: {
          ...getTextField({
            label: {
              labelName: "Total Buildup Area (sq.mtrs)",
              labelKey: "BPA_APPLICATION_TOTAL_BUILDUP_AREA"
            },
            jsonPath: "scrutinyDetails.planDetail.virtualBuilding.totalBuitUpArea",
            props: {
              disabled: 'true',
              className: "tl-trade-type"
            },
            gridDefination: {
              xs: 12,
              sm: 12,
              md: 6
            }
          })
        },
        numOfFloors: {
          ...getTextField({
            label: {
              labelName: "Total Floor Area",
              labelKey: "BPA_APPLICATION_NO_OF_FLOORS"
            },
            jsonPath: "scrutinyDetails.planDetail.blocks[0].building.totalFloors",
            props: {
              disabled: 'true',
              className: "tl-trade-type"
            },
            gridDefination: {
              xs: 12,
              sm: 12,
              md: 6
            }
          })
        },
        highFromGroundLevel: {
          ...getTextField({
            label: {
              labelName: "Total Carpet Area",
              labelKey: "BPA_APPLICATION_HIGH_FROM_GROUND"
            },
            jsonPath: "scrutinyDetails.planDetail.blocks[0].building.buildingHeight",
            props: {
              disabled: 'true',
              className: "tl-trade-type"
            },
            gridDefination: {
              xs: 12,
              sm: 12,
              md: 6
            }
          })
        },
      })

    }
  }
});
