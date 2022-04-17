import React, { Component } from "react";
import MetaTags from 'react-meta-tags';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import SetGameModal from "../SetGameModal";
import GameResult from "../GameResult";
import PopLinesPlay from "../PopLinesPlay";
import Header from "../Header2";
import FuzzySet from 'fuzzyset.js'
import FooterMenuFooterDefault from "../FooterMenuFooterDefault";
import { ShuffleArray, GetRandomBackground, HmsToSecondsOnly } from "../helpers/Helpers";
import Firebase from "../../firebase/firebase.js";
import { Analytics, PageHit } from 'expo-analytics';
import moment from "moment"
import TempBackground from "../../../static/img/whitebackground.png"
import "./PopularLines.css";

const levelToPlaySec = {
  "beginner": 5,
  "amateur": 4,
  "ancestor": 2.5
}

const startTimes = [0.25, 0.5, 0.75, 0.8];

class ConnectedPopularLines extends Component {
  constructor(props){
    super(props);

    this.state = {
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
      nthLongestLineToShow: 0,
      db: null,
      optionBackground: '#d5c0f0',
      overlapGroup: TempBackground,
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
  }

  audio=null

  updateTimer = () => {
    const x = setInterval(()=>{
      let { eventDate} = this.state

    if(eventDate <=0){
      this.updateFirebaseScoreBoard()

      this.setState({
        count:0,
        eventDate: moment.duration().add({days:0,hours:0,minutes:this.state.selectedOptionDuration,seconds:0}),
        secs:0,
        mins:this.state.selectedOptionDuration,
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

          Firebase.updateScoreBoardPopularLine(val)
      })
  }

  componentDidMount(){
      //hack: use this to fix github pages doing ?/ on pages
      if (window.location.href.includes("?/")){
        let actualDestination = window.location.href.split("?/")[1]
        if(this.props.history == undefined){
          //TODO: figure out if it's possible to not have to do this
          window.location.href = "/" + actualDestination
        }else{
          this.props.history.push({
            pathname: "/" + actualDestination
          });
          window.location.reload(false);
        }
      }

      const analytics = new Analytics('UA-187038287-1');
      analytics.hit(new PageHit('PopularLines'))
          .then(() => console.log("google analytics on game"))
          .catch(e => console.log(e.message));

      setTimeout( () => {
        this.setState({
          overlapGroup: GetRandomBackground(""),
        })
      }, 500);

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

  checkAnswer = (songId) => {
    if(songId == this.state.songInQuestion.id){
      this.setState({score: this.state.score+=1, answerCorrect: true})
      document.getElementById(songId).classList.add('correct-answer') //TODO: figure out a better way of doing this
    }else{
      this.setState({score: this.state.score-=1, answerCorrect: false})
      document.getElementById(songId).classList.add('wrong-answer')
    }

    let songInQuestionIndex = Math.floor(Math.random() * (this.state.songs.length - 0) + 0);
    let nthLongestLineToShow = Math.floor(Math.random() * 5);

    setTimeout( () => {
      if(document.getElementById(songId) != undefined){
        document.getElementById(songId).classList.remove('correct-answer')
        document.getElementById(songId).classList.remove('wrong-answer')
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
    }, 500);
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
        Firebase.getScoreBoardPopularLine()
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
        randomTruePopLine: this.findRandomTruePopLine(this.state.songs[songInQuestionIndex].id),
        songsInOption: this.generateSongsInOptions(this.state.songs, this.state.songs[songInQuestionIndex])
    })
  }

  playVocal = () => {
      clearTimeout(this.state.prevTimeoutID)
      if(this.audio != null && this.audio.duration > 0){
          var timeToStart = this.getPopLineTime(this.state.randomTruePopLine)
          this.audio.setAttribute("src", this.audio.src + `#t=${timeToStart}`)

          //wait for like 0.5sec before actually playing just incase it is paused
          setTimeout(()=>{
            if(this.audio != null) {
              this.audio.play();
              this.setState({audioPaused: false})
              if (isFinite(timeToStart)){
                this.audio.currentTime = timeToStart
              }
            }
          }, 700);

          //update song plays
          Firebase.getLyricsById(this.state.songInQuestion.id).then(
            val => {
                Firebase.updateNumPlays(this.state.songInQuestion.id, val.numPlays +=1)
            }
          )

          const int = setTimeout(() => {
              if(this.audio != undefined){
                  this.audio.pause();
                  if (isFinite(timeToStart)){
                    this.audio.currentTime = timeToStart
                  }
                  this.setState({audioPaused: true})
                  clearTimeout(int)
              }
          }, levelToPlaySec[this.state.selectedOptionDifficulty] * 1000);
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
              secTime = HmsToSecondsOnly(poplineFuzzySet[0][1].substring(1, 6)) + parseInt(poplineFuzzySet[0][1].substring(7, 9), 10)
          }
      }

      if (isNaN(secTime) || secTime == 0){
        let midLyrics = lyricsArray[Math.round(lyricsArray.length / 2)]
        if(midLyrics != undefined){
          secTime = HmsToSecondsOnly(midLyrics.substring(1, 6)) + parseInt(midLyrics.substring(7, 9), 10)
        }
      }

      return Math.round(secTime/1000)
  }

  render(){
    if (this.state.songInQuestion.title != "") {
      return (
        <div className="PopularLines">
          <MetaTags>
            <title>africariyoki ::: popular lines</title>
            <meta name="description" content={`recognize famous lines`} />
            <meta property="og:title" content="africariyoki" />
            <meta httpEquiv='cache-control' content='no-cache' />
            <meta httpEquiv='expires' content='0' />
            <meta httpEquiv='pragma' content='no-cache' />
          </MetaTags>
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
                  setGameTitle = {"popular lines"}
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
                    <div className="PopLinesPlay-wrapper">
                      <PopLinesPlay
                        play={this.playVocal}
                        showAudio={this.audio != null && this.audio.duration > 0}
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
                        randomTruePopLine = {this.state.randomTruePopLine}
                        nthLongestLineToShow = {this.state.nthLongestLineToShow}
                        songInQuestion = {this.state.songInQuestion}
                      />
                      <div className="PopularLine-audioPlayer">
                        <audio
                          style={{display:"none"}}
                          className={"PopularLine-audio"}
                          ref={ref => this.audio = ref}
                          id="sample"
                          crossOrigin="anonymous"
                          controls
                          src={
                              this.state.songInQuestion.audiourl.includes('africariyoki-4b634') ?
                              this.state.songInQuestion.audiourl.replace('/music/', '/vocals/') :
                              this.state.songInQuestion.audiourl.replace('africariyoki', 'africariyoki-4b634').replace('/music/', '/vocals/') //TODO: jesuye come back and do this bettter lol
                          }
                        />
                      </div>
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

let PopularLines = withRouter(connect(mapStateToProps)(ConnectedPopularLines));
export default withRouter(PopularLines);