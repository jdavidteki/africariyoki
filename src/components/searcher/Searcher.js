import React, { Component } from 'react';
import Filter from '../Filter';
import SongList from '../songLIst/SongList';
import Firebase from "../../firebase/firebase.js";
import TextField from "@material-ui/core/TextField";
import ReactTypingEffect from 'react-typing-effect';
import Autocomplete from '@material-ui/lab/Autocomplete';
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
        count: (this.state.count+1) % 20
      })
    }, 4000);
  }

  filterSong = (song) => {
    if (!this.state.expandResults){
      this.setState({expandResults: true})
    }

    if (song==""){
      this.setState({expandResults: false})
    }

    let typeSong = this.state.songsCopy.filter(thisSong =>
      thisSong.title.replace(' ', '').toLowerCase().includes(song.replace(' ', '').toLowerCase())
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
        <div className="Searcher-container">
          <TextField
            className="Searcher-input"
            label="what do you want to sing today"
            variant="outlined"
            onChange={event=>{
              this.setState({query: event.target.value}, ()=> {
                this.filterSong(this.state.query)
              })
            }}
          />

          <SongList
            songs={this.state.songs}
            filteredSongs={this.state.filteredSongs}
            playSong={this.playSong}
            expandResults={this.state.expandResults}
          />

          <ReactTypingEffect
            style={{ marginTop: 50, fontSize: 12, color: '#3F51B5' }}
            text={this.state.typingEffectSongs.slice(0, 20)[this.state.count]}
            speed={150}
            eraseDelay={150}
            typingDelay={150}
          />
        </div>
      </div>
    );
  }
}

export default Searcher;

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