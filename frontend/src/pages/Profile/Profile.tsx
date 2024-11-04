import React, { useEffect, useState } from 'react'
import css from './Profile.module.css'
import ProfileHeader from './components/ProfileHeader'
import GameHistory from './components/GameHistory'
import ProfilePopup from './components/ProfilePopup'

import Avatar1 from './assets/avatar1.svg'
import Avatar2 from './assets/avatar2.svg'
import Avatar3 from './assets/avatar3.svg'
import Avatar4 from './assets/avatar4.svg'
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/apiClient'

// interface Friends {
//   id: number;
//   avatar: string;
//   nickname: string;
// }

const getProfile = async () => {
  // try {
    const response = await apiClient.get(
      '/profile/user1'
    );
    return response.data
}

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMwNzU4NjI4LCJpYXQiOjE3MzA3NTgzNTcsImp0aSI6IjI2NDI0M2MxYWNkZjQzYTJiZTI2MmI3MTk4NzJhNzMzIiwidXNlcl9pZCI6MTh9.V7oflfKYLQQqOfapnE_yduG_k0xa2OOSj-rlFy9biVc
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMwNzU4NzEwLCJpYXQiOjE3MzA3NTgzNTcsImp0aSI6ImM5MjRjZTU4NTY3MDQ1MzY5ZTQyZTk4MGJiMDBhZmM5IiwidXNlcl9pZCI6MTh9.UYsMvk9ZzdimyzvLom8M_JowzFcdJfQmMzPJtE9Quf8
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMwNzU4OTQ0LCJpYXQiOjE3MzA3NTg5MzQsImp0aSI6IjRlYWEwODYwZjEzMjRiMjFiMzc0ZjQ0YWE0ZTQ5MGUwIiwidXNlcl9pZCI6MTh9.JLuhKVQWOBlQy1rIcwvU7cVRV4JhAMmT9Hw-Zx8vmR0
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMwNzU4OTQ0LCJpYXQiOjE3MzA3NTg5MzQsImp0aSI6IjRlYWEwODYwZjEzMjRiMjFiMzc0ZjQ0YWE0ZTQ5MGUwIiwidXNlcl9pZCI6MTh9.JLuhKVQWOBlQy1rIcwvU7cVRV4JhAMmT9Hw-Zx8vmR0


const Profile = () => {

  // const friendsList = [
  //   {id: 1, avatar: Avatar1, nickname: 'chiwahed'},
  //   {id: 2, avatar: Avatar2, nickname: 'chiwehda'},
  //   {id: 3, avatar: Avatar3, nickname: 'chiwehedakhra'},
  //   {id: 4, avatar: Avatar4, nickname: 'chiwahedakhor'}
  // ]

 const {data, isLoading, isError, isSuccess, error} = useQuery({
    queryKey: ["myquerykey1"],
    queryFn: getProfile
  });

  // if (isLoading) return <div>Loading...</div>
  // if (isError) return <div>Error: {error.message}</div>

  // useEffect(() => {
  //   console.log('--data--', data);
  // }, [isSuccess])


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
