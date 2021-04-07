import React, { Component } from 'react';
import Button from "@material-ui/core/Button";
import Firebase from "../../firebase/firebase.js";

import './LRCFixer.css';

var player;

class LRCFixer extends Component {
  constructor(props){
    super(props);
    this.state= {
        songId: props.songId,
        lyrics: props.lyrics,
        lyricsArrayClean: [],
        noTimeStamp: 0,
    }
  }

  handleChange = (event) => {
    this.setState({
        lyrics: event.target.value
    });
  }

  updateLyrics(){
    Firebase.updateLyrics(this.state.songId, this.state.lyrics)
  }

  componentDidMount(){
    loadScript(this.state.songId)

    let lyrics = this.state.lyrics
    let timeStampRegex = /\d\d:\d\d.\d\d/gm
    lyrics = lyrics.replace(timeStampRegex, '').replace(/[^\w\s]/gi, '')
    this.setState({lyrics: lyrics})

    let lyricsArray = lyrics.split("\n")
    let lyricsArrayClean = []
    for (var i = 0; i < lyricsArray.length; i++) {
      if (lyricsArray[i] != " "){
        lyricsArrayClean.push(lyricsArray[i].trim())
      }
    }

    this.setState({lyricsArrayClean: lyricsArrayClean})
  }

  timeStamp(){
    this.setState({noTimeStamp: this.state.noTimeStamp + 1},
    () => {
      let lyricsArrayClean = this.state.lyricsArrayClean
      let lyricLine = lyricsArrayClean[this.state.noTimeStamp-1]
      lyricLine = `[${formatTime( player.getCurrentTime())}]${lyricLine}`
      lyricsArrayClean[this.state.noTimeStamp-1] = lyricLine
      this.setState({lyricsArrayClean: lyricsArrayClean, lyrics: lyricsArrayClean.join(" \n")})
    })
  }

  render() {
    return (
      <div className="LRCFixer">
        <div id="video-placeholder" style={{width: "100%"}}></div>
        <Button
          onClick={()=> this.timeStamp()}
        >
          stamp!
        </Button>

        <textarea
          className="Lyrics-container"
          onChange={this.handleChange}
          value={this.state.lyrics}
        />
        <Button
          onClick={()=> this.updateLyrics()}
        >
          update lyrics
        </Button>
      </div>
    );
  }
}

function onYouTubeIframeAPIReady(songId){

  player = new YT.Player('video-placeholder', {
      width: 600,
      height: 400,
      videoId: songId,
      playerVars: {
          color: 'white',
      },
  });
}

function formatTime(time){
  time = Math.round(time);

  var minutes = Math.floor(time / 60),
  seconds = time - minutes * 60;

  seconds = seconds < 10 ? '0' + seconds : seconds;

  return "0" + minutes + ":" + seconds + ".00";
}

function loadScript(songId){
  if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') {
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  setTimeout(() => {   onYouTubeIframeAPIReady(songId) }, 1000);

}

export default LRCFixer;
