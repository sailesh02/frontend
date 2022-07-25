import React from 'react';
import PropTypes from 'prop-types';


const BoxImage =(props)=>{
  const {src,children,...rest}=props;
  return(
    <img src={src} />
  )
}


BoxImage.propTypes={
  children:PropTypes.any
}

export default BoxImage;
