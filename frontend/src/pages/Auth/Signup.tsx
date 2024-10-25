import css from './AuthForm.module.css';

// Components
import AuthHeader from "./components/AuthHeader";
import ExternAuth from './components/ExternAuth';
import UserIcon from "./assets/userIcon.svg";
import EmailIcon from "./assets/emailIcon.svg";
import PassIcon from "./assets/passIcon.svg";
import { FieldValues, useForm } from "react-hook-form";
import { Mutation, UseMutationResult, isError, useMutation, useQuery } from 'react-query';
import axios from 'axios';
import { FormEvent, useState } from 'react';
import { log } from 'console';
import ProfilePopup from '../Profile/components/ProfilePopup';
import AuthPopup from './components/AuthPopup';


import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';


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

const addNewUser = async (data: SignupFormData) => {
  const response = await axios.post("http://localhost:8000/api/accounts/signup/", data)
  return response.data;
}

const Signup = ({setAuthState}:{setAuthState:React.Dispatch<React.SetStateAction<boolean>>}) => {

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<SignupFormData>({resolver: yupResolver(schema)});

  const mutation = useMutation({
    mutationFn: addNewUser,
    onSuccess(data) {
      setAuthState(true);
      console.log(data);
    },
    onError(error) {
      console.log('error');
      console.log(error?.message);
      console.log(error?.response?.data);
    }
  });

  const handleSignup = (data: SignupFormData, event:any) => {
    // console.log(data);
    event.preventDefault() ;
    mutation.mutate(data);

    // setAuthResponse(mutation);
  };

  return (
    <>
      <AuthHeader title="Welcome" description="Create you account and enjoy the game"/>
      <form noValidate={true} className={css.entryArea} onSubmit={ handleSubmit(handleSignup) }>
        <div className={css.inputContainer}>
          <img src={UserIcon} alt="X" />
          <input type="text" placeholder="username" {...register('username')}/>
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
          Signup
        </button>
      </form>
      <ExternAuth />
    </>
  );
};

export default Signup
function JoiResolver(schema: any): import("react-hook-form").Resolver<FormData, any> | undefined {
  throw new Error('Function not implemented.');
}

