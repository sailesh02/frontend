import {
  handleScreenConfigurationFieldChange as handleField,
  prepareFinalObject,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import { httpRequest } from "../../../../../ui-utils";

export const tradeDetailsConatinerScreenChng = (
  eleId,
  propKey,
  propValue,
  dispatch
) => {
  dispatch(
    handleField(
      "traderateadd",
      `components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeDetailsConatiner.children.${eleId}`,
      propKey,
      propValue
    )
  );
};

export const handleFirstUOMFields = (eleId, propKey, propValue, dispatch) => {
  dispatch(
    handleField(
      "traderateadd",
      `components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeUnitCard.props.items[0].item0.children.cardContent.children.tradeUnitCardContainer.children.${eleId}`,
      propKey,
      propValue
    )
  );
};

const setTypeFlat = (state, dispatch) => {
  // uom -> visible: false and set to null
  tradeDetailsConatinerScreenChng("tradeUOM", "visible", false, dispatch);
  dispatch(prepareFinalObject(`billingSlab[0].uom`, null));
  // first card item toUom, fromUom -> visible: false
  handleFirstUOMFields("tradeToUOMValue", "visible", false, dispatch);
  handleFirstUOMFields("tradeFromUOMValue", "visible", false, dispatch);
  // only one card item
  let items = get(
    state.screenConfiguration,
    "screenConfig.traderateadd.components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeUnitCard.props.items",
    []
  );
  let newItem = items[0];
  delete newItem.isDeleted;
  dispatch(
    handleField(
      "traderateadd",
      "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeUnitCard",
      "props.items",
      [newItem]
    )
  );
  // set tradeUnits array
  let tradeUnits = get(
    state.screenConfiguration.preparedFinalObject,
    "tradeUnits",
    []
  );
  if (tradeUnits.length) {
    let newTradeUnit = [{ rate: tradeUnits[0]["rate"] }];
    dispatch(prepareFinalObject(`tradeUnits`, newTradeUnit));
  }
  // set isFalt: true (removes add new button)
  dispatch(
    handleField(
      "traderateadd",
      "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeUnitCard",
      "props.removeAddIcon",
      true
    )
  );
};
const setTypeRange = (state, dispatch) => {
  tradeDetailsConatinerScreenChng("tradeUOM", "visible", true, dispatch);
  handleFirstUOMFields("tradeToUOMValue", "visible", true, dispatch);
  handleFirstUOMFields("tradeFromUOMValue", "visible", true, dispatch);
  // set isFalt: false (show add new button)
  dispatch(
    handleField(
      "traderateadd",
      "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeUnitCard",
      "props.removeAddIcon",
      false
    )
  );
  let tradeUnits = get(
    state.screenConfiguration.preparedFinalObject,
    "tradeUnits",
    []
  );
  // only one card item
  let items = get(
    state.screenConfiguration,
    "screenConfig.traderateadd.components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeUnitCard.props.items",
    []
  );
  let newItem = items[0];
  delete newItem.isDeleted;
  dispatch(
    handleField(
      "traderateadd",
      "components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeUnitCard",
      "props.items",
      [newItem]
    )
  );
  if (tradeUnits.length) {
    let fromUom = get(
      state.screenConfiguration,
      "screenConfig.traderateadd.components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeUnitCard.props.items[0].item0.children.cardContent.children.tradeUnitCardContainer.children.tradeFromUOMValue.props.value",
      null
    );
    let toUom = get(
      state.screenConfiguration,
      "screenConfig.traderateadd.components.div.children.formwizardFirstStep.children.tradeDetails.children.cardContent.children.tradeUnitCard.props.items[0].item0.children.cardContent.children.tradeUnitCardContainer.children.tradeToUOMValue.props.value",
      null
    );
    let newTradeUnit = [
      {
        rate: tradeUnits[0]["rate"],
        toUom: toUom,
        fromUom: fromUom,
      },
    ];
    dispatch(prepareFinalObject(`tradeUnits`, newTradeUnit));
  }
};

export const handleLicenseTypeFieldChange = (licenseType, dispatch) => {
  if (licenseType === "PERMANENT") {
    //  both NEW and RENEWAL options for application type and field enabled
    tradeDetailsConatinerScreenChng(
      "applicationType",
      `props.data`,
      [{ code: "NEW" }, { code: "RENEWAL" }],
      dispatch
    );
    tradeDetailsConatinerScreenChng(
      "applicationType",
      `props.disabled`,
      false,
      dispatch
    );

    //  isTemp:false to show TradeType data
    tradeDetailsConatinerScreenChng(
      "dynamicMdms",
      `props.isTemp`,
      false,
      dispatch
    );
  } else {
    //  only NEW option for application type and field disabled
    tradeDetailsConatinerScreenChng(
      "applicationType",
      `props.data`,
      [{ code: "NEW" }],
      dispatch
    );
    tradeDetailsConatinerScreenChng(
      "applicationType",
      `props.disabled`,
      true,
      dispatch
    );

    //  isTemp:true to show TemporaryTradeType data
    tradeDetailsConatinerScreenChng(
      "dynamicMdms",
      `props.isTemp`,
      true,
      dispatch
    );
  }
  dispatch(prepareFinalObject("billingSlab[0].applicationType", "NEW"));
};

export const handleTypeFieldChange = (value, state, dispatch) => {
  if (value === "FLAT") {
    setTypeFlat(state, dispatch);
  } else {
    setTypeRange(state, dispatch);
  }
};

export const updateUOMFieldDOM = (value, state, dispatch) => {
  const tradeUnitsList = get(
    state.screenConfiguration.preparedFinalObject,
    "DynamicMdms.TradeLicense.tradeUnits.MdmsJson",
    []
  );
  const slctTradeType = tradeUnitsList.find((eachItem) => {
    return eachItem.code === value;
  });
  if (slctTradeType.uom) {
    const uomDataList = slctTradeType.uom.split(",").map((eachItem) => {
      return { code: eachItem };
    });
    //  Type field is enabled
    tradeDetailsConatinerScreenChng(
      "tradeRateType",
      "props.disabled",
      false,
      dispatch
    );
    //  set UOM options and select the first one
    dispatch(prepareFinalObject(`uomOptions`, uomDataList));
    dispatch(prepareFinalObject(`billingSlab[0].uom`, uomDataList[0].code));
    // setTypeRange(state,dispatch);
  } else {
    //  when UOM options data is null
    //  Type is FLAT and disabled
    dispatch(prepareFinalObject(`billingSlab[0].type`, "FLAT"));
    tradeDetailsConatinerScreenChng(
      "tradeRateType",
      "props.value",
      "FLAT",
      dispatch
    );
    tradeDetailsConatinerScreenChng(
      "tradeRateType",
      "props.disabled",
      true,
      dispatch
    );
    setTypeFlat(state, dispatch);
  }
};

export const setFieldsOnAddItem = (state, multiItemContent) => {
  return multiItemContent;
};

//  update

export const setSelectedBillingSlabData = async (state, dispatch) => {
  let tenantId = getQueryArg(window.location.href, "tenantId");
  let licenseType = getQueryArg(window.location.href, "licenseType");
  let applicationType = getQueryArg(window.location.href, "applicationType");
  let tradeType = getQueryArg(window.location.href, "tradeType");
  try {
    let queryObject = [
      {
        key: "tenantId",
        value: tenantId,
      },
      {
        key: "licenseType",
        value: licenseType,
      },
      {
        key: "applicationType",
        value: applicationType,
      },
      {
        key: "tradeType",
        value: tradeType,
      },
    ];
    let payload = null;
    payload = await httpRequest(
      "post",
      "/tl-calculator/billingslab/_search",
      "",
      queryObject
    );
    const billingSlab = [
      {
        tenantId: tenantId,
        licenseType: licenseType,
        applicationType: applicationType,
        tradeType: tradeType,
        type:
          payload["billingSlab"].length === 1
            ? payload["billingSlab"][0]["type"]
            : "RANGE",
        uom: payload["billingSlab"][0]["uom"],
      },
    ];
    const tradeUnits = payload["billingSlab"].map((eachItem) => {
      return {
        rate: eachItem["rate"],
        fromUom: eachItem["fromUom"],
        toUom: eachItem["toUom"],
      };
    });
    console.log(payload, "*************************************************");

    tradeDetailsConatinerScreenChng(
      "tradeLicenseType",
      "props.disabled",
      true,
      dispatch
    );
    tradeDetailsConatinerScreenChng(
      "applicationType",
      "props.disabled",
      true,
      dispatch
    );
    tradeDetailsConatinerScreenChng(
      "tradeUOM",
      "sourceJsonPath",
      "applyScreenMdmsData.common-masters.UOM",
      dispatch
    );

    // tradeDetailsConatinerScreenChng("dynamicMdms.props.dropdownFields[0]","isDisabled", true, dispatch)
    // tradeDetailsConatinerScreenChng("dynamicMdms.props.dropdownFields[1]","isDisabled", true, dispatch)
    // tradeDetailsConatinerScreenChng("dynamicMdms","visible", false, dispatch);

    // if (moduleName === "TradeLicense" && screenName == "tradeRateAddPage") {
    //   dispatch(prepareFinalObject("DynamicMdms.TradeLicense.tradeUnits.selectedValues", [{
    //     tradeSubType: "EATINGESTABLISHMENTS.TST3",
    //     tradeType: "EATINGESTABLISHMENTS"
    //   }]));
    // }

    dispatch(prepareFinalObject("billingSlab", billingSlab));
    dispatch(prepareFinalObject("tradeUnits", tradeUnits));
    dispatch(prepareFinalObject("uomOptions", []));
    dispatch(prepareFinalObject(`tradeUnitsToShow`, []));
    // if(billingSlab[0].type === "FLAT") {
    //   setTypeFlat(state,dispatch)
    // }
  } catch (e) {
    console.log(e);
  }
};
