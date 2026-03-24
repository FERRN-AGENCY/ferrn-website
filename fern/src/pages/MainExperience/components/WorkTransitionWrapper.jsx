import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import OurServices from './Services/OurServices'; 
import CaseStudies from './CaseStudies/CaseStudies'; 
import ProcessGrid from './ProcessGrid/ProcessGrid'; 

const WorkTransitionWrapper = () => {
  const runwayRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ["start start", "end end"]
  });

  const caseStudiesY = useTransform(
    scrollYProgress, 
    [0.35, 0.45, 0.85, 1], 
    ["120%", "0%", "0%", "120%"]
  );

  const servicesOpacity = useTransform(scrollYProgress, [0.35, 0.45], [1, 0]);
  
  const servicesPointerEvents = useTransform(scrollYProgress, [0, 0.40], ["auto", "none"]);
  const caseStudiesPointerEvents = useTransform(
    scrollYProgress, 
    [0, 0.35, 0.45, 0.85, 0.95, 1], 
    ["none", "none", "auto", "auto", "none", "none"]
  );

  return (
    <div style={{ position: "relative", width: "100%", backgroundColor: "var(--bg-primary)" }}>
      
      <div 
        ref={runwayRef} 
        style={{ 
          height: "400vh", 
          position: "relative", 
          zIndex: 10,
          pointerEvents: "none" 
        }}
      >
        
        <div 
          style={{ 
            position: "sticky", 
            top: 0, 
            height: "100vh", 
            overflow: "hidden", 
            pointerEvents: "none" 
          }}
        >
          
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

          {/* LAYER 2: Case Studies (The Orange Curtain) */}
          <motion.div 
            style={{ 
              position: "absolute", 
              inset: 0, 
              y: caseStudiesY, 
              background: "linear-gradient(to bottom, var(--bg-primary) 0%, #F94406 10%, #F94406 90%, var(--bg-primary) 100%)",
              boxShadow: "0px -20px 50px rgba(0,0,0,0.3)", 
              pointerEvents: caseStudiesPointerEvents, 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CaseStudies scrollProgress={scrollYProgress} />
          </motion.div>

        </div>
      </div>

      {/* LAYER 3: Process Grid (Mapped to Case Studies!) */}
      {/* ADDED: id="case-studies" right here so the Navbar can lock onto it */}
      <div id="case-studies" style={{ position: "relative", zIndex: 1, marginTop: "-100vh" }}>
        <ProcessGrid />
      </div>

    </div>
  );
};

export default WorkTransitionWrapper;