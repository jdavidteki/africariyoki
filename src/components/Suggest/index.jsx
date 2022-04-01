import React from "react";
import { Component } from "react/cjs/react.development";
import TextField from "@material-ui/core/TextField";
import Firebase from "../../firebase/firebase.js";
import sendIcon from "./send-1@2x.png"

import "./Suggest.css";

class Suggest extends Component {
  constructor(props){
    super(props);

    this.state= {
        songTitle: '',
        artistName: '',
        youtubeLink: '',
        errorMsg: '',
        submited: false,
        igname: '',
    }
  }

  handleChangesongTitle = value => {
    this.setState({ songTitle: value.target.value });
  };

  handleChangeArtistName = value => {
      this.setState({ artistName: value.target.value });
  };

  handleChangeYoutubeLink = value => {
      this.setState({ youtubeLink: value.target.value });
  };

  submitSuggestion(){
    if(this.state.songTitle != '' && this.state.artistName != ''){
      Firebase.submitASuggestion(this.state.songTitle, this.state.artistName, this.state.youtubeLink, this.state.igname)
      this.setState({
        submited: true,
        errorMsg: 'ese o! we will update with your entry'
      })
    }else{
      this.setState({errorMsg: 'pls make sure both song title and song artist names are filled out'})
    }
  }

  handleChangeIGName = value => {
    this.setState({ igname: value.target.value });
  }

  render(){
    return (
      <div className="suggest-1 screen">
        <div className="suggest-song">
          <div className="frame-256">
            <div className="lyrics-15 poppins-medium-martinique-24px">
              <span className="poppins-medium-martinique-24px">suggest yokis</span>
            </div>
            <div className="help-us-stay-updated poppins-normal-martinique-17px">
              <div className="poppins-normal-martinique-17px">{this.state.errorMsg ? this.state.errorMsg : 'abeg, let us epp each other'}</div>
            </div>
          </div>
          {!this.state.submited &&
            <div className="frame-236">
              <div className="frame-257">
                <TextField
                  value={this.state.songTitle}
                  className="Suggestions-songTitle"
                  label={"song title"}
                  required={false}
                  onChange={this.handleChangesongTitle}
                />
                <TextField
                  required={false}
                  value={this.state.artistName}
                  className="Suggestions-artistName"
                  label={"artist(s) name"}
                  onChange={this.handleChangeArtistName}
                />
              </div>
              <div className="frame-258">
                <TextField
                  value={this.state.youtubeLink}
                  className="Suggestions-youtubeLink"
                  label={"youtube link (opt)"}
                  onChange={this.handleChangeYoutubeLink}
                />
                <TextField
                  value={this.state.igname}
                  className="Suggestions-igname"
                  label={"internet handle (opt)"}
                  onChange={this.handleChangeIGName}
                />
              </div>
            </div>
          }
          {!this.state.submited &&
            <div className="buttons-8" onClick={()=>{this.submitSuggestion()}}>
              <div className="listen-1 poppins-medium-zircon-20px">
                <span className="poppins-medium-zircon-20px">send</span>
              </div>
              <img className="send" src={sendIcon} />
            </div>
          }
        </div>
      </div>
    );
  }

}

export default Suggest;
