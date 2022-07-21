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
const genericInnerdivStyle = {
  paddingLeft: 0
};


let RequestInfo = {};

let customRequestInfo = JSON.parse(getUserInfo())

class EdcrHistory extends Component {
  

   getFloorDetails = (index) => {
    let floorNo = ['Ground', 'First', 'Second', 'Third', 'Forth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth']
    if (index) {
      return `${floorNo[index]} floor`;
    }
  };

  openPopupWithDetail = async(item) =>{

    let state = store.getState();
    let tenantId = getQueryArg(
      window.location.href,
      "tenantId", ""
    );
    let edcrNumber = item.edcrnumber;
    let edcrRes = await edcrHttpRequest(
      "post",
      "/edcr/rest/dcr/scrutinydetails?edcrNumber=" + edcrNumber + "&tenantId=" + tenantId,
      "search", []
    );
  //
let edcrObj = edcrRes && edcrRes.edcrDetail[0];
 let response = edcrObj && edcrObj.planDetail.blocks;
    
 let occupancyType = get(
    state,
    "screenConfiguration.preparedFinalObject.applyScreenMdmsData.BPA.SubOccupancyType",
    []
  );
  let BPA = get(
    state,
    "screenConfiguration.preparedFinalObject.BPA",
    {}
  );

  let subOccupancyType = occupancyType.filter(item => {
    return item.active;
  });

  let tableData = [];
  if (response && response.length > 0) {
    for (var j = 0; j < response.length; j++) {
      let title = `Block ${j + 1}`;
      let floors = response[j] && response[j].building && response[j].building.floors;
      let block = await floors.map((item, index) => (
        {
          [getBpaTextToLocalMapping("Floor Description")]: this.getFloorDetails((item.number).toString()) || '-',
          [getBpaTextToLocalMapping("Level")]: item.number,
          [getBpaTextToLocalMapping("Occupancy/Sub Occupancy")]: getLocaleLabels("-", item.occupancies[0].type),//getLocaleLabels("-", item.occupancies[0].type, getLocalLabels),
          [getBpaTextToLocalMapping("Buildup Area")]: item.occupancies[0].builtUpArea || "0",
          [getBpaTextToLocalMapping("Floor Area")]: item.occupancies[0].floorArea || "0",
          [getBpaTextToLocalMapping("Carpet Area")]: item.occupancies[0].carpetArea || "0",
        }));
      let occupancyTypeCheck = [],
        floorNo = response[j].number
      if (BPA && BPA.landInfo && BPA.landInfo.unit && BPA.landInfo.unit[j] && BPA.landInfo.unit[j].usageCategory) {
        let sOccupancyType = (BPA.landInfo.unit[j].usageCategory).split(",");
        sOccupancyType.forEach(subOcData => {
          occupancyTypeCheck.push({
            value: subOcData,
            label: getLocaleLabels("NA", `BPA_SUBOCCUPANCYTYPE_${getTransformedLocale(subOcData)}`, null)
          });
        });
      }

      if (occupancyTypeCheck && occupancyTypeCheck.length) {
        tableData.push({ blocks: block, suboccupancyData: subOccupancyType, titleData: title, occupancyType: occupancyTypeCheck, floorNo: floorNo });
      } else {
        tableData.push({ blocks: block, suboccupancyData: subOccupancyType, titleData: title, floorNo: floorNo });
      }

    };
    store.dispatch(prepareFinalObject("edcrForHistory.blockDetail", tableData));

  }

//
    store.dispatch(prepareFinalObject(`scrutinyDetailsForHistory`, edcrRes.edcrDetail[0]));
  

    store.dispatch(
      handleField("search-preview", "components.div.children.popupForScrutinyDetail", "props.open", true)
    );
  }

  render() {
    
    let { edcrHistory } = this.props;
    let items = edcrHistory;

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
                    sm={4}
                    xs={4}
                    >
                  
                    <LabelContainer labelName={"Digitally Sign Application"}
                    labelKey={term.edcrnumber} />
                  

                    </Grid>
                    <Grid
                    
                    item
                    sm={4}
                    xs={4}
                    >
                  <LabelContainer labelName={"Digitally Sign Application"}
                    labelKey={convertEpochToDate(parseInt(term.createdtime))} />
                 

                    </Grid>
                    
                    <Grid>
                    <Button
                    color = "primary"
                    onClick={()=>{
                      this.openPopupWithDetail(term)
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
  let edcrHistory = [];
  if(preparedFinalObject && preparedFinalObject.edcrHistory && preparedFinalObject.edcrHistory.length > 0){
    edcrHistory = preparedFinalObject && preparedFinalObject.edcrHistory
    
    edcrHistory.sort((a, b)=> {return b.createdtime - a.createdtime});
  }
   

  return { edcrHistory };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showSpinner: () => dispatch(showSpinner()),
    hideSpinner : () => dispatch(hideSpinner()),
    toggleSnackbarAndSetText: (open, message, variant) => {
      dispatch(toggleSnackbarAndSetText(open, message, variant));
    }  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EdcrHistory);
