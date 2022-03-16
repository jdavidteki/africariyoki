import React from "react";
import "./Trending.css";

function Trending(props) {
  const { spanText1, spanText2, className } = props;

  return (
    <div className={`trending-1 ${className || ""}`}>
      <div className="monalisa poppins-medium-white-17px">
        <span className="span poppins-medium-white-17px">{spanText1}</span>
      </div>
      <div className="kida-cruse-ft-katampe poppins-normal-black-haze-12px">
        <span className="span poppins-normal-black-haze-12px">{spanText2}</span>
      </div>
    </div>
  );
}

export default Trending;
