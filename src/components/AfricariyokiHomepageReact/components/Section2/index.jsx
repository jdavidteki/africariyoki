import React from "react";
import Menu from "../Menu";
import "./Section2.css";

function Section2() {
  return (
    <div className="section">
      <h1 className="title poppins-normal-white-24px">
        <span className="poppins-normal-white-24px">What would you like to sing to today?</span>
      </h1>
      <Menu />
    </div>
  );
}

export default Section2;
