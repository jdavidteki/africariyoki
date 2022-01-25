import React, { Component } from 'react';
import Header from './components/header/Header';
import Searcher from './components/searcher/Searcher.js';
import Composer from './components/composer/Composer.js';
import KaraokeDisplay from './components/karaokedisplay/KaraokeDisplay.js'
import Admin from './components/admin/Admin.js'
import GuessSong from './components/guessSong/GuessSong.js'
import AnnotationFixer from './components/annotationFixer/AnnotationFixer.js'
import PopularLine from './components/popularLine/PopularLine.js'
import LRCFixer from './components/lrcFixer/LRCFixer.js'
import { Switch, Route } from "react-router-dom";
import ForOFor from './components/forofor/ForOFor.js';
import CompleteTheLyrics from './components/completelyrics/CompleteLyrics.js';
import Games from './components/games/Games.js';
import ScoreboardGuessSong from './components/scoreboardGuessSong/ScoreboardGuessSong.js';
import ScoreboardNextLine from './components/scoreboardNextLine/ScoreboardNextLine.js';
import ScoreboardGuessSongLine from './components/scoreboardGuessSongLine/ScoreboardGuessSongLine.js';
import UpdatePopline from './components/updatepopline/UpdatePopline.js'

import "./App.css";

window.onresize = function() {
  document.getElementsByClassName("App").height = window.innerHeight;
}
window.onresize();

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-body">
          <div className="content">
            <Switch>
              <Route path="/" exact component={Composer} />
              <Route path="/africariyoki" exact component={Searcher} />
              <Route path="/admin" exact component={Admin} />
              <Route path="/guesssong" exact component={GuessSong} />
              <Route path="/karaokedisplay/:id" component={KaraokeDisplay} />
              <Route path="/lrcfixer/:id" component={LRCFixer} />
              <Route path="/game" exact component={Games} />
              <Route path="/guessthesong" exact component={GuessSong} />
              <Route path="/popularline" exact component={PopularLine} />
              <Route path="/cls" exact component={CompleteTheLyrics}/>
              <Route path="/annotationfixer/:id" component={AnnotationFixer} />
              <Route path="/scoreboardguesssong" component={ScoreboardGuessSong} />
              <Route path="/scoreboardnextline" component={ScoreboardNextLine} />
              <Route path="/scoreboardguesssongline" component={ScoreboardGuessSongLine} />
              <Route path="/updatepopline" component={UpdatePopline} />
              <Route component={ForOFor}/>
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

//this comment is to trigger a rebuild
export default App;
