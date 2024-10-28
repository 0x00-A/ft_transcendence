import css from './AuthForm.module.css';

// Components
import AuthHeader from "./components/AuthHeader";
import ExternAuth from './components/ExternAuth';
import UserIcon from "./assets/userIcon.svg";
import EmailIcon from "./assets/emailIcon.svg";
import PassIcon from "./assets/passIcon.svg";
import { FieldValues, set, useForm } from "react-hook-form";
import { Mutation, UseMutationResult, isError, useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { error, log } from 'console';
import ProfilePopup from '../Profile/components/ProfilePopup';
import AuthPopup from './components/AuthPopup';

import useSignup from './hooks/useSignup';


import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { redirect } from 'react-router-dom';


const schema = yup.object().shape({

  username: yup.string()
    .required('username is required!')
    .min(4, 'username must be at least 3 characters!')
    .max(15, 'username must not exceed 15 characters!'),
  email: yup.string()
    .email('Invalid email format!')
    .required('Email is required!'),
  password: yup.string()
    .min(6, 'password must be at least 6 characters!')
    .required('password is required!'),
  password2: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('password confirmation is required!')
})


interface SignupFormData {
  username: string;
  email: string;
  password: string;
  password2: string;
}

const Signup = ({signupMutation}) => {

   const { register, handleSubmit, formState: { errors }, reset} = useForm<SignupFormData>({
     resolver: yupResolver(schema),
    //  delayError: 1000,
   });

  //  const signupMutation = useSignup()
  //  const { mutation, isLoading, error } = useSignup()
  //  if (signupMutation.isSuccess)
    // reset();
  // if (signupMutation.isError)
  //   console.log('---------Error---------', signupMutation.error)

   const handleSignup = (data: SignupFormData, event: any) => {
     event.preventDefault();
     signupMutation.mutate(data);
     reset();
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
      {/* {mutation.error && <span className={css.signupState}>{mutation.error.message}</span>} */}
    </>
  );
};

export default Signup
function JoiResolver(schema: any): import("react-hook-form").Resolver<FormData, any> | undefined {
  throw new Error('Function not implemented.');
}
