import React from "react";
import "./RightControl1.css";

function RightControl1(props) {
  const { src } = props;

  return (
    <div className="left1">
      <img className="arrow_drop_down" src={src} />
    </div>
  );
}

export default RightControl1;
