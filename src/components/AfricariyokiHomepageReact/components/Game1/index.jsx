import React from "react";
import "./Game1.css";

function Game1(props) {
  const { icon, spanText1, spanText2, className } = props;

  return (
    <div className={`game1 ${className || ""}`}>
      <div className="icon-bg">
        <div className="icon" style={{ backgroundImage: `url(${icon})` }}></div>
      </div>
      <div className="text-1">
        <div className="monalisa-1 poppins-medium-white-17px">
          <span className="span-1 poppins-medium-white-17px">{spanText1}</span>
        </div>
        <p className="kida-cruse-ft-katampe-1 poppins-normal-white-14px">
          <span className="span-1 poppins-normal-white-14px">{spanText2}</span>
        </p>
      </div>
    </div>
  );
}

export default Game1;
