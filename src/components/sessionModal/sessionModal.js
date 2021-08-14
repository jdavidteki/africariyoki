import React, { Component } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import Firebase from "../../firebase/firebase.js";
import TextField from "@material-ui/core/TextField";

import './SessionModal.css';

class SessionModal extends Component {
  constructor(props){
    super(props);
    this.state= {
        songInfo: this.props.singer,
        allRooms: [],
        availableRooms: [],
        unavailableRooms: [],
    }
  }

    componentDidMount(){
        Firebase.getAllRooms().then(
            val => {
                this.setState({allRooms: val})
            }
        )
    }

    gotoSession(chatId){
        if (chatId == ""){
        chatId = 'emoney'

        //start new session
        Firebase.addNewSession(chatId, 'tolani', this.state.songInfo.title)
        }


        if(this.props.history == undefined){
        //TODO: figure out if it's possible to not have to do this
        window.location.href = "/sessions/" + chatId
        }else{
        this.props.history.push({
            pathname: "/sessions/" + chatId,
        });
        }
    }

  render() {
    return (
        <div className="SessionModal-openSessionModel">
            <CloseIcon
                fontSize={'large'}
                className={"SessionModal-openSessionModel-close"}
                style={{ color: '#f7f8e4' }}
                onClick={() => this.props.closeSession()}
            />
            <div className="SessionModal-openSessionModel-container">
            <div className="SessionModal-inputSession">
                <TextField
                className="SessionModal-input"
                label={"enter existing session id"}
                variant="outlined"
                onChange={event=>{
                    this.setState({chatId: event.target.value})
                }}
                />
                <div onClick={() => {this.gotoSession(this.state.chatId)}}>
                enter session
                </div>
            </div>

            {" "}
                <span>or</span>
            {" "}

            {this.state.allRooms.map((yokiroom, id) => {
                if (yokiroom.occupied == 0){
                    return (
                        <span
                            key={id} className={"SessionModal-sessionName"}
                            onClick={() => {this.gotoSession(yokiroom.name)}}
                        >
                            {yokiroom.name}
                        </span>
                    )
                }
            })}

            </div>
        </div>
    );
  }
}

export default SessionModal;
