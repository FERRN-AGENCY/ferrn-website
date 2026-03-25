import { motion } from 'framer-motion';
// Swapped FaLink and FaDribbble for FaTiktok and FaWhatsapp
import { FaInstagram, FaXTwitter, FaLinkedinIn, FaTiktok, FaWhatsapp, FaEnvelope } from 'react-icons/fa6';
import styles from './Footer.module.css';
import images from '../../../../images';

const Footer = () => {
  // Updated array with the new icons and your live links
  const socials = [
    { 
      id: 'ig', 
      icon: <FaInstagram />, 
      url: 'https://www.instagram.com/ferrn.agency?igsh=dWV5dmpyeDlocmht&utm_source=qr' 
    },
    { 
      id: 'x', 
      icon: <FaXTwitter />, 
      url: 'https://x.com/ferrn_agency?s=21' 
    },
    { 
      id: 'in', 
      icon: <FaLinkedinIn />, 
      url: 'https://www.linkedin.com/company/ferrn/' 
    },
    { 
      id: 'tiktok', 
      icon: <FaTiktok />, 
      url: 'https://www.tiktok.com/@ferrnagency?_r=1&_t=ZS-94wI3R63lyf' 
    },
    { 
      id: 'wa', 
      icon: <FaWhatsapp />, 
      url: 'https://wa.me/message/ZTLSJYGV6PI2L1' 
    },
    { 
      id: 'mail', 
      icon: <FaEnvelope />, 
      url: 'mailto:ferrnagency@gmail.com' 
    },
  ];

  return (
    <footer className={styles.footerWrapper}>
      
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

      <div className={styles.footerCard}>
        
        <div className={styles.topSection}>
          <div className={styles.socialGrid}>
            {socials.map((item, idx) => (
              <a 
                href={item.url} 
                key={item.id} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.socialBox}
              >
                {item.icon}
              </a>
            ))}
          </div>
          
          {/* THE FIXED 3D FLIPPING CUBE */}
          <div className={styles.logoBoxScene}>
            <div className={styles.logoBoxCube}>
              
              {/* FRONT FACE: Pure White Text, NO Logo */}
              <div className={`${styles.cubeFace} ${styles.cubeFront}`}>
                <span className={styles.logoTextWhite}>FERRN AGENCY</span>
              </div>

              {/* BOTTOM FACE: Logo + Orange Text */}
              <div className={`${styles.cubeFace} ${styles.cubeBottom}`}>
                <img src={images.Fernlogo} alt="Ferrn Logo" className={styles.footerLogo} />
                {/* <span className={styles.logoTextOrange}>FERRN</span> */}
              </div>

            </div>
          </div>
        </div>

        <div className={styles.bottomSection}>
          <div className={styles.ctaText}>
            <p className={styles.subtext}>Have a project ?</p>
            <h2 className={styles.maintext}>Let's make it epic</h2>
          </div>
          
          {/* THE FIX: Added the onClick event to open Cal.com */}
          <button 
            className={styles.startBtn}
            onClick={() => window.open('https://cal.com/ferrn-agency/discovery-call', '_blank')}
          >
            Book a call
          </button>
        </div>

      </div>
    </footer>
  );
};

export default Footer;