import { taxCollectorWiseCollectionForm } from "../reportForms/taxCollectorWiseCollectionForm";
import { ulbWiseTaxCollectionForm } from "../reportForms/ulbWiseTaxCollectionForm";
import { propertyDetailsForm } from "../reportForms/propertyDetailsForm";
import { propertyWiseCollectionForm } from "../reportForms/propertyWiseCollectionForm";
import { propertyWiseDemandsForm } from "../reportForms/propertyWiseDemandsForm";

// import and add form items array
export const REPORT_FORM_ITEMS_MAPPER = {
  taxCollectorWiseCollection: taxCollectorWiseCollectionForm,
  ulbWiseTaxCollection: ulbWiseTaxCollectionForm,
  propertyDetails: propertyDetailsForm,
  propertyWiseCollection: propertyWiseCollectionForm,
  propertyWiseDemands: propertyWiseDemandsForm,
};
