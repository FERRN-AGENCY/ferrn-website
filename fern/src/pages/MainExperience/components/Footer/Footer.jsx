import { motion } from 'framer-motion';
import styles from './Footer.module.css';

const Footer = () => {
  const socials = ['Ig', 'X', 'In', '🔗', 'Dr', 'Mail'];

  return (
    <footer className={styles.footerWrapper}>
      
      {/* The Giant Background Watermark — slowly drifts left on loop */}
      <motion.div
        className={styles.watermark}
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          duration: 18,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        BYE,&nbsp;BYE,&nbsp;BYE,&nbsp;BYE,&nbsp;BYE,&nbsp;BYE,&nbsp;
      </motion.div>

      {/* The Main Footer Card */}
      <div className={styles.footerCard}>
        
        {/* Top Half: Socials & Logo */}
        <div className={styles.topSection}>
          <div className={styles.socialGrid}>
            {socials.map((item, idx) => (
              <a href="#" key={idx} className={`${styles.socialBox} ${idx === 0 ? styles.activeSocial : ''}`}>
                {item}
              </a>
            ))}
          </div>
          
          <div className={styles.logoBox}>
            <img src="/ferrn-logo.svg" alt="Ferrn Agency" className={styles.footerLogo} />
            <span className={styles.logoText}>FERRN AGENCY</span>
          </div>
        </div>

        {/* Bottom Half: Call to Action */}
        <div className={styles.bottomSection}>
          <div className={styles.ctaText}>
            <p className={styles.subtext}>Have a project ?</p>
            <h2 className={styles.maintext}>Let's make it epic</h2>
          </div>
          
          <button className={styles.startBtn}>Start now!</button>
        </div>

      </div>
    </footer>
  );
};

export default Footer;