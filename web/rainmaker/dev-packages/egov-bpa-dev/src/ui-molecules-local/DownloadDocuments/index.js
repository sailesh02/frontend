import React from "react";
import { connect } from "react-redux";
import { Grid, Typography, Button } from "@material-ui/core";
import {
  LabelContainer,
  TextFieldContainer
} from "egov-ui-framework/ui-containers";
import { ifUserRoleExists } from '../../ui-config/screens/specs/utils'
import CloseIcon from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/core/styles";
import { UploadMultipleFiles } from "egov-ui-framework/ui-molecules";
import {
  prepareFinalObject,
  toggleSnackbar,
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import get from "lodash/get";
import set from "lodash/set";

//import "./index.css";
import store from "ui-redux/store"

const styles = theme => ({
  root: {
    marginTop: 24,
    width: "100%"
  }
});


class ActionDialog extends React.Component {
  state = {
    employeeList: [],
    roles: "",

  };

  downloadDoc = async(bpaDetails, type) => {
    console.log(bpaDetails, "Nero consolessss")
    let fileStoreId;
   if(type == "BPA_BPD_UNSIGNED"){
   let filteredDoc =  bpaDetails && bpaDetails.additionalDetail.unsignedBuildingPlanLayoutDetails
     fileStoreId = filteredDoc && filteredDoc.fileStoreId;
  }else{
   let filteredDoc =  bpaDetails && bpaDetails.documents.filter( item => item.documentType === "BPD.BPL.BPL")
    fileStoreId = filteredDoc && filteredDoc[0].fileStoreId;
  }
  
  let pdfDownload = await httpRequest(
    "get",
    `filestore/v1/files/url?tenantId=od&fileStoreIds=${fileStoreId}`, []
  );
  window.open(pdfDownload[fileStoreId]);
  // if (mode && mode === "Download") {
  //   window.open(pdfDownload[fileStoreId]);
  // } else {
  //   printPdf(pdfDownload[fileStoreId]);
  // }
  }
  render() {

    let {
      onClose,
      bpaDetails
    } = this.props;
    let fullscreen = false;
    if (window.innerWidth <= 768) {
      fullscreen = true;
    }

    onClose = () => {
      console.log("Hello Nero")
      store.dispatch(
        handleField("search-preview", "components.div.children.downloadBPDPickerDialog", "props.open", false)
      );
      
    }


    return (
      <Grid
        container="true"
        spacing={12}
        marginTop={16}
        className="action-container">


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
          onClick={onClose}
        >
          <CloseIcon />
        </Grid>
        <Grid
          container="true"
          spacing={2}
         style={{
          marginTop:'29px'
        }}
        >
          <Grid

            item
            sm={6}
            xs={6}
          >

            <LabelContainer labelName={"Digitally Sign Application"}
              labelKey={"Signed Building plan layout document"} />


          </Grid>


          <Grid
          sm={6}
          xs={6}
          md={6}
          item
          >
            <Button
              color="primary"
              onClick={()=>{
                this.downloadDoc(bpaDetails, "BPA_BPD_SIGNED")
              }}
              style={{
                paddingBottom: "0px",
                paddingTop: "0px"
              }}
            >


              <LabelContainer
                labelName={"BPA_VIEW_BUTTON"}
                labelKey=
                {"View File"}
              />
            </Button>
          </Grid>
          <Grid

            item
            sm={6}
            xs={6}
            md={6}
          >

            <LabelContainer labelName={"Digitally Sign Application"}
              labelKey={"Building plan layout document"} />


          </Grid>


          <Grid
          sm={6}
          xs={6}
          md={6}
          item
          >
            <Button
              color="primary"
              onClick={()=>{
                this.downloadDoc(bpaDetails, "BPA_BPD_UNSIGNED")
              }}
              style={{
                paddingBottom: "0px",
                paddingTop: "0px"
              }}
            >


              <LabelContainer
                labelName={"BPA_VIEW_BUTTON"}
                labelKey=
                {"View File"}
              />
            </Button>
          </Grid>
        </Grid>


      </Grid>
    );
  }
}

const mapStateToProps = (state, ownprops) => {
  const { screenConfiguration } = state;
  
  const bpaDetails = get(
    screenConfiguration.preparedFinalObject,
    "BPA",
    {}
  );
  
  return {bpaDetails};
};

// const mapDispatchToProps = dispatch => {
//   return {
//     prepareFinalObject: (jsonPath, value) =>
//       dispatch(prepareFinalObject(jsonPath, value)),
//       toggleSnackbar: (open, message, variant) =>
//       dispatch(toggleSnackbar(open, message, variant)),
//       setRoute: route => dispatch(setRoute(route)),
//       handleField: value => dispatch(
//         handleField(
//           "search-preview",
//           "components.div.children.sendToArchPickerDialog",
//           "props.open", false))
//   };
// };

export default withStyles(styles)(
  connect(
    mapStateToProps,
    null
  )(ActionDialog)
);

