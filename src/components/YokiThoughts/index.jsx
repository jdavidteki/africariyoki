import React from "react";
import Frame261 from "../Frame261";
import { Component } from "react/cjs/react.development";
import Firebase from "../../firebase/firebase.js";

import "./YokiThoughts.css";

class YokiThoughts extends Component {
    constructor(props){
      super(props);
      this.state= {
        showArtDesc: false,
        storyId: '1P-AAhpqHfU',
        storyContent: '',
        imageBck: '',
        storyTitle: '',
        dateCreated: '',
        useIcon: this.props.useIcon,
        storyAvailable: false,
        openOnLoad: this.props.openOnLoad,
        stories: [],
      }
    }

    componentDidMount(){
      if(this.state.openOnLoad){
        this.openModal()
      }

      this.grabStoryFromFirebase()
    }

    grabStoryFromFirebase(){
      Firebase.getLyrics().then(
        val => {
          let songInQuestionIndex = Math.floor(Math.random() * (val.length - 0) + 0);
          Firebase.getStoryFromID(val[songInQuestionIndex].id).then(val => {
            if (val.content == undefined){
              this.grabStoryFromFirebase()
            }else{
              this.setState({
                storyContent: val.content,
                storyTitle: val.title,
                storyAuthor: val.author,
                dateCreated: val.dateCreated,
                storyAvailable: true,
              })
              return 0
            }
          })
        }
      )

      let randomNumber =  Math.floor(Math.random() * (11 - 1 + 1) + 1); //todo; redo this
      this.setState({
        imageBck: `https://firebasestorage.googleapis.com/v0/b/africariyoki-4b634.appspot.com/o/searchBackgrounds%2Fbck${randomNumber}bck.jpeg?alt=media`,
      })
    }

    openModal(){
      this.setState({showArtDesc: true})
      //TODO: hack to make prompt disappear when we open yokithought
      document.getElementById("Searcher-input-label").style.display = 'none'
    }

    closeModal(){
      this.setState({showArtDesc: false})
      //TODO: hack to make prompt disappear when we open yokithought
      document.getElementById("Searcher-input-label").style.display = 'block'
    }


    nextSongWithSBTA(){
      let randomSBTAId = this.state.stories[Math.floor(Math.random()*this.state.stories.length)];
      window.location.href = "/karaokedisplay/" + randomSBTAId.replaceAll('bck', '') + '?withsbta=1';
    }

    render(){
      return (
        <div className="YokiThoughts">
          <div className="YokiThoughts-icon" onClick={()=>this.openModal()}>
            {this.state.useIcon
              ?
                <InsertCommentIcon className={"YokiThoughts-insertCommentIcon"} style={{ color: '#3413f1' }} />
              :
                <span className="YokiThoughts-cta">yokithoughts</span>
            }
          </div>
          {this.state.showArtDesc &&
            <div className="container-center-horizontal">
              <div className="about-2 screen">
                <div className="about-3">
                  <img className="graphics-28" src={this.state.imageBck} />
                  <div className="frame-243">
                    <div className="frame-245">
                      <div className="i-jumped-off-as-hot poppins-normal-martinique-14px">
                        <span className="i-jumped-off-as-hot-title">{this.state.storyTitle}</span>
                        <pre className="i-jumped-off-as-hot-content poppins-normal-martinique-14px">{this.state.storyContent}</pre>
                      </div>
                      <div className="lyrics-19 poppins-normal-martinique-20px">
                        <span className="lightfont poppins-normal-martinique-20px">created by: </span>
                        <span className="lightfont poppins-medium-martinique-20px">{this.state.storyAuthor}</span>
                      </div>
                      <div className="poppins-normal-martinique-20px">
                        <span className="lightfont poppins-normal-martinique-20px">created on: </span>
                        <span className="lightfont poppins-medium-martinique-20px">{this.state.dateCreated}</span>
                      </div>
                    </div>
                    <div onClick={()=>this.closeModal()}>
                      <Frame261 />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      );
    }
}

export default YokiThoughts;
