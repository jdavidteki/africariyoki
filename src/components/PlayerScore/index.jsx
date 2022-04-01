import React from "react";
import Frame1943 from "../Frame1943";
import "./PlayerScore.css";

function PlayerScore(props) {
  const { className } = props;

  return (
    <div className={`player-score ${className || ""}`}>
      <div className="player-1-3 valign-text-middle poppins-normal-martinique-20px">
        <span>
          <span className="spankj3ed poppins-normal-martinique-20px">{props.playerName}</span>
        </span>
      </div>
      <Frame1943
        score={props.score}
      />
    </div>
  );
}

export default PlayerScore;
