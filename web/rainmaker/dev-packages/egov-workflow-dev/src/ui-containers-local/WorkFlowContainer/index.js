import { convertDateToEpoch } from "egov-ui-framework/ui-config/screens/specs/utils";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { prepareFinalObject, toggleSnackbar } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import { addWflowFileUrl, getMultiUnits, getQueryArg, orderWfProcessInstances } from "egov-ui-framework/ui-utils/commons";
import { hideSpinner, showSpinner } from "egov-ui-kit/redux/common/actions";
import { getUserInfo, localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import find from "lodash/find";
import get from "lodash/get";
import orderBy from "lodash/orderBy";
import set from "lodash/set";
import React from "react";
import { connect } from "react-redux";
import { Footer } from "../../ui-molecules-local";
import TaskStatusContainer from "../TaskStatusContainer";

const tenant = getQueryArg(window.location.href, "tenantId");

class WorkFlowContainer extends React.Component {
  state = {
    open: false,
    action: ""
  };

  componentDidMount = async () => {
    const { prepareFinalObject, toggleSnackbar } = this.props;
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    const tenantId = getQueryArg(window.location.href, "tenantId");
    const queryObject = [
      { key: "businessIds", value: applicationNumber },
      { key: "history", value: true },
      { key: "tenantId", value: tenantId }
    ];
    try {
      const payload = await httpRequest(
        "post",
        "egov-workflow-v2/egov-wf/process/_search",
        "",
        queryObject
      );
      if (payload && payload.ProcessInstances.length > 0) {
        const processInstances = orderWfProcessInstances(
          payload.ProcessInstances
        );
        addWflowFileUrl(processInstances, prepareFinalObject);
      } else {
        toggleSnackbar(
          true,
          {
            labelName: "Workflow returned empty object !",
            labelKey: "WRR_WORKFLOW_ERROR"
          },
          "error"
        );
      }
    } catch (e) {
      toggleSnackbar(
        true,
        {
          labelName: "Workflow returned empty object !",
          labelKey: "WRR_WORKFLOW_ERROR"
        },
        "error"
      );
    }
  };

  onClose = () => {
    this.setState({
      open: false
    });
  };

  getPurposeString = action => {
    switch (action) {
      case "APPLY":
        return "purpose=apply&status=success";
      case "FORWARD":
      case "RESUBMIT":
        return "purpose=forward&status=success";
      case "MARK":
        return "purpose=mark&status=success";
      case "VERIFY":
        return "purpose=verify&status=success";
      case "REJECT":
        return "purpose=application&status=rejected";
      case "CANCEL":
        return "purpose=application&status=cancelled";
      case "APPROVE":
        return "purpose=approve&status=success";
      case "SENDBACK":
        return "purpose=sendback&status=success";
      case "REFER":
        return "purpose=refer&status=success";
      case "SENDBACKTOCITIZEN":
        return "purpose=sendbacktocitizen&status=success";
      case "SUBMIT_APPLICATION":
        return "purpose=apply&status=success";
      case "RESUBMIT_APPLICATION":
        return "purpose=forward&status=success";
      case "SEND_BACK_TO_CITIZEN":
        return "purpose=sendback&status=success";
      case "VERIFY_AND_FORWARD":
        return "purpose=forward&status=success";
      case "SEND_BACK_FOR_DOCUMENT_VERIFICATION":
      case "SEND_BACK":
      case "SEND_BACK_FOR_FIELD_INSPECTION":
        return "purpose=sendback&status=success";
      case "APPROVE_FOR_CONNECTION":
      case "APPROVE_FOR_DISCONNECTION":
      case "APPROVE_TO_CLOSE_CONNECTION":
        return "purpose=approve&status=success";
      case "APPROVE_CONNECTION":
        return "purpose=approve&status=success";
      case "ACTIVATE_CONNECTION":
        return "purpose=activate&status=success";
      case "DISCONNECT_CONNECTION":
        return "purpose=disconnect&status=success";
      case "CLOSE_CONNECTION":
        return "purpose=closeConnection&status=success";
      case "REVOCATE":
        return "purpose=application&status=revocated"
      case "VOID":
        return "purpose=application&status=voided"
      case "REOPEN":
        return "purpose=reopen&status=success";
      case "OPEN":
        return "purpose=reopen&status=success";
      case "SCHEDULE":
        return "purpose=schedule&status=success";
      case "RESCHEDULE":
        return "purpose=reschedule&status=success";
      case "METER_REPLACE_SUBMIT_APPLICATION":
        return "purpose=applymeterreplace&status=success";  
      case "METER_REPLACE_APPROVE_APPLICATION":
        return "purpose=approve_meter_replace&status=success";  
      case "SHOW_CAUSE":
      return "purpose=show_cause_issued&status=success";
      case "ACCEPT":
      return "purpose=scn_reply_accepted&status=success";
      case "REVOKE":
      return "purpose=permit_revoked&status=success";
      case "SEND_TO":
      return "purpose=permit_sent_other_emp&status=success";    
    
      case "SENDBACK_TO_ARCHITECT_FOR_REWORK":
        return "purpose=sendback&status=success";    
      
     }
  };

  wfUpdate = async label => {
    let {
      toggleSnackbar,
      preparedFinalObject,
      dataPath,
      moduleName,
      updateUrl,
      redirectQueryString,
      beforeSubmitHook
    } = this.props;
    const tenant = getQueryArg(window.location.href, "tenantId");
    let data = get(preparedFinalObject, dataPath, []);
    if (moduleName === "NewTL") {
      if (getQueryArg(window.location.href, "edited")) {

        const removedDocs = get(
          preparedFinalObject,
          "LicensesTemp[0].removedDocs",
          []
        );
        if (data[0] && data[0].commencementDate) {
          data[0].commencementDate = convertDateToEpoch(
            data[0].commencementDate,
            "dayend"
          );
        }
        let owners = get(data[0], "tradeLicenseDetail.owners");
        owners = (owners && this.convertOwnerDobToEpoch(owners)) || [];
        set(data[0], "tradeLicenseDetail.owners", owners);
        set(data[0], "tradeLicenseDetail.applicationDocuments", [
          ...get(data[0], "tradeLicenseDetail.applicationDocuments", []),
          ...removedDocs
        ]);

        // Accessories issue fix by Gyan
        let accessories = get(data[0], "tradeLicenseDetail.accessories");
        let tradeUnits = get(data[0], "tradeLicenseDetail.tradeUnits");
        set(
          data[0],
          "tradeLicenseDetail.tradeUnits",
          getMultiUnits(tradeUnits)
        );
        set(
          data[0],
          "tradeLicenseDetail.accessories",
          getMultiUnits(accessories)
        );
      }
    }
    if (dataPath === "BPA") {
      data.workflow.assignes = [];
      if (data.workflow.assignee) {
        data.workflow.assignes = data.workflow.assignee
      }
      if (data.workflow && data.workflow.varificationDocuments) {
        for (let i = 0; i < data.workflow.varificationDocuments.length; i++) {
          data.workflow.varificationDocuments[i].fileStore = data.workflow.varificationDocuments[i].fileStoreId
        }
      }
      if (get(data, "workflow.comment")) {
        data.workflow.comments = get(data, "workflow.comment");
      }
    }
    if (dataPath == 'Property') {
      if (data.workflow && data.workflow.wfDocuments) {
        data.workflow.documents = data.workflow.wfDocuments;
      }
    }
    if (moduleName === "Amendment") {
      data.workflow = {};
      data.workflow.documents = get(data[0], "wfDocuments", []);
      data.workflow.comment = get(data[0], "comment", "");
      data.workflow.assignee = get(data[0], "assignee", []);
      data.workflow.action = get(data[0], "action", "");
      data.workflow.businessId = get(data, "amendmentId", "");
      data.workflow.tenantId = get(data, "tenantId", "");
      data.workflow.businessService = "BS.AMENDMENT";
      data.workflow.moduleName = "BS";
    }
    
    if (moduleName == "MR") {
      let apntDetails = [];
      let appointmentDetails = get(
        data[0],
        "appointmentDetails",
        []
      );
      var appAction = get(data[0], "action", '')
      if (appAction == "RESCHEDULE" && appointmentDetails && appointmentDetails.length > 0) {


        for (let i = 0; i < appointmentDetails.length; i++) {
          apntDetails.push({ ...appointmentDetails[i], active: false });
        }


        var apntDate = get(data[0], "appointmentDate", '');
        let apntTime = get(data[0], "appointmentTime", '');
        let apntDesc = get(data[0], "appointmentDesc", '');
        apntDate = apntDate.split("-");
        apntTime = apntTime.split(":");


        var apntDate = new Date(apntDate[0], apntDate[1] - 1, apntDate[2]);
        apntDate.setHours(apntDate.getHours() + parseInt(apntTime[0]));
        apntDate.setMinutes(apntDate.getMinutes() + apntTime[1]);

        console.log(apntDate.getDate(), "In reschedle")
        console.log(apntDate.getTime());
        console.log(apntDate.getTime() + 3600000);


        apntDetails.push({

          "tenantId": tenant,
          "startTime": apntDate.getTime(),
          "endTime": apntDate.getTime() + 3600000,
          "description": apntDesc,
          "active": true
        })
        //data[0].appointmentDetails = apntDetails;
        set(
          data[0],
          "appointmentDetails",
          apntDetails
        );

      } else if (appAction == "SCHEDULE") {

        var apntDate = get(data[0], "appointmentDate", '');
        let apntTime = get(data[0], "appointmentTime", '');
        let apntDesc = get(data[0], "appointmentDesc", '');
        apntDate = apntDate.split("-");
        apntTime = apntTime.split(":");


        var apntDate = new Date(apntDate[0], apntDate[1] - 1, apntDate[2]);
        apntDate.setHours(apntDate.getHours() + parseInt(apntTime[0]));
        apntDate.setMinutes(apntDate.getMinutes() + apntTime[1]);

        console.log(apntDate.getDate())
        console.log(apntDate.getTime());
        console.log(apntDate.getTime() + 3600000);


        apntDetails.push({

          "tenantId": tenant,
          "startTime": apntDate.getTime(),
          "endTime": apntDate.getTime() + 3600000,
          "description": apntDesc
        })
        //data[0].appointmentDetails = apntDetails;
        set(
          data[0],
          "appointmentDetails",
          apntDetails
        );
      }




    }

    if (moduleName == "NewWS1") {
      var dateEffectiveFrom = get(data[0], "dateEffectiveFrom", '');
      if (typeof dateEffectiveFrom === "string") {
        dateEffectiveFrom = dateEffectiveFrom.split("-");
        var dateEffectiveFrom = new Date(dateEffectiveFrom[0], dateEffectiveFrom[1] - 1, dateEffectiveFrom[2], 23, 59);
        set(
          data[0],
          "dateEffectiveFrom",
          dateEffectiveFrom.getTime()
        );
      }

    }

    
    const applicationNumber = getQueryArg(
      window.location.href,
      "applicationNumber"
    );
    this.props.showSpinner();
    let isDocsDropDownSelected = true;
    try {
      if (beforeSubmitHook) {
        if (moduleName === "BPA" || moduleName === "BPA_OC" || moduleName === "BPA_OC1" || moduleName === "BPA_OC2" || moduleName === "BPA_OC3" || moduleName === "BPA_OC4" || moduleName === "BPA_LOW" || moduleName === 'BPA1' || moduleName === 'BPA2' || moduleName === 'BPA3' || moduleName === "BPA_LOW" || moduleName === 'BPA1' || moduleName === 'BPA2' || moduleName === 'BPA3' || moduleName === 'BPA4' || moduleName === 'BPA5') {
          data = await beforeSubmitHook(data);
        } else {
          data = beforeSubmitHook(data);
        }
      }

let bPAUploadedDocs;
let BPADocs;
 
      if (moduleName === "BPA" || moduleName === "BPA_OC" || moduleName === "BPA_OC1" || moduleName === "BPA_OC2" || moduleName === "BPA_OC3" || moduleName === "BPA_OC4" || moduleName === "BPA_LOW" || moduleName === 'BPA1' || moduleName === 'BPA2' || moduleName === 'BPA3' || moduleName === "BPA_LOW" || moduleName === 'BPA1' || moduleName === 'BPA2' || moduleName === 'BPA3' || moduleName === 'BPA4' || moduleName === 'BPA5') {
        bPAUploadedDocs =  get(preparedFinalObject, "documentDetailsUploadRedux", []);
        BPADocs = get(
          preparedFinalObject,
          "BPA.documents",
          []
        );
        
        if(bPAUploadedDocs && bPAUploadedDocs.length > 0){
          for(let k=0;k<bPAUploadedDocs.length;k++){
           // if(bPAUploadedDocs[k].fileStoreId && !bPAUploadedDocs[k].documentType.includes(".")){
            if(bPAUploadedDocs[k] && bPAUploadedDocs[k].documents && bPAUploadedDocs[k].documents.length > 0 ){
                for(let j=0;j<bPAUploadedDocs[k].documents.length;j++){
                  if(bPAUploadedDocs[k].documents[j].fileUrl && !bPAUploadedDocs[k].dropDownValues.value){
                      isDocsDropDownSelected = false; 
                      break;
                  }
              }

            }
           }
        }
      }      

      if(!isDocsDropDownSelected){
        toggleSnackbar(
          true,
          {
            labelName: "Documents Required",
            labelKey: "Please select Document Type first and Proceed"
          },
          "error"
        );
        this.props.hideSpinner();
        return false;
      }
      // else if(moduleName === "BPA"){
      //   let documnts = [];
      //   let documentsUpdalod = bPAUploadedDocs;
      //   if (documentsUpdalod) {
      //     Object.keys(documentsUpdalod).forEach(function (key) {
      //       documnts.push(documentsUpdalod[key])
      //     });
      //   }

      //   let requiredDocuments = [];
      //   if (documnts && documnts.length > 0) {
      //     documnts.forEach(documents => {
            
      //       if (documents && documents.documents) {
      //         documents.documents.forEach(docItem => {
      //           if (documents.dropDownValues && documents.dropDownValues.value) {
      //             let doc = {};
      //             doc.documentType = documents.dropDownValues.value;
      //             doc.fileStoreId = docItem.fileStoreId;
      //             doc.fileStore = docItem.fileStoreId;
      //             doc.fileName = docItem.fileName;
      //             doc.fileUrl = docItem.fileUrl;
      //             doc.additionalDetails = docItem.additionalDetails;
      //             BPADocs && BPADocs.length > 0 && BPADocs.forEach(bpaDc => {
      //               console.log(bpaDc)
      //               if (bpaDc.fileStoreId === docItem.fileStoreId) {
      //                 console.log("Here I am")
      //                 doc.id = bpaDc.id;
      //               }
      //             });
      //             requiredDocuments.push(doc);
      //           }else{
      //             let doc = {};
      //             doc.documentType = docItem.title.split('_').join('.');;
      //             doc.fileStoreId = docItem.fileStoreId;
      //             doc.fileStore = docItem.fileStoreId;
      //             doc.fileName = docItem.fileName;
      //            // doc.fileUrl = docItem.fileUrl;
      //             doc.additionalDetails = docItem.additionalDetails;
                  
      //             requiredDocuments.push(doc);
      //           }
      //         })
      //       }
      //     });
      //     data.documents = requiredDocuments;
      //   }else{
          
      //     if(BPADocs && BPADocs.length > 0){
      //     data.documents = [...BPADocs];
      //     }
      //   }
        

      // }

 if(moduleName === "BPA"){
  let appStatus = data.status;
  if(appStatus && (appStatus == "APP_L1_VERIFICATION_INPROGRESS" || appStatus == "APP_L2_VERIFICATION_INPROGRESS" || appStatus == "APP_L3_VERIFICATION_INPROGRESS" || appStatus == "APPROVAL_INPROGRESS")){
    const feeAmount = get(
      data,
      "additionalDetails.sanctionFeeAdjustmentAmount",
      "NODATA"
    );
    
    const feeAmountAdjustReason = get(
      data,
      "additionalDetails.modificationReasonSanctionFeeAdjustmentAmount",
      "NODATA"
    );
    const sanctionFeeCardEnabled = get(
      data,
      "additionalDetails.sanctionFeeCardEnabled",
      false
    );

  //  if(sanctionFeeCardEnabled && feeAmount !== "" && feeAmount !== undefined && feeAmountAdjustReason !== "" && feeAmountAdjustReason !== undefined){
      if(sanctionFeeCardEnabled && (feeAmount == "NODATA" || feeAmountAdjustReason == "NODATA")){
    // }else{
      this.props.hideSpinner();
      toggleSnackbar(
        true,
        {
          labelName: "Documents Required",
          labelKey: "Please enter valid sanction fee amount details"
        },
        "error"
      );
      return;
    }
  }
 }
 if(moduleName == "BPA" && label == "SENDBACK_TO_ARCHITECT_FOR_REWORK"){
    let reworkReason = data.reworkReason;
    let comment = data.workflow.comment;
    if(comment){
      data.workflow.comments = `${reworkReason} - ${comment}`;
    }else if(reworkReason){
      data.workflow.comments = `${reworkReason}`
    }else if(reworkReason){
      data.workflow.comments = ""
    }
    
    if(!reworkReason){
      toggleSnackbar(
        true,
        {
          labelName: "Documents Required",
          labelKey: "Please select rework reason"
        },
        "error"
      );
      this.props.hideSpinner();
      return false;
    }

    let reworkHistory = data.reWorkHistory && data.reWorkHistory.edcrHistory
    if(reworkHistory && reworkHistory.length > 2){
      toggleSnackbar(
        true,
        {
          labelName: "Documents Required",
          labelKey: "BPA_REWORK_LIMIT_REACHED"
        },
        "error"
      );
      this.props.hideSpinner();
      return false;
    }
    
 }

if(moduleName == "BPA" && "edcrDetail" in data){
  delete data.edcrDetail ;
 }

if(moduleName == "PT.MUTATION" && label == 'FORWARD' && (!data.additionalDetails.mutationCharge || data.additionalDetails.mutationCharge == 0 )){

    let confirmAction = confirm("Do you want to proceed with zero mutation fee? Press OK to confirm.")
    if (confirmAction) {
      this.setState({
        open: false
      });
      let payload = await httpRequest("post", updateUrl, "", [], {
        [dataPath]: data
      });
      if(payload){
      this.props.hideSpinner();
      const licenseNumber = get(payload, "Licenses[0].licenseNumber", "");
      this.props.setRoute(`acknowledgement?${this.getPurposeString(
        label
      )}&applicationNumber=${applicationNumber}&tenantId=${tenant}&secondNumber=${licenseNumber}&moduleName=${moduleName}`);
    }} else {
      this.setState({
        open: false
      });
      this.props.hideSpinner();
      this.props.setRoute(`search-preview?applicationNumber=${applicationNumber}&tenantId=${tenant}`)
      
    }

}
else{
      let payload = await httpRequest("post", updateUrl, "", [], {
        [dataPath]: data
      });
      this.setState({
        open: false
      });
      payload = payload == '' ? true : payload;
      if (payload) {
        let path = "";
        this.props.hideSpinner();
        if (moduleName == "PT.CREATE" || moduleName == "PT.LEGACY") {
          this.props.setRoute(`/pt-mutation/acknowledgement?${this.getPurposeString(
            label
          )}&moduleName=${moduleName}&applicationNumber=${get(payload, 'Properties[0].acknowldgementNumber', "")}&tenantId=${get(payload, 'Properties[0].tenantId', "")}`);
          return;
        }

        if (moduleName == "PT.ASSESSMENT") {
          this.props.setRoute(`/pt-assessment/acknowledgement?${this.getPurposeString(
            label
          )}&moduleName=${moduleName}&applicationNumber=${applicationNumber}&tenantId=${tenant}`);
          return;
        }
        if (moduleName == 'Amendment') {
          this.props.setRoute(`acknowledgement?${this.getPurposeString(
            label
          )}&applicationNumber=${applicationNumber}&tenantId=${tenant}&businessService=${get(payload, 'Amendments[0].businessService', "")}`);
          return;
        }
        if (moduleName === "NewTL") path = "Licenses[0].licenseNumber";
        else if (moduleName === "FIRENOC") path = "FireNOCs[0].fireNOCNumber";
        else path = "Licenses[0].licenseNumber";
        const licenseNumber = get(payload, path, "");
        if (redirectQueryString) {
          if(data.applicationType === "METER_REPLACEMENT" && label === "SUBMIT_APPLICATION"){
            this.props.setRoute(`acknowledgement?${this.getPurposeString("METER_REPLACE_SUBMIT_APPLICATION")}&${redirectQueryString}`);
          }else if(data.applicationType === "METER_REPLACEMENT" && label === "APPROVE_CONNECTION"){
            this.props.setRoute(`acknowledgement?${this.getPurposeString("METER_REPLACE_APPROVE_APPLICATION")}&${redirectQueryString}`);
          }else{
            this.props.setRoute(`acknowledgement?${this.getPurposeString(label)}&${redirectQueryString}`);
          }
        } else {
          this.props.setRoute(`acknowledgement?${this.getPurposeString(
            label
          )}&applicationNumber=${applicationNumber}&tenantId=${tenant}&secondNumber=${licenseNumber}&moduleName=${moduleName}`);
        }
      }
    }
    
    } catch (e) {

      this.props.hideSpinner();
      if (moduleName === "BPA") {
        toggleSnackbar(
          true,
          {
            labelName: "Documents Required",
            labelKey: e.message
          },
          "error"
        );
      } else {
        toggleSnackbar(
          true,
          {
            labelName: "Please fill all the mandatory fields!",
            labelKey: e.message
          },
          "error"
        );
      }
    }
  };

  createWorkFLow = async (label, isDocRequired) => {
    const { toggleSnackbar, dataPath, preparedFinalObject } = this.props;
    let data = {};

    if (dataPath == "BPA" || dataPath == "Assessment" || dataPath == "Property" || dataPath === "Noc") {

      data = get(preparedFinalObject, dataPath, {})
    } else {
      data = get(preparedFinalObject, dataPath, [])
      data = data[0];
    }
    //setting the action to send in RequestInfo
    let appendToPath = ""
    if (dataPath === "FireNOCs") {
      appendToPath = "fireNOCDetails."
    } else if (dataPath === "Assessment" || dataPath === "Property" || dataPath === "BPA" || dataPath === "Noc") {
      appendToPath = "workflow."
    } else {
      appendToPath = ""
    }


    set(data, `${appendToPath}action`, label);

    if (isDocRequired) {
      let documents = get(data, "wfDocuments");
      if (dataPath === "BPA") {
        documents = get(data, "workflow.varificationDocuments");
      }
      if (documents && documents.length > 0) {
        this.wfUpdate(label);
      } else {
        toggleSnackbar(
          true,
          { labelName: "Please Upload file !", labelKey: "ERR_UPLOAD_FILE" },
          "error"
        );
      }
    } else if (dataPath == "MarriageRegistrations") {

      const todayDate = new Date();
      let appointmentDate = get(
        data,
        "appointmentDate"
      )

      let appointmentTime = get(
        data,
        "appointmentTime"
      )
      let appStatus = get(
        data,
        "status"
      )
      if (appointmentDate && appointmentTime) {

        
        if (typeof appointmentDate === "string") {
          const [aptHours, aptMins] = appointmentTime.split(":");
          const [aptYr, aptMonth, aptDay] = appointmentDate.split("-");

          // const apntDateObj = new Date(appointmentDate);
          const apntDateObj = new Date(aptYr, parseInt(aptMonth) - 1, aptDay, aptHours, aptMins);
          if (apntDateObj.getTime() < todayDate.getTime()) {
            toggleSnackbar(
              true,
              { labelName: "Appointment date can not be past date", labelKey: "ERR_APNT_DATE_IN_PAST" },
              "error"
            );
          } else {
            
            this.wfUpdate(label);
          }
        } else {
          this.wfUpdate(label);
        }


      } else {
        if (appStatus == "PENDINGSCHEDULE") {
          toggleSnackbar(
            true,
            { labelName: "Appointment date can not be past date", labelKey: "ERR_APNT_DATE_TIME_REQUIRED" },
            "error"
          );
          
        } else {
          
          this.wfUpdate(label);
        }
      }

    } else {
      this.wfUpdate(label);
    }
  };

  getRedirectUrl = (action, businessId, moduleName) => {  
    const isAlreadyEdited = getQueryArg(window.location.href, "edited");
    const tenant = getQueryArg(window.location.href, "tenantId");
    const { ProcessInstances, baseUrlTemp, bserviceTemp, preparedFinalObject } = this.props;
    const { PTApplication = {} } = preparedFinalObject;
    const { propertyId } = PTApplication;
    let applicationStatus;
    if (ProcessInstances && ProcessInstances.length > 0) {
      applicationStatus = get(ProcessInstances[ProcessInstances.length - 1], "state.applicationStatus");
    }
    // needs to remove this initialization if all other module integrated this changes.
    let baseUrl = (baseUrlTemp) ? baseUrlTemp : ""
    let bservice = (bserviceTemp) ? bserviceTemp : ""

    if (moduleName === "FIRENOC") {
      baseUrl = "fire-noc";
      bservice = "FIRENOC";
    } else if (moduleName === "BPA" || moduleName === "BPA_LOW" || moduleName === "BPA_OC" || moduleName === "BPA_OC1" || moduleName === "BPA_OC2" || moduleName === "BPA_OC3" || moduleName === "BPA_OC4" || moduleName === 'BPA1' || moduleName === 'BPA2' || moduleName === 'BPA3' || moduleName === 'BPA4' || moduleName === 'BPA5') {
      baseUrl = "egov-bpa";
      if (moduleName === "BPA" || moduleName === "BPA_LOW" || moduleName === 'BPA1' || moduleName === 'BPA2' || moduleName === 'BPA3' || moduleName === 'BPA4' || moduleName === 'BPA5') {
        bservice = ((applicationStatus == "PENDING_APPL_FEE") ? "BPA.NC_APP_FEE" : "BPA.NC_SAN_FEE");
      } //else if (moduleName === "BPA_OC") {
      else {
        bservice = ((applicationStatus == "PENDING_APPL_FEE") ? "BPA.NC_OC_APP_FEE" : "BPA.NC_OC_SAN_FEE");
      } //else {
      //bservice = "BPA.LOW_RISK_PERMIT_FEE"
      //}
    } else if (moduleName === "PT") {
      bservice = "PT"
    } else if (moduleName === "PT.ASSESSMENT") {
      const { dataPath, preparedFinalObject } = this.props
      const propertyId = get(preparedFinalObject, dataPath).propertyId || ""
      bservice = "PT"
      businessId = propertyId
    }
    else if (moduleName === "PT.CREATE" || moduleName === "PT.LEGACY") {
      return `/property-tax/assessment-form?assessmentId=0&purpose=update&propertyId=${propertyId || this.props.propertyIdForEditRedirect} &tenantId=${tenant}&mode=WORKFLOWEDIT`
    } else if (moduleName === "PT.MUTATION") {
      if (process.env.REACT_APP_NAME === "Employee" && action == "EDIT_DEMAND") {
        let { Property } = preparedFinalObject
        let acknowldgementNumber = Property.acknowldgementNumber
        baseUrl = "pt-mutation";
        bservice = "PT.MUTATION";
        return `/pt-mutation/apply?applicationNumber=${acknowldgementNumber || this.props.acknowldgementNumberNoRedirect}&tenantId=${tenant}&demandDetails=true`
      } else {
        bservice = "PT.MUTATION";
        baseUrl = "pt-mutation";
      }

    }
    else if (moduleName == "ASMT") {
      const { dataPath, preparedFinalObject } = this.props
      const propertyId = get(preparedFinalObject, dataPath).propertyId || ""
      return `/property-tax/assessment-form?assessmentId=0&purpose=update&propertyId=${propertyId}&tenantId=${tenant}&mode=editDemandDetails`
    } else if (moduleName == "MR") {
      baseUrl = process.env.REACT_APP_NAME === "Citizen" ? "mr-citizen" : "mr";
      bservice = "MR"
    }
    else if (!baseUrl && !bservice) {
      baseUrl = process.env.REACT_APP_NAME === "Citizen" ? "tradelicense-citizen" : "tradelicence";
      bservice = "TL"
    }
     if(moduleName === "MRCORRECTION" && action === "EDIT"){
      baseUrl = process.env.REACT_APP_NAME === "Citizen" ? "mr-citizen" : "mr";
      return `/${baseUrl}/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit`
    }
    else if(moduleName === "NewTL" && action === "EDIT"){
      baseUrl = process.env.REACT_APP_NAME === "Citizen" ? "tradelicense-citizen" : "tradelicence";
      return `/${baseUrl}/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit`
    }
    const payUrl = `/egov-common/pay?consumerCode=${businessId}&tenantId=${tenant}`;
    switch (action) {
      case "PAY": return bservice ? `${payUrl}&businessService=${bservice}` : payUrl;
      case "EDIT": return isAlreadyEdited
        ? `/${baseUrl}/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit&edited=true`
        : `/${baseUrl}/apply?applicationNumber=${businessId}&tenantId=${tenant}&action=edit`;
    }
  };


  getHeaderName = action => {
    return {
      labelName: `${action} Application`,
      labelKey: `WF_${action}_APPLICATION`
    };
  };

  getEmployeeRoles = (nextAction, currentAction, moduleName) => {
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    const data = find(businessServiceData, { businessService: moduleName });
    let roles = [];
    if (nextAction === currentAction) {
      data.states &&
        data.states.forEach(state => {
          state.actions &&
            state.actions.forEach(action => {
              roles = [...roles, ...action.roles];
            });
        });
    } else {
      const states = find(data.states, { uuid: nextAction });
      states &&
        states.actions &&
        states.actions.forEach(action => {
          roles = [...roles, ...action.roles];
        });
    }
    roles = [...new Set(roles)];
    roles.indexOf("*") > -1 && roles.splice(roles.indexOf("*"), 1);
    return roles.toString();
  };

  checkIfTerminatedState = (nextStateUUID, moduleName) => {
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    const data = businessServiceData && businessServiceData.length > 0 ? find(businessServiceData, { businessService: moduleName }) : [];
    const nextState = data && data.states && data.states.length > 0 && find(data.states, { uuid: nextStateUUID });

    const isLastState = data ? nextState && nextState.isTerminateState : false;
    return isLastState;
  };

  checkIfDocumentRequired = (nextStateUUID, moduleName) => {
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    const data = find(businessServiceData, { businessService: moduleName });
    const nextState = find(data.states, { uuid: nextStateUUID });
    return nextState && nextState.docUploadRequired;
  };

  getActionIfEditable = (status, businessId, moduleName, applicationState) => {
    let editDemands = false;
    const businessServiceData = JSON.parse(
      localStorageGet("businessServiceData")
    );
    const data = find(businessServiceData, { businessService: moduleName });
    const state = applicationState ? find(data.states, { applicationStatus: status, state: applicationState }) : find(data.states, { applicationStatus: status });
    let actions = [];
    state.actions &&
      state.actions.forEach(item => {
        actions = [...actions, ...item.roles];
      });
    const userRoles = JSON.parse(getUserInfo()).roles;
    const roleIndex = userRoles.findIndex(item => {
      if (actions.indexOf(item.code) > -1) return true;
    });

    let editAction = {};

    //hardcoded edit demand button for adding demand details
    if ((moduleName == "PT.CREATE" || moduleName == "PT.MUTATION" || moduleName == "ASMT") && (applicationState == "DOCVERIFIED" || applicationState == "PENDING_FIELD_INSPECTION")) {
      editDemands = true
    }

    if (moduleName === "SWCloseConnection" || moduleName === "SWDisconnection" || moduleName === "WSCloseConnection" || moduleName === "WSDisconnection" || moduleName === "WSReconnection" || moduleName === "SWReconnection"
      || moduleName === "ModifySWConnection" || moduleName === "ModifyWSConnection" || moduleName === "SWOwnershipChange" || moduleName === "WSOwnershipChange") {
      state.isStateUpdatable = false;
    }

    if (moduleName === "ModifySWConnection" || moduleName === "ModifyWSConnection" || moduleName === "WSOwnershipChange"){
      if(applicationState === "INITIATED")
      state.isStateUpdatable = true
    }
    if (moduleName === "WSReplaceMeter"){
      if(applicationState === "INITIATED"){
      state.isStateUpdatable = true
      }else{
        state.isStateUpdatable = false
      }
    }
   
    // state.isStateUpdatable = true; // Hardcoded configuration for PT mutation Edit
    if (state.isStateUpdatable && actions.length > 0 && roleIndex > -1) {
      editAction = {
        buttonLabel: "EDIT",
        moduleName: moduleName,
        tenantId: state.tenantId,
        isLast: true,
        buttonUrl: (this.props.editredirect) ? this.props.editredirect : this.getRedirectUrl("EDIT", businessId, moduleName, applicationState)
      };
    }

    //hardcoded edit demand button for adding demand details
    if (editDemands && actions.length > 0 && roleIndex > -1) {
      editAction = {
        buttonLabel: "EDIT_DEMANDS",
        moduleName: moduleName,
        tenantId: state.tenantId,
        isLast: true,
        buttonUrl: this.getRedirectUrl("EDIT_DEMAND", businessId, moduleName, applicationState)
      };
    }

    return editAction;
  };

  prepareWorkflowContract = (data, moduleName) => {
    const {
      getRedirectUrl,
      getHeaderName,
      checkIfTerminatedState,
      getActionIfEditable,
      checkIfDocumentRequired,
      getEmployeeRoles
    } = this;
    let businessService = moduleName === data[0].businessService ? moduleName : data[0].businessService;
    let businessId = get(data[data.length - 1], "businessId");
    let applicationState = get(data[data.length - 1], "state.state");
    let filteredActions = [];

    filteredActions = get(data[data.length - 1], "nextActions", []).filter(
      item => item.action != "ADHOC"
    );
    let applicationStatus = get(
      data[data.length - 1],
      "state.applicationStatus"
    );
    let actions = orderBy(filteredActions, ["action"], ["desc"]);
    actions = actions.map(item => {
      return {
        buttonLabel: item.action,
        moduleName: data[data.length - 1].businessService,
        isLast: item.action === "PAY" ? true : false,
        buttonUrl: getRedirectUrl(item.action, businessId, businessService),
        dialogHeader: getHeaderName(item.action),
        showEmployeeList: (businessService === "NewWS1" || businessService === "ModifyWSConnection" || businessService === "ModifySWConnection" || businessService === "NewSW1" || businessService === "SWCloseConnection" || businessService === "SWOwnershipChange" || businessService == "WSOwnershipChange" || businessService === "SWDisconnection" || businessService === "WSCloseConnection" || businessService === "WSDisconnection" || businessService === "SWReconnection" || businessService === "WSReconnection") ? !checkIfTerminatedState(item.nextState, businessService) && item.action !== "SEND_BACK_TO_CITIZEN" && item.action !== "APPROVE_CONNECTION" && item.action !== "APPROVE_FOR_CONNECTION" && item.action !== "RESUBMIT_APPLICATION" : !checkIfTerminatedState(item.nextState, businessService) && item.action !== "SENDBACKTOCITIZEN",
        roles: getEmployeeRoles(item.nextState, item.currentState, businessService),
        isDocRequired: moduleName == "MR" ? false : checkIfDocumentRequired(item.nextState, businessService)
      };
    });
    actions = actions.filter(item => item.buttonLabel !== 'INITIATE');
    let editAction = getActionIfEditable(
      applicationStatus,
      businessId,
      businessService,
      applicationState
    );
    editAction.buttonLabel && actions.push(editAction);
    return actions;
  };

  convertOwnerDobToEpoch = owners => {
    let updatedOwners =
      owners &&
      owners
        .map(owner => {
          return {
            ...owner,
            dob:
              owner && owner !== null && convertDateToEpoch(owner.dob, "dayend")
          };
        })
        .filter(item => item && item !== null);
    return updatedOwners;
  };

  render() {
    const {
      ProcessInstances,
      prepareFinalObject,
      dataPath,
      moduleName,
      preparedFinalObject
    } = this.props;
    if (ProcessInstances &&
      ProcessInstances.length > 0) {

    }
    const workflowContract =
      ProcessInstances &&
      ProcessInstances.length > 0 &&
      this.prepareWorkflowContract(ProcessInstances, moduleName);
    if (workflowContract) {

    }
    let showFooter = true;
    if (moduleName === 'BPA' || moduleName === 'BPA_LOW' || moduleName === 'BPA_OC' || moduleName === "BPA_OC1" || moduleName === "BPA_OC2" || moduleName === "BPA_OC3" || moduleName === "BPA_OC4" || moduleName === 'BPA1' || moduleName === 'BPA2' || moduleName === 'BPA3' || moduleName === 'BPA4' || moduleName === 'BPA5') {
      showFooter = process.env.REACT_APP_NAME === "Citizen" ? false : true;
    }
    if ((moduleName === 'Noc') && window.location.href.includes("isFromBPA=true")) {
      showFooter = false
    }
    if (moduleName === "NewTL") {
      let Lic = get(preparedFinalObject, "Licenses");

      if (Lic && Lic.length > 0) {
        if (Lic[0].licenseType === "TEMPORARY" && (Lic[0].status === "APPROVED" || Lic[0].status === "EXPIRED")) {
          showFooter = false
        }
      }
    }
    return (
      <div>
        {ProcessInstances && ProcessInstances.length > 0 && (
          <TaskStatusContainer ProcessInstances={ProcessInstances} moduleName={moduleName} />
        )}
        {showFooter &&
          <Footer
            handleFieldChange={prepareFinalObject}
            variant={"contained"}
            color={"primary"}
            onDialogButtonClick={this.createWorkFLow}
            contractData={workflowContract}
            dataPath={dataPath}
            moduleName={moduleName}
          />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  const { workflow } = preparedFinalObject;
  const { ProcessInstances } = workflow || [];
  return { ProcessInstances, preparedFinalObject };
};

const mapDispacthToProps = dispatch => {
  return {
    prepareFinalObject: (path, value) =>
      dispatch(prepareFinalObject(path, value)),
    toggleSnackbar: (open, message, variant) =>
      dispatch(toggleSnackbar(open, message, variant)),
    setRoute: route => dispatch(setRoute(route)),
    showSpinner: () =>
      dispatch(showSpinner()),
    hideSpinner: () =>
      dispatch(hideSpinner())
  };
};

export default connect(
  mapStateToProps,
  mapDispacthToProps
)(WorkFlowContainer);
