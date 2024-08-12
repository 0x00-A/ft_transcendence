import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import css from './Store.module.css';

const Store = () => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/signup" />;
  }
  return (
    <main className={css.dashboard}>
      <p>Store</p>
    </main>
  );
};

export default Store;
