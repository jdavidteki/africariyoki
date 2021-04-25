
import React, { Component } from 'react';

import './PopularSongs.css';

class PopularSongs extends Component {
  constructor(props){
    super(props);

    this.state= {}
  }

  componentDidMount() {
    var cards = document.querySelectorAll(".card");

    document.addEventListener("DOMContentLoaded", isCardVisible(cards));
    window.addEventListener("scroll", isCardVisible(cards));
    window.addEventListener("resize", isCardVisible(cards));

  }

  render() {
    return (
        <div className="PopularSongs wrapper">
            <div className="card">
                <img src="https://i.ibb.co/Wc7RLgG/pikachu.png" />
                <h2 className="card-title">Pikachu</h2>
            </div>
            <div className="card">
                <img src="https://i.ibb.co/TkBFwhX/alakazam.png" />
                <h2 className="card-title">Alakazam</h2>
            </div>
            <div className="card">
                <img src="https://i.ibb.co/fXsLm23/arbok.png" />
                <h2 className="card-title">Arbok</h2>
            </div>
            <div className="card">
                <img src="https://i.ibb.co/gwdv5nV/bulbasaur.png" />
                <h2 className="card-title">Bulbasaur</h2>
            </div>
            <div className="card"><img src="https://i.ibb.co/ZKqChM6/butterfree.png" />
                <h2 className="card-title">Butterfree</h2>
            </div>
            <div className="card">
                <img src="https://i.ibb.co/89F8Kct/charmander.png" />
                <h2 className="card-title">Charmander</h2>
            </div>
            <div className="card">
                <img src="https://i.ibb.co/b6WPmYn/exeggutor.png" />
                <h2 className="card-title">Exeguttor</h2>
            </div>
            <div className="card">
                <img src="https://i.ibb.co/51SCFG1/voltorb.png" />
                <h2 className="card-title">Voltorb</h2>
            </div>
            <div className="card">
                <img src="https://i.ibb.co/r7j7Tq7/jigglypuff.png" />
                <h2 className="card-title">Jigglypuff</h2>
            </div>
            <div className="card">
                <img src="https://i.ibb.co/mcFQ5jZ/magikarp.png" />
                <h2 className="card-title">Magikarp</h2>
            </div>
            <div className="card">
                <img src="https://i.ibb.co/4VysCs0/meowth.png" />
                <h2 className="card-title">Meowth</h2>
            </div>
            <div className="card">
                <img src="https://i.ibb.co/zXz0LZ7/pidgeotto.png" />
                <h2 className="card-title">Pidgeotto</h2>
            </div>
            <div className="card">
                <img src="https://i.ibb.co/xmz6Q7b/snorlax.png" />
                <h2 className="card-title">Snorlax</h2>
            </div>
            <div className="card">
                <img src="https://i.ibb.co/8Y9v7tF/squirtle.png" />
                <h2 className="card-title">Squirtle</h2>
            </div>
            <div className="card">
                <img src="https://i.ibb.co/Y3287sv/starmie.png" />
                <h2 className="card-title">Starmie</h2>
            </div>
            <div className="card">
                <img src="https://i.ibb.co/x3cBmSZ/venonat.png" />
                <h2 className="card-title">Venonat</h2>
            </div>
        </div>
    );
  }
}

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

function isCardVisible() {
  console.log("cards", cards)

  for (card of cards) {
    isElementInViewport(card)
      ? card.classList.add("isVisible")
      : card.classList.remove("isVisible");
  }
}

export default PopularSongs;
