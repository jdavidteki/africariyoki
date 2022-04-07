import React, { Component } from 'react';
import SongList from '../SongList2/SongList';
import Firebase from "../../firebase/firebase.js";
import TextField from "@material-ui/core/TextField";
import codeToCountries from "./codeToCountry.js";
import MetaTags from 'react-meta-tags';
import { ShuffleArray } from "../helpers/Helpers";

import './Searcher.css';

//you can just come here and add a language
const allPrompts=[
  'pidgin: wetin you wan sing',
  'twi: eh dwom ben na wo be to',
  'yoruba: kini o fẹ lati kọrin si',
  'hausa: me kuke so ku yi waka',
  'swahili: unataka kuimba nini',
  'afrikaans: waarvoor wil jy sing',
  'amharic: ምን መዝፈን ትፈልጋለህ',
  'igbo: kedu ihe ị chọrọ ịbụ abụ',
  'zulu:  ufuna ukucula ini',
  'shona: unoda kuimbira chii',
]

class Searcher extends Component {
  constructor(props){
    super(props);

    this.state= {
      songs: [],
      filteredSongs: [],
      currentSong: '',
      songsCopy:[],
      popularSongs:[],
      count:0,
      query: '',
      expandResults: false,
      background: "",
      selectedCode: '',
      countryToBackgroundImage: {},
      bckImageNum: '',
      inputPromptMsg: 'english: what do you want to sing',
    }
  }

  componentDidMount () {
    if(window.location.href.includes("openyokis")){
      document.getElementById('js-yokisCTA').click();
    }

    //hack: use this to fix github pages doing ?/ on pages
    if (window.location.href.includes("?/")){
      let actualDestination = window.location.href.split("?/")[1]

      this.props.history.push({
        pathname: "/" + actualDestination
      });
    }

    Firebase.bckMappings().then(
      val => {
        this.setState({
          countryToBackgroundImage: val,
        })
      }
    )

    //try to load local songs file first
    let localSongs = JSON.parse(localStorage.getItem('lyrics'));
    if (localSongs != null){
      let localLyrics = localSongs['lyrics']
      this.setState({
        popularSongs: localLyrics,
        songs: localLyrics,
        songsCopy: localLyrics,
        typingEffectSongs: ShuffleArray(localLyrics.map(a => a.turnedOn == 1 ? a.title : '').filter(a => a != '')),
        songIds: localLyrics.map(a => a.id),
      })
    }

    //if there is no internet connection this should atleast work
    Firebase.getLyrics().then(
      val => {
        this.setState({
          popularSongs: val,
          songs: val,
          songsCopy: val,
          typingEffectSongs: ShuffleArray(val.map(a => a.turnedOn == 1 ? a.title : '').filter(a => a != '')),
          songIds: val.map(a => a.id),
        })

        localStorage.setItem('lyrics', JSON.stringify({
          "lyrics": val,
        }));
      }
    )

    //interval for chainging input prompt
    let nthPromptToShow = 0
    setInterval( () => {
      let modPrompt = nthPromptToShow % (allPrompts.length + 3)
      let promptToShow = 'english: what do you want to sing'

      if(modPrompt > 2){
        promptToShow = allPrompts[modPrompt - 3]
      }

      nthPromptToShow += 1

      this.setState({
        inputPromptMsg: promptToShow
      })
    }, 2000);
  }

  filterSong = (song) => {
    if (!this.state.expandResults){
      this.setState({expandResults: true})
    }

    if (song==""){
      this.setState({expandResults: false})
    }

    let selectedCountry = ""
    if(codeToCountries[this.state.selectedCode] != undefined){
      selectedCountry = codeToCountries[this.state.selectedCode]
    }

    let typeSong = this.state.songsCopy.filter(thisSong =>
      thisSong.title != undefined && thisSong.singer != undefined ?
        (
          thisSong.title.replace(' ', '').toLowerCase().includes(song.replace(' ', '').toLowerCase()) ||
          thisSong.singer.replace(' ', '').toLowerCase().includes(song.replace(' ', '').toLowerCase())
        )
        &&
        (
          thisSong.countries.replace(' ', '').toLowerCase().includes(selectedCountry.replace(' ', '').toLowerCase())
        )
        &&
        (
          thisSong.turnedOn == 1
        )
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

  playSong = (songId) => {
    let chooseSong = this.state.songs.filter(song => songId === song.id)

    if(this.props.history == undefined){
      //TODO: figure out if it's possible to not have to do this
      window.location.href = "/karaokedisplay/" + songId
    }else{
      this.props.history.push({
        pathname: "/karaokedisplay/" + songId,
        state: { chooseSong: chooseSong, songs: this.state.songsCopy}
      });
    }

    this.setState({
      songs: chooseSong,
      currentSong: chooseSong
    })
  }

  getSongDetails(){
    let metaDes = "sing along to your favourite afrobeat songs --- "

    for (var i = 0; i < this.state.songs.length; i++) {
      metaDes += `${this.state.songs[i].title}, ${this.state.songs[i].singer}, `
    }

    return metaDes
  }

  render() {
    return (
      <div className="Searcher">
        <MetaTags>
          <title>africariyoki - play with africa!</title>
          <meta name="description" content={this.getSongDetails()} />
          <meta property="og:title" content="africariyoki" />
          <meta httpEquiv="cache-control" content="no-cache" />
          <meta httpEquiv="expires" content="0" />
          <meta httpEquiv="pragma" content="no-cache" />
        </MetaTags>

        {/* these will remain for SEO purposes */}
          <h1 itemProp="headline" style={{ display: "none" }}>#karaokewithafrica - #karaoke, african karaoke, #nigeriankaraoke, #lagoskaraoke, #ghanaian karaoke, #afrobeatskaraoke, afrobeatskaraoke, the african internet playhouse</h1>
        {/* ******** */}

        <div className="Searcher-container">
          <div className="Searcher-inputWrapper">
            <TextField
              className="Searcher-input"
              shrink='true'
              id="Searcher-input"
              label={`${this.state.selectedCode != '' ? ' what do you want to sing from ' + codeToCountries[this.state.selectedCode] + ' today??': '     ' + this.state.inputPromptMsg}?`}
              variant="outlined"
              onChange={event=>{
                this.setState({query: event.target.value}, ()=> {
                  this.filterSong(this.state.query)
                })
              }}
            />
          </div>

          {this.state.songs.length > 0 &&
            <SongList
              songs={this.state.songs}
              filteredSongs={this.state.filteredSongs}
              playSong={this.playSong}
              suggestSong={this.suggestSong}
              expandResults={this.state.expandResults}
            />
          }
        </div>

      </div>
    )
  }
}

export default Searcher;

//https://www.lalal.ai/?gclid=CjwKCAiArbv_BRA8EiwAYGs23LTomkIzDCGjHTkK-SQlhargxYyajraHsgux9WClyYvOXJnLQ7surhoCNbIQAvD_BwE
//https://mp3downy.com/MP3-converter?apikey=1234567890

//do  ./ngrok http 5000 in /vocalremover to run ngrok


//for free images https://www.pexels.com/search/nigeira/

// https://unsplash.com/s/photos/south-africa
