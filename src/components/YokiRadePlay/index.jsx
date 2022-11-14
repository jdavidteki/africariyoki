import React from "react";
import Titlelevel from "../Titlelevel";
import PlayerScore from "../PlayerScore";
import Time from "../Time";
import { CleanLine } from "../helpers/Helpers";
import alarmLogo from '../../../static/img/timer-1@2x.png'

import "./YokiRadePlay.css";

function YokiRadePlay(props) {
  return (
    <div className="pop-lines-5">
      <div className="pop-linesheader-1">
        <div className="overlap-group-45">
          <div className="progress-1"></div>
          <div className="playing-start for-poplines">
            <div className="top-section">
              <div className="left-2">
                <Titlelevel
                  title = {props.selectedOptionDifficulty}
                  selectedOptionDifficulty = {props.selectedOptionDifficulty}
                />
                <PlayerScore
                  score={props.score}
                  playerName = {props.playerName}
                  answerCorrect = {props.answerCorrect}
                  answerClicked={props.answerClicked}
                />
              </div>
              <div className="right-3">
                <Time timer={alarmLogo} spanText={`${props.mins} : ${props.secs}`} />
              </div>
            </div>
            <div className="bottom-section poppins-medium-martinique-24px YokiRade-lyricInQuestion">
              {props.yokiRadeWord}
            </div>
          </div>
        </div>
      </div>
      <div className="YokiRadePlay-options">
        <div id="YokiRadePlay-correct" className="YokiRadePlay-check YokiRadePlay-correct" onClick={ () => props.checkAnswer("correct")}>
          +
        </div>
        <div id="YokiRadePlay-wrong" className="YokiRadePlay-check YokiRadePlay-wrong" onClick={() => props.checkAnswer("wrong")}>
          -
        </div>
      </div>
    </div>
  );
}

export default YokiRadePlay;
