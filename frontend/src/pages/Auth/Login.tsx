// React
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
// Hooks
import useLogin from '../../hooks/auth/useLogin';
// Contexts
import { useAuth } from '../../contexts/AuthContext';
// Styles
import css from './AuthForm.module.css';
import { FaRegUser } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import { BiHide } from "react-icons/bi";
import { BiShow } from "react-icons/bi";
import { useLoadingBar } from '../../contexts/LoadingBarContext';
import { toast } from 'react-toastify';



interface LoginFormData {
  username: string;
  password: string;
}


const Login = () => {

  const {register, handleSubmit, errors, mutation, reset} = useLogin();
  const navigate = useNavigate()
  const {setIsLoggedIn} = useAuth()
  const loadingBarRef = useLoadingBar();
  const [showPassword, setShowPassword] = useState(false);


  useEffect(() => {
    if (mutation.isSuccess) {
      toast.success(mutation.data.data.message);
      reset();
      console.log('apiClient ==> Login response: ', mutation.data.data.message);
      setIsLoggedIn(true);
      navigate('/');
    }
  }, [mutation.isSuccess])

  useEffect(() => {
    if (errors.root) {
      toast.error(errors.root.message);
    }
    return () => {
      loadingBarRef.current?.complete();
    }
  }, [mutation.isError])


  const handleLogin = (data: LoginFormData) => {
    loadingBarRef.current?.continuousStart();
    mutation.mutate(data);
  };

  return (
      <form className={css.entryArea} onSubmit={ handleSubmit(handleLogin) }>
        <div className={css.inputContainer}>
          <FaRegUser className={css.inputIcon}/>
          <input type="text" required placeholder="username" {...register('username')}/>
          {errors.username && <span className={css.fieldError}>{errors.username.message}</span>}
        </div>
        <div className={css.inputContainer}>
          <MdLockOutline className={css.inputIcon} />
          <input type={showPassword ? "text" : "password"} required placeholder="password" {...register('password')}/>
          { showPassword ?  <BiShow className={css.showPassIcon} onClick={() => setShowPassword(!showPassword)}/> :
            <BiHide className={css.showPassIcon} onClick={() => setShowPassword(!showPassword)}/>}
          {errors.password && <span className={css.fieldError}>{errors.password.message}</span>}
        </div>
        {/* {errors.root && <span className={css.loginError}>{errors.root.message}</span>} */}
        <p>Forgot password?</p>
        <button type="submit" className={css.authBtn}>
          Sign in
        </button>
      </form>
  )
}

export default Login
