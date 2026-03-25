import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserContext } from '../../../../context/UserContext';
import { aboutData } from '../../../../data/aboutData.js'; 
import images from '../../../../images'; 
import { SectionTitle, ActionButtons } from '../../../../components/common/SectionHeaders';
import { RevealContainer, RevealItem, useLenis } from '../../../../components/common/ScrollReveal';
import styles from './AboutUs.module.css';

const AboutUs = () => {
  const { userName } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState(aboutData[0].id);
  const [isInView, setIsInView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const activeContent = aboutData.find(item => item.id === activeTab);

  // Activates Lenis smooth scroll for this page
  useLenis();

  // Mobile detection to kill scroll animations on small screens
  useEffect(() => {
    const checkMobile = () => {
      const mobileState = window.innerWidth <= 768;
      setIsMobile(mobileState);
      if (mobileState) setIsInView(true); // Keep auto-rotation running on mobile
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-rotation timer
  useEffect(() => {
    if (!isInView) return;
    const rotateTimer = setInterval(() => {
      handleNextTab();
    }, 6000); 
    return () => clearInterval(rotateTimer);
  }, [isInView, activeTab]); 

  // --- RESTORED SLIDE/SWIPE LOGIC ---
  const handleNextTab = () => {
    setActiveTab((prevTab) => {
      const currentIndex = aboutData.findIndex((item) => item.id === prevTab);
      const nextIndex = (currentIndex + 1) % aboutData.length;
      return aboutData[nextIndex].id;
    });
  };

  const handlePrevTab = () => {
    setActiveTab((prevTab) => {
      const currentIndex = aboutData.findIndex((item) => item.id === prevTab);
      const prevIndex = (currentIndex - 1 + aboutData.length) % aboutData.length;
      return aboutData[prevIndex].id;
    });
  };

  const handleDragEnd = (event, info) => {
    const threshold = 50; 
    if (info.offset.x < -threshold) {
      handleNextTab(); // Swiped left -> Next
    } else if (info.offset.x > threshold) {
      handlePrevTab(); // Swiped right -> Previous
    }
  };

  // Dynamically strip out the scroll animations if on mobile
  const Container = isMobile ? 'section' : RevealContainer;
  const Item = isMobile ? 'div' : RevealItem;

  const containerProps = isMobile 
    ? { className: styles.aboutContainer } 
    : {
        className: styles.aboutContainer,
        viewportMargin: "0px 0px -30% 0px",
        onViewportEnter: () => setIsInView(true),
        onViewportLeave: () => setIsInView(false)
      };

  return (
    <Container {...containerProps}>
      
      <Item>
        <SectionTitle 
          mainText="Before we tell you about us," 
          dimText={`tell us about you, ${userName || 'friend'}.`} 
        />
      </Item>

      <Item className={styles.contentWrapper}>
        <div className={styles.tabsColumn}>
          {aboutData.map((item) => (
            <button
              key={item.id}
              className={`${styles.tabButton} ${activeTab === item.id ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.tabTitle}
            </button>
          ))}
        </div>

        <div className={styles.displayColumn}>
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab} 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6 }}
              className={styles.imageCard}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd} // <-- Hooked up the swipe logic here!
            >
              <div 
                className={styles.imagePlaceholder}
                style={{ 
                  backgroundImage: `url(${images[activeContent.image] || activeContent.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className={styles.cardOverlay}>
                  <div className={styles.tagsBox}>
                    {activeContent.tags.map((tag, index) => (
                      <span key={index} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                  <div className={styles.blackbg}>
                    <h3 className={styles.mobileCardTitle}>{activeContent.tabTitle}</h3>
                    <p className={styles.cardDescription}>{activeContent.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Item>

      <Item>
        <ActionButtons 
          ghostText="Got questions? Ask Bob."
          primaryText="Let's Discuss Your Idea"
        />
      </Item>

    </Container>
  );
};

export default AboutUs;