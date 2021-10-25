
import React, { Component } from 'react';
import { bounce } from 'react-animations'
import Radium, {StyleRoot} from 'radium';

import './Games.css';

const styles = {
    bounce: {
      animation: 'x 10s',
      animationName: Radium.keyframes(bounce, 'bounce')
    }
  }

class Games extends Component {
  constructor(props){
    super(props);

    this.state= {
        cards: this.props.cards,
        thisSongId: this.props.thisSongId
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
            <StyleRoot className="Games">
                <div className="Games-wrapper">
                    <div className="Games-guessTheSong" style={styles.bounce}>
                        <div onClick={()=>this.goToGame("guessthesong")} className="Games-gameTitle">
                            guess the song
                        </div>
                        <div onClick={()=>this.goToGame("guessthesong")}>
                            listen to snippets of song instrumentals and select correct song from list of options. click to play
                        </div>
                        <div className="Games-scoreboard" onClick={()=>this.goToScoreboard("scoreboardguesssong")}>
                           scores
                        </div>
                    </div>

                    <div className="Games-nextLine" style={styles.bounce}>
                        <div onClick={()=>this.goToGame("cls")} className="Games-gameTitle">
                            next line
                        </div>
                        <div onClick={()=>this.goToGame("cls")}>
                            select the next line of your favourite songs. click to play
                        </div>
                        <div className="Games-scoreboard" onClick={()=>this.goToScoreboard("scoreboardnextline")}>
                           scores
                        </div>
                    </div>
                </div>
            </StyleRoot>
        );
    }
}

export default Games;
