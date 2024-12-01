import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import css from './AllFriends.module.css';
import { MessageSquareText, UserPlus, Ban, Search } from 'lucide-react';
import { useGetData } from '../../api/apiHooks';
import NoFound from './NoFound';
import { apiBlockRequest } from '@/api/friendApi';
import { toast } from 'react-toastify';
import FriendSkeleton from './FriendSkeleton';

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

  const handleMessageClick = (friend: Friend) => {
    navigate('/chat', { state: { selectedFriend: friend } });
  };

  const blockRequest = async (username: string) => {
    try {
      await apiBlockRequest(username);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to accept friend request')
    }
  };

  return (
    <div className={css.allFriends}>
      <h1 className={css.title}>All Friends</h1>
      
      <div className={css.searchContainer}>
        <Search className={css.searchIcon} />
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
          <FriendSkeleton/>
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
                  className={`${css.actionButton} ${css.messageButton}`}
                  onClick={() => handleMessageClick(friend)}
                  title="Message"
                >
                  <MessageSquareText size={20} />
                </button>
                <button
                  className={`${css.actionButton} ${css.inviteButton}`}
                  title="Invite"
                >
                  <UserPlus size={20} />
                </button>
                <button
                  className={`${css.actionButton} ${css.blockButton}`}
                  onClick={() => blockRequest(friend.username)}
                  title="Block"
                >
                  <Ban size={20} />
                </button>
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