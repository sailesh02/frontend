import { LabelContainer } from "egov-ui-framework/ui-containers";
import React from "react";
import { connect } from "react-redux";
import store from "ui-redux/store";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";

const styles = {
 // color: "rgba(0, 0, 0, 0.87)",
  lineHeight: "35px",
  fontSize: "16px"
};

const clickHereStyles = {
  cursor: "pointer",
  textDecoration: "none",
  color: "#FE7A51"
}
class LinkItem extends React.Component {
  state = {
    open: false,
    openDialog: false,
    dialogHeader: 'Update Information',
    dialogButton: 'Update'
  };

  handleClick = () => {
    const {redirectPath} = this.props;
    window.location.href = redirectPath;
    store.dispatch(
          setRoute(
            redirectPath
          )
        );
  }

  render() {
    const {label} = this.props;
    
    return (
      <div style={styles} className={"property-buttons"}>
        
        <a href="javascript:void(0)" onClick={() => this.handleClick()} >
          <LabelContainer
            style={clickHereStyles}
            labelKey={label} />
        </a>
        
         
      </div>
    );
  }
}

export default connect(null, null)(LinkItem);
