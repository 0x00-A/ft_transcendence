import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PreLoader from './PreLoader/PreLoader';

const ProtectedRoute = () => {

  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <PreLoader />;
  }
  return isLoggedIn ? <Outlet /> : <Navigate to={'/auth'}/>;
};

export default ProtectedRoute;
