import { getBreak } from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  commonReportForm,
  commonReportTable,
} from "./reportResources/commonReportForm";
import { getMdmsData } from "./reportResources/reportActions/commonReportActions";
import {
  getCommonContainer,
  getCommonHeader,
} from "egov-ui-framework/ui-config/screens/specs/utils";

export const getScreenData = async (action, state, dispatch) => {
  await getMdmsData(action, state, dispatch);
};

const getReportHeader = () => {
  const header = getCommonContainer({
    header: getCommonHeader({
      labelKey: "",
    }),
  });
  return {
    uiFramework: "custom-atoms",
    componentPath: "Container",
    children: {
      header: {
        gridDefination: {
          xs: 12,
          sm: 10,
        },
        ...header,
      },
    },
  };
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "report",
  beforeInitScreen: (action, state, dispatch) => {
    getScreenData(action, state, dispatch);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css",
      },
      children: {
        header: getReportHeader(),
        commonReportForm,
        breakAfterSearch: getBreak(),
        commonReportTable,
      },
    },
  },
};

export default screenConfig;
