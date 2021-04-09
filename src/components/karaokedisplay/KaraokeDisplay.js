import React, { Component } from 'react';
import "./KaraokeDisplay.css";
import ReactTypingEffect from 'react-typing-effect';
import ReactAudioPlayer from 'react-audio-player';
import moment from "moment"
import LRCParser from '../lrcParser/LRCParser';
import Button from "@material-ui/core/Button";
import LRCFixer from '../lrcFixer/LRCFixer';
import Clouds from '../clouds/Clouds'

class KaraokeDisplay extends Component {
  state={
    singer: this.props.location.state.chooseSong[0],
    animatedTexts: [
      this.props.location.state.chooseSong[0].title,
      this.props.location.state.chooseSong[0].singer,
      this.props.location.state.chooseSong[0].album,
    ],
    showTimer: false,
    count:0,
    eventDate: moment.duration().add({days:0,hours:0,minutes:0,seconds:5}), // add 9 full days, 3 hours, 40 minutes and 50 seconds
    secs:0,
    pauseSong: false,
    lrcFixer: false,
  }

  updateTimer=()=>{
    const x = setInterval(()=>{
      let { eventDate} = this.state

      if(eventDate <=0){
        let randomSongIndex = randomNumber(0, this.props.location.state.songs.length)
        this.setState({
          singer: this.props.location.state.songs[randomSongIndex],
          animatedTexts: [
            this.props.location.state.songs[randomSongIndex].title,
            this.props.location.state.songs[randomSongIndex].singer,
            this.props.location.state.songs[randomSongIndex].album,
          ],
          count:0,
          eventDate: moment.duration().add({days:0,hours:0,minutes:0,seconds:5}), // add 9 full days, 3 hours, 40 minutes and 50 seconds
          secs:0,
          showTimer: false
        }, ()=>{
          window.history.pushState({}, 'update', `${this.state.singer.id}`);
        })
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

  async componentDidMount(){
    setInterval( () => {
      this.setState({
        count: (this.state.count+1) % 2
      })
    }, 5000);
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
    if (this.props) {
      return (
        <div className="KaraokeDisplay-container">
          {!this.state.lrcFixer &&
            <ReactAudioPlayer
              src={this.state.singer.audiourl.includes('africariyoki-4b634') ? this.state.singer.audiourl : this.state.singer.audiourl.replace('africariyoki', 'africariyoki-4b634')} //because im cheap and im not paying for firebase
              autoPlay
              controls
              controlsList="nodownload"
              className={"KaraokeDisplay-audio"}
              onEnded={this.playAnotherSong}
              onPause={ () => {this.setState({pauseSong: true})}}
              onPlay = {() => {this.setState({pauseSong: false})}}
            />
          }

          {this.state.showTimer &&
            <div className="KaraokeDisplay-showTimer">
              <span>Playing next song in... {` ${this.state.secs}`} secs</span>
            </div>
          }

          <h2 style={{ marginTop: 20, fontSize: 24, color: '#3F51B5', fontFamily: 'fantasy'}}>
            {this.state.singer.title} by {this.state.singer.singer}
          </h2>

          <div className="KaraokeDisplay-cloudBackground">

            <Clouds/>

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
                  />
                    :
                  <span className="Lyrics-container">
                    {this.displayLyrics()}
                  </span>
                }
              </div>
            }

          </div>

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
              toggle lyrics display
            </Button>
          </div>

        </div>
      )
    }
  }
}

export default KaraokeDisplay;

function randomNumber(min, max){
  const r = Math.random()*(max-min) + min
  return Math.floor(r)
}

function cleanLine(string){
  return string.toLowerCase().replace("by rentanadvisercom", '***')
}