import React, { useState, useEffect, useRef } from 'react';
import { Mic, Check, Copy } from 'lucide-react';
import { transliterateTamilToEnglish } from './transliteration';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [tamilText, setTamilText] = useState('');
  const [englishName, setEnglishName] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'ta-IN'; // Explicitly set to Tamil (India)

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setError('');
      };

      recognitionRef.current.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        setTamilText(transcript);
        setIsProcessing(true);
        setError('');

        try {
          // Transliterate to English
          const englishTranslation = await transliterateTamilToEnglish(transcript, API_KEY);
          setEnglishName(englishTranslation);
        } catch (e) {
          setError(e.message || 'Transliteration failed. (மாற்றமைத்தல் தோல்வியடைந்தது)');
        } finally {
          setIsProcessing(false);
        }
      };

      recognitionRef.current.onerror = (event) => {
        setIsListening(false);
        setError('Could not hear clearly. Please try again. (தெளிவாக கேட்கவில்லை. மீண்டும் முயற்சிக்கவும்.)');
        console.error('Speech recognition error', event.error);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setError('Your browser does not support voice recognition. Please use Chrome or Safari. (உங்கள் உலாவி குரல் அங்கீகாரத்தை ஆதரிக்கவில்லை.)');
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTamilText('');
      setEnglishName('');
      setCopied(false);
      setError('');
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const copyToClipboard = () => {
    if (englishName) {
      navigator.clipboard.writeText(englishName);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="app-container">
      <div className="glass-panel">
        <h1 className="title">
          Tamil Name Typer<br />
          <span style={{fontSize: '0.55em', fontWeight: 800, letterSpacing: 'normal'}}>தமிழ் பெயர் தட்டச்சு</span>
        </h1>
        <p className="subtitle">
          Tap the mic and say a name in Tamil<br />
          மைக்-ஐ அழுத்தி தமிழில் பெயரைச் சொல்லவும்
        </p>

        <div className="mic-button-container">
          {isListening && <div className="ripple"></div>}
          <button
            className={`mic-button ${isListening ? 'listening' : ''}`}
            onClick={toggleListening}
            aria-label="Start recording"
          >
            <Mic size={40} />
          </button>
        </div>

        <div className="result-container">
          {error ? (
            <p className="error-text">{error}</p>
          ) : englishName ? (
            <>
              <h2 className="transliterated-name">{englishName}</h2>
              {tamilText && <p className="tamil-original">({tamilText})</p>}

              <button
                className={`copy-button ${copied ? 'copied' : ''}`}
                onClick={copyToClipboard}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? 'Copied! (நகலெடுக்கப்பட்டது!)' : 'Copy Name (பெயரை நகலெடு)'}
              </button>
            </>
          ) : (
            <p className="instruction-text">
              {isProcessing ? 'Processing... (செயலாக்குகிறது...)' : isListening ? 'Listening... (கவனிக்கிறது...)' : 'Waiting for voice... (தொடங்க மைக்கை அழுத்தவும்)'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
