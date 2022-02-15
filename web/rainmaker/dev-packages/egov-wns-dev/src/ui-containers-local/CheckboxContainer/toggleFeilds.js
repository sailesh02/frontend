import set from "lodash/set";
import { isModifyMode } from "./../../ui-utils/commons";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import store from "ui-redux/store";
export const toggleWater = (onFieldChange, value,step) => {
  // set('search-preview', "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewFour.props.items[0].item0.children.cardContent.children.serviceCardContainerForWater.visible", value);
  let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
  let isMode = isModifyMode();
  let mStep = (isMode) ? 'formwizardSecondStep' : 'formwizardThirdStep';
  if(step){
    mStep = "formwizardThirdStep"
  }
  // onFieldChange(
  //   "apply",
  //   "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.pipeSize",
  //   "visible",
  //   value
  // );
  onFieldChange(
    "apply",
    "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.numberOfTaps",
    "visible",
    value
  );
  onFieldChange(
    "apply",
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.connectionType`,
    "visible",
    value
  );
  onFieldChange(
    "apply",
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.numberOfTaps`,
    "visible",
    value
  );
  
  onFieldChange(
    "apply",
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.dynamicMdmsWaterSource`,
    "visible",
    value
  );
  // onFieldChange(
  //   "apply",
  //   `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.pipeSize`,
  //   "visible",
  //   value
  // );
  onFieldChange(
    "apply",
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterID`,
    "visible",
    value
  );
  onFieldChange(
    "apply",
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterInstallationDate`,
    "visible",
    value
  );
  onFieldChange(
    "apply",
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.initialMeterReading`,
    "visible",
    value
  );
  onFieldChange(
    "apply",
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterMake`,
    "visible",
    value
  );
  onFieldChange(
    "apply",
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterReadingRatio`,
    "visible",
    value
  );
  if((!applicationNumber && process.env.REACT_APP_NAME != 'Citizen') || (window && window.location && window.location.pathname &&
    window.location.pathname.includes('apply') && applicationNumber && process.env.REACT_APP_NAME != 'Citizen' && !isModifyMode()) ){
    onFieldChange(
      "apply",
      `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.paymentDetailsContainer`,
      "visible",
      value
    );
    onFieldChange(
      "apply",
      `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.volumetricDetails`,
      "visible",
      value
    );
  }

  onFieldChange(
    "apply",
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.activeDetails.children.isLabourFeeApplicable`,
    "visible",
    value
  );
  onFieldChange(
    "apply",
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.activeDetails.children.isInstallmentApplicable`,
    "visible",
    value
  );

  onFieldChange(
    "apply",
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.volumetricDetails.children.cardContent.children.activeDetails.children.isVolumetricConnection`,
    "visible",
    value
  );
  onFieldChange(
    "apply",
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.volumetricDetails.children.cardContent.children.activeDetails.children.volumetricWaterCharge`,
    "visible",
    value
  );

  onFieldChange(
    "apply",
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.volumetricDetails.children.cardContent.children.activeDetails.children.dailyConsumption`,
    "visible",
    value
  );

  onFieldChange(
    "apply",
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.volumetricDetails.children.cardContent.children.activeDetails.children.consumptionInKL`,
    "visible",
    value
  );
  
  // onFieldChange(
  //   "apply",
  //   "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewConnDetails.children.cardContent.children.viewFour.children.view.children.taskPipeSizeProposed",
  //   "visible",
  //   value
  // );
  onFieldChange(
    "apply",
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewConnDetails.children.cardContent.children.viewFour.children.view.children.taskNumberOfTapsPropsed",
    "visible",
    value
  );
  // onFieldChange(
  //   "apply",
  //   "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSix.children.reviewPipeSize",
  //   "visible",
  //   value
  // );
  onFieldChange(
    "apply",
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSix.children.reviewWaterSubSource",
    "visible",
    value
  );
  onFieldChange(
    "apply",
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSix.children.reviewWaterSource",
    "visible",
    value
  );
  onFieldChange(
    "apply",
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSix.children.reviewNumberOfTaps",
    "visible",
    value
  );
  onFieldChange(
    "apply",
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSix.children.reviewConnectionType",
    "visible",
    value
  );
  // onFieldChange(
  //   "apply",
  //   "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewConnDetails.children.cardContent.children.viewFour.children.view.children.taskPipeSizeProposed",
  //   "visible",
  //   value
  // );
  onFieldChange(
    "apply",
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSix.children.reviewNumberOfTaps",
    "visible",
    value
  );
  onFieldChange(
    "apply",
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterId",
    "visible",
    value
  );
  onFieldChange(
    "apply",
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterInstallationDate",
    "visible",
    value
  );
  onFieldChange(
    "apply",
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewInitialMeterReading",
    "visible",
    value
  );
  onFieldChange(
    "apply",
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterMake",
    "visible",
    value
  );

  if((!applicationNumber && process.env.REACT_APP_NAME != "Citizen") || (window && window.location && window.location.pathname &&
    window.location.pathname.includes('apply') && applicationNumber && process.env.REACT_APP_NAME != 'Citizen' && !isModifyMode())){
    onFieldChange(
      "apply",
      "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewThirdTeen",
      "visible",
      value
    );
  }
  onFieldChange(
    "apply",
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourTeen.children.reviewLaborCharge",
    "visible",
    value
  );
  onFieldChange(
    "apply",
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourTeen",
    "visible",
    value
  );
  onFieldChange(
    "apply",
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourTeen",
    "visible",
    value
  );
  onFieldChange(
    "apply",
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewFourTeen.children.reviewInstallment",
    "visible",
    value
  );
  onFieldChange(
    "apply",
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterRatio",
    "visible",
    value
  );
}

export const setDataBasedOnFacility = (onFieldChange) => {

  let state = store.getState();
  console.log(state, "Nero State in toggle")
  let isWaterSet = state && state.screenConfiguration && state.screenConfiguration.preparedFinalObject &&
  state.screenConfiguration.preparedFinalObject.applyScreen && state.screenConfiguration.preparedFinalObject.applyScreen.water
  
  let isSewerageSet = state && state.screenConfiguration && state.screenConfiguration.preparedFinalObject &&
  state.screenConfiguration.preparedFinalObject.applyScreen && state.screenConfiguration.preparedFinalObject.applyScreen.sewerage
  if(!isWaterSet && isSewerageSet){
    console.log("Here")
  onFieldChange(
    "apply",
    "components.div.children.formwizardFirstStep.children.PropertyDetailsNoId.children.cardContent.children.propertyDetailsNoId.children.holderDetails.children.connectionCategory.props",
    "data",
    [{ code: "PERMANENT" }]
  );
}else{
  console.log("in Else")
  onFieldChange(
    "apply",
    "components.div.children.formwizardFirstStep.children.PropertyDetailsNoId.children.cardContent.children.propertyDetailsNoId.children.holderDetails.children.connectionCategory.props",
    "data",
    [{ code: "PERMANENT" }, { code: "TEMPORARY" }]
  );
}

}
export const toggleSewerage = (onFieldChange, value,step) => {
  let isMode = isModifyMode();
  let mStep = (isMode) ? 'formwizardSecondStep' : 'formwizardThirdStep';
  // set('search-preview', "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewFour.props.items[0].item0.children.cardContent.children.serviceCardContainerForSW.visible", value);
  if(step){
    mStep = "formwizardThirdStep"
  }
  onFieldChange(
    "apply",
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.diameter`,
    "visible",
    value
  );

  onFieldChange(
    "apply",
    "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.pipeSize",
    "visible",
    value
  );

  onFieldChange(
    "apply",
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewDiameter",
    "visible",
    value
  );

  onFieldChange(
    "apply",
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSix.children.reviewConnectionType",
    "props.value",
    "Non Metered"
  );
  onFieldChange(
    "apply",
    "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.numberOfToilets",
    "visible",
    value
  );
  onFieldChange(
    "apply",
    "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.numberOfWaterClosets",
    "visible",
    value
  );
  onFieldChange(
    "apply",
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.noOfToilets`,
    "visible",
    value
  );
  onFieldChange(
    "apply",
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.noOfWaterClosets`,
    "visible",
    value
  );
  onFieldChange(
    "apply",
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.pipeSize`,
    "visible",
    value
  );
  onFieldChange(
    "apply",
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewConnDetails.children.cardContent.children.viewFour.children.view.children.taskPipeSizeProposed",
    "visible",
    value
  );
  onFieldChange(
    "apply",
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSix.children.reviewPipeSize",
    "visible",
    value
  );
  onFieldChange(
    "apply",
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewConnDetails.children.cardContent.children.viewFour.children.view.children.taskNoOfClosets",
    "visible",
    value
  );
  onFieldChange(
    "apply",
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewConnDetails.children.cardContent.children.viewFour.children.view.children.taskNoOfToilets",
    "visible",
    value
  );
  onFieldChange(
    "apply",
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSix.children.reviewWaterClosets",
    "visible",
    value
  );
  onFieldChange(
    "apply",
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewConnDetails.children.cardContent.children.viewFour.children.view.children.taskPipeSizeProposed",
    "visible",
    value
  );
  onFieldChange(
    "apply",
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSix.children.reviewNumberOfToilets",
    "visible",
    value
  );
}

export const togglePlumberFeilds = (onFieldChange, value) => {
  let isMode = isModifyMode();
  let mStep = (isMode) ? 'formwizardSecondStep' : 'formwizardThirdStep';
  onFieldChange(
    "apply",
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.plumberDetailsContainer.children.cardContent.children.plumberDetails.children.plumberLicenceNo`,
    "visible",
    value
  );
  onFieldChange(
    "apply",
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.plumberDetailsContainer.children.cardContent.children.plumberDetails.children.plumberName`,
    "visible",
    value
  );
  onFieldChange(
    "apply",
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.plumberDetailsContainer.children.cardContent.children.plumberDetails.children.plumberMobNo`,
    "visible",
    value
  );
  onFieldChange(
    "apply",
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewEight.children.reviewPlumberMobileNo",
    "visible",
    value
  );
  onFieldChange(
    "apply",
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewEight.children.reviewPlumberName",
    "visible",
    value
  );
  onFieldChange(
    "apply",
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewEight.children.reviewPlumberLicenseNo",
    "visible",
    value
  );
}

export const toggleConnHolderDetails = (onFieldChange, value) => {
  onFieldChange(
    "apply",
    "components.div.children.formwizardFirstStep.children.connectionHolderDetails.children.cardContent.children.holderDetails.children.holderDetails",
    "visible",
    value
  );
  onFieldChange(
    "apply",
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewConnDetails.children.cardContent.children.viewSix",
    "visible",
    !value
  );
  onFieldChange(
    "apply",
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewConnDetails.children.cardContent.children.viewFive",
    "visible",
    value
  );
}

export const toggleFlatDetails = (onFieldChange, value) => {
  onFieldChange(
    "apply",
    "components.div.children.formwizardFirstStep.children.PropertyDetailsNoId.children.cardContent.children.propertyDetailsNoId.children.holderDetails.children.noOfFlats",
    "visible",
    value
  );
}

export const toggleConnectionTypeDetails = (onFieldChange, value) => {
  onFieldChange(
    "apply",
    "components.div.children.formwizardFirstStep.children.PropertyDetailsNoId.children.cardContent.children.propertyDetailsNoId.children.holderDetails.children.connectionType",
    "visible",
    value
  ); 

  // dispatch(
  //   handleField(
  //     "apply",
  //     "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewConnDetails.children.cardContent.children.viewOne.props.scheama.children.cardContent.children.getPropertyDetailsContainer.children.connectionType",
  //     "visible",
  //     value
  //   )
  // );


}

export const togglePropertyFeilds = (action, value) => {
  set(
    action.screenConfig,
    "components.div.children.formwizardFirstStep.children.IDDetails.children.cardContent.children.propertyIDDetails.visible",
    value
  );
  set(
    action.screenConfig,
    "components.div.children.formwizardFirstStep.children.Details.visible",
    value
  );
  set(
    action.screenConfig,
    "components.div.children.formwizardFirstStep.children.ownerDetails.visible",
    value
  );
  set(
    action.screenConfig,
    "components.div.children.formwizardFirstStep.children.connectionHolderDetails.visible",
    value
  );

}

export const toggleSewerageFeilds = (action, value) => {
  let isMode = isModifyMode();
  let mStep = (isMode) ? 'formwizardThirdStep' : 'formwizardThirdStep';
  // set('search-preview', "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewFour.props.items[0].item0.children.cardContent.children.serviceCardContainerForSW.visible", value);
  // set('search-preview', "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewFour.props.items[0].item0.children.cardContent.children.serviceCardContainerForWater.visible", true);
  
  if(process.env.REACT_APP_NAME !== "Citizen" && isModifyMode()){
    set(
      action.screenConfig,
      `components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewDiameter.visible`,
      true
    );
  }

  set(
    action.screenConfig,
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.diameter.visible`,
    value
  );
  set(
    action.screenConfig,
    "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.pipeSize.visible",
    value
  );
  set(
    action.screenConfig,
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.pipeSize.visible`,
    value
  );
  set(
    action.screenConfig,
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.noOfToilets.visible`,
    value
  );
  set(
    action.screenConfig,
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.noOfWaterClosets.visible`,
    value
  );
  if (!value) {
    if(process.env.REACT_APP_NAME !== "Citizen" && isModifyMode()){
      set(
        action.screenConfig,
        `components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewDiameter.visible`,
        true
      );
    }
    set(
      action.screenConfig,
      `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.diameter.visible`,
      value
    );
       set(
      action.screenConfig,
      `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.pipeSize.visible`,
      value
    );
     set(
    action.screenConfig,
    "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.pipeSize.visible",
    value
  );
    set(
    action.screenConfig,
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewConnDetails.children.cardContent.children.viewFour.children.view.children.taskPipeSizeProposed.visible",
    value
  );
  set(
    action.screenConfig,
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSix.children.reviewPipeSize.visible",
    value
  );
    set(
      action.screenConfig,
      `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.noOfToilets.visible`,
      value
    );
    set(
      action.screenConfig,
      `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.noOfWaterClosets.visible`,
      value
    );
  }
  set(
    action.screenConfig,
    "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.numberOfToilets.visible",
    value
  );
  set(
    action.screenConfig,
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewConnDetails.children.cardContent.children.viewFour.children.view.children.taskNoOfToilets.visible",
    value
  );
  set(
    action.screenConfig,
    "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.numberOfWaterClosets.visible",
    value
  );
  set(
    action.screenConfig,
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewConnDetails.children.cardContent.children.viewFour.children.view.children.taskNoOfClosets.visible",
    value
  );
  set(
    action.screenConfig,
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSix.children.reviewWaterClosets.visible",
    value
  );
  set(
    action.screenConfig,
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewConnDetails.children.cardContent.children.viewFour.children.view.children.taskPipeSizeProposed.visible",
    value
  );
  set(
    action.screenConfig,
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSix.children.reviewNumberOfToilets.visible",
    value
  )
}

export const toggleWaterFeilds = (action, value) => {
  let isMode = isModifyMode();
  let mStep = (isMode) ? 'formwizardThirdStep' : 'formwizardThirdStep';
  let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
  if(process.env.REACT_APP_NAME !== "Citizen"){
    set(
      action.screenConfig,
      `components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewDiameter.visible`,
      false
    );
  }

  if(process.env.REACT_APP_NAME !== "Citizen" && isModifyMode()){
    set(
      action.screenConfig,
      `components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewDiameter.visible`,
      true
    );
  }

  // set('search-preview', "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewFour.props.items[0].item0.children.cardContent.children.serviceCardContainerForSW.visible", false);
  // set('search-preview', "components.div.children.taskDetails.children.cardContent.children.reviewConnectionDetails.children.cardContent.children.viewFour.props.items[0].item0.children.cardContent.children.serviceCardContainerForWater.visible", value);
  set(
    action.screenConfig,
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.connectionType.visible`,
    value
  );
  set(
    action.screenConfig,
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.numberOfTaps.visible`,
    value
  );
  set(
    action.screenConfig,
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.waterSourceType.visible`,
    value
  );
  set(
    action.screenConfig,
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.waterSubSource.visible`,
    value
  );

  if(isModifyMode()){
    set(
      action.screenConfig,
      `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.dynamicMdmsWaterSource.visible`,
      value
    );
    
  }
  // set(
  //   action.screenConfig,
  //   `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.pipeSize.visible`,
  //   value
  // );
  set(
    action.screenConfig,
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterID.visible`,
    value
  );
  set(
    action.screenConfig,
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterInstallationDate.visible`,
    value
  );
  set(
    action.screenConfig,
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.initialMeterReading.visible`,
    value
  );
  set(
    action.screenConfig,
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterMake.visible`,
    value
  );
  set(
    action.screenConfig,
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterReadingRatio.visible`,
    value
  );
  set(
    action.screenConfig,
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.activeDetails.children.isLabourFeeApplicable.visible`,
    value
  );
  set(
    action.screenConfig,
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.activeDetails.children.meterInstallationDate.visible`,
    value
  );

  set(
    action.screenConfig,
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.volumetricDetails.children.cardContent.children.activeDetails.children.isVolumetricConnection.visible`,
    value
  );
  set(
    action.screenConfig,
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.volumetricDetails.children.cardContent.children.activeDetails.children.volumetricWaterCharge.visible`,
    value
  );
  set(
    action.screenConfig,
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.volumetricDetails.children.cardContent.children.activeDetails.children.dailyConsumption.visible`,
    value
  );
  set(
    action.screenConfig,
    `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.volumetricDetails.children.cardContent.children.activeDetails.children.consumptionInKL.visible`,
    value
  );

  if((!applicationNumber && process.env.REACT_APP_NAME != 'Citizen') || (window && window.location && window.location.pathname &&
    window.location.pathname.includes('apply') && applicationNumber && process.env.REACT_APP_NAME != 'Citizen' && !isModifyMode())){
    set(
      action.screenConfig,
      `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.visible`,
      value
    );
    set(
      action.screenConfig,
      `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.volumetricDetails.visible`,
      value
    );
  }

  if (!value) {
    if(isModifyMode()){
      set(
        action.screenConfig,
        `components.div.children.${mStep}.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.dynamicMdmsWaterSource.visible`,
        value
      );
      
    }
    set(
      action.screenConfig,
      `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.dynamicMdmsWaterSource.visible`,
      value
    );
    set(
      action.screenConfig,
      `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.connectionType.visible`,
      value
    );
    set(
      action.screenConfig,
      `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.numberOfTaps.visible`,
      value
    );
    set(
      action.screenConfig,
      `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.waterSourceType.visible`,
      value
    );
    set(
      action.screenConfig,
      `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.waterSubSource.visible`,
      value
    );
    // set(
    //   action.screenConfig,
    //   `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.connectiondetailscontainer.children.cardContent.children.connectionDetails.children.pipeSize.visible`,
    //   value
    // );
    set(
      action.screenConfig,
      `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterID.visible`,
      value
    );
    set(
      action.screenConfig,
      `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterInstallationDate.visible`,
      value
    );
    set(
      action.screenConfig,
      `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.initialMeterReading.visible`,
      value
    );
    set(
      action.screenConfig,
      `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterMake.visible`,
      value
    );
    set(
      action.screenConfig,
      `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.activationDetailsContainer.children.cardContent.children.activeDetails.children.meterReadingRatio.visible`,
      value
    );
   
    set(
      action.screenConfig,
      `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.activeDetails.children.isLabourFeeApplicable.visible`,
      value
    );
    set(
      action.screenConfig,
      `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.children.cardContent.children.activeDetails.children.isInstallmentApplicable.visible`,
      value
    );

    set(
      action.screenConfig,
      `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.volumetricDetails.children.cardContent.children.activeDetails.children.isVolumetricConnection.visible`,
      value
    );
    set(
      action.screenConfig,
      `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.volumetricDetails.children.cardContent.children.activeDetails.children.volumetricWaterCharge.visible`,
      value
    );
    set(
      action.screenConfig,
      `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.volumetricDetails.children.cardContent.children.activeDetails.children.dailyConsumption.visible`,
      value
    );
    set(
      action.screenConfig,
      `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.volumetricDetails.children.cardContent.children.activeDetails.children.consumptionInKL.visible`,
      value
    );

    if((!applicationNumber && process.env.REACT_APP_NAME != 'Citizen') || (window && window.location && window.location.pathname &&
      window.location.pathname.includes('apply') && applicationNumber && process.env.REACT_APP_NAME != 'Citizen' && !isModifyMode())){
      set(
        action.screenConfig,
        `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.paymentDetailsContainer.visible`,
        value
      );
      set(
        action.screenConfig,
        `components.div.children.formwizardThirdStep.children.additionDetails.children.cardContent.children.volumetricDetails.visible`,
        value
      );
    }
  }
  // set(
  //   action.screenConfig,
  //   "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.pipeSize.visible",
  //   value
  // );
  set(
    action.screenConfig,
    "components.div.children.formwizardFirstStep.children.OwnerInfoCard.children.cardContent.children.tradeUnitCardContainer.children.numberOfTaps.visible",
    value
  );
  // set(
  //   action.screenConfig,
  //   "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewConnDetails.children.cardContent.children.viewFour.children.view.children.taskPipeSizeProposed.visible",
  //   value
  // );
  set(
    action.screenConfig,
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewConnDetails.children.cardContent.children.viewFour.children.view.children.taskNumberOfTapsPropsed.visible",
    value
  );
  // set(
  //   action.screenConfig,
  //   "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSix.children.reviewPipeSize.visible",
  //   value
  // );
  set(
    action.screenConfig,
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSix.children.reviewWaterSubSource.visible",
    value
  );
  set(
    action.screenConfig,
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSix.children.reviewWaterSource.visible",
    value
  );
  set(
    action.screenConfig,
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSix.children.reviewNumberOfTaps.visible",
    value
  );
  set(
    action.screenConfig,
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSix.children.reviewConnectionType.visible",
    value
  );
  // set(
  //   action.screenConfig,
  //   "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewConnDetails.children.cardContent.children.viewFour.children.view.children.taskPipeSizeProposed.visible",
  //   value
  // );
  set(
    action.screenConfig,
    "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewSix.children.reviewNumberOfTaps.visible",
    value
  );
  // set(
  //   action.screenConfig,
  //   "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterId.visible",
  //   value
  // );
  // set(
  //   action.screenConfig,
  //   "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewMeterInstallationDate.visible",
  //   value
  // );
  // set(
  //   action.screenConfig,
  //   "components.div.children.formwizardFourthStep.children.summaryScreen.children.cardContent.children.reviewOwnerDetails.children.cardContent.children.viewTwelve.children.reviewInitialMeterReading.visible",
  //   value
  // );
}