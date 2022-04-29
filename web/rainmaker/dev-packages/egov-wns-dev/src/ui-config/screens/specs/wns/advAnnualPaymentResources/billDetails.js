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

export const getcurrentDueBill = () => {
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
                   
                    jsonPath: "currentDueBill"
                }
            ),
            
        })
    })
};
