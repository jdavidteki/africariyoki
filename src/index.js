import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/pure-min.css';
import './assets/css/index.css';
import App from './containers/App';
import firebase from "firebase";
import config from './firebase/config.js';
import { BrowserRouter } from "react-router-dom";

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

let app = (
    <BrowserRouter>
        <App />
    </BrowserRouter>
);

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

ReactDOM.render(app, document.getElementById('root'));
