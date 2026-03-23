import { useState, useMemo, useContext } from 'react';
import images from '../../../../images';

import { SectionTitle, ActionButtons } from '../../../../components/common/SectionHeaders';
import { processTags, processGridData } from '../../../../data/homeData';
import { UserContext } from '../../../../context/UserContext';

import styles from './ProcessGrid.module.css';

const ProcessGrid = ({
  title = "The story behind the work,",
  caseStudyText = "Read Case Study",
  ghostText = "Where do Project files live",
  ghostLink = "/files",
  primaryText = "Let's make it epic",
  primaryLink = "/contact",
}) => {
  const userCtx = useContext(UserContext);
  const displayName = userCtx?.userName ? userCtx.userName : "friend";
  const subtitle = `want to see the process ${displayName}?`;

  const [activeFilter, setActiveFilter] = useState(processTags[0]);

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
    <section className={styles.gridContainer}>
      <div className={styles.inner}>

        {/* THE ARMORED HEADER */}
        <div style={{ 
          display: "flex", 
          flexDirection: "column",
          gap: "20px",
          width: "100%", 
          position: "relative", 
          zIndex: 50, /* Keeps it above the grid items */
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
                  <div className={styles.overlay}>
                    <span className={styles.tag}>{caseStudyText}</span>
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