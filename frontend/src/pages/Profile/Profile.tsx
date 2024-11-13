import React, { useEffect, useState } from 'react'
import css from './Profile.module.css'
import ProfileHeader from '../../components/Profile/ProfileHeader'
import GameHistory from './components/GameHistory'
import ProfilePopup from './components/ProfilePopup'

import Avatar1 from './assets/avatar1.svg'
import Avatar2 from './assets/avatar2.svg'
import Avatar3 from './assets/avatar3.svg'
import Avatar4 from './assets/avatar4.svg'
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/apiClient'
import LastMatch from '../../components/LastMatch';
import Achievements from '../../components/Achievements';
import FriendsList from '../../components/FriendsList';


const Profile = () => {

  return (
    <div className={css.profileContainer}>
      {/* {isFormPopup && <ProfilePopup setFormpopup={setFormPopup} />} */}
      <div className={css.profileHeader}>
        <ProfileHeader />
      </div>
      <div className={css.gameHistoryContainer}>
        <LastMatch />
      </div>
      <div className={css.achievementsContainer}>
        <Achievements />
      </div>
      <div className={css.friendsContainer}>
        <FriendsList />
      </div>
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