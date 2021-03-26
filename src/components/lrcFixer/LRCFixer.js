import React, { Component } from 'react';
import Button from "@material-ui/core/Button";
import Firebase from "../../firebase/firebase.js";

import './LRCFixer.css';

class LRCFixer extends Component {
  constructor(props){
    super(props);
    this.state= {
        songId: props.songId,
        lyrics: props.lyrics,
    }
  }

  handleChange = (event) => {
    this.setState({
        lyrics: event.target.value
    });
  }

  updateLyrics(){
    Firebase.updateLyrics(this.state.songId, this.state.lyrics)
  }

  render() {
    return (
        <div className="LRCFixer">
            <iframe
                width="100%"
                height="200"
                src={`https://www.youtube.com/embed/${this.state.songId}`}
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
            </iframe>

            <textarea
                className="Lyrics-container"
                onChange={this.handleChange}
                value={this.state.lyrics}
            />
            <Button
                onClick={()=> this.updateLyrics()}
            >
                update lyrics
            </Button>
        </div>
    );
  }
}


export default LRCFixer;
