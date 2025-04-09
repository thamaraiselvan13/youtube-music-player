import axios from 'axios';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Rate limiting protection
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const searchYouTubeVideos = async (query) => {
  try {
    // Rate limiting protection
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      await delay(MIN_REQUEST_INTERVAL - timeSinceLastRequest);
    }
    lastRequestTime = Date.now();

    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        maxResults: 5,
        q: query,
        type: 'video',
        key: API_KEY,
      },
    });

    if (!response.data.items || response.data.items.length === 0) {
      throw new Error('No videos found');
    }

    return response.data.items;
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    if (error.response) {
      // Handle specific API errors
      switch (error.response.status) {
        case 403:
          throw new Error('YouTube API quota exceeded or invalid API key');
        case 404:
          throw new Error('No videos found');
        default:
          throw new Error(`YouTube API error: ${error.response.status}`);
      }
    }
    throw error;
  }
};

// This function gets a video by ID
export const getVideoDetails = async (videoId) => {
  try {
    // Rate limiting protection
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      await delay(MIN_REQUEST_INTERVAL - timeSinceLastRequest);
    }
    lastRequestTime = Date.now();

    const response = await axios.get(`${BASE_URL}/videos`, {
      params: {
        part: 'snippet',
        id: videoId,
        key: API_KEY,
      },
    });

    if (!response.data.items || response.data.items.length === 0) {
      throw new Error('Video not found');
    }

    return response.data.items[0];
  } catch (error) {
    console.error('Error getting video details:', error);
    if (error.response) {
      switch (error.response.status) {
        case 403:
          throw new Error('YouTube API quota exceeded or invalid API key');
        case 404:
          throw new Error('Video not found');
        default:
          throw new Error(`YouTube API error: ${error.response.status}`);
      }
    }
    throw error;
  }
};

// Function to get audio-only stream URL (this is a mock function as YouTube API doesn't directly provide MP3 URLs)
export const getAudioStreamUrl = (videoId) => {
  return `https://www.youtube.com/embed/${videoId}`;
};

// Mock search results function - used as fallback if API call fails
const getMockSearchResults = (query) => {
  // Generate some mock results based on the search query
  return [
    {
      id: { videoId: 'dQw4w9WgXcQ' },
      snippet: {
        title: `${query} - Top Hit`,
        channelTitle: 'Popular Artist',
        thumbnails: {
          medium: {
            url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
          }
        }
      }
    },
    {
      id: { videoId: 'hTWKbfoikeg' },
      snippet: {
        title: `${query} Cover Version`,
        channelTitle: 'Cover Artist',
        thumbnails: {
          medium: {
            url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
          }
        }
      }
    },
    {
      id: { videoId: 'fJ9rUzIMcZQ' },
      snippet: {
        title: `${query} Live Performance`,
        channelTitle: 'Live Music Channel',
        thumbnails: {
          medium: {
            url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
          }
        }
      }
    },
    {
      id: { videoId: 'YR5ApYxkU-U' },
      snippet: {
        title: `${query} Acoustic Version`,
        channelTitle: 'Acoustic Sessions',
        thumbnails: {
          medium: {
            url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
          }
        }
      }
    },
    {
      id: { videoId: 'btPJPFnesV4' },
      snippet: {
        title: `${query} Music Video`,
        channelTitle: 'Music Videos',
        thumbnails: {
          medium: {
            url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
          }
        }
      }
    }
  ];
};