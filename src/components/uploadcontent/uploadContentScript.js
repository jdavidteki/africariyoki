const csv = require('csv-parser');
const fs = require('fs');
const fetch = require("node-fetch");

var firebase = require('firebase');

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyCIg3Xc3yYNYgXL90XXwaW2cyMafnvusYE",
    authDomain: "africariyoki-4b634.firebaseapp.com",
    databaseURL: "https://africariyoki-4b634-default-rtdb.firebaseio.com",
    projectId: "africariyoki-4b634",
    storageBucket: "africariyoki-4b634.appspot.com",
    messagingSenderId: "171492275085",
    appId: "1:171492275085:web:f2c1364b0feee41e1083c4",
    measurementId: "G-TSPVJ130EK"
  });
}

getLyrics().then( val => {
  let idsArray = Object.keys(val)
  let titlesArray = Object.values(val).map(a => a.title.toLowerCase().replace(/\s/g, ''))
  let countriesArray = Object.values(val).map(a => a.countries.toLowerCase().replace(/\s/g, ''))
  let songs = Object.values(val)

  let allSongIds = [
    '7DxG33tEJKE', 'Qtfslc-VAhA',
    'XkP3dHiJ0dI', 'mV_zjss2nlY',
    'mZKwbR1Kjr4', 'n3hSeu2NYXU',
    'oAcWCGgF-tY', 'qm-8MuocmVY',
    'rO49fDRz-3k', 's5xiYjLF5Uo',
    'sRS8Afj3dOM', 'ssvZdVkYg3I',
    'sz5EhyESHR8', 'uZ-_HIoEBE8',
    'x9a6kz1-mgo', 'z3hZrOu-FTo'
  ]


  for (let i=0; i<allSongIds.length; i++){
    uploadToFirebase(allSongIds[i])
  }

  // fs.createReadStream('AfricariyokiPlaylist.csv')
  // .pipe(csv())
  // .on('data',(row) => {
  //   if (!(idsArray.includes(row.videoID) || titlesArray.includes(row.title.toLowerCase().replace(/\s/g, '')))){
  //     console.log(row)
  //     uploadToFirebase(row)
  //   }
  // })
  // .on('end',() => {
  //   console.log('CSV file successfully processed');
  // });
})


function uploadToFirebase(song){
  let audioUrl = `https://storage.googleapis.com/africariyoki-4b634.appspot.com/music/${song}.mp3`
  let lyricsTextUrl = `https://storage.googleapis.com/africariyoki-4b634.appspot.com/lyrics/${song}.txt`
  // let addressID = 'http://0.0.0.0:5000'
  let addressID = "http://3927183ba8ff.ngrok.io"
  // if(song.addressID){
  //     addressID = "http://0.0.0.0:5000"
  // }else{
  //     addressID = "https://"+addressID+".ngrok.io"
  // }

  // new Promise(resolve => {
  //   firebase.database()
  //   .ref('/lyrics/' + song.id + '/')
  //   .set(
  //     {
  //       id: song.id,
  //       title: song.title,
  //       lyricsurl: lyricsTextUrl,
  //       singer: song.singer,
  //       audiourl: audioUrl,
  //       lyrics: song.lyrics,
  //       albumName: song.albumName,
  //     },
  //   )
  //   .then((response) => {
  //     resolve(true)
  //   })
  //   .catch(error => {
  //     console.log("error", error)
  //   })
  // })

  // use ai to extract vocall from music and upload instrumental
  var requestOptions = {
      method: 'GET',      redirect: 'follow'
  };
  fetch(`${addressID}/vr/${song}`, requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error',error));
}

async function getLyrics(){
  return new Promise(resolve => {
    firebase.database()
    .ref('/lyrics/')
    .once('value')
    .then(snapshot => {
      if (snapshot.val()){
        resolve(Object(snapshot.val()))
      }else{
        resolve({})
      }
    })
  })
}

async function updateNoMp3InCountryName(songId, countries){
  console.log("songId, countries)", songId, countries)
  return new Promise(resolve => {
    firebase.database()
    .ref('/lyrics/' + songId + '/')
    .update(
      {
        countries: countries,
      },
    )
    .then((response) => {
      console.log("reposne", response)
      resolve(true)
    })
    .catch(error => {
      console.log("error", error)
    })
  })
}
