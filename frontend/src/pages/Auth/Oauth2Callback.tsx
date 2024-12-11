// React
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
// Contexts
import { useAuth } from '../../contexts/AuthContext';
// Hooks
import useOauth2Username from '../../hooks/auth/useOauth2Username';
// Styles
import css from './Oauth2Callback.module.css';
import { FaRegUser } from "react-icons/fa";
import { toast } from 'react-toastify';
import { UsernameFormData } from '../../types/apiTypes';



const Oauth2Callback = () => {

    const navigate = useNavigate()
    const [isUsernameForm, setUsernameForm] = useState(false);
    const [formStatus, setFormStatus] = useState<string>('')
    const {setIsLoggedIn} = useAuth();

    const {register, handleSubmit, errors, mutation, reset} = useOauth2Username()

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const status = params.get('status')
        if (status && status === 'success') {
          toast.success('Login successful, welcome!');
          setIsLoggedIn(true);
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
          const error = params.get('error')
          if (status === 'failed' && error) {
            toast.error(error);
          } else {
            toast.error('Something went wrong, please try again');
          }
          navigate('/auth')
        }
    }, [navigate]);

    useEffect(() => {
     if (mutation.isSuccess) {
        reset();
        toast.success('Username set successfully, welcome!');
        setIsLoggedIn(true);
        navigate('/');
     }
   }, [mutation.isSuccess]);
   useEffect(() => {
      if (errors.root) {
        toast.error(errors.root.message);
      }
   }, [mutation.isError]);

    const handleClick = (username: UsernameFormData) => {
      mutation.mutate(username);
    }

  return (
    <div className={css.oauth2Container}>
        { isUsernameForm &&
          <form noValidate={true} className={css.usernameForm} onSubmit={ handleSubmit(handleClick) }>
            <div className={css.usernameFormHeader}>
              <h1>{formStatus}</h1>
            </div>
            <p>Select new username and continue</p>
            <div className={css.inputContainer}>
              <FaRegUser className={css.userIcon} />
              <input type="text" placeholder="username" {...register('username')} />
            </div>
            {errors.username && <span className={css.fieldError}>{errors.username.message}</span>}
            <button type="submit" className={css.submitBtn}>
              Submit
            </button>
            {/* {errors.root && <span className={css.fieldError}>{errors.root.message}</span>} */}
          </form>
        }
    </div>
  )
}

export default Oauth2Callback
