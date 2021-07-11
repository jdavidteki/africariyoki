import React, { Component } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import Button from "@material-ui/core/Button";
import Firebase from "../../firebase/firebase.js";
import InsertCommentIcon from '@material-ui/icons/InsertComment';

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
        }
    }

    componentDidMount(){
        this.grabStoryFromFirebase(this.props.imageBckNum)
    }

    componentDidUpdate(prevProps, prevState){
        if (prevProps.imageBckNum !== this.props.imageBckNum) {
            this.grabStoryFromFirebase(this.props.imageBckNum)
        }
    }

    grabStoryFromFirebase(storyID){
        Firebase.getStoryFromID(storyID).then(val => {
            console.log("val.title", val.title)
            this.setState({
                storyContent: val.content,
                storyTitle: val.title,
                storyAuthor: val.author,
                dateCreated: val.dateCreated,
                storyAvailable: true,
            })
        })

        let imageToUse = storyID
        if (this.props.useDefaultImage){
            imageToUse = 1
        }
        this.setState({
            imageBck: `https://firebasestorage.googleapis.com/v0/b/africariyoki-4b634.appspot.com/o/searchBackgrounds%2Fbck${imageToUse}bck.jpeg?alt=media`,
        })
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
                                        <Button onClick={() => this.setState({showArtDesc: false})}>
                                            <CloseIcon style={{ color: '#f7c99e'}} />
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
