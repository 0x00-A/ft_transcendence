import React from 'react';
import styles from './CompetitiveOverview.module.css';
import WinRateDoughnut from './WinRateDoughnut';

const CompetitiveOverview = () => {
  return (
    
    <div className={styles.container}>
      <h3 className={styles.title}>COMPETITIVE OVERVIEW</h3>
      
      <div className={styles.buttons}>
        <button className={`${styles.button} ${styles.singleGame}`}>SINGLE GAME</button>
        <button className={`${styles.button} ${styles.tournamentsGame}`}>TOURNAMENTS GAME</button>
      </div>
      
      <div className={styles.scores}>
          <div className={styles.totalGamesBox}>
            <span className={styles.totalGames}><span className={styles.scoreNum}>1010  </span>GAMES</span>
          </div>
          <div className={styles.scoreBox}>
            <span className={styles.score}> <span className={styles.scoreNum}>635  </span>SCORE</span>
          </div>
        </div>

      <div className={styles.stats}>
        <div className={styles.winRate}>
          <WinRateDoughnut /> 
        </div>
        <div className={styles.winsLosses}>
          <div className={styles.statBoxWin}>
            <span className={styles.wins}>555 WINS</span>
          </div>
          <div className={styles.statBoxLose}>
            <span className={styles.losses}>555 LOSE</span>
          </div>
        </div>
        </div>
    </div>
  );
};

export default CompetitiveOverview;
