
import React, { Component } from 'react';
import CircularProgress from "@material-ui/core/CircularProgress";
import Firebase from "../../firebase/firebase.js";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import './ScoreboardGuessSongLine.css';

class ScoreboardGuessSongLine extends Component {
    constructor(props){
        super(props);

        this.state= {
            cards: this.props.cards,
            scores: {},
        }
    }

    componentDidMount(){
        Firebase.getScoreboardGuessSongLine()
        .then(ScoreboardGuessSongLine => {
            this.setState({
                scores: ScoreboardGuessSongLine,
            })
        })
    }

    scoreSubTitiles(){
        return(
            <div className="ScoreboardGuessSongLine-scoreInfo--subTitle">
                <div>rank</div>
                <div>name</div>
                <div>score</div>
                <div>min</div>
                <div>avg</div>
            </div>
        )
    }

    closeScoreLabelSection = (label) => {
        let labelClassName = `ScoreboardGuessSongLine-scoreInfo--${label}`
        let arrowClassName = `ScoreboardGuessSongLine-arrow--${label}`
        document.getElementsByClassName(labelClassName)[0].classList.toggle('open')
        document.getElementsByClassName(arrowClassName)[0].classList.toggle('open')
    }

    render() {
        if(Object.keys(this.state.scores).length > 0){
            return (
                <div className="ScoreboardGuessSongLine">
                    <div className="ScoreboardGuessSongLine-wrapper">
                        <div className="ScoreboardGuessSongLine-guessTheSong">
                            <div className="ScoreboardGuessSongLine-title">
                                popular lines top 10
                            </div>
                            <div className="ScoreboardGuessSongLine-scoreInfo--beginner">
                                <div className="ScoreboardGuessSongLine-scoreInfo--title">
                                    <div>beginner</div>
                                    <ArrowDropDownIcon onClick={() => {this.closeScoreLabelSection("beginner")}} className="ScoreboardGuessSongLine-arrow--beginner" />
                                </div>
                                {this.scoreSubTitiles()}
                                {this.state.scores.beginner.map((scoreInfo, index) =>
                                    <div className={index % 2 != 0 ? "ScoreboardGuessSongLine-scoreInfoWrapper gray" : "ScoreboardGuessSongLine-scoreInfoWrapper"} key={index}>
                                        <div className="ScoreboardGuessSongLine-scoreInfo--rank">{scoreInfo.rank}</div>
                                        <div className="ScoreboardGuessSongLine-scoreInfo--name">{scoreInfo.name} </div>
                                        <div className="ScoreboardGuessSongLine-scoreInfo--score">{scoreInfo.score} </div>
                                        <div className="ScoreboardGuessSongLine-scoreInfo--duration">{scoreInfo.duration} </div>
                                        <div className="ScoreboardGuessSongLine-scoreInfo--averageScore">{scoreInfo.averageScore} </div>
                                    </div>
                                )}
                            </div>
                            <div className="ScoreboardGuessSongLine-scoreInfo--amateur">
                                <div className="ScoreboardGuessSongLine-scoreInfo--title">
                                    <div>amateur</div>
                                    <ArrowDropDownIcon onClick={() => {this.closeScoreLabelSection("amateur")}} className="ScoreboardGuessSongLine-arrow--amateur" />
                                </div>
                                {this.scoreSubTitiles()}
                                {this.state.scores.amateur.map((scoreInfo, index) =>
                                    <div className={index % 2 != 0 ? "ScoreboardGuessSongLine-scoreInfoWrapper gray" : "ScoreboardGuessSongLine-scoreInfoWrapper"} key={index}>
                                        <div className="ScoreboardGuessSongLine-scoreInfo--rank">{scoreInfo.rank}</div>
                                        <div className="ScoreboardGuessSongLine-scoreInfo--name">{scoreInfo.name} </div>
                                        <div className="ScoreboardGuessSongLine-scoreInfo--score">{scoreInfo.score} </div>
                                        <div className="ScoreboardGuessSongLine-scoreInfo--duration">{scoreInfo.duration} </div>
                                        <div className="ScoreboardGuessSongLine-scoreInfo--averageScore">{scoreInfo.averageScore} </div>
                                    </div>
                                )}
                            </div>
                            <div className="ScoreboardGuessSongLine-scoreInfo--professional">
                                <div className="ScoreboardGuessSongLine-scoreInfo--title">
                                    <div>professional</div>
                                    <ArrowDropDownIcon onClick={() => {this.closeScoreLabelSection("professional")}} className="ScoreboardGuessSongLine-arrow--professional" />
                                </div>
                                {this.scoreSubTitiles()}
                                {this.state.scores.professional.map((scoreInfo, index) =>
                                    <div className={index % 2 != 0 ? "ScoreboardGuessSongLine-scoreInfoWrapper gray" : "ScoreboardGuessSongLine-scoreInfoWrapper"} key={index}>
                                        <div className="ScoreboardGuessSongLine-scoreInfo--rank">{scoreInfo.rank}</div>
                                        <div className="ScoreboardGuessSongLine-scoreInfo--name">{scoreInfo.name} </div>
                                        <div className="ScoreboardGuessSongLine-scoreInfo--score">{scoreInfo.score} </div>
                                        <div className="ScoreboardGuessSongLine-scoreInfo--duration">{scoreInfo.duration} </div>
                                        <div className="ScoreboardGuessSongLine-scoreInfo--averageScore">{scoreInfo.averageScore} </div>
                                    </div>
                                )}
                            </div>
                            <div className="ScoreboardGuessSongLine-scoreInfo--master">
                                <div className="ScoreboardGuessSongLine-scoreInfo--title">
                                    <div>master</div>
                                    <ArrowDropDownIcon onClick={() => {this.closeScoreLabelSection("master")}} className="ScoreboardGuessSongLine-arrow--master" />
                                </div>
                                {this.scoreSubTitiles()}
                                {this.state.scores.master.map((scoreInfo, index) =>
                                    <div className={index % 2 != 0 ? "ScoreboardGuessSongLine-scoreInfoWrapper gray" : "ScoreboardGuessSongLine-scoreInfoWrapper"} key={index}>
                                        <div className="ScoreboardGuessSongLine-scoreInfo--rank">{scoreInfo.rank}</div>
                                        <div className="ScoreboardGuessSongLine-scoreInfo--name">{scoreInfo.name} </div>
                                        <div className="ScoreboardGuessSongLine-scoreInfo--score">{scoreInfo.score} </div>
                                        <div className="ScoreboardGuessSongLine-scoreInfo--duration">{scoreInfo.duration} </div>
                                        <div className="ScoreboardGuessSongLine-scoreInfo--averageScore">{scoreInfo.averageScore} </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }else{
            return(
                <div className="Dots">
                    <div><CircularProgress /></div>
                </div>
            )
        }
    }
}

export default ScoreboardGuessSongLine;
