import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import css from './Oauth2Callback.module.css';
import authcss from './AuthForm.module.css';
import { useForm } from 'react-hook-form';
import UserIcon from "./assets/userIcon.svg";
import useOauth2Username from './useOauth2Username';

interface UsernameFormData {
  username: string;
}

const Oauth2Callback = () => {

    const navigate = useNavigate()
    const { setIsLoggedIn } = useAuth()
    const [isUsernameForm, setUsernameForm] = useState(false);
    const [formStatus, setFormStatus] = useState<string>('')

    const {register, handleSubmit, errors, mutation, reset, setError} = useOauth2Username()


    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const status = params.get('status')
        if (status === 'success') {
          // confirm login
          axios.get('http://localhost:8000/api/oauth2/verify_login', { withCredentials: true })
          .then(response => {
            if (response.status === 200) {
              navigate('/');
              setIsLoggedIn(true);
            }
          })
          .catch(() => navigate('/auth'));
        }
        else if (status === 'set_username') {
          const status = params.get('message') as string;
          setFormStatus(status)
          setUsernameForm(true)
        }
        else {
          navigate('/auth')
        }
    }, [navigate]);

    useEffect(() => {
     if (mutation.isSuccess) {
        reset();
        setIsLoggedIn(true);
        navigate('/');
        // setIslogin(true);
        // onSetAuthStat(
        //   mutation.data.message
        // );
        // setTimeout(() => {
        //   onSetAuthStat(null);
        // }, 5000);
     }
   }, [mutation.isSuccess]);

   useEffect(() => {
     if (mutation.isError) {
        const err = mutation.error?.response.data as UsernameFormData;
        err?.username && setError("username", {type: '', message: err?.username}, {shouldFocus:true})
     }
   }, [mutation.isError, mutation.error])

    const handleClick = (data:UsernameFormData) => {
      mutation.mutate(data);
    }

  return (
    <div className={css.oauth2Container}>
        {isUsernameForm &&
          <form noValidate={true} className={css.usernameForm} onSubmit={ handleSubmit(handleClick) }>
            <h2>{formStatus}</h2>
            <div className={authcss.inputContainer}>
              <img src={UserIcon} alt="X" />
              <input type="text" placeholder="username" {...register('username')} />
              {errors.username && <span className={authcss.fieldError}>{errors.username.message}</span>}
            </div>
            <button type="submit" className={authcss.authBtn}>
              Submit
            </button>
          </form>
        }
    </div>
  )
}

export default Oauth2Callback
