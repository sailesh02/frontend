import React, { Component } from "react";
import Card from "egov-ui-kit/components/Card";
import Button from "egov-ui-kit/components/Button";
import BreadCrumbs from "egov-ui-kit/components/BreadCrumbs";
import Screen from "egov-ui-kit/common/common/Screen";
import Label from "egov-ui-kit/utils/translationNode";
import { List, ListItem } from "material-ui/List";
import { connect } from "react-redux";
import { addBreadCrumbs } from "egov-ui-kit/redux/app/actions";
import "./index.css";

const genericInnerdivStyle = {
  paddingLeft: 0
};

const videoCardStyle = {
  minHeight: 270
};

class HowItWorks extends Component {
  handleClick = (item, event) => {
    // console.log(item)
    // console.log(event)
    // window.location.href = item;
    let a = document.createElement('a');
    a.target = '_blank';
    a.href = item;
    a.click();
  }


  empListItems = [
    {
      question: "User Manual for Employees",
      answer: [{ text: "https://digitaldesksujog051120.blob.core.windows.net/assets/User Manuals/TL_User_Manual_Citizen.pdf" }]
    },
    {
      question: "Fee Details",
      answer: [{ text: "https://digitaldesksujog051120.blob.core.windows.net/assets/User Manuals/TL_User_Manual_Citizen.pdf" }]
    }

  ];


  componentDidMount() {
    const { addBreadCrumbs, title } = this.props;
    title && addBreadCrumbs({ title: title, path: window.location.pathname });
  }

  renderList = items => {
    return (
      <div>



        <div>
          <Label label="PT_FAQ" color="#484848" fontSize="20px" />
        </div>

        <hr />

        <List style={{ padding: 0 }}>
          {items.map((item, index) => {
            return (
              <ListItem
                innerDivStyle={
                  index !== 0
                    ? {
                      ...genericInnerdivStyle,
                      borderTop: "solid 1px #e0e0e0"
                    }
                    : genericInnerdivStyle
                }
                nestedListStyle={{ padding: "0 0 16px 0" }}
                primaryText={
                  <Label dark={true} label={item.question} fontSize={16} />
                }
                nestedItems={item.answer.map(nestedItem => {
                  return (
                    <ListItem
                      hoverColor="#fff"
                      primaryText={
                        <Label fontSize={16} label="PT_DOWNLOAD_HELP_DOCUMENT" />
                      }

                      onClick={(event) => this.handleClick(nestedItem.text, event)}
                      innerDivStyle={{ padding: 0 }}
                    />
                  );
                })}
                primaryTogglesNestedList={true}
                hoverColor="#fff"
              />
            );
          })}
        </List>
      </div>
    );
  };

  render() {
    const { renderList, empListItems } = this;
    const { urls, history } = this.props;

    return (
      <Screen className="screen-with-bredcrumb">
        {/* <BreadCrumbs url={urls} history={history} /> */}
        <div className="form-without-button-cont-generic">
           <Card
                className="how-it-works-card"
                textChildren={renderList(empListItems)}
              />


        </div>
      </Screen>
    );
  }
}

const mapStateToProps = state => {
  const { common, app } = state;
  const { urls } = app;
  return { urls };
};

const mapDispatchToProps = dispatch => {
  return {
    addBreadCrumbs: url => dispatch(addBreadCrumbs(url))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HowItWorks);
