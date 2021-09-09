import {
    getCommonContainer, getCommonGrayCard,
    getCommonSubHeader,
    getCommonTitle,

    getDivider,
    getLabel, getLabelWithValue
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import { checkValueForNA, convertEpochToDate } from "../../utils";
  import { changeStep } from "./footer";


  export const witness1Details = {

    header: getCommonTitle(
      {
        labelName: "Trade Location Details",
        //labelKey: "TL_NEW_TRADE_DETAILS_HEADER_TRADE_LOC_DETAILS"
        labelKey: "MR_WITNESS_1_DETAIL"
      },
      {
        style: {
          marginBottom: 18,
          fontSize: 15,
          width: "100%"
        }
      }
    ),


    witness1Fname: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_NAME"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].witness[0].firstName",

      }
    ),

    witness1Address: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_ADDRESS"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].witness[0].address",

      }
    ),

    witness1Country: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_COUNTRY"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].witness[0].country",

      }
    ),

    witness1State: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_STATE"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].witness[0].state",

      }
    ),

    witness1District: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_DISTRICT"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].witness[0].district",

      }
    ),

    witness1AddressPin: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_PIN_CODE"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].witness[0].pinCode",

      }
    ),

    witness1Contact: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_CONTACT"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].witness[0].contact",

      }
    ),

  }

  export const witness2Details = {

    header: getCommonTitle(
      {
        labelName: "Trade Location Details",
        //labelKey: "TL_NEW_TRADE_DETAILS_HEADER_TRADE_LOC_DETAILS"
        labelKey: "MR_WITNESS_2_DETAIL"
      },
      {
        style: {
          marginBottom: 18,
          fontSize: 15,
          width: "100%"
        }
      }
    ),


    witness2Fname: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_NAME"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].witness[1].firstName",

      }
    ),

    witness2Address: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_ADDRESS"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].witness[1].address",

      }
    ),

    witness2Country: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_COUNTRY"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].witness[1].country",

      }
    ),

    witness2State: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_STATE"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].witness[1].state",

      }
    ),

    witness2District: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_DISTRICT"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].witness[1].district",

      }
    ),

    witness2AddressPin: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_PIN_CODE"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].witness[1].pinCode",

      }
    ),

    witness2Contact: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_CONTACT"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].witness[1].contact",

      }
    ),

  }

  export const getWitnessDetails = (isEditable = true) => {
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
              labelName: "Trade Details",
              labelKey: "MR_BRIDE_ADDRESS_GUARDIAN_DETAIL"
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
                changeStep(state, dispatch, "", 0);
              }
            }
          }
        }
      },
      viewOne: getCommonContainer(witness1Details),
      div2: getDivider(),
      viewTwo: getCommonContainer(witness2Details),

    });
  };
