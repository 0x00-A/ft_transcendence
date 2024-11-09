// Achievements.js
import React, { useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import css from './Achievements.module.css';

const achievementsData = [
  { title: "Bronze", image: "/icons/pngegg.png", progress: 60 },
  { title: "Silver", image: "/icons/bronze.png", progress: 80 },
  { title: "Gold", image: "/icons/pngegg.png", progress: 50 },
  { title: "Platinum", image: "/icons/pngegg.png", progress: 40 },
  { title: "Diamond", image: "/icons/pngegg.png", progress: 70 },
  { title: "FT-PONG", image: "/icons/pngegg.png", progress: 90 },
];

const Achievements = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? achievementsData.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === achievementsData.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className={css.achievementsContainer}>
      <h3>Achievements</h3>
      <div className={css.achievementsCarousel}>
        <FaArrowLeft onClick={handlePrev} className={css.arrow} />
        
        <div className={css.achievementCard}>
          <h4 className={css.achievementTitle}>{achievementsData[currentIndex].title}</h4>
          <img src={achievementsData[currentIndex].image} alt={achievementsData[currentIndex].title} className={css.achievementImage} />
          
          <div className={css.progressBar}>
            <div className={css.progressFill} style={{ width: `${achievementsData[currentIndex].progress}%` }}></div>
            <span className={css.progressText}>
              {currentIndex + 1}/{achievementsData.length}
            </span>
          </div>
        </div>

        <FaArrowRight onClick={handleNext} className={css.arrow} />
      </div>
    </div>
  );
};

export default Achievements;
