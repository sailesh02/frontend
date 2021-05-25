import React, { Component } from "react";
import { Card } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import "./index.css";

export default class AdditionalInformation extends Component {
  render() {
    const { additionalInformation } = this.props;
    const labelKeys = Object.keys(additionalInformation);
    return (
      <div>
        <Card
          style={{ backgroundColor: "rgb(242, 242, 242)", boxShadow: "none" }}
          textChildren={
            <div>
              <div className="rainmaker-displayInline" style={{ alignItems: "center", marginLeft: "13px", marginTop: 20 }}>
                <Label
                  labelStyle={{ letterSpacing: "0.67px", color: "rgba(0, 0, 0, 0.87)", fontWeight: "400", lineHeight: "19px" }}
                  label={"PT_PROPERTY_ADDITIONAL_INFO_HEADER"}
                  fontSize="18px"
                />
              </div>
              {labelKeys.map((item) => (
                <div>
                  <div className="col-sm-3 col-xs-12" style={{ marginBottom: 10, marginTop: 5 }}>
                    <div className="col-sm-12 col-xs-12" style={{ padding: "5px 0px 0px 0px" }}>
                      <Label
                        labelStyle={{ letterSpacing: "0.67px", color: "rgba(0, 0, 0, 0.54)", fontWeight: "400", lineHeight: "1.375em" }}
                        label={`PT_PROPERTY_${item.toUpperCase()}`}
                        fontSize="12px"
                      />
                    </div>
                    <div className="col-sm-12 col-xs-12" style={{ padding: "5px 0px 0px 0px" }}>
                      <Label
                        labelStyle={{ letterSpacing: "0.67px", color: "rgba(0, 0, 0, 0.87)", fontWeight: "400", lineHeight: "19px" }}
                        label={additionalInformation[item] ? additionalInformation[item] : "NA"}
                        fontSize="16px"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }
        />
      </div>
    );
  }
}
