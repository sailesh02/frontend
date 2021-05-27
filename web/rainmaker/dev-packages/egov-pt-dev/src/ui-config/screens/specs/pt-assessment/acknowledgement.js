import { getCommonContainer, getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { loadUlbLogo } from "egov-ui-kit/utils/pdfUtils/generatePDF";
import set from "lodash/set";
import acknowledgementCard from "../pt-mutation/acknowledgementResource/acknowledgementUtils";
import { gotoHomeFooter } from "../pt-mutation/acknowledgementResource/footers";

export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Application for Transfer of Ownership`,
    labelKey: "PT_MUTATION_APPLICATION_HEADER"
  }),
  applicationNumber: {
    uiFramework: "custom-atoms-local",
    moduleName: "egov-pt",
    componentPath: "ApplicationNoContainer",
    props: {
      number: getQueryArg(window.location.href, "applicationNumber"),
      label: {
        labelValue: "Application No.",
        labelKey: "PT_MUTATION_APPLICATION_NO"
      }
    },
    visible: true
  }
});

const getHeader = (applicationNumber, moduleName) => {
   if (moduleName == 'PT.ASSESSMENT') {
    return getCommonContainer({
      header: getCommonHeader({
        labelName: `Application for Transfer of Ownership`,
        labelKey: "PT_ASSESSMENT_APPLICATION_HEADER"
      }),
    })
  } else {
    return getCommonContainer({
      header: getCommonHeader({
        labelName: `Application for Transfer of Ownership`,
        labelKey: "PT_APPLICATION_HEADER"
      }),
    })

  }

}
const getAcknowledgementCard = (
  state,
  dispatch,
  purpose,
  status,
  applicationNumber,
  tenant,
  moduleName
) => {
if (purpose === "approve" && status === "success") {

    // loadReceiptGenerationData(applicationNumber, tenant);
    return {
      header: getHeader(applicationNumber, moduleName),
      // dpmenu:downloadprintMenu(state,applicationNumber,tenant,purpose,moduleName),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application is Approved Successfully",
              labelKey: "PT_APPROVAL_CHECKLIST_MESSAGE_HEAD"
            },
            body: {
              labelName:
                "A notification regarding Trade License Approval has been sent to trade owner at registered Mobile No.",
              labelKey: "PT_APPROVAL_CHECKLIST_MESSAGE_SUB"
            },
            tailText: {
              labelName: "Trade License No.",
              labelKey: "PT_MUTATION_APPLICATION_NO"
            },
            number: applicationNumber
          }),
        }
      },
      gotoHomeFooter
    };
  } else if (purpose === "forward" && status === "success") {
    return {
      header: getHeader(applicationNumber, moduleName),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application Forwarded Successfully",
              labelKey: "PT_FORWARD_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName:
                "A notification regarding above application status has been sent to trade owner at registered Mobile No.",
              labelKey: "PT_APPLICATION_FORWARD_SUCCESS"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "PT_MUTATION_APPLICATION_NO"
            },
            number: applicationNumber
          }),
        }
      },
      gotoHomeFooter
    };
  } else if(purpose === "verify" && status === "success") {
    return {
      header: getHeader(applicationNumber, moduleName),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application Verified Successfully",
              labelKey: "PT_VERIFY_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName:
                "A notification regarding above application status has been sent to trade owner at registered Mobile No.",
              labelKey: "PT_APPLICATION_VERIFY_SUCCESS"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "PT_MUTATION_APPLICATION_NO"
            },
            number: applicationNumber
          }),
        }
      },
      gotoHomeFooter
    };
  } else if(purpose === "sendback" && status === "success") {
    return {
      header: getHeader(applicationNumber, moduleName),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application Sent Back Successfully",
              labelKey: "PT_SENT_BACK_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName:
                "A notification regarding above application status has been sent to trade owner at registered Mobile No.",
              labelKey: "PT_APPLICATION_SENT_BACK_SUCCESS"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "PT_MUTATION_APPLICATION_NO"
            },
            number: applicationNumber
          }),
        }
      },
      gotoHomeFooter
    };
  } else if(purpose === "reject" && status === "success") {
    return {
      header: getHeader(applicationNumber, moduleName),
      applicationSuccessCard: {
        uiFramework: "custom-atoms",
        componentPath: "Div",
        children: {
          card: acknowledgementCard({
            icon: "done",
            backgroundColor: "#39CB74",
            header: {
              labelName: "Application Rejected Successfully",
              labelKey: "PT_REJECT_SUCCESS_MESSAGE_MAIN"
            },
            body: {
              labelName:
                "A notification regarding above application status has been sent to trade owner at registered Mobile No.",
              labelKey: "PT_APPLICATION_REJECT_SUCCESS"
            },
            tailText: {
              labelName: "Application No.",
              labelKey: "PT_MUTATION_APPLICATION_NO"
            },
            number: applicationNumber
          }),
        }
      },
      gotoHomeFooter
    };
  }
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "acknowledgement",
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css"
      }
    }
  },
  beforeInitScreen: (action, state, dispatch) => {
    const purpose = getQueryArg(window.location.href, "purpose");
    const status = getQueryArg(window.location.href, "status");
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const moduleName = getQueryArg(window.location.href, "moduleName");
    const tenant = getQueryArg(window.location.href, "tenantId");
    loadUlbLogo(tenant);
    // setData(state, dispatch, applicationNumber, tenant);
    const data = getAcknowledgementCard(
      state,
      dispatch,
      purpose,
      status,
      applicationNumber,
      tenant, moduleName
    );
    set(action, "screenConfig.components.div.children", data);
    return action;
  }
};
export default screenConfig;
