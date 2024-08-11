import css from './Settings.module.css';
import Sidebar from '../../components/Sidebar/Sidebar';

const Settings = () => {
  return (
    <div className={css.container}>
      <Sidebar />
      <main className={css.dashboard}>
        <p>Settings</p>
      </main>
    </div>
  );
};

export default Settings;
