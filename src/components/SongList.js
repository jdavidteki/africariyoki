import React from 'react';
import Song from './Song'

const SongList = (props) => {
  return (
    <table className="song-list">
      <tbody>
        {props.songs.map(song => <Song key= {song.id} song={song} playSong={props.playSong}/>)}

      </tbody>
    </table>
  )
}

export default SongList;
