import React, { Component } from "react";
import Avatar from '@material-ui/core/Avatar';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Firebase from "../../firebase/firebase.js";

import "./UploadContent.css"

class UploadContent extends Component {

    state = {
        albumName: "",
        singer: "",
        title: "",
        lyrics: "",
        videoID: "",
        isUploading: false,
        progress: 0,
    };

    componentDidMount(){

    }

    uploadToFirebase(){
        //uZ-_HIoEBE8
        if (this.state.videoID != ""){
            let audioUrl = `https://storage.googleapis.com/africariyoki.appspot.com/music/${this.state.videoID}.mp3`
            let lyricsTextUrl = `https://storage.googleapis.com/africariyoki.appspot.com/lyrics/${this.state.videoID}.txt`
            Firebase.addAfricariyoki({
                title: this.state.title,
                singer: this.state.singer,
                title: this.state.title,
                audiourl: audioUrl,
                lyricsurl: lyricsTextUrl,
                id: this.state.videoID,
            })

            //use ai to extract vocall from music and upload instrumental
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };
            fetch(`https://spotty-starfish-68.serverless.social/vr/${this.state.videoID}`, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));

            //upload file
            var requestOptions = {
              method: 'POST',
              headers: {"Content-Type": "text/plain"},
              body: this.state.lyrics,
              redirect: 'follow'
            };

            fetch(`https://spotty-starfish-68.serverless.social/lyrics/${this.state.videoID}`, requestOptions)
              .then(response => response.text())
              .then(result => console.log(result))
              .catch(error => console.log('error', error));
        }
    }

    render() {
        return (
            <div style={{height: "100%"}}>
                <div style={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <div
                    style={{
                        width: 320,
                        padding: 30,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column"
                    }}
                    >
                    <Avatar style={{ marginBottom: 10 }}>
                        <MusicNoteIcon />
                    </Avatar>
                    <div
                        style={{
                        marginBottom: 20,
                        fontSize: 24,
                        textAlign: "center"
                        }}
                    >
                        {" "}
                        Upload song information
                        {" "}
                    </div>
                    <TextField
                        value={this.state.title}
                        placeholder="Song title"
                        onChange={e => {
                        this.setState({ title: e.target.value });
                        }}
                    />
                    <TextField
                        value={this.state.singer}
                        placeholder="Singer"
                        onChange={e => {
                        this.setState({ singer: e.target.value });
                        }}
                    />
                    <TextField
                        value={this.state.albumName}
                        placeholder="Album"
                        onChange={e => {
                        this.setState({ albumName: e.target.value });
                        }}
                    />
                    <TextField
                        value={this.state.videoID}
                        placeholder="Youtube Video ID"
                        onChange={e => {
                        this.setState({ videoID: e.target.value });
                        }}
                    />
                    <TextField
                        style={{ height: 100}}
                        value={this.state.lyrics}
                        placeholder="Lyrics - paste lyrics here"
                        multiline
                        rows={4}
                        onChange={e => {
                        this.setState({ lyrics: e.target.value });
                        }}
                    />
                    <Button
                        style={{ marginTop: 20, width: 200 }}
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                            this.uploadToFirebase()
                        }}
                    >
                    Upload
                    </Button>
                    {this.state.wrongCred && (
                        <div style={{ color: "red" }}>{this.state.SignUpErrorMsg}</div>
                    )}
                    </div>
                </div>
            </div>

        )
    }
}

export default UploadContent;


//https://material-ui.com/components/material-icons/#material-icons