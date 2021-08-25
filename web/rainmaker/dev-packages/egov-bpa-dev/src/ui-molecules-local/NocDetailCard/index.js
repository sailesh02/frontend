import React, { Component } from "react";
import { connect } from "react-redux";
import get from "lodash/get";
import { withStyles } from "@material-ui/core/styles";
// import "./index.css";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import commonConfig from "config/common.js";
import {
  getFileUrlFromAPI,
  handleFileUpload,
  getTransformedLocale,
} from "egov-ui-framework/ui-utils/commons";
import Button from '@material-ui/core/Button';
import {
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
// import MultiDocDetailCard from "../../ui-molecules-local/MultiDocDetailCard";
import NocDocDetailCard from "../../ui-molecules-local/NocDocDetailCard";
import NocData from "../../ui-molecules-local/NocData";
import UploadCard from "../../ui-molecules-local/UploadCard";
import {getLoggedinUserRole} from "../../ui-config/screens/specs/utils/index.js";
import { LabelContainer,TextFieldContainer } from "egov-ui-framework/ui-containers";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { convertEpochToDate } from "../../ui-config/screens/specs/utils";
import { httpRequest } from "../../ui-utils/api";
import { LinkAtom } from "../../ui-atoms-local"
import store from "ui-redux/store";
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
// const LightTooltip = withStyles((theme) => ({
//   tooltip: {
//     fontSize: 12
//   }
// }))(Tooltip);
class NocDetailCard extends Component {
  constructor(props) {
    super(props);
    const { requiredNocToTrigger, ...rest } = this.props;
    this.state = {
      uploadedDocIndex: 0,
      editableDocuments: null,
      nocType : ''
    };
  }
  componentDidMount = () => {
    const {
      documentsList, 
      nocDocumentDetailsUploadRedux = {}, 
      prepareFinalObject
    } = this.props;
    let index = 0;
    documentsList.forEach(docType => {
      docType.cards &&
      docType.cards.forEach(card => {
        if (card.subCards) {
          card.subCards.forEach(subCard => {
            let oldDocType = get(
              nocDocumentDetailsUploadRedux,
              `[${index}].documentType`
            );
            let oldDocCode = get(
              nocDocumentDetailsUploadRedux,
              `[${index}].documentCode`
            );
            let oldDocSubCode = get(
              nocDocumentDetailsUploadRedux,
              `[${index}].documentSubCode`
            );
            if (
              oldDocType != docType.code ||
              oldDocCode != card.name ||
              oldDocSubCode != subCard.name
            ) {
              nocDocumentDetailsUploadRedux[index] = {
                documentType: docType.code,
                documentCode: card.name,
                documentSubCode: subCard.name
              };
            }
            index++;
          });
        } else {
          let oldDocType = get(
            nocDocumentDetailsUploadRedux,
            `[${index}].documentType`
          );
          let oldDocCode = get(
            nocDocumentDetailsUploadRedux,
            `[${index}].documentCode`
          );
          if (oldDocType != docType.code || oldDocCode != card.name) {
            nocDocumentDetailsUploadRedux[index] = {
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
    prepareFinalObject("nocDocumentDetailsUploadRedux", nocDocumentDetailsUploadRedux);
  };
  static getDerivedStateFromProps(props, state) {
    if (
      (state.editableDocuments == null &&
      props.requiredNocToTrigger &&
      props.requiredNocToTrigger.length > 0)||
      (state.editableDocuments !=null && state.editableDocuments.length >0 && props.requiredNocToTrigger.length>0 && 
        (state.editableDocuments.length != props.requiredNocToTrigger.length))
    ) {
      state.editableDocuments = Array(props.requiredNocToTrigger.length).fill({
        editable: false,
      });
    }
  }

  getCard = (card, key) => {
    const { classes, requiredNocToTrigger, ...rest } = this.props;
    if (this.state.editableDocuments)
      return (
        <React.Fragment>
          {this.state.editableDocuments &&
            this.state.editableDocuments.length > 0 &&
            (this.state.editableDocuments[key].editable ? (
              <div style={{backgroundColor:"rgb(255,255,255)", paddingRight:"10px", marginTop: "16px" }}><UploadCard
                docItem={card}
                docIndex={key}
                key={key.toString()}
                handleDocument={this.handleDocument}
                removeDocument={this.removeDocument}
                onUploadClick={this.onUploadClick}
                handleFileUpload={this.handleFileUpload}
                handleChange={this.handleChange}
                uploadedDocIndex={this.state.uploadedDocIndex}
                toggleEditClick={this.toggleEditClick}
                isFromPreview={true}
                jsonPath = {`nocDocumentDetailsUploadRedux`}
                ids = {"nocDocumentDetailsUploadRedux"}
                specificStyles= "preview_upload_btn"
                {...rest}
              /></div>
            ) : (
              <NocDocDetailCard
                docItem={card}
                docIndex={key}
                key={key.toString()}
                handleDocument={this.handleDocument}
                removeDocument={this.removeDocument}
                onUploadClick={this.onUploadClick}
                handleFileUpload={this.handleFileUpload}
                handleChange={this.handleChange}
                uploadedDocIndex={this.state.uploadedDocIndex}
                toggleEditClick={this.toggleEditClick}
                {...rest}
              />
            ))}
        </React.Fragment>
      );
  };

  onNocChange = (e,key) => {
    this.setState({
      nocType:e.target.value
    })
    store.dispatch(prepareFinalObject(`Noc[${key}].additionalDetails.thirdPartNocDetails.jkdjk`,e.target.value)
    )
  }

  onNocChange = key => e => {
    this.setState({
      nocType:e.target.value
    })
    store.dispatch(prepareFinalObject(`Noc[${key}].additionalDetails.nocType`,e.target.value))
  };

  getNMANOCForm = (key) => {
    return (
      <React.Fragment>
        <div style={{backgroundColor:"rgb(255,255,255)", paddingRight:"10px", marginTop: "16px" }}>
        <Grid container="true" spacing={12}>
        <Grid item xs={12}>
        <div style={styles.dividerStyle}>
          <div style={ styles.labelStyle}>
          <span>Additional Details</span>
          <div style={styles.underlineStyle} />
          </div>
        </div>
        </Grid>
        <Grid item xs={6}>
        <LabelContainer style={{
            fontSize: '11px',
            fontWeight: 500
        }}
        labelName={"BPA_NOC_TYPE_LABEL"}
        labelKey={"BPA_NOC_TYPE_LABEL"} />
          <TextFieldContainer
            style={{ marginRight: "15px" }}
            placeholder={fieldConfig.nocType.placeholder}
            value = {this.state.nocType}
            onChange={this.onNocChange(key)}
          />
          </Grid>
          <Grid item xs={6}>
        <LabelContainer style={{
            fontSize: '11px',
            fontWeight: 500
        }}
        labelName={"BPA_NOC_TYPE_LABEL"}
        labelKey={"BPA_NOC_TYPE_LABEL"} />
          <TextFieldContainer
            style={{ marginRight: "15px" }}
            placeholder={fieldConfig.nocType.placeholder}
            value = {this.state.nocType}
            onChange={this.onNocChange(key)}
          />
          </Grid>
        </Grid>
        <Grid container="true" spacing={12}>
        <Grid item xs={6}>
        <LabelContainer style={{
            fontSize: '11px',
            fontWeight: 500
        }}
        labelName={"BPA_NOC_TYPE_LABEL"}
        labelKey={"BPA_NOC_TYPE_LABEL"} />
          <TextFieldContainer
            style={{ marginRight: "15px" }}
            placeholder={fieldConfig.nocType.placeholder}
            value = {this.state.nocType}
            onChange={this.onNocChange(key)}
          />
          </Grid>
          <Grid item xs={6}>
        <LabelContainer style={{
            fontSize: '11px',
            fontWeight: 500
        }}
        labelName={"BPA_NOC_TYPE_LABEL"}
        labelKey={"BPA_NOC_TYPE_LABEL"} />
          <TextFieldContainer
            style={{ marginRight: "15px" }}
            placeholder={fieldConfig.nocType.placeholder}
            value = {this.state.nocType}
            onChange={this.onNocChange(key)}
          />
          </Grid>
        </Grid>
        <Grid container="true" spacing={12}>
        <Grid item xs={6}>
        <LabelContainer style={{
            fontSize: '11px',
            fontWeight: 500
        }}
        labelName={"BPA_NOC_TYPE_LABEL"}
        labelKey={"BPA_NOC_TYPE_LABEL"} />
          <TextFieldContainer
            style={{ marginRight: "15px" }}
            placeholder={fieldConfig.nocType.placeholder}
            value = {this.state.nocType}
            onChange={this.onNocChange(key)}
          />
          </Grid>
          <Grid item xs={6}>
        <LabelContainer style={{
            fontSize: '11px',
            fontWeight: 500
        }}
        labelName={"BPA_NOC_TYPE_LABEL"}
        labelKey={"BPA_NOC_TYPE_LABEL"} />
          <TextFieldContainer
            style={{ marginRight: "15px" }}
            placeholder={fieldConfig.nocType.placeholder}
            value = {this.state.nocType}
            onChange={this.onNocChange(key)}
          />
          </Grid>
        </Grid>
        </div>
      </React.Fragment>
    );
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

    let documents = payload && payload.MdmsRes && payload.MdmsRes.BPA && payload.MdmsRes.BPA.DocumentTypeMapping || []
  
    let requiredDocumentsFormat = documents && documents.length > 0 && documents[0].docTypes.map( doc => {
      return {
        code : doc.documentType,
        documentType : doc.documentType,
        required : doc.required,
        active : doc.active || true
      }
    })
    this.prepareDocumentsUploadData(requiredDocumentsFormat)
  }
  prepareDocumentsUploadData = (documents) => {
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

  triggerNoc = (nocType) => {
    this.getDocumentsFromMDMS(nocType)
    store.dispatch(handleField(
        "search-preview",
        "components.div.children.triggerNocContainer.props",
        "open",
        true
      ))
    store.dispatch(handleField(
        "apply",
        "components.div.children.triggerNocContainer.props",
        "open",
        true
    ))  
      store.dispatch(handleField(
        "search-preview",
        "components.div.children.triggerNocContainer.props",
        "nocType",
        nocType
      )) 
      
      store.dispatch(handleField(
        "apply",
        "components.div.children.triggerNocContainer.props",
        "nocType",
        nocType
      ))
  }

  render() {
    const {
      requiredNocToTrigger,
      documentData,
      Noc,
      ...rest
    } = this.props;
    return (
      <div>
        {requiredNocToTrigger &&
          requiredNocToTrigger.length > 0 &&
          requiredNocToTrigger.map((card, index) => {
            return (
              card.name ? (<div style={styles.documentTitle}>
                <div>
                  <Grid container>
                    <Grid item xs={3}>
                      <LabelContainer
                      labelKey={getTransformedLocale(card.nocType)}
                      style={styles.nocTitle}
                      />
                      {card.required && process.env.REACT_APP_NAME !== "Citizen" ? <span style = {styles.spanStyle}>*</span> : ""}
                    </Grid>
                    <Grid item xs={3}>
                      <LinkAtom 
                      linkDetail = {card.additionalDetails.linkDetails} 
                      />
                    </Grid>
                    {card.additionalDetails.nocNo ? (
                    <Grid item xs={3}>
                      <Typography
                      variant="subtitle1"
                      style={{ fontWeight: "bold", fontSize: "12px" }}
                      >
                      Approval Number
                      </Typography>
                    {card.additionalDetails.nocNo ?
                  <div style={styles.fontStyle}>
                    {card.additionalDetails.nocNo}
                  </div>: "NA" }
                  </Grid> ) : ( "" )}
                </Grid>
                <NocData
                  docItem={card}
                  docIndex={index}
                  key={index.toString()}
                  {...rest}
                />
                </div>
            <div>{this.getCard(card, index)}</div>  
            <div>{this.getNMANOCForm(index)}</div>
          </div>) : (
             <Grid style={{paddingTop:'18px',paddingRight:'22px',paddingBottom:'18px',paddingLeft:'10px',marginBottom:'10px',width:'100%',backgroundColor: "#FFFFFF"}} container>
                <Grid style={{align:'center'}} item xs={11}>
                  <LabelContainer style={{fontWeight:'bold',fontSize:'12px'}}
                    labelKey={getTransformedLocale(card.nocType)}/>
                </Grid>
             <Grid style={{align: "right"}} item xs={1}>
               <Button 
                 onClick = {() => this.triggerNoc(card.nocType)}
                 style = {{
                 color: "white",
                 backgroundColor: "rgb(254, 122, 81)",
                 borderRadius: "2px"}}>
                 Trigger
               </Button>
             </Grid>
           </Grid>
          )
              
            )
          })
        }
      </div>
    )
  }

  onUploadClick = (uploadedDocIndex) => {
    this.setState({ uploadedDocIndex });
  };
  toggleEditClick = (itemIndex) => {
    let items = [...this.state.editableDocuments];
    let item = { ...items[itemIndex] };
    item.editable = item.editable ? false : true;
    items[itemIndex] = item;
    this.setState({ editableDocuments: items });
  };
  
  handleDocument = async (file, fileStoreId) => {
    let { uploadedDocIndex } = this.state;
    const {
      prepareFinalObject,
      nocDocumentDetailsUploadRedux,
      requiredNocToTrigger,
      Noc,
      wfState
    } = this.props;
    const fileUrl = await getFileUrlFromAPI(fileStoreId);
    let documentCode = requiredNocToTrigger[uploadedDocIndex].dropDownValues.value;
    if(!documentCode){
      let documentMenu = requiredNocToTrigger[uploadedDocIndex].dropDownValues.menu;
      if(documentMenu && documentMenu.length > 0 && documentMenu.length == 1){
        documentCode = documentMenu[0].code;
      } else {
        documentCode = requiredNocToTrigger[uploadedDocIndex].documentCode
      }
    }
    let appDocumentList = [];

    let fileObj = {
      fileName: file.name,
      name: file.name,
      fileStoreId,
      fileUrl: Object.values(fileUrl)[0],
      isClickable: true,
      link: Object.values(fileUrl)[0],
      title: documentCode,
      documentType: documentCode,
      additionalDetails:{
        uploadedBy: getLoggedinUserRole(wfState),
        uploadedTime: new Date().getTime()
      }
      
    };
    if (
      requiredNocToTrigger[uploadedDocIndex] &&
      requiredNocToTrigger[uploadedDocIndex].documents
    ) {
      requiredNocToTrigger[uploadedDocIndex].documents.push(fileObj);
      appDocumentList = [...requiredNocToTrigger];
    } else {
      requiredNocToTrigger[uploadedDocIndex]["documents"] = [fileObj];
      appDocumentList = [...requiredNocToTrigger];
    }
    // if (Array.isArray(NOCData)) {
    //   if (NOCData.length > 0) {
    //     if (NOCData[0].documents) {
    //       NOCData[0].documents.push(fileObj);
    //     } else {
    //       NOCData[0].documents = [fileObj];
    //     }
    //   }
    // } else {
    //   if (NOCData.documents) {
    //     NOCData.documents.push(fileObj);
    //   } else {
    //     NOCData.documents = [fileObj];
    //   }
    // }
    // prepareFinalObject("NOCData", NOCData);

    prepareFinalObject("requiredNocToTrigger", appDocumentList);

    prepareFinalObject("nocDocumentDetailsUploadRedux", appDocumentList);
    // if(appDocumentList && appDocumentList.length > 0) {
    //   for(let data = 0; data < Noc.length; data ++) {
    //     Noc[data].documents = appDocumentList[data].documents
    //     let response = httpRequest(
    //       "post",
    //       "/noc-services/v1/noc/_update",
    //       "",
    //       [],
    //       { Noc: Noc[data] }
    //     );
    //   }
      
    // }
    // prepareFinalObject("Noc", Noc);
  };
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
  removeDocument = (cardIndex, uploadedDocIndex) => {
    const { prepareFinalObject, requiredNocToTrigger, Noc } = this.props;
    let uploadedDocs = [];
    let fileTobeRemoved =
    requiredNocToTrigger[cardIndex].documents[uploadedDocIndex];

    // if (Array.isArray(Noc)) {
    //   if (Noc.length > 0) {
    //     uploadedDocs = Noc[0].documents;
    //     uploadedDocs = this.getFinalDocsAfterRemovingDocument(uploadedDocs, fileTobeRemoved);
    //     Noc[0].documents = uploadedDocs;
    //   }
    // } else {
    //   uploadedDocs = Noc.documents;
    //   uploadedDocs = this.getFinalDocsAfterRemovingDocument(
    //     uploadedDocs,
    //     fileTobeRemoved
    //   );
    //   Noc.documents = uploadedDocs;
    // }

    requiredNocToTrigger[cardIndex].documents.splice(uploadedDocIndex, 1);
    prepareFinalObject("Noc", Noc);
    //uploadedDocs.map()
    prepareFinalObject("requiredNocToTrigger", requiredNocToTrigger);
    prepareFinalObject("nocDocumentDetailsUploadRedux", requiredNocToTrigger);

    this.forceUpdate();
  };

  getFinalDocsAfterRemovingDocument = (docs, file) => {
    for (var i = 0; i < docs.length; i++) {
      if (docs[i].fileStoreId == file.fileStoreId) {
        docs.splice(i, 1);
        break;
      }
    }

    return docs;
  };

  handleChange = (key, event) => {
    const { prepareFinalObject, requiredNocToTrigger } = this.props;
    let appDocumentList = [];

    appDocumentList = [...requiredNocToTrigger];
    appDocumentList[key].dropDownValues.value = event.target.value;
    prepareFinalObject("requiredNocToTrigger", appDocumentList);
    prepareFinalObject("nocDocumentDetailsUploadRedux", appDocumentList);
  };
}

const mapStateToProps = (state, ownProps) => {
  const { screenConfiguration } = state;
  const {preparedFinalObject} = screenConfiguration
  const nocDocumentDetailsUploadRedux = get(
    screenConfiguration.preparedFinalObject,
    "nocDocumentDetailsUploadRedux",
    {}
  );
  const documentsList = get(
    screenConfiguration.preparedFinalObject,
    "nocBPADocumentsContract",
    []
  );
  const nocFinalCardsforPreview = get(
    screenConfiguration.preparedFinalObject,
    ownProps.jsonPath,
    []
  );
  const Noc = get(screenConfiguration.preparedFinalObject, "Noc", []);
  const wfState = get(
    screenConfiguration.preparedFinalObject.applicationProcessInstances,
    "state"
  );

  const requiredNocToTrigger = get(
    screenConfiguration.preparedFinalObject,
   "requiredNocToTrigger",
    []
  );
  

  return { nocDocumentDetailsUploadRedux,preparedFinalObject, documentsList, nocFinalCardsforPreview, Noc,requiredNocToTrigger, wfState };
};
const mapDispatchToProps = (dispatch) => {
  return {
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value)),
  };
};
export default withStyles(styles)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(NocDetailCard)
);

