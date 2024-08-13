import React from 'react'
import ReactDOM from 'react-dom/client';
import css from './Signup.module.css'
import Welcome from './components/welcome/Welcome';
import { FaRegUser } from "react-icons/fa";

const Input = ({type, label}) => {
  return (
    <div className={css.inputArea}>
      <input type={type} required placeholder={label}/>
      {/* <div className={css.label}>{label}</div> */}
    </div>
  )
}


const Signup = () => {
  return (
    <div className={css.boxContainer}>
      <Welcome />
      <div className={css.signupForm}>
        <div className={css.entryArea}>
          <FaRegUser className={css.userIcon}/>
          <Input type="text" label="Username"/>
          <Input type="email" label="Email"/>
          <Input type="password" label="Password"/>
        </div>
        <button>Signup</button>
        <p>Or Signup with</p>
        <button>Login with google</button>
        <button>Login with intra</button>
        <div>
          <p>Already have an account?</p>
          <button>Signin</button>
        </div>
      </div>
      {/* <div className={css.modal}>
        <div className={css.imageBox}></div>

        <div className={css.formBox}>
          <form action="">
            <div className={css.welcome}>
              <h1>Welcome</h1>
              <p>create your account and enjoy the game</p>
            </div>
            <div className={css.inputs}>
              <FaRegUser color='#f8f3e3' className={css.userIcon}/>
              <input type="text" name="" id="username" placeholder='username'/>
              <FaEnvelope color='#f8f3e3' className={css.emailIcon}/>
              <input type="text" id='email' placeholder='email' />
              <FaLock color='#f8f3e3' className={css.passIcon}/>
              <input type="text" id='password' placeholder='password' />
            </div>
          </form>
        </div>
      </div> */}
    </div>
  )
}

export default Signup
