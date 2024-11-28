// React
import { useState } from 'react';
// Components
import ProfileHeader from '../../components/Profile/ProfileHeader'
import ProfileFriends from "@/components/Profile/ProfileFriends";
import ProfileGamesHistory from '@/components/Profile/ProfileGamesHistory';
import EditInfosProfile from '@/components/Profile/EditInfosProfile'
import EditSecurityProfile from '@/components/Profile/EditSecurityProfile';
// Styles
import css from './Profile.module.css'
import { IoMdCloseCircleOutline } from "react-icons/io";


const Profile = () => {
  const [isEditProfile, setEditProfile] = useState(false);
  const [activeBtn, setActiveBtn] = useState(true);

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
      { isEditProfile &&
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
      <ProfileHeader isEditProfile={isEditProfile} setEditProfile={setEditProfile} />
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
