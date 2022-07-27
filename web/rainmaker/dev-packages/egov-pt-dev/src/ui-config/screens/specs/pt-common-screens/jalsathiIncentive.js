import commonConfig from "config/common.js";
import {
  getCommonContainer,
  getCommonHeader,
  getBreak,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  prepareFinalObject,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "../../../../ui-utils";
import get from "lodash/get";
import { reportSearchForm, searchResults } from "./incentiveReport/incentiveReportForm";

const getMdmsData = async (action, state, dispatch) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants",
            },
          ],
        },
      ],
    },
  };

  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    const localities = get(
      state.screenConfiguration,
      "preparedFinalObject.applyScreenMdmsData.tenant.localities",
      []
    );
    if (localities && localities.length > 0) {
      payload.MdmsRes.tenant.localities = localities;
    }
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
  } catch (e) {
    console.log(e);
  }
};

export const getData = async (action, state, dispatch) => {
  await getMdmsData(action, state, dispatch);
};

export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Jalsathi Incentive Report`,
    labelKey: "Jalsathi Incentive Report",
  }),
});

const screenConfig = {
  uiFramework: "material-ui",
  name: "jalsathiIncentive",
  beforeInitScreen: (action, state, dispatch) => {
    dispatch(prepareFinalObject(`reportForm`, {}));
    dispatch(prepareFinalObject("incentiveReport", []));
    getData(action, state, dispatch);

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
        headerDiv: {
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
        },
        reportSearchForm,
        breakAfterSearch: getBreak(),
        searchResults,
      },
    },
  },
};

export default screenConfig;