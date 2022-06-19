import React from "react";
import "./Section2.css";
let randomNumber =  Math.floor(Math.random() * (11 - 1 + 1) + 1)

function Section2() {
  return (
    <div className="section-3">
      <div className="what-would-you-like-to-sing-to-today poppins-normal-white-24px">
        <span className="poppins-normal-white-24px">{randomNumber < 2 ? 'kariyoki?' : randomNumber < 4 ? 'make yokilove' : randomNumber < 6 ? 'play yokigames' : randomNumber < 9 ? 'afrobeats ai playhouse' : '#yokiworld' }</span>
      </div>
    </div>
  );
}

export default Section2;
