import React, { Component } from 'react';
import Button from "@material-ui/core/Button";
import Firebase from "../../firebase/firebase.js";
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from "@material-ui/core/CircularProgress";

import './AnnotationFixer.css';

var player;

//saved the anotation json as a long json string
//to save space and for easy deserialization

class AnnotationFixer extends Component {
  constructor(props){
    super(props);
    this.state= {
      // songId: this.props.location.state.songId,
      songId: this.props.location.state.songId,
      lyrics: this.props.location.state.lyrics,
      annotationObj: {},
      editAnnotation: false,
      lyricsArrayClean: [],
    }
  }

  componentDidMount(){
    Firebase.getAnnotationBySongId(this.state.songId).then(
      val => {
        if (val.content != undefined){
          const obj = JSON.parse(val.content.replaceAll("'", ""));
          this.setState({annotationObj: obj})

          console.log(JSON.stringify(this.state.annotationObj))
        }
      }
    )

    this.prepareLyricsForFixing()
  }

  handleChange = (event) => {
    let copyAnnotationObj = this.state.annotationObj
    copyAnnotationObj[this.state.selectedLyric] = event.target.value

    this.setState({
      annotationObj: copyAnnotationObj,
    });
  }

  updateAnnotation(){
    Firebase.updateAnnotation(this.state.songId, `'${JSON.stringify(this.state.annotationObj)}'`)
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
        <div className="AnnotationFixer">
          <div className="AnnotationFixer-lyricLines">
            {Object.keys(this.state.lyricsArrayClean).map((line) =>
              <div onClick={()=>{this.setState({editAnnotation: true, selectedLyric: this.state.lyricsArrayClean[line]})}} className="AnnotationFixer-line" key={line}>
                <span>{this.state.lyricsArrayClean[line]}</span>
              </div>
            )}
          </div>

          {this.state.editAnnotation &&
            <div className="AnnotationFixer-textArea">
              <span>{this.state.selectedLyric}</span>
              <textarea
                className="AnnotationFixer-annotation"
                onChange={this.handleChange}
                value={this.state.annotationObj[this.state.selectedLyric]}
              />
              <div className="AnnotationFixer-controlPane">
                <CloseIcon className="AnnotationFixer-closeIcon" onClick={()=>{this.setState({editAnnotation: false})}} style={{ color: '#f7c99e'}} />
                <Button className="AnnotationFixer-saveButton" onClick={()=>{this.updateAnnotation()}}>save</Button>
              </div>
            </div>
          }
        </div>
      );
    }

    return (
      <div><CircularProgress /></div>
    )
  }
}

export default AnnotationFixer;
