import React, { Component } from 'react';
import MicIcon from '@material-ui/icons/Mic';
import StopIcon from '@material-ui/icons/Stop';
import GetAppIcon from '@material-ui/icons/GetApp';
import { Emoji } from 'emoji-mart'

import './Recorder.css'

class Recorder extends Component {
    constructor(props){
        super(props);
    }

    state={
      freq: 0,
      motivator: '',
      smileyToSet: 'smiley',
      cantGetMic: false,
    }

    leftchannel = [];
    rightchannel = [];
    recorder = null;
    recording = false;
    recordingLength = 0;
    volume = null;
    audioInput = null;
    sampleRate = null;
    AudioContext = window.AudioContext || window.webkitAudioContext;
    context = null;
    analyser = null;
    canvasCtx = null
    stream = null;
    tested = false;
    micIcon="#3413f1";
    summation=0;
    averagefreq=0
    totalFreq=0

    async componentDidMount(){
      if( this.canvas != undefined){
        this.canvasCtx = this.canvas.getContext("2d")

        try {
            window.stream = this.stream = await this.getStream();
            console.log('Got stream');

            this.setUpRecording()

            this.startRecord.onclick = (e) => {
                console.log('Start recording')
                this.start();
            }

            this.stopRecord.onclick = (e) => {
                this.stop();
            }

            setInterval(() =>{
              var dataArrayN = new Float32Array(this.analyser.frequencyBinCount)
              this.analyser.getFloatFrequencyData(dataArrayN)
              var freq = Math.abs(dataArrayN.reduce((a, b) => a + b, 0))

              this.totalFreq += freq
              this.summation += 1
              if( this.summation %40 == 0){
                this.averagefreq = this.totalFreq/40
                this.totalFreq = 0
              }

              if(freq >= this.averagefreq ){
                this.setState({motivator: 'wonderful sturvs', smileyToSet: 'confetti_ball'})
              }else{
                if (freq < this.averagefreq - 5000){
                  this.setState({motivator: 'ko bad naa', smileyToSet: 'hugging_face'})
                }else{
                  this.setState({motivator: 'singing in the nonsense', smileyToSet: 'zipper_mouth_face'})
                }
              }
            }, 100)
        } catch(err) {
            this.setState({cantGetMic: true})
        }
      }
    }

    setUpRecording() {
      this.context = new this.AudioContext();
      this.sampleRate = this.context.sampleRate;

      // creates a gain node
      this.volume = this.context.createGain();

      // creates an audio node from teh microphone incoming stream
      this.audioInput = this.context.createMediaStreamSource(this.stream);

      // Create analyser
      this.analyser = this.context.createAnalyser();

      // connect audio input to the analyser
      this.audioInput.connect(this.analyser);

      // connect analyser to the volume control
      // analyser.connect(volume);

      let bufferSize = 2048;
      let recorder = this.context.createScriptProcessor(bufferSize, 2, 2);

      // we connect the volume control to the processor
      // volume.connect(recorder);

      this.analyser.connect(recorder);

      // finally connect the processor to the output
      recorder.connect(this.context.destination);

      recorder.onaudioprocess = (e) => {
        // Check
        if (!this.recording) return;
        // Do something with the data, i.e Convert this to WAV
        console.log('recording');
        let left = e.inputBuffer.getChannelData(0);
        let right = e.inputBuffer.getChannelData(1);
        if (!this.tested) {
          this.tested = true;
          // if this reduces to 0 we are not getting any sound
          if ( !left.reduce((a, b) => a + b) ) {
            alert("There seems to be an issue with your Mic");
            // clean up;
            this.stop();
            stream.getTracks().forEach(function(track) {
              track.stop();
            });
            context.close();
          }
        }
        // we clone the samples
        this.leftchannel.push(new Float32Array(left));
        this.rightchannel.push(new Float32Array(right));
        this.recordingLength += bufferSize;
      };

      this.visualize();
    };

    start() {
      this.recording = true;
      this.msg.style.display = 'flex'
      this.micIcon = 'red'
      // reset the buffers for the new recording
      this.leftchannel.length = this.rightchannel.length = 0;
      this.recordingLength = 0;
      console.log('context: ', !!this.context);
      if (!this.context) this.setUpRecording();
    }

    stop() {
      console.log('Stop')
      this.recording = false;
      this.msg.style.display = 'none'
      this.micIcon="#3413f1";

      // we flat the left and right channels down
      let leftBuffer = this.mergeBuffers ( this.leftchannel, this.recordingLength );
      let rightBuffer = this.mergeBuffers ( this.rightchannel, this.recordingLength );
      // we interleave both channels together
      let interleaved = this.interleave( leftBuffer, rightBuffer );

      ///////////// WAV Encode /////////////////
      // from http://typedarray.org/from-microphone-to-wav-with-getusermedia-and-web-audio/
      //

      // we create our wav file
      let buffer = new ArrayBuffer(44 + interleaved.length * 2);
      let view = new DataView(buffer);

      // RIFF chunk descriptor
      this.writeUTFBytes(view, 0, 'RIFF');
      view.setUint32(4, 44 + interleaved.length * 2, true);
      this.writeUTFBytes(view, 8, 'WAVE');
      // FMT sub-chunk
      this.writeUTFBytes(view, 12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      // stereo (2 channels)
      view.setUint16(22, 2, true);
      view.setUint32(24, this.sampleRate, true);
      view.setUint32(28, this.sampleRate * 4, true);
      view.setUint16(32, 4, true);
      view.setUint16(34, 16, true);
      // data sub-chunk
      this.writeUTFBytes(view, 36, 'data');
      view.setUint32(40, interleaved.length * 2, true);

      // write the PCM samples
      let lng = interleaved.length;
      let index = 44;
      let volume = 1;
      for (let i = 0; i < lng; i++){
          view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
          index += 2;
      }

      // our final binary blob
      const blob = new Blob ( [ view ], { type : 'audio/wav' } );

      const audioUrl = URL.createObjectURL(blob);
      console.log('BLOB ', blob);
      console.log('URL ', audioUrl);
      const link = this.download;
      link.setAttribute('href', audioUrl);
      link.download = this.props.singer +"-" + this.props.title +".wav";;
    }


    pause() {
      this.recording = false;
      this.context.suspend()
    }

    resume() {
      this.recording = true;
      this.context.resume();
    }

    mergeBuffers(channelBuffer, recordingLength) {
      let result = new Float32Array(recordingLength);
      let offset = 0;
      let lng = channelBuffer.length;
      for (let i = 0; i < lng; i++){
        let buffer = channelBuffer[i];
        result.set(buffer, offset);
        offset += buffer.length;
      }
      return result;
    }

    interleave(leftChannel, rightChannel){
      let length = leftChannel.length + rightChannel.length;
      let result = new Float32Array(length);

      let inputIndex = 0;

      for (let index = 0; index < length; ){
        result[index++] = leftChannel[inputIndex];
        result[index++] = rightChannel[inputIndex];
        inputIndex++;
      }
      return result;
    }

    writeUTFBytes(view, offset, string){
      let lng = string.length;
      for (let i = 0; i < lng; i++){
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    }

    getStream(constraints) {
      if (!constraints) {
        constraints = { audio: true, video: false };
      }
      return navigator.mediaDevices.getUserMedia(constraints);
    }

    // Visualizer function from
    // https://webaudiodemos.appspot.com/AudioRecorder/index.html
    //
    visualize() {
      let WIDTH = this.canvas.width;
      let HEIGHT = this.canvas.height;

      let visualSetting = "sinewave";
      console.log(visualSetting);
      if (!this.analyser) return;

      if(visualSetting === "sinewave") {
          this.analyser.fftSize = 2048;
          var bufferLength = this.analyser.fftSize;
          console.log(bufferLength);
          var dataArray = new Uint8Array(bufferLength);

          this.canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

          var draw = () => {
            requestAnimationFrame(draw);

            this.analyser.getByteTimeDomainData(dataArray);

            this.canvasCtx.fillStyle = '#f7f8e4';
            this.canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

            this.canvasCtx.lineWidth = 2;
            this.canvasCtx.strokeStyle = '#3413f1';

            this.canvasCtx.beginPath();

            var sliceWidth = WIDTH * 1.0 / bufferLength;
            var x = 0;

            for(var i = 0; i < bufferLength; i++) {

              var v = dataArray[i] / 128.0;
              var y = v * HEIGHT/2;

              if(i === 0) {
                this.canvasCtx.moveTo(x, y);
              } else {
                this.canvasCtx.lineTo(x, y);
              }

              x += sliceWidth;
            }

            if (this.canvas != undefined){
              this.canvasCtx.lineTo(this.canvas.width, this.canvas.height/2);
              this.canvasCtx.stroke();
            }
          };

          draw();
      }
    }

    render() {
      if (this.state.cantGetMic){
        return(<div></div>)
      }
      return (
        <div className="Recorder">
          <div className="Recorder-upperLevel">
            <button className="Record-controls" ref={ref => this.startRecord = ref} id="record"><MicIcon style={{color: this.micIcon}}/></button>
            <button className="Record-controls" ref={ref => this.stopRecord = ref} id="stop"><StopIcon MicIcon style={{color: "#3413f1"}} /></button>
            <canvas ref={ref => this.canvas = ref} height="50" width="280" ></canvas>
            <a className="Record-controls" id="download" ref={ref => this.download = ref}><GetAppIcon MicIcon style={{color: "#3413f1"}} /></a>
          </div>
          <div id="msg" style={{display: "none"}} ref={ref => this.msg = ref}>
            Recording...
          </div>
          <div className="Recorder-motivator">
            <div className="Recorder-motivator-container">
              <Emoji
                emoji={this.state.smileyToSet ? this.state.smileyToSet : 'smiley'}
                set='apple'
                size={18}
              />
              {this.state.motivator}
              <Emoji
                emoji={this.state.smileyToSet ? this.state.smileyToSet : 'smiley'}
                set='apple'
                size={18}
              />
            </div>
          </div>
        </div>
      );
    }
}

//go here to pick emojis
//https://missive.github.io/emoji-mart/

export default Recorder;
