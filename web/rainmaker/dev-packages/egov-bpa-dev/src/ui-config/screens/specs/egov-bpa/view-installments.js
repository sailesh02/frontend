import {
  getCommonContainer, getCommonHeader, getSelectField, getCommonCard, getCommonParagraph, getCommonCaption,
  getCommonValue, dispatchMultipleFieldChangeAction
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { handleScreenConfigurationFieldChange as handleField, toggleSpinner, hideSpinner } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import set from "lodash/set";

import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";

import { viewPaymentDetails } from "./searchResource/citizenFooter";
import { httpRequest } from "../../../../ui-utils/api"
import store from "ui-redux/store";
import {getInstallmentInfoForInstallmentPage} from "../utils"
// const header = getCommonHeader(
//   {
//     labelName: "My Applications",
//     labelKey: "BPA_INSTALLMENTS_DETAILS"
//   },
//   {
//     classes: {
//       root: "common-header-cont"
//     }
//   }
// );
export const header = getCommonContainer({
  header: getCommonHeader({
    labelName: `Payment Details`,
    labelKey: "Payment Details"
  },
    {
      style: {
        marginLeft: "20px",
        marginTop: "10px",
      }
    }
  )
});
export const getFullPaymentObject = (action, state, dispatch) => {
  let installmentInfo = get(state, "screenConfiguration.preparedFinalObject.installmentsInfo");
  let installments = installmentInfo && installmentInfo.installments;
  console.log(installments, "Nero Installmentss");
  let fullPaymentInstallmentIds = [];
  for (let i = 0; i < installments.length; i++) {
    for (let j = 0; j < installments[i].length; j++) {
      console.log(installments[i][j], "Nero iii")
      fullPaymentInstallmentIds.push(installments[i][j].installmentno);
    }

  }

  console.log(fullPaymentInstallmentIds, "Nero Ids")
}
const getDummyResponse = () => {

  let installmentsObj = {
    "fullPayment": [
      {
        "id": "da7737e9-c8ab-4c63-8db5-21dc17842def",
        "tenantId": "od.cuttack",
        "installmentNo": -1,
        "status": "ACTIVE",
        "consumerCode": "BP-CTC-2022-07-07-002019",
        "taxHeadCode": "BPA_SANC_SANC_FEE",
        "taxAmount": 2475.0,
        "demandId": null,
        "isPaymentCompletedInDemand": false,
        "auditDetails": {
          "createdBy": "52476c81-d588-4395-bf63-f605b19783ee",
          "lastModifiedBy": "52476c81-d588-4395-bf63-f605b19783ee",
          "createdTime": 1657194641356,
          "lastModifiedTime": 1657194641356
        },
        "additionalDetails": null
      },
      {
        "id": "e12f566d-0fc2-4f92-861b-30ab7be860f3",
        "tenantId": "od.cuttack",
        "installmentNo": -1,
        "status": "ACTIVE",
        "consumerCode": "BP-CTC-2022-07-07-002019",
        "taxHeadCode": "BPA_SANC_WORKER_WELFARE_CESS",
        "taxAmount": 32334.0,
        "demandId": null,
        "isPaymentCompletedInDemand": false,
        "auditDetails": {
          "createdBy": "52476c81-d588-4395-bf63-f605b19783ee",
          "lastModifiedBy": "52476c81-d588-4395-bf63-f605b19783ee",
          "createdTime": 1657194641357,
          "lastModifiedTime": 1657194641357
        },
        "additionalDetails": null
      }
      
    ],
    "installments": [
      [
        {
          "id": "04533f79-8710-446d-9847-7a8763f6b436",
          "tenantId": "od.cuttack",
          "installmentNo": 1,
          "status": "ACTIVE",
          "consumerCode": "BP-CTC-2022-07-07-002019",
          "taxHeadCode": "BPA_SANC_PUR_FAR",
          "taxAmount": 0.0,
          "demandId": "dsdsdsdsd",
          "isPaymentCompletedInDemand": true,
          "auditDetails": {
            "createdBy": "52476c81-d588-4395-bf63-f605b19783ee",
            "lastModifiedBy": "52476c81-d588-4395-bf63-f605b19783ee",
            "createdTime": 1657194641357,
            "lastModifiedTime": 1657194641357
          },
          "additionalDetails": {
            "varificationDocuments": [
              {
                "fileName": "1657866882733consolidatedreceipt-1657866881182.pdf",
                "fileStoreId": "169b778a-95aa-46c4-9354-40c3a5e763b7",
                "documentType": "Document - 1"
              }
            ]
          }
        },
        {
          "id": "fb2882b6-7e61-4376-9f2e-b618a6ee0fb3",
          "tenantId": "od.cuttack",
          "installmentNo": 1,
          "status": "ACTIVE",
          "consumerCode": "BP-CTC-2022-07-07-002019",
          "taxHeadCode": "BPA_SANC_SECURITY_DEPOSIT",
          "taxAmount": 0.0,
          "demandId": "dsdsdsdsd",
          "isPaymentCompletedInDemand": true,
          "auditDetails": {
            "createdBy": "52476c81-d588-4395-bf63-f605b19783ee",
            "lastModifiedBy": "52476c81-d588-4395-bf63-f605b19783ee",
            "createdTime": 1657194641357,
            "lastModifiedTime": 1657194641357
          },
          "additionalDetails": {
            "varificationDocuments": [
              {
                "fileName": "1657866882733consolidatedreceipt-1657866881182.pdf",
                "fileStoreId": "169b778a-95aa-46c4-9354-40c3a5e763b7",
                "documentType": "Document - 1"
              }
            ]
          }
        },
        {
          "id": "dc0bb772-b802-41f5-a6a9-3c016a44d8d4",
          "tenantId": "od.cuttack",
          "installmentNo": 1,
          "status": "ACTIVE",
          "consumerCode": "BP-CTC-2022-07-07-002019",
          "taxHeadCode": "BPA_SANC_WORKER_WELFARE_CESS",
          "taxAmount": 10778.0,
          "demandId": "dsdsdsdsd",
          "isPaymentCompletedInDemand": true,
          "auditDetails": {
            "createdBy": "52476c81-d588-4395-bf63-f605b19783ee",
            "lastModifiedBy": "52476c81-d588-4395-bf63-f605b19783ee",
            "createdTime": 1657194641357,
            "lastModifiedTime": 1657194641357
          },
          "additionalDetails": {
            "varificationDocuments": [
              {
                "fileName": "1657866882733consolidatedreceipt-1657866881182.pdf",
                "fileStoreId": "169b778a-95aa-46c4-9354-40c3a5e763b7",
                "documentType": "Document - 1"
              }
            ]
          }
        },
        
      ],
      [
        {
          "id": "524ebe35-b26b-4961-89a6-20c9539cbd3e",
          "tenantId": "od.cuttack",
          "installmentNo": 2,
          "status": "ACTIVE",
          "consumerCode": "BP-CTC-2022-07-07-002019",
          "taxHeadCode": "BPA_SANC_EIDP_FEE",
          "taxAmount": 0.0,
          "demandId": null,
          "isPaymentCompletedInDemand": false,
          "auditDetails": {
            "createdBy": "52476c81-d588-4395-bf63-f605b19783ee",
            "lastModifiedBy": "52476c81-d588-4395-bf63-f605b19783ee",
            "createdTime": 1657194641357,
            "lastModifiedTime": 1657194641357
          },
          "additionalDetails": null
        },
        {
          "id": "93bd2d98-1f47-45de-a97d-0f2afabed3d8",
          "tenantId": "od.cuttack",
          "installmentNo": 2,
          "status": "ACTIVE",
          "consumerCode": "BP-CTC-2022-07-07-002019",
          "taxHeadCode": "BPA_SANC_SHELTER_FEE",
          "taxAmount": 250.0,
          "demandId": null,
          "isPaymentCompletedInDemand": false,
          "auditDetails": {
            "createdBy": "52476c81-d588-4395-bf63-f605b19783ee",
            "lastModifiedBy": "52476c81-d588-4395-bf63-f605b19783ee",
            "createdTime": 1657194641357,
            "lastModifiedTime": 1657194641357
          },
          "additionalDetails": null
        }
      ],
      [
        {
          "id": "99b5ba89-1025-4cf6-8808-f39ddced2fb0",
          "tenantId": "od.cuttack",
          "installmentNo": 3,
          "status": "ACTIVE",
          "consumerCode": "BP-CTC-2022-07-07-002019",
          "taxHeadCode": "BPA_SANC_SHELTER_FEE",
          "taxAmount": 562.0,
          "demandId": null,
          "isPaymentCompletedInDemand": false,
          "auditDetails": {
            "createdBy": "52476c81-d588-4395-bf63-f605b19783ee",
            "lastModifiedBy": "52476c81-d588-4395-bf63-f605b19783ee",
            "createdTime": 1657194641357,
            "lastModifiedTime": 1657194641357
          },
          "additionalDetails": null
        }
      ]
    ]
  }
  return installmentsObj;
}
export const getInstallmentsDetails = async (action, state, dispatch) => {
  let applicationNumber = getQueryArg(window.location.href, "applicationNumber");
  let tenant = getQueryArg(window.location.href, "tenantId");
  var installmentsObj;
  var fullPaymentObj;
  try {
    let response = '';
    //  response = await httpRequest(
    //   "post",
    //   "bpa-services/v1/bpa/_getAllInstallments",
    //   "",
    //   [],
    //   {
    //     InstallmentSearchCriteria: {
    //       "consumerCode": applicationNumber
    //     }
    //   }
    // );
   // response = getDummyResponse();
    response = await getInstallmentInfoForInstallmentPage();
    console.log(response, "Nero hhhhh")
    if (response) {
      var selectedPaymentMode = '';
      if (response && response.installments && response.installments.length > 0) {
        installmentsObj = response && response.installments;
        installmentsObj = { installments: installmentsObj };

        dispatch(prepareFinalObject("installmentsInfo", installmentsObj));

        dispatch(prepareFinalObject("selectedInstallments", []));
        let notPaidInstallments = [];
        let totalInstallments = installmentsObj.installments.length;
        console.log(totalInstallments, "Nero Total install")

        if (totalInstallments && totalInstallments > 0) {
          for (let i = 0; i < installmentsObj.installments.length; i++) {
            for (let j = 0; j < installmentsObj.installments[i].length; j++) {
              if (!installmentsObj.installments[i][j].isPaymentCompletedInDemand) {
                console.log(installmentsObj.installments[i][j], "Nero iii")
                notPaidInstallments.push(installmentsObj.installments[i][j].installmentNo);
              }
              if(installmentsObj.installments[i][j].isPaymentCompletedInDemand){
                dispatch(prepareFinalObject("selectedPaymentMode", "Installment"));
                selectedPaymentMode = "Installment"
              }
            }
          }

          let unsortedUniqueNotPaidInstallments = [...new Set(notPaidInstallments)];
          let finalNotPaidInstallments = unsortedUniqueNotPaidInstallments.sort(function (a, b) { return a - b });
          dispatch(prepareFinalObject("notPaidInstallments", finalNotPaidInstallments));
        }
      }
      if (response && response.fullPayment && response.fullPayment.length > 0) {
        dispatch(prepareFinalObject("fullPaymentInfo", response.fullPayment));
        if(response && response.fullPayment && response.fullPayment[0].isPaymentCompletedInDemand){
         // dispatch(prepareFinalObject("selectedPaymentMode", "Full payment"));
         selectedPaymentMode = "Full payment";
        }
        
        

      }

      dispatch(prepareFinalObject("Installments.knowMoreAboutInstallments", "Know more about installments"));

      if(selectedPaymentMode === "Full payment"){
        console.log("Nero in Fullpayment")
        set(
          action,
          "screenConfig.components.div.children.choosePaymentTypeContainer.children.choosePaymentType.props.disabled",
          true
        );
        set(
          action,
          "screenConfig.components.div.children.viewPaymentDetails.visible",
          false
        );
        
      }
      if(selectedPaymentMode === "Installment"){
        console.log("Hello Nero")
        // dispatch(
        //   handleField("view-installments", "components.div.children.choosePaymentTypeContainer.children.choosePaymentType.props", "value", "Installment")
        // );
        // set(
        //   action,
        //   "screenConfig.components.div.children.choosePaymentTypeContainer.children.choosePaymentType.props.value",
        //   "Installment"
        // );
        // set(
        //   action,
        //   "screenConfig.components.div.children.choosePaymentTypeContainer.children.installmentsInfo.visible",
        //   false
        // );
        const actionDefination = [
          
          {
            path: "components.div.children.choosePaymentTypeContainer.children.choosePaymentType.props",
            property: "value",
            value: "Installment"
          },
          {
            path: "components.div.children.choosePaymentTypeContainer.children.choosePaymentType.props",
            property: "disabled",
            value: true
          },
          {
            path: "components.div.children.choosePaymentTypeContainer.children.installmentContainer",
            property: "visible",
            value: true
          },
          {
            path: "components.div.children.choosePaymentTypeContainer.children.fullPaymentContainer",
            property: "visible",
            value: false
          }
        ];
        dispatchMultipleFieldChangeAction("view-installments", actionDefination, dispatch);
        // set(
        //   action,
        //   "screenConfig.components.div.children.choosePaymentTypeContainer.children.choosePaymentType.props.disabled",
        //   true
        // );
        // set(
        //   action,
        //   "screenConfig.components.div.children.viewPaymentDetails.visible",
        //   false
        // );
        
      }


    }
  } catch (error) {
    console.log(error, "Error")
  }
  


  // dispatch(prepareFinalObject("installmentsInfo", installmentsObj));

  // dispatch(prepareFinalObject("selectedInstallments", []));
  // let notPaidInstallments = [];
  // let totalInstallments = installmentsObj.installments.length;
  // console.log(totalInstallments, "Nero Total install")

  // if (totalInstallments && totalInstallments > 0) {
  //   for (let i = 0; i < installmentsObj.installments.length; i++) {
  //     for (let j = 0; j < installmentsObj.installments[i].length; j++) {
  //       if (!installmentsObj.installments[i][j].ispaymentcompletedindemand) {
  //         console.log(installmentsObj.installments[i][j], "Nero iii")
  //         notPaidInstallments.push(installmentsObj.installments[i][j].installmentno);
  //       }
  //     }
  //   }

  //   let unsortedUniqueNotPaidInstallments = [...new Set(notPaidInstallments)];
  //   let finalNotPaidInstallments = unsortedUniqueNotPaidInstallments.sort(function(a, b){return a - b});
  //   dispatch(prepareFinalObject("notPaidInstallments", finalNotPaidInstallments));
  // }

  //getFullPaymentObject(action, state, dispatch);
  //console.log(response, "Nero Res")
}

export const installmentsInfo = getCommonCard({
  header: getCommonParagraph(
    {
      labelName:
        "Accredited person is a technical person or an architect certified by authority to approve building permit of low risk buildings. Once selected the approver can not be changed",
      labelKey: `You can avail installment on below mentioned fee component:
      Worker welfare CESS fee,
      Purchasable FAR fee,
      EIDP fee
      Shelter fee
      The payment schedule will be as follows:
      1st Installment- At the time of Sanction Fees
      2nd Installment- To be paid At the time of Plinth Level
      3rd Installment- To be paid At the time of Ground Floor Roof Casting
      4th Installment- To be paid At the time of application of Occupancy Certificate
      
      For delayed payment, applicant shall be liable to pay penalty amount while applying for Occupancy Certificate. `,
    },
    {
      style: {
        marginBottom: 18,
      },
    }
  ),
}
);

const handleEligibilityCheckStatus = () => {
  //console.log(state, dispatch, "Ner oheellll")
  //store.dispatch(prepareFinalObject("selectedInstallments", selectedInstallments))
  //  handleField("search-preview", "components.div.children.popupForScrutinyDetail", "props.open", true)
  store.dispatch(
    handleField("view-installments", "components.div.children.popupForScrutinyDetail", "props.open", true)
  );
};

const getInstallmentInformation = (label, value, props = {}) => {
  return {
    uiFramework: "custom-atoms",
    componentPath: "Href",
    gridDefination: {
      xs: 12,
      sm: 6
    },

    // visible: CONSTANTS.isUatVisible ? true : false,
    props: {

      disabled: true,
      onClick: handleEligibilityCheckStatus,
      ...props,
    },
    children: {
      label: getCommonCaption(label),
      value: getCommonValue(value),
    },
  };
};

const screenConfig = {
  uiFramework: "material-ui",
  name: "view-installments",
  beforeInitScreen: (action, state, dispatch) => {
    getInstallmentsDetails(action, state, dispatch);
   
    set(
      action,
      "screenConfig.components.div.children.choosePaymentTypeContainer.children.installmentContainer.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.choosePaymentTypeContainer.children.installmentsInfo.visible",
      false
    );
    set(
      action,
      "screenConfig.components.div.children.choosePaymentTypeContainer.children.choosePaymentType.props.value",
      "Full payment"
    );

    
console.log(state, "Nero State")
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css bpa-searchpview"
      },
      children: {
        header: header,
        choosePaymentTypeContainer: getCommonContainer({
          choosePaymentType: getSelectField({
            label: {
              labelName: "Application Type",
              labelKey: "Select payment type"
            },
            placeholder: {
              labelName: "Select Application Type",
              labelKey: "Select payment type"
            },

            props: {
              //disabled: true,
              className: "tl-trade-type",
              style: { marginLeft: "20px" }
            },
            jsonPath: "BPA.applicationType",
            //sourceJsonPath: "applyScreenMdmsData.BPA.ApplicationType",
            data: [{ code: "Full payment", label: "Full Payment" }, { code: "Installment", label: "In Installments" }],
            // required: true,
            gridDefination: {
              xs: 12,
              sm: 12,
              md: 6
            },
            beforeFieldChange: (action, state, dispatch) => {
              dispatch(prepareFinalObject("selectedInstallments", []))
              if (action && action.value === "Full payment") {
                console.log(action.value, "lNero sss")
                dispatch(
                  handleField("view-installments", "components.div.children.choosePaymentTypeContainer.children.installmentContainer", "visible", false)
                );
                dispatch(
                  handleField("view-installments", "components.div.children.choosePaymentTypeContainer.children.fullPaymentContainer", "visible", true)
                );
                dispatch(
                  handleField("view-installments", "components.div.children.choosePaymentTypeContainer.children.installmentsInfo", "visible", false)
                );
              } else {


                dispatch(
                  handleField("view-installments", "components.div.children.choosePaymentTypeContainer.children.fullPaymentContainer", "visible", false)
                );
                dispatch(
                  handleField("view-installments", "components.div.children.choosePaymentTypeContainer.children.installmentContainer", "visible", true)
                );
                dispatch(
                  handleField("view-installments", "components.div.children.choosePaymentTypeContainer.children.installmentsInfo", "visible", true)
                );
              }
            }
          }),
          installmentsInfo: getInstallmentInformation(
            {
              labelName: "",
              labelKey: "",
            },
            {
              jsonPath: "Installments.knowMoreAboutInstallments",
              style: { color: "#FE7A51" },
            },
            {
              style: { paddingTop: "37px", display: "flex", cursor: "pointer" }
            }
          ),
          fullPaymentContainer: {
            uiFramework: 'custom-containers-local',
            componentPath: 'FullPaymentContainer',
            moduleName: "egov-bpa"
          },

          installmentContainer: {
            uiFramework: 'custom-containers-local',
            componentPath: 'DynamicCheckboxes',
            moduleName: "egov-bpa"
          },
        }),
        popupForScrutinyDetail: {
          componentPath: "Dialog",
          isClose: true,
          props: {
            open: false,
            maxWidth: "md"
          },
          children: {
            dialogContent: {
              componentPath: "DialogContent",
              props: {
                classes: {
                  root: "city-picker-dialog-style"
                }
              },
              children: {
                popup: getCommonContainer({
                  header: getCommonHeader({
                    labelName: "Installment Information",
                    labelKey: "BPA_INSTALLMENT_INFORMATION_HEADER"
                  }),
                  closePop: getCommonContainer({
                    closeCompInfo: {
                      uiFramework: "custom-molecules-local",
                      moduleName: "egov-bpa",
                      componentPath: "CloseDialog",
                      required: true,
                      gridDefination: {
                        xs: 12,
                        sm: 12
                      },
                      props: {
                        screen: "view-installments",
                        jsonpath: "components.div.children.popupForScrutinyDetail"
                      }
                    },
                  }),
                  installmentsInfo: installmentsInfo,

                })
              }
            }
          }
        },
        sendToArchPickerDialog: {
          componentPath: "Dialog",
          props: {
            open: false,
            maxWidth: "md"
          },
          children: {
            dialogContent: {
              componentPath: "DialogContent",
              props: {
                classes: {
                  root: "city-picker-dialog-style"
                }
              },
              children: {
                popup: getCommonContainer({
                  header: getCommonHeader({
                    labelName: "Forward Application",
                    labelKey: "BPA_UPLOAD_PREVIOUS_INSTALLMENT_BILL"
                  }),
                  cityPicker: getCommonContainer({
                    cityDropdown: {
                      uiFramework: "custom-molecules-local",
                      moduleName: "egov-bpa",
                      componentPath: "GenerateInstallmentsDemandDialog",
                      required: true,
                      gridDefination: {
                        xs: 12,
                        sm: 12
                      },
                      props: {}
                    },
                  })
                })
              }
            }
          }
        },
        viewPaymentDetails: process.env.REACT_APP_NAME === "Citizen" ? viewPaymentDetails : {},
      }
    }
  }
};


export default screenConfig;
