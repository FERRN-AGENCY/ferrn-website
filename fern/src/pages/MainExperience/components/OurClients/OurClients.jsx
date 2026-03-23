import { useContext } from 'react';
import { UserContext } from '../../../../context/UserContext';
import images from '../../../../images';
import { clientsData } from '../../../../data/clientsData.js';

import styles from './OurClients.module.css';
import { SectionTitle, ActionButtons } from '../../../../components/common/SectionHeaders';

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
  
  // Securely checks for the user's inputted name, defaults to "friend"
  const displayName = userName ? userName : "friend";

  return (
    <section className={styles.clientsContainer}>
      <div className={styles.bounds}>
        <SectionTitle 
          mainText="Clients we didn't scare away," 
          dimText={`want to be next ${displayName}?`} 
        />
      </div>

      <div className={styles.logoGrid}>
        <MarqueeTrack items={row1} direction="left" />
        <MarqueeTrack items={row2} direction="right" />
      </div>

      <div className={styles.bounds}>
        <ActionButtons 
          ghostText="Curious… tell me more"
          ghostLink="/faq"
          primaryText="Let’s do this"
          primaryLink="/contact"
        />
      </div>
    </section>
  );
};

export default OurClients;