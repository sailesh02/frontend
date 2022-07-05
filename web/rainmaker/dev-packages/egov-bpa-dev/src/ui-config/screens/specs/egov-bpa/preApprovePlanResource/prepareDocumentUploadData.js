import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";

export const prepareDocumentsUploadData = (state, dispatch) => {
  let documents = [
    {
      code: "PREAPPROVE_BUILDING_PLAN_FILE",
      active: true,
    },
    {
      code: "PREAPPROVE_BUILDING_PLAN_PDF",
      active: true,
    },
    {
      code: "PREAPPROVE_BUILDING_PLAN_IMAGE",
      active: true,
    },
  ];
  documents = documents.filter((item) => {
    return item.active;
  });
  let BPARegDocumentsContract = [];
  let tempDoc = {};
  documents.forEach((doc) => {
    let card = {};
    card["code"] = doc.documentType;
    card["title"] = doc.documentType;
    card["cards"] = [];
    tempDoc[doc.documentType] = card;
  });

  documents.forEach((doc) => {
    // Handle the case for multiple muildings
    let card = {};
    card["name"] = doc.code;
    card["code"] = doc.code;
    card["required"] = true;
    tempDoc[doc.documentType].cards.push(card);
  });
  Object.keys(tempDoc).forEach((key) => {
    BPARegDocumentsContract.push(tempDoc[key]);
  });

  dispatch(
    prepareFinalObject("BPARegDocumentsContract", BPARegDocumentsContract)
  );
};