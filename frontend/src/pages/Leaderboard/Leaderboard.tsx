import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import css from './Leaderboard.module.css';

const Leaderboard = () => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/signup" />;
  }
  return (
    <main className={css.container}>
      <p>Leaderboard</p>
    </main>
  );
};

export default Leaderboard;
