import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionTitle, ActionButtons } from '../../../../components/common/SectionHeaders';
import { testimonialsData } from '../../../../data/homeData';
import styles from './Testimonials.module.css';

const AudioCard = ({ item, isCenter, isPlaying, positionOffset, onPlay, onAudioEnd, onDragEnd }) => {
  const audioRef = useRef(null);
  
  const [progress, setProgress] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState(null);

  // 1. Auto-close transcript if the card is dragged away from the center
  useEffect(() => {
    if (!isCenter) {
      setTranscript(null);
      setIsTranscribing(false);
    }
  }, [isCenter]);

  // 2. Audio Sync
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play blocked:", e));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // 3. Live Waveform Math
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setProgress(total > 0 ? current / total : 0);
    }
  };

  // 4. SORTED API: Clean frontend simulation
  const handleTranscribe = async () => {
    if (transcript) {
      setTranscript(null); 
      return;
    }

    setIsTranscribing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTranscript(item.quote); 
    } catch (error) {
      setTranscript("Failed to transcribe audio.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const totalBars = 30;

  // 5. THE FLAT MATH (Straight horizontal slide)
  const xValue = `${positionOffset * 105}%`; 
  const yValue = isCenter ? -20 : 0; // Just a clean pop upwards for the active card

  return (
    <motion.div 
      className={`${styles.audioCard} ${isCenter ? styles.activeCard : ''}`}
      animate={{ 
        x: xValue, 
        y: yValue, 
        scale: isCenter ? 1.1 : 0.85, // Center is noticeably larger
        opacity: isCenter ? 1 : 0.35,
        zIndex: isCenter ? 10 : 5 - Math.abs(positionOffset)
      }}
      transition={{ type: "spring", stiffness: 220, damping: 25 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={onDragEnd}
      onClick={() => { if (!isCenter) onPlay(); }} 
    >
      {/* Image Block */}
      <div className={styles.imageContainer}>
        <img src={item.imageUrl} alt={item.name} className={styles.clientImage} />
        <div className={styles.nameTag}>{item.name}, {item.role}</div>
      </div>

      {/* Player UI */}
      <div className={styles.playerContainer}>
        <button className={styles.playBtn} onClick={(e) => { e.stopPropagation(); onPlay(); }}>
          {isPlaying ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--brand-orange)"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--brand-orange)"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          )}
        </button>

        {/* Live Filling Waveform */}
        <div className={styles.waveform}>
          {[...Array(totalBars)].map((_, i) => {
            const isActiveBar = (i / totalBars) <= progress;
            return (
              <div 
                key={i} 
                className={`${styles.waveBar} ${isActiveBar ? styles.waveBarActive : ''}`} 
                style={{ height: i % 2 === 0 ? '60%' : i % 3 === 0 ? '30%' : '100%' }}
              />
            );
          })}
        </div>
        
        <audio ref={audioRef} src={item.audioUrl} onEnded={onAudioEnd} onTimeUpdate={handleTimeUpdate} preload="metadata"/>
      </div>

      {/* Transcription UI */}
      <div className={styles.transcriptionWrapper}>
        <button 
          className={styles.transcribeToggle} 
          onClick={(e) => { e.stopPropagation(); handleTranscribe(); }}
          disabled={isTranscribing || !isCenter} 
        >
          {isTranscribing ? "Generating AI Transcript..." : transcript ? "Hide Transcript" : "Read Transcript"}
        </button>
        
        <AnimatePresence>
          {transcript && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={styles.transcriptBox}
            >
              "{transcript}"
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </motion.div>
  );
};

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [playingId, setPlayingId] = useState(null);
  const totalItems = testimonialsData.length;

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % totalItems);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const handleDragEnd = (event, info) => {
    const threshold = 50; 
    if (info.offset.x < -threshold) {
      handleNext();
      setPlayingId(null); 
    } else if (info.offset.x > threshold) {
      handlePrev();
      setPlayingId(null);
    }
  };

  const handlePlayClick = (index, id) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
      setPlayingId(id); 
    } else {
      setPlayingId(prevId => prevId === id ? null : id); 
    }
  };

  const handleAudioEnd = () => {
    const nextIndex = (activeIndex + 1) % totalItems;
    setActiveIndex(nextIndex);
    setPlayingId(testimonialsData[nextIndex].id); 
  };

  return (
    <section className={styles.teaContainer}>
      <div className={styles.header}>
        <SectionTitle mainText="Our Clients Spill the Tea," dimText="Ready to Be Next?" />
      </div>

      <div className={styles.carouselViewport}>
        {testimonialsData.map((item, index) => {
          let diff = index - activeIndex;
          if (diff > Math.floor(totalItems / 2)) diff -= totalItems;
          if (diff < -Math.floor(totalItems / 2)) diff += totalItems;

          return (
            <AudioCard
              key={item.id}
              item={item}
              isCenter={diff === 0}
              positionOffset={diff}
              isPlaying={playingId === item.id}
              onPlay={() => handlePlayClick(index, item.id)}
              onAudioEnd={handleAudioEnd}
              onDragEnd={handleDragEnd}
            />
          );
        })}
      </div>

      <div className={styles.footerButtons}>
        <ActionButtons 
          ghostText="I have a custom question" 
          ghostLink="/contact"
          primaryText="I want some process" 
          primaryLink="/process"
        />
      </div>
    </section>
  );
};

export default Testimonials;