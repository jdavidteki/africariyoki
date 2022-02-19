import React, { Component } from 'react';
import Firebase from "../../firebase/firebase.js";
import CircularProgress from "@material-ui/core/CircularProgress";

import './UpdatePopline.css';

var player;

class UpdatePopline extends Component {
  constructor(props){
    super(props);
    this.state= {
      songId: this.props.location.state.songId,
      lyrics: this.props.location.state.lyrics,
      poplineObj: {},
      lyricsArrayClean: [],
    }
  }

  componentDidMount(){
    Firebase.getPopularLinesById(this.state.songId).then(
      val => {
        if (val.content != undefined){
          const obj = JSON.parse(val.content.replaceAll("'", ""));
          this.setState({poplineObj: obj})
        }
      }
    )

    this.prepareLyricsForFixing()
  }

  handleClick = (cleanLyric) => {
    let copypoplineObj = this.state.poplineObj

    if (copypoplineObj[cleanLyric]){
        copypoplineObj[cleanLyric] = false
    }else{
        copypoplineObj[cleanLyric] = true
    }


    this.setState({
      poplineObj: copypoplineObj,
    }, () => {
        Firebase.updatePopularline(this.state.songId, `'${JSON.stringify(this.state.poplineObj)}'`)
    });
  }

  //TODO: figure how to make this function central to prevent repeatation
  prepareLyricsForFixing = () => {
    let lyrics = this.state.lyrics
    let timeStampRegex = /\d\d:\d\d.\d\d/gm
    lyrics = lyrics.replace(timeStampRegex, '').replace(/[^\w\s]/gi, '')
    this.setState({lyrics: lyrics},
      () =>{
        let lyricsArray = lyrics.split("\n")
        let lyricsArrayClean = []
        for (var i = 0; i < lyricsArray.length; i++) {
          if (lyricsArray[i] != " "){
            lyricsArrayClean.push(lyricsArray[i].toLowerCase().trim())
          }
        }
        this.setState({lyricsArrayClean: lyricsArrayClean})
      }
    )
  }

  render() {
    if(this.state.lyricsArrayClean.length > 0){
      return (
        <div className="UpdatePopline">
          <div className="UpdatePopline-lyricLines">
            {Object.keys(this.state.lyricsArrayClean).map((line) =>
                <div onClick={()=>{this.handleClick(this.state.lyricsArrayClean[line])}}
                    className="UpdatePopline-line"
                    key={line}
                >
                <span>{this.state.lyricsArrayClean[line]}</span>
                {this.state.poplineObj[this.state.lyricsArrayClean[line]] ?
                    <span>--yes</span>
                    :
                    <span>--no</span>
                }
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div><CircularProgress /></div>
    )
  }
}

export default UpdatePopline;
