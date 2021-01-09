import React, { Component } from 'react';
import "./Lyrics.css";

class Lyrics extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lyricsurl: props.lyricsurl,
      lyrics:""
    }

    this.scrollThreshold = 500
  }

  componentDidMount() {
    if (this.state.lyricsurl){
      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      fetch(this.state.lyricsurl, requestOptions)
      .then(response => response.text())
      .then(result => {
        alert("we correct")

        var newstr = "";
        var prevChar = '';

        for( var i = 0; i < result.length; i++ ){
          if(result[i] == "\\"){
            newstr += ' \n ';
            prevChar = 't'
          }else{
            if (prevChar == 't'){
              newstr += result[i+1];
            }else{
              newstr += result[i];
              prevChar = ''
            }
          }
        }
        this.setState({lyrics:newstr.replace('b\"', '')})
      })
      .catch(error => {
        console.log('error', error)
        alert('we hereytrx', error.toString())
      });
    }
  }

  displayLyrics(){
    let firstPart = this.state.lyrics.slice(0, this.state.lyrics.length/2)
    let secondPart = this.state.lyrics.slice(this.state.lyrics.length/2, -1)
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
