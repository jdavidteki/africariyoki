
import React, { Component } from 'react';
import CircularProgress from "@material-ui/core/CircularProgress";
import Firebase from "../../firebase/firebase.js";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Analytics, PageHit } from 'expo-analytics';

import './ScoreboardNextLine.css';
class ScoreboardNextLine extends Component {
    constructor(props){
        super(props);

        this.state= {
            cards: this.props.cards,
            scores: {},
        }
    }

    componentDidMount(){
        const analytics = new Analytics('UA-187038287-1');
        analytics.hit(new PageHit('Scoreboard Next Line'))
            .then(() => console.log("google analytics on game"))
            .catch(e => console.log(e.message));

        Firebase.getScoreBoardNextLine()
        .then(scoreboardNextLine => {
            this.setState({
                scores: scoreboardNextLine,
            })
        })
    }

    scoreSubTitiles(){
        return(
            <div className="ScoreboardNextLine-scoreInfo--subTitle">
                <div>rank</div>
                <div>name</div>
                <div>score</div>
                <div>min</div>
                <div>avg</div>
            </div>
        )
    }

    closeScoreLabelSection = (label) => {
        let labelClassName = `ScoreboardNextLine-scoreInfo--${label}`
        let arrowClassName = `ScoreboardNextLine-arrow--${label}`
        document.getElementsByClassName(labelClassName)[0].classList.toggle('open')
        document.getElementsByClassName(arrowClassName)[0].classList.toggle('open')
    }

    render() {
        if(Object.keys(this.state.scores).length > 0){
            return (
                <div className="ScoreboardNextLine">
                    <div className="ScoreboardNextLine-wrapper">
                        <div className="ScoreboardNextLine-guessTheSong">
                            <div className="ScoreboardNextLine-title">
                                next line top 10
                            </div>
                            <div className="ScoreboardNextLine-scoreInfo--beginner">
                                <div className="ScoreboardNextLine-scoreInfo--title">
                                    <div>beginner</div>
                                    <ArrowDropDownIcon onClick={() => {this.closeScoreLabelSection("beginner")}} className="ScoreboardNextLine-arrow--beginner" />
                                </div>
                                {this.scoreSubTitiles()}
                                {this.state.scores.beginner.map((scoreInfo, index) =>
                                    <div className={index % 2 != 0 ? "ScoreboardNextLine-scoreInfoWrapper gray" : "ScoreboardNextLine-scoreInfoWrapper"} key={index}>
                                        <div className="ScoreboardNextLine-scoreInfo--rank">{scoreInfo.rank}</div>
                                        <div className="ScoreboardNextLine-scoreInfo--name">{scoreInfo.name} </div>
                                        <div className="ScoreboardNextLine-scoreInfo--score">{scoreInfo.score} </div>
                                        <div className="ScoreboardNextLine-scoreInfo--duration">{scoreInfo.duration} </div>
                                        <div className="ScoreboardNextLine-scoreInfo--averageScore">{scoreInfo.averageScore} </div>
                                    </div>
                                )}
                            </div>
                            <div className="ScoreboardNextLine-scoreInfo--amateur">
                                <div className="ScoreboardNextLine-scoreInfo--title">
                                    <div>amateur</div>
                                    <ArrowDropDownIcon onClick={() => {this.closeScoreLabelSection("amateur")}} className="ScoreboardNextLine-arrow--amateur" />
                                </div>
                                {this.scoreSubTitiles()}
                                {this.state.scores.amateur.map((scoreInfo, index) =>
                                    <div className={index % 2 != 0 ? "ScoreboardNextLine-scoreInfoWrapper gray" : "ScoreboardNextLine-scoreInfoWrapper"} key={scoreInfo.rank}>
                                        <div className="ScoreboardNextLine-scoreInfo--rank">{scoreInfo.rank}</div>
                                        <div className="ScoreboardNextLine-scoreInfo--name">{scoreInfo.name} </div>
                                        <div className="ScoreboardNextLine-scoreInfo--score">{scoreInfo.score} </div>
                                        <div className="ScoreboardNextLine-scoreInfo--duration">{scoreInfo.duration} </div>
                                        <div className="ScoreboardNextLine-scoreInfo--averageScore">{scoreInfo.averageScore} </div>
                                    </div>
                                )}
                            </div>
                            <div className="ScoreboardNextLine-scoreInfo--professional">
                                <div className="ScoreboardNextLine-scoreInfo--title">
                                    <div>professional</div>
                                    <ArrowDropDownIcon onClick={() => {this.closeScoreLabelSection("professional")}} className="ScoreboardNextLine-arrow--professional" />
                                </div>
                                {this.scoreSubTitiles()}
                                {this.state.scores.professional.map((scoreInfo, index) =>
                                    <div className={index % 2 != 0 ? "ScoreboardNextLine-scoreInfoWrapper gray" : "ScoreboardNextLine-scoreInfoWrapper"} key={scoreInfo.rank}>
                                        <div className="ScoreboardNextLine-scoreInfo--rank">{scoreInfo.rank}</div>
                                        <div className="ScoreboardNextLine-scoreInfo--name">{scoreInfo.name} </div>
                                        <div className="ScoreboardNextLine-scoreInfo--score">{scoreInfo.score} </div>
                                        <div className="ScoreboardNextLine-scoreInfo--duration">{scoreInfo.duration} </div>
                                        <div className="ScoreboardNextLine-scoreInfo--averageScore">{scoreInfo.averageScore} </div>
                                    </div>
                                )}
                            </div>
                            <div className="ScoreboardNextLine-scoreInfo--master">
                                <div className="ScoreboardNextLine-scoreInfo--title">
                                    <div>master</div>
                                    <ArrowDropDownIcon onClick={() => {this.closeScoreLabelSection("master")}} className="ScoreboardNextLine-arrow--master" />
                                </div>
                                {this.scoreSubTitiles()}
                                {this.state.scores.master.map((scoreInfo, index) =>
                                    <div className={index % 2 != 0 ? "ScoreboardNextLine-scoreInfoWrapper gray" : "ScoreboardNextLine-scoreInfoWrapper"} key={scoreInfo.rank}>
                                        <div className="ScoreboardNextLine-scoreInfo--rank">{scoreInfo.rank}</div>
                                        <div className="ScoreboardNextLine-scoreInfo--name">{scoreInfo.name} </div>
                                        <div className="ScoreboardNextLine-scoreInfo--score">{scoreInfo.score} </div>
                                        <div className="ScoreboardNextLine-scoreInfo--duration">{scoreInfo.duration} </div>
                                        <div className="ScoreboardNextLine-scoreInfo--averageScore">{scoreInfo.averageScore} </div>
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

export default ScoreboardNextLine;
