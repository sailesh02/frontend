import {
  getCommonCard,
  getTextField,
  getSelectField,
  getCommonContainer,
  getCommonHeader,
  getPattern,
  getLabel,
  getCommonCaption,
  getCommonValue,
  getCommonParagraph,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import plotDetails from "egov-ui-kit/assets/images/plotDetails.png";
import { getFileUrlFromAPI } from "egov-ui-framework/ui-utils/commons";

import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { httpRequest } from "egov-ui-framework/ui-utils/api.js";
import store from "ui-redux/store";
//import { fetchMDMSData, setValuesForRework } from "./functions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { validateFields } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { downloadDocuments } from "./preApprovePlanResource/document";
import { generatePreapproveBill } from "../utils";
import { FALSE } from "node-sass";

// Reset fields and refresh page
const resetFields = () => {
  location.reload();
  return false;
}
//   Redirect to apply page
const getRedirectionBPAURL = (state, dispatch) => {
  let drawingAppNo = get(
    state.screenConfiguration.preparedFinalObject,
    "Scrutiny[1].preApprove.selectedPlot.drawingNo"
  );
  let tenantId = get(
    state.screenConfiguration.preparedFinalObject,
    "Scrutiny[1].preApprove.selectedPlot.tenantId"
  );
  if (!drawingAppNo) {
    return false;
  }
  let url = `/pre-approved/preApprovedPlanApply?drawingAppNo=${drawingAppNo}&tenantId=${tenantId}`;
  dispatch(setRoute(url));
};
// form validation
const formValid = (state, dispatch) => {
  let isFormValid = false;
  isFormValid = validateFields(
    "components.div.children.buildingInfoCard.children.cardContent.children.buildingPlanCardContainer.children.inputdetails.children.preApprovedPlanSection.children.preApproveContent.children",
    state,
    dispatch,
    "preApprovedPlanDetails"
  );
  return isFormValid;
};

const getFileUrl = async (preApprovedPlanList) => {
  for (let item of preApprovedPlanList.preapprovedPlan) {
    for (let document of item.documents) {
      if (
        document.additionalDetails.title == "PREAPPROVE_BUILDING_PLAN_IMAGE"
      ) {
        const fileUrls = await getFileUrlFromAPI(document.fileStoreId);
        document.fileUrl = fileUrls[document.fileStoreId].split(",")[0];
      }
    }
  }
  return preApprovedPlanList;
};

const setDrawingData = async (preApprovedPlanList) => {
  const preapprove = await getFileUrl(preApprovedPlanList);
  
  return preapprove;
};

const handleEligibilityCheckStatus = () => {
  let url = "/edcrscrutiny/apply"
  store.dispatch(setRoute(url));
};

const checkEligibility = (label, value, props = {}) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Href",
    gridDefination: {
      xs: 12,
      sm: 6
    },
    visible: false,
    style: {
      cursor: "pointer",
      color: "blue"
    },
    props: {
      disabled: true,
      onClick: handleEligibilityCheckStatus,
      style: {
        cursor: "pointer",
        color: "blue"
      },
      ...props,
    },
    children: {
      label: getCommonCaption(label),
      value: getCommonValue(value),
    },
  };
};

// get search preapproves list
const getPreApproveList = async (state, dispatch) => {
  let validate = formValid(state, dispatch);
  if (validate) {
    let plotDetails = get(
      state,
      "screenConfiguration.preparedFinalObject.Scrutiny[1].preApprove.plotDetails",
      {}
    );
    try {
      const response = await httpRequest(
        "post",
        `/bpa-services/v1/preapprovedplan/_search?plotLengthInFeet=${plotDetails.lengthInFt}&plotWidthInFeet=${plotDetails.widthInFt}&roadWidth=${plotDetails.abuttingRoadWidthInMt}&active=true`,
        "_search",
        []
      );
      const preApprovedPlanList = await response;

      if (preApprovedPlanList) {
        setDrawingData(preApprovedPlanList).then((res) => {
          if (res && res.preapprovedPlan && res.preapprovedPlan.length > 0) {
            const list = res.preapprovedPlan.map((item, index) => {
              item.selected = false;
              return item;
            });
            dispatch(prepareFinalObject("preapprovePlanList", list));
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
};

//for displaying note in entire grid
const getLabelWithValueNote = (label, value, props = {}) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    gridDefination: {
      xs: 12,
      sm: 12,
    },
    props: {
      style: {
        marginBottom: "20px",
        textAlign: "justify",
      },
      ...props,
    },
    children: {
      label: getCommonCaption(label),
      value: getCommonValue(value),
    },
  };
};

const onHrefClick = () => {
  window.open("https://bhubaneswarone.in/home/", "_blank");
};

const getNoteLink = (label, value, props = {}) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Href",
    gridDefination: {
      xs: 12,
      sm: 12,
    },
    props: {
      onClick: onHrefClick,
      style: {
        marginTop: "12px",
        textAlign: "justify",
      },
      ...props,
    },
    children: {
      label: getCommonCaption(label),
      value: getCommonValue(value),
    },
  };
};

const header = getCommonHeader({
  labelName: "New Building Plan Scrutiny",
  labelKey: "BPA_SCRUTINY_TITLE",
});

export const dropdown = {
  uiFramework: "custom-containers",
  componentPath: "AutosuggestContainer",
  jsonPath: "Scrutiny[0].tenantId",
  required: true,
  props: {
    style: {
      width: "100%",
      cursor: "pointer",
    },
    label: {
      labelName: "CITY",
      labelKey: "EDCR_SCRUTINY_CITY",
    },
    placeholder: {
      labelName: "Select City",
      labelKey: "EDCR_SCRUTINY_CITY_PLACEHOLDER",
    },
    localePrefix: {
      moduleName: "TENANT",
      masterName: "TENANTS",
    },
    sourceJsonPath: "applyScreenMdmsData.tenantData",
    labelsFromLocalisation: true,
    errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
    suggestions: [],
    fullwidth: true,
    required: true,
    isClearable: true,
    inputLabelProps: {
      shrink: true,
    },
    // className: "tradelicense-mohalla-apply"
  },
  beforeFieldChange: async (action, state, dispatch) => {
    // dispatch(
    //   prepareFinalObject(
    //     "Licenses[0].tradeLicenseDetail.address.locality.name",
    //     action.value && action.value.label
    //   )
    // );
  },
  afterFieldChange: async (action, state, dispatch) => {
    if (
      action.value &&
      (action.value == "od.bhubaneswar" ||
        action.value == "od.bhubaneswardevelopmentauthority")
    ) {
      dispatch(
        handleField(
          "preApprovedPlanDetails",
          "components.div.children.noteCard",
          "visible",
          true
        )
      );
    } else {
      dispatch(
        handleField(
          "preApprovedPlanDetails",
          "components.div.children.noteCard",
          "visible",
          false
        )
      );
    }
  },
  gridDefination: {
    xs: 12,
    sm: 6,
  },
};

const offsetGrid = () => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    gridDefination: {
      xs: 6,
      sm: 6,
    },
    visible: true,
    props: {
      disabled: true,
    },
  };
};

const handleFieldAccessibility = (action,state,dispatch,disabled=false) => {
  if(disabled){
    dispatch(prepareFinalObject("preApprovedSearch.searchCall",false));
    dispatch(
      handleField(
        "preApprovedPlanDetails",
        "components.div.children.buildingInfoCard.children.cardContent.children.buildingPlanCardContainer.children.inputdetails.children.preApprovedPlanSection.children.preApproveContent.children.abuttingRoadWidthInMt",
        "visible",
        false
      )
    );
    dispatch(
      handleField(
        "preApprovedPlanDetails",
        "components.div.children.buildingInfoCard.children.cardContent.children.buildingPlanCardContainer.children.inputdetails.children.preApprovedPlanSection.children.preApproveContent.children.lngthInFt",
        "visible",
        false
      )
    );
    dispatch(
      handleField(
        "preApprovedPlanDetails",
        "components.div.children.buildingInfoCard.children.cardContent.children.buildingPlanCardContainer.children.inputdetails.children.preApprovedPlanSection.children.preApproveContent.children.widthInFt",
        "visible",
        false
      )
    );
    dispatch(
      handleField(
        "preApprovedPlanDetails",
        "components.div.children.buildingInfoCard.children.cardContent.children.buildingPlanCardContainer.children.inputdetails.children.preApprovedPlanSection.children.preApproveContent.children.link",
        "visible",
        true
      )
    );
  } else {
    dispatch(prepareFinalObject("preApprovedSearch.searchCall",true));
    dispatch(
      handleField(
        "preApprovedPlanDetails",
        "components.div.children.buildingInfoCard.children.cardContent.children.buildingPlanCardContainer.children.inputdetails.children.preApprovedPlanSection.children.preApproveContent.children.abuttingRoadWidthInMt",
        "visible",
        true
      )
    );
    dispatch(
      handleField(
        "preApprovedPlanDetails",
        "components.div.children.buildingInfoCard.children.cardContent.children.buildingPlanCardContainer.children.inputdetails.children.preApprovedPlanSection.children.preApproveContent.children.lngthInFt",
        "visible",
        true
      )
    );
    dispatch(
      handleField(
        "preApprovedPlanDetails",
        "components.div.children.buildingInfoCard.children.cardContent.children.buildingPlanCardContainer.children.inputdetails.children.preApprovedPlanSection.children.preApproveContent.children.widthInFt",
        "visible",
        true
      )
    );
    dispatch(
      handleField(
        "preApprovedPlanDetails",
        "components.div.children.buildingInfoCard.children.cardContent.children.buildingPlanCardContainer.children.inputdetails.children.preApprovedPlanSection.children.preApproveContent.children.link",
        "visible",
        false
      )
    );
  }
  
}

const preApprovedPlanSection = getCommonContainer({
  preApproveContent: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    gridDefination: {
      xs: 6,
      sm: 6,
    },
    props: {
      style: {
        marginTop: "30px",
      },
    },
    visible: true,
    children: {
      chooseLayoutType: {
        ...getSelectField({
          label: {
            labelName:
              "Whether the Plot is part of Approved layout/ Town Planning scheme/ Government Scheme ",
            labelKey: "PREAPPROVE_LAYOUT_TYPE_HEADER",
          },
          placeholder: {
            labelName: "Select Layout Type",
            labelKey: "PREAPPROVE_CHOOSE_LAYOUT_TYPE",
          },
          localePrefix: {
            moduleName: "PREAPPROVE",
            masterName: "PREAPPROVE_TYPE"
          },
          jsonPath: "Scrutiny[1].preApprove.layoutType",
          sourceJsonPath: "preApprovedSearch.confirmation",
          required: true,
          gridDefination: {
            xs: 12,
            sm: 12,
          },
          props: {
            className: "tl-trade-type",
          },
          beforeFieldChange: (action, state, dispatch) => {
            if (action.value === "NO") {
              dispatch(
                toggleSnackbar(
                  true,
                  {
                    labelName: "Please select correct Layout to proceed",
                    labelKey: "PREAPPROVE_CHOOSE_LAYOUT_TYPE_ERROR_MESSAGE",
                  },
                  "error"
                )
              );
              handleFieldAccessibility(action,state,dispatch,true)
            } else {
              handleFieldAccessibility(action,state,dispatch,false)
            }
          },
        }),
      },
      landStatus: {
        ...getSelectField({
          label: {
            labelName: "Land Status",
            labelKey: "PREAPPROVE_LAND_STATUS",
          },
          placeholder: {
            labelName: "Select Land Status",
            labelKey: "PREAPPROVE_CHOOSE_LAND_STATUS",
          },
          localePrefix: {
            moduleName: "PREAPPROVE",
            masterName: "PREAPPROVE_TYPE"
          },
          jsonPath: "Scrutiny[1].preApprove.landStatus",
          sourceJsonPath: "preApprovedSearch.landStatus",
          required: true,
          gridDefination: {
            xs: 12,
            sm: 12,
          },
          props: {
            className: "tl-trade-type",
          },
        }),
        beforeFieldChange: (action, state, dispatch) => {
          if (action.value != "VACANT") {
            dispatch(
              toggleSnackbar(
                true,
                {
                  labelName: "Please select correct Land status to proceed",
                  labelKey: "PREAPPROVE_LAND_STATUS_TYPE_ERROR_MESSAGE",
                },
                "error"
              )
            );
            handleFieldAccessibility(action,state,dispatch,true)
          } else {
            handleFieldAccessibility(action,state,dispatch,false)
          }
        },
      },
      projectComponent: {
        ...getSelectField({
          label: {
            labelName: "Project Component",
            labelKey: "PREAPPROVE_PROJECT_COMPONENT",
          },
          placeholder: {
            labelName: "Select Project",
            labelKey: "PREAPPROVE_CHOOSE_PROJECT_COMPONENT",
          },
          localePrefix: {
            moduleName: "PREAPPROVE",
            masterName: "PREAPPROVE_TYPE"
          },
          jsonPath: "Scrutiny[1].preApprove.project",
          sourceJsonPath: "preApprovedSearch.project",
          required: true,
          gridDefination: {
            xs: 12,
            sm: 12,
          },
          props: {
            className: "tl-trade-type",
          },
        }),
        beforeFieldChange: (action, state, dispatch) => {
          if (action.value === "OTHERS") {
            dispatch(
              toggleSnackbar(
                true,
                {
                  labelName: "Please select correct project component to proceed",
                  labelKey: "PREAPPROVE_PROJECT_COMPONENT_ERROR_MESSAGE",
                },
                "error"
              )
            );
            handleFieldAccessibility(action,state,dispatch,true)
          } else {
            handleFieldAccessibility(action,state,dispatch,false)
          }
        },
      },
      link: checkEligibility(
        {
          labelName: "",
          labelKey: "",
        },
        {
          jsonPath: "Note[0].link1",
        }
      ),
      lngthInFt: getTextField({
        label: {
          labelName: "Length of plot(in ft.)",
          labelKey: "PREAPPROVE_PLOT_LENGTH_IN_FT",
        },
        pattern: "^(?=.)([+-]?([0-9]*)(.([0-9]+))?)$",
        props: {
          disabled: false,
          className: "tl-trade-type",
        },
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "Scrutiny[1].preApprove.plotDetails.lengthInFt",
        required: true,
        gridDefination: {
          xs: 12,
          sm: 12,
        },
      }),
      widthInFt: getTextField({
        label: {
          labelName: "Width of plot(in ft.)",
          labelKey: "PREAPPROVE_PLOT_WITH_IN_FT",
        },
        pattern: "^(?=.)([+-]?([0-9]*)(.([0-9]+))?)$",
        props: {
          disabled: false,
          className: "tl-trade-type",
        },
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "Scrutiny[1].preApprove.plotDetails.widthInFt",
        required: true,
        gridDefination: {
          xs: 12,
          sm: 12,
        },
      }),
      abuttingRoadWidthInMt: getTextField({
        label: {
          labelName: "Abutting road width(in m.)",
          labelKey: "PREAPPROVE_ABUTTING_ROAD",
        },
        pattern: "^(?=.)([+-]?([0-9]*)(.([0-9]+))?)$",
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "Scrutiny[1].preApprove.plotDetails.abuttingRoadWidthInMt",
        required: true,
        iconObj: {
          iconName: "search",
          position: "end",
          color: "#FE7A51",
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => {
              getPreApproveList(state, dispatch);
            },
          },
        },
        gridDefination: {
          xs: 12,
          sm: 12,
        },
      }),      
    },
   
  },
  plotDiagram: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    gridDefination: {
      xs: 6,
      sm: 6,
    },
    children: {
      plotImage: {
        uiFramework: "custom-atoms-local",
        moduleName: "egov-bpa",
        componentPath: "BoxImage",
        props: {
          src: plotDetails,
          height: "300",
          width: "300",
        },
      },
    },
  },
  block: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-bpa",
    componentPath: "BlockContainer",
    props: {
      labelsFromLocalisation: true,
      jsonPath: "preapprovePlanList",
    },
    required: true,
    gridDefination: {
      xs: 6,
      sm: 6,
    },
  },
  documents: {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    gridDefination: {
      xs: 6,
      sm: 6,
    },
    
    props: {
      style: {
        marginBottom: "30px",
      },
    },
    children: {
      document: downloadDocuments
    }
  }
});

const buildingInfoCard = getCommonCard({
  buildingPlanCardContainer: getCommonContainer({
    inputdetails: getCommonContainer(
      {
        preApprovedPlanSection,
        dummyDiv2: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          gridDefination: {
            xs: 12,
            sm: 6,
          },
          visible: true,
          props: {
            disabled: true,
          },
        },
        dummyDiv1: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          gridDefination: {
            xs: 12,
            sm: 6,
          },
          visible: true,
          props: {
            disabled: true,
          },
        },
      },
      {
        style:
          getQueryArg(window.location.href, "purpose") === "REWORK"
            ? {
                "pointer-events": "none",
                cursor: "not-allowed",
                overflow: "visible",
              }
            : { overflow: "visible" },
      }
    ),
    buttonContainer: getCommonContainer({
      firstCont: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 12,
          sm: 3,
        },
      },
      resetButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 3,
          // align: "center"
        },
        props: {
          variant: "outlined",
          style: {
            color: "#FE7A51",
            // backgroundColor: "#FE7A51",
            border: "#FE7A51 solid 1px",
            borderRadius: "2px",
            width: window.innerWidth > 480 ? "80%" : "100%",
            height: "48px",
          },
        },
        children: {
          buttonLabel: getLabel({
            labelName: "CLEAR FORM",
            labelKey: "BPA_SCRUTINY_CLEARFORM_BUTTON",
          }),
        },
        onClickDefination: {
          action: "condition",
          callBack: resetFields,
        },
      },

      searchButton: {
        componentPath: "Button",
        gridDefination: {
          xs: 12,
          sm: 3,
          // align: "center"
        },
        props: {
          variant: "contained",
          style: {
            color: "white",
            backgroundColor: "#FE7A51",
            borderRadius: "2px",
            width: window.innerWidth > 480 ? "80%" : "100%",
            height: "48px",
          },
        },
        children: {
          buttonLabel: getLabel({
            labelName: "SUBMIT",
            labelKey: "PREAPPROVE_SUBMIT_BUTTON",
          }),
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            getRedirectionBPAURL(state, dispatch);
          },
        },
      },

      lastCont: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        gridDefination: {
          xs: 12,
          sm: 3,
        },
      },
    }),
  }),
});

const noteCard = getCommonCard({
  buildingPlanCardContainer: getCommonContainer({
    inputdetails: getCommonContainer({
      note: getLabelWithValueNote(
        {
          labelName: "",
          labelKey: "",
        },
        {
          jsonPath: "Note[0].message",
        }
      ),
      link: getNoteLink(
        {
          labelName: "",
          labelKey: "",
        },
        {
          jsonPath: "Note[0].link",
        }
      ),
    }),
  }),
});

const screenConfig = {
  uiFramework: "material-ui",
  name: "preApprovedPlanDetails",
  beforeInitScreen: (action, state, dispatch) => {
    const confirmation = [
      { code: "YES", label: "Yes" },
      { code: "NO", label: "No" }
    ]
    const landStatus = [
      { code: "VACANT", label: "Vacant" },
      { code: "BUILDING_CONSTRUCTED", label: "Building Constructed" },
      { code: "UNDER_CONSTRUCTION", label: "Under Construction" }
    ];
    const project = [
      { code: "RESIDENTIAL", label: "Residential" },
      { code: "OTHERS", label: "Others" },
    ];
    dispatch(prepareFinalObject("preApprovedSearch", {}));
    dispatch(prepareFinalObject("Scrutiny[0]", {}));
    dispatch(prepareFinalObject("LicensesTemp[0]", {}));
    dispatch(
      prepareFinalObject(
        "Note[0].message",
        "kindly refer to the following link to get GIS and Comprehensive Development Plan, Airports Authority of India (AAI), National Monuments Authority (NMA) and other related information."
      )
    );
    dispatch(
      prepareFinalObject("Note[0].link", "https://bhubaneswarone.in/home/")
    );
    dispatch(
      prepareFinalObject(
        "Note[0].link1",
        "PREAPPROVE_REDIRECT_TO_SCRUTINY_PAGE"
      )
    );
    dispatch(prepareFinalObject("preApprovedSearch.confirmation", confirmation));
    dispatch(prepareFinalObject("preApprovedSearch.landStatus", landStatus));
    dispatch(prepareFinalObject("preApprovedSearch.project", project));
    // fetchMDMSData(action, state, dispatch);
    // setValuesForRework(action, state, dispatch);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css",
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",

          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 6,
              },
              ...header,
            },
          },
        },
        buildingInfoCard,
        noteCard: {
          uiFramework: "custom-atoms",
          componentPath: "Container",

          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 12,
              },
              ...noteCard,
            },
          },
          visible: false,
        },
      },
    },
  },
};
export default screenConfig;
