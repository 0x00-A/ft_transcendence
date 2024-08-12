import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import css from './Friends.module.css';

const Friends = () => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/signup" />;
  }
  return (
    <main className={css.container}>
      <p>Friends</p>
    </main>
  );
};

export default Friends;
