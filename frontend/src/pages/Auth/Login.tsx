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
import { useMutation, useQuery } from 'react-query';
import { log } from 'console';

interface LoginUser {
  username: string;
  password: string;
}

const Login = () => {

  const { register, handleSubmit} = useForm();

  const mutation = useMutation({
    mutationFn: (user: LoginUser) =>
      axios
        .post("http://localhost:8000/api/accounts/login/", user)
        .then(res => console.log(res.data))
  });

  const onSubmit = (data: any, event:any) => {
    console.log(data);
    event.preventDefault();
    mutation.mutate(data);
  };

  return (
    <>
      <AuthHeader title="Welcome back" description=""/>
        <form className={css.entryArea} onSubmit={handleSubmit(onSubmit)}>
          <div className={css.inputContainer}>
            <img src={UserIcon} alt="X" />
            <input type="text" required placeholder="username" {...register('username')}/>
          </div>
          <div className={css.inputContainer}>
            <img src={PassIcon} alt="X" />
            <input type="password" required placeholder="password" {...register('password')}/>
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
