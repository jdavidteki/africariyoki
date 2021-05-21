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
import { Dots } from "react-activity";
import background1 from "./assets/ankarabck1.jpeg";
import background2 from "./assets/ankarabck2.jpeg";
import background3 from "./assets/ankarabck3.jpeg";
import background4 from "./assets/ankarabck4.jpeg";
import background5 from "./assets/ankarabck5.jpeg";
import background6 from "./assets/ankarabck6.jpeg";
import background7 from "./assets/ankarabck7.jpeg";
import background8 from "./assets/ankarabck7.jpeg";
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
      background: blankBack,
      selectedCode: '',
      countryToBackgroundImage: {},
    }
  }

  componentDidMount () {
    Firebase.getLyrics().then(
      val => {
        console.log("val", val)
        this.setState({
          songs: val,
          songsCopy: val,
          searchOptions: shuffleArray(val.map(a => a.title)),
          typingEffectSongs: shuffleArray(val.map(a => a.title)),
          songIds: val.map(a => a.id),
        })
      }
    )

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

    setInterval( () => {
      this.setState({
        count: (this.state.count+1) % 20,
      })
    }, 6000);
  }


  getRandomBackground(selectedCountry){
    let randomNumber =  Math.floor(Math.random() * 10);
    let backgroundToReturn = ""

    switch(randomNumber) {
      case 1:
        backgroundToReturn = background1
        break
      case 2:
        backgroundToReturn =  background2
        break
      case 3:
        backgroundToReturn =  background3
        break
      case 4:
        backgroundToReturn =  background4
        break
      case 5:
        backgroundToReturn =  background5
        break
      case 6:
        backgroundToReturn =  background6
        break
      case 7:
        backgroundToReturn =  background7
        break
      case 8:
        backgroundToReturn =  background8
        break
      case  9:
        backgroundToReturn =  background9
        break
      case 10:
        backgroundToReturn =  background10
        break
      default:
        backgroundToReturn =  background11
        break
    }

    if( selectedCountry != ""){
      if (this.state.countryToBackgroundImage[selectedCountry].bckUrl != undefined &&
          this.state.countryToBackgroundImage[selectedCountry].bckUrl != ""){
        backgroundToReturn =  this.state.countryToBackgroundImage[selectedCountry].bckUrl
      }
    }

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

  selectCountryFlag(code){
    this.setState({
      selectedCode: code,
      background: this.getRandomBackground(code),
    })
  }

  render() {
    if(this.state.songs.length > 0){
      return (
        <div className="Searcher">
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

            <SongList
              songs={this.state.songs}
              filteredSongs={this.state.filteredSongs}
              playSong={this.playSong}
              expandResults={this.state.expandResults}
            />

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
        </div>
      );
    }
    return (
      <div className="Dots">
        <Dots
          color={'#3F51B5'}
        />
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