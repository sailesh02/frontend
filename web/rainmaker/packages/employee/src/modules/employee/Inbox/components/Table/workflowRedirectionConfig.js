export const getWFConfig = (module, businessService) => {
  switch (module.toUpperCase()) {
    case "TL-SERVICES":
      return {
        INITIATED: "/tradelicence/apply",
        DEFAULT: "/tradelicence/search-preview",
      };
    case "MR-SERVICES":
      return {
        INITIATED: "/mr/apply",
        DEFAULT: "/mr/search-preview",
      };
    case "WS-SERVICES":
      return {
        INITIATED: "/wns/search-preview",
        DEFAULT: "/wns/search-preview",
      };
    case "SW-SERVICES":
      return {
        INITIATED: "/wns/search-preview",
        DEFAULT: "/wns/search-preview",
      };
    case "FIRENOC":
      return {
        INITIATED: "/fire-noc/apply",
        DEFAULT: "/fire-noc/search-preview",
      };
    case "BPA-SERVICES":
      if (businessService === "BPA_OC" || businessService === "BPA_OC1" || businessService === "BPA_OC2" || businessService === "BPA_OC3" || businessService === "BPA_OC4") {
        return {
          INITIATED: "/oc-bpa/search-preview",
          DEFAULT: "/oc-bpa/search-preview",
        };
      } else if(businessService === "BPA6"){
        return {
          INITIATED: "/pre-approved/search-preview",
          DEFAULT: "/pre-approved/search-preview",
        };
      } 
      else{
        return {
          INITIATED: "/egov-bpa/search-preview",
          DEFAULT: "/egov-bpa/search-preview",
        };
      }
    case "BPAREG":
      return {
        DEFAULT: "/bpastakeholder/search-preview",
      };
    case "PT-SERVICES":
      return {
        INITIATED: "/property-tax/application-preview",
        DEFAULT: "/property-tax/application-preview",
      };
    case "PT":
      if (businessService === "PT.CREATE") {
        return {
          INITIATED: "/property-tax/application-preview",
          DEFAULT: "/property-tax/application-preview",
        };
      }else if (businessService === "PT.LEGACY") {
        return {
          INITIATED: "/property-tax/application-preview",
          DEFAULT: "/property-tax/application-preview",
        };
      } else if(businessService === "ASMT") {
        return {
          INITIATED: "/pt-assessment/search-preview",
          DEFAULT: "/pt-assessment/search-preview",
        };
      }
      else {
        return {
          INITIATED: "/pt-mutation/search-preview",
          DEFAULT: "/pt-mutation/search-preview",
        };
      }
      case "NOC-SERVICES":
      return {
        INITIATED: "/noc/search-preview",
        DEFAULT: "/noc/search-preview",
      };
  }
};
