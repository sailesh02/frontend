import { plotDetails } from "./plotDetails";
import { buildingAbstract } from "./buildingAbstract";
import {proposedBuildingDetails} from "./blockDetails";
import {uploadDocuments} from "./documents";
import { footer } from "./footer";

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