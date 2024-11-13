import css from './ProfilePopup.module.css'
import Avatar from '../assets/avatar.svg'
import CloseIcon from '@/assets/closeIcon.svg'
import apiClient from '@/api/apiClient'
import { execPath } from 'process'
import { useEffect, useState } from 'react'
import useEditProfile from '@/hooks/profile/useEditProfile'

interface EditProfileFormData {
    username: string;
    avatar: File;
    first_name: string;
    last_name: string;
}

const ProfilePopup = ({setFormpopup, profileData}) => {

  // const [newAvatar, setNewAvatar] = useState();

  const { register, handleSubmit, mutation, reset, errors}  = useEditProfile()

  useEffect(() => {
     if (mutation.isSuccess) {
        reset();
        setFormpopup(false);
     }
   }, [mutation.isSuccess]);

  const handleEditProfile = (data: EditProfileFormData) => {
    console.log('---', data, '---');

    const formData = new FormData();
    if (data.avatar && data.avatar.length > 0) formData.append('avatar', data.avatar[0]);
    if (data.username) formData.append('username', data.username);
    if (data.first_name) formData.append('first_name', data.first_name);
    if (data.last_name) formData.append('last_name', data.last_name);
    // event.preventDefault();
     mutation.mutate(formData);
  }

  return (
    <div className={css.popupContainer}>
      <button id={css.closeBtn} onClick={() => setFormpopup(false)}>
        <img src={CloseIcon}/>
      </button>
        {/* <div className={css.formsContainer}> */}
      <form className={css.formProfile} onSubmit={ handleSubmit(handleEditProfile) }>
          <div className={css.avatar}>
            <img src={profileData.profile.avatar} alt=""/>
            <p>{profileData.username}</p>
            <input required={false} type="file" accept='image/*' {...register('avatar')}/>
          </div>
          First name <input required={false} type="text" {...register('first_name')}/>
          Last name <input required={false} type="text" {...register('last_name')}/>
          username <input required={false} type="text" {...register('username')}/>
          <button type='submit'>Save changes</button>
          {errors.avatar && <span className={css.fieldError}>{errors.avatar.message}</span>}
          {errors.first_name && <span className={css.fieldError}>{errors.first_name.message}</span>}
          {errors.last_name && <span className={css.fieldError}>{errors.last_name.message}</span>}
          {errors.username && <span className={css.fieldError}>{errors.username.message}</span>}
      </form>
      <form action="" className={css.formSecurity}>
        Current password <input type="password" />
        New password <input type="password" />
        Password confirmation <input type="password" />
        <button>Update Password</button>
      </form>
        {/* </div> */}
    </div>
  )
}

export default ProfilePopup
