import css from './Leaderboard.module.css';
import Sidebar from '../../components/Sidebar/Sidebar';

const Leaderboard = () => {
  return (
    <div className={css.container}>
      <Sidebar />
      <main className={css.dashboard}>
        <p>Leaderboard</p>
      </main>
    </div>
  );
};

export default Leaderboard;
