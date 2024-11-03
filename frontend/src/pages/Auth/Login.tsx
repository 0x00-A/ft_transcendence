import AuthHeader from './components/AuthHeader';
import UserIcon from "./assets/userIcon.svg";
import PassIcon from "./assets/passIcon.svg";
import ExternAuth from './components/ExternAuth';
import css from './AuthForm.module.css';
import { useNavigate } from 'react-router-dom';
import useLogin from './hooks/useLogin';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect } from 'react';

interface LoginFormData {
  username: string;
  password: string;
}

const Login = ({onSetAuthStat}) => {

  const {register, handleSubmit, errors, mutation, reset} = useLogin();
  const navigate = useNavigate()
  const {setIsLoggedIn} = useAuth()

  useEffect(() => {
    if (mutation.isSuccess) {
      reset();
      console.log(mutation.data.message);
      setIsLoggedIn(true);
      navigate('/');
      onSetAuthStat(mutation.data.message);
      setTimeout(() => onSetAuthStat(null), 5000)
    }
  }, [mutation.isSuccess])


  const handleLogin = (data: LoginFormData) => {
    mutation.mutate(data);
  };

  return (
    <>
      <AuthHeader title="Welcome back" description=""/>
        <form className={css.entryArea} onSubmit={ handleSubmit(handleLogin) }>
          <div className={css.inputContainer}>
            <img src={UserIcon} alt="X" />
            <input type="text" required placeholder="username" {...register('username')}/>
            {errors.username && <span className={css.fieldError}>{errors.username.message}</span>}
          </div>
          <div className={css.inputContainer}>
            <img src={PassIcon} alt="X" />
            <input type="password" required placeholder="password" {...register('password')}/>
            {errors.password && <span className={css.fieldError}>{errors.password.message}</span>}
          </div>
          {errors.root && <span className={css.loginError}>{errors.root.message}</span>}
          <p>Forgot password?</p>
          <button type="submit" className={css.authBtn}>
            Sign in
          </button>
        </form>
        <ExternAuth />
    </>
  )
}

export default Login
