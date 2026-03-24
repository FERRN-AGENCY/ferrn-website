import { useState, useEffect, useMemo, useContext } from 'react';
// Added useMotionValue and useSpring for the interactive mouse
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

  // Framer Motion values for buttery smooth cursor tracking
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 700, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track mouse movement across the grid container
  const handleMouseMove = (e) => {
    if (isMobile) return;
    // Offsetting by 40px centers the 80x80 custom cursor on the mouse pointer
    cursorX.set(e.clientX - 40);
    cursorY.set(e.clientY - 40);
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
      
      {/* THE INTERACTIVE CUSTOM CURSOR (Hidden on mobile) */}
      {!isMobile && (
        <motion.div
          className={styles.customCursor}
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            scale: isHoveringProject ? 1 : 0,
            opacity: isHoveringProject ? 1 : 0,
          }}
        >
          View
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
        <div className={styles.grid}>
          {filledGrid.map((item) => (
            <div
              key={item.id}
              className={`${styles.card} ${item.isPlaceholder ? styles.placeholder : ''} ${item.isCategoryCard ? styles.categoryCard : ''}`}
              // Trigger the custom cursor ONLY when hovering real projects
              onMouseEnter={() => {
                if (!item.isPlaceholder && !item.isCategoryCard) setIsHoveringProject(true);
              }}
              onMouseLeave={() => setIsHoveringProject(false)}
            >
              {item.isCategoryCard && (
                <div className={styles.categoryCardContent}>
                  {item.title}
                </div>
              )}

              {!item.isPlaceholder && !item.isCategoryCard && (
                <>
                  <img
                    src={images[item.imgKey] || images.gridFallback}
                    alt={item.title}
                    className={styles.image}
                  />
                {/* Replace your current overlay div with this: */}
                <div className={styles.overlay}>
                    <div className={styles.mobileTag}>
                        <span>Read Case Study</span>
                    </div>
                </div>
                </>
              )}

              {item.isPlaceholder && (
                <div className={styles.placeholderContent}>
                  <span>Add Project</span>
                </div>
              )}
            </div>
          ))}
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
            ghostLink={ghostLink}
            primaryText={primaryText}
            primaryLink={primaryLink}
          />
        </div>

      </div>
    </section>
  );
};

export default ProcessGrid;