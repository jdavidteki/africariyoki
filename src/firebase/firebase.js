import firebase from "firebase";

class Firebase {
  getLyrics = () =>{
    return new Promise(resolve => {
      firebase.database()
      .ref('/lyrics/')
      .once('value')
      .then(snapshot => {
        if (snapshot.val()){
          resolve(Object.values(snapshot.val()))
        }else{
          resolve({})
        }
      })
    })
  }

  getLyricsById = (id) =>{
    return new Promise(resolve => {
      firebase.database()
      .ref('/lyrics/'+id)
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

  getStoryFromID = (id) =>{
    return new Promise(resolve => {
      firebase.database()
      .ref('/bckStory/bck'+id)
      .once('value')
      .then(snapshot => {
        if (snapshot.val()){
          resolve(Object(snapshot.val()))
        }else{
          resolve({})
        }
      }).catch(error => {
        console.log("error", error)
      })
    })
  }

  addStoryFromID = (item) => {
    return new Promise(resolve => {
      console.log("item", item)
      firebase.database()
      .ref('/bckStory/bck'+item.id)
      .update(
        {
          title: item.title,
          author: item.author,
          content: item.content,
          dateCreated: item.dateCreated,
        }
      )
      .then((response) => {
        console.log("response", response)
        resolve(true)
      })
      .catch(error => {
        console.log("error", error)
      })
    })
  }

  storage = () => {
    return firebase.storage()
  }

  deleteRecp = (songId) => {
    return new Promise(resolve => {
      firebase.database()
      .ref('/lyrics/'+songId)
      .remove()
      .then(() => {
        resolve(true)
      }).catch( (error) =>{
        console.log("error", error)
      })
    })
  }

  updateNumPlays = (songId, numPlays) =>{
    return new Promise(resolve => {
      firebase.database()
      .ref('/lyrics/' + songId + '/')
      .update(
        {
          numPlays: numPlays,
        },
      )
      .then((response) => {
        console.log("response", response)
        resolve(true)
      })
      .catch(error => {
        console.log("error", error)
      })
    })
  }

  addAfricariyoki = (item) => {
    return new Promise(resolve => {
      firebase.database()
      .ref('/lyrics/' + item.id + '/')
      .set(
        {
          id: item.id,
          title: item.title,
          lyricsurl: item.lyricsurl,
          singer: item.singer,
          audiourl: item.audiourl,
          lyrics: item.lyrics,
          title: item.title,
          countries: item.countries,
          dateAdded: item.dateAdded,
          albumName: item.albumName,
          numPlays: 2000,
          lrcDone: 0,
        },
      )
      .then((response) => {
        resolve(true)
      })
      .catch(error => {
        console.warn("error", error)
      })
    })
  }

  bckMappings = () => {
    return new Promise(resolve => {
      firebase.database()
      .ref('/searcherBackgrounds/')
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

  updateSearcherBck = (country, bckUrl) => {
    return new Promise(resolve => {
      firebase.database()
      .ref('/searcherBackgrounds/' + country + '/')
      .update({bckUrl})
      .then((response) => {
        console.log("response", response)
        resolve(true)
      })
      .catch(error => {
        console.log("error", error)
      })
    })
  }

  updateSongInfo = (songId, detailsToUpdate) =>{
    return new Promise(resolve => {
      console.log("detailsToUpdate", detailsToUpdate)
      firebase.database()
      .ref('/lyrics/' + songId + '/')
      .update(
        {
          title: detailsToUpdate?.title?.length > 0 ? detailsToUpdate.title : '',
          lyricsurl: detailsToUpdate?.lyricsurl?.length > 0 ? detailsToUpdate.lyricsurl : '',
          singer: detailsToUpdate?.singer?.length > 0 ? detailsToUpdate.singer : '',
          audiourl: detailsToUpdate?.audiourl?.length > 0 ? detailsToUpdate.audiourl : '',
          lyrics: detailsToUpdate?.lyrics?.length > 0 ? detailsToUpdate.lyrics : '',
          title: detailsToUpdate?.title?.length > 0 ? detailsToUpdate.title : '',
          countries: detailsToUpdate?.countries?.length > 0 ? detailsToUpdate.countries : '',
          dateAdded: detailsToUpdate?.dateAdded?.length > 0 ? detailsToUpdate.dateAdded : '',
          albumName: detailsToUpdate?.albumName?.length > 0 ? detailsToUpdate.albumName : '',
          turnedOn: detailsToUpdate?.turnedOn?.length > 0 ? detailsToUpdate.turnedOn : 0
        },
      )
      .then((response) => {
        console.log("response", response)
        resolve(true)
      })
      .catch(error => {
        console.log("error", error)
      })
    })
  }

  updateLyrics = (songId, lyrics) => {
    return new Promise(resolve => {
      firebase.database()
      .ref('/lyrics/' + songId + '/')
      .update(
        {
          lyrics: lyrics,
          lrcDone: 1,
        },
      )
      .then((response) => {
        console.log("response", response)
        resolve(true)
      })
      .catch(error => {
        console.log("error", error)
      })
    })
  }

  postTransaction = (userInfo, recpInfo, cardInfo, transInfo) =>{
    return new Promise(resolve => {
      firebase.database()
      .ref('/userTransactions/' + userInfo.user.uid + '/' + transInfo.id + '/')
      .set(
        {
          transactionId: transInfo.id,
          accountNumber: recpInfo.accountNumber,
          bankName: recpInfo.bankName,
          recpFirstName: recpInfo.firstName,
          recpLastName: recpInfo.lastName,
          cardUsed: cardInfo.number,
          recpAmt: transInfo.recpAmt,
          sendAmt: transInfo.sendAmt,
          recpCurrency: transInfo.recpCurrency,
          sendCurrency: transInfo.sendCurrency,
          rate: transInfo.rate,
          isSuccessful: true,
          time: '13:03'
        },
      )
      .then((response) => {
        resolve(true)
      })
      .catch(error => {
        console.warn("error", error)
      })
    })
  }
}

export default new Firebase();
