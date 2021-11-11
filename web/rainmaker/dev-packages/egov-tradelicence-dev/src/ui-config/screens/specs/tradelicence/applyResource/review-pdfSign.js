import {
    getCommonContainer, getCommonGrayCard,
    getCommonSubHeader,
    getLabel, getLabelWithValue
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import {
    handleScreenConfigurationFieldChange as handleField
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";

  const handleIsCertificateSigned = (params) => {
    if(params){
        return 'Yes'
    }else{
        return 'No'
    }
  }
  export const isCertificateDigitallySigned = {
    certificateSigned: getLabelWithValue(
      {
        labelName: "Is Certificate Digitally Signed",
        labelKey: "TL_IS_CERTIFICATE_DIGITALLY_SIGNED"
      },
      {
        jsonPath: "Licenses[0].tradeLicenseDetail.dscDetails[0].documentId",
        callBack : handleIsCertificateSigned
      }
    )
  }

export const getReviewPdfSignDetails = (isEditable = true) => {
    return getCommonGrayCard({
      headerDiv: {
        uiFramework: "custom-atoms",
        componentPath: "Container",
        props: {
          style: { marginBottom: "10px" }
        },
        children: {
          header: {
            gridDefination: {
              xs: 12,
              sm: 10
            },
            ...getCommonSubHeader({
              labelName: "TL_PDF_SIGN_DETAILS",
              labelKey: "TL_PDF_SIGN_DETAILS"
            })
          },
          editSection: {
            componentPath: "Button",
            props: {
              color: "primary"
            },
            visible: true,
            gridDefination: {
              xs: 12,
              sm: 2,
              align: "right"
            },
            children: {
              buttonLabel: getLabel({
                labelName: "PDF SIGN",
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
                    "search-preview",
                    "components.pdfSigningPopup.props",
                    "openPdfSigningPopup",
                    true
                  )
                )
                dispatch(
                  handleField(
                    "search-preview",
                    "components.pdfSigningPopup.props",
                    "applicationNumber",
                    applicationNumber
                  )
                )
                dispatch(
                  handleField(
                    "search-preview",
                    "components.pdfSigningPopup.props",
                    "tenantId",
                    tenantId
                  )
                )
              }
            }
          }
        }
      },
      viewOne: getCommonContainer(isCertificateDigitallySigned),
    });
  };