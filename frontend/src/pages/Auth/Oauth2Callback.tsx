// React
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// Contexts
import { useAuth } from '../../contexts/AuthContext';
// Hooks
import useOauth2Username from '../../hooks/auth/useOauth2Username';
// Styles
import authCss from './Auth.module.css';
import css from './Oauth2Callback.module.css';
import UserIcon from "../../assets/userIcon.svg";


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
            <div className={authCss.inputContainer}>
              <img src={UserIcon} alt="X" />
              <input type="text" placeholder="username" {...register('username')} />
              {errors.username && <span className={authCss.fieldError}>{errors.username.message}</span>}
            </div>
            <button type="submit" className={authCss.authBtn}>
              Submit
            </button>
          </form>
        }
    </div>
  )
}

export default Oauth2Callback
