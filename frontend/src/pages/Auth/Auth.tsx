import { useState } from 'react';
import css from './Auth.module.css';

// compenonets
import Signup from './Signup';
import Login from './Login';
import PongBox from './components/PongBox/PongBox';
import { UseMutationResult } from 'react-query';
import { set } from 'react-hook-form';
import { redirect } from 'react-router-dom';
import useSignup from './hooks/useSignup';
import useLogin from './hooks/useLogin';
import { useAuth } from '../../contexts/AuthContext';


// interface AuthState {
//   isSuccess: boolean;
//   isFailed: boolean;
//   message: string[];
//   error: string[];
// }


const Auth = () => {
    const [isLogin, setIslogin] = useState(true);
    const [authStat, setAuthStat] = useState<string | null>(null);

    return (
      <div className={css.container}>
        {authStat && <div className={css.notification}>{authStat}</div>}
        <div className={`${css.imgBox} ${isLogin ? css.switchImgBox : ''}`}>
          <PongBox />
          <div className={css.authFooter}>
            <p>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </p>
            <button
              onClick={() => {
                setIslogin(!isLogin);
              }}
            >
              {isLogin ? 'Signup' : 'Login'}
            </button>
          </div>
        </div>
        <div className={`${css.authBox} ${isLogin ? css.authSwitch : ''}`}>
          {/* {authState ? <Login setAuthResponse={setAuthResponse} /> : <Signup setAuthState={setAuthState} setAuthResponse={setAuthResponse} />} */}
          {isLogin ? (
            <Login />
          ) : (
            <Signup setIslogin={setIslogin} onSetAuthStat={setAuthStat} />
          )}
        </div>
        {/* { authResponse?.isSuccess && <span className={css.authSuccess}>{authResponse.message}</span> }
        { authResponse?.isFailed && <span className={css.authError}>{authResponse?.error}</span> } */}
      </div>
    );
}

export default Auth
