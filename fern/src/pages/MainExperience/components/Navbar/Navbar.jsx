import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import styles from './Navbar.module.css';
import images from '../../../../images'; 

const navLinks = ['About Us', 'Our Clients', 'Services', 'Case Studies', 'Testimonials', 'FAQ'];

// Helper function to turn "About Us" into "about-us" so we can find the HTML IDs
const getSectionId = (link) => link.toLowerCase().replace(/\s+/g, '-');

const Navbar = () => {
  const [showNav, setShowNav] = useState(false);
  const [activeLink, setActiveLink] = useState('About Us');
  const { scrollY } = useScroll();
  
  const hideTimerRef = useRef(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // 1. Navbar Visibility Logic
    const isPastHero = latest > window.innerHeight * 0.8;

    if (isPastHero) {
      setShowNav(true);
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
      hideTimerRef.current = setTimeout(() => {
        setShowNav(false);
      }, 6000); 
    } else {
      setShowNav(false);
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    }

    // 2. PAGE TRACKING LOGIC (Scroll Spy)
    let currentActiveSection = activeLink;
    
    for (let i = navLinks.length - 1; i >= 0; i--) {
      const link = navLinks[i];
      const element = document.getElementById(getSectionId(link));
      
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 3) {
          currentActiveSection = link;
          break; 
        }
      }
    }

    if (currentActiveSection !== activeLink) {
      setActiveLink(currentActiveSection);
    }
  });

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  // 3. CLICK TO SCROLL LOGIC
  const handleNavClick = (link) => {
    setActiveLink(link);
    const element = document.getElementById(getSectionId(link));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.fixedWrapper}>
      <AnimatePresence>
        {showNav && (
          <motion.nav 
            className={styles.navbarContainer}
            initial={{ y: 100, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}   
            exit={{ y: 100, opacity: 0 }}    
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            onMouseEnter={() => clearTimeout(hideTimerRef.current)}
          >
            
            {/* Block 1: The Logo Square */}
            <div className={styles.navBlock}>
              <img src={images.Fern} alt="Ferrn" className={styles.navLogo} />
            </div>

            {/* Block 2: The Main Links Pill */}
            <div className={`${styles.navBlock} ${styles.linksBlock}`}>
              {navLinks.map((link) => (
                <button
                  key={link}
                  className={`${styles.navLink} ${activeLink === link ? styles.activeLink : ''}`}
                  onClick={() => handleNavClick(link)} 
                >
                  {link}
                </button>
              ))}
            </div>

            {/* Block 3: The NEW Phone Icon Square */}
            <div className={styles.navBlock} onClick={() => handleNavClick('Contact')} style={{ cursor: 'pointer' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" fill="var(--brand-orange, #F94406)">
                <path d="M19.95 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                <path d="M19 3v3h3v2h-3v3h-2V8h-3V6h3V3h2z"/>
              </svg>
            </div>

          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;