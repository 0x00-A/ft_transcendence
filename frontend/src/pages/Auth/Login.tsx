import css from './Login.module.css';
import authCss from './Signup.module.css';
import AuthHeader from './components/AuthHeader';
import AuthInput from './components/AuthInput';
import AuthButton from './components/AuthButton';
import UserIcon from "./assets/userIcon.svg";
import PassIcon from "./assets/passIcon.svg";
import ExternAuth from './components/ExternAuth';
import AuthFooter from './components/AuthFooter';

const Login = () => {
  return (
    <>
        <AuthHeader
          title="Welcome back"
          description=""
        />
        <form className={authCss.entryArea}>
          <AuthInput type="text" pHolder="username" icon={UserIcon} />
          <AuthInput type="password" pHolder="password" icon={PassIcon} />
          <AuthButton className={authCss.authBtn}>Sign in</AuthButton>
        </form>
        <ExternAuth />
    </>
  )
}

export default Login
