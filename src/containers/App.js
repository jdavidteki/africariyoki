import React, { Component } from 'react';
import Header from '../components/header/Header';
import Searcher from '../components/searcher/Searcher.js';
import KaraokeDisplay from '../components/karaokedisplay/KaraokeDisplay'
import UploadContent from '../components/uploadcontent/UploadContent'
import { Switch, Route } from "react-router-dom";
import "./App.scss";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <div className="App-body">
          <div className="content">
            <Switch>
              <Route path="/africariyoki" exact component={Searcher} />
              <Route path="/africariyoki/karaokedisplay/:id" component={KaraokeDisplay} />
              <Route path="/africariyoki/upload" component={UploadContent} />
              <Route
                component={() => (
                  <div style={{ padding: 20 }}>Page not found</div>
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
