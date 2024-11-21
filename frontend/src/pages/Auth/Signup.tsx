// React
import { useEffect } from 'react';
// Hooks
import useSignup from '../../hooks/auth/useSignup';
// Styles
import css from './AuthForm.module.css';
// Icons
import UserIcon from "../../assets/userIcon.svg";
import EmailIcon from "../../assets/emailIcon.svg";
import PassIcon from "../../assets/passIcon.svg";
import { useLoadingBar } from '../../contexts/LoadingBarContext';



interface SignupFormData {
  username: string;
  email: string;
  password: string;
  password2: string;
}

const Signup = ({setIslogin, onSetAuthStat}) => {

  const { register, handleSubmit, errors, mutation, reset, setError} = useSignup();
  const loadingBarRef = useLoadingBar();

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
        console.log(err?.username);
        err?.username && setError("username", {type: '', message: err?.username}, {shouldFocus:true})
        err?.email && setError("email", {type: '', message: err?.email}, {shouldFocus:true})
        err?.password && setError("password", {type: '', message: err?.password}, {shouldFocus:true})
     }
   }, [mutation.isError, mutation.error])

    useEffect(() => {
    return () => {
      loadingBarRef.current?.complete();
    }
  }, [mutation.isError])


   const handleSignup = (data: SignupFormData, event: any) => {
      event.preventDefault();
      loadingBarRef.current?.continuousStart();
      mutation.mutate(data);
   };

  return (
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
  );
};

export default Signup