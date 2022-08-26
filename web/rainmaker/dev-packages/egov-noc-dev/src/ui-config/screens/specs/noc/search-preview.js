import {
  getCommonCard,
  getCommonContainer,
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonHeader,
  getLabelWithValue,
  getCommonTitle,
  getLabel,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField,
  toggleSnackbar,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import commonConfig from "config/common.js";
import store from "ui-redux/store";
import {
  getQueryArg,
  setBusinessServiceDataToLocalStorage,
  getTransformedLocale,
  getFileUrlFromAPI
} from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from "../../../../ui-utils/api";
import { requiredDocumentsData, checkValueForNA, getNocSearchResults } from "../utils";
import { ifUserRoleExists } from "egov-ui-framework/ui-utils/commons";

var myArr;
const titlebar = {
  uiFramework: "custom-atoms",
  componentPath: "Div",
  children: {
    leftContainerH: getCommonContainer({
      header: getCommonHeader({
        labelName: "NOC Application",
        labelKey: "NOC_APPLICATION_HEADER_LABEL"
      }),
    }),
  }
}

const titlebar2 = {
  uiFramework: "custom-atoms",
  componentPath: "Div",
  // visible: false,
  props: {
    style: { textAlign: "right", display: "flex" }
  },
  children: {
    nocApprovalNumber: {
      uiFramework: "custom-atoms-local",
      moduleName: "egov-noc",
      componentPath: "NocNumber",
      gridDefination: {},
      props: {
        number: "NA"
      },
    }
  }
}
const applicationOverview = getCommonContainer({
  header: getCommonTitle(
    {
      labelName: "Application Overview",
      labelKey: "NOC_APP_OVER_VIEW_HEADER"
    },
    {
      style: {
        marginBottom: 18
      }
    }
  ),
  appOverViewDetailsContainer: getCommonContainer({
    applicationNo: getLabelWithValue(
      {
        labelName: "Application No",
        labelKey: "NOC_APP_NO_LABEL"
      },
      {
        jsonPath: "Noc.applicationNo",
        callBack: checkValueForNA
      }
    ),
    module: getLabelWithValue(
      {
        labelName: "Module/Source",
        labelKey: "NOC_MODULE_SOURCE_LABEL"
      },
      {
        jsonPath: "Noc.source",
        callBack: checkValueForNA
      }
    ),
    // status: getLabelWithValue(
    //   {
    //     labelName: "Status",
    //     labelKey: "NOC_STATUS_LABEL"
    //   },
    //   {
    //     jsonPath: "Noc.applicationStatus",
    //     callBack: checkValueForNA
    //   }
    // ),
    viewApplication: {
      componentPath: "Button",
      gridDefination: {
        xs: 12,
        sm: 3
      },
      props: {
        variant: "outlined",
        style: {
          color: "#FE7A51",
          border: "#FE7A51 solid 1px",
          borderRadius: "2px"
        }
      },
      children: {
        buttonLabel: getLabel({
          labelName: "VIEW SOURCE APPLICATION",
          labelKey: "NOC_VIEW_APP_BUTTON"
        })
      },

      onClickDefination: {
        action: "condition",
        callBack: (state, dispatch) => {
          let nocData = get(state.screenConfiguration.preparedFinalObject, "Noc", "");
          let checkingApp = getTenantId().split('.')[1] ? "employee" : "citizen";
          let appendUrl = window.location.origin;
          if (process.env.NODE_ENV === "production") {
            appendUrl = `${window.location.origin}/${checkingApp}`
          }
          if (nocData && nocData.source === "BPA") {
            let bpaAppurl = appendUrl + '/egov-bpa/search-preview?applicationNumber=' + nocData.sourceRefId + '&tenantId=' + nocData.tenantId;
            window.open(bpaAppurl, '_blank');

          } else if (nocData && nocData.source === "BPA_OC") {
            let bpaAppurl = appendUrl + '/oc-bpa/search-preview?applicationNumber=' + nocData.sourceRefId + '&tenantId=' + nocData.tenantId;
            window.open(bpaAppurl, '_blank');
          }
        }
     }

    },
  }),
});
const checkAllRequiredDocumentsUploaded = (nocType,requiredDocuments) => {
  let allDocumentsUploaded = false
  //get codes of requiredDocuments
  let docFromMDMS = requiredDocuments && requiredDocuments.length > 0 && requiredDocuments.map ( doc => {
    return doc.code
  })
  //get all noc's
  //let {Noc} = this.props.preparedFinalObject
  let state = store.getState();
  let Noc = get(state.screenConfiguration.preparedFinalObject, "Noc", "");
  let requiredNoc = [];
  requiredNoc.push(Noc)
  
  let documents = []
  // to get uploaded documents
  requiredNoc && requiredNoc.length > 0 && requiredNoc[0].documents && 
  requiredNoc[0].documents.length > 0 && requiredNoc[0].documents.map( doc => {
    if(!documents.includes(doc.documentType)){
      documents.push(doc.documentType)
    }
  })
  if(requiredNoc && requiredNoc.length > 0 && requiredNoc[0].nocType == 'FIRE_NOC'){
    if(requiredNoc[0].additionalDetails && requiredNoc[0].additionalDetails.thirdPartyNOC){
      allDocumentsUploaded = true
    }
  }
  
  if(requiredNoc && requiredNoc.length > 0 && requiredNoc[0].nocType == 'NMA_NOC'){
    if(requiredNoc[0].additionalDetails && requiredNoc[0].additionalDetails.thirdPartyNOC){
      allDocumentsUploaded = true
    }
  }  
  else{
    let isUploadedDoc = docFromMDMS && docFromMDMS.length > 0 && docFromMDMS.map ( doc => {
      if(documents.includes(doc)){
        return true
      }else{
        return false
      }
    })
    if(isUploadedDoc &&isUploadedDoc.includes(false) &&requiredNoc && requiredNoc.length > 0 && requiredNoc[0].nocType == 'FIRE_NOC' ){
      allDocumentsUploaded = true
    }
    if(isUploadedDoc && isUploadedDoc.includes(false) &&requiredNoc && requiredNoc.length > 0 && requiredNoc[0].nocType == 'NMA_NOC' ){
      allDocumentsUploaded = false
    }
    else if(documents && documents.length > 0 && docFromMDMS && docFromMDMS.length > 0){
        if(documents.length == 1 && docFromMDMS.length == 1){
          if(docFromMDMS[0].endsWith('CERTIFICATE') && documents[0].endsWith('CERTIFICATE')){
            allDocumentsUploaded = true
          }
      }
    }
    else{
      allDocumentsUploaded = false
    }
  }
  return allDocumentsUploaded
}
const prepareDocumentForRedux = async (documentsList) => {
  let state = store.getState();
  const nocDocumentsDetailsRedux = get(state.screenConfiguration.preparedFinalObject, "nocDocumentsDetailsRedux", "");;
  let index = 0;
  documentsList.forEach((docType) => {
    docType.cards &&
      docType.cards.forEach((card) => {
        if (card.subCards) {
          card.subCards.forEach((subCard) => {
            let oldDocType = get(
              nocDocumentsDetailsRedux,
              `[${index}].documentType`
            );
            let oldDocCode = get(
              nocDocumentsDetailsRedux,
              `[${index}].documentCode`
            );
            let oldDocSubCode = get(
              nocDocumentsDetailsRedux,
              `[${index}].documentSubCode`
            );
            if (
              oldDocType != docType.code ||
              oldDocCode != card.name ||
              oldDocSubCode != subCard.name
            ) {
              nocDocumentsDetailsRedux[index] = {
                documentType: docType.code,
                documentCode: card.name,
                documentSubCode: subCard.name,
              };
            }
            index++;
          });
        } else {
          let oldDocType = get(
            nocDocumentsDetailsRedux,
            `[${index}].documentType`
          );
          let oldDocCode = get(
            nocDocumentsDetailsRedux,
            `[${index}].documentCode`
          );

          if (oldDocType != docType.code || oldDocCode != card.name) {
            nocDocumentsDetailsRedux[index] = {
              documentType: docType.code,
              documentCode: card.name,
              isDocumentRequired: card.required,
              isDocumentTypeRequired: card.dropDownValues
                ? card.dropDownValues.required
                : false,
            };
          }
          index++;
        }
      });
  });
  store.dispatch(
    prepareFinalObject("nocDocumentsDetailsRedux", nocDocumentsDetailsRedux)
  );
};
const prepareDocumentsUploadData = (documents) => {
  let documentsContract = [];
  let tempDoc = {};
  documents && documents.length > 0 && documents.forEach(doc => {
      let card = {};
      card["code"] = doc.documentType;
      card["title"] = doc.documentType;
      card["documentType"] = doc.documentType
      card["cards"] = [];
      tempDoc[doc.documentType] = card;
  });

  documents && documents.length > 0 && documents.forEach(doc => {
      // Handle the case for multiple muildings
      let card = {};
      card["name"] = doc.code;
      card["code"] = doc.code;
      card["required"] = doc.required ? true : false;
      card["documents"] = [1,2,3];
      card["rob"] = [3,4,3]
      if (doc.hasDropdown && doc.dropdownData) {
          let dropdown = {};
          dropdown.label = "WS_SELECT_DOC_DD_LABEL";
          dropdown.required = true;
          dropdown.menu = doc.dropdownData.filter(item => {
              return item.active;
          });
          dropdown.menu = dropdown.menu.map(item => {
              return { code: item.code, label: getTransformedLocale(item.code) };
          });
          card["dropdown"] = dropdown;
      }
      tempDoc[doc.documentType].cards.push(card);
  });

  Object.keys(tempDoc).forEach(key => {
      documentsContract.push(tempDoc[key]);
  });
  
  store.dispatch(prepareFinalObject("documentsContractNOC", documentsContract));

  prepareDocumentForRedux(documentsContract)

};

const getDocumentsFromMDMS = async (nocType, isUpdate) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "NOC",
          masterDetails: [
            {
              name: "DocumentTypeMapping",
              filter: `$.[?(@.nocType=='${nocType}')]`,
            },
          ],
        },
      ],
    },
  };
  let payload = await httpRequest(
    "post",
    "/egov-mdms-service/v1/_search",
    "_search",
    [],
    mdmsBody
  );

  let documents =
    (payload &&
      payload.MdmsRes &&
      payload.MdmsRes.NOC &&
      payload.MdmsRes.NOC.DocumentTypeMapping) ||
    [];
  let requiredDocumentsFormat =
    documents &&
    documents.length > 0 &&
    documents[0].docTypes.map((doc) => {
      let docTypeArray = doc.documentType && doc.documentType.split(".");
      let length = docTypeArray.length;
      let docType =
        length == 2 ? `${doc.documentType}.CERTIFICATE` : doc.documentType;
      let required = length == 2 ? false : true;
      return {
        code: docType,
        documentType: docType,
        required: required,
        active: doc.active || true,
      };
    });

  store.dispatch(
    prepareFinalObject("SelectedNocDocument", requiredDocumentsFormat)
  );


  let state = store.getState();
  let Noc = get(state.screenConfiguration.preparedFinalObject, "Noc", "");
  let requiredNoc = [];
  requiredNoc.push(Noc);
  if (
    requiredNoc &&
    requiredNoc.length > 0 &&
    requiredNoc[0].documents &&
    requiredNoc[0].documents.length > 0
  ) {
    if (nocType == "NMA_NOC") {
      store.dispatch(
        handleField(
          "search-preview",
          "components.div.children.triggerNocContainer.props",
          "height",
          "400px"
        )
      );
      store.dispatch(
        handleField(
          "search-preview",
          "components.div.children.triggerNocContainer.props",
          "open",
          true
        )
      );
      let documentDetailsPreview = get(state.screenConfiguration.preparedFinalObject, "documentDetailsPreview", "");
      prepareDocumentsUploadData(requiredDocumentsFormat,documentDetailsPreview);
    }
      
  } else {
    if (checkAllRequiredDocumentsUploaded(nocType, requiredDocumentsFormat)) {
      store.dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "BPA_NOC_UP_TO_DATE_MSG",
            labelKey: "BPA_NOC_UP_TO_DATE_MSG",
          },
          "success"
        )
      );
    } else {
      if (nocType == "NMA_NOC") {
        store.dispatch(
          handleField(
            "search-preview",
            "components.div.children.triggerNocContainer.props",
            "height",
            "400px"
          )
        );
      } else {
        store.dispatch(
          handleField(
            "search-preview",
            "components.div.children.triggerNocContainer.props",
            "height",
            "270px"
          )
        );
      }
      store.dispatch(
        handleField(
          "search-preview",
          "components.div.children.triggerNocContainer.props",
          "open",
          true
        )
      );
      prepareDocumentsUploadData(requiredDocumentsFormat);
    }
  }
  



  
};

const nocInfo = getCommonContainer({
  header: getCommonTitle(
    {
      labelName: "Application Overview",
      labelKey: "NOC_UPDATE"
    },
    {
      style: {
        marginBottom: 18
      }
    }  ),
  appOverViewDetailsContainer: getCommonContainer({
    applicationNo: getLabelWithValue(
      {
        labelName: "Application No",
        labelKey: "NOC_APP_NO_LABEL"
      },
      {
        jsonPath: "Noc.applicationNo",
        callBack: checkValueForNA
      }
    ),
    module: getLabelWithValue(
      {
        labelName: "Module/Source",
        labelKey: "NOC_TYPE_LABEL"
      },
      {
        jsonPath: "Noc.nocType",
        callBack: checkValueForNA
      }
    ),
    status: getLabelWithValue(
      {
        labelName: "Status",
        labelKey: "NOC_STATUS_LABEL"
      },
      {
        jsonPath: "Noc.applicationStatus",
        callBack: checkValueForNA
      }
    ),
    viewApplication: {
      componentPath: "Button",
      gridDefination: {
        xs: 12,
        sm: 3
      },
      props: {
        variant: "outlined",
        style: {
          color: "#FE7A51",
          border: "#FE7A51 solid 1px",
          borderRadius: "2px"
        }
      },
      children: {
        buttonLabel: getLabel({
          labelName: "VIEW SOURCE APPLICATION",
          labelKey: "NOC_EDIT_BUTTON"
        })
      },

      onClickDefination: {
        action: "condition",
        callBack: (state, dispatch) => {
          let nocData = get(state.screenConfiguration.preparedFinalObject, "Noc", "");
          // getDocumentsFromMDMS(nocData.nocType)
          dispatch(handleField(
            "search-preview",
            "components.div.children.triggerNocContainer.props",
            "open",
             true
          ))

          dispatch(handleField(
            "search-preview",
            "components.div.children.triggerNocContainer.props",
            "nocType",
            nocData.nocType
          )) 
          
          
    
          dispatch(handleField(
            "search-preview",
            "components.div.children.triggerNocContainer.props",
            "type",
            "trigger"
          ))
         
        }
      }

    },
  }),
});

const nocDetails = getCommonGrayCard({
  header: {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    props: {
      style: { marginBottom: "10px" }
    },
    children: {
      header: {
        gridDefination: {
          xs: 12
        },
        ...getCommonSubHeader({
          labelName: "Fire NOC",
          // labelKey: "BPA_NOC_FIRE_TITLE"
        })
      },
    }
  },
  documentDetailsCard: {
    uiFramework: "custom-containers-local",
    moduleName: "egov-noc",
    componentPath: "PreviewContainer",
    props: {
      sourceJsonPath: "documentDetailsPreview",
      className: "review-documents",
      buttonLabel: {
        labelName: "UPLOAD FILE",
        labelKey: "NOC_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE"
      },
      inputProps: {
        accept: "image/*, .pdf, .png, .jpeg",
        multiple: false
      },
      maxFileSize: 5000
    }
  }
});

const setSearchResponse = async (
  state,
  dispatch,
  applicationNumber,
  tenantId, action
) => {
  await getRequiredMdmsDetails(state, dispatch);

  const response = await getNocSearchResults([
    {
      key: "tenantId",
      value: tenantId
    },
    { key: "applicationNo", value: applicationNumber }
  ]);
  dispatch(prepareFinalObject("Noc", get(response, "Noc[0]", {})));
  /********************/
  let nocNewObject = {};
  let thirdPartyData = get(response, "Noc[0].additionalDetails.thirdPartyNOC");
  let NocApp = get(response, "Noc[0]", {});
  if(NocApp.applicationStatus != "CREATED" || NocApp.applicationStatus != "INPROGRESS" ){
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.nocUpdateContainer.children.cardContent.children.nocOverview.children.appOverViewDetailsContainer.children.viewApplication",
        "visible",
        false
      )
    );
    
  }
  if(!ifUserRoleExists("BPA_ARCHITECT")){
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.nocUpdateContainer.children.cardContent.children.nocOverview.children.appOverViewDetailsContainer.children.viewApplication",
        "visible",
        false
      )
    );
  }
if(NocApp.nocType === "FIRE_NOC"){
  for (var key in thirdPartyData) {
    
     if (thirdPartyData.hasOwnProperty(key)) {
      if(key === "fireDistrict"){
        nocNewObject.firedistricts = thirdPartyData[key].name;
      }else if(key === "buildingType"){
        nocNewObject.Buildingtypes = thirdPartyData[key].BuildingType;
      }else if(key === "fireStation"){
        nocNewObject.fireStations = thirdPartyData[key].name;
      }else if( key=== "identityProofNo"){
        nocNewObject[key] = thirdPartyData[key]  
      }else{
        nocNewObject[key] = thirdPartyData[key].name;
      }
     }
}

  dispatch(prepareFinalObject("NewNocAdditionalDetailsFire.thirdPartyNOC", nocNewObject));
}else{
  
  dispatch(prepareFinalObject("NewNocAdditionalDetails.thirdPartyNOC", thirdPartyData));
}
let bpaStatus = getQueryArg(window.location.href, "bpaStatus");
let bpaStatusArray = ["INITIATED", "CITIZEN_APPROVAL_INPROCESS", "PENDING_APPL_FEE", "INPROGRESS"];

if((NocApp.applicationStatus == "CREATED") && !bpaStatusArray.includes(bpaStatus)){
  dispatch(prepareFinalObject("ChangedNocAction", true));
}else{
  dispatch(prepareFinalObject("ChangedNocAction", false));
}

  /*****************/
  const queryObject = [
    { key: "tenantId", value: tenantId },
    { key: "businessServices", value: get(response, "Noc[0].additionalDetails.workflowCode") }
  ];
  setBusinessServiceDataToLocalStorage(queryObject, dispatch);

  if (response && get(response, "Noc[0].nocNo")) {
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.headerDiv.children.header2.children.titlebar2.children.nocApprovalNumber",
        "props.number",
        get(response, "Noc[0].nocNo")
      )
    );
  } else {

    dispatch(
      handleField(
        "search-preview",
        "components.div.children.headerDiv.children.header2.children.titlebar2.children.nocApprovalNumber",
        "visible",
        false
      )
    )
  }
  set(
    action,
    "screenConfig.components.div.children.body.children.cardContent.children.nocDetails.children.cardContent.children.header.children.header.children.key.props.labelKey",
    `NOC_NOC_TYPE_${get(response, "Noc[0].nocType")}`
  );

  requiredDocumentsData(state, dispatch, action);
  let appStatus = get(response, "Noc[0].applicationStatus");
  if(appStatus == "SUBMITED" || appStatus == "REJECTED" || appStatus == "APPROVED" || appStatus == "VOIDED"){
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.nocUpdateContainer",
        "visible",
        false
      )
    )
  }
  

};

const getRequiredMdmsDetails = async (state, dispatch, action) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: getTenantId().split('.')[0],
      moduleDetails: [
        {
          moduleName: "common-masters",
          masterDetails: [
            {
              name: "DocumentType"
            }
          ]
        },
        {
          moduleName: "NOC",
          masterDetails: [
            {
              name: "DocumentTypeMapping"
            },
          ]
        }
      ]
    }
  };
  let payload = await httpRequest(
    "post",
    "/egov-mdms-service/v1/_search",
    "_search",
    [],
    mdmsBody
  );
  dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
}

export const prepareDocsInEmployee = (state, dispatch, action) => {
  let applicationDocuments = get(
    state,
    "screenConfiguration.preparedFinalObject.applyScreenMdmsData.NOC.DocumentTypeMapping",
    []
  );
  let documentsDropDownValues = get(
    state,
    "screenConfiguration.preparedFinalObject.applyScreenMdmsData.common-masters.DocumentType",
    []
  );
  let nocType = get(
    state,
    "screenConfiguration.preparedFinalObject.Noc.nocType", ""
  );

  let documents = [];
  applicationDocuments && applicationDocuments.length > 0 &&
    applicationDocuments.forEach(doc => {
      if (doc.applicationType === "NEW" && doc.nocType === nocType) {
        documents.push(doc.docTypes);
      }
    });

  let documentsList = [];
  if (documents[0] && documents[0].length > 0) {
    documents[0].forEach(doc => {
      let code = doc.documentType;
      doc.dropDownValues = [];
      documentsDropDownValues.forEach(value => {
        let values = value.code.slice(0, code.length);
        if (code === values) {
          doc.hasDropdown = true;
          doc.dropDownValues.push(value);
        }
      });
      documentsList.push(doc);
    });
  }
  const nocDocuments = documentsList;
  let documentsContract = [];
  let tempDoc = {};

  if (nocDocuments && nocDocuments.length > 0) {
    nocDocuments.forEach(doc => {
      let card = {};
      card["code"] = doc.documentType.split(".")[0];
      card["title"] = doc.documentType.split(".")[0];
      card["cards"] = [];
      tempDoc[doc.documentType.split(".")[0]] = card;
    });
    nocDocuments.forEach(doc => {
      let card = {};
      card["name"] = doc.documentType;
      card["code"] = doc.documentType;
      card["required"] = doc.required ? true : false;
      if (doc.hasDropdown && doc.dropDownValues) {
        let dropDownValues = {};
        dropDownValues.label = "Select Documents";
        dropDownValues.required = doc.required;
        dropDownValues.menu = doc.dropDownValues.filter(item => {
          return item.active;
        });
        dropDownValues.menu = dropDownValues.menu.map(item => {
          return { code: item.documentType, label: item.documentType };
        });
        card["dropDownValues"] = dropDownValues;
      }
      tempDoc[doc.documentType.split(".")[0]].cards.push(card);
    });
  }

  if (tempDoc) {
    Object.keys(tempDoc).forEach(key => {
      documentsContract.push(tempDoc[key]);
    });
  }

  dispatch(prepareFinalObject("documentDetailsPreview", documentsContract));

}
const screenConfig = {
  uiFramework: "material-ui",
  name: "search-preview",
  beforeInitScreen: (action, state, dispatch) => {
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    const tenantId = getQueryArg(window.location.href, "tenantId");
    setSearchResponse(state, dispatch, applicationNumber, tenantId, action);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css bpa-searchpview"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 6,
                md: 6
              },
              ...titlebar
            },
            header2: {
              uiFramework: "custom-atoms",
              componentPath: "Container",
              props: {
                color: "primary",
                style: { justifyContent: "flex-end" }
              },
              gridDefination: {
                xs: 12,
                sm: 6,
                md: 6,
                align: "right"
              },
              children: {
                titlebar2
              }
            }
          }
        },

        taskStatus: {
          uiFramework: "custom-containers-local",
          componentPath: "WorkFlowContainer",
          moduleName: "egov-workflow",
          visible: true,
          props: {
            dataPath: "Noc",
            moduleName: "Noc",
            updateUrl: "/noc-services/v1/noc/_update"
          }
        },
        applicationOverviewContainer: getCommonCard({
          applicationOverview: applicationOverview
        }),
        nocUpdateContainer: getCommonCard({
          nocOverview: nocInfo
        }),
        body: getCommonCard({
          nocDetails: nocDetails
        }),
        triggerNocContainer :{
          uiFramework: "custom-containers-local",
          componentPath: "TriggerNOCContainer",
          moduleName: "egov-bpa",
          visible: true,
          props: {
            open:false,
            nocType:''
          }
        }
      }
    }
  }
};

export default screenConfig; 