import {
    getCommonCard,
    getCommonContainer,
    getLabel,
  } from "egov-ui-framework/ui-config/screens/specs/utils";

  import get from "lodash/get";
  
  import { validateFields } from "egov-ui-framework/ui-utils/commons";
  import { httpRequest } from "../../../../../ui-utils/api";
  import { getLoggedinUserRole } from "../../utils";
  import { getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
  import jp from "jsonpath";
  
  import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";

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

// Reset page
const resetPage = (state, dispatch) => {
  window.location.reload();
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
          fileName: docDetail.fileName,
          title: getTransformedLocale(doc.documentCode),
          fileUrl: docDetail.fileUrl && docDetail.fileUrl.split(",")[0],
        };
        documentsPreview.push(obj);
      });
    }
    if (isDocumentRequired) {
      uploadRequired.push(isDocumentRequired);
    }
  });
  if (uploadRequired && uploadRequired.length>0 && uploadRequired.indexOf(true) > -1) {
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
        plotLengthInFeet: plotDetails.lengthInFt,
        plotWidthInFeet: plotDetails.widthInFt,
        roadWidth: plotDetails.abuttingRoadWidthInMt,
        active: false,
      };
      // Drawing Details Section Start
      let PArea = plotDetails.lengthInMt*plotDetails.widthInMt
      const drawingDetail = {
        plotArea:
          parseFloat(PArea).toFixed(2),
        serviceType: "NEW_CONSTRUCTION",
        applicationType: "BUILDING_PLAN_SCRUTINY",
        occupancy: "Residential",
        floorDescription: `G+${buildingAbstract.totalFloorNo}`,
        subOccupancy: edcrDetails.blockDetail[0].suboccupancyData,
        totalBuitUpArea: parseInt(buildingAbstract.totalBuildUpArea),
        totalCarpetArea: parseInt(buildingAbstract.totalCarpetArea),
        totalFar: parseFloat(buildingAbstract.totalFar),
        totalFloorArea: parseInt(buildingAbstract.totalFloorArea),
        totalFloorNo: parseInt(buildingAbstract.totalFloorNo)
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
      if (documents && documents.length>0) {
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
        if(response && response.preapprovedPlan && response.preapprovedPlan.length>0){
          const applicationNumber = response.preapprovedPlan[0].drawingNo;
          const tenantId = response.preapprovedPlan[0].tenantId;
          const acknowledgementUrl =          
              `/egov-bpa/acknowledgement?purpose=PRE_APPROVED&status=success&applicationNumber=${applicationNumber}&tenantId=${tenantId}`
          dispatch(setRoute(acknowledgementUrl));
        }
      } catch (err) {
        console.log(err);
      }
    }
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
            resetPage(state, dispatch);
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
