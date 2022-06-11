import React, { Component } from "react";
import MetaTags from 'react-meta-tags';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Text from "../Text";
import Firebase from "../../firebase/firebase.js";
import PopularSongs  from '../PopularSongs2/PopularSongs2.js';
import FooterMenuFooterDefault from "../FooterMenuFooterDefault";
import { GetParameterByName, GetRandomBackground, GetCodeFromCountryName, CleanLine } from "../helpers/Helpers";
import LRCParser from '../LrcParser2';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import AudioPlayer from 'react-h5-audio-player';
import AlbumIcon from '@material-ui/icons/Album';
import ShareIcon from '@mui/icons-material/Share';
import SearchIcon from '@material-ui/icons/Search';
import NoSleep from 'nosleep.js';
import { Emoji } from 'emoji-mart'
import CloseIcon from '@material-ui/icons/Close';
import Searcher from "../Searcher2/index.jsx";
import Suggest from "../Suggest";
import Header from "../Header2";
import { Analytics, PageHit } from 'expo-analytics';
import TempBackground from "../../../static/img/whitebackground.png"

import microphoneLogo from "../../../static/img/microphone-sing-svgrepo-com-1-2@2x.png"

import 'react-h5-audio-player/lib/styles.css';
import "./Karaoke.css";

var noSleep = new NoSleep();

class ConnectedKaraoke extends Component {
  constructor(props){
    super(props);

    this.state= {
      menuProps: props.menuProps,
      trendingSliderProps: props.trendingSliderProps,
      footerMenuFooterDefaultProps: props.footerMenuFooterDefaultProps,
      popularSongs:[],
      overlapGroup: TempBackground,
      selectedOptionSenderName: "",
      selectedOptionRecipientName: "",
      selectedOptionYokiLoveMessage: "",
      yokiLoveResponseMsg: "",
      yokiLoveResponseMsgColor: "black",
      yokiLoveLine: "",
      singer: {
        audiourl: '',
        singer: '',
        title: '',
        lyrics: '',
      },
    }
  }

  componentDidMount(){
    let withsbta = GetParameterByName('withsbta')
    if(withsbta != null && withsbta == 1){
      this.setState({openSbtaOnPageLoad: true})
    }

    //hack: use this to fix github pages doing ?/ on pages
    if (window.location.href.includes("?/")){
      let actualDestination = window.location.href.split("?/")[1]
      if(this.props.history == undefined){
        //TODO: figure out if it's possible to not have to do this
        window.location.href = "/" + actualDestination
      }else{
        this.props.history.push({
          pathname: "/" + actualDestination
        });
        window.location.reload(false);
      }
    }

    // const analytics = new Analytics('UA-187038287-1');
    // analytics.hit(new PageHit('Karaoke'))
    //   .then(() => console.log("google analytics on searcher"))
    //   .catch(e => console.log(e.message));


    setTimeout( () => {
      this.setState({
        overlapGroup: GetRandomBackground(""),
      })
    }, 500);

    setInterval( () => {
      this.setState({
        count: (this.state.count+1) % 2
      })
    }, 5000);

    //if there is no internet connection this should atleast work
    Firebase.getLyrics().then(
      val => {
        this.setState({
          popularSongs: val,
          songs: val,
          songsCopy: val,
          songIds: val.map(a => a.id),
        })

        localStorage.setItem('lyrics', JSON.stringify({
          "lyrics": val,
        }));
      }
    )
    //try to load local songs file first
    let localSongs = JSON.parse(localStorage.getItem('lyrics'));
    if (localSongs != null){
      let localLyrics = localSongs['lyrics']
      var currentSongInfo = localLyrics.find(element => element.id == this.props.match.params.id);

      if(currentSongInfo != null){
        this.setState({
          singer: currentSongInfo,
          animatedTexts: [
            currentSongInfo.title,
            currentSongInfo.singer,
            currentSongInfo.album,
          ],
        })
      }
    }

    Firebase.getLyricsById(this.props.match.params.id)
    .then(val => {
        if (!isNaN(val.numPlays)){
          Firebase.updateNumPlays(this.props.match.params.id, val.numPlays+1)
        }

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

    //try to load local songs file first
    localSongs = JSON.parse(localStorage.getItem('lyrics'));
    if (localSongs != null){
      let localLyrics = localSongs['lyrics']

      this.setState({
        popularSongs: localLyrics,
        nextSongOptions: localLyrics.filter(v => v.turnedOn == 1),
        highestNumPlays: this.getHighestNumberOfPlays(localLyrics)
      })
    }

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


  playSong = (songId) => {
    let chooseSong = this.state.songs.filter(song => songId === song.id)

    if(this.props.history == undefined){
      //TODO: figure out if it's possible to not have to do this
      window.location.href = "/karaoke/" + songId
    }else{
      this.props.history.push({
        pathname: "/karaoke/" + songId,
        state: { chooseSong: chooseSong, songs: this.state.songsCopy}
      });
      window.location.reload(false);
    }

    this.setState({
      songs: chooseSong,
      currentSong: chooseSong
    })
  }

  player = null

  updateTimer=()=>{
    const x = setInterval(()=>{
      let { eventDate } = this.state

      if(eventDate <=0){
        this.props.history.push({
          pathname: "/Karaoke/" + this.state.nextSongOptions.sort(( )=> Math.random() - 0.5).slice(0, 20)[0].id
        });
        window.location.reload(true);
        clearInterval(x)
      }else {
        if(eventDate != undefined){
          eventDate = eventDate.subtract(1,"s")
          const secs = eventDate.seconds()

          this.setState({
            secs,
            eventDate,
            showTimer: true
          })
        }
      }
    },1000)
  }

  playAnotherSong = () => {
    this.updateTimer()
  }

  isSafari(){
    return navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
    navigator.userAgent &&
    navigator.userAgent.indexOf('CriOS') == -1 &&
    navigator.userAgent.indexOf('FxiOS') == -1;
  }

  getHighestNumberOfPlays(val){
    return Math.max.apply(Math, val.map(function(o) { return o.numPlays; }))
  }

  getColorFromNumPlays(numPlays){
    let highestNumPlays = this.state.highestNumPlays
    let playRatio = (numPlays/highestNumPlays)

    return '0c0e19'

    //TODO: come back and redo this later
    if (playRatio < 0.2) {
      return '#eed09d'
    }else if(playRatio > 0.2 && playRatio < 0.4){
      return '#dfa543'
    }else if(playRatio > 0.4 && playRatio < 0.6){
      return '#e2a130'
    }else if(playRatio > 0.6 && playRatio < 0.8){
      return '#e09e2c'
    }else if(playRatio > 0.8 && playRatio < 0.9){
      return '#df8f05'
    }
    return '#df8f05'
  }

  componentWillUnmount(){
    noSleep.disable();
  }

  openYokiLove = (line) => {
    this.player.audio.current.pause()
    this.setState({openYokiLoveModel: true, yokiLoveLine: line})
  }

  createYokiLove(){
    if (this.state.selectedOptionSenderName != "" ||
    this.state.selectedOptionRecipientName != "" ||
    this.state.selectedOptionYokiLoveMessage != "") {

      this.setState({yokiLoveResponseMsg: ''})

      let expiryDate = new Date(new Date().getTime()+(5*24*60*60*1000));
      let id = this.state.selectedOptionSenderName + this.state.selectedOptionRecipientName + Date.now()

      let yokiLoveObj = {
        "id": id,
        "senderName": this.state.selectedOptionSenderName,
        "recipientName": this.state.selectedOptionRecipientName,
        "message": this.state.selectedOptionYokiLoveMessage,
        "expiryDate": expiryDate,
        "yokiSongId": this.props.match.params.id,
        "yokiLoveLine": this.state.yokiLoveLine,
      }

      Firebase.createYokiLove(yokiLoveObj)
      .then(() => {
        let textToCopy = `https://www.africariyoki.com/yokilove/${id}`
        navigator.clipboard.writeText(textToCopy)
        this.setState({
          yokiLoveResponseMsg: 'yokilove created! link has been copied to your clipboard. feel free to share',
          yokiLoveResponseMsgColor: 'green'
        })
      })

    }else{
      this.setState({
        yokiLoveResponseMsg: 'please make sure no field is empty',
        yokiLoveResponseMsgColor: 'red'
      })
    }
  }

  displayLyrics(){
    let lyrics = ''
    if (this.state.singer.lyrics != undefined){
      lyrics = this.state.singer.lyrics.replace("b\"", '')
    }

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
    if (this.state.singer.lyrics != undefined){
      return this.state.singer.lyrics.includes("[00")
    }
    return false
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

  copyURL = () => {
    let textToCopy = `vibe to ${this.state.singer.title.toLowerCase()} by ${this.state.singer.singer.toLowerCase()} on africariyoki ::: ${window.location.href}`
    navigator.clipboard.writeText(textToCopy)
    this.setState({openCopyCliboardModal:true})
  }

  onCanPlay = () => {
    setInterval(()=>{
      this.setState({currentTime: this.player.audio.current.currentTime})
    }, 0.1)

    setTimeout( () => {
      if(!this.isSafari()){
        this.player.audio.current.play()
      }
    }, 1000);
  }

  handleChangeSenderName = selectedOptionSenderName => {
    this.setState({ selectedOptionSenderName: selectedOptionSenderName.target.value });
  };

  handleChangeRecipientName = selectedOptionRecipientName => {
    this.setState({ selectedOptionRecipientName: selectedOptionRecipientName.target.value });
  };

  handleChangeYokiLoveMessage = selectedOptionYokiLoveMessage => {
    this.setState({ selectedOptionYokiLoveMessage: selectedOptionYokiLoveMessage.target.value });
  };

  render(){
    return (
      <div className="container-center-horizontal">
        <MetaTags>
          <title>{this.state.singer.title.toLowerCase()} - {this.state.singer.singer.toLowerCase()} ::: africariyoki</title>
          <meta name="description" content={`karaoke to your favourite african songs! -- ${this.state.singer.title}, ${this.state.singer.singer}, ${this.state.singer.countries}`} />
          <meta property="og:title" content="africariyoki" />
          <meta httpEquiv='cache-control' content='no-cache' />
          <meta httpEquiv='expires' content='0' />
          <meta httpEquiv='pragma' content='no-cache' />
        </MetaTags>
        {this.state.openCopyCliboardModal &&
          <div className="Karaoke-openCopyCliboardModal">
            <CloseIcon
              fontSize={'large'}
              className={"Karaoke-openCopyCliboardModal-close"}
              style={{ color: '#e2a130' }}
              onClick={()=>{this.setState({openCopyCliboardModal: false})}}
            />
            <div className="Karaoke-openCopyCliboardModal-content">
              yoki copied to clipboard. goan and share!
            </div>
          </div>
        }
        {this.state.openSuggestionModal &&
          <div className="Karaoke-openSuggestionModal">
            <CloseIcon
              fontSize={'large'}
              className={"Karaoke-openSuggestionModal-close"}
              style={{ color: '#e2a130' }}
              onClick={()=>{this.setState({openSuggestionModal: false})}}
            />
            <Suggest />
          </div>
        }
        {this.state.openYokiLoveModel &&
          <div className="Karaoke-openYokiLoveModel">
            <CloseIcon
              fontSize={'large'}
              className={"Karaoke-openYokiLoveModel-close"}
              style={{ color: '#e2a130' }}
              onClick={()=>{this.setState({openYokiLoveModel: false})}}
            />
            <div className="Karaoke-openYokiLoveModel-content">
              <div className="poppins-medium-martinique-16px">
                send yokilove to someone special
              </div>
              <br/>
              <div className="poppins-normal-martinique-12px">
                line selected - {CleanLine(this.state.yokiLoveLine)}
              </div>

              <TextField
                value={this.state.senderName}
                className="Karaoke-input Karaoke-gameOption"
                label={"your name?"}
                onChange={this.handleChangeSenderName}
                inputProps={{maxLength :20}}
              />
              <TextField
                value={this.state.recipientName}
                className="Karaoke-input Karaoke-gameOption"
                label={"recipient name?"}
                onChange={this.handleChangeRecipientName}
                inputProps={{maxLength :20}}
              />
              <TextField
                value={this.state.yokiLoveMessage}
                onChange={this.handleChangeYokiLoveMessage}
                label="yokilove message"
                multiline
                inputProps={{maxLength :140}}
                rows={4}
              />
              <div>
                <span
                  className="poppins-normal-martinique-12px"
                  style={{ color: this.state.yokiLoveResponseMsgColor }}
                >
                  {this.state.yokiLoveResponseMsg}
                </span>
              </div>
              <br/>
              <br/>
              <div className="buttons-10" onClick={() => {this.createYokiLove()}}>
                <div className="text-53 valign-text-middle poppins-medium-pine-green-20px">
                  <span>
                    <span className="poppins-medium-pine-green-20px">create yokilove</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        }
        {this.state.openSearcherModal &&
          <div className="Karaoke-openSearcherModal">
            <CloseIcon
              fontSize={'large'}
              className={"Karaoke-openSearcherModal-close"}
              style={{ color: '#f7f8e4' }}
              onClick={()=>{this.setState({openSearcherModal: false})}}
            />
            <Searcher/>
          </div>
        }
        <div className="karaoke-2 screen">
          <div
            style={{ backgroundImage: `url(${this.state.overlapGroup})` }}
            className="overlap-group-40">
              <div className="overlap-group-40-dark"></div>
          </div>
          <div className="overlap-group1-14">
            <div className="section1-3">
              <Header callerComponent={"karaokepage"} />
            </div>
            <div className="section2-2">
              <div className="karaoki-1">
                <div className="header">
                  <img className="iconframe-4" src={microphoneLogo}></img>
                  {this.state.singer.title && this.state.singer.singer &&
                    <Text {...{title: this.state.singer.title, singer: this.state.singer.singer}} />
                  }
                </div>
                <div className="body">
                  <div className="lyrics1-1">
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
                        openYokiLoveModel={this.openYokiLove}
                      />
                        :
                      <span className="Lyrics-container Lyrics-nonParsedLyrics">
                        {this.displayLyrics()}
                      </span>
                    }
                  </div>
                  <div className="Karaoke-controls">
                    {this.state.singer.audiourl &&
                      <AudioPlayer
                        autoPlayAfterSrcChange={this.isSafari() ? false : true}//set this for safari no matter what autoplay value is
                        defaultCurrentTime="yo"
                        defaultDuration="ki"
                        src={this.state.singer.audiourl.includes('africariyoki-4b634') ? this.state.singer.audiourl : this.state.singer.audiourl.replace('africariyoki', 'africariyoki-4b634')} //because im cheap and im not paying for firebase
                        controlsList="nodownload"
                        className={"Karaoke-audio"}
                        onEnded={this.playAnotherSong}
                        onPause={ () => {this.setState({pauseSong: true})}}
                        onPlay = {() => {this.setState({pauseSong: false})}}
                        listenInterval = {1}
                        ref={ref => this.player = ref}
                        onCanPlay={this.onCanPlay}
                      />
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className="Karaoke-lowerPane">
              <div className="Karaoke-countryFlags">
                {this.state.singer.countries!=undefined && this.state.singer.countries.split(",").map((country) =>
                  <Emoji
                    key={country}
                    emoji={"flag-" + GetCodeFromCountryName(country.trim()).toLowerCase()}
                    size={24}
                  />
                )}
              </div>
              <AlbumIcon className={"Karaoke-lowerPaneIcon"} style={{ color: this.getColorFromNumPlays(this.state.singer.numPlays) }}  onClick={()=>{this.setState({openSuggestionModal: true})}}/>
              {/* <SocialIcon target="_blank" bgColor={'#0c0e19'} fgColor={"white"} className={"Karaoke-socialMedia Karaoke-instagram Karaoke-lowerPaneIcon"}  url="https://www.instagram.com/africariyoki/?hl=en" />
              <SocialIcon target="_blank" bgColor={'#0c0e19'} fgColor={"white"} className={"Karaoke-socialMedia Karaoke-youtube Karaoke-lowerPaneIcon" }  url={"https://www.youtube.com/watch?v=" + this.props.match.params.id} /> */}
              {/* <Sbta openOnLoad={this.state.openSbtaOnPageLoad} useIcon={true} imageBckNum={this.props.match.params.id} /> */}
              <ShareIcon className={"Karaoke-lowerPaneIcon"} style={{ color: '#0c0e19' }} onClick={() => {this.copyURL()}} fontSize="small"/>
              <SearchIcon className={"Karaoke-lowerPaneIcon"} style={{ color: '#0c0e19' }} onClick={()=>{this.setState({openSearcherModal: true})}} />
            </div>
            <div className="section2-3">
            {this.state.popularSongs.length > 0 &&
              <PopularSongs
                cards = {this.state.popularSongs.sort(( )=> Math.random() - 0.5).slice(0, 50)}
                playSong = {this.playSong}
                scrollSeconds = {20000}
            />
            }
            </div>
            <FooterMenuFooterDefault className={"footer-default-3"} />
          </div>
        </div>
      </div>
    );
  }
}

function cleanLine(string){
  return string.toLowerCase().replace("by rentanadvisercom", '***')
}

const mapStateToProps = state => {
  return {};
};

let Karaoke = withRouter(connect(mapStateToProps)(ConnectedKaraoke));
export default withRouter(Karaoke);