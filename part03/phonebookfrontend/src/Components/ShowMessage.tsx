import React from "react";

export const ShowMessage = ({ divStyle, paragraphStyle, message }) => {
  return (
    <div style={divStyle}>
      <p style={paragraphStyle}>{message}</p>
    </div>
  );
};
