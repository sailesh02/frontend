import React from "react";
import { Link } from "react-router-dom";
import { TextField } from "components";
import Button from '@material-ui/core/Button';
import Label from "egov-ui-kit/utils/translationNode";
import { ProfileSection } from "modules/common";
import "./index.css";

const ProfileForm = ({ form, handleFieldChange, onClickAddPic, img, profilePic, onClickRegister}) => {
  const fields = form.fields || {};
  const submit = form.submit;
  const register = form.register;
  return (
    <div>
      <div className="profile-card-container">
        <div>
          <div style={{ padding: 0 }} className="col-xs-12 col-sm-4 col-md-4 col-lg-4 profile-profilesection">
            <ProfileSection img={profilePic || img} onClickAddPic={onClickAddPic} />
          </div>
          <div style={{ padding: "0 8px" }} className="col-xs-12 col-sm-8 col-md-8 col-lg-8 profileFormContainer">
            <TextField {...fields.name} onChange={(e, value) => handleFieldChange("name", value)} />
            <TextField {...fields.phonenumber} />
            <TextField {...fields.email} onChange={(e, value) => handleFieldChange("email", value)} />
            <div className ="col-xs-6 col-sm-6 col-md-6 col-lg-4" style = {{ marginTop: "24px", marginBottom: "14px" }}>
              <Link to="/user/change-password">
                <Label className="change-password-label-style" label={"CORE_COMMON_CHANGE_PASSWORD"} color="#f89a3f" />
              </Link>
            </div>
            <div className ="col-xs-6 col-sm-6 col-md-6 col-lg-8" style = {{marginTop: "22px" }}>
              <Button className="change-password-label-style" variant ='text' onClick = {onClickRegister} primary={true} style={{color :"#f89a3f"}}>DIGITAL SIGNATURE REGISTRATION</Button>              
            </div>
          </div>
        </div>
      </div>

      <div className="responsive-action-button-cont">
        <Button variant ='contained' className="responsive-action-button" style={{backgroundColor :"rgb(254, 122, 81)",color:'rgb(255, 255, 255)',lineHeight:'32px'}} {...submit} primary={true} fullWidth={true}>Save</Button>
      </div>
    </div>
  );
};

export default ProfileForm;
