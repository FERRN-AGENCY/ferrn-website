import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionTitle, ActionButtons } from '../../../../components/common/SectionHeaders';
import { testimonialsData } from '../../../../data/homeData';
import styles from './Testimonials.module.css';

// Helper to format seconds into 0:00
const formatTime = (timeInSeconds) => {
  if (isNaN(timeInSeconds)) return "0:00";
  const m = Math.floor(timeInSeconds / 60);
  const s = Math.floor(timeInSeconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const waveHeights = [
  20, 30, 45, 60, 80, 100, 85, 60, 45, 30, 
  25, 40, 60, 85, 100, 80, 55, 35, 45, 70, 
  95, 80, 50, 30, 40, 60, 85, 100, 75, 50, 
  35, 25, 40, 65, 80, 90, 70, 40, 30, 50,
  80, 100, 90, 60, 40, 30, 20, 35, 55, 85,
];

const AudioCard = ({ item, isCenter, isPlaying, positionOffset, onPlay, onAudioEnd, onDragEnd }) => {
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState(null);

  useEffect(() => {
    if (!isCenter) {
      setTranscript(null);
      setIsTranscribing(false);
    }
  }, [isCenter]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play blocked:", e));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setCurrentTime(current);
      setProgress(total > 0 ? current / total : 0);
    }
  };

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

  const xValue = `${positionOffset * 105}%`; 
  const yValue = isCenter ? -20 : 0; 

  return (
    <motion.div 
      className={`${styles.audioCard} ${isCenter ? styles.activeCard : ''}`}
      animate={{ 
        x: xValue, 
        y: yValue, 
        scale: isCenter ? 1.1 : 0.85, 
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
      <div className={styles.imageContainer}>
        <img src={item.imageUrl} alt={item.name} className={styles.clientImage} />
        <div className={styles.nameTag}>{item.name}, {item.role}</div>
      </div>

      <div className={styles.playerContainer}>
        <button className={styles.playBtn} onClick={(e) => { e.stopPropagation(); onPlay(); }}>
          {isPlaying ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#F94406">
              <rect x="6" y="5" width="4" height="14" rx="1"/>
              <rect x="14" y="5" width="4" height="14" rx="1"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#F94406">
              <polygon points="6 4 19 12 6 20 6 4"/>
            </svg>
          )}
        </button>

        <div className={styles.waveform}>
          {waveHeights.map((height, i) => {
            const isActiveBar = (i / waveHeights.length) <= progress;
            return (
              <div 
                key={i} 
                className={`${styles.waveBar} ${isActiveBar ? styles.waveBarActive : ''}`} 
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>

        <div className={styles.timer}>
          {formatTime(currentTime)}
        </div>
        
        <audio 
          ref={audioRef} 
          src={item.audioUrl} 
          onEnded={onAudioEnd} 
          onTimeUpdate={handleTimeUpdate} 
          preload="metadata"
        />
      </div>

      <div className={styles.transcriptionWrapper}>
        <button 
          className={styles.transcribeToggle} 
          onClick={(e) => { e.stopPropagation(); handleTranscribe(); }}
          disabled={isTranscribing || !isCenter} 
        >
          {isTranscribing ? "Generating AI Transcript..." : transcript ? "Hide Transcript" : "Transcribe"}
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

  // --- THE AUTO-SCROLL FIX ---
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    
    // Only auto-scroll on mobile and if NO audio is currently playing
    if (isMobile && playingId === null) {
      const interval = setInterval(() => {
        handleNext();
      }, 4000); // 4 seconds per slide

      return () => clearInterval(interval);
    }
  }, [activeIndex, playingId]); // Reset timer whenever we move or play audio

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
          ghostText="I have one more question" 
          primaryText="I want to join them" 
        />
      </div>
    </section>
  );
};

export default Testimonials;