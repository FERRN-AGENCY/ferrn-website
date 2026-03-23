import { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import Lenis from '@studio-freight/lenis';

export const useLenis = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.12, 
      delayChildren: 0.1 
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 90, 
    scale: 0.98, 
    filter: "blur(6px)",
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    filter: "blur(0px)",
    transition: { 
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1] 
    } 
  },
  exit: {
    opacity: 0,
    y: 90,
    scale: 0.98,
    filter: "blur(6px)",
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export const RevealContainer = ({ children, className, viewportMargin = "0px 0px -20% 0px" }) => {
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: viewportMargin }}
      style={{ position: 'relative' }}
    >
      {children}
    </motion.div>
  );
};

// ✅ Replaced whileInView with manual useInView + useAnimation
export const RevealItem = ({ children, className }) => {
  const ref = useRef(null);
  const controls = useAnimation();

  // margin triggers exit before fully off-screen for a smoother feel
  const isInView = useInView(ref, { 
    once: false, 
    margin: "0px 0px -10% 0px" 
  });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else {
      controls.start('exit'); // ✅ This is what whileInView could never do
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={itemVariants}
      initial="hidden"
      animate={controls}
    >
      {children}
    </motion.div>
  );
};