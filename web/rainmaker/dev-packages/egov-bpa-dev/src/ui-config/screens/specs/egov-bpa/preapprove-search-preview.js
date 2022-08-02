/*
*Preapproved plan page has two section.
*User can see the preapproved plan list in Preapproved plan tab(Tab1)
*User can add the new preapproveplan details in Add preapprove plan tab(Tab2). 
*User can update the plan details in Tab1.

*@getName function used to fetch the name of user from userInfo state
*@header function is used to generate page header section.
*/
import { plotDetails } from "./preApproveSearchResource/plotDetails";
import { proposedBuildingDetails } from "./preApproveSearchResource/blockDetails";
import {buildingAbstract} from "./preApproveSearchResource/buildingAbstract";
import { uploadDocuments } from "./preApproveSearchResource/documents";
import {
  getCommonHeader,
  getCommonContainer,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-kit/utils/commons";
import { httpRequest } from "../../../../ui-utils/api";
import {getBpaTextToLocalMapping} from "../utils/preApprovePlan"

import {
  addPreApprovePlan,
  addBuildingPlanDialogFooter,
} from "./preApprovePlanResource/addPreApprovePlanBuildingDetails";
import store from "ui-redux/store";
import { CONSTANTS } from "../../../../config/common";
import get from "lodash/get";
import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getPreApproveList } from "./preApprovePlanResource/getPreApprovePlanList";
import { getMdmsData } from "./preApprovePlanResource/getMdmsData";
import { prepareDocumentsUploadData } from "./preApprovePlanResource/prepareDocumentUploadData";
import { sanctionFeeAdjustmentDetails } from "../pre-approved/preApprovedPlanResource/sanctionFeeAdjustmentDetails";

const getName = () => {
  let heading = get(store.getState().auth.userInfo, "name");
  return heading;
};
const header = getCommonHeader({
  labelName: `Welcome  ${getName()}`,
});

const getData = async (action, state, dispatch) => {
  await getMdmsData(action, state, dispatch);
};

const setDetails = async() => {
    let state = store.getState();
    const drawing = await get(state.screenConfiguration.preparedFinalObject, "drawing");
    store.dispatch("drawingDetails",drawing)
}



const getDrawingDetails = async (action, state, dispatch) => {
    const drawingNo=getQueryArg(window.location.href, "applicationNumber")
    let queryObject = {
        preapprovedPlanSearchCriteria: {
          drawingNo: drawingNo
        },
      };
      try {
        const response = await httpRequest(
          "post",
          "/bpa-services/v1/preapprovedplan/_search",
          "_search",
          [],
          queryObject
        );
        if (response && response.preapprovedPlan &&
            response.preapprovedPlan.length > 0) {   
            let data = response.preapprovedPlan[0].drawingDetail.blocks;
            let tableData = [];
            for (var j = 0; j < data.length; j++) {
                let title = `Block ${j + 1}`;
                let floors = data[j] && data[j].building && data[j].building.floors;
                let setBack = data[j] && data[j].building && data[j].building.setBack;
                let height = {
                    actualBuildingHeight: data[j] && data[j].building && data[j].building.actualBuildingHeight,
                    buildingHeight: data[j] && data[j].building && data[j].building.buildingHeight
                }
                let block = await floors.map((item, index) => (        {
                    [getBpaTextToLocalMapping("Floor Description")]: item.floorName.toString(),//getFloorDetails((item.number).toString()) || '-',
                    [getBpaTextToLocalMapping("Level")]: parseInt(item.floorNo),
                    [getBpaTextToLocalMapping("Buildup Area")]: parseInt(item.builtUpArea) || "0",
                    [getBpaTextToLocalMapping("Floor Area")]: parseInt(item.floorArea) || "0",
                    [getBpaTextToLocalMapping("Carpet Area")]: parseInt(item.carpetArea) || "0",
                    [getBpaTextToLocalMapping("Floor Height")]: parseInt(item.floorHeight) || "0",
                    }));
                let blockSetBack = {}
                setBack.forEach((item,index)=> {
                    blockSetBack.frontSetback=item.frontSetback,
                    blockSetBack.rearSetback= item.rearSetback,
                    blockSetBack.leftSetback= item.leftSetback,
                    blockSetBack.rightSetback= item.rightSetback
                })
                tableData.push({ blocks: block,blockSetBack: blockSetBack, titleData: title, height:height});
        
            };
            dispatch(prepareFinalObject("edcr.blockDetail", tableData));
            return response.preapprovedPlan[0]
        //   dispatch(prepareFinalObject("drawingDetails", response.preapprovedPlan[0]));
        }
      } catch (err) {
        console.log(err);
      }
}
let screenConfig = {
  _comment: "preapprovedplan-search-preview screen configuration object",
  uiFramework: "material-ui",
  name: "preapprove-search-preview",
  beforeInitScreen: (action, state, dispatch) => {
    getData(action, state, dispatch);
    dispatch(prepareFinalObject("drawing", {}))
    getDrawingDetails(action, state, dispatch).then((response)=> {
        dispatch(prepareFinalObject("drawingDetails", response));
    })
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
                sm: 10,
              },
              ...header,
            },
          },
        },
        plotDetails,
        proposedBuildingDetails,
        buildingAbstract,
        uploadDocuments,
      },
    },
    popupForScrutinyDetail: {
      componentPath: "Dialog",
      isClose: true,
      props: {
        open: false,
        maxWidth: "md",
      },
      children: {
        dialogContent: {
          componentPath: "DialogContent",
          props: {
            classes: {
              root: "city-picker-dialog-style",
            },
          },
          children: {
            popup: getCommonContainer({
              header: getCommonHeader({
                labelName: "Add Building Details",
                labelKey: "PREAPPROVE_ADD_BUILDING_DETAILS",
              }),
              closePop: getCommonContainer({
                closeCompInfo: {
                  uiFramework: "custom-molecules-local",
                  moduleName: "egov-bpa",
                  componentPath: "CloseDialog",
                  required: true,
                  gridDefination: {
                    xs: 12,
                    sm: 12,
                  },
                  props: {
                    screen: "preapprovedplan",
                    jsonpath: "components.popupForScrutinyDetail",
                  },
                },
              }),
              addPreApprovePlan: addPreApprovePlan,
              addBuildingPlanDialogFooter,
            }),
          },
        },
      },
    },
  },
};


if(!CONSTANTS.features.isPreApprovedEmployeeActive){
  screenConfig = {}
}

export default screenConfig;

