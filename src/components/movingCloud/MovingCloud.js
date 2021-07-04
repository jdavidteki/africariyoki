import React, { Component } from 'react';
import TweenOne from 'rc-tween-one';


import './MovingCloud.css';

var player;

class MovingCloud extends Component {
  constructor(props){
    super(props);
    this.state= {
        //
    }
  }

  componentDidMount(){
  }

  render() {
    return (
        <TweenOne
            animation={
                [
                    { right: '-10px', duration: 2000 },
                    { right: '0', duration: 2000 }
                ]
            }
            paused={false}
            className="MovingCloud"
            style={{ margin: 'auto' }}
        >
            <div className="MovingCloud-wrapper">
                <span>we here</span>
            </div>
        </TweenOne>
    );
  }
}

export default MovingCloud;
