import axios from 'axios';
import {
  createContext,
  useState,
  useContext,
  PropsWithChildren,
  SetStateAction,
  Dispatch,
  useEffect,
} from 'react';
import apiClient from '../api/apiClient';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isLoggedIn: boolean | null;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedStat = localStorage.getItem('isLoggedIn');
    return savedStat ? JSON.parse(savedStat) : false;
  });

  const navigate = useNavigate();

  const logout = async () => {
      console.log('----logout-----');
      const response = await apiClient.post('/auth/logout/', {}, {withCredentials: true});
      console.log('----response from interceptors.response-error-------', response);
      setIsLoggedIn(false);
      navigate('/auth')
  }

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);


  useEffect(() => {
    const interceptor = apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (isLoggedIn && error.response && error.response.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [logout, isLoggedIn]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};
