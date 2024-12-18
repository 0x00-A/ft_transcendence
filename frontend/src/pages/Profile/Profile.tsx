// React
import { useEffect, useState } from 'react';
// Components
import ProfileHeader from '../../components/Profile/ProfileHeader'
import ProfileFriends from "@/components/Profile/ProfileFriends";
import ProfileGamesHistory from '@/components/Profile/ProfileGamesHistory';
import EditInfosProfile from '@/components/Profile/EditInfosProfile'
import EditSecurityProfile from '@/components/Profile/EditSecurityProfile';
import SetPassword from '@/components/Profile/SetPassword';
import ProfileAchievements from '@/components/Profile/ProfileAchievements';
// Styles
import css from './Profile.module.css';
import { IoMdCloseCircleOutline } from "react-icons/io";
import { toast } from 'react-toastify';
// Api
import { useUser } from '@/contexts/UserContext';
import { useTranslation } from 'react-i18next';


const Profile = () => {

  const [isEditProfile, setEditProfile] = useState(false);
  const [activeBtn, setActiveBtn] = useState(true);
  const { user: currentUser, error, refetch, isLoading } = useUser();
  const { t } = useTranslation();


  useEffect(() => {
    refetch();
  }, []);

  if (error) toast.error(error.message);

  if (isLoading) return <div>Loading...</div>

  const handleOutsideClick = (event: React.MouseEvent) => {
    // if (isConfirmSave) {
    //   return;
    // }
    if ((event.target as HTMLElement).classList.contains(css.bluredBg)) {
      setEditProfile(false);
    }
  };

  return (
    <div className={css.profileContainer}>
      { isEditProfile && !currentUser?.is_password_set && <SetPassword setEditProfile={setEditProfile}/> }
      { isEditProfile && currentUser?.is_password_set &&
        <div className={css.bluredBg} onClick={handleOutsideClick}>
          <div className={css.editProfileContainer}>
            <button className={css.exitBtn} onClick={() => setEditProfile(false)}>
              <IoMdCloseCircleOutline />
            </button>
            <div className={css.editProfileForm}>
              <div className={css.buttonsGrp}>
                <button onClick={() => setActiveBtn(true)}
                  className={`${css.button} ${activeBtn  ? css.buttonActive : ''}`}>
                  {t('Profile.informations')}
                </button>
                <button onClick={() => setActiveBtn(false)}
                  className={`${css.button} ${!activeBtn ? css.buttonActive : ''}`}>
                  {t('Profile.security')}
                </button>
              </div>
              { activeBtn ? <EditInfosProfile setEditProfile={setEditProfile} /> :
                <EditSecurityProfile setEditProfile={setEditProfile} /> }
            </div>
          </div>
        </div>
      }
      <ProfileHeader setEditProfile={setEditProfile} />
      <div className={css.profileBodyConatiner}>
        <ProfileFriends />
        <div className={css.rightBodyContainer}>
          <ProfileAchievements username={currentUser?.username} />
          <ProfileGamesHistory username={currentUser?.username} />
        </div>
      </div>

    </div>
  )
}

export default Profile
