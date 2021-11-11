import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import generateReceipt from "../../utils/receiptPdf";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";

const getCommonApplyFooter = children => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Div",
    props: {
      className: "apply-wizard-footer"
    },
    children
  };
};

export const approvalSuccessFooter = getCommonApplyFooter({
  gotoHome: {
    componentPath: "Button",
    props: {
      variant: "outlined",
      color: "primary",
      style: {
        minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      }
    },
    children: {
      downloadReceiptButtonLabel: getLabel({
        labelName: "GO TO HOME",
        labelKey: "TL_COMMON_BUTTON_HOME"
      })
    },
    onClickDefination: {
      action: "page_change",
      path: `/inbox`
    }
  },
  pdfSign: {
    componentPath: "Button",
    
    props: {
      variant: "outlined",
      className:"home-footer",
      color: "primary",
      style: {
    //    minWidth: "200px",
        height: "48px",
        marginRight: "16px"
      }
    },
    children: {
      pdfSignButtonLabel: getLabel({
        labelName: "TL_PDF_SIGN",
        labelKey: "TL_PDF_SIGN"
      })
    },
    onClickDefination: {
      action: "condition",
      callBack: (state, dispatch) => {
        const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
        const tenantId = getQueryArg(window.location.href, "tenantId");

        dispatch(
          handleField(
            "acknowledgement",
            "components.pdfSigningPopup.props",
            "openPdfSigningPopup",
            true
          )
        )
        dispatch(
          handleField(
            "acknowledgement",
            "components.pdfSigningPopup.props",
            "applicationNumber",
            applicationNumber
          )
        )
        dispatch(
          handleField(
            "acknowledgement",
            "components.pdfSigningPopup.props",
            "tenantId",
            tenantId
          )
        )
      }
    }
  }
  // downloadLicenseButton: {
  //   componentPath: "Button",
  //   props: {
  //     variant: "outlined",
  //     color: "primary",
  //     style: {
  //       width: "250px",
  //       height: "48px",
  //       marginRight: "16px"
  //     }
  //   },
  //   children: {
  //     downloadLicenseButtonLabel: getLabel({
  //       labelName: "DOWNLOAD TRADE LICENSE",
  //       labelKey: "TL_APPROVAL_CHECKLIST_BUTTON_DOWN_LIC"
  //     })
  //   },
  //   onClickDefination: {
  //     action: "condition",
  //     callBack: (state, dispatch) => {
  //       generateReceipt(state, dispatch, "certificate_download");
  //     }
  //   }
  // },
  // printLicenseButton: {
  //   componentPath: "Button",
  //   props: {
  //     variant: "contained",
  //     color: "primary",
  //     style: {
  //       width: "250px",
  //       height: "48px",
  //       marginRight: "40px"
  //     }
  //   },
  //   children: {
  //     printLicenseButtonLabel: getLabel({
  //       labelName: "PRINT TRADE LICENSE",
  //       labelKey: "TL_APPROVAL_CHECKLIST_PRINT_LIC"
  //     })
  //   },
  //   onClickDefination: {
  //     action: "condition",
  //     callBack: (state, dispatch) => {
  //       generateReceipt(state, dispatch, "certificate_print");
  //     }
  //   }
  // }
});
