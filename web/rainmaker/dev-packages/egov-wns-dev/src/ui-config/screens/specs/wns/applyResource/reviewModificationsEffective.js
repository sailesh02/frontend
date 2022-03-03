import {
  getCommonGrayCard,
  getCommonSubHeader,
  getCommonContainer,
  getLabelWithValue,
  getLabelWithValueForModifiedLabel,
  getDateField
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { convertEpochToDateAndHandleNA } from '../../utils';

// export const reviewModificationsEffectiveDate = {
//   reviewModification: getLabelWithValueForModifiedLabel(
//   {
//     labelName: "Modifications Effective Date",
//     labelKey: "WS_MODIFICATIONS_EFFECTIVE_DATE"
//   },
//   {
//     jsonPath: "WaterConnection[0].dateEffectiveFrom",
//     callBack: convertEpochToDateAndHandleNA
//   },
//   {
//     labelKey: "WS_OLD_LABEL_NAME"
//   },
//   {
//     jsonPath: "WaterConnectionOld[0].dateEffectiveFrom",
//     callBack: convertEpochToDateAndHandleNA
//   }
// )};
const getCurrentDate = () => {
  var today = new Date();
  let tomorrow =  new Date()
  tomorrow.setDate(today.getDate() + 1)
  var dd = String(tomorrow.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = yyyy + '-' + mm + '-' + dd;
  return today;
}
export const reviewModificationsEffectiveDate = {
  reviewModification: getDateField({
    label: {
      labelName: "WS_MODIFICATIONS_EFFECTIVE_DATE",
      labelKey: "WS_MODIFICATIONS_EFFECTIVE_DATE"
    },
    placeholder: {
      labelName: "WS_MODIFICATIONS_EFFECTIVE_DATE",
      labelKey: "WS_MODIFICATIONS_EFFECTIVE_DATE"
    },
    props: {
      className: "mr-mrg-apnt",

    },
    jsonPath: "WaterConnection[0].dateEffectiveFrom",
    props: {

      inputProps: {

        min: getCurrentDate()

      }
    },
    required: true,
    gridDefination: {
      xs: 12,
      sm: 12,
      md: 6
    }
  })};

export const reviewModificationsEffective = () => {
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
            labelKey: "WS_MODIFICATIONS_EFFECTIVE_FROM"
          })
        }
      }
    },
    viewOne: modificationsEffectiveDateDetails
  })
};

const modificationsEffectiveDateDetails = getCommonContainer(
  reviewModificationsEffectiveDate
);