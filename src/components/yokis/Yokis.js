import React, { Component } from 'react';
import InsertCommentIcon from '@material-ui/icons/InsertComment';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import AudioPlayer from 'react-h5-audio-player';

import "./Yokis.css";

class ConnectedYokis extends Component {
    constructor(props){
        super(props);
        this.state = {
            songs: this.props.songs,
            loadingUpdates: false,
            updateSongIndex: 0,
            stopUpdating: true,
            updateDownloadCTA: 'start update',
            yokis: [],
        }
    }

    player = null

    componentDidUpdate(prevProps, prevState){
      if (prevProps.songs !== this.props.songs) {
        this.setState({songs: this.props.songs})

        let localYokis = JSON.parse(localStorage.getItem('yokis'));
        if (localYokis != null && localYokis['yokis'].length >  0){
            this.setState({yokis: localYokis['yokis']})
        }
      }
    }

    handleUpdatingYokis =  () => {
        localStorage.removeItem('yokis')
        this.setState({
          yokis: [],
          stopUpdating: false,
          loadingUpdates: true,
        }, ()=>{this.downloadYokis()})
    }

    pauseUpdating = () =>{
        this.setState({
            stopUpdating: true,
            loadingUpdates: false,
        })
    }

    downloadYokis = () => {
      if(!this.state.stopUpdating){
        if(this.state.songs[this.state.updateSongIndex] != undefined){

          let songId = this.state.songs[this.state.updateSongIndex].id

          this.setState({songIdToDownload: songId})

          this.setState(previousState => ({
            yokis: getUniqueListBy([...previousState.yokis, this.state.songs[this.state.updateSongIndex]], 'id')
          }), ()=>{
            localStorage.setItem('yokis', JSON.stringify({
                "yokis": this.state.yokis,
            }));
          });


          if(this.state.updateSongIndex + 1 == this.state.songs.length){
            this.pauseUpdating()
          }
        }
      }
    }

    loadListener = () => {
      var thisaudio = this.player.audio.current

      thisaudio.addEventListener("progress", () => {
        if(thisaudio.buffered.length>0){
          if (Math.round(thisaudio.buffered.end(0)) / Math.round(thisaudio.seekable.end(0)) === 1) {
            this.setState(
              {
                updateSongIndex: this.state.updateSongIndex+1,
              }, ()=>{
                this.downloadYokis()
              }
            )
          }
        }
      }, false);
    }

    render() {
        return(
          <div className="Yokis">
            <div className="is-hidden">
              <AudioPlayer
                onLoadStart={() => {this.loadListener()}}
                ref={ref => this.player = ref}
                muted
                src={`https://storage.googleapis.com/africariyoki-4b634.appspot.com/music/${this.state.songIdToDownload}.mp3`}
                onError = {() => {
                  this.setState(
                    {
                      updateSongIndex: this.state.updateSongIndex+1,
                    }, ()=>{
                      this.downloadYokis()
                    }
                  )
                }}
              />
            </div>

              <div className="Yokis-wrapper">
                  <div className="Yokis-icon" onClick={()=>this.setState({showArtDesc: true})}>
                      {this.state.useIcon
                      ?
                          <InsertCommentIcon className={"Yokis-insertCommentIcon"} style={{ color: '#3413f1' }} />
                      :
                          <span className="Yokis-cta">yokis</span>
                      }
                  </div>
                  {this.state.showArtDesc &&
                      <div className="Yokis-artDesc">
                          <div className="Yokis-artDescWrapper">
                              <div className="Yokis-closeIcon">
                                  <Button onClick={() => this.setState({showArtDesc: false})}>
                                      <CloseIcon style={{ color: '#f7c99e'}} />
                                  </Button>
                              </div>
                              <div className="Yokis-content">
                                  <div className="Yokis-title">
                                      <p className="Yokis-title-super">update all yokis to enjoy africariyoki offline. </p>
                                      <p className="Yokis-title-sub">
                                          you need to update atleast 10 yokis (200 seconds) to enjoy games.
                                          pls o, don't click 'start update' if you don't have good internet - teinz
                                      </p>
                                  </div>
                                  <div className="Yokis-controlMenu">
                                      <Button
                                          variant="contained"
                                          style={{backgroundColor: '#3413f1', color: 'white', textTransform: 'lowercase', marginRight: 8}}
                                          onClick={() => this.handleUpdatingYokis()}
                                      >
                                          start update
                                      </Button>
                                      <Button
                                          variant="contained"
                                          style={{backgroundColor: '#3413f1', color: 'white', textTransform: 'lowercase', marginRight: 8}}
                                          onClick={() => this.pauseUpdating()}
                                      >
                                          pause update
                                      </Button>
                                  </div>
                                  <div className="Yokis-updatedSongs">
                                      <div className="Yokis-updateProgress">
                                          {this.state.yokis.length}/{this.state.songs.length} updated

                                          {this.state.loadingUpdates &&
                                              <CircularProgress size={15} />
                                          }
                                      </div>
                                      {this.state.yokis.map((song, index) =>
                                          <div key={index}>updated - {song.title}</div>
                                      )}
                                  </div>
                              </div>
                          </div>
                      </div>
                  }
              </div>
          </div>
        )
    }
}

function getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
}

const mapStateToProps = state => {
    return {};
};

const Yokis = withRouter(connect(mapStateToProps)(ConnectedYokis));

export default Yokis;
