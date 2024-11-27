// React
import { useEffect, useState } from 'react';
// Hooks
import useSignup from '../../hooks/auth/useSignup';
// Styles
import css from './AuthForm.module.css';
import { toast } from 'react-toastify';
// Icons
import { FaRegUser } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { MdLockOutline } from "react-icons/md";
import { BiHide } from "react-icons/bi";
import { BiShow } from "react-icons/bi";
// Contexts
import { useLoadingBar } from '../../contexts/LoadingBarContext';
// Types
import { SignupFormData } from '@/types/apiTypes';
import Oauth2 from '@/components/Auth/Oauth2';





const Signup = ({setIslogin}) => {

  const { register, handleSubmit, errors, mutation, reset, setError} = useSignup();
  const loadingBarRef = useLoadingBar();
  const [showPassword, setShowPassword] = useState({
        password: false,
        confirm_pass: false
  });

   useEffect(() => {
     if (mutation.isSuccess) {
        toast.success(mutation.data.message);
        reset();
        setIslogin(true);
        // setTimeout(() => {
        //   onSetAuthStat(null);
        // }, 5000);
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

   const togglePasswordVisibility = (field) => {
        setShowPassword((prevState) => ({
          ...prevState,
          [field]: !prevState[field],
        }));
    };

  //  <div><input type={ showPassword.confirm_pass ? "text" : "password"} className={css.input} {...register('confirm_password')}/>
  //   {showPassword.confirm_pass ?
  //     <BiShow className={css.showPassIcon} onClick={() => togglePasswordVisibility("confirm_password")}/> :
  //     <BiHide className={css.showPassIcon} onClick={() => togglePasswordVisibility("confirm_password")}/>
  //   }</div>

  return (
      <div className={css.loginContainer}>
        <div className={css.authFormHeader}>
            <h1>Welcome back</h1>
        </div>
        <form noValidate={true} className={css.entryArea} onSubmit={ handleSubmit(handleSignup) }>
          <div className={css.inputContainer}>
            <FaRegUser className={css.inputIcon}/>
            <input type="text" placeholder="username" {...register('username')} />
            {errors.username && <span className={css.fieldError}>{errors.username.message}</span>}
          </div>
          <div className={css.inputContainer}>
            <MdOutlineEmail className={css.inputIcon}/>
            <input type="email" placeholder="email" {...register('email')}/>
            {errors.email && <span className={css.fieldError}>{errors.email.message}</span>}
          </div>
          <div className={css.inputContainer}>
            <MdLockOutline className={css.inputIcon} />
            <input type={showPassword.password ? "text" : "password"} required placeholder="password" {...register('password')}/>
            { showPassword.password ?  <BiShow className={css.showPassIcon} onClick={() => togglePasswordVisibility("password")}/> :
              <BiHide className={css.showPassIcon} onClick={() => togglePasswordVisibility("password")}/>}
            {errors.password && <span className={css.fieldError}>{errors.password.message}</span>}
          </div>
          <div className={css.inputContainer}>
            <MdLockOutline className={css.inputIcon} />
            <input type={showPassword.confirm_pass ? "text" : "password"} required placeholder="password confirmation" {...register('password2')}/>
            { showPassword.confirm_pass ?  <BiShow className={css.showPassIcon} onClick={() => togglePasswordVisibility("confirm_pass")}/> :
              <BiHide className={css.showPassIcon} onClick={() => togglePasswordVisibility("confirm_pass")}/>}
            {errors.password2 && <span className={css.fieldError}>{errors.password2.message}</span>}
          </div>
          <button type="submit" className={css.authBtn}>
            Sign up
          </button>
        </form>
        <Oauth2 />
      </div>
  );
};

export default Signup
