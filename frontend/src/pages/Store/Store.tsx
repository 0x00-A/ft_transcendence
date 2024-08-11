import css from './Store.module.css';
import Sidebar from '../../components/Sidebar/Sidebar';

const Store = () => {
  return (
    <div className={css.container}>
      <Sidebar />
      <main className={css.dashboard}>
        <p>Store</p>
      </main>
    </div>
  );
};

export default Store;
