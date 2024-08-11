import css from './Games.module.css';
import Sidebar from '../../components/Sidebar/Sidebar';

const Games = () => {
  return (
    <div className={css.container}>
      <Sidebar />
      <main className={css.dashboard}>
        <p>Games</p>
      </main>
    </div>
  );
};

export default Games;
