import React, { Component } from 'react';
import InsertCommentIcon from '@material-ui/icons/InsertComment';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import { setDownloadedYokis } from "../../Redux/Actions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import "./Yokis.css";

class ConnectedYokis extends Component {
    constructor(props){
        super(props);
        this.state = {
            songs: this.props.songs,
            loadingUpdates: false,
            updateSongIndex: 0,
            stopUpdating: false,
            updateDownloadCTA: 'start update',
            yokis: [],
        }
    }

    componentDidUpdate(prevProps, prevState){
        if (prevProps.songs !== this.props.songs) {
            this.setState({songs: this.props.songs})
        }
    }

    handleUpdatingYokis =  () => {
        this.setState({
            stopUpdating: false,
            loadingUpdates: true,
        })
        this.downloadYokis()
    }

    pauseUpdating = () =>{
        this.setState({
            stopUpdating: true,
            loadingUpdates: false,
        })
    }

    downloadYokis = () => {
        if(!this.state.stopUpdating){
            setTimeout(() => {
                let songId = this.state.songs[this.state.updateSongIndex].id
                let songTitle = this.state.songs[this.state.updateSongIndex].title

                var requestOptions = {
                  method: 'GET',
                  redirect: 'follow',
                  mode: 'no-cors'
                };

                fetch(`https://storage.googleapis.com/africariyoki-4b634.appspot.com/music/${songId}.mp3`, requestOptions)
                .then(response => response.text())
                .catch(error => console.log('error',error));

                this.setState(previousState => ({
                    yokis: [...previousState.yokis, songTitle]
                }), ()=>{
                    this.props.dispatch(setDownloadedYokis(this.state.yokis))
                });


                if (this.state.updateSongIndex < this.state.songs.length) {
                    this.downloadYokis();
                }
                this.setState({updateSongIndex: this.state.updateSongIndex+1})
            }, 20000);
        }
    }

    render() {
        return(
            <div className="Yokis">
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
                                        <p>update all yokis to enjoy africariyoki offline. </p>
                                        <p>pls o dont click 'start updating' if you no get better wifi - teinz</p>
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
                                            {this.props.yokis.length}/{this.state.songs.length} updated

                                            {this.state.loadingUpdates &&
                                                <CircularProgress size={15} />
                                            }
                                        </div>
                                        {this.props.yokis.map((songTitle, index) =>
                                            <div key={index}>updated - {songTitle}</div>
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

const mapStateToProps = state => {
    return {
      yokis: state.yokis,
    };
};

const Yokis = withRouter(connect(mapStateToProps)(ConnectedYokis));

export default Yokis;
