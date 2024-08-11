import css from './Search.module.css';
import Sidebar from '../../components/Sidebar/Sidebar';

const Search = () => {
  return (
    <div className={css.container}>
      <Sidebar />
      <main className={css.dashboard}>
        <p>Search</p>
      </main>
    </div>
  );
};

export default Search;
