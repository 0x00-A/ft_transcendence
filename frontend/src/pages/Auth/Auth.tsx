import { useState } from 'react';
import css from './Auth.module.css';

// compenonets
import Signup from './Signup';
import Login from './Login';
import PongBox from './components/PongBox/PongBox';
import { UseMutationResult } from 'react-query';
import { set } from 'react-hook-form';
import { redirect } from 'react-router-dom';


interface AuthState {
  isSuccess: boolean;
  isFailed: boolean;
  message: string[];
  error: string[];
}

const Auth = () => {
    const [authState, setAuthState] = useState(false);
    // const [authResponse, setAuthResponse] = useState<AuthState>();

    // console.log(authResponse);
    // if (authResponse?.isSuccess) {
    //   redirect('/profile');
    // }

    return (
      <div className={css.container}>
        <div className={`${css.imgBox} ${authState ? css.switchImgBox : ''}`}>
          <PongBox />
          <div className={css.authFooter}>
            <p>{authState ? "Don't have an account?" : 'Already have an account?'}</p>
            <button onClick={() => { setAuthState(!authState); }}>
              {authState ? 'Signup' : 'Login'}
            </button>
          </div>
        </div>
        <div className={`${css.authBox} ${authState ? css.authSwitch : ''}`}>
          {/* {authState ? <Login setAuthResponse={setAuthResponse} /> : <Signup setAuthState={setAuthState} setAuthResponse={setAuthResponse} />} */}
          {authState ? <Login /> : <Signup />}
        </div>
        {/* { authResponse?.isSuccess && <span className={css.authSuccess}>{authResponse.message}</span> }
        { authResponse?.isFailed && <span className={css.authError}>{authResponse?.error}</span> } */}
      </div>
    );
}

export default Auth
