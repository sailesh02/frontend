import { mohalla } from "egov-ui-kit/config/forms/specs/PropertyTaxPay/utils/reusableFields";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import { fetchGeneralMDMSData, prepareFormData } from "egov-ui-kit/redux/common/actions";
import { setFieldProperty } from "egov-ui-kit/redux/form/actions";
import { fetchDropdownData, generalMDMSDataRequestObj, getGeneralMDMSDataDropdownName, getTranslatedLabel } from "egov-ui-kit/utils/commons";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";
import filter from "lodash/filter";
import get from "lodash/get";
import sortBy from "lodash/sortBy";
import { prepareFinalObject } from "../../../../../../../packages/lib/egov-ui-framework/ui-redux/screen-configuration/actions";
import set from "lodash/set";

const formConfig = {
  name: "demandDetails",
  fields: {
    holdingTax: {
      id: "holding-tax",
      jsonPath: "Properties[0].additionalDetails.holdingTax",
      type: "textfield",
      floatingLabelText: "PT_HOLDING_TAX",
      hintText: "PT_HOLDING_TAX_PLACEHOLDER",
      numcols: 6,
      pattern: /^([0-9][0-9]{0,49})(\.\d{1,2})?$/,
      errorMessage: "PT_HOLDING_TAX_ERRORMSG",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      maxLength: 64,
      required: true,
      updateDependentFields: ({ formKey, field, dispatch, state }) => {
        const additionalDetails = state.screenConfiguration.preparedFinalObject.Properties[0].additionalDetails || {}
        let amountArray = []
        for (const [key, value] of Object.entries(additionalDetails)) {
          amountArray.push(Number(value)) // "a 5", "b 7", "c 9"
        }
        const total = amountArray.reduce((a, b) => a + b, 0)
        dispatch(setFieldProperty("demandDetails", "totalAmount", "value", total));
      }
    },
    lightTax: {
      id: "ligth-tax",
      jsonPath: "Properties[0].additionalDetails.lightTax",
      type: "textfield",
      floatingLabelText: "PT_LIGHT_TAX",
      hintText: "PT_LIGHT_TAX_PLACEHOLDER",
      numcols: 6,
      pattern: /^([0-9][0-9]{0,49})(\.\d{1,2})?$/,
      errorMessage: "PT_LIGHT_TAX_ERRORMSG",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      maxLength: 64,
      required: true,
      updateDependentFields: ({ formKey, field, dispatch, state }) => {
        const additionalDetails = state.screenConfiguration.preparedFinalObject.Properties[0].additionalDetails || {}
        let amountArray = []
        for (const [key, value] of Object.entries(additionalDetails)) {
          amountArray.push(Number(value)) // "a 5", "b 7", "c 9"
        }
        const total = amountArray.reduce((a, b) => a + b, 0)
        dispatch(setFieldProperty("demandDetails", "totalAmount", "value", total));
      }
    },
    waterTax: {
      id: "water-tax",
      jsonPath: "Properties[0].additionalDetails.waterTax",
      type: "textfield",
      floatingLabelText: "PT_WATER_TAX",
      hintText: "PT_WATER_TAX_PLACEHOLDER",
      numcols: 6,
      errorMessage: "PT_WATER_TAX_ERRORMSG",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      maxLength: 64,
      pattern: /^([0-9][0-9]{0,49})(\.\d{1,2})?$/,
      required: true,
      updateDependentFields: ({ formKey, field, dispatch, state }) => {
        const additionalDetails = state.screenConfiguration.preparedFinalObject.Properties[0].additionalDetails || {}
        let amountArray = []
        for (const [key, value] of Object.entries(additionalDetails)) {
          amountArray.push(Number(value)) // "a 5", "b 7", "c 9"
        }
        const total = amountArray.reduce((a, b) => a + b, 0)
        dispatch(setFieldProperty("demandDetails", "totalAmount", "value", total));
      }
    },
    drainageTax: {
      id: "drainage-tax",
      jsonPath: "Properties[0].additionalDetails.drainageTax",
      type: "textfield",
      floatingLabelText: "PT_DRAINAGE_TAX",
      hintText: "PT_DRAINAGE_TAX_PLACEHOLDER",
      numcols: 6,
      pattern: /^([0-9][0-9]{0,49})(\.\d{1,2})?$/,
      errorMessage: "PT_DRAINAGE_TAX_ERRORMSG",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      maxLength: 64,
      required: true,
      updateDependentFields: ({ formKey, field, dispatch, state }) => {
        const additionalDetails = state.screenConfiguration.preparedFinalObject.Properties[0].additionalDetails || {}
        let amountArray = []
        for (const [key, value] of Object.entries(additionalDetails)) {
          amountArray.push(Number(value)) // "a 5", "b 7", "c 9"
        }
        const total = amountArray.reduce((a, b) => a + b, 0)
        dispatch(setFieldProperty("demandDetails", "totalAmount", "value", total));
      }
    },
    latrineTax: {
      id: "latrine-tax",
      jsonPath: "Properties[0].additionalDetails.latrineTax",
      type: "textfield",
      floatingLabelText: "PT_LATRINE_TAX",
      hintText: "PT_LATRINE_TAX_PLACEHOLDER",
      numcols: 6,
      pattern: /^([0-9][0-9]{0,49})(\.\d{1,2})?$/,
      errorMessage: "PT_LATRINE_TAX_ERRORMSG",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      maxLength: 64,
      required: true,
      updateDependentFields: ({ formKey, field, dispatch, state }) => {
        const additionalDetails = state.screenConfiguration.preparedFinalObject.Properties[0].additionalDetails || {}
        let amountArray = []
        for (const [key, value] of Object.entries(additionalDetails)) {
          amountArray.push(Number(value)) // "a 5", "b 7", "c 9"
        }
        const total = amountArray.reduce((a, b) => a + b, 0)
        dispatch(setFieldProperty("demandDetails", "totalAmount", "value", total));
      }
    },
    parkingTax: {
      id: "parking-tax",
      jsonPath: "Properties[0].additionalDetails.parkingTax",
      type: "textfield",
      floatingLabelText: "PT_PARKING_TAX",
      hintText: "PT_PARKING_TAX_PLACEHOLDER",
      numcols: 6,
      pattern: /^([0-9][0-9]{0,49})(\.\d{1,2})?$/,
      errorMessage: "PT_PARKING_TAX_ERRORMSG",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      maxLength: 64,
      required: true,
      updateDependentFields: ({ formKey, field, dispatch, state }) => {
        const additionalDetails = state.screenConfiguration.preparedFinalObject.Properties[0].additionalDetails || {}
        let amountArray = []
        for (const [key, value] of Object.entries(additionalDetails)) {
          amountArray.push(Number(value)) // "a 5", "b 7", "c 9"
        }
        const total = amountArray.reduce((a, b) => a + b, 0)
        dispatch(setFieldProperty("demandDetails", "totalAmount", "value", total));
      }
    },
    solidWasteUserCharges: {
      id: "solidwaste-charges",
      jsonPath: "Properties[0].additionalDetails.solidWasteUserCharges",
      type: "textfield",
      floatingLabelText: "PT_SOLID_WASTER_USER_CHARGES",
      hintText: "PT_SOLID_WASTER_USER_CHARGES_PLACEHOLDER",
      numcols: 6,
      pattern: /^([0-9][0-9]{0,49})(\.\d{1,2})?$/,
      errorMessage: "PT_SOLID_WASTER_USER_CHARGES_ERRORMSG",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      maxLength: 64,
      required: true,
      updateDependentFields: ({ formKey, field, dispatch, state }) => {
        const additionalDetails = state.screenConfiguration.preparedFinalObject.Properties[0].additionalDetails || {}
        let amountArray = []
        for (const [key, value] of Object.entries(additionalDetails)) {
          amountArray.push(Number(value)) // "a 5", "b 7", "c 9"
        }
        const total = amountArray.reduce((a, b) => a + b, 0)
        dispatch(setFieldProperty("demandDetails", "totalAmount", "value", total));
      }
    },
    ownershipExemption: {
      id: "ownership-exemption",
      jsonPath: "Properties[0].additionalDetails.ownershipExemption",
      type: "textfield",
      floatingLabelText: "PT_OWNERSHIP_EXEMPTION",
      hintText: "PT_OWNERSHIP_EXEMPTION_PLACEHOLDER",
      numcols: 6,
      pattern: /^([0-9][0-9]{0,49})(\.\d{1,2})?$/,
      errorMessage: "PT_OWNERSHIP_EXEMPTION_ERRORMSG",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      maxLength: 64,
      required: true,
      updateDependentFields: ({ formKey, field, dispatch, state }) => {
        const additionalDetails = state.screenConfiguration.preparedFinalObject.Properties[0].additionalDetails || {}
        let amountArray = []
        for (const [key, value] of Object.entries(additionalDetails)) {
          amountArray.push(Number(value)) // "a 5", "b 7", "c 9"
        }
        const total = amountArray.reduce((a, b) => a + b, 0)
        dispatch(setFieldProperty("demandDetails", "totalAmount", "value", total));
      }
    },
    usageExemption: {
      id: "usage-exemption",
      jsonPath: "Properties[0].additionalDetails.usageExemption",
      type: "textfield",
      floatingLabelText: "PT_USAGE_EXEMPTION",
      hintText: "PT_USAGE_EXEMPTION_PLACEHOLDER",
      numcols: 6,
      errorMessage: "PT_USAGE_EXEMPTION_ERRORMSG",
      pattern: /^([0-9][0-9]{0,49})(\.\d{1,2})?$/,
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      maxLength: 64,
      required: true,
      updateDependentFields: ({ formKey, field, dispatch, state }) => {
        const additionalDetails = state.screenConfiguration.preparedFinalObject.Properties[0].additionalDetails || {}
        let amountArray = []
        for (const [key, value] of Object.entries(additionalDetails)) {
          amountArray.push(Number(value)) // "a 5", "b 7", "c 9"
        }
        const total = amountArray.reduce((a, b) => a + b, 0)
        dispatch(setFieldProperty("demandDetails", "totalAmount", "value", total));
      }
    },
    interest: {
      id: "interest",
      jsonPath: "Properties[0].additionalDetails.interest",
      type: "textfield",
      floatingLabelText: "PT_INTEREST",
      hintText: "PT_INTEREST_PLACEHOLDER",
      numcols: 6,
      pattern: /^([0-9][0-9]{0,49})(\.\d{1,2})?$/,
      errorMessage: "PT_INTEREST_ERRORMSG",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      maxLength: 64,
      required: true,
      updateDependentFields: ({ formKey, field, dispatch, state }) => {
        const additionalDetails = state.screenConfiguration.preparedFinalObject.Properties[0].additionalDetails || {}
        let amountArray = []
        for (const [key, value] of Object.entries(additionalDetails)) {
          amountArray.push(Number(value)) // "a 5", "b 7", "c 9"
        }
        const total = amountArray.reduce((a, b) => a + b, 0)
        dispatch(setFieldProperty("demandDetails", "totalAmount", "value", total));
      }
    },
    penalty: {
      id: "penalty",
      jsonPath: "Properties[0].additionalDetails.penalty",
      type: "textfield",
      floatingLabelText: "PT_PENALTY",
      hintText: "PT_PENALTY_PLACEHOLDER",
      numcols: 6,
      errorMessage: "PT_PENALTY_ERRORMSG",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      maxLength: 64,
      pattern: /^([0-9][0-9]{0,49})(\.\d{1,2})?$/,
      required: true,
      updateDependentFields: ({ formKey, field, dispatch, state }) => {
        const additionalDetails = state.screenConfiguration.preparedFinalObject.Properties[0].additionalDetails || {}
        let amountArray = []
        for (const [key, value] of Object.entries(additionalDetails)) {
          amountArray.push(Number(value)) // "a 5", "b 7", "c 9"
        }
        const total = amountArray.reduce((a, b) => a + b, 0)
        dispatch(setFieldProperty("demandDetails", "totalAmount", "value", total.toFixed(2)),0);
      }
    },
    totalAmount: {
      id: "totalAmount",
      jsonPath: "Properties[0].additionalDetails.totalAmount",
      type: "textfield",
      floatingLabelText: "PT_TOTAL_AMOUNT",
      hintText: "PT_TOTAL_AMOUNT_PLACEHOLDER",
      numcols: 6,
      errorMessage: "PT_TOTAL_AMOUNT_ERRORMSG",
      errorStyle: { position: "absolute", bottom: -8, zIndex: 5 },
      maxLength: 64,
      pattern: /^[1-9][0-9]{0,50}$/
    }
   
  },
  afterInitForm: (action, store, dispatch) => {
    // try {
    //   let state = store.getState();
    //   const { localizationLabels } = state.app;
    //   const { cities, citiesByModule } = state.common;
    //   const PT = citiesByModule && citiesByModule.PT;
    //   if (PT) {
    //     const tenants = PT.tenants;
    //     const dd = tenants.reduce((dd, tenant) => {
    //       let selected = cities.find((city) => {
    //         return city.code === tenant.code;
    //       });

    //       selected.code = selected.code && selected.code.trim()
    //       const label = `TENANT_TENANTS_${selected.code.toUpperCase().replace(/[.]/g, "_")}`;
    //       dd.push({ label: getTranslatedLabel(label, localizationLabels), value: selected.code });
    //       return dd;
    //     }, []);

    //     dispatch(setFieldProperty("propertyAddress", "city", "dropDownData", sortBy(dd, ["label"])));
    //   }
    //   const tenant = get(state, 'form.propertyAddress.fields.city.value', null);
    //   const mohallaDropDownData = get(state, 'form.propertyAddress.fields.mohalla.dropDownData', []);

    //   if (process.env.REACT_APP_NAME === "Citizen" && tenant && mohallaDropDownData.length == 0) {
    //     const dataFetchConfig = {
    //       url: "egov-location/location/v11/boundarys/_search?hierarchyTypeCode=REVENUE&boundaryType=Locality",
    //       action: "",
    //       queryParams: [{
    //         key: "tenantId",
    //         value: tenant
    //       }],
    //       requestBody: {},
    //       isDependent: true,
    //       hierarchyType: "REVENUE"
    //     }
    //     fetchDropdownData(dispatch, dataFetchConfig, 'propertyAddress', 'mohalla', state, true);
    //   }
    //   return action;
    // } catch (e) {
    //   console.log(e);
    //   return action;
    // }
  },
  action: "",
  redirectionRoute: "",
  saveUrl: "",
  isFormValid: false,
};

export default formConfig;
