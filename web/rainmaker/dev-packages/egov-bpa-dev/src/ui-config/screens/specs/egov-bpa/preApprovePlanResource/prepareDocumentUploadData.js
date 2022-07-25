import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";

export const prepareDocumentsUploadData = (state, dispatch) => {
  let documents = [
    {
      code: "PREAPPROVE_BUILDING_PLAN_FILE",
      active: true,
      validation: "only dxf file",
      inputProps: {
        accept: ".dxf",
        formatProps: {
          accept: ".dxf",
        },
        multiple: false,
      },
      maxFileSize: 5000,
    },
    {
      code: "PREAPPROVE_BUILDING_PLAN_PDF",
      active: true,
      validation: "only pdf file",
      inputProps: {
        accept: ".pdf",
        formatProps: {
          accept: ".pdf",
        },
        multiple: false,
      },
      maxFileSize: 5000,

    },
    {
      code: "PREAPPROVE_BUILDING_PLAN_IMAGE",
      active: true,
      validation: "only img file",
      inputProps: {
        accept: "image/*, .png, .jpeg",
        formatProps: {
          accept: "image/*, .png, .jpeg",
        },
        multiple: false,
      },
      maxFileSize: 5000,
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
    card["inputProps"]=doc.inputProps;
    card["validation"]=doc.validation;
    card["maxFileSize"]=doc.maxFileSize
    tempDoc[doc.documentType].cards.push(card);
  });
  Object.keys(tempDoc).forEach((key) => {
    BPARegDocumentsContract.push(tempDoc[key]);
  });

  dispatch(
    prepareFinalObject("BPARegDocumentsContract", BPARegDocumentsContract)
  );
};