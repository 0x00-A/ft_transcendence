// Styles
import css from './AuthPongBox.module.css';

const AuthPongBox = ({isLogin, setIslogin}) => {
  return (
    <div className={`${css.authPongBox} ${isLogin ? css.switchPongBox : ''}`}>
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
