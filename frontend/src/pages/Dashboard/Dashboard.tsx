import css from './Dashboard.module.css';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/signup" />;
  }

  return (
    <main className={css.container}>
      <p>Main app</p>
    </main>
  );
};

export default Dashboard;
