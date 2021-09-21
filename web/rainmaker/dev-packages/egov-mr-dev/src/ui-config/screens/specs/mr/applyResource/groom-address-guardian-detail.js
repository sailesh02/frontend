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


  export const groomGuardianDetails = {

    header: getCommonTitle(
      {
        labelName: "Trade Location Details",
        labelKey: "MR_GROOM_GUARDIAN_HEADER"
      },
      {
        style: {
          marginBottom: 18,
          fontSize: 15,
          width: "100%"
        }
      }
    ),
    rltnWithgroom: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_GROOMGUARDIAN_RELATION_LABEL"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].groom.guardianDetails.relationship",

      }
    ),

    groomGuardianName: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_NAME_LABEL"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].groom.guardianDetails.name",

      }
    ),

    groomGrdnAddressLine1: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_ADDRESS_LABEL"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].groom.guardianDetails.addressLine1",

      }
    ),

    groomGrdnDistrict: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_DISTRICT_LABEL"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].groom.guardianDetails.district",

      }
    ),

    groomGrdnState: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_STATE_LABEL"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].groom.guardianDetails.state",

      }
    ),

    groomGrdnCountry: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_COUNTRY_LABEL"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].groom.guardianDetails.country",

      }
    ),
    groomGrdnAddressPin: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_PINCODE_LABEL"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].groom.guardianDetails.pinCode",

      }
    ),
    groomGrdnContact: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_CONTACT_LABEL"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].groom.guardianDetails.contact",

      }
    ),
    groomGrdnEmail: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_EMAIL_LABEL"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].groom.guardianDetails.emailAddress",

      }
    ),

  }

  export const brideGuardianDetails = {

    header: getCommonTitle(
      {
        labelName: "Trade Location Details",
        labelKey: "MR_BRIDE_GUARDIAN_HEADER"
      },
      {
        style: {
          marginBottom: 18,
          fontSize: 15,
          width: "100%"
        }
      }
    ),
    rltnWithBride: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_BRIDEGUARDIAN_RELATION_LABEL"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].bride.guardianDetails.relationship",

      }
    ),

    brideGuardianName: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_NAME_LABEL"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].bride.guardianDetails.name",

      }
    ),

    brideGrdnAddressLine1: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_ADDRESS_LABEL"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].bride.guardianDetails.addressLine1",

      }
    ),
    brideGrdnDistrict: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_DISTRICT_LABEL"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].bride.guardianDetails.district",

      }
    ),


    brideGrdnState: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_STATE_LABEL"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].bride.guardianDetails.state",

      }
    ),
    brideGrdnCountry: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_COUNTRY_LABEL"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].bride.guardianDetails.country",

      }
    ),
    brideGrdnAddressPin: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_PINCODE_LABEL"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].bride.guardianDetails.pinCode",

      }
    ),
    brideGrdnContact: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_CONTACT_LABEL"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].bride.guardianDetails.contact",

      }
    ),
    brideGrdnEmail: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_EMAIL_LABEL"
      },
      {
        jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].bride.guardianDetails.emailAddress",

      }
    ),

  }
  export const groomAddressDetails = {
    header: getCommonTitle(
      {
        labelName: "Trade Location Details",
        //labelKey: "TL_NEW_TRADE_DETAILS_HEADER_TRADE_LOC_DETAILS"
        labelKey: "MR_GROOM_ADDRESS"
      },
      {
        style: {
          marginBottom: 18,
          fontSize: 15,
          width: "100%"
        }
      }
    ),
    groomAddressLine1: getLabelWithValue(
      {
        labelName: "City",
        labelKey: "MR_ADDRESS"
      },
      {
        jsonPath: "MarriageRegistrations[0].coupleDetails[1].coupleAddress.addressLine1",

      }
    ),

    groomCountry: getLabelWithValue(
      {
        labelName: "City",
        labelKey: "MR_COUNTRY"
      },
      {
        jsonPath: "MarriageRegistrations[0].coupleDetails[1].coupleAddress.country",

      }
    ),

    groomState: getLabelWithValue(
      {
        labelName: "City",
        labelKey: "MR_STATE"
      },
      {
        jsonPath: "MarriageRegistrations[0].coupleDetails[1].coupleAddress.state",

      }
    ),
    groomDistrict: getLabelWithValue(
      {
        labelName: "City",
        labelKey: "MR_DISTRICT"
      },
      {
        jsonPath: "MarriageRegistrations[0].coupleDetails[1].coupleAddress.district",

      }
    ),
    groomAddressPin: getLabelWithValue(
      {
        labelName: "City",
        labelKey: "MR_PIN_CODE"
      },
      {
        jsonPath: "MarriageRegistrations[0].coupleDetails[1].coupleAddress.pinCode",

      }
    ),
    groomDob: getLabelWithValue(
      {
        labelName: "City",
        labelKey: "MR_DATE_OF_BIRTH"
      },
      {
        jsonPath: "MarriageRegistrations[0].coupleDetails[1].dateOfBirth",
        callBack: convertEpochToDate
      }
    ),

  }
  export const getgroomAddressAndGuardianDetails = (isEditable = true) => {
    return getCommonGrayCard({
      headerDiv4: {
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
              labelKey: "MR_GUARDIAN_DETAIL_HEADER"
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
                labelKey: "MR_SUMMARY_EDIT"
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
      viewseven: getCommonContainer(brideGuardianDetails),
      div3: getDivider(),
      vieweight: getCommonContainer(groomGuardianDetails),

    });
  };


