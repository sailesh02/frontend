import React, { Component } from "react";
import { connect } from "react-redux";
import get from "lodash/get";
import { withStyles } from "@material-ui/core/styles";
// import "./index.css";
import { prepareFinalObject,toggleSnackbar} from "egov-ui-framework/ui-redux/screen-configuration/actions";
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
import NocDocDetailCardBPA from "../../ui-molecules-local/NocDocDetailCardBPA";
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
import { CheckboxContainer } from "../../ui-containers-local";

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
  fontStyle: {
    fontSize: "12px",
    fontWeight: "500",
    color: "rgba(0, 0, 0, 0.87)",
    fontFamily: "Roboto",
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
  nocTitle: {
    color: "rgba(0, 0, 0, 0.87)",
  },
  spanStyle : {
    paddingLeft: "2px"
  }
}

export const numberPattern = /^([0-9][0-9]{0,49})(\.\d{1,2})?$/
export const stringPattern = /^[^{0-9}^\$\"<>?\\\\~!@#$%^()+={}\[\]*,/_:;“”‘’]{1,50}$/i

export const fireFileConfig = {
  identityProofType: {
    label: {
      labelName: "Identity Proof",
      labelKey: "BPA_IDENTITY_PROOF_TYPE"
    },
    placeholder: {
      labelName: "Enter Identity Proof Placeholder",
      labelKey: "BPA_IDENTITY_PROOF_TYPE_PLACEHOLDER"
    }
  },
  Buildingtypes: {
    label: {
      labelName:"Building Type",
      labelKey:"BPA_BUILDING_TYPE"
    },
    placeholder: {
      labelName: "Enter Building Type Placeholder",
      labelKey: "BPA_BUILDING_TYPE_PLACEHOLDER"
    }
  },


fireStations: {
    label: {
      labelName:"Fire Stations",
      labelKey:"BPA_FIRESTATIONS"
    },
    placeholder: {
      labelName: "Enter Fire Stations Placeholder",
      labelKey: "BPA_FIRESTATIONS_PLACEHOLDER"
    }
  },

  firedistricts:{
    label: {
      labelName:"Fire districts",
      labelKey:"BPA_FIREDISTRICTS"
    },
    placeholder: {
      labelName: "Enter Fire districts Placeholder",
      labelKey: "BPA_FIREDISTRICTS_PLACEHOLDER"
    }
  },

  identityProofNo: {
    label: {
      labelName: "Identity Proof No",
      labelKey: "BPA_NOC_FIRE_IDENTITYPROOfNO_LABEL"
    },
    placeholder: {
      labelName: "Enter Identity Proof No",
      labelKey: "BPA_NOC_FIRE_IDENTITYPROOfNO_LABEL_PLACEHOLDER"
    }
  }

}

export const fieldConfig = {
  nocType: {
    label: {
      labelName: "NOC Type",
      labelKey: "BPA_NOC_TYPE_LABEL"
    },
    placeholder: {
      labelName: "Select NOC Type",
      labelKey: "BPA_NOC_TYPE_PLACEHOLDER"
    }
  },
  MonumentName: {
      label: {
        labelName: "Monument Name",
        labelKey: "BPA_NMA_NOC_MONUMENT_NAME_LABEL"
      },
      placeholder: {
        labelName: "Enter Monument Name",
        labelKey: "BPA_NMA_NOC_MONUMENT_NAME_PLACEHOLDER"
      }
    },
    State: {
      label: {
        labelName: "State",
        labelKey: "BPA_NMA_NOC_STATE_LABEL"
      },
      placeholder: {
        labelName: "Enter State",
        labelKey: "BPA_NMA_NOC_STATE_PLACEHOLDER"
      }
  },
  District: {
    label: {
      labelName: "District",
      labelKey: "BPA_NMA_NOC_DISTRICT_LABEL"
    },
    placeholder: {
      labelName: "Enter District Name",
      labelKey: "BPA_NMA_NOC_DISTRICT_PLACEHOLDER"
    }
  },
  Taluk: {
    label: {
      labelName: "Taluk",
      labelKey: "BPA_NMA_NOC_TALUKA_LABEL"
    },
    placeholder: {
      labelName: "Enter Taluk Name",
      labelKey: "BPA_NMA_NOC_TALUKA_PLACEHOLDER"
    }
  },
  Locality: {
    label: {
      labelName: "Locality",
      labelKey: "BPA_NEW_TRADE_DETAILS_MOHALLA_LABEL"
    },
    placeholder: {
      labelName: "Enter Locality",
      labelKey: "BPA_NEW_TRADE_DETAILS_MOHALLA_PLACEHOLDER"
    }
  },
  DistanceFromTheMainMonument: {
    label: {
      labelName: "Distance From Main Monument",
      labelKey: "BPA_NMA_NOC_DISTANCE_FROM_MONUMENT_LABEL"
    },
    placeholder: {
      labelName: "Enter Distance From Main Monument",
      labelKey: "BPA_NMA_NOC_DISTANCE_FROM_MONUMENT_PLACEHOLDER"
    }
  },
  DistanceFromTheProtectedBoundaryWall: {
    label: {
      labelName: "Distance From Protected Boundary Wall",
      labelKey: "BPA_NMA_NOC_DISTANCE_PROTECTED_WALL_LABEL"
    },
    placeholder: {
      labelName: "Enter Distance From Protected Boundary Wall",
      labelKey: "BPA_NMA_NOC_DISTANCE_PROTECTED_WAL_PLACEHOLDER"
    }
  },
  ApproximateDateOfCommencementOfWorks: {
    label: {
      labelName: "Date of Commencement of Work",
      labelKey: "BPA_NMA_NOC_COMMENCEMENT_DATE_LABEL"
    },
    placeholder: {
      labelName: "Select Date of Commencement of Work",
      labelKey: "BPA_NMA_NOC_COMMENCEMENT_DATE_PLACEHOLDER"
    }
  },
  ApproximateDurationOfCommencementOfWorks: {
    label: {
      labelName: "Duration of Commencement of Work",
      labelKey: "BPA_NMA_NOC_COMMENCEMENT_DURATION_LABEL"
    },
    placeholder: {
      labelName: "Enter Monument Name",
      labelKey: "BPA_NMA_NOC_COMMENCEMENT_DURATION_PLACEHOLDER"
    }
  },
  BasementIfAnyProposedWithDetails: {
    label: {
      labelName: "Basement IfAny Proposed With Details",
      labelKey: "BPA_NMA_NOC_BASEMENT_IF_PROPOSED_ANY_LABEL"
    },
    placeholder: {
      labelName: "Basement IfAny Proposed With Details",
      labelKey: "BPA_NMA_NOC_BASEMENT_IF_PROPOSED_ANY_PLACEHOLDER"
    }
  },
  DetailsOfRepairAndRenovation: {
    label: {
      labelName: "Details Of Repair And Renovation",
      labelKey: "BPA_REPAIR_RENOVATION_DETAILS_LABEL"
    },
    placeholder: {
      labelName: "Details Of Repair And Renovation",
      labelKey: "BPA_REPAIR_RENOVATION_DETAILS_PLACEHOLDER"
    }
  },
  PlotSurveyNo : {
    label: {
      labelName: "Plot Survey No",
      labelKey: "BPA_PLOT_SURVEY_NUMBER_LABEL"
    },
    placeholder: {
      labelName: "Plot Survey No",
      labelKey: "BPA_PLOT_SURVEY_NUMBER_PLACEHOLDER"
    }
  },
  NearTheMonument: {
    label: {
      labelName: "Near the Monument",
      labelKey: "BPA_NMA_NOC_NEAR_MONUMENT_LABEL"
    },
    placeholder: {
      labelName: "Near Monument",
      labelKey: "BPA_NMA_NOC_NEAR_MONUMENT_PLACEHOLDER"
    }
  },
  NearTheSiteConstructionRelatedActivity: {
    label: {
      labelName: "Near the Side Construction Related Activity",
      labelKey: "BPA_NMA_NOC_NEAR_SIDE_CONSTRUCTION_LABEL"
    },
    placeholder: {
      labelName: "Enter Near the Side Construction Related Activity",
      labelKey: "BPA_NMA_NOC_NEAR_SIDE_CONSTRUCTION_PLACEHOLDER"
    }
  },
  WhetherMonumentIsLocatedWithinLimitOf: {
    label: {
      labelName: "Whether the Monument is Located Within Limit of",
      labelKey: "BPA_NMA_NOC_MONUMENT_WITHIN_LIMIT_LABEL"
    },
    placeholder: {
      labelName: "Enter Whether the Monument is Located Within Limit of",
      labelKey: "BPA_NMA_NOC_MONUMENT_WITHIN_LIMIT_PLACEHOLDER"
    }
  },
  DoesMasterPlanApprovedByConcernedAuthoritiesExistsForTheCityTownVillage: {
    label: {
      labelName: "Does Master Plan Approved By Concerned Authorities Exists For The City/Town/Village",
      labelKey: "BPA_NMA_NOC_MASTER_PLAN_APPROVED_LABEL"
    },
    placeholder: {
      labelName: "Select",
      labelKey: "BPA_NMA_NOC_MASTER_PLAN_APPROVED_PLACEHOLDER"
    }
  },  
  MonumentName: {
    label: {
      labelName: "Monument Name",
      labelKey: "BPA_NMA_NOC_MONUMENT_NAME_LABEL"
    },
    placeholder: {
      labelName: "Enter Monument Name",
      labelKey: "BPA_NMA_NOC_MONUMENT_NAME_PLACEHOLDER"
    }
  },
  StatusOfModernConstructions: {
    label: {
      labelName: "Status Of Modern Constructions",
      labelKey: "BPA_NMA_NOC_MODERN_CONSTRUCTION_STATUS_LABEL"
    },
    placeholder: {
      labelName: "Enter Status Of Modern Constructions",
      labelKey: "BPA_NMA_NOC_MODERN_CONSTRUCTION_STATUS_PLACEHOLDER"
    }
  },
  OpenSpaceOrParkOrGreenAreaCloseToProtectedMonumentOrProtectedArea: {
    label: {
      labelName: "Open Space Or Park Or Green Area Close To Protected Monument Or Protected Area",
      labelKey: "BPA_NMA_NOC_AREA_CLOSE_TO_PROTECTED_MONUMENT_LABEL"
    },
    placeholder: {
      labelName: "Enter Open Space Or Park Or Green Area Close To Protected Monument Or Protected Area",
      labelKey: "BPA_NMA_NOC_AREA_CLOSE_TO_PROTECTED_MONUMENT_PLACEHOLDER"
    }
  },
  WhetherAnyRoadExistsBetweenTheMonumentAndTheSiteOfConstruction: {
    label: {
      labelName: "Whether Any Road Exists Between The Monument And The Site Of Construction",
      labelKey: "BPA_NMA_NOC_ROAD_EXISTS_BETWEEN_MONUMENT_LABEL"
    },
    placeholder: {
      labelName: "Select Whether Any Road Exists Between The Monument And The Site Of Construction ",
      labelKey: "BPA_NMA_NOC_ROAD_EXISTS_BETWEEN_MONUMENT_PLACEHOLDER"
    }
  },
  Remarks: {
    label: {
      labelName: "Remarks",
      labelKey: "BPA_NMA_NOC_REMARKS_LABEL"
    },
    placeholder: {
      labelName: "Enter Remarks",
      labelKey: "BPA_NMA_NOC_REMARKS_PLACEHOLDER"
    }
  },
  TermAndCondition : {
    label: {
      labelName: "Terms and Conditions",
      key:'BPA_NMA_NOC_TERM_CONDITION_LABEL',
      label:'Terms and Conditions',
      labelKey: "BPA_NMA_NOC_TERM_CONDITION_LABEL"
    },
    placeholder: {
      labelName: "Enter Terms and Conditions",
      labelKey: "BPA_NMA_NOC_TERM_CONDITIONS_PLACEHOLDER"
    }
  }
};

const titleStyle = {
  fontWeight: "bold",
  fontSize: "12px",
  // fontWeight: "500",
  // color: "rgba(120,110,110,0.64)",
  fontFamily: "Roboto",
  // marginLeft:"7px",
  
};

const fontStyle = {
  fontSize: "12px",
  fontWeight: "500",
  color: "rgba(0, 0, 0, 0.87)",
  fontFamily: "Roboto",
  width:150,
  overflow: "hidden", 
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  // marginLeft:"7px",
};

const fontStyleBuilding ={
  fontSize: "12px",
  fontWeight: "500",
  color: "rgba(0, 0, 0, 0.87)",
  fontFamily: "Roboto",
  // width:150,
  overflow: "hidden", 
  // whiteSpace: "nowrap",
  textOverflow: "ellipsis",
}
class NocDetailCardBPA extends Component {
  constructor(props) {
    super(props);
    const { requiredNocToTrigger, ...rest } = this.props;
    this.state = {
      uploadedDocIndex: 0,
      editableDocuments: null,
      nocType : '',
      isUpdate:false
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

  getNMANOCForm = (key,disabled,nmaDetails) => {
  return (
    <React.Fragment >
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
        <Grid item xs={4}>
          <Typography
            variant="h6"
            gutterBottom
            style={titleStyle}>
            {getTransformedLocale(fieldConfig.MonumentName.label.labelKey)}
          </Typography>
          <div style={fontStyle}>
            {nmaDetails && nmaDetails.NameOfTheNearestMonumentOrSite && nmaDetails.NameOfTheNearestMonumentOrSite.MonumentName
            ? nmaDetails.NameOfTheNearestMonumentOrSite.MonumentName : ''}
          </div>
        </Grid>
        <Grid item xs={4}>
          <Typography
            variant="h6"
            gutterBottom
            style={titleStyle}>
            {getTransformedLocale(fieldConfig.State.label.labelKey)}
          </Typography>
          <div style={fontStyle}>
            {nmaDetails && nmaDetails.NameOfTheNearestMonumentOrSite && nmaDetails.NameOfTheNearestMonumentOrSite.State
            ? nmaDetails.NameOfTheNearestMonumentOrSite.State : ''}
          </div>
        </Grid>
        <Grid item xs={4}>
          <Typography
            variant="h6"
            gutterBottom
            style={titleStyle}>
            {getTransformedLocale(fieldConfig.Locality.label.labelKey)}
          </Typography>
          <div style={fontStyle}>
            {nmaDetails && nmaDetails.NameOfTheNearestMonumentOrSite && nmaDetails.NameOfTheNearestMonumentOrSite.Locality
            ? nmaDetails.NameOfTheNearestMonumentOrSite.Locality : ''}
          </div>
        </Grid>
      </Grid>  
      <Grid container="true" spacing={12}>
        <Grid item xs={4}>
          <Typography
            variant="h6"
            gutterBottom
            style={titleStyle}>
            {getTransformedLocale(fieldConfig.District.label.labelKey)}
          </Typography>
          <div style={fontStyle}>
            {nmaDetails && nmaDetails.NameOfTheNearestMonumentOrSite && nmaDetails.NameOfTheNearestMonumentOrSite.District
            ? nmaDetails.NameOfTheNearestMonumentOrSite.District : ''}
          </div>
        </Grid>
        <Grid item xs={4}>
          <Typography
            variant="h6"
            gutterBottom
            style={titleStyle}>
            {getTransformedLocale(fieldConfig.Taluk.label.labelKey)}
          </Typography>
          <div style={fontStyle}>
            {nmaDetails && nmaDetails.NameOfTheNearestMonumentOrSite && nmaDetails.NameOfTheNearestMonumentOrSite.Taluk
            ? nmaDetails.NameOfTheNearestMonumentOrSite.Taluk : ''}
          </div>
        </Grid>
    </Grid>

    <Grid container="true" spacing={12}>
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
      <Grid item xs={4}>
        <Typography
          variant="h6"
          gutterBottom
          style={titleStyle}>
          {getTransformedLocale(fieldConfig.DistanceFromTheMainMonument.label.labelKey)}
        </Typography>
        <div style={fontStyle}>
          {nmaDetails && nmaDetails.DistanceOfTheSiteOfTheConstructionFromProtectedBoundaryOfMonument && nmaDetails.DistanceOfTheSiteOfTheConstructionFromProtectedBoundaryOfMonument.DistanceFromTheMainMonument
          ? nmaDetails.DistanceOfTheSiteOfTheConstructionFromProtectedBoundaryOfMonument.DistanceFromTheMainMonument : ''}
        </div>
      </Grid>
      <Grid item xs={4}>
        <Typography
          variant="h6"
          gutterBottom
          style={titleStyle}>
          {getTransformedLocale(fieldConfig.DistanceFromTheProtectedBoundaryWall.label.labelKey)}
        </Typography>
        <div style={fontStyle}>
          {nmaDetails && nmaDetails.DistanceOfTheSiteOfTheConstructionFromProtectedBoundaryOfMonument && nmaDetails.DistanceOfTheSiteOfTheConstructionFromProtectedBoundaryOfMonument.DistanceFromTheProtectedBoundaryWall
          ? nmaDetails.DistanceOfTheSiteOfTheConstructionFromProtectedBoundaryOfMonument.DistanceFromTheProtectedBoundaryWall : ''}
        </div>
      </Grid>
    </Grid> 

    <Grid container="true" spacing={12}>
      <Grid item xs={12}>
        <div style={styles.dividerStyle}>
          <div style={ styles.labelStyle}>
            <span>Commencement Of Work</span>
            <div style={styles.underlineStyle} />
          </div>
        </div>
      </Grid>
    </Grid>
    <Grid container="true" spacing={12}>
      <Grid item xs={4}>
        <Typography
          variant="h6"
          gutterBottom
          style={titleStyle}>
          {getTransformedLocale(fieldConfig.ApproximateDateOfCommencementOfWorks.label.labelKey)}
        </Typography>
        <div style={fontStyle}>
          {nmaDetails && nmaDetails.ApproximateDateOfCommencementOfWorks
          ? nmaDetails.ApproximateDateOfCommencementOfWorks : ''}
        </div>
      </Grid>
      <Grid item xs={4}>
        <Typography
          variant="h6"
          gutterBottom
          style={titleStyle}>
          {getTransformedLocale(fieldConfig.ApproximateDurationOfCommencementOfWorks.label.labelKey)}
        </Typography>
        <div style={fontStyle}>
          {nmaDetails && nmaDetails.ApproximateDurationOfCommencementOfWorks
          ? nmaDetails.ApproximateDurationOfCommencementOfWorks : ''}
        </div>
      </Grid>
      <Grid item xs={4}>
        <Typography
          variant="h6"
          gutterBottom
          style={titleStyle}>
          {getTransformedLocale(fieldConfig.BasementIfAnyProposedWithDetails.label.labelKey)}
        </Typography>
        <div style={fontStyle}>
          {nmaDetails && nmaDetails.BasementIfAnyProposedWithDetails
          ? nmaDetails.BasementIfAnyProposedWithDetails : ''}
        </div>
      </Grid>
    </Grid> 
    <Grid container="true" spacing={12}>
      <Grid item xs={4}>
        <Typography
          variant="h6"
          gutterBottom
          style={titleStyle}>
          {getTransformedLocale(fieldConfig.DetailsOfRepairAndRenovation.label.labelKey)}
        </Typography>
        <div style={fontStyle}>
          {nmaDetails && nmaDetails.DetailsOfRepairAndRenovation
          ? nmaDetails.DetailsOfRepairAndRenovation : ''}
        </div>
      </Grid>
      <Grid item xs={4}>
        <Typography
          variant="h6"
          gutterBottom
          style={titleStyle}>
          {getTransformedLocale(fieldConfig.PlotSurveyNo.label.labelKey)}
        </Typography>
        <div style={fontStyle}>
          {nmaDetails && nmaDetails.PlotSurveyNo
          ? nmaDetails.PlotSurveyNo : ''}
        </div>
      </Grid>
    </Grid> 

    <Grid container="true" spacing={12}>
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
      <Grid item xs={4}>
        <Typography
          variant="h6"
          gutterBottom
          style={titleStyle}>
          {getTransformedLocale(fieldConfig.NearTheMonument.label.labelKey)}
        </Typography>
        <div style={fontStyle}>
          {nmaDetails && nmaDetails.MaximumHeightOfExistingModernBuildingInCloseVicinityOf &&
           nmaDetails.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.NearTheMonument
          ? nmaDetails.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.NearTheMonument : ''}
        </div>
      </Grid>
      <Grid item xs={4}>
        <Typography
          variant="h6"
          gutterBottom
          style={titleStyle}>
          {getTransformedLocale(fieldConfig.DoesMasterPlanApprovedByConcernedAuthoritiesExistsForTheCityTownVillage.label.labelKey)}
        </Typography>
        <div style={fontStyle}>
          {nmaDetails && nmaDetails.MaximumHeightOfExistingModernBuildingInCloseVicinityOf &&
           nmaDetails.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.DoesMasterPlanApprovedByConcernedAuthoritiesExistsForTheCityTownVillage
          ? nmaDetails.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.DoesMasterPlanApprovedByConcernedAuthoritiesExistsForTheCityTownVillage : ''}
        </div>
      </Grid>
      <Grid item xs={4}>
        <Typography
          variant="h6"
          gutterBottom
          style={titleStyle}>
          {getTransformedLocale(fieldConfig.OpenSpaceOrParkOrGreenAreaCloseToProtectedMonumentOrProtectedArea.label.labelKey)}
        </Typography>
        <div style={fontStyle}>
          {nmaDetails && nmaDetails.MaximumHeightOfExistingModernBuildingInCloseVicinityOf &&
           nmaDetails.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.OpenSpaceOrParkOrGreenAreaCloseToProtectedMonumentOrProtectedArea
          ? nmaDetails.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.OpenSpaceOrParkOrGreenAreaCloseToProtectedMonumentOrProtectedArea : ''}
        </div>
      </Grid>
    </Grid> 
    
    <Grid container="true" spacing={12}>
      <Grid item xs={4}>
        <Typography
          variant="h6"
          gutterBottom
          style={titleStyle}>
          {getTransformedLocale(fieldConfig.StatusOfModernConstructions.label.labelKey)}
        </Typography>
        <div style={fontStyle}>
          {nmaDetails && nmaDetails.MaximumHeightOfExistingModernBuildingInCloseVicinityOf &&
           nmaDetails.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.StatusOfModernConstructions
          ? nmaDetails.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.StatusOfModernConstructions : ''}
        </div>
      </Grid>
      <Grid item xs={4}>
        <Typography
          variant="h6"
          gutterBottom
          style={titleStyle}>
          {getTransformedLocale(fieldConfig.WhetherAnyRoadExistsBetweenTheMonumentAndTheSiteOfConstruction.label.labelKey)}
        </Typography>
        <div style={fontStyle}>
          {nmaDetails && nmaDetails.MaximumHeightOfExistingModernBuildingInCloseVicinityOf &&
           nmaDetails.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.WhetherAnyRoadExistsBetweenTheMonumentAndTheSiteOfConstruction
          ? nmaDetails.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.WhetherAnyRoadExistsBetweenTheMonumentAndTheSiteOfConstruction : ''}
        </div>
      </Grid>
      <Grid item xs={4}>
        <Typography
          variant="h6"
          gutterBottom
          style={titleStyle}>
          {getTransformedLocale(fieldConfig.WhetherMonumentIsLocatedWithinLimitOf.label.labelKey)}
        </Typography>
        <div style={fontStyle}>
          {nmaDetails && nmaDetails.MaximumHeightOfExistingModernBuildingInCloseVicinityOf &&
           nmaDetails.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.WhetherMonumentIsLocatedWithinLimitOf
          ? nmaDetails.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.WhetherMonumentIsLocatedWithinLimitOf : ''}
        </div>
      </Grid>
    </Grid> 
    <Grid container="true" spacing={12}>
      <Grid item xs={4}>
        <Typography
          variant="h6"
          gutterBottom
          style={titleStyle}>
          {getTransformedLocale(fieldConfig.Remarks.label.labelKey)}
        </Typography>
        <div style={fontStyle}>
          {nmaDetails && nmaDetails.MaximumHeightOfExistingModernBuildingInCloseVicinityOf &&
           nmaDetails.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.Remarks
          ? nmaDetails.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.Remarks : ''}
        </div>
      </Grid>
      <Grid item xs={4}>
        <Typography
          variant="h6"
          gutterBottom
          style={titleStyle}>
          {getTransformedLocale(fieldConfig.TermAndCondition.label.labelKey)}
        </Typography>
        <div style={fontStyle}>
          {nmaDetails && nmaDetails.MaximumHeightOfExistingModernBuildingInCloseVicinityOf &&
           nmaDetails.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.TermAndCondition
          ? nmaDetails.MaximumHeightOfExistingModernBuildingInCloseVicinityOf.TermAndCondition : ''}
        </div>
      </Grid>
    </Grid>  
    </React.Fragment>
  );
  }
  getFIREOCForm =(firekey, disabled,fireDetails)=>{
    const data = fireDetails.thirdPartNOC
      return (
        <React.Fragment>
         
           <Grid container="true" spacing={12}>
           <Grid item xs={12}>
              <div style={styles.dividerStyle}>
                <div style={ styles.labelStyle}>
                  <span>Fire Noc Details</span>
                  <div style={styles.underlineStyle} />
                </div>
              </div>
            </Grid>
             </Grid>
             <Grid container="true" spacing={12}>
             <Grid item xs={6}>
              <Typography
                variant="h6"
                gutterBottom
                style={titleStyle}>
                {getTransformedLocale(fireFileConfig.identityProofType.label.labelKey)}
              </Typography>
              <div style={fontStyle}>
                {fireDetails && data && data.identityProofType.name
                ? data.identityProofType.name : ''}
              </div>
            </Grid>
       
            <Grid item xs={6}>
              <Typography
                variant="h6"
                gutterBottom
                style={titleStyle}>
                {getTransformedLocale(fireFileConfig.firedistricts.label.labelKey)}
              </Typography>
              <div style={fontStyle}>
                {fireDetails && data && data.fireDistrict.name
                ? data.fireDistrict.name : ''}
              </div>
            </Grid>
               </Grid>
    
               <Grid container="true" spacing={12}>
               <Grid item xs={6}>
              <Typography
                variant="h6"
                gutterBottom
                style={titleStyle}>
                {getTransformedLocale(fireFileConfig.fireStations.label.labelKey)}
              </Typography>
              <div style={fontStyle}>
                {fireDetails && data && data.fireStation.name
                ? data.fireStation.name : ''}
              </div>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="h6"
                gutterBottom
                style={titleStyle}>
                {getTransformedLocale(fireFileConfig.identityProofNo.label.labelKey)}
              </Typography>
              <div style={fontStyle}>
                {fireDetails && data && data.identityProofNo
                ? data.identityProofNo : ''}
              </div>
            </Grid>
                 </Grid>
                 <Grid container="true" spacing={12}>
                <Grid item xs={12}>
              <Typography
                variant="h6"
                gutterBottom
                style={titleStyle}>
                {getTransformedLocale(fireFileConfig.Buildingtypes.label.labelKey)}
              </Typography>
              <div style={fontStyleBuilding}>
                {fireDetails && data && data.buildingType.BuildingType
                ? data.buildingType.BuildingType : ''}
              </div>
            </Grid>
                </Grid>
        </React.Fragment>
      )
    // }

  }
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
            (this.state.editableDocuments[key].editable ? 
              ""
            : (
              <NocDocDetailCardBPA
                docItem={card}
                docIndex={key}
                key={key.toString()}
                handleDocument={this.handleDocument}
                removeDocument={this.removeDocument}
                onUploadClick={this.onUploadClick}
                handleFileUpload={this.handleFileUpload}
                handleChange={this.handleChange}
                disabled ={this.props.disabled}
                uploadedDocIndex={this.state.uploadedDocIndex}
                toggleEditClick={() => this.toggleEditClick(card.nocType,true)}
                {...rest}
              />
            ))}
        </React.Fragment>
      );
  };

  checkAllRequiredDocumentsUploaded = (nocType,requiredDocuments) => {
    let allDocumentsUploaded = false
    //get codes of requiredDocuments
    let docFromMDMS = requiredDocuments && requiredDocuments.length > 0 && requiredDocuments.map ( doc => {
      return doc.code
    })
    //get all noc's
    let {Noc} = this.props.preparedFinalObject
    let requiredNoc = Noc && Noc.length > 0 && Noc.filter( noc => {
      if(noc.nocType == nocType){
        return noc
      }
    })
    
    let documents = []
    // to get uploaded documents
    requiredNoc && requiredNoc.length > 0 && requiredNoc[0].documents && 
    requiredNoc[0].documents.length > 0 && requiredNoc[0].documents.map( doc => {
      if(!documents.includes(doc.documentType)){
        documents.push(doc.documentType)
      }
    })
    if(requiredNoc && requiredNoc.length > 0 && requiredNoc[0].nocType == 'FIRE_NOC'){
      if(requiredNoc[0].additionalDetails && requiredNoc[0].additionalDetails.thirdPartNOC){
        allDocumentsUploaded = true
      }
    }
    
    if(requiredNoc && requiredNoc.length > 0 && requiredNoc[0].nocType == 'NMA_NOC'){
      if(requiredNoc[0].additionalDetails && requiredNoc[0].additionalDetails.thirdPartNOC){
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
      
      if(isUploadedDoc && isUploadedDoc.includes(false)){
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

  getDocumentsFromMDMS = async (nocType,isUpdate) => {
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
    let requiredDocumentsFormat = documents && documents.length > 0 && documents[0].docTypes.map( doc => {
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

    store.dispatch(prepareFinalObject("SelectedNocDocument",requiredDocumentsFormat))
    if(this.checkAllRequiredDocumentsUploaded(nocType,requiredDocumentsFormat)){
      store.dispatch(
        toggleSnackbar(
          true,
          {
            labelName:  'BPA_NOC_UP_TO_DATE_MSG',
            labelKey:  'BPA_NOC_UP_TO_DATE_MSG'
          },
          "success"
        )
      )
    }else{
      if(nocType == 'NMA_NOC'){
        store.dispatch(handleField(
          "apply",
          "components.div.children.triggerNocContainer.props",
          "height",
          '400px'
       ))
      }else{
        store.dispatch(handleField(
          "apply",
          "components.div.children.triggerNocContainer.props",
          "height",
          '270px'
       ))
      }
      store.dispatch(handleField(
        "apply",
        "components.div.children.triggerNocContainer.props",
        "open",
        true
    ))
      this.prepareDocumentsUploadData(requiredDocumentsFormat)
    }
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

  triggerNoc = (nocType,isUpdate) => {
    this.setState({
      nocType : nocType
    })
    if(!isUpdate){
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
    }
    store.dispatch(prepareFinalObject("documentsContractNOC", []));
    store.dispatch(prepareFinalObject("nocDocumentsDetailsRedux", {}));
    this.getDocumentsFromMDMS(nocType,isUpdate)
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
      
      store.dispatch(handleField(
        "apply",
        "components.div.children.triggerNocContainer.props",
        "nocType",
        nocType
      ))

      store.dispatch(handleField(
        "search-preview",
        "components.div.children.triggerNocContainer.props",
        "type",
        "trigger"
      ))
      store.dispatch(prepareFinalObject(`NewNocAdditionalDetails`,{}))  
      store.dispatch(prepareFinalObject(`NewNocAdditionalDetailsFire`, {}))
  }

  render() {
    const {
      requiredNocToTrigger,
      documentData,
      Noc,
      disabled,
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
            <div>{card.nocType == 'FIRE_NOC' && card && card.additionalDetails && card.additionalDetails.submissionDetails.thirdPartNOC&&
            this.getFIREOCForm(index,disabled,card.additionalDetails.submissionDetails)}</div>
            <div>{card.nocType == 'NMA_NOC' && card.nmaDetails && card.nmaDetails.thirdPartNOC && 
            this.getNMANOCForm(index,disabled,card.nmaDetails.thirdPartNOC)}</div>
          </div>) : (
             <Grid style={{paddingTop:'18px',paddingRight:'22px',paddingBottom:'18px',paddingLeft:'10px',marginBottom:'10px',width:'100%',backgroundColor: "#FFFFFF"}} container>
                <Grid style={{align:'center'}} item xs={11}>
                  <LabelContainer style={{fontWeight:'bold',fontSize:'12px'}}
                    labelKey={getTransformedLocale(card.nocType)}/>
                </Grid>
             <Grid style={{align: "right"}} item xs={1}>
               <Button 
                 onClick = {() => this.triggerNoc(card.nocType,false)}
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

  toggleEditClick = (nocType) => {
    // let items = [...this.state.editableDocuments];
    // let item = { ...items[itemIndex] };
    // item.editable = item.editable ? false : true;
    // items[itemIndex] = item;
    // this.setState({ editableDocuments: items });
    store.dispatch(handleField(
      "apply",
      "components.div.children.triggerNocContainer.props",
      "isUpdate",
       true
    ))
    store.dispatch(handleField(
      "search-preview",
      "components.div.children.triggerNocContainer.props",
      "isUpdate",
       true
    ))
    this.triggerNoc(nocType,true)
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
    prepareFinalObject("requiredNocToTrigger", appDocumentList);

    prepareFinalObject("nocDocumentDetailsUploadRedux", appDocumentList);
  };

  getOldDocuments = (docType) => {
    let {Noc} = this.props.preparedFinalObject
    let filteredNoc = Noc && Noc.length > 0 && Noc.filter( noc => {
      if(noc.nocType == this.state.nocType){
        return noc
      }
    })
    let Nocdocuments = filteredNoc && filteredNoc.length > 0 && filteredNoc[0].documents && filteredNoc[0].documents
    let documents = Nocdocuments && Nocdocuments.length > 0 && Nocdocuments.filter( doc => {
      if(doc.documentType == docType ){
        return doc
      }
    })
    return documents
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
             if ((oldDocType != docType.code || oldDocCode != card.name)) {[]
               nocDocumentsDetailsRedux[index] = {
                 documentType: docType.code,
                 documentCode: card.name,
                 documents : this.getOldDocuments(docType.documentType) || [],
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
    requiredNocToTrigger[cardIndex].documents.splice(uploadedDocIndex, 1);
    prepareFinalObject("Noc", Noc);
    
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
  )(NocDetailCardBPA)
);

