// app.js

import React, { useState } from 'react';
import ReactLoading from 'react-loading';
import Confetti from 'react-confetti'
import './App.css'; // Import the CSS file for styling

function App() {
  const [inputText, setInputText] = useState('');
  const [confetti, setConfetti] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [reelDuration, setReelDuration] = useState('medium'); // Default to medium
  const [selectedLanguage, setSelectedLanguage] = useState('en-US'); // Default to English
  const [loading, setLoading] = useState(false); // New state for loading indicator

  const handleInputChange = (event) => {
    setInputError(false)
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
      setLoading(true); // Set loading to true when making the request
      setInputText("")

      // Check if inputText is empty
      if (!inputText.trim()) {
        throw new Error('Please enter text before generating the reel.');
    }
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
        setConfetti(true)

      } else {
        console.error('Error generating reel:', response.statusText);
        setLoading(false); // Set loading back to false when the request is complete
      

      }
    } catch (error) {
      console.error('Error:', error.message);
      setLoading(false); // Set loading back to false when the request is complete
      setInputError(true);

    }
    finally {
      setLoading(false); // Set loading back to false when the request is complete
    }
  };

  return (
    <div className="app">
      {
        confetti ? 
        <Confetti recycle={false} numberOfPieces={1000} gravity={0.6}
        />:
          <></>
      }
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
          ReeLit and make your words truly come alive.
        </p>

        <div >
          <textarea 
            id="textInput"
            value={inputText}
            onChange={handleInputChange}
            style={{ fontWeight: 'bold', 
            height: "100px", 
            resize: 'none' ,
            border:`1px solid ${inputError ? 'red' : '#ccc'}`
          }}
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
        <button onClick={generateReel} style={{ fontWeight: 'bold' }} disabled={loading}>
        {loading ?<>
          <ReactLoading type="spin" color="#fff" />
        </>  
         : 'Generate Reel'}
        </button>
      </header>
    </div>
  );
}

export default App;
