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
  }
};



// export const setData = async (state, dispatch, applicationNumber, tenantId) => {

//   const response = await getSearchResults([
//     {
//       key: "tenantId",
//       value: tenantId
//     },
//     { key: "acknowledgementIds", value: applicationNumber }
//   ]);
//   const properties = get(response, "Properties", []);
//   const propertyId = get(response, "Properties[0].propertyId", []);

//   const auditResponse = await getSearchResults([
//     {
//       key: "tenantId",
//       value: tenantId
//     },
//     { key: "propertyIds", value: propertyId }, {
//       key: "audit",
//       value: true
//     }
//   ]);
//   let property = (properties && properties.length > 0 && properties[0]) || {};


//   if (property && property.owners && property.owners.length > 0) {
//     let ownersTemp = [];
//     let owners = [];
//     property.owners.map(owner => {
//       owner.documentUid = owner.documents ? owner.documents[0].documentUid : "NA";
//       owner.documentType = owner.documents ? owner.documents[0].documentType : "NA";
//       if (owner.status == "ACTIVE") {
//         ownersTemp.push(owner);
//       } else {
//         owners.push(owner);
//       }
//     });
//     property.ownersInit = owners;
//     property.ownersTemp = ownersTemp;
//   }
//   property.ownershipCategoryTemp = property.ownershipCategory;
//   property.ownershipCategoryInit = 'NA';
//   // Set Institution/Applicant info card visibility
//   if (
//     get(
//       response,
//       "Properties[0].ownershipCategory",
//       ""
//     ).startsWith("INSTITUTION")
//   ) {
//     property.institutionTemp = property.institution;


//   }


//   let transfereeOwners = get(
//     property,
//     "ownersTemp", []
//   );
//   let transferorOwners = get(
//     property,
//     "ownersInit", []
//   );

//   if (auditResponse && Array.isArray(get(auditResponse, "Properties", [])) && get(auditResponse, "Properties", []).length > 0) {
//     const propertiesAudit = get(auditResponse, "Properties", []);
//     const previousActiveProperty = propertiesAudit.filter(property => property.status == 'ACTIVE').sort((x, y) => y.auditDetails.lastModifiedTime - x.auditDetails.lastModifiedTime)[0];

//     property.ownershipCategoryInit = previousActiveProperty ? previousActiveProperty.ownershipCategory : "";
//     if (previousActiveProperty && property.ownershipCategoryInit && property.ownershipCategoryInit.startsWith("INSTITUTION")) {
//       property.institutionInit = previousActiveProperty.institution;
//     }
//   }


//   // auditResponse
//   dispatch(prepareFinalObject("Property", property));
//   dispatch(prepareFinalObject("documentsUploadRedux", property.documents));
//   dispatch(prepareFinalObject("Properties", get(response, "Properties", [])));
// }
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
