import React from 'react';

function SearchResults({ results, onSelectVideo, isVisible }) {
  if (!isVisible || results.length === 0) {
    return null;
  }

  return (
    <div className="search-results">
      <h3>Search Results</h3>
      <ul className="results-list">
        {results.map((video) => (
          <li 
            key={video.id.videoId} 
            className="result-item"
            onClick={() => onSelectVideo(video)}
          >
            <img 
              src={video.snippet.thumbnails.medium.url} 
              alt={video.snippet.title} 
              className="result-thumbnail"
            />
            <div className="result-details">
              <div className="result-title">{video.snippet.title}</div>
              <div className="result-channel">{video.snippet.channelTitle}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchResults;