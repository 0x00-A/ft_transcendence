import css from './AuthForm.module.css';

// Components
import AuthHeader from "./components/AuthHeader";
import ExternAuth from './components/ExternAuth';
import UserIcon from "./assets/userIcon.svg";
import EmailIcon from "./assets/emailIcon.svg";
import PassIcon from "./assets/passIcon.svg";
// import { FieldValues, set, useForm } from "react-hook-form";
// import { Mutation, UseMutationResult, isError, useMutation, useQuery } from '@tanstack/react-query';
// import axios from 'axios';
// import { FormEvent, useEffect, useRef, useState } from 'react';
// import { error, log } from 'console';
// import ProfilePopup from '../Profile/components/ProfilePopup';
// import AuthPopup from './components/AuthPopup';

import useSignup from './hooks/useSignup';
import { useEffect } from 'react';


interface SignupFormData {
  username: string;
  email: string;
  password: string;
  password2: string;
}

const Signup = ({setIslogin, onSetAuthStat}) => {

  const { register, handleSubmit, errors, mutation, reset, setError} = useSignup();

   useEffect(() => {
     if (mutation.isSuccess) {
        reset();
        setIslogin(true);
        onSetAuthStat(
          mutation.data.message
        );
        setTimeout(() => {
          onSetAuthStat(null);
        }, 5000);
     }
   }, [mutation.isSuccess, setIslogin]);

   useEffect(() => {
     if (mutation.isError) {
        const err = mutation.error?.response.data as SignupFormData;
        err?.username && setError("username", {type: '', message: err?.username}, {shouldFocus:true})
        err?.email && setError("email", {type: '', message: err?.email}, {shouldFocus:true})
        err?.password && setError("password", {type: '', message: err?.password}, {shouldFocus:true})
     }
   }, [mutation.isError, mutation.error])

   const handleSignup = (data: SignupFormData, event: any) => {
     event.preventDefault();
     mutation.mutate(data);
   };

  return (
    <>
      <AuthHeader title="Welcome" description="Create you account and enjoy the game"/>
      <form noValidate={true} className={css.entryArea} onSubmit={ handleSubmit(handleSignup) }>
        <div className={css.inputContainer}>
          <img src={UserIcon} alt="X" />
          <input type="text" placeholder="username" {...register('username')} />
          {errors.username && <span className={css.fieldError}>{errors.username.message}</span>}
        </div>
        <div className={css.inputContainer}>
          <img src={EmailIcon} alt="X" />
          <input type="email" placeholder="email" {...register('email')}/>
          {errors.email && <span className={css.fieldError}>{errors.email.message}</span>}
        </div>
        <div className={css.inputContainer}>
          <img src={PassIcon} alt="X" />
          <input type="password" required placeholder="password" {...register('password')}/>
          {errors.password && <span className={css.fieldError}>{errors.password.message}</span>}
        </div>
        <div className={css.inputContainer}>
          <img src={PassIcon} alt="X" />
          <input type="password" required placeholder="password confirmation" {...register('password2')}/>
          {errors.password2 && <span className={css.fieldError}>{errors.password2.message}</span>}
        </div>
        <button type="submit" className={css.authBtn}>
          Sign up
        </button>
      </form>
      <ExternAuth />
    </>
  );
};

export default Signup