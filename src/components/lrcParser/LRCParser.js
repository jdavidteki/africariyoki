import React, { Component } from 'react';
import Lyric from 'lrc-file-parser'
import moment from "moment"

import './LRCParser.css';

class LRCParser extends Component {
  constructor(props){
    super(props);

    this.state= {
      title: "hersss",
      line:"",
      text:"",
      eventDate: moment.duration().add({days:0,hours:0,minutes:0,seconds:0}),
      lrc: new Lyric({
          onPlay: this.onPlayFunction,
          onSetLyric: function (lines) {},
          offset: 150
      })
    }
  }

  onPlayFunction = (line, text) => {
    this.setState({line: line, text: text})
  }

  updateTimer=()=>{
    const x = setInterval(()=>{
      let { eventDate} = this.state

      if (!this.props.pause){
        console.log("either pause or play")
        eventDate = eventDate.add(1,"s")
        this.state.lrc.play((eventDate.minutes() * 60000) + (eventDate.seconds() * 1000))

        this.setState({
          eventDate
        })
      }

    },1000)
  }

  componentDidMount(){
    this.updateTimer()

    console.log(this.props.lyrics)

    this.state.lrc.setLyric(this.props.lyrics)
  }

  render() {
    return (
      <div class="Lyrics-container LRCParser-container">
        {this.state.text}
      </div>
    );
  }
}

export default LRCParser;
