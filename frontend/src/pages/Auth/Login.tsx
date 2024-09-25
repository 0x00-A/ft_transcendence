// import css from './Login.module.css';
// import authCss from './Signup.module.css';
import AuthHeader from './components/AuthHeader';
// import AuthInput from './components/AuthInput';
// import AuthButton from './components/AuthButton';
import UserIcon from "./assets/userIcon.svg";
import PassIcon from "./assets/passIcon.svg";
import ExternAuth from './components/ExternAuth';
import AuthFooter from './components/AuthFooter';
import { FormEvent } from 'react';
import css from './AuthForm.module.css';

const Login = () => {

  return (
    <>
      <AuthHeader title="Welcome back" description=""/>
        <form className={css.entryArea}>
          <div className={css.inputContainer}>
            <img src={UserIcon} alt="X" />
            <input type="text" required placeholder="username"/>
            {/* {...register('username', { required: true, minLength: 3 })} */}
          </div>
          <div className={css.inputContainer}>
            <img src={PassIcon} alt="X" />
            <input type="password" required placeholder="password"/>
            {/* {...register('password')} */}
          </div>
          <button type="submit" className={css.authBtn}>
            Signin
          </button>
        <ExternAuth />
        </form>
    </>
  )
}

export default Login
