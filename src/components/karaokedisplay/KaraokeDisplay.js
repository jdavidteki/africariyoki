import React, { Component } from 'react';
import ReactTypingEffect from 'react-typing-effect';
import { connect } from "react-redux";
import moment from "moment"
import LRCParser from '../lrcParser/LRCParser';
import SearchIcon from '@material-ui/icons/Search';
import Clouds from '../clouds/Clouds'
import Firebase from "../../firebase/firebase.js";
import NoSleep from 'nosleep.js';
import AudioPlayer from 'react-h5-audio-player';
import { withRouter } from "react-router-dom";
import PopularSongs from "../popularSongs/PopularSongs.js";
import MetaTags from 'react-meta-tags';
import { Emoji } from 'emoji-mart'
import codeToCountries from "../searcher/codeToCountry.js";
import Searcher from "../searcher/Searcher";
import CloseIcon from '@material-ui/icons/Close';
import AlbumIcon from '@material-ui/icons/Album';
import { SocialIcon } from 'react-social-icons';
import Sbta from '../sbta/Sbta.js'
import { Analytics, PageHit } from 'expo-analytics';
import CircularProgress from "@material-ui/core/CircularProgress";

import 'react-h5-audio-player/lib/styles.css';
import "./KaraokeDisplay.css";

var noSleep = new NoSleep();
class ConnectedKaraokeDisplay extends Component {
  constructor(props){
    super(props);

    this.state={
      showTimer: false,
      count:0,
      eventDate: moment.duration().add({days:0,hours:0,minutes:0,seconds:5}), // add 9 full days, 3 hours, 40 minutes and 50 seconds
      secs:0,
      pauseSong: false,
      currentTime: '',
      popularSongs:[],
      nextSongOptions: ['1qgiNdSGx-c'],
      motivator: 'less gerriiitt',
      openSearcherModel: false,
      smileyToSet: 'smiley',
      singer: {
        audiourl: '',
        singer: '',
        title: '',
        lyrics: '',
      },
      animatedTexts: [],
      annotationObj: {},
    };
  }

  player = null

  updateTimer=()=>{
    const x = setInterval(()=>{
      let { eventDate } = this.state

      if(eventDate <=0){
        this.props.history.push({
          pathname: "/karaokedisplay/" + this.state.nextSongOptions.sort(( )=> Math.random() - 0.5).slice(0, 20)[0].id
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
    const analytics = new Analytics('UA-187038287-1');
    analytics.hit(new PageHit('KaraokeDisplay'))
      .then(() => console.log("karaokeDisplay analytics setup"))
      .catch(e => console.log(e.message));

    noSleep.enable();

    setInterval( () => {
      this.setState({
        count: (this.state.count+1) % 2
      })
    }, 5000);

    Firebase.getLyricsById(this.props.match.params.id).then(
      val => {
        Firebase.updateNumPlays(this.props.match.params.id, val.numPlays +=1)

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
        this.setState({
          popularSongs: val,
          nextSongOptions: val.filter(v => v.turnedOn == 1),
          highestNumPlays: this.getHighestNumberOfPlays(val)
        })
      }
    )
    setInterval(this.updateMotivator, 3000)

    //fetch annotation from firebase
    Firebase.getAnnotationBySongId(this.props.match.params.id).then(
      val => {
        if (val.content != undefined){
          const obj = JSON.parse(val.content.replaceAll("'", ""));
          this.setState({annotationObj: obj})
        }
      }
    )

  }

  getHighestNumberOfPlays(val){
    return Math.max.apply(Math, val.map(function(o) { return o.numPlays; }))
  }

  getColorFromNumPlays(numPlays){
    let highestNumPlays = this.state.highestNumPlays
    let playRatio = (numPlays/highestNumPlays)

    if (playRatio < 0.2) {
      return '#f1a892'
    }else if(playRatio > 0.2 && playRatio < 0.4){
      return '#f0c49b'
    }else if(playRatio > 0.4 && playRatio < 0.6){
      return '#e6da77'
    }else if(playRatio > 0.6 && playRatio < 0.8){
      return '#ccee6e'
    }else if(playRatio > 0.8 && playRatio < 0.9){
      return '#065818'
    }
    return '#0640bd'
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
    window.location.href = "/karaokedisplay/" + songId;
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
          <MetaTags>
            <title>{this.state.singer.title} - {this.state.singer.singer} ::: africariyoki</title>
            <meta name="description" content={`sing with us, sing along to your favourite african songs! -- ${this.state.singer.title}, ${this.state.singer.singer}, ${this.state.singer.countries}`} />
            <meta property="og:title" content="africariyoki" />
            <meta http-equiv='cache-control' content='no-cache' />
            <meta http-equiv='expires' content='0' />
            <meta http-equiv='pragma' content='no-cache' />
          </MetaTags>
          {this.state.openSearcherModel &&
            <div className="KaraokeDisplay-openSearcherModel">
              <CloseIcon
                fontSize={'large'}
                className={"KaraokeDisplay-openSearcherModel-close"}
                style={{ color: '#f7f8e4' }}
                onClick={()=>{this.setState({openSearcherModel: false})}}
              />
              <Searcher />
            </div>
          }
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
                controlsList="nodownload"
                className={"KaraokeDisplay-audio"}
                onEnded={this.playAnotherSong}
                onPause={ () => {this.setState({pauseSong: true})}}
                onPlay = {() => {this.setState({pauseSong: false})}}
                onListen = {(event) => {this.setState({currentTime: event.target.currentTime})}}
                listenInterval = {1}
                ref={ref => this.player = ref}
              />

              {this.state.showTimer &&
                <div className="KaraokeDisplay-showTimer">
                  <span>i'm playing something you will like in... {` ${this.state.secs}`} secs</span>
                </div>
              }

              <h1 className="KaraokeDisplay-titleArist">
                <span className="KaraokeDisplay-songTitle">
                  {this.state.singer.title}
                </span>
                <span className="KaraokeDisplay-songArtist">
                  {this.state.singer.singer}
                </span>
              </h1>

              <div className="Lyrics Lyrics-DisplayContainer">
                {this.lrcFormat() ?
                  <LRCParser
                    lyrics = {this.displayLyrics()}
                    pause = {this.state.pauseSong}
                    pauseThisSong = {() => this.player.audio.current.pause()}
                    playThisSong = {() => this.player.audio.current.play()}
                    currentTime = {this.state.currentTime}
                    singer={this.state.singer.singer}
                    title={this.state.singer.title}
                    smileyToSet={this.state.smileyToSet}
                    annotationObj={this.state.annotationObj}
                  />
                    :
                  <span className="Lyrics-container Lyrics-nonParsedLyrics">
                    {this.displayLyrics()}
                  </span>
                }
              </div>

              <div className="KaraokeDisplay-lowerPane">
                <div className="KaraokeDisplay-countryFlags">
                  {this.state.singer.countries.split(",").map((country) =>
                    <Emoji
                      key={country}
                      emoji={"flag-" + getCodeFromCountryName(country.trim()).toLowerCase()}
                      size={18}
                    />
                  )}
                </div>
                <AlbumIcon className={"KaraokeDisplay-lowerPaneIcon"} style={{ color: this.getColorFromNumPlays(this.state.singer.numPlays) }} />
                <SocialIcon bgColor={"#3413f1"} fgColor={"white"} className={"KaraokeDisplay-socialMedia KaraokeDisplay-instagram KaraokeDisplay-lowerPaneIcon"}  url="https://www.instagram.com/africariyoki" />
                <SocialIcon bgColor={"#3413f1"} fgColor={"white"} className={"KaraokeDisplay-socialMedia KaraokeDisplay-twitter KaraokeDisplay-lowerPaneIcon" }  url="https://www.twitter.com/africariyoki" />
                <Sbta useDefaultImage={true} useIcon={true} imageBckNum={this.props.match.params.id} />
                <SearchIcon className={"KaraokeDisplay-lowerPaneIcon"} style={{ color: '#3413f1' }} onClick={()=>{this.setState({openSearcherModel: true})}} />
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
    return (
      <div className="Dots">
        <div><CircularProgress /></div>
      </div>
    )
  }
}


function getCodeFromCountryName(value) {
  let val = Object.keys(codeToCountries).find(key => codeToCountries[key] === value)
  if (val == undefined){
    return ""
  }
  return val
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