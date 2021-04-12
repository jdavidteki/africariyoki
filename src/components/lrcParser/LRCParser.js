import React, { Component } from 'react';
import Lyric from 'lrc-file-parser'
import moment from "moment"

import './LRCParser.scss';

class LRCParser extends Component {
  constructor(props){
    super(props);

    this.state= {
      title: "hersss",
      lineNumber:1,
      prevLine: "",
      currentLine:"",
      nextLine: "",
      arrayLyrics: [],
      eventDate: moment.duration().add({days:0,hours:0,minutes:0,seconds:0}),
      lrc: new Lyric({
          onPlay: this.onPlayFunction,
          onSetLyric: this.onSetLyricFunction,
          offset: 15000
      })
    }
  }

  onPlayFunction = (lineNumber, currentLine) => {
    this.setState({lineNumber: lineNumber, currentLine: currentLine})
  }

  onSetLyricFunction = (arrayLyrics) => {
    this.setState({arrayLyrics: arrayLyrics})
  }

  updateTimer=()=>{
    const x = setInterval(()=>{

      let { eventDate} = this.state

      if (!this.props.pause){
        eventDate = eventDate.add(1,"s")
        this.state.lrc.play((eventDate.minutes() * 60000) + (eventDate.seconds() * 1000))

        this.setState({
          eventDate
        })
      }else{
        this.state.lrc.pause()
      }
    },1000)
  }

  componentDidMount(){
    this.updateTimer()

    this.state.lrc.setLyric(this.props.lyrics)
    this.state.lrc.play(0)
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
