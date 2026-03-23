import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // 1. Imported framer-motion for the drop animation
import styles from './Onboarding.module.css';
import images from '../../images'; 

import { UserContext } from '../../context/UserContext';

const Onboarding = () => {
  const [inputValue, setInputValue] = useState('');
  
  // 2. State to hold the typewriter text as it builds
  const [placeholderText, setPlaceholderText] = useState(''); 
  const fullPlaceholder = "Your name is.....";

  const { setUserName } = useContext(UserContext);
  const navigate = useNavigate();

  // 3. The Typewriter Effect Logic
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullPlaceholder.length) {
        // Slices the string to add one letter at a time
        setPlaceholderText(fullPlaceholder.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval); // Stops the loop when finished
      }
    }, 100); // Adjust this number (100ms) to make it type faster or slower

    // Cleanup interval on unmount
    return () => clearInterval(typingInterval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      // 1. NEW: Save it to local storage permanently
      localStorage.setItem('ferrn_user', inputValue.trim());
      
      // 2. Keep your context set if you still use it
      setUserName(inputValue.trim()); 
      
      navigate('/experience');
    }
  };
  

  return (
    <div className={styles.onboardingContainer}>
      
      {/* 4. Wrapped the logo in a motion.div to make it drop down */}
      <motion.div 
        className={styles.topLogo}
        initial={{ y: -100, opacity: 0 }}       // Starts 100px above the screen and invisible
        animate={{ y: 0, opacity: 1 }}          // Slides down to its original position
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }} // Smooth bounce at the end
      >
        <img src={images.Fernlogo} alt="Fern Logo" />
      </motion.div>

      <div className={styles.card}>
        <h1 className={styles.heading}>
          Want the Best experience?
          <span className={styles.subHeading}> Tell us your name</span>
        </h1>

        <form onSubmit={handleSubmit} className={styles.inputGroup}>
          <input 
            type="text" 
            placeholder={placeholderText} // Binds the typing effect state here
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className={styles.nameInput}
            autoFocus
          />
          <button type="submit" className={styles.submitButton}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.568 9.94986L3.03601 11.2049C2.94942 11.2193 2.86815 11.2563 2.80039 11.3121C2.73263 11.368 2.68077 11.4406 2.65001 11.5229L0.0530096 18.4809C-0.19499 19.1209 0.47401 19.7309 1.08801 19.4229L19.088 10.4229C19.2124 10.3605 19.317 10.2648 19.3901 10.1464C19.4632 10.0279 19.502 9.89152 19.502 9.75236C19.502 9.6132 19.4632 9.47678 19.3901 9.35836C19.317 9.23995 19.2124 9.14421 19.088 9.08186L1.08801 0.0818581C0.47401 -0.225142 -0.19499 0.384858 0.0530096 1.02386L2.65101 7.98186C2.68177 8.06409 2.73363 8.13676 2.80139 8.19259C2.86915 8.24841 2.95042 8.28541 3.03701 8.29986L10.569 9.55486C10.616 9.56236 10.6588 9.58636 10.6896 9.62256C10.7205 9.65876 10.7375 9.70478 10.7375 9.75236C10.7375 9.79994 10.7205 9.84596 10.6896 9.88216C10.6588 9.91835 10.616 9.94236 10.569 9.94986" fill="white"/>
            </svg>
          </button>
        </form>
      </div>

    </div>
  );
};

export default Onboarding;