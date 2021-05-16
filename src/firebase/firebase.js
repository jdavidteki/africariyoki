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

  storage = () => {
    return firebase.storage()
  }

  deleteRecp = (songId) => {
    console.log("songId", songId)
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
          dateAdded: item.today,
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
        console.log("reposne", response)
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
