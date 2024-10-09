import { useState } from 'react';
import css from './Auth.module.css';

// compenonets
import Signup from './Signup';
import Login from './Login';
import PongBox from './components/PongBox/PongBox';
import { UseMutationResult } from 'react-query';


const Auth = () => {
    const [authState, setAuthState] = useState(false);
    // const [authResponse, setAuthResponse] = useState<UseMutationResult<any, unknown, FormData, unknown>>();

    return (
      <div className={css.container}>
        <div className={`${css.imgBox} ${authState ? css.switchImgBox : ''}`}>
          {/* {authResponse?.isSuccess && <p>{authResponse.data.message}</p>}
          {authResponse?.isError && <p>{authResponse.error}</p>} */}
          <PongBox />
          <div className={css.authFooter}>
            <p>{authState ? "Don't have an account?" : 'Already have an account?'}</p>
            <button onClick={() => { setAuthState(!authState); }}>
              {authState ? 'Signup' : 'Login'}
            </button>
          </div>
        </div>
        <div className={`${css.authBox} ${authState ? css.authSwitch : ''}`}>
          {authState ? <Login /> : <Signup setAuthState={setAuthState} />}
        </div>
      </div>
    );
}

export default Auth
