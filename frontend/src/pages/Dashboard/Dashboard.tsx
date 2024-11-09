import css from './Dashboard.module.css';
import Welcome from '../../components/Welcome';
import CompetitiveOverview from '../../components/CompetitiveOverview';
import Achievements from '../../components/Achievements';
import Leaderboard from '../../components/Leaderboard';

const Dashboard = () => {
  return (
    <main className={css.container}>
      <div className={css.heroSection}>
        <Welcome />
        <div className={css.leaderboard}>
        </div> 
        <Leaderboard />
      </div>

      <div className={css.mainContent}>
        <div className={css.competitiveOverview}>
          <CompetitiveOverview />
        </div>
        <div className={css.achievements}>
          <Achievements />
        </div>
      </div>

      <div className={css.lastMatch}>
        <h3>Last Match</h3>
      </div>
    </main>
  );
};

export default Dashboard;
