import React, { Component } from 'react';
import SongList from '../songLIst/SongList';
import Firebase from "../../firebase/firebase.js";
import TextField from "@material-ui/core/TextField";
import ReactTypingEffect from 'react-typing-effect';
import codeToCountries from "./codeToCountry.js";
import CloseIcon from '@material-ui/icons/Close';
import blankBack from "./assets/blankBack.jpeg"
import MetaTags from 'react-meta-tags';
import Sbta from '../sbta/Sbta.js'
import Yokis from '../Yokis/Yokis.js'
import YokiPhone from '../yokiPhone/YokiPhone.js'
import { Analytics, PageHit } from 'expo-analytics';
import Suggestions from "../suggestions/Suggestions";
import { SocialIcon } from 'react-social-icons';

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
      openSuggestionModal: false,
      inputPromptMsg: 'english: what do you want to sing to',
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

    const analytics = new Analytics('UA-187038287-1');
    analytics.hit(new PageHit('Searcher'))
      .then(() => console.log("google analytics on searcher"))
      .catch(e => console.log(e.message));


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

    //try to load local songs file first
    let localSongs = JSON.parse(localStorage.getItem('lyrics'));
    if (localSongs != null){
      let localLyrics = localSongs['lyrics']
      this.setState({
        songs: localLyrics,
        songsCopy: localLyrics,
        typingEffectSongs: shuffleArray(localLyrics.map(a => a.turnedOn == 1 ? a.title : '').filter(a => a != '')),
        songIds: localLyrics.map(a => a.id),
      })
    }

    //if there is no internet connection this should atleast work
    Firebase.getLyrics().then(
      val => {
        this.setState({
          songs: val,
          songsCopy: val,
          typingEffectSongs: shuffleArray(val.map(a => a.turnedOn == 1 ? a.title : '').filter(a => a != '')),
          songIds: val.map(a => a.id),
        })

        localStorage.setItem('lyrics', JSON.stringify({
          "lyrics": val,
        }));
      }
    )

    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      mode: 'no-cors'
    };
    //download all the images for caching purposes
    for(var i = 0; i < 11; i++) {
      fetch(`https://firebasestorage.googleapis.com/v0/b/africariyoki-4b634.appspot.com/o/searchBackgrounds%2Fbck${i}bck.jpeg?alt=media`, requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error',error));
    }

    //interval for changing song options
    setInterval( () => {
      this.setState({
        count: (this.state.count+1) % 20,
      })
    }, 6000);

    //interval for chainging input prompt
    let nthPromptToShow = 0
    setInterval( () => {
      nthPromptToShow += 1
      this.setState({
        inputPromptMsg: this.getRandomPromptMsg(nthPromptToShow % 10)
      })
    }, 2000);
  }

  getRandomPromptMsg(nthPromptToShow){
    switch(nthPromptToShow) {
      case 3:
        return 'pidgin: wetin you wan sing' //pidgin
      case 4:
        return 'yoruba: kini o fẹ lati kọrin si' //yoruba
      case 5:
        return 'igbo: kedu ihe ị chọrọ ịbụ abụ' //igbo
      case 6:
        return 'hausa: me kuke so ku yi waka' //hausa
      case 7:
        return 'swahili: unataka kuimba nini' //swahili
      case 8:
        return 'afrikaans: waarvoor wil jy sing' //afrikaans
      case 9:
        return 'amharic: ምን መዝፈን ትፈልጋለህ' //amharic
      case 10:
        return 'zulu:  ufuna ukucula ini' //zulu
      case 11:
        return 'shona: unoda kuimbira chii' //shona
      default:
        //we want english to take more screen time
        return 'english: what do you want to sing to' //english
    }
  }

  getRandomBackground(selectedCountry){
    let randomNumber =  Math.floor(Math.random() * (11 - 1 + 1) + 1)
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

  suggestSong=() => {
    this.setState({
      openSuggestionModal: true,
    })
  }

  selectCountryFlag(code){
    this.setState({
      selectedCode: code,
      background: this.getRandomBackground(code),
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
        {this.state.openSuggestionModal &&
          <div className="Searcher-openSuggestionModal">
            <CloseIcon
              fontSize={'large'}
              className={"Searcher-openSuggestionModal-close"}
              style={{ color: '#f7f8e4' }}
              onClick={()=>{this.setState({openSuggestionModal: false})}}
            />
            <Suggestions />
          </div>
        }
        <MetaTags>
          <title>africariyoki - karaoke with africa!</title>
          <meta name="description" content={this.getSongDetails()} />
          <meta property="og:title" content="africariyoki" />
          <meta http-equiv='cache-control' content='no-cache' />
          <meta http-equiv='expires' content='0' />
          <meta http-equiv='pragma' content='no-cache' />
        </MetaTags>

        {/* these will remain for SEO purposes */}
          <h1 itemprop="headline" style={{ display: "none" }}>#karaokewithafrica - #karaoke, african karaoke, #nigeriankaraoke, #lagoskaraoke, #ghana iankaraoke</h1>
        {/* ******** */}

        <div className="Searcher-metastuff" style={{ display: "none" }}>
          <div>{this.getSongDetails()}</div>
          <div>african karaoke and games. other features include afrobeat app guess the song </div>
          <div itemscope itemtype="https://schema.org/SoftwareApplication">
            <span itemprop="name">africariyoki</span> -

            <span itemprop="applicationCategory" content="WebApplication">
              our fun games to play with friends include guess the song, guess song line, and next line.
            </span>

            <div itemprop="aggregateRating" itemscope itemtype="https://schema.org/AggregateRating">
              <span itemprop="ratingValue">5</span> (
              <span itemprop="ratingCount">8864</span> ratings )
            </div>
          </div>
        </div>

        <div
          style={{ backgroundImage: `url(${this.state.background})` }}
          className="Searcher-background">
            <div className="Searcher-backgroundOverlay"></div>
        </div>
        <div className="Searcher-container">
          <div className="Searcher-inputWrapper">
            <TextField
              className="Searcher-input"
              shrink='true'
              label={`${this.state.selectedCode != '' ? ' what do you want to sing from ' + codeToCountries[this.state.selectedCode] + ' today??': '     ' + this.state.inputPromptMsg}?`}
              variant="outlined"
              onChange={event=>{
                this.setState({query: event.target.value}, ()=> {
                  this.filterSong(this.state.query)
                })
              }}
            />

            {/* NOTE: dont remove this. incase we want to add search by country in the future */}
            {/* <div className="Searcher-flagClose">
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
            </div> */}
          </div>


          {this.state.songs.length > 0
          ?
            <SongList
              songs={this.state.songs}
              filteredSongs={this.state.filteredSongs}
              playSong={this.playSong}
              suggestSong={this.suggestSong}
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

        <div className="Searcher-lowerPane">
          <div className="Searcher-lowerPane--leftPane">
            <SocialIcon bgColor={"#3413f1"} fgColor={"white"} className={"Searcher-socialMedia Searcher-instagram Searcher-lowerPaneIcon"}  url="https://www.instagram.com/africariyoki/" />
            <SocialIcon bgColor={"#3413f1"} fgColor={"white"} className={"Searcher-socialMedia Searcher-twitter Searcher-lowerPaneIcon" }  url="https://www.twitter.com/africariyoki/" />
          </div>
          <div className="Searcher-lowerPane--rightPane">
            {/* use microphone for only mobile so users can use their phones as a semi-megaphone */}
            {window.innerWidth < 767 &&
              <YokiPhone />
            }
            <a
              className="Searcher-yokiNFTLink"
              variant="outlined"
              color="primary"
              href="https://opensea.io/collection/yokithoughtsnfts"
              target="_blank"
            >
              NFTs
            </a>
            <Yokis songs={this.state.songs}/>
            <Sbta useDefaultImage={false} imageBckNum={this.state.bckImageNum} />
          </div>
        </div>
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
