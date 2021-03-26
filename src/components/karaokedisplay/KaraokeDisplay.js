import React, { Component } from 'react';
import "./KaraokeDisplay.css";
import ReactTypingEffect from 'react-typing-effect';
import ReactAudioPlayer from 'react-audio-player';
import moment from "moment"
import LRCParser from '../lrcParser/LRCParser';
import Button from "@material-ui/core/Button";
import LRCFixer from '../lrcFixer/LRCFixer';

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

    return newstr
  }

  lrcFormat(){
    let lyrics = this.state.singer.lyrics
    return lyrics.includes("[00")
  }

  toggleLrcFixer(){
    if (this.state.lrcFixer) {
      this.setState({lrcFixer: false})
    }else{
      this.setState({lrcFixer: true})
    }
  }

  render() {
    if (this.props) {
      return (
        <div className="KaraokeDisplay-container">
          <ReactAudioPlayer
            src={this.state.singer.audiourl.includes('africariyoki-4b634') ? this.state.singer.audiourl : this.state.singer.audiourl.replace('africariyoki', 'africariyoki-4b634')} //because im cheap and im not paying for firebase
            autoPlay
            controls
            className={"KaraokeDisplay-audio"}
            onEnded={this.playAnotherSong}
            onPause={ () => {this.setState({pauseSong: true})}}
            onPlay = {() => {this.setState({pauseSong: false})}}
          />

          {this.state.showTimer &&
            <div className="KaraokeDisplay-showTimer">
              <span>Playing next song in... {` ${this.state.secs}`} secs</span>
            </div>
          }

          <h2>{this.state.singer.title} by {this.state.singer.singer}</h2>
          <Button
            onClick={()=> this.toggleLrcFixer()}
          >
            toggle lyrics display
          </Button>

          {this.state.lrcFixer ?
            <div className="Lyrics">
              <LRCFixer
                lyrics={this.displayLyrics()}
                songId={this.state.singer.id}
              />
            </div>
            :
            <pre className="Lyrics">
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
            </pre>
          }
          <ReactTypingEffect
            style={{ marginTop: 20, fontSize: 24, color: '#3F51B5' }}
            text={this.state.animatedTexts[this.state.count]}
            speed={150}
            eraseDelay={150}
            typingDelay={150}
          />
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