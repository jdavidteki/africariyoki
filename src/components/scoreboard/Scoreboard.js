
import React, { Component } from 'react';
import { bounce } from 'react-animations'
import Radium, {StyleRoot} from 'radium';

import './Scoreboard.css';

const styles = {
    bounce: {
      animation: 'x 10s',
      animationName: Radium.keyframes(bounce, 'bounce')
    }
  }

class Scoreboard extends Component {
    constructor(props){
        super(props);

        this.state= {
            cards: this.props.cards,
            scores: {
                "beginner":
                [
                    {
                        "name": "anonimo",
                        "score": 40,
                        "duration": 2,
                        "averageScore": 20,
                        "sessionRoom": "nairobi",
                    },
                    {
                        "name": "anonimo",
                        "score": 30,
                        "duration": 2,
                        "averageScore": 15,
                        "sessionRoom": "nairobi",
                    },
                    {
                        "name": "anonimo",
                        "score": 50,
                        "duration": 2,
                        "averageScore": 25,
                        "sessionRoom": "nairobi",
                    },
                    {
                        "name": "anonimo",
                        "score": 20,
                        "duration": 2,
                        "averageScore": 10,
                        "sessionRoom": "nairobi",
                    }
                ],
                "amateur":
                [
                    {
                        "name": "anonimo",
                        "score": 40,
                        "duration": 2,
                        "averageScore": 20,
                    },
                    {
                        "name": "anonimo",
                        "score": 30,
                        "duration": 2,
                        "averageScore": 15,
                    },
                    {
                        "name": "anonimo",
                        "score": 50,
                        "duration": 2,
                        "averageScore": 25,
                    },
                    {
                        "name": "anonimo",
                        "score": 20,
                        "duration": 2,
                        "averageScore": 10,
                    }
                ],
                "professional":
                [
                    {
                        "name": "anonimo",
                        "score": 40,
                        "duration": 2,
                        "averageScore": 20,
                    },
                    {
                        "name": "anonimo",
                        "score": 30,
                        "duration": 2,
                        "averageScore": 15,
                    },
                    {
                        "name": "anonimo",
                        "score": 50,
                        "duration": 2,
                        "averageScore": 25,
                    },
                    {
                        "name": "anonimo",
                        "score": 20,
                        "duration": 2,
                        "averageScore": 10,
                    }
                ],
                "master":
                [
                    {
                        "name": "anonimo",
                        "score": 40,
                        "duration": 2,
                        "averageScore": 20,
                    },
                    {
                        "name": "anonimo",
                        "score": 30,
                        "duration": 2,
                        "averageScore": 15,
                    },
                    {
                        "name": "anonimo",
                        "score": 50,
                        "duration": 2,
                        "averageScore": 25,
                    },
                    {
                        "name": "anonimo",
                        "score": 20,
                        "duration": 2,
                        "averageScore": 10,
                    }
                ]
            }
        }
    }

    componentDidMount(){
    }


    render() {
        return (
            <StyleRoot className="Scoreboard">
                <div className="Scoreboard-wrapper">

                </div>
            </StyleRoot>
        );
    }
}

export default Scoreboard;
