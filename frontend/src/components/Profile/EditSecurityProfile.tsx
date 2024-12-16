// React
import { useEffect, useState } from 'react'
import * as Yup from 'yup';
// Styles
import css from './EditSecurityProfile.module.css';
import { BiHide } from "react-icons/bi";
import { BiShow } from "react-icons/bi";
import { TbDeviceMobileMessage } from "react-icons/tb";
import { toast } from 'react-toastify';
// Hooks
import useChangePass from '@/hooks/profile/useChangePass';
import apiClient from '@/api/apiClient';
import { useUser } from '@/contexts/UserContext';
import axios from 'axios';
// Types
import { ChangePasswordForm } from '@/types/apiTypes';
import { API_DISABLE_2FA_URL, API_ENABLE_2FA_REQUEST_URL, API_ENABLE_2FA_URL } from '@/api/apiConfig';
import { otpSchema } from '@/types/formSchemas';

type ShowPasswordFields = 'current_pass' | 'new_pass' | 'confirm_pass' | 'pass2fa';

const EditSecurityProfile = ({setEditProfile}:{setEditProfile:React.Dispatch<React.SetStateAction<boolean>>}) => {

    const { register, handleSubmit, errors, mutation, reset } = useChangePass();
    const [qrcode, setQrcode] = useState(null);
    const [otp, setOtp] = useState<string | null>(null);
    const [errorOtp, setErrorOtp] = useState<string | null>(null);
    const [confiPass2fa, setConfirPass2fa] = useState<string | null>(null);
    const { user: profileData, isLoading, refetch } = useUser();

    if (isLoading) {
        return <div>Loading...</div>
    }

    const [showPassword, setShowPassword] = useState({
        current_pass: false,
        new_pass: false,
        confirm_pass: false,
        pass2fa: false,
    });

    const handleDisable2fa = async () => {
        try{
            const response = await apiClient.post(API_DISABLE_2FA_URL, {password: confiPass2fa})
            toast.success(response.data.message);
            setEditProfile(false);
            refetch();
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error?.response?.data?.error);
            } else {
                toast.error('An error occurred. Please try again later');
            }
        }
    }

    const handleEnable2fa = async () => {
        try {
            await otpSchema.validate({otp: otp});
        }
        catch (error) {
          if (error instanceof Yup.ValidationError) {
            setErrorOtp(error.message);
            return;
          } else {
            setErrorOtp('Error otp, try again!');
          }
        }
        try{
            const response = await apiClient.post(API_ENABLE_2FA_URL, {otp: otp})
            toast.success(response.data.message);
            setEditProfile(false);
            refetch();
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error?.response?.data?.error);
            } else {
                toast.error('An error occurred. Please try again later');
            }
        }
    }

    const handleGetQrcode = async () => {
        try {
            const response = await apiClient.post(API_ENABLE_2FA_REQUEST_URL, {})
            setQrcode(response.data.qr_code);
        }
        catch(error) {
            if (axios.isAxiosError(error)) {
                toast.error(error?.response?.data?.error);
            } else {
                toast.error('An error occurred. Please try again later');
            }
            setQrcode(null);
        }
    };

    const togglePasswordVisibility = (field: ShowPasswordFields) => {
        setShowPassword((prevState) => ({
          ...prevState,
          [field]: !prevState[field],
        }));
    };
    useEffect(() => {
        if (mutation.isSuccess) {
            toast.success(mutation.data?.data?.message);
            setEditProfile(false);
        }
   }, [mutation.isSuccess]);
   useEffect(() => {
        // if (mutation.isError) {
        //     toast.error(mutation.error.response.data.error);
        // }
   }), [mutation.isError];

    const handleChangePassword = (data: ChangePasswordForm) => {
        mutation.mutate(data);
    };

    return (
        <div className={css.securityContainer}>
            <div className={css.UpdatePassContainer}>
                <h1 className={css.title}>Change Password</h1>
                <form action="submit" className={css.changePassForm} onSubmit={handleSubmit(handleChangePassword)}>
                    <div className={css.entryArea}>
                        <div className={css.containerFiled}>
                            <label htmlFor="" className={css.label}>Current Password</label>
                            <div className={css.passContainer}><input type={ showPassword.current_pass ? "text" : "password"} className={css.input} {...register('current_password')}/>
                            {showPassword.current_pass ?
                              <BiShow className={css.showPassIcon} onClick={() => togglePasswordVisibility("current_pass")}/> :
                              <BiHide className={css.showPassIcon} onClick={() => togglePasswordVisibility("current_pass")}/>
                            }</div>
                            {errors.current_password && <span className={css.fieldError}>{errors.current_password.message}</span>}
                        </div>
                        <div className={css.containerFiled}>
                            <label htmlFor="" className={css.label}>New Password</label>
                            <div className={css.passContainer}><input type={ showPassword.new_pass ? "text" : "password"} className={css.input} {...register('new_password')}/>
                            {showPassword.new_pass ?
                              <BiShow className={css.showPassIcon} onClick={() => togglePasswordVisibility("new_pass")}/> :
                              <BiHide className={css.showPassIcon} onClick={() => togglePasswordVisibility("new_pass")}/>
                            }</div>
                            {errors.new_password && <span className={css.fieldError}>{errors.new_password.message}</span>}
                        </div>
                        <div className={css.containerFiled}>
                            <label htmlFor="" className={css.label}>Confirm New Password</label>
                            <div className={css.passContainer}><input type={ showPassword.confirm_pass ? "text" : "password"} className={css.input} {...register('confirm_password')}/>
                            {showPassword.confirm_pass ?
                              <BiShow className={css.showPassIcon} onClick={() => togglePasswordVisibility("confirm_pass")}/> :
                              <BiHide className={css.showPassIcon} onClick={() => togglePasswordVisibility("confirm_pass")}/>
                            }</div>
                            {errors.confirm_password && <span className={css.fieldError}>{errors.confirm_password.message}</span>}
                        </div>
                    </div>
                    <div className={css.ConfirmButtons}>
                        <button type='reset' className={css.closeBtn} onClick={() => reset()}>Reset</button>
                        <button type='submit' className={css.confirmBtn}>Save</button>
                    </div>
                </form>
            </div>
            <div className={css.twoFacForm}>
                <h1 className={css.title}>Two Factor Authentication (2Fa)</h1>
                {!profileData?.is2fa_active ?
                    <div className={css.twoFacContainer}>
                        <div className={css.inputContainer}>
                            <p>Get verification codes from an authenticator app such as Google Authenticator, It works even if your phone is offline. Scan the QR code</p>
                            <div className={css.labelIcon}>
                                <TbDeviceMobileMessage className={css.mobileMsgIcon}/>
                                <label>Enter the 6-digit verification code generated by your authenticator app.</label>
                            </div>
                            <div className={css.inputBtn}>
                                <input type="text" className={css.verifCode} placeholder='Enter OTP' onChange={(e) => setOtp(e.target.value)}/>
                                <button disabled={qrcode ? false : true} className={css.enableBtn} onClick={handleEnable2fa}>Enable 2FA</button>
                            </div>
                            {errorOtp && <span className={css.fieldError}>{errorOtp}</span>}
                        </div>
                        <div className={css.qrCodeContainer}>
                            {!qrcode ? <button onClick={handleGetQrcode}>Get Qr-code</button> : <img src={qrcode} alt="" />}
                        </div>
                    </div> :
                    <div className={css.disable2faContainer}>
                        <p>Two Factor Authentication is currently enabled</p>
                        <div className={css.containerFiled}>
                            <label htmlFor="" className={css.label}>Confirm your Password</label>
                            <div><input type={ showPassword.pass2fa ? "text" : "password"} className={css.input} onChange={(e) => setConfirPass2fa(e.target.value)} />
                                { showPassword.pass2fa ?
                                  <BiShow className={css.showPassIcon} onClick={() => togglePasswordVisibility("pass2fa")}/> :
                                  <BiHide className={css.showPassIcon} onClick={() => togglePasswordVisibility("pass2fa")}/>
                                }
                            </div>
                        </div>
                        <button disabled={confiPass2fa && confiPass2fa?.length > 0 ? false : true} className={css.disableBtn} onClick={handleDisable2fa}>Disable 2FA</button>
                    </div>}
            </div>
        </div>
  )
}

export default EditSecurityProfile
