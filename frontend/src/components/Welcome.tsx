import styles from './Welcome.module.css';

const Welcome = () => {
  return (
    <div className={styles.welcome}>
      <div className={styles.content}>
        <div>
          <h2 className={styles.title}>FT-PONG</h2>
          <p className={styles.description}>
            <span>Ready to start   </span>   your next match and climb  <span>the leaderboard</span> 
          </p>
        </div>
        <button className={styles.playButton}>Play now</button>
      </div>
      <div className={styles.playerImage}>
        <img src="/public/rr.png" alt="Player playing ping-pong" />
      </div>
    </div>
  );
};

export default Welcome;