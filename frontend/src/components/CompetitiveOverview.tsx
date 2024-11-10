import React, { useState } from 'react';
import styles from './CompetitiveOverview.module.css';
import WinRateDoughnut from './WinRateDoughnut';

const IconCrown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/>
  </svg>
);

const IconTrending = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 6l-9.5 9.5-5-5L1 18"/>
    <path d="M17 6h6v6"/>
  </svg>
);

const IconAward = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="7"/>
    <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/>
  </svg>
);

const CompetitiveOverview = () => {
  const [activeGameMode, setActiveGameMode] = useState('single');
  
  // const personalBests = [
  //   { label: 'Highest Score', value: '835', Icon: IconCrown },
  //   { label: 'Longest Streak', value: '18', Icon: IconTrending },
  //   // { label: 'Best Rank', value: '#4', Icon: IconAward },
  // ];


  return (
    <div className={styles.container}>
      <h3 className={styles.title}>COMPETITIVE OVERVIEW</h3>
      
      <div className={styles.buttons}>
        <button 
          className={`${styles.button} ${activeGameMode === 'single' ? styles.singleGame : styles.tournamentsGame}`}
          onClick={() => setActiveGameMode('single')}
        >
          SINGLE GAME
        </button>
        <button 
          className={`${styles.button} ${activeGameMode === 'tournaments' ? styles.singleGame : styles.tournamentsGame}`}
          onClick={() => setActiveGameMode('tournaments')}
        >
          TOURNAMENTS GAME
        </button>
      </div>



      <div className={styles.scores}>
        <div className={styles.totalGamesBox}>
          <span className={styles.totalGames}>
            <span className={styles.scoreNum}>1010</span>GAMES
          </span>
        </div>
        <div className={styles.scoreBox}>
          <span className={styles.score}>
            <span className={styles.scoreNum}>635</span>SCORE
          </span>
        </div>
      </div>
      <div className={styles.bestCard}>
            <div className={styles.bestIcon}> <IconAward /> </div>
            <div className={styles.bestInfo}>
              <span className={styles.bestLabel}>Rank</span>
              <span className={styles.bestValue}>#5</span>
            </div>
      </div>

      {/* <div className={styles.winsLosses}>
          <div className={styles.statBoxWin}>
            <span className={styles.wins}>555 WINS</span>
          </div>
          <div className={styles.statBoxLose}>
            <span className={styles.losses}>555 LOSE</span>
          </div>
        </div> */}


      <div className={styles.stats}>
        <div className={styles.winRate}>
          <WinRateDoughnut />
        </div>
        <div className={styles.personalBests}>
          <div className={styles.bestCard}>
            <div className={styles.bestIcon}> <IconCrown /> </div>
            <div className={styles.bestInfo}>
              <span className={styles.bestLabel}>Highest Score</span>
              <span className={styles.bestValue}>835</span>
            </div>
          </div>
          <div className={styles.bestCard}>
            <div className={styles.bestIcon}> <IconTrending /> </div>
            <div className={styles.bestInfo}>
              <span className={styles.bestLabel}>Longest Streak</span>
              <span className={styles.bestValue}>5</span>
            </div>
          </div>
      </div>
      </div>

    </div>
  );
};

export default CompetitiveOverview;