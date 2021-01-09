import React, { Component } from 'react';
import "./Lyrics.css";

class Lyrics extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lyrics: props.lyrics.replace("b\"", '')
    }

    this.scrollThreshold = 500
  }

  displayLyrics(){
    let lyrics = this.state.lyrics
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

    let firstPart = newstr.slice(0, newstr.length/2)
    let secondPart = newstr.slice(newstr.length/2, -1)

    return(
      <span className="Lyrics-container">
        <span className="Lyrics-firstPart">{firstPart}</span>
        <span className="Lyrics-secondPart">{secondPart}</span>
      </span>
    )
  }

  render() {
    return (
      <pre className="Lyrics">
        {this.displayLyrics()}
      </pre>
    );
  }
}

Lyrics.defaultProps = {
  speed: 300,
}

export default Lyrics;
