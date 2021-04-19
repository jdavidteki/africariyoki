import React, { Component } from 'react';
import Lyric from 'lrc-file-parser'
import moment from "moment"

import './LRCParser.css';

class LRCParser extends Component {
  constructor(props){
    super(props);

    this.state= {
      lineNumber:1,
      prevLine: "",
      currentLine:"",
      nextLine: "",
      arrayLyrics: [],
      lrc: new Lyric({
        onPlay: this.onPlayFunction,
        onSetLyric: this.onSetLyricFunction,
      })
    }
  }

  onPlayFunction = (lineNumber, currentLine) => {
    this.setState({lineNumber: lineNumber, currentLine: currentLine})
  }

  onSetLyricFunction = (arrayLyrics) => {
    this.setState({arrayLyrics: arrayLyrics})
  }

  componentDidMount(){
    this.state.lrc.setLyric(this.props.lyrics)
    this.state.lrc.play(this.props.currentTime)
  }

  render() {
    return (
      <div className="Lyrics-container LRCParser-container">
        {this.state.arrayLyrics[this.state.lineNumber - 1] &&
          <p>{cleanLine(this.state.arrayLyrics[this.state.lineNumber - 1].text)}</p>
        }
        <p className="LRCParser-currentLine">
          {cleanLine(this.state.currentLine)}
        </p>
        {this.state.arrayLyrics[this.state.lineNumber + 1] &&
          <p>{cleanLine(this.state.arrayLyrics[this.state.lineNumber + 1].text)}</p>
        }
      </div>
    );
  }
}

function cleanLine(string){
  return string.replace(/[^\w\s]/gi, '').toLowerCase().replace("by rentanadvisercom", '***')
}

export default LRCParser;
