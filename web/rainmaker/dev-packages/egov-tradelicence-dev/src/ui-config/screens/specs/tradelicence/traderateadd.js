import commonConfig from "config/common.js";
import { getPattern, getCommonCard, getCommonGrayCard, getCommonSubHeader, getCommonContainer, getCommonHeader, getCommonParagraph, getCommonTitle, getStepperObject, getTextField, getSelectField } from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, unMountScreen } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import set from "lodash/set";
import { httpRequest } from "../../../../ui-utils";
import { getBoundaryData, updatePFOforSearchResults } from "../../../../ui-utils/commons";
import { getAllDataFromBillingSlab, getCurrentFinancialYear, pageResetAndChange, updateMdmsDropDownsForBillingSlab } from "../utils";
import { documentList } from "./applyResource/documentList";
import { footer, getBillingSlabReviewDetails } from "./applyResourceTradeRateAdd/footer";

import {
  
  formwizardFourthStep,
  
} from "../tradelicence/apply";


const tradeTypeChange = (reqObj) => {
  try {
    let { dispatch, index } = reqObj;
    // dispatch(prepareFinalObject(`Licenses[0].tradeLicenseDetail.tradeUnits[${index}].tradeType`, ''));
  } catch (e) {
    console.log(e);
  }
}

const tradeSubTypeChange = (reqObj) => {
  try {
    let { moduleName, rootBlockSub, keyValue, value, state, dispatch, index } = reqObj;


    dispatch(prepareFinalObject(`billingSlab[0].tradeType`, value));

    //dispatch(pFO(`Licenses[0].tradeLicenseDetail.tradeUnits[${index}].tempUom`, currentObject[0].tempUom));
  } catch (e) {
    console.log(e);
  }
}
const tradeUnitCard = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  //moduleName: "egov-tradelicence",

  props: {
    hasAddItem: true,
    scheama: getCommonGrayCard({
      header: getCommonSubHeader(
        {
          labelName: "Trade Unit  ",
          labelKey: "TL_NEW_TRADE_DETAILS_TRADE_UNIT_HEADER"
        },
        {
          style: {
            marginBottom: 18
          }
        }
      ),
      tradeUnitCardContainer: getCommonContainer(
        {
          dynamicMdms: {
            uiFramework: "custom-containers",
            componentPath: "DynamicMdmsContainer",
            props: {
              dropdownFields: [

                {
                  key: 'tradeType',
                  fieldType: "autosuggest",
                  className: "applicant-details-error autocomplete-dropdown",
                  callBack: tradeTypeChange,
                  isRequired: false,
                  requiredValue: true,
                  isDisabled: false

                },
                {
                  key: 'tradeSubType',
                  callBack: tradeSubTypeChange,
                  className: "applicant-details-error autocomplete-dropdown",
                  fieldType: "autosuggest",
                  isRequired: false,
                  requiredValue: true,
                  isDisabled: false
                }
              ],
              moduleName: "TradeLicense",
              masterName: "TradeType",
              rootBlockSub: 'tradeUnits',
              filter: "[?(@.type=='TL')]",
              screenName: "tradeRateAddPage",
              callBackEdit: updateMdmsDropDownsForBillingSlab,
              //isDependency : "DynamicMdms.common-masters.structureTypes.selectedValues[0].structureSubType"
            }
          },
          tradeUOM: getSelectField({
            label: {
              labelName: "UOM (Unit of Measurement)",
              labelKey: "TL_NEW_TRADE_DETAILS_UOM_LABEL"
            },
            placeholder: {
              labelName: "UOM",
              labelKey: "TL_NEW_TRADE_DETAILS_UOM_PLACEHOLDER"
            },
            required: true,
            props: {
              // disabled: true
            },
            data: [{ code: "NUMBEROFDAYS" }, { code: "GROSSUNITS" }],
            jsonPath: "billingSlab[0].uom",
            gridDefination: {
              xs: 12,
              sm: 6
            }
          }),

          tradeRateType: {
            ...getSelectField({
              label: {
                labelName: "City",
                labelKey: "TL_RATE_TYPE_LABEL"
              },

              optionLabel: "name",
              placeholder: { labelName: "Select City", labelKey: "TL_RATE_TYPE" },
              //sourceJsonPath: "applyScreenMdmsData.tenant.tenants",
              data: [{ code: "FLAT" }, { code: "NONFLAT" }],
              jsonPath: "billingSlab[0].type",
              required: true,
              props: {
                required: true,

              }
            }),

          },
          tradeFromUOMValue: getTextField({
            label: {
              labelName: "UOM Value",
              labelKey: "TL_TRADE_RATE_FROM_UOM_VALUE_LABEL"
            },
            placeholder: {
              labelName: "Enter UOM Value",
              labelKey: "TL_TRADE_RATE_FROM_UOM_VALUE_PLACEHOLDER"
            },
            required: true,
            props: {
              //disabled: true,
              setDataInField: true,
              jsonPath: "billingSlab[0].fromUom"
            },
            pattern: getPattern("UOMValue"),
            jsonPath: "billingSlab[0].fromUom",
            gridDefination: {
              xs: 12,
              sm: 6
            }
          }),
          tradeToUOMValue: getTextField({
            label: {
              labelName: "UOM Value",
              labelKey: "TL_TRADE_RATE_TO_UOM_VALUE_LABEL"
            },
            placeholder: {
              labelName: "Enter UOM Value",
              labelKey: "TL_TRADE_RATE_TO_UOM_VALUE_PLACEHOLDER"
            },
            required: true,
            props: {
              //disabled: true,
              setDataInField: true,
              jsonPath: "billingSlab[0].toUom"
            },
            pattern: getPattern("UOMValue"),
            jsonPath: "billingSlab[0].toUom",
            gridDefination: {
              xs: 12,
              sm: 6
            }
          }),

          tradeRate: getTextField({
            label: {
              labelName: "UOM Value",
              labelKey: "TL_TRADE_RATE_RATE_LABEL"
            },
            placeholder: {
              labelName: "Enter UOM Value",
              labelKey: "TL_TRADE_RATE_RATE_VALUE_PLACEHOLDER"
            },
            required: true,
            props: {
              //disabled: true,
              setDataInField: true,
              jsonPath: "billingSlab[0].rate"
            },
            pattern: getPattern("UOMValue"),
            jsonPath: "billingSlab[0].rate",
            gridDefination: {
              xs: 12,
              sm: 6
            }
          }),
        },
        {
          style: {
            overflow: "visible"
          }
        }
      )
    }),
    items: [],

    headerName: "TradeUnits",
    headerJsonPath:
      "children.cardContent.children.header.children.head.children.Accessories.props.label",
    sourceJsonPath: "Licenses[0].tradeLicenseDetail.tradeUnits",
    prefixSourceJsonPath:
      "children.cardContent.children.tradeUnitCardContainer.children",

  },
  type: "array"
};


export const tradeDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Trade Details",
      labelKey: "New Billing Slab"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  tradeDetailsConatiner: getCommonContainer({
    tradeLocCity: {
      ...getSelectField({
        label: {
          labelName: "City",
          labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL"
        },
        localePrefix: {
          moduleName: "TENANT",
          masterName: "TENANTS"
        },
        optionLabel: "name",
        placeholder: { labelName: "Select City", labelKey: "TL_SELECT_CITY" },
        sourceJsonPath: "applyScreenMdmsData.tenant.tenants",
        jsonPath: "billingSlab[0].tenantId",
        required: true,
        props: {
          required: true,

        }
      }),

    },
    applicationType: {
      ...getSelectField({
        label: {
          labelName: "License Type",
          labelKey: "TL_TRADE_RATE_APPLICATION_TYPE_LABEL"
        },
        placeholder: {
          labelName: "Select License Type",
          labelKey: "TL_TRADE_RATE_APPLICATION_TYPE_PLACEHOLDER"
        },
        required: true,
        jsonPath: "billingSlab[0].applicationType",
        // localePrefix: {
        //   moduleName: "TRADELICENSE",
        //   masterName: "LICENSETYPE"
        // },
        visible: true,
        props: {
          //disabled: true,
          //value: "PERMANENT",
          className: "tl-trade-type"
        },
        //sourceJsonPath: "applyScreenMdmsData.TradeLicense.licenseType"
        data: [{ code: "NEW" }, { code: "RENEWAL" }]
      }),

    },
    tradeLicenseType: {
      ...getSelectField({
        label: {
          labelName: "License Type",
          labelKey: "TL_NEW_TRADE_DETAILS_LIC_TYPE_LABEL"
        },
        placeholder: {
          labelName: "Select License Type",
          labelKey: "TL_NEW_TRADE_DETAILS_LIC_TYPE_PLACEHOLDER"
        },
        required: true,
        jsonPath: "billingSlab[0].licenseType",
        localePrefix: {
          moduleName: "TRADELICENSE",
          masterName: "LICENSETYPE"
        },
        visible: true,
        props: {
          //disabled: true,
          //value: "PERMANENT",
          className: "tl-trade-type"
        },
        //sourceJsonPath: "applyScreenMdmsData.TradeLicense.licenseType"
        data: [{ code: "PERMANENT" }, { code: "TEMPORARY" }]
      }),

    },

  },

  ),
  tradeUnitCard
});

export const stepsData = [
  { labelName: "Trade Details", labelKey: "TL_COMMON_TR_DETAILS" },
  
  { labelName: "Summary", labelKey: "TL_COMMON_SUMMARY" }
];
export const stepper = getStepperObject(
  { props: { activeStep: 0 } },
  stepsData
);
export const header = getCommonContainer({
  header:
    getQueryArg(window.location.href, "action") !== "edit"
      ? getCommonHeader({
        labelName: `Apply for New Trade License ${process.env.REACT_APP_NAME === "Citizen"
          ? "(" + getCurrentFinancialYear() + ")"
          : ""
          }`,
        // dynamicArray: getQueryArg(window.location.href, "action") === "EDITRENEWAL" ? [getnextFinancialYear(getCurrentFinancialYear())]:[getCurrentFinancialYear()],
        labelKey: getQueryArg(window.location.href, "action") === "EDITRENEWAL" ? "TL_COMMON_APPL_RENEWAL_LICENSE_YEAR" : "TL_COMMON_APPL_NEW_LICENSE_YEAR"

      })
      : {},
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-tradelicence",
    componentPath: "ApplicationNoContainer",
    props: {
      number: "NA"
    },
    visible: false
  }
});


export const getBillingSlabData = async (action, state, dispatch) => {

  //let tenantId = getQueryArg(window.location.href, "tenantId");
  let licenseType = getQueryArg(window.location.href, "licenseType");
  let applicationType = getQueryArg(window.location.href, "applicationType");
  let tradeType = getQueryArg(window.location.href, "tradeType");
  let type = getQueryArg(window.location.href, "type");
  let uom = getQueryArg(window.location.href, "uom");
  let from = getQueryArg(window.location.href, "from");
  let to = getQueryArg(window.location.href, "to");

  try {

    let queryObject = [
      {
        key: "tenantId",
        value: getTenantId()
      },
      {
        key: "licenseType",
        value: licenseType
      },
      {
        key: "applicationType",
        value: applicationType
      },
      {
        key: "tradeType",
        value: tradeType
      },
      {
        key: "type",
        value: type
      },
      {
        key: "uom",
        value: uom
      },
      {
        key: "from",
        value: from
      },
      {
        key: "to",
        value: to
      }
    ];
    let payload = null;
    payload = await httpRequest(
      "post",
      "/tl-calculator/billingslab/_search",
      "",
      queryObject
    );

    console.log(payload, "Nero Payload h")
    //return payload.billingSlab[0];
    dispatch(prepareFinalObject("billingSlab[0]", payload.billingSlab[0]));
  } catch (e) {
    console.log(e);
  }
}
export const getMdmsData = async (action, state, dispatch) => {

  let TenantIdAppliedFor = getQueryArg(window.location.href, "tenantId");

  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "TradeLicense",
          masterDetails: [

            { name: "ApplicationType" },

          ]
        },
        {
          moduleName: "common-masters",
          masterDetails: [

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


    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));

  } catch (e) {
    console.log(e);
  }
};

export const getData = async (action, state, dispatch) => {
  const queryValue = getQueryArg(window.location.href, "applicationNumber");
  const tenantId = getQueryArg(window.location.href, "tenantId");

  const applicationNo = queryValue
    ? queryValue
    : get(
      state.screenConfiguration.preparedFinalObject,
      "Licenses[0].oldLicenseNumber",
      null
    );
  await getMdmsData(action, state, dispatch);
  await getAllDataFromBillingSlab(getTenantId(), dispatch);


  if (applicationNo) {
    //Edit/Update Flow ----
    const applicationType = get(
      state.screenConfiguration.preparedFinalObject,
      "Licenses[0].tradeLicenseDetail.additionalDetail.applicationType",
      null
    );
    const isEditRenewal = getQueryArg(window.location.href, "action") === "EDITRENEWAL";


    // dispatch(prepareFinalObject("LicensesTemp", []));
    await updatePFOforSearchResults(action, state, dispatch, applicationNo, tenantId);


  }
};

export const formwizardFirstStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form1"
  },
  children: {
    tradeDetails
  }
};


const billingSlabReviewDetails = getBillingSlabReviewDetails();
export const billingSlabReview = getCommonCard({
  header: getCommonTitle({
    labelName: "Please review your Application and Submit",
    labelKey: "Billing Slab Summary"
  }),
  
  billingSlabReviewDetails,
  
});

export const formwizardSecondStep = {
  uiFramework: "custom-atoms",
  componentPath: "Form",
  props: {
    id: "apply_form2"
  },
  children: {
  billingSlabReview
  },
  visible: false
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "traderateadd",
  // hasBeforeInitAsync:true,
  beforeInitScreen: (action, state, dispatch) => {
    const billingSlabRecId = getQueryArg(window.location.href, "recordId");
    // let { isRequiredDocuments } = state.screenConfiguration.preparedFinalObject;
    dispatch(unMountScreen("search"));
    dispatch(unMountScreen("tradesearch"));
    dispatch(unMountScreen("search-preview"));
    const tenantId = getTenantId();
    dispatch(prepareFinalObject("billingSlab", []));
    // dispatch(fetchLocalizationLabel(getLocale(), tenantId, tenantId));
    getData(action, state, dispatch).then(responseAction => {
      const queryObj = [{ key: "tenantId", value: tenantId }];
      // getBoundaryData(action, state, dispatch, queryObj);

    //  getBillingSlabData(action, state, dispatch, billingSlabRecId, tenantId)

    });

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
        footer
      }
    },

  }
};

export default screenConfig;
