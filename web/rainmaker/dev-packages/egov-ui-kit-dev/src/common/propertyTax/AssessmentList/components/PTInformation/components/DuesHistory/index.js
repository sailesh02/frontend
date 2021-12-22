import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import React, { Component } from "react";
import { connect } from "react-redux";
import HistoryCard from "../../../../../Property/components/HistoryCard";
import { getFormattedYearFromDate } from "../../../../../../../utils/PTCommon";
import { getFullRow } from "../AssessmentHistory";

class DuesHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            showItems: false,
            errorMessage:"PT_DUE_HISTORY_ERROR"
        };
    }

    getTransformedPaymentHistory() {
        const { Bill = [] } = this.props;
        const dueHistoryItems = Bill && Bill.length > 0 && Bill[0].billDetails && Bill[0].billDetails.length > 0 &&
        Bill[0].billDetails.map((payment, index) => {
            return (
                <div>
                    {getFullRow(payment.fromPeriod && payment.toPeriod ? `${getFormattedYearFromDate(payment.fromPeriod)} - ${getFormattedYearFromDate(payment.toPeriod)}` : "NA",payment.amount ? `${payment.amount}` : !payment.amount || payment.amount == 0 ? "0" : " " , 12)}
                </div>)

        })
        return dueHistoryItems;
    }

    render() {
        const { Bill = [] } = this.props;
        let paymentHistoryItem = [];
        if (Bill.length > 0) {
            paymentHistoryItem = this.getTransformedPaymentHistory();
        }
        const items = this.state.showItems ? this.state.items : [];
        const errorMessage = this.state.showItems && items.length==0 ? this.state.errorMessage : '';
        return (<HistoryCard header={'PT_DUE_HISTORY'} items={items} errorMessage={errorMessage} onHeaderClick={() => {
            this.setState({ showItems: !this.state.showItems, items: paymentHistoryItem })
        }}></HistoryCard>)
    }
}


const mapStateToProps = (state, ownProps) => {
    const { Bill = [], Payments = [] } = state.properties || {};
    const propertyId = decodeURIComponent(ownProps.match.params.propertyId);

    return {
        propertyId,
        Bill,
        Payments
    };
};

export default compose(
    withRouter,
    connect(
        mapStateToProps
    )
)(DuesHistory);