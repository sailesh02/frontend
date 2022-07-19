import {
  getCommonCard,
  getCommonGrayCard,
  getCommonTitle,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { nocDetailsApplyBPA } from "../egov-bpa/noc";
import { estimateSummary } from "./preApprovedPlanResource/summaryResource/estimateSummary";
import { scrutinySummary } from "./preApprovedPlanResource/summaryResource/scrutinySummary";
import { applyDocSummary } from "./preApprovedPlanResource/summaryResource/applyDocSummary";
import { basicSummary } from "./preApprovedPlanResource/summaryResource/basicSummary";
import {
  applicantSummary,
  institutionSummary,
} from "./preApprovedPlanResource/summaryResource/applicantSummary";

export const bpaSummaryDetails = getCommonCard({
  header: getCommonTitle({
    labelName: "Please review your Application and Submit",
    labelKey: "BPA_SUMMARY_HEADER",
  }),
  estimateSummary: estimateSummary,
  basicSummary: basicSummary,
  scrutinySummary: scrutinySummary,
  applicantSummary: applicantSummary,
  //institutionSummary: institutionSummary,
  applyDocSummary: applyDocSummary,
  nocDetailsApply: nocDetailsApplyBPA,
});
