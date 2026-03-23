import { useRef, useEffect } from 'react';
import { useInView } from 'framer-motion';
import images from '../../../../images'; 
import styles from './CaseStudies.module.css';

const CaseStudies = () => {
  const videoRef = useRef(null);
  const isInView = useInView(videoRef, { margin: "-20% 0px" });

  useEffect(() => {
    if (isInView && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [isInView]);

  return (
    <div className={styles.caseContainer}>
      
      <h2 className={styles.caseTitle}>
        Evidence we do more than talk.
      </h2>
      
      <div 
        className={styles.videoWrapper}
        style={{ 
          position: "relative", 
          zIndex: 20
        }}
      >
        <video 
          ref={videoRef} 
          src={images.websiteDev} 
          className={styles.videoElement} 
          autoPlay 
          loop 
          muted 
          playsInline
        />
      </div>

    </div>
  );
};

export default CaseStudies;