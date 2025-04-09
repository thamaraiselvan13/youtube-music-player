import { useState, useEffect } from 'react'
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp } from 'react-icons/fa'
import './App.css'
import MusicList from './components/MusicList'
import YouTubePlayer from './components/YouTubePlayer'
import Lyrics from './components/Lyrics'
import SearchBar from './components/SearchBar'
import SearchResults from './components/SearchResults'
import { songs } from './data/songs'
import { searchYouTubeVideos, getAudioStreamUrl } from './services/youtubeService'

function App() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playerReady, setPlayerReady] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [playlist, setPlaylist] = useState(songs)
  const [isLoading, setIsLoading] = useState(false)
  
  const currentSong = playlist[currentSongIndex]
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }
  
  const handlePrevious = () => {
    setCurrentSongIndex(prev => (prev === 0 ? playlist.length - 1 : prev - 1))
    setIsPlaying(true)
  }
  
  const handleNext = () => {
    setCurrentSongIndex(prev => (prev === playlist.length - 1 ? 0 : prev + 1))
    setIsPlaying(true)
  }
  
  const handleTimeUpdate = (currentTime, duration) => {
    setCurrentTime(currentTime)
    setDuration(duration)
  }
  
  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value)
    setCurrentTime(newTime)
    
    // This would seek the YouTube player to the new time
    const iframe = document.querySelector('iframe');
    if (iframe) {
      const player = iframe.contentWindow;
      player.postMessage(JSON.stringify({
        event: 'command',
        func: 'seekTo',
        args: [newTime, true]
      }), '*');
    }
  }
  
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    
    // This would set the YouTube player volume
    const iframe = document.querySelector('iframe');
    if (iframe) {
      const player = iframe.contentWindow;
      player.postMessage(JSON.stringify({
        event: 'command',
        func: 'setVolume',
        args: [newVolume * 100]
      }), '*');
    }
  }
  
  const handleSongSelect = (index) => {
    setCurrentSongIndex(index)
    setIsPlaying(true)
  }
  
  const handlePlayerReady = () => {
    setPlayerReady(true)
    setIsLoading(false)
    
    // Set initial volume
    const iframe = document.querySelector('iframe');
    if (iframe) {
      const player = iframe.contentWindow;
      player.postMessage(JSON.stringify({
        event: 'command',
        func: 'setVolume',
        args: [volume * 100]
      }), '*');
    }
  }
  
  const handleSearch = async (query) => {
    setIsLoading(true);
    try {
      const results = await searchYouTubeVideos(query);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectVideo = (video) => {
    setIsLoading(true);
    
    // Create a new song object from the YouTube video
    const newSong = {
      title: video.snippet.title,
      artist: video.snippet.channelTitle,
      youtubeId: video.id.videoId,
      cover: video.snippet.thumbnails.medium.url,
      // We're using YouTube's embed API for audio, as direct MP3 extraction requires server-side processing
      audioUrl: getAudioStreamUrl(video.id.videoId)
    };
    
    // Add the new song to the playlist
    const updatedPlaylist = [...playlist, newSong];
    setPlaylist(updatedPlaylist);
    
    // Play the new song
    setCurrentSongIndex(updatedPlaylist.length - 1);
    setIsPlaying(true);
    
    // Hide search results
    setShowSearchResults(false);
  };
  
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  return (
    <div className="music-player">
      <div className="player-container">
        <div className="player-header">
          <h1>YouTube Music Player</h1>
        </div>
        
        <SearchBar onSearch={handleSearch} />
        
        {isLoading && (
          <div className="loading-indicator">
            <p>Loading...</p>
          </div>
        )}
        
        <SearchResults 
          results={searchResults} 
          onSelectVideo={handleSelectVideo}
          isVisible={showSearchResults && !isLoading}
        />
        
        <div className="now-playing">
          <img 
            src={currentSong.cover} 
            alt={currentSong.title} 
            className="album-cover"
          />
          <div className="song-info">
            <h2>{currentSong.title}</h2>
            <h3>{currentSong.artist}</h3>
          </div>
        </div>
        
        <div className="progress-container">
          <span className="time">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.01"
            value={currentTime}
            onChange={handleProgressChange}
            className="progress-bar"
          />
          <span className="time">{formatTime(duration)}</span>
        </div>
        
        <div className="controls">
          <button onClick={handlePrevious} className="control-btn">
            <FaStepBackward />
          </button>
          <button onClick={handlePlayPause} className="control-btn play-btn">
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button onClick={handleNext} className="control-btn">
            <FaStepForward />
          </button>
          <div className="volume-control">
            <FaVolumeUp />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
          </div>
        </div>
        
        <YouTubePlayer
          videoId={currentSong.youtubeId}
          isPlaying={isPlaying}
          onReady={handlePlayerReady}
          onTimeUpdate={handleTimeUpdate}
          onEnd={handleNext}
          volume={volume}
        />
        
        <Lyrics 
          title={currentSong.title}
          artist={currentSong.artist}
        />
      </div>
      
      <MusicList 
        songs={playlist} 
        currentSongIndex={currentSongIndex}
        onSongSelect={handleSongSelect}
      />
    </div>
  )
}

export default App