import {
  getCommonCard,


  getCommonContainer, getCommonGrayCard, getCommonHeader,

  getCommonTitle, dispatchMultipleFieldChangeAction
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
  unMountScreen
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getQueryArg,
  setBusinessServiceDataToLocalStorage, setDocuments
} from "egov-ui-framework/ui-utils/commons";
import { loadUlbLogo } from "egov-ui-kit/utils/pdfUtils/generatePDF";
import get from "lodash/get";
import set from "lodash/set";
import store from "ui-redux/store";
import { httpRequest } from "../../../../ui-utils";
import { checkValidOwners, getSearchResults } from "../../../../ui-utils/commons";
import {
  createEstimateData,


  getDialogButton, getFeesEstimateCard,
  getHeaderSideText,
  getTransformedStatus, setMultiOwnerForSV,
  setValidToFromVisibilityForSV
} from "../utils";
import { loadReceiptGenerationData } from "../utils/receiptTransformer";
import { downloadPrintContainer, footerReviewTop } from "./applyResource/footer";
import { getReviewDocuments } from "./applyResource/review-documents";
import { appointmentDetails } from "./applyResource/appointmentDetails";
import { getReviewTrade } from "./applyResource/review-trade";
import { getgroomAddressAndGuardianDetails } from "./applyResource/groom-address-guardian-detail";
import { getWitnessDetails, getAppointmentDetails, appointmentDetailsInfo } from "./applyResource/witness-detail";
import { orderWfProcessInstances } from "egov-ui-framework/ui-utils/commons";

const tenantId = getQueryArg(window.location.href, "tenantId");
let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
let headerSideText = { word1: "", word2: "" };


const getTradeTypeSubtypeDetails = payload => {
  const tradeUnitsFromApi = get(
    payload,
    "MarriageRegistrations[0].tradeUnits",
    []
  );
  const tradeUnitDetails = [];
  tradeUnitsFromApi.forEach(tradeUnit => {
    const { tradeType } = tradeUnit;
    const tradeDetails = tradeType.split(".");
    tradeUnitDetails.push({
      trade: get(tradeDetails, "[0]", ""),
      tradeType: get(tradeDetails, "[1]", ""),
      tradeSubType: get(tradeDetails, "[2]", "")
    });
  });
  return tradeUnitDetails;
};

const searchResults = async (action, state, dispatch, applicationNo) => {
  let queryObject = [
    { key: "tenantId", value: tenantId },
    { key: "applicationNumber", value: applicationNo }
  ];
  let payload = await getSearchResults(queryObject);

  headerSideText = getHeaderSideText(
    get(payload, "MarriageRegistrations[0].status"),
    get(payload, "MarriageRegistrations[0].licenseNumber")
  );
  set(payload, "MarriageRegistrations[0].headerSideText", headerSideText);
  set(payload, "MarriageRegistrations[0].assignee", []);


  await setDocuments(
    payload,
    "MarriageRegistrations[0].applicationDocuments",
    "LicensesTemp[0].reviewDocData",
    dispatch, 'MR'
  );

  let sts = getTransformedStatus(get(payload, "MarriageRegistrations[0].status"));
  payload && dispatch(prepareFinalObject("MarriageRegistrations[0]", payload.MarriageRegistrations[0]));


  //set business service data

  const businessService = get(
    state.screenConfiguration.preparedFinalObject,
    "MarriageRegistrations[0].workflowCode"
  );
  const businessServiceQueryObject = [
    { key: "tenantId", value: tenantId },
    {
      key: "businessServices",
      value: businessService ? businessService : "MR"
    }
  ];

  await setBusinessServiceDataToLocalStorage(businessServiceQueryObject, dispatch);

  //set Trade Types

  payload &&
    dispatch(
      prepareFinalObject(
        "LicensesTemp[0].tradeDetailsResponse",
        getTradeTypeSubtypeDetails(payload)
      )
    );

  const LicenseData = payload.MarriageRegistrations[0];
  const fetchFromReceipt = sts !== "pending_payment";


  // generate estimate data
  createEstimateData(
    LicenseData,
    "LicensesTemp[0].estimateCardData",
    dispatch,
    {},
    fetchFromReceipt
  );


};

const beforeInitFn = async (action, state, dispatch, applicationNumber) => {
  dispatch(unMountScreen("search"));
  dispatch(unMountScreen("apply"));
  //loadUlbLogo(tenantId);

  //Search details for given application Number
  if (applicationNumber) {
    !getQueryArg(window.location.href, "edited") &&
      (await searchResults(action, state, dispatch, applicationNumber));
    //await searchResults(action, state, dispatch, applicationNumber)
    //check for Apply for Correction flow
    const licenseNumber = get(
      state.screenConfiguration.preparedFinalObject,
      `MarriageRegistrations[0].mrNumber`
    );
    let queryObjectSearch = [
      {
        key: "tenantId",
        value: tenantId
      },
      { key: "offset", value: "0" },
      { key: "mrNumbers", value: licenseNumber }
    ];
    const payload = await getSearchResults(queryObjectSearch);
    const length = payload && payload.MarriageRegistrations.length > 0 ? get(payload, `MarriageRegistrations`, []).length : 0;
    dispatch(prepareFinalObject("licenseCount", length));

    const status = get(
      state,
      "screenConfiguration.preparedFinalObject.MarriageRegistrations[0].status"
    );

    let appointmentDetails = get(
      state,
      "screenConfiguration.preparedFinalObject.MarriageRegistrations[0].appointmentDetails"
    );

    let appointmentDetailData =  appointmentDetails && appointmentDetails.filter( item => item.active = true)
    let appointDataDisplay = [];
    if(appointmentDetailData && appointmentDetailData.length){
      var startTime = appointmentDetailData[0].startTime;
      var startDateObj = new Date(startTime);
      var startDate = startDateObj.getDate() < 10 ? "0" + startDateObj.getDate() : startDateObj.getDate();
      var startMonth = startDateObj.getMonth()+1 < 10 ? `0${startDateObj.getMonth()+1}` : startDateObj.getMonth()+1;
      var startHours = startDateObj.getHours() < 10 ? "0" + startDateObj.getHours() : startDateObj.getHours();
      var startMinutes = startDateObj.getMinutes() < 10 ? "0" + startDateObj.getMinutes() : startDateObj.getMinutes();
      let startTimeStr = `${startDate}-${startMonth}-${startDateObj.getFullYear()}, ${startHours}:${startMinutes}`;

      var endTime = appointmentDetailData[0].endTime;
      var endDateObj = new Date(endTime);
      var endDate = endDateObj.getDate() < 10 ? "0" + endDateObj.getDate() : endDateObj.getDate();
      var endMonth = endDateObj.getMonth()+1 < 10 ? `0${endDateObj.getMonth()+1}` : endDateObj.getMonth()+1;
      var endHours = endDateObj.getHours() < 10 ? "0" + endDateObj.getHours() : endDateObj.getHours();
      var endMinutes = endDateObj.getMinutes() < 10 ? "0" + endDateObj.getMinutes() : endDateObj.getMinutes();
      let endTimeStr = `${endDate}-${endMonth}-${endDateObj.getFullYear()}, ${endHours}:${endMinutes}`;
      var description = appointmentDetailData[0].description;
      appointDataDisplay.push({apntStartTime: startTimeStr, apntEndTime: endTimeStr, apntDesc: description})
    }



    dispatch(prepareFinalObject("MarriageRegistrations[0].appointmentDisplayDetails", appointDataDisplay));
    const financialYear = get(
      state,
      "screenConfiguration.preparedFinalObject.MarriageRegistrations[0].financialYear"
    );

    let data = get(state, "screenConfiguration.preparedFinalObject");

    const obj = setStatusBasedValue(status);
    let appDocuments = get(data, "MarriageRegistrations[0].applicationDocuments", []);
    if (appDocuments) {
      let applicationDocs = [];
      appDocuments.forEach(doc => {
        if (doc.length !== 0) {
          applicationDocs.push(doc);
        }
      })
      applicationDocs = applicationDocs.filter(document => document);

      let removedDocs = get(data, "LicensesTemp[0].removedDocs", []);
      if (removedDocs.length > 0) {
        removedDocs.map(removedDoc => {
          applicationDocs = applicationDocs.filter(appDocument => !(appDocument.documentType === removedDoc.documentType && appDocument.fileStoreId === removedDoc.fileStoreId))
        })
      }
      dispatch(prepareFinalObject("MarriageRegistrations[0].applicationDocuments", applicationDocs));
      await setDocuments(
        get(state, "screenConfiguration.preparedFinalObject"),
        "MarriageRegistrations[0].applicationDocuments",
        "LicensesTemp[0].reviewDocData",
        dispatch, 'MR'
      );
    }

    const businessService = get(
      state.screenConfiguration.preparedFinalObject,
      `MarriageRegistrations[0].businessService`
    );
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: tenantId,
        moduleDetails: [
          {
            moduleName: "common-masters",
            masterDetails: [{ name: "uiCommonPay", filter: `[?(@.code=="${businessService}")]` }]
          }
        ]
      }
    };
    try {
      let payload = null;
      payload = await httpRequest(
        "post",
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        mdmsBody
      );
      console.log(payload, "Nero payload")
      dispatch(prepareFinalObject("uiCommonConfig", get(payload.MdmsRes, "common-masters.uiCommonPay[0]")));
    } catch (e) {
      console.log(e);
    }

    // const statusCont = {
    //   word1: {
    //     ...getCommonTitle(
    //       {
    //         jsonPath: "MarriageRegistrations[0].headerSideText.word1"
    //       },
    //       {
    //         style: {
    //           marginRight: "10px",
    //           color: "rgba(0, 0, 0, 0.6000000238418579)"
    //         }
    //       }
    //     )
    //   },
    //   word2: {
    //     ...getCommonTitle({
    //       jsonPath: "MarriageRegistrations[0].headerSideText.word2"
    //     })
    //   },
    //   cancelledLabel: {
    //     ...getCommonHeader(
    //       {
    //         labelName: "Cancelled",
    //         labelKey: "TL_COMMON_STATUS_CANC"
    //       },
    //       { variant: "body1", style: { color: "#E54D42" } }
    //     ),
    //     visible: false
    //   }
    // };
    let CitizenprintCont = '';
    let printCont = '';
    if (status !== "INITIATED") {
      if (process.env.REACT_APP_NAME === "Citizen") {
        CitizenprintCont = footerReviewTop(
          action,
          state,
          dispatch,
          status,
          applicationNumber,
          tenantId,
          "2021"
        );


      } else {
        printCont = downloadPrintContainer(
          action,
          state,
          dispatch,
          status,
          applicationNumber,
          tenantId
        );


      }

    }




    // Get approval details based on status and set it in screenconfig

    if (
      status === "APPROVED" ||
      status === "REJECTED" ||
      status === "CANCELLED"
    ) {
      set(
        action,
        "screenConfig.components.div.children.tradeReviewDetails.children.cardContent.children.approvalDetails.visible",
        true
      );

      if (get(data, "MarriageRegistrations[0].verificationDocuments")) {
        await setDocuments(
          data,
          "MarriageRegistrations[0].verificationDocuments",
          "LicensesTemp[0].verifyDocData",
          dispatch, 'MR'
        );
      } else {
        dispatch(
          handleField(
            "search-preview",
            "components.div.children.tradeReviewDetails.children.cardContent.children.approvalDetails.children.cardContent.children.viewTow.children.lbl",
            "visible",
            false
          )
        );
      }
    } else {
      set(
        action,
        "screenConfig.components.div.children.tradeReviewDetails.children.cardContent.children.approvalDetails.visible",
        false
      );
    }

    const applicationType = get(
      state.screenConfiguration.preparedFinalObject,
      "MarriageRegistrations[0].applicationType"
    );

    const headerrow = getCommonContainer({
      header: getCommonHeader({
        labelName: "Trade License Application (2018-2019)",
        labelKey: "MR_SUMMARY_HEADER"
      }),
      applicationLicence: getCommonContainer({
        applicationNumber: {
          uiFramework: "custom-atoms-local",
          moduleName: "egov-mr",
          componentPath: "ApplicationNoContainer",
          props: {
            number: applicationNumber
          }
        }
      })
    });
    set(
      action.screenConfig,
      "components.div.children.headerDiv.children.header1.children.headertop",
      headerrow
    );

    if (status === "cancelled")
      set(
        action,
        "screenConfig.components.div.children.headerDiv.children.helpSection.children.cancelledLabel.visible",
        true
      );




    setActionItems(action, obj);
    loadReceiptGenerationData(applicationNumber, tenantId);

    if (status !== "INITIATED") {
      process.env.REACT_APP_NAME === "Citizen"
        ? set(
          action,
          "screenConfig.components.div.children.headerDiv.children.helpSection.children",
          CitizenprintCont
        )
        : set(
          action,
          "screenConfig.components.div.children.headerDiv.children.helpSection.children",
          printCont
        );
    }


    if (process.env.REACT_APP_NAME == "Employee") {
      let filteredActions = [];
      //const tenatId = getQueryArg(window.location.href, "tenantId");
      const queryObject = [
        { key: "businessIds", value: applicationNumber },
        { key: "history", value: false },
        { key: "tenantId", value: tenantId }
      ];
      try {
        const payload = await httpRequest(
          "post",
          "egov-workflow-v2/egov-wf/process/_search",
          "",
          queryObject
        );
        console.log(payload, "Nero payload")
        if (payload && payload.ProcessInstances.length > 0) {
          const processInstancest = orderWfProcessInstances(
            payload.ProcessInstances
          );

          console.log(processInstancest, "Nero Ordered");


          if (processInstancest &&
            processInstancest.length > 0) {
            filteredActions = processInstancest && processInstancest[0].nextActions.filter(
              item => item.action == "SCHEDULE" || item.action == "RESCHEDULE"
            );
          }
          console.log(filteredActions, "Nero filteredActions")
          if (process.env.REACT_APP_NAME == "Employee" && filteredActions && filteredActions.length > 0) {
            console.log("Nero In sss")
            const actionDefination = [
              {
                path: "components.div.children.appointmentDetailsFormCard",
                property: "visible",
                value: true
              },
              {
                path: "components.div.children.appointmentDetailsFormCardInfo",
                property: "visible",
                value: false
              },


            ];
            dispatchMultipleFieldChangeAction("search-preview", actionDefination, dispatch);
            // const actionDefination1 = [
            //   {
            //     path: "components.div.children.tradeReviewDetails.children.cardContent.children.appointMentDetails",
            //     property: "visible",
            //     value: false
            //   }

            // ];

            // dispatchMultipleFieldChangeAction("search-preview", actionDefination1, dispatch);

          }


        } else {
          console.log("Nero Error")
        }
      } catch (e) {
        console.log("Nero Error ggg")
      }
    }
    // let filteredActions = [];
    //   console.log(data, "Nero data")
    //   console.log(state, "Nero statesss")
    //  // let ProcessInstances = get(data, "workflow.ProcessInstances",[]);
    // //  const workflowData = get(
    // //   state,
    // //   "screenConfiguration.preparedFinalObject.workflow"
    // // );
    // const workflowData = state && state.screenConfiguration.preparedFinalObject && state.screenConfiguration.preparedFinalObject.workflow;
    // console.log(workflowData, "Nero workflowData")
    //  let ProcessInstances = [];
    //   ProcessInstances = workflowData && workflowData.ProcessInstances;
    //   console.log(ProcessInstances, "Nero ProcessInstances")
    //   if(ProcessInstances &&
    //     ProcessInstances.length > 0){
    //       filteredActions = get(ProcessInstances[ProcessInstances.length - 1], "nextActions", []).filter(
    //         item => item.action == "SCHEDULE" || "RESCHEDULE"
    //       );
    //     }
    //     console.log(filteredActions, "Nero filteredActions")
    //   if(process.env.REACT_APP_NAME == "Employee" && filteredActions && filteredActions.length > 0){
    //     console.log("Nero In sss")
    //     const actionDefination = [
    //       {
    //         path: "components.div.children.appointmentDetailsFormCard",
    //         property: "visible",
    //         value: true
    //       }

    //     ];
    //     dispatchMultipleFieldChangeAction("search-preview", actionDefination, dispatch);
    //   }
  }
};

let titleText = "";

const setStatusBasedValue = status => {
  switch (status) {
    case "approved":
      return {
        titleText: "Review the Trade License",
        titleKey: "TL_REVIEW_TRADE_LICENSE",
        titleVisibility: true,
        roleDefination: {
          rolePath: "user-info.roles",
          roles: ["TL_APPROVER"]
        }
      };
    case "pending_payment":
      return {
        titleText: "Review the Application and Proceed",
        titleKey: "TL_REVIEW_APPLICATION_AND_PROCEED",
        titleVisibility: true,
        roleDefination: {
          rolePath: "user-info.roles",
          roles: ["TL_CEMP"]
        }
      };
    case "pending_approval":
      return {
        titleText: "Review the Application and Proceed",
        titleKey: "TL_REVIEW_APPLICATION_AND_PROCEED",
        titleVisibility: true,
        roleDefination: {
          rolePath: "user-info.roles",
          roles: ["TL_APPROVER"]
        }
      };
    case "cancelled":
      return {
        titleText: "",
        titleVisibility: false,
        roleDefination: {}
      };
    case "rejected":
      return {
        titleText: "",
        titleVisibility: false,
        roleDefination: {}
      };

    default:
      return {
        titleText: "",
        titleVisibility: false,
        roleDefination: {}
      };
  }
};

const headerrow = getCommonContainer({
});

const estimate = getCommonGrayCard({
  estimateSection: getFeesEstimateCard({
    sourceJsonPath: "LicensesTemp[0].estimateCardData"
  })
});

const reviewTradeDetails = getReviewTrade(false);

//const BrideAddressAndGuardianDetails = getBrideAddressAndGuardianDetails(false);

const reviewDocumentDetails = getReviewDocuments(false, false);
const groomAddressAndGuardianDetails = getgroomAddressAndGuardianDetails(false);
const witnessDetails = getWitnessDetails(false);
const appointMentDetails = getAppointmentDetails(false);

// let approvalDetails = getApprovalDetails(status);
let title = getCommonTitle({ labelName: titleText });

const setActionItems = (action, object) => {
  set(
    action,
    "screenConfig.components.div.children.tradeReviewDetails.children.cardContent.children.title",
    getCommonTitle({
      labelName: get(object, "titleText"),
      labelKey: get(object, "titleKey")
    })
  );
  set(
    action,
    "screenConfig.components.div.children.tradeReviewDetails.children.cardContent.children.title.visible",
    get(object, "titleVisibility")
  );
  set(
    action,
    "screenConfig.components.div.children.tradeReviewDetails.children.cardContent.children.title.roleDefination",
    get(object, "roleDefination")
  );

  // set(
  //   action,
  //   "screenConfig.components.div.children.appointmentDetailsFormCard.visible",
  //   false
  // );

};

export const tradeReviewDetails = getCommonCard({
  title,
  estimate,
  reviewTradeDetails,
  groomAddressAndGuardianDetails,
  witnessDetails,
 // appointMentDetails,
  reviewDocumentDetails
});

export const beforeSubmitHook = (MarriageRegistrations = [{}]) => {
  let state = store.getState();


  return MarriageRegistrations;

}
const screenConfig = {
  uiFramework: "material-ui",
  name: "search-preview",
  beforeInitScreen: (action, state, dispatch) => {
    applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    const tenantId = getQueryArg(window.location.href, "tenantId");
    // dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));
    //To set the application no. at the  top
    set(
      action.screenConfig,
      "components.div.children.headerDiv.children.header1.children.applicationNumber.props.number",
      applicationNumber
    );
    beforeInitFn(action, state, dispatch, applicationNumber);
    return action;
  },

  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css search-preview"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header1: {
              gridDefination: {
                xs: 12,
                sm: 8
              },

              ...headerrow

            },
            helpSection: {
              uiFramework: "custom-atoms",
              componentPath: "Container",
              props: {
                color: "primary",
                style: { justifyContent: "flex-end" }
              },
              gridDefination: {
                xs: 12,
                sm: 4,
                align: "right"
              }
            }
          }
        },
        taskStatus: {
          uiFramework: "custom-containers-local",
          componentPath: "WorkFlowContainer",
          moduleName: "egov-workflow",
          // visible: process.env.REACT_APP_NAME === "Citizen" ? false : true,
          props: {
            dataPath: "MarriageRegistrations",
            moduleName: "MR",
            updateUrl: "/mr-services/v1/_update",
            beforeSubmitHook: beforeSubmitHook
          }
        },
        //appointmentDetails: getCommonCard({appointmentDetails}),

        tradeReviewDetails,
        appointmentDetailsFormCard: {
          uiFramework: "custom-atoms",
          componentPath: "Form",
          props: {
            id: "appointment_card_form"
          },
          children: {
            apint: getCommonCard({ appointmentDetails })

          },
          visible: false
        },

        appointmentDetailsFormCardInfo: {
          uiFramework: "custom-atoms",
          componentPath: "Form",
          props: {
            id: "appointment_card_form1"
          },
          children: {
            apnt: getCommonCard({appointmentDetailsInfo})

          },
          visible: true
        },
      }
    },
    // breakUpDialog: {
    //   uiFramework: "custom-containers-local",
    //   moduleName: "egov-mr",
    //   componentPath: "ViewBreakupContainer",
    //   props: {
    //     open: false,
    //     maxWidth: "md",
    //     screenKey: "search-preview"
    //   }
    // }
  }
};

export default screenConfig;
