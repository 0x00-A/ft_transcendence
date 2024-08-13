import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import css from './Games.module.css';

const Games = () => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <main className={css.container}>
      <div className={css.lobby}></div>
    </main>
  );
};

export default Games;
