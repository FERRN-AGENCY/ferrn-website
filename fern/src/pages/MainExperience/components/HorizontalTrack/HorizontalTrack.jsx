import React, { useRef } from 'react';
// THE FIX: We added useSpring to our Framer Motion imports
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import styles from './HorizontalTrack.module.css';

const HorizontalTrack = ({ children }) => {
  const targetRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  // ==========================================
  // 1. THE SETTLE EFFECT (SPRING PHYSICS)
  // Instead of stopping instantly, this adds a heavy, premium friction 
  // that smoothly glides the page to a stop when you finish scrolling.
  // ==========================================
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,   // How fast it tries to catch up to your mouse
    damping: 20,     // High damping stops it smoothly without bouncing
    restDelta: 0.001 // Forces it to perfectly settle into place
  });

  const pagesCount = React.Children.count(children);
  const gap = 15;
  const slideDistance = `-${(pagesCount - 1) * (100 + gap)}vw`;
  
  // We apply the 'smoothProgress' physics to the X movement instead of the raw scroll
  const x = useTransform(smoothProgress, [0, 1], ["0vw", slideDistance]);

  // ==========================================
  // 2. THE SPEED FIX
  // I increased this from 100 to 250! 
  // This makes the invisible vertical track 2.5x taller, meaning you have 
  // to scroll 2.5x more to turn the page. It makes the slide beautifully slow.
  // ==========================================
  const scrollSpeed = 250; 

  return (
    <section ref={targetRef} className={styles.scrollSection} style={{ height: `${pagesCount * scrollSpeed}vh` }}>
      
      <div className={styles.stickyContainer}>
        
        <div className={styles.leftFade}></div>

        <motion.div 
          style={{ x }} 
          className={styles.flexContainer}
        >
          {React.Children.map(children, (child) => (
            <div className={styles.pageWrapper}>
              {child}
            </div>
          ))}
        </motion.div>

      </div>

    </section>
  );
};

export default HorizontalTrack;