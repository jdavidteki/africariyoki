import React, { Component } from 'react';
import Lyrics from '../lyrics/Lyrics';
import "./KaraokeDisplay.css";
import ReactTypingEffect from 'react-typing-effect';

class KaraokeDisplay extends Component {
  state={
    singer: this.props.location.state.chooseSong[0],
    animatedTexts: [
      this.props.location.state.chooseSong[0].title,
      this.props.location.state.chooseSong[0].singer,
      this.props.location.state.chooseSong[0].album,
    ],
    count:0,
  }

  async componentDidMount(){
    setInterval( () => {
      this.setState({
        count: (this.state.count+1) % 2
      })
    }, 5000);
  }

  render() {
    window.onload = function(e){
      var myAudio = document.getElementById('audioPlay');
      console.log("myAudio", myAudio.duration)
      if (myAudio && myAudio.duration > 0 && myAudio.paused) {
        alert("music paused")
      }
    }

    if (this.props) {
      return (
        <div className="KaraokeDisplay-container">
          <audio id="audioPlay" className="KaraokeDisplay-audio" controls autoPlay>
            <source src={this.state.singer.audiourl} type="audio/mpeg"></source>
            Your browser does not support the audio element.
          </audio>
          <h2>{this.state.singer.title} by {this.state.singer.singer}</h2>
          <Lyrics lyrics={this.state.singer.lyrics} />
          <ReactTypingEffect
            style={{ marginTop: 50, fontSize: 24, color: '#3F51B5' }}
            text={this.state.animatedTexts[this.state.count]}
            speed={150}
            eraseDelay={150}
            typingDelay={150}
          />
        </div>
      )
    } else {
      return (
        <div className="KaraokeDisplay-display">
          <h2>Song Title</h2>
          <Lyrics lyrics="example song lyrics"/>
        </div>
      )
    }
  }
}

export default KaraokeDisplay;
