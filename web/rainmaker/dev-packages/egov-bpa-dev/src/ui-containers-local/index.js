import React from "react";
import Loadable from "react-loadable";
import LinearProgress from "egov-ui-framework/ui-atoms/LinearSpinner";

const Loading = () => <LinearProgress />;

const CustomTabContainer = Loadable({
  loader: () => import("./CustomTabContainer"),
  loading: () => <Loading />
});

const TestContainer = Loadable({
  loader: () => import("./TestContainer"),
  loading: () => <Loading />
});

const DocumentListContainer = Loadable({
  loader: () => import("./DocumentListContainer"),
  loading: () => <Loading />
});

const DocumentListContainerNOC = Loadable({
  loader: () => import("./DocumentListContainerNOC"),
  loading: () => <Loading />
});

const BpaDocumentListContainer = Loadable({
  loader: () => import("./BpaDocumentListContainer"),
  loading: () => <Loading />
});

const NocListContainer = Loadable({
  loader: () => import("./NocListContainer"),
  loading: () => <Loading />
});

const LabelContainer = Loadable({
  loader: () => import("./LabelContainer"),
  loading: () => <Loading />
});

const CheckboxContainer = Loadable({
  loader: () => import("./CheckboxContainer"),
  loading: () => <Loading />
});

const DownloadFileContainer = Loadable({
  loader: () => import("./DownloadFileContainer"),
  loading: () => <Loading />
});
const DocumentSummaryContainer = Loadable({
  loader: () => import("./DocumentSummaryContainer"),
  loading: () => <Loading />
});
const PreviewContainer = Loadable({
  loader: () => import("./PreviewContainer"),
  loading: () => <Loading />
});

const EstimateCardContainer = Loadable({
  loader: () => import("./EstimateCardContainer"),
  loading: () => <Loading />
});

const AutosuggestContainer = Loadable({
  loader: () => import("./AutosuggestContainer"),
  loading: () => <Loading />
});

const PaymentRedirectPage = Loadable({
  loader: () => import("./PaymentRedirectPage"),
  loading: () => <Loading />
});

const DialogContainer = Loadable({
  loader: () => import("./DialogContainer"),
  loading: () => <Loading />
});

const ViewBreakupContainer = Loadable({
  loader: () => import("./ViewbreakupDialogContainer"),
  loading: () => <Loading />
});

const RadioGroupWithLabelContainer = Loadable({
  loader: () => import("./RadioGroupWithLabelContainer"),
  loading: () => <Loading />
});

const EDCRUploadCard = Loadable({
  loader: () => import("./EDCRUploadCard"),
  loading: () => <Loading />
});

const BpaEstimateCardContainer = Loadable({
  loader: () => import("./BpaEstimateCardContainer"),
  loading: () => <Loading />
});

const BpaCheckboxContainer =  Loadable({
  loader: () => import("./BpaCheckboxContainer"),
  loading: () => <Loading />
});

const CheckListContainer =  Loadable({
  loader: () => import("./CheckListContainer"),
  loading: () => <Loading />
});

const FeildInspectionCards = Loadable({
  loader: () => import("./FeildInspectionCards"),
  loading: () => <Loading />
});

const FieldInspectionContainer = Loadable({
  loader: () => import("./FieldInspectionContainer"),
  loading: () => <Loading />
});

const BpaConditionsContainer = Loadable({
  loader: () => import("./BpaConditionsContainer"),
  loading: () => <Loading />
});

const DownloadFileContainerForFI = Loadable({
  loader: () => import("./DownloadFileContainerForFI"),
  loading: () => <Loading />
});

const TextAreaContainer = Loadable({
  loader: () => import("./TextAreaContainer"),
  loading: () => <Loading />
});
const TextAreaContainerForBpa = Loadable({
  loader: () => import("./TextAreaContainerForBpa"),
  loading: () => <Loading />
});

const TriggerNOCContainer =  Loadable({
  loader: () => import("./TriggerNOCContainer"),
  loading: () => <Loading />
});

const ShowNotification =  Loadable({
  loader: () => import("./ShowNotification"),
  loading: () => <Loading />
});

const BpaSanctionFeeCardContainer =  Loadable({
  loader: () => import("./BpaSanctionFeeCardContainer"),
  loading: () => <Loading />
});
const ScnHistory =  Loadable({
  loader: () => import("./ScnHistory"),
  loading: () => <Loading />
});
const SignRandomPdfContainer =  Loadable({
  loader: () => import("./SignRandomPdfContainer"),
  loading: () => <Loading />
});

const EdcrHistory =  Loadable({
  loader: () => import("./EdcrHistory"),
  loading: () => <Loading />
});
const DynamicCheckboxes =  Loadable({
  loader: () => import("./DynamicCheckboxes"),
  loading: () => <Loading />
});
const FullPaymentContainer =  Loadable({
  loader: () => import("./FullPaymentContainer"),
  loading: () => <Loading />
});
const BlockContainer = Loadable({
  loader: () => import("./BlockContainer"),
  loading: () => <Loading />
});
const PdfContainer = Loadable({
  loader: () => import("./PdfContainer"),
  loading: () => <Loading />
});
const PreApproveDocumentListContainer = Loadable({
  loader: () => import("./PreApproveDocumentListContainer"),
  loading: () => <Loading />
});
const RevisionDocumentListContainer =  Loadable({
  loader: () => import("./RevisionDocumentListContainer"),
  loading: () => <Loading />
});
const RevisionDocsPreviewContainer =  Loadable({
  loader: () => import("./RevisionDocsPreviewContainer"),
  loading: () => <Loading />
});

export {
  CustomTabContainer,
  LabelContainer,
  CheckboxContainer,
  DownloadFileContainer,
  DocumentSummaryContainer,
  EstimateCardContainer,
  AutosuggestContainer,
  DocumentListContainer,
  DocumentListContainerNOC,
  BpaDocumentListContainer,
  PaymentRedirectPage,
  ViewBreakupContainer,
  DialogContainer,
  RadioGroupWithLabelContainer,
  EDCRUploadCard,
  NocListContainer,
  BpaEstimateCardContainer,
  BpaCheckboxContainer,
  CheckListContainer,
  FeildInspectionCards,
  FieldInspectionContainer,
  BpaConditionsContainer,
  DownloadFileContainerForFI,
  PreviewContainer,
  TextAreaContainer,
  TriggerNOCContainer,
  ShowNotification,
  BpaSanctionFeeCardContainer,
  TextAreaContainerForBpa,
  ScnHistory,
  SignRandomPdfContainer,
  EdcrHistory,
  PreApproveDocumentListContainer,
  DynamicCheckboxes,
  FullPaymentContainer,
  BlockContainer,
  PdfContainer,
  RevisionDocumentListContainer,
  RevisionDocsPreviewContainer
};
