import React from 'react'
import ReactDOM from 'react-dom/client';
import css from './Signup.module.css'
import UserIcon from '../../../public/icons/login/bx-user.svg';
import { FaRegUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa6";
import { FaEnvelope } from "react-icons/fa";

const Signup = () => {
  return (
    <>
      <div className={css.modal}>
        <div className={css.imageBox}></div>

        <div className={css.formBox}>
          <form action="">
            <div className={css.welcome}>
              <h1>Welcome</h1>
              <p>create your account and enjoy the game</p>
            </div>
            <div className={css.inputs}>
              <FaRegUser color='#f8f3e3' className={css.icons}/>
              <input type="text" name="" id="" placeholder='username'/>
              <FaEnvelope color='#f8f3e3' className={css.icons}/>
              <input type="text" placeholder='email' />
              <FaLock color='#f8f3e3' className='icons'/>
              <input type="text" placeholder='password' />
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Signup
