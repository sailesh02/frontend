import { Dialog, DialogContent } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid, Typography, Button } from "@material-ui/core";
import { Container } from "egov-ui-framework/ui-atoms";
import store from "ui-redux/store";
import { prepareFinalObject,toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  LabelContainer,TextFieldContainer
} from "egov-ui-framework/ui-containers";
import CloseIcon from "@material-ui/icons/Close";
import "./index.css";
import {
    handleScreenConfigurationFieldChange as handleField
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {DocumentListContainer} from '..'
import { getLoggedinUserRole } from "../../ui-config/screens/specs/utils/index.js";
import {
  getTransformedLocale,
} from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from "../../ui-utils/api";
import { createNoc, updateNoc, validateThirdPartyDetails, getNocSearchResults, getAdditionalDetails,prepareNOCUploadDataAfterCreation } from "../../ui-utils/commons"
import get from "lodash/get";
import {fieldConfig} from "../../ui-molecules-local/NocDetailCard"
import { withStyles } from "@material-ui/core/styles";
import commonConfig from "config/common.js";

const styles = {
  documentTitle: {
    color: "rgba(0, 0, 0, 0.87)",
    fontFamily: "Roboto",
    fontSize: "16px",
    fontWeight: 500,
    letterSpacing: "0.67px",
    lineHeight: "19px",
    marginBottom: 25,
    width: "100%",
    backgroundColor: "#FFFFFF",
    marginTop: 16,
    paddingTop: 16,
    paddingLeft: 16,    
    paddingBottom: 10,
  },
  whiteCard: {
    // maxWidth: 250,
    width: "100%",
    backgroundColor: "#FFFFFF",
    // paddingLeft: 8,
    paddingRight: 0,
    paddingTop: 3,
    paddingBottom: 10,
    marginRight: 16,
    marginTop: 8,
    marginBottom:16,
    // marginBottom:4,
    display: "inline-flex",
  },
  fontStyle: {
    fontSize: "12px",
    fontWeight: "500",
    color: "rgba(0, 0, 0, 0.87)",
    fontFamily: "Roboto",
    // width:150,
    // overflow: "hidden", 
    // whiteSpace: "nowrap",
    // textOverflow: "ellipsis",
    // marginLeft:"7px",
  },
  labelStyle: {
    position: "relative",
    fontFamily: "Roboto",
    fontSize: 14,
    letterSpacing: 0.6,
    padding: "5px 0px",
    display: "inline-block"
  },  
  underlineStyle: {
    position: "absolute",
    bottom: -1,
    borderBottom: "2px solid #FE7A51",
    width: "100%"
  },
  dividerStyle : {
    borderBottom: "1px solid rgba(5, 5, 5, 0.12)",
    width: "100%"
  },
  documentContainer: {
   backgroundColor: "#FFFFFF",
    padding: "16px",
    marginTop: "10px",
    marginBottom: "16px"
  },
  nocTitle: {
    color: "rgba(0, 0, 0, 0.87)",
  },
  spanStyle : {
    paddingLeft: "2px"
  }
}

const onNmaFieldChange = (key,jsonPath) => e => {
  store.dispatch(prepareFinalObject(`NewNocAdditionalDetails.thirdPartNOC.${jsonPath}`,e.target.value)) 
};

const getNMANOCForm = (key) => {
  return (
    <React.Fragment>
      <div style={{backgroundColor:"rgb(255,255,255)", paddingRight:"10px", marginTop: "16px" }}>
        <Grid container="true" spacing={12}>
          <Grid item xs={12}>
            <div style={styles.dividerStyle}>
              <div style={ styles.labelStyle}>
                <span>Name of the Nearest Monument or Site</span>
                <div style={styles.underlineStyle} />
              </div>
            </div>
          </Grid>
        </Grid>
        <Grid container="true" spacing={12}>
          <Grid item xs={6}>
            <LabelContainer style={{
              fontSize: '11px',
              fontWeight: 500
              }}
              labelName={fieldConfig.MonumentName.label.labelName}
              labelKey={fieldConfig.MonumentName.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
            <TextFieldContainer
              required={true}
              style={{ marginRight: "15px" }}
              placeholder={fieldConfig.MonumentName.placeholder}
              jsonPath = {`NewNocAdditionalDetails.thirdPartNOC.NameOfTheNearestMonumentOrSite.MonumentName`}
              onChange={onNmaFieldChange(key,"NameOfTheNearestMonumentOrSite.MonumentName")}
            />
            </Grid>
          <Grid item xs={6}>
            <LabelContainer style={{
                fontSize: '11px',
                fontWeight: 500
            }}
            labelName={fieldConfig.State.label.labelName}
            labelKey={fieldConfig.State.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
            <TextFieldContainer
              required= "true"
              style={{ marginRight: "15px" }}
              placeholder={fieldConfig.State.placeholder}
              jsonPath = {`NewNocAdditionalDetails.thirdPartNOC.NameOfTheNearestMonumentOrSite.State`}
              onChange={onNmaFieldChange(key,"NameOfTheNearestMonumentOrSite.State")}
            />
          </Grid>
        </Grid>
        <Grid container="true" spacing={12}>
          <Grid item xs={6}>
            <LabelContainer style={{
            fontSize: '11px',
            fontWeight: 500
             }}
            labelName={fieldConfig.District.label.labelName}
            labelKey={fieldConfig.District.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
            <TextFieldContainer
            style={{ marginRight: "15px" }}
            placeholder={fieldConfig.District.placeholder}
            jsonPath = {`NewNocAdditionalDetails.thirdPartNOC.NameOfTheNearestMonumentOrSite.District`}
            onChange={onNmaFieldChange(key,"NameOfTheNearestMonumentOrSite.District")}
            />
          </Grid>
          <Grid item xs={6}>
            <LabelContainer style={{
              fontSize: '11px',
              fontWeight: 500
            }}
            labelName={fieldConfig.Taluka.label.labelName}
            labelKey={fieldConfig.Taluka.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
            <TextFieldContainer
              style={{ marginRight: "15px" }}
              placeholder={fieldConfig.Taluka.placeholder}
              jsonPath = {`NewNocAdditionalDetails.thirdPartNOC.NameOfTheNearestMonumentOrSite.Taluka`}
              onChange={ onNmaFieldChange(key,"NameOfTheNearestMonumentOrSite.Taluka")}
            />
          </Grid>
        </Grid>
        <Grid container="true" spacing={12}>
          <Grid item xs={6}>
            <LabelContainer style={{
                fontSize: '11px',
                fontWeight: 500
            }}
            labelName={fieldConfig.Locality.label.labelName}
            labelKey={fieldConfig.Locality.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
            <TextFieldContainer
              style={{ marginRight: "15px" }}
              placeholder={fieldConfig.Locality.placeholder}
              jsonPath = {`NewNocAdditionalDetails.thirdPartNOC.NameOfTheNearestMonumentOrSite.Locality`}
              onChange={onNmaFieldChange(key,"NameOfTheNearestMonumentOrSite.Locality")}
            />
          </Grid>
        </Grid>
        <Grid container="true" spacing={12} style={{marginTop: "10px"}} >
          <Grid item xs={12}>
            <div style={styles.dividerStyle}>
              <div style={ styles.labelStyle}>
              <span>Distance Of The Site Of The Construction From Protected Boundary Of Monument</span>
              <div style={styles.underlineStyle} />
              </div>
            </div>
          </Grid>
        </Grid>
        <Grid container="true" spacing={12}>
          <Grid item xs={6}>
            <LabelContainer style={{
                fontSize: '11px',
                fontWeight: 500
            }}
            labelName={fieldConfig.DistanceFromTheMainMonument.label.labelName}
            labelKey={fieldConfig.DistanceFromTheMainMonument.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
            <TextFieldContainer
            style={{ marginRight: "15px" }}
            placeholder={fieldConfig.DistanceFromTheMainMonument.placeholder}
            jsonPath = {`NewNocAdditionalDetails.thirdPartNOC.DistanceOfTheSiteOfTheConstructionFromProtectedBoundaryOfMonument.DistanceFromTheMainMonument`}
            onChange={onNmaFieldChange(key,"DistanceOfTheSiteOfTheConstructionFromProtectedBoundaryOfMonument.DistanceFromTheMainMonument")}
            />
          </Grid>
        <Grid item xs={6}>
          <LabelContainer style={{
            fontSize: '11px',
            fontWeight: 500
          }}
          labelName={fieldConfig.DistanceFromTheProtectedBoundaryWall.label.labelName}
          labelKey={fieldConfig.DistanceFromTheProtectedBoundaryWall.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
          <TextFieldContainer
            style={{ marginRight: "15px" }}
            placeholder={fieldConfig.DistanceFromTheProtectedBoundaryWall.placeholder}
            jsonPath = {`NewNocAdditionalDetails.thirdPartNOC.DistanceOfTheSiteOfTheConstructionFromProtectedBoundaryOfMonument.DistanceFromTheProtectedBoundaryWall`}
            onChange={ onNmaFieldChange(key,"DistanceOfTheSiteOfTheConstructionFromProtectedBoundaryOfMonument.DistanceFromTheProtectedBoundaryWall")}
          />
        </Grid>
        </Grid>
      <Grid container="true" spacing={12} style={{marginTop: "10px"}}>
        <Grid item xs={12}>
          <div style={styles.dividerStyle}>
            <div style={ styles.labelStyle}>
            <span>Date Of Commencement Of Work</span>
            <div style={styles.underlineStyle} />
            </div>
          </div>
        </Grid>
      </Grid>
      <Grid container="true" spacing={12}>
          <Grid item xs={6}>
            <LabelContainer style={{
                fontSize: '11px',
                fontWeight: 500
            }}
            labelName={fieldConfig.ApproximateDateOfCommencementOfWorks.label.labelName}
            labelKey={fieldConfig.ApproximateDateOfCommencementOfWorks.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
            <TextFieldContainer
              type = "date"
              style={{ marginRight: "15px" }}
              placeholder={fieldConfig.ApproximateDateOfCommencementOfWorks.placeholder}
              jsonPath = {`NewNocAdditionalDetails.thirdPartNOC.ApproximateDateOfCommencementOfWorks`}
              onChange={onNmaFieldChange(key,"ApproximateDateOfCommencementOfWorks")}
            />
          </Grid>
          <Grid item xs={6}>
            <LabelContainer style={{
              fontSize: '11px',
              fontWeight: 500
            }}
            labelName={fieldConfig.ApproximateDurationOfCommencementOfWorks.label.labelName}
            labelKey={fieldConfig.ApproximateDurationOfCommencementOfWorks.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
            <TextFieldContainer
              type = "date"
              style={{ marginRight: "15px" }}
              placeholder={fieldConfig.ApproximateDurationOfCommencementOfWorks.placeholder}
              jsonPath = {`NewNocAdditionalDetails.thirdPartNOC.ApproximateDurationOfCommencementOfWorks`}
              onChange={onNmaFieldChange(key,"ApproximateDurationOfCommencementOfWorks")}
            />
          </Grid>
        </Grid>

        <Grid container="true" spacing={12} style={{marginTop: "10px"}}>
          <Grid item xs={12}>
            <div style={styles.dividerStyle}>
              <div style={ styles.labelStyle}>
              <span>Maximum Height Of Existing Modern Building In Close Vicinity Of</span>
              <div style={styles.underlineStyle} />
              </div>
            </div>
          </Grid>
        </Grid>
        <Grid container="true" spacing={12}>
          <Grid item xs={6}>
            <LabelContainer style={{
                fontSize: '11px',
                fontWeight: 500
            }}
            labelName={fieldConfig.NearTheMonument.label.labelName}
            labelKey={fieldConfig.NearTheMonument.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
            <TextFieldContainer
              style={{ marginRight: "15px" }}
              placeholder={fieldConfig.NearTheMonument.placeholder}
              jsonPath = {`NewNocAdditionalDetails.thirdPartNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.NearTheMonument`}
              onChange={onNmaFieldChange(key,"MaximumHeightOfExistingModernBuildingInCloseVicinityOf.NearTheMonument")}
            />
          </Grid>
          <Grid item xs={6}>
            <LabelContainer style={{
              fontSize: '11px',
              fontWeight: 500
            }}
            labelName={fieldConfig.NearTheSiteConstructionRelatedActivity.label.labelName}
            labelKey={fieldConfig.NearTheSiteConstructionRelatedActivity.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
            <TextFieldContainer
              style={{ marginRight: "15px" }}
              placeholder={fieldConfig.NearTheSiteConstructionRelatedActivity.placeholder}
              jsonPath = {`NewNocAdditionalDetails.thirdPartNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.NearTheSiteConstructionRelatedActivity`}
              onChange={onNmaFieldChange(key,"MaximumHeightOfExistingModernBuildingInCloseVicinityOf.NearTheSiteConstructionRelatedActivity")}
            />
          </Grid>
        </Grid>
        <Grid container="true" spacing={12}>
        <Grid item xs={6}>
          <LabelContainer style={{
              fontSize: '11px',
              fontWeight: 500
          }}
          labelName={fieldConfig.WhetherMonumentIsLocatedWithinLimitOf.label.labelName}
          labelKey={fieldConfig.WhetherMonumentIsLocatedWithinLimitOf.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
          <TextFieldContainer
            style={{ marginRight: "15px" }}
            placeholder={fieldConfig.WhetherMonumentIsLocatedWithinLimitOf.placeholder}
            jsonPath = {`NewNocAdditionalDetails.thirdPartNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.WhetherMonumentIsLocatedWithinLimitOf`}
            onChange={onNmaFieldChange(key,"MaximumHeightOfExistingModernBuildingInCloseVicinityOf.WhetherMonumentIsLocatedWithinLimitOf")}
          />
        </Grid>
        <Grid item xs={6}>
          <LabelContainer style={{
            fontSize: '11px',
            fontWeight: 500
          }}
          labelName={fieldConfig.DoesMasterPlanApprovedByConcernedAuthoritiesExistsForTheCityTownVillage.label.labelName}
          labelKey={fieldConfig.DoesMasterPlanApprovedByConcernedAuthoritiesExistsForTheCityTownVillage.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
          <TextFieldContainer
            select ={true}
            data={[{
              "code":'Y',
              "label":"Yes"
            },
            {
              "code":'N',
              "label":"No"
            }]}
            optionValue="code"
            optionLabel="label"
            style={{ marginRight: "15px" }}
            placeholder={fieldConfig.DoesMasterPlanApprovedByConcernedAuthoritiesExistsForTheCityTownVillage.placeholder}
            jsonPath = {`NewNocAdditionalDetails.thirdPartNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.DoesMasterPlanApprovedByConcernedAuthoritiesExistsForTheCityTownVillage`}
            onChange={onNmaFieldChange(key,"MaximumHeightOfExistingModernBuildingInCloseVicinityOf.DoesMasterPlanApprovedByConcernedAuthoritiesExistsForTheCityTownVillage")}
          />
        </Grid>
      </Grid>

      <Grid container="true" spacing={12}>
        <Grid item xs={6}>
          <LabelContainer style={{
              fontSize: '11px',
              fontWeight: 500
            }}
            labelName={fieldConfig.StatusOfModernConstructions.label.labelName}
            labelKey={fieldConfig.StatusOfModernConstructions.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
          <TextFieldContainer
            style={{ marginRight: "15px" }}
            placeholder={fieldConfig.StatusOfModernConstructions.placeholder}
            jsonPath = {`NewNocAdditionalDetails.thirdPartNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.StatusOfModernConstructions`}
            onChange={onNmaFieldChange(key,"MaximumHeightOfExistingModernBuildingInCloseVicinityOf.StatusOfModernConstructions")}
          />
        </Grid>
        <Grid item xs={6}>
          <LabelContainer style={{
            fontSize: '11px',
            fontWeight: 500
          }}
            labelName={fieldConfig.OpenSpaceOrParkOrGreenAreaCloseToProtectedMonumentOrProtectedArea.label.labelName}
            labelKey={fieldConfig.OpenSpaceOrParkOrGreenAreaCloseToProtectedMonumentOrProtectedArea.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
          <TextFieldContainer          
            style={{ marginRight: "15px" }}
            placeholder={fieldConfig.OpenSpaceOrParkOrGreenAreaCloseToProtectedMonumentOrProtectedArea.placeholder}
            jsonPath = {`NewNocAdditionalDetails.thirdPartNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.OpenSpaceOrParkOrGreenAreaCloseToProtectedMonumentOrProtectedArea`}
            onChange={onNmaFieldChange(key,"MaximumHeightOfExistingModernBuildingInCloseVicinityOf.OpenSpaceOrParkOrGreenAreaCloseToProtectedMonumentOrProtectedArea")}
          />
        </Grid>
      </Grid>

      <Grid container="true" spacing={12}>
        <Grid item xs={6}>
            <LabelContainer style={{
                fontSize: '11px',
                fontWeight: 500
            }}
          labelName={fieldConfig.WhetherAnyRoadExistsBetweenTheMonumentAndTheSiteOfConstruction.label.labelName}
          labelKey={fieldConfig.WhetherAnyRoadExistsBetweenTheMonumentAndTheSiteOfConstruction.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
          <TextFieldContainer
            select ={true}
            data={[{
              "code":'Y',
              "label":"Yes"
            },
            {
              "code":'N',
              "label":"No"
            }]}
            optionValue="code"
            optionLabel="label"
            style={{ marginRight: "15px" }}
            placeholder={fieldConfig.WhetherAnyRoadExistsBetweenTheMonumentAndTheSiteOfConstruction.placeholder}
            jsonPath = {`NewNocAdditionalDetails.thirdPartNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.WhetherAnyRoadExistsBetweenTheMonumentAndTheSiteOfConstruction`}
            onChange={onNmaFieldChange(key,"MaximumHeightOfExistingModernBuildingInCloseVicinityOf.WhetherAnyRoadExistsBetweenTheMonumentAndTheSiteOfConstruction")}
          />
        </Grid>
        <Grid item xs={6}>
          <LabelContainer style={{
            fontSize: '11px',
            fontWeight: 500
          }}
          labelName={fieldConfig.Remarks.label.labelName}
          labelKey={fieldConfig.Remarks.label.labelKey} />
          <TextFieldContainer          
            style={{ marginRight: "15px" }}
            placeholder={fieldConfig.Remarks.placeholder}
            jsonPath = {`NewNocAdditionalDetails.thirdPartNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.Remarks`}
            onChange={onNmaFieldChange(key,"MaximumHeightOfExistingModernBuildingInCloseVicinityOf.Remarks")}
          />
        </Grid>
      </Grid>

      <Grid container="true" spacing={12}>
        <Grid item xs={6}>
          <LabelContainer style={{
              fontSize: '11px',
              fontWeight: 500
          }}
          labelName={fieldConfig.TermAndCondition.label.labelName}
          labelKey={fieldConfig.TermAndCondition.label.labelKey}/>
          <TextFieldContainer
            style={{ marginRight: "15px" }}
            placeholder={fieldConfig.TermAndCondition.placeholder}
            jsonPath = {`NewNocAdditionalDetails.thirdPartNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.TermAndCondition`}
            onChange={onNmaFieldChange(key,"MaximumHeightOfExistingModernBuildingInCloseVicinityOf.TermAndCondition")}
          />
        </Grid>
      </Grid>
    </div>
    </React.Fragment>
  );
}

class TriggerNOCContainer extends Component {
  state = {
    comments : '',
    nocType : ''
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
            doc.documentType = documents.documentCode;
            doc.title = documents.documentCode;
            doc.fileStoreId = docs.fileStoreId;
            doc.fileName = docs.fileName;
            doc.fileUrl = docs.fileUrl;
            doc.link = docs.fileUrl;
            doc.name = docs.fileName;
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

  prepareDocumentForRedux = async (documentsList) => {
    const {nocDocumentsDetailsRedux} = this.props.preparedFinalObject 
     let index = 0;
     documentsList.forEach(docType => {
       docType.cards &&
         docType.cards.forEach(card => {
           if (card.subCards) {
             card.subCards.forEach(subCard => {
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
                   documentSubCode: subCard.name
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
             debugger
             if (oldDocType != docType.code || oldDocCode != card.name) {
               nocDocumentsDetailsRedux[index] = {
                 documentType: docType.code,
                 documentCode: card.name,
                 isDocumentRequired: card.required,
                 isDocumentTypeRequired: card.dropDownValues
                   ? card.dropDownValues.required
                   : false
               };
             }
             index++;
           }
         });
     });
     store.dispatch(prepareFinalObject("nocDocumentsDetailsRedux", nocDocumentsDetailsRedux))
 }

  prepareDocumentsUploadData = (documents) => {
    // documents = documents.filter(item => {
    //     return item.active;
    // });
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
    this.prepareDocumentForRedux(documentsContract)

  };

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

    let documents = payload && payload.MdmsRes && payload.MdmsRes.NOC && payload.MdmsRes.NOC.DocumentTypeMapping || []

    let documentList = documents && documents.length > 0 && documents[0].docTypes.map( doc => {
      return {
        code : doc.documentType,
        documentType : doc.documentType,
        required : doc.required,
        active : doc.active || true
      }
    })
    this.prepareDocumentsUploadData(documentList)
  }

  onNocChange = (e) => {
    this.setState({
      nocType:e.target.value
    })
    this.getDocumentsFromMDMS(e.target.value)
  }


  createNoc = async (nocType) => {
    if(nocType && nocType != ""){
      let isValid = true
      let additionalDetails = getAdditionalDetails(nocType,this.props.preparedFinalObject)
      let { payloadDocumentFormat,NewNocAdditionalDetails } = this.props.preparedFinalObject
      if(nocType === "NMA_NOC"){
        if(validateThirdPartyDetails(NewNocAdditionalDetails)){
          isValid = true
        }else{
          isValid = false
        }
      }
      if(isValid){
        let details = {
          ...additionalDetails, ...NewNocAdditionalDetails
        }
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
          additionalDetails : details
        }
        let response = null
         if(this.props.isUpdate){
          const {Noc} = this.props.preparedFinalObject
          let updateNocPayload = Noc && Noc.length > 0 && Noc.filter( noc => {
            if(noc.nocType === nocType){
              return noc
            }
          })
          updateNocPayload[0].documents = payloadDocumentFormat,
          response = await updateNoc(updateNocPayload[0])
         }else{
          response = await createNoc(payload);
         }
          if(response){
            store.dispatch(
              toggleSnackbar(
                true,
                {
                  labelName: this.props.isUpdate ? 'BPA_NOC_UPDATE_SUCCESS_MSG':"BPA_NOC_CREATED_SUCCESS_MSG",
                  labelKey: this.props.isUpdate ? 'BPA_NOC_UPDATE_SUCCESS_MSG': "BPA_NOC_CREATED_SUCCESS_MSG",
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
              "components.div.children.triggerNocContainer.props",
              "open",
              false
            ))
    
            store.dispatch(handleField(
              "apply",
              "components.div.children.triggerNocContainer.props",
              "open",
              false
          ))
    
          }   
          prepareNOCUploadDataAfterCreation()
      }else{
        store.dispatch(
          toggleSnackbar(
            true,
            {
              labelName: "ERR_FILL_ALL_FIELDS",
              labelKey: "ERR_FILL_ALL_FIELDS",
            },
            "warning"
          )
        )
      }
    }else{
      store.dispatch(
        toggleSnackbar(
          true,
          {
            labelName: "BPA_SELECT_NOC_TYPE",
            labelKey: "BPA_SELECT_NOC_TYPE",
          },
          "warning"
        )
      )
    }
  };

  saveDetails = (nocType) => {
    this.prepareDocumentsForPayload("")
    this.createNoc(nocType)  
  }

  resetMessage = () => {
    this.setState({
      comments:""
    })
  }

  componentDidMount = () => {
    store.dispatch(prepareFinalObject("nocDocumentsDetailsRedux", {}));
    store.dispatch(prepareFinalObject("documentsContractNOC", []));
  };

  closeDialog = () => {
    store.dispatch(handleField(
      "search-preview",
      "components.div.children.triggerNocContainer.props",
      "isUpdate",
       false
    ))
    store.dispatch(handleField(
      "apply",
      "components.div.children.triggerNocContainer.props",
      "isUpdate",
       false
    ))
    
    store.dispatch(handleField(
        "search-preview",
        "components.div.children.triggerNocContainer.props",
        "open",
        false
      ))

    store.dispatch(handleField(
        "apply",
        "components.div.children.triggerNocContainer.props",
        "open",
        false
    )) 
    
    store.dispatch(handleField(
      "search-preview",
      "components.div.children.triggerNocContainer.props",
      "isUpdate",
       false
    ))

    this.setState({
      nocType : ""
    })
  }

  render() {
    let { open } = this.props;

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
                  height:'270px'
                }}
                spacing={12}
                marginTop={16}
                className="action-container">
                <Grid
                  style={{
                    alignItems: "center",
                    display: "flex"
                  }}
                  item
                  sm={10}>
                  <Typography component="h2" variant="subheading">
                    <LabelContainer labelName={getTransformedLocale(this.props.nocType)}
                    labelKey={this.props.type == 'new' ? `${getTransformedLocale("BPA_CREATE_NEW_NOC")}` : this.props.isUpdate ? `Update ${getTransformedLocale(this.props.nocType)}` : `Create ${getTransformedLocale(this.props.nocType)}`} />
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
                 {
                   this.props.type == 'new' &&
                   <Grid item xs = {12}>
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

                 }
                  {(this.state.nocType == "NMA_NOC"  || this.props.nocType == "NMA_NOC") && 
                  <Grid item xs = {12} style={{marginTop:'8px'}}>
                    <Typography component="h2">
                      <LabelContainer labelName="Required Documents"
                      labelKey="BPA_ADDITIONAL_DETAILS" />
                    </Typography>
                    {getNMANOCForm(0)}
                    </Grid>
                  }
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
                      onClick={() => this.saveDetails(this.props.nocType || this.state.nocType)}
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
  return { form,preparedFinalObject };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(TriggerNOCContainer)
);