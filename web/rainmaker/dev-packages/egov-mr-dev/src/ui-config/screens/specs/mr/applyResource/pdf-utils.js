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

  export const brideWitnessDetail = {



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

  export const GroomWitnessDetails = {

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

  export const brideGuardianDetails = {


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

  export const groomGuardianDetails = {

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

  export const brideReviewDetails = {

    brideFName: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_NAME_LABEL"
      },
      {
        jsonPath:
          "MarriageRegistrations[0].coupleDetails[0].bride.firstName",

      }
    ),
    brideDob: getLabelWithValue(
      {
        labelName: "City",
        labelKey: "MR_DOB_LABEL"
      },
      {
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.dateOfBirth",
        callBack: convertEpochToDate
      }
    ),
    brideContact: getLabelWithValue(
      {
        labelName: "City",
        labelKey: "MR_CONTACT_LABEL"
      },
      {
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.address.contact",

      }
    ),
    brideEmail: getLabelWithValue(
      {
        labelName: "City",
        labelKey: "MR_EMAIL_LABEL"
      },
      {
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.address.emailAddress",

      }
    ),

    brideFatherFName: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_FATHERNAME_LABEL"
      },
      {
        jsonPath:
          "MarriageRegistrations[0].coupleDetails[0].bride.fatherName",

      }
    ),
    brideMotherFName: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_MOTHERNAME_LABEL"
      },
      {
        jsonPath:
          "MarriageRegistrations[0].coupleDetails[0].bride.motherName",

      }
    ),
    brideAddressLine1: getLabelWithValue(
      {
        labelName: "City",
        labelKey: "MR_ADDRESS_LABEL"
      },
      {
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.address.addressLine1",

      }
    ),
    brideDistrict: getLabelWithValue(
      {
        labelName: "City",
        labelKey: "MR_DISTRICT_LABEL"
      },
      {
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.address.district",

      }
    ),
    brideState: getLabelWithValue(
      {
        labelName: "City",
        labelKey: "MR_STATE_LABEL"
      },
      {
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.address.state",

      }
    ),
    brideCountry: getLabelWithValue(
      {
        labelName: "City",
        labelKey: "MR_COUNTRY_LABEL"
      },
      {
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.address.country",

      }
    ),
    brideAddressPin: getLabelWithValue(
      {
        labelName: "City",
        labelKey: "MR_PINCODE_LABEL"
      },
      {
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].bride.address.pinCode",

      }
    ),
    isDisabled: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_ISDIVYANG_LABEL"
      },
      {
        jsonPath:
          "MarriageRegistrations[0].coupleDetails[0].bride.isDivyang",

      }
    )
  }

  export const groomReviewDetails = {


    groomFName: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_NAME_LABEL"
      },
      {
        jsonPath:
          "MarriageRegistrations[0].coupleDetails[0].groom.firstName",

      }
    ),
    groomDob: getLabelWithValue(
      {
        labelName: "City",
        labelKey: "MR_DOB_LABEL"
      },
      {
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.dateOfBirth",
        callBack: convertEpochToDate
      }
    ),
    groomContact: getLabelWithValue(
      {
        labelName: "City",
        labelKey: "MR_CONTACT_LABEL"
      },
      {
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.address.contact",

      }
    ),
    groomEmail: getLabelWithValue(
      {
        labelName: "City",
        labelKey: "MR_EMAIL_LABEL"
      },
      {
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.address.emailAddress",

      }
    ),
    groomFatherFName: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_FATHERNAME_LABEL"
      },
      {
        jsonPath:
          "MarriageRegistrations[0].coupleDetails[0].groom.fatherName",

      }
    ),
    groomMotherFName: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_MOTHERNAME_LABEL"
      },
      {
        jsonPath:
          "MarriageRegistrations[0].coupleDetails[0].groom.motherName",

      }
    ),
    groomAddressLine1: getLabelWithValue(
      {
        labelName: "City",
        labelKey: "MR_ADDRESS_LABEL"
      },
      {
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.address.addressLine1",

      }
    ),
    groomDistrict: getLabelWithValue(
      {
        labelName: "City",
        labelKey: "MR_DISTRICT_LABEL"
      },
      {
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.address.district",

      }
    ),
    groomState: getLabelWithValue(
      {
        labelName: "City",
        labelKey: "MR_STATE_LABEL"
      },
      {
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.address.state",

      }
    ),
    groomCountry: getLabelWithValue(
      {
        labelName: "City",
        labelKey: "MR_COUNTRY_LABEL"
      },
      {
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.address.country",

      }
    ),
    groomAddressPin: getLabelWithValue(
      {
        labelName: "City",
        labelKey: "MR_PINCODE_LABEL"
      },
      {
        jsonPath: "MarriageRegistrations[0].coupleDetails[0].groom.address.pinCode",

      }
    ),

    isDisabled: getLabelWithValue(
      {
        labelName: "Application Type",
        labelKey: "MR_ISDIVYANG_LABEL"
      },
      {
        jsonPath:
          "MarriageRegistrations[0].coupleDetails[0].groom.isDivyang",

      }
    )
  }
  export const tradeLocationDetails = {

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