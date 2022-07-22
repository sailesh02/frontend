/*
*Preapproved plan page has two section.
*User can see the preapproved plan list in Preapproved plan tab(Tab1)
*User can add the new preapproveplan details in Add preapprove plan tab(Tab2). 
*User can update the plan details in Tab1.

*@getName function used to fetch the name of user from userInfo state
*@header function is used to generate page header section.
*/

import { showPreApprovedTab } from "./preApprovePlanResource/preApprovePlanSearch";
import {
  getCommonHeader,
  getCommonContainer,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  addPreApprovePlan,
  addBuildingPlanDialogFooter,
} from "./preApprovePlanResource/addPreApprovePlanBuildingDetails";
import store from "ui-redux/store";

import get from "lodash/get";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getPreApproveList } from "./preApprovePlanResource/getPreApprovePlanList";
import { getMdmsData } from "./preApprovePlanResource/getMdmsData";
import { prepareDocumentsUploadData } from "./preApprovePlanResource/prepareDocumentUploadData";

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
const screenConfig = {
  _comment: "preapprovedplan screen configuration object",
  uiFramework: "material-ui",
  name: "preapprovedplan",
  beforeInitScreen: (action, state, dispatch) => {
    getPreApproveList(action, state, dispatch);
    getData(action, state, dispatch);
    dispatch(prepareFinalObject("plotDetails", {}));
    dispatch(prepareFinalObject("buildingAbstract", {}));
    dispatch(prepareFinalObject("drawingDetails", []));
    prepareDocumentsUploadData(state, dispatch);
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
        showPreApprovedTab,
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
                    jsonpath: "components.popupForScrutinyDetail.props",
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

export default screenConfig;