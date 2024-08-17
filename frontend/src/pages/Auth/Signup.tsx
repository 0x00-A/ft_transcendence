// import React from 'react'
// import ReactDOM from 'react-dom/client';
import css from './Signup.module.css';
// import Welcome from './components/welcome/Welcome';
// import { IconContext } from 'react-icons';
// import { FaRegUser } from "react-icons/fa";
// import { MdOutlineMail } from "react-icons/md";
// import { MdOutlineLock } from "react-icons/md";
// import { FcGoogle } from "react-icons/fc";

// Components
import AuthHeader from "./components/AuthHeader";
import EntryArea from "./components/EntryArea";
import ExternAuth from './components/ExternAuth';
import AuthFooter from './components/AuthFooter';
import AuthInput from './components/AuthInput';
import AuthButton from './components/AuthButton';
import UserIcon from "./assets/userIcon.svg";
import EmailIcon from "./assets/emailIcon.svg";
import PassIcon from "./assets/passIcon.svg";


const Signup = () => {
  return (
    <div className={css.container}>
      <div className={css.boxContainer}>
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
        <AuthFooter status="Already have an account?" />
      </div>
    </div>
  );
}
export default Signup
