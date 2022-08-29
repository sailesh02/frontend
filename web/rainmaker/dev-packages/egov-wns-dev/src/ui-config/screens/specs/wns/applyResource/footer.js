import {
  dispatchMultipleFieldChangeAction,
  getLabel,
  getCommonContainer
} from "egov-ui-framework/ui-config/screens/specs/utils";

import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg, validateFields } from "egov-ui-framework/ui-utils/commons";
import { getTenantIdCommon } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import set from 'lodash/set';
import { httpRequest } from "../../../../../ui-utils";
import {
  applyForSewerage,
  applyForWater, applyForWaterOrSewerage,

  findAndReplace,
  isActiveProperty,
  isModifyMode,
  isOwnerShipTransfer,
  isModifyModeAction, prepareDocumentsUploadData,
  pushTheDocsUploadedToRedux,
  serviceConst,
  showHideFieldsFirstStep, validateConnHolderDetails, validateFeildsForBothWaterAndSewerage,
  validateFeildsForSewerage, validateFeildsForWater, isEditAction, validationsForExecutionData, validateMeterDetails, validateVolumetricDetails, validationsForModifyConnectionData, validateInstallmentDetails
} from "../../../../../ui-utils/commons";
import { getCommonApplyFooter } from "../../utils";
import "./index.css";
import commonConfig from "config/common.js";
import {connectionDetailsWater,connectionDetailsSewerage} from './task-connectiondetails'

const isMode = isModifyMode();
const isModeAction = isModifyModeAction();
const setReviewPageRoute = (state, dispatch) => {
  let roadCuttingInfo = get(state, "screenConfiguration.preparedFinalObject.applyScreen.roadCuttingInfo", []);
  if(roadCuttingInfo && roadCuttingInfo != 'NA' && roadCuttingInfo.length > 0) {
    let formatedRoadCuttingInfo = roadCuttingInfo.filter(value => value.isEmpty !== true);
    dispatch(prepareFinalObject( "applyScreen.roadCuttingInfo", formatedRoadCuttingInfo));
  }
  let tenantId = getTenantIdCommon();
  const applicationNumber = get(state, "screenConfiguration.preparedFinalObject.applyScreen.applicationNo");
  const appendUrl =
    process.env.REACT_APP_SELF_RUNNING === "true" ? "/egov-ui-framework" : "";
  let reviewUrl = `${appendUrl}/wns/search-preview?applicationNumber=${applicationNumber}&tenantId=${tenantId}&edited="true"`;
  if (isModifyMode() && isModifyModeAction()) {
    reviewUrl += "&mode=MODIFY"
  }
  if (get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].additionalDetails.locality", null) === null) {
    dispatch(prepareFinalObject("WaterConnection[0].additionalDetails.locality", get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].property.address.locality.code")));
  }

  if(get(state,"screenConfiguration.preparedFinalObject.applyScreen[0].water",false)){
    set("search-preview", "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewFour.props.items[0].item0.children.cardContent.children.serviceCardContainer", getCommonContainer(connectionDetailsWater));
  }else{
    set("search-preview", "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewFour.props.items[0].item0.children.cardContent.children.serviceCardContainer", getCommonContainer(connectionDetailsSewerage));

  }
  dispatch(setRoute(reviewUrl));
};
const moveToReview = (state, dispatch) => {
  const documentsFormat = Object.values(
    get(state.screenConfiguration.preparedFinalObject, "documentsUploadRedux")
  );

  let validateDocumentField = false;

  for (let i = 0; i < documentsFormat.length; i++) {
    // let isDocumentRequired = get(documentsFormat[i], "isDocumentRequired");
    let isDocumentRequired = false
    let isDocumentTypeRequired = get(documentsFormat[i], "isDocumentTypeRequired");

    if (isDocumentRequired) {
      let documents = get(documentsFormat[i], "documents");
      if (documents && documents.length > 0) {
        if (isDocumentTypeRequired) {
          let dropdownData = get(documentsFormat[i], "dropdown.value");
          if (dropdownData) {
            // if (get(documentsFormat[i], "dropdown.value") !== null && get(documentsFormat[i]).dropdown !==undefined ){
            validateDocumentField = true;
          } else {
            dispatch(
              toggleSnackbar(
                true,
                { labelName: "Please select type of Document!", labelKey: "" },
                "warning"
              )
            );
            validateDocumentField = false;
            break;
          }
        } else {
          validateDocumentField = true;
        }
      } else if (!isModifyMode()) {
        dispatch(
          toggleSnackbar(
            true,
            { labelName: "Please uplaod mandatory documents!", labelKey: "" },
            "warning"
          )
        );
        validateDocumentField = false;
        break;
      } else {
        validateDocumentField = true;
      }
    } else {
      validateDocumentField = true;
    }
  }

  return validateDocumentField;
};


const getMdmsData = async (state, dispatch) => {
  let tenantId = get(
    state.screenConfiguration.preparedFinalObject,
    "FireNOCs[0].fireNOCDetails.propertyDetails.address.city"
  );
  let mdmsBody = {
    MdmsCriteria: {
       tenantId: commonConfig.tenantId, moduleDetails: [
        { moduleName: "ws-services-masters", masterDetails: [{ name: "Documents" }] },
        { moduleName: "sw-services-calculation", masterDetails: [{ name: "Documents" }] }
      ]
    }
  };
  try {
    let payload = await httpRequest("post", "/egov-mdms-service/v1/_search", "_search", [], mdmsBody);
    dispatch(prepareFinalObject("applyScreenMdmsData.applyScreen.Documents", payload.MdmsRes['ws-services-masters'].Documents));
    prepareDocumentsUploadData(state, dispatch);
  } catch (e) {
    console.log(e);
  }
};

const callBackForNext = async (state, dispatch) => {
  let mode = getQueryArg(window.location.href, "mode");
  window.scrollTo(0, 0);
  let activeStep = get(state.screenConfiguration.screenConfig["apply"], "components.div.children.stepper.props.activeStep", 0);
  let isFormValid = true;
  let hasFieldToaster = false;
  const searchPropertyId = get(
    state.screenConfiguration.preparedFinalObject,
    "searchScreen.propertyIds"
  )
  /* validations for property details screen */
  if (activeStep === 0) {
    let connectionCategory = get(state, "screenConfiguration.preparedFinalObject.applyScreen.connectionCategory");
    let connectionType = get(state, "screenConfiguration.preparedFinalObject.applyScreen.connectionType");
    let isVolumetricConnection = get(state, "screenConfiguration.preparedFinalObject.applyScreen.additionalDetails.isVolumetricConnection");
    // if (validatePropertyLocationDetails && validatePropertyDetails && validateForm) {
    //   isFormValid = await appl;
    // }

    // validateFields("components.div.children.formwizardFirstStep.children.IDDetails.children.cardContent.children.propertyID.children", state, dispatch)
    isFormValid = validateFields("components.div.children.formwizardFirstStep.children.connectionHolderDetails.children.cardContent.children.holderDetails.children.holderDetails.children", state, dispatch)

    validateFields("components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children", state, dispatch)

    if (getQueryArg(window.location.href, "action") === "edit" && !isModifyMode() && !isOwnerShipTransfer()) {
      let application = findAndReplace(get(state.screenConfiguration.preparedFinalObject, "applyScreen", {}), "NA", null);
      const uploadedDocData = application.documents;
      const reviewDocData = uploadedDocData && uploadedDocData.map(item => {
        return {
          title: `WS_${item.documentType}`,
          link: item.fileUrl && item.fileUrl.split(",")[0],
          linkText: "View",
          name: item.fileName
        };
      });
      dispatch(prepareFinalObject("applyScreen.reviewDocData", reviewDocData));
      let applyScreenObject = findAndReplace(get(state.screenConfiguration.preparedFinalObject, "applyScreen", {}), "NA", null);
      let applyScreenObj = findAndReplace(applyScreenObject, 0, null);
      //connectionholdercode
      let connectionHolderObj = get(state.screenConfiguration.preparedFinalObject, "connectionHolders");
      let holderData = connectionHolderObj[0];
      if (holderData !== null && holderData !== undefined) {
        if (holderData.sameAsPropertyAddress === true) {
          holderData = null
        }
      }
      if (holderData == null) {
        applyScreenObject.connectionHolders = holderData;
      } else {
        let arrayHolderData = [];
        arrayHolderData.push(holderData);
        applyScreenObj.connectionHolders = arrayHolderData;
      }

      // if ( !!searchPropertyId && !isActiveProperty(applyScreenObj.property)) {
      //   dispatch(toggleSnackbar(true, { labelKey: `ERR_WS_PROP_STATUS_${applyScreenObj.property.status}`, labelName: `Property Status is ${applyScreenObj.property.status}` }, "warning"));
      //   showHideFieldsFirstStep(dispatch, "", false);
      //   dispatch(prepareFinalObject("applyScreen", applyScreenObj));
      //   return false;
      // }

    } else {
      const water = get(
        state.screenConfiguration.preparedFinalObject,
        "applyScreen.water"
      );
      const sewerage = get(
        state.screenConfiguration.preparedFinalObject,
        "applyScreen.sewerage"
      );
      const searchPropertyId = get(
        state.screenConfiguration.preparedFinalObject,
        "searchScreen.propertyIds"
      )
      let applyScreenObject = get(state.screenConfiguration.preparedFinalObject, "applyScreen");

      //connectionholdercode

      let connectionHolderObj = get(state.screenConfiguration.preparedFinalObject, "connectionHolders");
      let holderData = connectionHolderObj[0];
      if (holderData !== null && holderData !== undefined) {
        if (holderData.sameAsPropertyAddress === true) {
          holderData = null
        }
      }
      if (holderData == null) {
        applyScreenObject.connectionHolders = holderData;
      } else {
        let arrayHolderData = [];
        arrayHolderData.push(holderData);
        applyScreenObject.connectionHolders = arrayHolderData;
      }
      // if (searchPropertyId !== undefined && searchPropertyId !== "") {

        // if (!!searchPropertyId && !isActiveProperty(applyScreenObject.property)) {
        //   dispatch(toggleSnackbar(true, { labelKey: `ERR_WS_PROP_STATUS_${applyScreenObject.property.status}`, labelName: `Property Status is ${applyScreenObject.property.status}` }, "warning"));
        //   showHideFieldsFirstStep(dispatch, "", false);
        //   return false;
        // }
        // TODO else part update propertyId.
      if(isFormValid){
        if (validateConnHolderDetails(applyScreenObject)) {
          isFormValid = true;
          hasFieldToaster = false;
          if (applyScreenObject.water || applyScreenObject.sewerage) {
            // if (
            //   applyScreenObject.hasOwnProperty("property") &&
            //   !_.isUndefined(applyScreenObject["property"]) &&
            //   !_.isNull(applyScreenObject["property"]) &&
            //   !_.isEmpty(applyScreenObject["property"])
            // ) {
              if (water && sewerage) {
                if (validateFeildsForBothWaterAndSewerage(applyScreenObject)) {
                  isFormValid = true;
                  hasFieldToaster = false;
                } else {
                  isFormValid = false;
                  dispatch(
                    toggleSnackbar(
                      true, {
                      labelKey: "WS_FILL_REQUIRED_FIELDS",
                      labelName: "Please fill Required details"
                    },
                      "warning"
                    )
                  )
                }
              } else if (water) {
                if (validateFeildsForWater(applyScreenObject)) {
                  isFormValid = true;
                  hasFieldToaster = false;
                } else {
                  isFormValid = false;
                  dispatch(
                    toggleSnackbar(
                      true, {
                      labelKey: "WS_FILL_REQUIRED_FIELDS",
                      labelName: "Please fill Required details"
                    },
                      "warning"
                    )
                  )
                }
              } else if (sewerage) {
                if (validateFeildsForSewerage(applyScreenObject)) {
                  isFormValid = true;
                  hasFieldToaster = false;
                } else {
                  isFormValid = false;
                  dispatch(
                    toggleSnackbar(
                      true, {
                      labelKey: "WS_FILL_REQUIRED_FIELDS",
                      labelName: "Please fill Required details"
                    },
                      "warning"
                    )
                  )
                }
              }
            // } else {
            //   isFormValid = false;
            //   dispatch(
            //     toggleSnackbar(
            //       true, {
            //       labelKey: "ERR_WS_PROP_NOT_FOUND",
            //       labelName: "No Property records found, please search or create a new property"
            //     },
            //       "warning"
            //     )
            //   );
            // }
            let waterData = get(state, "screenConfiguration.preparedFinalObject.WaterConnection");
            let sewerData = get(state, "screenConfiguration.preparedFinalObject.SewerageConnection")
            let waterChecked = get(state, "screenConfiguration.preparedFinalObject.applyScreen.water");
            let sewerChecked = get(state, "screenConfiguration.preparedFinalObject.applyScreen.sewerage")
            let modifyAppCreated = get(state, "screenConfiguration.preparedFinalObject.modifyAppCreated")
            let ownershipTransferCreated = get(state,"screenConfiguration.preparedFinalObject.ownershipTransferCreated")
            if (isFormValid) {
              if ((waterData && waterData.length > 0) || (sewerData && sewerData.length > 0)) {
                if (waterChecked && sewerChecked) {
                  dispatch(
                    prepareFinalObject(
                      "applyScreen.service",
                      "Water And Sewerage"
                    )
                  );
                  if (sewerData && sewerData.length > 0 && waterData.length === 0) { 
                    await applyForWater(state, dispatch); }
                  else if (waterData && waterData.length > 0 && sewerData.length === 0) { 
                    await applyForSewerage(state, dispatch); }
                } else if ((sewerChecked && sewerData.length === 0) || (isModifyMode() && sewerData.length === 1 && !modifyAppCreated) || (sewerData && sewerData.length === 1 && isOwnerShipTransfer() && !ownershipTransferCreated)) {
                  dispatch(
                    prepareFinalObject(
                      "applyScreen.service",
                      _.capitalize(serviceConst.SEWERAGE)
                    )
                  );
                  await applyForSewerage(state, dispatch);
                } else if ((waterChecked && waterData.length === 0) || (isModifyMode() && waterData.length === 1 && !modifyAppCreated) || (waterData && waterData.length === 1 && isOwnerShipTransfer() && !ownershipTransferCreated)) {
                  dispatch(
                    prepareFinalObject(
                      "applyScreen.service",
                      _.capitalize(serviceConst.WATER)
                    )
                  );
                  await applyForWater(state, dispatch);
                }
              } else if (waterChecked && sewerChecked) {
                dispatch(
                  prepareFinalObject(
                    "applyScreen.service",
                    "Water And Sewerage"
                  )
                );
                if (waterData.length === 0 && sewerData.length === 0) {
                  isFormValid = await applyForWaterOrSewerage(state, dispatch); }
              } else if (waterChecked) {
                dispatch(
                  prepareFinalObject(
                    "applyScreen.service",
                    _.capitalize(serviceConst.WATER)
                  )
                );
                if (waterData.length === 0) {
                   isFormValid = await applyForWaterOrSewerage(state, dispatch); }
              } else if (sewerChecked) {
                dispatch(prepareFinalObject("applyScreen.service", _.capitalize(serviceConst.SEWERAGE)))
                if (sewerData.length === 0) {
                  isFormValid = await applyForWaterOrSewerage(state, dispatch); }
              }
            }
          } else {
            isFormValid = false;
            hasFieldToaster = true;
          }
        } else {
          isFormValid = false;
          dispatch(
            toggleSnackbar(
              true, {
              labelKey: "WS_FILL_REQUIRED_HOLDER_FIELDS",
              labelName: "Please fill Required details"
            },
              "warning"
            )
          )
        }
      }else{
        isFormValid = false;
          dispatch(
            toggleSnackbar(
              true, {
              labelKey: "WS_FILL_REQUIRED_HOLDER_FIELDS",
              labelName: "Please fill Required details"
            },
              "warning"
            )
          )
      }
      // } else {
      //   isFormValid = false;
      //   dispatch(
      //     toggleSnackbar(
      //       true, {
      //       labelKey: "WS_FILL_REQUIRED_FIELDS",
      //       labelName: "Please fill Required details"
      //     },
      //       "warning"
      //     )
      //   );
      // }
    }
    prepareDocumentsUploadData(state, dispatch);
    if(isModifyMode() && process.env.REACT_APP_NAME === "Employee"  && connectionCategory === 'PERMANENT'){
      getInstallmentCard(dispatch, state);
    }else if(isModifyMode() && process.env.REACT_APP_NAME === "Employee" && connectionCategory === 'TEMPORARY'){
      getInstallmentCard(dispatch, state);
    }
    // else if(isModifyMode() && process.env.REACT_APP_NAME === "Employee" && connectionCategory === 'TEMPORARY' && connectionType === "Metered"){
    //   getInstallmentCard(dispatch, state);
    // } 
    else{
      dispatch(
        handleField(
          "apply",
          `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer`,
          "visible",
          false
        )
      );
    }
    
  }

  /* validations for Additional /Docuemnts details screen */
  if (activeStep === 1) {
    let waterData = get(state, "screenConfiguration.preparedFinalObject.WaterConnection");
    let connectionCategory = get(state, "screenConfiguration.preparedFinalObject.applyScreen.connectionCategory");
    let usageCategory = get(state, "screenConfiguration.preparedFinalObject.applyScreen.usageCategory")
    let isApartment = get(state, "screenConfiguration.preparedFinalObject.applyScreen.apartment")
    let connectionType = get(state, "screenConfiguration.preparedFinalObject.applyScreen.connectionType");
    let isVolumetricConnection = get(state, "screenConfiguration.preparedFinalObject.applyScreen.additionalDetails.isVolumetricConnection");

    
    if (isModifyMode()) {
      let applyScreenObject = findAndReplace(get(state.screenConfiguration.preparedFinalObject, "applyScreen", {}), "NA", null);
      let connectionOldData = findAndReplace(get(state.screenConfiguration.preparedFinalObject, "applyScreenOld", {}), "NA", null);
      if(validationsForExecutionData(applyScreenObject)){
        isFormValid = true;
        hasFieldToaster = false;
      }else{
        isFormValid = false;
        hasFieldToaster = true;
        let errorMessage = {
          labelName:
            "Date Effective From cannot be less than execution date!",
          labelKey: "ERR_DATE_EFFECTIVE_FROM_CANNOT_LESS_THAN_EXECUTION_DATE_TOAST"
        };
        dispatch(toggleSnackbar(true, errorMessage, "warning"));
        return
      }
      if(validationsForModifyConnectionData(applyScreenObject, connectionOldData)){
        isFormValid = true;
        hasFieldToaster = false;
      }else{
        isFormValid = false;
        hasFieldToaster = true;
        let errorMessage = {
          labelName:
            "Can not modify meter connection in non metered connection!",
          labelKey: "ERR_CAN_NOT_MODIFY_METERED_TO_METERED_TOAST"
        };
        dispatch(toggleSnackbar(true, errorMessage, "warning"));
        return
      }
    } else {
      if (moveToReview(state, dispatch)) {
        await pushTheDocsUploadedToRedux(state, dispatch);
        isFormValid = true; hasFieldToaster = false;
        if (process.env.REACT_APP_NAME === "Citizen" && getQueryArg(window.location.href, "action") === "edit" && !isOwnerShipTransfer()) {
          setReviewPageRoute(state, dispatch);
        }
      }
      else {
        isFormValid = false;
        hasFieldToaster = true;
      }
    }


if(!isModifyMode() && process.env.REACT_APP_NAME === "Employee" && connectionCategory === 'PERMANENT'){
  getInstallmentCard(dispatch, state);
}else if(!isModifyMode() && process.env.REACT_APP_NAME === "Employee" && connectionCategory === 'TEMPORARY'){
  getInstallmentCard(dispatch, state);
}
// else if(!isModifyMode() && process.env.REACT_APP_NAME === "Employee" && connectionCategory === 'TEMPORARY' && connectionType === "Metered"){
//   getInstallmentCard(dispatch, state);
// }
else{
  dispatch(
    handleField(
      "apply",
      `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer`,
      "visible",
      false
    )
  );
}

  }
  /* validations for Additional /Docuemnts details screen */
  if (activeStep === 2 && (isModifyMode() || process.env.REACT_APP_NAME !== "Citizen")) {
    
    if (isModifyMode()) {
      if (moveToReview(state, dispatch)) {
        await pushTheDocsUploadedToRedux(state, dispatch);
        isFormValid = true; hasFieldToaster = false;
        // if (process.env.REACT_APP_NAME === "Citizen" && getQueryArg(window.location.href, "action") === "edit") {
        //   setReviewPageRoute(state, dispatch);
        // }
      }
      else {
        isFormValid = true;
        hasFieldToaster = false;
      }
    } else {
      let applyScreenObject = findAndReplace(get(state.screenConfiguration.preparedFinalObject, "applyScreen", {}), "NA", null);
      let WaterConnection = findAndReplace(get(state.screenConfiguration.preparedFinalObject, "WaterConnection", {}), "NA", null);
      if(validateMeterDetails(applyScreenObject) && validateVolumetricDetails(applyScreenObject)){
        isFormValid = true;
        hasFieldToaster = false;
      }else{
        console.log("Nero 2")
        isFormValid = false;
        hasFieldToaster = true;
        let errorMessage = {
          labelName:
            "ERR_FILL_MANDATORY_FIELDS",
          labelKey: "ERR_FILL_MANDATORY_FIELDS"
        };
        dispatch(toggleSnackbar(true, errorMessage, "warning"));
        return
      }

      if(validateInstallmentDetails(applyScreenObject, WaterConnection)){
        isFormValid = true;
        hasFieldToaster = false;
      }else{
        console.log("Nero 1")
        isFormValid = false;
        hasFieldToaster = true;
        let errorMessage = {
          labelName:
            "ERR_FILL_MANDATORY_FIELDS",
          labelKey: "ERR_FILL_MANDATORY_FIELDS"
        };
        dispatch(toggleSnackbar(true, errorMessage, "warning"));
        return
      }


      let roadCuttingInfo = get(state, "screenConfiguration.preparedFinalObject.applyScreen.roadCuttingInfo", []);
      if(roadCuttingInfo && roadCuttingInfo != 'NA' && roadCuttingInfo.length > 0) {
        for (let i = 0; i < roadCuttingInfo.length; i++) {
          if (roadCuttingInfo[i] == undefined) {
            roadCuttingInfo[i] = {};
            roadCuttingInfo[i].isEmpty = true;
          }
        }
        let filteredInfo = [];
        roadCuttingInfo && roadCuttingInfo.map(info => {
          if(info.isDeleted !=false) filteredInfo.push(info);
        });
        dispatch(prepareFinalObject( "applyScreen.roadCuttingInfo", filteredInfo));
      }

      if (getQueryArg(window.location.href, "action") === "edit" && (!isModifyMode() || (isModifyMode() && isModifyModeAction()) ) && !isOwnerShipTransfer()) {
        setReviewPageRoute(state, dispatch);
      }
      isFormValid = true;
    }
    let applyScreenObject = findAndReplace(get(state.screenConfiguration.preparedFinalObject, "applyScreen", {}), "NA", null);
    let applyScreenObj = findAndReplace(applyScreenObject, 0, null);
    dispatch(handleField("apply", "components.div.children.formwizardFourthStep.children.snackbarWarningMessage", "props.propertyId", get(applyScreenObj, "property.propertyId", '')));
    // if (!!searchPropertyId && isActiveProperty(applyScreenObj.property)) {
    //   dispatch(handleField("apply", "components.div.children.formwizardFourthStep.children.snackbarWarningMessage", "visible", false));
    // }


  }
  if (activeStep === 3) {
    let waterId = get(state, "screenConfiguration.preparedFinalObject.WaterConnection[0].id");
    let sewerId = get(state, "screenConfiguration.preparedFinalObject.SewerageConnection[0].id");
    let roadCuttingInfo = get(state, "screenConfiguration.preparedFinalObject.applyScreen.roadCuttingInfo", []);
    if(roadCuttingInfo && roadCuttingInfo !='NA' && roadCuttingInfo.length > 0 && !isOwnerShipTransfer()) {
      let formatedRoadCuttingInfo = roadCuttingInfo.filter(value => value.isEmpty !== true);
      dispatch(prepareFinalObject( "applyScreen.roadCuttingInfo", formatedRoadCuttingInfo));
    }
    if (waterId && sewerId) {
      isFormValid = await acknoledgementForBothWaterAndSewerage(state, activeStep, isFormValid, dispatch);
    } else if (waterId) {
      isFormValid = await acknoledgementForWater(state, activeStep, isFormValid, dispatch);
    } else {
      isFormValid = await acknoledgementForSewerage(state, activeStep, isFormValid, dispatch);
    }
    // responseStatus === "success" && changeStep(activeStep, state, dispatch);
  }
  if (activeStep !== 3) {
    if (isFormValid) {
      changeStep(state, dispatch);
    } else if (hasFieldToaster) {
      let errorMessage = {
        labelName: "Please fill all mandatory fields!",
        labelKey: "WS_FILL_REQUIRED_FIELDS"
      };
      switch (activeStep) {
        case 1:
          errorMessage = {
            labelName:
              "Please upload all Mandatory Document!",
            labelKey: "WS_UPLOAD_MANDATORY_DOCUMENTS"
          };
          break;
        case 2:
          errorMessage = {
            labelName:
              "Please fill all mandatory fields for Applicant Details, then proceed!",
            labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
          };
          break;
      }
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }
  }
};

const moveToSuccess = (combinedArray, dispatch) => {
  const ownershipTransfer = getQueryArg(window.location.href, "mode");
  const tenantId = get(combinedArray[0], "tenantId");
  const purpose = ownershipTransfer == "ownershipTransfer" ? "ownershipTransfer" : "apply";
  const status = "success";
  const applicationNoWater = get(combinedArray[0], "applicationNo");
  const applicationNoSewerage = get(combinedArray[1], "applicationNo");
  let mode = (isModifyMode()) ? "&mode=MODIFY" : ""
  if (applicationNoWater && applicationNoSewerage) {
    dispatch(
      setRoute(
        `/wns/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNoWater}&tenantId=${tenantId}${mode}`
      )
    );
  } else if (applicationNoWater) {
    dispatch(
      setRoute(
        `/wns/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNoWater}&tenantId=${tenantId}${mode}`
      )
    );
  } else {
    dispatch(
      setRoute(
        `/wns/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNoSewerage}&tenantId=${tenantId}${mode}`
      )
    );
  }
};

const acknoledgementForBothWaterAndSewerage = async (state, activeStep, isFormValid, dispatch) => {
  if (isFormValid) {
    if (activeStep === 0) {
      prepareDocumentsUploadData(state, dispatch);
    }
    if (activeStep === 3) {
      isFormValid = await applyForWaterOrSewerage(state, dispatch);
      let WaterConnection = get(state.screenConfiguration.preparedFinalObject, "WaterConnection");
      let SewerageConnection = get(state.screenConfiguration.preparedFinalObject, "SewerageConnection");
      let combinedArray = WaterConnection.concat(SewerageConnection)
      if (isFormValid) { moveToSuccess(combinedArray, dispatch) }
    }
    return isFormValid;
  } else if (hasFieldToaster) {
    let errorMessage = {
      labelName: "Please fill all mandatory fields and upload the documents!",
      labelKey: "ERR_UPLOAD_MANDATORY_DOCUMENTS_TOAST"
    };
    switch (activeStep) {
      case 0:
        errorMessage = {
          labelName:
            "Please check the Missing/Invalid field for Property Details, then proceed!",
          labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_PROPERTY_TOAST"
        };
        break;
      case 1:
        errorMessage = {
          labelName:
            "Please check the Missing/Invalid field for Property Details, then proceed!",
          labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_PROPERTY_TOAST"
        };
        break;
      case 2:
        errorMessage = {
          labelName:
            "Please fill all mandatory fields for Applicant Details, then proceed!",
          labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
        };
        break;
    }
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
  return !isFormValid;
}

const acknoledgementForWater = async (state, activeStep, isFormValid, dispatch) => {
  if (isFormValid) {
    if (activeStep === 0) {
      prepareDocumentsUploadData(state, dispatch);
    }
    if (activeStep === 3) {
      isFormValid = await applyForWaterOrSewerage(state, dispatch);
      let combinedArray = get(state.screenConfiguration.preparedFinalObject, "WaterConnection");
      if (isFormValid) { moveToSuccess(combinedArray, dispatch) }
    }
    return true;
  } else if (hasFieldToaster) {
    let errorMessage = {
      labelName: "Please fill all mandatory fields and upload the documents!",
      labelKey: "ERR_UPLOAD_MANDATORY_DOCUMENTS_TOAST"
    };
    switch (activeStep) {
      case 1:
        errorMessage = {
          labelName:
            "Please check the Missing/Invalid field for Property Details, then proceed!",
          labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_PROPERTY_TOAST"
        };
        break;
      case 2:
        errorMessage = {
          labelName:
            "Please fill all mandatory fields for Applicant Details, then proceed!",
          labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
        };
        break;
    }
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
  return false;
}

const acknoledgementForSewerage = async (state, activeStep, isFormValid, dispatch) => {
  if (isFormValid) {
    if (activeStep === 0) {
      prepareDocumentsUploadData(state, dispatch);
    }
    if (activeStep === 3) {
      isFormValid = await applyForWaterOrSewerage(state, dispatch);
      let combinedArray = get(state.screenConfiguration.preparedFinalObject, "SewerageConnection");
      if (isFormValid) { moveToSuccess(combinedArray, dispatch) }
    }
    return true;
  } else if (hasFieldToaster) {
    let errorMessage = {
      labelName: "Please fill all mandatory fields and upload the documents!",
      labelKey: "ERR_UPLOAD_MANDATORY_DOCUMENTS_TOAST"
    };
    switch (activeStep) {
      case 1:
        errorMessage = {
          labelName:
            "Please check the Missing/Invalid field for Property Details, then proceed!",
          labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_PROPERTY_TOAST"
        };
        break;
      case 2:
        errorMessage = {
          labelName:
            "Please fill all mandatory fields for Applicant Details, then proceed!",
          labelKey: "ERR_FILL_ALL_MANDATORY_FIELDS_APPLICANT_TOAST"
        };
        break;
    }
    dispatch(toggleSnackbar(true, errorMessage, "warning"));
  }
  return false;
}

export const changeStep = (
  state,
  dispatch,
  mode = "next",
  defaultActiveStep = -1
) => {
  window.scrollTo(0, 0);
  let activeStep = get(state.screenConfiguration.screenConfig["apply"], "components.div.children.stepper.props.activeStep", 0);
  if (defaultActiveStep === -1) {
    if (activeStep === 1 && mode === "next") {
      // const isDocsUploaded = get(
      //   state.screenConfiguration.preparedFinalObject,
      //   "applyScreen.documents",
      //   null
      // );
      //since docs section is non mandatory now
      const isDocsUploaded = true;
      if (isDocsUploaded) {
        activeStep = ((process.env.REACT_APP_NAME === "Citizen" && !isModifyMode()) || (process.env.REACT_APP_NAME !== "Citizen" && isOwnerShipTransfer())) ? 3 : 2;
      } else if (isModifyMode()) {
        activeStep = 2;
      }
    } else if ((process.env.REACT_APP_NAME === "Citizen" && activeStep === 3 && !isModifyMode()) ||
      process.env.REACT_APP_NAME !== "Citizen" && isOwnerShipTransfer() && activeStep === 3) {
      activeStep = mode === "next" ? activeStep + 1 : activeStep - 2;
    } else {
      activeStep = mode === "next" ? activeStep + 1 : activeStep - 1;
    }
  } else {
    activeStep = defaultActiveStep;
  }
  if (activeStep === 0) {
    let conHolders = get(state, "screenConfiguration.preparedFinalObject.applyScreen.connectionHolders");
    let isCheckedSameAsProperty = (conHolders && conHolders.length > 0 && !conHolders[0].sameAsPropertyAddress) ? false : true;
    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardFirstStep.children.connectionHolderDetails.children.cardContent.children.sameAsOwner.children.sameAsOwnerDetails",
        "props.isChecked",
        isCheckedSameAsProperty
      )
    )
  }

  const isPreviousButtonVisible = activeStep > 0 ? true : false;
  const isNextButtonVisible = isNextButton(activeStep);
  const isPayButtonVisible = activeStep === 3 ? true : false;
  const actionDefination = [
    {
      path: "components.div.children.stepper.props",
      property: "activeStep",
      value: activeStep
    },
    {
      path: "components.div.children.footer.children.previousButton",
      property: "visible",
      value: isPreviousButtonVisible
    },
    {
      path: "components.div.children.footer.children.nextButton",
      property: "visible",
      value: isNextButtonVisible
    },
    {
      path: "components.div.children.footer.children.payButton",
      property: "visible",
      value: isPayButtonVisible
    }
  ];
  dispatchMultipleFieldChangeAction("apply", actionDefination, dispatch);
  if ((process.env.REACT_APP_NAME === "Citizen" && !isModifyMode()) || (process.env.REACT_APP_NAME !== "Citizen" && isOwnerShipTransfer())) { renderStepsCitizen(activeStep, dispatch); }
  else { renderSteps(activeStep, dispatch,state); }
}

export const isNextButton = (activeStep) => {
  if(isModifyMode() && activeStep < 3) { return true; }
  if ((process.env.REACT_APP_NAME === "Citizen" && activeStep < 2) || 
  process.env.REACT_APP_NAME !== 'Citizen' && activeStep < 2 && isOwnerShipTransfer()) { return true; }
  else if (process.env.REACT_APP_NAME !== "Citizen" && activeStep < 3) { return true; }
  else return false
}

export const renderSteps = (activeStep, dispatch, state) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      let mStepSecond = (isModifyMode()) ? 'formwizardThirdStep' : 'formwizardSecondStep';
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          `components.div.children.${mStepSecond}`
        ),
        dispatch
      );
      break;
    case 2:
      let mStep = (isModifyMode()) ? 'formwizardSecondStep' : 'formwizardThirdStep';
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          `components.div.children.${mStep}`
        ),
        dispatch
      );
      break;
    default:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardFourthStep"
        ),
        dispatch
      );

  }
};

export const renderStepsCitizen = (activeStep, dispatch) => {
  switch (activeStep) {
    case 0:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardFirstStep"
        ),
        dispatch
      );
      break;
    case 1:
      let mStepSecond = (isModifyMode()) ? 'formwizardThirdStep' : 'formwizardSecondStep';
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          `components.div.children.${mStepSecond}`
        ),
        dispatch
      );
      break;
    case 2:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardFourthStep"
        ),
        dispatch
      );
      break;
    default:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardFourthStep"
        ),
        dispatch
      );
  }
};

export const getActionDefinationForStepper = path => {
  let actionDefination = [];
  if ((process.env.REACT_APP_NAME === "Citizen" && !isModifyMode()) || (process.env.REACT_APP_NAME !== 'Citizen' && isOwnerShipTransfer())) {
    actionDefination = [
      {
        path: "components.div.children.formwizardFirstStep",
        property: "visible",
        value: true
      },
      {
        path: "components.div.children.formwizardSecondStep",
        property: "visible",
        value: false
      },
      {
        path: "components.div.children.formwizardFourthStep",
        property: "visible",
        value: false
      }
    ];
  } else {
    let mStep1 = "formwizardThirdStep";
    let mStep2 = "formwizardSecondStep";

    if (isModifyMode()) {
      mStep1 = "formwizardSecondStep";
      mStep2 = "formwizardThirdStep";
    }

    actionDefination = [
      {
        path: "components.div.children.formwizardFirstStep",
        property: "visible",
        value: true
      },
      {
        path: `components.div.children.${mStep2}`,
        property: "visible",
        value: false
      },
      {
        path: `components.div.children.${mStep1}`,
        property: "visible",
        value: false
      },
      {
        path: "components.div.children.formwizardFourthStep",
        property: "visible",
        value: false
      }
    ];
  }
  for (var i = 0; i < actionDefination.length; i++) {
    actionDefination[i] = { ...actionDefination[i], value: false };
    if (path === actionDefination[i].path) {
      actionDefination[i] = { ...actionDefination[i], value: true };
    }
  }
  return actionDefination;
};

export const callBackForPrevious = (state, dispatch) => {
  window.scrollTo(0, 0);
  changeStep(state, dispatch, "previous");
};

export const footer = getCommonApplyFooter("BOTTOM", {
  previousButton: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        // minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      }
    },
    children: {
      previousButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_left"
        }
      },
      previousButtonLabel: getLabel({
        labelName: "Previous Step",
        labelKey: "WS_COMMON_BUTTON_PREV_STEP"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForPrevious
    },
    visible: false
  },
  nextButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        // minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "Next Step",
        labelKey: "WS_COMMON_BUTTON_NXT_STEP"
      }),
      nextButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForNext
    }
  },
  payButton: {
    componentPath: "Button",
    props: {
      variant: "contained",
      color: "primary",
      style: {
        //minWidth: "200px",
        height: "48px",
        marginRight: "45px"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Submit",
        labelKey: "WS_COMMON_BUTTON_SUBMIT"
      }),
      submitButtonIcon: {
        uiFramework: "custom-atoms",
        componentPath: "Icon",
        props: {
          iconName: "keyboard_arrow_right"
        }
      }
    },
    onClickDefination: {
      action: "condition",
      callBack: callBackForNext
    },
    visible: false
  }
});

export const footerReview = (
  action,
  state,
  dispatch,
  status) => {
  let tlCertificateDownloadObject = {
    label: { labelName: "TL Certificate", labelKey: "WSCERTIFICATE" },
    link: () => {
      const { Licenses } = state.screenConfiguration.preparedFinalObject;
      downloadCertificateForm(Licenses);
    },
    leftIcon: "book"
  };
  let tlCertificatePrintObject = {
    label: { labelName: "TL Certificate", labelKey: "WSCERTIFICATE" },
    link: () => {
      const { Licenses } = state.screenConfiguration.preparedFinalObject;
      downloadCertificateForm(Licenses, 'print');
    },
    leftIcon: "book"
  };
  let receiptDownloadObject = {
    label: { labelName: "Receipt", labelKey: "WSRECEIPT" },
    link: () => {


      const receiptQueryString = [
        { key: "consumerCodes", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "applicationNumber") },
        { key: "tenantId", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "tenantId") }
      ]
      download(receiptQueryString);
      // generateReceipt(state, dispatch, "receipt_download");
    },
    leftIcon: "receipt"
  };
  let receiptPrintObject = {
    label: { labelName: "Receipt", labelKey: "WSRECEIPT" },
    link: () => {
      const receiptQueryString = [
        { key: "consumerCodes", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "applicationNumber") },
        { key: "tenantId", value: get(state.screenConfiguration.preparedFinalObject.Licenses[0], "tenantId") }
      ]
      download(receiptQueryString, "print");
      // generateReceipt(state, dispatch, "receipt_print");
    },
    leftIcon: "receipt"
  };
  let applicationDownloadObject = {
    label: { labelName: "Application", labelKey: "WSAPPLICATION" },
    link: () => {
      const { Licenses, LicensesTemp } = state.screenConfiguration.preparedFinalObject;
      const documents = LicensesTemp[0].reviewDocData;
      set(Licenses[0], "additionalDetails.documents", documents)
      downloadAcknowledgementForm(Licenses);
    },
    leftIcon: "assignment"
  };
  let applicationPrintObject = {
    label: { labelName: "Application", labelKey: "WSAPPLICATION" },
    link: () => {
      const { Licenses, LicensesTemp } = state.screenConfiguration.preparedFinalObject;
      const documents = LicensesTemp[0].reviewDocData;
      set(Licenses[0], "additionalDetails.documents", documents)
      downloadAcknowledgementForm(Licenses, 'print');
    },
    leftIcon: "assignment"
  };
  switch (status) {
    case "APPROVED":
      break;
    case "APPLIED":
    case "CITIZENACTIONREQUIRED":
    case "FIELDINSPECTION":
    case "PENDINGAPPROVAL":
    case "PENDINGPAYMENT":
      break;
    case "pending_approval":
      break;
    case "CANCELLED":
      break;
    case "REJECTED":
      break;
    default:
      break;
  }
}

export const getInstallmentCard = (dispatch, state) => {
  let waterData = get(state, "screenConfiguration.preparedFinalObject.WaterConnection");
    let connectionCategory = get(state, "screenConfiguration.preparedFinalObject.applyScreen.connectionCategory");
    let usageCategory = get(state, "screenConfiguration.preparedFinalObject.applyScreen.usageCategory")
    let isApartment = get(state, "screenConfiguration.preparedFinalObject.applyScreen.apartment")
    let connectionType = get(state, "screenConfiguration.preparedFinalObject.applyScreen.connectionType")
    console.log(connectionCategory, usageCategory, isApartment, connectionType, "Nero connectionType")
      if(process.env.REACT_APP_NAME === "Employee"){
          if (waterData && waterData.length > 0){
            
            if(connectionType === "Non Metered" && connectionCategory == "PERMANENT" && (!isApartment || isApartment=="No")){
              dispatch(
                handleField(
                  "apply",
                  `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer`,
                  "visible",
                  true
                )
              );
              
            if(usageCategory == "DOMESTIC"){

              
              showHideLabourAndScrutinyFeeFeilds(dispatch, "DO_NOTHING", state);
            }else if(usageCategory == "BPL"){

              
              showHideLabourAndScrutinyFeeFeilds(dispatch, "HIDE_SCRUTINY", state);

            }else{

              
              showHideLabourAndScrutinyFeeFeilds(dispatch, "HIDE_FEE_CARD", state);  

            }
    
            showHideLabourAndScrutinyFeeFeilds(dispatch, "INITIALIZE", state);
    
          }else if(connectionType === "Non Metered" && connectionCategory == "TEMPORARY" && (!isApartment || isApartment=="No")){

            dispatch(
              handleField(
                "apply",
                `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer`,
                "visible",
                true
              )
            );
           
              if(usageCategory == "ROADSIDEEATERS"){

                
                showHideLabourAndScrutinyFeeFeilds(dispatch, "HIDE_SCRUTINY", state);

              }else{

                
                showHideLabourAndScrutinyFeeFeilds(dispatch, "HIDE_FEE_CARD", state); 

              }
  
         // showHideLabourAndScrutinyFeeFeilds(dispatch, "INITIALIZE", state);


          }else if(connectionType === "Metered" && connectionCategory == "TEMPORARY" && (!isApartment || isApartment=="No")){

            dispatch(
              handleField(
                "apply",
                `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer`,
                "visible",
                true
              )
            );
           
              if(usageCategory == "DOMESTIC"){

                
                showHideLabourAndScrutinyFeeFeilds(dispatch, "HIDE_SCRUTINY", state);

              }else{

                
                showHideLabourAndScrutinyFeeFeilds(dispatch, "HIDE_FEE_CARD", state); 

              }
  
         // showHideLabourAndScrutinyFeeFeilds(dispatch, "INITIALIZE", state);


          }else if(connectionType === "Metered" && connectionCategory == "PERMANENT" && (!isApartment || isApartment=="No")){
            dispatch(
              handleField(
                "apply",
                `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer`,
                "visible",
                true
              )
            );
            
          if(usageCategory == "DOMESTIC"){

            
            showHideLabourAndScrutinyFeeFeilds(dispatch, "DO_NOTHING", state);
          }else if(usageCategory == "BPL"){

            
            showHideLabourAndScrutinyFeeFeilds(dispatch, "HIDE_SCRUTINY", state);

          }else{

            
            showHideLabourAndScrutinyFeeFeilds(dispatch, "HIDE_FEE_CARD", state);  

          }
  
          showHideLabourAndScrutinyFeeFeilds(dispatch, "INITIALIZE", state);
  
        }else{
            
            showHideLabourAndScrutinyFeeFeilds(dispatch, "HIDE_FEE_CARD", state);
          }
    
          }
        }
}

const showHideLabourAndScrutinyFeeFeilds = (dispatch, value, state) => {

  let scrutinyFeeInfo = get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData.ws-services-calculation.ScrutinyFeeInstallmentsInfo");
  let usageCategory = get(state, "screenConfiguration.preparedFinalObject.applyScreen.usageCategory");
  let applyScreen = get(state, "screenConfiguration.preparedFinalObject.applyScreen");
  let WaterConnection = get(state, "screenConfiguration.preparedFinalObject.WaterConnection");


  //let usageCategory = get(state, "screenConfiguration.preparedFinalObject.applyScreen.usageCategory");
          let labourFeeInfo = get(state, "screenConfiguration.preparedFinalObject.applyScreenMdmsData.ws-services-calculation.LabourFeeInstallmentsInfo");
          let selectedLabourInstallment = labourFeeInfo && labourFeeInfo.filter(item => item.usageCategory === usageCategory)
  
  let selectedScrutinyFee = scrutinyFeeInfo && scrutinyFeeInfo.filter(item => item.usageCategory === usageCategory)
        

  if(value === "HIDE_SCRUTINY"){
    let showHideScrutinyFeeFields =  [{
      path: "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.scrutinyFeeDetails",
      property: "visible",
      value: false
    },
    {
      path: "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.scrutinyFeeSubHeader",
      property: "visible",
      value: false
    }]
    dispatchMultipleFieldChangeAction("apply", showHideScrutinyFeeFields, dispatch);
  }

  if(value === "HIDE_FEE_CARD"){
    let actionDefinitions =  [{
      path: "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer",
      property: "visible",
      value: false
    }
  ]
    dispatchMultipleFieldChangeAction("apply", actionDefinitions, dispatch);
  }

  if(value == "INITIALIZE" && (WaterConnection && WaterConnection[0].applicationStatus == "INITIATED")){
    if(applyScreen && applyScreen.usageCategory == "DOMESTIC"){
      if(WaterConnection[0].applicationType == "NEW_CONNECTION"){
      dispatch(prepareFinalObject(
        "applyScreen.additionalDetails.isInstallmentApplicableForScrutinyFee", "N"
      ))
    }
      dispatch(prepareFinalObject(
        "applyScreen.additionalDetails.scrutinyFeeTotalAmount", selectedScrutinyFee && selectedScrutinyFee[0].totalAmount
      ))
    }
  }

  if(WaterConnection && WaterConnection[0].applicationStatus  == "PENDING_FOR_CITIZEN_ACTION" || WaterConnection[0].applicationStatus == "PENDING_FOR_FIELD_INSPECTION" || (WaterConnection[0].applicationStatus == "INITIATED" && WaterConnection[0].applicationType == "MODIFY_CONNECTION")){
    if(applyScreen && applyScreen.additionalDetails.isLabourFeeApplicable == "Y"){
      if(applyScreen && applyScreen.additionalDetails.isInstallmentApplicable == "Y"){
        
          let actionDefinitions =  [{
            path: "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.activeDetails.children.noOfLabourFeeInstallments",
            property: "visible",
            value: true
          },
          {
            path: "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.activeDetails.children.labourInstallmentAmount",
            property: "visible",
            value: true
          },
          {
            path: "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.activeDetails.children.isInstallmentApplicable",
            property: "visible",
            value: true
          },
          {
            path: "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.activeDetails.children.subHeader1.children.key.props",
            property: "labelKey",
            value: `Labour Fee Amount - ${selectedLabourInstallment && selectedLabourInstallment[0].totalAmount}`
          }
        ]
        dispatchMultipleFieldChangeAction("apply", actionDefinitions, dispatch);
      }
      if(applyScreen && applyScreen.additionalDetails.isInstallmentApplicable == "N"){
        
          let actionDefinitions =  [{
            path: "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.activeDetails.children.noOfLabourFeeInstallments",
            property: "visible",
            value: false
          },
          {
            path: "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.activeDetails.children.labourInstallmentAmount",
            property: "visible",
            value: false
          },
          {
            path: "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.activeDetails.children.isInstallmentApplicable",
            property: "visible",
            value: true
          },
          
          {
            path: "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.activeDetails.children.subHeader1.children.key.props",
            property: "labelKey",
            value: `Labour Fee Amount - ${selectedLabourInstallment && selectedLabourInstallment[0].totalAmount}`
          }
        ]
        dispatchMultipleFieldChangeAction("apply", actionDefinitions, dispatch);
      }

  }

    if(applyScreen && applyScreen.additionalDetails.isInstallmentApplicableForScrutinyFee == "Y"){
      
        let actionDefinitions =  [{
          path: "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.scrutinyFeeDetails.children.noOfScrutinyInstallments",
          property: "visible",
          value: true
        },
        {
          path: "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.scrutinyFeeDetails.children.scrutinyInstallmentAmount",
          property: "visible",
          value: true
        }
      ]
      dispatchMultipleFieldChangeAction("apply", actionDefinitions, dispatch);
    }
  }else if(WaterConnection && WaterConnection[0].applicationStatus == "PENDING_FOR_DOCUMENT_VERIFICATION"){

    let actionDefinitions1 =  [{
      path: "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer",
      property: "visible",
      value: false,
    },
    
  ]
  dispatchMultipleFieldChangeAction("apply", actionDefinitions1, dispatch);

  }else if((WaterConnection && WaterConnection[0].applicationStatus != "PENDING_FOR_CITIZEN_ACTION") && (WaterConnection && WaterConnection[0].applicationStatus != "PENDING_FOR_FIELD_INSPECTION") && (WaterConnection && WaterConnection[0].applicationStatus  != "INITIATED")){
    
    if(applyScreen && applyScreen.additionalDetails.isLabourFeeApplicable == "Y"){
      if(applyScreen && applyScreen.additionalDetails.isInstallmentApplicable == "Y"){
        
          let actionDefinitions =  [{
            path: "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.activeDetails.children.noOfLabourFeeInstallments",
            property: "visible",
            value: true
          },
          {
            path: "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.activeDetails.children.labourInstallmentAmount",
            property: "visible",
            value: true
          },
          {
            path: "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.activeDetails.children.subHeader1.children.key.props",
            property: "labelKey",
            value: `Labour Fee Amount - ${selectedLabourInstallment && selectedLabourInstallment[0].totalAmount}`
          }
        ]
        dispatchMultipleFieldChangeAction("apply", actionDefinitions, dispatch);
      }
      if(applyScreen && applyScreen.additionalDetails.isInstallmentApplicable == "N"){
        
          let actionDefinitions =  [{
            path: "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.activeDetails.children.noOfLabourFeeInstallments",
            property: "visible",
            value: false
          },
          {
            path: "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.activeDetails.children.labourInstallmentAmount",
            property: "visible",
            value: false
          },
          {
            path: "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.activeDetails.children.isInstallmentApplicable",
            property: "visible",
            value: true
          },
          {
            path: "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.activeDetails.children.subHeader1.children.key.props",
            property: "labelKey",
            value: `Labour Fee Amount - ${selectedLabourInstallment && selectedLabourInstallment[0].totalAmount}`
          }
        ]
        dispatchMultipleFieldChangeAction("apply", actionDefinitions, dispatch);
      }
  }

    if(applyScreen && applyScreen.additionalDetails.isInstallmentApplicableForScrutinyFee == "Y"){
      
        let actionDefinitions =  [{
          path: "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.scrutinyFeeDetails.children.noOfScrutinyInstallments",
          property: "visible",
          value: true
        },
        {
          path: "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.scrutinyFeeDetails.children.scrutinyInstallmentAmount",
          property: "visible",
          value: true
        }
      ]
      dispatchMultipleFieldChangeAction("apply", actionDefinitions, dispatch);
    }
    let actionDefinitions1 =  [{
      path: "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.props.style",
      property: "pointerEvents",
      value: "none",
    }]
  dispatchMultipleFieldChangeAction("apply", actionDefinitions1, dispatch);

    

  }
  

  if (isModifyMode()) {
    let actionDefinitions1 =  [{
      path: "components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.props.style",
      property: "pointerEvents",
      value: "none",
    }]
  dispatchMultipleFieldChangeAction("apply", actionDefinitions1, dispatch);
  }
  

}