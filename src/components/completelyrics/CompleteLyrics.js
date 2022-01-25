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
import { GetComments, GetEmojiFromComments } from "../helpers/Helpers.js";

TweenOne.plugins.push(SvgMorphPlugin);

import 'bootstrap/dist/css/bootstrap.css';
import "./CompleteLyrics.css"
import "../karaokedisplay/KaraokeDisplay.css"

const DifficultyOptions = [
    { value: 'Beginner', label: 'beginner' },
    { value: 'Amateur', label: 'amateur' },
    { value: 'Professional,', label: 'professional' },
    { value: 'Master', label: 'master' },
];

const DurationOptions = [
    {value: 3, label: '3mins'},
    {value: 5, label: '5mins'},
    {value: 10, label: '10mins'},
];

const levelToPlaySec = {
    "beginner": 5,
    "amateur": 4,
    "professional": 3,
    "master": 2.5,
}

class ConnectedCompleteLyrics extends Component {

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
        selectedOptionDuration: {value: 3, label: '3mins'},
        selectedOptionDifficulty: {value: 'Beginner', label: 'beginner'},
        printResult: false,
        showChoks: false,
        answerCorrect: true,
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
            this.updateFirebaseScoreBoard()

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

    updateFirebaseScoreBoard(){
        Firebase.getScoreBoardNextLine()
        .then(val => {
            let playerName = this.state.selectedOptionPlayerName === "" ? "anonimo" : this.state.selectedOptionPlayerName

            val[this.state.selectedOptionDifficulty.label].push({
                "rank": 1,
                "name": playerName,
                "score": this.state.score,
                "duration": this.state.selectedOptionDuration.value,
                "averageScore": Number((this.state.score/this.state.selectedOptionDuration.value).toFixed(2)),
            });

            val[this.state.selectedOptionDifficulty.label].sort((a, b) => (a.averageScore < b.averageScore) ? 1 : -1)

            for (let step = 0; step < val[this.state.selectedOptionDifficulty.label].length; step++) {
                if(val[this.state.selectedOptionDifficulty.label][step]){
                    if(step > 0 && val[this.state.selectedOptionDifficulty.label][step].averageScore == val[this.state.selectedOptionDifficulty.label][step-1].averageScore){
                        val[this.state.selectedOptionDifficulty.label][step].rank = val[this.state.selectedOptionDifficulty.label][step-1].rank
                    }else{
                        val[this.state.selectedOptionDifficulty.label][step].rank = step + 1
                    }
                }
            }

            val[this.state.selectedOptionDifficulty.label] = val[this.state.selectedOptionDifficulty.label].slice(0, 10)

            Firebase.updateScoreBoardNextLine(val)
        })
    }

    componentDidMount(){
        const analytics = new Analytics('UA-187038287-1');
        analytics.hit(new PageHit('CompleteTheLyrics'))
            .then(() => console.log("google analytics on complete the lyric"))
            .catch(e => console.log(e.message));

        Firebase.getLyrics().then(
            val => {
                val = val.filter(v => v.useForGames == 1);
                let songInQuestionIndex = Math.floor(Math.random() * (val.length - 0) + 0);

                this.setState({
                    songs: val,
                    songInQuestionIndex: songInQuestionIndex,
                    songInQuestion: val[songInQuestionIndex],
                    lyricAndOptionObj: this.getLyricAndOptionObj(val, songInQuestionIndex),
                })
            }
        )
    }

    getLyricAndOptionObj(val, songInQuestionIndex){
        let songInQuestionId = val[songInQuestionIndex].id
        let lyricArrayBySongId = this.getLyricsArrayBySongId(val)
        let lyricArray = lyricArrayBySongId[songInQuestionId]
        let lyricQuestionLineId = Math.floor(Math.random() * (lyricArray.length - 1) + 0);
        let lyricQuestion = lyricArray[lyricQuestionLineId]
        let lyricAnswer = lyricArray[lyricQuestionLineId + 1]
        let lyricOptions = this.generateLyricsInOptions(lyricArrayBySongId, lyricAnswer)
        let lyricAndOptionObj = {
            "question": cleanLine(lyricQuestion),
            "answer": cleanLine(lyricAnswer),
            "lyricOptions": lyricOptions,
        }

        return lyricAndOptionObj
    }

    getLyricsArrayBySongId(val){
        let labsi = {}

        for (var i = 0; i < val.length; i++){
            let lyricArray = val[i].lyrics.split('\n')

            for (var j=0; j<lyricArray.length; j++){
                labsi[val[i].id] = val[i].lyrics.split('\n')
            }
        }
        return labsi
    }

    generateLyricsInOptions(labsi, lyricAnswer){
        let lyricFromAllSongs = Object.values(labsi)

        let lyricsInOptions = [cleanLine(lyricAnswer)]

        for(var i=0; i<3; i++){
            let randomSong = Math.floor(Math.random() * (lyricFromAllSongs.length - 0) + 0);

            let songOption = lyricFromAllSongs[randomSong]

            let randomSongLine = Math.floor(Math.random() * (songOption.length - 0) + 0);

            if(!lyricsInOptions.includes(cleanLine(lyricFromAllSongs[randomSong][randomSongLine]))){
                lyricsInOptions.push(cleanLine(lyricFromAllSongs[randomSong][randomSongLine]))
            }else{
                i-=1
            }
        }

        return shuffleArray(lyricsInOptions)
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

    checkAnswer(lyricOption){
        if(lyricOption == this.state.lyricAndOptionObj["answer"]){
            this.setState({
                score: this.state.score+=1,
                answerCorrect: true,
            })
        }else{
            this.setState({
                score: this.state.score-=1,
                answerCorrect: false,
            })
        }

        let songInQuestionIndex = Math.floor(Math.random() * (this.state.songs.length - 0) + 0);

        this.setState({
            songInQuestionIndex: songInQuestionIndex,
            songInQuestion: this.state.songs[songInQuestionIndex],
            lyricAndOptionObj: this.getLyricAndOptionObj(this.state.songs, songInQuestionIndex)
        })
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
            Firebase.getScoreBoardNextLine()
            .then(val => {
                this.setState({highestscore: val[this.state.selectedOptionDifficulty.label][0].averageScore})
            })

            this.updateTimer()
            this.setState({
                setGameModel: false,
                printResult: false,
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
            songInQuestionIndex: songInQuestionIndex,
            songInQuestion: this.state.songs[songInQuestionIndex],
            lyricAndOptionObj: this.getLyricAndOptionObj(this.state.songs, songInQuestionIndex),
        })
    }

    toggleChoks(){
        if(this.state.showChoks){
            this.setState({showChoks: false})
        }else{
            this.setState({showChoks: true})
        }
    }

    play(){
        if(this.audio != null){
            this.audio.currentTime = 40;
            this.audio.play();

            //update song plays
            Firebase.getLyricsById(this.state.songInQuestion.id).then(
                val => {
                  Firebase.updateNumPlays(this.state.songInQuestion.id, val.numPlays +=1)
                }
            )

            var int = setInterval(() => {
                if (this.audio != null && this.audio.currentTime > 40 + levelToPlaySec[this.state.selectedOptionDifficulty.label]) {
                    this.audio.pause();
                    clearInterval(int);
                }
            }, 10);
        }
    }

    render() {
        if (this.state.lyricAndOptionObj != undefined) {
            return (
                <div className="CompleteLyrics">
                    <MetaTags>
                      <title>africariyoki - karaoke with africa!</title>
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
                            className="CompleteLyrics-setGameModel"
                        >
                            <div className="CompleteLyrics-setGameModel-container pulse">
                                <TextField
                                    value={this.state.selectedOptionPlayerName}
                                    className="CompleteLyrics-input CompleteLyrics-gameOption"
                                    label={"enter player name"}
                                    onChange={this.handleChangePlayerName}
                                />

                                <Select
                                    value={this.state.selectedOptionDifficulty}
                                    className="CompleteLyrics-gameOption"
                                    onChange={this.handleChangeDifficulty}
                                    options={DifficultyOptions}
                                    isSearchable={false}
                                    placeholder={"diffculty level"}
                                />

                                <Select
                                    value={this.state.selectedOptionDuration}
                                    className="CompleteLyrics-gameOption"
                                    onChange={this.handleChangeDuration}
                                    options={DurationOptions}
                                    isSearchable={false}
                                    placeholder={"duration"}
                                />
                            </div>
                            <ArrowForward
                                fontSize={'large'}
                                className={"CompleteLyrics-setGameModel-close"}
                                style={{ color: '#f7f8e4' }}
                                onClick={()=>{
                                    this.startGame()
                                }}
                            />

                        </TweenOne>
                    :
                        <div className="CompleteLyrics-wrapper">
                            {this.state.printResult
                            ?
                                <div className="CompleteLyrics-results pulse">
                                    <div className="CompleteLyrics-results-title">Result</div>
                                    <div className="CompleteLyrics-gameOption"><PersonIcon /> {this.state.selectedOptionPlayerName == "" ? 'anonimo' : this.state.selectedOptionPlayerName}</div>
                                    <div className="CompleteLyrics-gameOption"><BarChartOutlinedIcon /> {this.state.selectedOptionDifficulty.label}</div>
                                    <div className="CompleteLyrics-gameOption"><TrendingUpOutlinedIcon /> {this.state.score}</div>
                                    <div className="CompleteLyrics-gameOption"><AccessAlarmOutlinedIcon /> {this.state.selectedOptionDuration.label}</div>
                                    <div className="CompleteLyrics-gameOption CompleteLyrics-comment">
                                        {GetComments(this.state.score) + " "}
                                        <Emoji
                                            emoji={GetEmojiFromComments(GetComments(this.state.score))}
                                            set='apple'
                                            size={18}
                                        />
                                    </div>
                                    <Button style={{backgroundColor: '#3413f1', color: 'white', marginTop: '30px'}} variant="contained" color="primary" onClick={() => this.restartGame()}>
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
                                    className="CompleteLyrics-display"
                                    style={{ margin: 'auto' }}
                                >
                                    <div className="CompleteLyrics-title">[wip] what is the next line? </div>
                                    <div className="CompleteLyrics-lyricInQuestion">
                                        {this.state.lyricAndOptionObj["question"] ? this.state.lyricAndOptionObj["question"] : this.state.songInQuestion.title }
                                    </div>
                                    <div className="CompleteLyrics-controlMenu">
                                        <Button style={{backgroundColor: '#3413f1', color: 'white'}} variant="contained" color="primary" onClick={() => this.play()}>
                                            <PlayArrowIcon />
                                        </Button>
                                        <div className="CompleteLyrics-controlMenuInfo">
                                            <div className="CompleteLyrics-controlMenuInfoChild"> <PersonIcon /> {this.state.selectedOptionPlayerName == "" ? 'anonimo' : this.state.selectedOptionPlayerName}</div>
                                            <div className="CompleteLyrics-controlMenuInfoChild">top score/min: {this.state.highestscore}</div>
                                            <div className="CompleteLyrics-controlMenuInfoChild"><BarChartOutlinedIcon /> {this.state.selectedOptionDifficulty.label}</div>
                                            <div className="CompleteLyrics-controlMenuInfoChild">
                                                {this.state.answerCorrect
                                                    ?
                                                    (<CheckBoxOutlinedIcon />)
                                                    :
                                                    (<CancelPresentationIcon />)
                                                }
                                                {this.state.score}
                                            </div>
                                            <div className="CompleteLyrics-controlMenuInfoChild"><AccessAlarmOutlinedIcon /> {`${this.state.mins} : ${this.state.secs}`}</div>
                                        </div>
                                    </div>
                                    <div className="CompleteLyrics-audioPlayer">
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
                                    <div className="CompleteLyrics-options">
                                        {this.state.lyricAndOptionObj["lyricOptions"].map((lyricOption) =>
                                            <div
                                                className="CompleteLyrics-option"
                                                onClick={()=>this.checkAnswer(lyricOption)}
                                                key={lyricOption}
                                            >
                                                    {lyricOption}
                                            </div>
                                        )}
                                    </div>
                                    <div className="CompleteLyrics-lowerMenu">
                                        <Button variant="contained" style={{backgroundColor: '#3413f1', color: 'white'}} onClick={() => this.toggleChoks()}>
                                            Chokolo
                                        </Button>

                                        {this.state.showChoks &&
                                            <div className="CompleteLyrics-showChoks">
                                                <div>hints:</div>
                                                <div>{this.state.songInQuestion.title ? 'title: ' +  this.state.songInQuestion.title : ''}</div>
                                                <div>{this.state.songInQuestion.singer ? 'artist: ' +  this.state.songInQuestion.singer : ''}</div>
                                                <div>{this.state.songInQuestion.album ? 'album: ' +  this.state.songInQuestion.album : ''}</div>
                                            </div>
                                        }

                                        <Button variant="contained" style={{backgroundColor: '#3413f1', color: 'white'}} onClick={() => this.restartGame()}>
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

function cleanLine(string){
    if (string != undefined){
        return string.substr(10).toLowerCase().replace("by rentanadvisercom", '***').replace("ing soon", 'no dey do like bolo')
    }
    return ""
}


const mapStateToProps = state => {
    return {};
};

const completeLyrics = withRouter(connect(mapStateToProps)(ConnectedCompleteLyrics));
export default completeLyrics;


//https://material-ui.com/components/material-icons/#material-icons