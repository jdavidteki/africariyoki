import Firebase from "./src/firebase/firebase.js";
import firebase from "firebase";
import config from './src/firebase/config.js';

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

Firebase.getVersion().then(
    val => {
      Firebase.setVersion(val+1).then(() => {
        process.exit(1);
      })
    }
)