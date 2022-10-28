import React, { Component } from "react";
import Avatar from '@material-ui/core/Avatar';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import TextField from "@material-ui/core/TextField";
import codeToCountries from "../searcher/codeToCountry.js";
import Firebase from "../../firebase/firebase.js";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import FileUploader from "react-firebase-file-uploader";

import "./UploadSearcherBck.css"

class ConnectedUploadSeacherBck extends Component {

    state = {
        albumName: "",
        singer: "",
        title: "",
        lyrics: "",
        videoID: "",
        addressID: "",
        isUploading: false,
        progress: 0,
        downloadURL: null,
        bckIimageID: "",
        bckImageCode: "",
        isUploading: false,
        artistIGUsername: "",
    };

    handleUploadStart = () => this.setState({ isUploading: true, progress: 0 })
    handleProgress = progress => this.setState({ progress });
    handleUploadError = error => {
        this.setState({ isUploading: false });
        console.error(error);
    };
    handleUploadSuccess = filename => {
        this.setState({progress: 100, isUploading: false });
        Firebase
        .storage()
        .ref("searchBackgrounds/")
        .child(filename)
        .getDownloadURL()
        .then(url => {
            this.setState({ downloadURL: url, avatarOnFile: true });
            Firebase.updateSearcherBck(this.state.bckImageCode , url);
            Firebase.updateArtsIGByBckId(this.state.bckIimageID, this.state.artistIGUsername)
        })
    };


    render() {
        return (
            <div className="UploadSearcherBck">
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
                        <PhotoLibraryIcon />
                    </Avatar>
                    <div
                        style={{
                        marginBottom: 20,
                        fontSize: 24,
                        textAlign: "center"
                        }}
                    >
                        {" "}
                        Upload background image for country
                        {" "}
                    </div>

                    <TextField
                        value={this.state.bckIimageID}
                        placeholder="Enter bckImage Number to upload image"
                        onChange={e => {
                            this.setState({ bckIimageID: e.target.value, bckImageCode: getCodeFrombckIimageID(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)) });
                        }}
                    />

                    { this.state.bckIimageID != "" && this.state.bckImageCode != "" &&
                        <div>
                            <form>
                                {this.state.isUploading && <p>Progress: {this.state.progress}</p>}
                                updating background image for  -- { this.state.bckIimageID}, {this.state.bckImageCode}
                                <label style={{color: '#1a4e8e', padding: 10, borderRadius: 4, cursor: 'pointer', }}>
                                    <span className="Profile-image-label">Update Background Image</span>
                                    <FileUploader
                                        hidden
                                        accept="image/jpeg"
                                        filename={this.state.bckIimageID.toLowerCase() + "bck"}
                                        storageRef={Firebase.storage().ref('searchBackgrounds/')}
                                        onUploadStart={this.handleUploadStart}
                                        onUploadError={this.handleUploadError}
                                        onUploadSuccess={this.handleUploadSuccess}
                                        onProgress={this.handleProgress}
                                    />
                                </label>
                            </form>
                            <TextField
                                value={this.state.artistIGUsername}
                                placeholder="Enter artist's IG username"
                                onChange={e => {
                                    this.setState({ artistIGUsername: e.target.value});
                                }}
                            />
                        </div>

                    }

                    <img
                        className="ref"
                        src={this.state.downloadURL || "https://via.placeholder.com/400x300"}
                        alt="Uploaded Images"
                        height="300"
                        width="400"
                    />
                    </div>
                </div>
            </div>

        )
    }
}

function getCodeFrombckIimageID(value) {

    switch(value) {
      case "Bck1":
        return"Bck1"
      case "Bck2":
        return"Bck2"
      case "Bck3":
        return"Bck3"
      case "Bck4":
        return"Bck4"
      case "Bck5":
        return"Bck5"
      case "Bck6":
        return"Bck6"
      case "Bck7":
        return"Bck7"
      case "Bck8":
        return"Bck8"
      case  "Bck9":
        return"Bck9"
      case "Bck10":
        return"Bck10"
      case "Bck11":
        return"Bck11"
    }

    let val = Object.keys(codeToCountries).find(key => codeToCountries[key] === value)
    if (val == undefined){
        return ""
    }
    return val
}

const mapStateToProps = state => {
    return {};
};

const UploadSearcherBck = withRouter(connect(mapStateToProps)(ConnectedUploadSeacherBck));
export default UploadSearcherBck;


//https://material-ui.com/components/material-icons/#material-icons