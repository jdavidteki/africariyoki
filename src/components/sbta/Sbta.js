import React, { Component } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import Button from "@material-ui/core/Button";
import Firebase from "../../firebase/firebase.js";
import InsertCommentIcon from '@material-ui/icons/InsertComment';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';

import "./Sbta.css";

class Sbta extends Component {
    constructor(props){
        super(props);
        this.state= {
            showArtDesc: false,
            storyId: this.props.imageBckNum,
            storyContent: '',
            imageBck: '',
            storyTitle: '',
            dateCreated: '',
            useIcon: this.props.useIcon,
            storyAvailable: false,
            openOnLoad: this.props.openOnLoad,
            stories: [],
        }
    }

    componentDidMount(){
        this.grabStoryFromFirebase(this.props.imageBckNum)

        if(this.state.openOnLoad){
            this.setState({showArtDesc: true})
        }

        Firebase.getLyricsRawJSON().then(songs => {
            Firebase.getSBTAs().then(val => {
                let stories =  Object.keys(val).filter((element) => { return element.length >  7} )

                //check to make sure song is turned on before pushing things and making next song actually play the right song
                stories = stories.filter((element) => { return songs[element.replaceAll('bck', '')].turnedOn == 1 }  )

                this.setState({
                    stories: stories
                })
            })
        })
    }

    componentDidUpdate(prevProps, prevState){
        if (prevProps.imageBckNum !== this.props.imageBckNum) {
            this.grabStoryFromFirebase(this.props.imageBckNum)
        }
    }

    grabStoryFromFirebase(storyID){
        Firebase.getStoryFromID(storyID).then(val => {
            this.setState({
                storyContent: val.content,
                storyTitle: val.title,
                storyAuthor: val.author,
                dateCreated: val.dateCreated,
                storyAvailable: true,
            })
        })

        let randomNumber =  Math.floor(Math.random() * (11 - 1 + 1) + 1); //todo; redo this
        this.setState({
            imageBck: `https://firebasestorage.googleapis.com/v0/b/africariyoki-4b634.appspot.com/o/searchBackgrounds%2Fbck${randomNumber}bck.jpeg?alt=media`,
        })
    }

    nextSongWithSBTA(){
        let randomSBTAId = this.state.stories[Math.floor(Math.random()*this.state.stories.length)];
        window.location.href = "/karaokedisplay/" + randomSBTAId.replaceAll('bck', '') + '?withsbta=1';
    }

    render() {
        if (this.state.storyAvailable && this.state.storyContent != undefined){
            return (
                <div className="Sbta">
                    <div className="Sbta-wrapper">
                        <div className="Sbta-icon" onClick={()=>this.setState({showArtDesc: true})}>
                            {this.state.useIcon
                            ?
                                <InsertCommentIcon className={"Sbta-insertCommentIcon"} style={{ color: '#3413f1' }} />
                            :
                                <span className="Sbta-cta">SBTA</span>
                            }
                        </div>
                        {this.state.showArtDesc &&
                            <div className="Sbta-artDesc">
                                <div className="Sbta-artDescWrapper">
                                    <div className="Sbta-closeIcon">
                                        <Button onClick={() => this.nextSongWithSBTA()}>
                                            <KeyboardTabIcon fontSize="small" style={{ color: '#f7c99e'}} />
                                        </Button>
                                        <Button onClick={() => this.setState({showArtDesc: false})}>
                                            <CloseIcon fontSize="small" style={{ color: '#f7c99e'}} />
                                        </Button>
                                    </div>
                                    <div className="Sbta-imageStory">
                                        <div className="Sbta-ImageDescWrapper">
                                            <div className="Sbta-imageWrapper">
                                                <img className="Sbta-image" src={this.state.imageBck} />
                                            </div>
                                        </div>
                                        <div className="Sbta-DescWrapper">
                                            <h2 className="Sbta-DescWrapper-title">{this.state.storyTitle}</h2>
                                            <div className="Sbta-DescWrapper-content">
                                                <pre>{this.state.storyContent}</pre>
                                                {
                                                    this.state.storyAuthor &&
                                                    <span className="Sbta-DescWrapper-author"> <br></br> written by - {this.state.storyAuthor}</span>
                                                }
                                                {
                                                    this.state.dateCreated &&
                                                    <span className="Sbta-DescWrapper-dateCreated"> <br></br> created on - {this.state.dateCreated}</span>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            );
        }
        return (
            <div></div>
        )
    }
}

export default Sbta;
