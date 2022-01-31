import React, { Component } from "react";
import { Emoji } from 'emoji-mart'
import { GetComments, GetEmojiFromComments } from "../helpers/Helpers.js";
import Button from "@material-ui/core/Button";
import TrendingUpOutlinedIcon from '@material-ui/icons/TrendingUpOutlined';
import BarChartOutlinedIcon from '@material-ui/icons/BarChartOutlined';
import PersonIcon from '@material-ui/icons/Person';
import AccessAlarmOutlinedIcon from '@material-ui/icons/AccessAlarmOutlined';

import './Result.css';


class Result extends Component {

  render() {
    return (
        <div className={this.props.modifier ? this.props.modifier + "-results Result-results pulse" : "Result-results pulse"}
            style={{
                backgroundColor: this.props.backgroundColor,
            }}
        >
            <div className="Result-results-title">Result</div>
            <div className="Result-gameOption"><PersonIcon /> {this.props.playerName == "" ? 'yokibot' : this.props.playerName}</div>
            <div className="Result-gameOption"><BarChartOutlinedIcon /> {this.props.difficultyLevel}</div>
            <div className="Result-gameOption"><TrendingUpOutlinedIcon /> {this.props.score}</div>
            <div className="Result-gameOption"><AccessAlarmOutlinedIcon /> {this.props.optionDuration}</div>
            <div className="Result-gameOption Result-comment">
                {GetComments(this.props.score) + " "}
                <Emoji
                    emoji={GetEmojiFromComments(GetComments(this.props.score))}
                    set='apple'
                    size={18}
                />
            </div>
            <Button
                style={{
                    backgroundColor: this.props.btnBackgroundColor,
                    color: this.props.btnTextColor,
                    marginTop: '30px'
                }}
                variant="contained" color="primary"
                onClick={this.props.restartGame}
            >
                play again
            </Button>
        </div>
    );
  }
}

export default Result;