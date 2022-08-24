import { httpRequest } from "../../../../../ui-utils/api";
import { handleScreenConfigurationFieldChange as handleField,prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
export const getPreApproveList = async (action, state, dispatch) => {
  let queryObject = {
    preapprovedPlanSearchCriteria: {},
  };
  try {
    const response = await httpRequest(
      "post",
      "/bpa-services/v1/preapprovedplan/_search",
      "_search",
      [],
    );
    const arr = [];
    const res = response;
    dispatch(prepareFinalObject("PA",res))
    res.preapprovedPlan.map((item, index) => {
      const newObj = {};
      newObj.active = item;
      newObj.drawingNo = item.drawingNo;
      newObj.plotSize = parseInt(item.plotLength) * parseInt(item.plotWidth);
      newObj.abuttingRoad = item.roadWidth;
      newObj.plotArea = item.drawingDetail.plotArea;
      newObj.buildUpArea = item.drawingDetail.totalBuitUpArea;

      newObj.plotLength = item.plotLengthInFeet;
      newObj.plotWidth = item.plotWidthInFeet;
      newObj.preApprovedCode = item.preApprovedCode;
      newObj.floorDescription = item.drawingDetail.floorDescription;
      newObj.totalFar = item.drawingDetail.totalFar;
      newObj.tenantId = item.tenantId;
      arr.push({
        PREAPPROVE_EDIT_TOOGLE_BUTTON: newObj.active,
        PREAPPROVE_BUILDING_PLAN: newObj.drawingNo,
        PREAPPROVE_CODE: newObj.preApprovedCode,
        // PREAPPROVE_PLOT_SIZE: newObj.plotSize,
        PREAPPROVE_ABUTTING_ROAD_COLUMN: newObj.abuttingRoad,
        PREAPPROVE_TENANT_ID: newObj.tenantId,
        PREAPPROVE_PLOT_AREA_COLUMN: newObj.plotArea,
        PREAPPROVE_BUILD_UP_AREA: newObj.buildUpArea,
        PREAPPROVE_FLOORS: newObj.floorDescription,
        PREAPPROVE_LENGTH: newObj.plotLength,
        PREAPPROVE_WIDTH: newObj.plotWidth,
        PREAPPROVE_FAR: newObj.totalFar,
        // PREAPPROVE_FLOORS: "",
        // PREAPPROVE_FRONT_SETBACK: "",
        // PREAPPROVE_REAR_SETBACK: "",
        // PREAPPROVE_SIDE_SETBACK: "",
        BPA_COMMON_TABLE_COL_ACTION_LABEL: item.documents || [],
      });
    });
    dispatch(
      handleField(
        "preapprovedplan",
        "components.div.children.showPreApprovedTab.children.showSearchScreens.props.tabs[0].tabContent.listOfPreAprrovedPlan",
        "props.data",
        arr
      )
    );
    dispatch(
      handleField(
        "preapprovedplan",
        "components.div.children.showPreApprovedTab.children.showSearchScreens.props.tabs[0].tabContent.listOfPreAprrovedPlan",
        "props.rows",
        arr.length
      )
    );
  } catch (err) {
    console.log(err);
  }
};