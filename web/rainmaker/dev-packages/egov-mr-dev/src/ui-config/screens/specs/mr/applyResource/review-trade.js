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
      labelKey: "MR_BRIDE_DETAIL"
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
      labelKey: "MR_FIRST_NAME"
    },
    {
      jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].firstName",

    }
  ),
  brideMName: getLabelWithValue(
    {
      labelName: "Application Type",
      labelKey: "MR_MIDDLE_NAME"
    },
    {
      jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].middleName",

    }
  ),
  brideLName: getLabelWithValue(
    {
      labelName: "Application Type",
      labelKey: "MR_LAST_NAME"
    },
    {
      jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].lastName",

    }
  ),
  brideFatherFName: getLabelWithValue(
    {
      labelName: "Application Type",
      labelKey: "MR_FATHER_NAME"
    },
    {
      jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].fatherName",

    }
  ),
  brideMotherFName: getLabelWithValue(
    {
      labelName: "Application Type",
      labelKey: "MR_MOTHER_NAME"
    },
    {
      jsonPath:
        "MarriageRegistrations[0].coupleDetails[0].motherName",

    }
  ),
  isDisabled: getLabelWithValue(
    {
      labelName: "Application Type",
      labelKey: "MR_IS_DIVYANG"
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
      labelKey: "MR_GROOM_DETAIL"
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
      labelKey: "MR_FIRST_NAME"
    },
    {
      jsonPath:
        "MarriageRegistrations[0].coupleDetails[1].firstName",

    }
  ),
  groomMName: getLabelWithValue(
    {
      labelName: "Application Type",
      labelKey: "MR_MIDDLE_NAME"
    },
    {
      jsonPath:
        "MarriageRegistrations[0].coupleDetails[1]].middleName",

    }
  ),
  groomLName: getLabelWithValue(
    {
      labelName: "Application Type",
      labelKey: "MR_LAST_NAME"
    },
    {
      jsonPath:
        "MarriageRegistrations[0].coupleDetails[1].lastName",

    }
  ),
  groomFatherFName: getLabelWithValue(
    {
      labelName: "Application Type",
      labelKey: "MR_FATHER_NAME"
    },
    {
      jsonPath:
        "MarriageRegistrations[0].coupleDetails[1].fatherName",

    }
  ),
  groomMotherFName: getLabelWithValue(
    {
      labelName: "Application Type",
      labelKey: "MR_MOTHER_NAME"
    },
    {
      jsonPath:
        "MarriageRegistrations[0].coupleDetails[1].motherName",

    }
  ),
  isDisabled: getLabelWithValue(
    {
      labelName: "Application Type",
      labelKey: "MR_IS_DIVYANG"
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
      labelKey: "MR_CITY"
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
      labelKey: "MR_VILLAGE"
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
      labelKey: "MR_WARD"
    },
    { jsonPath: "MarriageRegistrations[0].marriagePlace.ward", callBack: checkValueForNA }
  ),

  reviewDoorNo: getLabelWithValue(
    {
      labelName: "Door/House No.",
      labelKey: "MR_PLACE_OF_MARRIAGE"
    },
    { jsonPath: "MarriageRegistrations[0].marriagePlace.placeOfMarriage", callBack: checkValueForNA }
  ),

  reviewToDate: getLabelWithValue(
    { labelName: "To Date", labelKey: "MR_MARRIAGE_DATE" },
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
            labelKey: "MR_MARRIAGE_DETAIL"
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

