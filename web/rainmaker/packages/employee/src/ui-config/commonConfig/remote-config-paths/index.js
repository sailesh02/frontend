const remoteConfigPath = (path, screenKey) => {
  let config = {};
  switch (path) {
    case "tradelicence":
    case "tradelicense-citizen":
      config = require(`egov-tradelicence/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "pt-mutation":
      case "pt-common-screens":
      case "pt-assessment":
      config = require(`egov-pt/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "egov-bpa":
    case "oc-bpa":
    case "bpastakeholder-citizen":
    case "bpastakeholder":
    case "edcrscrutiny":
      config = require(`egov-bpa/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "egov-common":
      config = require(`egov-common/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "wns":
    case "wns-citizen":
      config = require(`egov-wns/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "noc":
      config = require(`egov-noc/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    case "egov-dashboard": config = require(`egov-dashboard/ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
    default:
      config = require(`ui-config/screens/specs/${path}/${screenKey}`).default;
      break;
  }
  return config;
};

export default remoteConfigPath;