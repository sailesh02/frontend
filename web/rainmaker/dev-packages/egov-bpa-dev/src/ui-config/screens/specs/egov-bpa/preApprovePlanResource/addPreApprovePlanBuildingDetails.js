import {
  getLabel,
  getCommonContainer,
  getCommonCard,
  getSelectField,
  getTextField,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import store from "ui-redux/store";
import { v4 as uuid } from 'uuid';
import get from "lodash/get";
import { validateFields } from "egov-ui-framework/ui-utils/commons";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";

import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";

const levelOptions = [
  { label: "Basement", code: "-1" },
  { label: "Ground", code: "0" },
  { label: "First", code: "1" },
  { label: "Second", code: "2" },
  { label: "Third", code: "3" },
  { label: "Fourth", code: "4" },
  { label: "Fifth", code: "5" },
  { label: "Sixth", code: "6" },
  { label: "Seventh", code: "7" },
  { label: "Eighth", code: "8" },
  { label: "Nineth", code: "9" },
];
let floorDescriptioin = [];
const floorDetails = [
  { code: "Basement", label: "-1" },
  { code: "Ground", label: "0" },
  { code: "First", label: "1" },
  { code: "Second", label: "2" },
  { code: "Third", label: "3" },
  { code: "Fourth", label: "4" },
  { code: "Fifth", label: "5" },
  { code: "Sixth", label: "6" },
  { code: "Seventh", label: "7" },
  { code: "Eighth", label: "8" },
  { code: "Nineth", label: "9" },
]

const editBuildingDetails = (state, dispatch, type) => {
  const edcrDetails = get(
    state.screenConfiguration.preparedFinalObject,
    "edcr"
  );
  const blockDetail = get(
    state.screenConfiguration.preparedFinalObject,
    "blockDetail"
  );
  const row = get(
    state.screenConfiguration.preparedFinalObject,
    "row"
  );
  const rowIndex = get(
    state.screenConfiguration.preparedFinalObject,
    "row.index"
  );
  const newFloorDetails = {
    "Floor Description": blockDetail.floorDescription,
    Level: blockDetail.level,
    "Buildup Area": blockDetail.buildUpArea,
    "Floor Area": blockDetail.carpetArea,
    "Carpet Area": blockDetail.floorArea,
    "Floor Height": blockDetail.floorHeight,
    "Block": row[0]
    
  };
  let basementAvailable = edcrDetails.blockDetail[
    row[0]
  ].blocks.filter((item) => item["Floor Description"] == "Basement");
  let isFloorDEscriptionAvailable = edcrDetails.blockDetail[
    row[0]
  ].blocks.find((item) => item["Level"] == newFloorDetails["Level"]);
  // Basement floor description validation
  if (
    basementAvailable &&
    basementAvailable.length > 0 &&
    newFloorDetails["Floor Description"] == "Basement"
  ) {
    newFloorDetails["Level"] = -basementAvailable.length - 1;
  }
  if (
    isFloorDEscriptionAvailable &&
    newFloorDetails["Floor Description"] != "Basement"
  ) {
    dispatch(
      toggleSnackbar(
        true,
        {
          labelName: "Same Floor Description is available",
          labelKey: "PREAPPROVE_SAME_DESCRIPTION_MESSAGE",
        },
        "warning"
      )
    );
    closeAddBuildinfDetailsPopUp();
    return false;
  } else {
    // Duplicate validation
    let previousLevelAvlbl;
    if (
      newFloorDetails["Floor Description"] != "Basement" &&
      newFloorDetails["Floor Description"] != "Ground"
    ) {
      previousLevelAvlbl = edcrDetails.blockDetail[row[0]].blocks.some(
        (item) => item["Level"] == parseInt(newFloorDetails["Level"]) - 1
      );
      if (!previousLevelAvlbl) {
        dispatch(
          toggleSnackbar(
            true,
            {
              labelName:
                "Please select floor description in sequence e.g Ground,First,Second....",
              labelKey: "PREAPPROVE_DESCRIPTION_SEQUENCE_MESSAGE",
            },
            "warning"
          )
        );
        closeAddBuildinfDetailsPopUp();
        return false;
      }
    }
    if(edcrDetails && edcrDetails.blockDetail && edcrDetails.blockDetail[row[0]].blocks && edcrDetails.blockDetail[row[0]].blocks.length>0){
      edcrDetails.blockDetail[row[0]].blocks.splice(rowIndex.rowIndex,1)
    }
    edcrDetails.blockDetail[row[0]].blocks.push({...newFloorDetails})
  }  
  dispatch(prepareFinalObject("edcr", edcrDetails));
  addBuildingAbstractValue(state, dispatch, type);
  closeAddBuildinfDetailsPopUp();
};

const deleteBuildingDetails = (state, dispatch, type) => {
  const edcrDetails = get(
    state.screenConfiguration.preparedFinalObject,
    "edcr"
  );
  const blockDetail = get(
    state.screenConfiguration.preparedFinalObject,
    "blockDetail"
  );
  const row = get(
    state.screenConfiguration.preparedFinalObject,
    "row"
  );
  const rowIndex = get(
    state.screenConfiguration.preparedFinalObject,
    "row.index"
  );
  let basementAvailable = edcrDetails.blockDetail[
    row[0]
  ].blocks.filter((item) => item["Floor Description"] == "Basement");
  
  
  if(edcrDetails && edcrDetails.blockDetail && edcrDetails.blockDetail[row[0]].blocks && edcrDetails.blockDetail[row[0]].blocks.length>0){
    edcrDetails.blockDetail[row[0]].blocks.splice(rowIndex.rowIndex,1)
  }
  // Basement floor description validation
  if (
    basementAvailable &&
    basementAvailable.length > 0 &&
    row[1] == "Basement"
  ) {
    // Todo list
    let level = 0
    for(let i =0;i<edcrDetails.blockDetail[row[0]].blocks.length;i++){
      if(edcrDetails.blockDetail[row[0]].blocks[i]["Floor Description"] == "Basement"){
        level -= 1;
        edcrDetails.blockDetail[row[0]].blocks[i]["Level"] = level
      }
    }
  }
  dispatch(prepareFinalObject("edcr", edcrDetails));
  addBuildingAbstractValue(state, dispatch, type);
  closeAddBuildinfDetailsPopUp();
};

const checkFloorSequence = (arr) => {
  const differenceAry = arr.slice(1).map(function (n, i) {
    return n - arr[i];
  });
  const isDifference = differenceAry.every((value) => value == 1);
  return isDifference
}
const commonFloorDetails = [
  { code: "Service", label: "service" },
  { code: "Stilt", label: "stilt" },
];
// Close the add building details pop up and reset the form
const closeAddBuildinfDetailsPopUp = () => {
  store.dispatch(
    handleField(
      "preapprovedplan",
      "components.popupForScrutinyDetail.props",
      "open",
      false
    )
  );
  store.dispatch(
    handleField(
      "preapprovedplan",
      "components.popupForScrutinyDetail.children.dialogContent.children.popup.children.addPreApprovePlan.children.cardContent.children.buildingAbstractContainer.children.buildUpArea",
      "props.value",
      " "
    )
  );
  store.dispatch(
    handleField(
      "preapprovedplan",
      "components.popupForScrutinyDetail.children.dialogContent.children.popup.children.addPreApprovePlan.children.cardContent.children.buildingAbstractContainer.children.carpetArea",
      "props.value",
      " "
    )
  );
  store.dispatch(
    handleField(
      "preapprovedplan",
      "components.popupForScrutinyDetail.children.dialogContent.children.popup.children.addPreApprovePlan.children.cardContent.children.buildingAbstractContainer.children.floorArea",
      "props.value",
      " "
    )
  );
  store.dispatch(
    handleField(
      "preapprovedplan",
      "components.popupForScrutinyDetail.children.dialogContent.children.popup.children.addPreApprovePlan.children.cardContent.children.buildingAbstractContainer.children.floorDescription",
      "props.value",
      " "
    )
  );
  store.dispatch(
    handleField(
      "preapprovedplan",
      "components.popupForScrutinyDetail.children.dialogContent.children.popup.children.addPreApprovePlan.children.cardContent.children.buildingAbstractContainer.children.level",
      "props.value",
      " "
    )
  );
  store.dispatch(
    handleField(
      "preapprovedplan",
      "components.popupForScrutinyDetail.children.dialogContent.children.popup.children.addPreApprovePlan.children.cardContent.children.buildingAbstractContainer.children.floorHeight",
      "props.value",
      " "
    )
  );
};

// Add buidlingabstract values
const addBuildingAbstractValue = () => {
  let state = store.getState();
  const edcrDetails = get(
    state.screenConfiguration.preparedFinalObject,
    "edcr"
  );
  const plotDetails = get(
    state.screenConfiguration.preparedFinalObject,
    "plotDetails"
  );
  let calculateObj = {
    buildUpArea: 0,
    carpetArea: 0,
    floorArea: 0,
    totalFloor: 0,
    totalFar: 0
  };
  if(edcrDetails.blockDetail && edcrDetails.blockDetail.length> 0){
    for (let edcrdtls of edcrDetails.blockDetail) {
      if(edcrdtls.blocks && edcrdtls.blocks.length> 0){
        for (let blocks of edcrdtls.blocks) {
          calculateObj.buildUpArea += parseFloat(blocks["Buildup Area"]);
          calculateObj.carpetArea += parseFloat(blocks["Carpet Area"]);
          calculateObj.floorArea += parseFloat(blocks["Floor Area"]);
          calculateObj.totalFloor += 1;
        }
      }
      
    }
    calculateObj.totalFar = parseFloat(calculateObj.floorArea) / parseFloat(plotDetails.plotAreaInSqrMt)
    //calculateObj.totalFar = //calculateObj.floorArea / totalPlotArea;
    store.dispatch(
      handleField(
        "preapprovedplan",
        "components.div.children.showPreApprovedTab.children.showSearchScreens.props.tabs[1].tabContent.addPreApprovedPlanDetails.children.buildingAbstract.children.cardContent.children.buildingAbstractContainer.children.totalBuildUpArea",
        "props.value",
        calculateObj.buildUpArea.toFixed(2)
      )
    );
    store.dispatch(
      handleField(
        "preapprovedplan",
        "components.div.children.showPreApprovedTab.children.showSearchScreens.props.tabs[1].tabContent.addPreApprovedPlanDetails.children.buildingAbstract.children.cardContent.children.buildingAbstractContainer.children.totalCarpetArea",
        "props.value",
        calculateObj.carpetArea.toFixed(2)
      )
    );
    store.dispatch(
      handleField(
        "preapprovedplan",
        "components.div.children.showPreApprovedTab.children.showSearchScreens.props.tabs[1].tabContent.addPreApprovedPlanDetails.children.buildingAbstract.children.cardContent.children.buildingAbstractContainer.children.totalFar",
        "props.value",
        calculateObj.totalFar.toFixed(2)
      )
    );
    store.dispatch(
      handleField(
        "preapprovedplan",
        "components.div.children.showPreApprovedTab.children.showSearchScreens.props.tabs[1].tabContent.addPreApprovedPlanDetails.children.buildingAbstract.children.cardContent.children.buildingAbstractContainer.children.totalFloorArea",
        "props.value",
        calculateObj.floorArea.toFixed(2)
      )
    );
    store.dispatch(
      handleField(
        "preapprovedplan",
        "components.div.children.showPreApprovedTab.children.showSearchScreens.props.tabs[1].tabContent.addPreApprovedPlanDetails.children.buildingAbstract.children.cardContent.children.buildingAbstractContainer.children.totalFloorNo",        "props.value",
        calculateObj.totalFloor
      )
    );
  }
}

// Add building details and mapping the entered data to application state 
// validating input fields 

const addBuildingDetails = async (state, dispatch, type) => {
  let isFormValid = false;
  isFormValid = validateFields(
    "components.popupForScrutinyDetail.children.dialogContent.children.popup.children.addPreApprovePlan.children.cardContent.children.buildingAbstractContainer.children",
    state,
    dispatch,
    "preapprovedplan"
  );
  if (isFormValid) {
    const blockDetail = get(
      state.screenConfiguration.preparedFinalObject,
      "blockDetail"
    );
    const currentIndex = get(
      state.screenConfiguration.preparedFinalObject,
      "edcr.currentIndex"
    );
    const edcrDetails = get(
      state.screenConfiguration.preparedFinalObject,
      "edcr"
    );
    const newFloorDetails = {
      "Floor Description": blockDetail.floorDescription,
      Level: blockDetail.level,
      //"Occupancy/Sub Occupancy": "",
      "Buildup Area": blockDetail.buildUpArea,
      "Floor Area": blockDetail.carpetArea,
      "Carpet Area": blockDetail.floorArea,
      "Floor Height": blockDetail.floorHeight,
      // "Id": uuid(),
      "Block": currentIndex
      
    };
    if (edcrDetails.blockDetail.length > 0) {
      edcrDetails.blockDetail.forEach((element, index) => {
        if (currentIndex === index.toString()) {
          const newObj = {
            blocks: [],
            suboccupancyData: { label: "", value: "" },
            titleData: "",
            floorNo: "",
          };
          newObj.blocks.push(newFloorDetails);
          newObj.titleData = `Block ${parseInt(currentIndex) + 1}`;
          newObj.floorNo = newFloorDetails.Level;
          // Duplicate validation
          let previousLevelAvlbl;
          if (
            newFloorDetails["Floor Description"] != "Basement" &&
            newFloorDetails["Floor Description"] != "Ground"
          ) {
            if(!edcrDetails.blockDetail[currentIndex].hasOwnProperty("blocks")){
              if(parseInt(newFloorDetails["Level"]) - 1 >= 0){
                dispatch(
                  toggleSnackbar(
                    true,
                    {
                      labelName:
                        "Please select floor description in sequence e.g Ground,First,Second....",
                      labelKey: "PREAPPROVE_DESCRIPTION_SEQUENCE_MESSAGE",
                    },
                    "warning"
                  )
                );
                closeAddBuildinfDetailsPopUp();
                return false;
              }
            } else {
              previousLevelAvlbl = edcrDetails.blockDetail[
                currentIndex
              ].blocks.some(
                (item) =>
                  item["Level"] == parseInt(newFloorDetails["Level"]) - 1
              );
              if (!previousLevelAvlbl) {
                dispatch(
                  toggleSnackbar(
                    true,
                    {
                      labelName:
                        "Please select floor description in sequence e.g Ground,First,Second....",
                      labelKey: "PREAPPROVE_DESCRIPTION_SEQUENCE_MESSAGE",
                    },
                    "warning"
                  )
                );
                closeAddBuildinfDetailsPopUp();
                return false;
              }
            }
            
          }
          if (edcrDetails.blockDetail[currentIndex].hasOwnProperty("blocks")) {
            let basementAvailable = edcrDetails.blockDetail[
              currentIndex
            ].blocks.filter((item) => item["Floor Description"] == "Basement");
            let isFloorDEscriptionAvailable = edcrDetails.blockDetail[
              currentIndex
            ].blocks.find((item) => item["Level"] == newFloorDetails["Level"]);
            

            // Basement floor description validation
            if (
              basementAvailable &&
              basementAvailable.length > 0 &&
              newFloorDetails["Floor Description"] == "Basement"
            ) {
              newFloorDetails["Level"] = -basementAvailable.length - 1;
            }
            // Floor description validation except basement
            if (
              isFloorDEscriptionAvailable &&
              newFloorDetails["Floor Description"] != "Basement"
            ) {
              dispatch(
                toggleSnackbar(
                  true,
                  {
                    labelName: "Same Floor Description is available",
                    labelKey: "PREAPPROVE_SAME_DESCRIPTION_MESSAGE",
                  },
                  "warning"
                )
              );
              closeAddBuildinfDetailsPopUp();
              return false;
            } else {
              edcrDetails.blockDetail[currentIndex].blocks.push(
                newFloorDetails
              );
            }
          } else {
            edcrDetails.blockDetail[currentIndex].blocks = newObj.blocks;
          }
          edcrDetails.blockDetail[currentIndex].titleData = newObj.titleData;
        }
      });
    }
    dispatch(prepareFinalObject("edcr", edcrDetails));
    addBuildingAbstractValue(state, dispatch, type);
    closeAddBuildinfDetailsPopUp();
  }
};

// Configure building plan pop up fields
export const addPreApprovePlan = getCommonCard(
  {
    buildingAbstractContainer: getCommonContainer({
      
      level: getSelectField({
        label: {
          labelName: "Level",
          labelKey: "PREAPPROVE_LEVEL",
        },
        placeholder: {
          labelName: "Select Level",
          labelKey: "PREAPPROVED_SELECT_LEVEL"
        },
        required: true,
        visible: true,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "blockDetail.level",        
        gridDefination: {
          xs: 12,
          sm: 6,
          md: 6,
        },
        data: levelOptions,
        beforeFieldChange: (action, state, dispatch) => {
          let path = action.componentJsonpath.replace(
            /.level$/,
            ".floorDescription"
          );
          if(action.value<0) {
            floorDescriptioin = [{ code: "Basement", label: -1 }]
          }
          else {
            let selectedLevel = floorDetails.filter(item=>item.label === action.value);
            floorDescriptioin = [...commonFloorDetails,...selectedLevel];            
          }
          dispatch(handleField("preapprovedplan", path, "props.data", floorDescriptioin));

        }
      }),
      floorDescription: getSelectField({
        label: {
          labelName: "Floor Description",
          labelKey: "PREAPPROVE_FLOOR_DESCRIPTION",
        },
        placeholder: {
          labelName: "Select Floor Description",
          labelKey: "PREAPPROVED_SELECT_FLOOR_DESCRIPTION"
        },
        props: {
          className: "preapprove-floor-details"
        },
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "blockDetail.floorDescription",
        required: true,
        gridDefination: {
          xs: 12,
          sm: 6,
          md: 6,
        },
      }),
      buildUpArea: getTextField({
        label: {
          labelName: "Build up Area",
          labelKey: "PREAPPROVE_BUILT_UP_AREA",
        },
        pattern: "^(?=.)([+-]?([0-9]*)(.([0-9]+))?)$",
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "blockDetail.buildUpArea",
        required: true,
        gridDefination: {
          xs: 12,
          sm: 6,
          md: 6,
        },
      }),
      floorArea: getTextField({
        label: {
          labelName: "Floor Area",
          labelKey: "PREAPPROVE__FLOOR_AREA",
        },
        pattern: "^(?=.)([+-]?([0-9]*)(.([0-9]+))?)$",
        jsonPath: "blockDetail.floorArea",
        required: true,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        gridDefination: {
          xs: 12,
          sm: 6,
          md: 6,
        },
      }),
      carpetArea: getTextField({
        label: {
          labelName: "Carpet Area",
          labelKey: "PREAPPROVE_CARPET_AREA",
        },
        pattern: "^(?=.)([+-]?([0-9]*)(.([0-9]+))?)$",
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        required: true,
        jsonPath: "blockDetail.carpetArea",
        gridDefination: {
          xs: 12,
          sm: 6,
          md: 6,
        },
      }),
      floorHeight: getTextField({
        label: {
          labelName: "Floor Height",
          labelKey: "PREAPPROVE_FLOOR_HEIGHT",
        },
        pattern: "^(?=.)([+-]?([0-9]*)(.([0-9]+))?)$",
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        required: true,
        jsonPath: "blockDetail.floorHeight",
        gridDefination: {
          xs: 12,
          sm: 6,
          md: 6,
        },
      })
    }),
  },
  {
    style: {
      width: "100%",
    },
  }
);

// configure building plan footer section
export const addBuildingPlanDialogFooter = getCommonContainer(
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
          marginTop: "20px"
        },
      },
      children: {
        nextButtonLabel: getLabel({
          labelName: "CANCEL",
          labelKey: "PREAPPROVE_CANCEL",
        }),
      },
      onClickDefination: {
        action: "condition",
        callBack: closeAddBuildinfDetailsPopUp,
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
          marginTop: "20px"
        },
      },
      children: {
        submitButtonLabel: getLabel({
          labelName: "ADD BUILDING DETAILS",
          labelKey: "PREAPPROVE_ADD_BUILDING_DETAILS",
        }),
      },
      onClickDefination: {
        action: "condition",
        callBack: addBuildingDetails,
      },
      visible: true,
    },
    EditPreApprovedPlan: {
      componentPath: "Button",
      props: {
        variant: "contained",
        color: "primary",
        style: {
          minWidth: "200px",
          height: "48px",
          marginRight: "45px",
          marginTop: "20px"
        },
      },
      children: {
        submitButtonLabel: getLabel({
          labelName: "EDIT BUILDING DETAILS",
          labelKey: "PREAPPROVE_EDIT_BUILDING_DETAILS",
        }),
      },
      onClickDefination: {
        action: "condition",
        callBack: editBuildingDetails,
      },
      visible: false,
    },
    deletePreApprovedPlan: {
      componentPath: "Button",
      props: {
        variant: "contained",
        color: "primary",
        style: {
          minWidth: "200px",
          height: "48px",
          marginRight: "45px",
          marginTop: "20px"
        },
      },
      children: {
        submitButtonLabel: getLabel({
          labelName: "DELETE BUILDING DETAILS",
          labelKey: "PREAPPROVE_DELETE_BUILDING_DETAILS",
        }),
      },
      onClickDefination: {
        action: "condition",
        callBack: deleteBuildingDetails,
      },
      visible: false,
    },
  },
  { style: { display: "flex", justifyContent: "end" } }
);