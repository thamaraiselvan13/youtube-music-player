import React from 'react'

function MusicList({ songs, currentSongIndex, onSongSelect }) {
  return (
    <div className="music-list">
      <h2>Playlist</h2>
      <ul>
        {songs.map((song, index) => (
          <li 
            key={index} 
            className={index === currentSongIndex ? 'active' : ''}
            onClick={() => onSongSelect(index)}
          >
            <img 
              src={song.cover} 
              alt={song.title} 
              className="song-cover-small"
            />
            <div className="song-details">
              <div className="song-title">{song.title}</div>
              <div className="song-artist">{song.artist}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MusicList