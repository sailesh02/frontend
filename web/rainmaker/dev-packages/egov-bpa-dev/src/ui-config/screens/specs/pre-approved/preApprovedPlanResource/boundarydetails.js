import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getSelectField,
  getCommonContainer,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import "./index.css";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";

export const detailsofplot = getCommonCard({
  header: getCommonTitle(
    {
      labelName: "Details Of Plot",
      labelKey: "BPA_BOUNDARY_PLOT_DETAILS_TITLE",
    },
    {
      style: {
        marginBottom: 18,
      },
    }
  ),
  detailsOfPlotContainer: getCommonContainer({
    plotArea: {
      ...getTextField({
        label: {
          labelName: "Plot Area",
          labelKey: "BPA_BOUNDARY_PLOT_AREA_LABEL",
        },
        required: true,
        jsonPath: "BPA.additionalDetails.planDetail.plot.area",
        props: {
          disabled: "true",
          className: "tl-trade-type",
        },
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6,
        },
      }),
    },
    kathaNumber: {
      ...getTextField({
        label: {
          labelName: "Khata No.",
          labelKey: "BPA_BOUNDARY_KHATA_NO_LABEL",
        },
        placeholder: {
          labelName: "Enter Khata No.",
          labelKey: "BPA_BOUNDARY_KHATA_NO_PLACEHOLDER",
        },
        required: true,
        props: {
          disabled: false,
          className: "tl-trade-type",
        },
        // // pattern: getPattern("Name") || null,
        jsonPath: "BPA.additionalDetails.planDetail.planInformation.khataNo",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6,
        },
      }),
    },
    holdingNumber: {
      ...getTextField({
        label: {
          labelName: "Holding No.",
          labelKey: "BPA_BOUNDARY_HOLDING_NO_LABEL",
        },
        placeholder: {
          labelName: "Enter Holding No.",
          labelKey: "BPA_BOUNDARY_HOLDING_NO_PLACEHOLDER",
        },
        jsonPath: "BPA.additionalDetails.planDetail.planInformation.holdingNo",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6,
        },
      }),
    },
    plotNo: {
      ...getTextField({
        label: {
          labelName: "Plot No(MSP)",
          labelKey: "BPA_BOUNDARY_PLOT_NO_LABEL",
        },
        placeholder: {
          labelName: "Enter Plot No(MSP)",
          labelKey: "BPA_BOUNDARY_PLOT_NO_PLACEHOLDER",
        },
        required: true,
        props: {
          disabled: false,
          className: "tl-trade-type",
        },
        // // pattern: getPattern("Name") || null,
        jsonPath: "BPA.additionalDetails.planDetail.plot.plotNo",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6,
        },
      }),
    },
    cityTown: {
      ...getSelectField({
        visible: false,
        label: {
          labelName: "City",
          labelKey: "BPA_CITY_LABEL",
        },
        localePrefix: {
          moduleName: "TENANT",
          masterName: "TENANTS",
        },
        optionLabel: "name",
        placeholder: { labelName: "Select City", labelKey: "BPA_SELECT_CITY" },
        sourceJsonPath: "citiesByModule.TL.tenants",
        jsonPath: "BPA.landInfo.address.city",
        required: true,
        props: {
          required: false,
          disabled: true,
          className: "tl-trade-type",
        },
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6,
        },
      }),
    },
    whetherGovOrQuasi: {
      ...getSelectField({
        visible: false,
        label: {
          labelName: "Whether Government or Quasi Government",
          labelKey: "BPA_BOUNDARY_GOVT_QUASI_LABEL",
        },
        placeholder: {
          labelName: "Select Government",
          labelKey: "BPA_BOUNDARY_GOVT_QUASI_PLACEHOLDER",
        },
        jsonPath: "BPA.govtOrQuasi",
        props: {
          data: [
            {
              value: "Governments",
              label: "Governments",
            },
            {
              value: "Quasi government",
              label: "Quasi government",
            },
            {
              value: "Not applicable",
              label: "Not applicable",
            },
          ],
          optionValue: "value",
          optionLabel: "label",
        },
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6,
        },
      }),
    },

    choosePlotType: {
      ...getSelectField({
        label: {
          labelName:
            "Whether Plot is part of government scheme(BDA/GA/OSHB) or private approved lay out",
          labelKey: "PREAPPROVE_PLOT_SCHEME_HEADER",
        },
        placeholder: {
          labelName: "Select Plot Scheme",
          labelKey: "PREAPPROVE_CHOOSE_PLOT_SCHEME",
        },
        //   localePrefix: {
        //     moduleName: "BPA",
        //     masterName: "BPA_TYPE"
        //   },
        jsonPath: "BPA.additionalDetails.planDetail.plot.plotScheme",
        sourceJsonPath: "PA.confirmation",
        required: true,
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6,
        },
        props: {
          className: "tl-trade-type",
        },
      }),
      
    },
    chooseLayoutType: {
      ...getSelectField({
        label: {
          labelName:
            "Whether the Plot is part of Approved layout/ Town Planning scheme/ Government Scheme ",
          labelKey: "PREAPPROVE_LAYOUT_TYPE_HEADER",
        },
        placeholder: {
          labelName: "Select Layout Type",
          labelKey: "PREAPPROVE_CHOOSE_LAYOUT_TYPE",
        },
        // localePrefix: {
        //   moduleName: "PREAPPROVE",
        //   masterName: "PREAPPROVE_TYPE"
        // },
        jsonPath: "BPA.additionalDetails.planDetail.plot.layoutType",
        sourceJsonPath: "PA.confirmation",
        required: true,
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6,
        },
        props: {
          className: "tl-trade-type",
        },
        beforeFieldChange: (action, state, dispatch) => {
          if (action.value === "YES") {
            dispatch(
              handleField(
                "preApprovedPlanApply",
                "components.div.children.formwizardFirstStep.children.landDetails.visible",
                "visible",
                true
              )
            );
            dispatch(
              handleField(
                "preApprovedPlanApply",
                "components.div.children.formwizardFirstStep.children.landDetails.children.cardContent.children.landDetailsContainer.children.layoutApprovalDate",
                "visible",
                false
              )
            );
            dispatch(
              handleField(
                "preApprovedPlanApply",
                "components.div.children.formwizardFirstStep.children.landDetails.children.cardContent.children.landDetailsContainer.children.layoutPlotNumber",
                "visible",
                false
              )
            );
            dispatch(
              handleField(
                "preApprovedPlanApply",
                "components.div.children.formwizardFirstStep.children.landDetails.children.cardContent.children.landDetailsContainer.children.roadDetails",
                "visible",
                false
              )
            );
            dispatch(
              handleField(
                "preApprovedPlanApply",
                "components.div.children.formwizardFirstStep.children.landDetails.children.cardContent.children.landDetailsContainer.children.governementBody",
                "visible",
                true
              )
            );
            dispatch(
              handleField(
                "preApprovedPlanApply",
                "components.div.children.formwizardFirstStep.children.landDetails.children.cardContent.children.landDetailsContainer.children.governmentScheme",
                "visible",
                true
              )
            );
            dispatch(
              handleField(
                "preApprovedPlanApply",
                "components.div.children.formwizardFirstStep.children.landDetails.children.cardContent.children.landDetailsContainer.children.schemePlotNumber",
                "visible",
                true
              )
            );
          } else {
            dispatch(
              handleField(
                "preApprovedPlanApply",
                "components.div.children.formwizardFirstStep.children.landDetails.visible",
                "visible",
                true
              )
            );
            dispatch(
              handleField(
                "preApprovedPlanApply",
                "components.div.children.formwizardFirstStep.children.landDetails.children.cardContent.children.landDetailsContainer.children.layoutApprovalDate",
                "visible",
                true
              )
            );
            dispatch(
              handleField(
                "preApprovedPlanApply",
                "components.div.children.formwizardFirstStep.children.landDetails.children.cardContent.children.landDetailsContainer.children.layoutPlotNumber",
                "visible",
                true
              )
            );
            dispatch(
              handleField(
                "preApprovedPlanApply",
                "components.div.children.formwizardFirstStep.children.landDetails.children.cardContent.children.landDetailsContainer.children.roadDetails",
                "visible",
                true
              )
            );
  
            dispatch(
              handleField(
                "preApprovedPlanApply",
                "components.div.children.formwizardFirstStep.children.landDetails.children.cardContent.children.landDetailsContainer.children.governementBody",
                "visible",
                false
              )
            );
            dispatch(
              handleField(
                "preApprovedPlanApply",
                "components.div.children.formwizardFirstStep.children.landDetails.children.cardContent.children.landDetailsContainer.children.governmentScheme",
                "visible",
                false
              )
            );
            dispatch(
              handleField(
                "preApprovedPlanApply",
                "components.div.children.formwizardFirstStep.children.landDetails.children.cardContent.children.landDetailsContainer.children.schemePlotNumber",
                "visible",
                false
              )
            );
          }
        },
      }),
    },
    landStatus: {
      ...getSelectField({
        label: {
          labelName: "Land Status",
          labelKey: "PREAPPROVE_LAND_STATUS",
        },
        placeholder: {
          labelName: "Select Land Status",
          labelKey: "PREAPPROVE_CHOOSE_LAND_STATUS",
        },
        //   localePrefix: {
        //     moduleName: "BPA",
        //     masterName: "BPA_TYPE"
        //   },
        jsonPath: "BPA.additionalDetails.planDetail.plot.landStatus",
        sourceJsonPath: "PA.landStatus",
        required: true,
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6,
        },
        props: {
          className: "tl-trade-type",
        },
      }),
      beforeFieldChange: (action, state, dispatch) => {
        //   if(action.value === "BPA5"){
        //     dispatch(
        //       handleField("apply", "components.div.children.formwizardSecondStep.children.getLowRiskConditions", "visible", true)
        //     );
        //     dispatch(
        //       handleField("apply", "components.div.children.formwizardSecondStep.children.accreditedPersonDetails", "visible", true)
        //     );
        //   }else{
        //     dispatch(
        //       handleField("apply", "components.div.children.formwizardSecondStep.children.getLowRiskConditions", "visible", false)
        //     );
        //     dispatch(
        //       handleField("apply", "components.div.children.formwizardSecondStep.children.accreditedPersonDetails", "visible", false)
        //     );
        //   }
      },
    },
    projectComponent: {
      ...getSelectField({
        label: {
          labelName: "Project Component",
          labelKey: "PREAPPROVE_PROJECT_COMPONENT",
        },
        placeholder: {
          labelName: "Select Project",
          labelKey: "PREAPPROVE_CHOOSE_PROJECT_COMPONENT",
        },
        //   localePrefix: {
        //     moduleName: "BPA",
        //     masterName: "BPA_TYPE"
        //   },
        jsonPath: "BPA.additionalDetails.planDetail.plot.project",
        sourceJsonPath: "PA.project",
        required: true,
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6,
        },
        props: {
          className: "tl-trade-type",
        },
      }),
      beforeFieldChange: (action, state, dispatch) => {
        //   if(action.value === "BPA5"){
        //     dispatch(
        //       handleField("apply", "components.div.children.formwizardSecondStep.children.getLowRiskConditions", "visible", true)
        //     );
        //     dispatch(
        //       handleField("apply", "components.div.children.formwizardSecondStep.children.accreditedPersonDetails", "visible", true)
        //     );
        //   }else{
        //     dispatch(
        //       handleField("apply", "components.div.children.formwizardSecondStep.children.getLowRiskConditions", "visible", false)
        //     );
        //     dispatch(
        //       handleField("apply", "components.div.children.formwizardSecondStep.children.accreditedPersonDetails", "visible", false)
        //     );
        //   }
      },
    },
    landRegDetails: {
      ...getTextField({
        label: {
          labelName: "Land Registration Details",
          labelKey: "BPA_BOUNDARY_LAND_REG_DETAIL_LABEL",
        },
        placeholder: {
          labelName: "Enter Land Registration Details",
          labelKey: "BPA_BOUNDARY_LAND_REG_DETAIL_PLACEHOLDER",
        },
        props: {
          multiline: true,
          rows: "4",
        },
        jsonPath: "BPA.additionalDetails.registrationDetails",
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6,
        },
      }),
    },
  }),
});

export const getBpaProcess = getCommonCard({
  headertitle: getCommonTitle(
    {
      labelName: "Block wise occupancy /sub occupancy and usage details",
      labelKey: "BPA_CHOOSE_BPA_PROCESS_TITLE",
    },
    {
      style: {
        marginBottom: 10,
      },
    }
  ),
  chooseBPAHeaderDetails: getCommonContainer({
    chooseBPAType: {
      ...getSelectField({
        label: {
          labelName: "Occupancy Type",
          labelKey: "BPA_CHOOSE_BPA_TYPE",
        },
        placeholder: {
          labelName: "Select Occupancy Type",
          labelKey: "BPA_CHOOSE_BPA_TYPE_PLACEHOLDER",
        },
        localePrefix: {
          moduleName: "BPA",
          masterName: "BPA_TYPE",
        },
        jsonPath: "BPA.additionalDetails.planDetail.plot.plotScheme",
        sourceJsonPath: "PA.plotScheme",
        required: true,
        gridDefination: {
          xs: 12,
          sm: 12,
          md: 6,
        },
        props: {
          className: "tl-trade-type",
        },
      }),
    },
  }),
});
