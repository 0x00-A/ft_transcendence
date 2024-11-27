// React
// Components
import UsersProfileHeader from '@/components/Profile/UsersProfileHeader';
import UserProfileFriends from "@/components/Profile/UserProfileFriends";
import ProfileGamesHistory from '@/components/Profile/ProfileGamesHistory';
// Styles
import css from './Profile.module.css'
import { useParams } from 'react-router-dom';


const UsersProfile = () => {

    const {username} = useParams();

    console.log(username);
  return (
    <div className={css.profileContainer}>
      <UsersProfileHeader username={username} />
      <div className={css.profileBodyConatiner}>
        <UserProfileFriends username={username} />
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

export default UsersProfile
