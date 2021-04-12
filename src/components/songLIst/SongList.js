import React from 'react';
import Song from '../song/Song'
import './SongList.scss';

const SongList = (props) => {
  let className = "SongList"
  if (props.expandResults == true){
    className = "SongList SongList-expandResults"
  }
  return (
    <div className={className}>
      {
        props.filteredSongs.length > 0
        ?
          <div className="SongList-container">
            {props.filteredSongs.map(song => <Song key= {song.id} song={song} playSong={props.playSong}/>)}
          </div>
        :
          <div className="SongList-emptySearch">
            you too search something we have, mtchewww
          </div>
      }
    </div>
  )
}

export default SongList;
