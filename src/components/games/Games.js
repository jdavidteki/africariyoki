
import React, { Component } from 'react';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';

import './Games.css';

class Games extends Component {
  constructor(props){
    super(props);

    this.state= {
        callerComponent: this.props.callerComponent,
    }
  }

    goToGame(game){
        this.props.history.push({
            pathname: `/${game}/`
        });
    }

    goToScoreboard(game){
        this.props.history.push({
            pathname: `/${game}/`
        });
    }

    render() {
        return (
            <div className={this.state.callerComponent ? "Games Games-Searcher" : "Games"}>
                <div className="Games-wrapper">
                    <div className="Games-guessTheSong">
                        <div onClick={()=>this.goToGame("guessthesong")} className="Games-gameTitle">
                            guess the song
                        </div>
                        {this.state.callerComponent !="Searcher" &&
                            <div onClick={()=>this.goToGame("guessthesong")}>
                            listen to snippets of song instrumentals and select correct song from list of options. click to play
                            </div>
                        }
                        <div className="Games-scoreboard" onClick={()=>this.goToScoreboard("scoreboardguesssong")}>
                           <AssessmentOutlinedIcon />
                        </div>
                    </div>

                    <div className="Games-guesssongline">
                        <div onClick={()=>this.goToGame("popularline")} className="Games-gameTitle">
                            guess song line
                        </div>
                        {this.state.callerComponent !="Searcher" &&
                            <div onClick={()=>this.goToGame("popularline")}>
                                choose the right song after reading familiar lines. click to play
                            </div>
                        }
                        <div className="Games-scoreboard" onClick={()=>this.goToScoreboard("scoreboardguesssongline")}>
                            <AssessmentOutlinedIcon />
                        </div>
                    </div>

                    <div className="Games-nextLine">
                        <div onClick={()=>this.goToGame("cls")} className="Games-gameTitle">
                            next line
                        </div>
                        {this.state.callerComponent !="Searcher" &&
                            <div onClick={()=>this.goToGame("cls")}>
                                select the next line of your favourite songs. click to play
                            </div>
                        }
                        <div className="Games-scoreboard" onClick={()=>this.goToScoreboard("scoreboardnextline")}>
                            <AssessmentOutlinedIcon />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Games;
