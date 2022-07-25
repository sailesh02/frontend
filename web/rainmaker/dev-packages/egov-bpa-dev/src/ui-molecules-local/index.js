import React from "react";
import Loadable from "react-loadable";
import LinearProgress from "egov-ui-framework/ui-atoms/LinearSpinner";

const Loading = () => <LinearProgress />;

const TestMolecules = Loadable({
  loader: () => import("./TestMolecules"),
  loading: () => <Loading />
});

const CustomTab = Loadable({
  loader: () => import("./CustomTab"),
  loading: () => <Loading />
});

const DocumentList = Loadable({
  loader: () => import("./DocumentList"),
  loading: () => <Loading />
});

const DocumentListNOC = Loadable({
  loader: () => import("./DocumentListNOC"),
  loading: () => <Loading />
});

const BpaDocumentList = Loadable({
  loader: () => import("./BpaDocumentList"),
  loading: () => <Loading />
});

const NocList = Loadable({
  loader: () => import("./NocList"),
  loading: () => <Loading />
});

const RadioButtonsGroup = Loadable({
  loader: () => import("./RadioGroup"),
  loading: () => <Loading />
});

const Tooltip = Loadable({
  loader: () => import("./Tooltip"),
  loading: () => <Loading />
});

const UploadSingleFile = Loadable({
  loader: () => import("./UploadSingleFile"),
  loading: () => <Loading />
});

const UploadMultipleFile = Loadable({
  loader: () => import("./UploadMultipleFile"),
  loading: () => <Loading />
});

const Table = Loadable({
  loader: () => import("./Table"),
  loading: () => <Loading />
});

const DividerWithLabel = Loadable({
  loader: () => import("./DividerWithLabel"),
  loading: () => <Loading />
});

const MapLocator = Loadable({
  loader: () => import("./MapLocator"),
  loading: () => <Loading />
});

const FeesEstimateCard = Loadable({
  loader: () => import("./FeesEstimateCard"),
  loading: () => <Loading />
});

const HowItWorks = Loadable({
  loader: () => import("./HowItWorks"),
  loading: () => <Loading />
});

const EdcrSingleApplication = Loadable({
  loader: () => import("./EdcrSingleApplication"),
  loading: () => <Loading />
});

const BpaFeesEstimateCard = Loadable({
  loader: () => import("./BpaFeesEstimateCard"),
  loading: () => <Loading />
});

const CheckList = Loadable({
  loader: () => import("./CheckList"),
  loading: () => <Loading />
});

const ActionDialog = Loadable({
  loader: () => import("./ActionDialog"),
  loading: () => <Loading />
});

const MultiDownloadCard = Loadable({
  loader: () => import("./MultiDownloadCard"),
  loading: () => <Loading />
 });
 const SingleDocDetailCard = Loadable({
  loader: () => import("./SingleDocDetailCard"),
  loading: () => <Loading />
 });
 const MultiDocDetailCard = Loadable({
  loader: () => import("./MultiDocDetailCard"),
  loading: () => <Loading />
 });
 const UploadCard = Loadable({
  loader: () => import("./UploadCard"),
  loading: () => <Loading />
 });
 const ComparisionLink = Loadable({
  loader: () => import("./ComparisionLink"),
  loading: () => <Loading />
 });
 const NocDetailCard = Loadable({
  loader: () => import("./NocDetailCard"),
  loading: () => <Loading />
 });
 const NocDocDetailCard = Loadable({
  loader: () => import("./NocDocDetailCard"),
  loading: () => <Loading />
 });
 const NocDetailCardBPA = Loadable({
  loader: () => import("./NocDetailCardBPA"),
  loading: () => <Loading />
 });
 const NocDocDetailCardBPA = Loadable({
  loader: () => import("./NocDocDetailCardBPA"),
  loading: () => <Loading />
 });
 const NocData = Loadable({
  loader: () => import("./NocData"),
  loading: () => <Loading />
 });

 const BPAHowItWorks = Loadable({
  loader: () => import("./PBAHowItWorks"),
  loading: () => <Loading />
});
const TrainingTutorials = Loadable({
  loader: () => import("./TrainingTutorials"),
  loading: () => <Loading />
});
const PBATrainingTutorials = Loadable({
  loader: () => import("./PBATrainingTutorials"),
  loading: () => <Loading />
});
const BpaSanctionFeesCard = Loadable({
  loader: () => import("./BpaSanctionFeesCard"),
  loading: () => <Loading />
});
const CloseDialog = Loadable({
  loader: () => import("./CloseDialog"),
  loading: () => <Loading />
});
const DocumentListPreApprove = Loadable({
  loader: () => import("./DocumentListPreApprove"),
  loading: () => <Loading />
});
const InstallmentDetail = Loadable({
  loader: () => import("./InstallmentDetail"),
  loading: () => <Loading />
});
const GenerateInstallmentsDemandDialog = Loadable({
  loader: () => import("./GenerateInstallmentsDemandDialog"),
  loading: () => <Loading />
});
const DownloadDocuments = Loadable({
  loader: () => import("./DownloadDocuments"),
  loading: () => <Loading />
});
export {
  TestMolecules,
  RadioButtonsGroup,
  Tooltip,
  CustomTab,
  DocumentList,
  DocumentListNOC,
  BpaDocumentList,
  MapLocator,
  FeesEstimateCard,
  HowItWorks,
  EdcrSingleApplication,
  NocList,
  Table,
  UploadSingleFile,
  UploadMultipleFile,
  DividerWithLabel,
  BpaFeesEstimateCard,
  CheckList,
  ActionDialog,
  MultiDownloadCard,
  SingleDocDetailCard,
  MultiDocDetailCard,
  UploadCard,
  ComparisionLink,
  NocDetailCard,
  NocDetailCardBPA,
  NocDocDetailCard,
  NocDocDetailCardBPA,
  NocData,
  BPAHowItWorks,
  TrainingTutorials,
  PBATrainingTutorials,
  BpaSanctionFeesCard,
  CloseDialog,
  DocumentListPreApprove,
  InstallmentDetail,
  InstallmentDetail,
  GenerateInstallmentsDemandDialog,
  DownloadDocuments
};