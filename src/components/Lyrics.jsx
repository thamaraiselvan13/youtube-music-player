import React, { useState, useEffect } from 'react';
import { fetchLyrics } from '../services/lyricsService';

function Lyrics({ title, artist }) {
  const [lyrics, setLyrics] = useState('Loading lyrics...');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getLyrics = async () => {
      setIsLoading(true);
      try {
        const fetchedLyrics = await fetchLyrics(title, artist);
        setLyrics(fetchedLyrics);
      } catch (error) {
        setLyrics('Lyrics not available');
        console.error('Error fetching lyrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getLyrics();
  }, [title, artist]);

  return (
    <div className="lyrics-container">
      <h3>Lyrics</h3>
      {isLoading ? (
        <div className="lyrics-loading">Loading lyrics...</div>
      ) : (
        <div className="lyrics-content">
          {lyrics.split('\n').map((line, index) => (
            <p key={index} className="lyrics-line">
              {line || <br />}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default Lyrics;