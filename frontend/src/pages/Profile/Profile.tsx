// React
import { useState } from 'react';
// Components
import ProfileHeader from '../../components/Profile/ProfileHeader'
import ProfilePopup from '@/components/Profile/ProfilePopup';
import ProfileFriends from "@/components/Profile/ProfileFriends";
import ProfileGamesHistory from '@/components/Profile/ProfileGamesHistory';
// Styles
import css from './Profile.module.css'
import { useUser } from '@/contexts/UserContext';


const Profile = () => {
  const [isEditProfile, setEditProfile] = useState(false);
  const { user: profileDAta } = useUser();


  return (
    <div className={css.profileContainer}>
      {isEditProfile && <ProfilePopup setEditProfile={setEditProfile} profileData={profileDAta}/>}
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
