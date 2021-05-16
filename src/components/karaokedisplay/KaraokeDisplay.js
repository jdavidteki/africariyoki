import React, { Component } from 'react';
import ReactTypingEffect from 'react-typing-effect';
import { connect } from "react-redux";
import moment from "moment"
import LRCParser from '../lrcParser/LRCParser';
import Clouds from '../clouds/Clouds'
import Firebase from "../../firebase/firebase.js";
import NoSleep from 'nosleep.js';
import AudioPlayer from 'react-h5-audio-player';
import { withRouter } from "react-router-dom";
import PopularSongs from "../popularSongs/PopularSongs.js";
import { Emoji } from 'emoji-mart'

import 'react-h5-audio-player/lib/styles.css';
import "./KaraokeDisplay.css";

var noSleep = new NoSleep();
class ConnectedKaraokeDisplay extends Component {
  state={
    showTimer: false,
    count:0,
    eventDate: moment.duration().add({days:0,hours:0,minutes:0,seconds:5}), // add 9 full days, 3 hours, 40 minutes and 50 seconds
    secs:0,
    pauseSong: false,
    currentTime: '',
    popularSongs:[],
    motivator: 'less gerriiitt',
    smileyToSet: 'smiley',
    singer: {
      audiourl: '',
      singer: '',
      title: '',
      lyrics: '',
    },
    animatedTexts: [],
  }

  updateTimer=()=>{
    const x = setInterval(()=>{
      let { eventDate } = this.state

      if(eventDate <=0){
        this.props.history.push({
          pathname: "/africariyoki/karaokedisplay/" + this.state.popularSongs[0].id
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
    noSleep.enable();

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

    Firebase.getLyrics().then(
      val => {
        this.setState({popularSongs: val})
      }
    )

    setInterval(this.updateMotivator, 3000)
  }

  componentWillUnmount(){
    noSleep.disable();
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

  playSong(songId) {
    window.location.href = "/africariyoki/karaokedisplay/" + songId;
  }

  updateMotivator = () => {
    let randomNumber =  Math.floor(Math.random() * 10);
    let motivator = ''
    let smileyToSet = ''

    switch(randomNumber) {
      case 1:
        motivator = 'wonderful sturvs'
        smileyToSet = 'confetti_ball'
        break;
      case 2:
        motivator = 'ko bad naa'
        smileyToSet = 'hugging_face'
        break;
      case 3:
        motivator = 'you are singing in the nonsense'
        smileyToSet = 'zipper_mouth_face'
        break;
      case 4:
        motivator = 'ko shi lo ko shurup!!!'
        smileyToSet = 'joy'
        break;
      case 5:
        motivator = 'woowww i lof eeettt'
        smileyToSet = 'bikini'
        break;
      case 6:
        motivator = 'this one sabiiii'
        smileyToSet = '100'
        break;
      case 7:
        motivator = 'noiceeee'
        smileyToSet = 'dart'
        break;
      case 8:
        motivator = 'sing it for me bbyyyy'
        smileyToSet = 'microphone'
        break;
      case 9:
        motivator = 'omoooo!!!'
        smileyToSet = 'chart_with_upwards_trend'
        break;
      case 10:
        motivator = 'na desmond cos am lol'
        smileyToSet = 'weary'
        break;
      default:
        motivator = 'lmaoooooo'
        smileyToSet = 'woozy_face'
    }
    this.setState({motivator: motivator, smileyToSet: smileyToSet})
  }

  render() {
    if (this.state.singer.title != "") {
      return (
        <div className="KaraokeDisplay">
          <div className="KaraokeDisplay-cloudBackground">
            <Clouds/>
            <div className="KaraokeDisplay-twinkling"></div>
            <div className="KaraokeDisplay-stars"></div>
          </div>

          <div className="KaraokeDisplay-container">

            <div className="KaraokeDisplay-topContainer">
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

              <div className="Lyrics Lyrics-DisplayContainer">
                {this.lrcFormat() ?
                  <LRCParser
                    lyrics = {this.displayLyrics()}
                    pause = {this.state.pauseSong}
                    currentTime = {this.state.currentTime}
                    singer={this.state.singer.singer}
                    title={this.state.singer.title}
                  />
                    :
                  <span className="Lyrics-container Lyrics-nonParsedLyrics">
                    {this.displayLyrics()}
                  </span>
                }
              </div>

              <div className="KaraokeDisplay-motivator">
                { this.state.pauseSong ?
                  <div className="KaraokeDisplay-motivator-container">
                    <Emoji
                      emoji={'clock1230'}
                      set='apple'
                      size={18}
                    />
                    song paused
                    <Emoji
                      emoji={'clock1230'}
                      set='apple'
                      size={18}
                    />
                  </div>
                :
                  <div className="KaraokeDisplay-motivator-container">
                    <Emoji
                      emoji={this.state.smileyToSet ? this.state.smileyToSet : 'smiley'}
                      set='apple'
                      size={18}
                    />
                    {this.state.motivator}
                    <Emoji
                      emoji={this.state.smileyToSet ? this.state.smileyToSet : 'smiley'}
                      set='apple'
                      size={18}
                    />
                  </div>
                }
              </div>

            </div>
            <div className="KaraokeDisplay-bottomContainer">
              {
                this.state.popularSongs.length &&
                <PopularSongs
                  cards = {this.state.popularSongs.sort(( )=> Math.random() - 0.5).slice(0, 50)}
                  playSong = {this.playSong}
                  thisSongId = {this.props.match.params.id}
                />
              }

              <div className="Lyrics-lowerSection">
                <ReactTypingEffect
                  style={{ marginTop: 20, fontSize: 12, color: '#3F51B5' }}
                  text={this.state.animatedTexts[this.state.count]}
                  speed={150}
                  eraseDelay={150}
                  typingDelay={150}
                />
              </div>
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