import { getCommonHeader, getBreak, getLabel, getSelectField, getLabelWithValue, getCommonContainer } from "egov-ui-framework/ui-config/screens/specs/utils";
import { wnsApplication, generateBillWithConnections } from './generateBillResources/employeeApplication';
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { resetFieldsForConnection, resetFieldsForApplication } from '../utils';
import { handleScreenConfigurationFieldChange as handleField, unMountScreen, toggleSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
//import "./index.css";
import { httpRequest } from "../../../../ui-utils/api";
import { triggerBillGenerationBatchForULBs, triggerBillGenerationBatchForConnections } from "../../../../ui-utils/commons";
import commonConfig from "config/common.js";
import store from "ui-redux/store";
import get from "lodash/get";
import set from "lodash/set";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";


const header = getCommonHeader({
  labelKey: "WS_BILL_TRIGGER_HEADER"
});

const popupHeader = getCommonHeader({
  labelKey: "WS_BILL_GENERATION_WARNING_MSG"
}, {
  style: {
    marginTop: "50px",
    marginRight: "50px",
    marginBottom: "50px",
    color: "red"
  }
});


const confirmCallback = async (state, dispatch) => {

  // dispatch(
  //   handleField(
  //     "generate-bill",
  //     "components.adhocDialog.children.confirmButton.props",
  //     "disabled",
  //     true
  //   )
  // );
  dispatch(toggleSpinner())
  
  //let state = store.getState();
  let selectedBillTriggerData = get(
    state.screenConfiguration.preparedFinalObject,
    "BulkBillCriteria",
    ""
  );
  let billTriggerFor = get(
    state.screenConfiguration.preparedFinalObject,
    "billTriggerFor",
    ""
  );
  

  let selectedTenantIds = get(
    selectedBillTriggerData,
    "tenantIds",
    []
  );

  let selectedSkipTenantIds = get(
    selectedBillTriggerData,
    "skipTenantIds",
    []
  );
  let specialRebateMonths = get(
    selectedBillTriggerData,
    "specialRebateMonths",
    ''
  );

  let demandMonth = get(
    selectedBillTriggerData,
    "demandMonth",
    0
  );

  let demandYear = get(
    selectedBillTriggerData,
    "demandYear",
    0
  );




  let tenantIds = [];
  if (billTriggerFor === "WS_BILL_TRIGGER_WITH_ULB_BUTTON") {
    if (selectedTenantIds && selectedTenantIds.length > 0) {

      let checkIfAllExists = selectedTenantIds && selectedTenantIds.filter(item =>
        item.value == "ALL"
      )
      if (checkIfAllExists && checkIfAllExists.length < 1) {
        for (let i = 0; i < selectedTenantIds.length; i++) {
          tenantIds.push(selectedTenantIds[i].value);
        }
      } else {
        tenantIds.push("ALL")
      }

    }

    let skipTenantIds = [];
    if (selectedSkipTenantIds && selectedSkipTenantIds.length > 0) {


      for (let i = 0; i < selectedSkipTenantIds.length; i++) {
        skipTenantIds.push(selectedSkipTenantIds[i].value);
      }


    } else {
      skipTenantIds.push("NONE")
    }


    let BulkBillCriteria = {
      "tenantIds": tenantIds,
      "skipTenantIds": skipTenantIds,
      "specialRebateMonths": specialRebateMonths == "Yes" ? [demandMonth] : null,
      "demandMonth": demandMonth,
      "demandYear": demandYear,
      "specialRebateYear": specialRebateMonths == "Yes" ? demandYear : null,
      "specificMonth": true
    }
    console.log(BulkBillCriteria, "nero BulkBillCriteria")

    let res = await triggerBillGenerationBatchForULBs(BulkBillCriteria, dispatch);
    if (res) {
      dispatch(toggleSpinner())
      const route = `/wns/acknowledgement?purpose=triggerBillGenerationBatch&status=success`;
      dispatch(setRoute(route));
    }
  }else{

    let connectionNos = get(
      selectedBillTriggerData,
      "connectionNos",
      []
    );
      let processedConnectionNo = []
    if(connectionNos && connectionNos.length > 0){
      for(let i=0; i< connectionNos.length; i++){
        processedConnectionNo.push(connectionNos[i].label)
      }
    }
    if (selectedTenantIds) {
      tenantIds = [selectedTenantIds]
    }

    let BulkBillCriteria = {
      "tenantIds": tenantIds,
      "specialRebateMonths": specialRebateMonths == "Yes" ? [demandMonth] : null,
      "demandMonth": demandMonth,
      "demandYear": demandYear,
      "specialRebateYear": specialRebateMonths == "Yes" ? demandYear : null,
      "specificMonth": true,
      "connectionNos": processedConnectionNo
    }
    console.log(BulkBillCriteria, "nero BulkBillCriteria ffff")

    let res = await triggerBillGenerationBatchForConnections(BulkBillCriteria, dispatch);
    if (res) {
      dispatch(toggleSpinner())
      const route = `/wns/acknowledgement?purpose=triggerBillGenerationBatch&status=success`;
      dispatch(setRoute(route));
      
    }

  }
  
}

const cancelCallback = () => {
  console.log("Nero in cancel")
}

export const getMdmsTenantsData = async (dispatch) => {
  let mdmsBody = {
    MdmsCriteria: {
      tenantId: commonConfig.tenantId,
      moduleDetails: [
        {
          moduleName: "tenant",
          masterDetails: [
            {
              name: "tenants"
            },
            {
              name: "citymodule"
            }
          ]
        },
      ]
    }
  };
  try {
    let payload = null;
    payload = await httpRequest(
      "post",
      "/egov-mdms-service/v1/_search",
      "_search",
      [],
      mdmsBody
    );
    payload.MdmsRes.tenant.tenants = payload.MdmsRes.tenant.citymodule[11].tenants;
    dispatch(prepareFinalObject("applyScreenMdmsData.tenant", payload.MdmsRes.tenant));

  } catch (e) {
    console.log(e);
  }



  dispatch(prepareFinalObject("billTriggerFor", "WS_BILL_TRIGGER_WITH_ULB_BUTTON"));
  dispatch(
    handleField(
      "generate-bill",
      "components.div.children.wnsApplication.children.cardContent.children.wnsApplicationContainer.children.specialRebateMonths",
      "value",
      "No"
    )
  );

  dispatch(
    handleField(
      "generate-bill",
      "components.div.children.generateBillWithConnections",
      "visible",
      false
    )
  );

  dispatch(prepareFinalObject("BulkBillCriteria.specialRebateMonths", "No"));

};

const employeeSearchResults = {
  uiFramework: "material-ui",
  name: "generate-bill",
  beforeInitScreen: (action, state, dispatch) => {

    getMdmsTenantsData(dispatch);
    
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Form",
      props: {
        className: "common-div-css",
        id: "search"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",

          children: {
            header: {
              gridDefination: {
                xs: 12,
                sm: 6
              },
              ...header
            },
            tradeLicenseType: {
              ...getSelectField({
                gridDefination: {
                  xs: 12,
                  sm: 6
                },
                label: {
                  labelName: "Action",
                  labelKey: "WS_HOME_SEARCH_ACTION_BUTTON"
                },
                placeholder: {
                  labelName: "Select Action",
                  labelKey: "WS_HOME_SEARCH_ACTION_BUTTON_PLACEHOLDER"
                },
                jsonPath: "billTriggerFor",

                data: [{ code: "WS_BILL_TRIGGER_WITH_ULB_BUTTON", active: true },
                { code: "WS_BILL_TRIGGER_WITH_CONNECTION_BUTTON", active: true },

                ]
              }),
              afterFieldChange: (action, state, dispatch) => {

                if (action.value == "WS_BILL_TRIGGER_WITH_CONNECTION_BUTTON") {
                  dispatch(prepareFinalObject("BulkBillCriteria", {}));
                  dispatch(
                    handleField(
                      "generate-bill",
                      "components.div.children.wnsApplication",
                      "visible",
                      false
                    )
                  );

                  dispatch(
                    handleField(
                      "generate-bill",
                      "components.div.children.generateBillWithConnections",
                      "visible",
                      true
                    )
                  );
                } else if (action.value === "WS_BILL_TRIGGER_WITH_ULB_BUTTON") {
                  dispatch(
                    handleField(
                      "generate-bill",
                      "components.div.children.wnsApplication",
                      "visible",
                      true
                    )
                  );

                  dispatch(
                    handleField(
                      "generate-bill",
                      "components.div.children.generateBillWithConnections",
                      "visible",
                      false
                    )
                  );
                }
              }
            },


          }
        },
        wnsApplication,
        breakAfterSearch: getBreak(),
        generateBillWithConnections
        // searchResults

      }
    },
    adhocDialog: {
      uiFramework: "custom-containers",
      componentPath: "DialogContainer",
      props: {
        open: false,
        maxWidth: false,
        screenKey: "generate-bill"
      },
      children: {
        header: {
          gridDefination: {
            xs: 12,
            sm: 12
          },

          ...popupHeader
        },
        
        confirmButton: {
          componentPath: "Button",
          // gridDefination: {
          //    xs: 12,
          //    sm: 6,
          //    align: "right"
          // },
          props: {
            variant: "outlined",
            color: "primary",
            style: {
              color: "white",
              // margin: "8px",
              backgroundColor: "#FE7A51",
              // borderRadius: "2px",
              // width: "220px",
              height: "48px",
              marginBottom: "50px"
            }
          },
          children: {
            buttonLabel: getLabel({
              labelKey: "WS_BILL_TRIGGER_CONFIRM_BUTTON",
              labelName: "CONFIRM"
            })
          },
          onClickDefination: {
            action: "condition",
            callBack: (state, dispatch) => {
              confirmCallback(state, dispatch);
            }
            
          }
        }
      }
    }
  }
};

export default employeeSearchResults;
