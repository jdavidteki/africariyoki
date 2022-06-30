import React, { Component } from 'react';
import SongList from '../SongList2/SongList';
import Firebase from "../../firebase/firebase.js";
import TextField from "@material-ui/core/TextField";
import codeToCountries from "./codeToCountry.js";
import MetaTags from 'react-meta-tags';
import {ShuffleArray, HmsToSecondsOnly } from "../helpers/Helpers.js";

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
          thisSong.title.replaceAll(' ', '').toLowerCase().includes(song.replaceAll(' ', '').toLowerCase()) ||
          thisSong.singer.replaceAll(' ', '').toLowerCase().includes(song.replaceAll(' ', '').toLowerCase()) ||
          thisSong.lyrics.toLowerCase().includes(song.toLowerCase())
        )
        &&
        (
          thisSong.countries.replaceAll(' ', '').toLowerCase().includes(selectedCountry.replaceAll(' ', '').toLowerCase())
        )
        &&
        (
          thisSong.turnedOn == 1
        )
      :
      false
    )

    // order search results based on what's closest to the searched text
    let highPriority = []
    let midPriority = []
    let lowPriority = []
    for (let i = 0; i < typeSong.length; i++) {
      let thisSong = typeSong[i]
      thisSong["isLowPriority"] = false

      if (thisSong.title.replaceAll(' ', '').toLowerCase() == song.replaceAll(' ', '').toLowerCase()){
        highPriority.push(thisSong)
      }else if(thisSong.title.replaceAll(' ', '').toLowerCase().includes(song.replaceAll(' ', '').toLowerCase())){
        midPriority.push(thisSong)
      } else{
        if (!thisSong.singer.replaceAll(' ', '').toLowerCase().includes(song.replaceAll(' ', '').toLowerCase())){
          thisSong["isLowPriority"] = true
        }
        lowPriority.push(thisSong)
      }
    }
    typeSong = highPriority.concat(midPriority).concat(lowPriority)

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

  getPopLineTime(choosenSong){
    let secTime = 0
    let popularLine = this.state.query
    let foundLine = ""
    let lyricsArray = choosenSong.lyrics.split("\n")

    for (let i = 0; i < lyricsArray.length; i++) {
      if(lyricsArray[i].toLowerCase().includes(popularLine.toLowerCase())){
        foundLine = lyricsArray[i]
        break
      }
    }

    secTime = HmsToSecondsOnly(foundLine.substring(1, 9)) + parseInt(foundLine.substring(7, 9), 10)
    if (isNaN(secTime)){
      secTime = 0
    }

    return Math.round(secTime/1000)
  }

  playSong = (songId) => {
    let chooseSong = this.state.songs.filter(song => songId === song.id)
    let timeOfSearchedString = 0

    if (chooseSong.length > 0 && chooseSong[0].isLowPriority) {
      timeOfSearchedString = this.getPopLineTime(chooseSong[0])
    }

    if(this.props.history == undefined){
      //TODO: figure out if it's possible to not have to do this
      window.location.href = "/karaoke/" + songId + "?curtime=" + timeOfSearchedString
    }else{
      this.props.history.push({
        pathname: "/karaoke/" + songId,
        state: { chooseSong: chooseSong, songs: this.state.songsCopy, timeOfSearchedString: timeOfSearchedString}
      });
    }

    this.setState({
      songs: chooseSong,
      currentSong: chooseSong
    })
  }

  render() {
    return (
      <div className="Searcher">
        <MetaTags>
          <title>africariyoki - play with afrobeats!</title>
          <meta name="description" content="play with afrobeats. sing along, play #yokigames, make #yokilove, or just vibe on #yokithoughts." />
          <meta property="og:title" content="africariyoki" />
          <meta httpEquiv="cache-control" content="no-cache" />
          <meta httpEquiv="expires" content="0" />
          <meta httpEquiv="pragma" content="no-cache" />
        </MetaTags>

        {/* these will remain for SEO purposes */}
          <h1 itemProp="headline" style={{ display: "none" }}>afrobeats ai playhouse</h1>
        {/* ******** */}

        <div className="Searcher-container">
          <div className="Searcher-inputWrapper">
            <TextField
              className="Searcher-input"
              shrink='true'
              autoComplete='off'
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
