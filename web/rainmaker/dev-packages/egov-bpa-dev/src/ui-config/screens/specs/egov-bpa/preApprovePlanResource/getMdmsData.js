import { httpRequest } from "../../../../../ui-utils/api";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
export const getMdmsData = async (action, state, dispatch) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: getTenantId(),
      moduleDetails: [
        {
          moduleName: "common-masters",
          masterDetails: [
            {
              name: "DocumentType",
            },
            {
              name: "OwnerType",
            },
            {
              name: "OwnerShipCategory",
            },
          ],
        },
        {
          moduleName: "BPA",
          masterDetails: [
            {
              name: "DocTypeMapping",
            },
            {
              name: "ApplicationType",
            },
            {
              name: "ServiceType",
            },
            {
              name: "RiskTypeComputation",
            },
            {
              name: "OccupancyType",
            },
            {
              name: "SubOccupancyType",
            },
            {
              name: "Usages",
            },
            {
              name: "ProposedLandUse",
            },
            {
              name: "TownPlanningScheme",
            },
            {
              name: "NocTypeMapping",
            },
          ],
        },
        {
          moduleName: "TradeLicense",
          masterDetails: [
            { name: "TradeType", filter: `[?(@.type == "BPA")]` },
          ],
        },
        {
          moduleName: "NOC",
          masterDetails: [
            {
              name: "DocumentTypeMapping",
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
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
    dispatch(prepareFinalObject("residentialOccupacy", payload.MdmsRes.BPA.OccupancyType[0]));
  } catch (e) {
    console.log(e);
  }
};