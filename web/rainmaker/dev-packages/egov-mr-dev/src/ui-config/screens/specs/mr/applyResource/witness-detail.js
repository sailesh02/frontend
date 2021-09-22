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
        labelKey: "MR_BRIDE_WITNESS_HEADER"
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
        labelKey: "MR_NAME_LABEL"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].bride.witness.firstName",

      }
    ),

    witness1Address: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_ADDRESS_LABEL"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].bride.witness.address",

      }
    ),

    witness1District: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_DISTRICT_LABEL"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].bride.witness.district",

      }
    ),


    witness1State: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_STATE_LABEL"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].bride.witness.state",

      }
    ),

    witness1Country: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_COUNTRY_LABEL"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].bride.witness.country",

      }
    ),
    witness1AddressPin: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_PINCODE_LABEL"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].bride.witness.pinCode",

      }
    ),

    witness1Contact: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_CONTACT_LABEL"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].bride.witness.contact",

      }
    ),

  }

  export const witness2Details = {

    header: getCommonTitle(
      {
        labelName: "Trade Location Details",
        labelKey: "MR_GROOM_WITNESS_HEADER"
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
        labelKey: "MR_NAME_LABEL"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].groom.witness.firstName",

      }
    ),

    witness2Address: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_ADDRESS_LABEL"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].groom.witness.address",

      }
    ),

    witness2District: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_DISTRICT_LABEL"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].groom.witness.district",

      }
    ),


    witness2State: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_STATE_LABEL"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].groom.witness.state",

      }
    ),

    witness2Country: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_COUNTRY_LABEL"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].groom.witness.country",

      }
    ),

    witness2AddressPin: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_PINCODE_LABEL"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].groom.witness.pinCode",

      }
    ),

    witness2Contact: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_CONTACT_LABEL"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].groom.witness.contact",

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
              labelKey: "MR_WITNESS_DETAIL_HEADER"
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
