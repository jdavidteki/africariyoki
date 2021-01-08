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
      animatedTexts: [
        "if",
        "onyeka onyewu",
        "jowo",
        "lala",
        "ginger",
        "monsters you made",
        "jollof on the jet",
        "beef",
        "hustle",
        "pepper soup",
      ],
      count:0,
    }

    this.searchTerm=''
  }

  componentDidMount () {
    Firebase.getLyrics().then(
      val => {
        this.setState({
          songs: val,
          songsCopy: val,
        })
      }
    )

    setInterval( () => {
      this.setState({
        count: (this.state.count+1) % 10
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
    let typeSong = this.state.songs.filter(thisSong => song === thisSong.title.toLowerCase())

    if (song == '' || typeSong.length == 0){
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
      state: { chooseSong: chooseSong}
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
            options={this.state.animatedTexts.slice(0,5)}
            renderInput={(params) =>
              <TextField
                {...params}
                className="Searcher-input"
                label="what do you want to do today??"
                variant="outlined"
              />
            }
            onInputChange={(event, newInputValue) => {
              this.searchTerm = newInputValue
            }}
            onChange={(event, newValue) => {
              this.searchTerm = newValue
              this.filterSong(newValue)
            }}
            onKeyUp = {event => {
              if (event.key === 'Enter') {
                this.filterSong(this.searchTerm)
                console.log(document)
                document.getElementsByClassName("MuiAutocomplete-popper").hide()
              }
            }}
          />

          <SongList songs={this.state.songs} filteredSongs={this.state.filteredSongs} playSong={this.playSong}/>

          <ReactTypingEffect
            style={{ marginTop: 50, fontSize: 24, color: '#3F51B5' }}
            text={this.state.animatedTexts[this.state.count]}
            speed={150}
            eraseDelay={150}
            typingDelay={150}
          />
        </div>

        {/* <div className="sidebar">
          <Filter songs={this.state.songs} filterSong= {this.filterSong}/>
          <SongList songs={this.state.songs} filteredSongs={this.state.filteredSongs} playSong={this.playSong}/>
        </div> */}
        {/* <KaraokeDisplay playSong={this.state.currentSong} /> */}
      </div>
    );
  }
}

export default Searcher;

//https://www.lalal.ai/?gclid=CjwKCAiArbv_BRA8EiwAYGs23LTomkIzDCGjHTkK-SQlhargxYyajraHsgux9WClyYvOXJnLQ7surhoCNbIQAvD_BwE
//https://mp3downy.com/MP3-converter?apikey=1234567890