
import { tradeLocationDetails, brideReviewDetails, groomReviewDetails, GroomWitnessDetails, brideWitnessDetail, groomGuardianDetails, brideGuardianDetails} from "egov-mr/ui-config/screens/specs/mr/applyResource/pdf-utils";
// import { groomGuardianDetails, brideGuardianDetails} from "egov-mr/ui-config/screens/specs/mr/applyResource/groom-address-guardian-detail";
// import { witness1Details, witness2Details} from "egov-mr/ui-config/screens/specs/mr/applyResource/witness-detail";
import { getFromObject } from "../PTCommon/FormWizardUtils/formUtils";

import { generateKeyValue, generatePDF, getDocumentsCard, getEstimateCardDetails, getMultiItems, getMultipleItemCard } from "./generatePDF";


export const generateMRAcknowledgement = (preparedFinalObject, fileName = "acknowledgement.pdf") => {

    tradeLocationDetails.reviewMohalla.localiseValue = true;
    tradeLocationDetails.reviewCity.localiseValue = true;



    let UlbLogoForPdf = getFromObject(preparedFinalObject, 'UlbLogoForPdf', '');
    let MR = getFromObject(preparedFinalObject, 'MarriageRegistrations[0]', {});



    const documentsUploadRedux = getFromObject(preparedFinalObject, 'LicensesTemp[0].reviewDocData', []);
    const documentCard = getDocumentsCard(documentsUploadRedux);
    const estimateDetails = getEstimateCardDetails(getFromObject(preparedFinalObject, 'LicensesTemp[0].estimateCardData', []))
    const brideSummary = generateKeyValue(preparedFinalObject, brideReviewDetails);
    const groomSummary = generateKeyValue(preparedFinalObject, groomReviewDetails);
    const tradeLocationSummary = generateKeyValue(preparedFinalObject, tradeLocationDetails);
    const brideGrdnSummary = generateKeyValue(preparedFinalObject, brideGuardianDetails);
    const groomGrdnSummary = generateKeyValue(preparedFinalObject, groomGuardianDetails);
    const brideWtnsSummary = generateKeyValue(preparedFinalObject, brideWitnessDetail);
    const groomWtnsSummary = generateKeyValue(preparedFinalObject, GroomWitnessDetails);

    let pdfData = {
        header: "MR_TRADE_APPLICATION", tenantId: MR.tenantId,
        //applicationNoHeader: 'TL_PDF_LICENSE_NO', applicationNoValue: License.licenseNumber,
        additionalHeader: "MR_PDF_APPLICATION_NO", additionalHeaderValue: MR.applicationNumber,
        cards: [
            { items: estimateDetails, type: 'estimate' },
            { header: 'MR_MARRIAGEPLACE_LABEL', items: tradeLocationSummary },
            { header: "MR_BRIDE_HEADER", items: brideSummary },
            { header: "MR_GROOM_HEADER", items: groomSummary },
            { header: "MR_BRIDE_GUARDIAN_HEADER", items: brideGrdnSummary },
            { header: "MR_GROOM_GUARDIAN_HEADER", items: groomGrdnSummary },
            { header: "MR_BRIDE_WITNESS_HEADER", items: brideWtnsSummary },
            { header: "MR_GROOM_WITNESS_HEADER", items: groomWtnsSummary },
            { header: 'MR_COMMON_DOCS', items: documentCard }]
    }

    generatePDF(UlbLogoForPdf, pdfData, fileName);
}