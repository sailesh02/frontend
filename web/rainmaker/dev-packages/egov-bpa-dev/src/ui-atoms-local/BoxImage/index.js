import React from 'react';
import PropTypes from 'prop-types';


const BoxImage =(props)=>{
  const {src,children,height,width,...rest}=props;
  return(
    <img src={src} width={width} height={height}/>
  )
}


BoxImage.propTypes={
  children:PropTypes.any
}

export default BoxImage;
