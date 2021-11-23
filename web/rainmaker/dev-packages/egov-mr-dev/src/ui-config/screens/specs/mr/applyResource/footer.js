import { download } from "egov-common/ui-utils/commons";
import { dispatchMultipleFieldChangeAction, getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { prepareFinalObject, toggleSnackbar, handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { generateMRAcknowledgement } from "egov-ui-kit/utils/pdfUtils/generateMRAcknowledgement";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import get from "lodash/get";
import set from "lodash/set";
import remove from "lodash/remove"
import some from "lodash/some";
import { applyTradeLicense, checkValidOwners, getNextFinancialYearForRenewal } from "../../../../../ui-utils/commons";
import { createEstimateData, downloadCertificateForm, getButtonVisibility, getCommonApplyFooter, getDocList, setMultiOwnerForApply, setValidToFromVisibilityForApply, validateFields, downloadProvisionalCertificateForm } from "../../utils";
import "./index.css";
import { brideAddressDetails } from "./brideAddress";

const moveToSuccess = (LicenseData, dispatch) => {
  const applicationNo = get(LicenseData, "applicationNumber");
  const tenantId = get(LicenseData, "tenantId");

  const purpose = "apply";
  const status = "success";
  dispatch(
    setRoute(
      `/mr/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNo}&tenantId=${tenantId}`
    )
  );
};
const editRenewalMoveToSuccess = (LicenseData, dispatch) => {
  const applicationNo = get(LicenseData, "applicationNumber");
  const tenantId = get(LicenseData, "tenantId");
  const financialYear = get(LicenseData, "financialYear");
  const licenseNumber = get(LicenseData, "licenseNumber");
  const purpose = "EDITRENEWAL";
  const status = "success";
  dispatch(
    setRoute(
      `/mr/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNo}&licenseNumber=${licenseNumber}&FY=${financialYear}&tenantId=${tenantId}`
    )
  );
};

export const generatePdfFromDiv = (action, applicationNumber) => {
  let target = document.querySelector("#custom-atoms-div");
  html2canvas(target, {
    onclone: function (clonedDoc) {
      // clonedDoc.getElementById("custom-atoms-footer")[
      //   "data-html2canvas-ignore"
      // ] = "true";
      clonedDoc.getElementById("custom-atoms-footer").style.display = "none";
    }
  }).then(canvas => {
    var data = canvas.toDataURL("image/jpeg", 1);
    var imgWidth = 200;
    var pageHeight = 295;
    var imgHeight = (canvas.height * imgWidth) / canvas.width;
    var heightLeft = imgHeight;
    var doc = new jsPDF("p", "mm");
    var position = 0;

    doc.addImage(data, "PNG", 5, 5 + position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(data, "PNG", 5, 5 + position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    if (action === "download") {
      doc.save(`preview-${applicationNumber}.pdf`);
    } else if (action === "print") {
      doc.autoPrint();
      window.open(doc.output("bloburl"), "_blank");
    }
  });
};

export const callBackForNext = async (state, dispatch) => {

  let activeStep = get(
    state.screenConfiguration.screenConfig["apply"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  const applicationNoInUrl = getQueryArg(window.location.href, "applicationNumber");
  let isFormValid = true;
  let hasFieldToaster = true;
  let isBrideDobValid = true;
  let isGroomDobValid = true;
  let isMrgDateInFutue = true;
  let mrgObj = get(
    state.screenConfiguration.preparedFinalObject,
    "MarriageRegistrations"
  )
  const userAction = getQueryArg(
    window.location.href,
    "action"
  );
  console.log(mrgObj, "Nero mrgObje")

  if (activeStep === 0) {
    //Bride and Groom Details


    const isBrideDetailsValid = validateFields(
      "components.div.children.formwizardFirstStep.children.brideDetails.children.cardContent.children.brideDetailsConatiner.children",
      state,
      dispatch
    );
    const isGroomDetailsValid = validateFields(
      "components.div.children.formwizardFirstStep.children.groomDetails.children.cardContent.children.groomDetailsConatiner.children",
      state,
      dispatch
    );

    const isLocationDetailsValid = validateFields(
      "components.div.children.formwizardFirstStep.children.tradeLocationDetails.children.cardContent.children.tradeDetailsConatiner.children",
      state,
      dispatch
    );

    if (!isBrideDetailsValid || !isGroomDetailsValid || !isLocationDetailsValid) {
      isFormValid = false;
    }

    if (isFormValid) {
      let status = get(
        mrgObj[0],
        "status"
      )
      const todayDate = new Date();
      if (!applicationNoInUrl) {

        let brideDob = get(
          mrgObj[0],
          "coupleDetails[0].bride.dateOfBirth"
        )
        let groomDob = get(
          mrgObj[0],
          "coupleDetails[0].groom.dateOfBirth"
        )
        let marriageDate = get(
          mrgObj[0],
          "marriageDate"
        )

        console.log(brideDob, groomDob, "Nero both DOB")


        if (marriageDate) {
          const mrgDateObj = new Date(marriageDate);
          if (mrgDateObj > todayDate) {
            isFormValid = isMrgDateInFutue = false;
          }
        }

        if (brideDob && typeof brideDob == "string") {
          const [brideDobYear, brideDobMonth, brideDobDay] = brideDob.split("-");
          console.log(brideDobDay)
          const brideDobdate = new Date(`${brideDobMonth}/${brideDobDay}/${brideDobYear}`);

          const diffTime = Math.abs(brideDobdate - todayDate);
          const brideAgeInDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));



          if (brideAgeInDays < 6570) {
            isFormValid = isBrideDobValid = false;
          }

        }

        if (groomDob && typeof groomDob == "string") {
          const [groomDobYear, groomDobMonth, groomDobDay] = groomDob.split("-");
          console.log(groomDobDay)
          const groomDobdate = new Date(`${groomDobMonth}/${groomDobDay}/${groomDobYear}`);

          const diffTime1 = Math.abs(groomDobdate - todayDate);
          const groomAgeInDays = Math.ceil(diffTime1 / (1000 * 60 * 60 * 24));




          if (groomAgeInDays < 7665) {
            isFormValid = isGroomDobValid = false;
          }
        }

      }

      if (applicationNoInUrl && status == "INITIATED") {
        let brideDob = get(
          mrgObj[0],
          "coupleDetails[0].bride.dateOfBirth"
        )
        let groomDob = get(
          mrgObj[0],
          "coupleDetails[0].groom.dateOfBirth"
        )
        if (typeof brideDob == "string") {

          const [brideDobYear, brideDobMonth, brideDobDay] = brideDob.split("-");
          console.log(brideDobDay)
          const brideDobdate = new Date(`${brideDobMonth}/${brideDobDay}/${brideDobYear}`);

          const diffTime = Math.abs(brideDobdate - todayDate);
          const brideAgeInDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));



          if (brideAgeInDays < 6570) {
            isFormValid = isBrideDobValid = false;
          }
        }
        if (typeof groomDob == "string") {
          const [groomDobYear, groomDobMonth, groomDobDay] = groomDob.split("-");

          const groomDobdate = new Date(`${groomDobMonth}/${groomDobDay}/${groomDobYear}`);

          const diffTime1 = Math.abs(groomDobdate - todayDate);
          const groomAgeInDays = Math.ceil(diffTime1 / (1000 * 60 * 60 * 24));




          if (groomAgeInDays < 7665) {
            isFormValid = isGroomDobValid = false;
          }
        }

      }
      console.log(isFormValid, "Nero form valid")
      let brideOtherrltn = get(
        mrgObj[0],
        "coupleDetails[0].bride.guardianDetails.relationship"
      )

      let groomOtherrltn = get(
        mrgObj[0],
        "coupleDetails[0].groom.guardianDetails.relationship"
      )

      console.log(brideOtherrltn, "Nero sss")
      if (brideOtherrltn == "OTHERS" && applicationNoInUrl) {
        const visiblebrideOtherRelationDesc = [

          {
            path: "components.div.children.formwizardSecondStep.children.brideGuardianDetails.children.cardContent.children.brideGuardianDetailsConatiner.children.otherRltnWithBride",
            property: "visible",
            value: true
          },


        ];
        dispatchMultipleFieldChangeAction("apply", visiblebrideOtherRelationDesc, dispatch);
      }

      if (groomOtherrltn == "OTHERS" && applicationNoInUrl) {
        const visibleGroomOtherRelationDesc = [

          {
            path: "components.div.children.formwizardSecondStep.children.groomGuardianDetails.children.cardContent.children.groomGuardianDetailsConatiner.children.otherRltnWithgroom",
            property: "visible",
            value: true
          },


        ];
        dispatchMultipleFieldChangeAction("apply", visibleGroomOtherRelationDesc, dispatch);
      }

      // const brideGrndRelationShip = get(mrgObj[0], "coupleDetails[0].bride.guardianDetails.relationship");
      // const groomGrndRelationShip = get(mrgObj[0], "coupleDetails[0].groom.guardianDetails.relationship");
      // console.log(brideGrndRelationShip, "Nero REl footer")
      // if (groomGrndRelationShip == "OTHERS") {

      //   dispatch(
      //     handleField(
      //       "apply",
      //       "components.div.children.formwizardSecondStep.children.groomGuardianDetails.children.cardContent.children.groomGuardianDetailsConatiner.children.otherRltnWithgroom",
      //       "visible",
      //       true
      //     )
      //   );
      // }
      // if (brideGrndRelationShip == "OTHERS") {
      //   dispatch(
      //     handleField(
      //       "apply",
      //       "components.div.children.formwizardSecondStep.children.brideGuardianDetails.children.cardContent.children.brideGuardianDetailsConatiner.children.otherRltnWithBride",
      //       "visible",
      //       true
      //     )
      //   );
      // }

    }


    await getDocList(state, dispatch);


    if (isFormValid) {
      isFormValid = await applyTradeLicense(state, dispatch, activeStep);

      if (!isFormValid) {
        hasFieldToaster = false;
      }
    } else {
      isFormValid = false;
    }

    if (isFormValid) {
      if (!applicationNoInUrl) {
        dispatch(prepareFinalObject("MarriageRegistrations[0].coupleDetails[0].groom.guardianDetails.country", "INDIA"));
        dispatch(prepareFinalObject("MarriageRegistrations[0].coupleDetails[0].bride.guardianDetails.country", "INDIA"));
      } else if (applicationNoInUrl && mrgObj && mrgObj[0].coupleDetails && !mrgObj[0].coupleDetails[0].bride.guardianDetails) {
        dispatch(prepareFinalObject("MarriageRegistrations[0].coupleDetails[0].groom.guardianDetails.country", "INDIA"));
        dispatch(prepareFinalObject("MarriageRegistrations[0].coupleDetails[0].bride.guardianDetails.country", "INDIA"));
      }
    }


  }
  if (activeStep === 1) {
    //Bride and Groom Guardian Details

    const isBrideGrdnDetailsValid = validateFields(
      "components.div.children.formwizardSecondStep.children.brideGuardianDetails.children.cardContent.children.brideGuardianDetailsConatiner.children",
      state,
      dispatch
    );

    const isGroomGrdnDetailsValid = validateFields(
      "components.div.children.formwizardSecondStep.children.groomGuardianDetails.children.cardContent.children.groomGuardianDetailsConatiner.children",
      state,
      dispatch
    );

    if (!isBrideGrdnDetailsValid || !isGroomGrdnDetailsValid) {
      isFormValid = false;
    }
    if (isFormValid) {
      // dispatch(
      //   prepareFinalObject(
      //     "MarriageRegistrations[0].coupleDetails[0].bride.guardianDetails.groomSideGuardian",
      //     false
      //   )
      // );
      // dispatch(
      //   prepareFinalObject(
      //     "MarriageRegistrations[0].coupleDetails[0].groom.guardianDetails.groomSideGuardian",
      //     true
      //   )
      // );

      isFormValid = await applyTradeLicense(state, dispatch, activeStep);
      if (isFormValid) {
        if (!applicationNoInUrl) {
          dispatch(prepareFinalObject("MarriageRegistrations[0].coupleDetails[0].groom.witness.country", "INDIA"));
          dispatch(prepareFinalObject("MarriageRegistrations[0].coupleDetails[0].bride.witness.country", "INDIA"));
        } else if (applicationNoInUrl && mrgObj && mrgObj[0].coupleDetails && !mrgObj[0].coupleDetails[0].bride.witness) {
          dispatch(prepareFinalObject("MarriageRegistrations[0].coupleDetails[0].groom.witness.country", "INDIA"));
          dispatch(prepareFinalObject("MarriageRegistrations[0].coupleDetails[0].bride.witness.country", "INDIA"));
        }
        if (!isFormValid) {
          hasFieldToaster = false;
        }
      }
    }




  }
  if (activeStep === 2) {
    //Witness Details

    const isBrideWtnsDetailsValid = validateFields(
      "components.div.children.formwizardThirdStep.children.brideWitnessDetails.children.cardContent.children.witness1DetailsConatiner.children",
      state,
      dispatch
    );

    const isGroomWtnsDetailsValid = validateFields(
      "components.div.children.formwizardThirdStep.children.groomWitnessDetails.children.cardContent.children.witness2DetailsConatiner.children",
      state,
      dispatch
    );

    if (!isBrideWtnsDetailsValid || !isGroomWtnsDetailsValid) {
      isFormValid = false;
    }



    if (isFormValid) {
      isFormValid = await applyTradeLicense(state, dispatch, activeStep);
      if (!isFormValid) {
        hasFieldToaster = false;
      }
    }

  }


  if (activeStep === 3) {
    // Photo and Docs

    const LicenseData = get(
      state.screenConfiguration.preparedFinalObject,
      "MarriageRegistrations[0]",
      {}
    );


    let uploadedDocData = get(
      state.screenConfiguration.preparedFinalObject,
      "MarriageRegistrations[0].applicationDocuments",
      []
    );

    const uploadedTempDocData = get(
      state.screenConfiguration.preparedFinalObject,
      "LicensesTemp[0].applicationDocuments",
      []
    );
    for (var y = 0; y < uploadedTempDocData.length; y++) {
      if (
        uploadedTempDocData[y].required &&
        !some(uploadedDocData, { documentType: uploadedTempDocData[y].code })
      ) {
        isFormValid = false;
      }
    }

    if (isFormValid) {
      if (getQueryArg(window.location.href, "action") === "edit") {
        //EDIT FLOW
        const businessId = getQueryArg(
          window.location.href,
          "applicationNumber"
        );

        const tenantId = getQueryArg(window.location.href, "tenantId");

      }
      uploadedDocData = uploadedDocData.filter(item => item.fileUrl && item.fileName)
      const reviewDocData =
        uploadedDocData &&
        uploadedDocData.map(item => {
          return {
            title: `MR_${item.documentType}`,
            link: item.fileUrl && item.fileUrl.split(",")[0],
            linkText: "View",
            name: item.fileName
          };
        });
      if (userAction != "CORRECTION") {
        createEstimateData(
          LicenseData,
          "LicensesTemp[0].estimateCardData",
          dispatch
        ); //get bill and populate estimate card
      }



      dispatch(
        prepareFinalObject("LicensesTemp[0].reviewDocData", reviewDocData)
      );
      //isFormValid = await applyTradeLicense(state, dispatch, activeStep);

      if (userAction == "CORRECTION") {

        const actionDefination = [

          {
            path: "components.div.children.formwizardFifthStep.children.tradeReviewDetails.children.cardContent.children.estimate",
            property: "visible",
            value: false
          },


        ];
        dispatchMultipleFieldChangeAction("apply", actionDefination, dispatch);
      }

    }





  }

  if (activeStep === 4) {
    //Review Summary
    const LicenseData = get(
      state.screenConfiguration.preparedFinalObject,
      "MarriageRegistrations[0]"
    );
    isFormValid = await applyTradeLicense(state, dispatch, activeStep);
    if (isFormValid) {

      moveToSuccess(LicenseData, dispatch);
    }
  }

  if (activeStep !== 4) {
    console.log(isFormValid, hasFieldToaster, "Nero errror")
    if (isFormValid) {
      changeStep(state, dispatch);
    } else if (hasFieldToaster) {
      let errorMessage = {
        labelName:
          "Please fill all mandatory fields and upload the documents !",
        labelKey: "ERR_FILL_MR_MANDATORY_FIELDS"
      };
      switch (activeStep) {
        case 0:

          if (!isBrideDobValid) {
            errorMessage = {
              labelName:
                "Please fill all mandatory fields for Trade Details, then do next !",
              labelKey: "ERR_FILL_MR_BRIDE_AGE_NOT_VALID"
            };
          } else if (!isGroomDobValid) {
            errorMessage = {
              labelName:
                "Please fill all mandatory fields for Trade Details, then do next !",
              labelKey: "ERR_FILL_MR_GROOM_AGE_NOT_VALID"
            };
          } else if (!isMrgDateInFutue) {
            errorMessage = {
              labelName:
                "Please fill all mandatory fields for Trade Details, then do next !",
              labelKey: "ERR_FILL_MR_MRGDATE_NOT_VALID"
            };
          } else {

            errorMessage = {
              labelName:
                "Please fill all mandatory fields for Trade Details, then do next !",
              labelKey: "ERR_FILL_MARRIAGE_DETAIL_MANDATORY_FIELDS"
            };
          }
          break;
        case 1:
          errorMessage = {
            labelName:
              "Please fill all mandatory fields for Trade Details, then do next !",
            labelKey: "ERR_FILL_GUARDIAN_DETAIL_MANDATORY_FIELDS"
          };
          break;
        case 2:
          errorMessage = {
            labelName:
              "Please fill all mandatory fields for Trade Details, then do next !",
            labelKey: "ERR_FILL_WITNESS_DETAIL_MANDATORY_FIELDS"
          };
          break;
        case 3:
          errorMessage = {
            labelName: "Please upload all the required documents !",
            labelKey: "ERR_UPLOAD_REQUIRED_DOCUMENTS"
          };
          break;
      }
      dispatch(toggleSnackbar(true, errorMessage, "warning"));
    }
  }

};

export const changeStep = (
  state,
  dispatch,
  mode = "next",
  defaultActiveStep = -1
) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["apply"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  if (defaultActiveStep === -1) {
    if (activeStep === 4 && mode === "next") {
      const isDocsUploaded = get(
        state.screenConfiguration.preparedFinalObject,
        "LicensesTemp[0].reviewDocData",
        null
      );
      activeStep = isDocsUploaded ? 5 : 4
    } else {
      activeStep = mode === "next" ? activeStep + 1 : activeStep - 1;
    }
  } else {
    activeStep = defaultActiveStep;
  }

  const isPreviousButtonVisible = activeStep > 0 ? true : false;
  const isNextButtonVisible = activeStep < 4 ? true : false;
  const isPayButtonVisible = activeStep === 4 ? true : false;
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
  renderSteps(activeStep, dispatch);
  window.scrollTo(0, 0);
};

export const renderSteps = (activeStep, dispatch) => {
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
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardSecondStep"
        ),
        dispatch
      );
      break;
    case 2:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardThirdStep"
        ),
        dispatch
      );
      break;
    case 3:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardFourthStep"
        ),
        dispatch
      );
      break;
    // case 4:
    //   dispatchMultipleFieldChangeAction(
    //     "apply",
    //     getActionDefinationForStepper(
    //       "components.div.children.formwizardFifthStep"
    //     ),
    //     dispatch
    //   );
    //   break;
    default:
      dispatchMultipleFieldChangeAction(
        "apply",
        getActionDefinationForStepper(
          "components.div.children.formwizardFifthStep"
        ),
        dispatch
      );
  }
};

export const getActionDefinationForStepper = path => {
  const actionDefination = [
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
      path: "components.div.children.formwizardThirdStep",
      property: "visible",
      value: false
    },
    {
      path: "components.div.children.formwizardFourthStep",
      property: "visible",
      value: false
    },
    {
      path: "components.div.children.formwizardFifthStep",
      property: "visible",
      value: false
    }
  ];
  for (var i = 0; i < actionDefination.length; i++) {
    actionDefination[i] = {
      ...actionDefination[i],
      value: false
    };
    if (path === actionDefination[i].path) {
      actionDefination[i] = {
        ...actionDefination[i],
        value: true
      };
    }
  }
  return actionDefination;
};

export const callBackForPrevious = (state, dispatch) => {
  let activeStep = get(
    state.screenConfiguration.screenConfig["apply"],
    "components.div.children.stepper.props.activeStep",
    0
  );
  if (activeStep === 1) {
    let MarriageRegistrations = get(
      state.screenConfiguration.preparedFinalObject,
      "MarriageRegistrations[0]",
      []
    );
    if (MarriageRegistrations && MarriageRegistrations.coupleDetails[0].bride.guardianDetails && !MarriageRegistrations.coupleDetails[0].bride.guardianDetails.id) {




      delete MarriageRegistrations.coupleDetails[0].bride.guardianDetails;




      dispatch(
        prepareFinalObject("MarriageRegistrations[0]", MarriageRegistrations)
      );

      let brideGrdnFields = get(
        state.screenConfiguration.screenConfig.apply,
        "components.div.children.formwizardSecondStep.children.brideGuardianDetails.children.cardContent.children.brideGuardianDetailsConatiner.children",
        []
      );
      let brideGrdnFieldsKeys = Object.keys(brideGrdnFields);

      let resetBrideGrndFields = [];
      for (let i = 0; i < brideGrdnFieldsKeys.length; i++) {
        resetBrideGrndFields.push({
          path: `components.div.children.formwizardSecondStep.children.brideGuardianDetails.children.cardContent.children.brideGuardianDetailsConatiner.children.${brideGrdnFieldsKeys[i]}.props`,
          property: "value",
          value: ""
        })
      }


      dispatchMultipleFieldChangeAction("apply", resetBrideGrndFields, dispatch);
    }

    if (MarriageRegistrations && MarriageRegistrations.coupleDetails[0].groom.guardianDetails && !MarriageRegistrations.coupleDetails[0].groom.guardianDetails.id) {




      delete MarriageRegistrations.coupleDetails[0].groom.guardianDetails;




      dispatch(
        prepareFinalObject("MarriageRegistrations[0]", MarriageRegistrations)
      );

      let groomGrdnFields = get(
        state.screenConfiguration.screenConfig.apply,
        "components.div.children.formwizardSecondStep.children.brideGuardianDetails.children.cardContent.children.groomGuardianDetailsConatiner.children",
        []
      );
      let groomGrdnFieldsKeys = Object.keys(groomGrdnFields);

      let resetGroomGrndFields = [];
      for (let i = 0; i < groomGrdnFieldsKeys.length; i++) {
        resetGroomGrndFields.push({
          path: `components.div.children.formwizardSecondStep.children.brideGuardianDetails.children.cardContent.children.brideGuardianDetailsConatiner.children.${brideGrdnFieldsKeys[i]}.props`,
          property: "value",
          value: ""
        })
      }


      dispatchMultipleFieldChangeAction("apply", resetGroomGrndFields, dispatch);
    }
  }

  if (activeStep === 2) {
    let MarriageRegistrations = get(
      state.screenConfiguration.preparedFinalObject,
      "MarriageRegistrations[0]",
      []
    );
    if (MarriageRegistrations && MarriageRegistrations.coupleDetails[0].bride.witness && !MarriageRegistrations.coupleDetails[0].bride.witness.id) {




      delete MarriageRegistrations.coupleDetails[0].bride.witness;




      dispatch(
        prepareFinalObject("MarriageRegistrations[0]", MarriageRegistrations)
      );

      let brideWtnesFields = get(
        state.screenConfiguration.screenConfig.apply,
        "components.div.children.formwizardThirdStep.children.brideWitnessDetails.children.cardContent.children.witness1DetailsConatiner.children",
        []
      );
      let brideWtnesKeys = Object.keys(brideWtnesFields);

      let resetBrideWtnsFields = [];
      for (let i = 0; i < brideWtnesKeys.length; i++) {
        resetBrideWtnsFields.push({
          path: `components.div.children.formwizardThirdStep.children.brideWitnessDetails.children.cardContent.children.witness1DetailsConatiner.children.${brideWtnesKeys[i]}.props`,
          property: "value",
          value: ""
        })
      }


      dispatchMultipleFieldChangeAction("apply", resetBrideWtnsFields, dispatch);
    }

    if (MarriageRegistrations && MarriageRegistrations.coupleDetails[0].groom.witness && !MarriageRegistrations.coupleDetails[0].groom.witness.id) {




      delete MarriageRegistrations.coupleDetails[0].groom.witness;




      dispatch(
        prepareFinalObject("MarriageRegistrations[0]", MarriageRegistrations)
      );

      let groomWtnsFields = get(
        state.screenConfiguration.screenConfig.apply,
        "components.div.children.formwizardThirdStep.children.groomWitnessDetails.children.cardContent.children.witness2DetailsConatiner.children",
        []
      );
      let groomWtnsFieldsKeys = Object.keys(groomWtnsFields);

      let resetGroomWtnsFields = [];
      for (let i = 0; i < groomWtnsFieldsKeys.length; i++) {
        resetGroomWtnsFields.push({
          path: `components.div.children.formwizardThirdStep.children.groomWitnessDetails.children.cardContent.children.witness2DetailsConatiner.children.${groomWtnsFieldsKeys[i]}.props`,
          property: "value",
          value: ""
        })
      }


      dispatchMultipleFieldChangeAction("apply", resetGroomWtnsFields, dispatch);
    }
  }
  changeStep(state, dispatch, "previous");
};

export const footer = getCommonApplyFooter({
  previousButton: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        minWidth: "180px",
        height: "48px",
        marginRight: "16px",
        borderRadius: "inherit"
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
        labelKey: "MR_COMMON_BUTTON_PREV_STEP"
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
        minWidth: "180px",
        height: "48px",
        marginRight: "45px",
        borderRadius: "inherit"
      }
    },
    children: {
      nextButtonLabel: getLabel({
        labelName: "Next Step",
        labelKey: "MR_COMMON_BUTTON_NXT_STEP"
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
        minWidth: "180px",
        height: "48px",
        marginRight: "45px",
        borderRadius: "inherit"
      }
    },
    children: {
      submitButtonLabel: getLabel({
        labelName: "Submit",
        labelKey: "MR_COMMON_BUTTON_SUBMIT"
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



export const renewTradelicence = async (financialYear, state, dispatch) => {
  const licences = get(
    state.screenConfiguration.preparedFinalObject,
    `MarriageRegistrations`
  );

  const tenantId = get(licences[0], "tenantId");

  const nextFinancialYear = await getNextFinancialYearForRenewal(financialYear);

  const wfCode = "DIRECTRENEWAL";
  set(licences[0], "action", "INITIATE");
  set(licences[0], "workflowCode", wfCode);
  set(licences[0], "applicationType", "RENEWAL");
  set(licences[0], "financialYear", nextFinancialYear);

  const response = await httpRequest("post", "/mr-services/v1/_update", "", [], {
    MarriageRegistrations: licences
  })
  const renewedapplicationNo = get(
    response,
    `MarriageRegistrations[0].applicationNumber`
  );
  const licenseNumber = get(
    response,
    `MarriageRegistrations[0].licenseNumber`
  );
  dispatch(
    setRoute(
      `/mr/acknowledgement?purpose=EDITRENEWAL&status=success&applicationNumber=${renewedapplicationNo}&licenseNumber=${licenseNumber}&FY=${nextFinancialYear}&tenantId=${tenantId}&action=${wfCode}`
    ));
};

export const footerReview = (
  action,
  state,
  dispatch,
  status,
  applicationNumber,
  tenantId,
  financialYear
) => {
  /** MenuButton data based on status */
  let licenseNumber = get(state.screenConfiguration.preparedFinalObject.MarriageRegistrations[0], "licenseNumber")
  const responseLength = get(
    state.screenConfiguration.preparedFinalObject,
    `licenseCount`,
    1
  );

  return getCommonApplyFooter({
    container: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      children: {
        rightdiv: {
          uiFramework: "custom-atoms",
          componentPath: "Div",
          props: {

            style: {
              float: "right",
              display: "flex"
            }
          },
          children: {

            resubmitButton: {
              componentPath: "Button",
              props: {
                variant: "contained",
                color: "primary",
                style: {
                  minWidth: "180px",
                  height: "48px",
                  marginRight: "45px"
                }
              },
              children: {
                nextButtonLabel: getLabel({
                  labelName: "RESUBMIT",
                  labelKey: "MR_RESUBMIT"
                })
              },
              onClickDefination: {
                action: "condition",
                callBack: openPopup
              },
              visible: getButtonVisibility(status, "RESUBMIT"),
              roleDefination: {
                rolePath: "user-info.roles",
                roles: ["MR_CEMP", "CITIZEN"]
              }
            },
            editButton: {
              componentPath: "Button",
              props: {
                variant: "outlined",
                color: "primary",
                style: {
                  minWidth: "180px",
                  height: "48px",
                  marginRight: "16px",
                  borderRadius: "inherit"
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
                  labelName: "Edit for Renewal",
                  labelKey: "MR_RENEWAL_BUTTON_EDIT"
                })
              },
              onClickDefination: {
                action: "condition",
                callBack: () => {
                  dispatch(
                    setRoute(
                      // `/tradelicence/acknowledgement?purpose=${purpose}&status=${status}&applicationNumber=${applicationNo}&FY=${financialYear}&tenantId=${tenantId}`
                      `/mr-citizen/apply?applicationNumber=${applicationNumber}&licenseNumber=${licenseNumber}&tenantId=${tenantId}&action=EDITRENEWAL`
                    )
                  );
                },

              },
              visible: (getButtonVisibility(status, "APPROVED") || getButtonVisibility(status, "EXPIRED")) && (responseLength === 1),
            },
            submitButton: {
              componentPath: "Button",
              props: {
                variant: "contained",
                color: "primary",
                style: {
                  minWidth: "180px",
                  height: "48px",
                  marginRight: "45px",
                  borderRadius: "inherit"
                }
              },
              children: {
                nextButtonLabel: getLabel({
                  labelName: "Submit for Renewal",
                  labelKey: "MR_RENEWAL_BUTTON_SUBMIT"
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
                callBack: () => {
                  renewTradelicence(financialYear, state, dispatch);
                },

              },
              visible: (getButtonVisibility(status, "APPROVED") || getButtonVisibility(status, "EXPIRED")) && (responseLength === 1),
            },
            makePayment: {
              componentPath: "Button",
              props: {
                variant: "contained",
                color: "primary",
                style: {
                  minWidth: "180px",
                  height: "48px",
                  marginRight: "45px",
                  borderRadius: "inherit"
                }
              },
              children: {
                submitButtonLabel: getLabel({
                  labelName: "MAKE PAYMENT",
                  labelKey: "MR_COMMON_BUTTON_CITIZEN_MAKE_PAYMENT"
                })
              },
              onClickDefination: {
                action: "condition",
                callBack: () => {
                  dispatch(
                    setRoute(
                      `/egov-common/pay?consumerCode=${applicationNumber}&tenantId=${tenantId}&businessService=MR`
                    )
                  );
                },

              },
              visible: process.env.REACT_APP_NAME === "Citizen" && getButtonVisibility(status, "PENDINGPAYMENT") ? true : false
            }
          },
          gridDefination: {
            xs: 12,
            sm: 12
          }
        },
      }
    }
  });
};
export const footerReviewTop = (
  action,
  state,
  dispatch,
  status,
  applicationNumber,
  tenantId,
  financialYear
) => {

  /** MenuButton data based on status */
  let downloadMenu = [];
  let printMenu = [];

  const dscDetails = state && state.screenConfiguration && state.screenConfiguration.preparedFinalObject
  && state.screenConfiguration.preparedFinalObject.MarriageRegistrations && state.screenConfiguration.preparedFinalObject.MarriageRegistrations.length > 0 &&
  state.screenConfiguration.preparedFinalObject.MarriageRegistrations[0].dscDetails || []
  const isCeritificateGenerated = !dscDetails ? true : dscDetails && dscDetails.length > 0 &&
  dscDetails[0].documentId ? true : false

  const uiCommonConfig = get(state.screenConfiguration.preparedFinalObject, "uiCommonConfig");
  const receiptKey = get(uiCommonConfig, "receiptKey");

  // let renewalMenu=[];
  let tlCertificateDownloadObject = {
    label: { labelName: "TL Certificate", labelKey: "MR_CERTIFICATE" },
    link: () => {
      const { MarriageRegistrations } = state.screenConfiguration.preparedFinalObject;
      downloadCertificateForm(MarriageRegistrations);
    },
    leftIcon: "book"
  };
  let tlCertificatePrintObject = {
    label: { labelName: "TL Certificate", labelKey: "MR_CERTIFICATE" },
    link: () => {
      const { MarriageRegistrations } = state.screenConfiguration.preparedFinalObject;
      downloadCertificateForm(MarriageRegistrations, 'print');
    },
    leftIcon: "book"
  };

  let tlPLDownloadObject = {
    label: { labelName: "TL Certificate", labelKey: "MR_PL_CERTIFICATE" },
    link: () => {
      const { MarriageRegistrations } = state.screenConfiguration.preparedFinalObject;
      downloadProvisionalCertificateForm(MarriageRegistrations);
    },
    leftIcon: "book"
  };
  let tlPLPrintObject = {
    label: { labelName: "TL Certificate", labelKey: "MR_PL_CERTIFICATE" },
    link: () => {
      const { MarriageRegistrations } = state.screenConfiguration.preparedFinalObject;
      downloadProvisionalCertificateForm(MarriageRegistrations, 'print');
    },
    leftIcon: "book"
  };


  let receiptDownloadObject = {
    label: { labelName: "Receipt", labelKey: "MR_RECEIPT" },
    link: () => {


      const receiptQueryString = [
        { key: "consumerCodes", value: get(state.screenConfiguration.preparedFinalObject.MarriageRegistrations[0], "applicationNumber") },
        { key: "tenantId", value: get(state.screenConfiguration.preparedFinalObject.MarriageRegistrations[0], "tenantId") },
        { key: "businessService", value: 'MR' }
      ]
      download(receiptQueryString, "download", receiptKey, state);
      // generateReceipt(state, dispatch, "receipt_download");
    },
    leftIcon: "receipt"
  };
  let receiptPrintObject = {
    label: { labelName: "Receipt", labelKey: "MR_RECEIPT" },
    link: () => {
      const receiptQueryString = [
        { key: "consumerCodes", value: get(state.screenConfiguration.preparedFinalObject.MarriageRegistrations[0], "applicationNumber") },
        { key: "tenantId", value: get(state.screenConfiguration.preparedFinalObject.MarriageRegistrations[0], "tenantId") },
        { key: "businessService", value: 'MR' }
      ]
      download(receiptQueryString, "print", receiptKey, state);
      // generateReceipt(state, dispatch, "receipt_print");
    },
    leftIcon: "receipt"
  };
  let applicationDownloadObject = {
    label: { labelName: "Application", labelKey: "MR_APPLICATION" },
    link: () => {
      const { MarriageRegistrations, LicensesTemp } = state.screenConfiguration.preparedFinalObject;
      const documents = LicensesTemp[0].reviewDocData;
      set(MarriageRegistrations[0], "additionalDetails.documents", documents)
      generateMRAcknowledgement(state.screenConfiguration.preparedFinalObject, `mr-acknowledgement-${MarriageRegistrations[0].applicationNumber}`);
    },
    leftIcon: "assignment"
  };
  let applicationPrintObject = {
    label: { labelName: "Application", labelKey: "MR_APPLICATION" },
    link: () => {
      const { MarriageRegistrations, LicensesTemp } = state.screenConfiguration.preparedFinalObject;
      const documents = LicensesTemp[0].reviewDocData;
      set(MarriageRegistrations[0], "additionalDetails.documents", documents)
      generateMRAcknowledgement(state.screenConfiguration.preparedFinalObject, 'print');

    },
    leftIcon: "assignment"
  };
  console.log(status, "Nero Status App")
  //console.log(applicationDownloadObject, "Nero applicationDownloadObject")
  //console.log(applicationPrintObject, "Nero applicationPrintObject")
  switch (status) {
    case "APPROVED":
      if(isCeritificateGenerated){
        downloadMenu = [
          tlCertificateDownloadObject,
          receiptDownloadObject,
          applicationDownloadObject
        ];
        printMenu = [
          tlCertificatePrintObject,
          receiptPrintObject,
          applicationPrintObject
        ];
      }else{
        downloadMenu = [
          receiptDownloadObject,
          applicationDownloadObject
        ];
        printMenu = [
          receiptPrintObject,
          applicationPrintObject
        ];
      }
    
      // downloadMenu = [
      //   applicationDownloadObject,
      //   receiptDownloadObject,
      //   tlCertificateDownloadObject
      // ];
      // printMenu = [
      //   applicationPrintObject,
      //   receiptPrintObject,
      //   tlCertificatePrintObject
      // ];
      break;
    case "DOCVERIFICATION":
      downloadMenu = [

        applicationDownloadObject
      ];
      printMenu = [

        applicationPrintObject
      ];
      break;
    case "PENDINGSCHEDULE":
    case "PENDINGAPPROVAL":
      downloadMenu = [
        applicationDownloadObject,
        receiptDownloadObject
        
      ];
      printMenu = [
        applicationPrintObject,
        receiptPrintObject
        
      ];
      break;

    case "APPLIED":
    case "PENDINGPAYMENT":
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
    case "CANCELLED":
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
    case "REJECTED":
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
    default:
      break;
  }
  /** END */

  return {
    rightdiv: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        style: { textAlign: "right", display: "flex" }
      },
      children: {
        downloadMenu: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-mr",
          componentPath: "MenuButton",
          props: {
            data: {
              label: { labelName: "DOWNLOAD", labelKey: "MR_DOWNLOAD" },
              leftIcon: "cloud_download",
              rightIcon: "arrow_drop_down",
              props: { variant: "outlined", style: { height: "60px", color: "#FE7A51", marginRight: "5px" }, className: "tl-download-button" },
              menu: downloadMenu
            }
          }
        },
        printMenu: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-tradelicence",
          componentPath: "MenuButton",
          props: {
            data: {
              label: { labelName: "PRINT", labelKey: "MR_PRINT" },
              leftIcon: "print",
              rightIcon: "arrow_drop_down",
              props: { variant: "outlined", style: { height: "60px", color: "#FE7A51" }, className: "tl-print-button" },
              menu: printMenu
            }
          }
        }

      },
      // gridDefination: {
      //   xs: 12,
      //   sm: 6
      // }
    }
  }

};

export const openPopup = (state, dispatch) => {
  dispatch(
    prepareFinalObject("ResubmitAction", true)
  );
}

export const downloadPrintContainer = (
  action,
  state,
  dispatch,
  status,
  applicationNumber,
  tenantId
) => {

  const dscDetails = state && state.screenConfiguration && state.screenConfiguration.preparedFinalObject
  && state.screenConfiguration.preparedFinalObject.MarriageRegistrations && state.screenConfiguration.preparedFinalObject.MarriageRegistrations.length > 0 &&
  state.screenConfiguration.preparedFinalObject.MarriageRegistrations[0].dscDetails || []
  const isCeritificateGenerated = !dscDetails ? true : dscDetails && dscDetails.length > 0 &&
  dscDetails[0].documentId ? true : false

  /** MenuButton data based on status */
  const uiCommonConfig = get(state.screenConfiguration.preparedFinalObject, "uiCommonConfig");
  const receiptKey = get(uiCommonConfig, "receiptKey");
  let downloadMenu = [];
  let printMenu = [];
  let tlCertificateDownloadObject = {
    label: { labelName: "TL Certificate", labelKey: "MR_CERTIFICATE" },
    link: () => {
      const { MarriageRegistrations } = state.screenConfiguration.preparedFinalObject;
      downloadCertificateForm(MarriageRegistrations);
    },
    leftIcon: "book"
  };
  let tlCertificatePrintObject = {
    label: { labelName: "TL Certificate", labelKey: "MR_CERTIFICATE" },
    link: () => {
      const { MarriageRegistrations } = state.screenConfiguration.preparedFinalObject;
      downloadCertificateForm(MarriageRegistrations, 'print');
    },
    leftIcon: "book"
  };


  // let tlPLDownloadObject = {
  //   label: { labelName: "TL Certificate", labelKey: "MR_PL_CERTIFICATE" },
  //   link: () => {
  //     const { MarriageRegistrations } = state.screenConfiguration.preparedFinalObject;
  //     downloadProvisionalCertificateForm(MarriageRegistrations);
  //   },
  //   leftIcon: "book"
  // };
  // let tlPLPrintObject = {
  //   label: { labelName: "TL Certificate", labelKey: "MR_PL_CERTIFICATE" },
  //   link: () => {
  //     const { MarriageRegistrations } = state.screenConfiguration.preparedFinalObject;
  //     downloadProvisionalCertificateForm(MarriageRegistrations, 'print');
  //   },
  //   leftIcon: "book"
  // };


  let receiptDownloadObject = {
    label: { labelName: "Receipt", labelKey: "MR_RECEIPT" },
    link: () => {
      const receiptQueryString = [
        { key: "consumerCodes", value: get(state.screenConfiguration.preparedFinalObject.MarriageRegistrations[0], "applicationNumber") },
        { key: "tenantId", value: get(state.screenConfiguration.preparedFinalObject.MarriageRegistrations[0], "tenantId") },
        { key: "businessService", value: 'MR' }
      ]
      download(receiptQueryString, "download", receiptKey);
    },
    leftIcon: "receipt"
  };
  let receiptPrintObject = {
    label: { labelName: "Receipt", labelKey: "MR_RECEIPT" },
    link: () => {
      const receiptQueryString = [
        { key: "consumerCodes", value: get(state.screenConfiguration.preparedFinalObject.MarriageRegistrations[0], "applicationNumber") },
        { key: "tenantId", value: get(state.screenConfiguration.preparedFinalObject.MarriageRegistrations[0], "tenantId") },
        { key: "businessService", value: 'MR' }
      ]
      download(receiptQueryString, "print", receiptKey);
    },
    leftIcon: "receipt"
  };
  let applicationDownloadObject = {
    label: { labelName: "Application", labelKey: "MR_APPLICATION" },
    link: () => {
      const { MarriageRegistrations, LicensesTemp } = state.screenConfiguration.preparedFinalObject;
      const documents = LicensesTemp[0].reviewDocData;
      set(MarriageRegistrations[0], "additionalDetails.documents", documents)
      // downloadAcknowledgementForm(MarriageRegistrations);
      generateMRAcknowledgement(state.screenConfiguration.preparedFinalObject, `mr-acknowledgement-${MarriageRegistrations[0].applicationNumber}`);
    },
    leftIcon: "assignment"
  };
  let applicationPrintObject = {
    label: { labelName: "Application", labelKey: "MR_APPLICATION" },
    link: () => {
      const { MarriageRegistrations, LicensesTemp } = state.screenConfiguration.preparedFinalObject;
      const documents = LicensesTemp[0].reviewDocData;
      set(MarriageRegistrations[0], "additionalDetails.documents", documents)
      // downloadAcknowledgementForm(MarriageRegistrations,'print');
      generateMRAcknowledgement(state.screenConfiguration.preparedFinalObject, 'print');
    },
    leftIcon: "assignment"
  };

  switch (status) {
    case "APPROVED":
      if(isCeritificateGenerated){
        downloadMenu = [
          tlCertificateDownloadObject,
          receiptDownloadObject,
          applicationDownloadObject
        ];
        printMenu = [
          tlCertificatePrintObject,
          receiptPrintObject,
          applicationPrintObject
        ];
      }else{
        downloadMenu = [
          receiptDownloadObject,
          applicationDownloadObject
        ];
        printMenu = [
          receiptPrintObject,
          applicationPrintObject
        ];
      }
     
      break;
    case "DOCVERIFICATION":
      downloadMenu = [
        applicationDownloadObject
      ];
      printMenu = [
        applicationPrintObject
      ];
      break;
    case "PENDINGSCHEDULE":
    case "PENDINGAPPROVAL":
      downloadMenu = [
        applicationDownloadObject,
        receiptDownloadObject
        
      ];
      printMenu = [
        applicationPrintObject,
        receiptPrintObject
        
      ];
      break;
    case "APPLIED":
    case "PENDINGPAYMENT":
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
    case "CANCELLED":
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
    case "REJECTED":
      downloadMenu = [applicationDownloadObject];
      printMenu = [applicationPrintObject];
      break;
    default:
      break;
  }
  /** END */

  return {
    rightdiv: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        style: { textAlign: "right", display: "flex" }
      },
      children: {
        downloadMenu: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-mr",
          componentPath: "MenuButton",
          props: {
            data: {
              label: { labelName: "DOWNLOAD", labelKey: "MR_DOWNLOAD" },
              leftIcon: "cloud_download",
              rightIcon: "arrow_drop_down",
              props: { variant: "outlined", style: { height: "60px", color: "#FE7A51" }, className: "tl-download-button" },
              menu: downloadMenu
            }
          }
        },
        printMenu: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-mr",
          componentPath: "MenuButton",
          props: {
            data: {
              label: { labelName: "PRINT", labelKey: "MR_PRINT" },
              leftIcon: "print",
              rightIcon: "arrow_drop_down",
              props: { variant: "outlined", style: { height: "60px", color: "#FE7A51" }, className: "tl-print-button" },
              menu: printMenu
            }
          }
        }

      },
      // gridDefination: {
      //   xs: 12,
      //   sm: 6
      // }
    }
  }
};
