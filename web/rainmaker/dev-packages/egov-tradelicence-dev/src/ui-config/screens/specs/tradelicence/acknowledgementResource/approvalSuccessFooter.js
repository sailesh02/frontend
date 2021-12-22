import { getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import generateReceipt from "../../utils/receiptPdf";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg, getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
import store from "ui-redux/store";
import { getSearchResults } from "../../../../../ui-utils/commons";
import {
  getNextFinancialYearForRenewal,
  showPDFPreview
} from "egov-workflow/ui-utils/commons";
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

const openSignPdfPopup = () => {

  const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
  const tenantId = getQueryArg(window.location.href, "tenantId");

  store.dispatch(
    handleField(
      "acknowledgement",
      "components.pdfSigningPopup.props",
      "openPdfSigningPopup",
      true
    )
  )
  store.dispatch(
    handleField(
      "acknowledgement",
      "components.pdfSigningPopup.props",
      "applicationNumber",
      applicationNumber
    )
  )
  store.dispatch(
    handleField(
      "acknowledgement",
      "components.pdfSigningPopup.props",
      "tenantId",
      tenantId
    )
  )

};
const getPdfPreview = async () => {
  const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
  const tenantId = getQueryArg(window.location.href, "tenantId");
  let queryObject = [
    { key: "tenantId", value: tenantId },
    { key: "applicationNumber", value: applicationNumber }
  ];
  let payload = await getSearchResults(queryObject);

  if (payload) {


    let pdfOwnersNames = '';
    let pdfTradeTypes = '';
    if (payload.Licenses[0].tradeLicenseDetail.owners && payload.Licenses[0].tradeLicenseDetail.owners.length > 0) {
      for (let i = 0; i < payload.Licenses[0].tradeLicenseDetail.owners.length; i++) {
        pdfOwnersNames += payload.Licenses[0].tradeLicenseDetail.owners[i].name + ", ";
      }
      pdfOwnersNames = pdfOwnersNames.substring(0, pdfOwnersNames.length - 2);
    }

    if (payload.Licenses[0].tradeLicenseDetail.tradeUnits && payload.Licenses[0].tradeLicenseDetail.tradeUnits.length > 0) {
      for (let i = 0; i < payload.Licenses[0].tradeLicenseDetail.tradeUnits.length; i++) {
        let tradeTypeLocale = '';

        tradeTypeLocale = getLocaleLabels("TradeType", `TRADELICENSE_TRADETYPE_${payload.Licenses[0].tradeLicenseDetail.tradeUnits[i].tradeType.replace(/\./g, '_')}`);
        console.log(tradeTypeLocale, "Nero Locallll")
        pdfTradeTypes += tradeTypeLocale + ", ";
      }
      pdfTradeTypes = pdfTradeTypes.substring(0, pdfTradeTypes.length - 2);
    }

    payload.Licenses[0].additionalDetail = { ownerNames: pdfOwnersNames, tradeTypes: pdfTradeTypes };

    showPDFPreview(payload.Licenses, "tlcertificate", "Licenses");
  }

}

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
    componentPath: "MenuButton",
    uiFramework: "custom-molecules-local",
    moduleName: "egov-tradelicence",
    props: {
      data: {
        label: { labelName: "Sign", labelKey: "WF_PDF_SIGN" },
        rightIcon: "arrow_drop_down",

        props: {
          variant: "outlined",
          float: "right",
          style: {
            backgroundColor: "#FE7A51",
            color: "#fff",
            border: "none",
            height: "49px",
            width: "135px"
          }
        },
        menu: [{

          labelName: "WF_PDF_SIGN",
          labelKey: "WF_PDF_SIGN",

          link: () => {

            openSignPdfPopup();
          }
        },
        {

          labelName: "WF_PDF_PREVIEW",
          labelKey: "WF_PDF_PREVIEW",
          link: () => {
            getPdfPreview();

          }
        }
        ]
      }
    }
  },
  // pdfSign: {
  //   componentPath: "Button",

  //   props: {
  //     variant: "outlined",
  //     className:"home-footer",
  //     color: "primary",
  //     style: {
  //   //    minWidth: "200px",
  //       height: "48px",
  //       marginRight: "16px"
  //     }
  //   },
  //   children: {
  //     pdfSignButtonLabel: getLabel({
  //       labelName: "TL_PDF_SIGN",
  //       labelKey: "TL_PDF_SIGN"
  //     })
  //   },
  //   onClickDefination: {
  //     action: "condition",
  //     callBack: (state, dispatch) => {
  //       const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
  //       const tenantId = getQueryArg(window.location.href, "tenantId");

  //       dispatch(
  //         handleField(
  //           "acknowledgement",
  //           "components.pdfSigningPopup.props",
  //           "openPdfSigningPopup",
  //           true
  //         )
  //       )
  //       dispatch(
  //         handleField(
  //           "acknowledgement",
  //           "components.pdfSigningPopup.props",
  //           "applicationNumber",
  //           applicationNumber
  //         )
  //       )
  //       dispatch(
  //         handleField(
  //           "acknowledgement",
  //           "components.pdfSigningPopup.props",
  //           "tenantId",
  //           tenantId
  //         )
  //       )
  //     }
  //   }
  // }
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
