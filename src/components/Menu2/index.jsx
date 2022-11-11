import React from "react";
import "./Menu2.css";
import DropDown from '../DropDown/index.jsx';

function Menu2(props) {
  const { className } = props;

  return (
    <div className={props.callerComponent + " menu-6"}>
      <DropDown
        className="Header-navLink" title="games" options={['guess the song', 'yokigains', 'yokirade', 'nextyoki']}
      />
    </div>
  );
}

export default Menu2;
