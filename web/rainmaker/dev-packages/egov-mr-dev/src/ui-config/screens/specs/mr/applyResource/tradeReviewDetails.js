import {
  getCommonCard,
  getCommonGrayCard,
  getCommonTitle
} from "egov-ui-framework/ui-config/screens/specs/utils";

import { getFeesEstimateCard, getDialogButton } from "../../utils";

import { getReviewTrade } from "./review-trade";
import { getBrideAddressAndGuardianDetails } from "./review-owner";
import { getReviewDocuments } from "./review-documents";
import { getgroomAddressAndGuardianDetails } from "./groom-address-guardian-detail";
import { getWitnessDetails } from "./witness-detail";

const estimate = getCommonGrayCard({
  estimateSection: getFeesEstimateCard({
    sourceJsonPath: "LicensesTemp[0].estimateCardData"
  })
});

const reviewTradeDetails = getReviewTrade();

const brideAddressAndGuardianDetails = getBrideAddressAndGuardianDetails();

const reviewDocumentDetails = getReviewDocuments();
const groomAddressAndGuardianDetails = getgroomAddressAndGuardianDetails();
const witnessDetails = getWitnessDetails();

export const tradeReviewDetails = getCommonCard({
  header: getCommonTitle({
    labelName: "Please review your Application and Submit",
    labelKey: "TL_SUMMARY_HEADER"
  }),
  estimate,
  viewBreakupButton: getDialogButton(
    "VIEW BREAKUP",
    "TL_PAYMENT_VIEW_BREAKUP",
    "apply"
  ),
  reviewTradeDetails,
  brideAddressAndGuardianDetails,
  groomAddressAndGuardianDetails,
  witnessDetails,
  reviewDocumentDetails
});
