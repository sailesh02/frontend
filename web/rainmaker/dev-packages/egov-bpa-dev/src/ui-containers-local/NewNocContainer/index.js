import { Dialog, DialogContent } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid, Typography, Button } from "@material-ui/core";
import { Container } from "egov-ui-framework/ui-atoms";
import store from "ui-redux/store";
import { prepareFinalObject,toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  LabelContainer,
  TextFieldContainer
} from "egov-ui-framework/ui-containers";
import CloseIcon from "@material-ui/icons/Close";
import "./index.css";
import {
    handleScreenConfigurationFieldChange as handleField
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {DocumentListContainer} from '../'
import { getLoggedinUserRole } from "../../ui-config/screens/specs/utils/index.js";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import { createNoc, getNocSearchResults } from "../../ui-utils/commons"
import { httpRequest } from "../../ui-utils/api";
import commonConfig from "config/common.js";

const fieldConfig = {
    nocType: {
        label: {
          labelName: "NOC Type",
          labelKey: "BPA_NOC_TYPE_LABEL"
        },
        placeholder: {
          labelName: "Select NOC Type",
          labelKey: "BPA_NOC_TYPE_PLACEHOLDER"
        }
      }
  };
  
class NewNocContainer extends Component {
  state = {
    nocType : this.props.nocList ? this.props.nocList[0] : '',
    nocList : this.props.nocList
  }

  prepareDocumentsForPayload = async (wfState) => {
    const {preparedFinalObject} = this.props
    const {nocDocumentsDetailsRedux} = preparedFinalObject
    let appDocumentList = nocDocumentsDetailsRedux
    let documnts = [];
    if (appDocumentList) {
      Object.keys(appDocumentList).forEach(function (key) {
        if (appDocumentList && appDocumentList[key]) {
          documnts.push(appDocumentList[key]);
        }
      });
    }

    // prepareFinalObject("nocDocumentsDetailsRedux", {});
    let requiredDocuments = [], uploadingDocuments = [];
    if (documnts && documnts.length > 0) {
      documnts.forEach(documents => {
        if (documents && documents.documents) {
          documents.documents.map(docs => {
            let doc = {};
            doc.documentType = documents.documentType;
            doc.fileStoreId = docs.fileStoreId;
            doc.fileStore = docs.fileStoreId;
            doc.fileName = docs.fileName;
            doc.fileUrl = docs.fileUrl;
            doc.isClickable = true;
            doc.additionalDetails = {
              uploadedBy: getLoggedinUserRole(wfState),
              uploadedTime: new Date().getTime()
            }
            if (doc.id) {
              doc.id = docs.id;
            }
            uploadingDocuments.push(doc);
          })
        }
      });
      store.dispatch(prepareFinalObject("payloadDocumentFormat",uploadingDocuments));
    }
  }

  getDocumentsFromMDMS = async (nocType) => {
    let {BPA} = this.props.preparedFinalObject
    let {applicationType} = BPA
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: [
          {
            "moduleName": "NOC",
            "masterDetails": [
                {
                    "name": "DocumentTypeMapping",
                    "filter": `$.[?(@.nocType=='${nocType}')]`
                }
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

    // let documents = payload && payload.MdmsRes && payload.MdmsRes.BPA && payload.MdmsRes.BPA.NocTypeMapping || []
  
    let documents = [
                  {
                      "applicationType": "BUILDING_PLAN_SCRUTINY",
                      "nocType": "FIRE_NOC",
                      "docTypes": [
                          {
                              "documentType": "NOC.FIRE",
                              "required": true
                          },
                          {
                            "documentType": "NOC.FIRE",
                            "required": true
                        },
                        {
                          "documentType": "NOC.FIRE",
                          "required": true
                      },
                      {
                        "documentType": "NOC.FIRE",
                        "required": true
                    }
                      ]
                  },
                  {
                      "applicationType": "NEW",
                      "nocType": "FIRE_NOC",
                      "docTypes": [
                          {
                              "documentType": "NOC.FIRE",
                              "required": true
                          }
                      ]
                  },
                  {
                      "applicationType": "RENEW",
                      "nocType": "FIRE_NOC",
                      "docTypes": [
                          {
                              "documentType": "NOC.FIRE",
                              "required": false
                          }
                      ]
                  }
    ]
        
    documents = documents.filter ( doc => {
      if(doc.applicationType == applicationType){
        return doc
      }
    })

    let requiredDocumentsFormat = documents && documents[0].docTypes.map( doc => {
      return {
        ...doc,
        code : doc.documentType,
        active : doc.active || true
      }
    })

    // [{"code":"OWNER.IDENTITYPROOF","documentType":"OWNER","required":true,"active":true,"hasDropdown":true,"dropdownData":[{"code":"OWNER.IDENTITYPROOF.AADHAAR","active":true},{"code":"OWNER.IDENTITYPROOF.VOTERID","active":true},{"code":"OWNER.IDENTITYPROOF.DRIVING","active":true},{"code":"OWNER.IDENTITYPROOF.PAN","active":true},{"code":"OWNER.IDENTITYPROOF.PASSPORT","active":true}],"description":"OWNER.ADDRESSPROOF.IDENTITYPROOF_DESCRIPTION"}]
    // dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
    // call prepare document upload data
    this.prepareDocumentsUploadData(requiredDocumentsFormat)
  }

  createNoc = async (nocType) => {
    let { payloadDocumentFormat } = this.props.preparedFinalObject
    let {BPA} = this.props.preparedFinalObject
    let payload = {
      tenantId : BPA.tenantId,
      nocNo : null,
      applicationType : BPA.applicationType,
      nocType : nocType,
      accountId : BPA.accountId,
      sourceRefId : BPA.applicationNo,
      source: "BPA",
      applicationStatus : BPA.status,
      landId : null,
      status : null,
      documents : payloadDocumentFormat,
      workflow : null,
      auditDetails : BPA.auditDetails,
      additionalDetails : BPA.additionalDetails
    }
      let response = await createNoc(payload);
      if(response){
        store.dispatch(
          toggleSnackbar(
            true,
            {
              labelName: "BPA_NOC_CREATED_SUCCESS_MSG",
              labelKey: "BPA_NOC_CREATED_SUCCESS_MSG",
            },
            "success"
          )
        )

        await getNocSearchResults([
          {
            key: "tenantId",
            value: BPA.tenantId
          },
          { key: "sourceRefId", value: BPA.applicationNo }
        ],"",true);

        store.dispatch(handleField(
          "search-preview",
          "components.div.children.newNoc.props",
          "open",
          false
        ))

      }   
  };

  saveDetails = () => {
    this.prepareDocumentsForPayload("")
    this.createNoc(this.state.nocType)
  }

  prepareDocumentsUploadData = (documents) => {
    documents = documents.filter(item => {
        return item.active;
    });
    let documentsContract = [];
    let tempDoc = {};
    documents.forEach(doc => {
        let card = {};
        card["code"] = doc.documentType;
        card["title"] = doc.documentType;
        card["documentType"] = doc.documentType
        card["cards"] = [];
        tempDoc[doc.documentType] = card;
    });
  
    documents.forEach(doc => {
        // Handle the case for multiple muildings
        let card = {};
        card["name"] = doc.code;
        card["code"] = doc.code;
        card["required"] = doc.required ? true : false;
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
  };

  componentDidMount = () => {
    store.dispatch(prepareFinalObject("documentsContractNOC", []));
  };

  closeDialog = () => {
    store.dispatch(handleField(
        "search-preview",
        "components.div.children.newNoc.props",
        "open",
        false
      ))
  }

  onNocChange = (e) => {
    this.setState({
      nocType:e.target.value
    })
    this.getDocumentsFromMDMS(e.target.value)
  }

  render() {
    let { open } = this.props;
    const dropDownData = [
    {
        value: "Noc Type",
        label: "Noc Type"
    }]

    return (
      <Dialog
      fullScreen={false}
      open={open}
      onClose={this.closeDialog}
      maxWidth={false}
    >
      <DialogContent
        children={
          <Container
            children={
              <Grid
                container="true"
                style={{
                  height:'300px'
                }}
                spacing={12}
                className="action-container">
                <Grid
                  style={{
                    alignItems: "center",
                    display: "flex"
                  }}
                  item
                  sm={10}>
                  <Typography component="h2" variant="subheading">
                    <LabelContainer labelName="NOC Details"
                    labelKey="NOC Details" />
                  </Typography>
                </Grid>
                <Grid
                  item
                  sm={2}
                  style={{
                    textAlign: "right",
                    cursor: "pointer",
                    position: "absolute",
                    right: "16px",
                    top: "16px"
                  }}
                  onClick={this.closeDialog}
                >
                  <CloseIcon />
                </Grid>
                  <Grid
                    item
                    sm={12}
                  >
                  <TextFieldContainer
                        select={true}
                        style={{ marginRight: "15px" }}
                        label={fieldConfig.nocType.label}
                        placeholder={fieldConfig.nocType.placeholder}
                        data={this.props.nocList}
                        optionValue="value"
                        optionLabel="label"
                        hasLocalization={false}
                        value = {this.state.nocType}
                        //onChange={e => this.onEmployeeClick(e)}
                        onChange={this.onNocChange}
                        // jsonPath={'mynocType'}
                      />
                  </Grid>
                  <Grid item sm={12}>
                  <Typography component="h2">
                    <LabelContainer labelName="Required Documents"
                    labelKey="BPA_DOCUMENT_DETAILS_HEADER" />
                  </Typography>
                  </Grid>
                  <Grid item sm={12}>
                      <DocumentListContainer
                        buttonLabel = {{
                          labelName: "UPLOAD FILE",
                          labelKey: "BPA_BUTTON_UPLOAD FILE"
                        }}
                        description = {{
                          labelName: "Only .jpg and .pdf files. 6MB max file size.",
                          labelKey: "BPA_UPLOAD_FILE_RESTRICTIONS"
                        }}
                        inputProps = {{
                          accept: "image/*, .pdf, .png, .jpeg"
                        }}
                        documentTypePrefix = "BPA_"
                        maxFileSize = {5000}>
                      </DocumentListContainer>
                  </Grid>
                <Grid item sm={12}
                 style={{
                  marginTop: 8,
                  textAlign: "right",
                  marginBottom:10
                }}>
                    <Button
                      variant={"contained"}
                      color={"primary"}
                      onClick={this.saveDetails}
                    >
                      <LabelContainer
                        labelName={"BPA_ADD_BUTTON"}
                        labelKey=
                          {"BPA_ADD_BUTTON"}     
                      />
                    </Button>
                </Grid>
              </Grid>
            }
            
          />
        }
      />
    </Dialog>
    ) 
  }
}

const mapStateToProps = (state) => {
  const { form,screenConfiguration } = state;
  const {preparedFinalObject} = screenConfiguration
  const { newNocList } = preparedFinalObject
  return { form,preparedFinalObject, newNocList };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewNocContainer);
