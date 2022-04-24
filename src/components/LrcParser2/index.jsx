import React, { Component } from 'react';
// import Recorder from '../Recorder/index.jsx'
import { Emoji } from 'emoji-mart'
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { HmsToSecondsOnly, CleanLine} from "../helpers/Helpers.js";

import './LRCParser.css';

class LRCParser extends Component {
  constructor(props){
    super(props);

    this.state= {
      prevLine: "",
      currentLine:"",
      nextLine: "",
      prevTimeStamp: "",
      smileyToSet: '',
      currentLineIndex: 0,
      openAnotationModel: false,
      mapLyricsToMs: this.getLyricsArrayWithMs(this.props.lyrics.split("\n")),
      keysOfMapLyrics: Array.from(
          this.getLyricsArrayWithMs(this.props.lyrics.split("\n")).keys() != undefined ?
          this.getLyricsArrayWithMs(this.props.lyrics.split("\n")).keys() :
          []
      ),
      audioDetails: {
        url: null,
        blob: null,
        chunks: null,
        duration: {
          h: 0,
          m: 0,
          s: 0
        }
      },
      currentLineAnotation: "",
      lyricsAnotation: this.props.annotationObj
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.annotationObj !== this.props.annotationObj) {
      this.setState({lyricsAnotation: this.props.annotationObj})
    }

    if (prevProps.currentTime !== this.props.currentTime) {
      this.getCurrentLyricLine()
    }

    if (prevProps.smileyToSet !== this.props.smileyToSet) {
      this.setState({smileyToSet: this.props.smileyToSet})
    }
  }

  getLyricsArrayWithMs(rawArray){
    var msToLine = new Map()
    for( var i = 0; i < rawArray.length; i++ ){
      var lyricTimeMilliSec = HmsToSecondsOnly(rawArray[i].substring(1, 9)) + parseInt(rawArray[i].substring(7, 9), 10)
      msToLine.set(lyricTimeMilliSec, rawArray[i])
    }
    return msToLine
  }

  hasAnotation(line){
    if(this.state.lyricsAnotation != undefined &&
      this.state.lyricsAnotation[line.trim()] != undefined){
      return true
    }
    return false
  }

  showAnotation(line){
    if (this.hasAnotation(line.trim())){
      this.props.pauseThisSong()
      this.setState({openAnotationModel: true, currentLineAnotation: this.state.lyricsAnotation[line.trim()]})
    }
  }

  getCurrentLyricLine(){
    let currentTime = this.props.currentTime * 1000
    let closest = 0

    for (let i = 0; i < this.state.keysOfMapLyrics.length - 1; i++) {
      let now = this.state.keysOfMapLyrics[i]
      let later = this.state.keysOfMapLyrics[i + 1]
      let biggestTime = this.state.keysOfMapLyrics[this.state.keysOfMapLyrics.length - 1]

      if (currentTime >= biggestTime){
        closest = biggestTime
        break
      }

      if (currentTime > now && currentTime < later){
        closest = now
        break
      }
    }

    let prevLine = this.state.keysOfMapLyrics[this.state.keysOfMapLyrics.indexOf(closest) - 1]
    let nextLine = this.state.keysOfMapLyrics[this.state.keysOfMapLyrics.indexOf(closest) + 1]

    //check if currentline has changed
    if(closest != this.state.currentLineIndex){
      if(document.getElementById("LRCParser-currentLine") != null){
        document.getElementById("LRCParser-currentLine").classList.add('bottomFadeOutCurrentLine')

        setTimeout(()=>{
          document.getElementById("LRCParser-currentLine").classList.remove('bottomFadeOutCurrentLine')
        }, 500)
      }

      if(document.getElementById("LRCParser-previousLine") != null){
        document.getElementById("LRCParser-previousLine").classList.add('bottomFadeOutPreviousLine')

        setTimeout(()=>{
          document.getElementById("LRCParser-previousLine").classList.remove('bottomFadeOutPreviousLine')
        }, 500)
      }
    }

    this.setState({
      currentLineIndex: closest,
      prevLine:  this.state.mapLyricsToMs.get(prevLine),
      currentLine: this.state.mapLyricsToMs.get(closest),
      nextLine:  this.state.mapLyricsToMs.get(nextLine),
    })
  }

  render() {
    return (
      <div className="Lyrics-container LRCParser-container">
        <div className="LRCParser-containerWrapper">
          <div className={this.state.openAnotationModel ? "LRCParser-openAnotationModel LRCParser-openAnotationModel-open" : "LRCParser-openAnotationModel"}>
            <KeyboardBackspaceIcon
              fontSize={'medium'}
              className={"LRCParser-openAnotationModel-back"}
              style={{ color: '#080808' }}
              onClick={()=>{this.props.playThisSong(); this.setState({openAnotationModel: false})}}
            />
            <pre className={"LRCParser-annotationText"}>{this.state.currentLineAnotation}</pre>
          </div>

          <p id={"LRCParser-previousLine"} className="LRCParser-previousLine">
            {this.state.prevLine ? CleanLine(this.state.prevLine) : ''}
          </p>
          <p id={"LRCParser-currentLine"} className="LRCParser-currentLine">
            {this.state.currentLine
            ?
             <span onClick={()=>{this.showAnotation(CleanLine(this.state.currentLine))}} className={this.hasAnotation(CleanLine(this.state.currentLine)) ? "LRCParser-hasAnotation" : ""}>{CleanLine(this.state.currentLine)}</span>
            :
              <span>
                lo din din din...
                <Emoji
                  emoji={'stuck_out_tongue_winking_eye'}
                  set='apple'
                  size={18}
                />
              </span>
            }
          </p>
          <p className="LRCParser-nextLine">
            {this.state.nextLine ? CleanLine(this.state.nextLine) : ''}
          </p>
        </div>
        {/* {//TODO: come back to this
          window.innerWidth > 600 &&
            <div className="LRCParser-recorder">
              <Recorder
                singer={this.props.singer}
                title={this.props.title}
              />
            </div>
        } */}

        {/* { this.state.pauseSong ?
          <div className="LRCParser-motivator-container">
            <Emoji
              emoji={'clock1230'}
              set='double_vertical_bar'
              size={18}
            />
          </div>
          :
          <div className="LRCParser-motivator-container">
            <Emoji
              emoji={this.state.smileyToSet ? this.state.smileyToSet : 'smiley'}
              set='apple'
              size={18}
            />
          </div>
        } */}
      </div>
    );
  }
}

export default LRCParser;
