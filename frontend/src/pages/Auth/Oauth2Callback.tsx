// React
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// Contexts
import { useAuth } from '../../contexts/AuthContext';
// Hooks
import useOauth2Username from '../../hooks/auth/useOauth2Username';
// Styles
import authCss from '@/pages/Auth/AuthForm.module.css';
import css from './Oauth2Callback.module.css';
import UserIcon from "../../assets/userIcon.svg";
import apiClient from '@/api/apiClient';


interface UsernameFormData {
  username: string;
}

const Oauth2Callback = () => {

    const navigate = useNavigate()
    const [isUsernameForm, setUsernameForm] = useState(false);
    const [formStatus, setFormStatus] = useState<string>('')
    const {setIsLoggedIn} = useAuth();

    const {register, handleSubmit, errors, mutation, reset} = useOauth2Username()


    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const status = params.get('status')
        if (status === 'success') {
          navigate('/');
          // apiClient.get('/oauth2/verify_login')
          // .then(response => {
          //   if (response.status === 200) {
          //     setIsLoggedIn(true);
          //     navigate('/');
          //   }
          // })
          // .catch(() => navigate('/auth'));
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
     }
   }, [mutation.isSuccess]);

    const handleClick = (data:UsernameFormData) => {
      mutation.mutate(data);
    }

  return (
    <div className={css.oauth2Container}>
        {isUsernameForm &&
          <form noValidate={true} className={css.usernameForm} onSubmit={ handleSubmit(handleClick) }>
            <div className={css.usernameFormHeader}>
              <h1>{formStatus}</h1>
            </div>
            <p>Select new username and continue</p>
            <div className={css.inputContainer}>
              <img src={UserIcon} alt="X" />
              <input type="text" placeholder="username" {...register('username')} />
              {errors.username && <span className={css.fieldError}>{errors.username.message}</span>}
            </div>
            <button type="submit" className={css.submitBtn}>
              Submit
            </button>
            {errors.root && <span className={css.fieldError}>{errors.root.message}</span>}
          </form>
        }
    </div>
  )
}

export default Oauth2Callback
