import React, { Component } from 'react';
import Recorder from '../recorder/Recorder.js'
import { Emoji } from 'emoji-mart'
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

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
      openAnotationModel: false,
      mapLyricsToMs: this.getLyricsArrayWithMs(this.props.lyrics.split("\n")),
      keysOfMapLyrics: Array.from( this.getLyricsArrayWithMs(this.props.lyrics.split("\n")).keys()),
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
      var lyricTimeMilliSec = hmsToSecondsOnly(rawArray[i].substring(1, 6)) + parseInt(rawArray[i].substring(7, 9), 10)
      msToLine.set(lyricTimeMilliSec, rawArray[i])
    }
    return msToLine
  }

  hasAnotation(line){
    if(this.state.lyricsAnotation[line.trim()] != undefined){
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

    let closest = this.state.keysOfMapLyrics.reduce((a, b) => {
      let aDiff = Math.abs(a - currentTime);
      let bDiff = Math.abs(b - currentTime);
      if (aDiff == bDiff) {
          return a < b ? a : b;
      } else {
          return bDiff < aDiff ? b : a;
      }
    });

    if (closest > 0 && closest > currentTime){
      closest = this.state.keysOfMapLyrics[this.state.keysOfMapLyrics.indexOf(closest) - 1]
    }

    let prevLine = this.state.keysOfMapLyrics[this.state.keysOfMapLyrics.indexOf(closest) - 1]
    let nextLine = this.state.keysOfMapLyrics[this.state.keysOfMapLyrics.indexOf(closest) + 1]

    this.setState({
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
              style={{ color: '#3413f1' }}
              onClick={()=>{this.props.playThisSong(); this.setState({openAnotationModel: false})}}
            />
            <pre className={"LRCParser-annotationText"}>{this.state.currentLineAnotation}</pre>
          </div>

          <p className="LRCParser-previousLine">
            {this.state.prevLine ? cleanLine(this.state.prevLine) : ''}
          </p>
          <p className="LRCParser-currentLine">
            {this.state.currentLine
            ?
             <span onClick={()=>{this.showAnotation(cleanLine(this.state.currentLine))}} className={this.hasAnotation(cleanLine(this.state.currentLine)) ? "LRCParser-hasAnotation" : ""}>{cleanLine(this.state.currentLine)}</span>
            :
              <span>
                loading din din...
                <Emoji
                  emoji={'stuck_out_tongue_winking_eye'}
                  set='apple'
                  size={18}
                />
              </span>
            }
          </p>
          <p className="LRCParser-nextLine">
            {this.state.nextLine ? cleanLine(this.state.nextLine) : ''}
          </p>
        </div>
        {
          window.innerWidth > 600 &&
            <div className="LRCParser-recorder">
              <Recorder
                singer={this.props.singer}
                title={this.props.title}
              />
            </div>
        }

        { this.state.pauseSong ?
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
        }
      </div>
    );
  }
}

function cleanLine(string){
  return string.substr(10).toLowerCase().replace("by rentanadvisercom", '***')
}

function hmsToSecondsOnly(str) {
  var p = str.split(':'),
      s = 0, m = 1;

  while (p.length > 0) {
      s += m * parseInt(p.pop(), 10);
      m *= 60;
  }

  return s*1000;
}

export default LRCParser;
