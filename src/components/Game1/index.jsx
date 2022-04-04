import React from "react";
import "./Game1.css";

function Game1(props) {
  const { icon, spanText1, spanText2, className } = props;

  return (
    <div onClick={()=> window.location.href = window.location.href + `${props.hreflink}`} className={`game1 ${className || ""}`}>
      <div className="icon-bg">
        <div className="icon-1" style={{ backgroundImage: `url(${icon})` }}></div>
      </div>
      <div className="text-40">
        <div className="monalisa-13 poppins-medium-white-17px">
          <span className="span-68 poppins-medium-white-17px">{spanText1}</span>
        </div>
        <p className="kida-cruse-ft-katampe-12 poppins-normal-white-14px">
          <span className="span-68 poppins-normal-white-14px">{spanText2}</span>
        </p>
      </div>
    </div>
  );
}

export default Game1;
