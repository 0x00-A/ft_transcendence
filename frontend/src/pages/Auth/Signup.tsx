import React from 'react'
import ReactDOM from 'react-dom/client';
import css from './Signup.module.css'
import UserIcon from '../../../public/icons/login/bx-user.svg';

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
              <img src={UserIcon} alt="" />
              <input type="text" name="" id="" placeholder='username'/>
              <input type="text" placeholder='email' />
              <input type="text" placeholder='password' />
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Signup
