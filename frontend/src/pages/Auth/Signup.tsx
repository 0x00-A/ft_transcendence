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


const Signup = () => {
  return (
    <div className={css.boxContainer}>
      <AuthHeader title='Welcome' description='Create you account and enjoy the game' />
      <EntryArea />
      <ExternAuth />
      <AuthFooter status='Already have an account?'/>
    </div>
  )
}
export default Signup
