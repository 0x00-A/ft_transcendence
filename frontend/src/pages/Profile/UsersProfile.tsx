// Components
import UsersProfileHeader from '@/components/Profile/UsersProfileHeader';
import UserProfileFriends from "@/components/Profile/UserProfileFriends";
import ProfileGamesHistory from '@/components/Profile/ProfileGamesHistory';
// Styles
import css from './Profile.module.css'
import { useParams } from 'react-router-dom';
import ProfileAchievements from '@/components/Profile/ProfileAchievements';


const UsersProfile = () => {

  const {username} = useParams();
  if (!username) return (
    <div className={css.profileContainer}>
      <h1>404 Not Found</h1>
    </div>
  );

  return (
    <div className={css.profileContainer}>
      <UsersProfileHeader username={username} />
      <div className={css.profileBodyConatiner}>
        <UserProfileFriends username={username} />
        <div className={css.rightBodyContainer}>
          <ProfileAchievements username={username}/>
          <ProfileGamesHistory username={username}/>
        </div>
      </div>
    </div>
  )
}

export default UsersProfile
