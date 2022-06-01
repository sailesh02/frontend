import commonConfig from "config/common.js";
import {
  handleScreenConfigurationFieldChange as handleField, prepareFinalObject,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { uploadFile } from "egov-ui-framework/ui-utils/api";
import {
  acceptedFiles, getFileUrl,
  getFileUrlFromAPI, getMultiUnits, getQueryArg, setBusinessServiceDataToLocalStorage,
  enableField, disableField, enableFieldAndHideSpinner
} from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import set from "lodash/set";
import compact from "lodash/compact";
import store from "redux/store";
import {
  convertDateToEpoch,
  getCurrentFinancialYear, getTranslatedLabel,
  ifUserRoleExists,
  getUniqueItemsFromArray
} from "../ui-config/screens/specs/utils";
import { httpRequest } from "./api";

export const updateTradeDetails = async requestBody => {
  try {
    const payload = await httpRequest(
      "post",
      "/mr-services/v1/_update",
      "",
      [],
      requestBody
    );
    return payload;
  } catch (error) {
    store.dispatch(toggleSnackbar(true, error.message, "error"));
  }
};

export const getLocaleLabelsforTL = (label, labelKey, localizationLabels) => {
  if (labelKey) {
    let translatedLabel = getTranslatedLabel(labelKey, localizationLabels);
    if (!translatedLabel || labelKey === translatedLabel) {
      return label;
    } else {
      return translatedLabel;
    }
  } else {
    return label;
  }
};

export const getSearchResults = async queryObject => {
  try {
    const response = await httpRequest(
      "post",
      "/mr-services/v1/_search",
      "",
      queryObject
    );
    return response;
  } catch (error) {
    enableFieldAndHideSpinner('search', "components.div.children.tradeLicenseApplication.children.cardContent.children.button.children.buttonContainer.children.searchButton", store.dispatch);
    store.dispatch(
      toggleSnackbar(
        true,
        { labelName: error.message, labelCode: error.message },
        "error"
      )
    );
  }
};

const setDocsForEditFlow = async (state, dispatch) => {
  let applicationDocuments = get(
    state.screenConfiguration.preparedFinalObject,
    "MarriageRegistrations[0].applicationDocuments",
    []
  );
  /* To change the order of application documents similar order of mdms order*/
  const mdmsDocs = get(
    state.screenConfiguration.preparedFinalObject,
    "applyScreenMdmsData.MarriageRegistration.documentObj[0].allowedDocs",
    []
  );
  let orderedApplicationDocuments = mdmsDocs.map(mdmsDoc => {
    let applicationDocument = {}
    applicationDocuments && applicationDocuments.map(appDoc => {
      if (appDoc.documentType == mdmsDoc.documentType) {
        applicationDocument = { ...appDoc }
      }
    })
    return applicationDocument;
  }
  ).filter(docObj => Object.keys(docObj).length > 0)
  applicationDocuments = [...orderedApplicationDocuments];
  dispatch(
    prepareFinalObject("MarriageRegistrations[0].applicationDocuments", applicationDocuments)
  );

  let uploadedDocuments = {};
  let fileStoreIds =
    applicationDocuments &&
    applicationDocuments.map(item => item.fileStoreId).join(",");
  const fileUrlPayload =
    fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
  applicationDocuments &&
    applicationDocuments.forEach((item, index) => {
      uploadedDocuments[index] = [
        {
          fileName:
            (fileUrlPayload &&
              fileUrlPayload[item.fileStoreId] &&
              decodeURIComponent(
                getFileUrl(fileUrlPayload[item.fileStoreId])
                  .split("?")[0]
                  .split("/")
                  .pop()
                  .slice(13)
              )) ||
            `Document - ${index + 1}`,
          fileStoreId: item.fileStoreId,
          fileUrl: Object.values(fileUrlPayload)[index],
          documentType: item.documentType,
          tenantId: item.tenantId,
          id: item.id
        }
      ];
    });
  dispatch(
    prepareFinalObject("LicensesTemp[0].uploadedDocsInRedux", uploadedDocuments)
  );
  // dispatch(
  //   prepareFinalObject("LicensesTemp[0].applicationDocuments", uploadedDocuments)
  // );
};
const setDocsForEditFlow_backup = async (state, dispatch) => {
  let applicationDocuments = get(
    state.screenConfiguration.preparedFinalObject,
    "MarriageRegistrations[0].applicationDocuments",
    []
  );
  /* To change the order of application documents similar order of mdms order*/
  const mdmsDocs = get(
    state.screenConfiguration.preparedFinalObject,
    "applyScreenMdmsData.MarriageRegistration.documentObj[0].allowedDocs",
    []
  );

  let orderedApplicationDocuments1 = mdmsDocs.map(mdmsDoc => {
    let applicationDocument1 = {}
    applicationDocuments1 && applicationDocuments1.map(appDoc => {
      if (appDoc.documentType == mdmsDoc.documentType) {
        applicationDocument1 = { ...appDoc }
      }
    })
    return applicationDocument1;
  }
  );

  let orderedApplicationDocuments = mdmsDocs.map(mdmsDoc => {
    let applicationDocument = {}
    applicationDocuments && applicationDocuments.map(appDoc => {
      if (appDoc.documentType == mdmsDoc.documentType) {
        applicationDocument = { ...appDoc }
      }
    })
    return applicationDocument;
  }
  ).filter(docObj => Object.keys(docObj).length > 0)

  applicationDocuments = [...orderedApplicationDocuments];

  dispatch(
    prepareFinalObject("MarriageRegistrations[0].applicationDocuments", applicationDocuments)
  );

  let uploadedDocuments = {};
  let fileStoreIds =
    applicationDocuments &&
    applicationDocuments.map(item => item.fileStoreId).join(",");
  const fileUrlPayload =
    fileStoreIds && (await getFileUrlFromAPI(fileStoreIds));
  applicationDocuments &&
    applicationDocuments.forEach((item, index) => {
      uploadedDocuments[index] = [
        {
          fileName:
            (fileUrlPayload &&
              fileUrlPayload[item.fileStoreId] &&
              decodeURIComponent(
                getFileUrl(fileUrlPayload[item.fileStoreId])
                  .split("?")[0]
                  .split("/")
                  .pop()
                  .slice(13)
              )) ||
            `Document - ${index + 1}`,
          fileStoreId: item.fileStoreId,
          fileUrl: Object.values(fileUrlPayload)[index],
          documentType: item.documentType,
          tenantId: item.tenantId,
          id: item.id
        }
      ];
    });

  console.log(uploadedDocuments, "nero uploadedDocuments")
  dispatch(
    prepareFinalObject("LicensesTemp[0].uploadedDocsInRedux", uploadedDocuments)
  );
};

const generateNextFinancialYear = state => {
  const currentFY = get(
    state.screenConfiguration.preparedFinalObject,
    "Licenses[0].financialYear"
  );
  const financialYears = get(
    state.screenConfiguration.preparedFinalObject,
    "applyScreenMdmsData.egf-master.FinancialYear",
    []
  );
  const currrentFYending = financialYears.filter(item => item.code === currentFY)[0]
    .endingDate;

  const nectYearObject = financialYears.filter(item => item.startingDate === currrentFYending)[0];
  return nectYearObject ? nectYearObject.code : getCurrentFinancialYear();

};

export const updatePFOforSearchResults = async (
  action,
  state,
  dispatch,
  queryValue,
  tenantId
) => {
  let queryObject = [
    {
      key: "tenantId",
      value: tenantId ? tenantId : getTenantId()
    },
    { key: "applicationNumber", value: queryValue }
  ];
  const isPreviouslyEdited = getQueryArg(window.location.href, "edited");
  const payload = !isPreviouslyEdited
    ? await getSearchResults(queryObject)
    : {
      MarriageRegistrations: get(state.screenConfiguration.preparedFinalObject, "MarriageRegistrations")
    };

  if (payload && payload.MarriageRegistrations) {
    dispatch(prepareFinalObject("MarriageRegistrations[0]", payload.MarriageRegistrations[0]));

  }



  setDocsForEditFlow(state, dispatch);

  setApplicationNumberBox(state, dispatch);


};

export const getBoundaryData = async (
  action,
  state,
  dispatch,
  queryObject,
  code,
  componentPath
) => {
  try {
    let payload = await httpRequest(
      "post",
      "/egov-location/location/v11/boundarys/_search?hierarchyTypeCode=REVENUE&boundaryType=Locality",
      "_search",
      queryObject,
      {}
    );
    const tenantId =
      process.env.REACT_APP_NAME === "Employee"
        ? get(
          state.screenConfiguration.preparedFinalObject,
          "MarriageRegistrations[0].tenantId"
        )
        : getQueryArg(window.location.href, "tenantId");

    const mohallaData =
      payload &&
      payload.TenantBoundary[0] &&
      payload.TenantBoundary[0].boundary &&
      payload.TenantBoundary[0].boundary.reduce((result, item) => {
        result.push({
          ...item,
          name: `${tenantId
            .toUpperCase()
            .replace(/[.]/g, "_")}_REVENUE_${item.code
              .toUpperCase()
              .replace(/[._:-\s\/]/g, "_")}`
        });
        return result;
      }, []);

    dispatch(
      prepareFinalObject(
        "applyScreenMdmsData.tenant.localities",
        // payload.TenantBoundary && payload.TenantBoundary[0].boundary,
        mohallaData
      )
    );

    dispatch(
      handleField(
        "apply",
        "components.div.children.formwizardFirstStep.children.tradeLocationDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLocMohalla",
        "props.suggestions",
        mohallaData
      )
    );
    if (code) {
      let data = payload.TenantBoundary[0].boundary;
      let messageObject =
        data &&
        data.find(item => {
          return item.code == code;
        });
      // if (messageObject)
      //   dispatch(
      //     prepareFinalObject(
      //       "Licenses[0].tradeLicenseDetail.address.locality.name",
      //       messageObject.name
      //     )
      //   );
    }
  } catch (e) {
    console.log(e);
  }
};

const createOwnersBackup = (dispatch, payload) => {
  const owners = get(payload, "Licenses[0].tradeLicenseDetail.owners");
  owners &&
    owners.length > 0 &&
    dispatch(
      prepareFinalObject(
        "LicensesTemp[0].tradeLicenseDetail.owners",
        JSON.parse(JSON.stringify(owners))
      )
    );
};

const getMultipleOwners = owners => {
  let mergedOwners =
    owners &&
    owners.reduce((result, item) => {
      if (item && item !== null && item.hasOwnProperty("mobileNumber")) {
        if (item.hasOwnProperty("active") && item.active) {
          if (item.hasOwnProperty("isDeleted") && !item.isDeleted) {
            set(item, "active", false);
            result.push(item);
          } else {
            result.push(item);
          }
        } else {
          if (!item.hasOwnProperty("isDeleted")) {
            result.push(item);
          }
        }
      }
      return result;
    }, []);

  return mergedOwners;
};

export const applyTradeLicense = async (state, dispatch, activeIndex) => {
  try {

    let queryObject = JSON.parse(
      JSON.stringify(
        get(state.screenConfiguration.preparedFinalObject, "MarriageRegistrations", [])
      )
    );
    console.log(state.screenConfiguration.preparedFinalObject, "Nero state.screenConfiguration.preparedFinalObject")
    var stateObj = get(state.screenConfiguration.preparedFinalObject, "MarriageRegistrations", []);

    var appDocuments = stateObj && stateObj[0].applicationDocuments;

    set(
      queryObject[0],
      "marriageDate",
      convertDateToEpoch(queryObject[0].marriageDate, "dayend")
    );
    //------ removing null from document array ------
    //let documentArray = compact(get(queryObject[0], "applicationDocuments"));
    let documentArray = compact(appDocuments);


    let documents = getUniqueItemsFromArray(documentArray, "fileStoreId");
    console.log(documents, "Nero Document")
    // if (activeIndex === 4)
    //   documents = documents.filter(item => item.fileStoreId);
    // else
    //   documents = documents.filter(item => item.fileUrl && item.fileName);


    set(queryObject[0], "applicationDocuments", documents);
    //-----------------------------------------------
    // let documents = get(queryObject[0], "tradeLicenseDetail.applicationDocuments");

    set(queryObject[0], "wfDocuments", documents);
    let coupleDetails = [];
    if (queryObject[0] && queryObject[0].coupleDetails) {
      coupleDetails = get(
        queryObject[0],
        "coupleDetails",
        []
      );
      for (let i = 0; i < coupleDetails.length; i++) {
        if (coupleDetails[i].bride) {
          coupleDetails[i].bride.dateOfBirth = convertDateToEpoch(coupleDetails[i].bride.dateOfBirth, "dayend")
          if (typeof coupleDetails[i].bride.isDivyang == "string") {
            if (coupleDetails[i].bride.isDivyang == 'Yes') {
              coupleDetails[i].bride.isDivyang = true;
            } else {
              coupleDetails[i].bride.isDivyang = false;
            }

          }
        }
        if (coupleDetails[i].groom) {
          coupleDetails[i].groom.dateOfBirth = convertDateToEpoch(coupleDetails[i].groom.dateOfBirth, "dayend")
          if (typeof coupleDetails[i].groom.isDivyang == "string") {
            if (coupleDetails[i].groom.isDivyang == 'Yes') {
              coupleDetails[i].groom.isDivyang = true;
            } else {
              coupleDetails[i].groom.isDivyang = false;
            }
          }
        }

      }

    }

    set(queryObject[0], "coupleDetails", coupleDetails);
    console.log(queryObject[0], "Nero Couple Details");
    const cityId = get(
      queryObject[0],
      "tenantId",
      ""
    );


    const tenantId = ifUserRoleExists("CITIZEN") ? cityId : getTenantId();

    disableField('apply', "components.div.children.footer.children.nextButton", dispatch);
    disableField('apply', "components.div.children.footer.children.payButton", dispatch);




    set(queryObject[0], "workflowCode", "MR");
    set(queryObject[0], "businessService", "MR");


    if (queryObject[0].applicationNumber) {

      //call update
      //call update
      const isCorrection = getQueryArg(window.location.href, "action") === "CORRECTION";
      if (isCorrection) {

        set(queryObject[0], "applicationType", "CORRECTION");
        set(queryObject[0], "workflowCode", "MRCORRECTION");

      }



      let action = "INITIATE";
      //Code for edit flow


      console.log(activeIndex, "Nero active step")
      if(getQueryArg(window.location.href, "action") != 'edit'){
      if ((activeIndex === 4 || activeIndex === 1)) {

        action = activeIndex === 4 ? "APPLY" : "INITIATE";


      }
    }else if(activeIndex === 4){
      action = "FORWARD"
    }

      if (isCorrection && activeIndex === 3) {
        let renewalSearchQueryObject = [
          { key: "tenantId", value: queryObject[0].tenantId },
          { key: "applicationNumber", value: queryObject[0].applicationNumber }
        ];
        const renewalResponse = await getSearchResults(renewalSearchQueryObject);
        const renewalDocuments = get(renewalResponse, "MarriageRegistrations[0].applicationDocuments");
        console.log(renewalResponse, "nero renewalResponse")
        for (let i = 1; i <= documents.length; i++) {
          if (i > renewalDocuments.length) {
            renewalDocuments.push(documents[i - 1])
          }
          else {
            if (!documents[i - 1].hasOwnProperty("id")) {
              renewalDocuments[i - 1].active = false;
              renewalDocuments.push(documents[i - 1])
            }
          }
        }
        dispatch(prepareFinalObject("MarriageRegistrations[0].applicationDocuments", renewalDocuments));
        set(queryObject[0], "applicationDocuments", renewalDocuments);
      }
      set(queryObject[0], "action", action);
      const isEditFlow = getQueryArg(window.location.href, "action") === "edit";


      let updateResponse = [];
      //if (!isEditFlow) {



        updateResponse = await httpRequest("post", "/mr-services/v1/_update", "", [], {
          MarriageRegistrations: queryObject
        })


      //}
      //Renewal flow

      let updatedApplicationNo = "";
      let updatedTenant = "";
      if (isCorrection && updateResponse && get(updateResponse, "MarriageRegistrations[0]")) {
        updatedApplicationNo = get(updateResponse.MarriageRegistrations[0], "applicationNumber");
        updatedTenant = get(updateResponse.MarriageRegistrations[0], "tenantId");
        const workflowCode = get(updateResponse.MarriageRegistrations[0], "workflowCode");
        const bsQueryObject = [
          { key: "tenantId", value: tenantId },
          { key: "businessServices", value: workflowCode ? workflowCode : "MRCORRECTION" }
        ];

        setBusinessServiceDataToLocalStorage(bsQueryObject, dispatch);
      } else {
        updatedApplicationNo = queryObject[0].applicationNumber;
        updatedTenant = queryObject[0].tenantId;
      }
      //updatedApplicationNo = queryObject[0].applicationNumber;
      // let searchQueryObject = [
      //   { key: "tenantId", value: tenantId },
      //   { key: "applicationNumber", value: updatedApplicationNo }
      // ];
      // let searchResponse = await getSearchResults(searchQueryObject);
      // if (isEditFlow) {
      //   searchResponse = { MarriageRegistrations: queryObject };
      // } else {
      //   dispatch(prepareFinalObject("MarriageRegistrations", searchResponse.MarriageRegistrations));
      // }

      let mrgObjfromUpdateres = get(updateResponse, "MarriageRegistrations");
      dispatch(prepareFinalObject("MarriageRegistrations", mrgObjfromUpdateres));
      enableField('apply', "components.div.children.footer.children.nextButton", dispatch);
      enableField('apply', "components.div.children.footer.children.payButton", dispatch);


    } else {
      if (process.env.REACT_APP_NAME == "Employee") {

        let primaryOwner = get(
          queryObject[0],
          "primaryOwner",
          ''
        );
        if (primaryOwner == "GROOM") {
          set(queryObject[0], "coupleDetails[0].bride.isPrimaryOwner", false);
          set(queryObject[0], "coupleDetails[0].groom.isPrimaryOwner", true);
        } else {
          set(queryObject[0], "coupleDetails[0].bride.isPrimaryOwner", true);
          set(queryObject[0], "coupleDetails[0].groom.isPrimaryOwner", false);
        }

      }
      set(queryObject[0], "action", "INITIATE");
      const response = await httpRequest(
        "post",
        "/mr-services/v1/_create",
        "",
        [],
        { MarriageRegistrations: queryObject }
      );
      dispatch(prepareFinalObject("MarriageRegistrations", response.MarriageRegistrations));

      enableField('apply', "components.div.children.footer.children.nextButton", dispatch);
      enableField('apply', "components.div.children.footer.children.payButton", dispatch);

    }
    /** Application no. box setting */
    setApplicationNumberBox(state, dispatch);
    return true;
  } catch (error) {
    enableField('apply', "components.div.children.footer.children.nextButton", dispatch);
    enableField('apply', "components.div.children.footer.children.payButton", dispatch);
    dispatch(toggleSnackbar(true, { labelName: error.message }, "error"));
    console.log(error);
    return false;
  }
};

const convertOwnerDobToEpoch = owners => {
  let updatedOwners =
    owners && owners.length > 0 &&
    owners
      .map(owner => {
        return {
          ...owner,
          dob:
            owner && owner !== null && convertDateToEpoch(owner.dob, "dayend")
        };
      })
      .filter(item => item && item !== null);
  return updatedOwners;
};

export const getImageUrlByFile = file => {
  return new Promise(resolve => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = e => {
      const fileurl = e.target.result;
      resolve(fileurl);
    };
  });
};

export const getFileSize = file => {
  const size = parseFloat(file.size / 1024).toFixed(2);
  return size;
};

export const isFileValid = (file, acceptedFiles) => {
  const mimeType = file["type"];
  return (
    (mimeType &&
      acceptedFiles &&
      acceptedFiles.indexOf(mimeType.split("/")[1]) > -1) ||
    false
  );
};

const setApplicationNumberBox = (state, dispatch) => {
  let applicationNumber = get(
    state,
    "screenConfiguration.preparedFinalObject.MarriageRegistrations[0].applicationNumber",
    null
  );
  if (applicationNumber) {

    dispatch(
      handleField(
        "apply",
        "components.div.children.headerDiv.children.header.children.applicationNumber",
        "visible",
        true
      )
    );
    dispatch(
      handleField(
        "apply",
        "components.div.children.headerDiv.children.header.children.applicationNumber",
        "props.number",
        applicationNumber
      )
    );
  }
};

export const findItemInArrayOfObject = (arr, conditionCheckerFn) => {
  for (let i = 0; i < arr.length; i++) {
    if (conditionCheckerFn(arr[i])) {
      return arr[i];
    }
  }
};


export const handleFileUpload = (event, handleDocument, props, dispatch) => {
  const S3_BUCKET = {
    endPoint: "filestore/v1/files"
  };
  let uploadDocument = true;
  const { maxFileSize, formatProps, moduleName } = props;
  const input = event.target;
  if (input.files && input.files.length > 0) {
    const files = input.files;
    Object.keys(files).forEach(async (key, index) => {
      const file = files[key];
      const fileValid = isFileValid(file, acceptedFiles(formatProps.accept));
      const isSizeValid = getFileSize(file) <= maxFileSize;
      if (!fileValid) {
        alert(`Only image or pdf files can be uploaded`);
        uploadDocument = false;
      }
      if (!isSizeValid) {
        alert(`Maximum file size can be ${Math.round(maxFileSize / 1000)} MB`);
        uploadDocument = false;
      }
      if (uploadDocument) {
        if (file.type.match(/^image\//)) {
          const fileStoreId = await uploadFile(
            S3_BUCKET.endPoint,
            moduleName,
            file,
            commonConfig.tenantId
          );
          handleDocument(file, fileStoreId, dispatch);
        } else {
          const fileStoreId = await uploadFile(
            S3_BUCKET.endPoint,
            moduleName,
            file,
            commonConfig.tenantId
          );
          handleDocument(file, fileStoreId, dispatch);
        }
      }
    });
  }
};

export const getNextFinancialYearForRenewal = async (currentFinancialYear) => {
  let payload = null;
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: getTenantId(),
      moduleDetails: [
        {
          moduleName: "egf-master",
          masterDetails: [{ name: "FinancialYear", filter: `[?(@.module == "TL")]` }]
        }
      ]
    }
  };

  try {
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );

    const financialYears = get(payload.MdmsRes, "egf-master.FinancialYear");
    const currrentFYending = financialYears.filter(item => item.code === currentFinancialYear)[0]
      .endingDate;
    const nectYearObject = financialYears.filter(item => item.startingDate === currrentFYending)[0];
    return nectYearObject ? nectYearObject.code : getCurrentFinancialYear();
  } catch (e) {
    console.log(e.message)
  }
}

export const checkValidOwners = (currentOwners = [], oldOwners = []) => {

  for (var i = 0, len = currentOwners.length; i < len; i++) {
    for (var j = 0, len2 = oldOwners.length; j < len2; j++) {
      if (currentOwners[i].name === oldOwners[j].name) {
        oldOwners.splice(j, 1);
        len2 = oldOwners.length;
      }
    }
  }
  oldOwners = oldOwners && Array.isArray(oldOwners) && oldOwners.map(owner => {
    return { ...owner, userActive: false }
  })
  currentOwners = currentOwners && Array.isArray(currentOwners) && currentOwners.map(owner => {
    return { ...owner, userActive: true }
  })

  return [...currentOwners, ...oldOwners];
}

