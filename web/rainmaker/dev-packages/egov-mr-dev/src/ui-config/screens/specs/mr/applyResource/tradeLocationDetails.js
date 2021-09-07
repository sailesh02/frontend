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
        //labelKey: "TL_NEW_TRADE_DETAILS_HEADER_TRADE_LOC_DETAILS"
        labelKey: "Marriage Details"
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
            labelKey: "TL_NEW_TRADE_DETAILS_CITY_LABEL"
          },
          localePrefix: {
            moduleName: "TENANT",
            masterName: "TENANTS"
          },
          optionLabel: "name",
          placeholder: { labelName: "Select City", labelKey: "TL_SELECT_CITY" },
          sourceJsonPath: "applyScreenMdmsData.tenant.tenants",
          jsonPath: "Licenses[0].tradeLicenseDetail.address.tenantId",
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
              "Licenses[0].tradeLicenseDetail.address.city",
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

      // tradeLocDoorHouseNo: getTextField({
      //   label: {
      //     labelName: "Door/House No.",
      //     labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
      //   },
      //   props:{
      //     className:"applicant-details-error"
      //   },
      //   placeholder: {
      //     labelName: "Enter Door/House No.",
      //     labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_PLACEHOLDER"
      //   },
      //   pattern: getPattern("DoorHouseNo"),
      //   jsonPath: "Licenses[0].tradeLicenseDetail.address.doorNo",
      //   required: true,
      // }),
      // // tradeLocBuilidingName: getTextField({
      // //   label: {
      // //     labelName: "Building/Colony Name",
      // //     labelKey: "TL_NEW_TRADE_DETAILS_BLDG_NAME_LABEL"
      // //   },
      // //   props:{
      // //     className:"applicant-details-error"
      // //   },
      // //   placeholder: {
      // //     labelName: "Enter Building/Colony Name",
      // //     labelKey: "TL_NEW_TRADE_DETAILS_BLDG_NAME_PLACEHOLDER"
      // //   },
      // //   pattern: getPattern("BuildingStreet"),
      // //   jsonPath: "Licenses[0].tradeLicenseDetail.address.buildingName",
      // //   required: true,
      // // }),
      // // tradeLocStreetName: getTextField({
      // //   label: {
      // //     labelName: "Street Name",
      // //     labelKey: "TL_NEW_TRADE_DETAILS_SRT_NAME_LABEL"
      // //   },
      // //   props:{
      // //     className:"applicant-details-error"
      // //   },
      // //   placeholder: {
      // //     labelName: "Enter Street Name",
      // //     labelKey: "TL_NEW_TRADE_DETAILS_SRT_NAME_PLACEHOLDER"
      // //   },
      // //   pattern: getPattern("BuildingStreet"),
      // //   jsonPath: "Licenses[0].tradeLicenseDetail.address.street",
      // //   required: true,
      // // }),
      tradeLocMohalla: {
        uiFramework: "custom-containers-local",
        moduleName: "egov-tradelicence",
        componentPath: "AutosuggestContainer",
        jsonPath: "Licenses[0].tradeLicenseDetail.address.locality.code",
        required: true,
        props: {
          style: {
            width: "100%",
            cursor: "pointer"
          },
          label: {
            labelName: "Mohalla",
            labelKey: "TL_NEW_TRADE_DETAILS_MOHALLA_LABEL"
          },
          placeholder: {
            labelName: "Select Mohalla",
            labelKey: "TL_NEW_TRADE_DETAILS_MOHALLA_PLACEHOLDER"
          },
          jsonPath: "Licenses[0].tradeLicenseDetail.address.locality.code",
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
            labelKey: "TL_NEW_TRADE_DETAILS_WARD_LABEL"
          },

          optionLabel: "name",
          placeholder: { labelName: "Select Ward", labelKey: "TL_SELECT_WARD" },
          sourceJsonPath: "applyScreenMdmsData.TradeLicense.Ward.Ward",
          jsonPath: "Licenses[0].tradeLicenseDetail.address.ward",
          required: true,
          props: {
            required: true,

          }

        })
      },
      tradeLocDoorHouseNo: getTextField({
        label: {
          labelName: "Door/House No.",
          //labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_LABEL"
          labelKey: "Place of Marriage"
        },
        props:{
          className:"applicant-details-error"
        },
        placeholder: {
          labelName: "Enter Door/House No.",
          labelKey: "TL_NEW_TRADE_DETAILS_DOOR_NO_PLACEHOLDER"
        },
        pattern: getPattern("DoorHouseNo"),
        jsonPath: "Licenses[0].tradeLicenseDetail.address.mrgplace",
        required: true,
      }),

      tradeToDate: {
        ...getDateField({
          label: { labelName: "To Date",
          labelKey: "Marriage Date"
          //labelKey: "TL_NEW_TRADE_DETAILS_TRADE_END_DATE_LABEL"

        },
          placeholder: {
            labelName: "Trade License From Date",
            //labelKey: "TL_TRADE_LICENCE_TO_DATE"
            labelKey: "Marriage Date"
          },

          required: true,

          pattern: getPattern("Date"),
          jsonPath: "Licenses[0].mrgdate",

          props: {

            inputProps: {

              min: getCurrentDate()

            }
          }
        }),

      },
    },
    {
      style:getQueryArg(window.location.href, "action") === "EDITRENEWAL"? {"pointer-events":"none"}:{}
    }
    ),
    mapsDialog: {
      componentPath: "Dialog",
      props: {
        open: false
      },
      children: {
        dialogContent: {
          componentPath: "DialogContent",
          children: {
            popup: getMapLocator()
          }
        }
      }
    }
  },
  {
    style:getQueryArg(window.location.href, "action") === "EDITRENEWAL"? {"cursor":"not-allowed",overflow:"visible"}:{overflow: "visible"}

  }
);
