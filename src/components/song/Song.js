import React from 'react';
import './Song.css';

const Song = (props) => {
  return (
    <div
      className="Song"
      onClick={() => props.playSong(props.song.id)}
    >
      <span className="Song-title">{props.song.title}</span>
      <span className="Song-singer">{props.song.singer}</span>
    </div>
  )
}

export default Song;
