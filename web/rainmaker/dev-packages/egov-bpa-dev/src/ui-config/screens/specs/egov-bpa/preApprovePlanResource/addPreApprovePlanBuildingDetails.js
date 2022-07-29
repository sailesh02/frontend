import {
  getLabel,
  getCommonContainer,
  getCommonCard,
  getSelectField,
  getTextField,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import store from "ui-redux/store";
import get from "lodash/get";
import { validateFields } from "egov-ui-framework/ui-utils/commons";

import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";

const floorDetails = [
  { code: "Basement", label: -1 },
  { code: "Ground", label: 0 },
  { code: "First", label: 1 },
  { code: "Second", label: 2 },
  { code: "Third", label: 3 },
  { code: "Fourth", label: 4 },
  { code: "Fifth", label: 5 },
  { code: "Sixth", label: 6 },
  { code: "Seventh", label: 7 },
  { code: "Eighth", label: 8 },
  { code: "Nineth", label: 9 },
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
      ""
    )
  );
  store.dispatch(
    handleField(
      "preapprovedplan",
      "components.popupForScrutinyDetail.children.dialogContent.children.popup.children.addPreApprovePlan.children.cardContent.children.buildingAbstractContainer.children.carpetArea",
      "props.value",
      ""
    )
  );
  store.dispatch(
    handleField(
      "preapprovedplan",
      "components.popupForScrutinyDetail.children.dialogContent.children.popup.children.addPreApprovePlan.children.cardContent.children.buildingAbstractContainer.children.floorArea",
      "props.value",
      ""
    )
  );
  store.dispatch(
    handleField(
      "preapprovedplan",
      "components.popupForScrutinyDetail.children.dialogContent.children.popup.children.addPreApprovePlan.children.cardContent.children.buildingAbstractContainer.children.floorDescription",
      "props.value",
      ""
    )
  );
  store.dispatch(
    handleField(
      "preapprovedplan",
      "components.popupForScrutinyDetail.children.dialogContent.children.popup.children.addPreApprovePlan.children.cardContent.children.buildingAbstractContainer.children.level",
      "props.value",
      ""
    )
  );
  // store.dispatch(
  //   handleField(
  //     "preapprovedplan",
  //     "components.popupForScrutinyDetail.children.dialogContent.children.popup.children.addPreApprovePlan.children.cardContent.children.buildingAbstractContainer.children.subOccupancyType",
  //     "props.value",
  //     ""
  //   )
  // );
};

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
          if (edcrDetails.blockDetail[currentIndex].hasOwnProperty("blocks")) {
            edcrDetails.blockDetail[currentIndex].blocks.push(newFloorDetails);
          } else {
            edcrDetails.blockDetail[currentIndex].blocks = newObj.blocks;
          }
          edcrDetails.blockDetail[currentIndex].titleData = newObj.titleData;
        }
      });
    }
    dispatch(prepareFinalObject("edcr", edcrDetails));
    closeAddBuildinfDetailsPopUp();
  }
};

// Configure building plan pop up fields
export const addPreApprovePlan = getCommonCard(
  {
    buildingAbstractContainer: getCommonContainer({
      // floorDescription: getTextField({
      //   label: {
      //     labelName: "Floor Description",
      //     labelKey: "PREAPPROVE_FLOOR_DESCRIPTION",
      //   },
      //   errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      //   jsonPath: "blockDetail.floorDescription",
      //   required: true,
      //   gridDefination: {
      //     xs: 12,
      //     sm: 6,
      //     md: 6,
      //   },
      //   props: {
      //     value: ""
      //   }
      // }),
      floorDescription: getSelectField({
        label: {
          labelName: "Floor Description",
          labelKey: "PREAPPROVE_FLOOR_DESCRIPTION",
        },
        placeholder: {
          labelName: "Select Floor",
          labelKey: "PREAPPROVED_SELECT_FLOOR"
        },
        required: true,
        visible: true,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "blockDetail.floorDescription",        
        gridDefination: {
          xs: 12,
          sm: 6,
          md: 6,
        },
        data: floorDetails,
        beforeFieldChange: (action, state, dispatch) => {
          floorDetails.forEach((item)=> {
            if(item.code === action.value){
              dispatch(
                handleField(
                  "preapprovedplan",
                  "components.popupForScrutinyDetail.children.dialogContent.children.popup.children.addPreApprovePlan.children.cardContent.children.buildingAbstractContainer.children.level",
                  "props.value",
                  `${item.label}`
                )
              );
            }
          })
        }
      }),
      level: getTextField({
        label: {
          labelName: "Level",
          labelKey: "PREAPPROVE_LEVEL",
        },
        props: {
          disabled: true
        },
        pattern: "^[0-9]*$",
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "blockDetail.level",
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
        pattern: "^[0-9]*$",
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
        pattern: "^[0-9]*$",
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
        pattern: "^[0-9]*$",
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
        pattern: "^[0-9]*$",
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
  },
  { style: { display: "flex", justifyContent: "end" } }
);