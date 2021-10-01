import commonConfig from "config/common.js";
import { getCommonCard, getCommonContainer, getCommonHeader, getCommonParagraph, getCommonTitle, getStepperObject } from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, unMountScreen } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import set from "lodash/set";
import { httpRequest } from "../../../../ui-utils";
import { getBoundaryData, updatePFOforSearchResults } from "../../../../ui-utils/commons";
import { getAllDataFromBillingSlab, getCurrentFinancialYear, pageResetAndChange } from "../utils";
import { documentList } from "./applyResource/documentList";
import { footer } from "./applyResource/footer";
import { brideDetails, primaryOwnerDetails } from "./applyResource/brideDetails";
import { groomDetails } from "./applyResource/groomDetails";
import { tradeLocationDetails } from "./applyResource/tradeLocationDetails";
import { brideAddress } from "./applyResource/brideAddress";
import { groomAddress } from "./applyResource/groomAddress";
import { witnessDetails } from "./applyResource/witnessDetails";
import { guardianDetails } from "./applyResource/guardianDetails";
import { tradeReviewDetails } from "./applyResource/tradeReviewDetails";
import {
  dispatchMultipleFieldChangeAction
} from "egov-ui-framework/ui-config/screens/specs/utils";

export const stepsData = [
  {
    labelName: "Trade Details",
    //  labelKey: "TL_COMMON_TR_DETAILS",
    labelKey: "Marriage Details",
  },
  {
    labelName: "Owner Details",
    labelKey: "Guardian Details"
    //labelKey: "TL_COMMON_OWN_DETAILS"
  },
  {
    labelName: "Documents",
    // labelKey: "TL_COMMON_DOCS",
    labelKey: "Witness Details"
  },
  {
    labelName: "Summary",
    labelKey: "Photo & Docs"
    //labelKey: "TL_COMMON_SUMMARY"
  },
  {
    labelName: "Summary",
    labelKey: "Summary"
    //labelKey: "TL_COMMON_SUMMARY"
  }
];
export const stepper = getStepperObject(
  { props: { activeStep: 0 } },
  stepsData
);
export const header = getCommonContainer({
  header:
    getQueryArg(window.location.href, "action") !== "edit"
      ? getCommonHeader({
        labelName: "MR_NEW_APPL_HEADER",
        // dynamicArray: getQueryArg(window.location.href, "action") === "EDITRENEWAL" ? [getnextFinancialYear(getCurrentFinancialYear())]:[getCurrentFinancialYear()],
        labelKey: "MR_NEW_APPL_HEADER"

      })
      : {},
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-mr",
    componentPath: "ApplicationNoContainer",
    props: {
      number: "NA"
    },
    visible: false
  }
});

export const tradeDocumentDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Required Documents",
      labelKey: "MR_UPLOAD_DOCS_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  paragraph: getCommonParagraph({
    labelName:
      "Only one file can be uploaded for one document. If multiple files need to be uploaded then please combine all files in a pdf and then upload",
    labelKey: "MR_UPLOAD_DOCS_SUBHEADER"
  }),
  documentList
});

export const getMdmsData = async (action, state, dispatch) => {

  let TenantIdAppliedFor = getQueryArg(window.location.href, "tenantId");

  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "MarriageRegistration",
          masterDetails: [


            { name: "documentObj" }
          ]
        },
        {
          moduleName: "common-masters",
          masterDetails: [
            { name: "OwnerType" },
            { name: "DocumentType" },
            { name: "UOM" },
          ]
        },
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants"
            }
          ]
        },
        {
          moduleName: "egf-master",
          masterDetails: [{ name: "FinancialYear" }]
        }
      ]
    }
  };
  let mdmsWardBody = {
    MdmsCriteria: {
      tenantId: TenantIdAppliedFor,
      moduleDetails: [

        {
          moduleName: "Ward",
          masterDetails: [
            {
              name: "Ward"
            }
          ]
        },

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
    const localities = get(
      state.screenConfiguration,
      "preparedFinalObject.applyScreenMdmsData.tenant.localities",
      []
    );
    if (localities && localities.length > 0) {
      payload.MdmsRes.tenant.localities = localities;
    }
    // payload.MdmsRes.MarriageRegistration.TlPeriod = [{ code: "1", active: true }, { code: "2", active: true }, { code: "3", active: true }, { code: "4", active: true }, { code: "5", active: true }];
    payload.MdmsRes.MarriageRegistration.mrCountry = [
      { code: "AFGHANISTAN", active: true },
      { code: "AUSTRALIA", active: true },
      { code: "BANGLADESH", active: true },
      { code: "BELGIUM", active: true },
      { code: "CANADA", active: true },
      { code: "CHINA", active: true },
      { code: "ENGLAND", active: true },
      { code: "FINLAND", active: true },
      { code: "FRANCE", active: true },
      { code: "INDIA", active: true },
      { code: "ITALY", active: true },
      { code: "MALTA", active: true },
      { code: "NEPAL", active: true },
      { code: "NEW ZEALAND", active: true },
      { code: "PAKISTAN", active: true },
      { code: "ROMANIA", active: true },
      { code: "SINGAPORE", active: true },
      { code: "SPAIN", active: true },
      { code: "UKRAINE", active: true },
      { code: "UNITED ARAB EMIRATES", active: true },
      { code: "UNITEDKINGDOM", active: true },
      { code: "USA", active: true }
    ];
    payload.MdmsRes.MarriageRegistration.mrState = [{ code: "State 1", active: true }, { code: "State 2", active: true }, { code: "State 3", active: true }, { code: "State 4", active: true }, { code: "State 5", active: true }];
    payload.MdmsRes.MarriageRegistration.mrDistrict = [{ code: "District 1", active: true }, { code: "District 2", active: true }, { code: "District 3", active: true }, { code: "District 4", active: true }, { code: "District 5", active: true }];
    payload.MdmsRes.MarriageRegistration.yesNoBox = [{ code: "No", active: true }, { code: "Yes", active: true }];


    let payload2 = null;
    payload2 = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsWardBody
    );

    let wardData = get(
      payload2,
      "MdmsRes.Ward",
      []
    )
    payload.MdmsRes.MarriageRegistration.Ward = wardData;

    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
    //dispatch(prepareFinalObject("applyScreenMdmsData", payload2.MdmsRes));
    let financialYearData = get(
      payload,
      "MdmsRes.egf-master.FinancialYear",
      []
    ).filter(item => item.module === "TL" && item.active === true);
    set(payload, "MdmsRes.egf-master.FinancialYear", financialYearData);
  } catch (e) {
    console.log(e);
  }
};

export const getData = async (action, state, dispatch) => {
  const queryValue = getQueryArg(window.location.href, "applicationNumber");
  const tenantId = getQueryArg(window.location.href, "tenantId");

  const applicationNo = queryValue;

  await getMdmsData(action, state, dispatch);
  //await getAllDataFromBillingSlab(getTenantId(), dispatch);


  if (applicationNo) {
    //Edit/Update Flow ----
    const applicationType = get(
      state.screenConfiguration.preparedFinalObject,
      "MarriageRegistrations[0].applicationType",
      null
    );
    const isEditRenewal = getQueryArg(window.location.href, "action") === "EDITRENEWAL";

    if (getQueryArg(window.location.href, "action") !== "edit" && !isEditRenewal) {
      dispatch(
        prepareFinalObject("MarriageRegistrations", [
          {
            licenseType: "PERMANENT",
            oldLicenseNumber: queryValue ? "" : applicationNo,
            tradeLicenseDetail: {
              additionalDetail: {
                applicationType: applicationType ? applicationType : "NEW"
              }
            }
          }
        ])
      );
    }
    // dispatch(prepareFinalObject("LicensesTemp", []));
    await updatePFOforSearchResults(action, state, dispatch, applicationNo, tenantId);

    if (!queryValue) {
      const oldApplicationNo = get(
        state.screenConfiguration.preparedFinalObject,
        "MarriageRegistrations[0].applicationNumber",
        null
      );
      dispatch(
        prepareFinalObject("MarriageRegistrations[0].oldLicenseNumber", oldApplicationNo)
      );
      if (oldApplicationNo !== null) {
        dispatch(prepareFinalObject("MarriageRegistrations[0].financialYear", ""));
        dispatch(
          prepareFinalObject(
            "MarriageRegistrations[0].tradeLicenseDetail.additionalDetail.applicationType",
            "APPLICATIONTYPE.RENEWAL"
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.financialYear",
            "props.value",
            ""
          )
        );
        dispatch(
          handleField(
            "apply",
            "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.applicationType",
            "props.value",
            "APPLICATIONTYPE.RENEWAL"
          )
        );
      }

      dispatch(prepareFinalObject("MarriageRegistrations[0].applicationNumber", ""));
      dispatch(
        handleField(
          "apply",
          "components.div.children.headerDiv.children.header.children.applicationNumber",
          "visible",
          false
        )
      );
    }


    const hidePrimaryOwnerSection = [
      {
        path: "components.div.children.formwizardFirstStep.children.primaryOwnerDetails",
        property: "visible",
        value: false
      }


    ];
    dispatchMultipleFieldChangeAction("apply", hidePrimaryOwnerSection, dispatch);

  } else {
    dispatch(
      prepareFinalObject(
        "MarriageRegistrations[0].coupleDetails[0].bride.title",
        "MRs"
      )
    );
    dispatch(
      prepareFinalObject(
        "MarriageRegistrations[0].coupleDetails[0].groom.title",
        "MR"
      )
    );

    dispatch(
      prepareFinalObject(
        "MarriageRegistrations[0].coupleDetails[0].bride.tenantId",
        tenantId
      )
    );
    dispatch(
      prepareFinalObject(
        "MarriageRegistrations[0].coupleDetails[0].groom.tenantId",
        tenantId
      )
    );
    dispatch(
      prepareFinalObject(
        "MarriageRegistrations[0].coupleDetails[0].bride.isGroom",
        false
      )
    );
    dispatch(
      prepareFinalObject(
        "MarriageRegistrations[0].coupleDetails[0].groom.isGroom",
        true
      )
    );
    dispatch(
      prepareFinalObject(
        "MarriageRegistrations[0].applicationType",
        "NEW"
      )
    );
    dispatch(prepareFinalObject("MarriageRegistrations[0].coupleDetails[0].bride.address.country", "INDIA"));
    dispatch(prepareFinalObject("MarriageRegistrations[0].coupleDetails[0].groom.address.country", "INDIA"));
    dispatch(prepareFinalObject("MarriageRegistrations[0].coupleDetails[0].bride.isDivyang", "No"));
    dispatch(prepareFinalObject("MarriageRegistrations[0].coupleDetails[0].groom.isDivyang", "No"));


  }
};

export const formwizardFirstStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form1"
  },
  children: {
    tradeLocationDetails,
    primaryOwnerDetails,
    brideDetails,
    groomDetails

  }
};

export const formwizardSecondStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form2"
  },
  children: guardianDetails,
  visible: false
};

export const formwizardThirdStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form3"
  },
  children: witnessDetails,
  visible: false
};

export const formwizardFourthStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form4"
  },
  children: {
    tradeDocumentDetails
  },

  visible: false
};

export const formwizardFifthStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form5"
  },
  children: {
    tradeReviewDetails
  },
  visible: false
};

// export const formwizardSixthStep = {
//   uiFramework: "custom-atoms",
//   componentPath: "Form",
//   props: {
//     id: "apply_form6"
//   },
//   children: {
//     tradeReviewDetails
//   },
//   visible: false
// };

const screenConfig = {
  uiFramework: "material-ui",
  name: "apply",
  // hasBeforeInitAsync:true,
  beforeInitScreen: (action, state, dispatch) => {
    const applicationNo = getQueryArg(window.location.href, "applicationNumber");
    // let { isRequiredDocuments } = state.screenConfiguration.preparedFinalObject;
    dispatch(unMountScreen("search"));
    dispatch(unMountScreen("search-preview"));
   // const tenantId = getTenantId();
   const tenantId = getQueryArg(window.location.href, "tenantId");

    const URL = window.location.href
    const URLsplit = URL.split("/")
    if (URLsplit[URLsplit.length - 1] == "apply") {
      pageResetAndChange(state, dispatch, tenantId)
    }
    // dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));
    getData(action, state, dispatch).then(responseAction => {
      const queryObj = [{ key: "tenantId", value: tenantId }];
      getBoundaryData(action, state, dispatch, queryObj);

      // dispatch(
      //   prepareFinalObject(
      //     "MarriageRegistrations[0].tenantId",
      //     tenantId
      //   )
      // );
      //"components.div.children.formwizardFirstStep.children.tradeLocationDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLocCity"
      let props = get(
        action.screenConfig,
        "components.div.children.formwizardFirstStep.children.tradeLocationDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLocCity.props",
        {}
      );
      props.value = tenantId;
      props.disabled = true;
      set(
        action.screenConfig,
        "components.div.children.formwizardFirstStep.children.tradeLocationDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLocCity.props",
        props
      );
      dispatch(
        prepareFinalObject(
          "MarriageRegistrations[0].tenantId",
          tenantId
        )
      );
      const mohallaLocalePrefix = {
        moduleName: tenantId,
        masterName: "REVENUE"
      };
      set(
        action.screenConfig,
        "components.div.children.formwizardFirstStep.children.tradeLocationDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLocMohalla.props.localePrefix",
        mohallaLocalePrefix
      );






    });
    if (applicationNo) {

    } else {




      dispatch(
        prepareFinalObject(
          "MarriageRegistrations[0].coupleDetails[0].bride.title",
          "MRs"
        )
      );
      dispatch(
        prepareFinalObject(
          "MarriageRegistrations[0].coupleDetails[0].groom.title",
          "MR"
        )
      );

      dispatch(
        prepareFinalObject(
          "MarriageRegistrations[0].coupleDetails[0].bride.tenantId",
          tenantId
        )
      );
      dispatch(
        prepareFinalObject(
          "MarriageRegistrations[0].coupleDetails[0].groom.tenantId",
          tenantId
        )
      );
      dispatch(
        prepareFinalObject(
          "MarriageRegistrations[0].coupleDetails[0].bride.isGroom",
          false
        )
      );
      dispatch(
        prepareFinalObject(
          "MarriageRegistrations[0].coupleDetails[0].groom.isGroom",
          true
        )
      );
      dispatch(
        prepareFinalObject(
          "MarriageRegistrations[0].applicationType",
          "NEW"
        )
      );
      dispatch(prepareFinalObject("MarriageRegistrations[0].coupleDetails[0].bride.address.country", "INDIA"));
      dispatch(prepareFinalObject("MarriageRegistrations[0].coupleDetails[0].groom.address.country", "INDIA"));
      dispatch(prepareFinalObject("MarriageRegistrations[0].coupleDetails[0].bride.isDivyang", "No"));
      dispatch(prepareFinalObject("MarriageRegistrations[0].coupleDetails[0].groom.isDivyang", "No"));
    }

    return action;
  },

  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 10
              },
              ...header
            }
          }
        },
        stepper,
        formwizardFirstStep,
        formwizardSecondStep,
        formwizardThirdStep,
        formwizardFourthStep,
        formwizardFifthStep,
        footer
      }
    },
    // breakUpDialog: {
    //   uiFramework: "custom-containers-local",
    //   moduleName: "egov-tradelicence",
    //   componentPath: "ViewBreakupContainer",
    //   props: {
    //     open: false,
    //     maxWidth: "md",
    //     screenKey: "apply"
    //   }
    // }
  }
};

export default screenConfig;
