import React, { Component } from 'react';
import Titlelevel from "../Titlelevel";
import MetaTags from 'react-meta-tags';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Song from '../Song2'
import Firebase from "../../firebase/firebase.js";
import { CleanLine, GetRandomBackground, HmsToSecondsOnly } from "../helpers/Helpers";
import playLogo from '../../../static/img/play-arrow-1@2x.png'
import pauseLogo from '../../../static/img/pause-1@2x.png'
import TempBackground from "../../../static/img/whitebackground.png"
import Header from "../Header2";
import FooterMenuFooterDefault from "../FooterMenuFooterDefault";
import Confetti from 'react-confetti'
import FuzzySet from 'fuzzyset.js'

import "./YokiLove.css";

class ConnectedYokiLove extends Component{

  constructor(props){
    super(props);

    this.state={
      id: "",
      senderName: "",
      recipientName: "",
      message: "",
      expiryDate: "",
      yokiSongId: "",
      yokiLoveLine: "",
      yokiLoveSongSrc: "",
      audioPaused: true,
      prevTimeoutID: 0,
      overlapGroup: TempBackground,
      runLoop: true,
    };
  }

  audio=null

  componentDidMount(){
    Firebase.getYokiLoveById(this.props.match.params.id)
    .then(val => {
      this.setState(
        {
          id: val.id,
          senderName: val.senderName,
          recipientName: val.recipientName,
          message: val.message,
          expiryDate: val.expiryDate,
          yokiSongId: val.yokiSongId,
          yokiLoveLine: val.yokiLoveLine,
        }, () => {
          Firebase.getLyricsById(val.yokiSongId)
          .then(val => {
            this.setState(
              {
                yokiLoveSongSrc: val.audiourl,
                songTitle: val.title,
                songArtist: val.singer,
                songAlbum: val.album,
                songlyrics: val.lyrics,
              }
            )
          })
        })

      }
    )

    setTimeout( () => {
      this.setState({
        overlapGroup: GetRandomBackground(""),
      })
    }, 500);

    setTimeout( () => {
      this.setState({
        runLoop: false,
      })
    }, 10000);
  }

  getPopLineTime(yokiLoveLine){
    let secTime = 0

    let lyricsArray = this.state.songlyrics.split("\n")
    let poplineFuzzySet = FuzzySet(lyricsArray).get(yokiLoveLine)

    if (poplineFuzzySet!= null && poplineFuzzySet.length > 0){
        if (poplineFuzzySet[0].length > 0){
            secTime = HmsToSecondsOnly(poplineFuzzySet[0][1].substring(1, 9)) + parseInt(poplineFuzzySet[0][1].substring(7, 9), 10)
        }
    }

    if (isNaN(secTime) || secTime == 0){
      let midLyrics = lyricsArray[Math.round(lyricsArray.length / 2)]
      if(midLyrics != undefined){
        secTime = HmsToSecondsOnly(midLyrics.substring(1, 9)) + parseInt(midLyrics.substring(7, 9), 10)
      }
    }

    return Math.round(secTime/1000)
  }

  playVocal(){
    clearTimeout(this.state.prevTimeoutID)
    if(this.audio != null && this.audio.duration > 0){
      var timeToStart = this.getPopLineTime(this.state.yokiLoveLine)

      if (!this.audio.src.includes("#t")){
        this.audio.setAttribute("src", this.audio.src + `#t=${timeToStart}`)
      }

      //wait for like 0.5sec before actually playing just incase it is paused
      setTimeout(()=>{
        this.audio.play();
        this.setState({audioPaused: false})
      }, 500);

      //update song plays
      Firebase.getLyricsById(this.state.songId).then(
        val => {
          if (!isNaN(val.numPlays)){
            Firebase.updateNumPlays(this.state.songId, val.numPlays+1)
          }
        }
      )

      this.audio.currentTime = timeToStart
      const int = setTimeout(() => {
          if(this.audio != undefined){
              this.audio.pause();
              this.audio.currentTime = timeToStart
              this.setState({audioPaused: true})
              clearTimeout(int)
          }
      },  5000);
      this.setState({prevTimeoutID: int})
    }
  }

  render(){
    if (this.state.yokiLoveLine != undefined){
      return (
        <div className="YokiLove-container">
          <MetaTags>
            <title>africariyoki ::: from {this.state.senderName} to {this.state.recipientName} ::: yokilove</title>
            <meta name="description" content={`send your favourite lines to the people you love`} />
            <meta property="og:title" content="africariyoki" />
            <meta httpEquiv='cache-control' content='no-cache' />
            <meta httpEquiv='expires' content='0' />
            <meta httpEquiv='pragma' content='no-cache' />
          </MetaTags>
          <div
            style={{ backgroundImage: `url(${this.state.overlapGroup})` }}
            className="overlap-group-40">
              <div className="overlap-group-40-dark"></div>
          </div>
          <div className="overlap-group1-14">
            <div className="section1-3">
              <Header callerComponent={"gamespage"} />
            </div>
            <div className="section2-2">
              <div className="pop-lines-5">
                <div className="pop-linesheader-1">
                  <div className="overlap-group-45">
                    <div className="progress-1"></div>
                    <div className="playing-start for-poplines">
                      <div className="top-section">
                        <div className="left-2">
                          <Titlelevel
                            title = {`to ${this.state.recipientName}`}
                            selectedOptionDifficulty = {"ancestor"}
                          />
                        </div>
                        <div className="right-3">
                          <div className="buttons1" onClick={() => this.playVocal()}>
                            {this.state.audioPaused ?
                                <img className="play" src={playLogo} />
                              :
                                <img className="pause" src={pauseLogo} />
                            }
                          </div>
                        </div>
                      </div>
                      <div className="bottom-section poppins-medium-martinique-24px">{CleanLine(this.state.yokiLoveLine)}</div>
                    </div>
                  </div>
                </div>
                <div className="YokiLove-options">
                  {this.state.runLoop &&
                    <Confetti
                      width={window.innerWidth}
                      height={window.innerHeight}
                    />
                  }
                  <div className="poppins-normal-martinique-17px">{this.state.senderName} sent you yokilove 💝💝💝</div>
                  <br />
                  <div>message: </div>
                  <br />
                  <div className="poppins-normal-black-12px">{this.state.message}</div>
                </div>
                <div className="YokiLove-audioPlayer">
                  <audio
                    style={{display:"none"}}
                    className={"YokiLove-audio"}
                    ref={ref => this.audio = ref}
                    id="sample"
                    crossOrigin="anonymous"
                    controls
                    src={
                      this.state.yokiLoveSongSrc.includes('africariyoki-4b634') ?
                      this.state.yokiLoveSongSrc.replace('/music/', '/vocals/') :
                      this.state.yokiLoveSongSrc.replace('africariyoki', 'africariyoki-4b634').replace('/music/', '/vocals/') //TODO: jesuye come back and do this bettter lol
                    }
                  />
                </div>
              </div>
            </div>
            <FooterMenuFooterDefault />
          </div>
        </div>
      );
    }else{
      return (<div></div>)
    }
  }
}

const mapStateToProps = state => {
  return {};
};

let YokiLove = withRouter(connect(mapStateToProps)(ConnectedYokiLove));
export default withRouter(YokiLove);
