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
              {getPopularLine(props.randomTruePopLine, props.songInQuestion, props.nthLongestLineToShow, props.selectedOptionDifficulty) }
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

function getPopularLine(randomTruePopLine, songObject, nthLongestLineToShow, difficulty){

  if(randomTruePopLine != ""){
    return returnLineBasedOnDifficulty(randomTruePopLine, difficulty)
  }

  let lyricsArray = songObject.lyrics.split("\n").sort((a, b) => b.length - a.length);
  let lineToReturn = lyricsArray[nthLongestLineToShow]

  return returnLineBasedOnDifficulty(CleanLine(lineToReturn), difficulty)
}


function returnLineBasedOnDifficulty(lineToReturn, difficulty){
  let lineToReturnArray = lineToReturn.split(" ")

  if (difficulty == "beginner"){
    return lineToReturn
  } else if (difficulty == "amateur"){
    if (lineToReturn.length > 3){
      return lineToReturnArray.splice(0, 3).join(" ")
    }

  } else if (difficulty == "professional"){
    if (lineToReturn.length > 2){
      return lineToReturnArray.splice(0, 2).join(" ")
    }
  } else if (difficulty == "master"){
    return lineToReturnArray[Math.floor(Math.random()*lineToReturnArray.length)]
  }
}

export default YokiRadePlay;
