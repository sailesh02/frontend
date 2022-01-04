import {
    dispatchMultipleFieldChangeAction,
    getLabel,
    getCommonContainer
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import { getQueryArg, validateFields } from "egov-ui-framework/ui-utils/commons";
  import { getTenantIdCommon } from "egov-ui-kit/utils/localStorageUtils";
  import get from "lodash/get";
  import set from 'lodash/set';
  import { httpRequest } from "../../../../../ui-utils";
  import { getCommonApplyFooter, resetFieldsBulkImport, resetTableData } from "../../utils";
  import "./index.css";
  import commonConfig from "config/common.js";

  export const callBackForReset = (state, dispatch) => {
    resetFieldsBulkImport(state,dispatch)
    resetTableData(state,dispatch)
  };

  export const callBackForSaveAll = (state, dispatch) => {
    
};
  
  export const bulkImportFooter = getCommonApplyFooter("BOTTOM", {
    resetButton: {
      componentPath: "Button",
      props: {
        variant: "outlined",
        color: "primary",
        style: {
          // minWidth: "200px",
          height: "48px",
          marginRight: "16px"
        }
      },
      children: {
        resetButtonLabel: getLabel({
          labelName: "Reset All",
          labelKey: "WS_RESET_ALL"
        })
      },
      onClickDefination: {
        action: "condition",
        callBack: callBackForReset
      },
      visible: true
    },
    saveAllButton: {
      componentPath: "Button",
      props: {
        variant: "contained",
        color: "primary",
        style: {
          // minWidth: "200px",
          height: "48px",
          marginRight: "45px"
        }
      },
      children: {
        saveAllLabel: getLabel({
          labelName: "Save All",
          labelKey: "WS_SAVE_ALL"
        }),
      },
      onClickDefination: {
        action: "condition",
        callBack: callBackForSaveAll
      }
    }
  });