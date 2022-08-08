import React from "react";
import Loadable from "react-loadable";
import LinearProgress from "egov-ui-framework/ui-atoms/LinearSpinner";

const Loading = () => <LinearProgress />;
const TestMolecules = Loadable({
  loader: () => import("./TestMolecules"),
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

const DocumentList = Loadable({
  loader: () => import("./DocumentList"),
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
const NewConnection = Loadable({
  loader: () => import("./NewConnection"),
  loading: () => <Loading />
});
const MyApplications = Loadable({
  loader: () => import("./MyApplications"),
  loading: () => <Loading />
});
const Applications = Loadable({
  loader: () => import("./Applications"),
  loading: () => <Loading />
});

const MyConnections = Loadable({
  loader: () => import("./MyConnections"),
  loading: () => <Loading />
});

const MeterReading = Loadable({
  loader: () => import("./MeterReading"),
  loading: () => <Loading />
});

const PastPayments = Loadable({
  loader: () => import("./PastPayments"),
  loading: () => <Loading />
});

const WnsHowItWorks = Loadable({
  loader: () => import("./WnsHowItWorks"),
  loading: () => <Loading />
});

const PastPaymentsDetails = Loadable({
  loader: () => import("./PastPaymentsDetails"),
  loading: () => <Loading />
});

const DividerWithLabel = Loadable({
  loader: () => import("./DividerWithLabel"),
  loading: () => <Loading />
});

const MeterReadingEditable = Loadable({
  loader: () => import("./MeterReadingEditable"),
  loading: () => <Loading />
})

const FeesEstimateOverviewCard = Loadable({
  loader: () => import("./FeeEstimateOverviewCard"),
  loading: () => <Loading />
});

const OwnerHeader = Loadable({
  loader: () => import("./OwnerHeader"),
  loading: () => <Loading />
});

const ActionFooter = Loadable({
  loader: () => import("./ActionFooter"),
  loading: () => <Loading />
});

const ConfirmationDialog = Loadable({
  loader: () => import("./ConfirmationDialog"),
  loading: () => <Loading />
})
const DemandAdjustMent = Loadable({
  loader: () => import("./DemandAdjustMent"),
  loading: () => <Loading />
})

const ChipsInput = Loadable({
  loader: () => import("./ChipsInput"),
  loading: () => <Loading />
})

const AdvAnnualPaymentEstimateCard = Loadable({
  loader: () => import("./AdvAnnualPaymentEstimateCard"),
  loading: () => <Loading />
})
const netAdvAnnualPaymentEstimateCard = Loadable({
  loader: () => import("./netAdvAnnualPaymentEstimateCard"),
  loading: () => <Loading />
})

const WnsReports = Loadable({
  loader: () => import("./WnsReports"),
  loading: () => <Loading />
});

const WnsReportTable = Loadable({
  loader: () => import("./WnsReportTable"),
  loading: () => <Loading />
});

export {
  TestMolecules,
  Tooltip,
  UploadSingleFile,
  DocumentList,
  MapLocator,
  FeesEstimateCard,
  HowItWorks,
  PastPayments,
  DividerWithLabel,
  MyConnections,
  PastPaymentsDetails,
  MeterReading,
  MeterReadingEditable,
  NewConnection,
  MyApplications,
  Applications,
  WnsHowItWorks,
  FeesEstimateOverviewCard,
  OwnerHeader,
  ActionFooter,
  ConfirmationDialog,
  ChipsInput,
  DemandAdjustMent,
  AdvAnnualPaymentEstimateCard,
  netAdvAnnualPaymentEstimateCard,
  WnsReports,
  WnsReportTable
};
