import { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence, useTransform, useMotionValue } from 'framer-motion';
import { UserContext } from '../../../../context/UserContext';
import images from '../../../../images'; 
import { SectionTitle, ActionButtons } from '../../../../components/common/SectionHeaders';
import { servicesData } from '../../../../data/servicesData';
import styles from './OurServices.module.css'; 

import { RevealContainer, RevealItem } from '../../../../components/common/ScrollReveal';

const OurServices = ({ scrollProgress }) => {
  const { userName } = useContext(UserContext);
  const displayName = userName ? userName : "friend";
  
  const [activeService, setActiveService] = useState(servicesData[0] || {});
  const [isInView, setIsInView] = useState(false);
  const videoRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile(); 
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fallbackScroll = useMotionValue(0);
  const sp = scrollProgress || fallbackScroll;

  const textOpacity = useTransform(sp, [0.05, 0.25], [1, 0]);
  const videoX = useTransform(sp, [0.1, 0.35], ["0vw", "-15vw"]); 
  const videoScale = useTransform(sp, [0.1, 0.35], [1, 1.4]);

  useEffect(() => {
    if (videoRef.current && isInView) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [activeService, isInView]);

  // THE FIX 1: Abstracted the "Next Service" math into its own function
  const handleNextService = () => {
    if (!servicesData || servicesData.length === 0) return;
    setActiveService((prev) => {
      const nextIndex = (servicesData.findIndex((i) => i.id === prev?.id) + 1) % servicesData.length;
      return servicesData[nextIndex];
    });
  };

  useEffect(() => {
    if (!isInView || !servicesData || servicesData.length === 0) return;
    // Uses the new function for the auto-timer
    const rotateTimer = setInterval(handleNextService, 6000); 
    return () => clearInterval(rotateTimer);
  }, [isInView, activeService]); 

  return (
    <RevealContainer 
      className={styles.servicesContainer}
      onViewportEnter={() => {
        setIsInView(true);
        if (servicesData && servicesData.length > 0) setActiveService(servicesData[0]);
      }}
      onViewportLeave={() => setIsInView(false)}
    >
      
      <RevealItem className={styles.bounds}>
        <motion.div style={{ opacity: textOpacity }}>
          <SectionTitle mainText="Things we actually do well," dimText={`want some ${displayName}?`} customId="services-special-title" />
        </motion.div>
      </RevealItem>

      <div className={styles.contentWrapper}>
        
        <RevealItem className={styles.leftGridItem}>
          <motion.div className={styles.listColumn} style={{ opacity: textOpacity }}>
            {servicesData.map((service, index) => (
              <div
                key={service?.id || index} 
                className={`${styles.serviceItem} ${activeService?.id === service?.id ? styles.activeItem : ''}`}
                onClick={() => setActiveService(service)}
              >
                {service?.title}
              </div>
            ))}
          </motion.div>
        </RevealItem>

        <RevealItem className={styles.rightGridItem}>
          <motion.div 
            className={styles.imageColumn} 
            style={{ 
              x: isMobile ? "0vw" : videoX, 
              scale: isMobile ? 1 : videoScale, 
              opacity: isMobile ? textOpacity : 1, 
              transformOrigin: "center center",
              cursor: "pointer", // THE FIX 2: Changes cursor to a hand so users know it is clickable
              WebkitTapHighlightColor: "transparent" // Removes the ugly blue flash when tapping on mobile
            }}
            onClick={handleNextService} // THE FIX 3: Clicking the video instantly loads the next service
          >
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeService?.id || 'empty'} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className={styles.imageCard}
              >
                {activeService?.video && images[activeService.video] && (
                  <video ref={videoRef} src={images[activeService.video]} className={styles.serviceVideoElement} autoPlay loop muted playsInline />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </RevealItem>

      </div>

      <RevealItem className={styles.bounds}>
        <motion.div style={{ opacity: textOpacity }}>
          <ActionButtons ghostText="My service is not here? ... Ask Bob" ghostLink="mailto:bob@example.com" primaryText="I want some" primaryLink="/contact" />
        </motion.div>
      </RevealItem>

    </RevealContainer>
  );
};

export default OurServices;