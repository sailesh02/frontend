import {
    getBreak,
    getCommonCard,
    getCommonParagraph,
    getCommonGrayCard,
    getCommonContainer,
    getCommonTitle,
    getCommonSubHeader,    
    getLabelWithValue,
    getLabel    
  } from "egov-ui-framework/ui-config/screens/specs/utils";
  import { checkValueForNA } from "../utils/index";
  import {
    handleScreenConfigurationFieldChange as handleField,prepareFinalObject
  } from "egov-ui-framework/ui-redux/screen-configuration/actions";
  
  const getHeader = label => {
    return {
      uiFramework: "custom-molecules-local",
      moduleName: "egov-bpa",
      componentPath: "DividerWithLabel",
      props: {
        className: "hr-generic-divider-label",
        labelProps: {},
        dividerProps: {},
        label
      },
      type: "array"
    };
  };

  export const nocDetailsApply = getCommonGrayCard({
    header: getCommonTitle(
      {
        labelName: "NOC Details",
        // labelKey: "BPA_DOCUMENT_DETAILS_HEADER"
      },
      {
        style: {
        marginBottom: "10px"
        }
      }
    ),  
    // fireNocDetailsCard: getCommonCard({
        documentDetailsCard: {
            uiFramework: "custom-molecules-local",
            moduleName: "egov-bpa",
            componentPath: "NocDetailCard",
            props: {
              disabled:false,
              jsonPath: "nocForPreview",                  
              sourceJsonPath: "documentDetailsPreview",
              className: "noc-review-documents",
              buttonLabel: {
                labelName: "UPLOAD FILE",
                labelKey: "NOC_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE"
              },
              inputProps: {
                accept: "image/*, .pdf, .png, .jpeg",
                multiple: false
              },
              maxFileSize: 6000
            }
        }
    // }),
})

// open popup to create new noc
export const onClickAdd = async (state, dispatch) => {
   dispatch(handleField(
     "search-preview",
     "components.div.children.newNoc.props",
     "open",
     true
   ))
   dispatch(prepareFinalObject("documentsContractNOC", []));

}

export const nocDetailsSearch = getCommonGrayCard({
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
            // labelKey: "BPA_DOCUMENT_DETAILS_HEADER",
            labelName: "NOC Details",
            gridDefination: {
              xs: 2,
              sm: 2,
              align: "left"
            },
          }),
          // buttonContainer: getCommonContainer({
            addNocButton: {
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
                  // width: "220px",
                  // height: "48px",
                  marginTop:'-27px'
                },
                
              },
              children: {
                // buttonIcon: {
                //   uiFramework: "custom-atoms",
                //   componentPath: "Icon",
                //   props: {
                //     iconName: "keyboard_arrow_left"
                //   }
                // },
                 buttonLabel: getLabel({
                  labelKey: "Add Noc"
                })
              },
              onClickDefination: {
                action: "condition",
                callBack: onClickAdd
              }
            },
          })
        // })
      },
    }
  },
 
  // header: getCommonTitle(
  //   {
  //     labelName: "NOC Details",
  //     // labelKey: "BPA_DOCUMENT_DETAILS_HEADER"
  //   },
  //   {
  //     style: {
  //       marginBottom: "10px"
  //     }
  //   }
  // ),  
  // fireNocDetailsCard: getCommonCard({
      documentDetailsCard: {
          uiFramework: "custom-molecules-local",
          moduleName: "egov-bpa",
          componentPath: "NocDetailCard",
          props: {
            disabled:true,
            jsonPath: "nocForPreview",                  
            sourceJsonPath: "documentDetailsPreview",
            className: "noc-review-documents",
            buttonLabel: {
              labelName: "UPLOAD FILE",
              labelKey: "NOC_DOCUMENT_DETAILS_BUTTON_UPLOAD_FILE"
            },
            inputProps: {
              accept: "image/*, .pdf, .png, .jpeg",
              multiple: false
            },
            maxFileSize: 6000
          }
      }
  // }),
})

export const requiredNOCContainer = getCommonGrayCard({
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
            labelKey: "BPA_REQUIRED_NOC_HEADER",
            labelName: "BPA_REQUIRED_NOC_HEADER",
            gridDefination: {
              xs: 2,
              sm: 2,
              align: "left"
            },
          }),
          })
      },
    }
  },
      requiredNOCCard: {
          uiFramework: "custom-molecules-local",
          moduleName: "egov-bpa",
          componentPath: "RequiredNOCCard",
          visible:true,
          props: {
            requiredNocsJson : "requiredNOCList",  
            nocsJson : "NOC",               
            buttonLabel: {
              labelName: "TRIGGER NOC",
              labelKey: "BPA_TRIGGER NOC_BUTTON"
            }          
      }
      }
})