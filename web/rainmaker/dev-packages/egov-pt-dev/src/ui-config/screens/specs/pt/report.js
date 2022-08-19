import {
  getBreak,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  prepareFinalObject,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { commonReportForm, commonReportTable } from "./reportResources/commonReportForm";
import { getReportHeader } from "./reportResources/reportComponents";
import { setDropdownOpts, getMdmsData } from "./reportResources/reportActions/commonReportActions";

export const getScreenData = async (action, state, dispatch) => {
  await getMdmsData(action, state, dispatch);
  setDropdownOpts(action, state, dispatch);
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "report",
  beforeInitScreen: (action, state, dispatch) => {
    dispatch(prepareFinalObject(`reportForm`, {}));
    dispatch(prepareFinalObject("reportTableData", []));
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