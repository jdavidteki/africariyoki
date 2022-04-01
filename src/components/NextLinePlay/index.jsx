import React from "react";
import Titlelevel from "../Titlelevel";
import PlayerScore from "../PlayerScore";
import Time from "../Time";
import playLogo from '../../../static/img/play-arrow-1@2x.png'
import pauseLogo from '../../../static/img/pause-1@2x.png'
import alarmLogo from '../../../static/img/timer-1@2x.png'

import "./NextLinePlay.css";

function NextLine(props) {
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
                />
              </div>
              <div className="right-3">
                <div className="buttons1" onClick={() => props.play()}>
                  {props.audioPaused ?
                    <img className="play" src={playLogo} />
                  :
                    <img className="pause" src={pauseLogo} />
                  }
                </div>
                <Time timer={alarmLogo} spanText={`${props.mins} : ${props.secs}`} />
              </div>
            </div>
            <div className="bottom-section poppins-medium-martinique-24px NextLinePlay-lyricInQuestion" id="NextLinePlay-lyricInQuestion">
              {props.lyricAndOptionObj["question"] ? props.lyricAndOptionObj["question"] : props.songInQuestion.title }
            </div>
          </div>
        </div>
      </div>
      <div className="NextLinePlay-options">
        {props.lyricAndOptionObj["lyricOptions"].map((lyricOption) =>
          <div
            className="NextLinePlay-option"
            onClick={()=>props.checkAnswer(lyricOption)}
            key={lyricOption}
            id={lyricOption.replaceAll(' ', '')}
          >
            {lyricOption}
          </div>
        )}
      </div>
    </div>
  );
}

export default NextLine;
