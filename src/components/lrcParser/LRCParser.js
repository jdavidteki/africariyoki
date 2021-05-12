import React, { Component } from 'react';
import Recorder from '../recorder/Recorder.js'
import { Emoji } from 'emoji-mart'

import './LRCParser.css';

class LRCParser extends Component {
  constructor(props){
    super(props);

    this.state= {
      prevLine: "",
      currentLine:"",
      nextLine: "",
      prevTimeStamp: "",
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
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.currentTime !== this.props.currentTime) {
      this.getCurrentLyricLine()
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
          <p className="LRCParser-previousLine">
            {this.state.prevLine ? cleanLine(this.state.prevLine) : ''}
          </p>
          <p className="LRCParser-currentLine">
            {this.state.currentLine ?

             cleanLine(this.state.currentLine)

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
