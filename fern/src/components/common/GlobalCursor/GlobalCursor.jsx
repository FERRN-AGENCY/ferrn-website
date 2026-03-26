import { useEffect, useState, useRef } from 'react';
// THE FIX: Imported AnimatePresence from framer-motion for smooth disappearing
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useRequireName } from '../../../hooks/useRequireName'; 

import styles from './GlobalCursor.module.css';

const GlobalCursor = () => {
  const displayName = useRequireName();
  
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // --- NEW: State & Ref for the Name Bubble Timer ---
  const [showName, setShowName] = useState(true);
  const nameTimerRef = useRef(null);

  // Tracks the mouse coordinates
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Springs make it feel buttery smooth instead of jagged
  const springConfig = { damping: 25, stiffness: 700, mass: 0.1 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Disable on mobile so it doesn't get stuck on the screen
    if (window.innerWidth <= 768) {
      setIsMobile(true);
      return;
    }

    // 1. Start the initial 10-second timer when the app loads
    nameTimerRef.current = setTimeout(() => {
      setShowName(false);
    }, 10000);

    const moveCursor = (e) => {
      cursorX.set(e.clientX - 2); 
      cursorY.set(e.clientY - 2);
      if (!isVisible) setIsVisible(true);
    };

    // 2. The Click Handler: Shows the name, then hides it after 2 seconds
    const handleMouseClick = () => {
      setShowName(true);
      
      // Clear any existing timer so spam-clicking doesn't glitch it out
      if (nameTimerRef.current) clearTimeout(nameTimerRef.current);
      
      // Set a new timer to hide it again after a brief moment (2.5 seconds)
      nameTimerRef.current = setTimeout(() => {
        setShowName(false);
      }, 2500);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseClick); // Listen for clicks!
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseClick);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (nameTimerRef.current) clearTimeout(nameTimerRef.current); // Cleanup timer
    };
  }, [cursorX, cursorY, isVisible]);

  if (isMobile) return null;

  return (
    <motion.div
      className={styles.cursorWrapper}
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        opacity: isVisible ? 1 : 0,
      }}
    >
      {/* THE ORANGE SHAPE FROM YOUR SCREENSHOT */}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.cursorShape}>
        <path d="M2 2 H18 V8 H8 V18 H2 V2 Z" fill="#F94406" />
      </svg>

      {/* THE FIX: Smoothly animates the name bubble in and out based on the showName state */}
      <AnimatePresence>
        {displayName && showName && (
          <motion.span 
            className={styles.cursorName}
            initial={{ opacity: 0, scale: 0.8, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {displayName}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GlobalCursor;