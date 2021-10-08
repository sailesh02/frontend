import {
  getCommonCard,
  getCommonTitle,
  getTextField,
  getSelectField,
  getCommonContainer,
  getPattern,
  getDateField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { httpRequest } from "../../../../../ui-utils/api";
import { getMapLocator } from "../../utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { showHideMapPopup, getDetailsFromProperty } from "../../utils";
import { handleScreenConfigurationFieldChange as handleField } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import "./index.css";

const getCurrentDate = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + '-' + mm + '-' + dd;
  return today;
}
export const tradeLocationDetails = getCommonCard(
  {
    header: getCommonTitle(
      {
        labelName: "Trade Location Details",
        labelKey: "MR_DETAILS_HEADER"
      },
      {
        style: {
          marginBottom: 18
        }
      }
    ),

    tradeDetailsConatiner: getCommonContainer({
      tradeLocCity: {
        ...getSelectField({
          label: {
            labelName: "City",
            labelKey: "MR_CITY_LABEL"
          },
          localePrefix: {
            moduleName: "TENANT",
            masterName: "TENANTS"
          },
          optionLabel: "name",
          placeholder: { labelName: "Select City", labelKey: "MR_CITY_PLACEHOLDER" },
          sourceJsonPath: "applyScreenMdmsData.tenant.tenants",
          jsonPath: "MarriageRegistrations[0].tenantId",
          required: true,
          props: {
            required: true,
            disabled: true
          }
        }),
        beforeFieldChange: async (action, state, dispatch) => {
          //Below only runs for citizen - not required here in employee

          dispatch(
            prepareFinalObject(
              "MarriageRegistrations[0].tenantId",
              action.value
            )
          );
          try {
            let payload = await httpRequest(
              "post",
              "/egov-location/location/v11/boundarys/_search?hierarchyTypeCode=REVENUE&boundaryType=Locality",
              "_search",
              [{ key: "tenantId", value: action.value }],
              {}
            );
            const mohallaData =
              payload &&
              payload.TenantBoundary[0] &&
              payload.TenantBoundary[0].boundary &&
              payload.TenantBoundary[0].boundary.reduce((result, item) => {
                result.push({
                  ...item,
                  name: `${action.value
                    .toUpperCase()
                    .replace(
                      /[.]/g,
                      "_"
                    )}_REVENUE_${item.code
                    .toUpperCase()
                    .replace(/[._:-\s\/]/g, "_")}`
                });
                return result;
              }, []);
            dispatch(
              prepareFinalObject(
                "applyScreenMdmsData.tenant.localities",
                mohallaData
              )
            );
            dispatch(
              handleField(
                "apply",
                "components.div.children.formwizardFirstStep.children.tradeLocationDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLocMohalla",
                "props.suggestions",
                mohallaData
                // payload.TenantBoundary && payload.TenantBoundary[0].boundary
              )
            );
            const mohallaLocalePrefix = {
              moduleName: action.value,
              masterName: "REVENUE"
            };
            dispatch(
              handleField(
                "apply",
                "components.div.children.formwizardFirstStep.children.tradeLocationDetails.children.cardContent.children.tradeDetailsConatiner.children.tradeLocMohalla",
                "props.localePrefix",
                mohallaLocalePrefix
              )
            );
          } catch (e) {
            console.log(e);
          }
        }
      },


      tradeLocMohalla: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-mr",
        componentPath: "AutosuggestContainer",
        jsonPath: "MarriageRegistrations[0].marriagePlace.locality.code",
        required: true,
        props: {
          style: {
            width: "100%",
            cursor: "pointer"
          },
          label: {
            labelName: "Mohalla",
            labelKey: "MR_MOHALLA_LABEL"
          },
          placeholder: {
            labelName: "Select Mohalla",
            labelKey: "MR_MOHALLA_PLACEHOLDER"
          },
          jsonPath: "MarriageRegistrations[0].marriagePlace.locality.code",
          sourceJsonPath: "applyScreenMdmsData.tenant.localities",
          labelsFromLocalisation: true,
          suggestions: [],
          fullwidth: true,
          isClearable: true,
          required: true,
          inputLabelProps: {
            shrink: true
          }
          // className: "tradelicense-mohalla-apply"
        },
        beforeFieldChange: async (action, state, dispatch) => {
          // dispatch(
          //   prepareFinalObject(
          //     "Licenses[0].tradeLicenseDetail.address.locality.name",
          //     action.value && action.value.label
          //   )
          // );
        },
        gridDefination: {
          xs: 12,
          sm: 6
        }
      },
      // tradeLocPincode: getTextField({
      //   label: {
      //     labelName: "Pincode",
      //     labelKey: "TL_NEW_TRADE_DETAILS_PIN_LABEL"
      //   },
      //   props:{
      //     className:"applicant-details-error"
      //   },
      //   placeholder: {
      //     labelName: "Enter Pincode",
      //     labelKey: "TL_NEW_TRADE_DETAILS_PIN_PLACEHOLDER"
      //   },
      //   pattern: getPattern("Pincode"),
      //   jsonPath: "Licenses[0].tradeLicenseDetail.address.pincode",
      //   required: true,
      // }),

      tradeLocWard: {
        ...getSelectField({
          label: {
            labelName: "Ward",
            labelKey: "MR_WARD_LABEL"
          },

          optionLabel: "name",
          placeholder: { labelName: "Select Ward", labelKey: "MR_WARD_PLACEHOLDER" },
          sourceJsonPath: "applyScreenMdmsData.MarriageRegistration.Ward.Ward",
          jsonPath: "MarriageRegistrations[0].marriagePlace.ward",
          required: true,
          props: {
            required: true,

          }

        })
      },
      tradeLocDoorHouseNo: getTextField({
        label: {
          labelName: "Door/House No.",
          labelKey: "MR_MARRIAGEPLACE_LABEL"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "MR_MARRIAGEPLACE_PLACEHOLDER"
        },
        pattern: getPattern("DoorHouseNo"),
        jsonPath: "MarriageRegistrations[0].marriagePlace.placeOfMarriage",
        required: true,
      }),

      tradeToDate: {
        ...getDateField({
          label: { labelName: "Marriage Date",
          labelKey: "MR_MARRIAGEDATE_LABEL"

        },
          placeholder: {
            labelName: "Trade License From Date",
            labelKey: "MR_MARRIAGEDATE_PLACEHOLDER"
          },

          required: true,

          pattern: getPattern("Date"),
          jsonPath: "MarriageRegistrations[0].marriageDate",

          props: {

            inputProps: {

              max: getCurrentDate()

            }
          }
        }),

      },
      mrgPlaceAddressPin: getTextField({
        label: {
          labelName: "Door/House No.",
          labelKey: "MR_PINCODE_LABEL"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "MR_PINCODE_PLACEHOLDER"
        },
       // required: true,
        //pattern: getPattern("Address"),
        jsonPath: "MarriageRegistrations[0].marriagePlace.pinCode",

      }),
    },
    {
      style:getQueryArg(window.location.href, "action") === "CORRECTION"? {"pointer-events":"none"}:{}
    }
    ),

  },
  {
    style:getQueryArg(window.location.href, "action") === "CORRECTION"? {"cursor":"not-allowed",overflow:"visible"}:{overflow: "visible"}

  }
);
