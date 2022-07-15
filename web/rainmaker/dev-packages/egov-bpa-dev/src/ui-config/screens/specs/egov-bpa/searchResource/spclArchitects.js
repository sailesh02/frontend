import {
    getCommonHeader,
    getCommonContainer,
    getLabel,
    getTextField,
    getCommonGrayCard,
    getCommonSubHeader,
    getLabelWithValue
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

  export const approvalAuthority = getCommonGrayCard({
    header: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      props: {
        style: { marginBottom: "10px" }
      },
      children: {
        header: {
          gridDefination: {
            xs: 12,
            md:12,
            sm:12
          },
          ...getCommonSubHeader({
            labelName: "Owner Information",
            labelKey: "BPA_CHOOSE_BPA_PROCESS_TITLE"
          })
        },
        approvalAuthority: getLabelWithValue(
          {
            labelName: "Mobile No.",
            labelKey: "BPA_CHOOSE_BPA_PROCESS_TITLE"
          },
          {
            jsonPath:
              "approvalAuthorityDetail.approvalAuthority",
             // callBack: checkValueForNA
          }
        ),
        approvalPerson: getLabelWithValue(
          {
            labelName: "Mobile No.",
            labelKey: "BPA_APPROVAL_PERSON_LABEL"
          },
          {
            jsonPath:
              "approvalAuthorityDetail.approvalPersonName",
             // callBack: checkValueForNA
          }
        )
      }
    }
  })
  