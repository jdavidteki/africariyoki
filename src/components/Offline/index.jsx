import React, { Component } from "react";
import NoSleep from 'nosleep.js';
import { GetUniqueListBy } from "../helpers/Helpers";
import Firebase from "../../firebase/firebase.js";

import downloadIcon from "../../../static/img/download-2@2x.png"

import "./Offline.css";

var noSleep = new NoSleep();

class Offline extends Component {
  constructor(props){
    super(props);

    this.state = {
      songs: [],
      updateSongIndex: 0,
      stopUpdating: true,
      updateDownloadCTA: 'start update',
      yokis: [],
      showOfflinePane: false
    }
  }

  player = null

  componentDidUpdate(prevProps, prevState){
    if (prevProps.songs !== this.props.songs) {
      this.setState({songs: this.props.songs})

      let localYokis = JSON.parse(localStorage.getItem('yokis'));
      if (localYokis != null && localYokis['yokis'].length >  0){
          this.setState({yokis: localYokis['yokis']})
      }
    }
  }

  componentDidMount(){
    noSleep.enable();

    //if there are atleast ten yokis downloaded
    let localYokis = JSON.parse(localStorage.getItem('yokis'));
    if (localYokis != null && localYokis['yokis'].length >=  10){
      let localYokisArray = Object.values(localYokis['yokis'])
      this.setState({
        songs: localYokisArray,
      })
    }else{
      Firebase.getLyrics().then(
        val => {
            val = val.filter(v => v.useForGames == 1);
            this.setState({
              songs: val,
            })
        }
      )
    }
  }

  componentWillUnmount(){
    noSleep.disable();
  }

  handleUpdatingYokis =  () => {
      localStorage.removeItem('yokis')
      this.setState({
        yokis: [],
        stopUpdating: false,
      }, ()=>{this.indexedDBGet(this.state.songs)})
  }

  pauseUpdating = () =>{
    this.setState({
      stopUpdating: true
    })
  }

  async getAudioFilesAndPutInLocalDB(yokis, db){
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    for(var i = 0; i < yokis.length; i++){
      if (!this.state.stopUpdating){
        let yokisId = yokis[i].id
        await fetch(`https://storage.googleapis.com/africariyoki-4b634.appspot.com/music/${yokisId}.mp3`, requestOptions)
        .then(response => response.blob())
        .then(async result => {
          var blob = result;

          // Open a transaction to the database
          //TODO: figure out how to make this check local yokis before adding new ones to reduce waist of bandwidth
          var transaction = db.transaction(["yokis"], "readwrite");
          transaction.objectStore("yokis").put(blob, yokisId);

          if(this.state.songs[this.state.updateSongIndex] != undefined){
            this.setState(previousState => ({
              yokis: getUniqueListBy([...previousState.yokis, yokis[i]], 'id')
            }), ()=>{
              localStorage.setItem('yokis', JSON.stringify({
                  "yokis": this.state.yokis,
              }));
            });
          }
        })
        .catch(error => console.log('error', error));
      }
      setTimeout(()=>{}, 250)
    }
  }

  indexedDBGet(yokis){
    var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
        dbVersion =  1000000000

    // Create/open database --this is like a variable block in javascript
    var request = indexedDB.open("yokisFolder", dbVersion),
        createObjectStore = function (dataBase) {

          if(dataBase.objectStoreNames.length == 0) { //TODO: if we ever have to add more dbs, then we will need have to rethink this. sorry, whichever dev has to work on this
            // Create an objectStore
            console.log("Creating objectStore")
            dataBase.createObjectStore("yokis");
          }
        }

    request.onerror = (event) => {
      console.log("Error creating/accessing IndexedDB database", event);
    };

    request.onsuccess = (event) =>  {
      console.log("Success creating/accessing IndexedDB database", event);
      var db = request.result;

      db.onerror = function (event) {
        console.log("Error creating/accessing IndexedDB database", event);
      };

      //TODO: this is not necessary anymore so lets remove after thorough research
      // Interim solution for Google Chrome to create an objectStore. Will be deprecated
      if (db.setVersion) {
        if (db.version != dbVersion) {
          var setVersion = db.setVersion(db.version + 1); //always make sure to update to current version + 1
          setVersion.onsuccess = function () {
            createObjectStore(db);

            setTime(() => {
              this.getAudioFilesAndPutInLocalDB(yokis, db);
            }, 2000)
          };
        }
        else {
          this.getAudioFilesAndPutInLocalDB(yokis, db);
        }
      } else {
        this.getAudioFilesAndPutInLocalDB(yokis, db);
      }
    }

    // For future use. Currently only in latest Firefox versions
    request.onupgradeneeded = function (event) {
      createObjectStore(event.target.result);
    };
  }

  render(){
    return (
      <div className="Offline">
        <div className="Offline-icon" onClick={()=>this.setState({showOfflinePane: true})}>
          {this.state.useIcon
            ?
              <InsertCommentIcon className={"Offline-insertCommentIcon"} style={{ color: '#3413f1' }} />
            :
              <span className="Offline-cta">play offline</span>
          }
        </div>

        {this.state.showOfflinePane &&
          <div className="container-center-horizontal">
            <div className="offline screen">
              <div className="offline-1">
                <div className="content-11">
                  <div className="lyrics-13 poppins-medium-martinique-35px">
                    <span className="poppins-medium-martinique-35px">enjoy africariyoki offline</span>
                  </div>
                  <div className="play-games-and-sing poppins-normal-martinique-20px">
                    <span className="poppins-normal-martinique-20px">play games and sing along offline</span>
                  </div>
                  <div className="frame-237">
                    <div className="buttons-6" onClick={() => this.handleUpdatingYokis()}>
                      <div className="listen poppins-medium-zircon-20px">
                        <span className="poppins-medium-zircon-20px">download</span>
                      </div>
                      <img className="download-1" src={downloadIcon} />
                    </div>
                    <div className="x12-mb-300-songs poppins-normal-storm-gray-14px">
                      <span className="poppins-normal-storm-gray-14px">{this.state.yokis.length} - {this.state.songs.length} yokis</span>
                    </div>
                  </div>
                </div>
                <div className="buttons-7" onClick={() => this.setState({showOfflinePane: false})}>
                  <div className="text-50 valign-text-middle poppins-medium-pine-green-20px">
                    <span>
                      <span className="poppins-medium-pine-green-20px">hide</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

function getUniqueListBy(arr, key) {
  return [...new Map(arr.map(item => [item[key], item])).values()]
}


export default Offline;