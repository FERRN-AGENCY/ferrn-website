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
  
  const [currentFrame, setCurrentFrame] = useState(1);
  const TOTAL_FRAMES = 20;

  const fullHeadline = `Welcome ${displayName || ''} at Ferrn, we turn "meh" ideas into "whoa" brands.`;

  // ⏱️ ANIMATION TIMINGS
  // THE FIX: Increased to 300 for a much slower, high-end "slideshow" feel
  const FRAME_SPEED = 3000;             
  const VIDEO_PLAY_TIME = 3000;       
  const OVERLAY_FADE_DURATION = 2000; 
  const HEADER_DROP_DELAY = 4000;     
  const TYPING_START_DELAY = 4800;    
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

  useEffect(() => {
    const frameInterval = setInterval(() => {
      setCurrentFrame((prevFrame) => (prevFrame === TOTAL_FRAMES ? 1 : prevFrame + 1));
    }, FRAME_SPEED);

    return () => clearInterval(frameInterval);
  }, []);

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

  const framesArray = Array.from({ length: TOTAL_FRAMES }, (_, i) => i + 1);

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
        
        {framesArray.map((frameNumber) => (
          <img 
            key={frameNumber}
            src={images[`fernwebsite${frameNumber}`]} 
            alt="Hero Background Animation" 
            className={styles.bgVideo} 
            style={{ 
              objectFit: 'cover', 
              width: '100%', 
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              // THE FIX: currentFrame === frameNumber ? 1 : 0 stays the same, 
              // but the 'transition' below is what creates the "slow fade"
              opacity: currentFrame === frameNumber ? 1 : 0, 
              transition: 'opacity 0.8s ease-in-out', 
              willChange: 'opacity' 
            }}
          />
        ))}

        <motion.div 
          className={styles.videoOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }} 
          transition={{ 
            delay: VIDEO_PLAY_TIME / 1000, 
            duration: OVERLAY_FADE_DURATION / 1000, 
            ease: "easeOut" 
          }}
          style={{ position: 'absolute', inset: 0, zIndex: 20 }} 
        ></motion.div>

        <div className={styles.contentLayer} style={{ zIndex: 30 }}>
          <div className={styles.centerContent} >
            <h1 className={styles.heroHeadline}>
              {displayedHeadline}
              {isTypingStarted && !isTypingComplete && <span className={styles.cursor}>|</span>}
            </h1>
          </div>
        </div>
      </motion.div>

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