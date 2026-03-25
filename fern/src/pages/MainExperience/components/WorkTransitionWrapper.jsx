import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import OurServices from './Services/OurServices'; 
import CaseStudies from './CaseStudies/CaseStudies'; 
import ProcessGrid from './ProcessGrid/ProcessGrid'; 

const WorkTransitionWrapper = () => {
  const runwayRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ["start start", "end end"]
  });

  // --- 📱 MOBILE TIMELINE ---
  const yMobile = useTransform(scrollYProgress, [0.35, 0.45, 0.75, 1], ["120%", "0%", "0%", "-120%"]);

  // --- 💻 DESKTOP TIMELINE ---
  const yDesktop = useTransform(scrollYProgress, [0.35, 0.45, 0.75, 1], ["120%", "0%", "0%", "0%"]);
  
  // 1. Desktop Expanding Portal: Zooms and fades out completely by 0.85
  const scaleDesktop = useTransform(scrollYProgress, [0.70, 0.85], [1, 5]);
  const opacityDesktop = useTransform(scrollYProgress, [0.70, 0.85], [1, 0]);

  // 2. Desktop Background Fade: Fades back to dark completely by 0.85
  const bgFadeDesktop = useTransform(
    scrollYProgress, 
    [0.35, 0.45, 0.70, 0.85], 
    ["var(--bg-primary)", "#F94406", "#F94406", "var(--bg-primary)"]
  );

  // 3. THE FIX: Process Grid stays hidden (opacity 0) until the zoom finishes at 0.85!
  const processGridOpacityDesktop = useTransform(scrollYProgress, [0.85, 0.95], [0, 1]);
  const processGridYDesktop = useTransform(scrollYProgress, [0.85, 0.95], ["100px", "0px"]); // Adds a slick slide-up effect

  // --- DYNAMIC APPLICATION ---
  const caseStudiesY = isMobile ? yMobile : yDesktop;
  const caseStudiesScale = isMobile ? 1 : scaleDesktop;
  const caseStudiesOpacity = isMobile ? 1 : opacityDesktop;
  const wrapperBg = isMobile ? "var(--bg-primary)" : bgFadeDesktop;

  // Mobile keeps Process Grid visible underneath so the curtain can just slide over it
  const processGridOpacity = isMobile ? 1 : processGridOpacityDesktop;
  const processGridY = isMobile ? "0px" : processGridYDesktop;

  const servicesOpacity = useTransform(scrollYProgress, [0.35, 0.45], [1, 0]);
  const servicesPointerEvents = useTransform(scrollYProgress, [0, 0.40], ["auto", "none"]);
  const caseStudiesPointerEvents = useTransform(
    scrollYProgress, 
    [0, 0.35, 0.45, 0.75, 0.85, 1], 
    ["none", "none", "auto", "auto", "none", "none"]
  );

  return (
    <motion.div style={{ position: "relative", width: "100%", backgroundColor: wrapperBg }}>
      
      <div 
        ref={runwayRef} 
        style={{ height: "400vh", position: "relative", zIndex: 10, pointerEvents: "none" }}
      >
        <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", pointerEvents: "none" }}>
          
          {/* LAYER 1: Our Services */}
          <motion.div 
            style={{ 
              position: "absolute", 
              inset: 0, 
              opacity: servicesOpacity,
              pointerEvents: servicesPointerEvents,
            }}
          >
            <OurServices scrollProgress={scrollYProgress} />
          </motion.div>

          {/* LAYER 2: Case Studies */}
          <motion.div 
            style={{ 
              position: "absolute", 
              inset: 0, 
              y: caseStudiesY,
              scale: caseStudiesScale,
              opacity: caseStudiesOpacity,
              background: isMobile ? "linear-gradient(to bottom, var(--bg-primary) 0%, #F94406 10%, #F94406 90%, var(--bg-primary) 100%)" : "transparent",
              pointerEvents: caseStudiesPointerEvents, 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transformOrigin: 'center center' 
            }}
          >
            <CaseStudies scrollProgress={scrollYProgress} />
          </motion.div>

        </div>
      </div>

      {/* LAYER 3: Process Grid */}
      {/* Wrapped in a motion.div to control exactly when it appears */}
      <motion.div 
        id="case-studies" 
        style={{ 
          position: "relative", 
          zIndex: 1, 
          marginTop: "-100vh",
          opacity: processGridOpacity,
          y: processGridY
        }}
      >
        <ProcessGrid />
      </motion.div>

    </motion.div>
  );
};

export default WorkTransitionWrapper;