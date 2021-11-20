import React, { Component } from 'react';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "./YokiPhone.css";
class ConnectedYokiPhone extends Component {
  constructor(props){
    super(props);
    this.state = {
      micOn: false,
    }
  }

  audioQueue = []

  recordAudio = async () =>{
    while(1){
      if(this.state.micOn){
        console.log("we here6")
        const recorder = await recordAudio();
        recorder.start();
        await sleep(1000);
        const audio = await recorder.stop();
        this.audioQueue = [...this.audioQueue, audio]
      }else{
        await sleep(3000);
      }
    }
  }

  playAudio = async () => {
    while(1){
      if(this.audioQueue.length > 0 && this.state.micOn){
        console.log("we here6")
        this.audioQueue[0].play()
        this.audioQueue = this.audioQueue.slice(1)
        await sleep(1000);
      }else{
        await sleep(3000);
      }
    }
  }

  componentDidMount(){
    this.recordAudio()
    this.playAudio()
  }

  toggleMicOn = () => {
    this.setState(prevState => ({
      micOn: !prevState.micOn
    }));
  }

  render() {
    return(
      <div className="YokiPhone">
        <div className="YokiPhone-wrapper">
          <div className="YokiPhone-icon" onClick={() => this.toggleMicOn()}>
            {this.state.micOn ?
              <MicIcon className={"YokiPhone-micOnIcon"} style={{ color: 'white' }} />
              :
              <MicOffIcon className={"YokiPhone-micOnIcon"} style={{ color: 'white' }} />
            }
          </div>
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
