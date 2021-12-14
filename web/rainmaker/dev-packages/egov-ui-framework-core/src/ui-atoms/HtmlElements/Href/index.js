import React from "react";

const Href=(props)=>{
  const {children, onClick, ...rest}=props;
  return (
    <a onClick={props.onClick} {...rest}>
      {children}
    </a>
  )
}

export default Href;
