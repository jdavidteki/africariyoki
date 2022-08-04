import React, { Component } from "react";
import MetaTags from 'react-meta-tags';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import SetGameModal from "../SetGameModal";
import GameResult from "../GameResult";
import NextLinePlay from "../NextLinePlay";
import Header from "../Header2";
import FooterMenuFooterDefault from "../FooterMenuFooterDefault";
import Firebase from "../../firebase/firebase.js";
import moment from "moment"
import { CleanLine, ShuffleArray, GetRandomBackground } from "../helpers/Helpers";
import { Analytics, PageHit } from 'expo-analytics';
import TempBackground from "../../../static/img/whitebackground.png"


import "./NextLine.css";

const levelToPlaySec = {
  "beginner": 5,
  "amateur": 4,
  "ancestor": 2.5
}

const startTimes = [0.25, 0.5, 0.75, 0.8];

class ConnectedNextLine extends Component {
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
      selectedOptionDuration: 1,
      selectedOptionDifficulty: 'beginner',
      printResult: false,
      showChoks: false,
      answerCorrect: true,
      audioPaused: true,
      overlapGroup: TempBackground,
      answerClicked: false,
      songInQuestion: {
          audiourl: '',
          singer: '',
          title: '',
          lyrics: '',
      },
    }
  };

  audio=null

  updateTimer=()=>{
      const x = setInterval(()=>{
        let { eventDate} = this.state

      if(eventDate <=0){
          this.updateFirebaseScoreBoard()

          this.setState({
              count:0,
              eventDate: moment.duration().add({days:0,hours:0,minutes:this.state.selectedOptionDuration,seconds:0}),
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

          Firebase.updateScoreBoardNextLine(val)
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

    // const analytics = new Analytics('UA-187038287-1');
    // analytics.hit(new PageHit('NextLine'))
    //   .then(() => console.log("google analytics on searcher"))
    //   .catch(e => console.log(e.message));

    setTimeout( () => {
      this.setState({
        overlapGroup: GetRandomBackground(""),
      })
    }, 500);

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
          "question": CleanLine(lyricQuestion),
          "answer": CleanLine(lyricAnswer),
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

      let lyricsInOptions = [CleanLine(lyricAnswer)]

      for(var i=0; i<3; i++){
          let randomSong = Math.floor(Math.random() * (lyricFromAllSongs.length - 0) + 0);

          let songOption = lyricFromAllSongs[randomSong]

          let randomSongLine = Math.floor(Math.random() * (songOption.length - 0) + 0);

          if(!lyricsInOptions.includes(CleanLine(lyricFromAllSongs[randomSong][randomSongLine]))){
              lyricsInOptions.push(CleanLine(lyricFromAllSongs[randomSong][randomSongLine]))
          }else{
              i-=1
          }
      }

      return ShuffleArray(lyricsInOptions)
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

  checkAnswer = (lyricOption) => {
    this.setState(prevState => ({
      answerClicked: !prevState.answerClicked
    }));

    if(lyricOption == this.state.lyricAndOptionObj["answer"]){
      document.getElementById(lyricOption.replaceAll(' ', '')).classList.add('correct-answer') //TODO: figure out a better way of doing this
      this.setState({
        score: this.state.score+=1,
        answerCorrect: true,
      })
    }else{
      document.getElementById(lyricOption.replaceAll(' ', '')).classList.add('wrong-answer')
      this.setState({
        score: this.state.score-=1,
        answerCorrect: false,
      })
    }

    setTimeout( () => {
      let songInQuestionIndex = Math.floor(Math.random() * (this.state.songs.length - 0) + 0);

      if(document.getElementById(lyricOption) != undefined){
        document.getElementById(lyricOption.replaceAll(' ', '')).classList.remove('correct-answer')
        document.getElementById(lyricOption.replaceAll(' ', '')).classList.remove('wrong-answer')
      }

      this.setState({
        songInQuestionIndex: songInQuestionIndex,
        songInQuestion: this.state.songs[songInQuestionIndex],
        lyricAndOptionObj: this.getLyricAndOptionObj(this.state.songs, songInQuestionIndex)
      })
    }, 500)
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
        Firebase.getScoreBoardNextLine()
        .then(val => {
          this.setState({highestscore: val[this.state.selectedOptionDifficulty][0].averageScore})
        })

        this.updateTimer()
        this.setState({
          setGameModel: false,
          printResult: false,
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

  play = () => {
    if(this.audio != null){
      this.audio.currentTime = 40;
      this.audio.play();
      this.setState({audioPaused: false})

      //update song plays
      Firebase.getLyricsById(this.state.songInQuestion.id).then(
        val => {
          if (!isNaN(val.numPlays)){
            Firebase.updateNumPlays(this.state.songInQuestion.id, val.numPlays+1)
          }
        }
      )

      var int = setInterval(() => {
        if (this.audio != null && this.audio.currentTime > 40 + levelToPlaySec[this.state.selectedOptionDifficulty]) {
          this.audio.pause();
          this.setState({audioPaused: true})
          clearInterval(int);
        }
      }, 10);
    }
  }

  render(){
    if (this.state.songInQuestion.title != "") {
      return (
        <div className="NextLine">
          <MetaTags>
            <title>africariyoki ::: next line</title>
            <meta name="description" content={`what is the next line`} />
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
                  setGameTitle = {"nextyoki"}
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
                    <div className="NextLinePlay-wrapper">
                      <NextLinePlay
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
                        answerCorrect={this.state.answerCorrect}
                        answerClicked={this.state.answerClicked}
                        songInQuestion = {this.state.songInQuestion}
                        lyricAndOptionObj = {this.state.lyricAndOptionObj}
                        audioPaused = {this.state.audioPaused}
                      />
                      <div className="NextLine-audioPlayer">
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

let NextLine = withRouter(connect(mapStateToProps)(ConnectedNextLine));
export default withRouter(NextLine);