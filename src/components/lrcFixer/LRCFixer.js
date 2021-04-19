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
    }, ()=>{
      this.prepareLyricsForFixing()
    });
  }

  updateLyrics(){
    var userPreference;

    if (confirm("are you sure?") == true) {
        userPreference = "saving lrc to firebase...";
        Firebase.updateLyrics(this.state.songId, this.state.lyrics)
    } else {
        userPreference = "save cancelled!";
    }
  }

  prepareLyricsForFixing = () => {
    let lyrics = this.state.lyrics
    let timeStampRegex = /\d\d:\d\d.\d\d/gm
    lyrics = lyrics.replace(timeStampRegex, '').replace(/[^\w\s]/gi, '')
    this.setState({lyrics: lyrics},
      () =>{
        let lyricsArray = lyrics.split("\n")
        let lyricsArrayClean = []
        for (var i = 0; i < lyricsArray.length; i++) {
          if (lyricsArray[i] != " "){
            lyricsArrayClean.push(lyricsArray[i].trim())
          }
        }
        this.setState({lyricsArrayClean: lyricsArrayClean})
      })
  }

  componentDidMount(){
    loadScript(this.state.songId)
    this.prepareLyricsForFixing()
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
        <textarea
          className="Lyrics-container"
          onChange={this.handleChange}
          value={this.state.lyrics}
        />
        <div>
          <Button
            onClick={()=> this.timeStamp()}
          >
            time stamp!
          </Button>

          <Button
            onClick={()=> this.updateLyrics()}
          >
            update lyrics
          </Button>
        </div>
      </div>
    );
  }
}

function onYouTubeIframeAPIReady(songId){

  player = new YT.Player('video-placeholder', {
      width: 600,
      height: 100,
      videoId: songId,
      playerVars: {
          color: 'white',
      },
  });
}

function formatTime(time){
  time = time*1000

  var milliseconds = Math.floor((time % 1000) / 10),
  seconds = Math.floor((time / 1000) % 60),
  minutes = Math.floor((time / (1000 * 60)) % 60),
  hours = Math.floor((time / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;
  milliseconds = (milliseconds < 10) ? "0" + milliseconds : milliseconds;

  return minutes + ":" + seconds + "." + milliseconds;
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
