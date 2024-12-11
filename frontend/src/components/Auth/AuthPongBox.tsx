// Styles
import css from './AuthPongBox.module.css';
import { LOGO } from '@/config/constants';

const AuthPongBox = ({isLogin, setIslogin}: {isLogin: boolean, setIslogin: React.Dispatch<React.SetStateAction<boolean>>}) => {
  return (
    <div className={`${css.authPongBox} ${isLogin ? css.switchPongBox : ''}`}>
      <div className={css.logoHolder}>
        <img src={LOGO} alt="" />
      </div>
      <div className={css.pong}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className={css.authFooter}>
        <p>{isLogin ? "Don't have an account?" : 'Already have an account?'}</p>
        <button onClick={() => { setIslogin(!isLogin);}}>
          {isLogin ? 'Signup' : 'Login'}
        </button>
      </div>
    </div>
  )
}

export default AuthPongBox
