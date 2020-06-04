import { fetchData } from "./functions";
import { getCommonHeader, getSelectField, getCommonContainer, getLabel } from "egov-ui-framework/ui-config/screens/specs/utils";
import {
  sortByEpoch,
  getEpochForDate,
  getBpaTextToLocalMapping,
  getTextToLocalMapping
} from "../utils";
import store from "ui-redux/store";
import { getAppSearchResults, getSearchResults } from "../../../../ui-utils/commons";
import { handleScreenConfigurationFieldChange as handleField, prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getWorkFlowData, getWorkFlowDataForBPA } from "../bpastakeholder/searchResource/functions";
import get from "lodash/get";
import { getTransformedLocale } from "egov-ui-framework/ui-utils/commons";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";

const header = getCommonHeader(
  {
    labelName: "My Applications",
    labelKey: "BPA_MY_APPLICATIONS"
  },
  {
    classes: {
      root: "common-header-cont"
    }
  }
);

const screenConfig = {
  uiFramework: "material-ui",
  name: "my-applications",
  beforeInitScreen: (action, state, dispatch) => {
    fetchData(action, state, dispatch, true);
    return action;
  },

  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      children: {
        header: header,
        filterCard: getCommonContainer({
          applicationType: {
            ...getSelectField({
              label: {
                labelName: "Application Type",
                labelKey: "BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL"
              },
              placeholder: {
                labelName: "Select Application Type",
                labelKey: "BPA_BASIC_DETAILS_APPLICATION_TYPE_PLACEHOLDER"
              },
              jsonPath: "filterData[0].applicationType",
              props: {
                style: { marginLeft: "20px" }
              },
              visible: false,
              data: [
                {
                  // code: getBpaTextToLocalMapping("BPA_APPLY_SERVICE"),
                  code: "BPA_APPLY_SERVICE",
                  label: "BPA"
                },
                {
                  code: "BPAREG_SERVICE", //getBpaTextToLocalMapping("BPAREG_SERVICE"),
                  label: "Stakeholder"
                }
              ],
              gridDefination: {
                xs: 12,
                sm: 3
              }
            }),
            afterFieldChange: (action, state, dispatch) => {
              fieldChange(action, state, dispatch);
            }
          },
          serviceType: {
            ...getSelectField({
              label: {
                labelName: "Service Type",
                labelKey: "BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL"
              },
              placeholder: {
                labelName: "Select Service Type",
                labelKey: "BPA_BASIC_DETAILS_SERVICE_TYPE_PLACEHOLDER"
              },
              optionLabel: "name",
              sourceJsonPath: "applyScreenMdmsData.BPA.ServiceType",
              jsonPath: "filterData[0].serviceType",
              localePrefix: {
                moduleName: "WF",
                masterName: "BPA"
              },
              props: {
                style: { marginLeft: "20px" },
                // disabled: true
              },
              visible: false,              
              gridDefination: {
                xs: 12,
                sm: 3
              }
            }),
            afterFieldChange: (action, state, dispatch) => {
              fieldChange(action, state, dispatch);
            }
          },
          applicationStatus: {
            ...getSelectField({
              label: {
                labelName: "Status",
                labelKey: "BPA_STATUS_LABEL"
              },
              optionLabel: "name",
              placeholder: {
                labelName: "Select Status",
                labelKey: "BPA_STATUS_PLACEHOLDER"
              },
              jsonPath: "filterData[0].status", // + [getBpaTextToLocalMapping("BPA_COL_APP_STATUS")],
              data: [{ code: getBpaTextToLocalMapping("PENDINGPAYMENT") }, { code: getBpaTextToLocalMapping("REJECTED") }, { code: getBpaTextToLocalMapping("APPROVED") }, { code: getBpaTextToLocalMapping("INITIATED") }, { code: getBpaTextToLocalMapping("CITIZEN_APPROVAL_INPROCESS") }, { code: getBpaTextToLocalMapping("INPROGRESS") }, { code: getBpaTextToLocalMapping("PENDING_FEE") }, { code: getBpaTextToLocalMapping("DOC_VERIFICATION_INPROGRESS") }, { code: getBpaTextToLocalMapping("FIELDINSPECTION_INPROGRESS") }, { code: getBpaTextToLocalMapping("NOC_VERIFICATION_INPROGRESS") }, { code: getBpaTextToLocalMapping("APPROVAL_INPROGRESS") }, { code: getBpaTextToLocalMapping("PENDING_APPL_FEE") }, { code: getBpaTextToLocalMapping("PENDING_SANC_FEE_PAYMENT") }, { code: getBpaTextToLocalMapping("CITIZEN_ACTION_PENDING_AT_DOC_VERIF") }, { code: getBpaTextToLocalMapping("CITIZEN_ACTION_PENDING_AT_FI_VERIF") }, { code: getBpaTextToLocalMapping("CITIZEN_ACTION_PENDING_AT_NOC_VERIF") }],
              props: {
                style: { marginLeft: "20px" }
              },
              visible: false,              
              gridDefination: {
                xs: 12,
                sm: 3
              }
            }),
            afterFieldChange: (action, state, dispatch) => {
              fieldChange(action, state, dispatch);
            }
          },
          clearBtn: {
            componentPath: "Button",
            gridDefination: {
              xs: 12,
              sm: 3
              // align: "center"
            },
            props: {
              variant: "contained",
              style: {
                color: "white",
                margin: "8px",
                backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
                borderRadius: "2px",
                width: "220px",
                height: "48px"
              }
            },
            visible: false,            
            children: {
              buttonLabel: getLabel({
                labelName: "Clear Filter",
                labelKey: "Clear Filter"
              })
            },
            onClickDefination: {
              action: "condition",
              // callBack: clearFilter
            }
          }
        }),
        applicationsCard: {
          uiFramework: "custom-molecules",
          name: "my-applications",
          componentPath: "Table",
          props: {
            columns: [
              {
                name: "Application No", labelKey: "EDCR_COMMON_TABLE_APPL_NO"
              },
              {
                name: "Building Plan Scrutiny No", labelKey: "EDCR_COMMON_TABLE_SCRUTINY_NO"
              },
              {
                name: "City", labelKey: "EDCR_COMMON_TABLE_CITY_LABEL"
              },
              {
                name: "Applicant Name", labelKey: "EDCR_COMMON_TABLE_APPL_NAME"
              },
              {
                name: "Status", labelKey: "EDCR_COMMON_TABLE_COL_STATUS"
              },
              {
                name: "Download Scrutiny Number", labelKey: "EDCR_DOWNLOAD_REPORT"
              },
              {
                name: "Building Plan Download", labelKey: "EDCR_DOWNLOAD_BUILDING_PLAN"
              },
              {
                name: "tenantId",
                labelKey: "tenantId",
                options: {
                  display: false
                }
              },
              {
                name: "serviceType",
                labelKey: "serviceType",
                options: {
                  display: false
                }
              },
              {
                name: "type",
                labelKey: "type",
                options: {
                  display: false
                }
              }
            ],
            title: {
              labelName: "Search Results for BPA Applications",
              labelKey: "BPA_SEARCH_RESULTS_FOR_APP"
            },
            rows: "",
            options: {
              filter: false,
              download: false,
              responsive: "stacked",
              selectableRows: false,
              hover: true,
              rowsPerPageOptions: [10, 15, 20],
              onCellClick: (row, index) => {
                onCellClick(row, index);
              },
            },
            customSortColumn: {
              column: "Application Date",
              sortingFn: (data, i, sortDateOrder) => {
                const epochDates = data.reduce((acc, curr) => {
                  acc.push([...curr, getEpochForDate(curr[4], "dayend")]);
                  return acc;
                }, []);
                const order = sortDateOrder === "asc" ? true : false;
                const finalData = sortByEpoch(epochDates, !order).map(item => {
                  item.pop();
                  return item;
                });
                return { data: finalData, currentOrder: !order ? "asc" : "desc" };
              }
            }
          }
        }
      }
    }
  }
};

const onCellClick = (row, index) => {
  let state = store.getState();  
  let cellData = get(
    state.screenConfiguration,
    "screenConfig.my-applications.components.div.children.applicationsCard.props.data",
    []
  );
 if(  cellData[index.rowIndex].EDCR_DOWNLOAD_REPORT  == row) {
   window.open(cellData[index.rowIndex].EDCR_DOWNLOAD_REPORT1)
 }
 if(  cellData[index.rowIndex].EDCR_DOWNLOAD_BUILDING_PLAN  == row) {
  window.open(cellData[index.rowIndex].EDCR_DOWNLOAD_BUILDING_PLAN1)
}
};

export const changePage = async (tableState) => {
  let state = store.getState();
  let searchResults = get(
    state.screenConfiguration.preparedFinalObject,
    "searchResults"    
  );
  let searchConvertedArray = [];
    if (searchResults) {
    if (searchResults && searchResults.length > 0) {
      searchResults.forEach(element => {
        searchConvertedArray.push({
          ["EDCR_COMMON_TABLE_APPL_NO"]: element.applicationNumber || "-",
          ["EDCR_COMMON_TABLE_SCRUTINY_NO"]: element.edcrNumber || "-",
          ["EDCR_COMMON_TABLE_CITY_LABEL"]: element.tenantId || "-",
          ["EDCR_COMMON_TABLE_APPL_NAME"]: element.planDetail.planInformation.applicantName || "-",
          ["EDCR_COMMON_TABLE_COL_STATUS"]: element.status || "-",
          ["EDCR_DOWNLOAD_REPORT"]: getLocaleLabels("DOWNLOAD SCRUTINY REPORT", "EDCR_DOWNLOAD_REPORT" ),
          ["EDCR_DOWNLOAD_BUILDING_PLAN"]: getLocaleLabels("DOWNLOAD BUILDING PLAN(DXF)", "EDCR_DOWNLOAD_BUILDING_PLAN"),
          ["EDCR_DOWNLOAD_REPORT1"]: element.planReport,
          ["EDCR_DOWNLOAD_BUILDING_PLAN1"]: element.dxfFile,
        })
      });
    }
  }
  store.dispatch(
    handleField(
      "my-applications",
      "components.div.children.applicationsCard",
      "props.data",
      searchConvertedArray
    ));
    store.dispatch(
      handleField(
        "my-applications",
        "components.div.children.applicationsCard",
        "props.rows",
        searchConvertedArray.length
      )
    );
};

export default screenConfig;