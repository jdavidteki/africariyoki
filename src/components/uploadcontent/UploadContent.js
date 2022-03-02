import React, { Component } from "react";
import Avatar from '@material-ui/core/Avatar';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Firebase from "../../firebase/firebase.js";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import "./UploadContent.css"

class ConnectedUploadContent extends Component {

    state = {
        albumName: "",
        singer: "",
        title: "",
        lyrics: "",
        videoID: "",
        addressID: "",
        isUploading: false,
        progress: 0,
        countries: ""
    };

    // componentDidMount(){
    //     let songs = [
    //     "jipQpjUA_o8",
    //     "jowVh4hblsg",
    //     "jqp_IVzVhP0",
    //     "lG_-2gU6kUk",
    //     "lGduJvOtuT8",
    //     "lPe09eE6Xio",
    //     "leCI_whBjOw",
    //     "lta5go9P-go",
    //     "m5-ef83x0pM",
    //     "m7VX0tHCxfY",
    //     "mFBJtuQ1Llc",
    //     "mMutBBeqLMQ",
    //     "mV_zjss2nlY",
    //     "mZKwbR1Kjr4",
    //     "mrDFizMiNVw",
    //     "n3hSeu2NYXU",
    //     "n4pS-2P1wiQ",
    //     "nedwzQSZwfE",
    //     "nh-rkFHyZ1s",
    //     "nxyay4m584Y",
    //     "o5KyLuuqFms",
    //     "oAcWCGgF-tY",
    //     "oNYiG6f9W_g",
    //     "ojvz49lSfM4",
    //     "osmCHfPKgLQ",
    //     "pQK4KpophPo",
    //     "qEEsc8j-FVI",
    //     "qGkDAAxrjv0",
    //     "qQ2uxHTmhIg",
    //     "qgNNKuMjJ_4",
    //     "qiwoG1CmJIU",
    //     "qm-8MuocmVY",
    //     "rL1RRLZIHGA",
    //     "rN00uYIDFOc",
    //     "rO49fDRz-3k",
    //     "rVFWZZ2rRZU",
    //     "rYiUHMF7upY",
    //     "rd0wx6kLNWs",
    //     "rs58TCZ8qJI",
    //     "rvnXUQTEEVA",
    //     "s5xiYjLF5Uo",
    //     "s6stHyWHt1U",
    //     "sRS8Afj3dOM",
    //     "s_14mfxlHSc",
    //     "so4dgTRaWFk",
    //     "ssvZdVkYg3I",
    //     "sz5EhyESHR8",
    //     "t73iPhEg-kg",
    //     "ts5NDTV4QIo",
    //     "tzQx8rhcRUE",
    //     "uHb9EcpiNZ4",
    //     "uLJSjW3FSvY",
    //     "uZ-_HIoEBE8",
    //     "ucVJrja8r6Q",
    //     "utPhQUnLqc4",
    //     "vEgmPQtIdT0",
    //     "vSCRRlkHDtI",
    //     "viPh2ourtb4",
    //     "w4gAllVrPVM",
    //     "wCX7Isw7HZw",
    //     "wDhJgEFtYAM",
    //     "wG0WBC17Arc",
    //     "wXByQ8zFVK4",
    //     "wYUFksYkgos",
    //     "whptJMsHQVI",
    //     "witjmEEV7Es",
    //     "x9a6kz1-mgo",
    //     "xUYb9kIBrQ4",
    //     "xYD2SQljwJo",
    //     "x_JsNa2oRnI",
    //     "xsLhAlYwFxY",
    //     "xygb3dw2nTY",
    //     "yC2qh3MANvs",
    //     "yfM_ctb0tOo",
    //     "yoRQg4ZIRuo",
    //     "zUU1bIWpH5c",
    //     "zgi30OqnKN4",
    //     "zhPUUEhkYOY",
    //     "zmrOBEOUV_c",
    //     "zxDAgjaxDWI"]

    //     var i = 1;
    //     const x = setInterval(function() {
    //         i++;
    //         console.log("i", i)
    //         if (i < songs.length) {
    //             let addressID = "http://0.0.0.0:5000"

    //             var requestOptions = {
    //                 method: 'GET',
    //                 redirect: 'follow'
    //             };
    //             fetch(`${addressID}/vr/${songs[i]}`, requestOptions)
    //             .then(response => response.text())
    //             .then(result => console.log(result))
    //             .catch(error => console.log('error', error));

    //             console.log("updating only instruments", addressID, songs[i])
    //         }else{
    //             clearInterval(x)
    //         }
    //     }, 170000)
    // }

    uploadToFirebase(){
        let addressID = this.state.addressID
        if(addressID == ''){
            addressID = "http://0.0.0.0:5000"
        }else{
            addressID = "https://"+addressID+".ngrok.io"
        }
        //TODO: refactor this: but we might just want to update instrumetals
        if (this.state.title == "ji"){
            //use ai to extract vocall from music and upload instrumental
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };
            fetch(`${addressID}/vr/${this.state.videoID}`, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));

            console.log("updating only instruments", addressID, this.state.videoID)
            return
        }

        //uZ-_HIoEBE8
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();

        // 05fa60b49afa -- use amazon ec2 to do downaloda

        today = yyyy+mm+dd

        if (this.state.videoID != ""){
            let audioUrl = `https://storage.googleapis.com/africariyoki-4b634.appspot.com/music/${this.state.videoID}.mp3`
            let lyricsTextUrl = `https://storage.googleapis.com/africariyoki-4b634.appspot.com/lyrics/${this.state.videoID}.txt`

            Firebase.addAfricariyoki({
                title: this.state.title,
                singer: this.state.singer,
                title: this.state.title,
                audiourl: audioUrl,
                lyricsurl: lyricsTextUrl,
                lyrics: this.state.lyrics,
                id: this.state.videoID,
                albumName: this.state.albumName,
                countries: this.state.countries,
                dateAdded: today,
            })

            //use ai to extract vocall from music and upload instrumental
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };
            fetch(`${addressID}/vr/${this.state.videoID}`, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
        }
    }

    render() {
        return (
            <div className="UploadContent">
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
                        value={this.state.addressID}
                        placeholder="address ID"
                        onChange={e => {
                            this.setState({ addressID: e.target.value });
                        }}
                    />
                    <TextField
                        value={this.state.countries}
                        placeholder="Countries - seperate with comma"
                        onChange={e => {
                            this.setState({ countries: e.target.value });
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
                        style={{ marginTop: 20, width: 200, textTransform: 'lowercase'}}
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


const mapStateToProps = state => {
    return {};
};

const UploadContent = withRouter(connect(mapStateToProps)(ConnectedUploadContent));
export default UploadContent;


//https://material-ui.com/components/material-icons/#material-icons