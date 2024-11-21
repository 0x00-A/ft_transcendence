import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import css from './AllFriends.module.css';
import { FaSearch } from 'react-icons/fa';
import { useGetData } from '../../api/apiHooks';
import Loading from './Loading';
import NoFound from './NoFound';
import { apiBlockRequest } from '@/api/friendApi';
import { toast } from 'react-toastify';



interface FriendProfile {
  avatar: string;
  is_online: boolean;
}

interface Friend {
  id: string;
  username: string;
  profile: FriendProfile;
}

const AllFriends: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const { data: friendsData, isLoading, error, refetch } = useGetData<Friend[]>('friends');

  const filteredFriends = friendsData
    ? friendsData.filter((friend) =>
        friend.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  console.log("friendsData: ", friendsData);

  const handleMessageClick = (friend: Friend) => {
    navigate('/chat', { state: { selectedFriend: friend } });
  };

  const blockRequest = async (username: string) => {
    try {
      const message = await apiBlockRequest(username);
      toast.success(message);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to accept friend request')
    }
  };

  return (
    <div className={css.allFriends}>
      <h1 className={css.title}>All Friends</h1>

      <div className={css.searchContainer}>
        <FaSearch className={css.searchIcon} />
        <input
          type="text"
          className={css.searchInput}
          placeholder="Search friends..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>


      <div className={css.friendList}>
        {isLoading ? (
          <Loading />
        ) : error ? (
          <p>Error loading friends</p>
        ) : filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => (
            <div key={friend.id} className={css.friendCard}>
              <img
                src={friend.profile.avatar}
                alt={friend.username}
                className={css.avatar}
              />
              <div className={css.userInfo}>
                <span className={css.username}>{friend.username}</span>
                {friend.profile.is_online ? (
                  <span className={css.Online}>Online</span>
                ) : (
                  <span className={css.Offline}>Offline</span>
                )}
              </div>
              <div className={css.actions}>
                <button
                  className={css.actionButton}
                  onClick={() => handleMessageClick(friend)}
                >
                  Message
                </button>
                <button className={css.actionButton}>Invite</button>
                <button className={css.actionButton}>View Profile</button>
                <button
                  className={css.actionButton}
                  onClick={() => blockRequest(friend.username)}
                >
                  Block</button>
              </div>
            </div>

          ))
        ) : (
          <NoFound />
        )}
      </div>
    </div>
  );
};

export default AllFriends;
