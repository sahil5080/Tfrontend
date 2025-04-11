import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [link, setLink] = useState('');
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVideo = async () => {
    if (!link) return;
    setLoading(true);
    setVideoUrl(null);
    setError(null);

    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL || window.location.origin;
      const res = await axios.get(`${baseUrl}/fetch-terabox`, { params: { url: link } });
      const data = res.data;
      const video = data?.data?.file_list?.[0];
      if (video?.dlink) {
        setVideoUrl(video.dlink);
      } else {
        setError("No video found or unable to extract video URL.");
      }
    } catch (err) {
      setError("Failed to fetch video. Check backend server.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Terabox Video Player</h1>
      <input
        type="text"
        placeholder="Enter Terabox video link"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
      />
      <button onClick={fetchVideo} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Video'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {videoUrl && (
        <div style={{ marginTop: '2rem' }}>
          <video controls style={{ width: '100%' }}>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}

export default App;
