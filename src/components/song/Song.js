import React from 'react';
import './Song.scss';

const Song = (props) => {
  console.log(props)
  return (
    <div
      className="Song"
      onClick={() => props.playSong(props.song.id)}
    >
      <span>{props.song.title}</span>
      <span>{props.song.singer}</span>
    </div>
  )
}

export default Song;
