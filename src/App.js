import React, { Component } from 'react';
import Header from './components/header/Header';
import Searcher from './components/searcher/Searcher.js';
import KaraokeDisplay from './components/karaokedisplay/KaraokeDisplay.js'
import Admin from './components/admin/Admin.js'
import LRCFixer from './components/lrcFixer/LRCFixer.js'
import { Switch, Route } from "react-router-dom";
import { Analytics, PageHit } from 'expo-analytics';

import "./App.css";


const analytics = new Analytics('UA-187038287-1');
analytics.hit(new PageHit('Home'))
  .then(() => console.log("Google analyytics setup"))
  .catch(e => console.log(e.message));

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <div className="App-body">
          <div className="content">
            <Switch>
              <Route path="/" exact component={Searcher} />
              <Route path="/africariyoki" exact component={Searcher} />
              <Route path="/admin" exact component={Admin} />
              <Route path="/karaokedisplay/:id" component={KaraokeDisplay} />
              <Route path="/lrcfixer/:id" component={LRCFixer} />
              <Route
                component={() => (
                  <div style={{ padding: 20 }}>Page coming soon...</div>
                )}
              />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
