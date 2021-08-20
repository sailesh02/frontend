import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
// import "./index.css";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import {
  getFileUrlFromAPI,
  handleFileUpload,
  getTransformedLocale,
} from "egov-ui-framework/ui-utils/commons";
import Button from '@material-ui/core/Button';
import store from "ui-redux/store";
import {
    handleScreenConfigurationFieldChange as handleField
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
// import MultiDocDetailCard from "../../ui-molecules-local/MultiDocDetailCard";
import NocDocDetailCard from "../../ui-molecules-local/NocDocDetailCard";
import NocData from "../../ui-molecules-local/NocData";
import UploadCard from "../../ui-molecules-local/UploadCard";
import {getLoggedinUserRole} from "../../ui-config/screens/specs/utils/index.js";
import { LabelContainer } from "egov-ui-framework/ui-containers";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { convertEpochToDate } from "../../ui-config/screens/specs/utils";
import { httpRequest } from "../../ui-utils/api";
import { LinkAtom } from "../../ui-atoms-local"
import {TriggerNOCContainer} from "../../ui-containers-local"
import commonConfig from "config/common.js";
import get from "lodash/get";

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
    paddingTop:'18px',paddingRight:'22px',paddingBottom:'18px',paddingLeft:'10px',marginBottom:'10px',width:'100%',backgroundColor: "#FFFFFF"
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
// const LightTooltip = withStyles((theme) => ({
//   tooltip: {
//     fontSize: 12
//   }
// }))(Tooltip);
class RequiredNOCCard extends Component {
//   constructor(props) {
//     super(props);
//     const { nocFinalCardsforPreview, ...rest } = this.props;
//     this.state = {
//       uploadedDocIndex: 0,
//       editableDocuments: null,
//     };
//   }
  state = {
      openPopup : false,
      nocType : ''
  }
  componentDidMount = () => {
 
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
        "search-preview",
        "components.div.children.triggerNocContainer.props",
        "nocType",
        nocType
      ))  
  }

  closeDialog = () => {
    this.setState({
        openPopup : false
    }) 
  }
  render() {
    const {
    requiredNocDisplay,
      ...rest
    } = this.props;
    return (
      <div>
        {requiredNocDisplay &&
          requiredNocDisplay.length > 0 &&
          requiredNocDisplay.map((card) => {
            return (
              <Grid style={{paddingTop:'18px',paddingRight:'22px',paddingBottom:'18px',paddingLeft:'10px',marginBottom:'10px',width:'100%',backgroundColor: "#FFFFFF"}} container>
                <Grid style={{align:'center'}} item xs={11}>
                  <LabelContainer style={{fontWeight:'bold',fontSize:'12px'}}
                    labelKey={getTransformedLocale(card)}/>
                </Grid>
                <Grid style={{align: "right"}} item xs={1}>
                  <Button 
                    onClick = {() => this.triggerNoc(card)}
                    style = {{
                    color: "white",
                    backgroundColor: "rgb(254, 122, 81)",
                    borderRadius: "2px"}}>
                    Trigger
                  </Button>
                </Grid>
              </Grid>
           )
    })
}
</div>
)
  }
}

const mapStateToProps = (state, ownProps) => {
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration

  const scrutinyDetails = get(
    screenConfiguration.preparedFinalObject,
    'scrutinyDetails',
    []
  );

  let requiredNocsList = scrutinyDetails && scrutinyDetails.planDetail && scrutinyDetails.planDetail.planInformation.requiredNOCs || []

  const Noc = get(screenConfiguration.preparedFinalObject, "Noc", []);
  let generatedNoc = Noc.map( noc => {
      return noc.nocType
  })

  let requiredNocDisplay = []
  if(requiredNocsList && requiredNocsList.length > 0){
    requiredNocDisplay = requiredNocsList.filter ( noc => {
          if(!generatedNoc.includes(noc)){
            return noc
          }
      })
    }
    
  const wfState = get(
    screenConfiguration.preparedFinalObject.applicationProcessInstances,
    "state"
  );

  return { Noc,requiredNocDisplay, wfState, preparedFinalObject };
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
  )(RequiredNOCCard)
);

