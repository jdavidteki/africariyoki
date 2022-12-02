import React from "react";
import Frame206 from "../Frame206";
import Trending2 from "../Trending2";

import "./SetGameModal.css";

function SetGameModal(props) {
  return (
    <div className="set-game-modal">
      <div className="set-game-modalheader">
        <div className="set-game-modal-4 valign-text-middle poppins-medium-martinique-29px">
          <span>
            <span className="poppins-medium-martinique-29px">{props.setGameTitle}</span>
          </span>
        </div>
      </div>
      <div className="set-game-modalbody-5">
        <Frame206
          handleChangePlayerName = {props.handleChangePlayerName}
          selectLevel={props.selectLevel}
          selectedOptionDifficulty={props.selectedOptionDifficulty}
          handleChangeDifficulty = {props.handleChangeDifficulty}
          selectedOptionDuration = {props.selectedOptionDuration}
          handleChangeDuration = {props.handleChangeDuration}
          handleSelectedSongs = {props.handleSelectedSongs}
          songs = {props.songs}
        />
        <Trending2
          trigger = {props.startGame}
          buttontext = {"begin round"}
        />
      </div>
    </div>
  );
}

export default SetGameModal;
