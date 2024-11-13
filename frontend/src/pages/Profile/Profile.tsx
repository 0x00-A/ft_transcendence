
// Components
import ProfileHeader from '../../components/Profile/ProfileHeader'
// Styles
import css from './Profile.module.css'
import Avatar from '@mui/material/Avatar';



const Profile = () => {

  return (
    <div className={css.profileContainer}>
      {/* {isFormPopup && <ProfilePopup setFormpopup={setFormPopup} />} */}
      <div className={css.profileHeaderContainer}>
        <div className={css.profileAvatarUsername}>
          <img src="https://picsum.photos/200" alt="" className={css.profileAvatar}/>
          <p>Lmahdi</p>
        </div>
      </div>
      {/* <div className={css.gameHistoryContainer}>
        <LastMatch />
      </div>
      <div className={css.achievementsContainer}>
        <Achievements />
      </div>
      <div className={css.friendsContainer}>
        <FriendsList />
      </div> */}
    </div>
        // {/* <div className={css.bodyContainer}> */}
          // {/* <GameHistory /> */}
          // {/* ACHIEVEMENTS */}
          // {/* <div className={css.achievementsContainer}> */}
            // {/* <h3>Achievements</h3> */}
          // {/* </div> */}
          // {/* <div className={css.friendsContainer}> */}
            // {/* <h3>Friends</h3> */}
            // {/* {ListFriends} */}
            // {/* <div className={css.friendDetail}>
            // </div> */}
          // {/* </div> */}
        // {/* </div> */}
      // {/* </div> */}
    // </div>
  )
}

export default Profile
//