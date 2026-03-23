import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import OurServices from './Services/OurServices'; 
import CaseStudies from './CaseStudies/CaseStudies'; 

const WorkTransitionWrapper = () => {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // The mechanical shutter effect: 4 Orange Walls closing in
  const edgeThickness = useTransform(scrollYProgress, [0.1, 0.35], ["0%", "52%"]);

  // Perfect Crossfade: Services vanishes as Case Studies appears
  const servicesOpacity = useTransform(scrollYProgress, [0.35, 0.45], [1, 0]);
  const caseStudiesOpacity = useTransform(scrollYProgress, [0.35, 0.45], [0, 1]);
  
  // THE FIX: The Glass Shield Armor
  // 1. Turns OFF Our Services clicks when it fades away
  const servicesPointerEvents = useTransform(scrollYProgress, [0, 0.35], ["auto", "none"]);
  // 2. Turns OFF Case Studies clicks when it is invisible at the top
  const caseStudiesPointerEvents = useTransform(scrollYProgress, [0.1, 0.35], ["none", "auto"]);

  return (
    <div ref={containerRef} style={{ height: "400vh", position: "relative" }}>
      <motion.div 
        style={{ 
          position: "sticky", 
          top: 0, 
          height: "100vh", 
          backgroundColor: "var(--bg-primary)",
          overflow: "hidden" 
        }}
      >
        
        {/* THE SHUTTER EFFECT: 4 Orange Walls */}
        <motion.div style={{ position: "absolute", top: 0, left: 0, right: 0, height: edgeThickness, backgroundColor: "#F94406", zIndex: 0 }} />
        <motion.div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: edgeThickness, backgroundColor: "#F94406", zIndex: 0 }} />
        <motion.div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: edgeThickness, backgroundColor: "#F94406", zIndex: 0 }} />
        <motion.div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: edgeThickness, backgroundColor: "#F94406", zIndex: 0 }} />


        {/* Layer 1: OurServices */}
        <motion.div 
          style={{ 
            position: "absolute", 
            inset: 0, 
            opacity: servicesOpacity,
            pointerEvents: servicesPointerEvents,
            zIndex: 1
          }}
        >
          <OurServices scrollProgress={scrollYProgress} />
        </motion.div>

        {/* Layer 2: Case Studies */}
        <motion.div 
          style={{ 
            position: "absolute", 
            inset: 0, 
            opacity: caseStudiesOpacity, 
            pointerEvents: caseStudiesPointerEvents, /* THE FIX: Applied the shield breaker here */
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2
          }}
        >
          <CaseStudies scrollProgress={scrollYProgress} />
        </motion.div>

      </motion.div>
    </div>
  );
};

export default WorkTransitionWrapper;