// React
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
// API
import apiClient from '@/api/apiClient';
import { API_GET_PROFILE_URL } from '@/api/apiConfig';
import { apiAcceptFriendRequest, apiCancelFriendRequest, apiSendFriendRequest } from '@/api/friendApi';
// Styles
import { IoIosMore } from 'react-icons/io';
import css from './ProfileHeader.module.css'
import { LiaUserFriendsSolid } from "react-icons/lia";
import { TbUserCancel } from "react-icons/tb";
import { FaUserCheck } from "react-icons/fa6";
import { HiOutlineUserAdd } from "react-icons/hi";
import { MdBlock, MdOutlineMessage } from "react-icons/md";
import ArcadeLoader from '../Game/components/ArcadeLoader/ArcadeLoader';
import { toast } from 'react-toastify';

const getProfile = async (username:string) => {

    const response = await apiClient.get(
      `${API_GET_PROFILE_URL}${username}/`
    );
    return response.data
}

const UsersProfileHeader = ({username}:{username:string}) => {
    const [isMore, setMore] = useState(false);

    const {data: user, isLoading, refetch} = useQuery({
        queryKey: ["myquerykey1"],
        queryFn: () => getProfile(username),
    });

    const handleCancel = async () => {
      try {
        const message = await apiCancelFriendRequest(username);
        toast.success(message);
        refetch();
      } catch (error: any) {
        toast.error(error.message || 'Failed to cancel friend request');
      }
    };

    const sendFriendRequest = async () => {
    try {
      const message = await apiSendFriendRequest(username);
      toast.success(message);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to send friend request' );
    }
  };

  const acceptFriendRequest = async () => {
    try {
      const message = await apiAcceptFriendRequest(username);
      toast.success(message);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to accept friend request');
    }
  };

    // const {data: user, isLoading} = useGetData(`${API_GET_PROFILE_URL}/${username}`);

  if (isLoading) {
    return (
        <div className={css.loaderWrapper}>
        <ArcadeLoader className={css.loader} />
      </div>
    )
  }

  return (
    <div className={css.profileHeaderContainer}>
      <div className={css.profileBackground}>
        <div className={css.othersProfile}>
          <div className={css.friendState}>
            {user?.friend_status === 'Friends' &&
            <div className={css.friendsStat}><LiaUserFriendsSolid className={css.friendsStateIcon}/>
              <span>{user?.friend_status}</span>
            </div>}
            {user?.friend_status === 'Cancel' && <button className={css.friendStatBtn} onClick={handleCancel}>
              <TbUserCancel className={css.friendsStateIcon}/>
              <span>{user?.friend_status}</span>
            </button>}
            {user?.friend_status === 'Accept' && <button className={css.friendStatBtn} onClick={acceptFriendRequest}>
              <FaUserCheck className={css.friendsStateIcon}/>
              <span>{user?.friend_status}</span>
            </button>}
            {user?.friend_status === 'Add' && <button className={css.friendStatBtn} onClick={sendFriendRequest}>
              <HiOutlineUserAdd className={css.friendsStateIcon}/>
              <span>{user?.friend_status}</span>
            </button>}
          </div>
          <div>
            <IoIosMore className={css.moreIcon} onClick={() => setMore(!isMore)}/>
            {isMore &&
              <div className={css.showMore}>
                <button className={css.messageBtn}>
                  <MdOutlineMessage className={css.messageIcon}/>
                  <span>Message</span>
                </button>
                <button className={css.blockBtn}>
                  <MdBlock className={css.blockIcon}/>
                  <span>Block</span>
                </button>
              </div>}
          </div>
        </div>
      </div>
      <div className={css.profileCard}>
        <div className={css.avatarContainer}>
          <img src={user?.profile?.avatar} alt="" className={css.profileAvatar}/>
          <span className={css.profileLevel}>{user?.profile?.level || 0}</span>
        </div>
        <h2>{user?.username}</h2>
      </div>
      <div className={css.profileStats}>
        <div className={css.leftStats}>
          <div className={css.totalGames}>
            <span className={css.statValue}>{user?.profile?.stats?.games_played || 0}</span>
            <span className={css.statLabel}>GAMES</span>
          </div>
          <div className={css.wins}>
            <span className={css.statValue}>{user?.profile?.stats?.wins || 0}</span>
            <span className={css.statLabel}>WINS</span>
          </div>
          <div className={css.loses}>
            <span className={css.statValue}>{user?.profile?.stats?.losses || 0}</span>
            <span className={css.statLabel}>LOSES</span>
          </div>
        </div>
        <div className={css.leftStats}>
          <div className={css.badge}>
            {/* <GiRank3 className={css.badge}/> */}
            <img src={user?.profile?.badge?.icon} alt="" className={css.badgeIcon}/>
            <span className={css.statLabel}>{user?.profile?.badge?.name}</span>
          </div>
          <div className={css.score}>
            <span className={css.statValue}>{user?.profile?.score || 0}</span>
            <span className={css.statLabel}>SCORE</span>
          </div>
          <div className={css.rank}>
            <span className={css.statValue}>{user?.profile?.rank || '?'}</span>
            <span className={css.statLabel}>RANK</span>
          </div>
          {/* <div className={css.more} onClick={() => setMore(!isMore)}>
            <IoMdMore className={css.moreIcon}/>
            {isMore &&
            <div className={css.showMore}>
            </div>} */}
          {/* </div> */}
        </div>
      </div>
    </div>
  )
}

export default UsersProfileHeader
