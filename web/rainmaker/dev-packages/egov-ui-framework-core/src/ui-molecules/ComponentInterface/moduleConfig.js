import {
  getQueryArg
} from "egov-ui-framework/ui-utils/commons";

export const getModuleName = (pathName, BPAtradeType) => {
  if (pathName && pathName.includes("fire-noc")) {
    return "FIRENOC";
  } else if (pathName && pathName.includes("egov-bpa")) {
    const moduleServiceName = getQueryArg(
      window.location.href,
      "bservice"
    );
    // let moduleServiceName = "BPA";
    // let url = window.location.href;
    // if (url && url.includes("type=LOW")) {
    //   moduleServiceName = "BPA_LOW"
    // }
    return moduleServiceName;
  } else if (pathName && pathName.includes("oc-bpa")) {
    const service = getQueryArg(
      window.location.href,
      "bservice"
    ) || "BPA_OC1";
    return service
    // return "BPA_OC";
  } else if (
    (pathName && pathName.includes("tradelicence")) ||
    (pathName && pathName.includes("tradelicense"))
  ) {
    return "NewTL";
  } else if (BPAtradeType) {
    return BPAtradeType.split(".")[0];
  }
};
