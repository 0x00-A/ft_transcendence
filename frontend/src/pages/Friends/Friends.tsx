import css from './Friends.module.css';
import Sidebar from '../../components/Sidebar/Sidebar';

const Friends = () => {
  return (
    <div className={css.container}>
      <Sidebar />
      <main className={css.dashboard}>
        <p>Friends</p>
      </main>
    </div>
  );
};

export default Friends;
