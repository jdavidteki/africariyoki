import React, { Component } from 'react';
import "./Lyrics.css";


function lyricsToArray(lyrics) {
  if (lyrics) {
    const lines = lyrics.split('\n');
    const words = lines.reduce((words, line) => {
      words = words.concat(line.split(' '))
      words.push('\n');
      return words;
    }, []);
    return words;
  }
  return [];
}

class Lyrics extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lyricsurl: props.lyricsurl,
      lyrics: null,
      lyricsArray: null,
      currentWord: 0,
      timer: null,
      finished: true,
    }

    this.scrollThreshold = 500
  }

  static getDerivedStateFromProps(props, state) {
    if (props.lyrics !== state.lyrics) {
      return {
        ...state,
        lyrics: props.lyrics,
        lyricsArray: lyricsToArray(props.lyrics),
        currentWord: 0,
        finished: !props.lyrics,
      }
    }
    return null;
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

        this.setState({lyricsArray:lyricsToArray(newstr.replace('b\"', ''))})
      })
      .catch(error => console.log('error', error));
    }

    // this.playLyrics();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.currentWord <= nextState.lyricsArray.length
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  playLyrics = () => {
    this.setState({
      timer: setInterval(this.nextWord, this.props.speed),
    });
  }

  stopTimer = () => {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  stopLyrics = () => {
    this.stopTimer();
    this.setState({
      timer: null,
    });
  }

  nextWord = () => {
    if (this.state.currentWord <= this.state.lyricsArray.length) {
      this.setState(prevState => {
        return { currentWord: prevState.currentWord + 1 }
      })
    } else if (!this.state.finished) {
      // TODO: figure out how to restart a timer from within a
      //       static class method: getDerivedStateFromProps.
      // this.stopLyrics();
      this.setState({ finished: true }, () => {
        !!this.props.onFinish && this.props.onFinish();
      })
    }
  }

  renderHighlightedLyrics = () => {
    var unhighlightedElm = document.querySelector('.unhighlighted')
    var highlightedElm = document.querySelector('.highlight')

    if(highlightedElm && highlightedElm.offsetHeight >= this.scrollThreshold){
      this.scrollThreshold += 500
      unhighlightedElm.scrollIntoView()
    }

    const { lyricsArray, currentWord } = this.state;
    if (currentWord === 0) {
      return null;
    }
    return <span className="highlight"> {lyricsArray.slice(0, currentWord).join(' ')}</span>
  }

  renderRemainingLyrics = () => {
    const { lyricsArray, currentWord } = this.state;
    return <span className="unhighlighted">
            <span className="unhiglited-first">
              {lyricsArray.slice(0,lyricsArray.length/2).join(' ')}
            </span>
            <span className="unhiglited-sec">
              {lyricsArray.slice(lyricsArray.length/2, -1).join(' ')}
            </span>
          </span>
  }

  render() {
    return (
      <div className="lyrics">
        <pre className="lyrics-container">
          { this.renderHighlightedLyrics() } { this.renderRemainingLyrics() }
        </pre>
      </div>
    );
  }
}

Lyrics.defaultProps = {
  speed: 300,
}

export default Lyrics;
