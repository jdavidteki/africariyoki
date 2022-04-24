import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment"
import CircularProgress from "@material-ui/core/CircularProgress";
import Firebase from "../../firebase/firebase.js";
import TextField from "@material-ui/core/TextField";
import Song from '../song/Song'
import Button from "@material-ui/core/Button";
import ReplayIcon from '@material-ui/icons/Replay';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import CancelPresentationIcon from '@material-ui/icons/CancelPresentation';
import Select  from 'react-select';
import ArrowForward from '@material-ui/icons/ArrowForward'
import BarChartOutlinedIcon from '@material-ui/icons/BarChartOutlined';
import PersonIcon from '@material-ui/icons/Person';
import MetaTags from 'react-meta-tags';
import TweenOne from 'rc-tween-one';
import SvgMorphPlugin from 'rc-tween-one/lib/plugin/SvgMorphPlugin';
import AccessAlarmOutlinedIcon from '@material-ui/icons/AccessAlarmOutlined';
import { Analytics, PageHit } from 'expo-analytics';
import {ShuffleArray, CleanLine, HmsToSecondsOnly } from "../helpers/Helpers.js";
import  Result from '../result/Result.js'
import FuzzySet from 'fuzzyset.js'

TweenOne.plugins.push(SvgMorphPlugin);

// import 'bootstrap/dist/css/bootstrap.css';
// import "./PopularLine.css"
// import "../karaokedisplay/KaraokeDisplay.css"
import { nil } from "ajv";

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
    "beginner": 4,
    "amateur": 3,
    "professional": 2.5,
    "master": 2,
}

const startTimes = [45, 50, 55];
const selectedStartTime = Math.floor(Math.random() * startTimes.length);

class ConnectedPopularLine extends Component {

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
        openInfoPane: false,
        selectedOptionDuration: {value: 1, label: '1min'},
        selectedOptionDifficulty: {value: 'Beginner', label: 'beginner'},
        printResult: false,
        audioPaused: true,
        answerCorrect: true,
        nthLongestLineToShow: 0,
        db: null,
        optionBackground: '#d5c0f0',
        poplineObj: {},
        randomTruePopLine: "",
        prevTimeoutID: 0,
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
            this.updateFirebaseScoreBoard()

            this.setState({
                count:0,
                eventDate: moment.duration().add({days:0,hours:0,minutes:this.state.selectedOptionDuration.value,seconds:0}),
                secs:0,
                mins:this.state.selectedOptionDuration.value,
                audioPaused: true,
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
        Firebase.getScoreBoardPopularLine()
        .then(val => {
            let playerName = this.state.selectedOptionPlayerName === "" ? "yokibot" : this.state.selectedOptionPlayerName

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

            Firebase.updateScoreBoardPopularLine(val)
        })
    }

    componentDidMount(){
        const analytics = new Analytics('UA-187038287-1');
        analytics.hit(new PageHit('Popular Line'))
            .then(() => console.log("google analytics on game"))
            .catch(e => console.log(e.message));

        Firebase.getPopularLines().then(
            val => {
                if (val != undefined){
                    this.setState({poplineObj: val})
                }
            }
        )

        //try to load local songs file first
        let localSongs = JSON.parse(localStorage.getItem('lyrics'));
        if (localSongs != null){
            let localLyrics = localSongs['lyrics']
            let songInQuestionIndex = Math.floor(Math.random() * (localLyrics.length - 0) + 0);

            this.setState({
                randomTruePopLine: this.findRandomTruePopLine(localLyrics[songInQuestionIndex].id),
                songs: localLyrics,
                songInQuestionIndex: songInQuestionIndex,
                songInQuestion: localLyrics[songInQuestionIndex],
                songsInOption: this.generateSongsInOptions(localLyrics, localLyrics[songInQuestionIndex])
            })
        }

        //if there are atleast ten yokis downloaded
        let localYokis = JSON.parse(localStorage.getItem('yokis'));
        if (localYokis != null && localYokis['yokis'].length >=  10){
            let localYokisArray = Object.values(localYokis['yokis'])
            let songInQuestionIndex = Math.floor(Math.random() * (localYokisArray.length - 0) + 0);

            this.setState({
                randomTruePopLine: this.findRandomTruePopLine(localYokisArray[songInQuestionIndex].id),
                songs: localYokisArray,
                songInQuestionIndex: songInQuestionIndex,
                songInQuestion: localYokisArray[songInQuestionIndex],
                songsInOption: this.generateSongsInOptions(localYokisArray, localYokisArray[songInQuestionIndex])
            })
        }else{
            Firebase.getLyrics().then(
                val => {
                    val = val.filter(v => v.useForGames == 1);
                    let songInQuestionIndex = Math.floor(Math.random() * (val.length - 0) + 0);

                    this.setState({
                      randomTruePopLine: this.findRandomTruePopLine(val[songInQuestionIndex].id),
                      songs: val,
                      songInQuestionIndex: songInQuestionIndex,
                      songInQuestion: val[songInQuestionIndex],
                      songsInOption: this.generateSongsInOptions(val, val[songInQuestionIndex])
                    })
                }
            )
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

    findRandomTruePopLine = (songInQuestionId) => {
        let randomTruePopLine = ""

        if (this.state.poplineObj[songInQuestionId]){
            if (this.state.poplineObj[songInQuestionId].content){
                let content = this.state.poplineObj[songInQuestionId].content
                let popularLinesObj = JSON.parse(content.replaceAll("'", ""));

                let truePopLines = []
                for (const [key, value] of Object.entries(popularLinesObj)) {
                    if (value == true){
                        truePopLines.push(key)
                    }
                }

                randomTruePopLine = truePopLines[Math.floor(Math.random()*truePopLines.length)];
            }
        }
        return randomTruePopLine
    }


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
        return ShuffleArray(songsInOptions)
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
        let nthLongestLineToShow = Math.floor(Math.random() * 5);

        setTimeout( () => {
            if(document.getElementById(song.id) != undefined){
                document.getElementById(song.id).style.backgroundColor = '#d5c0f0'
            }

            //make it so that if they dont have the song locally, they can still fetch from the network
            this.setState({
                randomTruePopLine: this.findRandomTruePopLine(this.state.songs[songInQuestionIndex].id),
                nthLongestLineToShow: nthLongestLineToShow,
                songInQuestionIndex: songInQuestionIndex,
                songInQuestion: this.state.songs[songInQuestionIndex],
                songsInOption: this.generateSongsInOptions(this.state.songs, this.state.songs[songInQuestionIndex]),
                audioPaused: true
            });
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
            Firebase.getScoreBoardPopularLine()
            .then(val => {
                this.setState({highestscore: val[this.state.selectedOptionDifficulty.label][0].averageScore})
            })

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
            randomTruePopLine: this.findRandomTruePopLine(this.state.songs[songInQuestionIndex].id),
            songsInOption: this.generateSongsInOptions(this.state.songs, this.state.songs[songInQuestionIndex])
        })
    }

    playVocal(){
        clearTimeout(this.state.prevTimeoutID)
        if(this.audio != null && this.audio.duration > 0){
            var timeToStart = this.getPopLineTime(this.state.randomTruePopLine)

            if (!this.audio.src.includes("#t")){
                this.audio.setAttribute("src", this.audio.src + `#t=${timeToStart}`)
            }

            //wait for like 0.5sec before actually playing just incase it is paused
            setTimeout(()=>{
                this.audio.play();
                this.setState({audioPaused: false})
            }, 500);

            //update song plays
            Firebase.getLyricsById(this.state.songInQuestion.id).then(
                val => {
                    Firebase.updateNumPlays(this.state.songInQuestion.id, val.numPlays +=1)
                }
            )

            this.audio.currentTime = timeToStart
            const int = setTimeout(() => {
                if(this.audio != undefined){
                    this.audio.pause();
                    this.audio.currentTime = timeToStart
                    this.setState({audioPaused: true})
                    clearTimeout(int)
                }
            }, levelToPlaySec[this.state.selectedOptionDifficulty.label] * 1000);
            this.setState({prevTimeoutID: int})
        }
    }

    getPopLineTime(popularLine){
        let secTime = 0

        if(popularLine == ""){ //TODO: figure out a better way to do this
            popularLine = document.getElementById("PopularLine-lyricInQuestion").innerText;
        }

        let lyricsArray = this.state.songInQuestion.lyrics.split("\n")
        let poplineFuzzySet = FuzzySet(lyricsArray).get(popularLine)

        if (poplineFuzzySet!= null && poplineFuzzySet.length > 0){
            if (poplineFuzzySet[0].length > 0){
                secTime = HmsToSecondsOnly(poplineFuzzySet[0][1].substring(1, 9)) + parseInt(poplineFuzzySet[0][1].substring(7, 9), 10)
            }
        }

        if (isNaN(secTime) || secTime == 0){
            let midLyrics = lyricsArray[Math.round(lyricsArray.length / 2)]
            secTime = HmsToSecondsOnly(midLyrics.substring(1, 9)) + parseInt(midLyrics.substring(7, 9), 10)
        }

        return Math.round(secTime/1000)
    }

    render(){
        if (this.state.songInQuestion.title != "") {
            return (
                <div className="PopularLine">
                    <MetaTags>
                      <title>africariyoki - play with africa!</title>
                      <meta name="description" content="sing along to your favourite afro beat songs - guess the song" />
                      <meta property="og:title" content="africariyoki" />
                      <meta http-equiv='cache-control' content='no-cache' />
                      <meta http-equiv='expires' content='0' />
                      <meta http-equiv='pragma' content='no-cache' />
                    </MetaTags>
                    <div className="PopularLine-audioPlayer">
                        <audio
                            style={{display:"none"}}
                            className={"PopularLine-audio"}
                            ref={ref => this.audio = ref}
                            id="sample"
                            controls
                            src={
                                this.state.songInQuestion.audiourl.includes('africariyoki-4b634') ?
                                this.state.songInQuestion.audiourl.replace('/music/', '/vocals/') :
                                this.state.songInQuestion.audiourl.replace('africariyoki', 'africariyoki-4b634').replace('/music/', '/vocals/') //TODO: jesuye come back and do this bettter lol
                            }
                        />
                    </div>
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
                            className="PopularLine-setGameModel"
                        >
                            <div className="PopularLine-setGameModel-container pulse">
                                <TextField
                                    value={this.state.selectedOptionPlayerName}
                                    className="PopularLine-input PopularLine-gameOption"
                                    label={"enter player name"}
                                    onChange={this.handleChangePlayerName}
                                />

                                <Select
                                    value={this.state.selectedOptionDifficulty}
                                    className="PopularLine-gameOption"
                                    onChange={this.handleChangeDifficulty}
                                    options={DifficultyOptions}
                                    isSearchable={false}
                                    placeholder={"diffculty level"}
                                />

                                <Select
                                    value={this.state.selectedOptionDuration}
                                    className="PopularLine-gameOption"
                                    onChange={this.handleChangeDuration}
                                    options={DurationOptions}
                                    isSearchable={false}
                                    placeholder={"duration"}
                                />
                            </div>
                            <ArrowForward
                                fontSize={'large'}
                                className={"PopularLine-setGameModel-close"}
                                style={{ color: '#f7f8e4' }}
                                onClick={()=>{
                                    this.startGame()
                                }}
                            />

                        </TweenOne>
                    :
                        <div className="PopularLine-wrapper">
                            {this.state.printResult
                            ?
                                <Result
                                    playerName = {this.state.selectedOptionPlayerName == "" ? 'yokibot' : this.state.selectedOptionPlayerName}
                                    difficultyLevel = {this.state.selectedOptionDifficulty.label}
                                    score = {this.state.score}
                                    optionDuration = {this.state.selectedOptionDuration.label}
                                    restartGame = {() => this.restartGame()}
                                    btnBackgroundColor = {'#131c96'}
                                    btnTextColor = {'white'}
                                    modifier = {'CompleteLyrics'}
                                    backgroundColor = {'#f0ffff'}
                                />
                            :
                                <TweenOne
                                    animation={
                                        [
                                            { right: '-10px', duration: 2000 },
                                            { right: '0', duration: 2000 }
                                        ]
                                    }
                                    paused={false}
                                    className="PopularLine-display"
                                >
                                    <div className="PopularLine-title">
                                       <span>what song is this line from?</span>
                                    </div>
                                    <div className="PopularLine-lyricInQuestion" id="PopularLine-lyricInQuestion">
                                        {getPopularLine(this.state.randomTruePopLine, this.state.songInQuestion, this.state.nthLongestLineToShow) }
                                    </div>
                                    <div className="PopularLine-controlMenu">
                                        <div className="PopularLine-controlMenuInfo">
                                            <div className="PopularLine-controlMenuInfoChild"> <PersonIcon /> {this.state.selectedOptionPlayerName == "" ? 'yokibot' : this.state.selectedOptionPlayerName}</div>
                                            <div className="PopularLine-controlMenuInfoChild">top score/min: {this.state.highestscore}</div>
                                            <div className="PopularLine-controlMenuInfoChild"><BarChartOutlinedIcon /> {this.state.selectedOptionDifficulty.label}</div>
                                            <div className="PopularLine-controlMenuInfoChild">
                                                {this.state.answerCorrect
                                                    ?
                                                    (<CheckBoxOutlinedIcon />)
                                                    :
                                                    (<CancelPresentationIcon />)
                                                }
                                                &nbsp; {this.state.score}
                                            </div>
                                            <div className="PopularLine-controlMenuInfoChild"><AccessAlarmOutlinedIcon /> {`${this.state.mins} : ${this.state.secs}`}</div>
                                        </div>
                                    </div>
                                    <div className="PopularLine-options">
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
                                    <div className="PopularLine-lowerMenu">
                                        <Button variant="contained" style={{backgroundColor: '#131c96', color: 'white'}} onClick={() => this.restartGame()}>
                                            <ReplayIcon />
                                        </Button>
                                        {this.audio.duration > 0 &&
                                            <Button variant="contained" className={this.state.audioPaused ? '' : 'shaking'} style={{backgroundColor: '#131c96', color: 'white'}} onClick={() => this.playVocal()}>
                                                choks
                                            </Button>
                                        }
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

function getPopularLine(randomTruePopLine, songObject, nthLongestLineToShow){
    if(randomTruePopLine != ""){
        return randomTruePopLine
    }

    let lyricsArray = songObject.lyrics.split("\n").sort((a, b) => b.length - a.length);
    let lineToReturn = lyricsArray[nthLongestLineToShow]

    return CleanLine(lineToReturn)
}

const mapStateToProps = state => {
    return {};
};

const PopularLine = withRouter(connect(mapStateToProps)(ConnectedPopularLine));
export default PopularLine;


//https://material-ui.com/components/material-icons/#material-icons