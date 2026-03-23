import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './Loader.module.css';
// It just looks right next door now
import { FernLogo } from './Fernlogo';

// Added onComplete prop so App.jsx knows when to change pages
const Loader = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const brandName = "FERRN".split(""); 

  useEffect(() => {
    // 1. The 4-second minimum loading timer
    const totalLoadTime = 4000; 
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, totalLoadTime);

    // 2. The looping percentage counter
    const interval = setInterval(() => {
      setCount((prev) => (prev >= 100 ? 0 : prev + 1));
    }, totalLoadTime / 100); 

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onComplete]);

  // Framer Motion: Added repeat properties to make it loop infinitely
  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, scale: 1, 
      transition: { duration: 0.6, ease: "easeOut", repeat: Infinity, repeatType: "reverse", repeatDelay: 1 }
    }
  };

  const textContainerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15, delayChildren: 0.5 }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, x: -25 }, 
    visible: { 
      opacity: 1, x: 0, 
      transition: { duration: 0.4, ease: "easeOut", repeat: Infinity, repeatType: "reverse", repeatDelay: 1 } 
    }
  };

  return (
    <div className={styles.loaderContainer}>
      <div className={styles.logoWrapper}>
        <FernLogo className={styles.logoMark} variants={iconVariants} initial="hidden" animate="visible" />
        <motion.div className={styles.textContainer} variants={textContainerVariants} initial="hidden" animate="visible">
          {brandName.map((letter, index) => (
            <motion.span key={index} variants={letterVariants} className={styles.letter}>{letter}</motion.span>
          ))}
        </motion.div>
      </div>
      <div className={styles.counter}>{count}%</div>
    </div>
  );
};

export default Loader;