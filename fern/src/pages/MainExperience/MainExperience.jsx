import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion'; 
import styles from './MainExperience.module.css';
import images from '../../images'; 
import { useRequireName } from '../../hooks/useRequireName';

const MainExperience = () => {
  const displayName = useRequireName();

  const [displayedHeadline, setDisplayedHeadline] = useState('');
  const [isTypingStarted, setIsTypingStarted] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);

  const fullHeadline = `Welcome ${displayName || ''} at Ferrn, we turn "meh" ideas into "whoa" brands.`;

  // ⏱️ THE FIX: SNAPPY, ZERO-WAIT TIMINGS
  const OVERLAY_FADE_DURATION = 1000; // Overlay fades in over 1 second smoothly
  const HEADER_DROP_DELAY = 300;      // Logo drops almost instantly (0.3s)
  const TYPING_START_DELAY = 1000;    // Typing starts right as the logo finishes dropping (1s)
  const TYPING_SPEED = 40;           

  // ==========================================
  // 🎢 THE SCROLL MAGIC 
  // ==========================================
  const { scrollY } = useScroll();

  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0], { ease: (t) => t * (2 - t) });
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.8], { ease: (t) => t * (2 - t) }); 

  const navOpacity = useTransform(scrollY, [0, 250], [1, 0]);
  const navScale = useTransform(scrollY, [0, 250], [1, 0.5]);

  const logoScale = useTransform(scrollY, [0, 300], [1, 2.5]); 
  const logoY = useTransform(scrollY, [0, 300, 450, 700], [0, 250, 250, -500]); 
  // ==========================================

  // Typing Effect Logic
  useEffect(() => {
    const initialDelay = setTimeout(() => {
      setIsTypingStarted(true);
      
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex <= fullHeadline.length) {
          setDisplayedHeadline(fullHeadline.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval); 
          setIsTypingComplete(true); 
        }
      }, TYPING_SPEED); 

      return () => clearInterval(typingInterval);
    }, TYPING_START_DELAY); 

    return () => clearTimeout(initialDelay);
  }, [fullHeadline]);

  // "Scroll Down" Bounce Logic
  useEffect(() => {
    const totalEntranceTime = TYPING_START_DELAY + (fullHeadline.length * TYPING_SPEED);
    const startBouncing = setTimeout(() => {
      const bounceInterval = setInterval(() => {
        setIsBouncing(true);
        setTimeout(() => setIsBouncing(false), 500); 
      }, 5000);
      return () => clearInterval(bounceInterval);
    }, totalEntranceTime);
    return () => clearTimeout(startBouncing);
  }, [fullHeadline.length]);

  if (!displayName) return null;

  return (
    <div className={styles.heroContainer} style={{ position: 'sticky', top: 0, zIndex: 0, backgroundColor: 'var(--bg-primary)' }}>
      
      <motion.div 
        style={{ 
          opacity: heroOpacity, 
          scale: heroScale, 
          width: '100%', 
          height: '100%', 
          position: 'absolute',
          willChange: "transform, opacity" 
        }}
      >
        
        {/* THE VIDEO */}
        <video 
          src={images.heroVideo} 
          poster={images.fernwebsite1} 
          className={styles.bgVideo} 
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          style={{ 
            objectFit: 'cover', 
            width: '100%', 
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0
          }}
        />

        {/* THE OVERLAY: Instantly starts fading to 0.4 opacity over 1 second */}
        <motion.div 
          className={styles.videoOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }} 
          transition={{ 
            duration: OVERLAY_FADE_DURATION / 1000, 
            ease: "easeOut" 
          }}
          style={{ position: 'absolute', inset: 0, zIndex: 20 }} 
        ></motion.div>

        {/* THE TYPING TEXT */}
        <div className={styles.contentLayer} style={{ zIndex: 30 }}>
          <div className={styles.centerContent} >
            <h1 className={styles.heroHeadline}>
              {displayedHeadline}
              {isTypingStarted && !isTypingComplete && <span className={styles.cursor}>|</span>}
            </h1>
          </div>
        </div>
      </motion.div>

      {/* THE HEADER & LOGO */}
      <motion.header 
        className={styles.header}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}          
        transition={{ delay: HEADER_DROP_DELAY / 1000, duration: 0.8, ease: "easeOut" }} 
        style={{ 
          position: 'relative', 
          zIndex: 40,
        }}
      >
        <motion.img 
          src={images.Fern} 
          alt="Ferrn Logo" 
          className={styles.centerLogo} 
          style={{ 
            scale: logoScale, 
            y: logoY,
            willChange: "transform" 
          }}
        />
        
        <motion.span 
          className={styles.welcomeNav}
          animate={{ y: isBouncing ? [0, -8, 8, -8, 8, 0] : 0 }}
          transition={{ duration: isBouncing ? 0.6 : 0 }}
          style={{ 
            opacity: navOpacity, 
            scale: navScale,
            willChange: "transform, opacity" 
          }}
        >
          {displayName} scroooool downnnnn
        </motion.span>
      </motion.header>

    </div>
  );
};

export default MainExperience;