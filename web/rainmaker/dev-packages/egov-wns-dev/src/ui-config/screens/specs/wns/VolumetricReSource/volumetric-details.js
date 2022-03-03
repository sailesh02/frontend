import {
    getCommonCard,
    getCommonTitle,
    getTextField,
    getSelectField,
    getCommonContainer,
    getCommonParagraph,
    getPattern,
    getCommonSubHeader,
    getLabel,
    getLabelWithValue,
    getCommonGrayCard,
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { getUserInfo, getTenantIdCommon } from "egov-ui-kit/utils/localStorageUtils";
  import get from "lodash/get";
  import {
    handleScreenConfigurationFieldChange as handleField,
    prepareFinalObject
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  import store from "ui-redux/store";
  import { changeStep } from "../viewBillResource/footer";
  import { handleNA } from '../../utils';
  import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
  import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
  import set from "lodash/set";
  import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
//   import { fetchBill } from "../../../../../ui-utils/commons"
  import { fetchBill, volumetricUpdate, findAndReplace, getSearchResults, getSearchResultsForSewerage, getWorkFlowData, serviceConst } from "../../../../../ui-utils/commons";


  const UpdateVolumetricData =(state, action, dispatch)=>{
    const connectionFacility = getQueryArg(window.location.href, "connectionFacility")
    const connectionType = getQueryArg(window.location.href, "connectionType")
    store.dispatch(
      handleField(
          "volumetric-connection-details",
          "components.div.children.connectionDetails.children.cardContent.children.volumetricDetail.children.cardContent.children.viewVolumetricFields.children.volumetricValue",
          "visible",
          false
      )
  )

  store.dispatch(
    handleField(
        "volumetric-connection-details",
        "components.div.children.connectionDetails.children.cardContent.children.volumetricDetail.children.cardContent.children.viewVolumetricFields.children.migretedSewergeValue",
        "visible",
        false
    )
)
      if (connectionFacility === serviceConst.WATER) {
    
        store.dispatch(
            handleField(
                "volumetric-connection-details",
                "components.div.children.connectionDetails.children.cardContent.children.volumetricDetail.children.cardContent.children.viewVolumetricFields.children.volumetricWaterCharge.props",
                "disabled",
                false
            )
        )

        store.dispatch(
            handleField(
                "volumetric-connection-details",
                "components.div.children.connectionDetails.children.cardContent.children.volumetricDetail.children.cardContent.children.viewVolumetricFields.children.migratedSewerageFee.props",
                "disabled",
                true
            )
        )
      }
      else if(connectionFacility === serviceConst.SEWERAGE){
    store.dispatch(
        handleField(
            "volumetric-connection-details",
            "components.div.children.connectionDetails.children.cardContent.children.volumetricDetail.children.cardContent.children.viewVolumetricFields.children.migratedSewerageFee.props",
            "disabled",
            false
        )
    )

    store.dispatch(
        handleField(
            "volumetric-connection-details",
            "components.div.children.connectionDetails.children.cardContent.children.volumetricDetail.children.cardContent.children.viewVolumetricFields.children.volumetricWaterCharge.props",
            "disabled",
            true
        )
    )
        }
        else{
            store.dispatch(
                handleField(
                    "volumetric-connection-details",
                    "components.div.children.connectionDetails.children.cardContent.children.volumetricDetail.children.cardContent.children.viewVolumetricFields.children.migratedSewerageFee.props",
                    "disabled",
                    false
                )
            )


        store.dispatch(
            handleField(
                "volumetric-connection-details",
                "components.div.children.connectionDetails.children.cardContent.children.volumetricDetail.children.cardContent.children.viewVolumetricFields.children.volumetricWaterCharge.props",
                "disabled",
                false
            )
        )
        
        }
  
  store.dispatch(
      handleField(
          "volumetric-connection-details",
          "components.div.children.connectionDetails.children.cardContent.children.volumetricDetail.children.cardContent.children.viewVolumetricFields.children.volumetricWaterCharge",
          "visible",
          true
      )
  )
      
    store.dispatch(
            handleField(
                "volumetric-connection-details",
                "components.div.children.connectionDetails.children.cardContent.children.volumetricDetail.children.cardContent.children.viewVolumetricFields.children.migratedSewerageFee",
                "visible",
                true
            )
        )
    store.dispatch(
        handleField(
            "volumetric-connection-details",
            "components.div.children.connectionDetails.children.cardContent.children.volumetricDetail.children.cardContent.children.viewVolumetricFields.children.button.children.buttonContainer.children.UpdateButton",
            "visible",
            true
        )
    )

    store.dispatch(
        handleField(
            "volumetric-connection-details",
            "components.div.children.connectionDetails.children.cardContent.children.volumetricDetail.children.cardContent.children.viewVolumetricFields.children.button.children.buttonContainer.children.CancleButton",
            "visible",
            true
        )
    )

    store.dispatch(
        handleField(
            "volumetric-connection-details",
            "components.div.children.connectionDetails.children.cardContent.children.volumetricDetail.children.cardContent.children.headerDiv.children.header.children.searchButton",
            "visible",
            false
        )
    )
  }

  const UpdateVolumetricAPI = async(state, dispatch)=>{
    const tenantId = getTenantIdCommon()
    const connectionNumber = getQueryArg(window.location.href, "connectionNumber");
    let data = get(state.screenConfiguration.preparedFinalObject,"WaterConnection[0]");
  
const queryObj ={
    WaterConnection:{
        id:data.id,
        tenantId:tenantId,
        connectionNo:connectionNumber,
        additionalDetails:{
               volumetricWaterCharge:data.additionalDetails.volumetricWaterCharge,
                migratedSewerageFee:data.additionalDetails.migratedSewerageFee
             },
                applicationType:"UPDATE_VOLUMETRIC_DETAILS"
    }
}

let VolumetricResults = await volumetricUpdate(queryObj, dispatch)

  }

  const CancleEdit =()=>{
    store.dispatch(
      handleField(
          "volumetric-connection-details",
          "components.div.children.connectionDetails.children.cardContent.children.volumetricDetail.children.cardContent.children.viewVolumetricFields.children.volumetricValue",
          "visible",
          true
      )
  )

  store.dispatch(
    handleField(
        "volumetric-connection-details",
        "components.div.children.connectionDetails.children.cardContent.children.volumetricDetail.children.cardContent.children.viewVolumetricFields.children.migretedSewergeValue",
        "visible",
        true
    )
  )
    store.dispatch(
      handleField(
          "volumetric-connection-details",
          "components.div.children.connectionDetails.children.cardContent.children.volumetricDetail.children.cardContent.children.viewVolumetricFields.children.volumetricWaterCharge",
          "visible",
          false
      )
  )
      
    store.dispatch(
            handleField(
                "volumetric-connection-details",
                "components.div.children.connectionDetails.children.cardContent.children.volumetricDetail.children.cardContent.children.viewVolumetricFields.children.migratedSewerageFee",
                "visible",
                false
            )
        )
    store.dispatch(
        handleField(
            "volumetric-connection-details",
            "components.div.children.connectionDetails.children.cardContent.children.volumetricDetail.children.cardContent.children.viewVolumetricFields.children.button.children.buttonContainer.children.UpdateButton",
            "visible",
            false
        )
    )

    store.dispatch(
        handleField(
            "volumetric-connection-details",
            "components.div.children.connectionDetails.children.cardContent.children.volumetricDetail.children.cardContent.children.viewVolumetricFields.children.button.children.buttonContainer.children.CancleButton",
            "visible",
            false
        )
    )
    store.dispatch(
        handleField(
            "volumetric-connection-details",
            "components.div.children.connectionDetails.children.cardContent.children.volumetricDetail.children.cardContent.children.headerDiv.children.header.children.searchButton",
            "visible",
            true
        )
    )

  }
  const renderService =()=> {

  return  getCommonContainer({
    volumetricWaterCharge:getTextField({
        label: {
            labelKey: "WS_VOLUMETRIC_WATER_CHARGE",
            labelName: "Volumetric Water Charge"
        },
        placeholder: {
            labelKey: "WS_ENTER_VOLUMETRIC_WATER_CHARGE_PLACEHOLDER"
        },
        gridDefination: {
            xs: 12,
            sm: 4
        },
        required: true,
        disabled:false,
        visible:false,
        pattern: /^[1-9]\d*(\.\d+)?$/i,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "WaterConnection[0].additionalDetails.volumetricWaterCharge"
    }),
    
    migratedSewerageFee: getTextField({
        label: {
            labelKey: "WS_MIGRATED_SEWERAGE_FEE",
            labelName:"Migrated Sewerage Fee"
        },
        placeholder: {
            labelKey: "WS_ENTER_MIGRATED_SEWERAGE_FEE_PLACEHOLDER"
        },
        gridDefination: {
            xs: 12,
            sm: 4
        },
        required: true,
        disabled:false,
        visible:false,
        pattern: /^[1-9]\d*(\.\d+)?$/i,
        errorMessage: "ERR_DEFAULT_INPUT_FIELD_MSG",
        jsonPath: "WaterConnection[0].additionalDetails.migratedSewerageFee"
    }),
 
    volumetricValue:  getLabelWithValue(
      {
        labelKey: "WS_VOLUMETRIC_WATER_CHARGE",
        labelName: "Volumetric Water Charge",
      },
      { jsonPath: "WaterConnection[0].additionalDetails.volumetricWaterCharge"}

    ),

  
    migretedSewergeValue:getLabelWithValue(
      {
        labelKey: "WS_MIGRATED_SEWERAGE_FEE",
        labelName:"Migrated Sewerage Fee",
      },
      {jsonPath: "WaterConnection[0].additionalDetails.migratedSewerageFee"}
    ),
   
  
  
    button: getCommonContainer({
        buttonContainer: getCommonContainer({
          UpdateButton: {
            componentPath: "Button",
            gridDefination: {
              xs: 12,
              sm: 6
              // align: "center"
            },
            props: {
              variant: "outlined",
              style: {
                color: "rgba(0, 0, 0, 0.6000000238418579)",
                // borderColor: "rgba(0, 0, 0, 0.6000000238418579)",
                backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
                width: "220px",
                height: "48px",
                margin: "8px",
                float: "right"
              }
            },
            visible:false,
            children: {
              buttonLabel: getLabel({
                // labelKey: "WS_VOLUMETRIC_UPDATE",
                labelName:"Update"
              })
            },
            onClickDefination: {
              action: "condition",
              callBack: UpdateVolumetricAPI
            }
          },
          CancleButton: {
            componentPath: "Button",
            gridDefination: {
              xs: 12,
              sm: 6,
              // align: "center"
            },
            props: {
              variant: "contained",
              style: {
                // color: "white",
                margin: "8px",
                color: "rgba(0, 0, 0, 0.6000000238418579)",
                borderColor: "rgba(0, 0, 0, 0.6000000238418579)",
                // backgroundColor: "rgba(0, 0, 0, 0.6000000238418579)",
                borderRadius: "2px",
                width: "220px",
                height: "48px"
              }
            },
            visible:false ,
            children: {
              buttonLabel: getLabel({
                // labelKey: "",
                labelName:"Cancel"
              })
            },
            onClickDefination: {
              action: "condition",
              callBack: CancleEdit
            }
          },
        })
      })
      })
  }
  export const getvolumetricDetail = () => {
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
                  sm: 12
                },
                ...getCommonContainer({
                  header:getCommonSubHeader({
                    // labelKey: "WS_COMMON__HOLDER_DETAILS_HEADER",
                    labelName: "Volumetric Details",
                    gridDefination: {
                      xs: 2,
                      sm: 2,
                      align: "left"
                    },
                  }),
                  // buttonContainer: getCommonContainer({
                    searchButton: {
                      componentPath: "Button",
                      gridDefination: {
                        xs: 12,
                        sm: 12,
                        align: "right"
                      },
                      visible:true,
                      props: {
                        variant: "contained",
                        style: {
                          color: "white",
                          margin: "8px",
                          backgroundColor: "rgb(254, 122, 81)",
                          borderRadius: "2px",
                        //   width: "100%",
                        //   height: "100%",
                          marginTop:'-27px'
                        },
                        
                      },
                      children: {
                        buttonLabel: getLabel({
                          // labelKey: "WS_EDIT",
                          labelName:"Edit"
                        })
                      },
                      onClickDefination: {
                        action: "condition",
                        callBack: UpdateVolumetricData
                      }
                    },
                  })
              }
            }
          },
    viewVolumetricFields: renderService()
    });
  };