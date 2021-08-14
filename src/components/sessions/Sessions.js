import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import Firebase from "../../firebase/firebase.js";
import Slider from '@material-ui/core/Slider';
import PersonIcon from '@material-ui/icons/Person';
import MicIcon from '@material-ui/icons/Mic';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';

import TweenOne from 'rc-tween-one';
import SvgMorphPlugin from 'rc-tween-one/lib/plugin/SvgMorphPlugin';
TweenOne.plugins.push(SvgMorphPlugin);

import "./Sessions.css";

class ConnectedSessions extends Component {
  constructor(props){
    super(props);

    this.state={
        chats: [],
        loadingChats: false,
        chatId: this.props.match.params.id,
        distance: 30,
        minDistance: 10,
        maxDistance: 100,
        sliderValue: 0,
        userName: '',
        onMic: '',
        nowPlaying: '',
    }

    this.myRef = React.createRef();
    this.oldSliderValue = -2;
  }

    valuetext(value) {
        return `${value}°C`;
    }

  componentDidMount(){
    this.setState({ readError: null, loadingChats: true });
    const chatArea = this.myRef.current;

    //load chats on app iniitalization, and when a new chat is sent
    try {
        Firebase.db().ref("chats/"+this.state.chatId+"/messages" ).on("value", snapshot => {
            let chats = [];
            snapshot.forEach((snap) => {
            chats.push(snap.val());
            });
            chats.sort(function (a, b) { return a.timestamp - b.timestamp })
            this.setState({ chats });

            if (chatArea != null){
                chatArea.scrollBy(0, chatArea.scrollHeight);
            }

            this.setState({ loadingChats: false });
        });
        } catch (error) {
            console.log("error", error)
            this.setState({ readError: error.message, loadingChats: false });
    }

    //monitor who is on the mic
    try{
        Firebase.db().ref("chats/"+this.state.chatId+"/onMic" ).on("value", snapshot => {
            this.setState({onMic: snapshot.val()})
        })
    }catch(error){
        console.log("error", error)
    }

    //monitor what song is playing
    try{
        Firebase.db().ref("chats/"+this.state.chatId+"/nowPlaying" ).on("value", snapshot => {
            this.setState({nowPlaying: snapshot.val()})
        })
    }catch(error){
        console.log("error", error)
    }

    this.generateRadomName()
  }

  generateRadomName(){
    this.setState({userName: 'yoki1'}) //TODO: make this random generator based on the names of other members on the team
  }

  formatTime(timestamp) {
    const d = new Date(timestamp);
    const time = `${d.getDate()}/${(d.getMonth()+1)}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
    return time;
  }


    handleSliderChange = (event, newValue) => {
        event.preventDefault();
        this.setState({ writeError: null });
        const chatArea = this.myRef.current;


        if (Math.abs(this.oldSliderValue - newValue) > 10)
        {
            this.setState({sliderValue: newValue, content: newValue}, () => {
                Firebase.postChats(this.state.chatId, 'tixxy', this.state.content).
                then(val => {
                    this.setState({ content: '' });
                    chatArea.scrollBy(0, chatArea.scrollHeight);
                }).
                catch(error => {
                    this.setState({ writeError: error.message });
                })
            })

            this.oldSliderValue = newValue
        }else{
            this.setState({sliderValue: newValue})
        }
    };

    render() {
        return(
            <div className="Sessions">
                <div>
                    <PersonIcon />: {this.state.userName} ---
                    <MicIcon />: {this.state.onMic}
                    <RecordVoiceOverIcon />: {this.state.nowPlaying}
                </div>
                <div className="chat-area" ref={this.myRef}>
                    {/* loading indicator */}
                    {this.state.loadingChats ?
                        <div className="spinner-border text-success" role="status">
                            <CircularProgress className="circular" />;
                        </div>
                        :
                        ""
                    }
                    {/* chat area */}
                    {this.state.chats.map(chat => {
                        return <p key={chat.timestamp} className={"chat-bubble"}>
                            {chat.content}
                        <br />
                        <span className="chat-time float-right">{this.formatTime(chat.timestamp)}</span>
                        </p>
                    })}
                </div>

                <Slider
                    value={this.state.sliderValue}
                    min={0}
                    step={1}
                    max={100}
                    onChange={this.handleSliderChange}
                    valueLabelDisplay="auto"
                    aria-labelledby="non-linear-slider"
                />
                <div>
                    {this.state.sliderValue}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
  return {
    loggedInUser: state.loggedInUser,
  };
};

let Sessions = withRouter(connect(mapStateToProps)(ConnectedSessions));
export default withRouter(Sessions);