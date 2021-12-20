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
        labelKey: "BPA_IS_CERTIFICATE_DIGITALLY_SIGNED"
      },
      {
        jsonPath: "BPA.dscDetails[0].documentId",
        callBack : handleIsCertificateSigned
      }
    )
}

export const reviewPdfSignDetails = getCommonGrayCard({
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
              labelName: "BPA_PDF_SIGN_DETAILS",
              labelKey: "BPA_PDF_SIGN_DETAILS"
            })
          }
    }
}, 
    viewOne: getCommonContainer(isCertificateDigitallySigned),
});
  