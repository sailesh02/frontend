import React from "react";
import { connect } from "react-redux";
// import "./index.css";
import get from "lodash/get";
import { withStyles } from "@material-ui/core/styles";
import { getLocaleLabels, getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import feeChart from "egov-ui-kit/assets/files/feeChart.pdf";
import standardBuilding from "egov-ui-kit/assets/files/standardBuilding.pdf"
const styles = {
  root: {
    color: 'rgba(0, 0, 0, 0.54)',
    // fontSize: '16px',
    fontWeight: 400,
    lineHeight: '1.375em',
  },
  linkDetails : {
    color: 'rgb(245, 117, 66)',
    fontSize: '16px',
    fontWeight: 400,
    fontFamily: 'Roboto',
    lineHeight: '19px',
    letterSpacing: '0.67px',
    textDecoration : 'none',
    '&:hover':{
      color: 'rgb(245, 117, 66)',
    },
    '&:active':{
      color: 'rgb(245, 117, 66)',
    },
    '&:visited':{
      color: 'rgb(245, 117, 66)',
    },
    '&:link':{
      color: 'rgb(245, 117, 66)',
    }

  },
};

class PdfContainer extends React.Component {
  render() {
    const { label = {}, linkDetail= {}, classes, localizationLabels  } = this.props;
    let  value  = this.props.jsonPath;
    let translatedLabel = getLocaleLabels(
      label.labelName,
      label.labelKey,
      localizationLabels
    );
    let translatedLabelLink = getLocaleLabels(
      linkDetail.labelName,
      linkDetail.labelKey,
      localizationLabels
    );
    let downloadLink;
    
    const onButtonClick = async() => {
        // using Java Script method to get PDF file
        const response = await axios.get(`feeChart.pdf`);
        response.data.blob().then(blob => {
            // Creating new object of PDF file
            const fileURL = window.URL.createObjectURL(blob);
            // Setting various property values
            let alink = document.createElement('a');
            alink.href = fileURL;
            alink.download = value;
            alink.click();
        })
        // fetch(`${process.env.PUBLIC_URL}c`).then(response => {
        //     response.blob().then(blob => {
        //         // Creating new object of PDF file
        //         const fileURL = window.URL.createObjectURL(blob);
        //         // Setting various property values
        //         let alink = document.createElement('a');
        //         alink.href = fileURL;
        //         alink.download = value;
        //         alink.click();
        //     })
        // })
    }

    const setPdfLink = () => {
      let pdfFile = value == "feeChart.pdf" ? feeChart : standardBuilding
      return pdfFile
    }
    value = downloadLink ? downloadLink : value;
    return (
      <div style={{margin:"10px 0"}}>
        <div className="pdf-header">
          <div className={classes.root}>{translatedLabel}</div>
        </div>
        <div className="pdf-content">
          <a
            href={setPdfLink()}
            target="_blank"
            className={classes.linkDetails}
            download
          >
            {translatedLabelLink}
          </a>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownprops) => {
  let { jsonPath, value } = ownprops;
  const { screenConfiguration, app } = state;
  const { localizationLabels } = app;
  const { preparedFinalObject } = screenConfiguration;
  let fieldValue =
    value === undefined ? get(preparedFinalObject, jsonPath) : value;
  return { value: fieldValue, localizationLabels };
};

export default withStyles(styles)(connect(mapStateToProps)(PdfContainer));
