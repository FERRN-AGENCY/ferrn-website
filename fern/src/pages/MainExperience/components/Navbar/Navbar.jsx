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
    // We loop backwards through the links. The first section we find whose 
    // top edge has crossed the top 1/3rd of the screen becomes the active link!
    let currentActiveSection = activeLink;
    
    for (let i = navLinks.length - 1; i >= 0; i--) {
      const link = navLinks[i];
      const element = document.getElementById(getSectionId(link));
      
      if (element) {
        const rect = element.getBoundingClientRect();
        // If the top of the section is in the top third of the viewport (or higher)
        if (rect.top <= window.innerHeight / 3) {
          currentActiveSection = link;
          break; // Stop looking once we find the active one
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
                  onClick={() => handleNavClick(link)} // <-- Updated to trigger scroll
                >
                  {link}
                </button>
              ))}
            </div>

            {/* Block 3: The Phone Icon Square */}
            <div className={styles.navBlock} onClick={() => handleNavClick('Contact')} style={{ cursor: 'pointer' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brand-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>

          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;