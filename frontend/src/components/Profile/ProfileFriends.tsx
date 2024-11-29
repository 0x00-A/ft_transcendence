// React
import { useState } from 'react';
// Styles
import css from './ProfileFriends.module.css';
import { FaUserFriends } from "react-icons/fa";
// API
import { useGetData } from "@/api/apiHooks";
// Components
import Loading from "@/components/Friends/Loading";
import { useNavigate } from 'react-router-dom';

interface FriendProfile {
    avatar: string;
    is_online: boolean;
    level: number;
}

interface Friend {
  id: string;
  username: string;
  profile: FriendProfile;
}


const ProfileFriends = () => {

    const [isBtnActive, setBtnActive] = useState(true);
    // const endPoint = `${username ? '/friends/${username}' : '/friends'}`;
    const { data: friendsData, isLoading, error } = useGetData<Friend[]>(`/friends`);
    const navigate = useNavigate();
    const onlineFriends = friendsData?.filter(friend => friend.profile.is_online).slice(0, 5);
    const offlineFriends = friendsData?.filter(friend => !friend.profile.is_online).slice(0, 5);
    if (isLoading) return <Loading />;

  return (
    <div className={css.profileFriendsContainer}>
        <div className={css.friendsHeader}>
            <div className={css.friendsTitle}>
                <FaUserFriends className={css.friendsIcon}/>
                <h3>Friends</h3>
            </div>
            <button className={css.viewMore} onClick={() => navigate('/friends')}>View more</button>
        </div>
        <div className={css.friendsList}>
            <div className={css.buttonsGrp}>
                <button onClick={() => setBtnActive(!isBtnActive)}
                    className={`${css.button} ${isBtnActive  ? css.buttonActive : ''}`}>
                    Online
                </button>
                <button onClick={() => setBtnActive(!isBtnActive)}
                    className={`${css.button} ${!isBtnActive ? css.buttonActive : ''}`}>
                    Offline
                </button>
            </div>
            <div className={css.friendList}>
                { isLoading && <Loading/> }
                { error && <p>{error.message}</p> }
                { friendsData?.length == 0 && <div className={css.noFriends}>
                    <span>You are lonely</span>
                    <button className={css.addFriendsBtn} onClick={() => navigate('/friends')}>
                        <img src="/icons/friend/addFriend.svg" alt="Add" />
                        <span>Add friends</span>
                    </button>
                </div> }
                { isBtnActive && friendsData && friendsData?.length > 0 && onlineFriends?.length == 0 && <span className={css.noCurrentFriend}>No Online friends</span> }
                { !isBtnActive && friendsData && friendsData?.length > 0 && offlineFriends?.length == 0 && <span className={css.noCurrentFriend}>No Offline friends</span> }
                { isBtnActive && onlineFriends && onlineFriends?.length > 0 && onlineFriends?.map((friend, index) => (
                    <div className={css.friendItem} key={index}>
                         <img src={friend.profile.avatar} alt={friend.username} className={css.avatar} />
                         <div className={css.friendInfo}>
                             <span className={css.name} onClick={() => navigate(`/profile/${friend.username}`)}>{friend.username}</span>
                             <span className={css.level}>Level: {friend.profile.level}</span>
                         </div>
                         <div className={`${css.status} ${css.online}`}>
                            <span className={css.statusIndicator}></span>
                            Online
                         </div>
                     </div>
                ))}
                { !isBtnActive &&  offlineFriends && offlineFriends?.length > 0 && offlineFriends?.map((friend, index) => (
                    <div className={css.friendItem} key={index}>
                         <img src={friend.profile.avatar} alt={friend.username} className={css.avatar} />
                         <div className={css.friendInfo}>
                             <span className={css.name} onClick={() => navigate(`/profile/${friend.username}`)}>{friend.username}</span>
                             <span className={css.level}>Level: {friend.profile.level}</span>
                         </div>
                         <div className={`${css.status} ${css.offline}`}>
                            <span className={css.statusIndicator}></span>
                            Offline
                         </div>
                     </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default ProfileFriends