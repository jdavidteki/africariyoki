import React, { Component } from 'react';
import Header from './components/header/Header';
import Searcher from './components/searcher/Searcher.js';
import KaraokeDisplay from './components/karaokedisplay/KaraokeDisplay.js'
import UploadContent from './components/uploadcontent/UploadContent.js'
import { Switch, Route } from "react-router-dom";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <div className="App-body">
          <div className="content">
            <Switch>
              <Route path="/africariyoki/" exact component={Searcher} />
              <Route path="/africariyoki/karaokedisplay/:id" component={KaraokeDisplay} />
              <Route path="/africariyoki/upload" exact component={UploadContent} />
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