import { useState, useMemo, useContext, useEffect } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
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
  
  // --- CUSTOM CURSOR STATE ---
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
    const filterStr = activeFilter ? activeFilter.trim().toLowerCase() : "";

    const categoryData = processGridData.filter((item) => {
      if (!item.category) return false;
      if (Array.isArray(item.category)) {
        return item.category.some(cat => cat.trim().toLowerCase() === filterStr);
      } else {
        return item.category.trim().toLowerCase() === filterStr;
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
    <section className={styles.gridContainer} onMouseMove={handleMouseMove}>
      
      {/* Forces the global orange cursor to hide when hovering the grid */}
      <style>{`
        body.hide-global-cursor div[class*="cursorWrapper"] {
          opacity: 0 !important;
        }
      `}</style>

      {/* THE RESTORED CUSTOM CURSOR */}
      <AnimatePresence>
        {!isMobile && isHoveringProject && (
          <motion.div
            className={styles.customCursor}
            style={{
              x: cursorXSpring,
              y: cursorYSpring,
              pointerEvents: "none", // CRITICAL: Lets clicks pass through to the buttons and cards
              zIndex: 999999 
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            {caseStudyText}
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.inner}>

        {/* HEADER AREA */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%", marginBottom: "30px" }}>
          
          <SectionTitle mainText={title} dimText={subtitle} />

          {/* THE BUTTONS */}
          <div className={styles.filterBlocks}>
            {processTags.map((tag, idx) => (
              <button
                key={idx}
                type="button" 
                className={`${styles.filterButton} ${activeFilter === tag ? styles.activeFilter : ''}`}
                onClick={() => setActiveFilter(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* THE GRID */}
        {/* Added mouse events to trigger the custom cursor visibility */}
        <div 
          className={styles.grid}
          onMouseEnter={() => {
            setIsHoveringProject(true);
            document.body.classList.add('hide-global-cursor');
          }}
          onMouseLeave={() => {
            setIsHoveringProject(false);
            document.body.classList.remove('hide-global-cursor');
          }}
          style={{ cursor: 'none' }} /* Hides your real mouse while inside the grid */
        >
          {filledGrid.map((item, index) => {
            const isClickableProject = !item.isPlaceholder && !item.isCategoryCard && item.link;
            const CardTag = isClickableProject ? "a" : "div";

            // Forces a clean redraw
            const uniqueKey = `${item.id}-${activeFilter}-${index}`;

            return (
              <CardTag
                key={uniqueKey}
                href={isClickableProject ? item.link : undefined}
                target={isClickableProject ? "_blank" : undefined}
                rel={isClickableProject ? "noopener noreferrer" : undefined}
                className={`${styles.card} ${item.isPlaceholder ? styles.placeholder : ''} ${item.isCategoryCard ? styles.categoryCard : ''}`}
                style={isClickableProject ? { textDecoration: 'none', cursor: 'none' } : { cursor: 'none' }} 
              >
                {/* Center Tile */}
                {item.isCategoryCard && (
                  <div className={styles.categoryCardContent}>{item.title}</div>
                )}

                {/* Real Projects */}
                {isClickableProject && (
                  <>
                    <img src={images[item.imgKey] || images.gridFallback} alt={item.title} className={styles.image} />
                    <div className={styles.overlay}>
                      <div className={styles.mobileTag}>
                          <span>{caseStudyText}</span>
                      </div>
                    </div>
                  </>
                )}

                {/* Placeholders */}
                {item.isPlaceholder && (
                  <div className={styles.placeholderContent}>
                    <span>Request a Custom Solution</span>
                  </div>
                )}
              </CardTag>
            );
          })}
        </div>

        {/* FOOTER AREA */}
        <div style={{ width: "100%", marginTop: "20px", display: "flex", justifyContent: "center" }}>
          <ActionButtons ghostText={ghostText} primaryText={primaryText} />
        </div>

      </div>
    </section>
  );
};

export default ProcessGrid;