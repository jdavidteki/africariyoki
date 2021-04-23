import React, { Component } from 'react';
import ReactTypingEffect from 'react-typing-effect';
import { connect } from "react-redux";
import moment from "moment"
import LRCParser from '../lrcParser/LRCParser';
import Button from "@material-ui/core/Button";
import LRCFixer from '../lrcFixer/LRCFixer';
import Clouds from '../clouds/Clouds'
import Firebase from "../../firebase/firebase.js";

import AudioPlayer from 'react-h5-audio-player';
import { withRouter } from "react-router-dom";

import 'react-h5-audio-player/lib/styles.css';

import "./KaraokeDisplay.css";

class ConnectedKaraokeDisplay extends Component {
  state={
    showTimer: false,
    count:0,
    eventDate: moment.duration().add({days:0,hours:0,minutes:0,seconds:5}), // add 9 full days, 3 hours, 40 minutes and 50 seconds
    secs:0,
    pauseSong: false,
    lrcFixer: false,
    currentTime: ''
  }

  updateTimer=()=>{
    const x = setInterval(()=>{
      let { eventDate } = this.state

      if(eventDate <=0){
        let randomSongIndex = randomNumber(0, this.props.location.state.songs.length)

        this.props.history.push({
          pathname: "/africariyoki/karaokedisplay/" + this.props.location.state.songs[randomSongIndex].id,
          state: { chooseSong: [this.props.location.state.songs[randomSongIndex]], songs: this.props.location.state.songs}
        });
        window.location.reload(true);
        clearInterval(x)
      }else {
        eventDate = eventDate.subtract(1,"s")
        const secs = eventDate.seconds()

        this.setState({
          secs,
          eventDate,
          showTimer: true
        })
      }
    },1000)
  }

  playAnotherSong = () => {
    this.updateTimer()
  }

  componentDidMount(){
    setInterval( () => {
      this.setState({
        count: (this.state.count+1) % 2
      })
    }, 5000);

    Firebase.getLyricsById(this.props.match.params.id).then(
      val => {
        this.setState(
          {
            singer: val,
            animatedTexts: [
              val.title,
              val.singer,
              val.album,
            ],
          }
        )
      }
    )
  }

  displayLyrics(){
    let lyrics = this.state.singer.lyrics.replace("b\"", '')
    var newstr = "";
    var prevChar = '';

    for( var i = 0; i < lyrics.length; i++ ){
      if(lyrics[i] == "\\"){
        newstr += ' \n ';
        prevChar = 't'
      }else{
        if (prevChar == 't'){
          newstr += lyrics[i+1];
        }else{
          newstr += lyrics[i];
          prevChar = ''
        }
      }
    }
    return cleanLine(newstr)
  }

  lrcFormat(){
    let lyrics = this.state.singer.lyrics
    return lyrics.includes("[00")
  }

  toggleLrcFixer(){

    var tenure = prompt("Please enter master password", "");

    if (tenure != null && tenure == "1226") {
      if (this.state.lrcFixer) {
        this.setState({lrcFixer: false})
      }else{
        this.setState({lrcFixer: true})
      }
    }else{
      alert("sorry, invalid password")
    }
  }

  render() {
    if (this.props && this.state.singer) {
      return (
        <div className="KaraokeDisplay">
          <div className="KaraokeDisplay-cloudBackground">
            <Clouds/>
            <div className="KaraokeDisplay-stars"></div>
          </div>

          <div className="KaraokeDisplay-container">
            {!this.state.lrcFixer &&
              <AudioPlayer
                autoPlay
                src={this.state.singer.audiourl.includes('africariyoki-4b634') ? this.state.singer.audiourl : this.state.singer.audiourl.replace('africariyoki', 'africariyoki-4b634')} //because im cheap and im not paying for firebase
                autoPlay
                controlsList="nodownload"
                className={"KaraokeDisplay-audio"}
                onEnded={this.playAnotherSong}
                onPause={ () => {this.setState({pauseSong: true})}}
                onPlay = {() => {this.setState({pauseSong: false})}}
                onListen = {(event) => {this.setState({currentTime: event.target.currentTime})}}
                listenInterval = {1}
              />
            }

            {this.state.showTimer &&
              <div className="KaraokeDisplay-showTimer">
                <span>Playing next song in... {` ${this.state.secs}`} secs</span>
              </div>
            }

            <h2 className="KaraokeDisplay-titleArist">
              <span className="KaraokeDisplay-songTitle">
                {this.state.singer.title}
              </span>
              <span className="KaraokeDisplay-songArtist">
                {this.state.singer.singer}
              </span>
            </h2>

            {this.state.lrcFixer ?
                <div className="Lyrics Lyrics-LRCFixercontainer">
                  <LRCFixer
                    lyrics={this.displayLyrics()}
                    songId={this.state.singer.id}
                  />
                </div>
                :
                <div className="Lyrics Lyrics-DisplayContainer">
                  {this.lrcFormat() ?
                    <LRCParser
                      lyrics = {this.displayLyrics()}
                      pause = {this.state.pauseSong}
                      currentTime = {this.state.currentTime}
                    />
                      :
                    <span className="Lyrics-container">
                      {this.displayLyrics()}
                    </span>
                  }
                </div>
            }

            <div className="Lyrics-lowerSection">
              <ReactTypingEffect
                style={{ marginTop: 20, fontSize: 12, color: '#3F51B5' }}
                text={this.state.animatedTexts[this.state.count]}
                speed={150}
                eraseDelay={150}
                typingDelay={150}
              />
              <Button
                onClick={()=> this.toggleLrcFixer()}
              >
                toggle lyrics
              </Button>
            </div>
          </div>
        </div>
      )
    }
    return(
      <div></div>
    )
  }
}


function randomNumber(min, max){
  const r = Math.random()*(max-min) + min
  return Math.floor(r)
}

function cleanLine(string){
  return string.toLowerCase().replace("by rentanadvisercom", '***')
}

const mapStateToProps = state => {
  return {
    loggedInUser: state.loggedInUser,
  };
};

let KaraokeDisplay = withRouter(connect(mapStateToProps)(ConnectedKaraokeDisplay));
export default withRouter(KaraokeDisplay);