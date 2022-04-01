import React from "react";
import Titlelevel from "../Titlelevel";
import PlayerScore from "../PlayerScore";
import Time from "../Time";
import Trending2 from "../Trending2";
import { GetComments, GetMemesFromComments } from "../helpers/Helpers";
import alarmLogo from '../../../static/img/timer-1@2x.png'

import "./GameResult.css";

function GameResult(props) {
  return (
    <div className="game-result-5">
      <div className="game-resultheader-1">
        <div className="overlap-group-45">
          <div className="progress-1"></div>
          <div className="playing-start">
            <div className="left-2">
              <Titlelevel
                selectedOptionDifficulty = {props.selectedOptionDifficulty}
                title={"your result"}
              />
              <PlayerScore
                score={props.score}
                playerName = {props.playerName}
              />
            </div>
            <div className="right-3">
              <Time timer={alarmLogo} spanText={props.selectedOptionDuration + "min(s)"} />
            </div>
          </div>
        </div>
      </div>

      <div className="game-result-details">
        <div className="game-result-comment poppins-normal-santas-gray-17px">{GetComments(props.score) + " "}</div>
        <img className="game-result-image" src={GetMemesFromComments(GetComments(props.score))} />
        <Trending2
          buttontext = {"play again"}
          trigger = {props.restartGame}
        />
      </div>

    </div>
  );
}

export default GameResult;
