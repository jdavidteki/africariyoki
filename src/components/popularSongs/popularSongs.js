
import React, { Component } from 'react';
import Song from '../song/Song'

import './PopularSongs.css';

class PopularSongs extends Component {
  constructor(props){
    super(props);

    this.state= {
        cards: this.props.cards,
        thisSongId: this.props.thisSongId
    }
  }

    componentDidMount() {
        document.addEventListener("load", this.isCardVisible, true);
        window.addEventListener("scroll", this.isCardVisible, true);
        window.addEventListener("resize", this.isCardVisible, true);
    }

    isCardVisible() {
        let cards = document.querySelectorAll(".card");

        for (var i = 0; i < cards.length; ++i) {
            isElementInViewport(cards[i]) ? cards[i].classList.add("isVisible") : cards[i].classList.remove("isVisible");
        }
    }

  render() {
    return (
        <div className="PopularSongs wrapper">
            {this.state.cards.map((song) =>
                song.turnedOn == 1 &&
                song.id != this.state.thisSongId &&
                    <div className="card" key={song.id}>
                        <Song
                            key={song.id}
                            song={song}
                            playSong={this.props.playSong}
                        />
                    </div>
            )}
        </div>
    );
  }
}

export default PopularSongs;

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}