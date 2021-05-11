import React, { Component } from 'react';
import SongList from '../songLIst/SongList';
import Firebase from "../../firebase/firebase.js";
import TextField from "@material-ui/core/TextField";
import ReactTypingEffect from 'react-typing-effect';
import background1 from "./assets/ankarabck1.jpeg";
import background2 from "./assets/ankarabck2.jpeg";
import background3 from "./assets/ankarabck3.jpeg";
import background4 from "./assets/ankarabck4.jpeg";
import background5 from "./assets/ankarabck5.jpeg";
import background6 from "./assets/ankarabck6.jpeg";
import background7 from "./assets/ankarabck7.jpeg";
import background8 from "./assets/ankarabck8.jpeg";
import background9 from "./assets/ankarabck9.jpeg";
import background10 from "./assets/ankarabck10.jpeg";
import background11 from "./assets/ankarabck11.jpeg";

import './Searcher.css';

class Searcher extends Component {
  constructor(props){
    super(props);

    this.state= {
      songs: [],
      filteredSongs: [],
      currentSong: '',
      songsCopy:[],
      searchOptions: [],
      typingEffectSongs: [''],
      count:0,
      query: '',
      expandResults: false,
      background: getRandomBackground(),
    }

    this.searchTerm=''
  }

  componentDidMount () {
    Firebase.getLyrics().then(
      val => {
        let shuffledSongs = shuffleArray(val.map(a => a.title))
        this.setState({
          songs: val,
          songsCopy: val,
          searchOptions: shuffledSongs,
          typingEffectSongs: shuffledSongs,
          songIds: val.map(a => a.id),
        })
      }
    )

    setInterval( () => {
      this.setState({
        count: (this.state.count+1) % 20,
      })
    }, 6000);
  }

  filterSong = (song) => {
    if (!this.state.expandResults){
      this.setState({expandResults: true})
    }

    if (song==""){
      this.setState({expandResults: false})
    }

    let typeSong = this.state.songsCopy.filter(thisSong =>
      thisSong.title != undefined && thisSong.singer != undefined ?
        thisSong.title.replace(' ', '').toLowerCase().includes(song.replace(' ', '').toLowerCase()) ||
        thisSong.singer.replace(' ', '').toLowerCase().includes(song.replace(' ', '').toLowerCase())
      :
      false
    )

    if (song == ''){
      this.setState({
        songs: this.state.songsCopy
      })
    }else{
      this.setState({
        filteredSongs: typeSong
      })
    }
  }

  playSong= (songId) => {
    let chooseSong = this.state.songs.filter(song => songId === song.id)

    this.props.history.push({
      pathname: "/africariyoki/karaokedisplay/" + songId,
      state: { chooseSong: chooseSong, songs: this.state.songsCopy}
    });

    this.setState({
      songs: chooseSong,
      currentSong: chooseSong
    })
  }

  render() {
    return (
      <div className="Searcher">
        <div style={{ backgroundImage: `url(${this.state.background})` }}
        className="Searcher-background">
          <div className="Searcher-backgroundOverlay">

          </div>
        </div>
        <div className="Searcher-container">

          <div className="Searcher-inputWrapper">
            <TextField
              className="Searcher-input"
              label="what do you want to sing today??"
              variant="outlined"
              onChange={event=>{
                this.setState({query: event.target.value}, ()=> {
                  this.filterSong(this.state.query)
                })
              }}
            />
          </div>

          <SongList
            songs={this.state.songs}
            filteredSongs={this.state.filteredSongs}
            playSong={this.playSong}
            expandResults={this.state.expandResults}
          />

          <div className="Searcher-typeEffectWrapper">
            <ReactTypingEffect
              style={{ marginTop: 50, fontSize: 12, color: '#3F51B5' }}
              text={this.state.typingEffectSongs.slice(0, 20)[this.state.count]}
              speed={150}
              eraseDelay={150}
              typingDelay={150}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Searcher;

function getRandomBackground(){
  let randomNumber =  Math.floor(Math.random() * 10);

  switch(randomNumber) {
    case 1:
      return background1
    case 2:
      return background2
    case 3:
      return background3
    case 4:
      return background4
    case 5:
      return background5
    case 6:
      return background6
    case 7:
      return background7
    case 8:
      return background8
    case 9:
      return background9
    case 10:
      return background10
    default:
      return background11
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array
}

//https://www.lalal.ai/?gclid=CjwKCAiArbv_BRA8EiwAYGs23LTomkIzDCGjHTkK-SQlhargxYyajraHsgux9WClyYvOXJnLQ7surhoCNbIQAvD_BwE
//https://mp3downy.com/MP3-converter?apikey=1234567890

//do  ./ngrok http 5000 in /vocalremover to run ngrok


//for free images https://www.pexels.com/search/nigeira/