import React, { Component } from "react";
import { Card, Button } from "components";
import Screen from "egov-ui-kit/common/common/Screen";
import Label from "egov-ui-kit/utils/translationNode";
import { List, ListItem } from "material-ui/List";
import { connect } from "react-redux";
//import { addBreadCrumbs } from "egov-ui-kit/redux/app/actions";
// import "../PTHome/index.css";
import "./index.css";
//import BreadCrumbs from "../../ui-atoms-local/BreadCrumbs/index"

const genericInnerdivStyle = {
  paddingLeft: 0
};

const videoCardStyle = {
  minHeight: 270
};

class TLHowItWorks extends Component {
  listItems = [
    {
      question: "CS_HOWITWORKS_QUESTION1",
      answer: [{ text: "CS_HOWITWORKS_ANSWER1" }]
    },
    {
      question: "CS_HOWITWORKS_QUESTION2",
      answer: [
        {
          text: "CS_HOWITWORKS_ANSWER2"
        }
      ]
    },
    {
      question: "CS_HOWITWORKS_QUESTION3",
      answer: [
        {
          text: "CS_HOWITWORKS_ANSWER3"
        }
      ]
    },
    {
      question: "CS_HOWITWORKS_QUESTION4",
      answer: [
        {
          text: "CS_HOWITWORKS_ANSWER4"
        }
      ]
    },
    {
      question: "CS_HOWITWORKS_QUESTION5",
      answer: [
        {
          text: "CS_HOWITWORKS_ANSWER5"
        }
      ]
    },
    {
      question: "CS_HOWITWORKS_QUESTION6",
      answer: [{ text: "CS_HOWITWORKS_ANSWER6" }]
    },
    {
      question: "CS_HOWITWORKS_QUESTION7",
      answer: [{ text: "CS_HOWITWORKS_ANSWER7" }]
    },
    {
      question: "CS_HOWITWORKS_QUESTION8",
      answer: [
        {
          text: "CS_HOWITWORKS_ANSWER8"
        }
      ]
    },
    {
      question: "CS_HOWITWORKS_QUESTION9",
      answer: [{ text: "CS_HOWITWORKS_ANSWER9" }]
    },
    {
      question: "CS_HOWITWORKS_QUESTION20",
      answer: [
        {
          text: "CS_HOWITWORKS_ANSWER10"
        }
      ]
    },
    {
      question: "CS_HOWITWORKS_QUESTION11",
      answer: [
        {
          text: "CS_HOWITWORKS_ANSWER11"
        }
      ]
    },
    {
      question: "CS_HOWITWORKS_QUESTION12",
      answer: [{ text: "CS_HOWITWORKS_ANSWER12" }]
    }
  ];

  componentDidMount() {
    // const { addBreadCrumbs, title } = this.props;
    // title && addBreadCrumbs({ title: title, path: window.location.pathname });
  }

  renderList = items => {
    return (
      <div>



        <div className="col-sm-12" style={{ padding: "15px 0px 30px 0px" }}>
          <a
            href={process.env.REACT_APP_NAME === "Citizen"?
              "https://sujog.odisha.gov.in/filestore/v1/files/id?tenantId=od&fileStoreId=64cebf0c-f61a-40f8-ae38-c3db5adbca4d":
              "https://sujog.odisha.gov.in/filestore/v1/files/id?tenantId=od&fileStoreId=5e9d6bc4-29ea-41d0-9cbb-04697a5ee096"
            }
            target="_blank"
          >
            <Button
              label={
                <Label
                  buttonLabel={true}
                  label="PT_DOWNLOAD_HELP_DOCUMENT"
                  fontSize="12px"
                />
              }
              primary={true}
              style={{ height: 30, lineHeight: "auto", minWidth: "inherit" }}
            />
          </a>
        </div>


      </div>
    );
  };

  render() {
    const { renderList, listItems } = this;
    const { urls, history } = this.props;
    return (
      <Screen className="screen-with-bredcrumb">
        {/* <BreadCrumbs url={urls} history={history} label="COMMON_HOW_IT_WORKS"/> */}
        <div className="form-without-button-cont-generic">
          <Card
            className="how-it-works-card"
            textChildren={renderList(listItems)}
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

// const mapDispatchToProps = dispatch => {
//   return {
//     addBreadCrumbs: url => dispatch(addBreadCrumbs(url))
//   };
// };

export default connect(
  mapStateToProps,
  null
)(TLHowItWorks);
