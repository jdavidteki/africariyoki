import React from "react";
import "./Section1.css";

function Section1(props) {
  const { src } = props;

  return (
    <div className="section1">
      <div className="component-16">
        <img className="logo" src={src} />
      </div>
    </div>
  );
}

export default Section1;
