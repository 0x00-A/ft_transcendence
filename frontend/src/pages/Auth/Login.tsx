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
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { QueryClient, QueryClientProvider, useMutation } from '@tanstack/react-query';
import { log } from 'console';

import { useNavigate } from 'react-router-dom';

import useLogin from './hooks/useLogin';
import { redirect } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormData {
  username: string;
  password: string;
}

const Login = ({}) => {

  // const navigate = useNavigate();
  const { register, handleSubmit, reset} = useForm<LoginFormData>();

  const loginMutation = useLogin();

  const handleLogin = (data: LoginFormData) => {
    loginMutation.mutate(data);
    // reset();
  };

  // const { setIsLoggedIn } = useAuth()

// if (loginMutation.isSuccess)
//     alert('login success!')
//     setIsLoggedIn(true)
//     // navigate('/')
//   if (loginMutation.isError)
//     console.log('--------ERROR--------', loginMutation.error);

  return (
    <>
      <AuthHeader title="Welcome back" description=""/>
        <form className={css.entryArea} onSubmit={handleSubmit(handleLogin)}>
          <div className={css.inputContainer}>
            <img src={UserIcon} alt="X" />
            <input type="text" required placeholder="username" {...register('username')}/>
          </div>
          <div className={css.inputContainer}>
            <img src={PassIcon} alt="X" />
            <input type="password" required placeholder="password" {...register('password')}/>
          </div>
          <button type="submit" className={css.authBtn}>
            Sign in
          </button>
        <ExternAuth />
        </form>
    </>
  )
}

export default Login
