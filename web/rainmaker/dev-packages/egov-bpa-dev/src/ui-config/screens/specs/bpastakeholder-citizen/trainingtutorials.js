//import { fetchData } from "./myConnectionDetails/myConnectionDetails";
import { getCommonHeader } from "egov-ui-framework/ui-config/screens/specs/utils";
const header = getCommonHeader(
  {
    labelKey: "Training & Tutorials"
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);

const screenConfig = {
  uiFramework: "material-ui",
  name: "my-connections",
  beforeInitScreen: (action, state, dispatch) => {
    //fetchData(action, state, dispatch);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        // className: "common-div-css"
      },
      children: {
        header: header,
        applicationsCard: {
          uiFramework: "custom-molecules-local",
          moduleName: "egov-bpa",
          componentPath: "PBATrainingTutorials"
        }
      }
    }
  }
};

export default screenConfig;
