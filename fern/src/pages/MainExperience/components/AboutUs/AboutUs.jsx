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
  const activeContent = aboutData.find(item => item.id === activeTab);

  // Activates Lenis smooth scroll for this page
  useLenis();

  useEffect(() => {
    if (!isInView) return;
    const rotateTimer = setInterval(() => {
      setActiveTab((prevTab) => {
        const currentIndex = aboutData.findIndex((item) => item.id === prevTab);
        const nextIndex = (currentIndex + 1) % aboutData.length;
        return aboutData[nextIndex].id;
      });
    }, 6000); 
    return () => clearInterval(rotateTimer);
  }, [isInView, activeTab]); 

  return (
    <RevealContainer 
      className={styles.aboutContainer}
      viewportMargin="0px 0px -30% 0px"
      onViewportEnter={() => setIsInView(true)}
      onViewportLeave={() => setIsInView(false)}
    >
      
      <RevealItem>
        <SectionTitle 
          mainText="Before we tell you about us," 
          dimText={`tell us about you, ${userName || 'friend'}.`} 
        />
      </RevealItem>

      <RevealItem className={styles.contentWrapper}>
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
      </RevealItem>

      <RevealItem>
        <ActionButtons 
          ghostText="Got questions? Ask Bob."
          ghostLink="mailto:bob@example.com"
          primaryText="Let's Discuss Your Idea"
          primaryLink="/contact"
        />
      </RevealItem>

    </RevealContainer>
  );
};

export default AboutUs;