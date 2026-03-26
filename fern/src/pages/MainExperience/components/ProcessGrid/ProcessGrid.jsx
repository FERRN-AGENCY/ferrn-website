import { useState, useEffect, useMemo, useContext } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import images from '../../../../images';

import { SectionTitle, ActionButtons } from '../../../../components/common/SectionHeaders';
import { processTags, processGridData } from '../../../../data/homeData';
import { UserContext } from '../../../../context/UserContext';

import styles from './ProcessGrid.module.css';

const ProcessGrid = ({
  title = "The story behind the work,",
  caseStudyText = "Read Case Study",
  ghostText = "Where’s My Project? Bob Knows",
  ghostLink = "/files",
  primaryText = "Let’s Make Yours Next",
  primaryLink = "/contact",
}) => {
  const userCtx = useContext(UserContext);
  const displayName = userCtx?.userName ? userCtx.userName : "friend";
  const subtitle = `want to see the process ${displayName}?`;

  const [activeFilter, setActiveFilter] = useState(processTags[0]);
  
  // --- INTERACTIVE MOUSE STATE ---
  const [isMobile, setIsMobile] = useState(false);
  const [isHoveringProject, setIsHoveringProject] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 700, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // THE FIX: Cleanup function ensures the global cursor doesn't get stuck hidden 
    // if the user navigates away while hovering over the grid.
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.body.classList.remove('hide-global-cursor');
    };
  }, []);

  const handleMouseMove = (e) => {
    if (isMobile) return;
    cursorX.set(e.clientX - 75); 
    cursorY.set(e.clientY - 20); 
  };

  const filledGrid = useMemo(() => {
    const categoryData = processGridData.filter((item) => {
      if (!item.category) return false;
      if (Array.isArray(item.category)) {
        return item.category.includes(activeFilter);
      } else {
        return item.category === activeFilter;
      }
    });

    const maxProjects = 8;
    const projectsToRender = categoryData.slice(0, maxProjects);

    const gridCells = [];
    let projectIndex = 0;

    for (let i = 0; i < 9; i++) {
      if (i === 4) {
        gridCells.push({
          id: `center-title-${activeFilter}`,
          isCategoryCard: true,
          title: activeFilter
        });
      } else {
        if (projectIndex < projectsToRender.length) {
          gridCells.push(projectsToRender[projectIndex]);
        } else {
          gridCells.push({
            id: `placeholder-${i}`,
            isPlaceholder: true,
          });
        }
        projectIndex++;
      }
    }
    
    return gridCells;
  }, [activeFilter]);

  return (
    <section 
      className={styles.gridContainer} 
      onMouseMove={handleMouseMove}
    >
      {/* THE FIX: This injected style forces the GlobalCursor to disappear when inside the grid */}
      <style>{`
        body.hide-global-cursor div[class*="cursorWrapper"] {
          opacity: 0 !important;
        }
      `}</style>

      {/* THE INTERACTIVE CUSTOM CURSOR */}
      {!isMobile && (
        <motion.div
          className={styles.customCursor}
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            scale: isHoveringProject ? 1 : 0,
            opacity: isHoveringProject ? 1 : 0,
            pointerEvents: "none", 
            zIndex: 999999 /* THE FIX: Boosted z-index to ensure it is always on top! */
          }}
        >
          Read Case Study
        </motion.div>
      )}

      <div className={styles.inner}>

        {/* THE ARMORED HEADER */}
        <div style={{ 
          display: "flex", 
          flexDirection: "column",
          gap: "20px",
          width: "100%", 
          position: "relative", 
          zIndex: 50, 
          marginBottom: "30px"
        }}>
          
          <SectionTitle mainText={title} dimText={subtitle} />

          <div className={styles.filterBlocks}>
            {processTags.map((tag, idx) => (
              <button
                key={idx}
                className={`${styles.filterButton} ${
                  activeFilter === tag ? styles.activeFilter : ''
                }`}
                onClick={() => setActiveFilter(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* GRID */}
        <div 
          className={styles.grid}
          onMouseEnter={() => {
            setIsHoveringProject(true);
            // Hides the global orange cursor
            document.body.classList.add('hide-global-cursor');
          }}
          onMouseLeave={() => {
            setIsHoveringProject(false);
            // Brings back the global orange cursor
            document.body.classList.remove('hide-global-cursor');
          }}
        >
          {filledGrid.map((item) => {
            const isClickableProject = !item.isPlaceholder && !item.isCategoryCard && item.link;
            const CardTag = isClickableProject ? "a" : "div";

            return (
              <CardTag
                key={item.id}
                href={isClickableProject ? item.link : undefined}
                target={isClickableProject ? "_blank" : undefined}
                rel={isClickableProject ? "noopener noreferrer" : undefined}
                className={`${styles.card} ${item.isPlaceholder ? styles.placeholder : ''} ${item.isCategoryCard ? styles.categoryCard : ''}`}
                style={isClickableProject ? { textDecoration: 'none' } : {}}
              >
                {item.isCategoryCard && (
                  <div className={styles.categoryCardContent}>
                    {item.title}
                  </div>
                )}

                {isClickableProject && (
                  <>
                    <img
                      src={images[item.imgKey] || images.gridFallback}
                      alt={item.title}
                      className={styles.image}
                    />
                    <div className={styles.overlay}>
                      <div className={styles.mobileTag}>
                          <span>{caseStudyText}</span>
                      </div>
                    </div>
                  </>
                )}

                {item.isPlaceholder && (
                  <div className={styles.placeholderContent}>
                    <span>Request a Custom Solution</span>
                  </div>
                )}
              </CardTag>
            );
          })}
        </div>

        {/* THE ARMORED FOOTER */}
        <div style={{ 
          width: "100%", 
          position: "relative", 
          zIndex: 50,
          marginTop: "20px",
          display: "flex",
          justifyContent: "center"
        }}>
          <ActionButtons
            ghostText={ghostText}
            primaryText={primaryText}
          />
        </div>

      </div>
    </section>
  );
};

export default ProcessGrid;