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


export const brideGuardianDetails = {

  header: getCommonTitle(
    {
      labelName: "Trade Location Details",
      //labelKey: "TL_NEW_TRADE_DETAILS_HEADER_TRADE_LOC_DETAILS"
      labelKey: "Bride Guardian Details"
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
      labelKey: "Relationship"
    },
    {
      jsonPath:
      "MarriageRegistrations[0].coupleDetails[0].guardianDetails.relationship",

    }
  ),

  brideGuardianName: getLabelWithValue(
    {
      labelName: "Application Type",
      labelKey: "Name"
    },
    {
      jsonPath:
      "MarriageRegistrations[0].coupleDetails[0].guardianDetails.name",

    }
  ),

  brideGrdnAddressLine1: getLabelWithValue(
    {
      labelName: "Application Type",
      labelKey: "Address"
    },
    {
      jsonPath:
      "MarriageRegistrations[0].coupleDetails[0].guardianDetails.addressline1",

    }
  ),
  brideGrdnDistrict: getLabelWithValue(
    {
      labelName: "Application Type",
      labelKey: "District"
    },
    {
      jsonPath:
      "MarriageRegistrations[0].coupleDetails[0].guardianDetails.district",

    }
  ),


  brideGrdnState: getLabelWithValue(
    {
      labelName: "Application Type",
      labelKey: "State"
    },
    {
      jsonPath:
      "MarriageRegistrations[0].coupleDetails[0].guardianDetails.state",

    }
  ),
  brideGrdnCountry: getLabelWithValue(
    {
      labelName: "Application Type",
      labelKey: "Country"
    },
    {
      jsonPath:
      "MarriageRegistrations[0].coupleDetails[0].guardianDetails.country",

    }
  ),
  brideGrdnAddressPin: getLabelWithValue(
    {
      labelName: "Application Type",
      labelKey: "Pincode"
    },
    {
      jsonPath:
      "MarriageRegistrations[0].coupleDetails[0].guardianDetails.pinCode",

    }
  ),
  brideGrdnContact: getLabelWithValue(
    {
      labelName: "Application Type",
      labelKey: "Contact"
    },
    {
      jsonPath:
      "MarriageRegistrations[0].coupleDetails[0].guardianDetails.contact",

    }
  ),
  brideGrdnEmail: getLabelWithValue(
    {
      labelName: "Application Type",
      labelKey: "Email"
    },
    {
      jsonPath:
      "MarriageRegistrations[0].coupleDetails[0].guardianDetails.emailAddress",

    }
  ),

}
export const brideAddressDetails = {
  header: getCommonTitle(
    {
      labelName: "Trade Location Details",
      //labelKey: "TL_NEW_TRADE_DETAILS_HEADER_TRADE_LOC_DETAILS"
      labelKey: "MR_BRIDE_ADDRESS"
    },
    {
      style: {
        marginBottom: 18,
        fontSize: 15,
        width: "100%"
      }
    }
  ),
  brideAddressLine1: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "MR_ADDRESS"
    },
    {
      jsonPath: "MarriageRegistrations[0].coupleDetails[0].coupleAddress.addressLine1",

    }
  ),

  brideCountry: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "MR_COUNTRY"
    },
    {
      jsonPath: "MarriageRegistrations[0].coupleDetails[0].coupleAddress.country",

    }
  ),

  brideState: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "MR_STATE"
    },
    {
      jsonPath: "MarriageRegistrations[0].coupleDetails[0].coupleAddress.state",

    }
  ),
  brideDistrict: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "MR_DISTRICT"
    },
    {
      jsonPath: "MarriageRegistrations[0].coupleDetails[0].coupleAddress.district",

    }
  ),
  brideAddressPin: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "MR_PIN_CODE"
    },
    {
      jsonPath: "MarriageRegistrations[0].coupleDetails[0].coupleAddress.pinCode",

    }
  ),
  brideDob: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "MR_DATE_OF_BIRTH"
    },
    {
      jsonPath: "MarriageRegistrations[0].coupleDetails[0].dateOfBirth",
      callBack: convertEpochToDate
    }
  ),

}
export const getBrideAddressAndGuardianDetails = (isEditable = true) => {
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
    viewOne: getCommonContainer(brideAddressDetails),
    div2: getDivider(),
    viewTwo: getCommonContainer(brideGuardianDetails),

  });
};
