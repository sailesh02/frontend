import { httpRequest } from "../../../../../ui-utils/api";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
export const getMdmsData = async (action, state, dispatch) => {
  // To do list
  const subOccupancySelect = async(payload) => {
    let subOccupancy = await ["A-P","A-S","A-R"];
    let preApproveSubOccupancy = []
    return preApproveSubOccupancy
  }
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
    
    let preApproveSubOccupancy = [
      {
        "name": "Residential Plotted",
        "code": "A-P",
        "active": true,
        "occupancyType": "A",
        "maxCoverage": "65",
        "minFar": "3",
        "maxFar": "4",
        "orderNumber": "1",
        "description": "Plotted Detached/Individual Residential building",
        "colorCode": "11"
    },
    {
        "name": "Semi-detached",
        "code": "A-S",
        "active": true,
        "occupancyType": "A",
        "maxCoverage": "66",
        "minFar": "4",
        "maxFar": "5",
        "orderNumber": "2",
        "description": "Semi-detached",
        "colorCode": "12"
    },
    {
        "name": "Row housing",
        "code": "A-R",
        "active": true,
        "occupancyType": "A",
        "maxCoverage": "67",
        "minFar": "5",
        "maxFar": "6",
        "orderNumber": "3",
        "description": " Row housing",
        "colorCode": "13"
    }
    ]
    dispatch(prepareFinalObject("subOccupancyPa", preApproveSubOccupancy));
    dispatch(prepareFinalObject("applyScreenMdmsData", payload.MdmsRes));
    dispatch(prepareFinalObject("residentialOccupacy", payload.MdmsRes.BPA.OccupancyType[0]));
  } catch (e) {
    console.log(e);
  }
};