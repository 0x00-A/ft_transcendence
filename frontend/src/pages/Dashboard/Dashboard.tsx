import css from './Dashboard.module.css';

const Dashboard = () => {
  return (
    <main className={css.container}>
      {/* Left Side: Hero Section */}
      <div className={css.heroSection}>
        <div className={css.welcome}>
          <h2>FT-PONG</h2>
          <p>Ready to start your next match and climb the leaderboard?</p>
          <button className={css.playButton}>Play now</button>
        </div>
        <div className={css.leaderboard}>
          <h3>Leaderboard</h3>
          {/* Add leaderboardfff items here */}
        </div>
      </div>

      {/* Middle Side: Main Content */}
      <div className={css.mainContent}>
        <div className={css.competitiveOverview}>
          <h3>Competitive Overview</h3>
          {/* Add competitive overview details here */}
        </div>
        <div className={css.achievements}>
          <h3>Achievements</h3>
          {/* Add achievements details here */}
        </div>
      </div>

      {/* Right Side: Last Match */}
      <div className={css.lastMatch}>
        <h3>Last Match</h3>
        {/* Add last match details here */}
      </div>
    </main>
  );
};

export default Dashboard;
