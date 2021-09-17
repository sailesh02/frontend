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

export const brideReviewDetails = {
  header: getCommonTitle(
    {
      labelName: "Trade Location Details",
      //labelKey: "TL_NEW_TRADE_DETAILS_HEADER_TRADE_LOC_DETAILS"
      labelKey: "Bride details"
    },
    {
      style: {
        marginBottom: 18,
        fontSize: 15,
        width: "100%"
      }
    }
  ),
  brideFName: getLabelWithValue(
    {
      labelName: "Application Type",
      labelKey: "Name"
    },
    {
      jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].firstName",

    }
  ),
  brideDob: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "DOB"
    },
    {
      jsonPath: "MarriageRegistrations[0].coupleDetails[0].dateOfBirth",
      callBack: convertEpochToDate
    }
  ),
  brideContact: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "Contact"
    },
    {
      jsonPath: "MarriageRegistrations[0].coupleDetails[0].contact",

    }
  ),
  brideEmail: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "Email"
    },
    {
      jsonPath: "MarriageRegistrations[0].coupleDetails[0].emailAddress",

    }
  ),
  // brideMName: getLabelWithValue(
  //   {
  //     labelName: "Application Type",
  //     labelKey: "MR_MIDDLE_NAME"
  //   },
  //   {
  //     jsonPath:
  //       "MarriageRegistrations[0].coupleDetails[0].middleName",

  //   }
  // ),
  // brideLName: getLabelWithValue(
  //   {
  //     labelName: "Application Type",
  //     labelKey: "MR_LAST_NAME"
  //   },
  //   {
  //     jsonPath:
  //       "MarriageRegistrations[0].coupleDetails[0].lastName",

  //   }
  // ),
  brideFatherFName: getLabelWithValue(
    {
      labelName: "Application Type",
      labelKey: "Father name"
    },
    {
      jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].fatherName",

    }
  ),
  brideMotherFName: getLabelWithValue(
    {
      labelName: "Application Type",
      labelKey: "Mother name"
    },
    {
      jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].motherName",

    }
  ),
  brideAddressLine1: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "Address"
    },
    {
      jsonPath: "MarriageRegistrations[0].coupleDetails[0].coupleAddress.addressLine1",

    }
  ),
  brideDistrict: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "District"
    },
    {
      jsonPath: "MarriageRegistrations[0].coupleDetails[0].coupleAddress.district",

    }
  ),
  brideState: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "State"
    },
    {
      jsonPath: "MarriageRegistrations[0].coupleDetails[0].coupleAddress.state",

    }
  ),
  brideCountry: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "Country"
    },
    {
      jsonPath: "MarriageRegistrations[0].coupleDetails[0].coupleAddress.country",

    }
  ),
  brideAddressPin: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "PIN"
    },
    {
      jsonPath: "MarriageRegistrations[0].coupleDetails[0].coupleAddress.pinCode",

    }
  ),
  isDisabled: getLabelWithValue(
    {
      labelName: "Application Type",
      labelKey: "Is Bride Divyang"
    },
    {
      jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].isDivyang",

    }
  )
}

export const groomReviewDetails = {

  header: getCommonTitle(
    {
      labelName: "Trade Location Details",
      //labelKey: "TL_NEW_TRADE_DETAILS_HEADER_TRADE_LOC_DETAILS"
      labelKey: "Groom Details"
    },
    {
      style: {
        marginBottom: 18,
        fontSize: 15,
        width: "100%"
      }
    }
  ),
  groomFName: getLabelWithValue(
    {
      labelName: "Application Type",
      labelKey: "Name"
    },
    {
      jsonPath:
        "MarriageRegistrations[0].coupleDetails[1].firstName",

    }
  ),
  groomDob: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "DOB"
    },
    {
      jsonPath: "MarriageRegistrations[0].coupleDetails[1].dateOfBirth",
      callBack: convertEpochToDate
    }
  ),
  groomContact: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "Contact"
    },
    {
      jsonPath: "MarriageRegistrations[0].coupleDetails[1].contact",

    }
  ),
  groomEmail: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "Email"
    },
    {
      jsonPath: "MarriageRegistrations[0].coupleDetails[1].emailAddress",

    }
  ),
  groomFatherFName: getLabelWithValue(
    {
      labelName: "Application Type",
      labelKey: "Father name"
    },
    {
      jsonPath:
        "MarriageRegistrations[0].coupleDetails[1].fatherName",

    }
  ),
  groomMotherFName: getLabelWithValue(
    {
      labelName: "Application Type",
      labelKey: "Mother name"
    },
    {
      jsonPath:
        "MarriageRegistrations[0].coupleDetails[1].motherName",

    }
  ),
  groomAddressLine1: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "Address"
    },
    {
      jsonPath: "MarriageRegistrations[0].coupleDetails[1].coupleAddress.addressLine1",

    }
  ),
  groomDistrict: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "District"
    },
    {
      jsonPath: "MarriageRegistrations[0].coupleDetails[1].coupleAddress.district",

    }
  ),
  groomState: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "State"
    },
    {
      jsonPath: "MarriageRegistrations[0].coupleDetails[1].coupleAddress.state",

    }
  ),
  groomCountry: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "Country"
    },
    {
      jsonPath: "MarriageRegistrations[0].coupleDetails[1].coupleAddress.country",

    }
  ),
  groomAddressPin: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "PIN"
    },
    {
      jsonPath: "MarriageRegistrations[0].coupleDetails[1].coupleAddress.pinCode",

    }
  ),
  // groomMName: getLabelWithValue(
  //   {
  //     labelName: "Application Type",
  //     labelKey: "MR_MIDDLE_NAME"
  //   },
  //   {
  //     jsonPath:
  //       "MarriageRegistrations[0].coupleDetails[1]].middleName",

  //   }
  // ),
  // groomLName: getLabelWithValue(
  //   {
  //     labelName: "Application Type",
  //     labelKey: "MR_LAST_NAME"
  //   },
  //   {
  //     jsonPath:
  //       "MarriageRegistrations[0].coupleDetails[1].lastName",

  //   }
  // ),

  isDisabled: getLabelWithValue(
    {
      labelName: "Application Type",
      labelKey: "Is Groom Divyang"
    },
    {
      jsonPath:
        "MarriageRegistrations[0].coupleDetails[1].isDivyang",

    }
  )
}
export const tradeLocationDetails = {
  header: getCommonTitle(
    {
      labelName: "Trade Location Details",
      //labelKey: "TL_NEW_TRADE_DETAILS_HEADER_TRADE_LOC_DETAILS"
      labelKey: "Marriage Place"
    },
    {
      style: {
        marginBottom: 18,
        fontSize: 15,
        width: "100%"
      }
    }
  ),
  reviewCity: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "City"
    },
    {
      jsonPath: "MarriageRegistrations[0].tenantId",
      localePrefix: {
        moduleName: "TENANT",
        masterName: "TENANTS"
      },
    }
  ),


  reviewMohalla: getLabelWithValue(
    {
      labelName: "Mohalla",
      labelKey: "Village"
    },
    {
      jsonPath: "MarriageRegistrations[0].marriagePlace.locality.code",
      localePrefix: {
        moduleName: getQueryArg(window.location.href, "tenantId") ? getQueryArg(window.location.href, "tenantId").replace('.', '_').toUpperCase() : "",
        masterName: "REVENUE"
      }, callBack: checkValueForNA
    }
  ),

  tradeLocWard: getLabelWithValue(
    {
      labelName: "Ward",
      labelKey: "Ward"
    },
    { jsonPath: "MarriageRegistrations[0].marriagePlace.ward", callBack: checkValueForNA }
  ),

  reviewDoorNo: getLabelWithValue(
    {
      labelName: "Door/House No.",
      labelKey: "Marriage Place"
    },
    { jsonPath: "MarriageRegistrations[0].marriagePlace.placeOfMarriage", callBack: checkValueForNA }
  ),

  reviewToDate: getLabelWithValue(
    { labelName: "To Date", labelKey: "Date of marriage" },
    {
      jsonPath: "MarriageRegistrations[0].marriageDate",
      callBack: convertEpochToDate
    }
  ),
}
export const getReviewTrade = (isEditable = true) => {
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
            labelKey: "Marriage Details"
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
    viewOne: getCommonContainer(tradeLocationDetails),
    div2: getDivider(),
    viewTwo: getCommonContainer(brideReviewDetails),
    div3: getDivider(),
    viewThree: getCommonContainer(groomReviewDetails),
  });
};

