import React, { Component } from 'react';
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import Admin from './components/admin/Admin.js'
import GuessSong from './components/guessSong/GuessSong.js'
import AnnotationFixer from './components/annotationFixer/AnnotationFixer.js'
import PopularLine from './components/popularLine/PopularLine.js'
import LRCFixer from './components/lrcFixer/LRCFixer.js'
import ForOFor from './components/forofor/ForOFor.js';
import CompleteTheLyrics from './components/completelyrics/CompleteLyrics.js';
import Games from './components/games/Games.js';
import ScoreboardGuessSong from './components/scoreboardGuessSong/ScoreboardGuessSong.js';
import ScoreboardNextLine from './components/scoreboardNextLine/ScoreboardNextLine.js';
import ScoreboardGuessSongLine from './components/scoreboardGuessSongLine/ScoreboardGuessSongLine.js';
import UpdatePopline from './components/updatepopline/UpdatePopline.js'
import Homepage3 from "./components/Homepage3";
import Karaoke from "./components/Karaoke";
import GuessTheSong from "./components/GuessTheSong";
import PopularLines from "./components/PopularLines";
import NextLine from "./components/NextLine"

import "./App.css";

window.onresize = function() {
  document.getElementsByClassName("App").height = window.innerHeight;
}
window.onresize();

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={Homepage3} />
          <Route path="/africariyoki" exact component={Homepage3} />
          <Route path="/admin" exact component={Admin} />
          <Route path="/guesssong" exact component={GuessTheSong} />
          <Route path="/karaokedisplay/:id" component={Karaoke} />
          <Route path="/lrcfixer/:id" component={LRCFixer} />
          <Route path="/game" exact component={Games} />
          <Route path="/guessthesong" exact component={GuessTheSong} />
          <Route path="/popularline" exact component={PopularLines} />
          <Route path="/cls" exact component={NextLine}/>
          <Route path="/annotationfixer/:id" component={AnnotationFixer} />
          <Route path="/scoreboardguesssong" component={ScoreboardGuessSong} />
          <Route path="/scoreboardnextline" component={ScoreboardNextLine} />
          <Route path="/scoreboardguesssongline" component={ScoreboardGuessSongLine} />
          <Route path="/updatepopline" component={UpdatePopline} />
          <Route path="/karaoke/:id" component={Karaoke} />
          <Route path="/guess-the-song" component={GuessTheSong} />
          <Route path="/popular-lines" component={PopularLines} />
          <Route path="/next-line" component={NextLine} />
          <Route component={ForOFor}/>
        </Switch>
      </Router>
    );
  }
}

//this comment is to trigger a rebuild
export default App;
