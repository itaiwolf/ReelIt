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

  const generateReel = () => {
    // Add logic for generating the reel based on the inputText, reelDuration, and selectedLanguage
    // This is where you would make an API call or perform any necessary actions
    // to create the video reel.
    console.log(`Generating reel for: ${inputText}, Duration: ${reelDuration}, Language: ${selectedLanguage}`);
  };

  return (
    <div className="app">
      <video className="video-background" autoPlay loop muted>
        <source src={process.env.PUBLIC_URL + "/my_video.mp4"} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <header>
      <img className="logo" src={process.env.PUBLIC_URL + "/company_logo.png"} alt="Company Logo" />
        <h1>Reelit</h1>
      <img style={{maxWidth: "150px"}} src={process.env.PUBLIC_URL + "/company_logo.png"} alt="Company Logo" />

        <p style={{fontWeight: 'bold'}}>
          Elevate your messages with
          Reelit and make your words truly come alive!
        </p>
      </header>
      <main>
        <div className="center-container">
          <div className="input-container">
            <textarea
              id="textInput"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Type your text here..."
            />
          </div>
          <div className="duration-buttons"  >
          <p className="video-length-title">Video Length:</p>
            <button style={{fontWeight: 'bold'}}
              className={reelDuration === 'short' ? 'active' : ''}
              onClick={() => handleReelDurationChange('short')}
            >
              Short
            </button>
            <button style={{fontWeight: 'bold'}}
              className={reelDuration === 'medium' ? 'active' : ''}
              onClick={() => handleReelDurationChange('medium')}
            >
              Medium
            </button>
            <button style={{fontWeight: 'bold'}}
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
              <option value="fr">Espanol</option>
              <option value="fr">Chinese</option>
              {/* Add more language options as needed */}
            </select>
          </div>
          <button onClick={generateReel}>Generate Reel</button>
        </div>
      </main>
    </div>
  );
}

export default App;
