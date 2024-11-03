import React, { useState } from 'react'
import css from './Profile.module.css'
import ProfileHeader from './components/ProfileHeader'
import GameHistory from './components/GameHistory'
import ProfilePopup from './components/ProfilePopup'

import Avatar1 from './assets/avatar1.svg'
import Avatar2 from './assets/avatar2.svg'
import Avatar3 from './assets/avatar3.svg'
import Avatar4 from './assets/avatar4.svg'
import { useQuery } from '@tanstack/react-query';

interface Friends {
  id: number;
  avatar: string;
  nickname: string;
}

const Profile = () => {

  // const friendsList = [
  //   {id: 1, avatar: Avatar1, nickname: 'chiwahed'},
  //   {id: 2, avatar: Avatar2, nickname: 'chiwehda'},
  //   {id: 3, avatar: Avatar3, nickname: 'chiwehedakhra'},
  //   {id: 4, avatar: Avatar4, nickname: 'chiwahedakhor'}
  // ]

//  const ProfileDetail = useQuery()

  // const ListFriends = friendsList.map((friend) => (
  //   <div key={friend.id} className={css.friendDetail}>
  //     <img src={friend.avatar} alt="" />
  //     <p>{friend.nickname}</p>
  //     <button>Invite</button>
  //   </div>
  // ));

  const [isFormPopup, setFormPopup] = useState(false);


  return (
    <div className={css.profileContainer}>
      {isFormPopup && <ProfilePopup setFormpopup={setFormPopup} />}
      <div className={`${css.container} ${isFormPopup ? css.containerBlur : ''}`}>
        <ProfileHeader setFormpopup={setFormPopup}/>
        {/* <div className={css.bodyContainer}> */}
          {/* <GameHistory /> */}
          {/* ACHIEVEMENTS */}
          {/* <div className={css.achievementsContainer}> */}
            {/* <h3>Achievements</h3> */}
          {/* </div> */}
          {/* <div className={css.friendsContainer}> */}
            {/* <h3>Friends</h3> */}
            {/* {ListFriends} */}
            {/* <div className={css.friendDetail}>
            </div> */}
          {/* </div> */}
        {/* </div> */}
      </div>
    </div>
  )
}

export default Profile
