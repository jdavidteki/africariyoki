
import React, { Component } from 'react';
import Firebase from "../../firebase/firebase.js";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import './Suggestions.css';

class Suggestions extends Component {
    constructor(props){
        super(props);

        this.state= {
            songTitle: '',
            artistName: '',
            youtubeLink: '',
            errorMsg: '',
            submited: false,
        }
    }

    handleChangesongTitle = value => {
        this.setState({ songTitle: value.target.value });
    };

    handleChangeArtistName = value => {
        this.setState({ artistName: value.target.value });
    };

    handleChangeYoutubeLink = value => {
        this.setState({ youtubeLink: value.target.value });
    };

    submitSuggestion(){
        if(this.state.songTitle != '' && this.state.artistName != ''){
            Firebase.submitASuggestion(this.state.songTitle, this.state.artistName, this.state.youtubeLink)
            this.setState({submited: true})
        }else{
            this.setState({errorMsg: 'pls make sure both song title and song artist name are filled out'})
        }
    }

    render() {
        return (
            <div className="Suggestions">
                {!this.state.submited ?
                    <div className="Suggestions-wrapper">
                        <div className="Suggestions-title">
                            we know you will have suggestions, alaseju! <br></br>
                            oya sha enter the details of the song you want
                        </div>

                        {this.state.errorMsg != '' &&
                            <div className="Suggestions-errorMsg">
                                {this.state.errorMsg}
                            </div>
                        }

                        <div  className="Suggestions-setGameModel">
                            <div className="Suggestions-setGameModel-container">
                                <TextField
                                    value={this.state.songTitle}
                                    className="Suggestions-songTitle"
                                    label={"Enter song title"}
                                    onChange={this.handleChangesongTitle}
                                />
                                <TextField
                                    value={this.state.artistName}
                                    className="Suggestions-artistName"
                                    label={"Enter artist name"}
                                    onChange={this.handleChangeArtistName}
                                />
                                <TextField
                                    value={this.state.youtubeLink}
                                    className="Suggestions-youtubeLink"
                                    label={"Enter youtube link (optional)"}
                                    onChange={this.handleChangeYoutubeLink}
                                />
                            </div>
                            <Button
                                fontSize={'large'}
                                className={"Suggestions-setGameModel-close"}
                                style={{ marginTop: 20, width: 100, marginLeft: 200 }}
                                variant="contained"
                                size="medium"
                                color="primary"
                                onClick={()=>{
                                    this.submitSuggestion()
                                }}
                            >
                                done
                            </Button>
                        </div>
                    </div>
                :
                    <div className="Suggestions-wrapper">
                        <div className="Suggestions-title">
                            ese o!
                        </div>
                        <div>
                            we have heard you, we will update with your entry soon.
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default Suggestions;
