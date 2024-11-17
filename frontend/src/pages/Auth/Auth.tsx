//React
import { useState } from 'react';
// Styles
import css from './Auth.module.css';
// Components
import AuthPongBox from '../../components/Auth/AuthPongBox';
import Login from './Login';
import Signup from './Signup';
import Oauth2 from '../../components/Auth/Oauth2';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';



const Auth = () => {
    const [isLogin, setIslogin] = useState(true);
    const [authStat, setAuthStat] = useState<string | null>(null);
    const {isLoggedIn, isLoading} = useAuth();

    // if (isLoading) {
    //   return <p>Loadding...</p>;
    // }
    if (isLoggedIn) {
      return <Navigate to={'/'}/>
    }

    return (
      <div className={css.authContainer}>
        {authStat && <div className={css.authStat}>{authStat}</div>}
        <AuthPongBox isLogin={isLogin} setIslogin={setIslogin}/>
        <div className={`${css.authFormBox} ${isLogin ? css.authFormSwitch : ''}`}>
          <div className={css.authFormHeader}>
            <h1>{isLogin ? "Welcome back" : "Welcome"}</h1>
            <p>{isLogin ? "" : "Create you account and enjoy the game"}</p>
           </div>
          { isLogin ?
              <Login onSetAuthStat={setAuthStat} /> :
              <Signup setIslogin={setIslogin} onSetAuthStat={setAuthStat} />
          }
          <Oauth2 />
        </div>
      </div>
    );
}

export default Auth
