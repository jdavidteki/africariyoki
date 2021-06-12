import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment"
import { Dots } from "react-activity";
import Firebase from "../../firebase/firebase.js";
import TextField from "@material-ui/core/TextField";
import Song from '../song/Song'
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Button from "@material-ui/core/Button";
import ReplayIcon from '@material-ui/icons/Replay';
import CheckIcon from '@material-ui/icons/Check';
import Select  from 'react-select';
import ArrowForward from '@material-ui/icons/ArrowForward'
import PersonIcon from '@material-ui/icons/Person';

import 'bootstrap/dist/css/bootstrap.css';
import "./GuessSong.css"
import "../karaokedisplay/KaraokeDisplay.css"

const DifficultyOptions = [
    { value: 'Beginner', label: 'beginner' },
    { value: 'Amateur', label: 'amatuer' },
    { value: 'Professional,', label: 'professional' },
    { value: 'Master', label: 'master' },
];

const DurationOptions = [
    {value: 1, label: '1min'},
    {value: 2, label: '2mins'},
    {value: 3, label: '3mins'},
];

const levelToPlaySec = {
    "beginner": 5,
    "amatuer": 4,
    "professional": 3,
    "master": 2.5,
}

class ConnectedGuessSong extends Component {

    state = {
        secs:0,
        mins:1,
        songs: [],
        songInQuestionIndex: 0,
        songsInOption: [],
        score: 0,
        highestscore:1000,
        setGameModel: true,
        selectedOptionPlayerName: "",
        selectedOptionDuration: {value: 1, label: '1min'},
        selectedOptionDifficulty: {value: 'Beginner', label: 'beginner'},
        printResult: false,
        songInQuestion: {
            audiourl: '',
            singer: '',
            title: '',
            lyrics: '',
        },
    };

    audio=null

    updateTimer=()=>{
        const x = setInterval(()=>{
          let { eventDate} = this.state

          if(eventDate <=0){
            this.setState({
              count:0,
              eventDate: moment.duration().add({days:0,hours:0,minutes:this.state.selectedOptionDuration.value,seconds:0}),
              secs:0,
              mins:1,
              printResult: true,
            })
            clearInterval(x)
          }else {
            eventDate = eventDate.subtract(1,"s")
            const secs = eventDate.seconds()
            const mins = eventDate.minutes()
            this.setState({
              secs,
              mins,
              eventDate,
              showTimer: true
            })
          }
        },1000)
    }

    componentDidMount(){
        Firebase.getLyrics().then(
            val => {
                let songInQuestionIndex = Math.floor(Math.random() * (val.length - 0) + 0);

                this.setState({
                  songs: val,
                  songInQuestionIndex: songInQuestionIndex,
                  songInQuestion: val[songInQuestionIndex],
                  songsInOption: this.generateSongsInOptions(val, val[songInQuestionIndex])
                })
            }
        )

        // let songInQuestionIndex = Math.floor(Math.random() * (Object.values(AllSongs).length - 0) + 0);

        // this.setState({
        //   songs: Object.values(AllSongs),
        //   songInQuestionIndex: songInQuestionIndex,
        //   songInQuestion: Object.values(AllSongs)[songInQuestionIndex],
        //   songsInOption: this.generateSongsInOptions(Object.values(AllSongs), Object.values(AllSongs)[songInQuestionIndex])
        // })
    }

    play(){
        if(this.audio != null){
            this.audio.currentTime = 40;
            this.audio.play();

            var int = setInterval(() => {
                if (this.audio != null && this.audio.currentTime > 40 + levelToPlaySec[this.state.selectedOptionDifficulty.label]) {
                    this.audio.pause();
                    clearInterval(int);
                }
            }, 10);
        }
    }

    handleChangePlayerName = selectedOptionPlayerName => {
        this.setState({ selectedOptionPlayerName: selectedOptionPlayerName.target.value });
    };


    handleChangeDifficulty = selectedOptionDifficulty => {
        this.setState({ selectedOptionDifficulty });
    };

    handleChangeDuration = selectedOptionDuration => {
        this.setState({ selectedOptionDuration });
    };


    generateSongsInOptions(allSongs, songInQuestion){
        let songsInOptions = [songInQuestion]

        for(var i=0; i<5; i++){
            let random = Math.floor(Math.random() * (allSongs.length - 0) + 0);

            if(!songsInOptions.includes(allSongs[random])){
                songsInOptions.push(allSongs[random])
            }
        }
        return shuffleArray(songsInOptions)
    }

    checkAnswer(song){
        if(song == this.state.songInQuestion){
            this.setState({score: this.state.score+=1})
        }else{
            this.setState({score: this.state.score-=1})
        }

        let songInQuestionIndex = Math.floor(Math.random() * (this.state.songs.length - 0) + 0);

        this.setState({
            songInQuestionIndex: songInQuestionIndex,
            songInQuestion: this.state.songs[songInQuestionIndex],
            songsInOption: this.generateSongsInOptions(this.state.songs, this.state.songs[songInQuestionIndex])
        })
    }

    startGame(){
        this.updateTimer()
        this.setState({
            setGameModel: false,
            printResult: false,
            eventDate: moment.duration().add({days:0,hours:0,minutes:this.state.selectedOptionDuration.value,seconds:0}),
        })
    }

    restartGame(){
        let songInQuestionIndex = Math.floor(Math.random() * (this.state.songs.length - 0) + 0);
        this.setState({
            count:0,
            eventDate: moment.duration().add({days:0,hours:0,minutes:0,seconds:0}),
            secs:0,
            mins:0,
            score: 0,
            setGameModel: true,
            printResult: false,
            songInQuestionIndex: songInQuestionIndex,
            songInQuestion: this.state.songs[songInQuestionIndex],
            songsInOption: this.generateSongsInOptions(this.state.songs, this.state.songs[songInQuestionIndex])
        })
    }

    getComment(){
        if(this.state.score <= 5){
            return "you are just embarrrrassing yourself!"
        }

        if(this.state.score >= 5 && this.state.score < 10){
            return "see, you will end up in mcdonalds!"
        }

        if(this.state.score >= 10 && this.state.score < 15){
            return "do better next time..."
        }

        if(this.state.score >= 15 && this.state.score < 20){
            return "like mr macaroni, you are doing well"
        }

        if(this.state.score >= 20 && this.state.score < 25){
            return "you have too much pride, try to be calming down"
        }

        if(this.state.score >= 25 && this.state.score < 30){
            return "fantabulous"
        }

        if(this.state.score >= 30 && this.state.score < 35){
            return "nice, we love to see it!"
        }
    }

    render() {
        if (this.state.songInQuestion.title != "") {
            return (
                <div className="GuessSong">
                    {this.state.setGameModel
                    ?
                        <div className="GuessSong-setGameModel">
                            <div className="GuessSong-setGameModel-container">
                                <TextField
                                    value={this.state.selectedOptionPlayerName}
                                    className="GuessSong-input GuessSong-gameOption"
                                    label={"enter player name"}
                                    onChange={this.handleChangePlayerName}
                                />

                                <Select
                                    value={this.state.selectedOptionDifficulty}
                                    className="GuessSong-gameOption"
                                    onChange={this.handleChangeDifficulty}
                                    options={DifficultyOptions}
                                    isSearchable={false}
                                    placeholder={"diffculty level"}
                                />

                                <Select
                                    value={this.state.selectedOptionDuration}
                                    className="GuessSong-gameOption"
                                    onChange={this.handleChangeDuration}
                                    options={DurationOptions}
                                    isSearchable={false}
                                    placeholder={"duration"}
                                />
                            </div>
                            <ArrowForward
                                fontSize={'large'}
                                className={"GuessSong-setGameModel-close"}
                                style={{ color: '#f7f8e4' }}
                                onClick={()=>{
                                    this.startGame()
                                }}
                            />
                        </div>
                    :
                        <div className="GuessSong-wrapper" >
                            {this.state.printResult
                                ?
                                    <div className="GuessSong-results">
                                        <div className="GuessSong-results-title">Result:</div>
                                        <div className="GuessSong-gameOption"> <PersonIcon /> {this.state.selectedOptionPlayerName == "" ? 'anonimo' : this.state.selectedOptionPlayerName}</div>
                                        <div className="GuessSong-gameOption">difficulty: {this.state.selectedOptionDifficulty.label}</div>
                                        <div className="GuessSong-gameOption"> <CheckIcon /> {this.state.score}</div>
                                        <div className="GuessSong-gameOption">{this.state.selectedOptionDuration.label}</div>
                                        <div className="GuessSong-gameOption GuessSong-comment">comment: {this.getComment()}</div>
                                        <Button style={{backgroundColor: '#0f750f', color: 'white', marginTop: '30px'}} variant="contained" color="primary" onClick={() => this.restartGame()}>
                                            play again
                                        </Button>
                                    </div>
                                :
                                    <div className="GuessSong-display">
                                        <div className="GuessSong-title">guess the song...</div>
                                        <div>press play to listen to snippet</div>
                                        <div className="GuessSong-controlMenu">
                                            <Button style={{backgroundColor: '#0f750f', color: 'white'}} variant="contained" color="primary" onClick={() => this.play()}>
                                                <PlayArrowIcon />
                                            </Button>
                                            <div className="GuessSong-controlMenuInfo">
                                                <div className="GuessSong-controlMenuInfoChild"> <PersonIcon /> {this.state.selectedOptionPlayerName == "" ? 'anonimo' : this.state.selectedOptionPlayerName}</div>
                                                <div className="GuessSong-controlMenuInfoChild">high score: {this.state.highestscore}</div>
                                                <div className="GuessSong-controlMenuInfoChild">difficulty: {this.state.selectedOptionDifficulty.label}</div>
                                                <div className="GuessSong-controlMenuInfoChild"> <CheckIcon /> {this.state.score}</div>
                                                <div className="GuessSong-controlMenuInfoChild">{`${this.state.mins} : ${this.state.secs}`}</div>
                                            </div>
                                        </div>

                                        <div className="GuessSong-audioPlayer">
                                            <audio
                                                style={{display:"none"}}
                                                className={"KaraokeDisplay-audio"}
                                                ref={ref => this.audio = ref}
                                                id="sample"
                                                controls
                                                src={
                                                    this.state.songInQuestion.audiourl.includes('africariyoki-4b634') ?
                                                    this.state.songInQuestion.audiourl :
                                                    this.state.songInQuestion.audiourl.replace('africariyoki', 'africariyoki-4b634')
                                                } //because im cheap and im not paying for firebase
                                            />
                                        </div>
                                        <div className="GuessSong-options">
                                            {this.state.songsInOption.map((song) =>
                                                <Song
                                                    key={song.id}
                                                    song={song}
                                                    playSong={() => this.checkAnswer(song)}
                                                    countries={song.countries}
                                                />
                                            )}
                                        </div>
                                        <div className="GuessSong-lowerMenu">
                                            <Button variant="contained" style={{backgroundColor: '#0f750f', color: 'white'}} onClick={() => this.restartGame()}>
                                                <ReplayIcon />
                                            </Button>
                                        </div>
                                    </div>
                            }
                        </div>
                    }
                </div>
            )
        }
        return (
            <div className="Dots">
              <Dots
                color={'#3F51B5'}
              />
            </div>
        )
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}



const mapStateToProps = state => {
    return {};
};

const guessSong = withRouter(connect(mapStateToProps)(ConnectedGuessSong));
export default guessSong;


//https://material-ui.com/components/material-icons/#material-icons