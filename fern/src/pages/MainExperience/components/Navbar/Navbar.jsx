import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import styles from './Navbar.module.css';
import images from '../../../../images'; 

const navLinks = ['About Us', 'Our Clients', 'Services', 'Case Studies', 'Testimonials', 'FAQ'];

const Navbar = () => {
  const [showNav, setShowNav] = useState(false);
  const [activeLink, setActiveLink] = useState('About Us');
  const { scrollY } = useScroll();
  
  // A "ref" acts like a box where we can safely store our countdown timer
  const hideTimerRef = useRef(null);

  // This watches the scroll wheel every time it moves
  useMotionValueEvent(scrollY, "change", (latest) => {
    // 1. Are we past the Hero section? (80% down the screen)
    const isPastHero = latest > window.innerHeight * 0.8;

    if (isPastHero) {
      // 2. We are scrolling, so make sure the Navbar is visible!
      setShowNav(true);

      // 3. Clear whatever countdown was running previously
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }

      // 4. Start a fresh 6-second countdown. 
      // If the user stops scrolling for 6 seconds, this will trigger and hide the nav.
      hideTimerRef.current = setTimeout(() => {
        setShowNav(false);
      }, 6000); 

    } else {
      // 5. If they scroll all the way back up to the Hero section, hide it permanently
      setShowNav(false);
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    }
  });

  // Safety cleanup: If we leave the page entirely, destroy the timer so it doesn't cause errors
  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.fixedWrapper}>
      <AnimatePresence>
        {showNav && (
          <motion.nav 
            className={styles.navbarContainer}
            // Starts below the screen
            initial={{ y: 100, opacity: 0 }} 
            // Slides up smoothly
            animate={{ y: 0, opacity: 1 }}   
            // Drops back down when hiding
            exit={{ y: 100, opacity: 0 }}    
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            
            // Optional Polish: If the user hovers their mouse over the Navbar, 
            // we probably shouldn't hide it while they are trying to click!
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
                  onClick={() => setActiveLink(link)}
                >
                  {link}
                </button>
              ))}
            </div>

            {/* Block 3: The Phone Icon Square */}
            <div className={styles.navBlock}>
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