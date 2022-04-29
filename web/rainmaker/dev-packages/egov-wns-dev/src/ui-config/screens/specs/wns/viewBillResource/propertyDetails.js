import {
    getCommonGrayCard,
    getCommonSubHeader,
    getCommonContainer,
    getLabelWithValue,
    getLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import store from "ui-redux/store";

let tenantId = getQueryArg(window.location.href, "tenantId");
let localityPrefix = tenantId && tenantId.toUpperCase()
const gotoAdvAnnualBill = (state, dispatch) => {
    
    let connectionNumber = getQueryArg(window.location.href, "connectionNumber");
    let service = getQueryArg(window.location.href, "service");
    let connectionType = getQueryArg(window.location.href, "connectionType");
    let connectionFacility = getQueryArg(window.location.href, "connectionFacility");
    
    
    
    const url = `advAnnualPayment?connectionNumber=${connectionNumber}&tenantId=${tenantId}&service=${service}&connectionType=${connectionType}&connectionFacility=${connectionFacility}`
    store.dispatch(setRoute(url));
}
export const getProperty = () => {
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
                        labelKey: "WS_COMMON_PROP_DETAIL" //TL_COMMON_OWN_DETAILS
                    })
                },

            }
        },
        propertyCardContainer: getCommonContainer({
            propertyCity: getLabelWithValue(
                {
                    labelKey: "WS_PROP_DETAIL_CITY"
                },
                {
                    localePrefix: {
                        moduleName: "TENANT",
                        masterName: "TENANTS"
                    },
                    jsonPath: "WaterConnection[0].tenantId"
                }
            ),
            // propertyDoorNo: getLabelWithValue(
            //     {
            //         labelKey: "WS_PROP_DETAIL_PHNO_LABEL"
            //     },
            //     {
            //         jsonPath: "WaterConnection[0].property.address.doorNo"
            //     }
            // ),
            // propertyBuilding: getLabelWithValue(
            //     {
            //         labelKey: "WS_PROP_DETAIL_BUILD_NAME_LABEL"
            //     },
            //     {
            //         jsonPath: "WaterConnection[0].property.address.buildingName"
            //     }
            // ),
            // propertyStreet: getLabelWithValue(
            //     {
            //         labelKey: "WS_PROP_DETAIL_STREET_NAME"
            //     },
            //     {
            //         jsonPath: "WaterConnection[0].property.address.street"
            //     }
            // ),
            propertyMohalla: getLabelWithValue(
                {
                    labelKey: "WS_PROP_DETAIL_LOCALITY_MOHALLA_LABEL",
                },
                {
                    localePrefix: {
                        moduleName: localityPrefix,
                        masterName: "REVENUE"
                      },
                    jsonPath: "WaterConnection[0].additionalDetails.locality"
                }
            ),
            // propertyPincode: getLabelWithValue(
            //     {
            //         labelKey: "WS_PROP_DETAIL_PINCODE"
            //     },
            //     {
            //         jsonPath: "WaterConnection[0].property.address.pincode"
            //     }
            // )
        })
    })
};

export const getAdvAnualPaymentButton = () => {
    return getCommonGrayCard({
        // downloadButton: {
        //     componentPath: "Button",
        //     gridDefination: {
        //         xs: 12,
        //         sm: 2,
        //         align: "right"
        //       },
        //     props: {
        //       variant: "contained",
        //       color: "primary",
        //       style: {
        //         minWidth: "200px",
        //         height: "48px",
        //         marginRight: "16px"
        //       }
        //     },
        //     children: {
        //       downloadButton: getLabel({
        //         labelKey: "WS_ADV_ANNUAL_BILL_BUTTON"
        //       })
        //     },
        //     onClickDefination: {
        //       action: "condition",
        //       callBack: (state, dispatch) => {
        //         gotoAdvAnnualBill(state,dispatch);
        //       }
        //     },
        //   },
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
                    }
                  },
                downloadButton: {
                    componentPath: "Button",
                    gridDefination: {
                        xs: 12,
                        sm: 2,
                        align: "right"
                      },
                    props: {
                      variant: "contained",
                      color: "primary",
                      style: {
                        minWidth: "200px",
                        height: "48px",
                        marginRight: "16px"
                      }
                    },
                    children: {
                      downloadButton: getLabel({
                        labelKey: "WS_ADV_ANNUAL_BILL_BUTTON"
                      })
                    },
                    onClickDefination: {
                      action: "condition",
                      callBack: (state, dispatch) => {
                        gotoAdvAnnualBill(state,dispatch);
                      }
                    },
                  },
            }}
        
        
    })
};