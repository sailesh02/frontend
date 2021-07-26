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

class PBATrainingTutorials extends Component {
  handleClick = (item, event) => {
    // console.log(item)
    // console.log(event)
    // window.location.href = item;
    let a = document.createElement('a');
    a.target = '_blank';
    a.href = item;
    a.click();
  }
  citizenListItems = [
    {
      question: "Fee Details",
      answer: [{ text: "https://digitaldesksujog051120.blob.core.windows.net/assets/User Manuals/TL_User_Manual_Citizen.pdf" }]
    }

  ];

  techArchListItems = [
    {
      question: "User Manual for Architects & Technical Persons",
      answer: [{ text: "https://digitaldesksujog051120.blob.core.windows.net/assets/User Manuals/TL_User_Manual_Citizen.pdf" }]
    },

    {
      question: "Drawing Manual",
      answer: [{ text: "https://digitaldesksujog051120.blob.core.windows.net/assets/User Manuals/TL_User_Manual_Citizen.pdf" }]
    },
    {
      question: "Drawing Template",
      answer: [{ text: "https://digitaldesksujog051120.blob.core.windows.net/assets/User Manuals/TL_User_Manual_Citizen.pdf" }]
    },
    {
      question: "Reference Drawing for Apartment & Housing Projects",
      answer: [{ text: "https://digitaldesksujog051120.blob.core.windows.net/assets/User Manuals/TL_User_Manual_Citizen.pdf" }]
    },
    {
      question: "Reference Drawing File for  Commercial Projects",
      answer: [{ text: "https://digitaldesksujog051120.blob.core.windows.net/assets/User Manuals/TL_User_Manual_Citizen.pdf" }]
    },
    {
      question: "Reference Drawing File for Residential Detached Projects",
      answer: [{ text: "https://digitaldesksujog051120.blob.core.windows.net/assets/User Manuals/TL_User_Manual_Citizen.pdf" }]
    },
    {
      question: "Project Risk Criterias",
      answer: [{ text: "https://digitaldesksujog051120.blob.core.windows.net/assets/User Manuals/TL_User_Manual_Citizen.pdf" }]
    },
    {
      question: "Fee Details",
      answer: [{ text: "https://digitaldesksujog051120.blob.core.windows.net/assets/User Manuals/TL_User_Manual_Citizen.pdf" }]
    },


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
    const { renderList, citizenListItems, techArchListItems } = this;
    const { urls, history, userRole } = this.props;

    return (
      <Screen className="screen-with-bredcrumb">
        {/* <BreadCrumbs url={urls} history={history} /> */}
        <div className="form-without-button-cont-generic">
          {(() => {
            if (userRole && userRole === "archTech") {
              return <Card
                className="how-it-works-card"
                textChildren={renderList(techArchListItems)}
              />
            } else if (userRole && userRole === "archOnly") {
              return <Card
                className="how-it-works-card"
                textChildren={renderList(techArchListItems)}
              />
            } else if (userRole && userRole === "techOnly") {
              return <Card
                className="how-it-works-card"
                textChildren={renderList(techArchListItems)}
              />
            } else if (userRole && userRole === "citizenOnly") {
              return <Card
                className="how-it-works-card"
                textChildren={renderList(citizenListItems)}
              />
            }
          })()}

        </div>
      </Screen>
    );
  }
}

const mapStateToProps = state => {
  const { common, app, auth } = state;
  const { urls } = app;
  const { userInfo } = auth;



  let citizenRole = userInfo && userInfo.roles && userInfo.roles.filter((roleInfo) => {
    return roleInfo.code === "CITIZEN"
  })

  let archRole = userInfo && userInfo.roles && userInfo.roles.filter((roleInfo) => {
    return roleInfo.code === "BPA_ARCHITECT"
  })
  let techRole = userInfo && userInfo.roles && userInfo.roles.filter((roleInfo) => {
    return roleInfo.code === "BPA_TECHNICALPERSON"
  })


  let userRole = '';
  if (citizenRole && citizenRole.length > 0 && archRole && archRole.length > 0 && techRole && techRole.length > 0) {
    userRole = "archTech"
  } else if (citizenRole && citizenRole.length > 0 && archRole && archRole.length > 0) {
    userRole = "archOnly"
  } else if (citizenRole && citizenRole.length > 0 && techRole && techRole.length > 0) {
    userRole = "techOnly"
  } else if (citizenRole && citizenRole.length > 0) {
    userRole = "citizenOnly"
  }


  return { urls, userRole };
};

const mapDispatchToProps = dispatch => {
  return {
    addBreadCrumbs: url => dispatch(addBreadCrumbs(url))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PBATrainingTutorials);
