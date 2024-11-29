// React
import { useEffect, useState } from 'react';
// Components
import ProfileHeader from '../../components/Profile/ProfileHeader'
import ProfileFriends from "@/components/Profile/ProfileFriends";
import ProfileGamesHistory from '@/components/Profile/ProfileGamesHistory';
import EditInfosProfile from '@/components/Profile/EditInfosProfile'
import EditSecurityProfile from '@/components/Profile/EditSecurityProfile';
// Styles
import css from './Profile.module.css';
import { IoMdCloseCircleOutline } from "react-icons/io";
import { BiHide } from "react-icons/bi";
import { BiShow } from "react-icons/bi";
import { toast } from 'react-toastify';
// Api
import { useUser } from '@/contexts/UserContext';
// Types
import { SetPasswordForm } from '@/types/apiTypes';
// Hooks
import useSetPassword from '@/hooks/auth/useSetPassword';

const Profile = () => {

  const { register, handleSubmit, errors, mutation } = useSetPassword();
  const [isEditProfile, setEditProfile] = useState(false);
  const [activeBtn, setActiveBtn] = useState(true);
  const { user: currentUser, isLoading } = useUser()
  const [showPassword, setShowPassword] = useState({
      new_pass: false,
      confirm_pass: false,
  });

  const togglePasswordVisibility = (field:string) => {
      setShowPassword((prevState) => ({
        ...prevState,
        [field]: !prevState[field],
      }));
  };

  useEffect(() => {
    if (mutation.isSuccess) {
      console.log('set_password==> ', mutation.data);
      toast.success(mutation.data?.message);
      setEditProfile(false);
    }
  }, [mutation.isSuccess]);
  useEffect(() => {
    if (mutation.isError) {
      toast.error(mutation.error?.message);
    }
  }, mutation.isError);

  const handleOutsideClick = (event: React.MouseEvent) => {
    // if (isConfirmSave) {
    //   return;
    // }
    if ((event.target as HTMLElement).classList.contains(css.bluredBg)) {
      setEditProfile(false);
    }
  };

  const handleSetPassword = (data: SetPasswordForm, event: React.FormEvent) => {
    event.preventDefault();
    mutation.mutate(data);
  }

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className={css.profileContainer}>
      { isEditProfile && !currentUser?.is_oauth_user &&
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
              { activeBtn ? <EditInfosProfile setEditProfile={setEditProfile} /> :
                <EditSecurityProfile setEditProfile={setEditProfile} /> }
            </div>
          </div>
        </div>
      }
      {
        isEditProfile && currentUser?.is_oauth_user &&
        <div className={css.bluredBg} onClick={handleOutsideClick}>
          <div className={css.setPassContainer}>
            <button className={css.exitBtn} onClick={() => setEditProfile(false)}>
              <IoMdCloseCircleOutline />
            </button>
            <form action="submit" className={css.setPassForm} onSubmit={handleSubmit(handleSetPassword)}>
              <div className={css.formHeader}>
                <h1>Set a password</h1>
                <p>Your account has no password setted because you are oauth2 user, please set a password so you can update your informations</p>
              </div>
              <div className={css.inputFields}>
                <div className={css.containerFiled}>
                  <label htmlFor="" className={css.label}>New Password</label>
                  <div className={css.inputContainer}><input type={ showPassword.new_pass ? "text" : "password"} className={css.input} {...register('password')}/>
                  {showPassword.new_pass ?
                    <BiShow className={css.showPassIcon} onClick={() => togglePasswordVisibility("new_pass")}/> :
                    <BiHide className={css.showPassIcon} onClick={() => togglePasswordVisibility("new_pass")}/>
                  }</div>
                { errors.password && <span className={css.fieldError}>{errors.password.message}</span> }
                </div>
                <div className={css.containerFiled}>
                  <label htmlFor="" className={css.label}>Confirm New Password</label>
                  <div className={css.inputContainer}><input type={ showPassword.confirm_pass ? "text" : "password"} className={css.input} {...register('password2')}/>
                  {showPassword.confirm_pass ?
                    <BiShow className={css.showPassIcon} onClick={() => togglePasswordVisibility("confirm_pass")}/> :
                    <BiHide className={css.showPassIcon} onClick={() => togglePasswordVisibility("confirm_pass")}/>
                  }</div>
                { errors.password2 && <span className={css.fieldError}>{errors.password2.message}</span> }
                </div>
                <div className={css.ConfirmButtons}>
                  <button type='reset' className={css.closeBtn}>Reset</button>
                  <button type='submit' className={css.confirmBtn}>Save</button>
                </div>
                </div>
            </form>
          </div>
        </div>
      }
      <ProfileHeader setEditProfile={setEditProfile} currentUser={currentUser} />
      <div className={css.profileBodyConatiner}>
        <ProfileFriends />
        <div className={css.rightBodyContainer}>
          <div className={css.profileAchievContainer}>
            <div className={css.achievHeader}>
              <img src="/icons/AchievIcon.svg" className={css.achievIcon}/>
              <h3>Achievements</h3>
            </div>
          </div>
          <ProfileGamesHistory/>
        </div>
      </div>

    </div>
  )
}

export default Profile
