// app.js

import React, { useState } from 'react';
import './App.css'; // Import the CSS file for styling

function App() {
  const [inputText, setInputText] = useState('');
  const [reelDuration, setReelDuration] = useState('medium'); // Default to medium
  const [selectedLanguage, setSelectedLanguage] = useState('en-US'); // Default to English

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleReelDurationChange = (duration) => {
    setReelDuration(duration);
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const generateReel = async () => {
    try {
      const postData = {
        text: inputText,
        length: reelDuration,
        language: selectedLanguage
      };

      const response = await fetch('http://localhost:5000/reelgenerator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });

      if (response.ok) {
        // Assuming the server responds with a file
        const blob = await response.blob();

        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);

        // Create a link and trigger a click to download the file
        const a = document.createElement('a');
        a.href = url;
        a.download = 'generated_reel.mp4'; // Set the desired filename
        a.click();

        // Clean up the URL object
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Error generating reel:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div className="app">
      <video className="video-background" autoPlay loop muted>
        <source src={process.env.PUBLIC_URL + "/my_video.mp4"} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <header className="header-container">
        <div className="logo-container">
          <img style={{ maxWidth: "200px" }} src={process.env.PUBLIC_URL + "/company_logo.png"} alt="Company Logo" />
        </div>

        <p style={{ fontWeight: 'bold' }}>
          Elevate your messages with
          ReelIt and make your words truly come alive.
        </p>

        <div className="input-container">
          <textarea
            id="textInput"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Type your text here..."
          />
        </div>
        <div className="duration-buttons">
          <p className="video-length-title">Video Length:</p>
          <button style={{ fontWeight: 'bold' }}
            className={reelDuration === 'short' ? 'active' : ''}
            onClick={() => handleReelDurationChange('short')}
          >
            Short
          </button>
          <button style={{ fontWeight: 'bold' }}
            className={reelDuration === 'medium' ? 'active' : ''}
            onClick={() => handleReelDurationChange('medium')}
          >
            Medium
          </button>
          <button style={{ fontWeight: 'bold' }}
            className={reelDuration === 'long' ? 'active' : ''}
            onClick={() => handleReelDurationChange('long')}
          >
            Long
          </button>
        </div>
        <div className="language-selector">
          <label htmlFor="languageSelect">Select Language:</label>
          <select id="languageSelect" value={selectedLanguage} onChange={handleLanguageChange}>
            <option value="en-US">English</option>
            <option value="fr">French</option>
            <option value="es">Espanol</option>
            <option value="zh">Chinese</option>
            {/* Add more language options as needed */}
          </select>
        </div>
        <button onClick={generateReel} style={{ fontWeight: 'bold' }}>Generate Reel</button>
      </header>
    </div>
  );
}

export default App;
