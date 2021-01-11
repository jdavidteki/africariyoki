import React, { Component } from 'react';
import Filter from '../Filter';
import SongList from '../SongList';
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
      filteredSongs: '',
      currentSong: '',
      songsCopy:[],
      searchOptions: [],
      typingEffectSongs: [''],
      count:0,
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

    //TODO: extract bpm from mp3 file so we can those to play the lyrics
    // var requestOptions = {
    //   method: 'GET',
    //   redirect: 'follow'
    // };
    // fetch("https://firebasestorage.googleapis.com/v0/b/africariyoki.appspot.com/o/preview_accompaniment_Davido%20-%20If%20(Official%20Music%20Video).mp3?alt=media&token=5e3883ef-468f-470c-b4ae-e5a117152c51", requestOptions)
    //   .then(response => {
    //     response.text()
    //     console.log("response", response.body)
    //     var context = new AudioContext();
    //     // context.decodeAudioData(response.body, this.calcTempo);
    //   })
    //   .then(result => console.log(result))
    //   .catch(error => console.log('error', error));
  }

  filterSong = (song) => {
    let typeSong = this.state.songsCopy.filter(thisSong => song.replace(' ', '').toLowerCase() === thisSong.title.replace(' ', '').toLowerCase())

    if (song == ''){
      this.setState({
        songs: this.state.songsCopy
      })
    }else{
      this.setState({
        songs: typeSong
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

  // calcTempo = (buffer) => {
  //   var audioData = [];
  //   // Take the average of the two channels
  //   if (buffer.numberOfChannels == 2) {
  //     var channel1Data = buffer.getChannelData(0);
  //     var channel2Data = buffer.getChannelData(1);
  //     var length = channel1Data.length;
  //     for (var i = 0; i < length; i++) {
  //       audioData[i] = (channel1Data[i] + channel2Data[i]) / 2;
  //     }
  //   } else {
  //     audioData = buffer.getChannelData(0);
  //   }
  //   var mt = new MusicTempo(audioData);

  //   console.log(mt.tempo);
  //   console.log(mt.beats);
  // }

  render() {
    return (
      <div className="Searcher-container">
        <div className="Searcher-container">
          <Autocomplete
            id="controllable-states-demo"
            value={this.searchTerm}
            options={this.state.searchOptions}
            renderInput={(params) =>
              <TextField
                {...params}
                className="Searcher-input"
                label="what do you want to sing today"
                variant="outlined"
              />
            }
            onInputChange={(event, newInputValue) => {
              this.searchTerm = newInputValue
            }}
            onChange={(event, newValue) => {
              this.filterSong(this.searchTerm)
            }}
            onKeyUp = {event => {
              if (event.key === 'Enter') {
                this.filterSong(this.searchTerm)
              }
            }}
          />

          <SongList songs={this.state.songs} filteredSongs={this.state.filteredSongs} playSong={this.playSong}/>

          <ReactTypingEffect
            style={{ marginTop: 50, fontSize: 24, color: '#3F51B5' }}
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