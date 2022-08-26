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
import {DocumentListContainerNOC} from '..'
import { getLoggedinUserRole } from "../../ui-config/screens/specs/utils/index.js";
import {
  getTransformedLocale,
  getQueryArg
} from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from "../../ui-utils/api";
import {fireBuildingTypeDropDownApi,getFiredistrictsDropDownApi,getFireStationsDropDownApi, createNoc, updateNoc, validateThirdPartyDetails, getNocSearchResults, getAdditionalDetails,prepareNOCUploadData, validateFireNocDetails } from "../../ui-utils/commons"
import get from "lodash/get";
import {fieldConfig,numberPattern,stringPattern, fireFileConfig} from "../../ui-molecules-local/NocDetailCardBPA"
import { withStyles } from "@material-ui/core/styles";
import commonConfig from "config/common.js";
import {convertDateToEpoch,prepareNocFinalCards} from "../../ui-config/screens/specs/utils/index"
import { CheckboxContainer } from "..";

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

class TriggerNOCContainer extends Component {
  state = {
    comments : '',
    nocType : '',
    monumentNameErr:false,
    basementProposedErr:false,
    distanceFromMonumentErr:false,
    districtErr :false,
    localityErr:false,
    modernStatusErr:false,
    monumentLocatedErr:false,
    nearTheConstructionErr:false,
    nearTheMonumentErr:false,
    openSpaceParkErr:false,
    protectedBoundryErr:false,
    renovationErr:false,
    stateNameErr:false,
    surveryNoErr:false,
    talukaErr:false,
    identityProofTypeErr:false,
    fireStationsErr:false,
    BuildingtypesErr:false,
    firedistrictsErr:false,
    numberErrMsg:'Please Enter Valid Number upto two Decimal Points',
    stringErrMsg:'Please Enter Valid String'
  }
  nocTypeParams = getQueryArg(window.location.href, "nocType");

  
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

  prepareUpdateDocumentsForPayload = async (wfState) => {
    const {preparedFinalObject} = this.props
    const {nocDocumentsDetailsRedux,Noc} = preparedFinalObject
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

      // create update payload
      uploadingDocuments = uploadingDocuments.map((item) => {
        let payload;
        const doc =
          Noc &&
          Noc.documents.find(
            (document) => document.documentType === item.documentType
          );
        if (doc) {
          payload = {
            id: doc.id,
            documentType: doc.documentType,
            fileStoreId: item.fileStoreId,
            fileName: item.fileName,
            fileUrl: item.fileUrl,
            link: item.link,
            name: item.name,
            isClickable: item.isClickable,
            title: item.title,
            additionalDetails: {
              uploadedBy: item.additionalDetails.uploadedBy,
              uploadedTime: item.additionalDetails.uploadedTime,
            },
          };
          return payload;
        } else {
          return item;
        }
        
      });
      store.dispatch(prepareFinalObject("payloadDocumentFormat",uploadingDocuments));
    }
  }

  onNmaFieldChange = (key,jsonPath,fieldName) => e => {
    switch(fieldName){
      case 'MonumentName':
       // store.dispatch(prepareFinalObject(`NewNocAdditionalDetails.thirdPartyNOC.NameOfTheNearestMonumentOrSite.State`,e.target.value))
       store.dispatch(prepareFinalObject(`NewNocAdditionalDetails.thirdPartyNOC.NameOfTheNearestMonumentOrSite.State`, "Odisha")) 
        break;
      case 'DistanceFromMonument':
        if(e.target.value.match(numberPattern)){
          this.setState({
            distanceFromMonumentErr:false,
          })
        }else{
          this.setState({
            distanceFromMonumentErr:true,
          })
        }
        break; 
        case 'ProtectedBountryWall':
          if(e.target.value.match(numberPattern)){
            this.setState({
              protectedBoundryErr:false,
            })
          }else{
            this.setState({
              protectedBoundryErr:true,
            })
          }
          break; 
        case 'NearTheMonument':
          if(e.target.value.match(numberPattern)){
            this.setState({
              nearTheMonumentErr:false,
            })
          }else{
            this.setState({
              nearTheMonumentErr:true,
            })
          }
          break;
        case 'NearTheSiteConstructionRelatedActivity':
          if(e.target.value.match(numberPattern)){
            this.setState({
              nearTheConstructionErr:false,
            })
          }else{
            this.setState({
              nearTheConstructionErr:true,
            })
          }
          break;                     
      default:
        this.setState({
          monumentNameErr:false,
          basementProposedErr:false,
          distanceFromMonumentErr:false,
          districtErr :false,
          localityErr:false,
          modernStatusErr:false,
          monumentLocatedErr:false,
          nearTheConstructionErr:false,
          nearTheMonumentErr:false,
          openSpaceParkErr:false,
          protectedBoundryErr:false,
          renovationErr:false,
          stateNameErr:false,
          surveryNoErr:false,
          talukaErr:false,
        })  
    }
    store.dispatch(prepareFinalObject(`NewNocAdditionalDetails.thirdPartyNOC.${jsonPath}`,e.target.value)) 
  };

fireBuildingDropDOwn = async()=>{
  await fireBuildingTypeDropDownApi()
}
FiredistrictsDropDown = async()=>{
  await getFiredistrictsDropDownApi()
}

FireStationsDropDown = async()=>{
  await getFireStationsDropDownApi()
}
  onFireFieldChange  = (key,jsonPath,fieldName) => e => {
  switch (fieldName) {
  case "identityProofType":
    store.dispatch(prepareFinalObject(`NewNocAdditionalDetailsFire.thirdPartyNOC.identityProofType`,e.target.value))
    break;
  case "Buildingtypes":
  store.dispatch(prepareFinalObject(`NewNocAdditionalDetailsFire.thirdPartyNOC.Buildingtypes`,e.target.value
  )) 
  break;

  case "firedistricts":
  store.dispatch(prepareFinalObject(`NewNocAdditionalDetailsFire.thirdPartyNOC.firedistricts`,e.target.value
  )) 
  break;

  case "fireStations":
    store.dispatch(prepareFinalObject(`NewNocAdditionalDetailsFire.thirdPartyNOC.fireStations`,e.target.value
    )) 
    break;

  case "identityProofNo":
    store.dispatch(prepareFinalObject(`NewNocAdditionalDetailsFire.thirdPartyNOC.identityProofNo`,e.target.value)) 
    break;
  default:
    this.setState({
      identityProofTypeErr:false,
      fireStationsErr:false,
      BuildingtypesErr:false,
      firedistrictsErr:false
    })
    store.dispatch(prepareFinalObject(`NewNocAdditionalDetailsFire.${jsonPath}`,e.target.value)) 
    break;
}
  }
  getNocFireCForm = (keyFire)=>{
    const setBuildingTypeData = store.getState()
    const dataDropdwonBuilding = setBuildingTypeData.screenConfiguration.preparedFinalObject.FireNOcBuildingtype;
    const dataDropdownFIreDistricts = setBuildingTypeData.screenConfiguration.preparedFinalObject.FireNOcFiredistricts;
    const dataDropdwonfireStations = setBuildingTypeData.screenConfiguration.preparedFinalObject.FireNOcFireStation;
    return (
      <React.Fragment>
          <Grid container="true" spacing={12}>
          <Grid item xs={6}>
          <LabelContainer style={{
              fontSize: '11px',
              fontWeight: 500
            }}
            labelName={fireFileConfig.identityProofType.label.labelName}
            labelKey={fireFileConfig.identityProofType.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span> 
            <TextFieldContainer
              select ={true}
              data={[{
                "id":"1",
                "name":"Voter Id"
              },
              {
                "id":"2",
                "name":"Aadhar Card"
              },
              {
                "id":"3",
                "name":"Driving License"
              },
              {
                "id":"4",
                "name":"Other"
              }]}
              optionValue="name"
              optionLabel="name"
              style={{ marginRight: "15px" }}
              placeholder={fireFileConfig.identityProofType.placeholder}
              jsonPath = {`NewNocAdditionalDetailsFire.thirdPartyNOC.identityProofType`}
              onChange={this.onFireFieldChange(keyFire,"NewNocAdditionalDetailsFire.identityProofType","identityProofType")}
            />{this.state.identityProofTypeErr && <span class="MuiFormLabel-asterisk">{this.state.stringErrMsg}</span>}
           
          </Grid>
          <Grid item xs={6}>
            <LabelContainer style={{
              fontSize: '11px',
              fontWeight: 500
            }}
            labelName={fireFileConfig.Buildingtypes.label.labelName}
            labelKey={fireFileConfig.Buildingtypes.label.labelKey} /><span class="MuiFormLabel-asterisk" >&thinsp;* </span>
            <TextFieldContainer
              select ={true}
              data={dataDropdwonBuilding}
              optionValue="BuildingType"
              optionLabel="BuildingType"
              style={{ marginRight: "15px" , width:"100%"}}
              placeholder={fireFileConfig.Buildingtypes.placeholder}
              jsonPath = {`NewNocAdditionalDetailsFire.thirdPartyNOC.Buildingtypes`}
              onChange={this.onFireFieldChange(keyFire,"NewNocAdditionalDetailsFire.Buildingtypes","Buildingtypes")}
            />{this.state.BuildingtypesErr && <span class="MuiFormLabel-asterisk">{this.state.stringErrMsg}</span>}
          </Grid>
        </Grid>
         <Grid container="true" spacing={12}>
        <Grid item xs={6}>
        <LabelContainer style={{
              fontSize: '11px',
              fontWeight: 500
            }}
            labelName={fireFileConfig.firedistricts.label.labelName}
            labelKey={fireFileConfig.firedistricts.label.labelKey} /><span class="MuiFormLabel-asterisk" style={{marginRight:"30px"}}>&thinsp;*</span>
            <TextFieldContainer
              select ={true}
              data={dataDropdownFIreDistricts}
              optionValue="name"
              optionLabel="name"
              style={{ marginRight: "15px", width:"80%"}}
              placeholder={fireFileConfig.firedistricts.placeholder}
              jsonPath = {`NewNocAdditionalDetailsFire.thirdPartyNOC.firedistricts`}
              onChange={this.onFireFieldChange(keyFire,"NewNocAdditionalDetailsFire.firedistricts","firedistricts")}
            />{this.state.firedistrictsErr && <span class="MuiFormLabel-asterisk">{this.state.stringErrMsg}</span>}
          </Grid>
         
        <Grid item xs={6}>
        <LabelContainer style={{
              fontSize: '11px',
              fontWeight: 500
            }}
            labelName={fireFileConfig.fireStations.label.labelName}
            labelKey={fireFileConfig.fireStations.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
            <TextFieldContainer
              select ={true}
              data={dataDropdwonfireStations}
              optionValue="name"
              optionLabel="name"
              style={{ marginRight: "15px", width:"100%" }}
              placeholder={fireFileConfig.fireStations.placeholder}
              jsonPath = {`NewNocAdditionalDetailsFire.thirdPartyNOC.fireStations`}
              onChange={this.onFireFieldChange(keyFire,"NewNocAdditionalDetailsFire.fireStations","fireStations")}
            />{this.state.firedistrictsErr && <span class="MuiFormLabel-asterisk">{this.state.stringErrMsg}</span>}
          </Grid>
          </Grid> 

       <Grid container="true" spacing={12}>
      <Grid item xs={6}>
              <LabelContainer style={{
                fontSize: '11px',
                fontWeight: 500
                }}
                labelName={fireFileConfig.identityProofNo.label.labelName}
                labelKey={fireFileConfig.identityProofNo.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
              <TextFieldContainer
                required={true}
                style={{ marginRight: "15px" }}
                placeholder={fireFileConfig.identityProofNo.placeholder}
                jsonPath = {`NewNocAdditionalDetailsFire.thirdPartyNOC.identityProofNo`}
                onChange={this.onFireFieldChange(keyFire,"NewNocAdditionalDetailsFire.identityProofNo","identityProofNo")}
              />
              </Grid>

              <Grid item xs={6}>
                
                </Grid>
  
</Grid> 

      </React.Fragment>
    )
  }

  getNMANOCForm = (key) => {
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
                jsonPath = {`NewNocAdditionalDetails.thirdPartyNOC.NameOfTheNearestMonumentOrSite.MonumentName`}
                onChange={this.onNmaFieldChange(key,"NameOfTheNearestMonumentOrSite.MonumentName","MonumentName")}
              />{this.state.monumentNameErr && <span class="MuiFormLabel-asterisk">{this.state.stringErrMsg}</span>}
              </Grid>
            <Grid item xs={6}>
              <LabelContainer style={{
                  fontSize: '11px',
                  fontWeight: 500
              }}
              labelName={fieldConfig.State.label.labelName}
              labelKey={fieldConfig.State.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
              <TextFieldContainer
                disabled={true}
                required= "true"
                value = "Odisha"
                style={{ marginRight: "15px" }}
                placeholder={fieldConfig.State.placeholder}
                jsonPath = {`NewNocAdditionalDetails.thirdPartyNOC.NameOfTheNearestMonumentOrSite.State`}
                onChange={this.onNmaFieldChange(key,"NameOfTheNearestMonumentOrSite.State","State")}
              />{this.state.stateNameErr && <span class="MuiFormLabel-asterisk">{this.state.stringErrMsg}</span>}
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
              jsonPath = {`NewNocAdditionalDetails.thirdPartyNOC.NameOfTheNearestMonumentOrSite.District`}
              onChange={this.onNmaFieldChange(key,"NameOfTheNearestMonumentOrSite.District","District")}
              />{this.state.districtErr && <span class="MuiFormLabel-asterisk">{this.state.stringErrMsg}</span>}
            </Grid>
            <Grid item xs={6}>
              <LabelContainer style={{
                fontSize: '11px',
                fontWeight: 500
              }}
              labelName={fieldConfig.Taluk.label.labelName}
              labelKey={fieldConfig.Taluk.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
              <TextFieldContainer
                style={{ marginRight: "15px" }}
                placeholder={fieldConfig.Taluk.placeholder}
                jsonPath = {`NewNocAdditionalDetails.thirdPartyNOC.NameOfTheNearestMonumentOrSite.Taluk`}
                onChange={ this.onNmaFieldChange(key,"NameOfTheNearestMonumentOrSite.Taluk","Taluk")}
              />{this.state.talukaErr && <span class="MuiFormLabel-asterisk">{this.state.stringErrMsg}</span>}
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
                jsonPath = {`NewNocAdditionalDetails.thirdPartyNOC.NameOfTheNearestMonumentOrSite.Locality`}
                onChange={this.onNmaFieldChange(key,"NameOfTheNearestMonumentOrSite.Locality","Locality")}
              />{this.state.localityErr && <span class="MuiFormLabel-asterisk">{this.state.stringErrMsg}</span>}
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
              jsonPath = {`NewNocAdditionalDetails.thirdPartyNOC.DistanceOfTheSiteOfTheConstructionFromProtectedBoundaryOfMonument.DistanceFromTheMainMonument`}
              onChange={this.onNmaFieldChange(key,"DistanceOfTheSiteOfTheConstructionFromProtectedBoundaryOfMonument.DistanceFromTheMainMonument","DistanceFromMonument")}
              />{this.state.distanceFromMonumentErr && <span class="MuiFormLabel-asterisk">{this.state.numberErrMsg}</span>}
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
              jsonPath = {`NewNocAdditionalDetails.thirdPartyNOC.DistanceOfTheSiteOfTheConstructionFromProtectedBoundaryOfMonument.DistanceFromTheProtectedBoundaryWall`}
              onChange={ this.onNmaFieldChange(key,"DistanceOfTheSiteOfTheConstructionFromProtectedBoundaryOfMonument.DistanceFromTheProtectedBoundaryWall","ProtectedBountryWall")}
            />{this.state.protectedBoundryErr && <span class="MuiFormLabel-asterisk">{this.state.numberErrMsg}</span>}
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
                jsonPath = {`NewNocAdditionalDetails.thirdPartyNOC.ApproximateDateOfCommencementOfWorks`}
                onChange={this.onNmaFieldChange(key,"ApproximateDateOfCommencementOfWorks")}
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
                jsonPath = {`NewNocAdditionalDetails.thirdPartyNOC.ApproximateDurationOfCommencementOfWorks`}
                onChange={this.onNmaFieldChange(key,"ApproximateDurationOfCommencementOfWorks")}
              />
            </Grid>
          </Grid>
  
          <Grid container="true" spacing={12}>
            <Grid item xs={6}>
              <LabelContainer style={{
                  fontSize: '11px',
                  fontWeight: 500
              }}
              labelName={fieldConfig.BasementIfAnyProposedWithDetails.label.labelName}
              labelKey={fieldConfig.BasementIfAnyProposedWithDetails.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
              <TextFieldContainer
                style={{ marginRight: "15px" }}
                placeholder={fieldConfig.BasementIfAnyProposedWithDetails.placeholder}
                jsonPath = {`NewNocAdditionalDetails.thirdPartyNOC.BasementIfAnyProposedWithDetails`}
                onChange={this.onNmaFieldChange(key,"BasementIfAnyProposedWithDetails","BasementProposed")}
              />{this.state.basementProposedErr && <span class="MuiFormLabel-asterisk">{this.state.stringErrMsg}</span>}
            </Grid>
            <Grid item xs={6}>
              <LabelContainer style={{
                fontSize: '11px',
                fontWeight: 500
              }}
              labelName={fieldConfig.DetailsOfRepairAndRenovation.label.labelName}
              labelKey={fieldConfig.DetailsOfRepairAndRenovation.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
              <TextFieldContainer
                style={{ marginRight: "15px" }}
                placeholder={fieldConfig.DetailsOfRepairAndRenovation.placeholder}
                jsonPath = {`NewNocAdditionalDetails.thirdPartyNOC.DetailsOfRepairAndRenovation`}
                onChange={this.onNmaFieldChange(key,"DetailsOfRepairAndRenovation","DetailsOfRepairAndRenovation")}
              />{this.state.renovationErr && <span class="MuiFormLabel-asterisk">{this.state.stringErrMsg}</span>}
            </Grid>
          </Grid>
  
          <Grid container="true" spacing={12}>
            <Grid item xs={6}>
              <LabelContainer style={{
                  fontSize: '11px',
                  fontWeight: 500
              }}
              labelName={fieldConfig.PlotSurveyNo.label.labelName}
              labelKey={fieldConfig.PlotSurveyNo.label.labelKey} /><span class="MuiFormLabel-asterisk">&thinsp;*</span>
              <TextFieldContainer
                style={{ marginRight: "15px" }}
                placeholder={fieldConfig.PlotSurveyNo.placeholder}
                jsonPath = {`NewNocAdditionalDetails.thirdPartyNOC.PlotSurveyNo`}
                onChange={this.onNmaFieldChange(key,"PlotSurveyNo","PlotSurveyNo")}
              />{this.state.surveryNoErr && <span class="MuiFormLabel-asterisk">{this.state.numberErrMsg}</span>}
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
                jsonPath = {`NewNocAdditionalDetails.thirdPartyNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.NearTheMonument`}
                onChange={this.onNmaFieldChange(key,"MaximumHeightOfExistingModernBuildingInCloseVicinityOf.NearTheMonument","NearTheMonument")}
              />{this.state.nearTheMonumentErr && <span class="MuiFormLabel-asterisk">{this.state.numberErrMsg}</span>}
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
                jsonPath = {`NewNocAdditionalDetails.thirdPartyNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.NearTheSiteConstructionRelatedActivity`}
                onChange={this.onNmaFieldChange(key,"MaximumHeightOfExistingModernBuildingInCloseVicinityOf.NearTheSiteConstructionRelatedActivity","NearTheSiteConstructionRelatedActivity")}
              />{this.state.nearTheConstructionErr && <span class="MuiFormLabel-asterisk">{this.state.numberErrMsg}</span>}
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
              select ={true}
              data={[{
                "code":'Municipal Corporation',
                "label":"Municipal Corporation"
              },
              {
                "code":'Municipalities',
                "label":"Municipalities"
              },
              {
                "code":'Nagar Panchayat',
                "label":"Nagar Panchayat"
              },
              {
                "code":'Village Panchayat',
                "label":"Village Panchayat"
              },
              {
                "code":'Other',
                "label":"Other"
              }]}
              optionValue="code"
              optionLabel="label"
              
              style={{ marginRight: "15px" }}
              placeholder={fieldConfig.WhetherMonumentIsLocatedWithinLimitOf.placeholder}
              jsonPath = {`NewNocAdditionalDetails.thirdPartyNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.WhetherMonumentIsLocatedWithinLimitOf`}
              onChange={this.onNmaFieldChange(key,"MaximumHeightOfExistingModernBuildingInCloseVicinityOf.WhetherMonumentIsLocatedWithinLimitOf","WhetherMonumentIsLocatedWithinLimitOf")}
            />{this.state.monumentLocatedErr && <span class="MuiFormLabel-asterisk">{this.state.stringErrMsg}</span>}
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
              jsonPath = {`NewNocAdditionalDetails.thirdPartyNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.DoesMasterPlanApprovedByConcernedAuthoritiesExistsForTheCityTownVillage`}
              onChange={this.onNmaFieldChange(key,"MaximumHeightOfExistingModernBuildingInCloseVicinityOf.DoesMasterPlanApprovedByConcernedAuthoritiesExistsForTheCityTownVillage")}
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
              jsonPath = {`NewNocAdditionalDetails.thirdPartyNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.StatusOfModernConstructions`}
              onChange={this.onNmaFieldChange(key,"MaximumHeightOfExistingModernBuildingInCloseVicinityOf.StatusOfModernConstructions","StatusOfModernConstructions")}
            />{this.state.modernStatusErr && <span class="MuiFormLabel-asterisk">{this.state.stringErrMsg}</span>}
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
              jsonPath = {`NewNocAdditionalDetails.thirdPartyNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.OpenSpaceOrParkOrGreenAreaCloseToProtectedMonumentOrProtectedArea`}
              onChange={this.onNmaFieldChange(key,"MaximumHeightOfExistingModernBuildingInCloseVicinityOf.OpenSpaceOrParkOrGreenAreaCloseToProtectedMonumentOrProtectedArea","OpenSpaceOrPark")}
            />{this.state.openSpaceParkErr && <span class="MuiFormLabel-asterisk">{this.state.stringErrMsg}</span>}
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
              jsonPath = {`NewNocAdditionalDetails.thirdPartyNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.WhetherAnyRoadExistsBetweenTheMonumentAndTheSiteOfConstruction`}
              onChange={this.onNmaFieldChange(key,"MaximumHeightOfExistingModernBuildingInCloseVicinityOf.WhetherAnyRoadExistsBetweenTheMonumentAndTheSiteOfConstruction")}
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
              jsonPath = {`NewNocAdditionalDetails.thirdPartyNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.Remarks`}
              onChange={this.onNmaFieldChange(key,"MaximumHeightOfExistingModernBuildingInCloseVicinityOf.Remarks")}
            />
          </Grid>
        </Grid>
        <Grid container="true" spacing={12}>
          <Grid item xs={6}>
          <CheckboxContainer
            label={fieldConfig.TermAndCondition.label}
            jsonPath = {`NewNocAdditionalDetails.thirdPartyNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.TermAndCondition`}
          />
          </Grid>
        </Grid>
      </div>
      </React.Fragment>
    );
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

  checkRequiredDocument = (uploadedDocument) => {
    let isValid = false
    let requiredDocuments = []
    let uploadedDocumentCodes = []
    let uploadedDocTypes = []
    let requiredDocTypes = []
    let {SelectedNocDocument} = this.props.preparedFinalObject
    requiredDocuments = SelectedNocDocument && SelectedNocDocument.length > 0 && SelectedNocDocument.filter( doc => {
      if(doc.required && !doc.code.endsWith('CERTIFICATE')){
        return doc.code
      }
    }) || []
    
    uploadedDocumentCodes = uploadedDocument && uploadedDocument.length > 0 && uploadedDocument.filter(doc => {
      if(!doc.documentType.endsWith('CERTIFICATE')){
        return doc.documentType
      }
    }) || []

    uploadedDocTypes = uploadedDocumentCodes && uploadedDocumentCodes.length > 0 && uploadedDocumentCodes.map(doc => {
      return doc.documentType
    }) || []

    requiredDocTypes = requiredDocuments && requiredDocuments.length > 0 && requiredDocuments.map(doc => {
      return doc.code
    }) || []

    if(uploadedDocTypes.length == 0 && requiredDocTypes.length == 0){
      isValid = true
    }else if(uploadedDocTypes === requiredDocTypes){
      isValid = true
    }
     else if(uploadedDocTypes.length > 0 && requiredDocTypes.length > 0){
      let isExist =  requiredDocTypes.map(doc => {
        if(uploadedDocTypes.includes(doc)){
          return true
        }else{
          return false
        }
      })
      if(isExist && isExist.length > 0 && isExist.includes(false)){
        isValid = false
      }else{
        isValid = true
      }
    }else{
      isValid = false
    }
  
    return isValid
  }

  getDocumentsFromMDMS = async (nocType) => {
    
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
      let docTypeArray = doc.documentType && doc.documentType.split('.')
      let length = docTypeArray.length
      let docType = length == 2  ? `${doc.documentType}.CERTIFICATE` : doc.documentType
      let required = length == 2 ? false : true
      return {
        code : docType,
        documentType : docType,
        required : required,
        active : doc.active || true
      }
    })

    // let documentList = documents && documents.length > 0 && documents[0].docTypes.map( doc => {
    //   return {
    //     code : doc.documentType,
    //     documentType : doc.documentType,
    //     required : doc.required,
    //     active : doc.active || true
    //   }
    // })

    store.dispatch(prepareFinalObject("SelectedNocDocument",documentList))
    this.prepareDocumentsUploadData(documentList)
  }

  onNocChange = (e) => {
    this.setState({
      nocType:e.target.value
    })
    this.getDocumentsFromMDMS(e.target.value)
  }

  //to convert today's date into epoch
  getSubmittedDataInEpoch = () => {
    var d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();
    let date =  [year, month, day].join('-');
    return convertDateToEpoch(date)
  }

  createNoc = async (nocType) => {
    let submittedOn = this.getSubmittedDataInEpoch()
    if(nocType && nocType != ""){
      let isValid = true
      let isRequiredDocumentsUpload = false
      let additionalDetails = getAdditionalDetails(nocType,this.props.preparedFinalObject)
      let { payloadDocumentFormat,NewNocAdditionalDetails, NewNocAdditionalDetailsFire, FireNOcBuildingtype , FireNOcFiredistricts, FireNOcFireStation, identityProofTypeList} = this.props.preparedFinalObject
      isRequiredDocumentsUpload = this.checkRequiredDocument(payloadDocumentFormat)
      if(!isRequiredDocumentsUpload){
        store.dispatch(
          toggleSnackbar(
            true,
            {
              labelName: "ERR_UPLOAD_ALL_NOC_DOCUMENTS",
              labelKey: "ERR_UPLOAD_ALL_NOC_DOCUMENTS",
            },
            "warning"
          )
        )
        return
      }
      if(nocType == "FIRE_NOC"){
        if(validateFireNocDetails(NewNocAdditionalDetailsFire)){
          isValid = true
        }else{
          isValid = false

        }
      }
      if(nocType === "NMA_NOC"){
        if(validateThirdPartyDetails(NewNocAdditionalDetails)){
          isValid = true
        }else{
          isValid = false
        }
      }
      if(isValid==true && isRequiredDocumentsUpload){
        let details
        if(nocType === "NMA_NOC"){
           details = {
            ...additionalDetails, ...NewNocAdditionalDetails,"SubmittedOn":submittedOn
          }
        }
      
        if(nocType == "FIRE_NOC"){
           details = {
            ...additionalDetails, ...NewNocAdditionalDetailsFire,"SubmittedOn":submittedOn
          }
        }
        let {BPA} = this.props.preparedFinalObject
        let payload = {
          tenantId : BPA.tenantId,
          nocNo : null,
          applicationType : 'NEW',
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
          additionalDetails : details,
        }

        
        if(payload && payload.additionalDetails && payload.additionalDetails.thirdPartyNOC && 
          payload.additionalDetails.thirdPartyNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf && 
          payload.additionalDetails.thirdPartyNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.TermAndCondition){
            payload.additionalDetails.thirdPartyNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.TermAndCondition = 'Yes'
        }else if(payload && payload.additionalDetails && payload.additionalDetails.thirdPartyNOC && 
          payload.additionalDetails.thirdPartyNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf && 
          !payload.additionalDetails.thirdPartyNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.TermAndCondition){
            payload.additionalDetails.thirdPartyNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.TermAndCondition = 'No'
        }
        let buildingTypes = null
        let fireDistricts = null
        let fireStations = null
        let identityProofTypes = null
        let response = null
         if(this.props.isUpdate){
          const {Noc} = this.props.preparedFinalObject
          let updateNocPayload = Noc && Noc.length > 0 && Noc.filter( noc => {
            if(noc.nocType === nocType){
              return noc
            }
          })
          updateNocPayload[0].workflow = this.setNocWorkflowState(updateNocPayload[0])
          updateNocPayload[0].documents = payloadDocumentFormat,
          updateNocPayload[0].additionalDetails.SubmittedOn = submittedOn
          if(nocType == 'NMA_NOC'|| nocType == "FIRE_NOC"){
            updateNocPayload[0].additionalDetails.thirdPartyNOC = updateNocPayload[0].additionalDetails.thirdPartyNOC ? updateNocPayload[0].additionalDetails.thirdPartyNOC : NewNocAdditionalDetails.thirdPartyNOC
          }
          if(nocType == 'NMA_NOC' && updateNocPayload[0] && updateNocPayload[0].additionalDetails && updateNocPayload[0].additionalDetails.thirdPartyNOC && 
          updateNocPayload[0].additionalDetails.thirdPartyNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf && 
          updateNocPayload[0].additionalDetails.thirdPartyNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.TermAndCondition){
            updateNocPayload[0].additionalDetails.thirdPartyNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.TermAndCondition = 'Yes'
          }else if(nocType == 'NMA_NOC' && updateNocPayload[0] && updateNocPayload[0].additionalDetails && updateNocPayload[0].additionalDetails.thirdPartyNOC && 
          updateNocPayload[0].additionalDetails.thirdPartyNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf && 
            !updateNocPayload[0].additionalDetails.thirdPartyNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.TermAndCondition){
              updateNocPayload[0].additionalDetails.thirdPartyNOC.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.TermAndCondition = 'No'
          }

            if(nocType == "FIRE_NOC"){
             buildingTypes = FireNOcBuildingtype&&FireNOcBuildingtype.length>0&&FireNOcBuildingtype.filter(data=>{
              return data.BuildingType ==NewNocAdditionalDetailsFire.thirdPartyNOC.Buildingtypes
            })
            fireDistricts = FireNOcFiredistricts&& FireNOcFiredistricts.length>0&&FireNOcFiredistricts.filter(data=>{
            return data.name === NewNocAdditionalDetailsFire.thirdPartyNOC.firedistricts
              
            })
         
             fireStations = FireNOcFireStation&&FireNOcFireStation.length >0 && FireNOcFireStation.filter(dataa=>{
              return dataa.name == NewNocAdditionalDetailsFire.thirdPartyNOC.fireStations
            })
             identityProofTypes = identityProofTypeList&& identityProofTypeList.length>0 && identityProofTypeList.filter(item=>{
            return item.name === NewNocAdditionalDetailsFire.thirdPartyNOC.identityProofType
            })
            const identityProofNo =  NewNocAdditionalDetailsFire.thirdPartyNOC.identityProofNo
          const buildingType =   buildingTypes[0];
          const fireDistrict =  fireDistricts[0]
          const fireStation=  fireStations[0]
            const identityProofType=  identityProofTypes[0]
            updateNocPayload[0].additionalDetails.thirdPartyNOC = {buildingType,fireDistrict, fireStation, identityProofType, identityProofNo}
          }
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
          await prepareNOCUploadData(store.getState(),'',true)
          prepareNocFinalCards(store.getState());
        }   
          
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

  setNocWorkflowState = (noc) => {
    let currentState = store.getState();
    let bpaStatus
    let {BPA} = currentState.screenConfiguration.preparedFinalObject
    
    if(getQueryArg(window.location.href, "bpaStatus")) {
      bpaStatus = getQueryArg(window.location.href, "bpaStatus");      
    }else {
      bpaStatus = BPA.status
    }
    let bpaStatusArray = [
      "INITIATED",
      "CITIZEN_APPROVAL_INPROCESS",
      "PENDING_APPL_FEE",
      "INPROGRESS",
    ];
  
    if (
      noc.applicationStatus == "CREATED" &&
      !bpaStatusArray.includes(bpaStatus)
    ) {
      let action = {
        action: "INITIATE",
      };
      return action;
    } else {
      return null;
    }
  };

  saveDetails = async (nocType) => {
    const isFromBPA = getQueryArg(window.location.href, "isFromBPA");
    if(isFromBPA){
      let currentState = await store.getState();
      let { ChangedNocAction, Noc, NewNocAdditionalDetailsFire, NewNocAdditionalDetails, FireNOcBuildingtype , FireNOcFiredistricts, FireNOcFireStation, identityProofTypeList} = currentState.screenConfiguration.preparedFinalObject
      let buildingTypes = null;
      let fireDistricts = null;
      let fireStations = null;
      let identityProofTypes = null;
      let response = null;
       if(Noc.nocType == "FIRE_NOC"){
        buildingTypes = FireNOcBuildingtype&&FireNOcBuildingtype.length>0&&FireNOcBuildingtype.filter(data=>{
         return data.BuildingType ==NewNocAdditionalDetailsFire.thirdPartyNOC.Buildingtypes
       })
       fireDistricts = FireNOcFiredistricts&& FireNOcFiredistricts.length>0&&FireNOcFiredistricts.filter(data=>{
       return data.name === NewNocAdditionalDetailsFire.thirdPartyNOC.firedistricts
         
       })
    
        fireStations = FireNOcFireStation&&FireNOcFireStation.length >0 && FireNOcFireStation.filter(data=>{
         return data.name == NewNocAdditionalDetailsFire.thirdPartyNOC.fireStations
       })
        identityProofTypes = identityProofTypeList&& identityProofTypeList.length>0 && identityProofTypeList.filter(item=>{
       return item.name === NewNocAdditionalDetailsFire.thirdPartyNOC.identityProofType
       })
       const identityProofNo =  NewNocAdditionalDetailsFire.thirdPartyNOC.identityProofNo
       const buildingType =   buildingTypes[0];
       const fireDistrict =  fireDistricts[0];
       const fireStation=  fireStations[0];
       const identityProofType=  identityProofTypes[0];
       let thirdPartyNOC = {buildingType,fireDistrict, fireStation, identityProofType, identityProofNo}
    // }
      Noc.additionalDetails.thirdPartyNOC = thirdPartyNOC;
      }else{
        Noc.additionalDetails.thirdPartyNOC = NewNocAdditionalDetails.thirdPartyNOC;
      }
      this.prepareUpdateDocumentsForPayload("")
      let {payloadDocumentFormat} = currentState.screenConfiguration.preparedFinalObject
      Noc.documents = payloadDocumentFormat
     if(ChangedNocAction){
      Noc.workflow = {action: "INITIATE"};
     }
     console.log(Noc, "Nero Noc") 
     response = await updateNoc(Noc);
      if(response){
          store.dispatch(
            toggleSnackbar(
              true,
              {
                labelName: "NOC updated successfully",
                labelKey: "BPA_NOC_UPDATED_SUCCESS_MSG",
              },
              "success"
            )
          )

          store.dispatch(handleField(
            "search-preview",
            "components.div.children.triggerNocContainer.props",
            "open",
            false
          ))
        }

    }else{
      this.prepareDocumentsForPayload("")
      this.createNoc(nocType)
    }
      
  }

  resetMessage = () => {
    this.setState({
      comments:""
    })
  }

  componentDidMount = () => {
    store.dispatch(prepareFinalObject("nocDocumentsDetailsRedux", {}));
    store.dispatch(prepareFinalObject("documentsContractNOC", []));
    this.getDocumentsFromMDMS(this.nocTypeParams)
    if(this.nocTypeParams && this.nocTypeParams === "FIRE_NOC" || this.state.nocType == "FIRE_NOC"){
      this.fireBuildingDropDOwn()
      this.FiredistrictsDropDown()
      this.FireStationsDropDown()
    }
    
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
                  height: this.props.height ? this.props.height : '270px'
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
                  {((this.state.nocType == "NMA_NOC"  || this.props.nocType == 'NMA_NOC')) &&
                  <Grid item xs = {12} style={{marginTop:'8px'}}>
                    <Typography component="h2">
                      <LabelContainer labelName="Required Documents"
                      labelKey="BPA_ADDITIONAL_DETAILS" />
                    </Typography>
                    {this.getNMANOCForm(0)}
                    </Grid>
                  }
                    {((this.state.nocType == "FIRE_NOC"  || this.props.nocType == "FIRE_NOC")) &&
                  <Grid item xs = {12} style={{marginTop:'8px'}}>
                    <Typography component="h2">
                      <LabelContainer labelName="Required Documents"
                      labelKey="BPA_ADDITIONAL_DETAILS" />
                    </Typography>
                    {this.getNocFireCForm(0)}
                    </Grid>
                  }
                  <Grid item sm={12}>
                  <Typography component="h2">
                    <LabelContainer labelName="Required Documents"
                    labelKey="BPA_DOCUMENT_DETAILS_HEADER" />
                  </Typography>
                  </Grid>
                  {((this.state.nocType == "NMA_NOC"  || this.props.nocType == 'NMA_NOC' || this.nocTypeParams == 'NMA_NOC')) &&
                  <Grid item sm={12}>
                      <DocumentListContainerNOC
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
                      </DocumentListContainerNOC>
                  </Grid>
            }
             {((this.state.nocType == "FIRE_NOC"  || this.props.nocType == "FIRE_NOC" || this.nocTypeParams == "FIRE_NOC")) &&
            <Grid item sm={12}>
            <DocumentListContainerNOC
              buttonLabel = {{
                labelName: "UPLOAD FILE",
                labelKey: "BPA_BUTTON_UPLOAD FILE"
              }}
              description = {{
                labelName: "Only .pdf files. 6MB max file size.",
                labelKey: "BPA_UPLOAD_FILE_RESTRICTIONS"
              }}
              inputProps = {{
                accept: ".pdf"
              }}
              documentTypePrefix = "BPA_"
              maxFileSize = {5000}>
            </DocumentListContainerNOC>
        </Grid>
           }
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