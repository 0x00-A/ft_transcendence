import React from 'react';
import styles from './Welcome.module.css';

const Welcome = () => {
  return (
    <div className={styles.welcome}>
      <div className={styles.playerImage}>
        <img src="/public/rr.png" alt="Player playing ping-pong" />
      </div>
      <div className={styles.content}>
        <h2 className={styles.title}>FT-PONG</h2>
        <p className={styles.description}>
          Ready to start your next match and climb the leaderboard?
        </p>
        <button className={styles.playButton}>Play now</button>
      </div>
    </div>
  );
};

export default Welcome;