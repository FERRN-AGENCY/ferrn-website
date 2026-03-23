import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

const SmoothScroll = ({ children }) => {
  useEffect(() => {
    // 1. Initialize Lenis with premium settings
    const lenis = new Lenis({
      duration: 1.2, // The time it takes to stop after letting go of the wheel. Higher = smoother/heavier.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Beautiful exponential easing
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false, // Usually best to leave native scrolling on mobile touch
      touchMultiplier: 2,
    });

    // 2. Connect it to the browser's native animation loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // 3. Clean up when the component unmounts so it doesn't cause memory leaks
    return () => {
      lenis.destroy();
    };
  }, []);

  // Wraps your entire app silently
  return <>{children}</>;
};

export default SmoothScroll;