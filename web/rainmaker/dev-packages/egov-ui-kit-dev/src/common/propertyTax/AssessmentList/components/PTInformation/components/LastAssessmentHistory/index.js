import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import Label from "egov-ui-kit/utils/translationNode";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import HistoryCard from "../../../../../Property/components/HistoryCard";

export const getFullRow = (labelKey, labelValue, rowGrid = 12) => {
    let subRowGrid = 1;
    if (rowGrid == 6) {
        subRowGrid = 2;
    }
    if (rowGrid == 4) {
        subRowGrid = 3;
    }
    return (<div className={`col-sm-${rowGrid} col-xs-12`} style={{ marginBottom: 1, marginTop: 1 }}>
        <div className={`col-sm-${2 * subRowGrid} col-xs-4`} style={{ padding: "3px 0px 0px 0px" }}>
            <Label
                labelStyle={{ letterSpacing: 0, color: "rgba(0, 0, 0, 0.54)", fontWeight: "400", lineHeight: "19px !important" }}
                label={labelKey}
                fontSize="14px"
            />
        </div>
        <div className={`col-sm-${4 * subRowGrid} col-xs-8`} style={{ padding: "3px 0px 0px 0px", paddingLeft: rowGrid == 12 ? '10px' : '15px' }}>
            <Label
                labelStyle={{ letterSpacing: "0.47px", color: "rgba(0, 0, 0, 1.87)", fontWeight: "400", lineHeight: "19px !important" }}
                label={labelValue}
                fontSize="14px"
            />
        </div>
    </div>)
}


class LastAssessmentHistory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: [],
            showItems: false,
            errorMessage: "PT_LAST_ASSESSMENT_HISTORY_ERROR"
        };
    }

    getLatestAssessments(Assessments = []) {
        let latestAssessments = [];
        let financialYears = [];
        Assessments.sort((a1, a2) => a2.assessmentDate - a1.assessmentDate);

        Assessments.map(Assessment => {
            if (!financialYears.includes(Assessment.financialYear)) {
                latestAssessments.push(Assessment);
                financialYears.push(Assessment.financialYear);
            }

        })
        return latestAssessments;
    }
    getTransformedAssessmentHistory() {
        const Assessment = this.props && this.props.selPropertyDetails // to get last assessment demand details
            return (
                <div>
                    {getFullRow("PT_HOLDING_TAX", Assessment.additionalDetails && Assessment.additionalDetails.holdingTax ? Assessment.additionalDetails.holdingTax : "",6)}
                    {getFullRow("PT_LIGHT_TAX", Assessment.additionalDetails && Assessment.additionalDetails.lightTax ? Assessment.additionalDetails.lightTax : "",6)}
                    {getFullRow("PT_WATER_TAX",  Assessment.additionalDetails && Assessment.additionalDetails.waterTax ? Assessment.additionalDetails.waterTax : "",6)}
                    {getFullRow("PT_DRAINAGE_TAX",  Assessment.additionalDetails && Assessment.additionalDetails.drainageTax ? Assessment.additionalDetails.drainageTax : "",6)}
                    {getFullRow("PT_LATRINE_TAX",  Assessment.additionalDetails && Assessment.additionalDetails.latrineTax ? Assessment.additionalDetails.latrineTax : "",6)}
                    {getFullRow("PT_PARKING_TAX",  Assessment.additionalDetails && Assessment.additionalDetails.parkingTax ? Assessment.additionalDetails.parkingTax : "",6)}
                    {getFullRow("PT_SOLID_WASTER_USER_CHARGES",  Assessment.additionalDetails && Assessment.additionalDetails.solidWasteUserCharges ? Assessment.additionalDetails.solidWasteUserCharges : "",6)}
                    {getFullRow("PT_OWNERSHIP_EXEMPTION",  Assessment.additionalDetails && Assessment.additionalDetails.ownershipExemption ? Assessment.additionalDetails.ownershipExemption : "",6)}
                    {getFullRow("PT_USAGE_EXEMPTION",  Assessment.additionalDetails && Assessment.additionalDetails.usageExemption ? Assessment.additionalDetails.usageExemption : "",6)}
                    {getFullRow("PT_INTEREST",  Assessment.additionalDetails && Assessment.additionalDetails.interest ? Assessment.additionalDetails.interest : "",6)}
                    {getFullRow("PT_PENALTY",  Assessment.additionalDetails && Assessment.additionalDetails.penalty ? Assessment.additionalDetails.penalty : "",6)}
                    {getFullRow("PT_PROPERTY_SERVICETAX",  Assessment.additionalDetails && Assessment.additionalDetails.serviceTax ? Assessment.additionalDetails.serviceTax : "",6)}
                    {getFullRow("PT_PROPERTY_OTHERDUES",  Assessment.additionalDetails && Assessment.additionalDetails.otherDues ? Assessment.additionalDetails.otherDues : "",6)}
                    {getFullRow("PT_PROPERTY_PENDINGFROM",  Assessment.additionalDetails && Assessment.additionalDetails.pendingFrom ? Assessment.additionalDetails.pendingFrom : "",6)}
                </div>
            )


    }

    render() {
        let { propertyDetails = [], propertyId, Assessments = [] } = this.props;
        if (Assessments.length > 0) {
            Assessments = this.getTransformedAssessmentHistory();
        }
        const items = this.state.showItems ? this.state.items : [];
        const errorMessage = this.state.showItems && items.length == 0 ? this.state.errorMessage : '';
        return (<HistoryCard header={'PT_LAST_ASSESSMENT_HISTORY'} items={items} errorMessage={errorMessage} onHeaderClick={() => {
            this.setState({ showItems: !this.state.showItems, items: Assessments })
        }}></HistoryCard>)
    }

}



const mapStateToProps = (state, ownProps) => {
    const { propertiesById, Assessments = [] } = state.properties || {};
    const propertyId = decodeURIComponent(ownProps.match.params.propertyId);
    const selPropertyDetails = propertiesById[propertyId] || {};
    const propertyDetails = selPropertyDetails.propertyDetails || [];
    return {
        selPropertyDetails,
        propertyDetails,
        propertyId,
        Assessments
    };
};


const mapDispatchToProps = (dispatch) => {
    return {
        toggleSnackbarAndSetText: (open, message, error) => dispatch(toggleSnackbarAndSetText(open, message, error)),
    };
};




export default compose(
    withRouter,
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(LastAssessmentHistory);