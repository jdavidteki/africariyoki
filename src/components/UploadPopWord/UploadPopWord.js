import React, { Component } from "react";
import Avatar from '@material-ui/core/Avatar';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Firebase from "../../firebase/firebase.js";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import "./UploadPopWord.css"

class ConnectedUploadPopWord extends Component {

    state = {
        popword: "",
    };

    uploadToFirebase(){
        Firebase.getPopWords()
        .then(val => {
            let newWord = val.popword + "," + this.state.popword

            let uniqueListString = newWord.split(',').filter(function(item, i, allItems){
                return i==allItems.indexOf(item);
            }).join(',');

            Firebase.addPopWord({
                popword: uniqueListString,
            })
        })
    }

    render() {
        return (
            <div className="UploadPopWord">
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

                    <div>enter pop word</div>
                    <TextField
                        value={this.state.title}
                        placeholder="Enter new word/phrase"
                        onChange={e => {
                        this.setState({ popword: e.target.value });
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
                        update popwords
                    </Button>
                    </div>
                </div>
            </div>

        )
    }
}


const mapStateToProps = state => {
    return {};
};

const UploadPopWord = withRouter(connect(mapStateToProps)(ConnectedUploadPopWord));
export default UploadPopWord;


//https://material-ui.com/components/material-icons/#material-icons