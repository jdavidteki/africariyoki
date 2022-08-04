import React from "react";
import Titlelevel from "../Titlelevel";
import PlayerScore from "../PlayerScore";
import Time from "../Time";
import Song from '../Song2'
import playLogo from '../../../static/img/play-arrow-1@2x.png'
import pauseLogo from '../../../static/img/pause-1@2x.png'
import alarmLogo from '../../../static/img/timer-1@2x.png'

import "./GTSPlay.css";

function GTSPlay(props) {
  return (
    <div className="guess-the-song-5">
      <div className="guess-the-songheader-1">
        <div className="overlap-group-45">
          <div className="progress-1"></div>
          <div className="playing-start">
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
        </div>
      </div>
      <div className="GuessSong-options">
        {props.songsInOption.map((song) =>
          <Song
            key={song.id}
            song={song}
            playSong={props.checkAnswer}
            backgroundColor={props.optionBackground}
            countries={song.countries}
          />
        )}
      </div>
    </div>
  );
}

export default GTSPlay;
