import React, { Component } from 'react';
import Lyrics from '../lyrics/Lyrics';
import "./KaraokeDisplay.css";

class KaraokeDisplay extends Component {
  state={
    singer: this.props.location.state.chooseSong[0]
  }

  componentDidUpdate(){

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
          <Lyrics lyricsurl={this.state.singer.lyricsurl} />
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
