import styles from './Welcome.module.css';

const Welcome = () => {
  return (
      <div className={styles.content}>
        <div>
          <h2 className={styles.title}>FT-PONG</h2>
          <p className={styles.description}>
            <span>Ready to start </span> your next match and climb <span>the leaderboard</span>
          </p>
        </div>
        <button className={styles.playButton}>Play now</button>
      </div>
  );
};

export default Welcome;
