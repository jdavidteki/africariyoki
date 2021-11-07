import React, { Component } from 'react';
import InsertCommentIcon from '@material-ui/icons/InsertComment';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "./YokiPhone.css";


class ConnectedYokiPhone extends Component {
    constructor(props){
        super(props);
        this.state = {
          playAudioNow: false,
        }
    }

    alreadyStarted = false
    audioQueue = []

    recordAudio = async () =>{
      while(1){
        const recorder = await recordAudio();
        recorder.start();
        await sleep(3000);
        const audio = await recorder.stop();
        this.audioQueue = [...this.audioQueue, audio]
        this.setState({playAudioNow: true})
      }
    }

    playAudio = async () => {
      if(!this.alreadyStarted){
        while(1){
          console.log("we here")
          if(this.audioQueue.length > 0 ){
            this.alreadyStarted = true
            this.audioQueue[0].play()
            this.audioQueue = this.audioQueue.slice(1)
          }
          await sleep(3000);
        }
      }
    }

    async componentDidUpdate(){
      console.log("componenetdidupdate")
      this.playAudio()
      await sleep(3000);
    }

    componentDidMount(){
      this.recordAudio()
    }

    render() {
      return(
        <div className="YokiPhone">
          <div className="YokiPhone-wrapper">
              <div className="YokiPhone-icon" onClick={()=>this.setState({showArtDesc: true})}>
                  {this.state.useIcon
                  ?
                      <InsertCommentIcon className={"YokiPhone-insertCommentIcon"} style={{ color: '#3413f1' }} />
                  :
                      <span className="YokiPhone-cta">yokiphone</span>
                  }
              </div>
              {this.state.showArtDesc &&
                <div className="YokiPhone-artDesc">
                    <div className="YokiPhone-artDescWrapper">
                        <div className="YokiPhone-closeIcon">
                            <Button onClick={() => this.setState({showArtDesc: false})}>
                                <CloseIcon style={{ color: '#f7c99e'}} />
                            </Button>
                        </div>
                        <div className="YokiPhone-content">

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
    return {};
};

const YokiPhone = withRouter(connect(mapStateToProps)(ConnectedYokiPhone));

export default YokiPhone;


const recordAudio = () =>
  new Promise(async resolve => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.addEventListener("dataavailable", event => {
      audioChunks.push(event.data);

    });

    const start = () => mediaRecorder.start();

    const stop = () =>
      new Promise(resolve => {
        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks);
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          const play = () => audio.play();
          resolve({ audioBlob, audioUrl, play });
        });

        mediaRecorder.stop();
      });

    resolve({ start, stop });
  });

const sleep = time => new Promise(resolve => setTimeout(resolve, time));
