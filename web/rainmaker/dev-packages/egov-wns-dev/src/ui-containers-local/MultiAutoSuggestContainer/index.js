import React, { Component } from "react";
import { connect } from "react-redux";
//import { AutoSuggest } from "../../ui-atoms";
import { MultiAutoSuggest } from "egov-wns/ui-atoms-local/";

import {
  transformById,
  getLocaleLabels,
  appendModulePrefix
} from "egov-ui-framework/ui-utils/commons";


class MultiAutoSuggestContainer extends Component {
  onSelect = value => {
    const { onChange } = this.props;
    //Storing multiSelect values not handled yet
    onChange({ target: { value: value ? value.value : null } });
  };

  render() {
    const {
      value,
      preparedFinalObject,
      label,
      placeholder,
      suggestions,
      className,
      localizationLabels,
      required,
      errorText,
      disabled,
      defaultSort=true,
      
      ...rest
    } = this.props;
    
    let translatedLabel = getLocaleLabels(
      label.labelName,
      label.labelKey,
      localizationLabels
    );
    
    return (
      <div>
        <MultiAutoSuggest 
        label={translatedLabel}
        required={required}
        {...rest}
        />
      </div>
    );
  }
}



export default connect(
  null,
  null
)(MultiAutoSuggestContainer);
