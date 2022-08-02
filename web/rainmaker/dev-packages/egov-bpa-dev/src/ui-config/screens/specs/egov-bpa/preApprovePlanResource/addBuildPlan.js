import {
  getCommonCard,
  getCommonContainer,
  getCommonTitle,
  getBreak,
  getLabel,
  getSelectField,
  getTextField,
  getLabelWithValue,
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { plotDetails } from "./plotDetails";
import { buildingAbstract } from "./buildingAbstract";
import {proposedBuildingDetails} from "./blockDetails";
import {uploadDocuments} from "./documents";
import { footer } from "./footer";
import store from "ui-redux/store";
import get from "lodash/get";
import {
  prepareFinalObject,
  handleScreenConfigurationFieldChange as handleField,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { validateFields } from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from "../../../../../ui-utils/api";
import { getLoggedinUserRole } from "../../utils";
import { getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import jp from "jsonpath";

import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";



// Object contains the all above section and generating add pre approved tab content
export const addPreApprovedPlanDetails = {
  uiFramework: "custom-atoms",
  componentPath: "Form",

  props: {
    id: "apply_form2",
  },
  children: {
    plotDetails,
    proposedBuildingDetails,
    buildingAbstract,
    uploadDocuments,
    footer,
  },
};