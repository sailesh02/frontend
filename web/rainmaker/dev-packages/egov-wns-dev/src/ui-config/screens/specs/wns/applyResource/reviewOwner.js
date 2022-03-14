import {
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer,
  getLabelWithValue,
  getLabel,
  getDivider,
  getLabelWithValueForModifiedLabel
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { convertEpochToDateAndHandleNA, handleNA, handleLaborCharge, handleInstallementorFullPayment, handleRoadType,handleIsVolumetric, handleVolumetricWaterCharge, handleIsDailyConsumption } from '../../utils';
import { changeStep } from "./footer";

const getHeader = label => {
  return {
    uiFramework: "custom-molecules-local",
    moduleName: "egov-wns",
    componentPath: "DividerWithLabel",
    props: {
      className: "hr-generic-divider-label",
      labelProps: {},
      dividerProps: {},
      label
    },
    type: "array"
  };
};

const connectionDetailsHeader = getHeader({
  labelKey: "WS_COMMON_CONNECTION_DETAILS"
});

const connectionChargeDetailsHeader = getHeader({
  labelKey: "WS_COMMON_PLUMBER_DETAILS"
});

const roadCuttingChargesHeader = getHeader({
  labelKey: "WS_ROAD_CUTTING_CHARGE_DETAILS"
});

const paymentDetailsHeader = getHeader({
  labelKey:"WS_PAYMENT_DETAILS"
})

const volumetricDetailsHeader = getHeader({
  labelKey : "WS_VOLUMETRIC_DETAILS"
})

const activationDetailsHeader = getHeader({
  labelKey: "WS_ACTIVATION_DETAILS"
});
// const ScrutinyFeeDetailsHeader = getHeader({
//   labelKey:"Scrutiny Fee Payment Details"
// })
// export const scrutinyDetails = {
//   reviewScrutinyFeeInstallmentApplicable: getLabelWithValue(
//     {
//       labelName: "Area (in sq ft)",
//       labelKey: "Scrutiny Fee Installment Applicable"
//     },
//     {
//       jsonPath: "applyScreen.additionalDetails.isInstallmentApplicableForScrutinyFee",
//       callBack: handleNA
//     }
//   ),
//   reviewScrutinyFeeTotalAmount: getLabelWithValue(
//     {
//       labelName: "Area (in sq ft)",
//       labelKey: "Scrutiny Fee Total Amount in Rs."
//     },
//     {
//       jsonPath: "applyScreen.additionalDetails.scrutinyFeeTotalAmount",
//       callBack: handleNA
//     }
//   ),
//   reviewScrutinyFeeNoOfInstallments: getLabelWithValue(
//     {
//       labelName: "Area (in sq ft)",
//       labelKey: "Scrutiny Fee No of Installments"
//     },
//     {
//       jsonPath: "applyScreen.additionalDetails.noOfScrutinyFeeInstallments",
//       callBack: handleNA
//     }
//   ),
//   reviewScrutinyFeeInstallmentAmount: getLabelWithValue(
//     {
//       labelName: "Area (in sq ft)",
//       labelKey: "Scrutiny Fee Installment Amount in Rs."
//     },
//     {
//       jsonPath: "applyScreen.additionalDetails.scrutinyFeeInstallmentAmount",
//       callBack: handleNA
//     }
//   )
// }
export const paymentDetailsMeter = {
  reviewLaborCharge : getLabelWithValueForModifiedLabel(
    {
      labelName: "WS_LABOUR_FEE",
      labelKey: "WS_LABOUR_FEE"
    },
    { jsonPath: "applyScreen.additionalDetails.isLabourFeeApplicable",
      callBack: handleLaborCharge
    }, {
        labelKey: "WS_OLD_LABEL_NAME"
      },
      { jsonPath: "applyScreenOld.additionalDetails.isLabourFeeApplicable",
      callBack: handleLaborCharge 
    }
  ),
  reviewLabourFeeTotalAmount: getLabelWithValue(
    {
      labelName: "Labour Fee Total Amount in Rs.",
      labelKey: "WS_LABOUR_FEE_TOTAL_AMOUNT_LABEL"
    },
    {
      jsonPath: "applyScreen.additionalDetails.totalAmount",
      callBack: handleNA
    }
  ),
  reviewInstallment : getLabelWithValueForModifiedLabel(
    {
      labelName: "WS_FULL_PAYMENT_OR_INSTALLMENT",
      labelKey: "WS_FULL_PAYMENT_OR_INSTALLMENT"
    },
    { jsonPath: "applyScreen.additionalDetails.isInstallmentApplicable",
      callBack: handleInstallementorFullPayment 
    }, {
        labelKey: "WS_OLD_LABEL_NAME"
      },
      { jsonPath: "applyScreenOld.additionalDetails.isInstallmentApplicable",
      callBack: handleInstallementorFullPayment 
    }
  ),
  reviewNoOfInstallment: getLabelWithValue(
    {
      labelName: "Labour Fee No Of Installments",
      labelKey: "WS_LABOUR_FEE_NO_OF_INSTALLMENT_LABEL"
    },
    {
      jsonPath: "applyScreen.additionalDetails.noOfLabourFeeInstallments",
      callBack: handleNA
    }
  ),
  reviewLabourFeeInstallmentAmount: getLabelWithValue(
    {
      labelName: "Labour Fee Installment Amount in Rs.",
      labelKey: "WS_LABOUR_FEE_INSTALLMENT_AMOUNT_LABEL"
    },
    {
      jsonPath: "applyScreen.additionalDetails.labourFeeInstallmentAmount",
      callBack: handleNA
    }
  ),
  reviewScrutinyFeeInstallmentApplicable: getLabelWithValue(
    {
      labelName: "Scrutiny Fee Installment Applicable",
      labelKey: "WS_SCRUTINY_INSTALLMENT_APPLICABLE_LABEL"
    },
    {
      jsonPath: "applyScreen.additionalDetails.isInstallmentApplicableForScrutinyFee",
      callBack: handleNA
    }
  ),
  reviewScrutinyFeeTotalAmount: getLabelWithValue(
    {
      labelName: "Scrutiny Fee Total Amount in Rs.",
      labelKey: "WS_SCRUTINY_FEE_TOTAL_AMOUNT_LABEL"
    },
    {
      jsonPath: "applyScreen.additionalDetails.scrutinyFeeTotalAmount",
      callBack: handleNA
    }
  ),
  reviewScrutinyFeeNoOfInstallments: getLabelWithValue(
    {
      labelName: "Scrutiny Fee No of Installments",
      labelKey: "WS_SCRUTINY_NO_OF_INSTALLMENTS_LABEL"
    },
    {
      jsonPath: "applyScreen.additionalDetails.noOfScrutinyFeeInstallments",
      callBack: handleNA
    }
  ),
  reviewScrutinyFeeInstallmentAmount: getLabelWithValue(
    {
      labelName: "Scrutiny Fee Installment Amount in Rs.",
      labelKey: "WS_SCRUTINY_FEE_INSTALLMENT_AMOUNT_LABEL"
    },
    {
      jsonPath: "applyScreen.additionalDetails.scrutinyFeeInstallmentAmount",
      callBack: handleNA
    }
  )
}

export const volumetricDetailsWater = {
  reviewVolumetricConnection : getLabelWithValueForModifiedLabel(
    {
      labelName: "WS_IS_VOLUMETRIC_CONNECTION",
      labelKey: "WS_IS_VOLUMETRIC_CONNECTION"
    },
    { jsonPath: "WaterConnection[0].additionalDetails.isVolumetricConnection",
      callBack: handleIsVolumetric
    }, {
        labelKey: "WS_IS_VOLUMETRIC_CONNECTION"
      },
      { jsonPath: "WaterConnectionOld[0].additionalDetails.isVolumetricConnection",
      callBack: handleIsVolumetric 
    }
  ),
  reviewVolumetricWaterCharge : getLabelWithValueForModifiedLabel(
    {
      labelName: "WS_VOLUMETRIC_CHARGE",
      labelKey: "WS_VOLUMETRIC_CHARGE"
    },
    { jsonPath: "WaterConnection[0].additionalDetails.volumetricWaterCharge",
      callBack: handleVolumetricWaterCharge 
    }, {
        labelKey: "WS_VOLUMETRIC_CHARGE"
      },
      { jsonPath: "WaterConnectionOld[0].additionalDetails.volumetricWaterCharge",
      callBack: handleVolumetricWaterCharge 
    }
  ),
  reviewIsDailyConsumption : getLabelWithValueForModifiedLabel(
    {
      labelName: "WS_IS_DAILY_OR_MONTHLY_COMSUMPTION",
      labelKey: "WS_IS_DAILY_OR_MONTHLY_COMSUMPTION"
    },
    { jsonPath: "WaterConnection[0].additionalDetails.isDailyConsumption",
      callBack: handleIsDailyConsumption
    }, {
        labelKey: "WS_IS_DAILY_OR_MONTHLY_COMSUMPTION"
      },
      { jsonPath: "WaterConnectionOld[0].additionalDetails.isDailyConsumption",
      callBack: handleIsDailyConsumption 
    }
  ),
  reviewVolumetricConsumtion : getLabelWithValueForModifiedLabel(
    {
      labelName: "WS_VOLUMETRIC_CONSUMPTION_IN_KL",
      labelKey: "WS_VOLUMETRIC_CONSUMPTION_IN_KL"
    },
    { jsonPath: "WaterConnection[0].additionalDetails.volumetricConsumtion",
    }, {
        labelKey: "WS_VOLUMETRIC_CONSUMPTION_IN_KL"
      },
      { jsonPath: "WaterConnectionOld[0].additionalDetails.volumetricConsumtion",
    }
  ),
}

export const paymentDetails = getCommonContainer(paymentDetailsMeter)

export const volumetricDetails = getCommonContainer(volumetricDetailsWater);
//export const ScrutinyFeeDetails = getCommonContainer(scrutinyDetails)

export const reviewConnectionType = getLabelWithValueForModifiedLabel(
  {
    labelName: "Connection Type",
    labelKey: "WS_SERV_DETAIL_CONN_TYPE"
  },
  {
    jsonPath: "applyScreen.connectionType",
    callBack: handleNA
  },
  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  {
    jsonPath: "applyScreenOld.connectionType",
    callBack: handleNA
  }
);
export const reviewNumberOfTaps = getLabelWithValueForModifiedLabel(
  {
    labelName: "No. of Taps",
    labelKey: "WS_SERV_DETAIL_NO_OF_TAPS"
  },
  {
    jsonPath: "applyScreen.noOfTaps",
    callBack: handleNA
  },
  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  {
    jsonPath: "applyScreenOld.noOfTaps",
    callBack: handleNA
  }
);
export const reviewWaterSource = getLabelWithValueForModifiedLabel(
  {
    labelName: "Water Source",
    labelKey: "WS_SERV_DETAIL_WATER_SOURCE"
  },
  {
    jsonPath: "WaterConnection[0].waterSource",
    callBack: handleNA
  },
  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  {
    jsonPath: "applyScreenOld.waterSource",
    callBack: handleNA
  }
);
export const reviewWaterSubSource = getLabelWithValueForModifiedLabel(
  {
    labelName: "Water Sub Source",
    labelKey: "WS_SERV_DETAIL_WATER_SUB_SOURCE"
  },
  {
    jsonPath: "WaterConnection[0].waterSubSource",
    callBack: handleNA
  },
  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  {
    jsonPath: "applyScreenOld.waterSubSource",
    callBack: handleNA
  }
);
export const reviewPipeSize = getLabelWithValueForModifiedLabel(
  {
    labelName: "Pipe Size (in inches)",
    labelKey: "WS_SERV_DETAIL_PIPE_SIZE"
  },
  {
    jsonPath: "applyScreen.pipeSize",
    callBack: handleNA
  },
  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  {
    jsonPath: "applyScreenOld.pipeSize",
    callBack: handleNA
  }
);

export const reviewWaterClosets = getLabelWithValueForModifiedLabel(
  {
    labelName: "No. of Water Closets",
    labelKey: "WS_ADDN_DETAILS_NO_OF_WATER_CLOSETS"
  },
  {
    jsonPath: "applyScreen.noOfWaterClosets",
    callBack: handleNA
  },
  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  {
    jsonPath: "applyScreenOld.noOfWaterClosets",
    callBack: handleNA
  }
);

export const reviewNumberOfToilets = getLabelWithValueForModifiedLabel(
  {
    labelName: "No. of Water Closets",
    labelKey: "WS_ADDN_DETAILS_NO_OF_TOILETS"
  },
  {
    jsonPath: "applyScreen.noOfToilets",
    callBack: handleNA
  },
  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  {
    jsonPath: "applyScreenOld.noOfToilets",
    callBack: handleNA
  }
);

export const reviewPlumberProvidedBy = getLabelWithValueForModifiedLabel(
  {
    labelName: "Plumber Provided By",
    labelKey: "WS_ADDN_DETAILS_PLUMBER_PROVIDED_BY"
  },
  {
    jsonPath: "applyScreen.additionalDetails.detailsProvidedBy",
    callBack: handleNA
  },
  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  {
    jsonPath: "applyScreenOld.additionalDetails.detailsProvidedBy",
    callBack: handleNA
  }
);
export const reviewPlumberLicenseNo = getLabelWithValueForModifiedLabel(
  {
    labelName: "Plumber License No.",
    labelKey: "WS_ADDN_DETAILS_PLUMBER_LICENCE_NO_LABEL"
  },
  {
    jsonPath: "applyScreen.plumberInfo[0].licenseNo",
    callBack: handleNA
  },
  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  {
    jsonPath: "applyScreenOld.plumberInfo[0].licenseNo",
    callBack: handleNA
  }
);
export const reviewPlumberName = getLabelWithValueForModifiedLabel(
  {
    labelName: "Plumber Name",
    labelKey: "WS_ADDN_DETAILS_PLUMBER_NAME_LABEL"
  },
  { jsonPath: "applyScreen.plumberInfo[0].name",
    callBack: handleNA },
  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  {
    jsonPath: "applyScreenOld.plumberInfo[0].name",
    callBack: handleNA
  }
);

export const reviewPlumberMobileNo = getLabelWithValueForModifiedLabel(
  {
    labelName: "Plumber Mobile No.",
    labelKey: "WS_ADDN_DETAILS_PLUMBER_MOB_NO_LABEL"
  },
  {
    jsonPath: "applyScreen.plumberInfo[0].mobileNumber",
    callBack: handleNA
  },
  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  {
    jsonPath: "applyScreenOld.plumberInfo[0].mobileNumber",
    callBack: handleNA
  }
);

export const reviewRoadType = getLabelWithValueForModifiedLabel(
  {
    labelName: "Road Type",
    labelKey: "WS_ADDN_DETAIL_ROAD_TYPE"
  },
  {
    jsonPath: "applyScreen.roadType",
    // localePrefix: {
    //   moduleName: "WS",
    //   masterName: "ROADTYPE"
    // },
    callBack: handleNA
  },
  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  {
    jsonPath: "applyScreenOld.roadType",
    callBack: handleNA
  }
);

export const reviewArea = getLabelWithValueForModifiedLabel(
  {
    labelName: "Area (in sq ft)",
    labelKey: "WS_ADDN_DETAILS_AREA_LABEL"
  },
  {
    jsonPath: "applyScreen.roadCuttingArea",
    callBack: handleNA
  },
  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  {
    jsonPath: "applyScreenOld.roadCuttingArea",
    callBack: handleNA
  }
);
export const reviewConnectionExecutionDate = getLabelWithValueForModifiedLabel(
  {
    labelName: "Connection Execution Date",
    labelKey: "WS_SERV_DETAIL_CONN_EXECUTION_DATE"
  },
  {
    jsonPath: "applyScreen.connectionExecutionDate",
    callBack: convertEpochToDateAndHandleNA
  },
  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  {
    jsonPath: "applyScreenOld.connectionExecutionDate",
    callBack: convertEpochToDateAndHandleNA
  }
);
export const reviewDiameter = getLabelWithValueForModifiedLabel(
  {
    labelName: "Diameter",
    labelKey: "WS_CONN_DETAIL_DIAMETER"
  },
  {
    jsonPath: "applyScreen.additionalDetails.diameter",
    callBack: handleNA
  },
  {
    labelKey: "WS_CONN_DETAIL_DIAMETER"
  },
  {
    jsonPath: "applyScreenOld.additionalDetails.diameter",
    callBack: handleNA
  }
);
export const reviewMeterId = getLabelWithValueForModifiedLabel(
  {
    labelName: "Meter ID",
    labelKey: "WS_SERV_DETAIL_METER_ID"
  },
  { jsonPath: "applyScreen.meterId",
    callBack: handleNA },
  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  {
    jsonPath: "applyScreenOld.meterId",
    callBack: handleNA
  }
);

export const reviewMeterInstallationDate = getLabelWithValueForModifiedLabel(
  {
    labelName: "Meter Installation Date",
    labelKey: "WS_ADDN_DETAIL_METER_INSTALL_DATE"
  },
  {
    jsonPath: "applyScreen.meterInstallationDate",
    callBack: convertEpochToDateAndHandleNA
  },
  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  {
    jsonPath: "applyScreenOld.meterInstallationDate",
    callBack: convertEpochToDateAndHandleNA
  }
);

export const reviewInitialMeterReading = getLabelWithValueForModifiedLabel(
  {
    labelName: "Initial Meter Reading",
    labelKey: "WS_ADDN_DETAILS_INITIAL_METER_READING"
  },
  { jsonPath: "applyScreen.additionalDetails.initialMeterReading",
    callBack: handleNA },
  {
    labelKey: "WS_OLD_LABEL_NAME"
  },
  {
    jsonPath: "applyScreenOld.additionalDetails.initialMeterReading",
    callBack: handleNA
  }
);

export const reviewMeterMake = getLabelWithValueForModifiedLabel(
  {
    labelName: "Meter Make",
    labelKey: "WS_ADDN_DETAILS_METER_MAKE"
  },
  { jsonPath: "applyScreen.additionalDetails.meterMake",
    callBack: handleNA },
  {
    labelKey: "WS_ADDN_DETAILS_METER_MAKE"
  },
  {
    jsonPath: "applyScreenOld.additionalDetails.meterMake",
    callBack: handleNA
  }
);

export const reviewMaxMeterDigits = getLabelWithValueForModifiedLabel(
  {
    labelName: "WS_ADDN_DETAILS_MAX_METER_DIGITS_REVIEW_LABEL",
    labelKey: "WS_ADDN_DETAILS_MAX_METER_DIGITS_REVIEW_LABEL"
  },
  { jsonPath: "applyScreen.additionalDetails.maxMeterDigits",
    callBack: handleNA },
  {
    labelKey: "WS_ADDN_DETAILS_MAX_METER_DIGITS_REVIEW_LABEL"
  },
  {
    jsonPath: "applyScreenOld.additionalDetails.maxMeterDigits",
    callBack: handleNA
  }
);

export const reviewMeterRatio = getLabelWithValueForModifiedLabel(
  {
    labelName: "Initial Meter Reading",
    labelKey: "WS_ADDN_DETAILS_METER_RATIO"
  },
  { jsonPath: "applyScreen.additionalDetails.meterReadingRatio",
    callBack: handleNA },
  {
    labelKey: "WS_ADDN_DETAILS_METER_RATIO"
  },
  {
    jsonPath: "applyScreenOld.additionalDetails.meterReadingRatio",
    callBack: handleNA
  }
);

export const reviewOwner = (isEditable = true) => {
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
            labelName: "Additional Details ( To be filled by Municipal Employee)",
            labelKey: "WS_COMMON_ADDN_DETAILS_HEADER"
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
              changeStep(state, dispatch, "", 2);
            }
          }
        }
      }
    },
    // viewOne: propertyDetails,
    // viewTwo: propertyLocationDetails
    viewFive: connectionDetailsHeader,
    viewSix: connectionDetails,
    viewSeven: connectionChargeDetailsHeader,
    viewEight: connectionChargeDetails,
    // viewNine: roadCuttingChargesHeader,
    // viewTen: roadCuttingCharges,
    viewEleven: activationDetailsHeader,
    viewTwelve: activationDetails,
    viewFifteen : volumetricDetailsHeader,
    viewSixteen : volumetricDetails,
    viewThirdTeen : paymentDetailsHeader,
    viewFourTeen : paymentDetails,
   // view15th : ScrutinyFeeDetailsHeader,
   // view16th : ScrutinyFeeDetails

  })
};

const connectionDetails = getCommonContainer({
  reviewConnectionType,
  reviewNumberOfTaps,
  reviewWaterSource,
  reviewWaterSubSource,
  reviewPipeSize,
  // reviewBillingType,
  reviewWaterClosets,
  reviewNumberOfToilets
});

const connectionChargeDetails = getCommonContainer({
  reviewPlumberProvidedBy,
  reviewPlumberLicenseNo,
  reviewPlumberName,
  reviewPlumberMobileNo
});

const roadCuttingCharges = {
  uiFramework: "custom-containers",
  componentPath: "MultiItem",
  props: {
    className: "applicant-summary",
    scheama: getCommonContainer({
        reviewRoadType : getLabelWithValue(
          {
            labelName: "Road Type",
            labelKey: "WS_ADDN_DETAIL_ROAD_TYPE"
          },
          {
            jsonPath: "applyScreen.roadCuttingInfo[0].roadType",
            callBack: handleRoadType
          }
        ),
        reviewArea : getLabelWithValue(
          {
            labelName: "Area (in sq ft)",
            labelKey: "WS_ADDN_DETAILS_AREA_LABEL"
          },
          {
            jsonPath: "applyScreen.roadCuttingInfo[0].roadCuttingArea",
            callBack: handleNA
          }
        )
        
    }),
    items: [],
    hasAddItem: false,
    moduleName : 'WNS',
    isReviewPage: true,
    sourceJsonPath: "applyScreen.roadCuttingInfo",
    prefixSourceJsonPath: "children",
    afterPrefixJsonPath: "children.value.children.key"
  },
  type: "array"
}

const activationDetails = getCommonContainer({
  reviewConnectionExecutionDate,
  reviewMeterId,
  reviewDiameter,
  reviewMeterInstallationDate,
  reviewInitialMeterReading,
  reviewMeterMake,
  reviewMeterRatio,
  reviewMaxMeterDigits
});
