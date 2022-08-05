import React from "react";
import "./Frame1943.css";
import StarLogo from "../../../static/img/score-2@2x.png"

function Frame1943(props) {
  const { className, answerCorrect, answerClicked } = props;
  return (
    <div className={`frame-194-4 ${className || ""}`}>
      <svg version="1.0" className={`score-5 ${answerClicked ? "correctAnswerStar" : "wrongAnswerStar"}`} xmlns="http://www.w3.org/2000/svg"
        width="20" height="20" viewBox="0 0 20 20"
        preserveAspectRatio="xMidYMid meet">

        <g transform="translate(0.000000,22.000000) scale(0.100000,-0.100000)"
        fill={answerCorrect ? "#0e877b" : "#9c083e"} stroke="none">
          <path d="M100 158 c-9 -19 -21 -28 -37 -28 -28 0 -30 -16 -3 -30 16 -8 18 -15
          10 -35 -10 -28 6 -35 28 -13 9 9 15 9 24 0 22 -22 38 -15 28 13 -8 20 -6 27
          10 35 27 15 25 30 -4 30 -18 0 -27 8 -34 28 l-9 27 -13 -27z"/>
        </g>
      </svg>

      <div className="number-10 valign-text-middle poppins-medium-martinique-20px">
        <span>
          <span className={`span4cmxd poppins-medium-martinique-20px ${answerClicked ? "animateScoreIn" : "animateScoreOut"}`}>{props.score}</span>
        </span>
      </div>
    </div>
  );
}

export default Frame1943;
