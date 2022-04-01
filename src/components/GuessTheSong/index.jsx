import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import SetGameModal from "../SetGameModal";
import GameResult from "../GameResult";
import GTSPlay from "../GTSPlay";
import Header from "../Header2";
import FooterMenuFooterDefault from "../FooterMenuFooterDefault";
import { GetRandomBackground, ShuffleArray } from "../helpers/Helpers";
import Firebase from "../../firebase/firebase.js";
import { Analytics, PageHit } from 'expo-analytics';
import moment from "moment"
import TempBackground from "../../../static/img/whitebackground.png"

import "./GuessTheSong.css";

const levelToPlaySec = {
  "beginner": 5,
  "amateur": 4,
  "ancestor": 2.5
}

const startTimes = [0.25, 0.5, 0.75, 0.8];

class ConnectedGuessTheSong extends Component {
  constructor(props){
    super(props);

    this.state= {
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
      selectedOptionDuration: 1,
      selectedOptionDifficulty: 'beginner',
      printResult: false,
      audioPaused: true,
      answerCorrect: true,
      songInQuestionBlob: '',
      db: null,
      prevTimeoutID: 0,
      songInQuestion: {
          audiourl: '',
          singer: '',
          title: '',
          lyrics: '',
          id: '',
      },
      overlapGroup: TempBackground,
    }
  }

  updateTimer=()=>{
    const x = setInterval(()=>{
      let { eventDate} = this.state

    if(eventDate <=0){
      this.updateFirebaseScoreBoard()

      this.setState({
          count:0,
          eventDate: moment.duration().add({days:0,hours:0,minutes:this.state.selectedOptionDuration,seconds:0}),
          secs:0,
          mins:this.state.selectedOptionDuration,
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
      Firebase.getScoreBoardGuessSong()
      .then(val => {
          let playerName = this.state.selectedOptionPlayerName === "" ? "yokibot" : this.state.selectedOptionPlayerName

          val[this.state.selectedOptionDifficulty].push({
              "rank": 1,
              "name": playerName,
              "score": this.state.score,
              "duration": this.state.selectedOptionDuration,
              "averageScore": Number((this.state.score/this.state.selectedOptionDuration).toFixed(2)),
          });

          val[this.state.selectedOptionDifficulty].sort((a, b) => (a.averageScore < b.averageScore) ? 1 : -1)

          for (let step = 0; step < val[this.state.selectedOptionDifficulty].length; step++) {
              if(val[this.state.selectedOptionDifficulty][step]){
                  if(step > 0 && val[this.state.selectedOptionDifficulty][step].averageScore == val[this.state.selectedOptionDifficulty][step-1].averageScore){
                      val[this.state.selectedOptionDifficulty][step].rank = val[this.state.selectedOptionDifficulty][step-1].rank
                  }else{
                      val[this.state.selectedOptionDifficulty][step].rank = step + 1
                  }
              }
          }

          val[this.state.selectedOptionDifficulty] = val[this.state.selectedOptionDifficulty].slice(0, 10)

          Firebase.updateScoreBoardGuessSong(val)
      })
  }

  componentDidMount(){
    setTimeout( () => {
      this.setState({
        overlapGroup: GetRandomBackground(""),
      })
    }, 500);

    const analytics = new Analytics('UA-187038287-1');
    analytics.hit(new PageHit('GuessTheSong'))
      .then(() => console.log("google analytics on searcher"))
      .catch(e => console.log(e.message));


    //open indexdb to read yokis
    var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
        dbVersion =  1000000000

    // Create/open database --this is like a variable block in javascript
    var request = indexedDB.open("yokisFolder", dbVersion),
        db

    request.onsuccess = (event) =>  {
        db = request.result;
        this.setState({db: db})
    }

    request.onupgradeneeded = function (event) {
        //TODO: re-write this entire function pls
        db = event.target.result
        console.log("Creating objectStore", db)
        db.createObjectStore("yokis");
    };

    // const analytics = new Analytics('UA-187038287-1');
    // analytics.hit(new PageHit('Guess Song'))
    //     .then(() => console.log("google analytics on game"))
    //     .catch(e => console.log(e.message));


    //try to load local songs file first
    let localSongs = JSON.parse(localStorage.getItem('lyrics'));
    if (localSongs != null){
        let localLyrics = localSongs['lyrics']
        let songInQuestionIndex = Math.floor(Math.random() * (localLyrics.length - 0) + 0);

        this.setState({
            songs: localLyrics,
            songInQuestionIndex: songInQuestionIndex,
            songInQuestion: localLyrics[songInQuestionIndex],
            songsInOption: this.generateSongsInOptions(localLyrics, localLyrics[songInQuestionIndex])
        })
    }

    //if there are atleast ten yokis downloaded
    let localYokis = JSON.parse(localStorage.getItem('yokis'));
    if (localYokis != null && localYokis['yokis'].length >=  10){
      let localYokisArray = Object.values(localYokis['yokis']).filter(v => v.useForGames == 1);
      let songInQuestionIndex = Math.floor(Math.random() * (localYokisArray.length - 0) + 0);

      this.setState({
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
            songs: val,
            songInQuestionIndex: songInQuestionIndex,
            songInQuestion: val[songInQuestionIndex],
            songsInOption: this.generateSongsInOptions(val, val[songInQuestionIndex])
          })
        }
      )
    }
  }

  play = () => {
    //clear timeout to make sure that if user clicks play while something else was playing
    clearTimeout(this.state.prevTimeoutID)
    var transaction = this.state.db.transaction(["yokis"], 'readwrite');

    transaction.objectStore("yokis").get(this.state.songInQuestion.id).onsuccess = event => {

      var soundFile = event.target.result;
      var selectedStartTime = startTimes[Math.floor(Math.random()*startTimes.length)];
      // Get window.URL object
      var URL = window.URL || window.webkitURL;

      if(this.audio != null && this.audio.duration > 0){
        selectedStartTime = this.audio.duration * selectedStartTime
        if (soundFile != undefined){
            var soundURL = URL.createObjectURL(soundFile);
            this.audio.setAttribute("src", soundURL + `#t=${selectedStartTime}`)
        }else{
          if (!this.audio.src.includes("#t")){
            this.audio.setAttribute("src", this.audio.src + `#t=${selectedStartTime}`)
          }
        }

        this.audio.play();
        this.setState({audioPaused: false})

        //update song plays
        Firebase.getLyricsById(this.state.songInQuestion.id).then(
          val => {
            Firebase.updateNumPlays(this.state.songInQuestion.id, val.numPlays +=1)
          }
        )

        const int = setTimeout(() => {
          if(this.audio != undefined &&
              !this.state.audioPaused &&
              selectedStartTime + levelToPlaySec[this.state.selectedOptionDifficulty] > this.audio.currentTime )
          {
              this.audio.pause();
              this.audio.setAttribute("currentTime", selectedStartTime)
              this.setState({audioPaused: true})
              clearTimeout(int)
          }
        }, levelToPlaySec[this.state.selectedOptionDifficulty] * 1000);

        this.setState({prevTimeoutID: int})
      }
    }
  }

  handleChangePlayerName = selectedOptionPlayerName => {
    let playerName = selectedOptionPlayerName.target.value
    if (playerName.length > 15) {
      playerName =  playerName.slice(15)
    }

    this.setState({ selectedOptionPlayerName: playerName });
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
      return ShuffleArray(songsInOptions)
  }

  checkAnswer = (songId) => {
    if(songId == this.state.songInQuestion.id){
      this.setState({score: this.state.score+=1, answerCorrect: true})
      document.getElementById(songId).classList.add('correct-answer') //TODO: figure out a better way of doing this
    }else{
      this.setState({score: this.state.score-=1, answerCorrect: false})
      document.getElementById(songId).classList.add('wrong-answer')
    }

    let songInQuestionIndex = Math.floor(Math.random() * (this.state.songs.length - 0) + 0);
    this.setState({
        audioPaused: true,
        songInQuestionIndex: songInQuestionIndex,
        songInQuestion: this.state.songs[songInQuestionIndex],
    }, () => {
      setTimeout( () => {
        if( document.getElementById(songId) != undefined){
            document.getElementById(songId).style.backgroundColor = '#c0f0c0'
        }

        //make it so that if they dont have the song locally, they can still fetch from the network
        this.setState({
            songsInOption: this.generateSongsInOptions(this.state.songs, this.state.songs[songInQuestionIndex])
        },() => {
            this.play() //play next song immediately after old song
        });
      }, 500);
    })
  }

  startGame = () => {
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

      Firebase.getScoreBoardGuessSong()
      .then(val => {
        this.setState({highestscore: val[this.state.selectedOptionDifficulty][0].averageScore})
      })

      this.updateTimer()
      this.setState({
        setGameModel: false,
        printResult: false,
        audioPaused: true,
        answerCorrect: true,
        eventDate: moment.duration().add({days:0,hours:0,minutes:this.state.selectedOptionDuration,seconds:0}),
      })
    }, 900)
  }

  selectLevel = (selectedOptionDifficulty) => {
    this.setState({ selectedOptionDifficulty });
  }

  restartGame = () => {
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

  render(){
    if (this.state.songInQuestion.title != "") {
      return (
        <div className="GuessTheSong">
          <div
            style={{ backgroundImage: `url(${this.state.overlapGroup})` }}
            className="overlap-group-40">
              <div className="overlap-group-40-dark"></div>
          </div>
          <div className="overlap-group1-14">
            <div className="section1-3">
              <Header callerComponent={"gamespage"} />
            </div>
            <div className="section2-2">
              {this.state.setGameModel ?
                <SetGameModal
                  setGameTitle = {"guess the song"}
                  handleChangePlayerName = {this.handleChangePlayerName}
                  selectLevel = {this.selectLevel}
                  selectedOptionDifficulty = {this.state.selectedOptionDifficulty}
                  handleChangeDifficulty = {this.handleChangeDifficulty}
                  selectedOptionDuration = {this.state.selectedOptionDuration}
                  handleChangeDuration = {this.handleChangeDuration}
                  startGame = {this.startGame}
                />
              :
                <div className="section2-3">
                  {this.state.printResult ?
                    <GameResult
                      play={this.play}
                      score={this.state.score}
                      mins = {this.state.mins}
                      secs = {this.state.secs}
                      selectedOptionDuration = {this.state.selectedOptionDuration}
                      selectedOptionDifficulty = {this.state.selectedOptionDifficulty}
                      restartGame = {this.restartGame}
                      playerName = {this.state.selectedOptionPlayerName === "" ? "yokibot" : this.state.selectedOptionPlayerName}
                    />
                    :
                    <div className="GTSPlay-wrapper">
                      <GTSPlay
                        play={this.play}
                        score={this.state.score}
                        playerName = {this.state.selectedOptionPlayerName === "" ? "yokibot" : this.state.selectedOptionPlayerName}
                        selectedOptionDifficulty = {this.state.selectedOptionDifficulty}
                        selectedOptionDuration = {this.state.selectedOptionDuration}
                        mins = {this.state.mins}
                        secs = {this.state.secs}
                        songsInOption = {this.state.songsInOption}
                        optionBackground = {"#f5fffe"}
                        checkAnswer={this.checkAnswer}
                        audioPaused={this.state.audioPaused}
                      />
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
                  }
                </div>
              }
            </div>
            <FooterMenuFooterDefault />
          </div>
        </div>
      );
    }else{
      return (
        <div></div>
      )
    }
  }
}

const mapStateToProps = state => {
  return {};
};

let GuessTheSong = withRouter(connect(mapStateToProps)(ConnectedGuessTheSong));
export default withRouter(GuessTheSong);