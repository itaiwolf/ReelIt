// app.js

import React, { useState } from 'react';
import ReactLoading from 'react-loading';
import Confetti from 'react-confetti'
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import './App.css'; // Import the CSS file for styling
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [inputText, setInputText] = useState('');
  const [confetti, setConfetti] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [reelDuration, setReelDuration] = useState('medium'); // Default to medium
  const [selectedLanguage, setSelectedLanguage] = useState('en'); // Default to English
  const [loading, setLoading] = useState(false); // New state for loading indicator

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Espanol' },
    { value: 'fr', label: 'French' },
    { value: 'zh', label: 'Chinese' },
     {/* Add more language options as needed */}
  ];

  const handleInputChange = (event) => {
    setInputError(false)
    setInputText(event.target.value);
  };

  const handleReelDurationChange = (duration) => {
    setReelDuration(duration);
  };

  const generateReel = async () => {
    try {
      // Check if inputText is empty
      if (!inputText.trim()) {
        setInputError(true);
        toast.error("No empty text :)")
        return
    }
      setLoading(true); // Set loading to true when making the request
      setInputText("")
      
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
        setInputError(false)
        toast.success("Reel generated successfully!")

      } else {
        console.error('Error generating reel:', response.statusText);
        setLoading(false); // Set loading back to false when the request is complete
        toast.error("Error generating reel. Please try again later.")
      }
    } catch (error) {
      console.error('Error:', error.message);
      setLoading(false); // Set loading back to false when the request is complete
      toast.error("Error generating reel. Please try again later.")

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
        <div className="language-selector" >
          <p className="video-length-title">Language:</p>
          <div style={{textAlign: "center",margin: "10px"}}>
          <Select
            onChange={setSelectedLanguage}
            options={languageOptions}
            placeholder={"English"}
            />
            </div>
        </div>
        <button onClick={generateReel} style={{ fontWeight: 'bold' }} disabled={loading}>
        {loading ?<>
          <ReactLoading type="bars" color="#fff" />
        </>  
         : 'Generate Reel'}
        </button>
      </header>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={true}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
          theme="light"
          />
    </div>
    
  );
}

export default App;
