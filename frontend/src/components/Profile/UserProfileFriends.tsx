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
// Types
import { MutualFriend, Friend } from '@/types/apiTypes';


const UserProfileFriends = ({username}:{username:string}) => {

    const [isBtnActive, setBtnActive] = useState(true);
    // const endPoint = `${username ? '/friends/${username}' : '/friends'}`;
    const { data: friendsData, isLoading, error } = useGetData<Friend[]>(`/friends/${username}`);
    const { data: mutualFriends, isLoading : mutualIsLoading} = useGetData<MutualFriend>(`/friends/mutual/${username}`);
    const navigate = useNavigate();
    // const mutualFriends = friendsData?.filter(friend => friend.profile.is_online).slice(0, 5);
    // const offlineFriends = friendsData?.filter(friend => !friend.profile.is_online).slice(0, 5);
    if (isLoading) return <Loading />;

    if (mutualIsLoading) return <Loading />;

  return (
    <div className={css.profileFriendsContainer}>
        <div className={css.friendsHeader}>
            <div className={css.friendsTitle}>
                <FaUserFriends className={css.friendsIcon}/>
                <h3>Friends</h3>
            </div>
            {/* <button className={css.viewMore} onClick={() => navigate('/friends')}>View more</button> */}
        </div>
        <div className={css.friendsList}>
            <div className={css.buttonsGrp}>
                <button onClick={() => setBtnActive(true)}
                    className={`${css.button} ${isBtnActive  ? css.buttonActive : ''}`}>
                    Mutual Friends {mutualFriends?.mutual_friends_count}
                </button>
                <button onClick={() => setBtnActive(false)}
                    className={`${css.button} ${!isBtnActive ? css.buttonActive : ''}`}>
                    All Friends
                </button>
            </div>
            <div className={css.friendList}>
                { isLoading && <Loading /> }
                { error && <p>{error.message}</p> }
                { friendsData?.length == 0 && <div className={css.noFriends}>
                    <span>This Player is Lonely</span>
                    {/* <button className={css.addFriendsBtn} onClick={() => navigate('/friends')}>
                        <img src="/icons/friend/addFriend.svg" alt="Add" />
                        <span>Add friends</span>
                    </button> */}
                </div> }
                { isBtnActive && mutualIsLoading && <Loading /> }
                { isBtnActive && friendsData!.length > 0 && mutualFriends!.mutual_friends?.length == 0 && <span className={css.noCurrentFriend}>No Mutual friends</span> }
                {/* { !isBtnActive && friendsData?.length > 0 && offlineFriends?.length == 0 && <span className={css.noCurrentFriend}>No Offline friends</span> } */}
                { isBtnActive && mutualFriends?.mutual_friends && mutualFriends.mutual_friends?.length > 0 && mutualFriends?.mutual_friends?.map((friend, index) => (
                    <div className={css.friendItem} key={index}>
                         <img src={friend.profile.avatar} alt={friend.username} className={css.avatar} />
                         <div className={css.friendInfo}>
                             <span className={css.name} onClick={() => navigate(`/profile/${friend.username}`)}>{friend.username}</span>
                             <span className={css.level}>Level: {friend.profile.level}</span>
                         </div>
                         {/* <div className={`${css.status} ${css.online}`}>
                            <span className={css.statusIndicator}></span>
                            Online
                         </div> */}
                     </div>
                ))}
                { !isBtnActive &&  friendsData && friendsData?.length > 0 && friendsData?.map((friend, index) => (
                    <div className={css.friendItem} key={index}>
                         <img src={friend.profile.avatar} alt={friend.username} className={css.avatar} />
                         <div className={css.friendInfo}>
                             <span className={css.name} onClick={() => navigate(`/profile/${friend.username}`)}>{friend.username}</span>
                             <span className={css.level}>Level: {friend.profile.level}</span>
                         </div>
                         {/* <div className={`${css.status} ${css.offline}`}>
                            <span className={css.statusIndicator}></span>
                            Offline
                         </div> */}
                     </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default UserProfileFriends




// { friendsData && friendsData?.length > 0 &&  friendsData?.map((friend, index) => (

//                     <div className={css.friendItem} key={index}>
//                         <img src={friend.profile.avatar} alt={friend.username} className={css.avatar} />
//                         <div className={css.friendInfo}>
//                             <span className={css.name}>{friend.username}</span>
//                             <span className={css.level}>Level: {friend.profile.level}</span>
//                         </div>
//                         <div className={`${css.status} ${friend.profile.is_online ? css.online : css.offline}`}>
//                             <span className={css.statusIndicator}></span>
//                                 {friend.profile.is_online ? 'Online' : 'Offline'}
//                         </div>
//                     </div>
//                 ))}


        //
        //
        //
        //
        //     { friendsData?.length > 0 && friendsData.map((friend, index) => (
        //       <div className={css.friendItem} key={index}>
        //         <img src={friend.profile.avatar} alt={friend.username} className={css.avatar} />
        //         <div className={css.friendInfo}>
        //           <span className={css.name}>{friend.username}</span>
        //         </div>
        //       <div/>
        //     )}

        // </div>