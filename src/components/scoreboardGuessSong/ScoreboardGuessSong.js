
import React, { Component } from 'react';
import CircularProgress from "@material-ui/core/CircularProgress";
import Firebase from "../../firebase/firebase.js";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import './ScoreboardGuessSong.css';

class ScoreboardGuessSong extends Component {
    constructor(props){
        super(props);

        this.state= {
            cards: this.props.cards,
            scores: {},
        }
    }

    componentDidMount(){
        Firebase.getScoreBoardGuessSong()
        .then(scoreboardGuessSong => {
            this.setState({
                scores: scoreboardGuessSong,
            })
        })
    }

    scoreSubTitiles(){
        return(
            <div className="ScoreboardGuessSong-scoreInfo--subTitle">
                <div>rank</div>
                <div>name</div>
                <div>score</div>
                <div>min</div>
                <div>avg</div>
            </div>
        )
    }

    closeScoreLabelSection = (label) => {
        let labelClassName = `ScoreboardGuessSong-scoreInfo--${label}`
        let arrowClassName = `ScoreboardGuessSong-arrow--${label}`
        document.getElementsByClassName(labelClassName)[0].classList.toggle('open')
        document.getElementsByClassName(arrowClassName)[0].classList.toggle('open')
    }

    render() {
        if(Object.keys(this.state.scores).length > 0){
            return (
                <div className="ScoreboardGuessSong">
                    <div className="ScoreboardGuessSong-wrapper">
                        <div className="ScoreboardGuessSong-guessTheSong">
                            <div className="ScoreboardGuessSong-title">
                                guess the song top 10
                            </div>
                            <div className="ScoreboardGuessSong-scoreInfo--beginner">
                                <div className="ScoreboardGuessSong-scoreInfo--title">
                                    <div>beginner</div>
                                    <ArrowDropDownIcon onClick={() => {this.closeScoreLabelSection("beginner")}} className="ScoreboardGuessSong-arrow--beginner" />
                                </div>
                                {this.scoreSubTitiles()}
                                {this.state.scores.beginner.map((scoreInfo, index) =>
                                    <div className={index % 2 != 0 ? "ScoreboardGuessSong-scoreInfoWrapper gray" : "ScoreboardGuessSong-scoreInfoWrapper"} key={index}>
                                        <div className="ScoreboardGuessSong-scoreInfo--rank">{scoreInfo.rank}</div>
                                        <div className="ScoreboardGuessSong-scoreInfo--name">{scoreInfo.name} </div>
                                        <div className="ScoreboardGuessSong-scoreInfo--score">{scoreInfo.score} </div>
                                        <div className="ScoreboardGuessSong-scoreInfo--duration">{scoreInfo.duration} </div>
                                        <div className="ScoreboardGuessSong-scoreInfo--averageScore">{scoreInfo.averageScore} </div>
                                    </div>
                                )}
                            </div>
                            <div className="ScoreboardGuessSong-scoreInfo--amateur">
                                <div className="ScoreboardGuessSong-scoreInfo--title">
                                    <div>amateur</div>
                                    <ArrowDropDownIcon onClick={() => {this.closeScoreLabelSection("amateur")}} className="ScoreboardGuessSong-arrow--amateur" />
                                </div>
                                {this.scoreSubTitiles()}
                                {this.state.scores.amateur.map((scoreInfo, index) =>
                                    <div className={index % 2 != 0 ? "ScoreboardGuessSong-scoreInfoWrapper gray" : "ScoreboardGuessSong-scoreInfoWrapper"} key={index}>
                                        <div className="ScoreboardGuessSong-scoreInfo--rank">{scoreInfo.rank}</div>
                                        <div className="ScoreboardGuessSong-scoreInfo--name">{scoreInfo.name} </div>
                                        <div className="ScoreboardGuessSong-scoreInfo--score">{scoreInfo.score} </div>
                                        <div className="ScoreboardGuessSong-scoreInfo--duration">{scoreInfo.duration} </div>
                                        <div className="ScoreboardGuessSong-scoreInfo--averageScore">{scoreInfo.averageScore} </div>
                                    </div>
                                )}
                            </div>
                            <div className="ScoreboardGuessSong-scoreInfo--professional">
                                <div className="ScoreboardGuessSong-scoreInfo--title">
                                    <div>professional</div>
                                    <ArrowDropDownIcon onClick={() => {this.closeScoreLabelSection("professional")}} className="ScoreboardGuessSong-arrow--professional" />
                                </div>
                                {this.scoreSubTitiles()}
                                {this.state.scores.professional.map((scoreInfo, index) =>
                                    <div className={index % 2 != 0 ? "ScoreboardGuessSong-scoreInfoWrapper gray" : "ScoreboardGuessSong-scoreInfoWrapper"} key={index}>
                                        <div className="ScoreboardGuessSong-scoreInfo--rank">{scoreInfo.rank}</div>
                                        <div className="ScoreboardGuessSong-scoreInfo--name">{scoreInfo.name} </div>
                                        <div className="ScoreboardGuessSong-scoreInfo--score">{scoreInfo.score} </div>
                                        <div className="ScoreboardGuessSong-scoreInfo--duration">{scoreInfo.duration} </div>
                                        <div className="ScoreboardGuessSong-scoreInfo--averageScore">{scoreInfo.averageScore} </div>
                                    </div>
                                )}
                            </div>
                            <div className="ScoreboardGuessSong-scoreInfo--master">
                                <div className="ScoreboardGuessSong-scoreInfo--title">
                                    <div>master</div>
                                    <ArrowDropDownIcon onClick={() => {this.closeScoreLabelSection("master")}} className="ScoreboardGuessSong-arrow--master" />
                                </div>
                                {this.scoreSubTitiles()}
                                {this.state.scores.master.map((scoreInfo, index) =>
                                    <div className={index % 2 != 0 ? "ScoreboardGuessSong-scoreInfoWrapper gray" : "ScoreboardGuessSong-scoreInfoWrapper"} key={index}>
                                        <div className="ScoreboardGuessSong-scoreInfo--rank">{scoreInfo.rank}</div>
                                        <div className="ScoreboardGuessSong-scoreInfo--name">{scoreInfo.name} </div>
                                        <div className="ScoreboardGuessSong-scoreInfo--score">{scoreInfo.score} </div>
                                        <div className="ScoreboardGuessSong-scoreInfo--duration">{scoreInfo.duration} </div>
                                        <div className="ScoreboardGuessSong-scoreInfo--averageScore">{scoreInfo.averageScore} </div>
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

export default ScoreboardGuessSong;
