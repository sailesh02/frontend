import { getCommonHeader, getBreak } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { bulkMeterReadingData } from "./searchResource/bulkMeterReadingData";
import "./index.css";
import { bulkImportApplication } from './searchResource/bulkImportApplication';
import { getMdmsDataForMeterStatus } from "../../../../ui-utils/commons"
import {bulkImportFooter} from './applyResource/bulkImportFooter'

const header = getCommonHeader({
  labelKey: "WS_BULK_METER_READING_IMPORT"
});

const getData = async (action, state, dispatch) => {
  await getMdmsDataForMeterStatus(dispatch)
}

const screenConfig = {
  uiFramework: "material-ui",
  name: "bulkImport",
  beforeInitScreen: (action, state, dispatch) => {
    getData(action, state, dispatch).then(() => {
    });
    dispatch(prepareFinalObject('meterReadingBulk',[]))
    dispatch(prepareFinalObject('meterReading',[]))
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "search"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",

          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 6
              },
              ...header
            }
          }
        },
        bulkImportApplication,
        breakAfterSearch: getBreak(),
        bulkMeterReadingData,
        bulkImportFooter
      }
    },
  }
};

export default screenConfig;

