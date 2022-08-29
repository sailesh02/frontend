import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getDateField,
  getSelectField,
  getCommonContainer,
  getPattern
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getTodaysDateInYMD, getScrutinyDetails } from "../../utils";
import { getDrawingDetails } from "./getDrawingDetails";
import "./index.css";

export const basicDetails = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Basic Details",
      labelKey: "BPA_BASIC_DETAILS_TITLE"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  basicDetailsContainer: getCommonContainer({
    scrutinynumber: getTextField({
      label: {
        labelName: "Building plan scrutiny number",
        labelKey: "BPA_BASIC_DETAILS_SCRUTINY_NO_LABEL"
      },
      placeholder: {
        labelName: "Enter Scrutiny Number",
        labelKey: "BPA_BASIC_DETAILS_SCRUTINY_NUMBER_PLACEHOLDER"
      },
      required: false,
      title: {
        value: "Please search preapproved plan details.",
        key: "BPA_BASIC_DETAILS_DRAWING_NUMBER_SEARCH_TITLE"
      },
      infoIcon: "info_circle",
      errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
      jsonPath: "BPA.edcrNumber",
      iconObj: {
        iconName: "search",
        position: "end",
        color: "#FE7A51",
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch, fieldInfo) => {
            getDrawingDetails(state, dispatch, true);
          }
        }
      },
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      }
    }),
    preApprovedCode: getTextField({
      label: {
        labelName: "Preapproved Code",
        labelKey: "PREAPPROVE_NOTIFY_CODE"
      },
      required: true,
      jsonPath: 'BPA.additionalDetails.preApprovedCode',
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      props: {
        disabled: true,
        className : "tl-trade-type"
      }
    }),
    occupancy: getTextField({
      label: {
        labelName: "Occupancy",
        labelKey: "BPA_BASIC_DETAILS_OCCUPANCY_LABEL"
      },
      required: false,
      jsonPath: 'scrutinyDetails.planDetail.planInformation.occupancy',
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      props: {
        disabled: true,
        className : "tl-trade-type"
      }
    }),
    applicationType: getSelectField({
      label: {
        labelName: "Application Type",
        labelKey: "BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL"
      },
      placeholder: {
        labelName: "Select Application Type",
        labelKey: "BPA_BASIC_DETAILS_APPLICATION_TYPE_PLACEHOLDER"
      },
      localePrefix: {
        moduleName: "WF",
        masterName: "BPA"
      },
      props: {
        disabled: true,
        className : "tl-trade-type"
      },
      jsonPath: "BPA.applicationType",
      sourceJsonPath: "applyScreenMdmsData.BPA.ApplicationType",
      required: true,
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      }
    }),
    riskType: getTextField({
      label: {
        labelName: "Risk Type",
        labelKey: "BPA_BASIC_DETAILS_RISK_TYPE_LABEL"
      },
      localePrefix: {
        moduleName: "WF",
        masterName: "BPA"
      },
      jsonPath: "BPA.riskType",
      required: false,
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      },
      props: {
        disabled: true,
        className : "tl-trade-type"
      }
    }),
    servicetype: getSelectField({
      label: {
        labelName: "Service type",
        labelKey: "BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL"
      },
      placeholder: {
        labelName: "Select service type",
        labelKey: "BPA_BASIC_DETAILS_SERVICE_TYPE_PLACEHOLDER"
      },
      localePrefix: {
        moduleName: "WF",
        masterName: "BPA"
      },
      props:{
        disabled: true,
        className : "tl-trade-type"
      },
      required: true,
      jsonPath: "BPA.serviceType",
      sourceJsonPath: "applyScreenMdmsData.BPA.ServiceType",
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      }
    }),
    applicationdate: getDateField({
      label: {
        labelName: "Application Date",
        labelKey: "BPA_BASIC_DETAILS_APP_DATE_LABEL"
      },
      jsonPath: "BPAs.appdate",
      props: {
        disabled: true,
        className : "tl-trade-type"
      },
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      }
    }),
    remarks: getTextField({
      label: {
        labelName: "Remarks",
        labelKey: "BPA_BASIC_DETAILS_REMARKS_LABEL"
      },
      placeholder: {
        labelName: "Enter Remarks Here",
        labelKey: "BPA_BASIC_DETAILS_REMARKS_PLACEHOLDER"
      },
      jsonPath: "BPA.additionalDetails.remarks",
      props:{
        multiline: true,
        rows: "4"
      },
      gridDefination: {
        xs: 12,
        sm: 12,
        md: 6
      }
    })
  })
});
