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
import { createNoc, getNocSearchResults, getAdditionalDetails,prepareNOCUploadDataAfterCreation } from "../../ui-utils/commons"
import get from "lodash/get";
import {fieldConfig} from "../../ui-molecules-local/NocDetailCard"
import { withStyles } from "@material-ui/core/styles";

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
              labelKey={fieldConfig.MonumentName.label.labelKey} />
            <TextFieldContainer
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
            labelKey={fieldConfig.State.label.labelKey} />
            <TextFieldContainer
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
            labelKey={fieldConfig.District.label.labelKey} />
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
            labelKey={fieldConfig.Taluka.label.labelKey} />
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
            labelKey={fieldConfig.Locality.label.labelKey} />
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
            labelKey={fieldConfig.DistanceFromTheMainMonument.label.labelKey} />
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
          labelKey={fieldConfig.DistanceFromTheProtectedBoundaryWall.label.labelKey} />
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
            labelKey={fieldConfig.ApproximateDateOfCommencementOfWorks.label.labelKey} />
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
            labelKey={fieldConfig.ApproximateDurationOfCommencementOfWorks.label.labelKey} />
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
            labelKey={fieldConfig.NearTheMonument.label.labelKey} />
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
            labelKey={fieldConfig.NearTheSiteConstructionRelatedActivity.label.labelKey} />
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
          labelKey={fieldConfig.WhetherMonumentIsLocatedWithinLimitOf.label.labelKey} />
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
          labelKey={fieldConfig.DoesMasterPlanApprovedByConcernedAuthoritiesExistsForTheCityTownVillage.label.labelKey} />
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
            labelKey={fieldConfig.StatusOfModernConstructions.label.labelKey} />
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
            labelKey={fieldConfig.OpenSpaceOrParkOrGreenAreaCloseToProtectedMonumentOrProtectedArea.label.labelKey} />
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
          labelKey={fieldConfig.WhetherAnyRoadExistsBetweenTheMonumentAndTheSiteOfConstruction.label.labelKey} />
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
          labelKey={fieldConfig.TermAndCondition.label.labelKey} />
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
    comments : ''
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

  createNoc = async (nocType) => {
    let additionalDetails = getAdditionalDetails(nocType,this.props.preparedFinalObject)
    let { payloadDocumentFormat,NewNocAdditionalDetails } = this.props.preparedFinalObject
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
  };

  closeDialog = () => {
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
                    labelKey={`Apply For ${getTransformedLocale(this.props.nocType)}`} />
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
                  <Grid item xs = {12} style={{marginTop:'10px'}}>
                  {this.props.nocType && this.props.nocType == "NMA_NOC" && 
                  <React.Fragment>
                    <Typography component="h2">
                      <LabelContainer labelName="Required Documents"
                      labelKey="BPA_ADDITIONAL_DETAILS" />
                    </Typography>
                    {getNMANOCForm(0)}
                  </React.Fragment>
                  }
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
                  {/* <Button
                    variant={"contained"}
                    color={"primary"}
                    onClick={this.resetMessage}
                    style={{
                      marginRight:'4px'
                    }}
                    >
                    <LabelContainer
                      labelName={"BPA_RESET_BUTTON"}
                      labelKey=
                      {"BPA_RESET_BUTTON"}     
                    />
                    </Button> */}
                    <Button
                      variant={"contained"}
                      color={"primary"}
                      onClick={() => this.saveDetails(this.props.nocType)}
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