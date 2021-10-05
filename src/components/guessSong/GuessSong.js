import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment"
import CircularProgress from "@material-ui/core/CircularProgress";
import Firebase from "../../firebase/firebase.js";
import TextField from "@material-ui/core/TextField";
import Song from '../song/Song'
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Button from "@material-ui/core/Button";
import ReplayIcon from '@material-ui/icons/Replay';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import Select  from 'react-select';
import ArrowForward from '@material-ui/icons/ArrowForward'
import TrendingUpOutlinedIcon from '@material-ui/icons/TrendingUpOutlined';
import BarChartOutlinedIcon from '@material-ui/icons/BarChartOutlined';
import PersonIcon from '@material-ui/icons/Person';
import MetaTags from 'react-meta-tags';
import TweenOne from 'rc-tween-one';
import SvgMorphPlugin from 'rc-tween-one/lib/plugin/SvgMorphPlugin';
import AccessAlarmOutlinedIcon from '@material-ui/icons/AccessAlarmOutlined';
import { Analytics, PageHit } from 'expo-analytics';
import { Emoji } from 'emoji-mart'
import LocalSongObject from "../../assets/json/africariyoki-4b634-default-rtdb-lyrics-export.json"

TweenOne.plugins.push(SvgMorphPlugin);

import 'bootstrap/dist/css/bootstrap.css';
import "./GuessSong.css"
import "../karaokedisplay/KaraokeDisplay.css"

const DifficultyOptions = [
    { value: 'Beginner', label: 'beginner' },
    { value: 'Amateur', label: 'amateur' },
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
    "amateur": 4,
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
        highestscore:0,
        setGameModel: true,
        selectedOptionPlayerName: "",
        pauseSetGameModal: true,
        moment: null,
        reverse: false,
        selectedOptionDuration: {value: 1, label: '1min'},
        selectedOptionDifficulty: {value: 'Beginner', label: 'beginner'},
        printResult: false,
        audioPaused: true,
        answerCorrect: true,
        songInQuestion: {
            audiourl: '',
            singer: '',
            title: '',
            lyrics: '',
            id: '',
        },
    };

    audio=null

    updateTimer=()=>{
        const x = setInterval(()=>{
          let { eventDate} = this.state

        if(eventDate <=0){
            if(this.state.score > this.state.highestscore){
                Firebase.updateHighestScore(this.state.score, this.state.selectedOptionDifficulty.label)
            }

            this.setState({
                count:0,
                eventDate: moment.duration().add({days:0,hours:0,minutes:this.state.selectedOptionDuration.value,seconds:0}),
                secs:0,
                mins:this.state.selectedOptionDuration.value,
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
        const analytics = new Analytics('UA-187038287-1');
        analytics.hit(new PageHit('Game'))
            .then(() => console.log("google analytics on game"))
            .catch(e => console.log(e.message));

        //try to load local json file first
        var LocalSongList = Object.values(LocalSongObject)
        let songInQuestionIndex = Math.floor(Math.random() * (LocalSongList.length - 0) + 0);
        console.log("LocalSongList", LocalSongList)
        this.setState({
          songs: LocalSongList,
          songInQuestionIndex: songInQuestionIndex,
          songInQuestion: LocalSongList[songInQuestionIndex],
          songsInOption: this.generateSongsInOptions(LocalSongList, LocalSongList[songInQuestionIndex])
        })

        Firebase.getLyrics().then(
            val => {
                let songInQuestionIndex = Math.floor(Math.random() * (val.length - 0) + 0);

                this.setState({
                  songs: val,
                  songInQuestionIndex: songInQuestionIndex,
                  songInQuestion: val[songInQuestionIndex],
                  songsInOption: this.generateSongsInOptions(val, val[songInQuestionIndex])
                })

                //downloading all songs to be used in game
                for (var i = 0; i < val.length; i++){
                  let songId = val[i].id

                  console.log("downloading...", songId)

                  var requestOptions = {
                    method: 'GET',
                    redirect: 'follow',
                    mode: 'no-cors'
                  };

                  fetch(`https://storage.googleapis.com/africariyoki-4b634.appspot.com/music/${songId}.mp3`, requestOptions)
                  .then(response => response.text())
                  .then(result => console.log(result))
                  .catch(error => console.log('error',error));
                }
            }
        )
    }

    play(){
        if(this.audio != null){
            this.audio.currentTime = 40;
            this.audio.play();
            this.setState({audioPaused: false})

            //update song plays
            Firebase.getLyricsById(this.state.songInQuestion.id).then(
                val => {
                    Firebase.updateNumPlays(this.state.songInQuestion.id, val.numPlays +=1)
                }
            )

            var int = setInterval(() => {
                if (this.audio != null && this.audio.currentTime > 40 + levelToPlaySec[this.state.selectedOptionDifficulty.label]) {
                    this.audio.pause();
                    this.setState({audioPaused: true})
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

        for(var i=0; i<3; i++){
            let random = Math.floor(Math.random() * (allSongs.length - 0) + 0);

            if(!songsInOptions.includes(allSongs[random])){
                songsInOptions.push(allSongs[random])
            }else{
                i-=1
            }
        }
        return shuffleArray(songsInOptions)
    }

    checkAnswer(song){
        if(song == this.state.songInQuestion){
            this.setState({score: this.state.score+=1, answerCorrect: true})
            document.getElementById(song.id).style.backgroundColor = 'green' //TODO: figure out a better way of doing this
        }else{
            this.setState({score: this.state.score-=1, answerCorrect: false})
            document.getElementById(song.id).style.backgroundColor = 'red'
        }

        let songInQuestionIndex = Math.floor(Math.random() * (this.state.songs.length - 0) + 0);
        this.setState({
            audioPaused: true,
            songInQuestionIndex: songInQuestionIndex,
            songInQuestion: this.state.songs[songInQuestionIndex],
        })

        setTimeout( () => {
            this.setState({
                songsInOption: this.generateSongsInOptions(this.state.songs, this.state.songs[songInQuestionIndex])
            })
        }, 400);
    }

    startGame(){
        this.setState({
            pauseSetGameModal: false,
            reverse: false,
            moment: 0,
        }, () => {
            this.setState({
              moment: null,
            });
        });

        //actually start game
        setTimeout(()=>{
            Firebase.getHighestScore().then(
                val=> {
                    this.setState({highestscore: val[this.state.selectedOptionDifficulty.label].score})
                }
            )

            this.updateTimer()
            this.setState({
                setGameModel: false,
                printResult: false,
                audioPaused: true,
                answerCorrect: true,
                eventDate: moment.duration().add({days:0,hours:0,minutes:this.state.selectedOptionDuration.value,seconds:0}),
            })
        }, 900)
    }

    restartGame(){
        let songInQuestionIndex = Math.floor(Math.random() * (this.state.songs.length - 0) + 0);
        this.setState({
            count:0,
            eventDate: moment.duration().add({days:0,hours:0,minutes:0,seconds:0}),
            secs:0,
            mins:0,
            score: 0,
            pauseSetGameModal: true,
            setGameModel: true,
            printResult: false,
            audioPaused: true,
            answerCorrect: true,
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
            return "baldadashhh mtchew"
        }

        if(this.state.score >= 15 && this.state.score < 20){
            return "like mr macaroni, you are doing well"
        }

        if(this.state.score >= 20 && this.state.score < 25){
            return "fantabulous"
        }

        if(this.state.score >= 25 && this.state.score < 30){
            return "you have too much pride, try to be calming down"
        }

        if(this.state.score >= 30 && this.state.score < 35){
            return "nice, we love to see it!"
        }
    }

    render() {
        if (this.state.songInQuestion.title != "") {
            return (
                <div className="GuessSong">
                    <MetaTags>
                      <title>africariyoki - sing with africa!</title>
                      <meta name="description" content="sing along to your favourite afro beat songs - guess the song" />
                      <meta property="og:title" content="africariyoki" />
                      <meta http-equiv='cache-control' content='no-cache' />
                      <meta http-equiv='expires' content='0' />
                      <meta http-equiv='pragma' content='no-cache' />
                    </MetaTags>
                    {this.state.setGameModel
                    ?
                        <TweenOne
                            animation={{
                                x: 0,
                                scale: 0.5,
                                rotate: 120,
                                yoyo: false,
                                repeat: 0,
                                duration: 1000
                            }}
                            paused={this.state.pauseSetGameModal}
                            reverse={this.state.reverse}
                            moment={this.state.moment}
                            className="GuessSong-setGameModel"
                        >
                            <div className="GuessSong-setGameModel-container pulse">
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

                        </TweenOne>
                    :
                        <div className="GuessSong-wrapper">
                            {this.state.printResult
                            ?
                                <div className="GuessSong-results pulse">
                                    <div className="GuessSong-results-title">Result:</div>
                                    <div className="GuessSong-gameOption"><PersonIcon /> {this.state.selectedOptionPlayerName == "" ? 'anonimo' : this.state.selectedOptionPlayerName}</div>
                                    <div className="GuessSong-gameOption"><BarChartOutlinedIcon /> {this.state.selectedOptionDifficulty.label}</div>
                                    <div className="GuessSong-gameOption"><TrendingUpOutlinedIcon /> {this.state.score}</div>
                                    <div className="GuessSong-gameOption"><AccessAlarmOutlinedIcon /> {this.state.selectedOptionDuration.label}</div>
                                    <div className="GuessSong-gameOption GuessSong-comment">
                                        {this.getComment()}
                                        <Emoji
                                            emoji={'grapes'}
                                            set='apple'
                                            size={18}
                                        />
                                    </div>
                                    <Button style={{backgroundColor: '#0f750f', color: 'white', marginTop: '30px'}} variant="contained" color="primary" onClick={() => this.restartGame()}>
                                        play again
                                    </Button>
                                </div>
                            :
                                <TweenOne
                                    animation={
                                        [
                                            { right: '-10px', duration: 2000 },
                                            { right: '0', duration: 2000 }
                                        ]
                                    }
                                    paused={false}
                                    className="GuessSong-display"
                                >

                                    <div className="GuessSong-title">guess the song</div>
                                    <div>press play to listen to snippet</div>
                                    <div className="GuessSong-controlMenu">
                                        <Button
                                            class={this.state.audioPaused ? "GuessSong-playArrowIcon" : "GuessSong-playArrowIcon shaking"}
                                            variant="contained" color="primary" onClick={() => this.play()}
                                        >
                                            <PlayArrowIcon fontSize="large" />
                                        </Button>

                                        <div className="GuessSong-controlMenuInfo">
                                            <div className="GuessSong-controlMenuInfoChild"> <PersonIcon /> {this.state.selectedOptionPlayerName == "" ? 'anonimo' : this.state.selectedOptionPlayerName}</div>
                                            <div className="GuessSong-controlMenuInfoChild">top score: {this.state.highestscore}</div>
                                            <div className="GuessSong-controlMenuInfoChild"><BarChartOutlinedIcon /> {this.state.selectedOptionDifficulty.label}</div>
                                            <div className="GuessSong-controlMenuInfoChild">
                                                {this.state.answerCorrect
                                                    ?
                                                    (<CheckBoxOutlinedIcon />)
                                                    :
                                                    (<CancelPresentationIcon />)
                                                }
                                                &nbsp; {this.state.score}
                                            </div>
                                            <div className="GuessSong-controlMenuInfoChild"><AccessAlarmOutlinedIcon /> {`${this.state.mins} : ${this.state.secs}`}</div>
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
                                                backgroundColor={this.state.optionBackground}
                                                countries={song.countries}
                                            />
                                        )}
                                    </div>
                                    <div className="GuessSong-lowerMenu">
                                        <Button variant="contained" style={{backgroundColor: '#0f750f', color: 'white'}} onClick={() => this.restartGame()}>
                                            <ReplayIcon />
                                        </Button>
                                    </div>
                                </TweenOne>
                            }
                        </div>
                    }
                </div>
            )
        }
        return (
            <div className="Dots">
                <div><CircularProgress /></div>
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