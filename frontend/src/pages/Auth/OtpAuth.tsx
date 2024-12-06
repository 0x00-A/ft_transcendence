import { useState } from 'react';
import css from './OtpAuth.module.css'
import apiClient from '@/api/apiClient';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_LOGIN_OTP_URL } from '@/api/apiConfig';



const OtpAuth = ({setOtpRequired, username}: {setOtpRequired:React.Dispatch<React.SetStateAction<boolean>>, username:string}) => {
  const [otp, setOtp] = useState('');
  const { setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log('otp: ', otp);
    try {
        const response = await apiClient.post(API_LOGIN_OTP_URL, {otp: otp, username: username});
        toast.success(response.data.message);
        setOtpRequired(false);
        setIsLoggedIn(true);
        navigate('/');
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error?.response?.data.error);
        }
        else {
          toast.error('Something went wrong!');
        }
    }
  }

  return (
    <form action="" className={css.otpForm} onSubmit={handleVerifyOtp}>
      <h1>2FA Required</h1>
      <p>Enter the opt in your application google authenticator</p>
      <div className={css.fieldContainer}>
        <label htmlFor="" className={css.label}>Enter the Otp</label>
        <input type="text" className={css.input} placeholder="Enter otp" onChange={(e) => setOtp(e.target.value)} />
      </div>
      <button type='submit' className={css.submitBtn}>Submit</button>
      {/* <p>didn't recieve code? </p>
      <button>Resend</button> */}
    </form>
  )
}

export default OtpAuth
