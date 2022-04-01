import React from 'react';
import Song from '../Song2'
import { Emoji } from 'emoji-mart'

import './SongList.css';

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
            {props.filteredSongs.map(song => <Song key= {song.id} song={song} playSong={props.playSong} countries={song.countries}/>)}
          </div>
        :
          <div className="SongList-emptySearch-wrapper">
            <span className="SongList-emptySearch">
              you too, search something we have! mtchewww
              <Emoji
                emoji={'face_with_rolling_eyes'}
                set='apple'
                size={16}
              />
              <Emoji
                emoji={'unamused'}
                set='apple'
                size={16}
              />
            </span>
            <span className="SongList-emptySearch">or you can <span onClick={()=>{props.suggestSong()}} className="SongList-suggestText">suggest</span> a song to us</span>
          </div>
      }
    </div>
  )
}

export default SongList;
