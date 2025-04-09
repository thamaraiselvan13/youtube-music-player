import React, { useEffect, useRef } from 'react';
import YouTube from 'react-youtube';

function YouTubePlayer({ videoId, isPlaying, onReady, onStateChange, onTimeUpdate, onEnd, volume }) {
  const playerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.setVolume(volume * 100);
    }
  }, [volume]);

  const opts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      rel: 0,
      origin: window.location.origin,
    },
  };

  const handleReady = (event) => {
    playerRef.current = event.target;
    playerRef.current.setVolume(volume * 100);
    
    // Start time update interval
    intervalRef.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const currentTime = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();
        onTimeUpdate(currentTime, duration);
      }
    }, 1000);
    
    if (onReady) {
      onReady();
    }
  };

  const handleStateChange = (event) => {
    if (event.data === YouTube.PlayerState.ENDED && onEnd) {
      onEnd();
    }
    if (onStateChange) {
      onStateChange(event);
    }
  };

  const handleError = (error) => {
    console.error('YouTube Player Error:', error);
    // You can add custom error handling here
  };

  return (
    <div style={{ display: 'none' }}>
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={handleReady}
        onStateChange={handleStateChange}
        onError={handleError}
      />
    </div>
  );
}

export default YouTubePlayer;