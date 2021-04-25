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


  fs.createReadStream('AfricariyokiPlaylist.csv')
  .pipe(csv())
  .on('data', (row) => {
    if (!(idsArray.includes(row.videoID) || titlesArray.includes(row.title.toLowerCase().replace(/\s/g, '')))){
      console.log(row)
      uploadToFirebase(row)
    }
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });
})


function uploadToFirebase(song){
  let audioUrl = `https://storage.googleapis.com/africariyoki-4b634.appspot.com/music/${song.videoID}.mp3`
  let lyricsTextUrl = `https://storage.googleapis.com/africariyoki-4b634.appspot.com/lyrics/${song.videoID}.txt`
  // let addressID = 'http://0.0.0.0:5000'
  let addressID = "https://a588b312f36d.ngrok.io"
  // if(song.addressID){
  //     addressID = "http://0.0.0.0:5000"
  // }else{
  //     addressID = "https://"+addressID+".ngrok.io"
  // }

  new Promise(resolve => {
    firebase.database()
    .ref('/lyrics/' + song.videoID + '/')
    .set(
      {
        id: song.videoID,
        title: song.title,
        lyricsurl: lyricsTextUrl,
        singer: song.singer,
        audiourl: audioUrl,
        lyrics: song.lyrics,
        albumName: song.albumName,
      },
    )
    .then((response) => {
      resolve(true)
    })
    .catch(error => {
      console.log("error", error)
    })
  })

  // use ai to extract vocall from music and upload instrumental
  var requestOptions = {
      method: 'GET',
      redirect: 'follow'
  };
  fetch(`${addressID}/vr/${song.videoID}`, requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
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