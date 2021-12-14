import React from "react";

const Href=(props)=>{
  const {children, ...rest,onClick}=props;
  return (
    <a onClick={props.onClick} {...rest}>
      {children}
    </a>
  )
}

export default Href;
