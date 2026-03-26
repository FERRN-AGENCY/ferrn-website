import { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence, useTransform, useMotionValue, useMotionValueEvent } from 'framer-motion';
import { UserContext } from '../../../../context/UserContext';
import images from '../../../../images'; 
import { SectionTitle, ActionButtons } from '../../../../components/common/SectionHeaders';
import { servicesData } from '../../../../data/servicesData';
import styles from './OurServices.module.css'; 

const OurServices = ({ scrollProgress }) => {
  const { userName } = useContext(UserContext);
  const displayName = userName ? userName : "friend";
  
  const [activeIndex, setActiveIndex] = useState(0);
  const activeService = servicesData[activeIndex] || servicesData[0];
  const [isMobile, setIsMobile] = useState(false);
  
  const videoRef = useRef(null);

  const fallbackScroll = useMotionValue(0);
  const sp = scrollProgress || fallbackScroll;

  // Mobile detection to keep mobile experience simple
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 1. THE RESTORED SCRUB: Maps the first 30% of the wrapper's scroll to changing tabs
  useMotionValueEvent(sp, "change", (latestScroll) => {
    const scrubStart = 0.0;
    const scrubEnd = 0.30; 

    if (latestScroll >= scrubStart && latestScroll <= scrubEnd) {
      const progress = (latestScroll - scrubStart) / (scrubEnd - scrubStart);
      let mappedIndex = Math.floor(progress * servicesData.length);
      mappedIndex = Math.max(0, Math.min(mappedIndex, servicesData.length - 1));

      if (mappedIndex !== activeIndex) {
        setActiveIndex(mappedIndex);
      }
    }
  });

  // 2. THE TEXT FADE: Fades out ONLY the text before the orange curtain rises
  const textOpacity = useTransform(sp, [0.30, 0.38], [1, 0]);

  // 3. THE VIDEO SLIDE: Moves the video left to the center of the screen
  const videoXDesktop = useTransform(sp, [0.30, 0.45], ["0%", "-40%"]);
  const videoX = isMobile ? "0%" : videoXDesktop;

  useEffect(() => {
    if (videoRef.current) {
      // THE FIX: Explicitly enforce the muted rules so the browser allows autoplay
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.currentTime = 0;
      
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Silently catch autoplay rejections to prevent console red errors
        });
      }
    }
  }, [activeService]);

  const handleServiceClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <section className={styles.servicesContainer}>
      
      <div className={styles.bounds}>
        <motion.div style={{ opacity: textOpacity }}>
          <SectionTitle mainText="Things we actually do well," dimText={`want some ${displayName}?`} customId="services-special-title" />
        </motion.div>
      </div>

      <div className={styles.contentWrapper}>
        
        <div className={styles.leftGridItem}>
          <motion.div className={styles.listColumn} style={{ opacity: textOpacity }}>
            {servicesData.map((service, index) => (
              <div
                key={service?.id || index} 
                className={`${styles.serviceItem} ${activeIndex === index ? styles.activeItem : ''}`}
                onClick={() => handleServiceClick(index)}
              >
                {service?.title}
              </div>
            ))}
          </motion.div>
        </div>

        <div className={styles.rightGridItem}>
          <motion.div 
            className={styles.imageColumn} 
            style={{ 
              x: videoX, 
              cursor: "pointer", 
              WebkitTapHighlightColor: "transparent" 
            }}
            onClick={() => handleServiceClick((activeIndex + 1) % servicesData.length)}
          >
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeService?.id || 'empty'} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }} 
                className={styles.imageCard}
              >
                {activeService?.video && images[activeService.video] && (
                  /* THE FIX: Added preload="auto" to force immediate loading */
                  <video 
                    ref={videoRef} 
                    src={images[activeService.video]} 
                    className={styles.serviceVideoElement} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    preload="auto" 
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

      </div>

      <div className={styles.bounds}>
        <motion.div style={{ opacity: textOpacity }}>
          <ActionButtons ghostText="My service is not here? ... Ask Bob"  primaryText="I want some"  />
        </motion.div>
      </div>

    </section>
  );
};

export default OurServices;