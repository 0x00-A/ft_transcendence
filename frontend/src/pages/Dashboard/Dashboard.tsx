import css from './Dashboard.module.css';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return <main className={css.container}>Dashboard</main>;
};

export default Dashboard;
