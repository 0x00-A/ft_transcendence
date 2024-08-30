import { useState } from 'react';
import css from './Auth.module.css';

// compenonets
import Signup from './Signup';
import Login from './Login';
import PongBox from './components/PongBox/PongBox';


const Auth = () => {
    const [authState, setAuthState] = useState(false);

    return (
      <div className={css.container}>
        {/* <div className={`${css.imgBox} ${authState ? css.switchImgBox : ''}`}>
          <div className={css.authFooter}>
            <p>{authState ? "Don't have an account?" : "Already have an account?"}</p>
            <button onClick={() => {setAuthState(!authState)}}>{authState ? "Signup" : "Login"}</button>
          </div>
        </div> */}
        <div className={`${css.imgBox} ${authState ? css.switchImgBox : ''}`}>
          <PongBox />
          <div className={css.authFooter}>
            <p>
              {authState
                ? "Don't have an account?"
                : 'Already have an account?'}
            </p>
            <button
              onClick={() => {
                setAuthState(!authState);
              }}
            >
              {authState ? 'Signup' : 'Login'}
            </button>
          </div>
        </div>
        <div className={`${css.authBox} ${authState ? css.authSwitch : ''}`}>
          {authState ? <Login /> : <Signup />}
        </div>
      </div>
    );
}

export default Auth
