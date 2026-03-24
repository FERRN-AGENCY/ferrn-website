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
  
  const videoRef = useRef(null);

  const fallbackScroll = useMotionValue(0);
  const sp = scrollProgress || fallbackScroll;

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

  // 2. THE CLEAN FADE: Fades out the text/video just before the orange curtain rises
  const textOpacity = useTransform(sp, [0.30, 0.38], [1, 0]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
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
              opacity: textOpacity,
              cursor: "pointer", 
              WebkitTapHighlightColor: "transparent" 
            }}
            onClick={() => handleServiceClick((activeIndex + 1) % servicesData.length)}
          >
            {/* THE FIX: Pure opacity fading. No sliding sideways. */}
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
                  <video ref={videoRef} src={images[activeService.video]} className={styles.serviceVideoElement} autoPlay loop muted playsInline />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

      </div>

      <div className={styles.bounds}>
        <motion.div style={{ opacity: textOpacity }}>
          <ActionButtons ghostText="My service is not here? ... Ask Bob" ghostLink="mailto:bob@example.com" primaryText="I want some" primaryLink="/contact" />
        </motion.div>
      </div>

    </section>
  );
};

export default OurServices;