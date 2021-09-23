import React from "react";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { fetchData } from "./citizenSearchResource/citizenFunctions";
import { cityPicker } from "./citypicker";
import FormIcon from "../../../../ui-atoms-local/Icons/FormIcon";
import TradeLicenseIcon from "../../../../ui-atoms-local/Icons/TradeLicenseIcon";
import "../utils/index.css";
import { getRequiredDocData } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { Icon } from "egov-ui-kit/components";
const styles = {
  inputStyle: {
    color: "white !important",
    marginTop: "0px",
    marginLeft: "-10px",
  },
  fibreIconStyle: {
    height: "36px !important",
    width: "36px !important",
    margin: 0,
    position: "relative",
  },
  arrowIconStyle: {
    right: "-10px",
  },
  defaultMenuItemStyle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    marginLeft: 0,
    padding: 0,
    paddingLeft: 0,
  },
  inputIconStyle: {
    margin: "0",
    bottom: "15px",
    top: "auto",
    right: "6px",
  },
  textFieldStyle: {
    height: "auto",
    textIndent: "15px",
  },
  inputStyle: {
    //    color: "white",
    color: window.innerWidth > 768 ? "white" : "black",
    bottom: "5px",
    height: "auto",
    paddingLeft: "5px",
    textIndent: "5px",
    marginTop: 0,
  },
};
const header = getCommonHeader(
  {
    labelName: "Trade License",
    labelKey: "Marriage Registration"
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);

const cardItems = [
  {
    label: {

      labelKey: "MR_APPLY_MARRIAGEREGISTRATION",
      labelName: "MR_APPLY_MARRIAGEREGISTRATION"
    },
  //  icon: <TradeLicenseIcon />,
    icon: <Icon
    name={"group-add"}
    action={"social"}
    style={styles.fibreIconStyle}
    className={`service-icon`}
  />,

    route: {
      screenKey: "home",
      jsonPath: "components.cityPickerDialog",

    }
  },

  {
    label: {
      labelKey: "MR_MY_APPLICATIONS",
      labelName: "My Applications"
    },
    icon: <FormIcon />,
    route: "my-applications"
  }
];

const tradeLicenseSearchAndResult = {
  uiFramework: "material-ui",
  name: "home",
  beforeInitScreen: (action, state, dispatch) => {
    dispatch(prepareFinalObject('citiesByModule.citizenTenantId', ''))
    fetchData(action, state, dispatch);
    const moduleDetails = [
      {
        moduleName: 'MarriageRegistration',
        masterDetails: [{ name: 'Documents' }]
      }
    ];
    getRequiredDocData(action, dispatch, moduleDetails,state);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      // props: {
      //   className: "common-div-css"
      // },
      children: {
        header: header,
        applyCard: {
          uiFramework: "custom-molecules",
          componentPath: "LandingPage",
          props: {
            items: cardItems,
            history: {}
          }
        },
        listCard: {
          uiFramework: "custom-molecules-local",
          moduleName: "egov-tradelicence",
          componentPath: "HowItWorks"
        }
      }
    },

    cityPickerDialog: {
      componentPath: "Dialog",
      props: {
        open: false,
        maxWidth: "md"
      },
      children: {
        dialogContent: {
          componentPath: "DialogContent",
          props: {
            classes: {
              root: "city-picker-dialog-style"
            }
            // style: { minHeight: "180px", minWidth: "365px" }
          },
          children: {
            popup: cityPicker
          }
        }
      }
    },
    adhocDialog: {
      uiFramework: "custom-containers",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: false,
        screenKey: "home"
      },
      children: {
        popup: {}
      }
    }
  }
};

export default tradeLicenseSearchAndResult;
