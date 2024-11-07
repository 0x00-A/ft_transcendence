import css from './Dashboard.module.css';
import Welcome from '../../components/Welcome';

const Dashboard = () => {
  return (
    <main className={css.container}>
      <div className={css.heroSection}>
        <Welcome />
        <div className={css.leaderboard}>
          <h3>Leaderboard</h3>
        </div>
      </div>

      <div className={css.mainContent}>
        <div className={css.competitiveOverview}>
          <h3>Competitive Overview</h3>

        </div>
        <div className={css.achievements}>
          <h3>Achievements</h3>
        </div>
      </div>

      <div className={css.lastMatch}>
        <h3>Last Match</h3>
      </div>
    </main>
  );
};

export default Dashboard;
