import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../../../context/UserContext';
import images from '../../../../images';
import { clientsData } from '../../../../data/clientsData.js';

import styles from './OurClients.module.css';
import { SectionTitle, ActionButtons } from '../../../../components/common/SectionHeaders';
import { RevealContainer, RevealItem } from '../../../../components/common/ScrollReveal';

const row1 = clientsData.slice(0, 8);  
const row2 = clientsData.slice(3, 12); 

const MarqueeTrack = ({ items, direction }) => (
  <div className={`${styles.marqueeRow} ${direction === 'left' ? styles.scrollLeft : styles.scrollRight}`}>
    <div className={styles.marqueeGroup}>
      {items.map((client) => (
        <div key={client.id} className={styles.clientCard}>
          <img src={images[client.logo] || ''} alt={`Client ${client.id}`} className={styles.logoImage} />
          <div className={styles.tagsOverlay}>
            {client.tags.map((tag, index) => (
              <span key={index} className={styles.tag}>{tag}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
    <div className={styles.marqueeGroup} aria-hidden="true">
      {items.map((client) => (
        <div key={`${client.id}-dup`} className={styles.clientCard}>
          <img src={images[client.logo] || ''} alt={`Client ${client.id}`} className={styles.logoImage} />
          <div className={styles.tagsOverlay}>
            {client.tags.map((tag, index) => (
              <span key={index} className={styles.tag}>{tag}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const OurClients = () => {
  const { userName } = useContext(UserContext);
  const [isMobile, setIsMobile] = useState(false);
  
  // Securely checks for the user's inputted name, defaults to "friend"
  const displayName = userName ? userName : "friend";

  // Mobile detection to kill scroll animations on small screens
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile(); // Check immediately on mount
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Dynamically switch components based on screen size
  const Container = isMobile ? 'section' : RevealContainer;
  const Item = isMobile ? 'div' : RevealItem;

  return (
    <Container className={styles.clientsContainer}>
      
      <Item className={styles.bounds}>
        <SectionTitle 
          mainText="Clients we didn't scare away," 
          dimText={`want to be next ${displayName}?`} 
        />
      </Item>

      <Item className={styles.logoGrid}>
        <MarqueeTrack items={row1} direction="left" />
        <MarqueeTrack items={row2} direction="right" />
      </Item>

      <Item className={styles.bounds}>
        <ActionButtons 
          ghostText="Curious… tell me more"
          primaryText="Let’s do this"
        />
      </Item>
      
    </Container>
  );
};

export default OurClients;