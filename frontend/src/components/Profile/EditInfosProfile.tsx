// React
import { useEffect, useRef, useState } from 'react';
// Styles
import css from './EditInfosProfile.module.css'
import { toast } from 'react-toastify';
// Hooks
import useEditProfile from '@/hooks/profile/useEditInfosProfile'
// Contexts
import { useUser } from '@/contexts/UserContext';
// Types
import { EditProfileFormData } from '@/types/apiTypes';
import apiClient from '@/api/apiClient';
import axios from 'axios';
import { API_UPDATE_EMAIL_REQUEST_URL, REDIRECT_URL_UPDATE_EMAIL } from '@/api/apiConfig';


const EditInfosProfile = ({setEditProfile}:{setEditProfile:React.Dispatch<React.SetStateAction<boolean>>}) => {

    const { register, handleSubmit, mutation, reset, errors, watch, setValue}  = useEditProfile();
    const [isConfirmSave, setConfirmSave] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState<string>('null');
    const [isVerifyEmail, setVerifyEmail] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { user: profileData, refetch } = useUser();
    const formValues = watch(['username', 'first_name', 'last_name', 'avatar']);
    const emailValue = watch('email');

    const handleEditProfile = (data: EditProfileFormData) => {
        const formData = new FormData();
        if (data.avatar && data.avatar.length > 0 ) formData.append('avatar', data.avatar[0]);
        if (selectedAvatar === 'remove') formData.append('removeAvatar', "true");
        if (data.username) formData.append('username', data.username);
        if (data.first_name) formData.append('first_name', data.first_name);
        if (data.last_name) formData.append('last_name', data.last_name);
        if (data.password) formData.append('password', data.password);
        if (data.otp) formData.append('otp', data.otp);
        mutation.mutate(formData);
    };
    const handleChangeAvatar = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        fileInputRef.current?.click();
    };
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          setValue('avatar', event.target.files);
          const url = URL.createObjectURL(file);
          setSelectedAvatar(url);
        }
    };
    const handleSaveBtn = () => {
        const hasValue = formValues.some((value:any) => value !== undefined || value?.trim() !== '');
        if (!hasValue) {
            toast.error('Please fill at least one field to save the changes');
            return;
        }
        setConfirmSave(true)
    }
    useEffect(() => {
        if (mutation.isSuccess) {
            toast.success(mutation.data?.data?.message);
            reset();
            refetch();
            setEditProfile(false);
        }
   }, [mutation.isSuccess]);
   useEffect(() => {
        // console.log(isConfirmSave);
        if (mutation.isError && isConfirmSave) {
            setConfirmSave(false);
            mutation.reset();
        }
   }), [mutation.isError];

   const handleVerifyEmail = async () => {
        try {
            const response = await apiClient.post(API_UPDATE_EMAIL_REQUEST_URL, {
                email: emailValue,
                // redirect_url: REDIRECT_URL_UPDATE_EMAIL
            });
            toast.success(response.data.message);
            setEditProfile(false);
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error?.response?.data?.error);
            } else {
                toast.error('An error occurred. Please try again later');
            }
        }
   }

    return (
        <form className={css.editInfosForm} onSubmit={ handleSubmit(handleEditProfile) } encType="multipart/form-data">
            <h1 className={css.title}>Edit your Information</h1>
            <div className={css.editAvatar}>


                {selectedAvatar === 'null' ? (
                    <div className={css.avatarContainer}> <img src={profileData?.profile.avatar} alt="" /></div>) :
                    (selectedAvatar === 'remove' ? <div className={css.avatarContainer}><img src='/icons/defaultAvatar.png' alt="" /></div> :
                    <div className={css.avatarContainer}><img src={selectedAvatar} alt="" /></div> )}

                {/* // { selectedAvatar === 'null' ? <img src={profileData?.profile.avatar} alt={profileData?.username} className={css.avatar}/> :

                    <div style={{backgroundImage: `url('${selectedAvatar}')`}} className={css.avatarContainer}></div>) } */}


                <div className={css.avatarButtons}>
                  <input type="file" accept='image/*' {...register('avatar')} ref={(e) => { register("avatar"); fileInputRef.current = e}} onChange={handleFileChange}/>
                  <button className={css.avatarBtn} onClick={handleChangeAvatar}>Change Avatar</button>
                  <button className={css.removeAvatarBtn} onClick={(e) => {e.preventDefault(); setSelectedAvatar('remove')}}>Remove Avatar</button>
                </div>
            </div>
            <div className={css.editInfos}>
                <div className={css.containerFiled}>
                    <label htmlFor="" className={css.label}>First Name</label>
                    <input required={false} type="text" className={css.input}
                      placeholder={profileData?.first_name ? profileData?.first_name : 'Enter your first name'} {...register('first_name')}/>
                      {errors.first_name && <span className={css.fieldError}>{errors.first_name.message}</span>}
                </div>
                <div className={css.containerFiled}>
                    <label htmlFor="" className={css.label}>Last Name</label>
                    <input required={false} type="text" className={css.input}
                      placeholder={profileData?.last_name ? profileData?.last_name : 'Enter your last name'} {...register('last_name')}/>
                      {errors.last_name && <span className={css.fieldError}>{errors.last_name.message}</span>}
                </div>
                <div className={css.containerFiled}>
                    <label htmlFor="" className={css.label}>Username</label>
                    <input required={false} type="text" className={css.input}
                      placeholder={profileData?.username ? profileData?.username : 'Enter your first name'} {...register('username')}/>
                      {errors.username && <span className={css.fieldError}>{errors.username.message}</span>}
                </div>
                <div className={css.containerFiled}>
                    <label htmlFor="" className={css.label}>Email</label>
                    <div className={css.emailInput}>
                        <input required={false} type="email" className={css.input}
                        placeholder={profileData?.email ? profileData?.email : 'Enter new email'} {...register('email')}/>
                        <button className={css.editEmailBtn} disabled={!emailValue} onClick={handleVerifyEmail}>
                            Verify
                        </button>
                    </div>
                      { errors.email && <span className={css.fieldError}>{errors.email.message}</span> }
                </div>
                <div className={css.saveContainer}>
                    {errors.root && <span className={css.fieldError}>{errors.root.message}</span>}
                    <button type='button' className={css.saveBtn} onClick={handleSaveBtn}>Save</button>
                </div>
                <div className={`${isVerifyEmail ? css.bluredBgConfirm : ''}`}>
                    { isVerifyEmail && <div className={css.saveConfirmContainer}>
                        <h1>Confirm Your Email</h1>
                        <p>we've sent a verification code to your new email. please enter the code.</p>
                        <div className={css.containerFiled}>
                            <label htmlFor="">Confirm Your Password</label>
                            <input required={true} type="password" className={css.input}
                              placeholder='Enter your 6-digit-code' />
                              {errors.otp && <span className={css.fieldError}>{errors.otp.message}</span>}
                        </div>
                        <div className={css.ConfirmButtons}>
                          <button className={css.closeBtn} onClick={() => setVerifyEmail(false)}>Cancel</button>
                          <button type='submit' className={css.confirmBtn}>Verify</button>
                        </div>
                        <div className={css.resendOtp}>
                            <p>Didn't receive the code?</p> <span className={css.resendLink}>Resend code</span>
                        </div>
                    </div> }
                </div>
                <div className={`${isConfirmSave ? css.bluredBgConfirm : ''}`}>
                    { isConfirmSave && <div className={css.saveConfirmContainer}>
                        <h1>Confirm Your Password</h1>
                        <p>Please enter your password to save the changes. Thank you for your time all this just to protect you !</p>
                        <div className={css.containerFiled}>
                            <label htmlFor="">Enter you password</label>
                            <input required={true} type="password" className={css.input}
                              placeholder='Enter your password' {...register('password')}/>
                              {errors.password && <span className={css.fieldError}>{errors.password.message}</span>}
                        </div>
                        <div className={css.ConfirmButtons}>
                          <button className={css.closeBtn} onClick={() => setConfirmSave(false)}>Close</button>
                          <button type='submit' className={css.confirmBtn}>Confirm</button>
                        </div>
                    </div> }
                </div>
            </div>
        </form>
    )
}

export default EditInfosProfile


// {selectedAvatar === 'null' ? (
//                     <div
//                         className={css.avatarContainer}
//                         style={{
//                         backgroundImage: `url('${profileData?.profile.avatar}')`
//                         }}
//                     ></div>
//                     ) : (selectedAvatar === 'remove' ? <div className={css.avatarContainer} style={{
//                         backgroundImage: `url('/icons/defaultAvatar.png')`
//                         }}></div> :

//                 // { selectedAvatar === 'null' ? <img src={profileData?.profile.avatar} alt={profileData?.username} className={css.avatar}/> :

//                     <div style={{backgroundImage: `url('${selectedAvatar}')`}} className={css.avatarContainer}></div>) }