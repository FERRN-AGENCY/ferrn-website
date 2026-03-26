import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, animate, useMotionValue } from 'framer-motion'; 
import styles from './MainExperience.module.css';
import images from '../../images'; 
import { useRequireName } from '../../hooks/useRequireName';

const MainExperience = () => {
  const displayName = useRequireName();
  
  const videoRef = useRef(null);
  const isVideoInitialized = useRef(false); 

  // 🚦 THE CHOREOGRAPHY STATES
  const [headerLanded, setHeaderLanded] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);

  const fullHeadline = `Welcome ${displayName || ''} at Ferrn, we turn "meh" ideas into "whoa" brands.`;

  // ⏱️ TIMINGS
  const OVERLAY_FADE_DURATION = 1000; 
  // THE FIX: 1 full second of breathing room so the browser can boot properly
  const HEADER_DROP_DELAY = 1000;       
  const TYPING_SPEED = 80;          

  // ==========================================
  // 🚀 THE EVENT-DRIVEN TYPING ENGINE
  // ==========================================
  const count = useMotionValue(0);
  const roundedCount = useTransform(count, (latest) => Math.round(latest));
  const displayText = useTransform(roundedCount, (latest) => fullHeadline.slice(0, latest));

  useEffect(() => {
    if (!headerLanded) return;

    console.log("⌨️ [TYPING] Engine Started safely after the drop!");
    
    const controls = animate(count, fullHeadline.length, {
      type: "tween",
      duration: (fullHeadline.length * TYPING_SPEED) / 1000,
      ease: "linear",
      onComplete: () => {
        console.log("✅ [TYPING] Completely Finished");
        setIsTypingComplete(true);
      }
    });

    return controls.stop;
  }, [fullHeadline, count, headerLanded]); 
  // ==========================================

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

  // Handle Video Reset
  const handleVideoReady = () => {
    if (videoRef.current && !isVideoInitialized.current) {
      isVideoInitialized.current = true; 
      videoRef.current.currentTime = 0; 
      videoRef.current.play().catch(e => console.error("❌ [VIDEO ERROR] Autoplay blocked:", e));
    }
  };

  // "Scroll Down" Bounce Logic
  useEffect(() => {
    if (!isTypingComplete) return; 

    const startBouncing = setTimeout(() => {
      const bounceInterval = setInterval(() => {
        setIsBouncing(true);
        setTimeout(() => setIsBouncing(false), 500); 
      }, 5000);
      return () => clearInterval(bounceInterval);
    }, 1000); 
    
    return () => clearTimeout(startBouncing);
  }, [isTypingComplete]);

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
        
        <video 
          ref={videoRef}
          src={images.heroVideo} 
          poster={images.fernwebsite1} 
          className={styles.bgVideo} 
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          onCanPlay={handleVideoReady} 
          style={{ 
            objectFit: 'cover', 
            width: '100%',     
            height: '100%',    
            position: 'absolute',
            top: 0,
            left: 0,
            transform: 'translateZ(0)' 
          }}
        />

        <motion.div 
          className={styles.videoOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }} 
          transition={{ 
            duration: OVERLAY_FADE_DURATION / 1000, 
            ease: "easeOut" 
          }}
          style={{ 
            position: 'absolute', 
            inset: 0, 
            zIndex: 20,
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.3182) 0%, rgba(0, 0, 0, 0.86) 70%)'
          }} 
        />

        <div className={styles.contentLayer} style={{ zIndex: 30 }}>
          <div className={styles.centerContent} >
            <h1 className={styles.heroHeadline}>
              <motion.span>{displayText}</motion.span>
              
              {headerLanded && !isTypingComplete && (
                <motion.span 
                  className={styles.cursor}
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "steps(2)" }}
                  style={{ display: "inline-block", marginLeft: "2px" }}
                >
                  |
                </motion.span>
              )}
            </h1>
          </div>
        </div>
      </motion.div>

      <motion.header 
        className={styles.header}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}          
        transition={{ 
          delay: HEADER_DROP_DELAY / 1000, 
          duration: 1.4, 
          ease: [0.22, 1, 0.36, 1] 
        }} 
        onAnimationStart={() => console.log("🚀 [HEADER] Graceful Drop Started")}
        onAnimationComplete={() => {
          console.log("🏁 [HEADER] Drop Animation Completed Perfectly");
          setHeaderLanded(true); 
        }}
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
