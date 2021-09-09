import React from "react";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
import { fetchData } from "./citizenSearchResource/citizenFunctions";
import { cityPicker } from "./citypicker";
import FormIcon from "../../../../ui-atoms-local/Icons/FormIcon";
import TradeLicenseIcon from "../../../../ui-atoms-local/Icons/TradeLicenseIcon";
import "../utils/index.css";
import { getRequiredDocData } from "egov-ui-framework/ui-utils/commons";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
const header = getCommonHeader(
  {
    labelName: "Trade License",
    labelKey: "TL_COMMON_TL"
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
      //labelKey: "MR_APPLY_MRG_LICENSE",
      labelKey: "Apply for Marriage Registration",
      labelName: "Apply for Trade License"
    },
    icon: <TradeLicenseIcon />,

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
        moduleName: 'TradeLicense',
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
