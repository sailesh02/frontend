import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
  toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {getTransformedLocale} from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from "../../../../../ui-utils/api";
import get from "lodash/get";
export const getDrawingDetails = async (state, dispatch, fieldInfo=false) => {
  let drawingAppNo = ''
  try {
    if(!fieldInfo) {
      drawingAppNo = get(
        state.screenConfiguration.preparedFinalObject,
        `preApprovedPlan.drawingAppNo`,
        ""
      );
    } else {
      drawingAppNo = get(
        state.screenConfiguration.preparedFinalObject,
        `BPA.edcrNumber`,
        ""
      );
    }
    

    let queryObject = {
      preapprovedPlanSearchCriteria: {
        drawingNo: drawingAppNo,
      },
    };
    const drawingDetails = await httpRequest(
      "post",
      `/bpa-services/v1/preapprovedplan/_search?drawingNo=${drawingAppNo}`,
      "_search",
      [],
    );
    if(drawingDetails && drawingDetails.preapprovedPlan &&
      drawingDetails.preapprovedPlan.length > 0){
      
      drawingDetails.preapprovedPlan.forEach((data, index) => {
        //   Todo list
        console.log("data............", data);
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
        const governementBody = [
          { code: "GA", label: "GA" },
          { code: "OSHB", label: "BDA" },
          { code: "BDA", label: "BDA" }
        ];
        const layoutType = [
          { code: "GOVERNMENT", label: "GOVERNMENT_SCHEME" },
          { code: "PRIVATE", label: "PRIVATE_SCHEME" },
        ]
        dispatch(prepareFinalObject("PA.confirmation", confirmation));
        dispatch(prepareFinalObject("PA.landStatus", landStatus));
        dispatch(prepareFinalObject("PA.project", project));
        dispatch(prepareFinalObject("PA.governementBody", governementBody));
        dispatch(prepareFinalObject("PA.layoutType", layoutType));

        dispatch(prepareFinalObject("PA.preApprovedPlanDetails", data));
        dispatch(
          prepareFinalObject(
            "PA.subOccupancy",
            getTransformedLocale(data.drawingDetail.subOccupancy.label)
          )
        );
        dispatch(
          prepareFinalObject(
            "BPA.applicationType",
            data.drawingDetail.applicationType
          )
        );
        
        dispatch(
          prepareFinalObject(
            "scrutinyDetails.planDetail.planInformation.occupancy",
            data.drawingDetail.occupancy
          )
        );

        dispatch(
          prepareFinalObject("BPA.serviceType", data.drawingDetail.serviceType)
        );
        dispatch(prepareFinalObject("BPA.additionalDetails.documents", data.documents));
        dispatch(prepareFinalObject("BPA.additionalDetails.preApprovedCode", data.preApprovedCode));

        dispatch(prepareFinalObject("BPA.businessService", "BPA6"));
        // Risk type is hardcoded
        dispatch(prepareFinalObject("BPA.riskType", "LOW"));
        dispatch(prepareFinalObject("BPA.edcrNumber", data.drawingNo));
        dispatch(
          prepareFinalObject("scrutinyDetails.edcrNumber", data.drawingNo)
        );
        dispatch(
          prepareFinalObject("BPAs.appdate", data.auditDetails.createdTime)
        );
        // dispatch(prepareFinalObject("BPA.documents", data.documents));
        dispatch(
          prepareFinalObject(
            "BPA.additionalDetails.planDetail.plot.area",
            data.drawingDetail.plotArea
          )
        );
        dispatch(
          prepareFinalObject(
            "scrutinyDetails.planDetail.blocks",
            data.drawingDetail.blocks
          )
        );
        
        dispatch(
          prepareFinalObject(
            "scrutinyDetails.planDetail.virtualBuilding.totalBuitUpArea",
            data.drawingDetail.plotArea
          )
        );
      });
      } else {
        dispatch(prepareFinalObject("PA", {}));
        dispatch(
          prepareFinalObject(
            "BPA",
            {}
          )
        );
        dispatch(
          prepareFinalObject(
            "scrutinyDetails",
            {}
          )
        );
        dispatch(
          toggleSnackbar(
            true,
            { labelName: "Not a Valid Drawing Number.", labelKey: "BPA_INVALID_DRAWING_NO" },
            "info"
          )
        );
      }
    
  } catch (e) {
    dispatch(
      toggleSnackbar(
        true,
        { labelName: e.message, labelKey: e.message },
        "info"
      )
    );
  }
};
