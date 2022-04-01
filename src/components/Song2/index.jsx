import React from 'react';
import './Song.css';
import codeToCountries from "../searcher/codeToCountry.js";
import { Emoji } from 'emoji-mart'

function Song(props){
  if(props.song.title != ''){
    return (
      <div
        className="Song"
        id={props.song.id}
        onClick={() => props.playSong(props.song.id)}
        style={{ backgroundColor: props.backgroundColor ? props.backgroundColor : '#7b7b7b' }}
      >
        <span className="Song-title">{props.song.title}</span>
        <span className="Song-singer">{props.song.singer}</span>

        {props.countries != null &&
          <div className="Song-countryFlags">
            {props.countries.split(",").map((country) =>
              <Emoji
                key={country}
                emoji={"flag-" + getCodeFromCountryName(country.trim()).toLowerCase()}
                size={18}
              />
            )}
          </div>
        }
      </div>
    )
  }
}

function getCodeFromCountryName(value) {
  let val = Object.keys(codeToCountries).find(key => codeToCountries[key] === value)
  if (val == undefined){
    return ""
  }
  return val
}

export default Song;
