// Achievements.jsx
import React, { useState } from 'react';
import styles from './Achievements.module.css';

const AchievementsCard = ({ title, icon, progress }) => (
  <div className={styles.card}>
    <h3 className={styles.cardTitle}>{title}</h3>
    <div className={styles.iconContainer}>
      {icon}
    </div>
    <div className={styles.progressBar}>
      <div 
        className={styles.progressFill}
        style={{ 
          width: `${progress}%`,
          backgroundColor: title.toLowerCase() === 'bronze' ? '#CD7F32' : '#C0C0C0'
        }}
      />
    </div>
  </div>
);

const ArrowLeft = () => (
  <svg viewBox="0 0 24 24" className={styles.arrow}>
    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" className={styles.arrow}>
    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

const Achievements = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const achievements = [
    {
      title: "BRONZE",
      progress: 50,
      icon: (
        <svg viewBox="0 0 100 100" className={styles.medalIcon}>
          <path d="M50 0L61 20L83 23L67 39L71 61L50 51L29 61L33 39L17 23L39 20L50 0Z" />
          <path d="M30 35L45 35L50 20L55 35L70 35L58 45L63 60L50 52L37 60L42 45L30 35Z" />
          <path d="M20 70L80 70C85 70 85 75 80 75L20 75C15 75 15 70 20 70Z" />
        </svg>
      )
    },
    {
      title: "SILVER",
      progress: 0,
      icon: (
        <svg viewBox="0 0 100 100" className={styles.medalIcon}>
          <circle cx="50" cy="50" r="35" />
          <path d="M50 15L53 25L63 25L55 32L58 42L50 36L42 42L45 32L37 25L47 25L50 15Z" />
          <path d="M30 45L70 45L75 50L70 55L30 55L25 50L30 45Z" />
          <path d="M40 60L60 60L65 65L60 70L40 70L35 65L40 60Z" />
        </svg>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % achievements.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + achievements.length) % achievements.length);
  };

  return (

      <div className={styles.containerAchievements}>
        <h2 className={styles.title}>ACHIEVEMENTS</h2>
        <div className={styles.container}>
            <button 
                onClick={prevSlide}
                className={styles.navButton}
                aria-label="Previous achievement"
            >
                <ArrowLeft />
            </button>

            <div className={styles.carouselContainer}>
                {achievements.map((achievement, index) => (
                <div
                    key={achievement.title}
                    className={`${styles.slide} ${
                    index === currentSlide ? styles.activeSlide : styles.hiddenSlide
                    }`}
                >
                    <AchievementsCard {...achievement} />
                </div>
                ))}
            </div>

            <button 
                onClick={nextSlide}
                className={`${styles.navButton} ${styles.navButtonRight}`}
                aria-label="Next achievement"
            >
                <ArrowRight />
            </button>
            </div>
      </div>
    
  );
};

export default Achievements;