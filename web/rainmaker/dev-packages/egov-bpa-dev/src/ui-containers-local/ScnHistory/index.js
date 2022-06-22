import { Dialog, DialogContent } from "@material-ui/core";
import Label from "egov-ui-kit/utils/translationNode";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid, Typography, Button } from "@material-ui/core";
import { Container } from "egov-ui-framework/ui-atoms";
import store from "ui-redux/store";
import {
  addQueryArg
} from "egov-ui-framework/ui-utils/commons";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import {
  LabelContainer,
  TextFieldContainer
} from "egov-ui-framework/ui-containers";
import {
    TextfieldWithIcon
} from "egov-ui-framework/ui-molecules"
import CloseIcon from "@material-ui/icons/Close";

import { hideSpinner,showSpinner } from "egov-ui-kit/redux/common/actions";
import TextField from "material-ui/TextField";
import { getLocale, getTenantId,getAccessToken, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import axios from 'axios';
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { getLocaleLabels, getQueryArg, getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import { List, ListItem } from "material-ui/List";
import { convertEpochToDate, getBpaTextToLocalMapping } from "../../ui-config/screens/specs/utils/index";
import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
  toggleSnackbar
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { edcrHttpRequest } from "../../ui-utils/api"
import VisibilityIcon from '@material-ui/icons/Visibility';
import get from "lodash/get"

class ScnHistory extends Component {
  

  downloadLetter = async(item) =>{
    let tenantId = item.tenantid;
    let fileStoreId = item.filestoreid
    let pdfDownload = await httpRequest(
      "get",
      `filestore/v1/files/url?tenantId=${tenantId}&fileStoreIds=${fileStoreId}`, []
    );
  
    window.open(pdfDownload[fileStoreId]);
    
  }

  render() {
    
    let { SCNHistory } = this.props;
    let items = SCNHistory;

    return (
      
              <Grid
                container="true"
                spacing={12}
                marginTop={16}
                className="action-container">
                
              
                {items && items.length > 0 && items.map((term, index) => {
                  return (
                   <Grid 
                   container="true"
                   spacing={2}
                  //  style={{
                  //   marginTop:'2px'
                  // }}
                   > 
                    <Grid
                    
                    item
                    sm={3}
                    xs={3}
                    >
                  
                    <LabelContainer labelName={"Digitally Sign Application"}
                    labelKey={term.LetterNo} />
                  

                    </Grid>
                    <Grid
                    
                    item
                    sm={3}
                    xs={3}
                    >
                  <LabelContainer labelName={"Digitally Sign Application"}
                    labelKey={term.letterType} />
                 

                    </Grid>
                    <Grid
                    
                    item
                    sm={3}
                    xs={3}
                    >
                  <LabelContainer labelName={"Digitally Sign Application"}
                    labelKey={convertEpochToDate(parseInt(term.auditDetails.createdTime))} />
                 

                    </Grid>
                    
                    <Grid>
                    <Button
                    color = "primary"
                    onClick={()=>{
                      this.downloadLetter(term)
                    }}
                    style={{
                      paddingBottom: "0px",
                      paddingTop: "0px"
                    }}
                    >
                      
                      <VisibilityIcon />
                    {/* <LabelContainer
                      labelName={"BPA_VIEW_BUTTON"}
                      labelKey=
                      {"BPA_VIEW_BUTTON"}     
                    /> */}
                    </Button>
                    </Grid>
                    </Grid>
                  );
                })}
              
              </Grid>
                  

          
        
    )
  }
}

const mapStateToProps = (state) => {
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration
  let SCNHistory = [];
  if(preparedFinalObject && preparedFinalObject.SCNHistory && preparedFinalObject.SCNHistory.length > 0){
    SCNHistory = preparedFinalObject && preparedFinalObject.SCNHistory
    
    SCNHistory.sort((a, b)=> {return b.auditDetails.createdTime - a.auditDetails.createdTime});
  }
   

  return { SCNHistory };
};


export default connect(
  mapStateToProps,
  null
)(ScnHistory);
