import {
    getCommonHeader,
    getCommonContainer,
    getLabel,
    getTextField,
    getCommonGrayCard
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  //import { showCityPicker, applyForm } from "../utils";
  import get from "lodash/get";
  
  export const spclArchitectsPicker = getCommonGrayCard({
    header: getCommonHeader({
      labelName: "Pick your city.",
      labelKey: "BPA_SPCL_ARCH_LABLE"
    }),
    spclArchitectsPicker: getCommonContainer({
      spclArchsDropdown: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-tradelicence",
        componentPath: "AutosuggestContainer",
        jsonPath: "selectedSpclArchitect",
        required: true,
        gridDefination: {
          xs: 12,
          sm: 12
        },
        props: {
          style: {
            width: "100%",
            cursor: "pointer"
          },
          value: "",
          className: "citizen-city-picker",
          label: {
            labelName: "City",
            labelKey: "BPA_SPCL_ARCH_LABLE"
          },
          optionValue: "code",
          optionLabel: "uuid",
          placeholder: { labelName: "Select City", labelKey: "BPA_SELECT_SPCL_ARCH_PLACEHOLDER" },
          jsonPath: "selectedSpclArchitect",
          sourceJsonPath:
            "specialArchitectList",
          labelsFromLocalisation: true,
          isClearable: true,
          fullwidth: true,
          required: true,
          inputLabelProps: {
            shrink: true
          }
        },
        beforeFieldChange: (action, state, dispatch) => {

          let bpaAppObj = get(
            state,
            "screenConfiguration.preparedFinalObject.BPA",
            []
          );
          let allListedSpclArchs = get(
            state,
            "screenConfiguration.preparedFinalObject.specialArchitectList",
            []
          );
          
          let selectedArch = allListedSpclArchs && allListedSpclArchs.filter(item=>item.code === action.value);
          
          let processIns = {};
          let assignes = [selectedArch[0].uuid];
          
          processIns.assignes = assignes
          bpaAppObj.workflow = processIns; 
        }
      },
      
    })
  });
  