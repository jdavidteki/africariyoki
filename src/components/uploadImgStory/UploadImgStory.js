import React, { Component } from "react";
import Avatar from '@material-ui/core/Avatar';
import SpeakerNotesIcon from '@material-ui/icons/SpeakerNotes';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Firebase from "../../firebase/firebase.js";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import "./UploadImgStory.css"

const bckImages = ['bck1','bck2','bck3','bck4','bck5','bck6','bck7','bck8','bck9','bck10', 'bck11']
class ConnectedUploadImgStory extends Component {

    state = {
        content: "",
        title: "",
        author: "",
        showStoryDetails: false,
        idToUpdate: "",
        errorMsg: '',
        bckImages: bckImages,
    };

    componentDidMount(){
        Firebase.getLyrics().
        then(val =>{
            this.setState({
                bckImages: this.state.bckImages.concat(val.map(a => a.id))
            })
        })
    }

    uploadStoryToFirebase(){
        //uZ-_HIoEBE8
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();

        today = yyyy+mm+dd

        if (this.state.content != "" && this.state.title != "" && this.state.author != ""){
            Firebase.addStoryFromID({
                title: this.state.title,
                author: this.state.author,
                content: this.state.content,
                dateCreated: today,
                id: this.state.idToUpdate,
            })
        }else{
            this.setState({
                errorMsg: 'pls make sure all content are filled out before submitting'
            })
        }
    }

    editStoryFromId(value){
        Firebase.getStoryFromID(value).then( story => {
            this.setState({
                idToUpdate: value,
                showStoryDetails: true,
                content: story.content,
                title: story.title,
                author: story.author,
            })
        })
    }

    render() {
        return (
            <div className="UploadImgStory">
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
                            <SpeakerNotesIcon />
                        </Avatar>
                        <div
                            style={{
                            marginBottom: 20,
                            fontSize: 24,
                            textAlign: "center"
                            }}
                        >
                            {" "}
                            Upload Story Image
                            {" "}
                        </div>


                        { this.state.showStoryDetails
                        ?
                            <div>
                                <div>uploading story id - {this.state.idToUpdate}</div>
                                <Button
                                    style={{ marginTop: 20, width: 200 }}
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => {
                                        this.uploadStoryToFirebase()
                                    }}
                                >
                                    Upload
                                </Button>
                                {this.state.errorMsg && <div style={{ color: 'red'}}>{this.state.errorMsg}</div>}
                                <div onClick={() => this.setState({showStoryDetails: false})}> update another story</div>
                                {" "}
                                {" "}
                                {" "}
                                {" "}
                                <TextField
                                    value={this.state.title}
                                    placeholder="Story title"
                                    onChange={e => {
                                        this.setState({ title: e.target.value });
                                    }}
                                />
                                <TextField
                                    value={this.state.author}
                                    placeholder="Story Author"
                                    onChange={e => {
                                        this.setState({ author: e.target.value });
                                    }}
                                />
                                <TextField
                                    style={{ height: 100}}
                                    value={this.state.content}
                                    placeholder="Story Content"
                                    multiline
                                    rows={40}
                                    onChange={e => {
                                        this.setState({ content: e.target.value });
                                    }}
                                />
                            </div>
                        :
                            <div className="UploadImgStory-ChooseBck">
                                {
                                    this.state.bckImages.map((value, index) => {
                                        return <div key={index} className={"UploadImgStory-" + value + " UploadImgStory-thisStory"} onClick={()=>{this.editStoryFromId(value)}}>{value}</div>
                                    })
                                }
                            </div>
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

const UploadImgStory = withRouter(connect(mapStateToProps)(ConnectedUploadImgStory));
export default UploadImgStory;


//https://material-ui.com/components/material-icons/#material-icons