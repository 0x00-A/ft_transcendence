import css from './Dashboard.module.css';
import Welcome from '../../components/Welcome';
import CompetitiveOverview from '../../components/CompetitiveOverview';
import Achievements from '../../components/Achievements';
import Leaderboard from '../../components/Leaderboard';
import FriendsList from '../../components/FriendsList';
import LastMatch from '../../components/LastMatch';

const Dashboard = () => {
  return (
    <main className={css.container}>

      <div className={css.heroSection}>
        <div className={css.welcome}> <Welcome /> </div>
        <div className={css.other}> </div>
        <div className={css.leaderboard}> <Leaderboard /> </div>
      </div>

      <div className={css.mainContent}>
        <div className={css.competitiveOverview}> <CompetitiveOverview /></div>
        <div className={css.achievements}> <Achievements /> </div>
      </div>

      <div className={css.lastSection}>
      <div className={css.lastMatchContainer}> <LastMatch /> </div>
      <div className={css.friendsContainer}> <FriendsList /></div>
      </div>
    </main>
  );
};

export default Dashboard;
