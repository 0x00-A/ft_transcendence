// React
import { useState } from 'react';
// Components
import ProfileHeader from '../../components/Profile/ProfileHeader'
import ProfileFriends from "@/components/Profile/ProfileFriends";
import ProfileGamesHistory from '@/components/Profile/ProfileGamesHistory';
import EditInfosProfile from '@/components/Profile/EditInfosProfile'
import EditSecurityProfile from '@/components/Profile/EditSecurityProfile';
import SetPassword from '@/components/Profile/SetPassword';
// Styles
import css from './Profile.module.css';
import { IoMdCloseCircleOutline } from "react-icons/io";
import { toast } from 'react-toastify';
// Api
import { useUser } from '@/contexts/UserContext';


const Profile = () => {

  const [isEditProfile, setEditProfile] = useState(false);
  const [activeBtn, setActiveBtn] = useState(true);

  const { user: currentUser, error, isLoading } = useUser()
  // const { data: currentUser, isLoading, error, refetch } = useGetData<UserProfileData>(API_GET_PROFILE_URL);

  if (error) {
    toast.error('Failed to load profile data');
  }

  const handleOutsideClick = (event: React.MouseEvent) => {
    // if (isConfirmSave) {
    //   return;
    // }
    if ((event.target as HTMLElement).classList.contains(css.bluredBg)) {
      setEditProfile(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;

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
