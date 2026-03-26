import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useLocation } from 'react-router-dom'; 
import { useRequireName } from '../../../hooks/useRequireName'; 

import styles from './GlobalCursor.module.css';

const GlobalCursor = () => {
  const displayName = useRequireName();
  const location = useLocation();
  
  const isOnboardingPage = location.pathname === '/'; 
  
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 700, mass: 0.1 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsMobile(true);
      return;
    }

    const moveCursor = (e) => {
      // Offset by -2 so the very tip of the arrow is where the click happens
      cursorX.set(e.clientX - 2); 
      cursorY.set(e.clientY - 2);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
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
        pointerEvents: "none" 
      }}
    >
      <div className={styles.cursorContainer}>
        {/* THE CHUNKY ARROW */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M3 3L21 9L13 12L9 19L3 3Z" 
            fill="#F94406" 
            stroke="#F94406" 
            strokeWidth="1" 
            strokeLinejoin="round"
          />
        </svg>

        {/* THE NAME: Positioned under the curve */}
        {displayName && !isOnboardingPage && (
          <span className={styles.cursorName}>
            {displayName}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default GlobalCursor;