import React, { Component } from 'react';
import SongList from '../songLIst/SongList';
import ReactFlagsSelect from 'react-flags-select';
import Firebase from "../../firebase/firebase.js";
import TextField from "@material-ui/core/TextField";
import ReactTypingEffect from 'react-typing-effect';
import codeToCountries from "./codeToCountry.js";
import Button from "@material-ui/core/Button";
import CloseIcon from '@material-ui/icons/Close';
import blankBack from "./assets/blankBack.jpeg"
import MetaTags from 'react-meta-tags';
import Sbta from '../sbta/Sbta.js'

import './Searcher.css';
class Searcher extends Component {
  constructor(props){
    super(props);

    this.state= {
      songs: [],
      filteredSongs: [],
      currentSong: '',
      songsCopy:[],
      typingEffectSongs: [''],
      count:0,
      query: '',
      expandResults: false,
      background: blankBack,
      selectedCode: '',
      countryToBackgroundImage: {},
      bckImageNum: '',
    }
  }

  componentDidMount () {

    Firebase.bckMappings().then(
      val => {
        this.setState({
          countryToBackgroundImage: val,
        })
      }
    )

    setTimeout( () => {
      this.setState({
        background: this.getRandomBackground(""),
      })
    }, 500);

    Firebase.getLyrics().then(
      val => {
        this.setState({
          songs: val,
          songsCopy: val,
          typingEffectSongs: shuffleArray(val.map(a => a.turnedOn == 1 ? a.title : '').filter(a => a != '')),
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


  getRandomBackground(selectedCountry){
    let randomNumber =  Math.floor(Math.random() * 10);
    let backgroundToReturn = ""
    let bckImageNum = ""

    switch(randomNumber) {
      case 1:
        bckImageNum = 1
        backgroundToReturn = "https://firebasestorage.googleapis.com/v0/b/africariyoki-4b634.appspot.com/o/searchBackgrounds%2Fbck1bck.jpeg?alt=media"
        break
      case 2:
        bckImageNum = 2
        backgroundToReturn =  "https://firebasestorage.googleapis.com/v0/b/africariyoki-4b634.appspot.com/o/searchBackgrounds%2Fbck2bck.jpeg?alt=media"
        break
      case 3:
        bckImageNum = 3
        backgroundToReturn =  "https://firebasestorage.googleapis.com/v0/b/africariyoki-4b634.appspot.com/o/searchBackgrounds%2Fbck3bck.jpeg?alt=media"
        break
      case 4:
        bckImageNum = 4
        backgroundToReturn =  "https://firebasestorage.googleapis.com/v0/b/africariyoki-4b634.appspot.com/o/searchBackgrounds%2Fbck4bck.jpeg?alt=media"
        break
      case 5:
        bckImageNum = 5
        backgroundToReturn =  "https://firebasestorage.googleapis.com/v0/b/africariyoki-4b634.appspot.com/o/searchBackgrounds%2Fbck5bck.jpeg?alt=media"
        break
      case 6:
        bckImageNum = 6
        backgroundToReturn =  "https://firebasestorage.googleapis.com/v0/b/africariyoki-4b634.appspot.com/o/searchBackgrounds%2Fbck6bck.jpeg?alt=media"
        break
      case 7:
        bckImageNum = 7
        backgroundToReturn =  "https://firebasestorage.googleapis.com/v0/b/africariyoki-4b634.appspot.com/o/searchBackgrounds%2Fbck7bck.jpeg?alt=media"
        break
      case 8:
        bckImageNum = 8
        backgroundToReturn =  "https://firebasestorage.googleapis.com/v0/b/africariyoki-4b634.appspot.com/o/searchBackgrounds%2Fbck8bck.jpeg?alt=media"
        break
      case  9:
        bckImageNum = 9
        backgroundToReturn =  "https://firebasestorage.googleapis.com/v0/b/africariyoki-4b634.appspot.com/o/searchBackgrounds%2Fbck9bck.jpeg?alt=media"
        break
      case 10:
        bckImageNum = 10
        backgroundToReturn =  "https://firebasestorage.googleapis.com/v0/b/africariyoki-4b634.appspot.com/o/searchBackgrounds%2Fbck10bck.jpeg?alt=media"
        break
      default:
        bckImageNum = 11
        backgroundToReturn =  "https://firebasestorage.googleapis.com/v0/b/africariyoki-4b634.appspot.com/o/searchBackgrounds%2Fbck11bck.jpeg?alt=media"
        break
    }

    if( selectedCountry != ""){
      if (this.state.countryToBackgroundImage[selectedCountry].bckUrl != undefined &&
          this.state.countryToBackgroundImage[selectedCountry].bckUrl != ""){
        backgroundToReturn =  this.state.countryToBackgroundImage[selectedCountry].bckUrl
      }
    }

    this.setState({bckImageNum: bckImageNum})

    return backgroundToReturn
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

  playSong= (songId) => {
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

  selectCountryFlag(code){
    this.setState({
      selectedCode: code,
      background: this.getRandomBackground(code),
    })
  }

  render() {
    return (
      <div className="Searcher">
        <MetaTags>
          <title>africariyoki - sing with africa!</title>
          <meta name="description" content="sing along to your favourite afro beat songs" />
          <meta property="og:title" content="africariyoki" />
          <meta http-equiv='cache-control' content='no-cache' />
          <meta http-equiv='expires' content='0' />
          <meta http-equiv='pragma' content='no-cache' />
        </MetaTags>
        <div
          style={{ backgroundImage: `url(${this.state.background})` }}
          className="Searcher-background">
            <div className="Searcher-backgroundOverlay"></div>
        </div>
        <div className="Searcher-container">
          <div className="Searcher-inputWrapper">
            <TextField
              className="Searcher-input"
              label={`${this.state.selectedCode != '' ? ' what do you want to sing from ' + codeToCountries[this.state.selectedCode] + ' today??': 'what do you want to sing today'}???`}
              variant="outlined"
              onChange={event=>{
                this.setState({query: event.target.value}, ()=> {
                  this.filterSong(this.state.query)
                })
              }}
            />

            <div className="Searcher-flagClose">
              { this.state.selectedCode != "" &&

                <Button
                  onClick={() => this.setState({selectedCode: ""})}
                >
                  <CloseIcon/>
                </Button>

              }

              <ReactFlagsSelect
                selected={this.state.selectedCode}
                onSelect={code => this.selectCountryFlag(code)}
                searchable
                fullWidth={false}
                placeholder=" "
                searchPlaceholder="search countries"
                showSelectedLabel={false}
                countries={["DZ","AO","SH","BJ","BW","BF","BI","CM","CV","CF","TD","KM","CG","CD","DJ","EG","GQ","ER","SZ","ET","GA","GM","GH","GN","GW","CI","KE","LS","LR","LY","MG","MW","ML","MR","MU","YT","MA","MZ","NA","NE","NG","ST","RE","RW","ST","SN","SC","SL","SO","ZA","SS","SH","SD","SZ","TZ","TG","TN","UG","CD","ZM","TZ","ZW"]}
              />
            </div>
          </div>


          {this.state.songs.length > 0
          ?
            <SongList
              songs={this.state.songs}
              filteredSongs={this.state.filteredSongs}
              playSong={this.playSong}
              expandResults={this.state.expandResults}
            />

          :
            <div></div>
          }

          {this.state.typingEffectSongs.length > 20 &&
            <div className="Searcher-typeEffectWrapper">
              <ReactTypingEffect
                style={{ marginTop: 50, fontSize: 12, color: '#3F51B5' }}
                text={this.state.typingEffectSongs.slice(0, 20)[this.state.count]}
                speed={150}
                eraseDelay={150}
                typingDelay={150}
              />
            </div>
          }
        </div>
        <Sbta useDefaultImage={false} imageBckNum={this.state.bckImageNum} />
      </div>
    )
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


//for free images https://www.pexels.com/search/nigeira/

// https://unsplash.com/s/photos/south-africa
