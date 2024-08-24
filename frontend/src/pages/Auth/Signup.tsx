import css from './Signup.module.css';


// Components
import AuthHeader from "./components/AuthHeader";
import AuthInput from './components/AuthInput';
import AuthButton from './components/AuthButton';
import ExternAuth from './components/ExternAuth';
import UserIcon from "./assets/userIcon.svg";
import EmailIcon from "./assets/emailIcon.svg";
import PassIcon from "./assets/passIcon.svg";


const Signup = () => {

  return (
    <>
        <AuthHeader
          title="Welcome"
          description="Create you account and enjoy the game"
        />
        <form className={css.entryArea}>
          <AuthInput type="text" pHolder="username" icon={UserIcon} />
          <AuthInput type="email" pHolder="email" icon={EmailIcon} />
          <AuthInput type="password" pHolder="password" icon={PassIcon} />
          <AuthButton className={css.authBtn}>Signup</AuthButton>
        </form>
        <ExternAuth />
      </>
  ); 
}
export default Signup
