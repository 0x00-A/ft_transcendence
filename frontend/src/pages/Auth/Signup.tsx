import css from './AuthForm.module.css';

// Components
import AuthHeader from "./components/AuthHeader";
import ExternAuth from './components/ExternAuth';
import UserIcon from "./assets/userIcon.svg";
import EmailIcon from "./assets/emailIcon.svg";
import PassIcon from "./assets/passIcon.svg";
import { FieldValues, useForm } from "react-hook-form";
import { Mutation, useMutation, useQuery } from 'react-query';
import axios from 'axios';
import { FormEvent } from 'react';

interface FormData {
  username: string;
  email: string;
  password: string;
  passwordConf: string;
}

const Signup = () => {

  const {
    register,
    handleSubmit,
    // formState: { errors, isValid },
  } = useForm<FormData>();

  // const createUser = async (data: FormData) => {
  //   const {data: response} = await
  //   axios
  //     .post("http://localhost:8000/accounts/signup/", {data})
  //   return response.data;
  // };

  // const { data: user, error } = useQuery({
  //   queryKey: ['user'],
  //   queryFn: createUser
  // })
  // const mutation = useMutation<FormData>((data) => {
  //   axios.post("http://localhost:8000/accounts/signup/", data).
  // })

  const addUser = useMutation({
    mutationFn: (user: FormData) =>
      axios
        .post("http://localhost:8000/accounts/signup/", {user})
        .then(res => res.data)
  });

  const onSubmit = (data: FormData, event:any) => {
    console.log(data);
    event.preventDefault();
    addUser.mutate(data);
  };

  return (
    <>
      <AuthHeader title="Welcome" description="Create you account and enjoy the game"/>
      <form className={css.entryArea} onSubmit={ handleSubmit(onSubmit) }>
        <div className={css.inputContainer}>
          <img src={UserIcon} alt="X" />
          <input type="text" required placeholder="username" {...register('username')}/>
            {/* {...register('username', { required: true, minLength: 3 })} */}
        </div>
        <div className={css.inputContainer}>
          <img src={EmailIcon} alt="X" />
          <input type="email" required placeholder="email" {...register('email')}/>
        </div>
        {/* <AuthInput type="password" pHolder="password" icon={PassIcon} /> */}
        <div className={css.inputContainer}>
          <img src={PassIcon} alt="X" />
          <input type="password" required placeholder="password" {...register('password')}/>
            {/* {...register('password')} */}
        </div>
        <div className={css.inputContainer}>
          <img src={PassIcon} alt="X" />
          <input type="password" required placeholder="password confirmation" {...register('passwordConf')}/>
            {/* {...register('password')} */}
        </div>
        {/* <AuthButton className={css.authBtn}>Signup</AuthButton> */}
        <button type="submit" className={css.authBtn}>
          Signup
        </button>
      </form>
      <ExternAuth />
    </>
  );
};
export default Signup
