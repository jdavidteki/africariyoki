import React, { Component } from 'react';
import moment from "moment"

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
      copyMapLyricsToMs: this.getLyricsArrayWithMs(this.props.lyrics.split("\n")),
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
    const copyMapLyricsToMs = this.state.copyMapLyricsToMs.keys()
    let currentTimeStamp = copyMapLyricsToMs.next().value
    let nextTimeStamp = copyMapLyricsToMs.next().value

    if ( currentTimeStamp < currentTime){
      if (this.state.prevTimeStamp != currentTimeStamp){
        this.setState({prevLine: this.state.mapLyricsToMs.get(this.state.prevTimeStamp)})
      }

      this.setState(
        {
          currentLine: this.state.mapLyricsToMs.get(currentTimeStamp),
          nextLine: this.state.mapLyricsToMs.get(nextTimeStamp),
        },() => {
        this.setState({prevTimeStamp: currentTimeStamp})
        this.state.copyMapLyricsToMs.delete(currentTimeStamp)
      });
    }
  }

  render() {
    return (
      <div className="Lyrics-container LRCParser-container">
        <p className="LRCParser-previousLine">
          {this.state.prevLine ? cleanLine(this.state.prevLine) : ''}
        </p>
        <p className="LRCParser-currentLine">
          {this.state.currentLine ? cleanLine(this.state.currentLine) : 'oya oooo****'}
        </p>
        <p className="LRCParser-nextLine">
          {this.state.nextLine ? cleanLine(this.state.nextLine) : ''}
        </p>
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
