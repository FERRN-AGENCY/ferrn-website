import { useState, useEffect, useContext, useRef } from 'react';
import { motion, useTransform, useMotionValue, useMotionValueEvent } from 'framer-motion';
import { UserContext } from '../../../../context/UserContext';
import images from '../../../../images'; 
import { SectionTitle, ActionButtons } from '../../../../components/common/SectionHeaders';
import { servicesData } from '../../../../data/servicesData';
import styles from './OurServices.module.css'; 

const OurServices = ({ scrollProgress }) => {
  const { userName } = useContext(UserContext);
  const displayName = userName ? userName : "friend";
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  // THE FIX: Changed to an array of refs so we can control ALL videos at once
  const videoRefs = useRef([]);

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

  // THE FIX: The Performance Manager
  // Plays the active video, and pauses the hidden ones to save battery/memory!
  useEffect(() => {
    videoRefs.current.forEach((vid, index) => {
      if (vid) {
        vid.defaultMuted = true;
        vid.muted = true;
        
        if (index === activeIndex) {
          vid.currentTime = 0;
          const playPromise = vid.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {});
          }
        } else {
          vid.pause(); // Pause hidden videos
        }
      }
    });
  }, [activeIndex]);

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
              WebkitTapHighlightColor: "transparent",
              willChange: "transform" /* GPU Acceleration for the sliding motion */
            }}
            onClick={() => handleServiceClick((activeIndex + 1) % servicesData.length)}
          >
            {/* THE FIX: The Stacked Deck for Videos */}
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              {servicesData.map((service, index) => {
                const isActive = activeIndex === index;
                
                return (
                  <motion.div 
                    key={service?.id || index} 
                    initial={false}
                    animate={{ opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }} 
                    className={styles.imageCard}
                    style={{ 
                      // The first card sets the height, the rest stack absolutely on top
                      position: index === 0 ? 'relative' : 'absolute', 
                      top: 0, 
                      left: 0, 
                      width: '100%', 
                      height: '100%',
                      willChange: "opacity", /* GPU Acceleration for the crossfade */
                      pointerEvents: isActive ? 'auto' : 'none' /* Prevents clicking hidden cards */
                    }}
                  >
                    {service?.video && images[service.video] && (
                      <video 
                        ref={(el) => (videoRefs.current[index] = el)} 
                        src={images[service.video]} 
                        className={styles.serviceVideoElement} 
                        autoPlay={isActive} 
                        loop 
                        muted 
                        playsInline 
                        preload="auto" 
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
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