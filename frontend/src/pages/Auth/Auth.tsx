//React
import { useState } from 'react';
// Components
import AuthPongBox from '../../components/Auth/AuthPongBox';
import Login from './Login';
import Signup from './Signup';

import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
// Styles
import css from './Auth.module.css';


const Auth = () => {
    const [isLogin, setIslogin] = useState(true);
    const {isLoggedIn, isLoading} = useAuth();

    if (isLoading) {
      return <p>Loadding...</p>;
    }
    if (isLoggedIn) {
      return <Navigate to={'/'}/>
    }

    return (
      <div className={css.authContainer}>
        <AuthPongBox isLogin={isLogin} setIslogin={setIslogin}/>
          <div className={`${css.authFormBox} ${isLogin ? css.authFormSwitch : ''}`}>
            {isLogin ? <Login /> : <Signup setIslogin={setIslogin} /> }
          </div>
      </div>
    );
}

export default Auth
