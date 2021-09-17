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
      labelKey: "MR_BRIDE_HEADER"
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
      labelKey: "MR_NAME_LABEL"
    },
    {
      jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].firstName",

    }
  ),
  brideDob: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "MR_DOB_LABEL"
    },
    {
      jsonPath: "MarriageRegistrations[0].coupleDetails[0].dateOfBirth",
      callBack: convertEpochToDate
    }
  ),
  brideContact: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "MR_CONTACT_LABEL"
    },
    {
      jsonPath: "MarriageRegistrations[0].coupleDetails[0].contact",

    }
  ),
  brideEmail: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "MR_EMAIL_LABEL"
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
      labelKey: "MR_FATHERNAME_LABEL"
    },
    {
      jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].fatherName",

    }
  ),
  brideMotherFName: getLabelWithValue(
    {
      labelName: "Application Type",
      labelKey: "MR_MOTHERNAME_LABEL"
    },
    {
      jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].motherName",

    }
  ),
  brideAddressLine1: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "MR_ADDRESS_LABEL"
    },
    {
      jsonPath: "MarriageRegistrations[0].coupleDetails[0].coupleAddress.addressLine1",

    }
  ),
  brideDistrict: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "MR_DISTRICT_LABEL"
    },
    {
      jsonPath: "MarriageRegistrations[0].coupleDetails[0].coupleAddress.district",

    }
  ),
  brideState: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "MR_STATE_LABEL"
    },
    {
      jsonPath: "MarriageRegistrations[0].coupleDetails[0].coupleAddress.state",

    }
  ),
  brideCountry: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "MR_COUNTRY_LABEL"
    },
    {
      jsonPath: "MarriageRegistrations[0].coupleDetails[0].coupleAddress.country",

    }
  ),
  brideAddressPin: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "MR_PINCODE_LABEL"
    },
    {
      jsonPath: "MarriageRegistrations[0].coupleDetails[0].coupleAddress.pinCode",

    }
  ),
  isDisabled: getLabelWithValue(
    {
      labelName: "Application Type",
      labelKey: "MR_ISDIVYANG_LABEL"
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
      labelKey: "MR_GROOM_HEADER"
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
      labelKey: "MR_NAME_LABEL"
    },
    {
      jsonPath:
        "MarriageRegistrations[0].coupleDetails[1].firstName",

    }
  ),
  groomDob: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "MR_DOB_LABEL"
    },
    {
      jsonPath: "MarriageRegistrations[0].coupleDetails[1].dateOfBirth",
      callBack: convertEpochToDate
    }
  ),
  groomContact: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "MR_CONTACT_LABEL"
    },
    {
      jsonPath: "MarriageRegistrations[0].coupleDetails[1].contact",

    }
  ),
  groomEmail: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "MR_EMAIL_LABEL"
    },
    {
      jsonPath: "MarriageRegistrations[0].coupleDetails[1].emailAddress",

    }
  ),
  groomFatherFName: getLabelWithValue(
    {
      labelName: "Application Type",
      labelKey: "MR_FATHERNAME_LABEL"
    },
    {
      jsonPath:
        "MarriageRegistrations[0].coupleDetails[1].fatherName",

    }
  ),
  groomMotherFName: getLabelWithValue(
    {
      labelName: "Application Type",
      labelKey: "MR_MOTHERNAME_LABEL"
    },
    {
      jsonPath:
        "MarriageRegistrations[0].coupleDetails[1].motherName",

    }
  ),
  groomAddressLine1: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "MR_ADDRESS_LABEL"
    },
    {
      jsonPath: "MarriageRegistrations[0].coupleDetails[1].coupleAddress.addressLine1",

    }
  ),
  groomDistrict: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "MR_DISTRICT_LABEL"
    },
    {
      jsonPath: "MarriageRegistrations[0].coupleDetails[1].coupleAddress.district",

    }
  ),
  groomState: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "MR_STATE_LABEL"
    },
    {
      jsonPath: "MarriageRegistrations[0].coupleDetails[1].coupleAddress.state",

    }
  ),
  groomCountry: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "MR_COUNTRY_LABEL"
    },
    {
      jsonPath: "MarriageRegistrations[0].coupleDetails[1].coupleAddress.country",

    }
  ),
  groomAddressPin: getLabelWithValue(
    {
      labelName: "City",
      labelKey: "MR_PINCODE_LABEL"
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
      labelKey: "MR_ISDIVYANG_LABEL"
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
      labelKey: "MR_MARRIAGEPLACE_LABEL"
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
      labelKey: "MR_CITY_LABEL"
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
      labelKey: "MR_MOHALLA_LABEL"
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
      labelKey: "MR_WARD_LABEL"
    },
    { jsonPath: "MarriageRegistrations[0].marriagePlace.ward", callBack: checkValueForNA }
  ),

  reviewDoorNo: getLabelWithValue(
    {
      labelName: "Door/House No.",
      labelKey: "MR_MARRIAGEPLACE_LABEL"
    },
    { jsonPath: "MarriageRegistrations[0].marriagePlace.placeOfMarriage", callBack: checkValueForNA }
  ),

  reviewToDate: getLabelWithValue(
    { labelName: "To Date", labelKey: "MR_MARRIAGEDATE_LABEL" },
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
            labelKey: "MR_DETAILS_HEADER"
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
    viewOne: getCommonContainer(tradeLocationDetails),
    div2: getDivider(),
    viewTwo: getCommonContainer(brideReviewDetails),
    div3: getDivider(),
    viewThree: getCommonContainer(groomReviewDetails),
  });
};

