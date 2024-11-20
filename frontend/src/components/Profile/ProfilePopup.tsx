import CloseIcon from '@/assets/closeIcon.svg'
import apiClient from '@/api/apiClient'
import { execPath } from 'process'
import { useEffect, useRef, useState } from 'react'
import useEditProfile from '@/hooks/profile/useEditProfile'

// Styles
import css from './ProfilePopup.module.css'
import { IoMdCloseCircleOutline } from "react-icons/io";
import { RxAvatar } from "react-icons/rx";


interface EditProfileFormData {
    username: string;
    avatar: FileList;
    first_name: string;
    last_name: string;
    password: string;
}

const ProfilePopup = ({setEditProfile, profileData}) => {

  const { register, handleSubmit, mutation, reset, errors, setValue, setError}  = useEditProfile();
  const [activeBtn, setActiveBtn] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string>('null');
  const [isConfirmSave, setConfirmSave] = useState(false);

  useEffect(() => {
     if (mutation.isSuccess) {
        reset();
        setEditProfile(false);
     }
   }, [mutation.isSuccess]);

  const handleEditProfile = (data: EditProfileFormData, event:any) => {
    console.log(data);

    event.preventDefault();
    const formData = new FormData();
    if (data.avatar && data.avatar.length > 0 ) formData.append('avatar', data.avatar[0]);
    if (selectedAvatar === 'remove') formData.append('avatar', '/icons/defaultAvatar.svg');
    if (data.username) formData.append('username', data.username);
    if (data.first_name) formData.append('first_name', data.first_name);
    if (data.last_name) formData.append('last_name', data.last_name);
    if (data.password) formData.append('password', data.password);
    mutation.mutate(formData);
  }

  const handleOutsideClick = (event: React.MouseEvent) => {
    if (isConfirmSave) {
      return;
    }
    if ((event.target as HTMLElement).classList.contains(css.bluredBg)) {
      setEditProfile(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue('avatar', event.target.files);
      const url = URL.createObjectURL(file);
      setSelectedAvatar(url);
    }
  };

  const handleChangeAvatar = (event) => {
    event.preventDefault();
    fileInputRef.current?.click();

  };

  return (
    <div className={css.bluredBg} onClick={handleOutsideClick}>
      <div className={css.editProfileContainer}>
        <button className={css.exitBtn} onClick={() => setEditProfile(false)}>
          <IoMdCloseCircleOutline />
        </button>
        <div className={css.editProfileForm}>
          <div className={css.buttonsGrp}>
            <button onClick={() => setActiveBtn(true)}
                className={`${css.button} ${activeBtn  ? css.buttonActive : ''}`}>
                Informations
            </button>
            <button onClick={() => setActiveBtn(false)}
                className={`${css.button} ${!activeBtn ? css.buttonActive : ''}`}>
                Security
            </button>
          </div>
          {/* { activeBtn ? <editProfileInfos /> : <editProfileSecurity /> } */}
          { activeBtn &&
            <form className={css.editInfosForm} onSubmit={ handleSubmit(handleEditProfile) }>
              <h1 className={css.title}>Edit your Information</h1>
              <div className={css.editAvatar}>
                { selectedAvatar === 'null' ? <img src={profileData.profile.avatar} alt={profileData.username} className={css.avatar}/> :
                  (selectedAvatar === 'remove' ? <img src="/icons/defaultAvatar.svg" alt={profileData.username} className={css.defaultAvatar}/> :
                    <img src={selectedAvatar} alt={profileData.username} className={css.avatar}/>) }
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
                  <input required={false} type="text" className={css.input}
                    placeholder={profileData?.email ? profileData?.email : 'Enter new email'} {...register('email')}/>
                    {errors.email && <span className={css.fieldError}>{errors.email.message}</span>}
                </div>
                <button type='button' className={css.saveBtn} onClick={() => setConfirmSave(true)}>Save</button>
                <div className={`${isConfirmSave ? css.bluredBgConfirm : ''}`}>
                  { isConfirmSave && <div className={css.saveConfirmContainer}>
                      <h1>Confirm Your Account</h1>
                      <p>Please enter your password to save the changes. Thank you for your time all this just to protect you !</p>

                      <div className={css.containerFiled}>
                        <label htmlFor="">Confirm Your Password</label>
                        <input required={true} type="password" className={css.input}
                          placeholder={profileData?.email ? profileData?.email : 'Enter your password'} {...register('password')}/>
                          {errors.password && <span className={css.fieldError}>{errors.password.message}</span>}
                      </div>
                      <div className={css.ConfirmButtons}>
                        <button className={css.closeBtn} onClick={() => setConfirmSave(false)}>Close</button>
                        <button type='submit' className={css.confirmBtn}>Confirm</button>
                      </div>
                    </div>}
                </div>
              </div>
            </form>
          }
        </div>
      </div>
      {/*


        <div className={css.formsContainer}>

          {errors.avatar && <span className={css.fieldError}>{errors.avatar.message}</span>}
          {errors.first_name && <span className={css.fieldError}>{errors.first_name.message}</span>}
          {errors.last_name && <span className={css.fieldError}>{errors.last_name.message}</span>}
          {errors.username && <span className={css.fieldError}>{errors.username.message}</span>}

      <form action="" className={css.formSecurity}>
        Current password <input type="password" />
        New password <input type="password" />
        Password confirmation <input type="password" />
        <button>Update Password</button>
        </form>
      </div> */}
    </div>
  )
}

export default ProfilePopup


{/*
              First name <input required={false} type="text" {...register('first_name')}/>
              Last name <input required={false} type="text" {...register('last_name')}/>
              username <input required={false} type="text" {...register('username')}/>
              <button type='submit'>Save changes</button> */}