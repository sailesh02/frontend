import React from "react";
import { getTranslatedLabel } from "egov-ui-kit/utils/commons";
import { Card } from "components";
// import moment from "moment";
import Label from "egov-ui-kit/utils/translationNode";
import get from "lodash/get";

// import { connect } from "react-redux";
import { initLocalizationLabels } from "egov-ui-kit/redux/app/utils";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";
import PropertyInfoCard from "../PropertyInfoCard";
const locale = getLocale() || "en_IN";
const localizationLabelsData = initLocalizationLabels(locale);
const transform = (floor, key, generalMDMSDataById, propertyDetails) => {
  const { propertySubType, usageCategoryMajor } = propertyDetails;
  const { masterName, dataKey } = key;
  if (!masterName) {
    return floor["occupancyType"] === "RENTED" ? `INR ${floor["arv"]}` : `${Math.round(floor[dataKey] * 100) / 100} sq yards`;
  } else {
    if (floor[dataKey]) {
      if (dataKey === "usageCategoryDetail") {
        return generalMDMSDataById["UsageCategoryDetail"]
          ? generalMDMSDataById["UsageCategoryDetail"][floor[dataKey]].name
          : generalMDMSDataById["UsageCategorySubMinor"]
            ? generalMDMSDataById["UsageCategorySubMinor"][floor["usageCategorySubMinor"]].name
            : "NA";
      }
      // if (usageCategoryMajor === "RESIDENTIAL" && propertySubType === "SHAREDPROPERTY" && dataKey === "floorNo") {
      //   return "NA";
      // }
      if (floor[dataKey] === "NONRESIDENTIAL") {
        return generalMDMSDataById["UsageCategoryMinor"] ? generalMDMSDataById["UsageCategoryMinor"][floor["usageCategoryMinor"]].name : "NA";
      } else {
        return generalMDMSDataById[masterName] ? generalMDMSDataById[masterName][floor[dataKey]].name : "NA";
      }
    } else {
      return "NA";
    }
  }
};
export const getAssessmentInfo = (propertyDetails, generalMDMSDataById) => {
  const { units=[], noOfFloors } = propertyDetails || {};
  return (
    propertyDetails && [
      {
        key: getTranslatedLabel("PT_ASSESMENT_INFO_USAGE_TYPE", localizationLabelsData),
        value: propertyDetails.usageCategoryMajor ? 'PROPERTYTAX_BILLING_SLAB_' + propertyDetails.usageCategoryMajor : "NA", //noOfFloors
      },
      {
        key: getTranslatedLabel("PT_ASSESMENT_INFO_TYPE_OF_BUILDING", localizationLabelsData),
        value: generalMDMSDataById
          ? propertyDetails.propertySubType
            ? generalMDMSDataById["PropertySubType"]
              ? generalMDMSDataById["PropertySubType"][propertyDetails.propertySubType].name
              : "NA"
            : generalMDMSDataById["PropertyType"]
              ? generalMDMSDataById["PropertyType"][propertyDetails.propertyType].name
              : "NA"
          : "NA",
      },
      {
        key: getTranslatedLabel("PT_ASSESMENT_INFO_PLOT_SIZE", localizationLabelsData),
        value:
          propertyDetails.propertySubType === "SHAREDPROPERTY"
            ? "NA"
            : propertyDetails.uom
              ? `${propertyDetails.landArea} ${propertyDetails.uom}`
              : `${Math.round(propertyDetails.landArea * 100) / 100} sq yards`,
      },
      propertyDetails.propertySubType === "SHAREDPROPERTY"
        ? {
          key: getTranslatedLabel("PT_FLOOR_NO", localizationLabelsData),
          value: units.length>0? `${units[0].floorNo}` : "NA",
        } :
        {
          key: getTranslatedLabel("PT_ASSESMENT_INFO_NO_OF_FLOOR", localizationLabelsData),
          value: noOfFloors ? `${noOfFloors}` : "NA", //noOfFloors
        },
    ]
  );
};
export const getUnitInfo = (units = [], propertyDetails) => {
  units = units || [];
  let floors = [];

  units.map((unit, index) => {
    console.log("======units======", units);
    if(unit){
      let floor = [{
        key: getTranslatedLabel("PT_ASSESSMENT_UNIT_USAGE_TYPE", localizationLabelsData),
        value: unit.usageCategoryMinor ? 'PROPERTYTAX_BILLING_SLAB_' + unit.usageCategoryMinor : (propertyDetails.usageCategoryMinor ? 'PROPERTYTAX_BILLING_SLAB_' + propertyDetails.usageCategoryMinor :
          (unit.usageCategoryMajor ? 'PROPERTYTAX_BILLING_SLAB_' + unit.usageCategoryMajor : "NA")),
      },
      {
        key: getTranslatedLabel("PT_ASSESMENT_INFO_OCCUPLANCY", localizationLabelsData),
        value: unit.occupancyType ? 'PROPERTYTAX_OCCUPANCYTYPE_' + unit.occupancyType : "NA",
      },
      {
        key: getTranslatedLabel("PT_ASSESMENT_INFO_SUB_USAGE_TYPE", localizationLabelsData),
        value: unit.usageCategoryDetail ? 'PROPERTYTAX_BILLING_SLAB_'+ unit.usageCategoryDetail :"NA",
      },
      {
        key: getTranslatedLabel("PT_FORM2_BUILT_AREA", localizationLabelsData),
        value: unit.unitArea ? unit.unitArea + '' : "NA",
      }];
      if (unit.occupancyType === "RENTED") {
        floor.push({
          key: getTranslatedLabel("PT_FORM2_TOTAL_ANNUAL_RENT", localizationLabelsData),
          value: unit.arv ? unit.arv + '' : "NA",
        })
      }
      if (!floors[unit['floorNo']]) {
        floors[unit['floorNo']] = [floor];
      } else {
        floors[unit['floorNo']].push(floor);
      }
    }
  }
  )
  return floors;
}
const getVasikaItems = (additionalDetails) => {

  var vasika_date =(additionalDetails && additionalDetails.vasikaDate)?additionalDetails.vasikaDate.toISOString().split('T')[0]:null;
 var allotment_date =(additionalDetails && additionalDetails.allotmentDate)? additionalDetails.allotmentDate.toISOString().split('T')[0]:null;

  return (
    additionalDetails && [
          {
            key: "PT_COMMON_VASIKA_NO",
            value:  additionalDetails.vasikaNo || "NA", //noOfFloors
          },
          {
            key: "PT_COMMON_VASIKA_DATE",
            value: vasika_date ? `${vasika_date}` : "NA",
          },
          {
            key: "PT_COMMON_ALLOTMENT_NO",
            value:  additionalDetails.allotmentNo || "NA",
          },
          {
            key: "PT_COMMON_ALLOTMENT_DATE",
            value: allotment_date ? `${allotment_date}` : "NA",
          },
          {
            key: "PT_COMMON_BUSSINESS_NAME",
            value:  additionalDetails.businessName || "NA",
          },
          {
            key: "PT_COMMON_REMARKS",
            value:  additionalDetails.remrks || "NA",
          },
          {
            key: "PT_COMMON_HEIGHT_OF_PROPERTY",
            value: additionalDetails.inflammableMaterial === true ? "Yes" : "No",
          },
          {
            key: "PT_COMMON_INFLAMMABLE_MATERIAL_PROPERTY",
            value:  additionalDetails.heightOfProperty === true ? "Yes" : "No",
          },

        ]
      );
}

const AssessmentInfo = ({ properties, editIcon, generalMDMSDataById }) => {
  console.log("popsdsdsdddddddddddddddd",properties);
let hideSubsectionLabel=false;
  let assessmentItems = [];
  let subUnitItems = [];
  let subVasikaItems = [];
  const header = 'PT_ASSESMENT_INFO_SUB_HEADER';
  if (properties) {
    const { propertyDetails } = properties;
    const { additionalDetails } = properties;
    if (propertyDetails && propertyDetails.length > 0) {

     let subUnitItemsdata = propertyDetails[0].units.filter(unit=>{
       return unit.active === true
      });
      subUnitItems = getUnitInfo(subUnitItemsdata);

      // subUnitItems = getUnitInfo(propertyDetails[0]['units'], propertyDetails[0]);
      subVasikaItems = getVasikaItems(additionalDetails);
      assessmentItems = getAssessmentInfo(propertyDetails[0], generalMDMSDataById);
      if(propertyDetails[0].propertySubType === "SHAREDPROPERTY"){
        hideSubsectionLabel=true;
      }
    }
  }
  return (
    <PropertyInfoCard editIcon={editIcon} items={assessmentItems} items2={subVasikaItems} header={header} subSection={subUnitItems} hideSubsectionLabel={hideSubsectionLabel} ></PropertyInfoCard>
  );
};
export default AssessmentInfo;
