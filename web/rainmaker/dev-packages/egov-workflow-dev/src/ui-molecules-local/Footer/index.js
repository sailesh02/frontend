import { Container, Item } from "egov-ui-framework/ui-atoms";
import MenuButton from "egov-ui-framework/ui-molecules/MenuButton";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { hideSpinner, showSpinner } from "egov-ui-kit/redux/common/actions";
import { getTenantId, getUserInfo } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import set from "lodash/set";
import React from "react";
import { connect } from "react-redux";
import { ActionDialog } from "../";
import {
  getNextFinancialYearForRenewal,
  showPDFPreview
} from "../../ui-utils/commons";
import { getDownloadItems } from "./downloadItems";
import "./index.css";
import { Button } from "@material-ui/core";
import {
  LabelContainer,
  TextFieldContainer
} from "egov-ui-framework/ui-containers";
import {
  handleScreenConfigurationFieldChange as handleField
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";





const ifUserRoleExists = role => {
  let userInfo = JSON.parse(getUserInfo());
  const roles = get(userInfo, "roles");
  const roleCodes = roles ? roles.map(role => role.code) : [];
  if (roleCodes.indexOf(role) > -1) {
    return true;
  } else return false;
};

class Footer extends React.Component {
  state = {
    open: false,
    data: {},
    employeeList: []
    //responseLength: 0
  };

  getDownloadData = () => {
    const { dataPath, state } = this.props;
    const data = get(
      state,
      `screenConfiguration.preparedFinalObject.${dataPath}`
    );
    const { status, applicationNumber } = (data && data[0]) || "";
    return {
      label: "Download",
      leftIcon: "cloud_download",
      rightIcon: "arrow_drop_down",
      props: { variant: "outlined", style: { marginLeft: 10 } },
      menu: getDownloadItems(status, applicationNumber, state).downloadMenu
      // menu: ["One ", "Two", "Three"]
    };
  };

  getPrintData = () => {
    const { dataPath, state } = this.props;
    const data = get(
      state,
      `screenConfiguration.preparedFinalObject.${dataPath}`
    );
    const { status, applicationNumber } = (data && data[0]) || "";
    return {
      label: "Print",
      leftIcon: "print",
      rightIcon: "arrow_drop_down",
      props: { variant: "outlined", style: { marginLeft: 10 } },
      // menu: ["One ", "Two", "Three"]
      menu: getDownloadItems(status, applicationNumber, state).printMenu
    };
  };

  openActionDialog = async item => {
    if (
      item.moduleName === "BPA" ||
      item.moduleName === "BPA_OC" ||
      item.moduleName === "BPA_OC1" ||
      item.moduleName === "BPA_OC2" ||
      item.moduleName === "BPA_OC3" ||
      item.moduleName === "BPA_OC4" ||
      item.moduleName === "BPA_LOW" ||
      item.moduleName === "BPA1" ||
      item.moduleName === "BPA2" ||
      item.moduleName === "BPA3" ||
      item.moduleName === "BPA_LOW" ||
      item.moduleName === "BPA1" ||
      item.moduleName === "BPA2" ||
      item.moduleName === "BPA3" ||
      item.moduleName === "BPA4" ||
      item.moduleName === "BPA5"
    ) {
      let bPAUploadedDocs =
        this.props.state.screenConfiguration.preparedFinalObject
          .documentDetailsUploadRedux;
      let isDocsDropDownSelected = true;
      if (bPAUploadedDocs && bPAUploadedDocs.length > 0) {
        for (const bPAUploadedDocs of bPAUploadedDocs) {
          if (
            bPAUploadedDocs &&
            bPAUploadedDocs.documents &&
            bPAUploadedDocs.documents.length > 0
          ) {
            for (const document of bPAUploadedDocs.documents) {
              if (document.fileUrl && !bPAUploadedDocs.dropDownValues.value) {
                isDocsDropDownSelected = false;
                break;
              }
            }
          }
        }
      }
      if (!isDocsDropDownSelected) {
        this.props.toggleSnackbar(
          true,
          {
            labelName: "Documents Required",
            labelKey: "Please select Document Type first and Proceed",
          },
          "error"
        );
        return false;
      }
    }
    console.log("Nero Hkkkkk", item)
    const { handleFieldChange, setRoute, dataPath } = this.props;
    
    const appNo = getQueryArg(window.location.href, "applicationNumber");
    const tenantId = getQueryArg(window.location.href, "tenantId");
    if(item.buttonLabel === "SHOW_CAUSE"){
      const url = `/egov-bpa/generateShowCauseNotice?applicationNumber=${appNo}&tenantId=${tenantId}&PURPOSE=GENSCN`
      setRoute(url);
      
    }
    if(item.buttonLabel === "REVOKE"){
      const url = `/egov-bpa/generatePermitRevokeNotice?applicationNumber=${appNo}&tenantId=${tenantId}&PURPOSE=GENREVOKE`
      setRoute(url);
    
    }
    
    let employeeList = [];
    if (item.moduleName == "MR") item.showEmployeeList = true;
    if (item.buttonLabel === "ACTIVATE_CONNECTION") {
      if (item.moduleName === "NewWS1" || item.moduleName === "NewSW1" || item.moduleName === "SWCloseConnection" ||
        item.moduleName === "SWDisconnection" || item.moduleName === "WSCloseConnection" || item.moduleName === "WSDisconnection" ||
        item.moduleName === "WSReconnection" || item.moduleName === "SWReconnection" || item.moduleName === "SWOwnershipChange" || item.moduleName === "WSOwnershipChange"
      ) {
        item.showEmployeeList = false;
      }
    }
    if (dataPath === "BPA") {
      handleFieldChange(`${dataPath}.comment`, "");
      handleFieldChange(`${dataPath}.wfDocuments`, []);
      handleFieldChange(`${dataPath}.assignees`, "");
    } else if (dataPath === "FireNOCs") {
      handleFieldChange(`${dataPath}[0].fireNOCDetails.additionalDetail.comment`, "");
      handleFieldChange(`${dataPath}[0].fireNOCDetails.additionalDetail.assignee`, []);
      handleFieldChange(`${dataPath}[0].fireNOCDetails.additionalDetail.wfDocuments`, []);
    } else if (dataPath === "Property") {
      handleFieldChange(`${dataPath}.workflow.comment`, "");
      handleFieldChange(`${dataPath}.workflow.assignes`, []);
      handleFieldChange(`${dataPath}.workflow.wfDocuments`, []);
    } else {
      handleFieldChange(`${dataPath}[0].comment`, "");
      handleFieldChange(`${dataPath}[0].wfDocuments`, []);
      handleFieldChange(`${dataPath}[0].assignee`, []);
    }

    if (item.isLast) {
      let url =
        process.env.NODE_ENV === "development"
          ? item.buttonUrl
          : item.buttonUrl;

      /* Quick fix for edit mutation application */
      if (url.includes('pt-mutation/apply') && process.env.REACT_APP_NAME === "Citizen") {
        url = url + '&mode=MODIFY';
        window.location.href = url.replace("/pt-mutation/", '');
        return;
      }

      setRoute(url);
      return;
    }
    if (item.showEmployeeList) {
      const tenantId = getTenantId();
      const queryObj = [
        {
          key: "roles",
          value: item.roles
        },
        {
          key: "tenantId",
          value: tenantId
        }, {
          key: "isActive",
          value: true
        }

      ];
      const payload = await httpRequest(
        "post",
        "/egov-hrms/employees/_search",
        "",
        queryObj
      );
      employeeList =
        payload &&
        payload.Employees.map((item, index) => {
          const name = get(item, "user.name");
          return {
            value: item.uuid,
            label: name
          };
        });
    }

    this.setState({ open: true, data: item, employeeList });
  };


  openSignPdfPopup = () => {
    const applicationNumber = getQueryArg(window.location.href, "applicationNumber");
    const tenantId = getQueryArg(window.location.href, "tenantId");
    let jsonPath = `components.pdfSigningPopup.props`
    if(this.props.moduleName == "BPA" || this.props.moduleName == "BPA1" || this.props.moduleName == "BPA2" || 
    this.props.moduleName == "BPA3" || this.props.moduleName == "BPA4" || this.props.moduleName == "BPA_OC" || this.props.moduleName == "BPA_OC1" || 
    this.props.moduleName == "BPA_OC2" || this.props.moduleName == "BPA_OC3" || this.props.moduleName == "BPA_OC4" || 
    this.props.moduleName == "BPA_LOW"){
      jsonPath = `components.div.children.pdfSigningPopup.props`
    }
    this.props.handleField(
      "search-preview",
      jsonPath,
      "openPdfSigningPopup",
      true
    )

    this.props.handleField(
      "search-preview",
      jsonPath,
      "applicationNumber",
      applicationNumber
    )

    this.props.handleField(
      "search-preview",
      jsonPath,
      "tenantId",
      tenantId
    )

  };

  onClose = () => {
    this.setState({
      open: false
    });
  };

  renewTradelicence = async (financialYear, tenantId) => {
    const { setRoute, state, toggleSnackbar } = this.props;
    const licences = get(
      state.screenConfiguration.preparedFinalObject,
      `Licenses`
    );
    this.props.showSpinner();
    // const nextFinancialYear = await getNextFinancialYearForRenewal(
    //   financialYear
    // );

    const validTo = get(
      state.screenConfiguration.preparedFinalObject,
      `Licenses[0].validTo`
    );

    const tlType = get(
      state.screenConfiguration.preparedFinalObject,
      `Licenses[0].licenseType`
    );

    const TlPeriod = get(
      state.screenConfiguration.preparedFinalObject,
      `Licenses[0].tradeLicenseDetail.additionalDetail.licensePeriod`
    );

    const validFrom = 1000 * 60 * 60 * 24 + validTo;
    let reNewDurationInMiliSeconds = 0;
    if (tlType && tlType === "TEMPORARY") {
      reNewDurationInMiliSeconds = 1000 * 60 * 60 * 24 * Number(TlPeriod);
      set(licences[0], "validTo", validFrom + reNewDurationInMiliSeconds);
    } else {
      //reNewDurationInMiliSeconds =  1000 * 60 * 60 * 24 * Number(TlPeriod) * 365;

      var dt = new Date(validFrom);
      let dt1 = new Date(dt.setFullYear(dt.getFullYear() + Number(TlPeriod)));


      // set(queryObject[0], "validTo", tlcommencementDate + selectedYearInMiliSeconds);
      set(licences[0], "validTo", dt1.getTime());

    }

    const wfCode = "DIRECTRENEWAL";
    set(licences[0], "action", "INITIATE");
    set(licences[0], "workflowCode", wfCode);
    set(licences[0], "applicationType", "RENEWAL");
    set(licences[0], "validFrom", validFrom);

    // set(licences[0], "financialYear", nextFinancialYear);

    try {
      const response = await httpRequest(
        "post",
        "/tl-services/v1/_update",
        "",
        [],
        {
          Licenses: licences
        }
      );
      const renewedapplicationNo = get(response, `Licenses[0].applicationNumber`);
      const licenseNumber = get(response, `Licenses[0].licenseNumber`);
      this.props.hideSpinner();
      // setRoute(
      //   `/tradelicence/acknowledgement?purpose=DIRECTRENEWAL&status=success&applicationNumber=${renewedapplicationNo}&licenseNumber=${licenseNumber}&FY=${nextFinancialYear}&tenantId=${tenantId}&action=${wfCode}`
      // );
      setRoute(
        `/tradelicence/acknowledgement?purpose=DIRECTRENEWAL&status=success&applicationNumber=${renewedapplicationNo}&licenseNumber=${licenseNumber}&tenantId=${tenantId}&action=${wfCode}`
      );
    } catch (exception) {
      this.props.hideSpinner();
      console.log(exception);
      toggleSnackbar(
        true,
        {
          labelName: "Please fill all the mandatory fields!",
          labelKey: exception && exception.message || exception
        },
        "error"
      );

    }

  };
  render() {
    const {
      contractData,
      handleFieldChange,
      onDialogButtonClick,
      dataPath,
      moduleName,
      state,
      dispatch
    } = this.props;
    const { open, data, employeeList } = this.state;
    const { isDocRequired } = data;
    const appName = process.env.REACT_APP_NAME;
    let status = null;
    let applicationDigitallySigned = false;
    let pdfPreviewData = null;
    let pdfKey = null;
    let modulePdfIdentifier = null;
    const downloadMenu =
      contractData &&
      contractData.map(item => {
        const { buttonLabel, moduleName } = item;
        return {
          labelName: { buttonLabel },
          labelKey: `WF_${appName.toUpperCase()}_${moduleName.toUpperCase()}_${buttonLabel}`,
          link: () => {
            (moduleName === "NewTL" || moduleName === "EDITRENEWAL") && buttonLabel === "APPLY" ? onDialogButtonClick(buttonLabel, isDocRequired) :
              this.openActionDialog(item);
          }
        };
      });

    if (moduleName === "NewTL") {
      pdfPreviewData = get(
        state.screenConfiguration.preparedFinalObject,
        `Licenses`
      );
      pdfKey = "tlcertificate";
      modulePdfIdentifier = "Licenses";
      // applicationDigitallySigned = get(
      //   state.screenConfiguration.preparedFinalObject,
      //   `Licenses[0].tradeLicenseDetail.dscDetails[0].documentId`
      // );

      applicationDigitallySigned = pdfPreviewData && pdfPreviewData[0].tradeLicenseDetail.dscDetails && pdfPreviewData[0].tradeLicenseDetail.dscDetails.length > 0 && pdfPreviewData[0].tradeLicenseDetail.dscDetails[0].documentId ? true :  false

      status = get(
        state.screenConfiguration.preparedFinalObject,
        `Licenses[0].status`
      );
      const applicationType = get(
        state.screenConfiguration.preparedFinalObject,
        `Licenses[0].applicationType`
      );
      const applicationNumber = get(
        state.screenConfiguration.preparedFinalObject,
        `Licenses[0].applicationNumber`
      );
      const tenantId = get(
        state.screenConfiguration.preparedFinalObject,
        `Licenses[0].tenantId`
      );
      const financialYear = get(
        state.screenConfiguration.preparedFinalObject,
        `Licenses[0].financialYear`
      );
      const licenseNumber = get(
        state.screenConfiguration.preparedFinalObject,
        `Licenses[0].licenseNumber`
      );
      const responseLength = get(
        state.screenConfiguration.preparedFinalObject,
        `licenseCount`,
        1
      );

      const rolearray =
        getUserInfo() &&
        JSON.parse(getUserInfo()).roles.filter(item => {
          if (
            (item.code == "TL_CEMP" && item.tenantId === tenantId) ||
            item.code == "CITIZEN"
          )
            return true;
        });
      const rolecheck = rolearray.length > 0 ? true : false;
      const validTo = get(
        state.screenConfiguration.preparedFinalObject,
        `Licenses[0].validTo`
      );
      const currentDate = Date.now();
      const duration = validTo - currentDate;
      const renewalPeriod = get(
        state.screenConfiguration.preparedFinalObject,
        `renewalPeriod`
      );

      if (rolecheck && (status === "APPROVED" || status === "EXPIRED") &&
        duration <= renewalPeriod) {
        const editButton = {
          label: "Edit",
          labelKey: "WF_TL_RENEWAL_EDIT_BUTTON",
          link: () => {
            const baseURL =
              process.env.REACT_APP_NAME === "Citizen"
                ? "/tradelicense-citizen/apply"
                : "/tradelicence/apply";
            this.props.setRoute(
              `${baseURL}?applicationNumber=${applicationNumber}&licenseNumber=${licenseNumber}&tenantId=${tenantId}&action=EDITRENEWAL`
            );
          }
        };

        const submitButton = {
          label: "Submit",
          labelKey: "WF_TL_RENEWAL_SUBMIT_BUTTON",
          link: () => {
            this.renewTradelicence(financialYear, tenantId);
          }
        };
        if (responseLength > 1) {
          if (applicationType !== "NEW") {
            downloadMenu && downloadMenu.push(editButton);
            // downloadMenu && downloadMenu.push(submitButton);
          }

        }
        else if (responseLength === 1) {

          downloadMenu && downloadMenu.push(editButton);
          // downloadMenu && downloadMenu.push(submitButton);
        }




      }
    }

    if((moduleName === 'BPA' || moduleName === 'BPA_LOW' || moduleName === 'BPA_OC' || moduleName === "BPA_OC1" || moduleName === "BPA_OC2" || moduleName === "BPA_OC3" || moduleName === "BPA_OC4" || moduleName === 'BPA1' || moduleName === 'BPA2' || moduleName === 'BPA3' || moduleName === 'BPA4')){
      pdfPreviewData = get(
        state.screenConfiguration.preparedFinalObject,
        `BPA`
      );

      let businessService = pdfPreviewData && pdfPreviewData.businessService
      status = get(
        state.screenConfiguration.preparedFinalObject,
        `BPA.status`
      );

      applicationDigitallySigned = pdfPreviewData && !pdfPreviewData.dscDetails ? true : pdfPreviewData &&
      pdfPreviewData.dscDetails.length > 0 && pdfPreviewData.dscDetails[0].documentId ? true : false

      let edcrDetails = (businessService === 'BPA' || businessService === 'BPA1' || businessService === 'BPA2' || businessService === 'BPA3' || businessService === 'BPA4') ? 
      get(
        state.screenConfiguration.preparedFinalObject,
        `scrutinyDetails`) : get(
        state.screenConfiguration.preparedFinalObject,
        `ocScrutinyDetails`)

      if(pdfPreviewData){
        pdfPreviewData.edcrDetail = [edcrDetails]
      }  
      pdfKey = businessService === 'BPA_LOW' ? "buildingpermit-low" : (businessService === 'BPA_OC' || businessService === "BPA_OC1" || businessService === "BPA_OC2" || businessService === "BPA_OC3" || businessService === "BPA_OC4") ?
      "occupancy-certificate" : "buildingpermit"
      modulePdfIdentifier = "BPA";
    }

    if (moduleName === "MR") {
      pdfPreviewData = get(
        state.screenConfiguration.preparedFinalObject,
        `MarriageRegistrations`
      );
      pdfKey = "mrcertificate";
      applicationDigitallySigned = get(
        state.screenConfiguration.preparedFinalObject,
        `MarriageRegistrations[0].dscDetails[0].documentId`
      );

      modulePdfIdentifier = "MarriageRegistrations";
      status = get(
        state.screenConfiguration.preparedFinalObject,
        `MarriageRegistrations[0].status`
      );
      const applicationType = get(
        state.screenConfiguration.preparedFinalObject,
        `MarriageRegistrations[0].applicationType`
      );
      const applicationNumber = get(
        state.screenConfiguration.preparedFinalObject,
        `MarriageRegistrations[0].applicationNumber`
      );
      const tenantId = get(
        state.screenConfiguration.preparedFinalObject,
        `MarriageRegistrations[0].tenantId`
      );
      // const financialYear = get(
      //   state.screenConfiguration.preparedFinalObject,
      //   `Licenses[0].financialYear`
      // );
      const licenseNumber = get(
        state.screenConfiguration.preparedFinalObject,
        `MarriageRegistrations[0].mrNumber`
      );
      const responseLength = get(
        state.screenConfiguration.preparedFinalObject,
        `licenseCount`,
        1
      );

      // const rolearray =
      //   getUserInfo() &&
      //   JSON.parse(getUserInfo()).roles.filter(item => {
      //     if (
      //       (item.code == "TL_CEMP" && item.tenantId === tenantId) ||
      //       item.code == "CITIZEN"
      //     )
      //       return true;
      //   });
      // const rolecheck = rolearray.length > 0 ? true : false;
      // const validTo = get(
      //   state.screenConfiguration.preparedFinalObject,
      //   `Licenses[0].validTo`
      // );
      // const currentDate = Date.now();
      // const duration = validTo - currentDate;
      // const renewalPeriod = get(
      //   state.screenConfiguration.preparedFinalObject,
      //   `renewalPeriod`
      // );

      if ((status === "APPROVED" && ifUserRoleExists("MR_CEMP")) || (status === "APPROVED" && ifUserRoleExists("CITIZEN"))) {
        const editButton = {
          label: "Edit",
          labelKey: "WF_MR_CORRECTION_SUBMIT_BUTTON",
          link: () => {
            const baseURL =
              process.env.REACT_APP_NAME === "Citizen"
                ? "/mr-citizen/apply"
                : "/mr/apply";
            this.props.setRoute(
              `${baseURL}?applicationNumber=${applicationNumber}&licenseNumber=${licenseNumber}&tenantId=${tenantId}&action=CORRECTION`
            );
          }
        };



        if (responseLength > 0) {

          downloadMenu && downloadMenu.push(editButton);

        }




      }
    }
    if (applicationDigitallySigned) {
      applicationDigitallySigned = true
    }
    const buttonItems = {
      label: { labelName: "Take Action", labelKey: "WF_TAKE_ACTION" },
      rightIcon: "arrow_drop_down",
      props: {
        variant: "outlined",
        style: {
          marginRight: 56,
          backgroundColor: "#FE7A51",
          color: "#fff",
          border: "none",
          height: "60px",
          width: "200px"
        }
      },
      menu: downloadMenu
    };

    const signButtonItems = {
      label: { labelName: "Sign", labelKey: "WF_PDF_SIGN" },
      rightIcon: "arrow_drop_down",
      props: {
        variant: "outlined",
        style: {
          backgroundColor: "#FE7A51",
          color: "#fff",
          border: "none",
          height: "60px",
          width: "135px"
        }
      },
      menu: [{
        labelName: "WF_PDF_SIGN",
        labelKey: "WF_PDF_SIGN",
        link: () => {

          this.openSignPdfPopup();
        }
      },
      {
        labelName: "WF_PDF_PREVIEW",
        labelKey: "WF_PDF_PREVIEW",
        link: () => {

          showPDFPreview(pdfPreviewData, pdfKey, modulePdfIdentifier);
        }
      }
      ]

    };


    return (
      <div className="wf-wizard-footer" id="custom-atoms-footer">
        {!isEmpty(downloadMenu) && (
          <Container>
            {process.env.REACT_APP_NAME === 'Employee' && (ifUserRoleExists("MR_APPROVER") || ifUserRoleExists("TL_APPROVER")) && (moduleName === "NewTL" || moduleName === "MR") && status === "APPROVED" && !applicationDigitallySigned ?
              <Item xs={6} sm={10} className="wf-footer-container">
                {/* <Button
                  variant={"contained"}
                  color={"primary"}
                  onClick={this.openSignPdfPopup}
                  style={{
                    height: "60px",
                    width: "200px"
                  }}
                >
                  <LabelContainer
                    labelName={"WF_PDF_SIGN"}
                    labelKey=
                    {"WF_PDF_SIGN"}
                  />
                </Button> */}
                <MenuButton data={signButtonItems} />
              </Item> : ""
            }
            <Item xs={6} sm={process.env.REACT_APP_NAME === 'Employee' && (ifUserRoleExists("MR_APPROVER") || ifUserRoleExists("TL_APPROVER")) && (moduleName === "NewTL" || moduleName === "MR") && status === "APPROVED" && !applicationDigitallySigned ? 2 : 12} className="wf-footer-container">
              <MenuButton data={buttonItems} />
            </Item>
          </Container>
        )}
        {(!downloadMenu || downloadMenu.length == 0) && (moduleName === 'BPA_OC' || moduleName === "BPA_OC1" || moduleName === "BPA_OC2" || moduleName === "BPA_OC3" || moduleName === "BPA_OC4" || moduleName === 'BPA' || moduleName === 'BPA2' ||
        moduleName === 'BPA3' || moduleName === 'BPA4') &&  (
          <Container>
            {process.env.REACT_APP_NAME === 'Employee' && (ifUserRoleExists("BPA1_APPROVER") || ifUserRoleExists("BPA2_APPROVER") || ifUserRoleExists("BPA3_APPROVER") || ifUserRoleExists("BPA4_APPROVER")) && status === "APPROVED" && !applicationDigitallySigned ?
              <Item xs={6} sm={12} className="wf-footer-container">
                <MenuButton data={signButtonItems} />
              </Item> : ""
            }
          </Container>
        )}
        <ActionDialog
          open={open}
          onClose={this.onClose}
          dialogData={data}
          dropDownData={employeeList}
          handleFieldChange={handleFieldChange}
          onButtonClick={onDialogButtonClick}
          dataPath={dataPath}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { state };
};

const mapDispatchToProps = dispatch => {
  return {
    setRoute: url => dispatch(setRoute(url)),
    toggleSnackbar: (open, message, variant) => dispatch(toggleSnackbar(open, message, variant)),
    showSpinner: () =>
      dispatch(showSpinner()),
    hideSpinner: () =>
      dispatch(hideSpinner()),
    handleField: (arg1, arg2, arg3, setunset) => dispatch(handleField(arg1, arg2, arg3, setunset)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
