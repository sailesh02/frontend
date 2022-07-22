import {
  getCommonCard,
  getCommonContainer,
  getCommonTitle,
  getBreak,
  getLabel,
  getSelectField,
  getTextField,
  getLabelWithValue,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import store from "ui-redux/store";
import get from "lodash/get";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { validateFields } from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from "../../../../../ui-utils/api";
import { getLoggedinUserRole } from "../../utils";
import { getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import jp from "jsonpath";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import { feetToMeterConversion } from "./functions";
var Time = Date.now();
const styles = {
  container: {
    display: "flex",
    minHeight: "106px",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footer: {
    display: "flex",
    justifyContent: "end",
  },
};

// Validate upload files
const validateUploadFiles = (requiredFiles) => {
  let acceptedfiles = ["image", "pdf", "png", "jpeg", "dxf"];
  const validationArr = [];
  Object.keys(requiredFiles).forEach((item) => {
    if (acceptedfiles.indexOf(item)) {
      if (item === "dxf" && requiredFiles[item] === 1) {
        validationArr.push(true);
      } else if (item === "pdf" && requiredFiles[item] === 1) {
        validationArr.push(true);
      } else if (
        (item === "png" ||
          item === "jpeg" ||
          item === "jpg" ||
          item === "image") &&
        requiredFiles[item] === 1
      ) {
        validationArr.push(true);
      } else {
        validationArr.push(false);
      }
    }
  });
  return validationArr;
};

// Preparing Document payload object by using json path library
const preparingDocumentsReview = async (state, dispatch) => {
  let documentsPreview = [];
  let requiredFiles = {};
  let isDocumentRequired = "";
  let uploadRequired = [];
  let duplicateFile = false;
  let reduxDocuments = get(
    state,
    "screenConfiguration.preparedFinalObject.bparegDocumentDetailsUploadRedux",
    {}
  );
  jp.query(reduxDocuments, "$.*").forEach((doc) => {
    isDocumentRequired = doc.isDocumentRequired;
    if (doc.documents && doc.documents.length > 0) {
      isDocumentRequired = false;
      doc.documents.forEach((docDetail) => {
        let obj = {};
        const mimeType = docDetail["fileName"].split(".")[1];
        if (requiredFiles.hasOwnProperty(mimeType)) {
          duplicateFile = true;
          return false;
        } else {
          requiredFiles[mimeType] = 1;
        }
        obj.title = getTransformedLocale(doc.documentCode);
        obj.fileName = docDetail.fileName;
        obj.fileStoreId = docDetail.fileStoreId;
        obj.fileStore = docDetail.fileStoreId;
        obj.fileUrl = docDetail.fileUrl && docDetail.fileUrl.split(",")[0];
        obj.additionalDetails = {
          uploadedBy: getLoggedinUserRole(""),
          uploadedTime: new Date().getTime(),
        };
        documentsPreview.push(obj);
      });
    }
    if (isDocumentRequired) {
      uploadRequired.push(isDocumentRequired);
    }
  });
  if (uploadRequired.indexOf(true) > -1) {
    alert("Upload all dpocumetn");
    return false;
  }
  if (duplicateFile) {
    alert("Do not duplicate document");
    return false;
  }
  const validateUpload = validateUploadFiles(requiredFiles);
  if (!(validateUpload.indexOf(false) > -1)) {
    return documentsPreview;
  } else {
    return false;
  }
};

// validate required field

const isFormValidate = (state, dispatch) => {
  let isFormValid = false;
  isFormValid = validateFields(
    "components.div.children.showPreApprovedTab.children.showSearchScreens.props.tabs[1].tabContent.addPreApprovedPlanDetails.children.plotDetails.children.cardContent.children.plotDetailsContainer.children",
    state,
    dispatch,
    "preapprovedplan"
  );
  isFormValid = validateFields(
    "components.div.children.showPreApprovedTab.children.showSearchScreens.props.tabs[1].tabContent.addPreApprovedPlanDetails.children.buildingAbstract.children.cardContent.children.buildingAbstractContainer.children",
    state,
    dispatch,
    "preapprovedplan"
  );
  return isFormValid;
};

// Call create approve plan api to save new plan details

const createPreApprovePlan = async (state, dispatch) => {
  const isFormValid = isFormValidate(state, dispatch);
  if (isFormValid) {
    const plotDetails = get(
      state.screenConfiguration.preparedFinalObject,
      "plotDetails"
    );
    const buildingAbstract = get(
      state.screenConfiguration.preparedFinalObject,
      "buildingAbstract"
    );
    const edcrDetails = get(
      state.screenConfiguration.preparedFinalObject,
      "edcr"
    );
    const preapprovedPlan = [];
    const requiredNOCs = [];
    const preApprovePlanDetails = {
      tenantId: getTenantId(),
      plotLength: plotDetails.lengthInMt,
      plotWidth: plotDetails.widthInMt,
      roadWidth: plotDetails.abuttingRoadWidthInMt,
      active: false,
      floorDescription: `G+${buildingAbstract.totalFloorNo}`
    };
    // Drawing Details Section Start
    const drawingDetail = {
      plotArea:
        parseInt(plotDetails.lengthInMt) * parseInt(plotDetails.widthInMt),
      serviceType: "NEW_CONSTRUCTION",
      applicationType: "BUILDING_PLAN_SCRUTINY",
      occupancy: "Residential",
      subOccupancy: edcrDetails.blockDetail[0].suboccupancyData,
      totalBuitUpArea: parseInt(buildingAbstract.totalBuildUpArea),
      totalCarpetArea: parseInt(buildingAbstract.totalCarpetArea)
    };
    const blocks = [];
    edcrDetails.blockDetail.forEach((item, blockDetailsindex) => {
      const obj = {};
      const floors = [];
      const building = {};
      const setBack = [];
      setBack.push({
        frontSetback: item.frontSetback,
        rearSetback: item.rearSetback,
        rightSetback: item.rightSetback,
        leftSetback: item.leftSetback
      });
      building.setBack = [...setBack];
      building.buildingHeight = item.buildingHeight;
      building.actualBuildingHeight = item.actualBuildingHeight;
      item.blocks.forEach((block, index) => {
        const occupancies = [];
        const newObj = {};
        newObj.floorArea = block["Floor Area"];
        newObj.builtUpArea = block["Buildup Area"];
        newObj.carpetArea = block["Carpet Area"];
        newObj.floorNo = block["Level"];
        newObj.floorName = block["Floor Description"];
        newObj.floorHeight = block["Floor Height"];
        floors.push({ ...newObj });
        building.floors = [...floors];
       
        obj.building = { ...building };
        if (blocks[blockDetailsindex]) {
          blocks[blockDetailsindex].building.floors.push({
            ...newObj
          });
          blocks[blockDetailsindex].building["totalFloors"] =
            blocks[blockDetailsindex].building.floors.length;
        } else {
          blocks.push({ ...obj });
          blocks[blockDetailsindex].building["totalFloors"] =
            obj.building.floors.length;
        }
      });
    });

    drawingDetail.blocks = blocks;
    drawingDetail.requiredNOCs = requiredNOCs;

    // Drawing Details Section End

    // Audit Details Section
    const auditDetails = {
      createdBy: JSON.parse(getUserInfo()).id,
      lastModifiedBy: JSON.parse(getUserInfo()).id,
      createdTime: Time,
      lastModifiedTime: Time,
    };

    // Documents section
    const documents = await preparingDocumentsReview(state, dispatch);

    preApprovePlanDetails.drawingDetail = drawingDetail;
    preApprovePlanDetails.auditDetails = auditDetails;
    if (documents) {
      preApprovePlanDetails.documents = documents;
    } else {
      alert("Please upload all required documents");
      return false;
    }
    preapprovedPlan.push(preApprovePlanDetails);
    let queryObject = {
      preapprovedPlan: preApprovePlanDetails,
    };

    try {
      const response = await httpRequest(
        "post",
        "/bpa-services/v1/preapprovedplan/_create",
        "_search",
        [],
        queryObject
      );
    } catch (err) {
      console.log(err);
    }
  }
};

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
      pattern: "^[0-9]*$",
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
      pattern: "^[0-9]*$",
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
      pattern: "^[0-9]*$",
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
      pattern: "^[0-9]*$",
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
      pattern: "^[0-9]*$",
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
      pattern: "^[0-9]*$",
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "plotDetails.abuttingRoadWidthInMt",
      required: true,
      gridDefination: {
        xs: 12,
        sm: 6,
        md: 6,
      },
    }),
    frontSetBackInMt: getTextField({
      label: {
        labelName: "Front set back(in m.)",
        labelKey: "PREAPPROVE_FRONT_SET_BACK",
      },
      pattern: "^[0-9]*$",
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "plotDetails.frontSetBackInMt",
      required: true,
      gridDefination: {
        xs: 12,
        sm: 6,
        md: 6,
      },
    }),
    rearSetBackInMt: getTextField({
      label: {
        labelName: "Rear set back(in m.)",
        labelKey: "PREAPPROVE_REAR_SET_BACK",
      },
      pattern: "^[0-9]*$",
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      required: true,
      jsonPath: "plotDetails.rearSetBackInMt",
      gridDefination: {
        xs: 12,
        sm: 6,
        md: 6,
      },
    }),
    rightSetBackInMt: getTextField({
      label: {
        labelName: "Right set back(in m.)",
        labelKey: "PREAPPROVE_RIGHT_SET_BACK",
      },
      pattern: "^[0-9]*$",
      jsonPath: "plotDetails.rightSetBackInMt",
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      required: true,
      gridDefination: {
        xs: 12,
        sm: 6,
        md: 6,
      },
    }),
    leftSetBackInMt: getTextField({
      label: {
        labelName: "Left set back(in m.)",
        labelKey: "PREAPPROVE_LEFT_SET_BACK",
      },
      pattern: "^[0-9]*$",
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "plotDetails.leftSetBackInMt",
      required: true,
      gridDefination: {
        xs: 12,
        sm: 6,
        md: 6,
      },
    }),
  }),
});

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
      pattern: "^[0-9]*$",
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "buildingAbstract.totalBuildUpArea",
      required: true,
      gridDefination: {
        xs: 12,
        sm: 6,
        md: 6,
      },
    }),
    totalCarpetArea: getTextField({
      label: {
        labelName: "Total carpet Area",
        labelKey: "PREAPPROVE_TOTAL_CARPET_AREA",
      },
      pattern: "^[0-9]*$",
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "buildingAbstract.totalCarpetArea",
      required: true,
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
      iconObj: {
        label: "G+1 ",
        position: "start",
      },
      jsonPath: "buildingAbstract.totalFloorNo",
      required: true,
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      gridDefination: {
        xs: 12,
        sm: 6,
        md: 6,
      },
    }),
    totalFar: getTextField({
      label: {
        labelName: "Total FAR",
        labelKey: "PREAPPROVE_TOTAL_FAR",
      },
      pattern: "^[0-9]*$",
      jsonPath: "buildingAbstract.totalFar",
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      required: true,
      gridDefination: {
        xs: 12,
        sm: 6,
        md: 6,
      },
    }),
  }),
});

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
    subOccupancyType: {
      uiFramework: "custom-containers-local",
      moduleName: "egov-bpa",
      componentPath: "AutosuggestContainer",
      props: {
        label: {
          labelName: "Sub Occupancy Type",
          labelKey: "BPA_SUB_OCCUP_TYPE_LABEL",
        },
        placeholder: {
          labelName: "Select Sub Occupancy Type",
          labelKey: "BPA_SUB_OCCUP_TYPE_PLACEHOLDER",
        },
        localePrefix: {
          moduleName: "BPA",
          masterName: "SUBOCCUPANCYTYPE",
        },
        required: true,
        labelsFromLocalisation: true,
        // isClearable: true,
        jsonPath: "edcr.blockDetail[0].suboccupancyData",
        sourceJsonPath: "applyScreenMdmsData.BPA.SubOccupancyType",
        labelsFromLocalisation: true,
        isMulti: false,
      },
      required: true,
      jsonPath: "edcr.blockDetail[0].suboccupancyData",
      isMulti: false,
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6,
      },
    },
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
                required: true,
                jsonPath: "edcr.blockDetail[0].buildingHeight",
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
                required: true,
                jsonPath: "edcr.blockDetail[0].actualBuildingHeight",
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
                pattern: "^[0-9]*$",
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                required: true,
                jsonPath: "edcr.blockDetail[0].frontSetback",
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
                pattern: "^[0-9]*$",
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                required: true,
                jsonPath: "edcr.blockDetail[0].rearSetback",
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
                pattern: "^[0-9]*$",
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                required: true,
                jsonPath: "edcr.blockDetail[0].rightSetback",
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
                pattern: "^[0-9]*$",
                errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
                required: true,
                jsonPath: "edcr.blockDetail[0].leftSetback",
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
                props: {
                  className: "mymuitable",
                  jsonPath: "edcr.blockDetail[0].blocks",
                  style: { marginBottom: 20 },
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
                    rowHover: false,
                  },
                },
              },
              addButton: getCommonContainer({
                addBuildingDetails: {
                  componentPath: "Button",
                  props: {
                    variant: "contained",
                    color: "primary",
                    style: {
                      minWidth: "200px",
                      height: "48px",
                      marginRight: "45px",
                      marginTop: "20px",
                    },
                  },
                  children: {
                    nextButtonLabel: getLabel({
                      labelName: "Add Data",
                      labelKey: "PREAPPROVE_ADD_DETAILS",
                    }),
                  },
                  onClickDefination: {
                    action: "condition",
                    callBack: openAddBuildinfDetailsPopUp,
                  },
                },
              }),
              
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

// Configuration of upload document section
export const uploadDocuments = {
  uiFramework: "custom-containers-local",
  moduleName: "egov-bpa",
  componentPath: "PreApproveDocumentListContainer",
  props: {
    buttonLabel: {
      labelName: "UPLOAD FILE",
      labelKey: "PREAPPROVE_PLAN_UPLOAD_FILE",
    },
    inputProps: {
      accept: "image/*, .pdf, .png, .jpeg",
      formatProps: {
        accept: "image/*, .pdf, .png, .jpeg",
      },
      multiple: false,
      maxFileSize: 5000,
    },
    maxFileSize: 5000,
  },
  type: "array",

};

// Configuration of footer section
export const footer = getCommonCard({
  footerButton: getCommonContainer(
    {
      clearForm: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            minWidth: "200px",
            height: "48px",
            marginRight: "45px",
          },
        },
        children: {
          nextButtonLabel: getLabel({
            labelName: "CLEAR FORM",
            labelKey: "PREAPPROVE_CLEAR_FORM",
          }),
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            preparingDocumentsReview(state, dispatch);
          },
        },
      },
      addPreApprovedPlan: {
        componentPath: "Button",
        props: {
          variant: "contained",
          color: "primary",
          style: {
            minWidth: "200px",
            height: "48px",
            marginRight: "45px",
          },
        },
        children: {
          submitButtonLabel: getLabel({
            labelName: "ADD PRE-APPROVED PLAN",
            labelKey: "PREAPPROVE_ADD_PREAPPROVE_PLAN",
          }),
        },
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            createPreApprovePlan(state, dispatch);
          },
        },
        visible: true,
      },
    },
    { style: styles.footer }
  ),
});

// Object contains the all above section and generating add pre approved tab content
export const addPreApprovedPlanDetails = {
  uiFramework: "custom-atoms",
  componentPath: "Form",

  props: {
    id: "apply_form2",
  },
  children: {
    plotDetails,
    buildingAbstract,
    proposedBuildingDetails,
    uploadDocuments,
    footer,
  },
};