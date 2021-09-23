import {
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer,
  getLabelWithValue,
  getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleNA } from '../../utils';
import {getTenantId} from '../../../../../ui-utils/commons'
import { changeStep } from "../viewBillResource/footer";

const getHeader = label => {
  return {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-wns",
    componentPath: "DividerWithLabel",
    props: {
      className: "hr-generic-divider-label",
      labelProps: {},
      dividerProps: {},
      label
    },
    type: "array"
  };
};

const properyDetailsHeader = getHeader({
  labelKey: "WS_COMMON_PROP_DETAIL_HEADER"
});
const propertyLocationDetailsHeader = getHeader({
  labelKey: "WS_COMMON_PROP_LOC_DETAIL_HEADER"
});

// const propertyDetails = getCommonContainer({
//   propertyType: getLabelWithValue(
//     {
//       labelKey: "WS_PROPERTY_TYPE_LABEL"
//     },
//     {
//       jsonPath:
//       "WaterConnection[0].property.propertyType",
//       localePrefix: {
//         moduleName: "WS",
//         masterName: "PROPTYPE"
//       }
//     }
//   ),
//   propertyUsageType: getLabelWithValue(
//     {
//       labelKey: "WS_PROPERTY_USAGE_TYPE_LABEL"
//     },
//     { jsonPath: "WaterConnection[0].property.usageCategory",
//     localePrefix: {
//       moduleName: "WS",
//       masterName: "PROPUSGTYPE"
//     }
//  }
//   ),
//   plotSize: getLabelWithValue(
//     {
//       labelKey: "WS_PROP_DETAIL_PLOT_SIZE_LABEL"
//     },
//     {
//       jsonPath: "WaterConnection[0].property.landArea"
//     }
//   )
// })
 
const propertyDetails= getCommonContainer({
  reviewPropertyId: getLabelWithValue(
    {
      labelName: "Property Id",
      labelKey: "WS_PROPERTY_ID_LABEL"
    },
    {
      jsonPath: "WaterConnection[0].property.propertyId",
      callBack: handleNA
    }
  ),
  reviewPropertyUsageType: getLabelWithValue(
    {
      labelName: "Property Usage Type",
      labelKey: "WS_PROPERTY_USAGE_TYPE_LABEL"
    },
    {
      jsonPath: "WaterConnection[0].usageCategory",
      callBack: handleNA,
      localePrefix: {
        moduleName: "WS",
        masterName: "PROPUSGTYPE"
      }        
    }
  ),
  city: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "CORE_COMMON_CITY"
    },
    {
      jsonPath: "WaterConnection[0].tenantId",
      callBack: handleNA,
      localePrefix: {
        moduleName: "tenant", masterName: "tenants"
      }
    }

  ),
  mohalla: getLabelWithValue(
    {
      labelName: "mohalla",
      labelKey: "PT_PROPERTY_DETAILS_MOHALLA"
    },
    {
      jsonPath: "WaterConnection[0].locality",
      localePrefix: {
        moduleName: getTenantId(), masterName: "REVENUE"
      },
      callBack: handleNA,
    }

  ),
  ward: getLabelWithValue(
    {
      labelName: "Ward",
      labelKey: "WS_WARD_LABEL"
    },
    {
      jsonPath: "WaterConnection[0].additionalDetails.ward",
      callBack: handleNA,
    }

  ),
  connectionCategory: getLabelWithValue(
    {
      labelName: "Connection Category",
      labelKey: "WS_PROPERTY_CONNECTION_CATEGORY_LABEL"
    },
    {
      jsonPath: "WaterConnection[0].connectionCategory",
      callBack: handleNA,
      localePrefix: {
        moduleName: "WS",
        masterName: "PROPTYPE"
      },
    }

  ),
  connectionType: getLabelWithValue(
    {
      labelName: "Connection Type",
      labelKey: "WS_PROPERTY_CONNECTION_TYPE_LABEL"
    },
    {
      jsonPath: "WaterConnection[0].connectionType",
      callBack: handleNA,
      localePrefix: {
        moduleName: "WS",
        masterName: "PROPTYPE"
      },
    }

  ),
  noOfFlats: getLabelWithValue(
    {
      labelName: "No of Flats",
      labelKey: "WS_PROPERTY_NO_OF_FLATS_LABEL"
    },
    {
      jsonPath: "WaterConnection[0].noOfFlats",
      // callBack: handleNA
     
    }

  ),
  apartment: getLabelWithValue(
    {
      labelName: "Apartment",
      labelKey: "WS_COMMON_APARTMENT"
    },
    {
      jsonPath: "WaterConnection[0].apartment",
      callBack: handleNA
     
    }

  )
})

// const locationOnMap = WaterConnection[0].property.address.locality.code + WaterConnection[0].property.address.locality.code

const propertyLocationDetails = getCommonContainer({
  propertyId: getLabelWithValue(
    {
      labelKey: "WS_PROPERTY_ID_LABEL"
    },
    { jsonPath: "WaterConnection[0].property.propertyId" }
  ),
  city: getLabelWithValue(
    {
      labelKey: "WS_PROP_DETAIL_CITY"
    },
    {
      jsonPath: "WaterConnection[0].property.address.city",
    }
  ),
  plotOrHouseOrSurveyNo: getLabelWithValue(
    {
      labelKey: "WS_PROP_DETAIL_PH_SURVEYNO_LABEL"
    },
    {
      jsonPath: "WaterConnection[0].property.address.doorNo",
    }
  ),
  buildingOrColonyName: getLabelWithValue(
    {
      labelKey: "WS_PROP_DETAIL_BUILD_NAME_LABEL"
    },
    {
      jsonPath: "WaterConnection[0].property.address.buildingName"
    }
  ),
  streetName: getLabelWithValue(
    {
      labelKey: "WS_PROP_DETAIL_STREET_NAME"
    },
    {
      jsonPath: "WaterConnection[0].property.address.street"
    }
  ),
  locality: getLabelWithValue(
    {
      labelKey: "WS_PROP_DETAIL_LOCALITY_LABEL"
    },
    {
      jsonPath: "WaterConnection[0].property.address.locality.name",
    }
  ),
  pincode: getLabelWithValue(
    {
      labelKey: "WS_PROP_DETAIL_PINCODE"
    },
    { jsonPath: "WaterConnection[0].property.address.pincode" }
  ),
  locationOnMap: getLabelWithValue(
    {
      labelKey: "WS_PROP_DETAIL_MAP_LOC"
    },
    {
      jsonPath: "WaterConnection[0].property.address.locality.locationOnMap"
    }
  ),
})

export const getPropertyDetails = (isEditable = true) => {
  return getCommonGrayCard({
    headerDiv: {
      uiFramework: "custom-atoms",
      componentPath: "Container",
      props: {
        style: { marginBottom: "10px" }
      },
      children: {
        header: {
          gridDefination: {
            xs: 12,
            sm: 10
          },
          ...getCommonSubHeader({
            labelKey: "WS_COMMON_PROP_DETAIL_HEADER"
          })
        },
        editSection: {
          componentPath: "Button",
          props: {
            color: "primary"
          },
          visible: isEditable,
          gridDefination: {
            xs: 12,
            sm: 2,
            align: "right"
          },
          children: {
            editIcon: {
              uiFramework: "custom-atoms",
              componentPath: "Icon",
              props: {
                iconName: "edit"
              }
            },
            buttonLabel: getLabel({
              labelName: "Edit",
              labelKey: "TL_SUMMARY_EDIT"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => {
              changeStep(state, dispatch, "", 1);
            }
          }
        }
      }
    },
    // viewOne: propertyDetails,
    // viewTwo: propertyLocationDetails

    viewOne: properyDetailsHeader,
    viewTwo: propertyDetails,
    // viewThree: propertyLocationDetailsHeader,
    // viewFour: propertyLocationDetails
  });
};


