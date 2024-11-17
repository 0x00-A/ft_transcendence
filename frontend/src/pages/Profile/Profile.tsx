import { useParams } from "react-router-dom";
// Components
import ProfileHeader from '../../components/Profile/ProfileHeader'
import ProfilePopup from '@/components/Profile/ProfilePopup';
// Styles
import css from './Profile.module.css'
import { FaUserFriends } from "react-icons/fa";


import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import FriendsList from "@/components/Dashboard/FriendsList";

const friendsData = [
  { name: 'essam', level: 12.5, status: 'offline', avatar: 'https://picsum.photos/201' },
  { name: 'rel-isma', level: 11.5, status: 'online', avatar: 'https://picsum.photos/203' },
  { name: 'aigounad', level: 8.5, status: 'offline', avatar: 'https://picsum.photos/204' },
  { name: 'l9ra3', level: 8.2, status: 'online', avatar: 'https://picsum.photos/202' },
  { name: 'aka', level: 5.5, status: 'offline', avatar: 'https://picsum.photos/206' },
  { name: 'aka', level: 5.5, status: 'offline', avatar: 'https://picsum.photos/206' },
];


const Profile = () => {
  const [isFormPopup, setFormPopup] = useState(false);
  const [isBtnActive, setBtnActive] = useState(true);
  // const { username } = useParams();

  // if (username) {
  //   return <UserProfile username={username}/>
  // }\

  return (
    <div className={css.profileContainer}>
      {isFormPopup && <ProfilePopup setFormpopup={setFormPopup} />}
      <ProfileHeader isFormPopup={isFormPopup} setFormPopup={setFormPopup} />
      <div className={css.profileFriendsContainer}>
        <div className={css.friendsHeader}>
          <div className={css.friendsTitle}>
            <FaUserFriends className={css.friendsIcon}/>
            <h3>Friends</h3>
          </div>
          <a href="/friends" className={css.viewMore}>View more</a>
        </div>
        <div className={css.friendsList}>
          <div className={css.buttonsGrp}>
            <button
            onClick={() => setBtnActive(!isBtnActive)}
            className={`${css.button} ${
              isBtnActive  ? css.buttonActive : ''
            }`}>
            Online
            </button>
            <button
            onClick={() => setBtnActive(!isBtnActive)}
            className={`${css.button} ${
              !isBtnActive ? css.buttonActive : ''
            }`}>
            Offline
            </button>
          </div>
          <div className={css.friendList}>
          {friendsData.map((friend, index) => (
            <div className={css.friendItem} key={index}>
              <img src={friend.avatar} alt={friend.name} className={css.avatar} />
              <div className={css.friendInfo}>
                <span className={css.name}>{friend.name}</span>
                <span className={css.level}>Level: {friend.level}</span>
              </div>
              <div className={`${css.status} ${css[friend.status]}`}>
                  <span className={css.statusIndicator}></span>
                {friend.status}
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
//