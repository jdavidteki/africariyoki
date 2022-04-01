import React from "react";
import Titlelevel from "../Titlelevel";
import PlayerScore from "../PlayerScore";
import Time from "../Time";
import Song from '../Song2'
import { CleanLine } from "../helpers/Helpers";
import playLogo from '../../../static/img/play-arrow-1@2x.png'
import pauseLogo from '../../../static/img/pause-1@2x.png'
import alarmLogo from '../../../static/img/timer-1@2x.png'

import "./PopLinesPlay.css";

function PopLinesPlay(props) {
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
            <div className="bottom-section poppins-medium-martinique-24px PopularLine-lyricInQuestion" id="PopularLine-lyricInQuestion">
              {getPopularLine(props.randomTruePopLine, props.songInQuestion, props.nthLongestLineToShow) }
            </div>
          </div>
        </div>
      </div>
      <div className="PopLinesPlay-options">
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

function getPopularLine(randomTruePopLine, songObject, nthLongestLineToShow){
  if(randomTruePopLine != ""){
      return randomTruePopLine
  }

  let lyricsArray = songObject.lyrics.split("\n").sort((a, b) => b.length - a.length);
  let lineToReturn = lyricsArray[nthLongestLineToShow]

  return CleanLine(lineToReturn)
}

export default PopLinesPlay;
